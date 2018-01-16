define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/_base/fx",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/on",
    "./widget/NotificationWidget",
    "../../persistence/BackendError"
], function (
    require,
    declare,
    lang,
    topic,
    fx,
    query,
    domConstruct,
    on,
    Notification,
    BackendError
) {
    /**
     * Notification mixin. Expects an element with id "notification" in
     * the template. Usage:
     * @code
     * showNotification({
     *      type: "error",
     *      message: "Backend error",
     *      fadeOut: false,
     *      onHide: function () {}
     * });
     * @endcode
     */
    return declare([], {
        node: null,
        widget: null,
        loginDlg: null,

        constructor: function(params) {
            // subscribe to backend error notifications
            topic.subscribe("backend-error", lang.hitch(this, function(errorData, noRefresh) {
                this.showBackendError(errorData, noRefresh);
            }));
        },

        showNotification: function (options) {
            var alertClass = 'alert-info';

            if (options.type === 'ok') {
                alertClass = 'alert-success';
            } else if (options.type === 'error') {
                alertClass = 'alert-error';
            } else if (options.type === 'process') {
                alertClass = 'alert-info';
            }

            this.hideNotification();

            if (this.node) {
                domConstruct.destroy(this.node);
            }

            var nodes = query('#notification');
            if (nodes.length > 0) {
                this.node = domConstruct.create('div', {}, nodes[0], 'only');
            }
            else {
                console.warn('No node with id "notification" found.');
                return;
            }

            var content = options.message;
            if (options.type === 'process') {
                content += ' <i class="fa fa-spinner fa-spin"></i>';
            }

            this.widget = new Notification({
                'class': alertClass,
                content: content
            }, this.node);

            this.widget.startup();
            on(this.widget.domNode, "click", lang.hitch(this, function() {
                    this.hideNotification();
                })
            );

            if (options.fadeOut) {
                fx.fadeOut({
                    node: this.widget.domNode,
                    delay: 1000,
                    duration: 1000,
                    onEnd: lang.hitch(this, function() {
                        this.hideNotification();
                    })
                }).play();
            }

            this.onHide = undefined;
            if (typeof options.onHide === 'function') {
                this.onHide = options.onHide;
            }
        },

        hideNotification: function () {
            if (this.widget) {
                this.widget.destroyRecursive();
            }
            if (typeof this.onHide === 'function') {
                this.onHide();
            }
        },

        showBackendError: function (errorData, noRefresh) {
            var error = BackendError.parseResponse(errorData);
            if (error.code === 'SESSION_INVALID') {
                // prevent circular dependency
                if (!this.loginDlg) {
                    require(['./widget/LoginDlgWidget'], lang.hitch(this, function(LoginDlg) {
                        this.loginDlg = LoginDlg;
                        this.showLoginDlg(noRefresh);
                    }));
                }
                else {
                    this.showLoginDlg(noRefresh);
                }
            }
            else {
                this.showNotification({
                    type: "error",
                    message: error.message
                });
            }
        },
        
        showLoginDlg: function (noRefresh) {
            if (this.loginDlg && !this.loginDlg.isShowing) {
                new this.loginDlg({
                    success: lang.hitch(this, function() {
                        topic.publish('refresh', function(request) {
                            return !noRefresh;
                        });
                    })
                }).show();
            }
        }
    });
});