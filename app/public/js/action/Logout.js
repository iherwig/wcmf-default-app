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

        name: 'login',
        iconClass: 'fa fa-sign-out',

        path: appConfig.backendUrl+'session',

        execute: function() {
            return request.del(this.path, {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
