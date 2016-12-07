/**
 * This file was generated by ChronosGenerator wcmf-1.0.6.0001 from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
define([
    "dojo/_base/declare",
    "app/js/model/meta/Node"
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/UserClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/UserClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var User = declare([Node
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/UserClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: "app.src.model.wcmf.User",
        description: "",
        isSortable: false,
        displayValues: ["login"],
        pkNames: ["id"],
        relationOrder: [],

        attributes: [{
            name: "id",
            type: "",
            description: "",
            isEditable: false,
            inputType: "text",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_IGNORE"],
            defaultValue: null,
            isReference: false
        }, {
            name: "login",
            type: "String",
            description: "",
            isEditable: true,
            inputType: "text",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_ATTRIBUTE"],
            defaultValue: null,
            isReference: false
        }, {
            name: "password",
            type: "String",
            description: "",
            isEditable: true,
            inputType: "password",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_ATTRIBUTE"],
            defaultValue: null,
            isReference: false
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
            isReference: false
        }, {
            name: "firstname",
            type: "String",
            description: "",
            isEditable: true,
            inputType: "text",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_ATTRIBUTE"],
            defaultValue: null,
            isReference: false
        }, {
            name: "config",
            type: "String",
            description: "",
            isEditable: true,
            inputType: "select:{\"list\":{\"type\":\"file\",\"paths\":[\"../config\"],\"pattern\":\"\\\\.ini$\",\"emptyItem\":\"\"}}",
            displayType: "text",
            validateType: "",
            validateDesc: "",
            tags: ["DATATYPE_ATTRIBUTE"],
            defaultValue: null,
            isReference: false
        }],

        relations: [{
            name: "UserConfig",
            type: "UserConfig",
            fkName: "fk_userconfig_id",
            aggregationKind: "composite",
            maxMultiplicity: "unbounded",
            thisEndName: "User",
            isSortable: false,
            relationType: "child"
        }, {
            name: "Role",
            type: "Role",
            fkName: "fk_role_id",
            aggregationKind: "none",
            maxMultiplicity: "unbounded",
            thisEndName: "User",
            isSortable: false,
            relationType: "child"
        }]

// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/UserClass.js/Body) ENABLED START
        , listView: 'app/js/ui/data/widget/EntityListWidget'
        , detailView: 'app/js/ui/admin/widget/UserFormWidget'
// PROTECTED REGION END
    });
// PROTECTED REGION ID(app/public/js/model/types/app/src/model/wcmf/UserClass.js/Static) ENABLED START
// PROTECTED REGION END
    return User;
});
