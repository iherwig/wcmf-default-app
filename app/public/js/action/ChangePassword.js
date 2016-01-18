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

        name: 'changePassword',
        iconClass: 'fa fa-user-secret',

        path: appConfig.backendUrl+'settings/password',

        /**
         * Change the user's password
         * @param e The event that triggered execution, might be null
         * @param data Login data
         * @return Deferred
         */
        execute: function(e, data) {
            this.init(data);
            var deferred = new Deferred();
            request.put(this.path, {
                data: data,
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.callback(response);
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
