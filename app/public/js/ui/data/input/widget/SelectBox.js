define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/when",
    "dojo/on",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "virtual-select/dist/virtual-select.min",
    "../Factory",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary",
    "dojo/text!./template/Select.html"
],
function(
    declare,
    lang,
    topic,
    when,
    on,
    query,
    domConstruct,
    domStyle,
    domAttr,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    Select,
    ControlFactory,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _HelpMixin, _AttributeWidgetMixin, _AppAware], {

        templateString: template,
        intermediateChanges: true,

        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        supportsEntityLink: true,
        supportsMultiSelect: false,
        allowsNewOption: false,
        allowsClear: false,
        valueIsInteger: false,

        selectWidget: null,
        spinnerNode: null,

        selectEntityType: null,
        entityLink: null,

        constructor: function(args) {
            // convert store from DstoreAdapter
            if (args.store && args.store.store) {
                args.store = args.store.store;
            }
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);

            // get input type (could be overriden by subclass)
            var inputType = this.getInputType();

            // get store from input type, if not set yet
            if (!this.store) {
                this.store = ControlFactory.getListStore(inputType, this.getDisplayType(this.entity, this.name));
            }

            // get entity type, if this listbox is used to select entities
            if (this.supportsEntityLink) {
                var options = ControlFactory.getOptions(inputType);
                var isSelectingEntities = options && options.list && options.list.type == 'node';
                this.selectEntityType = isSelectingEntities && options.list.types && options.list.types.length == 1 ? options.list.types[0] : null;
            }

            // multivalued controls are only useful for a string attribute
            var attribute = this.getAttributeDefinition(this.entity, this.name);
            if (attribute) {
                this.valueIsInteger = attribute.type && attribute.type.toLowerCase() === 'integer';
                if (this.supportsMultiSelect && attribute.type && attribute.type.toLowerCase() !== 'string') {
                  throw new Error("Multivalued controls can only be used with a string attribute. "+
                          "Attribute '"+attribute.name+"' is of type "+attribute.type+".");
                }
            }

            // add css
            this.setCss('virtual-select', '/dist/virtual-select.min.css', 'all');
        },

        postCreate: function() {
            this.inherited(arguments);
            this.spinnerNode = domConstruct.create("p", {
                innerHTML: '<i class="fa fa-spinner fa-spin"></i>'
            }, this.domNode, "last");
            this.showSpinner();

            when(this.store.fetch(), lang.hitch(this, function(list) {
                this.hideSpinner();
                this.selectWidget = this.buildSelectWidget(list);
                this.own(
                    on(this.selectWidget, "change", lang.hitch(this, function() {
                        var controlValue = this.selectWidget.value;
                        this.value = controlValue ? (
                          this.supportsMultiSelect ? controlValue.join(',') : (
                            this.valueIsInteger ? parseInt(controlValue) : controlValue)
                        ) : null;
                        this.displayedValue = this.selectWidget.getDisplayValue();
                    })
                ));
                this.updateDisplay(this.value);
            }));

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        this.set("value", data.newValue);
                    }
                })),
                on(this, "attrmodified-value", lang.hitch(this, function(e) {
                    var value = e.detail.newValue;
                    this.updateDisplay(value);
                }))
            );
        },

        startup: function() {
            this.inherited(arguments);

            if (this.supportsEntityLink) {
                setTimeout(lang.hitch(this, function() {
                    this.setEntityLink();
                }), 100);
            }
        },

        getInputType: function() {
            return this.inputType;
        },

        buildSelectWidget: function(values) {
            var wrapper = domConstruct.create("div");
            this.domNode.appendChild(wrapper);

            VirtualSelect.init({
                ele: wrapper,
                multiple: this.supportsMultiSelect,
                allowNewOption: this.allowsNewOption,
                options: values.map(function(value) {
                    return { label: value.displayText, value: value.value };
                }),
                disabled: this.disabled,
                hideClearButton: !this.allowsClear,
                disableSelectAll: true,
                maxWidth: 'none',
                placeholder: '',
                search: true,
                noOptionsText: Dict.translate('No data'),
                noSearchResultsText: Dict.translate('No data'),
                searchPlaceholderText: Dict.translate('Search')
            });
            return wrapper;
        },

        updateDisplay: function(value) {
            if (this.supportsMultiSelect && typeof value == 'string') {
                value = value.split(',');
            }
            this.selectWidget.setValue(value);
        },

        _setDisabledAttr: function(value) {
            this.inherited(arguments);
            if (!this.selectWidget) {
                return;
            }
            if (value) {
                this.selectWidget.disable();
            }
            else {
                this.selectWidget.enable();
            }
        },

        showSpinner: function() {
            query(this.spinnerNode).style("display", "block");
        },

        hideSpinner: function() {
            query(this.spinnerNode).style("display", "none");
        },

        getStore: function() {
            return !this.store.filter ? this.store.store : this.store;
        },

        setStore: function(store) {
            this.store = store;
            when(this.store.fetch(), lang.hitch(this, function(list) {
                var options = list.map(function(value) {
                    return { label: value.displayText, value: value.value };
                })
                this.selectWidget.setOptions(options);
            }));
        },

        setEntityLink: function() {
            // set entity link
            if (this.displayedValue) {
                if (this.selectEntityType) {
                    var labelNodes = query("label[for="+this.get("id")+"]");
                    if (labelNodes.length > 0 && !this.entityLink) {
                        var html = '<a class="entity-link" href="#"><i class="fa fa-external-link"></i></a>';
                        this.entityLink = domConstruct.place(html, labelNodes[0], 'last');
                    }
                    if (this.entityLink) {
                        // calculate entity url
                        var route = this.page.router.getRoute('entity');
                        var pathParams = { type:this.selectEntityType, id:this.value };
                        var url = route.assemble(pathParams);
                        domAttr.set(this.entityLink, 'href', url);
                    }
                }
            }
            else if (this.entityLink) {
                domStyle.set(this.entityLink, { display: 'none' });
            }
        }
    });
});