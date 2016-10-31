define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/layout/ContentPane",
    "./PopupDlgWidget"
], function (
    declare,
    domConstruct,
    ContentPane,
    PopupDlg
) {
    /**
     * Modal media browser dialog. Usage:
     * @code
     * new MediaBrowserDlg({
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

        /**
         * @Override
         */
        getContentWidget: function() {
            return new ContentPane({
                content: domConstruct.create("iframe", {
                    src: appConfig.pathPrefix+'media?contentOnly=1',
                    style: "border: 0; width: 800px; height: 500px",
                    scrolling: "no"
                })
            });
        }
    });
});