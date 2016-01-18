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
        iconClass: 'fa fa-unlock',

        path: appConfig.backendUrl+'lock',
        lockType: "optimistic", // "optimistic|pessimistic"

        /**
         * Remove a pessimistic lock from the object
         * @param e The event that triggered execution, might be null
         * @param entity Entity to unlock
         * @return Deferred
         */
        execute: function(e, entity) {
            this.init(entity);
            var deferred = new Deferred();
            request.del(this.path+'/'+this.lockType+'/'+entity.get('oid'), {
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
