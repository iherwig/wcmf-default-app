if (typeof window !== "undefined") {
    // window is undefined in non-browser context
    window.CKEDITOR_BASEPATH = dojoConfig.app.pathPrefix+'vendor/ckeditor/ckeditor/';
}

define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/_base/window",
    "dojo/topic",
    "dojo/query",
    "dijit/form/TextBox",
    "ckeditor/ckeditor",
    "../Factory",
    "../../../../locale/Dictionary",
    "../../../_include/_HelpMixin",
    "../../../_include/_TranslateMixin",
    "../../../_include/widget/MediaBrowserDlgWidget",
    "./_AttributeWidgetMixin",
    "dojo/text!./template/CKEditor.html"
],
function(
    declare,
    lang,
    config,
    win,
    topic,
    query,
    TextBox,
    CKEditor,
    ControlFactory,
    Dict,
    _HelpMixin,
    _TranslateMixin,
    MediaBrowserDlg,
    _AttributeWidgetMixin,
    template
) {
    return declare([TextBox, _HelpMixin, _TranslateMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,
        editorConfig: {},
        editorInstance: null,
        mediaBrowser: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
        },

        postCreate: function() {
            this.inherited(arguments);

            var pathPrefix = config.app.pathPrefix;
            var mediaBrowserRoute = pathPrefix+'media';
            var linkBrowserRoute = pathPrefix+'link';
            var mediaBaseHref = config.app.wcmfBaseHref;

            this.editorConfig = {
                customConfig: pathPrefix+'js/config/ckeditor_config.js',
                filebrowserBrowseUrl: mediaBrowserRoute,
                filebrowserLinkBrowseUrl: linkBrowserRoute,
                baseHref: mediaBaseHref,
                toolbar: this.getToolbarName(),
                filebrowserWindowWidth: '800',
                filebrowserWindowHeight: '700',
                readOnly: this.disabled
            };
            this.editorInstance = CKEDITOR.replace(this.textbox, this.editorConfig);

            // custom filebrowser dialog instantiation
            // @see https://github.com/simogeo/Filemanager/wiki/How-to-open-the-Filemanager-from-CKEditor-in-a-modal-window
            var browseDlg = null;
            CKEDITOR.on('dialogDefinition', function(event) {
                var editor = event.editor;
                var dialogDefinition = event.data.definition;
                var tabCount = dialogDefinition.contents.length;
                var cleanUpFunc = CKEDITOR.tools.addFunction(function () {
                    browseDlg.hide();
                });

                for (var i=0; i<tabCount; i++) {
                    var browseButton = dialogDefinition.contents[i].get('browse');
                    if (browseButton !== null) {
                        browseButton.hidden = false;
                        browseButton.onClick = function(dialog, i) {
                            editor._.filebrowserSe = this;
                            browseDlg = new MediaBrowserDlg({
                                url: this.filebrowser.url+'?CKEditorFuncNum='+
                                        CKEDITOR.instances[event.editor.name]._.filebrowserFn+
                                        '&CKEditorCleanUpFuncNum='+cleanUpFunc
                            });
                            browseDlg.show();
                        };
                    }
                }
            });

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        var newValue = this.sanitiseValue(data.newValue);
                        this.set("value", newValue);
                    }
                }))
            );
            this.editorInstance.on("instanceReady", lang.hitch(this, function() {
                this.editorInstance.on("change", lang.hitch(this, function() {
                    this.set("value", this.sanitiseValue(this.editorInstance.getData()));
                    // send change event
                    this.emit("change", this);
                }));
                // set padding on editor content
                var content = query("iframe", this.domNode)[0].contentWindow.document;
                win.withDoc(content, function() {
                    query(".cke_editable").style("padding", "5px");
                }, this);
                // fix edit state (editor instance is initially read only)
                this.set("disabled", this.disabled);
            }));
        },

        _setDisabledAttr: function(value) {
            if (this.editorInstance) {
                setTimeout(lang.hitch(this, function() {
                    try {
                        this.editorInstance.setReadOnly(value);
                    }
                    catch (ex) {}
                }), 100);
            }
        },

        _setValueAttr: function(value) {
            if (this.editorInstance && value != this.sanitiseValue(this.editorInstance.getData())) {
                this.editorInstance.setData(value);
            }
            this.inherited(arguments);
        },

        _getValueAttr: function() {
            if (this.editorInstance) {
                return this.sanitiseValue(this.editorInstance.getData());
            }
            else {
                return this.inherited(arguments);
            }
        },

        getToolbarName: function() {
            var options = ControlFactory.getOptions(this.inputType);
            return (options.toolbarSet) ? options.toolbarSet : "wcmf";
        },

        replaceToolbar: function(name) {
            var editor = CKEDITOR.instances[this.get('id')];
            if (editor) {
                editor.destroy(true);
            }
            this.editorConfig.toolbar = name;
            this.editorInstance = CKEDITOR.replace(this.textbox, this.editorConfig);
            // fix readonly flag
            this._setDisabledAttr(this.editorConfig.readOnly);
        },

        destroy: function() {
            this.editorInstance.removeAllListeners();
            this.inherited(arguments);
        },

        sanitiseValue: function(value) {
            return (typeof value === "string" || value instanceof String) ?
                value.trim() : value;
        }
    });
});