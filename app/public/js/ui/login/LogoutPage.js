define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../../AppLoader!../_include/widget/NavigationWidget",
    "../../User",
    "../../locale/Dictionary",
    "../../action/Logout",
    "dojo/text!./template/LogoutPage.html"
], function (
    require,
    declare,
    lang,
    config,
    _Page,
    _Notification,
    NavigationWidget,
    User,
    Dict,
    Logout,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Logout'),
        bodyDomId: 'page-logout',

        startup: function() {
            this.inherited(arguments);
            this._logout();
        },

        _logout: function() {
            new Logout().execute().then(lang.hitch(this, function(response) {
                // end session
                User.destroy();
                // redirect to login
                window.location.assign(config.app.backendUrl);
            }), lang.hitch(this, function(error) {
                // error
                this.showBackendError(error);
            }));
        }
    });
});