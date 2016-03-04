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

        name: 'checkPermissions',
        iconClass: 'fa fa-check',

        path: appConfig.backendUrl+'permissions',

        // action parameters
        operations: [],
        user: '',

        execute: function() {
            return request.get(this.path+(this.user ? '/'+this.user : ''), {
                query: {
                    "operations[]": this.operations
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            });
        }
    });
});
