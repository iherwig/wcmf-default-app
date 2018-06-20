define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/topic",
    "./BaseStore",
    "./ChildrenStore",
    "../model/meta/Model"
], function (
    declare,
    lang,
    config,
    topic,
    BaseStore,
    ChildrenStore,
    Model
) {
    var Store = declare([BaseStore], {
        language: '',
        canHaveChildren: null,

        constructor: function(options) {
            declare.safeMixin(this, options);

            // subscribe to change events emitted by other store instances
            topic.subscribe("store-datachange", lang.hitch(this, function(data) {
                if (data.store.target !== this.target) {
                    // check if the store contains the type of the changed entity
                    if (data.entity && Model.getTypeNameFromOid(data.oid) === this.typeName) {
                        this.evict(this.getIdentity(data.entity));
                    }
                }
            }));
        },

        /**
         * Get the given entity bypassing the cache (will refresh the cache as well)
         * @param id
         * @param options
         * @returns Entity
         */
        getUncached: function(id, options) {
            this.evict(id);
            return this.get(id, options);
        },

        /**
         * Remove the given entity from the cache
         * @param id
         */
        evict: function(id) {
            // do nothing, since we don't cache
        },

        getChildren: function(parent) {
            return new ChildrenStore(parent, this.typeName);
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
            var store = new Store({
                typeName: fqTypeName,
                language: language,
                target: config.app.pathPrefix+"rest/"+language+"/"+fqTypeName+"/",
                // don't load default values in translations
                extraParams: {'useDefaults': false}
            });
            Store.storeInstances[fqTypeName][language] = store;
        }
        return Store.storeInstances[fqTypeName][language];
    };

    return Store;
});