define([
    "dojo/_base/declare",
    "../Startup"
], function (
    declare,
    Startup
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
            return this.inherited(arguments);
        }
    });
});