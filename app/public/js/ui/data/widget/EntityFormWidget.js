define( [
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/query",
    "dijit/registry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/DropDownButton",
    "dijit/Menu",
    "dijit/MenuItem",
    "../../_include/FormLayout",
    "../../_include/_NotificationMixin",
    "../../_include/widget/Button",
    "../../../action/CheckPermissions",
    "../../../action/Lock",
    "../../../model/meta/Model",
    "../../../persistence/BackendError",
    "../../../persistence/Store",
    "../../../persistence/RelationStore",
    "../../../persistence/Entity",
    "../../../action/Delete",
    "../../../locale/Dictionary",
    "../input/Factory",
    "./EntityRelationWidget",
    "./PermissionDlgWidget",
    "dojo/text!./template/EntityFormWidget.html"
],
function(
    require,
    declare,
    lang,
    all,
    topic,
    domClass,
    domConstruct,
    query,
    registry,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    DropDownButton,
    Menu,
    MenuItem,
    FormLayout,
    _Notification,
    Button,
    CheckPermissions,
    Lock,
    Model,
    BackendError,
    Store,
    RelationStore,
    Entity,
    Delete,
    Dict,
    ControlFactory,
    EntityRelationWidget,
    PermissionDlg,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Notification], {

        templateString: lang.replace(template, Dict.tplTranslate),
        contextRequire: require,

        baseRoute: "entity",
        entity: {}, // entity to edit
        sourceOid: null, // object id of the source object of a relation
                         // (ignored if isNew == false)
        relation: null, // the relation in which the object should be created
                        // related to sourceOid (ignored if isNew == false)
        page: null,

        type: null,
        typeClass: null,
        formId: "",
        fieldContainerId: "",
        headline: "",
        isNew: false,
        isModified: false,
        isLocked: false,
        isLockOwner: true,
        permissions: {},

        language: appConfig.defaultLanguage,
        isTranslation: false,
        original: null, // untranslated entity

        onCreated: null, // function to be called after the widget is created

        attributeWidgets: [],
        layoutWidget: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            this.type = Model.getTypeNameFromOid(this.entity.oid);
            this.typeClass = Model.getType(this.type);
            this.formId = "entityForm_"+this.entity.oid;
            this.fieldContainerId = "fieldContainer_"+this.entity.oid;
            this.headline = this.typeClass.getDisplayValue(this.entity);
            this.isNew = Model.isDummyOid(this.entity.oid);
            this.isTranslation = this.language !== appConfig.defaultLanguage;

            this.languageName = appConfig.languages[this.language];
        },

        _setHeadlineAttr: function (val) {
            this.headlineNode.innerHTML = val;
        },

        postCreate: function() {
            this.inherited(arguments);

            var deferredList = [];
            // load input widgets referenced in attributes' input type
            deferredList.push(ControlFactory.loadControlClasses(this.type));
            // check instance permissions
            var requiredPermissions = [
                Model.removeDummyOid(this.entity.oid)+'??update',
                Model.removeDummyOid(this.entity.oid)+'??delete',
                '??setPermissions'
            ];
            var attributes = this.getAttributes();
            for (var i=0, count=attributes.length; i<count; i++) {
                var attribute = attributes[i];
                requiredPermissions.push(Model.removeDummyOid(this.entity.oid)+'.'+attribute.name+'??read');
                requiredPermissions.push(Model.removeDummyOid(this.entity.oid)+'.'+attribute.name+'??update');
            }
            // check relation permissions
            var relations = this.getRelations();
            for (var i=0, count=relations.length; i<count; i++) {
                var relation = relations[i];
                requiredPermissions.push(Model.getFullyQualifiedTypeName(relation.type)+'??read');
            }
            deferredList.push(new CheckPermissions().execute({}, requiredPermissions));

            all(deferredList).then(lang.hitch(this, function(results) {
                var controls = results[0];
                this.permissions = results[1];

                this.layoutWidget = registry.byNode(this.fieldsNode.domNode);

                // add attribute widgets
                this.attributeWidgets = [];
                var attributes = this.getAttributes();
                for (var i=0, count=attributes.length; i<count; i++) {
                    var attribute = attributes[i];
                    // only show attributes with read permission
                    if (this.permissions[Model.removeDummyOid(this.entity.oid)+'.'+attribute.name+'??read'] === true) {
                        var controlClass = controls[attribute.inputType];
                        var attributeWidget = new controlClass({
                            name: attribute.name,
                            value: this.entity[attribute.name],
                            disabled: this.typeClass ? !this.typeClass.isEditable(attribute, this.entity) : false,
                            helpText: Dict.translate(attribute.description),
                            inputType: attribute.inputType,
                            original: this.original
                        });
                        if (this.permissions[Model.removeDummyOid(this.entity.oid)+'??update'] === true &&
                                this.permissions[Model.removeDummyOid(this.entity.oid)+'.'+attribute.name+'??update'] === true) {
                            this.own(attributeWidget.on('change', lang.hitch(this, function(widget) {
                                var widgetValue = widget.get("value");
                                var entityValue = this.entity.get(widget.name) || "";
                                if (widgetValue !== entityValue) {
                                    this.setModified(true);
                                }
                            }, attributeWidget)));
                        }
                        else {
                            // disable widget, if no update permission
                            attributeWidget.set('disabled', true);
                        }
                        this.layoutWidget.addChild(attributeWidget);

                        this.attributeWidgets.push(attributeWidget);
                    }
                }

                // add relation widgets
                if (!this.isNew) {
                    var relations = this.getRelations();
                    for (var i=0, count=relations.length; i<count; i++) {
                        var relation = relations[i];
                        // only show relations with read permission
                        if (this.permissions[Model.getFullyQualifiedTypeName(relation.type)+'??read'] === true) {
                            var relationWidget = new EntityRelationWidget({
                                route: this.baseRoute,
                                entity: this.entity,
                                relation: relation,
                                page: this.page
                            });
                            this.relationsNode.appendChild(relationWidget.domNode);
                        }
                    }
                }

                // set button states
                this.setBtnState("save", false); // no modifications yet
                this.setBtnState("delete", this.canDelete());
                if (this.permissions['??setPermissions'] !== true) {
                    domClass.add(this.permissionsBtn.domNode, "hidden");
                }

                // handle locking
                if (!this.isNew) {
                    // assume the object is locked
                    this.setLockState(true, false);
                    this.acquireLock();
                }
                else {
                    query(this.lockNode).style("display", "none");
                }

                if (!this.isNew) {
                    this.buildLanguageMenu();
                }

                if (this.onCreated instanceof Function) {
                    this.onCreated(this);
                }
            }), lang.hitch(this, function(error) {
                // error
                this.showBackendError(error);
            }));

            this.own(
                topic.subscribe('ui/_include/widget/GridWidget/error', lang.hitch(this, function(error) {
                    this.showBackendError(error);
                }))
            );
        },

        startup: function() {
            this.inherited(arguments);
            for (var i=0, count=this.attributeWidgets.length; i<count; i++) {
                this.attributeWidgets[i].startup();
            }
            this.layoutWidget.startup();
        },

        /**
         * Get the type's attributes to display in the widget
         * @returns Array
         */
        getAttributes: function() {
            var typeClass = Model.getType(this.type);
            return typeClass.getAttributes('DATATYPE_ATTRIBUTE');
        },

        /**
         * Get the type's relations to display in the widget
         * @returns Array
         */
        getRelations: function() {
            var typeClass = Model.getType(this.type);
            return typeClass.getRelations();
        },

        buildLanguageMenu: function() {
            if (!this.languageMenuPopupNode) {
                return;
            }
            var languageCount = 0;
            var menu = registry.byId(this.languageMenuPopupNode.get("id"));
            var form = this;
            for (var langKey in appConfig.languages) {
                var menuItem = new MenuItem({
                    label: appConfig.languages[langKey],
                    langKey: langKey,
                    onClick: function() {
                        var route = form.page.getRoute("entity");
                        var queryParams = this.langKey !== appConfig.defaultLanguage ? {lang: this.langKey} : undefined;
                        var url = route.assemble({
                            type: Model.getSimpleTypeName(form.type),
                            id: Model.getIdFromOid(form.entity.oid)
                        }, queryParams);
                        form.page.pushConfirmed(url);
                    }
                });
                if (langKey === this.language) {
                    menuItem.set("disabled", true);
                }
                menu.addChild(menuItem);
                languageCount++;
            }
            if (languageCount <= 1) {
                // destroy menu
                domConstruct.destroy(this.languageMenuNode);
            }
            else {
                // show menu
                query(this.languageMenuNode).style("display", "inline");
            }
        },

        setBtnState: function(btnName, isEnabled) {
            var btn = this[btnName+"Btn"];
            if (btn) {
                btn.set("disabled", !isEnabled);
            }
        },

        setCtrlState: function(isEnabled) {
            for (var i=0, c=this.attributeWidgets.length; i<c; i++) {
                var widget = this.attributeWidgets[i];
                widget.set("readonly", !isEnabled);
            }
        },

        setLockState: function(isLocked, isLockOwner) {
            this.isLocked = isLocked;
            this.isLockOwner = isLockOwner;
            if (this.isLocked) {
                domClass.remove(this.lockNode, "fa fa-unlock");
                domClass.add(this.lockNode, "fa fa-lock");
            }
            else {
                domClass.remove(this.lockNode, "fa fa-lock");
                domClass.add(this.lockNode, "fa fa-unlock");
            }
            // set controls, if locked by another user
            if (isLocked && !isLockOwner) {
                this.setCtrlState(false);
                this.setBtnState("save", false);
                this.setBtnState("delete", false);
            }
            else {
                this.setCtrlState(true);
                // not locked by others
                // only reset delete button, because there's no modification yet
                this.setBtnState("delete", this.canDelete());
            }
        },

        setModified: function(modified) {
            this.isModified = modified;

            var state = modified === true ? "dirty" : "clean";
            this.entity.setState(state);
            this.setBtnState("save", modified);
        },

        isRelatedObject: function() {
            return (this.sourceOid && this.relation);
        },

        acquireLock: function() {
            new Lock({
                action: "lock",
                lockType: "optimistic",
                init: lang.hitch(this, function(data) {})
            }).execute({}, this.entity).then(
                lang.hitch(this, function(result) {
                    // success
                    // not locked by other user
                    this.setLockState(false, true);
                    if (result.type === "pessimistic") {
                        // pessimistic lock owned by user
                        this.setLockState(true, true);
                    }
                }),
                lang.hitch(this, function(error) {
                    // check for existing lock
                    var error = BackendError.parseResponse(error);
                    if (error.code === "OBJECT_IS_LOCKED") {
                        this.setLockState(true, false);
                        this.showNotification({
                            type: "ok",
                            fadeOut: true,
                            message: error.message
                        });
                    }
                    else {
                        this.showBackendError(error);
                    }
                })
            );
        },

        canDelete: function() {
            return !this.isNew && this.permissions[Model.removeDummyOid(this.entity.oid)+'??delete'] === true;
        },

        _save: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            if (this.isModified) {
                // update entity from form data
                var data = {};
                for (var i=0, c=this.attributeWidgets.length; i<c; i++) {
                    var widget = this.attributeWidgets[i];
                    data[widget.get("name")] = widget.get("value");
                }
                data = lang.mixin(lang.clone(this.entity), data);

                this.saveBtn.setProcessing();
                this.hideNotification();

                var store = null;
                if (this.isRelatedObject()) {
                    store = RelationStore.getStore(this.sourceOid, this.relation);
                }
                else {
                    store = Store.getStore(this.type, this.language);
                }

                var storeMethod = this.isNew ? "add" : "put";
                store[storeMethod](data, {overwrite: !this.isNew}).then(lang.hitch(this, function(response) {
                    // callback completes
                    this.saveBtn.reset();
                    if (response.errorMessage) {
                        // error
                        this.showBackendError(response);
                    }
                    else {
                        // success

                        // update entity
                        var typeClass = Model.getType(this.type);
                        var attributes = typeClass.getAttributes();
                        for (var i=0, count=attributes.length; i<count; i++) {
                            var attributeName = attributes[i].name;
                            // notify listeners
                            this.entity.set(attributeName, response[attributeName]);
                        }
                        this.entity.set('oid', response.oid);

                        // reset attribute widgets
                        for (var i=0, c=this.attributeWidgets.length; i<c; i++) {
                            this.attributeWidgets[i].setDirty(false);
                        }

                        var message = this.isNew ? Dict.translate("'%0%' was successfully created", [this.typeClass.getDisplayValue(this.entity)]) :
                                Dict.translate("'%0%' was successfully updated", [this.typeClass.getDisplayValue(this.entity)]);
                        this.showNotification({
                            type: "ok",
                            message: message,
                            fadeOut: true,
                            onHide: lang.hitch(this, function() {
                                this.setBtnState("save", false);
                                if (this.isNew) {
                                    this.isNew = false;

//                                    if (this.isRelatedObject()) {
//                                        // close own tab
//                                        topic.publish("tab-closed", {
//                                            oid: Model.createDummyOid(this.type)
//                                        });
//                                        this.destroyRecursive();
//                                    }
//                                    else {
                                        // update current tab
                                        topic.publish("tab-closed", {
                                            oid: Model.createDummyOid(this.type),
                                            nextOid: this.entity.oid
                                        });
//                                    }
                                }
                            })
                        });
                        this.set("headline", this.typeClass.getDisplayValue(this.entity));
                        this.setModified(false);
                        this.acquireLock();
                    }
                }), lang.hitch(this, function(error) {
                    // error
                    this.saveBtn.reset();

                    // check for concurrent update
                    var error = BackendError.parseResponse(error);
                    if (error.code === "CONCURRENT_UPDATE" || error.code === "OBJECT_IS_LOCKED") {
                        this.showNotification({
                            type: "error",
                            message: error.message+' <a href="'+location.href+'" class="alert-error"><i class="fa fa-refresh"></i></a>'
                        });
                        this.setLockState(true, false);
                    }
                    else if (error.code === "ATTRIBUTE_VALUE_INVALID") {
                        var message = '';
                        var attributes = error.data.invalidAttributeValues;
                        for (var i=0, count=attributes.length; i<count; i++) {
                            message += attributes[i].message+"<br>";
                        }
                        this.showNotification({
                            type: "error",
                            message: message
                        });
                    }
                    else {
                        this.showBackendError(error);
                    }
                }));
            }
        },

        _delete: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            if (this.isNew) {
                return;
            }

            new Delete({
                init: lang.hitch(this, function(data) {
                    this.hideNotification();
                }),
                callback: lang.hitch(this, function(data, result) {
                    // success
                    // notify tab panel to close tab
                    topic.publish("tab-closed", {
                        oid: this.entity.oid
                    });
                    this.destroyRecursive();
                }),
                errback: lang.hitch(this, function(data, result) {
                    // error
                    this.showBackendError(result);
                })
            }).execute(e, this.entity);
        },

        _toggleLock: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            if (!this.isLockOwner) {
                return;
            }

            var displayValue = this.typeClass.getDisplayValue(this.entity);
            this.showNotification({
                type: "process",
                message: this.isLocked ? Dict.translate("Unlocking '%0%'", [displayValue]) :
                        Dict.translate("Locking '%0%'", [displayValue])
            });
            new Lock({
                action: this.isLocked ? "unlock" : "lock",
                lockType: "pessimistic",
                init: lang.hitch(this, function(data) {})
            }).execute(e, this.entity).then(
                lang.hitch(this, function(result) {
                    // success
                    this.showNotification({
                        type: "ok",
                        message: this.isLocked ? Dict.translate("'%0%' was successfully unlocked", [displayValue]) :
                                Dict.translate("'%0%' was successfully locked", [displayValue]),
                        fadeOut: true
                    });
                    this.setLockState(!this.isLocked, true);
                    // update optimistic lock
                    this.acquireLock();
                }),
                lang.hitch(this, function(error) {
                    // check for existing lock
                    var error = BackendError.parseResponse(error);
                    if (error.code === "OBJECT_IS_LOCKED") {
                        this.setLockState(true, false);
                    }
                    this.showBackendError(error);
                })
            );
        },

        _permissions: function(e) {
            // prevent the page from navigating after submit
            e.preventDefault();

            var displayValue = this.typeClass.getDisplayValue(this.entity);
            new PermissionDlg({
                oid: this.entity.oid,
                message: Dict.translate("Permissions for '%0%'", [displayValue])
            }).show();
        }
    });
});