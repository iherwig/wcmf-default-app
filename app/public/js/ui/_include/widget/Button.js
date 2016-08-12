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
        progressBar: null,

        postCreate: function () {
            this.inherited(arguments);

            domStyle.set(this.domNode, 'position', 'relative');
            this.progressBar = domConstruct.create('span', {
                style: {
                    backgroundColor: '#ddd',
                    position: 'absolute',
                    left: 0,
                    width: 0,
                    height: '100%',
                    opacity: 0.9,
                    borderRadius: '4px 0 0 4px'
                }
            });
            domConstruct.place(this.progressBar, this.domNode, 'first');
        },

        setProgress: function(value) {
            value = (value >= 0 && value < 1) ? value : 0;
            domStyle.set(this.progressBar, 'width', (value*100)+'%');
        },

        setProcessing: function() {
            this.initialLabel = this.get("label");
            this.set("label", this.initialLabel+' <i class="fa fa-spinner fa-spin"></i>');
            this.set("disabled", true);
        },

        reset: function() {
            this.set("label", this.initialLabel);
            this.set("disabled", false);
            this.setProgress(0);
        }
    });
});