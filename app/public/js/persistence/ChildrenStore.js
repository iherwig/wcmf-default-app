define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dstore/Store",
    "dstore/QueryResults",
    "./RelationStore",
    "../model/meta/Model"
], function (
    declare,
    all,
    Store,
    QueryResults,
    RelationStore,
    Model
) {
    var ChildrenStore = declare([Store], {
        entity: null,

        constructor: function(entity) {
            this.entity = entity;
        },

        fetch: function() {
            var deferredList = [];
            var oid = this.entity.get('oid');
            var type = Model.getTypeFromOid(oid);
            var relations = type.getRelations();
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                if (relation.relationType === 'child') {
                    var store = RelationStore.getStore(oid, relation.name);
                    deferredList.push(store.fetch());
                }
            }
            return new QueryResults(all(deferredList).then(function(data) {
                // concat data
                var result = [];
                for (var i=0, count=deferredList.length; i<count; i++) {
                    result = result.concat(data[i]);
                }
                return result;
            }));
        },

        fetchRange: function(kwArgs) {
            // TODO pagination
            return this.fetch();
        }
    });

    return ChildrenStore;
});