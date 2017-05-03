define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojox/widget/ColorPicker",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary"
],
function(
    declare,
    lang,
    topic,
    ColorPicker,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict
) {
    return declare([ColorPicker, _HelpMixin, _AttributeWidgetMixin], {

        intermediateChanges: true,
        liveUpdate: true,
        animatePoint: false,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
            this.value = this.value ? (this.value.match(/#[0-9a-f]{6}/i) ? this.value : '#FFFFFF') : '#FFFFFF';
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

        setColor: function(value) {
            value = !value ? '#FFFFFF' : value;
            this.inherited(arguments);
        },

        startup: function() {
            this.inherited(arguments);
            this.setColor(this.value);
        }
    });
});