define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/dom-form",
    "dijit/form/TextBox",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "../_include/widget/Button",
    "../../User",
    "../../Startup",
    "../../locale/Dictionary",
    "d3/d3.v3.min",
    "trianglify/trianglify.min",
    "dojo/text!./template/LoginPage.html"
], function (
    require,
    declare,
    lang,
    request,
    domForm,
    TextBox,
    _Page,
    _Notification,
    NavigationWidget,
    Button,
    User,
    Startup,
    Dict,
    d3,
    trianglify,
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
            this.setHeaderBackground();
        },

        setHeaderBackground: function() {
          // get time dependent color
          var now = new Date();
          var hexHours = parseInt(Math.round(255*now.getHours()/24));
          var hexMinutes = parseInt(Math.round(255*now.getMinutes()/60));
          var hexSeconds = parseInt(Math.round(255*now.getSeconds()/60));
          var colour = hexHours.toString(16) + hexMinutes.toString(16) + hexSeconds.toString(16);

          // generate pattern
          var t = new Trianglify({
              cellsize: 90,
              noiseIntensity: 0,
              x_gradient: ["#"+colour, "#2F2F2F"]
          });
          var pattern = t.generate(window.screen.width, window.screen.height);
          this.header.setAttribute('style', 'background-image: '+pattern.dataUrl);
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