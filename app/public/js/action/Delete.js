define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./ActionBase",
    "../ui/_include/widget/ConfirmDlgWidget",
    "../persistence/Store",
    "../model/meta/Model",
    "../locale/Dictionary"
], function (
    declare,
    lang,
    ActionBase,
    ConfirmDlg,
    Store,
    Model,
    Dict
) {
    return declare([ActionBase], {

        name: 'delete',
        iconClass: 'fa fa-trash-o',

        /**
         * Shows confirm dialog and executes the delete action on the store
         * @param e The event that triggered execution, might be null
         * @param entity Entity to delete
         * @return Deferred
         */
        execute: function(e, entity) {
            this.init(entity);
            return new ConfirmDlg({
                title: Dict.translate("Confirm Object Deletion"),
                message: Dict.translate("Do you really want to delete <em>%0%</em> ?", [Model.getTypeFromOid(entity.get('oid')).getDisplayValue(entity)]),
                okCallback: lang.hitch(this, function(dlg) {
                    var typeName = Model.getTypeNameFromOid(entity.get('oid'));
                    var store = Store.getStore(typeName, appConfig.defaultLanguage);
                    var deferred = store.remove(store.getIdentity(entity)).then(lang.hitch(this, function(results) {
                        // success
                        this.callback(entity);
                    }), lang.hitch(this, function(error) {
                        // error
                        this.errback(error);
                    }));
                    return deferred;
                })
            }).show();
        }
    });
});
