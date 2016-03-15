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

        execute: function() {
            return request.get(this.path, {
                query: {
                    "operation": this.operation
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
