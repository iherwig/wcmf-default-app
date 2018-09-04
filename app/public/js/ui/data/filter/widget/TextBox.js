define( [
    "dojo/_base/declare",
    "./_FilterWidgetMixin",
    "../../../../model/meta/Model",
    "../../../../persistence/Entity",
    "../../input/widget/TextBox"
],
function(
    declare,
    _FilterWidgetMixin,
    Model,
    Entity,
    TextBox
) {
    return declare([_FilterWidgetMixin], {

        control: null,
        type: null, // type to filter
        attribute: null, // attribute to filter
        filterCtr: null, // filter constructor (see https://github.com/SitePen/dstore/blob/master/docs/Collection.md#filtering)

        constructor: function(args) {
            declare.safeMixin(this, args);
            this.control = new TextBox({
                name: args.attribute,
                inputType: args.inputType,
                entity: new Entity({oid: Model.createDummyOid(args.type)}),
            });
        },

        getControl: function() {
            return this.control;
        },

        getFilter: function() {
            var value = this.control.get('value');
            if (value !== undefined && value !== null && value !== '') {
                return (new this.filterCtr()).match(this.type+'.'+this.attribute, new RegExp('.*'+value+'.*', 'i'));
            }
            return null;
        }
    });
});