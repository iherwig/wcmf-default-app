define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dstore/Store",
    "dstore/QueryResults",
    "./RelationStore",
    "../model/meta/Model"
], function (
    declare,
    lang,
    all,
    Store,
    QueryResults,
    RelationStore,
    Model
) {
    var ChildrenStore = declare([Store], {
        entity: null,
        rootTypeName: '',

        constructor: function(entity, rootTypeName) {
            this.entity = entity;
            this.rootTypeName = rootTypeName;
        },

        fetch: function() {
            var deferredList = [];
            var oid = this.entity.get('oid');
            var type = Model.getTypeFromOid(oid);
            var simpleRootType = Model.getSimpleTypeName(this.rootTypeName);
            var relations = type.getRelations();
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                // only follow child relations of different type
                if (relation.relationType === 'child' && relation.type !== simpleRootType) {
                    var store = RelationStore.getStore(oid, relation.name);
                    deferredList.push(store.fetch());
                }
            }
            return new QueryResults(all(deferredList).then(lang.hitch(this, function(data) {
                // concat data
                var result = [];
                for (var i=0, count=deferredList.length; i<count; i++) {
                    result = result.concat(data[i]);
                }
                // set display values
                var type = Model.getType(this.rootTypeName);
                var displayValues = type.displayValues;
                for (var i=0, count=result.length; i<count; i++) {
                    var child = result[i];
                    var childType = Model.getTypeFromOid(child.get('oid'));
                    for (var j=0, countJ=displayValues.length; j<countJ; j++) {
                      child.set(displayValues[j], j=== 0 ? childType.getDisplayValue(child) : '');
                    }
                }
                return result;
            })));
        },

        fetchRange: function(kwArgs) {
            // TODO pagination
            return this.fetch();
        }
    });

    return ChildrenStore;
});