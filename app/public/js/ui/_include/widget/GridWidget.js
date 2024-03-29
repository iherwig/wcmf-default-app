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
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/query",
    "dojo/topic",
    "dojo/on",
    "dojo/when",
    "../../../model/meta/Model",
    "../../../locale/Dictionary",
    "../../data/input/Factory",
    "../../data/display/Renderer",
    "../../data/filter/widget/TextBox",
    "../../data/filter/widget/SelectBox",
    "../../../User",
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
    domAttr,
    domClass,
    domConstruct,
    domGeom,
    query,
    topic,
    on,
    when,
    Model,
    Dict,
    ControlFactory,
    Renderer,
    FilterTextBox,
    FilterSelectBox,
    User,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {

        type: null,
        store: null,
        columns: [], // array of attribute names or columns objects
        actions: [],
        enabledFeatures: [], // array of strings matching items in optionalFeatures
        canEdit: true,
        initialFilter: {},
        currentFilter: null,
        rowEnhancer: null,

        actionsByName: {},
        templateString: lang.replace(template, Dict.tplTranslate),
        grid: null,
        filters: [],

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
            'Tree': Tree,
            // not a dgrid feature
            'NavigateOnRowClick': 'NavigateOnRowClick'
        },

        authoHeight: false,
        maxAutoHeightRows: 10,

        dndInProgress: false,
        height: null,

        lastEditorShowEvt: null,

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

            ControlFactory.loadControlClasses(this.type, null, this.getEditorControl).then(lang.hitch(this, function(controls) {
                this.currentFilter = this.initialFilter;
                this.grid = this.buildGrid(controls);
                this.grid.startup();
                if (this.height !== null) {
                  this.setHeight(this.height);
                }
                this.own(
                    on(this.grid, "click", lang.hitch(this, function(e) {
                        // close summary tooltip
                        if (this.summaryDialog) {
                            popup.close(this.summaryDialog);
                        }
                        // process action clicks
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
                        // process other row clicks
                        setTimeout(lang.hitch(this, function() {
                            var cell = this.grid.cell(e);
                            if (this.enabledFeatures.indexOf('NavigateOnRowClick') !== -1) {
                                // navigate to object (edit action)
                                if (cell && cell.element && cell.element.className.indexOf('field-actions') === -1) {
                                    // if cell doesn't contain action buttons, go to object's url
                                    var action = this.actionsByName['edit'];
                                    var row = this.grid.row(e.target.parentNode);
                                    action.entity = row.data;
                                    if (action) {
                                        action.execute();
                                    }
                                }
                            }
                        }), 300);
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
                        // detect, if drop is relevant (see sitepen/dgrid/extensions/DnD.js)
                        var anchor = source._targetAnchor;
                        var targetRow = anchor ? target.before ? anchor.previousSibling : anchor.nextSibling : null;
                        var nodeRow = this.grid.row(nodes[0]);
                        if (!copy && (targetRow === nodes[0])) {
                            return;
                        }
                        this.dndInProgress = true;
                        topic.publish('ui/_include/widget/GridWidget/dnd-start', null);
                    })),
                    topic.subscribe("entity-filterchange", lang.hitch(this, function(data) {
                        this.filter(this.getFilter());
                    }))
                );
            }));
        },

        buildGrid: function (controls) {
            var simpleType = Model.getSimpleTypeName(this.type);

            // select features
            // NOTE features array must only contain dgrid extensions
            var features = [];
            var featureNames = [];
            for (var idx in this.defaultFeatures) {
                featureNames.push(idx);
                var feature = this.defaultFeatures[idx];
                if (typeof feature !== 'string') {
                    features.push(this.defaultFeatures[idx]);
                }
            }
            for (var idx in this.enabledFeatures) {
                var featureName = this.enabledFeatures[idx];
                if (this.optionalFeatures[featureName]) {
                    featureNames.push(featureName);
                    var feature = this.optionalFeatures[featureName];
                    if (typeof feature !== 'string') {
                        features.push(this.optionalFeatures[featureName]);
                    }
                }
            }

            // get display columns from user config
            var typeClass = Model.getType(this.type);
            var gridConfig = User.getConfig('grid') || {};
            var displayColumns = gridConfig[this.type] ?
                gridConfig[this.type]['columns'] : typeClass.displayValues;
            if (this.store.setExtraParam instanceof Function) {
                this.store.setExtraParam('values', displayColumns.join(','));
            }

            // create columns
            var columns = [];
            this.filters = [];
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
            var renderOptions = {};
            for (var i=0, count=this.columns.length; i<count; i++) {
                var columnDef = this.columns[i];
                if (typeof(columnDef) === "string") {
                    // attribute column
                    var curValue = columnDef;
                    var curAttributeDef = typeClass.getAttribute(curValue);
                    if (curAttributeDef !== null) {
                        var controlArgs = {
                            name: curAttributeDef.name,
                            helpText: Dict.translate(curAttributeDef.description),
                            inputType: curAttributeDef.inputType,
                            entity: null, // will be set in dgrid-editor-show event
                            isInlineEditor: true
                        };
                        var columnDef = {
                            label: Dict.translate(curValue),
                            field: curValue,
                            editor: controls[this.getEditorControl(curAttributeDef.inputType)],
                            editorArgs: controlArgs,
                            editOn: "dblclick",
                            canEdit: this.canEdit ? lang.partial(lang.hitch(this, function(attr, obj, value) {
                                // only allow to edit editable objects of grid's own type
                                var sameType = this.isSameType(obj);
                                return sameType && typeClass.isEditable(attr, obj);
                            }), curAttributeDef) : function(obj, value) {
                                return false;
                            },
                            autoSave: true,
                            sortable: true,
                            hidden: displayColumns.indexOf(curValue) === -1,
                            renderCell: lang.hitch(curAttributeDef, function(object, data, td, options) {
                                var context = { 'data': object, 'place': 'list' };
                                when(Renderer.render(data, this, renderOptions, context), function(value) {
                                    td.innerHTML = value;
                                });
                            }),
                            filter: this.getFilterControl(curAttributeDef.inputType),
                            filterArgs: lang.clone(controlArgs)
                        };
                        if (array.indexOf(featureNames, 'Tree') !== -1) {
                            columnDef.renderExpando = true;
                        }
                    }
                }

                // add column filter
                if (columnDef.filter) {
                    var filterArgs = lang.mixin(columnDef.filterArgs, {
                        type: simpleType,
                        attribute: columnDef.field,
                        filterCtr: this.store.Filter
                    });
                    var filter = new (columnDef.filter)(filterArgs);
                    this.own(
                        on(filter, "click", function(e) {
                            e.stopPropagation();
                        })
                    );
                    this.filters.push(filter);

                    columnDef['renderHeaderCell'] = lang.hitch(this, lang.partial(function(columnDef, filter, node) {
                        if ('label' in columnDef || columnDef.field) {
                            var text = 'label' in columnDef ? columnDef.label : columnDef.field;
                            domConstruct.place('<div>'+text+'</div>', node, 'first');
                        }
                        var filterNode = domConstruct.place('<div class="header-filter hidden"></div>', node);
                        domConstruct.place(filter.domNode, filterNode);
                        return filterNode;
                    }, columnDef, filter));
                }

                columns.push(columnDef);
            }

            // add actions column
            if (this.actions.length > 0 || this.filters.length > 0) {
                var columnDef = {
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
                        return { html: html };
                    })
                };

                if (this.filters.length > 0) {
                    columnDef['renderHeaderCell'] = lang.hitch(this, function(node) {
                        var html = '<a class="btn-mini"><i class="fa fa-filter"></i></a>';
                        var filterBtn = domConstruct.place(html, node, 'first');
                        this.own(
                            on(filterBtn, "click", lang.hitch(this, function(e) {
                                query(".header-filter", this.domNode).toggleClass("hidden");
                                this.grid.resize();
                                e.stopPropagation();
                            }))
                        );
                        return filterBtn;
                    });
                }

                columns.push(columnDef);
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

                // fix empty cell, when editor was closed
                if (this.lastEditorShowEvt) {
                    var lastEvt = this.lastEditorShowEvt;
                    var object = lastEvt.cell.row.data;
                    var data = lastEvt.cell.row.data[lastEvt.column.field];
                    var attribute = lastEvt.column.editorArgs;
                    var element = lastEvt.cell.element;
                    var context = { 'data': object, 'place': 'list' };
                    when(Renderer.render(data, attribute, {}, context), function(value) {
                        element.innerHTML = value;
                    });
                }
                this.lastEditorShowEvt = evt;
            });
            grid.on("dgrid-editor-hide", function(evt) {
                this.lastEditorShowEvt = null;
            });

            grid.on("dgrid-error", function(evt) {
                topic.publish('ui/_include/widget/GridWidget/error', evt.error);
            });

            grid.on("dgrid-refresh-complete", lang.hitch(this, function(evt) {
                if (this.gridStatus) {
                    this.gridStatus.innerHTML = Dict.translate("%0% item(s)", [grid.get('total')]);
                }
                grid.resize();
                this.resize();
                topic.publish('ui/_include/widget/GridWidget/refresh-complete', evt.grid);
            }));

            grid.on("dgrid-columnstatechange", lang.hitch(this, function(evt) {
                // get display columns
                var displayColumns = columns.filter(function(column) {
                    return typeClass.getAttribute(column.field) && !grid.isColumnHidden(column.id);
                }).map(function(column) {
                    return column.field;
                });
                // store display values
                var gridConfig = User.getConfig('grid') || {};
                if (!gridConfig[this.type]) {
                    gridConfig[this.type] = {};
                }
                gridConfig[this.type]['columns'] = displayColumns;
                User.setConfig('grid', gridConfig);
                // update grid content
                if (this.store.setExtraParam instanceof Function) {
                    this.store.setExtraParam('values', displayColumns.join(','));
                }
                this.refresh();
            }));

            return grid;
        },

        /**
         * Get the editor control name for an input type
         * @param inputType
         * @returns String
         */
        getEditorControl: function(inputType) {
            if (inputType) {
                var baseType = inputType.match(/^[^:]+/)[0];
                switch(baseType) {
                    case 'ckeditor':
                        return 'textarea';
                }
                return inputType;
            }
            return null;
        },

        /**
         * Get the filter control for an input type
         * @param inputType
         * @returns String
         */
        getFilterControl: function(inputType) {
            if (inputType) {
                var baseType = inputType.match(/^[^:]+/)[0];
                switch(baseType) {
                    case 'radio':
                    case 'checkbox':
                    case 'select':
                    case 'multiselect':
                        return FilterSelectBox;
                    case 'date':
                        return FilterTextBox;
                }
            }
            return FilterTextBox;
        },

        /**
         * Get the current grid filter
         * @returns Filter
         */
        getFilter: function() {
            var mainFilter = this.initialFilter && Object.keys(this.initialFilter).length > 0 ? this.initialFilter : undefined;
            for (var i=0, count=this.filters.length; i<count; i++) {
                var filterCtrl = this.filters[i];
                var filter = filterCtrl.getFilter();
                if (filter) {
                    if (mainFilter) {
                        mainFilter = this.store.Filter().and(mainFilter, filter);
                    }
                    else {
                        mainFilter = filter;
                    }
                }
            }
            return mainFilter;
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
            if (this.grid && (JSON.stringify(filter) != JSON.stringify(this.currentFilter))) {
              this.currentFilter = filter;
              this.grid.set('collection', this.store.filter(this.currentFilter));
            }
        },

        setHeight: function(height) {
            if (this.grid) {
                // set directly, if already created
                domAttr.set(this.grid.domNode, "style", {height: height+"px"});
            }
            else {
                // set later
                this.height = height;
            }
        },

        getHeight: function(numRows) {
            var headerHeight = 0;
            var rowHeight = 0;

            var header = query(".dgrid-header", this.grid.domNode);
            if (header.length > 0) {
                headerHeight = domGeom.getMarginBox(header[0]).h;
            }
            var row = query(".dgrid-row", this.grid.domNode);
            if (row.length > 0) {
                rowHeight = domGeom.getMarginBox(row[0]).h;
            }
            return headerHeight + numRows*rowHeight;
        },

        resize: function() {
            if (this.autoHeight) {
                var numRows = this.grid.get('total');
                if (numRows == 0) {
                    // empty display
                    this.setHeight(0);
                }
                else if (this.maxAutoHeightRows > numRows) {
                    // display all rows
                    domClass.add(this.grid.domNode, 'dgrid-autoheight');
                    var height = this.getHeight(numRows);
                    this.setHeight(height);
                }
                else {
                    // display only maxAutoHeightRows
                    domClass.remove(this.grid.domNode, 'dgrid-autoheight');
                    var height = this.getHeight(this.maxAutoHeightRows);
                    this.setHeight(height);
                }
            }
        }
    });
});