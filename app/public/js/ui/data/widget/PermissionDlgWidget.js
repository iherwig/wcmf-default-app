define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/data/ObjectStore",
    "dojo/store/Memory",
    "../../_include/widget/PopupDlgWidget",
    "../../data/input/widget/MultiSelectBox",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../locale/Dictionary",
    "dojo/text!./template/PermissionDlgWidget.html"
], function (
    declare,
    lang,
    ObjectStore,
    Memory,
    PopupDlg,
    MultiSelect,
    Model,
    Store,
    Dict,
    template
) {
    /**
     * Modal permission dialog. Usage:
     * @code
     * new PermissionDlg({
     * }).show();
     * @endcode
     */
    return declare([PopupDlg], {

        type: "",
        style: "width: 500px",
        title: '<i class="fa fa-shield"></i> '+Dict.translate("Permissions"),

        postCreate: function () {
            this.inherited(arguments);
            var store = Store.getStore(Model.getSimpleTypeName(appConfig.roleType),
                appConfig.defaultLanguage);
            // query roles
            store.query({}).then(lang.hitch(this, function(results){
                // create memory store from roles
                var data = [
                    { id: '-*', label: '-*' },
                    { id: '+*', label: '+*' }
                ]
                for (var i=0, count=results.length; i<count; i++) {
                    var roleName = results[i].name;
                    data.push({ id: '-'+roleName, label: '-'+roleName });
                    data.push({ id: '+'+roleName, label: '+'+roleName });
                }
                var store = new Memory({
                  data: data
                });

                new MultiSelect({
                    name: "read",
                    store: new ObjectStore({ objectStore: store })
                }).placeAt(this.content.readCtrl).startup();

                new MultiSelect({
                    name: "modify",
                    store: new ObjectStore({ objectStore: store })
                }).placeAt(this.content.updateCtrl).startup();

                new MultiSelect({
                    name: "delete",
                    store: new ObjectStore({ objectStore: store })
                }).placeAt(this.content.deleteCtrl).startup();
            }));
        },

        /**
         * Provide custom template
         */
        getTemplate: function() {
            return template;
        }
    });
});