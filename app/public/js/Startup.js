define([
    "dojo/_base/declare",
    "dojo/_base/config",
    "dojo/promise/all",
    "dojo/Deferred",
    "./User",
    "./action/Messages",
    "./action/CheckPermissions",
    "./locale/Dictionary",
    "./model/meta/Model"
], function (
    declare,
    config,
    all,
    Deferred,
    User,
    Messages,
    CheckPermissions,
    Dictionary,
    Model
) {
    return declare(null, {
      /**
       * Base startup method. Custom application initialization code should be
       * put in the run method of ./config/Startup, which inherits from this class.
       * @return Deferred
       */
      run: function() {
          var deferred = new Deferred();

          var deferredList = {};

          // load localized ui text
          deferredList["messages"] = new Messages({
              language: config.app.uiLanguage
          }).execute();

          // check for read access to root types for the current user
          // and get the user's configuration
          if (User.isLoggedIn()) {
              var requiredPermissions = [];
              for (var i=0, count=config.app.rootTypes.length; i<count; i++) {
                  var rootType = config.app.rootTypes[i];
                  requiredPermissions.push(Model.getFullyQualifiedTypeName(rootType)+'??read');
              }
              deferredList["rootTypePermissions"] = new CheckPermissions({
                  operations: requiredPermissions
              }).execute();
              deferredList["userInit"] = User.initialize();
          }

          // wait for all operations
          all(deferredList).then(function(results) {
              // initialize dictionary
              Dictionary.setContent(results["messages"]);

              if (User.isLoggedIn()) {
                  // restrict root types to those visible to the current user
                  var permissionsResponse = results["rootTypePermissions"];
                  var permissions = permissionsResponse.result ? permissionsResponse.result : {};
                  var visibleRootTypes = [];
                  for (var i=0, count=config.app.rootTypes.length; i<count; i++) {
                      var rootType = config.app.rootTypes[i];
                      if (permissions[Model.getFullyQualifiedTypeName(rootType)+'??read'] === true) {
                          visibleRootTypes.push(rootType);
                      }
                  }
                  config.app.rootTypes = visibleRootTypes;
              }

              deferred.resolve({});
          }, function(error) {
              deferred.reject(error);
          });
          return deferred;
      }
    });
});