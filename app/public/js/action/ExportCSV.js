define([
    "dojo/_base/declare",
    "./Process",
    "./ActionBase"
], function (
    declare,
    Process,
    ActionBase
) {
    return declare([ActionBase], {

        name: 'exportCSV',
        iconClass: 'fa fa-file-excel-o',

        deferred: null,

        // action parameters
        type: null,

        execute: function() {
            return new Process('exportCSV').run({
                className: this.type
            });
        }
    });
});
