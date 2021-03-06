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
    "dojo/html",
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
    html,
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
        queryExpr: '*${0}*',
        autoComplete: false,
        labelType: "html",

        listItem: null, // the selected item from the ListStore

        // initialize base class attributes to avoid errors
        params: {},
        valueNode: {},
        textbox: {},

        constructor: function(args) {
            // TODO remove store adapter if not required by FilteringSelect any more
            if (!args.store) {
                // get store from input type, if not set yet
                args.store = new DstoreAdapter(ControlFactory.getListStore(args.inputType, this.getDisplayType(args.entity, args.name)));
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
            // change the behaviour of the parent class, which uses the id
            // property as value
            if (item) {
                // if an item is given, we can fall back to the
                // parent class' behaviour
                this.listItem = item;
                this.inherited(arguments);
                this.updateDisplay();
                return;
            }
            // find the item with the value property equal to value
            var args = arguments;

            if (this.inputType) {
                when(ControlFactory.getItem(this.inputType, this.getDisplayType(this.entity, this.name), value), lang.hitch(this, function(object) {
                    this.listItem = object;
                    if (this.listItem) {
                        this.inherited(args, [this.listItem.oid, priorityChange, this.listItem.displayText, this.listItem]);
                        this.updateDisplay();
                    }
                }));
            }
            else {
                // TODO use this.store, if FilteringSelect uses store api
                var store = !this.store.filter ? this.store.store : this.store;
                store.filter({value: 'eq='+value}).forEach(lang.hitch(this, function (object) {
                    // we expect only one object
                    this.listItem = object;
                    if (this.listItem) {
                        this.inherited(args, [this.listItem.oid, priorityChange, this.listItem.displayText, this.listItem]);
                    }
                }));
            }
        },

        showSpinner: function() {
            query(this.spinnerNode).style("display", "block");
        },

        hideSpinner: function() {
            query(this.spinnerNode).style("display", "none");
        },

        setStore: function(store, selectedId /*optional*/) {
            this.set('store', store);
            if (selectedId !== undefined) {
                var item = store.get(selectedId);
                if (item) {
                    this._setValueAttr(item.id, true, item.displayedText, item);
                    this.textbox.value = item.displayText;
                }
            }
        },

        getStore: function() {
            return !this.store.filter ? this.store.store : this.store;
        },

        updateDisplay: function() {
            if (this.getDisplayType(this.entity, this.name) != 'text') {
                domStyle.set(this.textbox, { display: 'none' });
                html.set(this.displayNode, this.listItem.displayText);
            }
        }
    });
});