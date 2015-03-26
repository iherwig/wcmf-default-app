define([
    "dojo/_base/declare",
  	"dojo/json",
    "dstore/Rest",
    "../persistence/Entity"
], function (
    declare,
    JSON,
    Rest,
    Entity
) {
    var Store = declare([Rest], {

        idProperty: 'oid',
        Model: Entity,

        parse: function(response) {
            var data = JSON.parse(response);
            return data.list;
        }
    });

    /**
     * Get the store for a given language
     * @param searchterm The searchterm
     * @return Store instance
     */
    Store.getStore = function(searchterm) {
        return new Store({
            target: appConfig.backendUrl+"?action=search&query="+searchterm
        });
    };

    return Store;
});