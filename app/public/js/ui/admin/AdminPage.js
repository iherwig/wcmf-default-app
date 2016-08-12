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
    Dict,
    template
) {
    return declare([_Page, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,
        title: Dict.translate('Settings'),

        postCreate: function() {
            this.inherited(arguments);
        },

        _index: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            var message = Dict.translate("The search index was successfully updated.");

            this.indexBtn.setProcessing();
            this.hideNotification();
            new Index().execute().then(
                lang.hitch(this, lang.partial(this.finishProcess, this.indexBtn, message)),
                lang.hitch(this, lang.partial(this.errorHandler, this.indexBtn)),
                lang.hitch(this, lang.partial(this.progressHandler, this.indexBtn))
            );
        },

        _export: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            var message = Dict.translate("The content was successfully exported.");

            this.exportBtn.setProcessing();
            this.hideNotification();
            new ExportXML().execute().then(
                lang.hitch(this, lang.partial(this.finishProcess, this.exportBtn, message)),
                lang.hitch(this, lang.partial(this.errorHandler, this.exportBtn)),
                lang.hitch(this, lang.partial(this.progressHandler, this.exportBtn))
            );
        },

        finishProcess: function(btn, message) {
            btn.reset();
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
        },

        errorHandler: function(btn, error) {
            btn.reset();
            this.showBackendError(error);
        },

        progressHandler: function(btn, data) {
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

        }
    });
});