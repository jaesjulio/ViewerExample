/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        // Contains the attachments part of the viewer
        var AttachmentsPart = /** @class */ (function () {
            function AttachmentsPart(main) {
                // Reference to the DocumentViewerDemoApp
                this._mainApp = null;
                // Attachments menu items
                this.headerToolbar_AttachmentsMenu = {
                    attachmentsMenuItem: "#attachmentsMenuItem",
                    openAttachmentMenuItem: "#openAttachment",
                    saveAttachmentMenuItem: "#saveAttachment",
                    attachmentPropertiesMenuItem: "#attachmentProperties"
                };
                this._attachmentsContextMenu = null;
                this._mainApp = main;
                this._selectedAttachmentIndex = -1;
                this.initAttachmentsUI();
                this.createAttachmentsImageViewer();
            }
            Object.defineProperty(AttachmentsPart.prototype, "imageViewer", {
                get: function () {
                    return this._attachmentsImageViewer;
                },
                enumerable: false,
                configurable: true
            });
            AttachmentsPart.prototype.initAttachmentsUI = function () {
                $(this._mainApp.navigationbar.showAttachmentsBtn).on("click", this.showAttachmentsBtn_Click.bind(this));
                // History menu
                $(this.headerToolbar_AttachmentsMenu.openAttachmentMenuItem).on("click", this.openAttachmentMenuItem_Click.bind(this));
                $(this.headerToolbar_AttachmentsMenu.saveAttachmentMenuItem).on("click", this.saveAttachmentMenuItem_Click.bind(this));
                $(this.headerToolbar_AttachmentsMenu.attachmentPropertiesMenuItem).on("click", this.attachmentPropertiesMenuItem_Click.bind(this));
            };
            AttachmentsPart.prototype.bindElements = function () {
                var _this = this;
                this.createContextMenu();
                var elements = this._mainApp.commandsBinder.elements;
                var element;
                // Attachment menu
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.openAttachmentMenuItem);
                element.canRun = function (documentViewer, value) {
                    return _this._selectedAttachmentIndex != -1;
                };
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.saveAttachmentMenuItem);
                element.canRun = function (documentViewer, value) {
                    return _this._selectedAttachmentIndex != -1;
                };
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.attachmentPropertiesMenuItem);
                element.canRun = function (documentViewer, value) {
                    return _this._selectedAttachmentIndex != -1;
                };
                elements.push(element);
            };
            AttachmentsPart.prototype.createContextMenu = function () {
                if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion)
                    return;
                var app = this._mainApp;
                var UpdateState = lt.Demos.Viewer.ContextMenuUpdateState;
                var common = [
                    {
                        name: "Open attachment",
                        icon: "Resources/Images/Icons/Open.png",
                        update: function (args) {
                            // Only work when we have an attachment
                            if (args.itemIndex < 0) {
                                args.updateState = UpdateState.disabled;
                                return;
                            }
                            args.action.name = "Open attachment";
                            args.updateState = UpdateState.active;
                        },
                        run: function (args) {
                            var attachmentsPart = args.menu.data;
                            attachmentsPart.openAttachment(args.itemIndex);
                        }
                    },
                    {
                        name: "Save attachment...",
                        icon: "Resources/Images/Icons/Save.png",
                        update: function (args) {
                            // Only work when we have an attachment
                            if (args.itemIndex < 0) {
                                args.updateState = UpdateState.disabled;
                                return;
                            }
                            args.action.name = "Save attachment";
                            args.updateState = UpdateState.active;
                        },
                        run: function (args) {
                            var attachmentsPart = args.menu.data;
                            attachmentsPart.saveAttachment(args.itemIndex);
                        }
                    },
                    {
                        name: "Properties...",
                        icon: "Resources/Images/Icons/Properties.png",
                        update: function (args) {
                            // Only work when we have an attachment
                            if (args.itemIndex < 0) {
                                args.updateState = UpdateState.disabled;
                                return;
                            }
                            args.action.name = "Attachment properties";
                            args.updateState = UpdateState.active;
                        },
                        run: function (args) {
                            var attachmentsPart = args.menu.data;
                            attachmentsPart.showAttachmentProperties(args.itemIndex);
                        }
                    }
                ];
                var attachmentEntries = common.concat([
                // Add more attachment element items
                ]);
                var attachmentsContextMenuContainer = document.querySelector("#attachmentsContextMenuParent");
                this._attachmentsContextMenu = new lt.Demos.Viewer.ContextMenu({
                    containerElement: attachmentsContextMenuContainer,
                    viewer: this._attachmentsImageViewer,
                    entries: attachmentEntries,
                    data: this
                });
                // Don't go off-screen in the Y direction
                this._attachmentsContextMenu.constrainY = true;
                if (lt.LTHelper.browser === lt.LTBrowser.safari) {
                    this._attachmentsContextMenu.condensed = false;
                    this._attachmentsContextMenu.showCondenseButton = false;
                }
                else {
                    this._attachmentsContextMenu.condensed = true;
                    this._attachmentsContextMenu.showCondenseButton = true;
                }
                var attachmentsContextMenu = this._attachmentsContextMenu;
                var onUpdate = function (args) {
                    // Sync up the condensed property
                    var condensed = args.menu.condensed;
                    if (attachmentsContextMenu) {
                        attachmentsContextMenu.condensed = condensed;
                    }
                    // Set the header name
                    if (!args.menu.condensed) {
                        return "Attachment " + (args.itemIndex + 1);
                    }
                    return null;
                };
                if (attachmentsContextMenu)
                    attachmentsContextMenu.onUpdate = onUpdate;
            };
            AttachmentsPart.prototype.handleRunCommand = function (e) {
                // Make sure the context interactive modes are enabled and started (can be disabled when running commands)
                if (this._attachmentsContextMenu) {
                    var contextMenu = this._attachmentsContextMenu.contextMenuMode;
                    if (!contextMenu.isStarted) {
                        contextMenu.isEnabled = true;
                        contextMenu.start(this._attachmentsContextMenu.viewer);
                    }
                }
            };
            AttachmentsPart.prototype.clear = function () {
                if (this._attachmentsImageViewer) {
                    var selectionMode = this._attachmentsImageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.selectItemsModeId);
                    if (selectionMode)
                        selectionMode.itemActivate.remove(this._itemActivateHandler);
                    this._attachmentsImageViewer.selectedItemsChanged.remove(this._imageViewerSelectedIndexChangedHandler);
                }
            };
            AttachmentsPart.prototype.onSizeChanged = function () {
                if (this._attachmentsImageViewer) {
                    this._attachmentsImageViewer.onSizeChanged();
                    this._attachmentsImageViewer.invalidate(lt.LeadRectD.empty);
                }
            };
            AttachmentsPart.prototype.showAttachmentsBtn_Click = function (e) {
                this._mainApp.showContainer(this._mainApp.attachmentsContainer, true);
            };
            AttachmentsPart.prototype.openAttachmentMenuItem_Click = function (e) {
                this.openAttachment(this._selectedAttachmentIndex);
            };
            AttachmentsPart.prototype.saveAttachmentMenuItem_Click = function (e) {
                this.saveAttachment(this._selectedAttachmentIndex);
            };
            AttachmentsPart.prototype.attachmentPropertiesMenuItem_Click = function (e) {
                this.showAttachmentProperties(this._selectedAttachmentIndex);
            };
            AttachmentsPart.prototype.createAttachmentsImageViewer = function () {
                var _this = this;
                var createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
                // Create an image viewer to be used to show the attachments of a LEADDocument
                var layout = new lt.Controls.ImageViewerVerticalViewLayout();
                layout.columns = 1;
                createOptions.thumbnailsCreateOptions.parentDiv = document.getElementById("attachments");
                createOptions.thumbnailsCreateOptions.viewLayout = layout;
                var imageViewer = new lt.Controls.ImageViewer(createOptions.thumbnailsCreateOptions);
                imageViewer.itemHorizontalAlignment = lt.Controls.ControlAlignment.center;
                imageViewer.itemVerticalAlignment = lt.Controls.ControlAlignment.center;
                imageViewer.viewHorizontalAlignment = lt.Controls.ControlAlignment.center;
                // Create a select interactive mode
                var selectItemsMode = new lt.Controls.ImageViewerSelectItemsInteractiveMode();
                selectItemsMode.selectionMode = lt.Controls.ImageViewerSelectionMode.single;
                selectItemsMode.mouseButtons = lt.Controls.MouseButtons.left | lt.Controls.MouseButtons.right;
                if (imageViewer.useElements)
                    selectItemsMode.autoDisableTransitions = false;
                this._itemActivateHandler = selectItemsMode.itemActivate.add(function (sender, e) { return _this.attachmentImageViewerItemActivate(sender, e); });
                // Create a pan interactive mode for the area outside the selection
                var panMode = new lt.Controls.ImageViewerPanZoomInteractiveMode();
                panMode.enableZoom = false;
                panMode.doubleTapSizeMode = lt.Controls.ControlSizeMode.none;
                imageViewer.beginUpdate();
                imageViewer.interactiveModes.add(selectItemsMode);
                imageViewer.interactiveModes.add(panMode);
                imageViewer.endUpdate();
                imageViewer.postRenderItem.add(function (sender, e) {
                    AttachmentsPart.overrideItemStyles(e.item);
                });
                // Get the attachment image
                this._attachmentImage = "Resources/Images/Icons/AttachmentItem.png";
                this._imageViewerSelectedIndexChangedHandler = imageViewer.selectedItemsChanged.add(function (sender, e) { return _this.attachmentImageViewerSelectedItemChanged(sender, e); });
                this._attachmentsImageViewer = imageViewer;
            };
            AttachmentsPart.prototype.attachmentImageViewerSelectedItemChanged = function (sender, e) {
                var selectedItems = this._attachmentsImageViewer.items.getSelected();
                if (selectedItems && selectedItems.length == 1)
                    this._selectedAttachmentIndex = this._attachmentsImageViewer.items.indexOf(selectedItems[0]);
                else
                    this._selectedAttachmentIndex = -1;
                this._mainApp.updateUIState();
            };
            AttachmentsPart.prototype.attachmentImageViewerItemActivate = function (sender, e) {
                this.openAttachment(this._selectedAttachmentIndex);
            };
            AttachmentsPart.overrideItemStyles = function (item) {
                // We are using the same styles for the normal item viewer thumbnail, however the attachments have a longer name (text)
                // So, increase the value from 22px to 80px
                if (item && item.itemElement) {
                    item.itemElement.style.paddingBottom = "80px";
                }
            };
            AttachmentsPart.prototype.populateAttachments = function (document) {
                // Remove any previous attachments
                this.removeAllAttachments();
                if (document == null || document.attachments.count == 0) {
                    return;
                }
                // Add new ones
                var selectedIndex = this._mainApp.historyPart.getAttachmentSelectedIndexForDocument(document);
                this._attachmentsImageViewer.beginUpdate();
                for (var i = 0; i < document.attachments.count; i++) {
                    var attachment = document.attachments.item(i);
                    var item = new lt.Controls.ImageViewerItem();
                    item.text = attachment.displayName;
                    item.url = this._attachmentImage;
                    item.tag = attachment;
                    if (selectedIndex == i)
                        item.isSelected = true;
                    this._attachmentsImageViewer.items.add(item);
                    AttachmentsPart.overrideItemStyles(item);
                }
                this._attachmentsImageViewer.endUpdate();
                if (selectedIndex != -1)
                    this._attachmentsImageViewer.ensureItemVisibleByIndex(selectedIndex);
            };
            AttachmentsPart.prototype.removeAllAttachments = function () {
                this._attachmentsImageViewer.beginUpdate();
                this._attachmentsImageViewer.items.clear();
                this._attachmentsImageViewer.endUpdate();
                this._selectedAttachmentIndex = -1;
            };
            Object.defineProperty(AttachmentsPart.prototype, "selectedAttachmentIndex", {
                get: function () {
                    return this._selectedAttachmentIndex;
                },
                enumerable: false,
                configurable: true
            });
            AttachmentsPart.prototype.openAttachment = function (attachmentIndex) {
                if (attachmentIndex < 0)
                    return;
                var currentDocument = this._mainApp.documentViewer.document;
                // The attachment has a document ID if it is already saved into the cache, if so, just load it
                // If the attachment document is not cached, then reload it
                var attachment = currentDocument.attachments.item(attachmentIndex);
                if (attachment.documentId && attachment.documentId.length > 0) {
                    this._mainApp.loadCachedDocument(attachment.documentId, false);
                }
                else {
                    this._mainApp.loadDocumentAttachment(currentDocument, attachment.attachmentNumber);
                }
            };
            AttachmentsPart.prototype.saveAttachment = function (attachmentIndex) {
                var _this = this;
                if (attachmentIndex < 0)
                    return;
                var currentDocument = this._mainApp.documentViewer.document;
                var attachment = currentDocument.attachments.item(attachmentIndex);
                if (!attachment)
                    return;
                if (attachment.documentId && attachment.documentId.length > 0) {
                    // We have it in the cache, use that instead
                    this.showSaveAttachmentDialog(attachment);
                }
                else {
                    // We need to save it into the cache first
                    this._mainApp.beginBusyOperation();
                    this._mainApp.loadingDlg.show(false, false, "Saving attachment ...", null, function () {
                        // Save will update the document in the server
                        var saveAttachmentToCachePromise = _this._mainApp.saveAttachmentToCache(currentDocument, attachment.attachmentNumber);
                        saveAttachmentToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                            _this._mainApp.showServiceError("Error saving the attachment.", jqXHR, statusText, errorThrown);
                        });
                        saveAttachmentToCachePromise.done(function (attachmentDocumentUri) {
                            if (DocumentViewerDemo.DocumentViewerDemoApp.isDocumentInCache(currentDocument)) {
                                // Update the attachment document ID in the current document
                                attachment.documentId = lt.Document.DocumentFactory.getLeadCacheData(attachmentDocumentUri);
                                // Save the current document into the cache first
                                var saveToCachePromise = _this._mainApp.saveDocumentToCache(currentDocument);
                                saveToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                                    _this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                                });
                                saveToCachePromise.done(function () {
                                    // Show the dialog to load/save it
                                    _this.showSaveAttachmentDialog(attachment);
                                });
                                saveToCachePromise.always(function () {
                                    _this._mainApp.endBusyOperation();
                                });
                            }
                            else {
                                _this._mainApp.endBusyOperation();
                                _this.showSaveAttachmentDialog(attachment);
                            }
                        });
                        saveAttachmentToCachePromise.always(function () {
                            _this._mainApp.endBusyOperation();
                        });
                    });
                }
            };
            AttachmentsPart.prototype.showSaveAttachmentDialog = function (attachment) {
                var _this = this;
                // Download it
                this._mainApp.exportJobDlg.show(this._mainApp, null, attachment);
                this._mainApp.exportJobDlg.onLoad = function (uri) {
                    _this.loadAttachmentFromCache(uri);
                };
            };
            AttachmentsPart.prototype.loadAttachmentFromCache = function (attachmentDocumentUri) {
                var loadOptions = this._mainApp.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.embedded);
                loadOptions.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
                this._mainApp.loadDocument(attachmentDocumentUri, null, loadOptions);
            };
            AttachmentsPart.prototype.showAttachmentProperties = function (attachmentIndex) {
                if (attachmentIndex < 0)
                    return;
                var currentDocument = this._mainApp.documentViewer.document;
                var attachment = currentDocument.attachments.item(attachmentIndex);
                this._mainApp.attachmentPropertiesDlg.show(attachment);
            };
            return AttachmentsPart;
        }());
        DocumentViewerDemo.AttachmentsPart = AttachmentsPart;
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
