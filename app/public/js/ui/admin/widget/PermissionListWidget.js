define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "../../data/widget/EntityListWidget",
    "../../../locale/Dictionary",
    "dojo/text!./template/PermissionListWidget.html"
],
function(
    require,
    declare,
    lang,
    EntityListWidget,
    Dict,
    template
) {
    return declare([EntityListWidget], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require
    });
});