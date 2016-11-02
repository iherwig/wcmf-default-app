
// dynamically define requirements
var requirements = [
    "dojo/_base/declare",
    "dojo/when",
    "dojo/dom-construct",
    "dojo/Deferred"
];

// add display type renderers to requirements
var displayTypes = appConfig.displayTypes;
for (var key in displayTypes) {
    requirements.push(displayTypes[key]);
}

define(
    requirements
,
function(
) {
    // extract requirements manually from arguments object
    var i=0;
    var declare = arguments[i++];
    var when = arguments[i++];
    var domConstruct = arguments[i++];
    var Deferred = arguments[i++];
    var Renderer = declare(null, {
    });

    /**
     * Render the given value according to the given attribute definition.
     * @param value The value
     * @param attribute The attribute definition
     * @param options Object with attributes 'truncate' (integer)
     * @returns Deferred
     */
    Renderer.render = function(value, attribute, options) {
        options = options === undefined ? {} : options;
        var deferred = new Deferred();
        var renderer = Renderer.getRenderer(attribute.displayType);
        if (typeof renderer === 'function') {
            when(renderer(value, attribute), function(value) {
                if (options.truncate) {
                    var length = parseInt(options.truncate);
                    if (attribute.displayType.toLowerCase() === 'text' && length > 0 && value) {
                        // strip tags
                        value = domConstruct.create("div", { innerHTML: value }).textContent;
                        if (value.length > length) {
                            value = value.substring(0, length)+'…';
                        }
                    }
                }
                deferred.resolve(value);
            });
        }
        else {
            deferred.resolve(value);
        }
        return deferred;
    };

    Renderer.getRenderer = function(displayType) {
        if (displayType) {
            var displayTypes = Renderer.renderers;

            // get best matching renderer
            var bestMatch = '';
            for (var rendererDef in displayTypes) {
                if (displayType.indexOf(rendererDef) === 0 && rendererDef.length > bestMatch.length) {
                    bestMatch = rendererDef;
                }
            }
            // get the renderer
            if (bestMatch.length > 0) {
                var renderer = displayTypes[bestMatch];
                return renderer;
            }
        }
        // default
        return Renderer.renderers["text"];
    };

    // initialize renderers
    Renderer.renderers = {};
    for (var key in appConfig.displayTypes) {
        Renderer.renderers[key] = arguments[i++];
    }

    return Renderer;
});