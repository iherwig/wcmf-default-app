define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/config",
    "dojo/_base/array",
    "dojo/json",
    "dojo/promise/all",
    "dojo/Deferred",
    "dojo/when",
    "../../../model/meta/Model",
    "../../../persistence/ListStore"
],
function(
    require,
    declare,
    lang,
    config,
    array,
    JSON,
    all,
    Deferred,
    when,
    Model,
    ListStore
) {
    var Factory = declare(null, {
    });

    /**
     * Load the control classes for a given entity type.
     * @param type The entity type name
     * @param entity Entity to get the value for (optional)
     * @param mappingFunction Function for mapping input type names (optional)
     * @returns Deferred which returns a map with attribute names as
     * keys and control classes as values
     */
    Factory.loadControlClasses = function(type, entity, mappingFunction) {
        var deferred = new Deferred();

        var inputTypeMap = {};
        var typeClass = Model.getType(type);
        var attributes = typeClass.getAttributes({include: ['DATATYPE_ATTRIBUTE']}, entity);

        // collect all control classes
        for (var i=0, count=attributes.length; i<count; i++) {
            var inputType = attributes[i].inputType;
            if (mappingFunction) {
                inputType = mappingFunction(inputType);
            }
            var controlClass = Factory.getControlClass(inputType);
            inputTypeMap[inputType] = controlClass;
        }

        var controls = [];
        for (var key in inputTypeMap) {
            var controlClass = inputTypeMap[key];
            if (array.indexOf(controls, inputTypeMap[key]) === -1) {
                controls.push(controlClass);
            }
        }

        require(controls, function() {
            // store loaded classes in inputTyp -> control map
            var result = {};
            for (var key in inputTypeMap) {
                var control = arguments[array.indexOf(controls, inputTypeMap[key])];
                if (!(typeof control === 'function')) {
                    deferred.reject({ message: "Control for input type '"+key+"' not found."});
                }
                result[key] = control;
            }

            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred;
    };

    Factory.getControlClass = function(inputType) {
        if (inputType) {
            var inputTypes = config.app.inputTypes;

            // get best matching control
            var bestMatch = '';
            for (var controlDef in inputTypes) {
                if (inputType.indexOf(controlDef) === 0 && controlDef.length > bestMatch.length) {
                    bestMatch = controlDef;
                }
            }
            // get the control
            if (bestMatch.length > 0) {
                var controlClass = inputTypes[bestMatch];
                return controlClass;
            }
        }
        // default
        return require.toAbsMid("./widget/TextBox");
    };

    /**
     * Called by list controls to retrive the value store
     * @param inputType The input type (contains the list definition in options)
     * @param displayType The display type for the items
     * @returns Store
     */
    Factory.getListStore = function(inputType, displayType) {
        var options = Factory.getOptions(inputType);
        if (!options['list']) {
            throw new Error("Input type '"+inputType+"' does not contain a list definition");
        }
        return ListStore.getStore(options['list'], config.app.defaultLanguage, displayType);
    };

    /**
     * Translate the given value according to the list definition that
     * might be contained in the input type
     * @param inputType The input type (contains the list definition after '#' char)
     * @param displayType The display type for the items
     * @param value The value
     * @param convertValuesToStrings Boolean whether to convert all item values to strings (optional, default: false)
     * @returns Deferred
     */
    Factory.translateValue = function(inputType, displayType, value, convertValuesToStrings) {
        var deferred = new Deferred();
        when(Factory.getItem(inputType, displayType, value, convertValuesToStrings), function(item) {
            var value = item && item.hasOwnProperty('displayText') ? item.displayText :
                    item === undefined ? null : item;
            deferred.resolve(value);
        });
        return deferred;
    };

    /**
     * Get the list item for the given value according to the list definition that
     * might be contained in the input type
     * @param inputType The input type (contains the list definition after '#' char)
     * @param displayType The display type for the items
     * @param value The value
     * @param convertValuesToStrings Boolean whether to convert all item values to strings (optional, default: false)
     * @returns Deferred
     */
    Factory.getItem = function(inputType, displayType, value, convertValuesToStrings) {
        // serve from cache
        if (Factory._resolvedValues.hasOwnProperty(inputType) && Factory._resolvedValues[inputType].hasOwnProperty(value)) {
            return Factory._resolvedValues[inputType][value];
        }
        // create cache for input type
        var options = Factory.getOptions(inputType);
        if (!Factory._translateValuePromises.hasOwnProperty(inputType)) {
            Factory._translateValuePromises[inputType] = {};
            // load list values once
            // NOTE loading all items once and caching the result
            // is faster than resolving the value on each request
            if (options['list']) {
                if (!Factory._translateListPromises.hasOwnProperty(inputType)) {
                    Factory._translateListPromises[inputType] = new Deferred();
                    // store promise in cache and resolve later
                    var store = ListStore.getStore(options['list'], config.app.defaultLanguage, displayType);
                    Factory._listCache[inputType] = store.fetch();
                    when(Factory._listCache[inputType], lang.partial(function(inputType, result) {
                        // cache resolved list values
                        Factory._listCache[inputType] = result;
                        var results = {};
                        for (var i=0, count=result.length; i<count; i++) {
                            var object = result[i];
                            if (convertValuesToStrings) {
                                object.oid = ""+object.oid;
                                object.value = ""+object.value;
                            }
                            results[object.value] = object;
                        };
                        Factory._translateListPromises[inputType].resolve(results);
                    }, inputType));
                 }
            }
        }
        // create promise for translating value
        if (!Factory._translateValuePromises[inputType].hasOwnProperty(value)) {
            Factory._translateValuePromises[inputType][value] = new Deferred();
            if (options['list'] && value !== undefined && value !== null) {
                // resolve list values, when list is loaded
                Factory._translateListPromises[inputType].then(lang.partial(function(value, results) {
                    // split multi values
                    if (typeof value === 'string' && value.match(',')) {
                        var values = value.split(',').map(function(v) { var v = v.trim(); return results[v] ? results[v].displayText : undefined; }).filter(function(v) { return v !== undefined; });
                        Factory._translateValuePromises[inputType][value].resolve(values.join(', '));
                    }
                    else {
                        Factory._translateValuePromises[inputType][value].resolve(results[value] ? results[value].displayText : undefined);
                    }
               }, value));
            }
            else {
                // all other values
                Factory._translateValuePromises[inputType][value].resolve(value);
            }
        }
        // return the promise
        return Factory._translateValuePromises[inputType][value];
    };

    /**
     * Get the options from the given input type
     * @param inputType The input type
     * @returns Object
     */
    Factory.getOptions = function(inputType) {
        if (inputType) {
            var optionsStr = inputType.match(/:(\{.+\})/);
            var options = optionsStr ? JSON.parse(optionsStr[1]) : {};
            return options;
        }
        return {};
    };

    /**
     * Add an empty item to a list definition
     * @param inputType The input type
     * @param emptyItem
     * @returns String
     */
    Factory.addEmptyItem = function(inputType, emptyItem) {
        if (inputType) {
            var controlStr = inputType.match(/(.+?):/);
            if (controlStr) {
                var options = Factory.getOptions(inputType);
                options['list']['emptyItem'] = emptyItem;
                return controlStr[1]+':'+JSON.stringify(options);
            }
        }
        return inputType;
    };

    /**
     * Registry for translated values
     */
    Factory._listCache = {};
    Factory._translateValuePromises = {};
    Factory._translateListPromises = {};
    Factory._resolvedValues = {};

    return Factory;
});