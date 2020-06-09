define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/dom-construct",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dojo/on",
    "dojo/ready"
], function (
    declare,
    lang,
    query,
    domConstruct,
    TooltipDialog,
    popup,
    on,
    ready
) {
    return declare([], {

        labelNode: null,
        helpDialog: null,
        helpIconNode: null,

        startup: function() {
            this.inherited(arguments);

            ready(lang.hitch(this, function() {
                this.initLabelAndTooltip();
            }));
        },

        initLabelAndTooltip: function() {
            var labelNodes = query("label[for="+this.get("id")+"]");
            if (labelNodes.length > 0) {
                this.labelNode = labelNodes[0];

                if (this.helpText) {
                    this.helpDialog = new TooltipDialog({
                        content: this.helpText,
                        onMouseLeave: lang.hitch(this, function() {
                            this.hideHelpTooltip();
                        })
                    });
                    this.helpIconNode = domConstruct.place('<i class="fa fa-info-circle"></i>', this.labelNode, "after");
                    this.own(
                        on(this.helpIconNode, 'mouseover', lang.hitch(this, function() {
                            this.showHelpTooltip();
                        })),
                        on(this.labelNode, 'mouseleave', lang.hitch(this, function() {
                            this.hideHelpTooltip();
                        }))
                    );
                }
            }
        },
        
        updateLabel: function(text) {
            if (this.labelNode) {
                this.labelNode.innerHTML = text;
            }
        },

        updateHelpTooltip: function(text) {
            if (this.helpDialog) {
                this.helpDialog.set('content', text);
            }
        },

        showHelpTooltip: function() {
            popup.open({
                popup: this.helpDialog,
                orient: ["above-centered", "below-centered"],
                around: this.helpIconNode
            });
        },

        hideHelpTooltip: function() {
            popup.close(this.helpDialog);
        }
    });
});