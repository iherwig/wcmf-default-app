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
        console.groupCollapsed('AppLoader');
        console.debug('Check if component is overridden: '+overrideId);
        require([overrideId], function(result) {
          if (!(typeof result == 'function')) {
            console.debug('-> NOT overridden');
            loadImpl(id, require, callback);
          }
          else {
            console.debug('-> Overridden');
            callback(require(overrideId));
          }
          console.groupEnd();
        });
      }
    }
  };
});