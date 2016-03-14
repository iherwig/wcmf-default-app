define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/all",
    "./ActionBase",
    "../ui/_include/widget/ObjectSelectDlgWidget",
    "../persistence/Entity",
    "../persistence/RelationStore",
    "../model/meta/Model",
    "../locale/Dictionary"
], function (
    declare,
    lang,
    Deferred,
    all,
    ActionBase,
    ObjectSelectDlg,
    Entity,
    RelationStore,
    Model,
    Dict
) {
    return declare([ActionBase], {

        name: 'link',
        iconClass: 'fa fa-link',

        // action parameters
        source: null, /* Entity */
        relation: null,

        execute: function() {
            var relationType = this.relation.type;
            var relationName = this.relation.name;
            var oid = this.source.get('oid');
            var displayValue = Model.getTypeFromOid(oid).getDisplayValue(this.source);

            var deferred = new Deferred();
            new ObjectSelectDlg({
                type: relationType,
                title: Dict.translate("Choose Objects"),
                message: Dict.translate("Select <em>%0%</em> objects, you want to link to <em>%1%</em>",
                    [Dict.translate(relationType), displayValue]),
                okCallback: lang.hitch(this, function(dlg) {
                    var store = RelationStore.getStore(oid, relationName);

                    var oids = dlg.getSelectedOids();
                    var deferredList = [];
                    for (var i=0, count=oids.length; i<count; i++) {
                        var entity = new Entity({ oid:oids[i] });
                        deferredList.push(store.put(entity, {overwrite: true}));
                    }
                    all(deferredList).then(lang.hitch(this, function(results) {
                        // callback completes
                        deferred.resolve(results);
                    }), lang.hitch(this, function(error) {
                        // error
                        deferred.reject(error);
                    }));
                    return all(deferredList);
                })
            }).show();
            return deferred;
        }
    });
});
