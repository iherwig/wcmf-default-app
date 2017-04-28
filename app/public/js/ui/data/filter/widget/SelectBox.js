define( [
    "dojo/_base/declare",
    "./_FilterWidgetMixin",
    "../../input/widget/SelectBox"
],
function(
    declare,
    _FilterWidgetMixin,
    SelectBox
) {
    return declare([_FilterWidgetMixin], {

        control: null,
        field: null, // field to filter
        filterCtr: null, // filter constructor (see https://github.com/SitePen/dstore/blob/master/docs/Collection.md#filtering)

        constructor: function(args) {
            declare.safeMixin(this, args);
            this.control = new SelectBox(args);
        },

        getControl: function() {
            return this.control;
        },

        getFilter: function() {
            var value = this.control.get('value');
            if (value !== undefined && value !== null && value !== '') {
                return (new this.filterCtr()).eq(this.field, value);
            }
            return null;
        }
    });
});