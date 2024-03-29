define([
    "../../input/Factory"
],
function(
    ControlFactory
) {
    return function(value, attribute, context) {
        if (typeof value == 'string') {
            // remove tags
            value = value.replace(/<[^>]*>/g, '');
        }
        return ControlFactory.translateValue(attribute.inputType, attribute.displayType, value);
    };
});