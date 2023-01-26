define( [
    "dojo/_base/declare",
    "../../../../model/meta/Model",
    "./SelectBox"
],
function(
    declare,
    Model,
    SelectBox
) {
    return declare([SelectBox], {
        allowsNewOption: true,
        allowsClear: true,
        supportsEntityLink: false,

        getInputType: function() {
            // fallback if entity is undefined
            var inputType = 'select:{"list":{"type":"fix","items":[]}}';
            if (this.entity) {
                var entityType = Model.getFullyQualifiedTypeName(Model.getTypeNameFromOid(this.entity.oid));
                inputType = 'suggest:{"list":{"type":"suggest","attributes":["'+entityType+'.'+this.name+'"]}}';
            }
            return inputType;
        },

        _getValueAttr: function() {
            return this.selectWidget && (typeof this.selectWidget.value === 'string' && this.selectWidget.value.length > 0) ? this.selectWidget.value : "";
        }
    });
});