/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      // Contains the interactive part
      export class InteractivePart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;
         // Reference to main imageviewer's useElements mode
         private _useElements: boolean = false;

         // Interactive menu items
         private headerToolbar_InteractiveMenu = {
            interactiveMenuItem: "#interactiveMenuItem",
            panZoomModeMenuItem: "#panZoomMode",
            panModeMenuItem: "#panMode",
            zoomModeMenuItem: "#zoomMode",
            zoomToModeMenuItem: "#zoomToMode",
            magnifyGlassModeMenuItem: "#magnifyGlassMode",
            rubberBandInteractiveModeMenuItem: "#rubberBandInteractiveMode",
            selectTextModeMenuItem: "#selectTextMode",
            autoPanMenuItem: "#autoPan",
            inertiaScrollMenuItem: "#inertiaScroll"
         };

         // Shortcuts
         private shortcuts = {
            panZoomModeBtn: "#panZoomMode_shortcut",
            panModeBtn: "#panMode_shortcut",
            zoomModeBtn: "#zoomMode_shortcut",
            zoomToModeBtn: "#zoomToMode_shortcut",
            magnifyGlassModeBtn: "#magnifyGlassMode_shortcut",
            rubberBandInteractiveModeBtn: "#rubberBandInteractiveMode_shortcut",
            selectTextModeBtn: "#selectTextMode_shortcut",
         };

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this.initInteractiveUI();
         }

         private initInteractiveUI(): void {
            $(this.headerToolbar_InteractiveMenu.rubberBandInteractiveModeMenuItem).on("click", this.rubberBandInteractiveModeMenuItem_Click.bind(this));
            $(this.shortcuts.rubberBandInteractiveModeBtn).on("click", this.rubberBandInteractiveModeBtn_Click.bind(this));
            $(this.headerToolbar_InteractiveMenu.interactiveMenuItem).on("click", this.interactiveMenuItem_Click.bind(this));
            $(this.headerToolbar_InteractiveMenu.inertiaScrollMenuItem).on("click", this.inertiaScrollMenuItem_Click.bind(this));
         }

         public bindElements(): void {
            var elements = this._mainApp.commandsBinder.elements;
            var element: CommandBinderElement;

            // Interactive menu
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.interactiveMenuItem);
            element.updateEnabled = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom;
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.panZoomModeMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactivePan;
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.panModeMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveZoom;
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.zoomModeMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveZoomTo;
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.zoomToModeMenuItem);
            element.updateChecked = true;
            elements.push(element);

            if (!this._mainApp.useElements) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveMagnifyGlass;
               element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.magnifyGlassModeMenuItem);
               element.updateChecked = true;
               elements.push(element);
            }
            else {
               $(this.headerToolbar_InteractiveMenu.magnifyGlassModeMenuItem).remove();
            }

            if (this._mainApp.demoMode == DemoMode.OCR) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand;
               element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.rubberBandInteractiveModeMenuItem);
               element.updateChecked = true;
               element.autoRun = false;
               elements.push(element);
            }

            if (this._mainApp.demoMode != DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveSelectText;
               element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.selectTextModeMenuItem);
               element.updateChecked = true;
               elements.push(element);
            }

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveAutoPan;
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.autoPanMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_InteractiveMenu.inertiaScrollMenuItem);
            elements.push(element);

            // Shortcuts
            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom;
            element.userInterfaceElement = $(this.shortcuts.panZoomModeBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactivePan;
            element.userInterfaceElement = $(this.shortcuts.panModeBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveZoom;
            element.userInterfaceElement = $(this.shortcuts.zoomModeBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveZoomTo;
            element.userInterfaceElement = $(this.shortcuts.zoomToModeBtn);
            element.updateChecked = true;
            elements.push(element);

            if (!this._mainApp.useElements) {
               // Remove the magnifyGlass option in Elements Mode
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveMagnifyGlass;
               element.userInterfaceElement = $(this.shortcuts.magnifyGlassModeBtn);
               element.updateChecked = true;
               elements.push(element);
            }
            else {
               $(this.shortcuts.magnifyGlassModeBtn).remove();
            }

            if (this._mainApp.demoMode == DemoMode.OCR || this._mainApp.demoMode == DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand;
               element.userInterfaceElement = $(this.shortcuts.rubberBandInteractiveModeBtn);
               element.updateChecked = true;
               elements.push(element);
            }

            if (this._mainApp.demoMode != DemoMode.Barcode) {
               element = new CommandBinderElement();
               element.commandName = lt.Document.Viewer.DocumentViewerCommands.interactiveSelectText;
               element.userInterfaceElement = $(this.shortcuts.selectTextModeBtn);
               element.updateChecked = true;
               elements.push(element);
            }

            // Set up the rubberband options, only once
            this.setRubberBandInteractiveMode();
         }

         private rubberBandInteractiveModeMenuItem_Click(e: JQueryEventObject): void {
            this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand, null);
         }

         private rubberBandInteractiveModeBtn_Click(e: JQueryEventObject): void {
            this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand, null);
         }

         private setRubberBandInteractiveMode(): void {
            var rubberbandMode = <lt.Controls.ImageViewerRubberBandInteractiveMode>this._mainApp.documentViewer.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.rubberBandModeId);
            rubberbandMode.rubberBandCompleted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) => this.rubberBandCompleted(sender, e));
            rubberbandMode.autoItemMode = lt.Controls.ImageViewerAutoItemMode.autoSet;
         }

         private rubberBandCompleted(sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs): void {
            if (e.isCanceled)
               return;
            var imageViewer = this._mainApp.documentViewer.view.imageViewer;
            var rubberBand = <lt.Controls.ImageViewerRubberBandInteractiveMode>sender;
            var item = rubberBand.item;
            // Confirm that the search area is still at least partially on screen
            var searchAreaInControl = lt.LeadRectD.fromLTRB(e.points[0].x, e.points[0].y, e.points[1].x, e.points[1].y);
            // Intersect the search area with the control. If completely outside the screen, cancel.
            var controlSize = imageViewer.controlSize;
            var intersect = lt.LeadRectD.intersectRects(searchAreaInControl, lt.LeadRectD.create(0, 0, controlSize.width, controlSize.height));
            if (intersect.isEmpty || intersect.width <= 0 || intersect.height <= 0)
               return;

            var searchArea = imageViewer.convertRect(item, lt.Controls.ImageViewerCoordinateType.control, lt.Controls.ImageViewerCoordinateType.image, searchAreaInControl);

            if (searchArea.width > 3 && searchArea.height > 3) {
               // If > 3, it's not a click. Call readBarcodes.
               var pageIndex = imageViewer.items.indexOf(item);
               var document = this._mainApp.documentViewer.document;
               searchArea = document.rectToDocument(searchArea);
               var page: lt.Document.DocumentPage = document.pages.item(pageIndex);
               if (this._mainApp.demoMode == DemoMode.OCR)
                  this._mainApp.recognize(page, searchArea);
               else if (this._mainApp.demoMode == DemoMode.Barcode)
                  this._mainApp.readBarcodes(page, searchArea);
            }
            else if (this._mainApp.demoMode == DemoMode.Barcode) {
               // If < 3, consider it a click, and show the barcode if it's in the current barcode list.
               var pageIndex = imageViewer.items.indexOf(item);
               var document = this._mainApp.documentViewer.document;
               searchArea = document.rectToDocument(searchArea);
               this._mainApp.checkBarcodeData(pageIndex, searchArea);
            }
         }

         private interactiveMenuItem_Click(e: JQueryEventObject): void {
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_InteractiveMenu.inertiaScrollMenuItem).find(".icon"), this._mainApp.preferencesPart.enableInertiaScroll);
         }

         private inertiaScrollMenuItem_Click(e: JQueryEventObject): void {
            this._mainApp.toggleInertiaScroll();
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_InteractiveMenu.inertiaScrollMenuItem).find(".icon"), this._mainApp.preferencesPart.enableInertiaScroll);
         }
      }
   }
}