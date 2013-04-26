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
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/LocktableClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/LocktableClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var Locktable = declare([Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/LocktableClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: 'testapp\\application\\model\\wcmf\\Locktable',
        isSortable: false,
        displayValues: [
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
            name: "fk_user_id",
            type: "",
            isEditable: false,
            inputType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }, {
            name: "objectid",
            type: "String",
            isEditable: false,
            inputType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "sessionid",
            type: "String",
            isEditable: false,
            inputType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "since",
            type: "Date",
            isEditable: false,
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
            maxMultiplicity: "1",
            thisEndName: "Locktable",
            relationType: "parent"
        }]

// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/LocktableClass.js/Body) ENABLED START
// PROTECTED REGION END
    });
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/LocktableClass.js/Static) ENABLED START
// PROTECTED REGION END
    return Locktable;
});
  