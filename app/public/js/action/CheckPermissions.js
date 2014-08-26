define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "./ActionBase"
], function (
    declare,
    lang,
    request,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'lock',
        iconClass: 'fa fa-check',

        action: "checkPermissions",

        /**
         * Check permissions for the given object
         * @param e The event that triggered execution, might be null
         * @param operations Array of operations to check
         */
        execute: function(e, operations) {
            if (this.init instanceof Function) {
                this.init(operations);
            }
            return request.post(appConfig.backendUrl, {
                data: {
                    action: this.action,
                    "operations[]": operations
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                if (this.callback instanceof Function) {
                    this.callback(operations, response);
                }
                return response;
            }), lang.hitch(this, function(error) {
                // error
                if (this.errback instanceof Function) {
                    this.errback(operations, error);
                }
                return error;
            }));
        }
    });
});
