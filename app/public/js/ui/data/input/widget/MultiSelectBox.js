define( [
    "dojo/_base/declare",
    "./SelectBox"
],
function(
    declare,
    SelectBox
) {
    return declare([SelectBox], {
        supportsEntityLink: false,
        supportsMultiSelect: true,
    });
});