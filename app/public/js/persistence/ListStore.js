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
        emptyItem: null,
        isStatic: false,

        constructor: function(options) {
            declare.safeMixin(this, options);

            // base64 encode listDef
            var b = [];
            for (var i=0, count=this.listDef.length; i<count; ++i) {
                b.push(this.listDef.charCodeAt(i));
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
                this.isStatic = true;
                this.persist();
            }
            if (this.emptyItem !== null) {
                result.unshift({
                    displayText: this.emptyItem,
                    oid: ""
                });
            }
            return result;
        },

        persist: function() {
            var store = ListStore.storeInstances[this.listDef][this.emptyItem][this.language];
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
     * @param listDef The list definition
     * @param emptyItem Name of the empty item, null to add no empty item
     * @param language The language
     * @return Store instance
     */
    ListStore.getStore = function(listDef, emptyItem, language) {
        // register store under the list definition
        if (!ListStore.storeInstances[listDef]) {
            ListStore.storeInstances[listDef] = {};
        }
        if (!ListStore.storeInstances[listDef][emptyItem]) {
            ListStore.storeInstances[listDef][emptyItem] = {};
        }
        if (!ListStore.storeInstances[listDef][emptyItem][language]) {
            var jsonRest = new ListStore({
                listDef: listDef,
                emptyItem: emptyItem,
                language: language
            });
            var cache = Cache.create(jsonRest);
            ListStore.storeInstances[listDef][emptyItem][language] = {
                jsonRest: jsonRest,
                cache: cache
            };
        }
        return ListStore.storeInstances[listDef][emptyItem][language].cache;
    };

    return ListStore;
});