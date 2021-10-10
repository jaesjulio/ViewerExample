/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      enum PageOption {
         All,
         Current,
         Select,
         Visible
      }

      enum PrintPageUnits {
         inches,
         millimeters
      }

      class PrintPageSize {
         private _name: string;
         private _size: lt.LeadSizeD;
         private _units: PrintPageUnits;
         private _documentUnits: lt.LeadSizeD;

         public constructor(name: string, width: number, height: number, unit: PrintPageUnits) {
            var unitsPerInch = lt.Document.LEADDocument.unitsPerInch;
            this._name = name;
            this._size = lt.LeadSizeD.create(width, height);
            this._units = unit;
            if (this._units === PrintPageUnits.inches) {
               this._documentUnits = lt.LeadSizeD.create(
                  this._size.width * unitsPerInch,
                  this._size.height * unitsPerInch
               );
            }
            else {
               this._documentUnits = lt.LeadSizeD.create(
                  this._size.width / 25.4 * unitsPerInch,
                  this._size.height / 25.4 * unitsPerInch
               );
            }
         }

         public get name(): string { return this._name; }
         public get size(): lt.LeadSizeD { return this._size; }
         public get units(): PrintPageUnits { return this._units; }
         public get documentUnits(): lt.LeadSizeD { return this._documentUnits; }

         public toString(): string {
            var unit = this._units === PrintPageUnits.inches ? "in" : "mm";
            return this._name + " (" + this._size.width + " x " + this._size.height + " " + unit + ")";
         }
      }

      interface PrintDlgUI<T> {
         pageRadioBtns: T,
         messageContainer: T,
         currentPageLabel: T,
         visiblePagesLabel: T,
         orientationSelectElement: T,
         orientationRotateCheckbox: T,
         pageSizeSelectElement: T,
         pageSizeDocumentSize: T,
         dpiInput: T,
         showAnnotationsContainer: T,
         showAnnotationsCheckbox: T,
         removeMarginsContainer: T,
         removeMarginsCheckbox: T,
         pagesTextInput: T,
         printBtn: T,
         hide: T
      }

      export class PrintDlg implements lt.Demos.Dialogs.Dialog {

         private static _dpiDefault: number = 300;
         private static _dpiMax: number = 2100;
         private static _dpiMin: number = 1;

         private _title: string = null;
         private _pageCount: number;
         private _currentPageNumber: number;

         private _sizes: PrintPageSize[] = [
            // Normal Inches Sizes
            new PrintPageSize("Letter", 8.5, 11, PrintPageUnits.inches),
            new PrintPageSize("Legal", 8.5, 14, PrintPageUnits.inches),
            new PrintPageSize("Foolscap", 8, 13, PrintPageUnits.inches),
            new PrintPageSize("Tabloid", 11, 17, PrintPageUnits.inches),

            // A Page Sizes
            new PrintPageSize("A0", 841, 1189, PrintPageUnits.millimeters),
            new PrintPageSize("A1", 594, 841, PrintPageUnits.millimeters),
            new PrintPageSize("A2", 420, 594, PrintPageUnits.millimeters),
            new PrintPageSize("A3", 297, 420, PrintPageUnits.millimeters),
            new PrintPageSize("A4", 210, 297, PrintPageUnits.millimeters),

            // Arch Page Sizes
            new PrintPageSize("Arch A", 9, 12, PrintPageUnits.inches),
            new PrintPageSize("Arch B", 12, 18, PrintPageUnits.inches),
            new PrintPageSize("Arch C", 18, 24, PrintPageUnits.inches),
            new PrintPageSize("Arch D", 24, 36, PrintPageUnits.inches),
            new PrintPageSize("Arch E", 36, 48, PrintPageUnits.inches),
            new PrintPageSize("Arch E1", 30, 42, PrintPageUnits.inches),
            new PrintPageSize("Arch E2", 26, 38, PrintPageUnits.inches),
            new PrintPageSize("Arch E3", 27, 39, PrintPageUnits.inches),
         ];

         // Events 
         public onPrint: (options: lt.Document.Viewer.PrintDocumentOptions) => void;

         private _documentViewer: lt.Document.Viewer.DocumentViewer = null;

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: PrintDlgUI<string> = null;

         constructor() {
            var root = $("#dlgPrint");
            this.el = {
               pageRadioBtns: "#dlgPrint input[name=dlgPrint_PageOption]",
               messageContainer: "#dlgPrint_MessageContainer",
               currentPageLabel: "#dlgPrint_CurrentPageLabel",
               visiblePagesLabel: "#dlgPrint_VisiblePagesLabel",
               orientationSelectElement: "#dlgPrint_Orientation",
               orientationRotateCheckbox: "#dlgPrint_Orientation_AutoRotate",
               pageSizeSelectElement: "#dlgPrint_PageSize",
               pageSizeDocumentSize: "#dlgPrint_DocumentSize",
               dpiInput: "#dlgPrint_PageDpi",
               showAnnotationsContainer: "#dlgPrint_ShowAnnotationsContainer",
               showAnnotationsCheckbox: "#dlgPrint_ShowAnnotations",
               removeMarginsContainer: "#dlgPrint_RemoveMarginsContainer",
               removeMarginsCheckbox: "#dlgPrint_RemoveMargins",
               pagesTextInput: "#dlgPrint_Pages",
               printBtn: "#dlgPrint_Print",
               hide: "#dlgPrint .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            this.inner.onRootClick = this.onHide;
            $(this.el.hide).on("click", this.onHide);

            $(this.el.pagesTextInput).on("click", this.pagesTextInput_Click);
            $(this.el.printBtn).on("click", this.printBtn_Click);

            if (
               lt.LTHelper.browser === lt.LTBrowser.safari ||
               lt.LTHelper.browser === lt.LTBrowser.internetExplorer ||
               lt.LTHelper.browser === lt.LTBrowser.edge ||
               lt.LTHelper.OS === lt.LTOS.android
            ) {
               // RemoveMargins will have no effect/ unwanted effects in the above browsers, so let's just hide the option.
               $(this.el.removeMarginsContainer).empty().append($(document.createElement("p")).addClass("print-message").text("Your browser / device combination does not support options to remove margins."));
            }

            if (
               lt.LTHelper.browser === lt.LTBrowser.firefox
            ) {
               // Annotations will only print on the first page in Firefox (Firefox bug), so disable the option.
               $(this.el.showAnnotationsContainer).empty().append($(document.createElement("p")).addClass("print-message").text("Your browser / device combination does not support options to print annotations."));
            }

            if (
               lt.LTHelper.browser === lt.LTBrowser.firefox ||
               lt.LTHelper.browser === lt.LTBrowser.internetExplorer
            ) {
               // Firefox and IE will sometimes leave pages totally blank.
               var browser = lt.LTHelper.browser === lt.LTBrowser.firefox ? "Firefox" : "Internet Explorer";
               $(this.el.messageContainer).empty().append($(document.createElement("p")).addClass("print-message").text(browser + " is known to return some blank pages when printing a large selection."));
            }

            // Add all the page sizes
            var $select = $(this.el.pageSizeSelectElement);
            $select.append($(document.createElement("option")).text("Use size of first page").val("Use size of first page"));
            this._sizes.forEach((entry: PrintPageSize) => {
               var toString = entry.toString();
               var $option = $(document.createElement("option")).text(toString).val(toString);
               $select.append($option);
            });

            // Add the DPI
            var $dpi = $(this.el.dpiInput);
            $dpi.prop("placeholder", "Enter a number between " + PrintDlg._dpiMin + " and " + PrintDlg._dpiMax);
            $dpi.val(PrintDlg._dpiDefault.toString());
            // Prevent keys from causing the ImageViewer to move
            $dpi.on("keydown", (e: JQueryEventObject) => {
               e.stopPropagation();
            });

            // Listen for changes to the page selection radio
            var $pageOptions = $(this.el.pageRadioBtns);
            $pageOptions.first().prop("checked", true);
            // Prevent keys from causing the ImageViewer to move
            $pageOptions.on("keydown", (e: JQueryEventObject) => {
               e.stopPropagation();
            });
            $pageOptions.on("change", this.pagesRadio_Change);
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            $(this.el.pagesTextInput).off("click", this.pagesTextInput_Click);
            $(this.el.printBtn).off("click", this.printBtn_Click);

            this.pagesTextInput_Click = null;
            this.printBtn_Click = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private _firstPageSize: PrintPageSize = null;

         public show(documentViewer: lt.Document.Viewer.DocumentViewer): void {
            this._documentViewer = documentViewer;
            var doc = this._documentViewer.document;
            this._title = doc.name || null;
            this._pageCount = doc.pages.count;
            var currentPageNumber = documentViewer.currentPageNumber;
            this._currentPageNumber = currentPageNumber;

            $(this.el.currentPageLabel).text(" (Page " + currentPageNumber + ")");

            var visiblePagesMessage = "No pages visible";
            var indices = this.tryGetAllVisibleItemIndices(false);
            if (indices && indices.length)
               visiblePagesMessage = indices.length > 1 ? indices.length + " pages" : "1 page";
            $(this.el.visiblePagesLabel).text(" (" + visiblePagesMessage + ")");

            var page: lt.Document.DocumentPage = doc.pages.item(0);
            var pageSize: lt.LeadSizeD = page.size;
            var sizeInches: lt.LeadSizeD = lt.LeadSizeD.create(pageSize.width / lt.Document.LEADDocument.unitsPerInch, pageSize.height / lt.Document.LEADDocument.unitsPerInch);
            this._firstPageSize = new PrintPageSize("First Page", sizeInches.width, sizeInches.height, PrintPageUnits.inches);
            var sizeMm: lt.LeadSizeD = lt.LeadSizeD.create(sizeInches.width * 25.4, sizeInches.height * 25.4);
            var toFixed = 2;
            var pageSizeText = sizeInches.width.toFixed(toFixed) + " x " + sizeInches.height.toFixed(toFixed) + " in/ " + sizeMm.width.toFixed(toFixed) + " x " + sizeMm.height.toFixed(toFixed) + " mm";
            $(this.el.pageSizeDocumentSize).text(" " + pageSizeText);

            this.inner.show();
         }

         private pagesTextInput_Click = (e: JQueryEventObject) => {
            $(this.el.pageRadioBtns).prop("checked", false);
            $(this.el.pageRadioBtns + "[value=" + PageOption.Select + "]").prop("checked", true);
            this.updatePagesReadioState();
         }

         private pagesRadio_Change = (e: JQueryEventObject) => {
            this.updatePagesReadioState();
         }

         private updatePagesReadioState(): void {
            var pageOption: PageOption = parseInt($(this.el.pageRadioBtns).filter(':checked').val(), 10);
            var doPrintVisible = pageOption === PageOption.Visible;

            $(this.el.orientationSelectElement).prop("disabled", doPrintVisible);
            $(this.el.orientationRotateCheckbox).prop("disabled", doPrintVisible);
         }

         private tryGetAllVisibleItemIndices(alertIfFail: boolean): number[] {
            if (!this._documentViewer || !this._documentViewer.view) {
               if (alertIfFail)
                  alert("Error: cannot get visible pages.");
               return null;
            }
            var view = this._documentViewer.view;
            var viewer = view.imageViewer;
            if (!viewer || viewer.items.count < 1) {
               if (alertIfFail)
                  alert("Error: cannot get visible pages.");
               return null;
            }
            var allVisible = viewer.getAllVisibleItems(lt.Controls.ImageViewerItemPart.item);
            var indices = [];
            allVisible.forEach((item) => {
               indices.push(viewer.items.indexOf(item));
            });
            return indices;
         }

         private printBtn_Click = (e: JQueryEventObject) => {
            // Be aware that the pages list is by page index (0-based), not page number (1-based)!
            var options = new lt.Document.Viewer.PrintDocumentOptions();
            // Defaults
            options.useViewportLayout = false;
            options.viewportClip = lt.LeadRectD.empty;

            var pageOption: PageOption = parseInt($(this.el.pageRadioBtns).filter(':checked').val(), 10);
            if (pageOption !== PageOption.All) {
               if (pageOption === PageOption.Current) {
                  options.pagesList.push(this._currentPageNumber - 1);
               }
               else if (pageOption === PageOption.Visible) {
                  var indices = this.tryGetAllVisibleItemIndices(true);
                  if (!indices)
                     return;
                  options.pagesList = indices;
                  // We will clip to the visible screen area and make it a screenshot
                  options.useViewportLayout = true;
                  // We know at this point the imageViewer must exist
                  var size = this._documentViewer.view.imageViewer.controlSize;
                  options.viewportClip = lt.LeadRectD.create(0, 0, size.width, size.height);
               }
               else {
                  var input = $(this.el.pagesTextInput).val();
                  var result = lt.Demos.Utils.Validation.PageRange.validate({
                     input: input,
                     minPageNumber: 1,
                     maxPageNumber: this._pageCount
                  });

                  if (result.invalidError) {
                     alert("Please enter a valid list of page numbers between 1 and " + this._pageCount + ".\nNo letters are allowed. Use dashes for ranges and use commas to separate list items.\n" + result.invalidError);
                     return;
                  }
                  else if (result.outOfRangePages.length > 0) {
                     var first = result.outOfRangePages[0]
                     alert("Page '" + first + "' is out of range.\nPlease use page numbers between 1 and " + this._pageCount + ".");
                     return;
                  }

                  var pages = result.pages;
                  // Convert to indices
                  for (var i = 0; i < pages.length; i++) {
                     options.pagesList.push(pages[i] - 1);
                  }
               }
            }

            var dpi = parseInt($(this.el.dpiInput).val(), 10);
            if (isNaN(dpi)) {
               alert("Please use a valid DPI value.");
               return;
            }
            else if (dpi < PrintDlg._dpiMin || dpi > PrintDlg._dpiMax) {
               alert("The provided DPI value is outside of the acceptable range (" + PrintDlg._dpiMin + " to " + PrintDlg._dpiMax + ").");
               return;
            }
            options.dpi = dpi;

            // You can set a manual client rendering size (more pixels means more memory usage - recommended is 1000-4000).
            // Using "0" (default) will always force using DPI instead.
            //options.clientRenderSizePixels = 2000;
            options.title = this._title;
            options.orientation = parseInt($(this.el.orientationSelectElement).val());
            options.rotateToOrientation = $(this.el.orientationRotateCheckbox).is(":checked");
            var selectedIndex = parseInt($(this.el.pageSizeSelectElement).prop("selectedIndex"));
            var entry: PrintPageSize = null;
            if (selectedIndex === 0) {
               // Use the size of the first page
               entry = this._firstPageSize;
            }
            else {
               entry = this._sizes[selectedIndex - 1];
            }
            options.pageSize = entry.documentUnits;
            options.showAnnotations = $(this.el.showAnnotationsCheckbox).is(":checked");
            options.removeMargins = $(this.el.removeMarginsCheckbox).is(":checked");
            this.inner.hide();
            if (this.onPrint)
               this.onPrint(options);
         }
      }
   }
}