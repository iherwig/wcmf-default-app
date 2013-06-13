define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/form/DateTextBox"
],
function(
    declare,
    lang,
    topic,
    DateTextBox
) {
    return declare([DateTextBox], {

        intermediateChanges: true,
        hasDownArrow: false,
        entity: {},
        attribute: {},
        original: {},

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = this.attribute.name;
            this.disabled = !this.attribute.isEditable;
            this.name = this.attribute.name;
            this.value = this.entity[this.attribute.name];
        },

        postCreate: function() {
            this.inherited(arguments);

            // subscribe to entity change events to change tab links
            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if (data.name === this.attribute.name) {
                        this.set("value", data.newValue);
                    }
                }))
            );
        }
    });
});