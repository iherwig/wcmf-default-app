define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/topic",
    "dstore/Rest",
    "dojox/uuid/generateRandomUuid",
    "../persistence/Entity",
    "../model/meta/Model"
], function (
    lang,
    declare,
    aspect,
    topic,
    Rest,
    uuid,
    Entity,
    Model
) {
    return declare([Rest], {

        idProperty: 'oid',
        Model: Entity,

        constructor: function(options) {

            // set id property in order to have url like /{type}/{id}
            // instead of /{type}/{oid}
            // NOTE: this has to be set on cloned options!
            aspect.around(this, "get", function(original) {
                return function(oid, options) {
                    var id = Model.getIdFromOid(oid);

                    // do call
                    var results = original.call(this, id, options);
                    results.then(function(value) {
                    }, function(error) {
                        topic.publish("store-error", error);
                    });
                    return results;
                };
            });
            aspect.around(this, "put", function(original) {
                return function(object, options) {
                    options = options === undefined ? {} : options;

                    var isUpdate = (options.overwrite) || (object.oid && !Model.isDummyOid(object.oid));
                    var objectTmp = object.getCleanCopy ? object.getCleanCopy() : object;
                    var optionsTmp = lang.clone(options);

                    // reorder request
                    // use position header according to http://www.ietf.org/rfc/rfc3648.txt
                    if ("beforeId" in options) {
                        var position = "last"; // default if beforeId is undefined
                        if (options.beforeId) {
                            position = "before "+options.beforeId;
                        }
                        else {
                            position = "last";
                        }
                        optionsTmp.headers = {
                            Position: position
                        };
                        isUpdate = true;
                    }

                    // set real id only if an existing object is updated
                    // otherwise set to undefined
                    optionsTmp.id = isUpdate ? Model.getIdFromOid(object.oid) : undefined;
                    if (!isUpdate) {
                        objectTmp.oid = Model.getOid(Model.getTypeNameFromOid(objectTmp.oid), this.createBackEndDummyId());
                    }

                    // do call
                    var results = original.call(this, objectTmp, optionsTmp);
                    results.then(lang.hitch(this, function() {
                        topic.publish("store-datachange", {
                            store: this,
                            oid: object.oid,
                            action: options.overwrite ? "put" : "add"
                        });
                    }), function(error) {
                        topic.publish("store-error", error);
                    });
                    return results;
                };
            });
            aspect.around(this, "remove", function(original) {
                return function(oid, options) {
                    var id = Model.getIdFromOid(oid);

                    // do call
                    var results = original.call(this, id, options);
                    results.then(lang.hitch(this, function() {
                        topic.publish("store-datachange", {
                            store: this,
                            oid: oid,
                            action: "remove"
                        });
                    }), function(error) {
                        topic.publish("store-error", error);
                    });
                    return results;
                };
            });
        },

        createBackEndDummyId: function() {
            return 'wcmf'+uuid().replace(/-/g, '');
        }

        // TODO:
        // implement DojoNodeSerializer on server that uses refs
        // http://dojotoolkit.org/reference-guide/1.7/dojox/json/ref.html#dojox-json-ref
    });
});