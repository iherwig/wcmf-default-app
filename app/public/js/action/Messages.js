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

        name: 'messages',
        iconClass: 'fa fa-book',

        path: appConfig.backendUrl+'messages',

        /**
         * Get localized messages for the given language
         * @param e The event that triggered execution, might be null
         * @param operations Array of operations to check
         * @return Deferred
         */
        execute: function(e, language) {
            this.init(language);
            var deferred = new Deferred();
            request.get(this.path+'/'+language, {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.callback(response);
                deferred.resolve(response);
            }), lang.hitch(this, function(error) {
                // error
                this.errback(error);
                deferred.reject(error);
            }));
            return deferred;
        }
    });
});
