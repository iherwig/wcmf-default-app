define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/Deferred",
    "./ActionBase"
], function (
    declare,
    lang,
    request,
    Deferred,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'checkPermissions',
        iconClass: 'fa fa-check',

        path: appConfig.backendUrl+'permissions',

        /**
         * Check permissions for the given object
         * @param e The event that triggered execution, might be null
         * @param operations Array of operations to check
         * @return Deferred
         */
        execute: function(e, operations) {
            this.init(operations);
            var deferred = new Deferred();
            request.get(this.path, {
                query: {
                    "operations[]": operations
                },
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.callback(response.result);
                deferred.resolve(response.result);
            }), lang.hitch(this, function(error) {
                // error
                this.errback(error);
                deferred.reject(error);
            }));
            return deferred;
        }
    });
});
