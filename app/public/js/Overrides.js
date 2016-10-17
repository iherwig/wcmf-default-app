define([
    "dojo/request/xhr",
    "dojo/aspect",
    "dojo/cookie"
], function (
    xhr,
    aspect,
    cookie
) {
  var xhrWithAuthHeader = function(original) {
    return function(url, options) {
      // add auth token
      var authToken = cookie("auth-token");
      if (authToken !== null) {
          options.headers = options.headers || {};
          options.headers["X-Auth-Token"] = authToken;
      }

      return original(url, options);
    };
  };

  aspect.around(xhr, "get", xhrWithAuthHeader);
  aspect.around(xhr, "post", xhrWithAuthHeader);
  aspect.around(xhr, "put", xhrWithAuthHeader);
  aspect.around(xhr, "delete", xhrWithAuthHeader);
});