define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/when",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/topic",
    "dijit/form/FilteringSelect",
    "../Factory",
    "dstore/legacy/DstoreAdapter",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary",
    "dojo/text!./template/Select.html"
],
function(
    declare,
    lang,
    aspect,
    on,
    when,
    query,
    domConstruct,
    domGeom,
    domStyle,
    topic,
    FilteringSelect,
    ControlFactory,
    DstoreAdapter,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([FilteringSelect, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        spinnerNode: null,

        searchAttr: "displayText",
        listItem: null, // the selected item from the ListStore

        // initialize base class attributes to avoid errors
        params: {},
        valueNode: {},
        textbox: {},

        constructor: function(args) {
            // TODO remove store adapter if not required by select any more
            if (!args.store) {
                // get store from input type, if not set yet
                args.store = new DstoreAdapter(ControlFactory.getListStore(args.inputType));
            }
            else if (!args.store.query) {
                args.store = DstoreAdapter(args.store);
            }

            declare.safeMixin(this, args);
            this.label = Dict.translate(this.name);
            aspect.before(this, "_startSearch", function(text) {
                // create spinner
                if (!this.spinnerNode) {
                    this.spinnerNode = domConstruct.create("p", {
                        style: 'position:absolute',
                        innerHTML: '<i class="fa fa-spinner fa-spin"></i>'
                    }, dojo.body());
                    var pos = domGeom.position(this.domNode);
                    domStyle.set(this.spinnerNode, {
                        left: pos.x + pos.w+15 + "px",
                        top: pos.y+6 + "px"
                    });
                }
                this.showSpinner();
            });

            // render value
            if (args.inputType) {
                ControlFactory.translateValue(args.inputType, this.value).
                    then(lang.hitch(this, function(displayText) {
                        this.set("value", this.value);
                    })
                );
            }
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
                on(this, 'search', lang.hitch(this, function() {
                    this.hideSpinner();
                }))
            );
        },

        _getValueAttr: function() {
            return this.listItem ? this.listItem.value : null;
        },

        _setValueAttr: function(value, priorityChange, displayedValue, item) {
            // since the value of the items in the ListStore is stored in
            // their value property and not in the id property, we need to
            // change the behaviour of the parent class, which use the id
            // property as value
            if (item) {
                // if an item is given, we can fall back to the
                // parent class' behaviour
                this.listItem = item;
                this.inherited(arguments);
                return;
            }
            // find the item whith the value property equal to value
            var args = arguments;
            when(this.store.query({value: 'eq='+value}), lang.hitch(this, function(result) {
                if (result && result.length === 1) {
                    this.listItem = result[0];
                    value = this.listItem.oid;
                    this.inherited(args, [value, priorityChange, displayedValue, item]);
                }
            }));
        },

        showSpinner: function() {
            query(this.spinnerNode).style("display", "block");
        },

        hideSpinner: function() {
            query(this.spinnerNode).style("display", "none");
        }
    });
});