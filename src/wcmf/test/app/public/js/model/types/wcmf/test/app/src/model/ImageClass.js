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
// PROTECTED REGION ID(wcmf/test/app/public/js/model/types/wcmf/test/app/src/model/ImageClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(wcmf/test/app/public/js/model/types/wcmf/test/app/src/model/ImageClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var Image = declare([Node
// PROTECTED REGION ID(wcmf/test/app/public/js/model/types/wcmf/test/app/src/model/ImageClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: "wcmf.test.app.src.model.Image",
        description: "",
        isSortable: true,
        displayValues: ["filename"],
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
            name: "fk_chapter_id",
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
            name: "fk_titlechapter_id",
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
            name: "filename",
            type: "String",
            description: "",
            isEditable: true,
            inputType: 'filebrowser',
            displayType: 'image',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "created",
            type: "Date",
            description: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "creator",
            type: "String",
            description: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "modified",
            type: "Date",
            description: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }, {
            name: "last_editor",
            type: "String",
            description: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            validateType: '',
            validateDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            defaultValue: null,
            isReference: false
        }],

        relations: [{
            name: "TitleChapter",
            type: "Chapter",
            aggregationKind: "none",
            maxMultiplicity: "1",
            thisEndName: "TitleImage",
            relationType: "parent"
        }, {
            name: "NormalChapter",
            type: "Chapter",
            aggregationKind: "none",
            maxMultiplicity: "1",
            thisEndName: "NormalImage",
            relationType: "parent"
        }]

// PROTECTED REGION ID(wcmf/test/app/public/js/model/types/wcmf/test/app/src/model/ImageClass.js/Body) ENABLED START
        , listView: 'app/js/ui/data/widget/EntityListWidget'
        , detailView: 'app/js/ui/data/widget/EntityFormWidget'
// PROTECTED REGION END
    });
// PROTECTED REGION ID(wcmf/test/app/public/js/model/types/wcmf/test/app/src/model/ImageClass.js/Static) ENABLED START
// PROTECTED REGION END
    return Image;
});
  