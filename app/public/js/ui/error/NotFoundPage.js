define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../../AppLoader!../_include/widget/NavigationWidget",
    "../_include/_PageMixin",
    "../../locale/Dictionary",
    "dojo/text!./template/NotFoundPage.html"
], function (
    require,
    declare,
    lang,
    NavigationWidget,
    _Page,
    Dict,
    template
) {
    return declare([_Page], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Page not found'),
        bodyDomId: 'page-notfound',

        postCreate: function () {
            this.inherited(arguments);
            this.messageNode.innerHTML = Dict.translate('Page not found');
        }
    });
});