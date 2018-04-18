// get path of directory ckeditor
var basePath = CKEDITOR.basePath;
basePath = basePath.substr(0, basePath.indexOf("ckeditor/"));

// load external plugins
(function() {
   CKEDITOR.plugins.addExternal('find', basePath+'ckeditor-plugins/find/', 'plugin.js');
   CKEDITOR.plugins.addExternal('mediaembed', basePath+'ckeditor-plugins/mediaembed/', 'plugin.js');
   CKEDITOR.plugins.addExternal('video', basePath+'ckeditor-plugins/video/', 'plugin.js');
   CKEDITOR.plugins.addExternal('html5audio', basePath+'ckeditor-plugins/html5audio/', 'plugin.js');
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
    config.forcePasteAsPlainText = true;
    config.resize_dir = 'vertical';
    config.theme = 'default';
    config.toolbarStartupExpanded = false;
    config.toolbarCanCollapse = true;
    config.uiColor = "#E0E0D6";
    config.extraPlugins = 'find,mediaembed,video,html5audio';
    config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';
    config.stylesSet = [
      { name: 'Strong Emphasis', element: 'strong' },
      { name: 'Emphasis', element: 'em' }
    ];
    config.toolbar_wcmf = [
        ['Maximize'],['Source'],['Cut','Copy','Paste'],['Undo','Redo','Find'],
        ['Image','MediaEmbed','Video','Html5audio','Link','Unlink','Anchor'],
        ['Bold','Italic','RemoveFormat'],['Table','BulletedList','HorizontalRule','SpecialChar'],['Format','Styles'],['About']
    ];
    config.toolbar = 'wcmf';
    config.contentsCss = dojoConfig.app.pathPrefix+'css/app.css';
};
