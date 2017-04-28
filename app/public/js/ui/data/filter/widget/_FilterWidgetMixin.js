define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dojo/dom-construct"
], function (
    declare,
    lang,
    on,
    ContentPane,
    domConstruct
) {
    /**
     * Filter widget mixin. Manages value propagation and reset.
     */
    return declare([ContentPane], {
        value: null,

        postCreate: function() {
            this.inherited(arguments);

            var control = this.getControl();
            control.startup();
            this.addChild(control);

            var btn = '<a class="btn-mini"><i class="fa fa-ban"></i></a>';
            var resetBtn = domConstruct.place(btn, this.domNode, 'last');
            this.own(
                on(resetBtn, "click", lang.hitch(this, function(e) {
                    this.value = null;
                    this.control.set('value', this.value);
                    e.stopPropagation();
                })),
                control.watch('value', lang.hitch(this, function (prop, oldValue, newValue) {
                    this.set('value', newValue);
                }))
            );
        }
    });
});