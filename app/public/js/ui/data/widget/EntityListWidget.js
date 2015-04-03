define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "../../_include/_NotificationMixin",
    "../../_include/widget/GridWidget",
    "../../_include/widget/Button",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../action/Create",
    "../../../action/Edit",
    "../../../action/Copy",
    "../../../action/Delete",
    "../../../locale/Dictionary",
    "dojo/text!./template/EntityListWidget.html"
],
function(
    require,
    declare,
    lang,
    topic,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Notification,
    GridWidget,
    Button,
    Model,
    Store,
    Create,
    Edit,
    Copy,
    Delete,
    Dict,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,

        type: null,
        typeClass: null,
        hasTree: true,
        page: null,
        route: '',
        onCreated: null, // function to be called after the widget is created
        gridWidget: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.typeName = Dict.translate(this.type);
            this.headline = this.typeName;
            this.typeClass = Model.getType(this.type);
        },

        postCreate: function() {
            this.inherited(arguments);

            var enabledFeatures = [];
            if (this.hasTree) {
                enabledFeatures.push('Tree');
            }
            if (this.typeClass.isSortable) {
                enabledFeatures.push('DnD');
            }

            var store = Store.getStore(this.type, appConfig.defaultLanguage);

            // check if the type might have parents of the same type,
            // and set the filter to retrieve only root nodes, if yes
            var filter = {};
            var simpleType = Model.getSimpleTypeName(this.type);
            var relations = this.typeClass.getRelations();
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                if (relation.relationType === 'parent' && relation.type === simpleType) {
                    filter[relation.fkName] = null;
                }
            }

            this.gridWidget = new GridWidget({
                type: this.type,
                store: store.filter(filter),
                actions: this.getGridActions(),
                enabledFeatures: enabledFeatures
            }, this.gridNode);

            if (this.onCreated instanceof Function) {
                this.onCreated(this);
            }

            this.own(
                topic.subscribe('ui/_include/widget/GridWidget/error', lang.hitch(this, function(error) {
                    this.showBackendError(error);
                })),
                topic.subscribe('ui/_include/widget/GridWidget/dnd-start', lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "process",
                        message: Dict.translate("Saving positions")
                    });
                })),
                topic.subscribe('ui/_include/widget/GridWidget/dnd-end', lang.hitch(this, function(error) {
                    this.showNotification({
                        type: "ok",
                        message: Dict.translate("Finished"),
                        fadeOut: true
                    });
                }))
            );
        },

        startup: function() {
            this.inherited(arguments);
            this.gridWidget.startup();
        },

        getGridActions: function() {

            var editAction = new Edit({
                page: this.page,
                route: this.route
            });

            var copyAction = new Copy({
                init: lang.hitch(this, function(data) {
                    this.showNotification({
                        type: "process",
                        message: Dict.translate("Copying '%0%'", [this.typeClass.getDisplayValue(data)])
                    });
                }),
                callback: lang.hitch(this, function(result) {
                    // success
                    this.showNotification({
                        type: "ok",
                        message: Dict.translate("'%0%' was successfully copied", [this.typeClass.getDisplayValue(result)]),
                        fadeOut: true
                    });
                    this.gridWidget.refresh();
                }),
                errback: lang.hitch(this, function(error) {
                    // error
                    this.showBackendError(error);
                })
            });

            var deleteAction = new Delete({
                init: lang.hitch(this, function(data) {
                    this.hideNotification();
                }),
                callback: lang.hitch(this, function(result) {
                    // success
                    this.showNotification({
                        type: "ok",
                        message: Dict.translate("'%0%' was successfully deleted", [this.typeClass.getDisplayValue(result)]),
                        fadeOut: true
                    });
                }),
                errback: lang.hitch(this, function(error) {
                    // error
                    this.showBackendError(error);
                })
            });

            return [editAction, copyAction, deleteAction];
        },

        _create: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            new Create({
                page: this.page,
                route: this.route
            }).execute(e, this.type);
        }
    });
});