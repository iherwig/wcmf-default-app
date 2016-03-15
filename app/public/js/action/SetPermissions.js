define([
    "dojo/_base/declare",
    "dojo/request",
    "./ActionBase"
], function (
    declare,
    request,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'getPermissions',
        iconClass: 'fa fa-shield',

        path: appConfig.backendUrl+'permissions',

        // action parameters
        operation: '',
        permissions: {},

        execute: function() {
            return request.put(this.path, {
                data: {
                    operation: this.operation,
                    permissions: this.permissions
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
