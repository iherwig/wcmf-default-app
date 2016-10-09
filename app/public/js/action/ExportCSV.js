define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/io-query",
    "./Process",
    "./ActionBase"
], function (
    declare,
    lang,
    ioQuery,
    Process,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'exportCSV',
        iconClass: 'fa fa-file-excel-o',

        // action parameters
        type: null,
        filter: null,

        execute: function() {
            var params = {
                className: this.type
            };
            if (this.filter) {
                lang.mixin(params, ioQuery.queryToObject(this.filter));
            }
            return new Process('exportCSV').run(params);
        }
    });
});
