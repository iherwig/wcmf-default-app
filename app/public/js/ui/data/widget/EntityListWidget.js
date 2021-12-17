define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/promise/all",
    "dojo/on",
    "dojo/topic",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/query",
    "dojo/window",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "../../_include/_NotificationMixin",
    "../../_include/widget/GridWidget",
    "../../_include/widget/Button",
    "../../_include/widget/PopupDlgWidget",
    "../../_include/widget/ConfirmDlgWidget",
    "./ExportWidget",
    "./ImportWidget",
    "../../../action/CheckPermissions",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../action/Create",
    "../../../action/Edit",
    "../../../action/Copy",
    "../../../action/Delete",
    "../../../action/Permissions",
    "../../../locale/Dictionary",
    "dojo/text!./template/EntityListWidget.html"
],
function(
    require,
    declare,
    lang,
    config,
    all,
    on,
    topic,
    dom,
    domClass,
    domGeom,
    query,
    win,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Notification,
    GridWidget,
    Button,
    PopupDlg,
    ConfirmDlg,
    Export,
    Import,
    CheckPermissions,
    Model,
    Store,
    Create,
    Edit,
    Copy,
    Delete,
    Permissions,
    Dict,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,

        type: null,
        typeClass: null,
        hasTree: false,
        page: null,
        route: '',

        permissions: {},

        gridWidget: null,

        constructor: function(args) {
            // use fully qualified type name from now on
            args.type = Model.getFullyQualifiedTypeName(args.type);
            declare.safeMixin(this, args);

            // labels
            var simpleType = Model.getSimpleTypeName(this.type);
            this.typeName = Dict.translate(simpleType);
            this.headline = Dict.translate(simpleType+" [Pl.]");

            this.typeClass = Model.getType(this.type);
        },

        postCreate: function() {
            this.inherited(arguments);

            var deferredList = [];

            // check permissions
            var requiredPermissions = [
                this.type+'??create',
                this.type+'??copy',
                this.type+'??delete',
                '??setPermissions',
                this.type+'??exportCSV',
                this.type+'??importCSV'
            ];
            deferredList.push(new CheckPermissions({
                operations: requiredPermissions
            }).execute());

            all(deferredList).then(lang.hitch(this, function(results) {
                this.permissions = results[0].result ? results[0].result : {};

                // setup grid
                this.gridWidget = new GridWidget({
                    type: this.type,
                    store: this.getGridStore(),
                    columns: this.getGridColumns(),
                    actions: this.getGridActions(),
                    initialFilter: this.getGridFilter(),
                    enabledFeatures: this.getGridFeatures(),
                    rowEnhancer: this.getRowEnhancer()
                }, this.gridNode);
                this.gridWidget.startup();
                domClass.add(this.gridWidget.gridNode, "type-"+Model.getSimpleTypeName(this.type).toLowerCase());

                this.createBtn.set("disabled", this.permissions[this.type+'??create'] !== true);
                if (this.permissions[this.type+'??importCSV'] !== true) {
                    domClass.add(this.importBtn.domNode, "hidden");
                }
                if (this.permissions[this.type+'??exportCSV'] !== true) {
                    domClass.add(this.exportBtn.domNode, "hidden");
                }
                this.onResize();

                // notify listeners
                topic.publish("entity-list-widget-created", this);
            }));

            this.own(
                on(window, "resize", lang.hitch(this, this.onResize)),
                topic.subscribe("store-error", lang.hitch(this, function(error) {
                    this.showBackendError(error);
                })),
                topic.subscribe("ui/_include/widget/GridWidget/error", lang.hitch(this, function(error) {
                    this.showBackendError(error);
                })),
                topic.subscribe("ui/_include/widget/GridWidget/dnd-start", lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "process",
                        message: Dict.translate("Saving data")
                    });
                })),
                topic.subscribe("ui/_include/widget/GridWidget/dnd-end", lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "ok",
                        message: Dict.translate("Finished"),
                        fadeOut: true
                    });
                }))
            );
        },

        onResize: function() {

            // calculate height of dynamic elements
            var containerHeight = 0;
            var tabNavHeight = 0;
            var titleHeight = 0;
            var filterHeight = 0;
            var numObjHeight = 0;
            var btnsHeight = 0;
            var height = this.height;
            var gridWidget = this.gridWidget;

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
            var container = query("#wrap");
            if (container.length > 0) {
              containerHeight = domGeom.getContentBox(container[0]).h;
            }
            setTimeout(function() {
              var tabNav = query(".dijitTabContainerTop-tabs");
              if (tabNav.length > 0) {
                tabNavHeight = domGeom.getMarginBox(tabNav[0]).h;
              }
              var title = query(".dijitTabContainerTopChildWrapper > div > div > div:first-child");
              if (title.length > 0) {
                titleHeight = domGeom.getMarginBox(title[0]).h;
              }
              var filter = query(".dijitTabContainerTopChildWrapper > div > div > div:nth-child(2)");
              if (filter.length > 0) {
                filterHeight = domGeom.getMarginBox(filter[0]).h;
              }
              var numObj = query(".dijitTabContainerTopChildWrapper > div > div > div:nth-child(3) .btn-toolbar");
              if (numObj.length > 0) {
                var paddingExtends = domGeom.getPadExtents(numObj[0]);
                numObjHeight = domGeom.getMarginBox(numObj[0]).h + paddingExtends.t + paddingExtends.b;
              }
              var btns = query(".dijitTabContainerTopChildWrapper > div > div > .btn-toolbar");
              if (btns.length > 0) {
                btnsHeight = domGeom.getMarginBox(btns[0]).h;
              }
              var h = height ? height : containerHeight-tabNavHeight-titleHeight-filterHeight-numObjHeight-btnsHeight;
              if (h >= 0) {
                  gridWidget.setHeight(h);
              }
            }, 200);
        },

        getGridFeatures: function() {
            var enabledFeatures = [];
            if (this.hasTree) {
                enabledFeatures.push('Tree');
            }
            if (this.typeClass.isSortable) {
                enabledFeatures.push('DnD');
            }
            return enabledFeatures;
        },

        getGridActions: function() {
            var actions = [];

            var editAction = new Edit({
                page: this.page,
                route: this.route
            });
            actions.push(editAction);

            if (this.permissions[this.type+'??copy'] === true && this.permissions[this.type+'??create'] === true) {
                var copyAction = new Copy({
                    targetOid: null,
                    init: lang.hitch(this, lang.partial(function() {
                        this.showNotification({
                            type: "process",
                            message: Dict.translate("Copying <em>%0%</em>", [this.typeClass.getDisplayValue(copyAction.entity)])
                        });
                    }, copyAction)),
                    callback: lang.hitch(this, function(response) {
                        // success
                        this.gridWidget.refresh();
                        this.showNotification({
                            type: "ok",
                            message: Dict.translate("<em>%0%</em> was successfully copied", [this.typeClass.getDisplayValue(response)]),
                            fadeOut: true
                        });
                    }),
                    errback: lang.hitch(this, function(error) {
                        // error
                        this.showBackendError(error);
                    })
                });
                actions.push(copyAction);
            }

            if (this.permissions[this.type+'??delete'] === true) {
                var deleteAction = new Delete({
                    init: lang.hitch(this, function() {
                        this.hideNotification();
                    }),
                    callback: lang.hitch(this, function(response) {
                        // success
                        this.showNotification({
                            type: "ok",
                            message: Dict.translate("<em>%0%</em> was successfully deleted", [this.typeClass.getDisplayValue(response)]),
                            fadeOut: true
                        });
                    }),
                    errback: lang.hitch(this, function(error) {
                        // error
                        this.showBackendError(error);
                    })
                });
                actions.push(deleteAction);
            }

            if (this.permissions['??setPermissions'] === true) {
                var permissionsAction = new Permissions();
                actions.push(permissionsAction);
            }

            return actions;
        },

        getGridColumns: function() {
            var typeClass = Model.getType(this.type);
            var columns = typeClass.getAttributes({exclude: ['DATATYPE_IGNORE']}).map(function(attribute) {
                return attribute.name;
            });
            return columns;
        },

        /**
         * Get a function to be used to enhance row instances
         * The function will get the row object and the row data passed
         * as arguments and must return the row.
         * @returns Function or null
         */
        getRowEnhancer: function() {
            return null;
        },

        getGridFilter: function() {
            var store = Store.getStore(this.type, config.app.defaultLanguage);
            var gridFilter = this.gridWidget ? this.gridWidget.getFilter() : undefined;

            // check if the type might have parents of the same type,
            // and set the filter to retrieve only root nodes, if yes
            var simpleType = Model.getSimpleTypeName(this.type);
            var relations = this.typeClass.getRelations('parent');
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                if (relation.type === simpleType) {
                    var filter = new store.Filter().eq(simpleType+'.'+relation.fkName, null);
                    if (gridFilter) {
                        gridFilter = store.Filter().and(gridFilter, filter);
                    }
                    else {
                        gridFilter = filter;
                    }
                }
            }
            return gridFilter;
        },

        getGridStore: function() {
            var store = Store.getStore(this.type, config.app.defaultLanguage);
            var filter = this.getGridFilter();
            return filter ? store.filter(filter) : store;
        },

        _import: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            new Import({
                type: this.type
            }).execute().then(
                lang.hitch(this, function(result) {
                    this.gridWidget.refresh();
                    this.importBtn.reset();
                }),
                lang.hitch(this, function(error) {
                    this.showBackendError(error);
                    this.importBtn.reset();
                }),
                lang.hitch(this, function(status) {
                    this.importBtn.setProcessing();
                    var progress = status.stepNumber/status.numberOfSteps;
                    this.importBtn.setProgress(progress);
                })
            );
        },

        _export: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            // get filter query
            var gridFilter = this.getGridFilter();
            var query = gridFilter ? this.getGridStore()._renderFilterParams(gridFilter)[0] : null;

            new Export({
                type: this.type,
                query: query
            }).execute();
        },

        _create: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            new Create({
                page: this.page,
                route: this.route,
                type: this.type
            }).execute();
        }
    });
});