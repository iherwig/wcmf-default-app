define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/query",
    "dojo/dom-construct",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dojo/on",
    "../../locale/Dictionary",
    "dojo/ready"
], function (
    declare,
    lang,
    config,
    query,
    domConstruct,
    TooltipDialog,
    popup,
    on,
    Dict,
    ready
) {
    return declare([], {

        labelNode: null,
        translateDialog: null,
        translateIconNode: null,

        startup: function() {
            this.inherited(arguments);
            var text = this.defaultLanguageValue;
            if (text) {
                this.translateDialog = new TooltipDialog({
                    content: config.app.defaultLanguage.toUpperCase()+": "+text+"<br>",
                    onMouseLeave: lang.hitch(this, function() {
                        this.hideTranslateTooltip();
                    })
                });
                domConstruct.place(domConstruct.create("a", {
                    href: "#",
                    innerHTML: Dict.translate("Apply"),
                    onclick: lang.hitch(this, function(e) {
                        e.preventDefault();
                        this.set("value", this.defaultLanguageValue);
                    }),
                }), this.translateDialog.containerNode);
                ready(lang.hitch(this, function() {
                    this.attachTranslateTooltip();
                }));
            }
        },

        attachTranslateTooltip: function() {
            var labelNodes = query("label[for="+this.get("id")+"]");
            if (labelNodes.length > 0) {
                this.labelNode = labelNodes[0];
                this.translateIconNode = domConstruct.place('<i class="fa fa-flag"></i>', this.labelNode, "after");
                this.own(
                    on(this.translateIconNode, 'mouseover', lang.hitch(this, function() {
                        this.showTranslateTooltip();
                    })),
                    on(this.labelNode, 'mouseleave', lang.hitch(this, function() {
                        this.hideTranslateTooltip();
                    }))
                );
            }
        },

        showTranslateTooltip: function() {
            popup.open({
                popup: this.translateDialog,
                orient: ["above-centered", "below-centered"],
                around: this.translateIconNode
            });
        },

        hideTranslateTooltip: function() {
            popup.close(this.translateDialog);
        }
    });
});