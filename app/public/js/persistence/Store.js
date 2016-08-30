define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/topic",
    "dstore/Cache",
    "dstore/Memory",
    "dstore/Trackable",
    "./BaseStore",
    "./ChildrenStore",
    "../model/meta/Model"
], function (
    lang,
    declare,
    topic,
    Cache,
    Memory,
    Trackable,
    BaseStore,
    ChildrenStore,
    Model
) {
    var Store = declare([BaseStore], {
        language: '',
        canHaveChildren: null,
        cache: null,

        constructor: function(options) {
            declare.safeMixin(this, options);

            // subscribe to change events emitted by other store instances
            topic.subscribe("store-datachange", lang.hitch(this, function(data) {
                if (data.store.target !== this.target) {
                    // check if the store contains the type of the changed entity
                    if (this.cache && data.entity && Model.getTypeNameFromOid(data.oid) === this.typeName) {
                        this.cache.evict(this.getIdentity(data.entity));
                    }
                }
            }));
        },

        getChildren: function(object) {
            return new ChildrenStore(object, this.typeName);
        },

        mayHaveChildren: function(object) {
            if (this.canHaveChildren === null) {
                // check if the type has child relations
                var type = Model.getType(this.typeName);
                var relations = type.getRelations('child');
                this.canHaveChildren = relations.length > 0;
            }
            var hasChildren = object.hasChildren !== undefined ? object.hasChildren : true;
            return this.canHaveChildren && hasChildren;
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
                target: appConfig.pathPrefix+"rest/"+language+"/"+fqTypeName+"/"
            });
            var cache = Cache.create(jsonRest, {
                cachingStore: new (Memory.createSubclass(Trackable))()
            });
            jsonRest.cache = cache;
            Store.storeInstances[fqTypeName][language] = {
                jsonRest: jsonRest,
                cache: cache
            };
        }
        return Store.storeInstances[fqTypeName][language].cache;
    };

    return Store;
});