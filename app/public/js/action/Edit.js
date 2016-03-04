define([
    "dojo/_base/declare",
    "./ActionBase",
    "../model/meta/Model"
], function (
    declare,
    ActionBase,
    Model
) {
    return declare([ActionBase], {

        name: 'edit',
        iconClass: 'fa fa-pencil',

        route: '',
        page: null,

        // action parameters
        entity: null,

        execute: function() {
            var oid = this.entity.get('oid');
            var route = this.page.getRoute(this.route);
            var type = Model.getSimpleTypeName(Model.getTypeNameFromOid(oid));
            var id = Model.getIdFromOid(oid);
            var pathParams = { type:type, id:id };
            var url = route.assemble(pathParams);
            this.page.pushConfirmed(url);
        }
    });
});
