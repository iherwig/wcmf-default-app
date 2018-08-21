define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/topic",
    "dojo/Deferred",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "../../_include/_NotificationMixin",
    "../../_include/widget/GridWidget",
    "../../_include/widget/Button",
    "./ExportWidget",
    "./ImportWidget",
    "../../../action/CheckPermissions",
    "../../../model/meta/Model",
    "../../../persistence/RelationStore",
    "../../../action/Edit",
    "../../../action/Copy",
    "../../../action/Link",
    "../../../action/Unlink",
    "../../../action/Delete",
    "../../../action/CreateInRelation",
    "../../../action/Permissions",
    "../../../locale/Dictionary",
    "dojo/text!./template/EntityRelationWidget.html"
],
function(
    require,
    declare,
    lang,
    all,
    topic,
    Deferred,
    domClass,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _NotificationMixin,
    GridWidget,
    Button,
    Export,
    Import,
    CheckPermissions,
    Model,
    RelationStore,
    Edit,
    Copy,
    Link,
    Unlink,
    Delete,
    CreateInRelation,
    Permissions,
    Dict,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _NotificationMixin], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,

        route: '',
        entity: {},
        relation: {},
        type: null,
        typeClass: null,
        page: null,
        gridWidget: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            // labels
            var relationName = this.relation.name +
                    (parseInt(this.relation.maxMultiplicity) !== 1 ? " [Pl.]" : '');
            this.relationName = Dict.translate(relationName);

            this.type = Model.getFullyQualifiedTypeName(this.relation.type);
            this.typeClass = Model.getType(this.type);
        },

        postCreate: function() {
            this.inherited(arguments);

            var deferredList = [];

            // check permissions
            var oid = this.entity.get('oid');
            var requiredPermissions = [
                oid+'.'+this.relation.name+'??update',
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

                var enabledFeatures = [];
                if (this.relation.isSortable) {
                    enabledFeatures.push('DnD');
                }

                this.gridWidget = new GridWidget({
                    type: this.relation.type,
                    store: this.getGridStore(),
                    columns: Model.getType(this.type).getAttributes({exclude: ['DATATYPE_IGNORE']}).map(function(attribute) {
                        return attribute.name;
                    }),
                    actions: this.getGridActions(),
                    enabledFeatures: enabledFeatures,
                    autoHeight: true
                }, this.gridNode);
                this.gridWidget.startup();
                domClass.add(this.gridWidget.gridNode, "multiplicity-"+this.relation.maxMultiplicity);
                domClass.add(this.gridWidget.gridNode, "relation-"+this.relation.thisEndName+"-"+this.relation.name);
                this.setDefaultButtonStates();
            }));

            this.own(
                topic.subscribe('ui/_include/widget/GridWidget/dnd-start', lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "process",
                        message: Dict.translate("Saving data")
                    });
                })),
                topic.subscribe('ui/_include/widget/GridWidget/dnd-end', lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "ok",
                        message: Dict.translate("Finished"),
                        fadeOut: true
                    });
                })),
                topic.subscribe('ui/_include/widget/GridWidget/refresh-complete', lang.hitch(this, function(grid) {
                    if (this.gridWidget && grid == this.gridWidget.grid) {
                        if (this.gridWidget.grid && this.gridWidget.grid.get('total') >= this.relation.maxMultiplicity) {
                            this.createBtn.set("disabled", true);
                            this.linkBtn.set("disabled", true);
                        }
                        else {
                            this.setDefaultButtonStates();
                        }
                    }
                }))
            );
        },

        getGridActions: function() {
            var actions = [];

            var editAction = new Edit({
                page: this.page,
                route: this.route
            });
            actions.push(editAction);

            var oid = this.entity.get('oid');

            if (this.permissions[this.type+'??copy'] === true && this.permissions[oid+'.'+this.relation.name+'??update'] === true) {
                var copyAction = new Copy({
                    targetoid: this.entity.get('oid'),
                    init: lang.hitch(this, function() {
                        this.showNotification({
                            type: "process",
                            message: Dict.translate("Copying <em>%0%</em>", [this.typeClass.getDisplayValue(copyAction.entity)])
                        });
                    }),
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

            if (this.relation.aggregationKind === "composite") {
                if (this.permissions[this.type+'??delete'] === true && this.permissions[oid+'.'+this.relation.name+'??update'] === true) {
                    var deleteAction = new Delete({
                        callback: lang.hitch(this, function(response) {
                            // success
                            this.gridWidget.refresh();
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
            }
            else {
                if (this.permissions[oid+'.'+this.relation.name+'??update'] === true) {
                    var unlinkAction = new Unlink({
                        source: this.entity,
                        relation: this.relation,
                        callback: lang.hitch(this, function(response) {
                            // success
                            this.gridWidget.refresh();
                            this.showNotification({
                                type: "ok",
                                message: Dict.translate("<em>%0%</em> was successfully unlinked", [this.typeClass.getDisplayValue(response)]),
                                fadeOut: true
                            });
                        }),
                        errback: lang.hitch(this, function(error) {
                            // error
                            this.showBackendError(error);
                        })
                    });
                    actions.push(unlinkAction);
                }
            }

            if (this.permissions['??setPermissions'] === true) {
                var permissionsAction = new Permissions();
                actions.push(permissionsAction);
            }

            return actions;
        },

        getGridStore: function() {
            return RelationStore.getStore(this.entity.get('oid'), this.relation.name);
        },

        setBtnState: function(btnName, isEnabled) {
            var btn = this[btnName+"Btn"];
            if (btn) {
                btn.set("disabled", !isEnabled);
            }
        },


        setDefaultButtonStates: function() {
            var oid = this.entity.get('oid');
            var type = Model.getTypeFromOid(oid);

            this.setBtnState("create", this.relation.aggregationKind !== "none" && this.permissions[this.type+'??create'] === true &&
                this.permissions[oid+'.'+this.relation.name+'??update'] === true);
            this.setBtnState("link", this.relation.aggregationKind !== "composite" &&
                this.permissions[oid+'.'+this.relation.name+'??update'] === true);

            var canImport = this.relation.aggregationKind === "composite" && !type.isManyToManyRelation(this.relation.name) &&
                this.permissions[oid+'.'+this.relation.name+'??update'] === true && this.permissions[this.type+'??importCSV'] === true;
            if (!canImport) {
                domClass.add(this.importBtn.domNode, "hidden");
            }

            var canExport = this.permissions[this.type+'??exportCSV'] === true;
            if (!canExport) {
                domClass.add(this.exportBtn.domNode, "hidden");
            }
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
            var gridFilter = this.gridWidget ? this.gridWidget.getFilter() : undefined;
            var query = gridFilter ? this.getGridStore()._renderFilterParams(gridFilter)[0] : null;
            var oid = this.entity.get('oid');

            new Export({
                type: Model.getTypeNameFromOid(oid),
                query: query,
                parentId: Model.getIdFromOid(oid),
                relation: this.relation.name
            }).execute();
        },

        _create: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            new CreateInRelation({
                page: this.page,
                route: this.route,
                source: this.entity,
                relation: this.relation,
                init: lang.hitch(this, function() {
                    this.hideNotification();
                })
            }).execute();
        },

        _link: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            new Link({
                source: this.entity,
                relation: this.relation,
                init: lang.hitch(this, function() {
                    this.hideNotification();
                }),
                beforeCallback: lang.hitch(this, function(oids) {
                    this.showNotification({
                        type: "process",
                        message: Dict.translate("Linking objects")
                    });
                })
            }).execute().then(lang.hitch(this, function(response) {
                var message = Dict.translate("Objects were successfully linked");
                this.showNotification({
                    type: "ok",
                    message: message,
                    fadeOut: true
                });
                // success
                this.gridWidget.refresh();
            }), lang.hitch(this, function(error) {
                // error
                this.showBackendError(error);
                this.gridWidget.refresh();
            }));
        }
    });
});