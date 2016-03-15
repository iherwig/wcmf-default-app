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
        iconClass: 'fa fa-sign-in',

        path: appConfig.backendUrl+'session',

        // action parameters
        user: '',
        password: '',

        execute: function() {
            return request.post(this.path, {
                data: {
                  user: this.user,
                  password: this.password
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
