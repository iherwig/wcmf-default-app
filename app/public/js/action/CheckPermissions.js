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

        path: appConfig.backendUrl+'permissions/check',

        // action parameters
        operations: [],
        user: '',

        execute: function() {
            return request.post(this.path+(this.user ? '/'+this.user : ''), {
                data: {
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
