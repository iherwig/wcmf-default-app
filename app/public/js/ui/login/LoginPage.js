define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/dom-form",
    "dojo/dom-style",
    "dijit/form/TextBox",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "../_include/widget/Button",
    "../../User",
    "../../Startup",
    "../../locale/Dictionary",
    "dojo/text!./template/LoginPage.html",
    "http://d3js.org/d3.v3.min.js",
    "http://cdnjs.cloudflare.com/ajax/libs/trianglify/0.1.2/trianglify.min.js"
], function (
    require,
    declare,
    lang,
    request,
    domForm,
    domStyle,
    TextBox,
    _Page,
    _Notification,
    NavigationWidget,
    Button,
    User,
    Startup,
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Login'),

        constructor: function (params) {
            // template variables
            this.title = appConfig.title;
        },

        postCreate: function() {
          var t = new Trianglify({
              cellsize: 90,
              noiseIntensity: 0,
              // TODO: https://github.com/nogoodatcoding/ColorClock/blob/gh-pages/colorclock.js
              x_gradient: ["#66B64A", "#2F2F2F"]
          });
          var pattern = t.generate(window.screen.width, window.screen.height);
          domStyle.set(this.header, "background-image", pattern.dataUrl);
        },

        createNotificationNode: function() {
            // do nothing, it's defined in the template already
        },

        _login: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            var data = domForm.toObject("loginForm");
            data.action = "login";

            this.loginBtn.setProcessing();

            this.hideNotification();
            request.post(appConfig.backendUrl, {
                data: data,
                headers: {
                    Accept: "application/json"
                },
                handleAs: 'json'

            }).then(lang.hitch(this, function(response) {
                // success
                this.loginBtn.reset();
                User.create(data.user, response.roles);

                // run startup code
                Startup.run().then(lang.hitch(this, function(result) {
                      // redirect to initially requested route if given
                      var redirectRoute = this.request.getQueryParam("route");
                      if (redirectRoute) {
                          window.location.href = this.request.getPathname()+redirectRoute;
                      }
                      else {
                          // redirect to default route
                          var route = this.router.getRoute("home");
                          var url = route.assemble();
                          this.pushState(url);
                      }
                }), lang.hitch(this, function(error) {
                      // error
                      this.showBackendError(error);
                }));
            }), lang.hitch(this, function(error) {
                // error
                this.loginBtn.reset();
                this.showBackendError(error);
            }));
        }
    });
});