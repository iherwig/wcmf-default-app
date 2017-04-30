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
        query: null,

        execute: function() {
            var params = {
                className: this.type,
                query: this.query
            };
            return new Process('exportCSV').run(params);
        }
    });
});
