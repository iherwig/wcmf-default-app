define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/json",
    "dojo/Deferred",
    "./ActionBase"
], function (
    declare,
    lang,
    request,
    JSON,
    Deferred,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'actionSet',
        iconClass: 'fa fa-tasks',

        action: "actionSet",

        /**
         * Execure multiple actions in one request
         * @param e The event that triggered execution, might be null
         * @param data Array of action objects with at least the attribute action
         *             and additional action dependent attributes
         * @return Deferred
         */
        execute: function(e, data) {
            this.init(data);
            var deferred = new Deferred();
            var requestData = JSON.stringify({
                action: this.action,
                data: data
            });
            request.post(appConfig.backendUrl, {
                data: requestData,
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.callback(response.data);
                deferred.resolve(response.data);
            }), lang.hitch(this, function(error) {
                // error
                this.errback(error);
                deferred.reject(error);
            }));
            return deferred;
        }
    });
});
