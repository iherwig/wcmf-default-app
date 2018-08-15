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
    "dojo/dom-attr",
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
    domAttr,
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
        selectedOptions: [], // the selected items from the ListStore
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
                    if (!this.get('disabled')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.dropDownButton.toggleDropDown();
                    }
                }))
            );

            this.setText();
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
            this.selectedOptions = this.translateValuesToOptions(newValue, false);
            this.setText();
        },

        _getValueAttr: function() {
            var value = this.options.length ? this.selectedOptions.map(function(option) {
                return option.item.value;
            }) : this.value;
            return (this.valueSeparator != null) ? value.join(this.valueSeparator) : value;
        },

        _setValueAttr: function(value, priorityChange, displayedValue, options) {
            // if the parent class calls setValue with the store ids,
            // we need to translate them to the real item values first
            if (value == this._pendingValue) {
                value = this.translateOptionsToValues(value, true);
            }

            // split string into list value
            if (this.valueSeparator != null) {
                arguments[0] = value = (value && typeof value === 'string' ? value.split(this.valueSeparator) : value)
            }

            // since the value of the options in the ListStore is stored in
            // their value property and not in the id property, we need to
            // change the behaviour of the parent class, which uses the id
            // property as value
            if (options) {
                // if an item is given, we can fall back to the
                // parent class' behaviour
                this.selectedOptions = options;
                this.inherited(arguments);
                return;
            }
            // find the options with the value property equal to value
            var args = arguments;

            var setSelectedOptions = lang.hitch(this, function(options) {
                this.selectedOptions = [];
                var ids = [];
                var labels = [];
                array.forEach(options, lang.hitch(this, function(option) {
                    ids.push(option.item ? option.item.oid : option);
                    labels.push(option.item ? option.item.displayText : option);
                    this.selectedOptions.push(option);
                }));
                this.inherited(args, [ids, priorityChange, labels, options]);
            });

            if (this.inputType) {
                setSelectedOptions(this.translateValuesToOptions(value, true));
            }
            else {
                // TODO use this.store, if FilteringSelect uses store api
                var store = !this.store.filter ? this.store.store : this.store;
                store.filter({value: 'eq='+value}).forEach(lang.hitch(this, function (object) {
                    setSelectedOptions(object);
                }));
            }
        },

        _setDisabledAttr: function(value) {
            if (this.dropDown && this.dropDownButton) {
                this.inherited(arguments);
            }
            if (value) {
                this.close();
                domAttr.set(this.textbox, 'disabled', 'disabled');
            }
            else {
                domAttr.remove(this.textbox, 'disabled');
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

        setText: function() {
            var labels = this.options.length ? this.selectedOptions.map(function(option) {
                return option.label;
            }) : [];
            var numTexts = labels.length;
            var text = (numTexts === 0) ? this.emptyText :
                  ((numTexts <= 3) ? labels.join(", ") : Dict.translate("%0% selected", [numTexts]));
            html.set(this.textbox, text+' <b class="caret"></b>');
        },

        translateValuesToOptions: function(values, useItemValue) {
            values = values && !(values instanceof Array) ? [values] : values;
            return values && this.options.length ? values.map(lang.hitch(this, function(val) {
                return this.findOptionByValue(val, useItemValue);
            })) : values;
        },

        translateOptionsToValues: function(options, useItemValue) {
            return options ? options.map(lang.hitch(this, function(val) {
                return useItemValue ? this.options[val].item.value : this.options[val].value;
            })) : options;
        },

        findOptionByValue: function(value, useItemValue) {
            for (var i=0, count=this.options.length; i<count; i++) {
                var optionValue = useItemValue ? this.options[i].item.value : this.options[i].value;
                if (optionValue == value) {
                    return this.options[i];
                }
            }
            return value;
        },

        positionDropdown: function() {
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