define([
    "dojo/_base/declare",
    "dojo/_base/config",
    "dojo/cookie"
], function (
    declare,
    config,
    cookie
) {
    var AuthToken = declare(null, {

        name: config.app.authTokenHeaderName,

        /**
         * Get the token value
         * @returns String|undefined
         */
        get: function() {
            var token = cookie(config.app.authTokenCookieName);
            return token && token.length ? (this.name == 'Authorization' ? 'Bearer ' : '')+token : undefined;
        }
    });

    return new AuthToken();
});