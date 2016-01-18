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

        name: 'login',
        iconClass: 'fa fa-sign-out',

        path: appConfig.backendUrl+'session',

        /**
         * Logout the user
         * @param e The event that triggered execution, might be null
         * @return Deferred
         */
        execute: function(e) {
            this.init();
            var deferred = new Deferred();
            request.del(this.path, {
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
