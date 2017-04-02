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

        name: 'setUserConfig',
        iconClass: 'fa fa-wrench',

        path: appConfig.backendUrl+'user/config',

        // action paramenters
        key: '',

        execute: function() {
            return request.get(this.path+'/'+this.key, {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'
            });
        }
    });
});
