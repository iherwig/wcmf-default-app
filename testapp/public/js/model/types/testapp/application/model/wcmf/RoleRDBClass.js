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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Fri Apr 26 13:28:18 CEST 2013.
 * Manual modifications should be placed inside the protected regions.
 */
define([
    "dojo/_base/declare",
    "app/model/meta/Node"
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/RoleRDBClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/RoleRDBClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var RoleRDB = declare([Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/RoleRDBClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: 'testapp\\application\\model\\wcmf\\RoleRDB',
        isSortable: false,
        displayValues: [
            "name"
        ],

        attributes: [{
            name: "id",
            type: "",
            isEditable: false,
            inputType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }, {
            name: "name",
            type: "String",
            isEditable: true,
            inputType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }],

        relations: [{
            name: "UserRDB",
            type: "UserRDB",
            aggregrationKind: "none",
            maxMultiplicity: "unbounded",
            thisEndName: "RoleRDB",
            relationType: "child"
        }]

// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/RoleRDBClass.js/Body) ENABLED START
// PROTECTED REGION END
    });
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/RoleRDBClass.js/Static) ENABLED START
// PROTECTED REGION END
    return RoleRDB;
});
  