define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "../../../../model/meta/Model"
], function (
    declare,
    lang,
    on,
    Model
) {
    /**
     * Attribute widget mixin. Manages the dirty flag.
     */
    return declare([], {
        required: false,
        _isDirty: false,

        postCreate: function() {
            this.inherited(arguments);

            this.own(
                on(this, "change", lang.hitch(this, function() {
                    this.setDirty(true);
                }))
            );
        },

        setDirty: function(isDirty) {
            this._isDirty = isDirty;
        },

        isDirty: function() {
            return this._isDirty;
        },

        getAttributeDefinition: function(entity, name) {
            if (entity) {
                var typeClass = Model.getTypeFromOid(entity.oid);
                return typeClass.getAttribute(name);
            }
            return null;
        },

        getDisplayType: function(entity, name) {
            var attribute = this.getAttributeDefinition(entity, name);
            return attribute ? attribute.displayType : 'text';
        }
    });
});