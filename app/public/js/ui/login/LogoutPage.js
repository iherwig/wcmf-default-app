define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "../../Cookie",
    "../../locale/Dictionary",
    "../../action/Logout",
    "dojo/text!./template/LogoutPage.html"
], function (
    require,
    declare,
    lang,
    _Page,
    _Notification,
    NavigationWidget,
    Cookie,
    Dict,
    Logout,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Logout'),

        startup: function() {
            this.inherited(arguments);
            this._logout();
        },

        _logout: function() {
            new Logout().execute().then(lang.hitch(this, function(response) {
                // redirect to login
                Cookie.destroyAll();
                window.location.assign(appConfig.backendUrl);
            }), lang.hitch(this, function(error) {
                // error
                this.showBackendError(error);
            }));
        }
    });
});