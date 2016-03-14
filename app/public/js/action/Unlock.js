define([
    "dojo/_base/declare",
    "dojo/request",
    "./ActionBase"
], function (
    declare,
    request,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'lock',
        iconClass: 'fa fa-unlock',

        path: appConfig.backendUrl+'lock',
        lockType: "optimistic", // "optimistic|pessimistic"

        // action parameters
        entity: null, /* Entity */

        execute: function() {
            return request.del(this.path+'/'+this.lockType+'/'+this.entity.get('oid'), {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            });
        }
    });
});
