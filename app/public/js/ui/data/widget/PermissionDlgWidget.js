define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dstore/Memory",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "../../_include/widget/PopupDlgWidget",
    "../../data/input/widget/BinaryCheckBox",
    "../../data/input/widget/RadioButton",
    "../../data/input/widget/MultiSelectBox",
    "../../data/input/widget/SelectBox",
    "../../../action/ActionSet",
    "../../../model/meta/Model",
    "../../../persistence/Store",
    "../../../locale/Dictionary",
    "dojo/text!./template/PermissionDlgWidget.html"
], function (
    declare,
    lang,
    all,
    Memory,
    _WidgetBase,
    _TemplatedMixin,
    PopupDlg,
    BinaryCheckBox,
    Radio,
    MultiSelect,
    Select,
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
     *     oid: this.entity.get('oid'),
     *     displayValue: this.typeClass.getDisplayValue(this.entity)
     * }).show();
     * @endcode
     */
    return declare([PopupDlg], {

        oid: null,

        actions: ['read', 'update', 'delete'],
        userSelectCtrl: null,

        okBtnText: Dict.translate('Save'),

        style: "width: 600px",
        title: '<i class="fa fa-shield"></i> '+Dict.translate("Permissions"),

        postCreate: function () {
            this.inherited(arguments);

            // query roles
            var store = Store.getStore(Model.getSimpleTypeName(appConfig.roleType),
                appConfig.defaultLanguage);
            var loadRoles = store.fetch();

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

                // create permission controls
                for (var i=0, count=this.actions.length; i<count; i++) {
                    var action = this.actions[i];
                    this.createControls(action, permissions[action].result, roles);
                }
            }));

            this.userSelectCtrl = new Select({
                name: 'userSelectCtrl',
                inputType: 'select:{"list":{"type":"node","types":["'+appConfig.userType+'"]}}'
            }, this.permissionsWidget.userSelectCtrl);
            this.userSelectCtrl.on('change', lang.hitch(this, function(id) {
                var login = this.userSelectCtrl.get('displayedValue');
                this.checkUserPermissions(login);
            }));
            this.userSelectCtrl.startup();
        },

        hide: function() {
            // close any multiselect popup menus
            for (var i=0, count=this.actions.length; i<count; i++) {
                this[this.actions[i]+'PermCtrl'].close();
            }
            this.inherited(arguments);
        },

        okCallback: function() {
            // save permissions
            var permissions = {};
            for (var i=0, count=this.actions.length; i<count; i++) {
                var action = this.actions[i];
                permissions[action] = {
                    'allow': [], 'deny': []
                };
                var defaultWidget = this[action+'DefaultCtrl'];
                permissions[action]['default'] = defaultWidget.get('value') === '+' ? true : false;

                var widget = this[action+'PermCtrl'];
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
                        permissions: this.isDisabled(action) ? null : permissions[action]
                    }
                };
            }
            return new ActionSet().execute(null, setPermissionActions);
        },

        createControls: function(action, permissions, roles) {
            var active = (permissions !== null);

            // activate control
            var name = action+'ActivateCtrl';
            this[name] = new BinaryCheckBox({
                name: name,
                value: active ? "1" : "0"
            }, this.permissionsWidget[name]);
            this[name].on('change', lang.hitch(this, function(isSelected) {
                this.setDisabled(action, !isSelected);
            }));
            this[name].startup();

            // default permission control
            var defaultStore = new Memory({
                data: [
                    { id: '+', displayText: Dict.translate('allow') },
                    { id: '-', displayText: Dict.translate('deny') }
                ]
            });
            var name = action+'DefaultCtrl';
            this[name] = new Radio({
                name: name,
                store: defaultStore,
                value: (permissions && permissions['default'] === true) ? '+' : '-'
            }, this.permissionsWidget[name]);
            this[name].startup();

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
            var name = action+'PermCtrl';
            this[name] = new MultiSelect({
                name: name,
                store: roleStore,
                value: this.permissionsToInput(permissions)
            }, this.permissionsWidget[name]);
            this[name].startup();

            this.setDisabled(action, !active);
        },

        isDisabled: function(action) {
            return this[action+'ActivateCtrl'].get('value') === "0";
        },

        setDisabled: function(action, value) {
            this[action+'DefaultCtrl'].set('disabled', value);
            this[action+'PermCtrl'].set('disabled', value);
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

        checkUserPermissions: function(login) {
            if (login && login.length > 0) {
                var operations = [];
                for (var i=0, count=this.actions.length; i<count; i++) {
                    operations.push(this.oid+'??'+this.actions[i]);
                }
                var checkPermissionsAction = [{
                    action: 'checkPermissionsOfUser',
                    params: {
                        operations: operations,
                        user: login
                    }
                }];
                new ActionSet().execute(null, checkPermissionsAction).then(lang.hitch(this, function(result) {
                    var permissions = result[0].result;
                    var display = [];
                    for (var i=0, count=this.actions.length; i<count; i++) {
                        var action = this.actions[i];
                        var allowed = permissions[this.oid+'??'+action];
                        var str = allowed ? '<i class="fa fa-check-circle"></i>' : '<i class="fa fa-minus-circle"></i>';
                        str += ' '+action;
                        display.push(str);
                    }
                    this.permissionsWidget.userPermissions.innerHTML = display.join(' ');
                }));
            }
            else {
                this.permissionsWidget.userPermissions.innerHTML = '';
            }
        },

        /**
         * @Override
         */
        getContentWidget: function() {
            this.permissionsWidget = new (declare([_WidgetBase, _TemplatedMixin], {
                templateString: lang.replace(template, Dict.tplTranslate)
            }));
            return this.permissionsWidget;
        }
    });
});