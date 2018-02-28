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
            var text = this.helpText;
            if (text) {
                this.helpDialog = new TooltipDialog({
                    content: text,
                    onMouseLeave: lang.hitch(this, function() {
                        this.hideHelpTooltip();
                    })
                });
                ready(lang.hitch(this, function() {
                    this.attachHelpTooltip();
                }));
            }
        },

        attachHelpTooltip: function() {
            var labelNodes = query("label[for="+this.get("id")+"]");
            if (labelNodes.length > 0) {
                this.labelNode = labelNodes[0];
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