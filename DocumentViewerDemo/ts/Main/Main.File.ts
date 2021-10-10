/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      // Contains the file part
      export class FilePart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // File menu items
         private headerToolbar_FileMenu = {
            uploadDocumentMenuItem: "#uploadDocument",
            openDocumentFromUrlMenuItem: "#openDocumentFromUrl",
            loadDocumentFromCacheMenuItem: "#loadDocumentFromCache",
            openFromDocumentStorageMenuItem: "#openFromDocumentStorage",
            saveDocumentMenuItem: "#saveDocument",
            saveToCacheMenuItem: "#saveToCache",
            saveCurrentViewMenuItem: "#saveCurrentView",
            printMenuItem: "#print",
            printPdfMenuItem: "#printPDF",
            closeDocumentMenuItem: "#closeDocument",
            menuDivider: ".divider.fileMenuDivider",
            exportTextMenuItem: "#exportText",
            documentPropertiesMenuItem: "#documentProperties"
         };

         // Shortcuts
         private shortcuts = {
            ocrSaveBtn: "#ocrSave_shortcut",
         };

         // Help menu items
         private headerToolbar_HelpMenu = {
            aboutMenuItem: "#about"
         };

         private mobileVersionMainControls = {
            mainControls: "#mainControls",
            mainControlsItems: ".mainControlsItem"
         }

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this.initFileUI();
         }

         private initFileUI(): void {
            // File menu
            var isIE9OrBelow = (lt.LTHelper.browser == lt.LTBrowser.internetExplorer && lt.LTHelper.version <= 9);
            if (isIE9OrBelow) {
               // Hide the upload document button, for mobiles and tablets running iOS,
               // since only images are accessible for upload
               // Hide from IE9 and below, since FileReader is not supported
               $(this.headerToolbar_FileMenu.uploadDocumentMenuItem).hide();
            }
            else {
               // bind to click as normal
               $(this.headerToolbar_FileMenu.uploadDocumentMenuItem).on("click", this.uploadDocumentMenuItem_Click.bind(this));
            }

            $(this.headerToolbar_FileMenu.openDocumentFromUrlMenuItem).on("click", this.openDocumentFromUrlMenuItem_Click.bind(this));
            $(this.headerToolbar_FileMenu.loadDocumentFromCacheMenuItem).on("click", this.loadDocumentFromCacheMenuItem_Click.bind(this));

            if (isIE9OrBelow) {
               // We do not support IE9 and below opening from external sources, so hide the menu item
               $(this.headerToolbar_FileMenu.openFromDocumentStorageMenuItem).hide();
            }
            else {
               // bind as normal
               $(this.headerToolbar_FileMenu.openFromDocumentStorageMenuItem).on("click", this.openFromDocumentStorageMenuItem_Click.bind(this));
            }
            $(this.headerToolbar_FileMenu.saveDocumentMenuItem).on("click", this.saveDocumentMenuItem_Click.bind(this));
            if (this._mainApp.demoMode == DemoMode.Default || this._mainApp.demoMode == DemoMode.OCR) {
               $(this.shortcuts.ocrSaveBtn).click(this.saveDocumentMenuItem_Click.bind(this));
            }

            if (this._mainApp.demoMode == DemoMode.Default) {
               $(this.headerToolbar_FileMenu.saveToCacheMenuItem).on("click", this.saveToCacheMenuItem_Click.bind(this));
               $(this.headerToolbar_FileMenu.saveCurrentViewMenuItem).on("click", this.saveCurrentViewMenuItem_Click.bind(this));
            }

            $(this.headerToolbar_FileMenu.printMenuItem).on("click", this.printMenuItem_Click.bind(this));
            $(this.headerToolbar_FileMenu.printPdfMenuItem).on("click", this.printPDFMenuItem_Click.bind(this));

            $(this.headerToolbar_FileMenu.closeDocumentMenuItem).on("click", this.closeDocumentMenuItem_Click.bind(this));
            $(this.headerToolbar_FileMenu.exportTextMenuItem).on("click", this.exportTextMenuItem_Click.bind(this));
            $(this.headerToolbar_FileMenu.documentPropertiesMenuItem).on("click", this.documentPropertiesMenuItem_Click.bind(this));

            // Only for mobile version
            if (DocumentViewerDemoApp.isMobileVersion) {
               $(this.mobileVersionMainControls.mainControlsItems).on("click", this.mainControlsItems_itemClicked.bind(this));
               $(this._mainApp.headerToolbarContainer).focusout((e: JQueryEventObject) => this.headerToolbarContainer_focusout(e));
            }

            // Help menu
            $(this.headerToolbar_HelpMenu.aboutMenuItem).on("click", this.aboutMenuItem_Click.bind(this));
         }

         public bindElements(): void {
            // File menu
            var elements = this._mainApp.commandsBinder.elements;
            var element: CommandBinderElement;

            if (this._mainApp.demoMode == DemoMode.Default || this._mainApp.demoMode == DemoMode.OCR) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveDocumentMenuItem);
               element.hasDocumentEmptyEnabled = false;
               elements.push(element);
            }

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.closeDocumentMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.menuDivider);
            elements.push(element);

            if (this._mainApp.demoMode != DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.headerToolbar_FileMenu.exportTextMenuItem);
               elements.push(element);
            }

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.documentPropertiesMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.printMenuItem);
            element.hasDocumentEmptyEnabled = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.printPdfMenuItem);
            element.hasDocumentEmptyEnabled = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveToCacheMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveCurrentViewMenuItem);
            element.hasDocumentEmptyEnabled = false;
            elements.push(element);

            if (this._mainApp.demoMode == DemoMode.OCR) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.shortcuts.ocrSaveBtn);
               element.hasDocumentEmptyEnabled = false;
               elements.push(element);
            }
         }

         private uploadDocumentMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.uploadDocumentDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
            this._mainApp.uploadDocumentDlg.show();
            this._mainApp.uploadDocumentDlg.onUpload = (e: Dialogs.UploadDocumentEventArgs) => {
               this._mainApp.loadDocumentOptions.loadAttachmentsMode = this._mainApp.uploadDocumentDlg.loadAttachmentsMode;
               var loadOptions = this._mainApp.createLoadOptions(e.annotationFile, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
               loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
               this._mainApp.uploadDocument(e.documentFile, e.annotationFile, loadOptions);
            };
         }

         private openDocumentFromUrlMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.openDocumentFromUrlDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
            this._mainApp.openDocumentFromUrlDlg.show();
            this._mainApp.openDocumentFromUrlDlg.onLoad = (e: Dialogs.OpenDocumentFromUrlEventArgs) => {
               var loadOptions = this._mainApp.createLoadOptions(e.annotationsUrl, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
               loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
               this._mainApp.loadDocument(e.fileUrl, e.annotationsUrl, loadOptions);
            };
         }

         private loadDocumentFromCacheMenuItem_Click(e: JQueryEventObject) {
            this.openFromCacheClick(null);
         }

         public openFromCacheClick(inputValue: string): void {
            var currentDocument = this._mainApp.documentViewer.document;
            var hasChanged = currentDocument && this._mainApp.documentViewer.prepareToSave();
            this._mainApp.cacheDlg.showLoad(inputValue, currentDocument, hasChanged);
            this._mainApp.cacheDlg.onLoad = (id: string) => {
               this._mainApp.loadCachedDocument(id, true);
            };
         }

         private printMenuItem_Click(e: JQueryEventObject) {
            if (lt.LTHelper.OS == lt.LTOS.android) {
               if (lt.LTHelper.browser == lt.LTBrowser.opera || lt.LTHelper.browser == lt.LTBrowser.firefox) {
                  window.alert("Printing is not supported natively in this browser");
                  return;
               }
            }

            var documentViewer = this._mainApp.documentViewer;
            this._mainApp.printDlg.show(documentViewer);
            this._mainApp.printDlg.onPrint = (options: lt.Document.Viewer.PrintDocumentOptions) => {
               this._mainApp.doPrint(options);
            };
         }

         private printPDFMenuItem_Click() {
            if (lt.LTHelper.OS == lt.LTOS.android) {
               if (lt.LTHelper.browser == lt.LTBrowser.opera || lt.LTHelper.browser == lt.LTBrowser.firefox) {
                  window.alert("Printing is not supported natively in this browser");
                  return;
               }
            }

            var documentViewer = this._mainApp.documentViewer;
            var document = documentViewer.document;
            this._mainApp.documentViewer.prepareToSave();

            this._mainApp.saveDocumentToCache(document)
               .done(() => {
                  var options = new lt.Document.Viewer.PrintDocumentOptions();
                  options.usePdfPrinting = true;
                  options.showAnnotations = true;

                  this._mainApp.doPrint(options);
               })
               .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
               });
         }

         private openFromDocumentStorageMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.openFromDocumentStorageDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
            this._mainApp.openFromDocumentStorageDlg.show();
            this._mainApp.openFromDocumentStorageDlg.onLoad = (e: Dialogs.OpenFromDocumentStorageEventArgs) => {
               // Check if there's an annotations file
               var annFile = null;
               if (e.annotationsFile) {
                  if (e.annotationsFile.link && e.annotationsFile.link.length > 0)
                     annFile = e.annotationsFile.link
                  else if (e.annotationsFile.fileBlob)
                     annFile = e.annotationsFile.fileBlob;
               }

               if (e.documentFile.link && e.documentFile.link.length > 0) {
                  var loadOptions = this._mainApp.createLoadOptions(annFile, e.annotationsLoadOption, e.documentFile.name, e.firstPage, e.lastPage);
                  loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                  this._mainApp.loadDocument(e.documentFile.link, annFile, loadOptions);
               }
               else if (e.documentFile.fileBlob) {
                  var loadOptions = this._mainApp.createLoadOptions(annFile, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
                  loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                  this._mainApp.uploadDocument(<File>e.documentFile.fileBlob, annFile, loadOptions);
               }
            };
         }

         private saveDocumentMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.documentConverterDlg.show(this._mainApp.documentViewer.document);
            this._mainApp.documentConverterDlg.onConvert = (jobData: lt.Document.DocumentConverterJobData) => {

               // Send the annotations along, instead of using whatever may be already saved
               // In case this document was pre-cached
               if (jobData.annotationsMode != lt.Document.DocumentConverterAnnotationsMode.none && this._mainApp.documentViewer.annotations) {
                  var pageCount = this._mainApp.documentViewer.document.pages.count;
                  var allContainers = this._mainApp.documentViewer.annotations.automation.containers;
                  var modifiedContainers: lt.Annotations.Engine.AnnContainer[] = [];
                  for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
                     if (this._mainApp.documentViewer.annotations.isContainerModified(pageNumber)) {
                        modifiedContainers.push(allContainers.item(pageNumber - 1));
                     }
                  }

                  if (modifiedContainers.length > 0) {
                     var annotations = new lt.Annotations.Engine.AnnCodecs().saveAll(modifiedContainers, lt.Annotations.Engine.AnnFormat.annotations);
                     jobData.annotations = annotations;
                  }
               }

               this._mainApp.convertDocument(jobData);
            };
         }

         private saveToCacheMenuItem_Click(e: JQueryEventObject) {
            var hasChanged = this._mainApp.documentViewer.prepareToSave();
            var document = this._mainApp.documentViewer.document;

            if (hasChanged || document.isAnyCacheStatusNotSynced) {
               this._mainApp.beginBusyOperation();
               this._mainApp.loadingDlg.show(false, false, "Saving to cache...", null, () => {
                  // Save will update the document in the server
                  var saveToCachePromise = this._mainApp.saveDocumentToCache(document);

                  saveToCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                     this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                  });

                  saveToCachePromise.done((): void => {
                     this.showSaveResultDialog(true);
                  });

                  saveToCachePromise.always((): void => {
                     this._mainApp.endBusyOperation();
                  });
               });
            }
            else {
               this.showSaveResultDialog(false);
            }
         }

         private saveCurrentViewMenuItem_Click(e: JQueryEventObject) {
            var hasChanged = this._mainApp.documentViewer.prepareToSave();
            var document = this._mainApp.documentViewer.document;
            var viewOptions = this._mainApp.documentViewer.getCurrentViewOptions();
            document.viewOptions = viewOptions;

            hasChanged = true;
            if (hasChanged || document.isAnyCacheStatusNotSynced) {
               this._mainApp.beginBusyOperation();
               this._mainApp.loadingDlg.show(false, false, "Saving to cache...", null, () => {
                  // Save will update the document in the server
                  var saveToCachePromise = this._mainApp.saveDocumentToCache(document);

                  saveToCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                     this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                  });

                  saveToCachePromise.done((): void => {
                     this.showSaveResultDialog(true);
                  });

                  saveToCachePromise.always((): void => {
                     this._mainApp.endBusyOperation();
                  });
               });
            }
            else {
               this.showSaveResultDialog(false);
            }
         }

         private showSaveResultDialog(didSave: boolean): void {
            setTimeout(() => {

               // Inform the user about the cache ID. Use the input dialog so it's easy to copy.
               var text = "Use the cache ID below to load this cached document in the future.";
               if (didSave)
                  text = "This document's cache entry has been updated. " + text;
               else
                  text = "This document is up to date and does not require saving. " + text;

               var documentId = this._mainApp.documentViewer.document.documentId;
               var cacheDialog = this._mainApp.cacheDlg;
               cacheDialog.showSave(text, documentId);
               cacheDialog.onReloadCurrentFromSave = () => {
                  this._mainApp.loadCachedDocument(documentId, true);
               }
            }, 500);
         }

         private closeDocumentMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.closeDocument();
            this._mainApp.updateContainers();
         }

         private exportTextMenuItem_Click(e: JQueryEventObject) {
            var currentPageNumber = this._mainApp.documentViewer.currentPageNumber;
            var pageCount = this._mainApp.documentViewer.pageCount;

            this._mainApp.pagesDlg.show("Export Text", pageCount, currentPageNumber);
            this._mainApp.pagesDlg.onApply = (pageNumber: number) => {
               var hasText = this._mainApp.documentViewer.text.hasDocumentPageText(pageNumber);
               if (hasText) {
                  this._doExportText(pageNumber);
               }
               else {
                  var isZero = pageNumber == 0;
                  // we need to get the text
                  var message = isZero ? "Not all pages have their text parsed.\nParse text for all pages?" : "Page " + pageNumber + " doesn't have its text parsed.\nParse text for this page?";
                  var confirm = window.confirm(message);
                  if (confirm) {
                     // Inform what to do after getting text
                     this._mainApp.manualGetText(isZero ? null : [pageNumber], (canceled: boolean, error: Error) => {
                        if (!error)
                           this._doExportText(pageNumber);
                     });
                  }
               }
            };
         }

         private _doExportText(pageNumber: number) {
            var text = this._mainApp.documentViewer.text.exportText(pageNumber);
            if (text)
               text = text.trim();
            if (text) {
               this._mainApp.textResultDlg.update("Export Text", text);
               this._mainApp.textResultDlg.show();
            } else {
               window.alert("This selection does not contain any text.\nIf this is a raster document, check that your service has included OCR functionality.");
            }
         }

         private documentPropertiesMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.documentPropertiesDlg.show(this._mainApp.documentViewer.document);
         }

         private aboutMenuItem_Click(e: JQueryEventObject) {
            this._mainApp.aboutDlg.show();
         }

         private mainControlsItems_itemClicked(e: JQueryEventObject) {
            $(this.mobileVersionMainControls.mainControls).collapse('hide');
         }

         private headerToolbarContainer_focusout(e: JQueryEventObject) {
            if ($(this.mobileVersionMainControls.mainControls).hasClass("in")) {
               window.setTimeout(() => {
                  $(this.mobileVersionMainControls.mainControls).collapse('hide');
               }, 100);
            }
         }
      }
   }
}