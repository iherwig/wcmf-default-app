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

        name: 'create',
        iconClass: 'fa fa-star',

        route: '',
        source: null, /* Entity */
        relation: null,
        page: null,

        /**
         * Constructor. For additional parameters see ActionBase.
         * @param page Instance of _PageMixin used for navigation
         */
        constructor: function(args) {
            declare.safeMixin(this, args);
        },

        /**
         * Navigate to create page for an object that is in relation to source
         * @param e The event that triggered execution, might be null
         * @param type Name of the type to create
         */
        execute: function(e, type) {
            this.init(type);
            var route = this.page.getRoute(this.route);
            var oid = Model.createDummyOid(type);
            var pathParams = { type:type, id:Model.getIdFromOid(oid) };
            var url = route.assemble(pathParams);
            url += "?oid="+this.source.get('oid')+"&relation="+this.relation.name;
            this.page.pushConfirmed(url);
        }
    });
});
