define([
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/when",
    "dojo/topic",
    "dojo/store/JsonRest",
    "dojo/store/util/QueryResults"
], function (
    declare,
    aspect,
    when,
    topic,
    JsonRest,
    QueryResults
) {
    var TreeStore = declare([JsonRest], {

        idProperty: 'oid',

        constructor: function(options) {
            options.headers = {
                Accept: "application/json"
            };

            aspect.after(this, 'query', function(QueryResults) {
                when(QueryResults, function() {}, function(error) {
                    if (error.dojoType && error.dojoType === 'cancel') {
                        return; // ignore cancellations
                    }
                    topic.publish("store-error", error);
                });
                return QueryResults;
            });
        },

      	get: function(id, options) {
            throw new Error("Operation 'get' is not supported.");
        },

      	put: function(object, options) {
            throw new Error("Operation 'put' is not supported.");
        },

      	add: function(object, options) {
            throw new Error("Operation 'add' is not supported.");
        },

      	remove: function(id, options) {
            throw new Error("Operation 'remove' is not supported.");
        },

        query: function(query, options) {
            if (query.oid === 'init') {
                return [{
                    oid: 'root',
                    displayText: 'ROOT'
                }]
            }
            else {
                return this.inherited(arguments).then(function(results) {
                    return QueryResults(results["list"]);
                });
            }
        },

        getChildren: function(object) {
            return this.query(object);
        }
    });

    /**
     * Registry for shared instances
     */
    TreeStore.storeInstances = {};

    /**
     * Get the tree store with the given root types
     * @param rootTypes The root types configuration value
     * @return Store instance
     */
    TreeStore.getStore = function(rootTypes) {
        if (!TreeStore.storeInstances[rootTypes]) {
            var jsonRest = new TreeStore({
                target: appConfig.backendUrl+"?action=browseTree&rootTypes=linkableTypes"
            });
            TreeStore.storeInstances[rootTypes] = {
                jsonRest: jsonRest
            };
        }
        return TreeStore.storeInstances[rootTypes].jsonRest;
    };

    return TreeStore;
});