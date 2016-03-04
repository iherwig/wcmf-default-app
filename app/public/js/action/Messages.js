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

        name: 'messages',
        iconClass: 'fa fa-book',

        path: appConfig.backendUrl+'messages',

        // action parameters
        language: '',

        execute: function() {
            return request.get(this.path+'/'+this.language, {
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            });
        }
    });
});
