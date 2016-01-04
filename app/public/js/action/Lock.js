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

        name: 'lock',
        iconClass: 'fa fa-lock',

        path: appConfig.backendUrl+'lock',
        lockType: "optimistic", // "optimistic|pessimistic"

        /**
         * Create a pessimistic lock on the object
         * @param e The event that triggered execution, might be null
         * @param entity Entity to lock
         * @return Deferred
         */
        execute: function(e, entity) {
            if (this.init instanceof Function) {
                this.init(entity);
            }
            var deferred = new Deferred();
            request.post(this.path+'/'+this.lockType+'/'+entity.get('oid'), {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                if (this.callback instanceof Function) {
                    this.callback(response);
                }
                deferred.resolve(response);
            }), lang.hitch(this, function(error) {
                // error
                if (this.errback instanceof Function) {
                    this.errback(error);
                }
                deferred.reject(error);
            }));
            return deferred;
        }
    });
});
