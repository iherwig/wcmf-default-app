define([
],
function(
) {
    return function(value, attribute, synch) {
        return value == 1 ? '&#10004;' : '';
    };
});