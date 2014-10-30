define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/form/DateTextBox",
    "dojo/date/locale",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary"
],
function(
    declare,
    lang,
    topic,
    DateTextBox,
    locale,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict
) {
    return declare([DateTextBox, _HelpMixin, _AttributeWidgetMixin], {

        intermediateChanges: true,
        hasDownArrow: false,
        inputType: null, // control description as string as used in Factory.getControlClass()
        original: {},

        dateFormat: {selector: 'date', datePattern: 'yyyy-MM-dd HH:mm:ss', locale: appConfig.uiLanguage},

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
            // add time, if missing
            if (this.value && this.value.length === 10) {
                this.value = this.value+" 00:00:00";
            }
            try {
                this.value = locale.parse(this.value, this.dateFormat);
            }
            catch (e) {
                console.log("Illegal date instance: "+this.value);
            }
        },

        postCreate: function() {
            this.inherited(arguments);

            // subscribe to entity change events to change tab links
            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if (data.name === this.name) {
                        this.set("value", locale.parse(data.newValue, this.dateFormat));
                    }
                }))
            );
        },

        _getValueAttr: function() {
            var value = this.inherited(arguments);
            if (value) {
                var dateFormat = this.dateFormat;
                value.toJSON = function() {
                    return locale.format(this, dateFormat);
                };
            }
            return value;
        }
    });
});