// get path of directory ckeditor
var basePath = CKEDITOR.basePath;
basePath = basePath.substr(0, basePath.indexOf("ckeditor/"));

// load external plugins
(function() {
   CKEDITOR.plugins.addExternal('find', basePath+'ckeditor-plugins/find/', 'plugin.js');
   CKEDITOR.plugins.addExternal('image2', basePath+'ckeditor-plugins/image2/', 'plugin.js');
   CKEDITOR.plugins.addExternal('embedbase', basePath+'ckeditor-plugins/embedbase/', 'plugin.js');
   CKEDITOR.plugins.addExternal('embed', basePath+'ckeditor-plugins/embed/', 'plugin.js');

})();

// fix inserting spans in chrome
// @see http://ckeditor.com/forums/CKEditor/ckeditor-4.01-inserting-span-elements-everywhere-with-a-line-height-of-1.6em
(function() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (isChrome) {
        CKEDITOR.on( 'instanceLoaded', function( e ){
            this.addCss('.cke_editable { line-height: normal; }');
        });
    }
})();

// @see https://docs.ckeditor.com/ckeditor4/latest/api/CKEDITOR_config.html
CKEDITOR.editorConfig = function( config ) {
    config.language = dojoConfig.app.uiLanguage;
    config.baseFloatZIndex = 900;
    config.disallowedContent = '*{*}'
    //config.extraAllowedContent = 'iframe[*]';
    config.resize_dir = 'vertical';
    config.theme = 'default';
    config.toolbarStartupExpanded = false;
    config.toolbarCanCollapse = true;
    config.uiColor = "#E0E0D6";
    config.extraPlugins = 'image2,find,embed';
    // Setup content provider. See https://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_media_embed
    config.embed_provider = '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}';
    config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';
    config.stylesSet = [
      { name: 'Strong Emphasis', element: 'strong' },
      { name: 'Emphasis', element: 'em' }
    ];
    config.toolbar_wcmf = [
        ['Maximize'],['Source'],['Cut','Copy','Paste'],['Undo','Redo','Find'],
        ['Image','Embed','Link','Unlink','Anchor'],
        ['Bold','Italic','RemoveFormat'],['Table','BulletedList','HorizontalRule','SpecialChar'],['Format','Styles'],['About']
    ];
    config.toolbar = 'wcmf';
    config.contentsCss = [dojoConfig.app.pathPrefix+'css/app.css', dojoConfig.app.pathPrefix+'css/editor.css'];
};
