define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "dojo/json",
    "dstore/Rest",
    "dstore/Cache",
    "dojox/encoding/base64"
], function (
    declare,
    lang,
    Deferred,
    when,
    JSON,
    Rest,
    Cache,
    base64
) {
    var ListStore = declare([Rest], {

        listDef: '',
        language: '',
        target: '',

        idProperty: 'oid',

        constructor: function(options) {
            declare.safeMixin(this, options);

            this.listDefStr = JSON.stringify(this.listDef);

            // base64 encode listDef
            var b = [];
            for (var i=0, count=this.listDefStr.length; i<count; ++i) {
                b.push(this.listDefStr.charCodeAt(i));
            }

            // set target for xhr requests
            this.target = appConfig.pathPrefix+"/list/"+this.language+"/"+base64.encode(b)+"/";
        },

        get: function(id) {
            var deferred = new Deferred();
            when(this.fetch(), lang.hitch(this, function(result) {
                for (var i=0, count=result.length; i<count; i++) {
                    var curResult = result[i];
                    // intentionally ==
                    if (this.getIdentity(curResult) == id) {
                        deferred.resolve(curResult);
                    }
                }
            }), lang.hitch(this, function(error) {
                deferred.reject(error);
            }));
            return deferred;
        },

        parse: function(response) {
            var data = JSON.parse(response);
            var result = data.list ? data.list : [];
            if (data["static"]) {
                this.persist();
            }
            return result;
        },

        persist: function() {
            var store = ListStore.storeInstances[this.listDefStr][this.language];
            if (store.cache) {
                store.cache.isValidFetchCache = true;
            }
        }
    });

    /**
     * Registry for shared instances
     */
    ListStore.storeInstances = {};

    /**
     * Get the store for a given list definition and language
     * @param listDef The list definition object as defined in the input type
     * @param language The language
     * @return Store instance
     */
    ListStore.getStore = function(listDef, language) {
        var listDefStr = JSON.stringify(listDef);

        // register store under the list definition
        if (!ListStore.storeInstances[listDefStr]) {
            ListStore.storeInstances[listDefStr] = {};
        }
        if (!ListStore.storeInstances[listDefStr][language]) {
            var jsonRest = new ListStore({
                listDef: listDef,
                language: language
            });
            var cache = Cache.create(jsonRest);
            ListStore.storeInstances[listDefStr][language] = {
                jsonRest: jsonRest,
                cache: cache
            };
        }
        return ListStore.storeInstances[listDefStr][language].cache;
    };

    return ListStore;
});