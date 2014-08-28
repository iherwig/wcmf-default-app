define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dojo/Deferred",
    "./User",
    "./action/CheckPermissions",
    "./model/meta/Model"
], function (
    declare,
    all,
    Deferred,
    User,
    CheckPermissions,
    Model
) {
    var Startup = declare(null, {
    });

    /**
     * Startup method. All application initialization code goes here.
     * This method will be called on application start and after login,
     * because on page reload there may only be an application
     * initialization without a login (because the user is logged in already).
     * If the user is logged in may be tested calling User.isLoggedIn().
     * @return Deferred
     */
    Startup.run = function() {
        var deferred = new Deferred();

        var deferredList = {};

        // check for read access to root types for the current user
        if (User.isLoggedIn()) {
            var requiredPermissions = [];
            for (var i=0, count=appConfig.rootTypes.length; i<count; i++) {
                var rootType = appConfig.rootTypes[i];
                requiredPermissions.push(Model.getFullyQualifiedTypeName(rootType)+'??read');
            }
            deferredList["rootTypePermissions"] = new CheckPermissions().execute({}, requiredPermissions);
        }

        // wait for all operations
        all(deferredList).then(function(results) {

            // restrict root types to those visible to the current user
            if (User.isLoggedIn()) {
                var permissions = results["rootTypePermissions"];
                var visibleRootTypes = [];
                for (var i=0, count=appConfig.rootTypes.length; i<count; i++) {
                    var rootType = appConfig.rootTypes[i];
                    if (permissions[Model.getFullyQualifiedTypeName(rootType)+'??read'] === true) {
                        visibleRootTypes.push(rootType);
                    }
                }
                appConfig.rootTypes = visibleRootTypes;
            }

            deferred.resolve({});
        }, function(error) {
            deferred.reject(error);
        });
        return deferred;
    };

    return Startup;
});