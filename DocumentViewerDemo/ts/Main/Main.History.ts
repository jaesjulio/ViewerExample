/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   // Contains the data for a document we opened
   class HistoryItem {
      // If it is in the cache, this is the ID.
      // We can load this document using DocumentFactory.loadFromCache
      documentId: string;

      // Or, if the document is not cached (local), here it is.
      // We will keep this document in the list and dispose it ourselves
      // We set this document directory in the viewer using DocumentViewer.setDocument
      document: lt.Document.LEADDocument;

      // Current selected attachment (if we have any)
      selectedAttachmentIndex: number;
   }

   export module DocumentViewerDemo {
      // Contains the history part of the viewer
      export class HistoryPart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // History menu items
         private headerToolbar_HistoryMenu = {
            historyMenuItem: "#historyMenuItem",
            previousDocumentMenuItem: "#previousDocument",
            nextDocumentMenuItem: "#nextDocument"
         };

         // Shortcuts
         private shortcuts = {
            historyDivider: "#historyDivider",
            previousDocumentBtn: "#previousDocument_shortcut",
            nextDocumentBtn: "#nextDocument_shortcut"
         };

         // Maximum number of items in the document history. Minimum is 2.
         // Value of -1 means there is no limit on the number of items.
         // Values of 0 or 1 will disable navigation history in the app.
         private _historyMaxItems: number = -1;
         // Document history
         private _history: HistoryItem[];
         // We are we in the history
         private _historyIndex: number;
         // Next item to open (from forward/backward navigation)
         private _historyNextIndex: number;
         private _documentChangedCallback: ViewerDocumentChangedCallback;
         public get documentChangedCallbacks(): ViewerDocumentChangedCallback {
            return this._documentChangedCallback;
         }

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp, historyMaxItems: number) {
            this._mainApp = main;
            this._historyMaxItems = historyMaxItems;

            // See if the app uses document history
            if (this._historyMaxItems === -1 || this._historyMaxItems > 1) {
               this._history = [];
               this._historyIndex = 0;
               this._historyNextIndex = -1;

               // Initialize the callback used by the app when a new document is set in the viewer
               this._documentChangedCallback = new ViewerDocumentChangedCallback();
               this._documentChangedCallback.changing = (documentViewer: lt.Document.Viewer.DocumentViewer, currentDocument: lt.Document.LEADDocument, newDocument: lt.Document.LEADDocument) => {
                  return this.historyDocumentChanging(documentViewer, currentDocument, newDocument);
               };
               this._documentChangedCallback.changed = (documentViewer: lt.Document.Viewer.DocumentViewer, document: lt.Document.LEADDocument) => {
                  this.historyDocumentChanged(documentViewer, document);
               };
               this._documentChangedCallback.aborted = () => {
                  this.historyDocumentAborted();
               };
            }

            this.initHistoryUI();
         }

         private initHistoryUI(): void {
            const isHistoryAvailable = this.hasHistory;

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
         }

         public bindElements(): void {
            let elements = this._mainApp.commandsBinder.elements;
            let element: CommandBinderElement;

            // History menu
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_HistoryMenu.previousDocumentMenuItem);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this.canNavigateHistoryBackward;
            };
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_HistoryMenu.nextDocumentMenuItem);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this.canNavigateHistoryForward;
            };
            elements.push(element);

            // Shortcuts
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.previousDocumentBtn);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this.canNavigateHistoryBackward;
            };
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.nextDocumentBtn);
            element.canRun = (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object) => {
               return this.canNavigateHistoryForward;
            };
            elements.push(element);
         }

         public clear(): void {
            this.removeHistoryItems(0, -1);
         }

         private historyDocumentChanging(documentViewer: lt.Document.Viewer.DocumentViewer, currentDocument: lt.Document.LEADDocument, newDocument: lt.Document.LEADDocument): boolean {
            // This callback is invoked when a new document is set in the viewer. Gives us a chance to
            // update the history.
            // Return true to dispose the old document in the viewer, otherwise; false.

            // We should not dispose the old document when it is not in the cache

            if (!currentDocument && !newDocument)
               return true;

            // This is the default behavior
            let autoDisposeDocument: boolean = true;

            // Delete everything after current index if a new document is set (clear the history forward).
            if (this._historyNextIndex === -1 && newDocument) {
               const removeCount = this._history.length - (this._historyIndex + 1);
               if (removeCount > 0)
                  this.removeHistoryItems(this._historyIndex + 1, removeCount);
            }

            // Check if the document is cached
            const isDocumentInCache: boolean = DocumentViewerDemoApp.isDocumentInCache(currentDocument);

            // Check if this is a new document being set or is it from backward/forward
            const isDocumentInHistory: boolean = this._historyIndex < this._history.length && this.isSameHistoryDocument(this._historyIndex, currentDocument);
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
            const saveCurrentIndex = this._historyIndex;
            if (this._historyNextIndex != -1) {
               // From forward/backward, go it and reset
               this._historyIndex = this._historyNextIndex;
               this._historyNextIndex = -1;
            } else {
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
               const attachmentIndex = this._mainApp.attachmentsPart.selectedAttachmentIndex;
               const item: HistoryItem = this.findHistoryItemForDocument(currentDocument);
               if (item)
                  item.selectedAttachmentIndex = attachmentIndex;
            }

            return autoDisposeDocument;
         }

         private removeHistoryItems(index: number, count: number): void {
            if (count === -1)
               count = this._history.length;

            if (count < 1)
               return;

            // We have to dispose the documents that we kept
            for (let i = index; i < (index + count); i++) {
               let item: HistoryItem = this._history[i];
               if (item.document) {
                  item.document.dispose();
                  item.document = null;
               }
            }

            this._history.splice(index, count);
         }

         private isSameHistoryDocument(index: number, document: lt.Document.LEADDocument): boolean {
            if (!document || index < 0 || index >= this._history.length)
               return false;

            const item: HistoryItem = this._history[index];
            return document === item.document || document.documentId === item.documentId;
         }

         private historyDocumentChanged(documentViewer: lt.Document.Viewer.DocumentViewer, document: lt.Document.LEADDocument): void {
            // Called when a new document has been set successfully in the viewer
            this._historyNextIndex = -1;
         }

         private historyDocumentAborted(): void {
            // Called when setting a new document has been aborted
            this._historyNextIndex = -1;
         }

         private findHistoryItemForDocument(document: lt.Document.LEADDocument): HistoryItem {
            for (let i = 0; i < this._history.length; i++) {
               const item: HistoryItem = this._history[i];
               if ((item.document && item.document === document) || item.documentId === document.documentId)
                  return item;
            }
            return null;
         }

         public documentSavedToCache(document: lt.Document.LEADDocument): void {
            // Called when the document is saved into the cache.
            // Update the document if it is in our list of items.

            if (!this.hasHistory)
               return;

            let item: HistoryItem = this.findHistoryItemForDocument(document);
            if (item) {
               // We no longer need to keep track of the whole document since its saved into cache
               // Just the ID
               item.document = null;
               item.documentId = document.documentId;
            }
         }

         public getAttachmentSelectedIndexForDocument(document: lt.Document.LEADDocument): number {
            if (!this.hasHistory)
               return -1;

            const item: HistoryItem = this.findHistoryItemForDocument(document);
            if (item)
               return item.selectedAttachmentIndex;

            return -1;
         }

         private previousDocumentMenuItem_Click(e: JQueryEventObject): void {
            this.navigateHistoryItem(true);
         }

         private nextDocumentMenuItem_Click(e: JQueryEventObject): void {
            this.navigateHistoryItem(false);
         }

         private get hasHistory(): boolean {
            return this._historyMaxItems != -1 && this._historyMaxItems > 1;
         }

         private get canNavigateHistoryBackward(): boolean {
            return this.hasHistory && this._historyIndex > 0;
         }

         private get canNavigateHistoryForward(): boolean {
            return this.hasHistory && this._historyIndex < (this._history.length - 1);
         }

         private navigateHistoryItem(backward: boolean): void {
            if ((backward && !this.canNavigateHistoryBackward) || (!backward && !this.canNavigateHistoryForward))
               return;

            // Get the index of the item and try to re-set this document in the viewer
            if (backward)
               this._historyNextIndex = this._historyIndex - 1;
            else
               this._historyNextIndex = this._historyIndex + 1;

            const item: HistoryItem = this._history[this._historyNextIndex];
            if (item.document)
               this._mainApp.finishSetDocument(item.document);
            else
               this._mainApp.loadCachedDocument(item.documentId, false);
         }
      }
   }
}