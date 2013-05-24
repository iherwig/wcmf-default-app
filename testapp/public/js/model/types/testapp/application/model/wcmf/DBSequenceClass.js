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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Fri May 24 19:15:58 CEST 2013.
 * Manual modifications should be placed inside the protected regions.
 */
define([
    "dojo/_base/declare",
    "app/model/meta/Node"
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/DBSequenceClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/DBSequenceClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var DBSequence = declare([Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/DBSequenceClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: 'testapp.application.model.wcmf.DBSequence',
        isSortable: false,
        displayValues: [
        ],
        pkNames: [
            "id"
        ],

        attributes: [{
            name: "id",
            type: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }],

        relations: []

// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/DBSequenceClass.js/Body) ENABLED START
        , listView: 'js/ui/data/widget/EntityListWidget'
        , detailView: 'js/ui/data/widget/EntityFormWidget'
// PROTECTED REGION END
    });
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/wcmf/DBSequenceClass.js/Static) ENABLED START
// PROTECTED REGION END
    return DBSequence;
});
  