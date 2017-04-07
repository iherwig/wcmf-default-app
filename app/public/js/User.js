define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/promise/all",
    "dojo/Deferred",
    "dojo/json",
    "./Cookie",
    "./action/GetUserConfig",
    "./action/SetUserConfig"
], function (
    declare,
    array,
    all,
    Deferred,
    JSON,
    Cookie,
    GetUserConfig,
    SetUserConfig
) {
    var User = declare(null, {
        config: {
        }
    });

    /**
     * Create the user instance
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
     * Initialize the user configuration
     * @return Deferred
     */
    User.initializeConfig = function() {
        var deferred = new Deferred();
        var deferredList = {};
        deferredList["gridConfig"] = new GetUserConfig({
            key: "grid"
        }).execute();
        all(deferredList).then(function(results) {
            this.config = results;
            deferred.resolve({});
        }, function(error) {
            deferred.reject(error);
        });
        return deferred;
    };

    /**
     * Set a user configuration
     * @param name The configuration name
     * @param value The configuration value
     */
    User.setConfig = function(name, value) {
        this.config[name] = value;
        new SetUserConfig({
            key: name,
            value: JSON.stringify(value)
        });
    };

    /**
     * Get a user configuration
     * @param name The configuration name
     * @return Object
     */
    User.getConfig = function(name) {
        return this.config[name];
    };

    return User;
});