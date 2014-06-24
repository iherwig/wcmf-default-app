define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/xhr",
    "dojo/Deferred",
    "dojo/when",
    "dojo/store/util/QueryResults",
    "dojo/store/util/SimpleQueryEngine",
    "dojox/encoding/base64"
], function (
    declare,
    lang,
    xhr,
    Deferred,
    when,
    QueryResults,
    SimpleQueryEngine,
    base64
) {
    var ListStore = declare([], {
        listDef: '',
        language: '',
        target: '',

        idProperty: "oid",
        data: null,
        index: null,

        addEmpty: false,

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

        get: function(id) {
            var deferred = new Deferred();
            when(this.retrieve(), lang.hitch(this, function(result) {
                var value = result.data[result.index[id]];
                deferred.resolve(value);
            }), lang.hitch(this, function(error) {
                deferred.reject(error);
            }));
            return deferred;
        },

        getIdentity: function(object) {
            return object[this.idProperty];
        },

        query: function(query, options) {
            var deferred = new Deferred();
            when(this.retrieve(), lang.hitch(this, function(result) {
                deferred.resolve(QueryResults(SimpleQueryEngine(query, options)(result.data)));
            }), lang.hitch(this, function(error) {
                deferred.reject(error);
            }));
            return deferred;
        },

        retrieve: function() {
            if (!this.index) {
                var deferred = new Deferred();
                xhr("GET", {
                    url: this.target,
                    handleAs: "json",
                    headers: {
                        Accept: "application/json"
                    }
                }).then(lang.hitch(this, function(data) {
                    this.data = data ? data.list : {};
                    if (this.addEmpty) {
                        this.data.unshift({
                            displayText: "",
                            oid: ""
                        });
                    }
                    this.index = {};
                    for (var i=0, l=this.data.length; i<l; i++) {
                        this.index[this.data[i][this.idProperty]] = i;
                    }
                    // persist store, if static
                    if (this.data["static"]) {
                        this.persist();
                    }
                    deferred.resolve({
                        data: this.data,
                        index: this.index
                    });
                }), function(error) {
                    deferred.reject(error);
                });
                return deferred;
            }
            return {
                data: this.data,
                index: this.index
            };
        },

        persist: function() {
            var listDef = this.listDef;
            var language = this.language;

            // register store under the list definition
            if (!ListStore.storeInstances[listDef]) {
                ListStore.storeInstances[listDef] = {};
            }
            ListStore.storeInstances[listDef][language] = this;
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
            var store = new ListStore({
                listDef: listDef,
                language: language
            });
            ListStore.storeInstances[listDef][language] = store;
        }
        return ListStore.storeInstances[listDef][language];
    };

    return ListStore;
});