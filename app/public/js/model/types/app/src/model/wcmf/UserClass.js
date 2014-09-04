/*
 * Copyright (c) 2013 The Olympos Development Team.
 *
 * http://sourceforge.net/projects/olympos/
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html. If redistributing this code,
 * this entire header must remain intact.
 */

/**
 * This file was generated by ChronosGenerator  from model.uml.
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

        attributes: [{
            name: "id",
            type: "",
            description: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_IGNORE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "login",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "password",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'password',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "name",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "firstname",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "config",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'select#file:../config/|/\..ini$/',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }],

        relations: [{
            name: "UserConfig",
            type: "UserConfig",
            aggregationKind: "composite",
            maxMultiplicity: "unbounded",
            thisEndName: "User",
            relationType: "child"
        }, {
            name: "Role",
            type: "Role",
            aggregationKind: "none",
            maxMultiplicity: "unbounded",
            thisEndName: "User",
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

