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
        data: null,
        deferred: null,

        /**
         * Copy the given object
         * @param e The event that triggered execution, might be null
         * @param data Object to lock
         */
        execute: function(e, data) {
            if (this.init instanceof Function) {
                this.init(data);
            }
            this.data = data;
            this.deferred = new Deferred();
            new Process().run("copy", {
                oid: data.oid,
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
                oid: this.data.oid,
                action: "add"
            });
            if (this.callback instanceof Function) {
                this.callback(this.data);
            }
            this.deferred.resolve(this.data);
        },

        errorHandler: function(error) {
            if (this.errback instanceof Function) {
                this.errback(error);
            }
            this.deferred.reject(error);
        },

        progressHandler: function(data) {
            if (this.progback instanceof Function) {
                this.progback(data);
            }
            this.deferred.progress(data);
        }
    });
});
