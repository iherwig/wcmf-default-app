define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "dgrid/extensions/DnD",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Editor",
    "dgrid/Tree",
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
    array,
    _WidgetBase,
    _TemplatedMixin,
    OnDemandGrid,
    Selection,
    Keyboard,
    DnD,
    ColumnHider,
    ColumnResizer,
    DijitRegistry,
    Editor,
    Tree,
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
        grid: null,
        gridFilter: {},

        defaultFeatures: {
            'Selection': Selection,
            'Keyboard': Keyboard,
            'ColumnHider': ColumnHider,
            'ColumnResizer': ColumnResizer,
            'DijitRegistry': DijitRegistry
        },
        optionalFeatures: {
            'DnD': DnD,
            'Tree': Tree
        },

        dndInProgress: false,

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

                this.grid = this.buildGrid(controls, this.store);
                this.grid.startup();
                this.own(
                    on(window, "resize", lang.hitch(this, this.onResize)),
                    on(this.grid, "click", lang.hitch(this, function(e) {
                        // process grid clicks
                        var links = query(e.target).closest("a");
                        if (links.length > 0) {
                          var actionName = domAttr.get(links[0], "data-action");
                          var action = this.actionsByName[actionName];
                          if (action) {
                              // cell action
                              e.preventDefault();

                              var columnNode = e.target.parentNode;
                              var row = this.grid.row(columnNode);
                              action.entity = row.data;
                              action.execute();
                          }
                        }
                    })),
                    topic.subscribe("store-error", lang.hitch(this, function(error) {
                        topic.publish('ui/_include/widget/GridWidget/error', error);
                    })),
                    topic.subscribe("store-datachange", lang.hitch(this, function(error) {
                        if (this.dndInProgress) {
                          topic.publish('ui/_include/widget/GridWidget/dnd-end', null);
                          // filter must be applied again, otherwise dragged row is missing
                          this.filter(this.gridFilter);
                          this.dndInProgress = false;
                        }
                    })),
                    topic.subscribe("/dnd/drop", lang.hitch(this, function(source, nodes, copy, target) {
                        this.dndInProgress = true;
                        topic.publish('ui/_include/widget/GridWidget/dnd-start', null);
                    }))
                );
                this.onResize();
            }));
        },

        buildGrid: function (controls, store) {
            var _this = this;

            // select features
            var features = [];
            var featureNames = [];
            for (var idx in this.defaultFeatures) {
                featureNames.push(idx);
                features.push(this.defaultFeatures[idx]);
            }
            for (var idx in this.enabledFeatures) {
                var featureName = this.enabledFeatures[idx];
                if (this.optionalFeatures[featureName]) {
                    featureNames.push(featureName);
                    features.push(this.optionalFeatures[featureName]);
                }
            }

            // create columns
            var columns = [];
            var typeClass = Model.getType(this.type);
            var displayValues = typeClass.displayValues;
            for (var i=0, count=displayValues.length; i<count; i++) {
                var curValue = displayValues[i];
                var curAttributeDef = typeClass.getAttribute(curValue);
                var controlClass = controls[curAttributeDef.inputType];
                var column = {
                    label: Dict.translate(curValue),
                    field: curValue,
                    editor: controlClass,
                    editorArgs: {
                        name: curAttributeDef.name,
                        helpText: Dict.translate(curAttributeDef.description),
                        inputType: curAttributeDef.inputType,
                        entity: null, // will be set in dgrid-editor-show event
                        style: 'height:20px; padding:0;',
                        isInlineEditor: true
                    },
                    editOn: "dblclick",
                    canEdit: this.canEdit ? lang.hitch(curAttributeDef, function(obj, value) {
                        // only allow to edit editable objects of grid's own type
                        var sameType = _this.isSameType(obj);
                        return sameType && typeClass.isEditable(curAttributeDef, obj);
                    }) : function(obj, value) {
                        return false;
                    },
                    autoSave: true,
                    sortable: true,
                    renderCell: lang.hitch(curAttributeDef, function(object, data, td, options) {
                        when(Renderer.render(data, this), function(value) {
                            td.innerHTML = value;
                        });
                    })
                };
                if (array.indexOf(featureNames, 'Tree') !== -1) {
                    column.renderExpando = true;
                }
                columns.push(column);
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

            // create widget
            var grid = new (declare([OnDemandGrid, Editor].concat(features)))({
                getBeforePut: true,
                columns: columns,
                collection: store,
                selectionMode: "extended",
                dndParams: {
                    checkAcceptance: lang.hitch(this, function(source, nodes) {
                        var row = this.grid.row(nodes[0]);
                        if (!row) {
                            return false;
                        }
                        return this.isSameType(row.data);
                    })
                },
                loadingMessage: Dict.translate("Loading"),
                noDataMessage: Dict.translate("No data")
            }, this.gridNode);

            grid.on("dgrid-editor-show", function(evt) {
                // set the entity property on the input control
                evt.editor.entity = evt.cell.row.data;
            })

            grid.on("dgrid-error", function(evt) {
                topic.publish('ui/_include/widget/GridWidget/error', evt.error);
            });

            grid.on("dgrid-refresh-complete", lang.hitch(this, function(evt) {
                grid.resize();
            }));

            return grid;
        },

        isSameType: function(entity) {
            var oid = entity.get('oid');
            var typeName = Model.getFullyQualifiedTypeName(Model.getTypeNameFromOid(oid));
            return this.store.typeName === typeName;
        },

        getSelectedOids: function() {
            var oids = [];
            for (var id in this.grid.selection) {
                if (this.grid.selection[id]) {
                    var row = this.grid.row(id);
                    oids.push(row.data.get('oid'));
                }
            }
            return oids;
        },

        refresh: function() {
            this.grid.refresh({
                keepScrollPosition: true
            });
        },

        filter: function(filter) {
            this.gridFilter = filter;
            this.grid.set('collection', this.store.filter(this.gridFilter));
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
                domAttr.set(this.grid.domNode, "style", {height: h+"px"});
            }
        }
    });
});