define([
    "dojo/_base/declare",
    "./BaseStore",
    "../model/meta/Model"
], function (
    declare,
    BaseStore,
    Model
) {
    var Store = declare([BaseStore], {
        typeName: '',
        language: '',

        updateCache: function(object) {
            var memory = Store.storeInstances[this.typeName][this.language].memory;
            memory.put(object);
        }
    });

    /**
     * Registry for shared instances
     */
    Store.storeInstances = {};

    /**
     * Get the store for a given type and language
     * @param typeName The name of the type
     * @param language The language
     * @return Store instance
     */
    Store.getStore = function(typeName, language) {
        // register store under the fully qualified type name
        var fqTypeName = Model.getFullyQualifiedTypeName(typeName);

        if (!Store.storeInstances[fqTypeName]) {
            Store.storeInstances[fqTypeName] = {};
        }
        if (!Store.storeInstances[fqTypeName][language]) {
            var jsonRest = new Store({
                typeName: fqTypeName,
                language: language,
                target: appConfig.pathPrefix+"/rest/"+language+"/"+fqTypeName+"/"
            });
            Store.storeInstances[fqTypeName][language] = {
                jsonRest: jsonRest
            };
        }
        return Store.storeInstances[fqTypeName][language].jsonRest;
    };

    return Store;
});