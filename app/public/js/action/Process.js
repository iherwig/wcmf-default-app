define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/request/iframe",
    "dojo/Deferred"
], function (
    declare,
    lang,
    request,
    iframe,
    Deferred
) {
    /**
     * Process wrapper class. A process is typically executed
     * in the backend by a subclass of BatchController.
     */
    return declare([], {

        callback: null,
        errback: null,
        progback: null,

        deferred: null,

        /**
         * Initiate the process with the initial action.
         * @param action The action to be called on the backend
         * @param params Additional parameters to be passed with the first call
         * @return Deferred
         */
        run: function(action, params) {
            return this.doCall(action, "", params);
        },

        /**
         * Make a backend call.
         * @param action The action to be called on the backend
         * @param controller The controller that initiates the action
         * @param params Additional parameters to be passed with the call
         * @return Deferred
         */
        doCall: function(action, controller, params) {
            var data = lang.mixin({
                controller: controller,
                action: action
            }, params);

            // create deferred on first call
            if (this.deferred === null) {
                this.deferred = new Deferred();
            }
            request.post(appConfig.backendUrl, {
                data: data,
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.handleResponse(response);
            }), lang.hitch(this, function(error) {
                // error
                this.deferred.reject(error);
            }));
            return this.deferred;
        },

        /**
         * Handle the response from the backend
         * @param response The response
         */
        handleResponse: function(response) {
            if (!response) {
                return;
            }
            var stepNumber = parseInt(response['stepNumber']);
            var numberOfSteps = parseInt(response['numberOfSteps']);
            var stepName = response['displayText'];
            var controller = response['controller'];
            // send progress information
            this.deferred.progress({
                stepName: stepName,
                stepNumber: stepNumber,
                numberOfSteps: numberOfSteps,
                response: response
            });

            if (response.action === "download") {
                iframe._currentDfd = null; // make sure the request is sent
                iframe.post(appConfig.backendUrl, {
                    data: {
                        controller: controller,
                        action: "continue"
                    }
                });
                this.deferred.resolve(response);
            }
            else if (response.action === "done") {
                // the task is finished
                this.deferred.resolve(response);
            }
            else {
                // do the proceeding calls
                this.doCall("continue", controller);
            }
        }
    });
});
