define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/form/Textarea",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary"
],
function(
    declare,
    lang,
    topic,
    TextArea,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict
) {
    return declare([TextArea, _HelpMixin, _AttributeWidgetMixin], {

        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        original: {},

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
        },

        postCreate: function() {
            this.inherited(arguments);

            // subscribe to entity change events to change tab links
            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if (data.name === this.name) {
                        this.set("value", data.newValue);
                    }
                }))
            );
        }
    });
});