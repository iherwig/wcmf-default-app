define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/config",
    "dojo/promise/all",
    "dojo/topic",
    "dojo/Deferred",
    "dojo/json",
    "./Cookie",
    "./action/GetUserConfig",
    "./action/SetUserConfig"
], function (
    declare,
    array,
    config,
    all,
    topic,
    Deferred,
    JSON,
    Cookie,
    GetUserConfig,
    SetUserConfig
) {
    var User = declare(null, {
    });

    /**
     * Create the user instance. Called, when the session is started
     * @param login The login name
     * @param roles Array of role names
     */
    User.create = function(login, roles) {
        Cookie.set("user", {
            login: login,
            roles: roles
        });
    };

    /**
     * Initialize the user
     * @return Deferred
     */
    User.initialize = function() {
        // initialize session check
        var sessionCheck = parseInt(config.app.sessionCheck);
        if (sessionCheck > 0) {
            User._sessionCheckInterval = setInterval(function() {
                new GetUserConfig({
                    key: "check"
                }).execute().then(function(results) {
                }, function(error) {
                    // error
                    topic.publish('backend-error', error, true);
                });
            }, sessionCheck);
        }

        // load config
        var deferred = new Deferred();
        var deferredList = {};
        deferredList["gridConfig"] = new GetUserConfig({
            key: "grid"
        }).execute();
        all(deferredList).then(function(results) {
            User._config["grid"] = results["gridConfig"] ? JSON.parse(results["gridConfig"].value, true) : {};
            deferred.resolve({});
        }, function(error) {
            deferred.reject(error);
        });
        return deferred;
    };

    /**
     * Destroy the user instance. Called, when the session is ended
     * @param login The login name
     * @param roles Array of role names
     */
    User.destroy = function() {
        Cookie.destroyAll();
        if (User._sessionCheckInterval) {
            clearInterval(User._sessionCheckInterval);
        }
    };

    /**
     * Get the user's login
     * @return String
     */
    User.getLogin = function() {
        var user = Cookie.get("user");
        return user ? user.login : "";
    };

    /**
     * Check if the user has the given role
     * @param name The role name
     * @return Boolean
     */
    User.hasRole = function(name) {
        var user = Cookie.get("user");
        if (user && user.roles) {
            return array.indexOf(user.roles, name) !== -1;
        }
        return false;
    };

    /**
     * Get the user's login
     * @return String
     */
    User.isLoggedIn = function() {
        var user = Cookie.get("user");
        return user !== undefined;
    };

    /**
     * Set a user configuration
     * @param name The configuration name
     * @param value The configuration value
     */
    User.setConfig = function(name, value) {
        User._config[name] = value;
        new SetUserConfig({
            key: name,
            value: JSON.stringify(value)
        }).execute();
    };

    /**
     * Get a user configuration
     * @param name The configuration name
     * @return Object
     */
    User.getConfig = function(name) {
        return User._config[name];
    };

    User._config = {};
    User._sessionCheckInterval = null;

    return User;
});