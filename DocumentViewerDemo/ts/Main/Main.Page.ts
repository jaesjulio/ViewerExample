/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {

      interface DocumentViewerContextMenuData {
         app: DocumentViewerDemoApp,
         document: lt.Document.LEADDocument
      }

      // Contains the page options part  
      export class PagePart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // Page menu items
         private headerToolbar_PageMenu = {
            pageMenuItem: "#pageMenuItem",
            firstPageMenuItem: "#firstPage",
            previousPageMenuItem: "#previousPage",
            nextPageMenuItem: "#nextPage",
            lastPageMenuItem: "#lastPage",
            currentPageGetTextMenuItem: "#currentPageGetText",
            allPagesGetTextMenuItem: "#allPagesGetText",
            readPageBarcodesMenuItem: "#readPageBarcodes",
            readAllBarcodesMenuItem: "#readAllBarcodes",
            rotateCurrentPageClockwiseMenuItem: "#rotateCurrentPageClockwise",
            rotateCurrentPageCounterClockwiseMenuItem: "#rotateCurrentPageCounterClockwise",
            rotatePagesMenuItem: "#rotatePages",
            markPageDisabled: "#markPageDisabled",
            singlePageDisplayMenuItem: "#singlePageDisplay",
            doublePagesDisplayMenuItem: "#doublePagesDisplay",
            verticalPagesDisplayMenuItem: "#verticalPagesDisplay",
            horizontalPagesDisplayMenuItem: "#horizontalPagesDisplay"
         };

         // Shortcuts
         private shortcuts = {
            dividers: ".shortcutsbar>.verticalDivider",
            previousPageBtn: "#previousPage_shortcut",
            nextPageBtn: "#nextPage_shortcut",
            pageNumberTextInput: "#pageNumber",
            pageCountLabel: "#pageCount",
            singlePageDisplayBtn: "#singlePageDisplay_shortcut",
            doublePagesDisplayBtn: "#doublePagesDisplay_shortcut",
            verticalPagesDisplayBtn: "#verticalPagesDisplay_shortcut",
            horizontalPagesDisplayBtn: "#horizontalPagesDisplay_shortcut",
            processAllPagesBtn: "#processAllPages_shortcut"
         };

         public viewContextMenu: lt.Demos.Viewer.ContextMenu = null;
         public thumbnailsContextMenu: lt.Demos.Viewer.ContextMenu = null;
         public rotatePagesDlg: Dialogs.PageRotation.PageRotationDlg = null;

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this.initPageUI();
         }

         private initPageUI(): void {
            // Page menu
            $(this.headerToolbar_PageMenu.pageMenuItem).on("click", this.preferencesMenuItem_Click.bind(this));
            $(this.headerToolbar_PageMenu.currentPageGetTextMenuItem).on("click", this.currentPageGetTextMenuItem_Click.bind(this));
            $(this.headerToolbar_PageMenu.allPagesGetTextMenuItem).on("click", this.allPagesGetTextMenuItem_Click.bind(this));
            $(this.headerToolbar_PageMenu.readPageBarcodesMenuItem).on("click", this.readPageBarcodesMenuItem_Click.bind(this));
            if (this._mainApp.demoMode == DemoMode.Barcode) {
               // If Barcode, allow read barcode on all pages
               $(this.headerToolbar_PageMenu.readAllBarcodesMenuItem).click(this.readAllBarcodesMenuItem_Click.bind(this));
               $(this.shortcuts.processAllPagesBtn).click(this.readAllBarcodesMenuItem_Click.bind(this));
            }

            $(this.headerToolbar_PageMenu.markPageDisabled).on("click", this.markPageDisabledMenuItem_Click.bind(this));

            // Navigation bar
            $(this._mainApp.navigationbar.showThumbnailsBtn).on("click", this.showThumbnailsBtn_Click.bind(this));
            $(this._mainApp.navigationbar.showBookmarksBtn).on("click", this.showBookmarksBtn_Click.bind(this));

            $(this.headerToolbar_PageMenu.rotatePagesMenuItem).on("click", this.showPageRotateDialog_Click.bind(this));

            if (!DocumentViewerDemoApp.isMobileVersion) {
               this.rotatePagesDlg = new Dialogs.PageRotation.PageRotationDlg();
               this.rotatePagesDlg.onApply = this._pageRotationDialog_OnApply;
            }
         }

         private createContextMenus() {
            if (DocumentViewerDemoApp.isMobileVersion)
               return;

            var app = this._mainApp;
            if (!app.documentViewer.view && !app.documentViewer.thumbnails)
               return;

            var UpdateState = lt.Demos.Viewer.ContextMenuUpdateState;

            var common: lt.Demos.Viewer.ContextMenuActionEntry[] = [
               {
                  name: "Retrieve text for this page",
                  icon: "Resources/Images/Icons/SelectTextMode.png",
                  update: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;

                     if (data.app.demoMode === DemoMode.Barcode) {
                        // This works for text only, so not in barcode mode
                        args.updateState = UpdateState.disabledHidden;
                        return;
                     }
                     // Only work when we have a document and are on a page
                     var pageNumber = args.itemIndex + 1;
                     if (!data.document || pageNumber < 1) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     args.action.name = "Retrieve text for page " + pageNumber;

                     var page = data.document.pages.item(args.itemIndex);
                     // Disallow command on a disabled page
                     if (page.isDeleted) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     if (data.app.documentViewer.text.hasDocumentPageText(pageNumber)) {
                        args.updateState = UpdateState.disabledCompleted;
                        return;
                     }

                     var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.textGet, pageNumber);
                     args.updateState = canRun ? UpdateState.active : UpdateState.disabled;
                  },
                  run: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;
                     data.app.manualGetText([args.itemIndex + 1], null);
                  }
               },
               {
                  name: "Retrieve text for all pages",
                  update: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;

                     if (data.app.demoMode === DemoMode.Barcode) {
                        // This works for text only, so not in barcode mode
                        args.updateState = UpdateState.disabledHidden;
                        return;
                     }
                     // Only work when we have a document
                     if (!data.app.documentViewer.document) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.textGet, 0);
                     args.updateState = canRun ? UpdateState.active : UpdateState.disabled;
                  },
                  run: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;
                     data.app.manualGetText(null, null);
                  }
               },
               {
                  name: "Rotate page by 90 degrees",
                  icon: "Resources/Images/Icons/Clockwise.png",
                  update: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;

                     // Only work when we have a document and are on a page
                     var pageNumber = args.itemIndex + 1;
                     if (!data.app.documentViewer.document || pageNumber < 1) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     args.action.name = "Rotate page " + pageNumber + " by 90 degrees";

                     var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.pageRotateClockwise, [pageNumber]);
                     args.updateState = canRun ? UpdateState.active : UpdateState.disabled;
                  },
                  run: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;
                     data.app.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageRotateClockwise, [args.itemIndex + 1]);
                  }
               },
               {
                  name: "Rotate all pages by 90 degrees",
                  update: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;

                     // Only work when we have a document and are on a page
                     if (!data.app.documentViewer.document) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.pageRotateClockwise, 0);
                     args.updateState = canRun ? UpdateState.active : UpdateState.disabled;
                  },
                  run: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;
                     data.app.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageRotateClockwise, null);
                  }
               },
               {
                  name: "Mark page as disabled",
                  icon: "Resources/Images/Icons/Disable.png",
                  update: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;

                     // Only work when we have a document and are on a page
                     var pageNumber = args.itemIndex + 1;
                     if (!data.app.documentViewer.document || pageNumber < 1) {
                        args.updateState = UpdateState.disabled;
                        return;
                     }

                     args.action.name = "Mark page " + pageNumber + " as disabled";

                     var page = data.app.documentViewer.document.pages.item(args.itemIndex);
                     // Disallow command on a disabled page
                     if (page.isDeleted) {
                        args.updateState = UpdateState.selected;
                        var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.pageEnable, [pageNumber]);
                        if (!canRun)
                           args.updateState = UpdateState.disabledSelected;
                        return;
                     }

                     var canRun = data.app.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.pageDisable, [pageNumber]);
                     args.updateState = canRun ? UpdateState.active : UpdateState.disabled;
                  },
                  run: function (args) {
                     var data = <DocumentViewerContextMenuData>args.menu.data;
                     var page = data.app.documentViewer.document.pages.item(args.itemIndex);
                     // Disallow command on a disabled page
                     var command = page.isDeleted ? lt.Document.Viewer.DocumentViewerCommands.pageEnable : lt.Document.Viewer.DocumentViewerCommands.pageDisable;
                     data.app.documentViewer.commands.run(command, [args.itemIndex + 1]);
                  }
               }
            ];

            var data: DocumentViewerContextMenuData = {
               app: app,
               document: null
            }

            if (app.documentViewer.view) {
               var viewEntries = common.concat([
                  // Add more view element items
               ]);
               var viewContextMenuContainer = <HTMLElement>document.querySelector("#viewContextMenuParent");
               this.viewContextMenu = new lt.Demos.Viewer.ContextMenu({
                  containerElement: viewContextMenuContainer,
                  viewer: app.documentViewer.view.imageViewer,
                  entries: viewEntries,
                  data: data
               });
               // Don't go off-screen
               this.viewContextMenu.constrainX = true;
               this.viewContextMenu.constrainY = true;
               /* Safari note: Safari has a rendering bug that will cause
                * improper rendering inside of the condensed mode unless
                * it detects that text needs to be rendered. For Safari only,
                * we do not allow condensed mode.
                */
               if (lt.LTHelper.browser === lt.LTBrowser.safari) {
                  this.viewContextMenu.condensed = false;
                  this.viewContextMenu.showCondenseButton = false;
               }
               else {
                  this.viewContextMenu.condensed = true;
                  this.viewContextMenu.showCondenseButton = true;
               }
            }

            if (app.documentViewer.thumbnails) {
               var thumbnailsEntries = common.concat([
                  // Add more thumbnails element items
               ]);
               var thumbnailsContextMenuContainer = <HTMLElement>document.querySelector("#thumbnailsContextMenuParent");
               this.thumbnailsContextMenu = new lt.Demos.Viewer.ContextMenu({
                  containerElement: thumbnailsContextMenuContainer,
                  viewer: app.documentViewer.thumbnails.imageViewer,
                  entries: thumbnailsEntries,
                  data: data
               });
               // Don't go off-screen in the Y direction
               this.thumbnailsContextMenu.constrainY = true;
               if (lt.LTHelper.browser === lt.LTBrowser.safari) {
                  this.thumbnailsContextMenu.condensed = false;
                  this.thumbnailsContextMenu.showCondenseButton = false;
               }
               else {
                  this.thumbnailsContextMenu.condensed = true;
                  this.thumbnailsContextMenu.showCondenseButton = true;
               }
            }

            var viewContextMenu = this.viewContextMenu;
            var thumbnailsContextMenu = this.thumbnailsContextMenu;
            var onUpdate = function (args: lt.Demos.Viewer.ContextMenuArgs) {

               // Sync up the condensed property
               var condensed = args.menu.condensed;
               if (viewContextMenu && thumbnailsContextMenu) {
                  thumbnailsContextMenu.condensed = condensed;
                  viewContextMenu.condensed = condensed;
               }

               // Update the arguments data
               var data = <DocumentViewerContextMenuData>args.menu.data;
               data.document = app.documentViewer ? app.documentViewer.document : null;

               // Set the header name
               if (!args.menu.condensed) {
                  if (args.itemIndex === -1)
                     return "Document";
                  return "Page " + (args.itemIndex + 1);
               }
               return null;
            };
            if (viewContextMenu)
               viewContextMenu.onUpdate = onUpdate;
            if (thumbnailsContextMenu)
               thumbnailsContextMenu.onUpdate = onUpdate;
         }

         public bindElements(): void {

            this.createContextMenus();

            var elements = this._mainApp.commandsBinder.elements;
            var element: CommandBinderElement;

            // Page menu
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.pageMenuItem);
            element.updateEnabled = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageFirst;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.firstPageMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pagePrevious;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.previousPageMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageNext;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.nextPageMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageLast;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.lastPageMenuItem);
            elements.push(element);

            if (this._mainApp.demoMode != DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.textGet;
               element.userInterfaceElement = $(this.headerToolbar_PageMenu.currentPageGetTextMenuItem);
               element.autoRun = false;
               element.getValue = () => {
                  return this._mainApp.documentViewer.currentPageNumber;
               };
               elements.push(element);

               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.textGet;
               element.userInterfaceElement = $(this.headerToolbar_PageMenu.allPagesGetTextMenuItem);
               element.autoRun = false;
               element.getValue = () => {
                  return 0;
               };
               elements.push(element);
            }

            if (this._mainApp.demoMode == DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.headerToolbar_PageMenu.readPageBarcodesMenuItem);
               element.autoRun = false;
               elements.push(element);
            }

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.markPageDisabled);
            element.getValue = () => {
               return [this._mainApp.documentViewer.currentPageNumber];
            };
            element.updateChecked = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageRotateClockwise;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.rotateCurrentPageClockwiseMenuItem);
            element.getValue = () => {
               return [this._mainApp.documentViewer.currentPageNumber];
            };
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageRotateCounterClockwise;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.rotateCurrentPageCounterClockwiseMenuItem);
            element.getValue = () => {
               return [this._mainApp.documentViewer.currentPageNumber];
            };
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutSingle;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.singlePageDisplayMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutDouble;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.doublePagesDisplayMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutVertical;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.verticalPagesDisplayMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutHorizontal;
            element.userInterfaceElement = $(this.headerToolbar_PageMenu.horizontalPagesDisplayMenuItem);
            element.updateChecked = true;
            elements.push(element);

            // Shortcuts
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.dividers);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pagePrevious;
            element.userInterfaceElement = $(this.shortcuts.previousPageBtn);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.pageNext;
            element.userInterfaceElement = $(this.shortcuts.nextPageBtn);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.pageNumberTextInput);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.pageCountLabel);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutSingle;
            element.userInterfaceElement = $(this.shortcuts.singlePageDisplayBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutDouble;
            element.userInterfaceElement = $(this.shortcuts.doublePagesDisplayBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutVertical;
            element.userInterfaceElement = $(this.shortcuts.verticalPagesDisplayBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.layoutHorizontal;
            element.userInterfaceElement = $(this.shortcuts.horizontalPagesDisplayBtn);
            element.updateChecked = true;
            elements.push(element);

            if (this._mainApp.demoMode == DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.userInterfaceElement = $(this.shortcuts.processAllPagesBtn);
               element.hasDocumentEmptyEnabled = false;
               elements.push(element);
            }

            this.bindPageNumber();
         }

         public updateCurrentPageNumber(data: lt.Document.Viewer.CurrentPageNumberChangeData): void {
            if (this._mainApp.documentViewer.hasDocument) {
               var pageNumber = this._mainApp.documentViewer.currentPageNumber;
               var pageCount = this._mainApp.documentViewer.pageCount;
               $(this.shortcuts.pageNumberTextInput).val(pageNumber.toString());
               $(this.shortcuts.pageCountLabel).text("/ " + pageCount.toString());
            } else {
               $(this.shortcuts.pageNumberTextInput).val("0");
               $(this.shortcuts.pageCountLabel).text("/ " + "0");
            }
         }

         private bindPageNumber(): void {

            $(this.shortcuts.pageNumberTextInput).focusout((e: JQueryEventObject) => {
               if (!this._mainApp.documentViewer.hasDocument)
                  return;

               var pageNumber = this._mainApp.documentViewer.currentPageNumber;
               $(this.shortcuts.pageNumberTextInput).val(pageNumber.toString());
            });

            $(this.shortcuts.pageNumberTextInput).keypress((e: JQueryKeyEventObject) => {
               if (e.keyCode != 13)
                  return;

               // User has pressed enter(Go or return for mobile and tablet devices), go to the new page number
               e.preventDefault();
               var text: string = $(this.shortcuts.pageNumberTextInput).val();

               var newPageNumber = parseInt(text);

               var pageNumber = this._mainApp.documentViewer.currentPageNumber;
               var pageCount = this._mainApp.documentViewer.pageCount;

               if (newPageNumber && newPageNumber != pageNumber && newPageNumber >= 1 && newPageNumber <= pageCount) {
                  try {
                     this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageGoto, newPageNumber);
                  }
                  catch (ex) {
                     window.alert(ex);
                  }
               }
               else {
                  $(this.shortcuts.pageNumberTextInput).val(pageNumber.toString());
               }
            });
         }

         private preferencesMenuItem_Click(e: JQueryEventObject): void {

            var documentViewer = this._mainApp.documentViewer;
            if (!documentViewer.hasDocument)
               return;
            var pageNumber = documentViewer.currentPageNumber;
            if (pageNumber === 0)
               return;

            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_PageMenu.markPageDisabled).find(".icon"), documentViewer.document.pages.item(pageNumber - 1).isDeleted);
         }

         private currentPageGetTextMenuItem_Click(e: JQueryEventObject): void {
            this._mainApp.manualGetText([this._mainApp.documentViewer.currentPageNumber], null);
         }

         private allPagesGetTextMenuItem_Click(e: JQueryEventObject): void {
            this._mainApp.manualGetText(null, null);
         }

         private readPageBarcodesMenuItem_Click(e: JQueryEventObject): void {
            var page: lt.Document.DocumentPage = this._mainApp.documentViewer.document.pages.item(this._mainApp.documentViewer.currentPageNumber - 1);
            this._mainApp.readBarcodes(page, lt.LeadRectD.empty);
         }

         private readAllBarcodesMenuItem_Click(e: JQueryEventObject): void {
            this._mainApp.readBarcodes(null, lt.LeadRectD.empty);
         }

         private markPageDisabledMenuItem_Click(): void {
            var pageNumber = this._mainApp.documentViewer.currentPageNumber;
            this.disableEnablePage(pageNumber);
         }

         private disableEnablePage(pageNumber: number) {
            var page = this._mainApp.documentViewer.document.pages.get_item(pageNumber - 1);
            var command = page.isDeleted ? lt.Document.Viewer.DocumentViewerCommands.pageEnable : lt.Document.Viewer.DocumentViewerCommands.pageDisable;
            this._mainApp.documentViewer.commands.run(command, [pageNumber]);
         }

         private thisPageGetTextMenuItem_Click(e: JQueryEventObject): void {
            var pageNumber = parseInt($(e.currentTarget).data("pageNumber"));
            this._mainApp.manualGetText([pageNumber], null);
         }

         private showPageRotateDialog_Click(e: JQueryEventObject): void {
            this.rotatePagesDlg.show(this._mainApp.documentViewer.currentPageNumber, this._mainApp.documentViewer.pageCount);
         }

         private _pageRotationDialog_OnApply = (args: Dialogs.PageRotation.PageRotationArgs) => {
            var rotationAngle: number = 0;

            switch (args.direction) {
               case Dialogs.PageRotation.DirectionMode.direction90CounterClockwise:
                  rotationAngle = -90;
                  break;

               case Dialogs.PageRotation.DirectionMode.direction180:
                  rotationAngle = 180;
                  break;

               case Dialogs.PageRotation.DirectionMode.direction90Clockwise:
               default:
                  rotationAngle = 90;
                  break;
            }

            var argsPageNumbers = args.pageNumbers;
            if (!argsPageNumbers || argsPageNumbers.length === 0) {
               argsPageNumbers = [];
               for (var i = 1; i <= this._mainApp.documentViewer.pageCount; i++)
                  argsPageNumbers.push(i);
            }
            var evenOdd = args.evenOddMode;
            var orientation = args.orientationMode;

            var finalPageNumbers: number[] = null;

            if (argsPageNumbers.length > 0) {
               finalPageNumbers = [];
               for (var i = 0; i < argsPageNumbers.length; i++) {
                  var pageNumber = argsPageNumbers[i];
                  var add = false;

                  switch (evenOdd) {
                     case Dialogs.PageRotation.EvenOddMode.onlyEven:
                        add = (pageNumber % 2) == 0;
                        break;

                     case Dialogs.PageRotation.EvenOddMode.onlyOdd:
                        add = (pageNumber % 2) != 0;
                        break;

                     case Dialogs.PageRotation.EvenOddMode.all:
                        add = true;
                        break;
                  }

                  if (add) {
                     var page = this._mainApp.documentViewer.document.pages.item(pageNumber - 1);
                     switch (orientation) {
                        case Dialogs.PageRotation.OrientationMode.landscapeOnly:
                           add = page.viewPerspectiveSize.width > page.viewPerspectiveSize.height;
                           break;

                        case Dialogs.PageRotation.OrientationMode.portraitOnly:
                           add = page.viewPerspectiveSize.height > page.viewPerspectiveSize.width;
                           break;

                        case Dialogs.PageRotation.OrientationMode.all:
                        default:
                           add = true;
                           break;
                     }
                  }

                  if (add)
                     finalPageNumbers.push(pageNumber);
               }
            }

            if (!finalPageNumbers || finalPageNumbers.length > 0)
               this._mainApp.documentViewer.rotatePages(finalPageNumbers, rotationAngle);
         }

         private showThumbnailsBtn_Click(e: JQueryEventObject): void {
            this._mainApp.showContainer(this._mainApp.thumbnailsContainer, true);
         }

         private showBookmarksBtn_Click(e: JQueryEventObject): void {
            this._mainApp.showContainer(this._mainApp.bookmarksContainer, true);
         }

         public handleRunCommand(e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            // Make sure the context interactive modes are enabled and started (can be disabled when running commands)
            if (this.viewContextMenu) {
               var viewContextMode = this.viewContextMenu.contextMenuMode;
               if (!viewContextMode.isStarted) {
                  viewContextMode.isEnabled = true;
                  viewContextMode.start(this.viewContextMenu.viewer);
               }
            }
            if (this.thumbnailsContextMenu) {
               var thumbnailsContextMode = this.thumbnailsContextMenu.contextMenuMode;
               if (!thumbnailsContextMode.isStarted) {
                  thumbnailsContextMode.isEnabled = true;
                  thumbnailsContextMode.start(this.thumbnailsContextMenu.viewer);
               }
            }
         }
      }
   }
}
