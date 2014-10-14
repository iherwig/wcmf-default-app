define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/topic",
    "dijit/form/FilteringSelect",
    "../Factory",
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
    query,
    domConstruct,
    topic,
    FilteringSelect,
    ControlFactory,
    _HelpMixin,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([FilteringSelect, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        original: {},

        spinnerNode: null,

        searchAttr: "displayText",

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
            // get store from input type, if not set yet
            if (!this.store) {
                this.store = ControlFactory.getListStore(this.inputType);
            }
            // add empty value for select boxes
            if (this.store.setAddEmpty) {
              this.store.setAddEmpty(true);
            }

            aspect.before(this, "_startSearch", function(text) {
                // create spinner
                if (!this.spinnerNode) {
                    this.spinnerNode = domConstruct.create("p", {
                        innerHTML: '<i class="fa fa-spinner fa-spin"></i>'
                    }, this.domNode.parentNode, "last");
                }
                this.showSpinner();
            });
        },

        postCreate: function() {
            this.inherited(arguments);

            // subscribe to entity change events to change tab links
            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if (data.name === this.name) {
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
        }
    });
});