define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "../../_include/widget/PopupDlgWidget",
    "../../data/input/widget/BinaryCheckBox",
    "../../../action/ExportCSV",
    "../../../locale/Dictionary",
    "dojo/text!./template/ExportWidget.html"
], function (
    declare,
    lang,
    Deferred,
    _WidgetBase,
    _TemplatedMixin,
    PopupDlg,
    BinaryCheckBox,
    ExportCSV,
    Dict,
    template
) {
    /**
     * Export widget. Usage:
     * @code
     * new Export({
     *     type: Model.getTypeNameFromOid(oid),
     *     query: query,
     *     id: Model.getIdFromOid(oid), // optional
     *     relation: this.relation.name // optional
     * }).execute().then(
     *     lang.hitch(this, function() {
     *         // success
     *     }),
     *     lang.hitch(this, function(error) {
     *         // error
     *     }),
     *     lang.hitch(this, function(status) {
     *         // progress
     *     })
     * );
     * @endcode
     */
    return declare([PopupDlg], {

        type: null, // type to export or type of parent, if id is set
        query: '', // RQL query for selecting instances of type
        parentId: null, // id of the parent object (optional)
        relation: null, // relation in the parent object to export (optional)

        // options
        translateValuesCtrl: null,

        okBtnText: Dict.translate('Export'),

        style: "width: 600px",
        title: Dict.translate("Export"),

        actionDeferred: null,

        postCreate: function () {
            this.inherited(arguments);

            this.translateValuesCtrl = new BinaryCheckBox({
                name: 'translateValues',
                value: "0"
            }, this.optionsWidget.translateValuesCtrl);
            this.translateValuesCtrl.startup();

            this.actionDeferred = new Deferred();
        },

        okCallback: function() {
            new ExportCSV({
                type: this.type,
                query: this.query,
                id: this.parentId,
                relation: this.relation,
                translateValues: this.translateValuesCtrl.get("value")
            }).execute().then(
                lang.hitch(this, function() {
                    this.actionDeferred.resolve();
                }),
                lang.hitch(this, function(error) {
                    this.actionDeferred.reject(error);
                }),
                lang.hitch(this, function(status) {
                    this.actionDeferred.progress(status);
                })
            );
        },

        cancelCallback: function() {
            this.hide();
            this.actionDeferred.resolve();
        },

        execute: function() {
            this.show();
            return this.actionDeferred;
        },

        /**
         * @Override
         */
        getContentWidget: function() {
            this.optionsWidget = new (declare([_WidgetBase, _TemplatedMixin], {
                templateString: lang.replace(template, Dict.tplTranslate)
            }));
            return this.optionsWidget;
        }
    });
});