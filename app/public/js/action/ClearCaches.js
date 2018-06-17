define([
    "dojo/_base/declare",
    "dojo/_base/config",
    "dojo/request",
    "./ActionBase"
], function (
    declare,
    config,
    request,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'clearCaches',
        iconClass: 'fa fa-recycle',

        path: config.app.backendUrl+'cache',

        // action parameters

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
