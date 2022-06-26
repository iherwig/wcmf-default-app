define([], function() {
  return {
    load: function(id, require, callback) {
      // actual module loading function
      var loadImpl = function(id, require, callback) {
        require([id], function() {
          callback(require(id));
        });
      }

      var appPattern = /^app\/js\//;
      var overrideIdPrefix = 'app/js/app/_override/';

      // check module id
      var isAppModule = id.match(appPattern);
      if (!isAppModule) {
        // default
        loadImpl(id, require, callback);
      }
      else {
        // check if module is overridden
        var overrideId = id.replace(appPattern, overrideIdPrefix);
        require([overrideId], function(result) {
          if (result == 'not-a-module') {
            loadImpl(id, require, callback);
          }
          else {
            callback(require(overrideId));
          }
        });
      }
    }
  };
});