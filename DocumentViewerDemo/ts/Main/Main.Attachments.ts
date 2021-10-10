/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module DocumentViewerDemo {
      // Contains the attachments part of the viewer
      export class AttachmentsPart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // Attachments menu items
         private headerToolbar_AttachmentsMenu = {
            attachmentsMenuItem: "#attachmentsMenuItem",
            openAttachmentMenuItem: "#openAttachment",
            saveAttachmentMenuItem: "#saveAttachment",
            attachmentPropertiesMenuItem: "#attachmentProperties"
         };

         private _selectedAttachmentIndex: number;
         private _attachmentsImageViewer: lt.Controls.ImageViewer;
         public get imageViewer(): lt.Controls.ImageViewer {
            return this._attachmentsImageViewer;
         }
         private _imageViewerSelectedIndexChangedHandler: lt.LeadEventHandler;
         private _itemActivateHandler: lt.LeadEventHandler;
         private _attachmentImage: string;
         private _attachmentsContextMenu: lt.Demos.Viewer.ContextMenu = null;

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this._selectedAttachmentIndex = -1;

            this.initAttachmentsUI();
            this.createAttachmentsImageViewer();
         }

         private initAttachmentsUI(): void {
            $(this._mainApp.navigationbar.showAttachmentsBtn).on("click", this.showAttachmentsBtn_Click.bind(this));

            // History menu
            $(this.headerToolbar_AttachmentsMenu.openAttachmentMenuItem).on("click", this.openAttachmentMenuItem_Click.bind(this));
            $(this.headerToolbar_AttachmentsMenu.saveAttachmentMenuItem).on("click", this.saveAttachmentMenuItem_Click.bind(this));
            $(this.headerToolbar_AttachmentsMenu.attachmentPropertiesMenuItem).on("click", this.attachmentPropertiesMenuItem_Click.bind(this));
         }

         public bindElements(): void {
            this.createContextMenu();

            let elements = this._mainApp.commandsBinder.elements;
            let element: CommandBinderElement;

            // Attachment menu
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.openAttachmentMenuItem);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this._selectedAttachmentIndex != -1;
            };
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.saveAttachmentMenuItem);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this._selectedAttachmentIndex != -1;
            };
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_AttachmentsMenu.attachmentPropertiesMenuItem);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this._selectedAttachmentIndex != -1;
            };
            elements.push(element);
         }

         private createContextMenu(): void {
            if (DocumentViewerDemoApp.isMobileVersion)
               return;

            var app = this._mainApp;

            var UpdateState = lt.Demos.Viewer.ContextMenuUpdateState;

            var common: lt.Demos.Viewer.ContextMenuActionEntry[] = [
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
                     var attachmentsPart = <AttachmentsPart>args.menu.data;
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
                     var attachmentsPart = <AttachmentsPart>args.menu.data;
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
                     var attachmentsPart = <AttachmentsPart>args.menu.data;
                     attachmentsPart.showAttachmentProperties(args.itemIndex);
                  }
               }
            ];

            var attachmentEntries = common.concat([
               // Add more attachment element items
            ]);

            var attachmentsContextMenuContainer = <HTMLElement>document.querySelector("#attachmentsContextMenuParent");
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
            var onUpdate = function (args: lt.Demos.Viewer.ContextMenuArgs) {

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
         }

         public handleRunCommand(e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            // Make sure the context interactive modes are enabled and started (can be disabled when running commands)
            if (this._attachmentsContextMenu) {
               var contextMenu = this._attachmentsContextMenu.contextMenuMode;
               if (!contextMenu.isStarted) {
                  contextMenu.isEnabled = true;
                  contextMenu.start(this._attachmentsContextMenu.viewer);
               }
            }
         }

         public clear(): void {
            if (this._attachmentsImageViewer) {

               var selectionMode = <lt.Controls.ImageViewerSelectItemsInteractiveMode>this._attachmentsImageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.selectItemsModeId);
               if (selectionMode)
                  selectionMode.itemActivate.remove(this._itemActivateHandler);

               this._attachmentsImageViewer.selectedItemsChanged.remove(this._imageViewerSelectedIndexChangedHandler);
            }
         }

         public onSizeChanged(): void {
            if (this._attachmentsImageViewer) {
               this._attachmentsImageViewer.onSizeChanged();
               this._attachmentsImageViewer.invalidate(lt.LeadRectD.empty);
            }
         }

         private showAttachmentsBtn_Click(e: JQueryEventObject): void {
            this._mainApp.showContainer(this._mainApp.attachmentsContainer, true);
         }

         private openAttachmentMenuItem_Click(e: JQueryEventObject): void {
            this.openAttachment(this._selectedAttachmentIndex);
         }

         private saveAttachmentMenuItem_Click(e: JQueryEventObject): void {
            this.saveAttachment(this._selectedAttachmentIndex);
         }

         private attachmentPropertiesMenuItem_Click(e: JQueryEventObject): void {
            this.showAttachmentProperties(this._selectedAttachmentIndex);
         }

         private createAttachmentsImageViewer(): void {
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

            this._itemActivateHandler = selectItemsMode.itemActivate.add((sender: any, e: lt.Controls.ImageViewerItemActivateEventArgs) => this.attachmentImageViewerItemActivate(sender, e));

            // Create a pan interactive mode for the area outside the selection
            var panMode = new lt.Controls.ImageViewerPanZoomInteractiveMode();
            panMode.enableZoom = false;
            panMode.doubleTapSizeMode = lt.Controls.ControlSizeMode.none;

            imageViewer.beginUpdate();
            imageViewer.interactiveModes.add(selectItemsMode);
            imageViewer.interactiveModes.add(panMode);
            imageViewer.endUpdate();

            imageViewer.postRenderItem.add((sender: any, e: lt.Controls.ImageViewerRenderEventArgs) => {
               AttachmentsPart.overrideItemStyles(e.item);
            });

            // Get the attachment image
            this._attachmentImage = "Resources/Images/Icons/AttachmentItem.png";

            this._imageViewerSelectedIndexChangedHandler = imageViewer.selectedItemsChanged.add((sender: any, e: lt.LeadEventArgs) => this.attachmentImageViewerSelectedItemChanged(sender, e));
            this._attachmentsImageViewer = imageViewer;
         }

         private attachmentImageViewerSelectedItemChanged(sender: any, e: lt.LeadEventArgs): void {
            var selectedItems: lt.Controls.ImageViewerItem[] = this._attachmentsImageViewer.items.getSelected();
            if (selectedItems && selectedItems.length == 1)
               this._selectedAttachmentIndex = this._attachmentsImageViewer.items.indexOf(selectedItems[0]);
            else
               this._selectedAttachmentIndex = -1;
            this._mainApp.updateUIState();
         }

         private attachmentImageViewerItemActivate(sender: any, e: lt.Controls.ImageViewerItemActivateEventArgs ): void {
            this.openAttachment(this._selectedAttachmentIndex);
         }

         private static overrideItemStyles(item: lt.Controls.ImageViewerItem): void {
            // We are using the same styles for the normal item viewer thumbnail, however the attachments have a longer name (text)
            // So, increase the value from 22px to 80px
            if (item && item.itemElement) {
               item.itemElement.style.paddingBottom = "80px";
            }
         }

         public populateAttachments(document: lt.Document.LEADDocument): void {
            // Remove any previous attachments
            this.removeAllAttachments();

            if (document == null || document.attachments.count == 0) {
               return;
            }

            // Add new ones
            var selectedIndex = this._mainApp.historyPart.getAttachmentSelectedIndexForDocument(document);
            this._attachmentsImageViewer.beginUpdate();
            for (var i = 0; i < document.attachments.count; i++) {
               var attachment: lt.Document.DocumentAttachment = document.attachments.item(i);
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
         }

         private removeAllAttachments(): void {
            this._attachmentsImageViewer.beginUpdate();
            this._attachmentsImageViewer.items.clear();
            this._attachmentsImageViewer.endUpdate();

            this._selectedAttachmentIndex = -1;
         }

         public get selectedAttachmentIndex(): number {
            return this._selectedAttachmentIndex;
         }

         private openAttachment(attachmentIndex: number): void {
            if (attachmentIndex < 0)
               return;

            var currentDocument = this._mainApp.documentViewer.document;

            // The attachment has a document ID if it is already saved into the cache, if so, just load it
            // If the attachment document is not cached, then reload it

            var attachment: lt.Document.DocumentAttachment = currentDocument.attachments.item(attachmentIndex);
            if (attachment.documentId && attachment.documentId.length > 0) {
               this._mainApp.loadCachedDocument(attachment.documentId, false);
            } else {
               this._mainApp.loadDocumentAttachment(currentDocument, attachment.attachmentNumber);
            }
         }

         private saveAttachment(attachmentIndex: number): void {
            if (attachmentIndex < 0)
               return;

            var currentDocument = this._mainApp.documentViewer.document;
            var attachment: lt.Document.DocumentAttachment = currentDocument.attachments.item(attachmentIndex);

            if (!attachment)
               return;

            if (attachment.documentId && attachment.documentId.length > 0) {
               // We have it in the cache, use that instead
               this.showSaveAttachmentDialog(attachment);
            } else {
               // We need to save it into the cache first
               this._mainApp.beginBusyOperation();
               this._mainApp.loadingDlg.show(false, false, "Saving attachment ...", null, () => {
                  // Save will update the document in the server
                  var saveAttachmentToCachePromise = this._mainApp.saveAttachmentToCache(currentDocument, attachment.attachmentNumber);

                  saveAttachmentToCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                     this._mainApp.showServiceError("Error saving the attachment.", jqXHR, statusText, errorThrown);
                  });

                  saveAttachmentToCachePromise.done((attachmentDocumentUri: string): void => {
                     if (DocumentViewerDemoApp.isDocumentInCache(currentDocument)) {
                        // Update the attachment document ID in the current document
                        attachment.documentId = lt.Document.DocumentFactory.getLeadCacheData(attachmentDocumentUri);
                        // Save the current document into the cache first
                        var saveToCachePromise = this._mainApp.saveDocumentToCache(currentDocument);

                        saveToCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                           this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                        });

                        saveToCachePromise.done((): void => {
                           // Show the dialog to load/save it
                           this.showSaveAttachmentDialog(attachment);
                        });

                        saveToCachePromise.always((): void => {
                           this._mainApp.endBusyOperation();
                        });
                     } else {
                        this._mainApp.endBusyOperation();
                        this.showSaveAttachmentDialog(attachment);
                     }
                  });

                  saveAttachmentToCachePromise.always((): void => {
                     this._mainApp.endBusyOperation();
                  });
               });
            }
         }

         private showSaveAttachmentDialog(attachment: lt.Document.DocumentAttachment): void {
            // Download it
            this._mainApp.exportJobDlg.show(this._mainApp, null, attachment);
            this._mainApp.exportJobDlg.onLoad = (uri) => {
               this.loadAttachmentFromCache(uri);
            }
         }

         private loadAttachmentFromCache(attachmentDocumentUri: string): void {
            var loadOptions = this._mainApp.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.embedded);
            loadOptions.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
            this._mainApp.loadDocument(attachmentDocumentUri, null, loadOptions);
         }

         private showAttachmentProperties(attachmentIndex: number): void {
            if (attachmentIndex < 0)
               return;

            var currentDocument: lt.Document.LEADDocument = this._mainApp.documentViewer.document;
            var attachment: lt.Document.DocumentAttachment = currentDocument.attachments.item(attachmentIndex);

            this._mainApp.attachmentPropertiesDlg.show(attachment);
         }
      }
   }
}
