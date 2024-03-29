define([
    "dojo/_base/config",
    "dojo/date/locale"
],
function(
    config,
    locale
) {
    return function(value, attribute, context) {
        if (value) {
            var parseDateFormat = {
                selector: 'date',
                datePattern: 'yyyy-MM-dd',
                locale: config.app.uiLanguage
            };
            var formatDateFormat = {
                selector: 'date',
                formatLength: 'short',
                fullYear: true,
                locale: config.app.uiLanguage
            };
            if (typeof value === "string") {
                value = locale.parse(value.substring(0, 10), parseDateFormat);
            }
            value = locale.format(value, formatDateFormat);
        }
        return value;
    };
});