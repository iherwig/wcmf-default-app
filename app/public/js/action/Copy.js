define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "./Process",
    "./ActionBase"
], function (
    declare,
    lang,
    topic,
    Process,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'copy',
        iconClass: 'fa fa-copy',

        deferred: null,

        // action parameters
        targetOid: null,
        entity: null,

        execute: function() {
            this.deferred = new Process('copy').run({
                oid: this.entity.get('oid'),
                targetoid: this.targetOid
            });
            this.deferred.then(
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
            this.deferred.resolve(this.entity);
        },

        errorHandler: function(error) {
            this.deferred.reject(error);
        },

        progressHandler: function(data) {
            this.deferred.progress(data);
        }
    });
});
