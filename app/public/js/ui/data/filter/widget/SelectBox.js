define( [
    "dojo/_base/declare",
    "./_FilterWidgetMixin",
    "../../../../model/meta/Model",
    "../../../../persistence/Entity",
    "../../input/Factory",
    "../../input/widget/SelectBox"
],
function(
    declare,
    _FilterWidgetMixin,
    Model,
    Entity,
    ControlFactory,
    SelectBox
) {
    return declare([_FilterWidgetMixin], {

        required: false,
        control: null,
        type: null, // type to filter
        attribute: null, // attribute to filter
        filterCtr: null, // filter constructor (see https://github.com/SitePen/dstore/blob/master/docs/Collection.md#filtering)

        constructor: function(args) {
            declare.safeMixin(this, args);
            this.control = new SelectBox({
                name: args.attribute,
                inputType: ControlFactory.addEmptyItem(args.inputType, ''),
                entity: new Entity({oid: Model.createDummyOid(args.type)}),
            });
        },

        reset: function() {
            this.control.set('value', null);
            this.inherited(arguments);
        },

        getControl: function() {
            return this.control;
        },

        getFilter: function() {
            var value = this.control.get('value');
            if (value !== undefined && value !== null && value !== '') {
                // match with word boundary, because value could be inside comma separated list
                var filterValue = '[[:<:]]'+value+'[[:>:]]';
                return (new this.filterCtr()).match(this.type+'.'+this.attribute, filterValue);
            }
            return null;
        }
    });
});