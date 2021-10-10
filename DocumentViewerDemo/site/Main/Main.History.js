/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    // Contains the data for a document we opened
    var HistoryItem = /** @class */ (function () {
        function HistoryItem() {
        }
        return HistoryItem;
    }());
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        // Contains the history part of the viewer
        var HistoryPart = /** @class */ (function () {
            function HistoryPart(main, historyMaxItems) {
                var _this = this;
                // Reference to the DocumentViewerDemoApp
                this._mainApp = null;
                // History menu items
                this.headerToolbar_HistoryMenu = {
                    historyMenuItem: "#historyMenuItem",
                    previousDocumentMenuItem: "#previousDocument",
                    nextDocumentMenuItem: "#nextDocument"
                };
                // Shortcuts
                this.shortcuts = {
                    historyDivider: "#historyDivider",
                    previousDocumentBtn: "#previousDocument_shortcut",
                    nextDocumentBtn: "#nextDocument_shortcut"
                };
                // Maximum number of items in the document history. Minimum is 2.
                // Value of -1 means there is no limit on the number of items.
                // Values of 0 or 1 will disable navigation history in the app.
                this._historyMaxItems = -1;
                this._mainApp = main;
                this._historyMaxItems = historyMaxItems;
                // See if the app uses document history
                if (this._historyMaxItems === -1 || this._historyMaxItems > 1) {
                    this._history = [];
                    this._historyIndex = 0;
                    this._historyNextIndex = -1;
                    // Initialize the callback used by the app when a new document is set in the viewer
                    this._documentChangedCallback = new DocumentViewerDemo.ViewerDocumentChangedCallback();
                    this._documentChangedCallback.changing = function (documentViewer, currentDocument, newDocument) {
                        return _this.historyDocumentChanging(documentViewer, currentDocument, newDocument);
                    };
                    this._documentChangedCallback.changed = function (documentViewer, document) {
                        _this.historyDocumentChanged(documentViewer, document);
                    };
                    this._documentChangedCallback.aborted = function () {
                        _this.historyDocumentAborted();
                    };
                }
                this.initHistoryUI();
            }
            Object.defineProperty(HistoryPart.prototype, "documentChangedCallbacks", {
                get: function () {
                    return this._documentChangedCallback;
                },
                enumerable: false,
                configurable: true
            });
            HistoryPart.prototype.initHistoryUI = function () {
                var isHistoryAvailable = this.hasHistory;
                // History menu
                $(this.headerToolbar_HistoryMenu.previousDocumentMenuItem).on("click", this.previousDocumentMenuItem_Click.bind(this));
                $(this.headerToolbar_HistoryMenu.nextDocumentMenuItem).on("click", this.nextDocumentMenuItem_Click.bind(this));
                // Shortcuts
                $(this.shortcuts.previousDocumentBtn).on("click", this.previousDocumentMenuItem_Click.bind(this));
                $(this.shortcuts.nextDocumentBtn).on("click", this.nextDocumentMenuItem_Click.bind(this));
                if (!isHistoryAvailable) {
                    $(this.headerToolbar_HistoryMenu.historyMenuItem).css("display", "none");
                    $(this.shortcuts.historyDivider).css("display", "none");
                    $(this.shortcuts.previousDocumentBtn).css("display", "none");
                    $(this.shortcuts.nextDocumentBtn).css("display", "none");
                }
            };
            HistoryPart.prototype.bindElements = function () {
                var _this = this;
                var elements = this._mainApp.commandsBinder.elements;
                var element;
                // History menu
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_HistoryMenu.previousDocumentMenuItem);
                element.canRun = function (documentViewer, value) {
                    return _this.canNavigateHistoryBackward;
                };
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.headerToolbar_HistoryMenu.nextDocumentMenuItem);
                element.canRun = function (documentViewer, value) {
                    return _this.canNavigateHistoryForward;
                };
                elements.push(element);
                // Shortcuts
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.shortcuts.previousDocumentBtn);
                element.canRun = function (documentViewer, value) {
                    return _this.canNavigateHistoryBackward;
                };
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.userInterfaceElement = $(this.shortcuts.nextDocumentBtn);
                element.canRun = function (documentViewer, value) {
                    return _this.canNavigateHistoryForward;
                };
                elements.push(element);
            };
            HistoryPart.prototype.clear = function () {
                this.removeHistoryItems(0, -1);
            };
            HistoryPart.prototype.historyDocumentChanging = function (documentViewer, currentDocument, newDocument) {
                // This callback is invoked when a new document is set in the viewer. Gives us a chance to
                // update the history.
                // Return true to dispose the old document in the viewer, otherwise; false.
                // We should not dispose the old document when it is not in the cache
                if (!currentDocument && !newDocument)
                    return true;
                // This is the default behavior
                var autoDisposeDocument = true;
                // Delete everything after current index if a new document is set (clear the history forward).
                if (this._historyNextIndex === -1 && newDocument) {
                    var removeCount = this._history.length - (this._historyIndex + 1);
                    if (removeCount > 0)
                        this.removeHistoryItems(this._historyIndex + 1, removeCount);
                }
                // Check if the document is cached
                var isDocumentInCache = DocumentViewerDemo.DocumentViewerDemoApp.isDocumentInCache(currentDocument);
                // Check if this is a new document being set or is it from backward/forward
                var isDocumentInHistory = this._historyIndex < this._history.length && this.isSameHistoryDocument(this._historyIndex, currentDocument);
                if (!isDocumentInHistory && currentDocument) {
                    // See if we need to make room because we reached the limit
                    if (this._historyMaxItems > 1 && this._history.length >= this._historyMaxItems) {
                        this.removeHistoryItems(0, 1);
                        if (this._historyNextIndex != -1)
                            this._historyNextIndex--;
                    }
                    // Now add the item
                    var item = new HistoryItem();
                    item.selectedAttachmentIndex = -1;
                    // If the document is in the cache, add its id only, otherwise, keep the whole document.
                    if (isDocumentInCache) {
                        item.documentId = currentDocument.documentId;
                    }
                    else {
                        documentViewer.prepareToSave();
                        item.document = currentDocument;
                    }
                    this._history.push(item);
                }
                // Update the indexes
                var saveCurrentIndex = this._historyIndex;
                if (this._historyNextIndex != -1) {
                    // From forward/backward, go it and reset
                    this._historyIndex = this._historyNextIndex;
                    this._historyNextIndex = -1;
                }
                else {
                    this._historyIndex = this._history.length;
                }
                if (!newDocument) {
                    // Means we closed the document, get the next one
                    this._historyIndex = saveCurrentIndex + 1;
                }
                if (currentDocument) {
                    // If the document in the viewer has a cache then tell the viewer not to dispose it, we will take care of it ourselves
                    autoDisposeDocument = isDocumentInCache;
                    // Update the selected attachment index if any
                    var attachmentIndex = this._mainApp.attachmentsPart.selectedAttachmentIndex;
                    var item_1 = this.findHistoryItemForDocument(currentDocument);
                    if (item_1)
                        item_1.selectedAttachmentIndex = attachmentIndex;
                }
                return autoDisposeDocument;
            };
            HistoryPart.prototype.removeHistoryItems = function (index, count) {
                if (count === -1)
                    count = this._history.length;
                if (count < 1)
                    return;
                // We have to dispose the documents that we kept
                for (var i = index; i < (index + count); i++) {
                    var item = this._history[i];
                    if (item.document) {
                        item.document.dispose();
                        item.document = null;
                    }
                }
                this._history.splice(index, count);
            };
            HistoryPart.prototype.isSameHistoryDocument = function (index, document) {
                if (!document || index < 0 || index >= this._history.length)
                    return false;
                var item = this._history[index];
                return document === item.document || document.documentId === item.documentId;
            };
            HistoryPart.prototype.historyDocumentChanged = function (documentViewer, document) {
                // Called when a new document has been set successfully in the viewer
                this._historyNextIndex = -1;
            };
            HistoryPart.prototype.historyDocumentAborted = function () {
                // Called when setting a new document has been aborted
                this._historyNextIndex = -1;
            };
            HistoryPart.prototype.findHistoryItemForDocument = function (document) {
                for (var i = 0; i < this._history.length; i++) {
                    var item = this._history[i];
                    if ((item.document && item.document === document) || item.documentId === document.documentId)
                        return item;
                }
                return null;
            };
            HistoryPart.prototype.documentSavedToCache = function (document) {
                // Called when the document is saved into the cache.
                // Update the document if it is in our list of items.
                if (!this.hasHistory)
                    return;
                var item = this.findHistoryItemForDocument(document);
                if (item) {
                    // We no longer need to keep track of the whole document since its saved into cache
                    // Just the ID
                    item.document = null;
                    item.documentId = document.documentId;
                }
            };
            HistoryPart.prototype.getAttachmentSelectedIndexForDocument = function (document) {
                if (!this.hasHistory)
                    return -1;
                var item = this.findHistoryItemForDocument(document);
                if (item)
                    return item.selectedAttachmentIndex;
                return -1;
            };
            HistoryPart.prototype.previousDocumentMenuItem_Click = function (e) {
                this.navigateHistoryItem(true);
            };
            HistoryPart.prototype.nextDocumentMenuItem_Click = function (e) {
                this.navigateHistoryItem(false);
            };
            Object.defineProperty(HistoryPart.prototype, "hasHistory", {
                get: function () {
                    return this._historyMaxItems != -1 && this._historyMaxItems > 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HistoryPart.prototype, "canNavigateHistoryBackward", {
                get: function () {
                    return this.hasHistory && this._historyIndex > 0;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(HistoryPart.prototype, "canNavigateHistoryForward", {
                get: function () {
                    return this.hasHistory && this._historyIndex < (this._history.length - 1);
                },
                enumerable: false,
                configurable: true
            });
            HistoryPart.prototype.navigateHistoryItem = function (backward) {
                if ((backward && !this.canNavigateHistoryBackward) || (!backward && !this.canNavigateHistoryForward))
                    return;
                // Get the index of the item and try to re-set this document in the viewer
                if (backward)
                    this._historyNextIndex = this._historyIndex - 1;
                else
                    this._historyNextIndex = this._historyIndex + 1;
                var item = this._history[this._historyNextIndex];
                if (item.document)
                    this._mainApp.finishSetDocument(item.document);
                else
                    this._mainApp.loadCachedDocument(item.documentId, false);
            };
            return HistoryPart;
        }());
        DocumentViewerDemo.HistoryPart = HistoryPart;
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
