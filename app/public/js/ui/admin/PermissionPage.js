define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../data/EntityPage",
    "../../model/meta/Model",
    "../../locale/Dictionary",
    "dojo/text!./template/PermissionPage.html"
], function (
    require,
    declare,
    lang,
    EntityPage,
    Model,
    Dict,
    template
) {
    return declare([EntityPage], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Permission Management'),
        type: Model.getSimpleTypeName(appConfig.permissionType),

        baseRoute: "permission",
        types: [
          Model.getSimpleTypeName(appConfig.permissionType)
        ]
    });
});