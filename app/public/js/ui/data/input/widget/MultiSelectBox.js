define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/topic",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/html",
    "dijit/registry",
    "dojox/form/CheckedMultiSelect",
    "../Factory",
    "dstore/legacy/DstoreAdapter",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary",
    "dojo/text!./template/MultiSelect.html"
],
function(
    declare,
    lang,
    array,
    on,
    topic,
    Deferred,
    all,
    domConstruct,
    domGeom,
    domStyle,
    html,
    registry,
    CheckedMultiSelect,
    ControlFactory,
    DstoreAdapter,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([CheckedMultiSelect, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        valueSeparator: ',', // char that is used to separate values, set to null, to use arrays in getters and setters

        spinnerNode: null,

        labelAttr: "displayText",
        searchAttr: "displayText",
        dropDown: true,
        multiple: true,
        sortByLabel: false,

        emptyText: Dict.translate("None selected"),

        constructor: function(args) {
            // TODO remove store adapter if not required by select any more
            if (!args.store) {
              // get store from input type, if not set yet
                args.store = new DstoreAdapter(ControlFactory.getListStore(args.inputType));
            }
            else if (!args.store.query) {
                args.store = DstoreAdapter(args.store);
            }
            // TODO remove this, after control is migrated to dstore api
            args.store.getLabel = function(object) {
                return object.label;
            };

            declare.safeMixin(this, args);
            this.label = Dict.translate(this.name);
        },

        postCreate: function() {
            this.inherited(arguments);

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        this.set("value", data.newValue);
                    }
                })),
                on(this.textbox, "click", lang.hitch(this, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.dropDownButton.toggleDropDown();
                }))
            );

            this.setText(this.value);
        },

        startup: function(){
            this.inherited(arguments);
            this.own(
                on(this.dropDownMenu, "open", lang.hitch(this, function() {
                    this.positionDropdown();
                })),
                on(window, 'scroll', lang.hitch(this, function(evt) {
                    this.close();
                }))
            );
        },

        onChange: function(newValue) {
            this.inherited(arguments);
            this.setText(newValue);
        },

        _setValueAttr: function(value) {
            if (this.valueSeparator != null) {
                arguments[0] = value && typeof value === 'string' ? value.split(this.valueSeparator) : value;
            }
            this.inherited(arguments);
        },

        _getValueAttr: function() {
            var valueType = typeof this.value;
            return (this.valueSeparator != null && (valueType === 'array' || valueType === 'object')) ? this.value.join(this.valueSeparator) : this.value;
        },

        _setDisabledAttr: function(value) {
            if (this.dropDown && this.dropDownButton) {
              this.inherited(arguments);
            }
            if (value) {
                this.close();
            }
        },

        close: function() {
            if (this.dropDownButton) {
                this.dropDownButton.closeDropDown();
            }
        },

        destroy: function() {
            this.close();
            this.inherited(arguments);
        },

        setText: function(values) {
            this.translateValuesToOptions(values).then(lang.hitch(this, function(options) {
                var numOptions = options.length;
                var text = (numOptions === 0) ? this.emptyText :
                      ((numOptions <= 3) ? options.join(", ") : Dict.translate("%0% selected", [numOptions]));
                html.set(this.textbox, text+' <b class="caret"></b>');
            }));
        },

        translateValuesToOptions(values) {
            var deferred = new Deferred();
            var deferredList = [];
            array.forEach(values, lang.hitch(this, function(value) {
              deferredList.push(ControlFactory.translateValue(this.inputType, value));
            }));
            all(deferredList).then(function(results) {
                deferred.resolve(results);
            });
            return deferred;
        },

        positionDropdown() {
            if (this.dropDownMenu && this.dropDownMenu.domNode.parentNode) {
                var pos = domGeom.position(this.domNode);
                domStyle.set(this.dropDownMenu.domNode.parentNode, {
                    left: pos.x + "px",
                    top: pos.y + pos.h + window.scrollY + "px"
                });
            }
        }
    });
});