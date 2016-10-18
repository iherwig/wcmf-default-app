if (typeof window !== "undefined") {
    // window is undefined in non-browser context
    window.CKEDITOR_BASEPATH = appConfig.pathPrefix+'vendor/ckeditor/ckeditor/';
}

define( [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/on",
    "dojo/topic",
    "dojo/query",
    "dijit/form/TextBox",
    "ckeditor/ckeditor",
    "../Factory",
    "../../../../locale/Dictionary",
    "../../../_include/_HelpMixin",
    "./_AttributeWidgetMixin",
    "dojo/text!./template/CKEditor.html"
],
function(
    declare,
    lang,
    win,
    on,
    topic,
    query,
    TextBox,
    CKEditor,
    ControlFactory,
    Dict,
    _HelpMixin,
    _AttributeWidgetMixin,
    template
) {
    return declare([TextBox, _HelpMixin, _AttributeWidgetMixin], {

        templateString: template,
        intermediateChanges: true,
        inputType: null, // control description as string as used in Factory.getControlClass()
        entity: null,
        editorInstance: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.label = Dict.translate(this.name);
        },

        postCreate: function() {
            this.inherited(arguments);

            var mediaBrowserRoute = appConfig.pathPrefix+'media';
            var linkBrowserRoute = appConfig.pathPrefix+'link';
            var mediaFileBasePath = appConfig.pathPrefix+'media';

            this.editorInstance = CKEDITOR.replace(this.textbox, {
                customConfig: appConfig.pathPrefix+'js/config/ckeditor_config.js',
                filebrowserBrowseUrl: mediaBrowserRoute,
                filebrowserLinkBrowseUrl: linkBrowserRoute,
                baseHref: mediaFileBasePath,
                toolbar: this.getToolbarName(),
                filebrowserWindowWidth: '800',
                filebrowserWindowHeight: '700',
                readOnly: this.disabled
            });

            this.own(
                topic.subscribe("entity-datachange", lang.hitch(this, function(data) {
                    if ((this.entity && this.entity.get('oid') === data.entity.get('oid')) &&
                            data.name === this.name) {
                        var newValue = this.sanitiseValue(data.newValue);
                        this.set("value", newValue);
                        this.editorInstance.setData(newValue);
                    }
                }))
            );
            this.editorInstance.on("instanceReady", lang.hitch(this, function() {
                this.editorInstance.on("change", lang.hitch(this, this.editorValueChanged));
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
                this.editorInstance.setReadOnly(value);
            }
        },

        editorValueChanged: function() {
            setTimeout(lang.hitch(this, function() {
                this.set("value", this.sanitiseValue(this.editorInstance.getData()));
                // send change event
                this.emit("change", this);
            }, 0));
        },

        getToolbarName: function() {
            var options = ControlFactory.getOptions(this.inputType);
            return (options.toolbarSet) ? options.toolbarSet : "wcmf";
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