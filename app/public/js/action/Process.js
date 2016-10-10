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

        name: '',
        started: false,

        deferred: null,

        /**
         * Constructor
         * @param name The name of the process (used as part of the backend url)
         */
        constructor: function(name) {
            this.name = name;
            this.inherited(arguments);
        },

        /**
         * Initiate the process with the initial action.
         * @param params Additional parameters to be passed with the first call
         * @return Deferred
         */
        run: function(params) {
            this.deferred = new Deferred();
            this.doCall(params);
            return this.deferred;
        },

        /**
         * Make a backend call.
         * @param params Additional parameters to be passed with the initial call
         */
        doCall: function(params) {
            request.post(this.getBackendUrl(), {
                data: params,
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            }).then(lang.hitch(this, function(response) {
                // success
                if (!this.started) {
                    this.started = true;
                }
                this.handleResponse(response);
            }), lang.hitch(this, function(error) {
                // error
                this.deferred.reject(error);
            }));
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
            // send progress information
            this.deferred.progress({
                stepName: stepName,
                stepNumber: stepNumber,
                numberOfSteps: numberOfSteps,
                response: response
            });

            if (response.status === 'download') {
                iframe(this.getBackendUrl(), {
                    preventCache: true,
                    timeout: 1000,
                    method: "POST"
                });
                this.deferred.resolve(response);
            }
            else if (response.status === 'done') {
                // the task is finished
                this.deferred.resolve(response);
            }
            else {
                // do the proceeding calls
                if (!this.deferred.isCanceled()) {
                    this.doCall();
                }
            }
        },

        getBackendUrl: function() {
            var url = appConfig.backendUrl+'process/'+this.name;
            if (this.started) {
                url += '/continue';
            }
            return url;
        }
    });
});
