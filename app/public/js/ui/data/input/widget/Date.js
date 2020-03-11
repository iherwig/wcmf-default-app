define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/topic",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dijit/form/_FormValueWidget",
    "dijit/form/DateTextBox",
    "dijit/form/TimeTextBox",
    "../Factory",
    "dojo/date/locale",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary",
    "dojo/text!./template/DateTime.html"
],
function(
    declare,
    lang,
    config,
    topic,
    on,
    ContentPane,
    _FormValueWidget,
    DateTextBox,
    TimeTextBox,
    ControlFactory,
    locale,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([ContentPane, _FormValueWidget, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,

        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        dateTextBox: null,
        timeTextBox: null,

        datePatterns: {
          datetime: 'yyyy-MM-dd HH:mm',
          date: 'yyyy-MM-dd',
          time: 'HH:mm'
        },

        dateType: 'date', // default type

        dateFormat: {selector: 'date', datePattern: 'yyyy-MM-dd', locale: config.app.uiLanguage},

        constructor: function(args) {
            declare.safeMixin(this, args);

            // determine date type and pattern from inputType definition
            var options = ControlFactory.getOptions(this.inputType);
            if (options.type && this.datePatterns[options.type]) {
              this.dateType = options.type;
              this.dateFormat.selector = this.dateType === 'time' ? 'time' : 'date';
              this.dateFormat.datePattern = this.datePatterns[this.dateType];
            }

            this.label = Dict.translate(this.name);
            this.value = this.convertToDate(this.value);
        },

        postCreate: function() {
            this.inherited(arguments);

            var date =  this.convertToDate(this.value);
            var insertIndex = 0;

            this.dateTextBox = new DateTextBox({
                value: date,
                disabled: this.disabled,
                intermediateChanges: true,
                hasDownArrow: false,
                style: { width: '150px', marginRight: '10px' }
            });
            if (this.dateType === 'date' || this.dateType === 'datetime') {
              this.addChild(this.dateTextBox, insertIndex++);
            }

            this.timeTextBox = new TimeTextBox({
                value: date,
                disabled: this.disabled,
                intermediateChanges: true,
                hasDownArrow: false,
                style: { width: '70px' }
            });
            if (this.dateType === 'time' || this.dateType === 'datetime') {
              this.addChild(this.timeTextBox, insertIndex++);
            }

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        this.set("value", this.convertToDate(data.newValue));
                    }
                })),
                on(this.dateTextBox, "change", lang.hitch(this, function() {
                  this.set("value", this.getControlsValue());
                })),
                on(this.timeTextBox, "change", lang.hitch(this, function() {
                  this.set("value", this.getControlsValue());
                }))
            );
        },

        _setDisabledAttr: function(value) {
            this.inherited(arguments);
            if (this.dateTextBox) {
              this.dateTextBox.set("disabled", value);
            }
            if (this.timeTextBox) {
              this.timeTextBox.set("disabled", value);
            }
        },

        _getValueAttr: function() {
            var dateValue = this.getControlsValue();
            if (dateValue) {
                var dateFormat = this.dateFormat;
                dateValue.toJSON = function() {
                    return locale.format(dateValue, dateFormat);
                };
            }
            return dateValue;
        },

        convertToDate: function(value) {
            if (typeof value === "string" || value instanceof String) {
                // NOTE: we expect the following values depending on dateType:
                //       - datetime: yyyy-MM-dd HH:mm[:ss]
                //       - date:     yyyy-MM-dd[ HH:mm[:ss]]
                //       - time:     HH:mm[:ss]
                var strValue = value.substring(0, this.dateFormat.datePattern.length);
                value = locale.parse(strValue, this.dateFormat);
            }
            return value;
        },

        getControlsValue: function() {
          var dateValue = this.dateTextBox.get("value");
          var timeValue = this.timeTextBox.get("value");
          if (dateValue && timeValue) {
              dateValue.setHours(timeValue.getHours());
              dateValue.setMinutes(timeValue.getMinutes());
          }
          return dateValue;
        }
    });
});