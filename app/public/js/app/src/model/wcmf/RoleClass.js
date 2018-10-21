/**
 * This file was generated by ChronosGenerator wcmf-1.0.25.0001 from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
define([
    "dojo/_base/declare",
    "app/js/model/meta/Node"
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/RoleClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/RoleClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var Role = declare([Node
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/RoleClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: "app.src.model.wcmf.Role",
        description: "",
        isSortable: false,
        displayValues: ["name"],
        pkNames: ["id"],
        relationOrder: [],

        attributes: [{
            name: "id",
            type: "Integer",
            description: "",
            isEditable: false,
            inputType: "text",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_IGNORE"],
            defaultValue: null,
            isReference: false,
            isTransient: false
        }, {
            name: "name",
            type: "String",
            description: "",
            isEditable: true,
            inputType: "text",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_ATTRIBUTE"],
            defaultValue: null,
            isReference: false,
            isTransient: false
        }],

        relations: [{
            name: "User",
            type: "User",
            fkName: "fk_user_id",
            aggregationKind: "shared",
            maxMultiplicity: "unbounded",
            thisEndName: "Role",
            isSortable: false,
            relationType: "child"
        }]

// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/RoleClass.js/Body) ENABLED START
        , listView: 'app/js/ui/data/widget/EntityListWidget'
        , detailView: 'app/js/ui/admin/widget/RoleFormWidget'
// PROTECTED REGION END
    });
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/RoleClass.js/Static) ENABLED START
// PROTECTED REGION END
    return Role;
});
