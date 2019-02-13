define([
    "dojo/_base/declare",
    "../Startup",
    "../model/meta/Model",
    "../app/LightProfileClass"
], function (
    declare,
    Startup,
    Model,
    LightProfileClass
) {
    return declare([Startup], {
        /**
         * Startup method. All application initialization code goes here.
         * This method will be called on application start and after login,
         * because on page reload there may only be an application
         * initialization without a login (because the user is logged in already).
         * If the user is logged in may be tested calling User.isLoggedIn().
         * @return Deferred
         */
        run: function() {
            // register light profile type
            if (!Model.isKnownType("app.src.model.LightProfile")) {
              Model.registerType(new LightProfileClass());
            }

            return this.inherited(arguments);
        }
    });
});