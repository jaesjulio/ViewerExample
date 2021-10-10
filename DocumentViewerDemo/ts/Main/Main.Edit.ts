/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {

      enum FindTextCursorAction {
         update,
         next,
         previous
      }

      // Contains the edit part
      export class EditPart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // Edit menu items
         private headerToolbar_EditMenu = {
            editMenuItem: "#editMenuItem",
            undoMenuItem: "#undo",
            redoMenuItem: "#redo",
            deleteAnnotationMenuItem: "#deleteAnnotation",
            selectAllTextMenuItem: "#selectAllText",
            selectAllAnnotationsMenuItem: "#selectAllAnnotations",
            clearSelectionMenuItem: "#clearSelection",
            copyTextMenuItem: "#copyText",
            findTextMenuItem: "#findText",
         };

         public findTextPanel = {
            panel: "#findTextPanel", /* The whole panel */
            textToFindTextInput: "#textToFind",
            findPreviousBtn: "#findPrevious",
            findNextBtn: "#findNext",
            closeBtn: "#closeFindPanel",
            findLiveCheckButton: "#findLive",
            // Find options
            matchCaseCheckbox: "#matchCase",
            wholeWordsOnlyCheckbox: "#wholeWordsOnly",
            findInCurrentPageOnlyCheckbox: "#findInCurrentPageOnly",
            findInCurrentPageOnlyCheckboxLabel: "#findInCurrentPageOnlyLabel",
            getTextForFind: "#getTextForFind",
            findInSelection: "#findInSelection",
            findAllMatchesCheckbox: "#findAllMatches",
            findLoopCheckbox: "#findLoop",
         }

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;

            var defaultOpts = new lt.Document.Viewer.DocumentViewerFindText();
            defaultOpts.beginPosition = null;
            defaultOpts.endPosition = null;
            defaultOpts.findAll = false;
            defaultOpts.loop = true;
            defaultOpts.matchCase = false;
            defaultOpts.wholeWordsOnly = false;
            defaultOpts.renderResults = false;
            defaultOpts.selectFirstResult = true;
            this._defaultFindTextOptions = defaultOpts;

            this.initEditUI();
         }

         private _defaultFindTextOptions: lt.Document.Viewer.DocumentViewerFindText = null;

         private initEditUI(): void {
            // Edit menu
            $(this.headerToolbar_EditMenu.selectAllTextMenuItem).on("click", this.selectAllTextMenuItem_Click.bind(this));
            $(this.headerToolbar_EditMenu.copyTextMenuItem).on("click", this.copyTextMenuItem_Click.bind(this));
            $(this.headerToolbar_EditMenu.findTextMenuItem).on("click", this.findTextMenuItem_Click.bind(this));

            // Find panel
            $(this.findTextPanel.panel).find(".dropdown-menu").on("click", (e: JQueryEventObject) => { e.stopPropagation(); });

            var liveUpdate = this.liveUpdate.bind(this);
            $(this.findTextPanel.textToFindTextInput).on("keydown", this.findInput_KeyDown.bind(this));
            $(this.findTextPanel.findPreviousBtn).on("click", this.findPreviousBtn_Click.bind(this));
            $(this.findTextPanel.findNextBtn).on("click", this.findNextBtn_Click.bind(this));
            $(this.findTextPanel.closeBtn).on("click", this.findClose_Click.bind(this));
            $(this.findTextPanel.findLiveCheckButton).on("click", this.findLiveBtn_Click.bind(this));

            $(this.findTextPanel.textToFindTextInput).on("keyup paste", liveUpdate);
            // Options
            $(this.findTextPanel.matchCaseCheckbox).on("change", liveUpdate);
            $(this.findTextPanel.wholeWordsOnlyCheckbox).on("change", liveUpdate);
            $(this.findTextPanel.findInCurrentPageOnlyCheckbox).on("change", liveUpdate);
            $(this.findTextPanel.findInSelection).on("change", liveUpdate);
            $(this.findTextPanel.getTextForFind).on("change", liveUpdate);
            $(this.findTextPanel.findAllMatchesCheckbox).on("change", liveUpdate);
            $(this.findTextPanel.findLoopCheckbox).on("change", liveUpdate);

            this.updateCurrentPageNumber();
            this.updateFindLive();
         }

         public bindElements(): void {
            var elements = this._mainApp.commandsBinder.elements;
            var element: CommandBinderElement;

            if (this._mainApp.demoMode != DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.headerToolbar_EditMenu.editMenuItem);
               element.updateEnabled = false;
               elements.push(element);
            }

            if (this._mainApp.demoMode == DemoMode.Default) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUndo;
               element.userInterfaceElement = $(this.headerToolbar_EditMenu.undoMenuItem);
               elements.push(element);

               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsRedo;
               element.userInterfaceElement = $(this.headerToolbar_EditMenu.redoMenuItem);
               elements.push(element);

               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsDelete;
               element.userInterfaceElement = $(this.headerToolbar_EditMenu.deleteAnnotationMenuItem);
               elements.push(element);

               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsSelectAll;
               element.userInterfaceElement = $(this.headerToolbar_EditMenu.selectAllAnnotationsMenuItem);
               elements.push(element);
            }

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.textSelectAll;
            element.userInterfaceElement = $(this.headerToolbar_EditMenu.selectAllTextMenuItem);
            element.autoRun = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandNames = new Array<string>(lt.Document.Viewer.DocumentViewerCommands.textClearSelection, lt.Document.Viewer.DocumentViewerCommands.annotationsClearSelection);
            element.userInterfaceElement = $(this.headerToolbar_EditMenu.clearSelectionMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.textCopy;
            element.userInterfaceElement = $(this.headerToolbar_EditMenu.copyTextMenuItem);
            element.autoRun = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_EditMenu.findTextMenuItem);
            element.hasDocumentEmptyEnabled = false;
            element.autoRun = false;
            elements.push(element);
         }

         private selectAllTextMenuItem_Click(e: JQueryEventObject): void {
            // Check if all document pages text is parsed 
            var hasText = this._mainApp.documentViewer.text.hasDocumentPageText(0);
            if (hasText) {
               this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.textSelectAll, 0);
            } else {
               // we need to get the text
               var confirm = window.confirm("Not all pages have their text parsed.\nParse text for all pages?");
               if (confirm) {
                  // Inform what to do after getting text
                  this._mainApp.manualGetText(null, (canceled: boolean, error: Error) => {
                     // On complete, select the text
                     if (!error)
                        this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.textSelectAll, 0);
                  });
               }
            }
         }

         private findTextMenuItem_Click(e: JQueryEventObject): void {
            // If mobile version, hide all controls containers
            if (DocumentViewerDemoApp.isMobileVersion)
               $(this._mainApp.mobileVersionControlsContainers).removeClass('visiblePanel');

            $(this.findTextPanel.panel).toggleClass('visiblePanel');

            if (!DocumentViewerDemoApp.isMobileVersion)
               $(this.findTextPanel.textToFindTextInput).focus();
         }

         private copyTextMenuItem_Click(e: JQueryEventObject): void {
            var text = this._mainApp.documentViewer.text.getSelectedText(0);
            if (text != null) {
               this._mainApp.textResultDlg.update("Copy Selection", text.trim());
               this._mainApp.textResultDlg.show();
            }
         }

         public updateCurrentPageNumber(): void {
            if (this._mainApp.documentViewer)
               $(this.findTextPanel.findInCurrentPageOnlyCheckboxLabel).text("Restrict to current page (" + this._mainApp.documentViewer.currentPageNumber + ") only");
         }

         private findClose_Click(e: JQueryEventObject): void {
            $(this.findTextPanel.panel).removeClass('visiblePanel');
         }

         private _findLive: boolean = false;
         private findLiveBtn_Click(e: JQueryEventObject): void {
            this._findLive = !this._findLive;
            this.updateFindLive();
         }

         private updateFindLive(): void {
            $(this.findTextPanel.findLiveCheckButton).toggleClass("active", this._findLive);
         }

         private static _arrowKeys = [37, 38, 39, 40];
         private findInput_KeyDown(e: JQueryEventObject): void {
            // Prevent the arrow keys from moving the ImageViewer
            if (EditPart._arrowKeys.indexOf(e.keyCode) !== -1) {
               e.stopPropagation();
            }
         }

         private liveUpdate(): void {
            if (this._findLive)
               this.asyncFind(FindTextCursorAction.update);
         }

         private findPreviousBtn_Click(e: JQueryEventObject): void {
            this.asyncFind(FindTextCursorAction.previous);
         }

         private findNextBtn_Click(e: JQueryEventObject) {
            this.asyncFind(FindTextCursorAction.next);
         }

         private _isFindingText: boolean = false;
         public get isFindingText(): boolean {
            return this._isFindingText;
         }

         private asyncFind(cursorAction: FindTextCursorAction): void {
            if (this._isFindingText)
               return;

            // Get all the options
            var text: string = $(this.findTextPanel.textToFindTextInput).val();
            if (!text)
               return;

            var options = this._defaultFindTextOptions.clone();

            // Set the text options
            options.text = text;

            // Scroll our page to the first result
            options.selectFirstResult = true;

            var documentViewer = this._mainApp.documentViewer;

            if (DocumentViewerDemoApp.isMobileVersion) {
               // Most of the options can remain the default.
               // But set autoGetText to true
               documentViewer.text.autoGetText = true;
            } else {
               options.matchCase = $(this.findTextPanel.matchCaseCheckbox).is(":checked");
               options.wholeWordsOnly = $(this.findTextPanel.wholeWordsOnlyCheckbox).is(":checked");

               var findAll = $(this.findTextPanel.findAllMatchesCheckbox).is(":checked");
               options.findAll = findAll;
               // Render the results to the screen (set to false for "background" searches)
               options.renderResults = findAll;

               // Get text automatically
               var autoGetText = $(this.findTextPanel.getTextForFind).is(":checked");
               documentViewer.text.autoGetText = autoGetText;

               var loop = $(this.findTextPanel.findLoopCheckbox).is(":checked");
               options.loop = loop;
            }

            // We search the whole document, or just one page (more combinations are possible)
            var TextPosition = lt.Document.Viewer.DocumentViewerTextPosition;
            var searchBoundsBegin: lt.Document.Viewer.DocumentViewerTextPosition = null;
            var searchBoundsEnd: lt.Document.Viewer.DocumentViewerTextPosition = null;
            var currentPageOnly = $(this.findTextPanel.findInCurrentPageOnlyCheckbox).is(":checked");
            var currentPage = documentViewer.currentPageNumber;
            var firstPosition = TextPosition.createBeginOfPage(currentPageOnly ? currentPage : 1);
            var lastPosition = TextPosition.createEndOfPage(currentPageOnly ? currentPage : documentViewer.pageCount);
            if (cursorAction !== FindTextCursorAction.previous) {
               searchBoundsBegin = firstPosition;
               searchBoundsEnd = lastPosition;
            }
            else {
               searchBoundsBegin = lastPosition;
               searchBoundsEnd = firstPosition;
            }
            options.beginPosition = searchBoundsBegin;
            options.endPosition = searchBoundsEnd;

            // Set the start position
            // If there is no selection, we will default to the beginPosition, so usually there is no need to check.
            // But here we want to do a manual position if no selected text exists.
            if (documentViewer.text.hasAnySelectedText) {
               if (cursorAction == FindTextCursorAction.update)
                  options.start = lt.Document.Viewer.DocumentViewerFindTextStart.inSelection;
               else
                  options.start = lt.Document.Viewer.DocumentViewerFindTextStart.afterSelection;
            }
            else {
               options.start = lt.Document.Viewer.DocumentViewerFindTextStart.manualPosition;
               if (cursorAction == FindTextCursorAction.next)
                  options.manualStartPosition = TextPosition.createBeginOfPage(currentPage);
               else
                  options.manualStartPosition = TextPosition.createEndOfPage(currentPage);
            }

            // Set a good "No Results Found" message
            var noResultsMessage = "No results were found for the input '" + text + "'";
            if (!autoGetText) {
               noResultsMessage += "\nConsider expanding your search by enabling the option to get text for pages as needed."
            }
            noResultsMessage += "\n\nSearch was conducted from "
            noResultsMessage += EditPart._getPositionAsFriendlyText(searchBoundsBegin);
            noResultsMessage += " to "
            noResultsMessage += EditPart._getPositionAsFriendlyText(searchBoundsEnd);
            switch (<lt.Document.Viewer.DocumentViewerFindTextStart>options.start) {
               case lt.Document.Viewer.DocumentViewerFindTextStart.inSelection:
                  noResultsMessage += ", starting in the text selection.";
                  break;
               case lt.Document.Viewer.DocumentViewerFindTextStart.afterSelection:
                  noResultsMessage += ", starting from the text selection.";
                  break;
               case lt.Document.Viewer.DocumentViewerFindTextStart.manualPosition:
                  noResultsMessage += ", starting at " + EditPart._getPositionAsFriendlyText(options.manualStartPosition) + ".";
                  break;

               case lt.Document.Viewer.DocumentViewerFindTextStart.beginPosition:
               default:
                  noResultsMessage += ".";
                  break;
            }
            this._findTextNoResultsMessage = noResultsMessage;

            // Search
            this._findTextNeedsAbort = false;
            documentViewer.text.clearRenderedFoundText();
            // You can pass a "completed" handler, or use the postOperation callback.
            // We will use the postOperation callback to handle cancel events or internal UI requests to FindText.
            documentViewer.text.find(options, null);
         }

         private static _getPositionAsFriendlyText(position: lt.Document.Viewer.DocumentViewerTextPosition): string {
            var message = "";
            if (position.characterIndex == 0)
               message = "the top";
            else if (position.characterIndex == -1)
               message = "the bottom";
            else
               message = "index " + position.characterIndex;
            message += " of page " + position.pageNumber;
            return message;
         }

         private finishAsyncFind(options: lt.Document.Viewer.DocumentViewerFindText, results: lt.Document.Viewer.DocumentViewerMultiLineTextItem[]): void {
            // Entire operation is done, see results variable
            this._findTextNeedsAbort = false;
            this._isFindingText = false;
            this._mainApp.endBusyOperation();

            // Reset
            this._mainApp.getTextReason = GetTextReason.other;

            if (!this._findLive && !results && this._findTextNoResultsMessage)
               alert(this._findTextNoResultsMessage);
            this._findTextNoResultsMessage = null;
         }

         private _findTextNeedsAbort: boolean = false;
         private _findTextNoResultsMessage: string = null;

         public findTextOperationHandle(e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            var options = <lt.Document.Viewer.DocumentViewerFindText>e.data1;
            var results = <lt.Document.Viewer.DocumentViewerMultiLineTextItem[]>e.data2;

            if (!e.isPostOperation) {
               if (e.pageNumber == 0) {
                  // Entire operation is started

                  this._isFindingText = true;

                  // This will probably request GetText at some point, so let GetText know how to respond
                  this._mainApp.getTextReason = GetTextReason.internalOperation;
               }
               else {
                  // Single page is started
                  if (this._findTextNeedsAbort)
                     e.abort = true;
                  else
                     this._mainApp.loadingDlg.processing("Finding Text For Page " + e.pageNumber, null);
               }
            }
            else {
               if (e.pageNumber == 0) {
                  this.finishAsyncFind(options, results);
               }
               else {
                  // Single page is done, see results variable
                  if (this._findTextNeedsAbort)
                     e.abort = true;
               }
            }
         }

         public checkFindTextGetTextOperationHandle(e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            if (!this._isFindingText)
               return;

            if (this._findTextNeedsAbort) {
               e.abort = true;
            }
            else {
               if (!this._mainApp.isInsideBusyOperation) {
                  this._mainApp.beginBusyOperation();
                  this._mainApp.loadingDlg.show(true, false, "Retrieving Text...", null, null);

                  this._mainApp.loadingDlg.cancelClick = () => {
                     this._mainApp.loadingDlg.cancelClick = null;
                     this._findTextNeedsAbort = true;

                     // Show a timeout so users can see the "cancel" feedback in the UI for a moment
                     setTimeout(() => {
                        this._mainApp.getTextReason = GetTextReason.other;
                        this._isFindingText = false;
                        this._mainApp.endBusyOperation();
                     }, 500);
                  };
               }
            }
         }
      }
   }
}