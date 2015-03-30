define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../data/EntityListPage",
    "../../model/meta/Model",
    "../../locale/Dictionary",
    "dojo/text!./template/PermissionListPage.html"
], function (
    require,
    declare,
    lang,
    EntityListPage,
    Model,
    Dict,
    template
) {
    return declare([EntityListPage], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Permission Management'),
        type: Model.getSimpleTypeName(appConfig.permissionType),

        baseRoute: "permission",
        types: [
          Model.getSimpleTypeName(appConfig.permissionType)
        ],
        hasTree: false
    });
});