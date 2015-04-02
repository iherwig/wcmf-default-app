define([
    "dojo/_base/declare",
    "dojo/json",
    "dstore/Rest",
    "dstore/Cache",
    "dojox/encoding/base64"
], function (
    declare,
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
        addEmpty: false,
        isStatic: false,

        constructor: function(options) {
            declare.safeMixin(this, options);

            // base64 encode listDef
            var b = [];
            for (var i=0; i<this.listDef.length; ++i) {
              b.push(this.listDef.charCodeAt(i));
            }

            // set target for xhr requests
            this.target = appConfig.pathPrefix+"/list/"+this.language+"/"+base64.encode(b)+"/";
        },

        setAddEmpty: function(addEmpty) {
            this.addEmpty = addEmpty;
        },

        parse: function(response) {
            var data = JSON.parse(response);
            var result = data.list ? data.list : [];
            if (data["static"]) {
                this.isStatic = true;
                this.persist();
            }
            if (this.addEmpty) {
                result.unshift({
                    displayText: "",
                    oid: ""
                });
            }
            return result;
        },

        persist: function() {
            var store = ListStore.storeInstances[this.listDef][this.language];
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
     * @param language The language
     * @return Store instance
     */
    ListStore.getStore = function(listDef, language) {
        // register store under the list definition
        if (!ListStore.storeInstances[listDef]) {
            ListStore.storeInstances[listDef] = {};
        }
        if (!ListStore.storeInstances[listDef][language]) {
            var jsonRest = new ListStore({
                listDef: listDef,
                language: language
            });
            var cache = Cache.create(jsonRest);
            ListStore.storeInstances[listDef][language] = {
                jsonRest: jsonRest,
                cache: cache
            };
        }
        return ListStore.storeInstances[listDef][language].cache;
    };

    return ListStore;
});