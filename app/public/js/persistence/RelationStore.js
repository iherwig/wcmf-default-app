define([
    "dojo/_base/declare",
    "dojo/_base/config",
    "./BaseStore",
    "../model/meta/Model"
], function (
    declare,
    config,
    BaseStore,
    Model
) {
    var RelationStore = declare([BaseStore], {
        oid: '',
        relationName: ''
    });

    /**
     * Registry for shared instances
     */
    RelationStore.storeInstances = {};

    /**
     * Get the store for a given object id, relation
     * @param oid The object id
     * @param relationName The name of the relation
     * @return RelationStore instance
     */
    RelationStore.getStore = function(oid, relationName) {
        if (!RelationStore.storeInstances[oid]) {
          RelationStore.storeInstances[oid] = {};
        }
        if (!RelationStore.storeInstances[oid][relationName]) {
            var fqTypeName = Model.getFullyQualifiedTypeName(Model.getTypeNameFromOid(oid));
            var id = Model.getIdFromOid(oid);
            var relation = Model.getType(fqTypeName).getRelation(relationName);
            var relationTypeName = Model.getFullyQualifiedTypeName(relation.type);

            var jsonRest = new RelationStore({
                oid: oid,
                relationName: relationName,
                typeName: relationTypeName,
                target: config.app.pathPrefix+"rest/"+config.app.defaultLanguage+"/"+fqTypeName+"/"+id+"/"+relationName+"/",
                extraParams: {}
            });
            RelationStore.storeInstances[oid][relationName] = jsonRest;
        }
        return RelationStore.storeInstances[oid][relationName];
    };

    return RelationStore;
});