define([
    "dojo/_base/declare",
    "dojo/_base/lang",
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

        source: null, /* Entity */
        relation: null,

        /**
         * Show a object selection dialog and execute the link action for
         * the selected objects on the store
         * @param e The event that triggered execution, might be null
         * @return Deferred
         */
        execute: function(e) {
            this.init();
            return new ObjectSelectDlg({
                type: this.relation.type,
                title: Dict.translate("Choose Objects"),
                message: Dict.translate("Select <em>%0%</em> objects, you want to link to <em>%1%</em>",
                    [Dict.translate(this.relation.type), Model.getTypeFromOid(this.source.get('oid')).getDisplayValue(this.source)]),
                okCallback: lang.hitch(this, function(dlg) {
                    var store = RelationStore.getStore(this.source.get('oid'), this.relation.name);

                    var oids = dlg.getSelectedOids();
                    var deferredList = [];
                    for (var i=0, count=oids.length; i<count; i++) {
                        var entity = new Entity({ oid:oids[i] });
                        deferredList.push(store.put(entity, {overwrite: true}));
                    }
                    all(deferredList).then(lang.hitch(this, function(results) {
                        // callback completes
                        this.callback(results);
                    }), lang.hitch(this, function(error) {
                        // error
                        this.errback(error);
                    }));
                    return all(deferredList);
                })
            }).show();
        }
    });
});
