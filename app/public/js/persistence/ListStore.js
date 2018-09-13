define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/when",
    "dojo/promise/all",
    "dojo/_base/config",
    "dojo/Deferred",
    "dojo/json",
    "dstore/Rest",
    "dstore/Cache",
    "dojox/encoding/base64",
    "../ui/data/display/Renderer"
], function (
    declare,
    lang,
    when,
    all,
    config,
    Deferred,
    JSON,
    Rest,
    Cache,
    base64,
    Renderer
) {
    /**
     * ListStore is used to get the content for list controls from the server.
     * It expects an array of objects with properties 'oid', 'value' and
     * 'displayText' sent by the server.
     */
    var ListStore = declare([Rest, Cache], {

        listDef: '',
        language: '',
        displayType: '',
        target: '',

        idProperty: 'oid',
        canCacheQuery: true,

        constructor: function(options) {
            declare.safeMixin(this, options);
            this._setTarget();
        },

        get: function(id) {
            var deferred = new Deferred();
            var filter = {};
            filter[this.idProperty] = 'eq='+id;
            this.filter(filter).forEach(lang.hitch(this, function (object) {
                // we expect only one object
                deferred.resolve(object);
            }));
            return deferred;
        },

        parse: function(response) {
            var deferred = new Deferred();
            var deferredList = [];
            var data = response ? JSON.parse(response) : {};
            var result = data.list ? data.list : [];
            for (var i=0, count=result.length; i<count; i++) {
                deferredList.push(Renderer.render(result[i].displayText, {displayType: this.displayType}, {}));
            }
            all(deferredList).then(lang.hitch(this, function(data) {
                for (var i=0, count=deferredList.length; i<count; i++) {
                    result[i].displayText = data[i];
                }
                deferred.resolve(result);
            }));
            return deferred;
        },

        /**
         * Set the query in the list definition
         * @param query
         */
        setQuery: function(query) {
            this.listDef.query = query;
            this._setTarget();
            this.cachingStore.setData([]);
            this.invalidate();
            this.fetch();
        },

        _setTarget: function() {
            this.listDefStr = JSON.stringify(this.listDef);

            // base64 encode listDef
            var b = [];
            for (var i=0, count=this.listDefStr.length; i<count; ++i) {
                b.push(this.listDefStr.charCodeAt(i));
            }

            // set target for xhr requests
            this.target = config.app.pathPrefix+"list/"+this.language+"/"+base64.encode(b)+"/";
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
     * @param displayType The display type for the items
     * @return Store instance
     */
    ListStore.getStore = function(listDef, language, displayType) {
        var listDefStr = JSON.stringify(listDef);

        // register store under the list definition
        if (!ListStore.storeInstances[listDefStr]) {
            ListStore.storeInstances[listDefStr] = {};
        }
        if (!ListStore.storeInstances[listDefStr][language]) {
            ListStore.storeInstances[listDefStr][language] = {};
        }
        if (!ListStore.storeInstances[listDefStr][language][displayType]) {
            var store = new ListStore({
                listDef: listDef,
                language: language,
                displayType: displayType
            });
            ListStore.storeInstances[listDefStr][language][displayType] = store;
        }
        return ListStore.storeInstances[listDefStr][language][displayType];
    };

    return ListStore;
});