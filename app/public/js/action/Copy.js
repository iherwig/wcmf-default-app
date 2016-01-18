define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/Deferred",
    "./Process",
    "./ActionBase"
], function (
    declare,
    lang,
    topic,
    Deferred,
    Process,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'copy',
        iconClass: 'fa fa-copy',

        targetOid: null,
        entity: null,
        deferred: null,

        /**
         * Copy the given object
         * @param e The event that triggered execution, might be null
         * @param entity Entity to copy
         */
        execute: function(e, entity) {
            this.init(entity);
            this.entity = entity;
            this.deferred = new Deferred();
            new Process().run("copy", {
                oid: entity.get('oid'),
                targetoid: this.targetOid
            }).then(
                lang.hitch(this, this.successHandler),
                lang.hitch(this, this.errorHandler),
                lang.hitch(this, this.progressHandler)
            );
            return this.deferred;
        },

        successHandler: function(response) {
            topic.publish("store-datachange", {
                store: this,
                oid: this.entity.get('oid'),
                action: "add"
            });
            this.callback(this.entity);
            this.deferred.resolve(this.entity);
        },

        errorHandler: function(error) {
            this.errback(error);
            this.deferred.reject(error);
        },

        progressHandler: function(data) {
            this.progback(data);
            this.deferred.progress(data);
        }
    });
});
