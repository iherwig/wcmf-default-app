define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/Deferred",
    "./ActionBase"
], function (
    declare,
    lang,
    all,
    Deferred,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'actionSet',
        iconClass: 'fa fa-tasks',

        action: "actionSet",

        /**
         * Execute multiple actions
         * @param e The event that triggered execution, might be null
         * @param data Array of ActionBase objects
         * @return Deferred
         */
        execute: function(e, actions) {
            this.init(actions);
            var deferred = new Deferred();
//            var requestData = JSON.stringify({
//                action: this.action,
//                data: data
//            });
//            request.post(appConfig.backendUrl, {
//                data: requestData,
//                headers: {
//                    Accept: "application/json"
//                },
//                handleAs: 'json'
//
//            }).then(lang.hitch(this, function(response) {
//                // success
//                this.callback(response.data);
//                deferred.resolve(response.data);
//            }), lang.hitch(this, function(error) {
//                // error
//                this.errback(error);
//                deferred.reject(error);
//            }));
          var promises = [];
          for (var i=0, count=actions.length; i<count; i++) {
              promises.push(actions[i].execute())
          }
          all(promises).then(lang.hitch(this, function(results) {
              // allow to watch for changes of the object data
              this.entity = results[0];
              this.original = this.isTranslation ? results[1] : {};
              this.buildForm();
              this.setTitle(this.title+" - "+this.typeClass.getDisplayValue(this.entity));
          }), lang.hitch(this, function(error) {
              // error
              this.showBackendError(error);
          }));


          return deferred;
        }
    });
});
