define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/query",
    "dojo/dom-class"
], function (
    declare,
    lang,
    aspect,
    query,
    domClass
) {
    /**
     * Base class for actions. Actions are executed using the execute() method.
     * They can either act local or perform a server call.
     */
    return declare([], {

        name: '',
        iconClass:  'fa fa-asterisk',

        // action parameters (optional)
        init: function(){},
        callback: function(){},
        errback: function(){},
        progback: function(){},

        _iconNode: null,
        _hasSpinner: false,

        /**
         * Constructor
         */
        constructor: function(args) {
            declare.safeMixin(this, args);

            // set spinner icon, if execution event target has iconClass
            aspect.around(this, "execute", function(original) {
                return function() {
                    // call init before execution
                    if (this.init instanceof Function) {
                        this.init();
                    }
                    var deferred = original.apply(this, arguments);

                    if (deferred && deferred.then instanceof Function) {
                        // set spinner icon
                        this._event = null;
                        this._hasSpinner = false;
                        if (arguments.length > 0) {
                            var e = arguments[0];
                            if (e && e.target) {
                                // icon is either target or a child
                                var iconNodes = query("."+this.iconClass, e.target.parentNode);
                                if (iconNodes.length > 0) {
                                    this._iconNode = iconNodes[0];
                                    this._hasSpinner = true;
                                    domClass.replace(this._iconNode, "fa fa-spinner fa-spin", this.iconClass);
                                }
                            }
                        }
                        deferred.then(lang.hitch(this, function() {
                            // reset icon
                            if (this._iconNode && this._hasSpinner) {
                                domClass.replace(this._iconNode, this.iconClass, "fa fa-spinner fa-spin");
                            }
                        }));
                        deferred.then(this.callback, this.errback, this.progback)
                    }
                    return deferred;
                };
            });
        },

        /**
         * Execute the action.
         * @return Deferred instance
         */
        execute: function() {
            throw("Method execute() must be implemented by concrete action.");
        }
    });
});
