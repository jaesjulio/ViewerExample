/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      // Contains the view part
      export class ViewPart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // When displaying with PDF Rendering, we need to indicate that viewAsSvg and viewAsImage do nothing
         private _itemTypeChangeWarned: boolean = false;

         // View menu
         private headerToolbar_ViewMenu = {
            viewMenuItem: "#viewMenuItem",
            rotateCounterClockwiseMenuItem: "#rotateCounterClockwise",
            rotateClockwiseMenuItem: "#rotateClockwise",
            zoomOutMenuItem: "#zoomOut",
            zoomInMenuItem: "#zoomIn",
            actualSizeMenuItem: "#actualSize",
            fitMenuItem: "#fit",
            fitWidthMenuItem: "#fitWidth",
            asImageMenuItem: "#viewAsImage",
            asSvgMenuItem: "#viewAsSVG",
         };

         // Shortcuts
         private shortcuts = {
            zoomOutBtn: "#zoomOut_shortcut",
            zoomInBtn: "#zoomIn_shortcut",
            zoomValuesSelectElement: {
               SelectElement: "#zoomValues",
               currentZoomValueOption: "#currentZoomValue"
            },
            actualSizeBtn: "#actualSize_shortcut",
            fitBtn: "#fit_shortcut",
            fitWidthBtn: "#fitWidth_shortcut",
         };

         mobileVersionViewControls = {
            showViewControlsBtn: "#showViewControls",
            closeViewControlsBtn: "#closeViewControls",
            viewControls: "#viewControlsContainer"
         }

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this.initViewUI();
         }

         private initViewUI(): void {
            // View menu items
            $(this.headerToolbar_ViewMenu.viewMenuItem).on("click", this.viewMenuItem_Click.bind(this));
            $(this.headerToolbar_ViewMenu.asSvgMenuItem).on("click", this.asSvgMenuItem_Click.bind(this));
            $(this.headerToolbar_ViewMenu.asImageMenuItem).on("click", this.asImageMenuItem_Click.bind(this));

            // Only for mobile version
            if (DocumentViewerDemoApp.isMobileVersion) {
               $(this.mobileVersionViewControls.viewControls).css("bottom", -$(this.mobileVersionViewControls.viewControls).height() - 10);
               $(this.mobileVersionViewControls.viewControls).css("display", "block");
               $(this.mobileVersionViewControls.showViewControlsBtn).on("click", this.showViewControlsBtn_Click.bind(this));
               $(this.mobileVersionViewControls.closeViewControlsBtn).on("click", this.closeViewControlsBtn_Click.bind(this));
            }
         }

         public bindElements(): void {
            var elements = this._mainApp.commandsBinder.elements;
            var element: CommandBinderElement;

            // View menu
            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.viewMenuItem);
            element.updateEnabled = false;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewRotateCounterClockwise;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.rotateCounterClockwiseMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewRotateClockwise;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.rotateClockwiseMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewZoomOut;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.zoomOutMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewZoomIn;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.zoomInMenuItem);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewActualSize;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.actualSizeMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewFitPage;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.fitMenuItem);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewFitWidth;
            element.userInterfaceElement = $(this.headerToolbar_ViewMenu.fitWidthMenuItem);
            element.updateChecked = true;
            elements.push(element);

            // Shortcuts
            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewZoomOut;
            element.userInterfaceElement = $(this.shortcuts.zoomOutBtn);
            elements.push(element);

            element = new CommandBinderElement();
            element.userInterfaceElement = $(this.shortcuts.zoomValuesSelectElement.SelectElement);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewZoomIn;
            element.userInterfaceElement = $(this.shortcuts.zoomInBtn);
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewActualSize;
            element.userInterfaceElement = $(this.shortcuts.actualSizeBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewFitPage;
            element.userInterfaceElement = $(this.shortcuts.fitBtn);
            element.updateChecked = true;
            elements.push(element);

            element = new CommandBinderElement();
            element.commandName = lt.Document.Viewer.DocumentViewerCommands.viewFitWidth;
            element.userInterfaceElement = $(this.shortcuts.fitWidthBtn);
            element.updateChecked = true;
            elements.push(element);

            this.bindZoom();
         }

         private bindZoom(): void {
            this._mainApp.documentViewer.view.imageViewer.transformChanged.add(() => this.updateZoomValueFromView());

            $(this.shortcuts.zoomValuesSelectElement.SelectElement).change((e: JQueryEventObject) => {
               if (!this._mainApp.documentViewer.hasDocument)
                  return;

               // Parse the new zoom value
               var text: string = $(this.shortcuts.zoomValuesSelectElement.SelectElement).val();
               var imageViewer = this._mainApp.documentViewer.view.imageViewer;

               switch (text) {
                  case "Actual Size":
                     imageViewer.zoom(lt.Controls.ControlSizeMode.actualSize, 1, imageViewer.defaultZoomOrigin);
                     break;

                  case "Fit Page":
                     imageViewer.zoom(lt.Controls.ControlSizeMode.fitAlways, 1, imageViewer.defaultZoomOrigin);
                     break;

                  case "Fit Width":
                     imageViewer.zoom(lt.Controls.ControlSizeMode.fitWidth, 1, imageViewer.defaultZoomOrigin);
                     break;

                  case "Fit Height":
                     imageViewer.zoom(lt.Controls.ControlSizeMode.fitHeight, 1, imageViewer.defaultZoomOrigin);
                     break;

                  default:
                     if (text != null && text != "") {
                        var percentage = parseFloat(text.substring(0, text.length - 1));
                        imageViewer.zoom(lt.Controls.ControlSizeMode.none, percentage / 100.0, imageViewer.defaultZoomOrigin);
                     }
                     break;
               }
            });
         }

         private _customZoomValue: number = -1;
         private updateZoomValueFromView(): void {
            if (this._mainApp.documentViewer.hasDocument) {
               var percentage = this._mainApp.documentViewer.view.imageViewer.scaleFactor * 100.0;

               if (this._customZoomValue !== percentage) {
                  this._customZoomValue = percentage;
                  $(this.shortcuts.zoomValuesSelectElement.currentZoomValueOption).text(percentage.toFixed(1) + "%");

                  // Select the currentZoomValueOption
                  $(this.shortcuts.zoomValuesSelectElement.SelectElement).prop("selectedIndex", 0);
               }
            }
            else {
               this._customZoomValue = -1;
               $(this.shortcuts.zoomValuesSelectElement.currentZoomValueOption).text("");
               // Select the currentZoomValueOption 
               $(this.shortcuts.zoomValuesSelectElement.SelectElement).prop("selectedIndex", 0);
            }
         }

         private viewMenuItem_Click(e: JQueryEventObject): void {
            this.updateViewMenu();
         }

         public updateViewMenu(): void {
            if (this._mainApp.documentViewer.hasDocument) {
               // These elements are not bound to commandsBinder, so we need enable them

               if (this._mainApp.documentViewer.isUsingPDFRendering) {
                  this.updateViewMenuPDFRendering();
               }
               else {
                  $(this.headerToolbar_ViewMenu.asSvgMenuItem).prop("disabled", false);
                  $(this.headerToolbar_ViewMenu.asImageMenuItem).prop("disabled", false);

                  if (this._mainApp.documentViewer.document.images.isSvgSupported) {
                     $(this.headerToolbar_ViewMenu.asSvgMenuItem).prop("disabled", false);

                     var asSvgMenuItemChecked = !this._mainApp.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.viewItemType, lt.Document.Viewer.DocumentViewerItemType.svg);
                     var AsImageMenuItemChecked = !this._mainApp.documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.viewItemType, lt.Document.Viewer.DocumentViewerItemType.image);

                     lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asSvgMenuItem).find(".icon"), asSvgMenuItemChecked);
                     lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asImageMenuItem).find(".icon"), AsImageMenuItemChecked);
                  }
                  else {
                     $(this.headerToolbar_ViewMenu.asSvgMenuItem).prop("disabled", true);
                     lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asSvgMenuItem).find(".icon"), false);
                     lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asImageMenuItem).find(".icon"), true);
                  }
               }
            }
            else {
               // These elements are not bound to commandsBinder, so we need to disable and uncheck them if there is no loaded document
               lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asSvgMenuItem).find(".icon"), false);
               $(this.headerToolbar_ViewMenu.asSvgMenuItem).prop("disabled", true);

               lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asImageMenuItem).find(".icon"), false);
               $(this.headerToolbar_ViewMenu.asImageMenuItem).prop("disabled", true);
            }
         }

         private updateViewMenuPDFRendering(): void {
            // If we are using PDF Rendering, the preferred item type no longer matters.
            // Keep the buttons clickable so we can show a warning.
            $(this.headerToolbar_ViewMenu.asSvgMenuItem).prop("disabled", this._itemTypeChangeWarned);
            $(this.headerToolbar_ViewMenu.asImageMenuItem).prop("disabled", this._itemTypeChangeWarned);
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asSvgMenuItem).find(".icon"), false);
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asImageMenuItem).find(".icon"), false);
         }

         public setViewMode(isSvg: boolean) {
            this._mainApp.setInterpolationMode(this._mainApp.documentViewer.document, isSvg);
            this._mainApp.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewItemType,
               isSvg ? lt.Document.Viewer.DocumentViewerItemType.svg : lt.Document.Viewer.DocumentViewerItemType.image);
            // Check as svg button
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asSvgMenuItem).find(".icon"), isSvg);
            // Uncheck as image button
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_ViewMenu.asImageMenuItem).find(".icon"), !isSvg);
         }

         private checkShowPDFRenderingWarning(): void {
            // If we are using PDF Rendering, the preferred item type no longer matters.
            // Keep the buttons clickable so we can show a warning.
            if (!this._itemTypeChangeWarned) {
               this._itemTypeChangeWarned = true;
               // Now disable
               var lines = [
                  "This PDF document is being rendered on the client with JavaScript.",
                  "While rendering on the client, the 'preferred viewing' controls are unavailable.",
                  "To disable client-side rendering, see the Document Viewer Options dialog."
               ];
               alert(lines.join("\n"));
            }
         }

         private asSvgMenuItem_Click(e: JQueryEventObject): void {
            if (this._mainApp.documentViewer.isUsingPDFRendering) {
               this.checkShowPDFRenderingWarning();
               this.updateViewMenuPDFRendering();
            }
            else {
               this.setViewMode(true);
            }
         }

         private asImageMenuItem_Click(e: JQueryEventObject): void {
            if (this._mainApp.documentViewer.isUsingPDFRendering) {
               this.checkShowPDFRenderingWarning();
               this.updateViewMenuPDFRendering();
            }
            else {
               this.setViewMode(false);
            }
         }

         // For mobile
         private showViewControlsBtn_Click(e: JQueryEventObject): void {
            $(this._mainApp.mobileVersionControlsContainers).removeClass('visiblePanel');
            $(this.mobileVersionViewControls.viewControls).addClass('visiblePanel');
            this.updateViewMenu();
         }

         // For mobile
         private closeViewControlsBtn_Click(e: JQueryEventObject): void {
            $(this.mobileVersionViewControls.viewControls).removeClass('visiblePanel');
         }
      }
   }
}