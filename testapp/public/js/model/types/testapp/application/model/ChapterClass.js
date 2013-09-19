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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Thu Sep 19 00:55:39 CEST 2013.
 * Manual modifications should be placed inside the protected regions.
 */
define([
    "dojo/_base/declare",
    "app/js/model/meta/Node"
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/ChapterClass.js/Define) ENABLED START
// PROTECTED REGION END
], function(
    declare,
    Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/ChapterClass.js/Params) ENABLED START
// PROTECTED REGION END
) {
    var Chapter = declare([Node
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/ChapterClass.js/Declare) ENABLED START
// PROTECTED REGION END
    ], {
        typeName: 'testapp.application.model.Chapter',
        isSortable: true,
        displayValues: [
            "name"
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
        }, {
            name: "fk_chapter_id",
            type: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }, {
            name: "fk_book_id",
            type: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }, {
            name: "fk_author_id",
            type: "",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_IGNORE'],
            isReference: false
        }, {
            name: "name",
            type: "String",
            isEditable: true,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "created",
            type: "Date",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "creator",
            type: "String",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "modified",
            type: "Date",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "last_editor",
            type: "String",
            isEditable: false,
            inputType: 'text',
            displayType: 'text',
            regexp: '',
            regexpDesc: '',
            tags: ['DATATYPE_ATTRIBUTE'],
            isReference: false
        }, {
            name: "author_name",
            type: "Author",
            attribute: "name",
            isReference: true
        }],

        relations: [{
            name: "SubChapter",
            type: "Chapter",
            aggregationKind: "composite",
            maxMultiplicity: "unbounded",
            thisEndName: "ParentChapter",
            relationType: "child"
        }, {
            name: "TitleImage",
            type: "Image",
            aggregationKind: "shared",
            maxMultiplicity: "1",
            thisEndName: "TitleChapter",
            relationType: "child"
        }, {
            name: "NormalImage",
            type: "Image",
            aggregationKind: "shared",
            maxMultiplicity: "unbounded",
            thisEndName: "NormalChapter",
            relationType: "child"
        }, {
            name: "Author",
            type: "Author",
            aggregationKind: "none",
            maxMultiplicity: "1",
            thisEndName: "Chapter",
            relationType: "parent"
    }, {
            name: "Book",
            type: "Book",
            aggregationKind: "none",
            maxMultiplicity: "1",
            thisEndName: "Chapter",
            relationType: "parent"
    }, {
            name: "ParentChapter",
            type: "Chapter",
            aggregationKind: "none",
            maxMultiplicity: "1",
            thisEndName: "SubChapter",
            relationType: "parent"
        }]

// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/ChapterClass.js/Body) ENABLED START
        , listView: 'app/js/ui/data/widget/EntityListWidget'
        , detailView: 'app/js/ui/data/widget/EntityFormWidget'
// PROTECTED REGION END
    });
// PROTECTED REGION ID(testapp/public/js/model/types/testapp/application/model/ChapterClass.js/Static) ENABLED START
// PROTECTED REGION END
    return Chapter;
});
