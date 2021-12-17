define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojox/layout/TableContainer",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/query"
], function (
    declare,
    lang,
    TableContainer,
    domAttr,
    domConstruct,
    query
) {
    return declare([TableContainer], {

        cols: 2,
        orientation: 'vert',
        customClass: 'entity-form',

        layout: function() {
            this.inherited(arguments);

            // put input in same td as its label
            var labels = query(".entity-form-labelCell > label");
            labels.forEach(lang.hitch(this, function(item) {
              var input = query("*[widgetid=" + domAttr.get(item, "for") + "]");
              var inputParent = input.closest(".entity-form-valueCell");
              var infoIcon = dojo.query(item).next(".fa");
              domConstruct.place(input[0], infoIcon.length > 0 ? infoIcon[0] : item, "after");
              domConstruct.destroy(inputParent[0])
            }));
        }
    });
});