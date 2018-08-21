define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-construct",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "../_include/FormLayout",
    "../_include/widget/Button",
    "../../action/Index",
    "../../action/ExportXML",
    "../../action/ClearCaches",
    "../../locale/Dictionary",
    "dojo/text!./template/AdminPage.html"
], function (
    require,
    declare,
    lang,
    dom,
    domConstruct,
    _Page,
    _Notification,
    NavigationWidget,
    FormLayout,
    Button,
    Index,
    ExportXML,
    ClearCaches,
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Settings'),

        processes: {},

        _index: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();
            this.handleProcessBtnClick('index', this.indexBtn, Index,
                Dict.translate("The search index was successfully updated."));
        },

        _export: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();
            this.handleProcessBtnClick('export', this.exportBtn, ExportXML,
                Dict.translate("The content was successfully exported."));
        },

        _clearCaches: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            this.clearCachesBtn.setProcessing();
            new ClearCaches({
                init: lang.hitch(this, function() {
                    this.hideNotification();
                })
            }).execute().then(lang.hitch(this, function(response) {
                // success
                this.showNotification({
                    type: "ok",
                    message: Dict.translate("The caches were cleared successfully."),
                    fadeOut: true
                });
                this.clearCachesBtn.reset();
            }), lang.hitch(this, function(error) {
                // error
                this.showBackendError(error);
                this.clearCachesBtn.reset();
            }));
        },

        handleProcessBtnClick: function(name, btn, action, successMessage) {
            this.hideNotification();

            btn.setCancelable(true);
            var process = this.processes[name];
            if (!process || process.isFulfilled()) {
                process = new action().execute();
                process.then(
                    lang.hitch(this, lang.partial(this.finishProcess, process, btn,
                        successMessage)),
                    lang.hitch(this, lang.partial(this.errorHandler, process, btn)),
                    lang.hitch(this, lang.partial(this.progressHandler, process, btn))
                );
                btn.setProcessing();
                this.processes[name] = process;
                this.waitFor(process);
            }
            else {
                process.cancel(Dict.translate("The <em>%0%</em> process is aborted.", [name]));
            }
        },

        finishProcess: function(process, btn, message) {
            btn.reset();
            this.showResult(process, btn, message);
        },

        errorHandler: function(process, btn, error) {
            btn.reset();
            if (process.isCanceled()) {
                this.showResult(process, btn, error);
            }
            else {
                this.showBackendError(error);
            }
        },

        progressHandler: function(process, btn, data) {
            // set button progress
            var progress = data.stepNumber/data.numberOfSteps;
            btn.setProgress(progress);

            // add status line
            var id = "status_"+btn.id;
            var processStatusNode = dom.byId(id);
            if (processStatusNode) {
                domConstruct.destroy(processStatusNode);
            }
            processStatusNode = domConstruct.toDom('<li id="'+id+'" class="list-group-item"><span class="badge">'+btn.initialLabel+'</span> <em>'+data.stepName+'</em></li>');
            domConstruct.place(processStatusNode, this.statusNode);

        },

        showResult: function(process, btn, message) {
            this.showNotification({
                type: "ok",
                message: message,
                fadeOut: true
            }).then(lang.hitch(this, function () {
                var id = "status_"+btn.id;
                var processStatusNode = dom.byId(id);
                if (processStatusNode) {
                    domConstruct.destroy(processStatusNode);
                }
            }));
        }
    });
});