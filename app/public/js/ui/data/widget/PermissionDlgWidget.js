define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/data/ObjectStore",
    "dojo/store/Memory",
    "../../_include/widget/PopupDlgWidget",
    "../../data/input/widget/MultiSelectBox",
    "../../../action/ActionSet",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../locale/Dictionary",
    "dojo/text!./template/PermissionDlgWidget.html"
], function (
    declare,
    lang,
    all,
    ObjectStore,
    Memory,
    PopupDlg,
    MultiSelect,
    ActionSet,
    Model,
    Store,
    Dict,
    template
) {
    /**
     * Modal permission dialog. Usage:
     * @code
     * new PermissionDlg({
     *     oid: this.entity.oid
     * }).show();
     * @endcode
     */
    return declare([PopupDlg], {

        oid: null,

        style: "width: 500px",
        title: '<i class="fa fa-shield"></i> '+Dict.translate("Permissions"),

        postCreate: function () {
            this.inherited(arguments);

            // query roles
            var store = Store.getStore(Model.getSimpleTypeName(appConfig.roleType),
                appConfig.defaultLanguage);
            var loadRoles = store.query({});
            var getPermissions = new ActionSet().execute(null, {
                action1: {
                    action: 'getPermissions',
                    params: {
                        resource: this.oid,
                        context: '',
                        action: 'read'
                    }
                },
                action2: {
                    action: 'getPermissions',
                    params: {
                        resource: this.oid,
                        context: '',
                        action: 'modify'
                    }
                },
                action3: {
                    action: 'getPermissions',
                    params: {
                        resource: this.oid,
                        context: '',
                        action: 'delete'
                    }
                }
            });
            all([loadRoles, getPermissions]).then(lang.hitch(this, function(results){
                // create memory store from roles
                var roles = results[0];
                var data = [
                    { id: '-*', label: '-*' },
                    { id: '+*', label: '+*' }
                ]
                for (var i=0, count=roles.length; i<count; i++) {
                    var roleName = roles[i].name;
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