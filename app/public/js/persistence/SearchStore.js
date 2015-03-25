define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/xhr",
    "dojo/Deferred",
    "dstore/QueryResults",
    "./BaseStore"
], function (
    declare,
    lang,
    xhr,
    Deferred,
    QueryResults,
    BaseStore
) {
    var Store = declare([BaseStore], {

        idProperty: 'oid',

        fetch: function () {
            return new QueryResults(this.retrieve());
        },

        fetchRange: function (args) {
            var requestArgs = "&offset="+args.start+"&limit="+(args.end-args.start);
            return new QueryResults(this.retrieve(requestArgs));
        },

        retrieve: function(requestArgs) {
            var deferred = new Deferred();
            xhr("GET", {
                url: this.target+requestArgs,
                handleAs: "json",
                headers: {
                    Accept: "application/json"
                }
            }).then(lang.hitch(this, function(data) {
                deferred.resolve(data.list);
            }), function(error) {
                deferred.reject(error);
            });
            return deferred;
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