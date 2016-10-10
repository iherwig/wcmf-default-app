define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-construct",
    "../_include/_PageMixin",
    "../_include/_NotificationMixin",
    "../_include/widget/NavigationWidget",
    "../_include/widget/ConfirmDlgWidget",
    "../_include/FormLayout",
    "../_include/widget/Button",
    "../../action/Index",
    "../../action/ExportXML",
    "../../locale/Dictionary",
    "dojo/text!./template/AdminPage.html"
], function (
    require,
    declare,
    lang,
    Deferred,
    dom,
    domConstruct,
    _Page,
    _Notification,
    NavigationWidget,
    ConfirmDlg,
    FormLayout,
    Button,
    Index,
    ExportXML,
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Settings'),

        indexProcess: null,
        exportProcess: null,

        postCreate: function() {
            this.inherited(arguments);
            this.indexBtn.setCancelable(true);
            this.exportBtn.setCancelable(true);
        },

        confirmLeave: function(url) {
            if (this.indexProcess && !this.indexProcess.isFulfilled() ||
                    this.exportProcess && !this.exportProcess.isFulfilled()) {
                var deferred = new Deferred();
                new ConfirmDlg({
                    title: Dict.translate("Confirm Leave Page"),
                    message: Dict.translate("There are running processes. Leaving the page will abort these processes. Do you want to proceed?"),
                    okCallback: lang.hitch(this, function(dlg) {
                        if (this.indexProcess) {
                            this.indexProcess.cancel();
                        }
                        if (this.exportProcess) {
                            this.exportProcess.cancel();
                        }
                        deferred.resolve(true);
                    }),
                    cancelCallback: lang.hitch(this, function(dlg) {
                        deferred.resolve(false);
                    })
                }).show();
                return deferred.promise;
            }
            return this.inherited(arguments);
        },

        _index: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();
            this.hideNotification();

            if (!this.indexProcess || this.indexProcess.isFulfilled()) {
                this.indexProcess = new Index().execute();
                this.indexProcess.then(
                    lang.hitch(this, lang.partial(this.finishProcess, this.indexProcess, this.indexBtn,
                        Dict.translate("The search index was successfully updated."))),
                    lang.hitch(this, lang.partial(this.errorHandler, this.indexProcess, this.indexBtn)),
                    lang.hitch(this, lang.partial(this.progressHandler, this.indexProcess, this.indexBtn))
                );
                this.indexBtn.setProcessing();
            }
            else {
                this.indexProcess.cancel(Dict.translate("The index process is aborted."));
            }
        },

        _export: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();
            this.hideNotification();

            if (!this.exportProcess || this.exportProcess.isFulfilled()) {
                this.exportProcess = new ExportXML().execute();
                this.exportProcess.then(
                    lang.hitch(this, lang.partial(this.finishProcess, this.exportProcess, this.exportBtn,
                        Dict.translate("The content was successfully exported."))),
                    lang.hitch(this, lang.partial(this.errorHandler, this.exportProcess, this.exportBtn)),
                    lang.hitch(this, lang.partial(this.progressHandler, this.exportProcess, this.exportBtn))
                );
                this.exportBtn.setProcessing();
            }
            else {
                this.exportProcess.cancel(Dict.translate("The export process is aborted."));
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
                fadeOut: true,
                onHide: lang.hitch(this, function () {
                    var id = "status_"+btn.id;
                    var processStatusNode = dom.byId(id);
                    if (processStatusNode) {
                        domConstruct.destroy(processStatusNode);
                    }
                })
            });
        }
    });
});