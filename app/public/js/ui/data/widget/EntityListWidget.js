define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/topic",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "../../_include/_NotificationMixin",
    "../../_include/widget/GridWidget",
    "../../_include/widget/Button",
    "../../../action/CheckPermissions",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../action/ExportCSV",
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
    all,
    topic,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Notification,
    GridWidget,
    Button,
    CheckPermissions,
    Model,
    Store,
    ExportCSV,
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
                '??setPermissions'
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

                this.createBtn.set("disabled", this.permissions[this.type+'??create'] !== true);

                // notify listeners
                topic.publish("entity-list-widget-created", this);
            }));

            this.own(
                topic.subscribe("store-error", lang.hitch(this, function(error) {
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
                })),
                topic.subscribe("ui/_include/widget/GridWidget/refresh-complete", lang.hitch(this, function(grid) {
                    this.statusNode.innerHTML = Dict.translate("%0% item(s)", [grid._total]);
                }))
            );
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

            if (this.permissions[this.type+'??copy'] === true) {
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
                        this.showNotification({
                            type: "ok",
                            message: Dict.translate("<em>%0%</em> was successfully copied", [this.typeClass.getDisplayValue(response)]),
                            fadeOut: true
                        });
                        this.gridWidget.refresh();
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
            return typeClass.displayValues;
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
            // check if the type might have parents of the same type,
            // and set the filter to retrieve only root nodes, if yes
            var filter = {};
            var simpleType = Model.getSimpleTypeName(this.type);
            var relations = this.typeClass.getRelations('parent');
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                if (relation.type === simpleType) {
                    filter[this.type+'.'+relation.fkName] = null;
                }
            }
            return filter;
        },

        getGridStore: function() {
            var store = Store.getStore(this.type, appConfig.defaultLanguage);
            return store.filter(this.getGridFilter());
        },

        _export: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            this.exportBtn.setProcessing();
            new ExportCSV({
                type: this.type,
                filter: this.getGridStore()._renderFilterParams(this.getGridFilter())[0]
            }).execute().then(
                lang.hitch(this, function() {
                    this.exportBtn.reset();
                }),
                lang.hitch(this, function(error) {
                    this.showBackendError(error);
                    this.exportBtn.reset();
                })
            );
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