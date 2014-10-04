define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojox/form/CheckedMultiSelect",
    "../Factory",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../model/meta/Model",
    "../../../../locale/Dictionary",
    "dojo/text!./template/MultiSelect.html",
    "xstyle/css!dojox/form/resources/CheckedMultiSelect.css",
    "xstyle/css!./template/MultiSelect.css"
],
function(
    declare,
    lang,
    on,
    topic,
    domGeom,
    domStyle,
    CheckedMultiSelect,
    ControlFactory,
    _HelpMixin,
    _AttributeWidgetMixin,
    Model,
    Dict,
    template
) {
    return declare([CheckedMultiSelect, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        entity: {},
        attribute: {},
        original: {},

        spinnerNode: null,

        labelAttr: "displayText",
        searchAttr: "displayText",
        dropDown: true,
        multiple: true,

        constructor: function(args) {
            declare.safeMixin(this, args);

            var typeClass = Model.getTypeFromOid(this.entity.oid);

            this.label = Dict.translate(this.attribute.name);
            this.disabled = typeClass ? !typeClass.isEditable(this.attribute, this.entity) : false;
            this.name = this.attribute.name;
            this.value = this.entity[this.attribute.name];
            this.helpText = Dict.translate(this.attribute.description);

            this.store = ControlFactory.getListStore(this.attribute.inputType);
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
        },

        startup: function(){
            this.inherited(arguments);
            this.own(
                on(this.dropDownMenu, "open", lang.hitch(this, function() {
                    var textPos = domGeom.position(this.textbox);
                    var menuPos = domGeom.position(this.dropDownMenu.domNode.parentNode);
                    domStyle.set(this.dropDownMenu.domNode.parentNode, {
                        left: textPos.x + "px",
                        top: menuPos.y + "px"
                    });
                }))
            );
        },

        onChange: function(newValue) {
            this.inherited(arguments);
            this.textbox.value = newValue.join(", ");
        }
    });
});