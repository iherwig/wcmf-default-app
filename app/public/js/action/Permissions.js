define([
    "dojo/_base/declare",
    "./ActionBase",
    "../ui/data/widget/PermissionDlgWidget",
    "../locale/Dictionary",
    "../model/meta/Model"
], function (
    declare,
    ActionBase,
    PermissionDlg,
    Dict,
    Model
) {
    return declare([ActionBase], {

        name: 'permissions',
        iconClass: 'fa fa-shield',

        /**
         * Open to permissions dialog
         * @param e The event that triggered execution, might be null
         * @param entity Entity to open permissions dialog for
         */
        execute: function(e, entity) {
            if (this.init instanceof Function) {
                this.init(entity);
            }
            var oid = entity.get('oid');
            var typeClass = Model.getType(Model.getTypeNameFromOid(oid));
            var displayValue = typeClass.getDisplayValue(entity);
            new PermissionDlg({
                oid: entity.get('oid'),
                message: Dict.translate("Permissions for '%0%'", [displayValue])
            }).show();

        }
    });
});
