define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/when",
    "dojo/topic",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../../AppLoader!../_include/widget/NavigationWidget",
    "../_include/widget/GridWidget",
    "../../ui/data/display/Renderer",
    "../../model/meta/Model",
    "../../persistence/SearchStore",
    "./SearchResult",
    "../../action/Edit",
    "../../locale/Dictionary",
    "dojo/text!./template/SearchResultPage.html"
], function (
    require,
    declare,
    lang,
    all,
    when,
    topic,
    _Page,
    _Notification,
    NavigationWidget,
    GridWidget,
    Renderer,
    Model,
    SearchStore,
    SearchResult,
    Edit,
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Searchresult'),
        bodyDomId: 'page-searchresult',

        gridWidget: null,

        constructor: function(params) {
            this.searchterm = this.request.getQueryParam("q");

            this.headline = Dict.translate("Results for '%0%'", [this.searchterm]);

            // register search result type if not done already
            if (!Model.isKnownType("SearchResult")) {
                Model.registerType(new SearchResult());
            }
        },

        postCreate: function() {
            this.inherited(arguments);
            this.setTitle(this.title+" - "+this.searchterm);

            // create widget
            this.gridWidget = this.buildForm();

            this.own(
                topic.subscribe("store-error", lang.hitch(this, function(error) {
                    this.showBackendError(error);
                })),
                topic.subscribe("ui/_include/widget/GridWidget/error", lang.hitch(this, function(error) {
                    this.showBackendError(error);
                }))
            );
        },

        buildForm: function() {
            var renderOptions = { truncate: 50 };
            return new GridWidget({
                type: "SearchResult",
                store: SearchStore.getStore(this.searchterm),
                columns: [{
                    label: Dict.translate("_displayValue"),
                    field: "_displayValue",
                    canEdit: false,
                    sortable: false,
                    renderCell: function(object, data, td, options) {
                        var typeClass = Model.getType(object["_type"]);
                        var displayValues = typeClass.displayValues;
                        for (var i=0, count=displayValues.length; i<count; i++) {
                            var displayValue = displayValues[i];
                            var context = { 'data': object, 'place': 'list' };
                            when(Renderer.render(object[displayValue],
                                typeClass.getAttribute(displayValue), renderOptions, context), function(value) {
                                if (value) {
                                    td.innerHTML += value+" ";
                                }
                            });
                        }
                    }
                }, {
                    label: Dict.translate("_type"),
                    field: "_type",
                    sortable: false,
                    renderCell: function(object, data, td, options) {
                        td.innerHTML += Dict.translate(object["_type"]);
                    }
                }],
                actions: this.getGridActions(),
                enabledFeatures: []
            }, this.gridNode);
        },

        getGridActions: function() {
            var editAction = new Edit({
                page: this,
                route: "entity"
            });
            return [editAction];
        }
    });
});