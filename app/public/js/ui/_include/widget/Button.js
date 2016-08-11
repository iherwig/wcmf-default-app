define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dijit/form/Button"
], function (
    declare,
    domStyle,
    domConstruct,
    Button
) {
    return declare([Button], {

        initialLabel: "",
        progress: 0,

        postCreate: function () {
            this.inherited(arguments);

            domStyle.set(this.domNode, 'position', 'relative');
            this.progress = domConstruct.create('span', {
                style: {
                    background: '#ddd',
                    position: 'absolute',
                    left: 0,
                    width: this.progress,
                    height: '100%',
                    opacity: 0.5,
                    borderRadius: '4px 0 0 4px'
                }
            });
            domConstruct.place(this.progress, this.domNode, 'first');
        },

        setProcessing: function() {
            this.initialLabel = this.get("label");
            this.set("label", this.initialLabel+' <i class="fa fa-spinner fa-spin"></i>');
            this.set("disabled", true);
        },

        reset: function() {
            this.set("label", this.initialLabel);
            this.set("disabled", false);
        }
    });
});