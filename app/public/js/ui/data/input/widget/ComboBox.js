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
    "dijit/form/ComboBox",
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
    ComboBox,
    ControlFactory,
    DstoreAdapter,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([ComboBox, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        spinnerNode: null,

        searchAttr: "displayText",
        queryExpr: '*${0}*',

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

        showSpinner: function() {
            query(this.spinnerNode).style("display", "block");
        },

        hideSpinner: function() {
            query(this.spinnerNode).style("display", "none");
        },

        getStore: function() {
            return !this.store.filter ? this.store.store : this.store;
        }
    });
});