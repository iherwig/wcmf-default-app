define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dijit/form/_FormValueWidget",
    'dojox/form/Uploader',
    "../../../_include/_HelpMixin",
    "../../../_include/widget/Button",
    "./_AttributeWidgetMixin",
    "../../../../locale/Dictionary",
    "dojo/text!./template/FileUpload.html"
],
function(
    declare,
    lang,
    config,
    on,
    ContentPane,
    _FormValueWidget,
    Uploader,
    _HelpMixin,
    Button,
    _AttributeWidgetMixin,
    Dict,
    template
) {
    return declare([ContentPane, _FormValueWidget, _HelpMixin, _AttributeWidgetMixin], {

        templateString: lang.replace(template, Dict.tplTranslate),
        intermediateChanges: false,

        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
        },

        postCreate: function() {
            this.inherited(arguments);

            this.emptyText = this.dropTargetNode.innerHTML;

            this.uploader = new dojox.form.Uploader({
                name: 'uploadedFile',
                label: Dict.translate("Select file"),
                multiple: false,
                force: 'html5'
            });
            this.addChild(this.uploader);
            this.uploader.startup();
            this.uploader.addDropTarget(this.dropTargetNode);

            this.clearBtn = new Button({
                disabled: this.disabled,
                innerHTML: '<i class="fa fa-remove"></i>',
                "class": "btn-mini",
                onClick: lang.hitch(this, function() {
                    this.uploader.reset();
                    this.handleValueChange();
                })
            });
            this.clearBtn.set("disabled", this.disabled || !this.getFileData());
            this.addChild(this.clearBtn);

            this.set("value", this.getFile());

            this.own(
                on(this.uploader, "change", lang.hitch(this, function(value) {
                    this.handleValueChange();
                }))
            );
        },

        _setDisabledAttr: function(value) {
            this.inherited(arguments);
            if (this.uploader) {
                this.uploader.set("disabled", value);
            }
            if (this.clearBtn) {
                this.clearBtn.set("disabled", value);
            }
        },

        _getValueAttr: function() {
            return this.getFile();
        },

        handleValueChange: function() {
            // update ui
            var fileData = this.getFileData();
            this.clearBtn.set("disabled", this.disabled || !fileData);
            this.setDisplayValue(fileData ? fileData.name : null);
            // set internal value to notify listeners
            this.set("value", fileData ? fileData.name : null);
        },

        getFileData: function() {
            var fileList = this.uploader.getFileList();
            return fileList.length > 0 ? fileList[0] : null;
        },

        getFile: function() {
            return this.uploader._files && this.uploader._files.length > 0 ? this.uploader._files[0] : null;
        },

        setDisplayValue: function(value) {
            value = value ? value : this.emptyText;
            this.dropTargetNode.innerHTML = value;
        }
    });
});