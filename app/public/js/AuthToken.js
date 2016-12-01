define([
    "dojo/_base/declare",
    "dojo/cookie"
], function (
    declare,
    cookie
) {
    var AuthToken = declare(null, {

        name: "X-Auth-Token",

        /**
         * Get the token value
         * @returns String|undefined
         */
        get: function() {
            var token = cookie(appConfig.cookiePrefix+"-token");
            return token && token.length ? token : undefined;
        }
    });

    return new AuthToken();
});