define([
    "dojo/_base/declare",
    "dojo/cookie"
], function (
    declare,
    cookie
) {
    var AuthToken = declare(null, {

        /**
         * Get the token value
         * @returns String|undefined
         */
        get: function() {
            return cookie("auth-token");
        }
    });

    return new AuthToken();
});