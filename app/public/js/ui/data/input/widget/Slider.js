define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/form/HorizontalSlider",
    "../Factory",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary"
],
function(
    declare,
    lang,
    topic,
    HorizontalSlider,
    ControlFactory,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict
) {
    return declare([HorizontalSlider, _HelpMixin, _AttributeWidgetMixin], {

        intermediateChanges: true,
        showButtons: false,
        inputType: null, // control description as string as used in Factory.getControlClass()
        original: {},

        dateFormat: {selector: 'date', datePattern: 'yyyy-MM-dd HH:mm:ss', locale: appConfig.uiLanguage},

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);

            var options = ControlFactory.getOptions(this.inputType);
            this.minimum = options.min ? options.min : 0;
            this.maximum = options.max ? options.max : 100;
            this.discreteValues = options.step ? parseInt((this.maximum-this.minimum)/options.step) : (this.maximum-this.minimum);
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