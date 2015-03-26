define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "./Model",
    "../../locale/Dictionary",
    "../../ui/data/display/Renderer"
], function(
    declare,
    array,
    Model,
    Dict,
    Renderer
) {
    var Node = declare(null, {

        typeName: '',
        isSortable: false,
        displayValues: [],
        attributes: [],
        relations: [],

        /**
         * Get all relation definitions
         * @return Array
         */
        getRelations: function() {
            return this.relations;
        },

        /**
         * Get a relation definition for a given role name
         * @param roleName The name of the role
         * @return Object
         */
        getRelation: function(roleName) {
            for (var i=0, count=this.relations.length; i<count; i++) {
                if (this.relations[i].name === roleName) {
                    return this.relations[i];
                }
            }
            return null;
        },

        /**
         * Get the Node for a given role name
         * @param roleName The name of the role
         * @return Node
         */
        getTypeForRole: function(roleName) {
            var relation = this.getRelation(roleName);
            if (relation !== null) {
                return Model.getType(relation.type);
            }
            return null;
        },

        /**
         * Get the attribute definitions
         * @param tag Optional tag that the attributes should have
         * @return Array
         */
        getAttributes: function(tag) {
            var result = [];
            for (var i=0, count=this.attributes.length; i<count; i++) {
                var attribute = this.attributes[i];
                if (!tag || array.indexOf(attribute.tags, tag) !== -1) {
                    result.push(attribute);
                }
            }
            return result;
        },

        /**
         * Get the attribute definition for a given name
         * @param name The name of the attribute
         * @return Object
         */
        getAttribute: function(name) {
            for (var i=0, count=this.attributes.length; i<count; i++) {
                var attribute = this.attributes[i];
                if (attribute.name === name) {
                    return attribute;
                }
            }
            return null;
        },

        /**
         * Get the display value for the given entity.
         * @param entity Entity to get the value for
         * @return String
         */
        getDisplayValue: function(entity) {
            var result = '';
            var oid = entity.get('oid');
            var type = Model.getTypeFromOid(oid);
            if (type) {
                if (Model.isDummyOid(oid)) {
                    result = Dict.translate("New %0%",
                        [Dict.translate(Model.getSimpleTypeName(type.typeName))]);
                }
                else {
                    for (var i=0; i<type.displayValues.length; i++) {
                        var curValue = type.displayValues[i];
                        var curAttribute = type.getAttribute(curValue);
                        result += Renderer.render(entity[curValue], curAttribute, true)+" | ";
                    }
                    result = result.substring(0, result.length-3);
                }
            }
            else {
                result = oid || "unknown";
            }
            return result;
        },

        /**
         * Check if the given attribute is editable in the given entity.
         * The default implementation returns the isEditable property of the attribute.
         * @param entity The entity
         * @return Boolean
         */
        isEditable: function(attribute, entity) {
            return attribute.isEditable;
        }
    });

    return Node;
});
