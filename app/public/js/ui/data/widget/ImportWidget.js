define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/on",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "../../_include/widget/ConfirmDlgWidget",
    "../../_include/widget/PopupDlgWidget",
    "../../../action/ImportCSV",
    "../../../locale/Dictionary",
    "dojo/text!./template/ExportWidget.html"
], function (
    declare,
    lang,
    Deferred,
    on,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    ConfirmDlg,
    PopupDlg,
    ImportCSV,
    Dict,
    template
) {
    /**
     * Import widget. Usage:
     * @code
     * new Import({
     *     type: Model.getTypeNameFromOid(oid)
     * }).execute().then(
     *     lang.hitch(this, function(result) {
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
    return declare([_WidgetBase, _TemplatedMixin], {

        templateString: lang.replace(template, Dict.tplTranslate),

        type: null, // type to import

        // options
        fileSelectCtrl: null,

        actionDeferred: null,

        postCreate: function () {
            this.inherited(arguments);

            this.fileSelectCtrl = domConstruct.create("input", {
                type: "file",
                style: {
                    display: "none"
                }
            }, this.fileSelect);
            on.once(this.fileSelectCtrl, "change", lang.hitch(this, function() {
                new ConfirmDlg({
                     title: Dict.translate("Confirm Import"),
                     message: Dict.translate("Do you really want to import <em>%0%</em> ?", [this.fileSelectCtrl.files[0].name]),
                     okCallback: lang.hitch(this, function() {
                          new ImportCSV({
                              type: this.type,
                              file: this.fileSelectCtrl.files[0]
                          }).execute().then(
                              lang.hitch(this, function(result) {
                                  var stats = result.stats;
                                  new PopupDlg({
                                      title: Dict.translate("Import result"),
                                      message: Dict.translate("The import process finished with the following result")+":<br>"+
                                          "<br><strong>"+Dict.translate("Processed rows")+":</strong> "+stats.processed+
                                          "<br><strong>"+Dict.translate("Skipped rows")+":</strong> "+stats.skipped+
                                          "<br>"+
                                          "<br><strong>"+Dict.translate("Updated objects")+":</strong> "+stats.updated+
                                          "<br><strong>"+Dict.translate("Inserted objects")+":</strong> "+stats.created,
                                      okCallback: function() {},
                                      cancelCallback: null
                                  }).show();
                                  this.actionDeferred.resolve(result);
                              }),
                              lang.hitch(this, function(error) {
                                  this.actionDeferred.reject(error);
                              }),
                              lang.hitch(this, function(status) {
                                  this.actionDeferred.progress(status);
                              })
                          );
                          domConstruct.destroy(this.fileSelectCtrl);
                     })
                }).show();
            }));

            this.actionDeferred = new Deferred();
        },

        execute: function() {
            this.fileSelectCtrl.click();
            return this.actionDeferred;
        }
    });
});