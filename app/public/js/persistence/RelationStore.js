define([
    "dojo/_base/declare",
    "dstore/Cache",
    "./BaseStore",
    "../model/meta/Model"
], function (
    declare,
    Cache,
    BaseStore,
    Model
) {
    var RelationStore = declare([BaseStore], {
        oid: '',
        relationName: '',
        typeName: ''
    });

    /**
     * Get the store for a given object id, relation
     * @param oid The object id
     * @param relationName The name of the relation
     * @return RelationStore instance
     */
    RelationStore.getStore = function(oid, relationName) {
        var fqTypeName = Model.getFullyQualifiedTypeName(Model.getTypeNameFromOid(oid));
        var id = Model.getIdFromOid(oid);
        var relation = Model.getType(fqTypeName).getRelation(relationName);
        var relationTypeName = Model.getFullyQualifiedTypeName(relation.type);

        var jsonRest = new RelationStore({
            oid: oid,
            relationName: relationName,
            typeName: relationTypeName,
            target: appConfig.pathPrefix+"/rest/"+appConfig.defaultLanguage+"/"+fqTypeName+"/"+id+"/"+relationName+"/"
        });
        var cache = Cache.create(jsonRest);
        return cache;
    };

    return RelationStore;
});