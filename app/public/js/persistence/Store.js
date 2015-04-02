define([
    "dojo/_base/declare",
    "dstore/Cache",
    "./BaseStore",
    "./ChildrenStore",
    "../model/meta/Model"
], function (
    declare,
    Cache,
    BaseStore,
    ChildrenStore,
    Model
) {
    var Store = declare([BaseStore], {
        language: '',
        canHaveChildren: null,

        getChildren: function(object) {
            return new ChildrenStore(object, this.typeName);
        },

        mayHaveChildren: function(object) {
            if (this.canHaveChildren === null) {
                // check if the type has child relations
                var type = Model.getType(this.typeName);
                var relations = type.getRelations();
                for (var i=0, count=relations.length; i<count; i++) {
                    var relation = relations[i];
                    if (relation.relationType === 'child') {
                        this.canHaveChildren = true;
                        break;
                    }
                }
            }
            return this.canHaveChildren;
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
            var cache = Cache.create(jsonRest);
            Store.storeInstances[fqTypeName][language] = {
                jsonRest: jsonRest,
                cache: cache
            };
        }
        return Store.storeInstances[fqTypeName][language].cache;
    };

    return Store;
});