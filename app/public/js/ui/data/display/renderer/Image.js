define([
],
function(
) {
    return function(value, attribute) {
        if (value && value.toLowerCase().match(/\.gif$|\.jpg$|\.png$/)) {
            var url = value.replace(appConfig.mediaSavePath, appConfig.mediaBasePath);
            return '<a href="'+url+'" target="_blank"><img src="'+url+'" class="thumb"></a>';
        }
        return value;
    };
});