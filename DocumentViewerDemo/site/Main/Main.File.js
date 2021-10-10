/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        // Contains the file part
        var FilePart = /** @class */ (function () {
            function FilePart(main) {
                // Reference to the DocumentViewerDemoApp
                this._mainApp = null;
                // File menu items
                this.headerToolbar_FileMenu = {
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
                this.shortcuts = {
                    ocrSaveBtn: "#ocrSave_shortcut",
                };
                // Help menu items
                this.headerToolbar_HelpMenu = {
                    aboutMenuItem: "#about"
                };
                this.mobileVersionMainControls = {
                    mainControls: "#mainControls",
                    mainControlsItems: ".mainControlsItem"
                };
                this._mainApp = main;
                this.initFileUI();
            }
            FilePart.prototype.initFileUI = function () {
                var _this = this;
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
                if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.Default || this._mainApp.demoMode == DocumentViewerDemo.DemoMode.OCR) {
                    $(this.shortcuts.ocrSaveBtn).click(this.saveDocumentMenuItem_Click.bind(this));
                }
                if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.Default) {
                    $(this.headerToolbar_FileMenu.saveToCacheMenuItem).on("click", this.saveToCacheMenuItem_Click.bind(this));
                    $(this.headerToolbar_FileMenu.saveCurrentViewMenuItem).on("click", this.saveCurrentViewMenuItem_Click.bind(this));
                }
                $(this.headerToolbar_FileMenu.printMenuItem).on("click", this.printMenuItem_Click.bind(this));
                $(this.headerToolbar_FileMenu.printPdfMenuItem).on("click", this.printPDFMenuItem_Click.bind(this));
                $(this.headerToolbar_FileMenu.closeDocumentMenuItem).on("click", this.closeDocumentMenuItem_Click.bind(this));
                $(this.headerToolbar_FileMenu.exportTextMenuItem).on("click", this.exportTextMenuItem_Click.bind(this));
                $(this.headerToolbar_FileMenu.documentPropertiesMenuItem).on("click", this.documentPropertiesMenuItem_Click.bind(this));
                // Only for mobile version
                if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    $(this.mobileVersionMainControls.mainControlsItems).on("click", this.mainControlsItems_itemClicked.bind(this));
                    $(this._mainApp.headerToolbarContainer).focusout(function (e) { return _this.headerToolbarContainer_focusout(e); });
                }
                // Help menu
                $(this.headerToolbar_HelpMenu.aboutMenuItem).on("click", this.aboutMenuItem_Click.bind(this));
            };
            FilePart.prototype.bindElements = function () {
                // File menu
                var elements = this._mainApp.commandsBinder.elements;
                var element;
                if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.Default || this._mainApp.demoMode == DocumentViewerDemo.DemoMode.OCR) {
                    element = new DocumentViewerDemo.CommandBinderElement();
                    element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveDocumentMenuItem);
                    element.hasDocumentEmptyEnabled = false;
                    elements.push(element);
                }
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.closeDocumentMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.menuDivider);
                elements.push(element);
                if (this._mainApp.demoMode != DocumentViewerDemo.DemoMode.Barcode) {
                    element = new DocumentViewerDemo.CommandBinderElement();
                    element.userInterfaceElement = $(this.headerToolbar_FileMenu.exportTextMenuItem);
                    elements.push(element);
                }
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.documentPropertiesMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.printMenuItem);
                element.hasDocumentEmptyEnabled = false;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.printPdfMenuItem);
                element.hasDocumentEmptyEnabled = false;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveToCacheMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_FileMenu.saveCurrentViewMenuItem);
                element.hasDocumentEmptyEnabled = false;
                elements.push(element);
                if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.OCR) {
                    element = new DocumentViewerDemo.CommandBinderElement();
                    element.userInterfaceElement = $(this.shortcuts.ocrSaveBtn);
                    element.hasDocumentEmptyEnabled = false;
                    elements.push(element);
                }
            };
            FilePart.prototype.uploadDocumentMenuItem_Click = function (e) {
                var _this = this;
                this._mainApp.uploadDocumentDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
                this._mainApp.uploadDocumentDlg.show();
                this._mainApp.uploadDocumentDlg.onUpload = function (e) {
                    _this._mainApp.loadDocumentOptions.loadAttachmentsMode = _this._mainApp.uploadDocumentDlg.loadAttachmentsMode;
                    var loadOptions = _this._mainApp.createLoadOptions(e.annotationFile, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
                    loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                    _this._mainApp.uploadDocument(e.documentFile, e.annotationFile, loadOptions);
                };
            };
            FilePart.prototype.openDocumentFromUrlMenuItem_Click = function (e) {
                var _this = this;
                this._mainApp.openDocumentFromUrlDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
                this._mainApp.openDocumentFromUrlDlg.show();
                this._mainApp.openDocumentFromUrlDlg.onLoad = function (e) {
                    var loadOptions = _this._mainApp.createLoadOptions(e.annotationsUrl, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
                    loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                    _this._mainApp.loadDocument(e.fileUrl, e.annotationsUrl, loadOptions);
                };
            };
            FilePart.prototype.loadDocumentFromCacheMenuItem_Click = function (e) {
                this.openFromCacheClick(null);
            };
            FilePart.prototype.openFromCacheClick = function (inputValue) {
                var _this = this;
                var currentDocument = this._mainApp.documentViewer.document;
                var hasChanged = currentDocument && this._mainApp.documentViewer.prepareToSave();
                this._mainApp.cacheDlg.showLoad(inputValue, currentDocument, hasChanged);
                this._mainApp.cacheDlg.onLoad = function (id) {
                    _this._mainApp.loadCachedDocument(id, true);
                };
            };
            FilePart.prototype.printMenuItem_Click = function (e) {
                var _this = this;
                if (lt.LTHelper.OS == lt.LTOS.android) {
                    if (lt.LTHelper.browser == lt.LTBrowser.opera || lt.LTHelper.browser == lt.LTBrowser.firefox) {
                        window.alert("Printing is not supported natively in this browser");
                        return;
                    }
                }
                var documentViewer = this._mainApp.documentViewer;
                this._mainApp.printDlg.show(documentViewer);
                this._mainApp.printDlg.onPrint = function (options) {
                    _this._mainApp.doPrint(options);
                };
            };
            FilePart.prototype.printPDFMenuItem_Click = function () {
                var _this = this;
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
                    .done(function () {
                    var options = new lt.Document.Viewer.PrintDocumentOptions();
                    options.usePdfPrinting = true;
                    options.showAnnotations = true;
                    _this._mainApp.doPrint(options);
                })
                    .fail(function (jqXHR, statusText, errorThrown) {
                    _this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                });
            };
            FilePart.prototype.openFromDocumentStorageMenuItem_Click = function (e) {
                var _this = this;
                this._mainApp.openFromDocumentStorageDlg.loadAttachmentsMode = this._mainApp.loadDocumentOptions.loadAttachmentsMode;
                this._mainApp.openFromDocumentStorageDlg.show();
                this._mainApp.openFromDocumentStorageDlg.onLoad = function (e) {
                    // Check if there's an annotations file
                    var annFile = null;
                    if (e.annotationsFile) {
                        if (e.annotationsFile.link && e.annotationsFile.link.length > 0)
                            annFile = e.annotationsFile.link;
                        else if (e.annotationsFile.fileBlob)
                            annFile = e.annotationsFile.fileBlob;
                    }
                    if (e.documentFile.link && e.documentFile.link.length > 0) {
                        var loadOptions = _this._mainApp.createLoadOptions(annFile, e.annotationsLoadOption, e.documentFile.name, e.firstPage, e.lastPage);
                        loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                        _this._mainApp.loadDocument(e.documentFile.link, annFile, loadOptions);
                    }
                    else if (e.documentFile.fileBlob) {
                        var loadOptions = _this._mainApp.createLoadOptions(annFile, e.annotationsLoadOption, null, e.firstPage, e.lastPage);
                        loadOptions.loadAttachmentsMode = e.loadAttachmentsMode;
                        _this._mainApp.uploadDocument(e.documentFile.fileBlob, annFile, loadOptions);
                    }
                };
            };
            FilePart.prototype.saveDocumentMenuItem_Click = function (e) {
                var _this = this;
                this._mainApp.documentConverterDlg.show(this._mainApp.documentViewer.document);
                this._mainApp.documentConverterDlg.onConvert = function (jobData) {
                    // Send the annotations along, instead of using whatever may be already saved
                    // In case this document was pre-cached
                    if (jobData.annotationsMode != lt.Document.DocumentConverterAnnotationsMode.none && _this._mainApp.documentViewer.annotations) {
                        var pageCount = _this._mainApp.documentViewer.document.pages.count;
                        var allContainers = _this._mainApp.documentViewer.annotations.automation.containers;
                        var modifiedContainers = [];
                        for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
                            if (_this._mainApp.documentViewer.annotations.isContainerModified(pageNumber)) {
                                modifiedContainers.push(allContainers.item(pageNumber - 1));
                            }
                        }
                        if (modifiedContainers.length > 0) {
                            var annotations = new lt.Annotations.Engine.AnnCodecs().saveAll(modifiedContainers, lt.Annotations.Engine.AnnFormat.annotations);
                            jobData.annotations = annotations;
                        }
                    }
                    _this._mainApp.convertDocument(jobData);
                };
            };
            FilePart.prototype.saveToCacheMenuItem_Click = function (e) {
                var _this = this;
                var hasChanged = this._mainApp.documentViewer.prepareToSave();
                var document = this._mainApp.documentViewer.document;
                if (hasChanged || document.isAnyCacheStatusNotSynced) {
                    this._mainApp.beginBusyOperation();
                    this._mainApp.loadingDlg.show(false, false, "Saving to cache...", null, function () {
                        // Save will update the document in the server
                        var saveToCachePromise = _this._mainApp.saveDocumentToCache(document);
                        saveToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                            _this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                        });
                        saveToCachePromise.done(function () {
                            _this.showSaveResultDialog(true);
                        });
                        saveToCachePromise.always(function () {
                            _this._mainApp.endBusyOperation();
                        });
                    });
                }
                else {
                    this.showSaveResultDialog(false);
                }
            };
            FilePart.prototype.saveCurrentViewMenuItem_Click = function (e) {
                var _this = this;
                var hasChanged = this._mainApp.documentViewer.prepareToSave();
                var document = this._mainApp.documentViewer.document;
                var viewOptions = this._mainApp.documentViewer.getCurrentViewOptions();
                document.viewOptions = viewOptions;
                hasChanged = true;
                if (hasChanged || document.isAnyCacheStatusNotSynced) {
                    this._mainApp.beginBusyOperation();
                    this._mainApp.loadingDlg.show(false, false, "Saving to cache...", null, function () {
                        // Save will update the document in the server
                        var saveToCachePromise = _this._mainApp.saveDocumentToCache(document);
                        saveToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                            _this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                        });
                        saveToCachePromise.done(function () {
                            _this.showSaveResultDialog(true);
                        });
                        saveToCachePromise.always(function () {
                            _this._mainApp.endBusyOperation();
                        });
                    });
                }
                else {
                    this.showSaveResultDialog(false);
                }
            };
            FilePart.prototype.showSaveResultDialog = function (didSave) {
                var _this = this;
                setTimeout(function () {
                    // Inform the user about the cache ID. Use the input dialog so it's easy to copy.
                    var text = "Use the cache ID below to load this cached document in the future.";
                    if (didSave)
                        text = "This document's cache entry has been updated. " + text;
                    else
                        text = "This document is up to date and does not require saving. " + text;
                    var documentId = _this._mainApp.documentViewer.document.documentId;
                    var cacheDialog = _this._mainApp.cacheDlg;
                    cacheDialog.showSave(text, documentId);
                    cacheDialog.onReloadCurrentFromSave = function () {
                        _this._mainApp.loadCachedDocument(documentId, true);
                    };
                }, 500);
            };
            FilePart.prototype.closeDocumentMenuItem_Click = function (e) {
                this._mainApp.closeDocument();
                this._mainApp.updateContainers();
            };
            FilePart.prototype.exportTextMenuItem_Click = function (e) {
                var _this = this;
                var currentPageNumber = this._mainApp.documentViewer.currentPageNumber;
                var pageCount = this._mainApp.documentViewer.pageCount;
                this._mainApp.pagesDlg.show("Export Text", pageCount, currentPageNumber);
                this._mainApp.pagesDlg.onApply = function (pageNumber) {
                    var hasText = _this._mainApp.documentViewer.text.hasDocumentPageText(pageNumber);
                    if (hasText) {
                        _this._doExportText(pageNumber);
                    }
                    else {
                        var isZero = pageNumber == 0;
                        // we need to get the text
                        var message = isZero ? "Not all pages have their text parsed.\nParse text for all pages?" : "Page " + pageNumber + " doesn't have its text parsed.\nParse text for this page?";
                        var confirm = window.confirm(message);
                        if (confirm) {
                            // Inform what to do after getting text
                            _this._mainApp.manualGetText(isZero ? null : [pageNumber], function (canceled, error) {
                                if (!error)
                                    _this._doExportText(pageNumber);
                            });
                        }
                    }
                };
            };
            FilePart.prototype._doExportText = function (pageNumber) {
                var text = this._mainApp.documentViewer.text.exportText(pageNumber);
                if (text)
                    text = text.trim();
                if (text) {
                    this._mainApp.textResultDlg.update("Export Text", text);
                    this._mainApp.textResultDlg.show();
                }
                else {
                    window.alert("This selection does not contain any text.\nIf this is a raster document, check that your service has included OCR functionality.");
                }
            };
            FilePart.prototype.documentPropertiesMenuItem_Click = function (e) {
                this._mainApp.documentPropertiesDlg.show(this._mainApp.documentViewer.document);
            };
            FilePart.prototype.aboutMenuItem_Click = function (e) {
                this._mainApp.aboutDlg.show();
            };
            FilePart.prototype.mainControlsItems_itemClicked = function (e) {
                $(this.mobileVersionMainControls.mainControls).collapse('hide');
            };
            FilePart.prototype.headerToolbarContainer_focusout = function (e) {
                var _this = this;
                if ($(this.mobileVersionMainControls.mainControls).hasClass("in")) {
                    window.setTimeout(function () {
                        $(_this.mobileVersionMainControls.mainControls).collapse('hide');
                    }, 100);
                }
            };
            return FilePart;
        }());
        DocumentViewerDemo.FilePart = FilePart;
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
