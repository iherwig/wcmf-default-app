define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/form/CheckBox",
    "../../../../locale/Dictionary",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin"
],
function(
    declare,
    lang,
    topic,
    CheckBox,
    Dict,
    _HelpMixin,
    _AttributeWidgetMixin
) {
    return declare([CheckBox, _HelpMixin, _AttributeWidgetMixin], {

        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: {},

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
            this.checked = this.value == 1; // value may be string or number
        },

        postCreate: function() {
            this.inherited(arguments);

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        this.set("value", data.newValue);
                    }
                }))
            );
        },

        _getValueAttr: function() {
            return this.get("checked") ? "1" : "0";
        }
    });
});