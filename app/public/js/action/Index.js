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

        name: 'index',
        iconClass: 'fa fa-search',

        deferred: null,

        execute: function() {
            return new Process('index').run();
        }
    });
});
