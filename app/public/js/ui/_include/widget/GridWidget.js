define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "dgrid/extensions/DnD",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/DijitRegistry",
    "dgrid/editor",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/query",
    "dojo/NodeList-traverse",
    "dojo/window",
    "dojo/topic",
    "dojo/on",
    "dojo/when",
    "dojo/has",
    "../../../model/meta/Model",
    "../../../locale/Dictionary",
    "../../data/input/Factory",
    "../../data/display/Renderer",
    "dojo/text!./template/GridWidget.html"
], function (
    declare,
    lang,
    _WidgetBase,
    _TemplatedMixin,
    OnDemandGrid,
    Selection,
    Keyboard,
    DnD,
    ColumnHider,
    ColumnResizer,
    DijitRegistry,
    editor,
    dom,
    domAttr,
    domConstruct,
    domStyle,
    domGeom,
    query,
    traverse,
    win,
    topic,
    on,
    when,
    has,
    Model,
    Dict,
    ControlFactory,
    Renderer,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {

        type: null,
        store: null,
        actions: [],
        enabledFeatures: [], // array of strings matching items in optionalFeatures
        canEdit: true,

        actionsByName: {},
        templateString: lang.replace(template, Dict.tplTranslate),
        gridWidget: null,

        defaultFeatures: [Selection, Keyboard, ColumnHider, ColumnResizer, DijitRegistry],
        optionalFeatures: {
          'DnD': DnD
        },

        dndBefore: true,

        constructor: function (params) {
            if (params && params.actions) {
                params.actionsByName = {};
                for (var i=0,count=params.actions.length; i<count; i++) {
                    var action = params.actions[i];
                    params.actionsByName[action.name] = action;
                }
            }
            declare.safeMixin(this, params);
        },

        postCreate: function () {
            this.inherited(arguments);

            ControlFactory.loadControlClasses(this.type).then(lang.hitch(this, function(controls) {

                this.gridWidget = this.buildGrid(controls);
                this.gridWidget.set("store", this.store);
                this.own(
                    on(window, "resize", lang.hitch(this, this.onResize)),
                    on(this.gridWidget, "click", lang.hitch(this, function(e) {
                        // process grid clicks
                        var links = query(e.target).closest("a");
                        if (links.length > 0) {
                          var actionName = domAttr.get(links[0], "data-action");
                          var action = this.actionsByName[actionName];
                          if (action) {
                              // cell action
                              e.preventDefault();

                              var columnNode = e.target.parentNode;
                              var row = this.gridWidget.row(columnNode);
                              action.execute(e, row.data);
                          }
                        }
                    })),
                    topic.subscribe("store-error", lang.hitch(this, function(error) {
                        topic.publish('ui/_include/widget/GridWidget/error', error);
                    })),
                    topic.subscribe("/dnd/drop/before", lang.hitch(this, function(source, nodes, copy) {
                        // capture correct value of "before" flag to be used in /dnd/drop handler
                        this.dndBefore = source.before;
                    })),
                    topic.subscribe("/dnd/drop", lang.hitch(this, function(source, nodes, copy, target) {
//                        var targetRow = target._targetAnchor;
//                        if (targetRow) {
//                            // drop on row
//                            var before = this.dndBefore;
//                            nodes.forEach(function(node) {
//                                domConstruct.place(node, targetRow, before ? "before" : "after");
//                            });
//                        }
//                        else {
//                            // drop on empty space after rows
//                            nodes.forEach(function(node) {
//                                domConstruct.place(node, node.parentNode, "last");
//                            });
//                        }
                    }))
                );
                this.onResize();
            }));
        },

        buildGrid: function (controls) {
            var columns = [{
                label: 'oid',
                field: 'oid',
                hidden: true,
                unhidable: true,
                sortable: true
            }];

            var typeClass = Model.getType(this.type);
            var displayValues = typeClass.displayValues;
            for (var i=0, count=displayValues.length; i<count; i++) {
                var curValue = displayValues[i];
                var curAttributeDef = typeClass.getAttribute(curValue);
                var controlClass = controls[curAttributeDef.inputType];
                columns.push(editor({
                    label: Dict.translate(curValue),
                    field: curValue,
                    editor: controlClass,
                    editorArgs: {
                        attribute: curAttributeDef,
                        style: 'height:20px; padding:0;',
                        isInlineEditor: true
                    },
                    editOn: "click",
                    canEdit: this.canEdit ? lang.hitch(curAttributeDef, function(obj, value) {
                        return typeClass.isEditable(curAttributeDef, obj);
                    }) : function(obj, value) {return false; },
                    autoSave: true,
                    sortable: true,
                    renderCell: lang.hitch(curAttributeDef, function(object, data, td, options) {
                        when(Renderer.render(data, this), function(value) {
                            td.innerHTML = value;
                        });
                    })
                }));
            }

            // add actions column
            if (this.actions.length > 0) {
                columns.push({
                    label: " ",
                    field: "actions-"+this.actions.length,
                    unhidable: true,
                    sortable: false,
                    resizable: false,
                    formatter: lang.hitch(this, function(data, obj) {
                        var html = '<div>';
                        for (var name in this.actionsByName) {
                            var action = this.actionsByName[name];
                            html += '<a class="btn-mini" href="#" data-action="'+name+'"><i class="'+action.iconClass+'"></i></a>';
                        }
                        html += '</div>';
                        return html;
                    })
                });
            }

            // select features
            var features = this.defaultFeatures;
            for (var idx in this.enabledFeatures) {
                var featureName = this.enabledFeatures[idx];
                if (this.optionalFeatures[featureName]) {
                    features.push(this.optionalFeatures[featureName]);
                }
            }

            // create widget
            var gridWidget = new (declare([OnDemandGrid].concat(features)))({
                getBeforePut: true,
                columns: columns,
                selectionMode: "extended",
                dndParams: {
                    checkAcceptance: lang.hitch(this, function(source, nodes) {
                        var row = this.gridWidget.row(nodes[0]);
                        if (!row) {
                            return false;
                        }
                        return this.isSameType(row.data);
                    })
                },
                //query: { find: 'xx' },
                //queryOptions: { sort: [{ attribute: 'title', descending: false }] },
                //sort: [{ attribute: 'title', descending: false }],
                loadingMessage: Dict.translate("Loading"),
                noDataMessage: Dict.translate("No data")
            }, this.gridNode);

            gridWidget.on("dgrid-error", function (evt) {
                topic.publish('ui/_include/widget/GridWidget/error', evt.error);
            });

            // click on title column header
            gridWidget.on(".dgrid-header .dgrid-column-title:click", lang.hitch(this, function (evt) {
                //console.dir(gridWidget.cell(evt))
            }));

            // click on title data cell
            gridWidget.on(".dgrid-row .dgrid-column-title:click", lang.hitch(this, function (evt) {
                //console.dir(gridWidget.row(evt));
            }));

            // row selected
            gridWidget.on("dgrid-select", lang.hitch(this, function (evt) {
                //console.dir(evt.gridWidget.selection);
            }));

            // row deselected
            gridWidget.on("dgrid-deselect", lang.hitch(this, function (evt) {
                //console.dir(evt.gridWidget.selection);
            }));

            gridWidget.on("dgrid-datachange", lang.hitch(this, function (evt) {
                //console.dir(evt);
            }));

            gridWidget.on("dgrid-refresh-complete", lang.hitch(this, function (evt) {
                gridWidget.resize();
            }));

            return gridWidget;
        },

        isSameType: function(data) {
            var oid = data.oid;
            var typeName = Model.getFullyQualifiedTypeName(Model.getTypeNameFromOid(oid));
            return this.store.typeName === typeName;
        },

        getSelectedOids: function() {
            var oids = [];
            for (var oid in this.gridWidget.selection) {
                if (this.gridWidget.selection[oid]) {
                    oids.push(oid);
                }
            }
            return oids;
        },

        refresh: function() {
            this.gridWidget.refresh({
                keepScrollPosition: true
            });
        },

        onResize: function() {
            // TODO: remove magic number
            var vs = win.getBox();

            // calculate height of dynamic navbar and footer
            var navbarHeight = 0;
            var footerHeight = 0;

            var navbar = query(".navbar");
            if (navbar.length > 0) {
              navbarHeight = domGeom.getMarginBox(navbar[0]).h;
            }
            var footer = dom.byId("footer");
            if (footer) {
              footerHeight = domGeom.getMarginBox(footer).h;
            }
            var h = this.height ? this.height : vs.h-navbarHeight-footerHeight-210;
            if (h >= 0) {
                domAttr.set(this.gridWidget.domNode, "style", {height: h+"px"});
            }
        }
    });
});