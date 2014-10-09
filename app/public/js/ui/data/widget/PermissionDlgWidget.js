define([
    "dojo/_base/declare",
    "../../../locale/Dictionary",
    "../../_include/widget/PopupDlgWidget",
    "dojo/text!./template/PermissionDlgWidget.html"
], function (
    declare,
    Dict,
    PopupDlg,
    template
) {
    /**
     * Modal permission dialog. Usage:
     * @code
     * new PermissionDlg({
     *      type: "Author",
     *      title: "Choose Objects",
     *      message: "Select objects, you want to link to '"+Model.getTypeFromOid(data.oid).getDisplayValue(data)+"'",
     *      okCallback: function() {
     *          // will be called when OK button is clicked
     *          var deferred = new Deferred();
     *          // do something
     *          return deferred;
     *      },
     *      cancelCallback: function() {
     *          // will be called when Cancel button is clicked
     *          ....
     *      }
     * }).show();
     * @endcode
     */
    return declare([PopupDlg], {

        type: "",
        style: "width: 500px",
        title: '<i class="fa fa-shield"></i> '+Dict.translate("Permissions"),

        postCreate: function () {
            this.inherited(arguments);
        },

        /**
         * Provide custom template
         */
        getTemplate: function() {
            return template;
        }
    });
});