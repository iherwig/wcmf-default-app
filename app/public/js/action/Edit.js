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

        /**
         * Constructor. For additional parameters see ActionBase.
         * @param page Instance of _PageMixin used for navigation
         */
        constructor: function(args) {
            declare.safeMixin(this, args);
        },

        /**
         * Navigate to edit page
         * @param e The event that triggered execution, might be null
         * @param entity Entity to edit
         */
        execute: function(e, entity) {
            if (this.init instanceof Function) {
                this.init(entity);
            }
            var oid = entity.get('oid');
            var route = this.page.getRoute(this.route);
            var type = Model.getSimpleTypeName(Model.getTypeNameFromOid(oid));
            var id = Model.getIdFromOid(oid);
            var pathParams = { type:type, id:id };
            var url = route.assemble(pathParams);
            this.page.pushConfirmed(url);
        }
    });
});
