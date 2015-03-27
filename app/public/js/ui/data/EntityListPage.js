define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/ready",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "./widget/EntityTabWidget",
    "../../model/meta/Model",
    "../../locale/Dictionary",
    "dojo/text!./template/EntityListPage.html"
], function (
    require,
    declare,
    lang,
    ready,
    _Page,
    _Notification,
    NavigationWidget,
    EntityTabWidget,
    Model,
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Content'),

        baseRoute: "entity",
        types: appConfig.rootTypes,
        type: null,

        constructor: function(params) {
            // allow to override type parameter by request
            var requestType = this.request.getPathParam("type");
            if (requestType) {
                this.type = requestType;
            }
        },

        postCreate: function() {
            this.inherited(arguments);
            this.setTitle(this.title+" - "+Dict.translate(this.type));

            // create widget
            this.buildForm();
        },

        buildForm: function() {
            var typeClass = Model.getType(this.type);
            require([typeClass.listView || './widget/EntityListWidget'], lang.hitch(this, function(View) {
                if (View instanceof Function) {
                    // create the tab panel
                    var panel = new View({
                        type: this.type,
                        page: this,
                        route: this.baseRoute,
                        onCreated: lang.hitch(this, function(panel) {
                            // create the tab container
                            var tabs = new EntityTabWidget({
                                route: this.baseRoute,
                                types: this.types,
                                page: this,
                                selectedTab: {
                                    oid: this.type
                                },
                                selectedPanel: panel
                            }, this.tabNode);
                            ready(function() {
                                tabs.startup();
                            });
                        })
                    });
                }
                else {
                    // error
                    this.showNotification({
                        type: "error",
                        message: Dict.translate("List view class for type '%0%' not found.", [this.type])
                    });
                }
            }));
        }
    });
});