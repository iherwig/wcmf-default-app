define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/topic",
    "dstore/Rest",
    "dstore/Trackable",
    "dojox/uuid/generateRandomUuid",
    "../persistence/Entity",
    "../model/meta/Model"
], function (
    lang,
    declare,
    aspect,
    topic,
    Rest,
    Trackable,
    uuid,
    Entity,
    Model
) {
    return declare([Rest, Trackable], {

        idProperty: '_storeId', // see Entity class
        typeName: '',
        Model: Entity,

        headers: {
            Accept: "application/json"
        },

        constructor: function(options) {

            // Add error/change notifications
            aspect.around(this, "get", function(original) {
                return function(id, options) {
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
                return function(entity, options) {
                    options = options === undefined ? {} : options;

                    var oid = entity.get('oid');
                    var isUpdate = (options.overwrite) || (oid && !Model.isDummyOid(oid));

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
                        options.headers = {
                            Position: position
                        };
                        isUpdate = true;
                    }

                    // set real id only if an existing entity is updated
                    // otherwise set to undefined
                    options.id = isUpdate ? this.getIdentity(entity) : undefined;
                    if (!isUpdate) {
                        oid = Model.getOid(Model.getTypeNameFromOid(oid), this.createBackEndDummyId());
                        entity.set('oid', oid);
                    }

                    // do call
                    var results = original.call(this, entity, options);
                    results.then(lang.hitch(this, function() {
                        topic.publish("store-datachange", {
                            store: this,
                            oid: oid,
                            action: options.overwrite ? "put" : "add"
                        });
                    }), function(error) {
                        topic.publish("store-error", error);
                    });
                    return results;
                };
            });
            aspect.around(this, "remove", function(original) {
                return function(id, options) {
                    // do call
                    var results = original.call(this, id, options);
                    results.then(lang.hitch(this, function() {
                        topic.publish("store-datachange", {
                            store: this,
                            oid: Model.getOid(this.typeName, id),
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