define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/data/ObjectStore",
    "dojo/store/Memory",
    "../../_include/widget/PopupDlgWidget",
    "../../data/input/widget/RadioButton",
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
    Radio,
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
     *     oid: this.entity.oid,
     *     displayValue: this.typeClass.getDisplayValue(this.entity)
     * }).show();
     * @endcode
     */
    return declare([PopupDlg], {

        oid: null,

        actions: ['read', 'update', 'delete'],
        existingPermissions: {},

        style: "width: 500px",
        title: '<i class="fa fa-shield"></i> '+Dict.translate("Permissions"),

        postCreate: function () {
            this.inherited(arguments);

            // query roles
            var store = Store.getStore(Model.getSimpleTypeName(appConfig.roleType),
                appConfig.defaultLanguage);
            var loadRoles = store.query({});

            // get permissions
            var getPermissionActions = {};
            for (var i=0, count=this.actions.length; i<count; i++) {
                var action = this.actions[i];
                getPermissionActions[action] = {
                    action: 'getPermissions',
                    params: {
                        resource: this.oid,
                        context: '',
                        action: action
                    }
                };
            }
            var getPermissions = new ActionSet().execute(null, getPermissionActions);

            // do server requests
            all([loadRoles, getPermissions]).then(lang.hitch(this, function(results){
                var roles = results[0];
                var permissions = results[1];

                // create controls
                for (var i=0, count=this.actions.length; i<count; i++) {
                    var action = this.actions[i];
                    this.createControls(action, permissions[action].result, roles);
                }
            }));

            // save on ok clicked
            this.okCallback = lang.hitch(this, this.save);
        },

        save: function() {
            // save permissions
            var permissions = {};
            for (var i=0, count=this.actions.length; i<count; i++) {
                var action = this.actions[i];
                permissions[action] = {
                    'allow': [], 'deny': []
                };
                var defaultWidget = this.getContentWidget(action+'DefaultCtrl');
                permissions[action]['default'] = defaultWidget.get('value') === '+' ? true : false;

                var widget = this.getContentWidget(action+'PermCtrl');
                var roles = widget.get('value');
                for (var j=0, countJ=roles.length; j<countJ; j++) {
                  var role = roles[j];
                  var section = role.charAt(0) === '+' ? 'allow' : 'deny';
                  permissions[action][section].push(role.substring(1, role.length));
                }
            }
            var setPermissionActions = {};
            for (var i=0, count=this.actions.length; i<count; i++) {
                var action = this.actions[i];
                setPermissionActions[action] = {
                    action: 'setPermissions',
                    params: {
                        resource: this.oid,
                        context: '',
                        action: action,
                        permissions: permissions[action]
                    }
                };
            }
            return new ActionSet().execute(null, setPermissionActions);
        },

        createControls: function(action, permissions, roles) {
            // default permission control
            var defaultStore = new Memory({
                data: [
                    { id: '+', displayText: Dict.translate('allow') },
                    { id: '-', displayText: Dict.translate('deny') }
                ]
            });
            new Radio({
                name: action+'DefaultCtrl',
                store: defaultStore,
                value: (permissions && permissions.default === true) ? '+' : '-'
            }, this.content[action+'DefaultCtrl']).startup();

            // roles control
            var data = [];
            for (var i=0, count=roles.length; i<count; i++) {
                var roleName = roles[i].name;
                data.push({ id: '-'+roleName, label: '-'+roleName });
                data.push({ id: '+'+roleName, label: '+'+roleName });
            }
            var roleStore = new Memory({
                data: data
            });
            new MultiSelect({
                name: action+'PermCtrl',
                store: new ObjectStore({ objectStore: roleStore }),
                value: this.permissionsToInput(permissions)
            }, this.content[action+'PermCtrl']).startup();
        },

        /**
         * Convert the permissions response returned from the server into
         * an array to be used with the permissions input.
         * @param permissions
         * @return Array
         */
        permissionsToInput: function(permissions) {
            var value = [];
            if (permissions) {
                for (var i=0, count=permissions.allow ? permissions.allow.length : 0; i<count; i++) {
                    value.push('+'+permissions.allow[i]);
                }
                for (var i=0, count=permissions.deny ? permissions.deny.length : 0; i<count; i++) {
                    value.push('-'+permissions.deny[i]);
                }
            }
            return value;
        },

        /**
         * Provide custom template
         */
        getTemplate: function() {
            return template;
        }
    });
});