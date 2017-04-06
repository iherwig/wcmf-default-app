define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/aspect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "dgrid/extensions/DnD",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Editor",
    "dgrid/Selector",
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
    aspect,
    _WidgetBase,
    _TemplatedMixin,
    TooltipDialog,
    popup,
    OnDemandGrid,
    Selection,
    Keyboard,
    DnD,
    ColumnHider,
    ColumnResizer,
    DijitRegistry,
    Editor,
    Selector,
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
        columns: [], // array of attribute names or columns objects
        actions: [],
        enabledFeatures: [], // array of strings matching items in optionalFeatures
        canEdit: true,
        initialFilter: null,
        rowEnhancer: null,

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
            'Selector': Selector,
            'DnD': DnD,
            'Tree': Tree
        },

        dndInProgress: false,

        // too many filter calls make the rows disapear sometimes
        // so we define a minimal time span that has to be passed until the next filter is set
        lastFiltered: null,
        filterLifetime: 1000,

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

                this.grid = this.buildGrid(controls);
                this.grid.startup();
                this.own(
                    on(window, "resize", lang.hitch(this, this.onResize)),
                    on(this.grid, "click", lang.hitch(this, function(e) {
                        // close summary tooltip
                        if (this.summaryDialog) {
                            popup.close(this.summaryDialog);
                        }
                        // process grid clicks
                        var links = query(e.target).closest("a");
                        if (links.length > 0) {
                          var actionName = domAttr.get(links[0], "data-action");
                          var action = this.actionsByName[actionName];
                          if (action) {
                              // cell action
                              e.preventDefault();
                              // execute the action
                              var columnNode = e.target.parentNode;
                              var row = this.grid.row(columnNode);
                              action.entity = row.data;
                              action.execute();
                              // refresh the action cell, if the grid is still present
                              if (this.grid.collection) {
                                var cell = this.grid.cell(columnNode);
                                this.grid.refreshCell(cell);
                              }
                          }
                        }
                    })),
                    on(this.grid, "mouseover", lang.hitch(this, function(e) {
                        var row = this.grid.row(e.target.parentNode);
                        if (row) {
                            var column = this.grid.column(e.target);
                            var typeClass = Model.getType(this.type);
                            if (column && column.field === typeClass.displayValues[0]) {
                                if (typeof typeClass.getSummary === 'function') {
                                    when(typeClass.getSummary(row.data), lang.hitch(this, function(text) {
                                        if (text) {
                                            this.summaryDialog = new TooltipDialog({
                                                content: text,
                                                onMouseLeave: lang.hitch(this, function() {
                                                    popup.close(this.summaryDialog);
                                                })
                                            });
                                            popup.open({
                                                popup: this.summaryDialog,
                                                around: e.target.parentNode
                                            });
                                        }
                                    }));
                                }
                            }
                        }
                    })),
                    on(this.grid, "mouseout", lang.hitch(this, function(e) {
                        if (this.summaryDialog) {
                            popup.close(this.summaryDialog);
                        }
                    })),
                    topic.subscribe("store-datachange", lang.hitch(this, function(data) {
                        if (this.dndInProgress) {
                            topic.publish('ui/_include/widget/GridWidget/dnd-end', null);
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

        buildGrid: function (controls) {
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
            if (array.indexOf(featureNames, 'Selector') !== -1) {
                columns.push({
                    label: " ",
                    selector: "checkbox",
                    field: "selector",
                    unhidable: true,
                    sortable: true,
                    resizable: false
                });
            }
            var typeClass = Model.getType(this.type);
            var renderOptions = {};
            for (var i=0, count=this.columns.length; i<count; i++) {
                var columnDef = this.columns[i];
                if (typeof(columnDef) === "string") {
                    // attribute column
                    var curValue = columnDef;
                    var curAttributeDef = typeClass.getAttribute(curValue);
                    if (curAttributeDef !== null) {
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
                                return sameType && typeClass.isEditable(this, obj);
                            }) : function(obj, value) {
                                return false;
                            },
                            autoSave: true,
                            sortable: true,
                            hidden: typeClass.displayValues.indexOf(curValue) === -1,
                            renderCell: lang.hitch(curAttributeDef, function(object, data, td, options) {
                                when(Renderer.render(data, this, renderOptions), function(value) {
                                    td.innerHTML = value;
                                });
                            })
                        };
                        if (array.indexOf(featureNames, 'Tree') !== -1) {
                            column.renderExpando = true;
                        }
                        columns.push(column);
                    }
                }
                else {
                    // custom column
                    columns.push(columnDef);
                }
            }

            // add actions column
            if (this.actions.length > 0) {
                columns.push({
                    label: " ",
                    field: "actions-"+this.actions.length,
                    unhidable: true,
                    sortable: false,
                    resizable: false,
                    formatter: lang.hitch(this, function(data, entity) {
                        var html = '<div>';
                        for (var name in this.actionsByName) {
                            var action = this.actionsByName[name];
                            action.entity = entity;
                            var url = action.getUrl() || '#';
                            html += '<a class="btn-mini" href="'+url+'" data-action="'+name+'"><i class="'+action.getIconClass()+'"></i></a>';
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
                collection: this.store.filter(this.initialFilter),
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
                noDataMessage: Dict.translate("No data"),
                minRowsPerPage: 30,
                maxRowsPerPage: 30,
                bufferRows: 0,
                pagingDelay: 0,
                farOffRemoval: Infinity,
                pagingMethod: 'throttleDelayed'
            }, this.gridNode);

            if (typeof this.rowEnhancer === 'function') {
                aspect.after(grid, 'renderRow', lang.hitch(this, function(row, args) {
                    return this.rowEnhancer(row, args[0]);
                }));
            }

            grid.on("dgrid-editor-show", function(evt) {
                // set the entity property on the input control
                evt.editor.entity = evt.cell.row.data;
            });

            grid.on("dgrid-error", function(evt) {
                topic.publish('ui/_include/widget/GridWidget/error', evt.error);
            });

            grid.on("dgrid-refresh-complete", lang.hitch(this, function(evt) {
                topic.publish('ui/_include/widget/GridWidget/refresh-complete', evt.grid);
                grid.resize();
            }));

            grid.on("dgrid-columnstatechange", lang.hitch(this, function(evt) {
                var displayValues = columns.filter(function(column) {
                    return typeClass.getAttribute(column.field) && !grid.isColumnHidden(column.id);
                }).map(function(column) {
                    return column.field;
                });
                console.log(displayValues);
                this.refresh();
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
            // prevent too many filter calls
            var now = (new Date()).getTime();
            if (this.lastFiltered !== null && now-this.lastFiltered < this.filterLifetime) {
                return;
            }
            this.lastFiltered = now;

            this.gridFilter = filter;
            if (this.grid) {
                this.grid.set('collection', this.store.filter(this.gridFilter));
            }
        },

        onResize: function() {
            if (window.innerWidth > 640) {
                // TODO: remove magic number
                var vs = win.getBox();

                // calculate height of dynamic elements
                var navbarHeight = 0;
                var toolbarHeight = 0;
                var footerHeight = 0;

                var navbar = query(".navbar");
                if (navbar.length > 0) {
                  navbarHeight = domGeom.getMarginBox(navbar[0]).h;
                }
                var toolbar = query('[data-dojo-attach-point$=\"toolbarNode\"]');
                if (toolbar.length > 0) {
                  toolbarHeight = domGeom.getMarginBox(toolbar[0]).h;
                }
                var footer = dom.byId("footer");
                if (footer) {
                  footerHeight = domGeom.getMarginBox(footer).h;
                }
                var h = this.height ? this.height : vs.h-navbarHeight-toolbarHeight-footerHeight-210;
                if (h >= 0) {
                    domAttr.set(this.grid.domNode, "style", {height: h+"px"});
                }
            }
        }
    });
});