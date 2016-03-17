var elFinder = {};

define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/registry",
    "../_include/_PageMixin",
    "jquery/jquery.min",
    "jquery-ui/jquery-ui.min",
    "../../config/elfinder_config",
    "elfinder/js/elfinder.min",
    "elfinder/js/i18n/elfinder.de",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "../../locale/Dictionary",
    "dojo/text!./template/BrowsePage.html",
    "dojo/domReady!"
], function (
    require,
    declare,
    lang,
    registry,
    _Page,
    jQuery,
    jQueryUi,
    elFinderConfig,
    elFinder,
    i18n_elfinderDe,
    TabContainer,
    ContentPane,
    Dict,
    template
) {
    return declare([_Page], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Media'),

        constructor: function(params) {
            declare.safeMixin(this, params);
            // get package locations
            var packageLocations = {};
            for(var i=0, count=dojoConfig.packages.length; i<count; i++) {
                var curPackage = dojoConfig.packages[i];
                packageLocations[curPackage.name] = curPackage.location;
            }
            // add elfinder css
            this.setCss(packageLocations['jquery-ui']+'/themes/smoothness/jquery-ui.min.css', 'all');
            this.setCss(packageLocations['elfinder']+'/css/elfinder.min.css', 'all');
            this.setCss(packageLocations['elfinder']+'/css/theme.css', 'all');
        },

        postCreate: function() {
            this.inherited(arguments);

            // tab navigation
            registry.byId("tabContainer").watch("selectedChildWidget", lang.hitch(this, function(name, oval, nval){
                if (nval.id === "contentTab") {
                    window.location.assign(appConfig.pathPrefix+'link?'+this.request.getQueryString());
                }
            }));

            var directory = this.request.getQueryParam("directory");
            lang.mixin(elfinderConfig, {
                lang: appConfig.uiLanguage,
                url: appConfig.backendUrl+'media/files?directory='+directory,
                rememberLastDir: true,
                resizable: false,
                getFileCallback: lang.hitch(this, function(file) {
                    this.onItemClick(file);
                })
            });

            setTimeout(function() {
                $("#elfinder").elfinder(elfinderConfig).elfinder('instance');
            }, 1000);
        },

        onItemClick: function(item) {
            var funcNum = this.request.getQueryParam('CKEditorFuncNum');
            var callback = this.request.getQueryParam('callback');

            var value = this.getItemUrl(item);
            if (window.opener.CKEDITOR && funcNum) {
                window.opener.CKEDITOR.tools.callFunction(funcNum, value, function() {
                    // callback executed in the scope of the button that called the file browser
                    // see: http://docs.ckeditor.com/#!/guide/dev_file_browser_api Example 4
                });
            }
            else if (callback) {
                if (window.opener[callback]) {
                    window.opener[callback](value);
                }
            }
            window.close();
        },

        getItemUrl: function(item) {
            item = decodeURIComponent(item.url);
            return appConfig.mediaSavePath+item.replace(appConfig.mediaBaseUrl, '');
        }
    });
});