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
        parentRelations: null,
        childRelations: null,

        /**
         * Get all relation definitions
         * @param type Optional relation type, 'parent' or 'child'
         * @return Array
         */
        getRelations: function(type) {
            if (type === 'child' || type === 'parent') {
              var varname = type+'Relations';
              if (!this[varname]) {
                var rel = [];
                for(var i=0, count=this.relations.length; i<count; i++) {
                  var relation = this.relations[i];
                  if (relation.relationType === type) {
                    rel.push(relation);
                  }
                }
                this[varname] = rel;
              }
              return this[varname];
            }
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
         * Check if the given role name belongs to a many to many relation
         * @param roleName The name of the role
         * @return Boolean
         */
        isManyToManyRelation: function(roleName) {
            var relation = this.getRelation(roleName);
            var otherRelation = Model.getType(relation.type).getRelation(relation.thisEndName);
            return this.isMany(relation.maxMultiplicity) &&
                    this.isMany(otherRelation.maxMultiplicity);
        },

        /**
         * Check if the multiplicity belongs to a many end
         * @param multiplicity
         * @return Boolean
         */
        isMany: function(multiplicity) {
            return multiplicity > 1 || multiplicity === "unbounded";
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
                    result = Dict.translate("New <em>%0%</em>",
                        [Dict.translate(Model.getSimpleTypeName(type.typeName))]);
                }
                else {
                    var values = [];
                    for (var i=0; i<type.displayValues.length; i++) {
                        var curValue = type.displayValues[i];
                        var curAttribute = type.getAttribute(curValue);
                        var renderedValue = Renderer.render(entity[curValue], curAttribute, true);
                        if (renderedValue && renderedValue.length > 0) {
                            values.push(renderedValue);
                        }
                    }
                    result = values.join(" - ");
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
