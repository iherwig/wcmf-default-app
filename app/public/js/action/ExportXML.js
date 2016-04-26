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

        name: 'exportXML',
        iconClass: 'fa fa-file-code-o',

        deferred: null,

        execute: function() {
            return new Process('exportXML').run();
        }
    });
});
