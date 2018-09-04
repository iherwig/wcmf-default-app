define([
    "dojo/_base/config",
    "dojo/Deferred",
    "dojo/when",
    "../../input/Factory"
],
function(
    config,
    Deferred,
    when,
    ControlFactory
) {
    return function(value, attribute) {
        var deferred = new Deferred();
        when(ControlFactory.translateValue(attribute.inputType, attribute.displayType, value), function(value) {
            if (value && value.toLowerCase().match(/\.gif$|\.jpg$|\.png$/)) {
                var url = value.replace(config.app.mediaSavePath, config.app.mediaBasePath);
                deferred.resolve('<a href="'+url+'" target="_blank"><img src="'+url+'" class="thumb"></a>');
            }
            deferred.resolve(value);
        });
        return deferred;
    };
});