define([
],
function(
) {
    return function(value, attribute, context) {
        return value == 1 ? '&#10004;' : '';
    };
});