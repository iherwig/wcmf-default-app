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

        // action parameters
        type: null,
        query: null,
        id: null,
        relation: null,
        translateValues: false,

        execute: function() {
            var params = {
                className: this.type,
                query: this.query,
                translateValues: this.translateValues
            };
            if (this.id && this.relation) {
                params.sourceId = this.id;
                params.relation = this.relation;
            }
            return new Process('exportCSV').run(params);
        }
    });
});