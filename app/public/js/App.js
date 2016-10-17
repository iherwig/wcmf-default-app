define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/registry",
    "routed/Request",
    "dojomat/Application",
    "dojomat/populateRouter",
    "./routing-map",
    "./Overrides",
    "./Startup",
    "require",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/domReady!"
], function (
    declare,
    lang,
    registry,
    Request,
    Application,
    populateRouter,
    routingMap,
    Overrides,
    Startup,
    require,
    query,
    domConstruct
) {
    return declare([Application], {

        _location: '',

        constructor: function () {
            populateRouter(this, routingMap);
            Startup.run().then(lang.hitch(this, function(result) {
                this.run();
            }), lang.hitch(this, function(error) {
                // error
            }));
        },

        setPageNode: function () {
            var tag = 'div',
                attributes = { id: this.pageNodeId },
                refNode = query('#wrap')[0],
                position = 'first';

            if (registry.byId(this.pageNodeId)) {
                registry.byId(this.pageNodeId).destroyRecursive();
            }

            domConstruct.create(tag, attributes, refNode, position);
        },

        handleState: function () {
            if (window.location.href !== this._location) {
                this.inherited(arguments);
                this._location = window.location.href;
            }
        },

        makeNotFoundPage: function () {
            var request = new Request(window.location.href),
                makePage = function (Page) {
                    this.clearCss();
                    this.prepareDomNode();

                    var page = new Page({
                        request: request,
                        router: this.router
                    }, this.domNode);

                    this.notification.clear();
                    page.startup();
                }
            ;
            require(['./ui/error/NotFoundPage'], lang.hitch(this, makePage));
        },

        makeErrorPage: function (error) {
            var request = new Request(window.location.href),
                makePage = function (Page) {
                    this.clearCss();
                    this.prepareDomNode();

                    var page = new Page({
                        request: request,
                        router: this.router,
                        error: error
                    }, this.domNode);

                    this.notification.clear();
                    page.startup();
                }
            ;
            require(['./ui/error/ErrorPage'], lang.hitch(this, makePage));
        },

        makePage: function (request, widget, layers, stylesheets) {
            this.inherited(arguments);
        },

        setCss: function (css, media) {
            var css = css || '', media = media || 'all';

            domConstruct.create(
                'link',
                { media: media, href: css, rel: 'stylesheet' },
                query('head')[0],
                'last'
            );
        }
    });
});