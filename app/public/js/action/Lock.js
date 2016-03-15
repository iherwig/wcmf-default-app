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
        iconClass: 'fa fa-lock',

        path: appConfig.backendUrl+'lock',

        // action parameters
        entity: null, /* Entity */
        lockType: "optimistic", // "optimistic|pessimistic"

        execute: function() {
            return request.post(this.path+'/'+this.lockType+'/'+this.entity.get('oid'), {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
