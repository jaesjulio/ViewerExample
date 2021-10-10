/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs.PageRotation {

      enum PageRangeType {
         all,
         current,
         custom
      }

      export enum DirectionMode {
         direction90Clockwise,
         direction90CounterClockwise,
         direction180
      }

      export enum EvenOddMode {
         all,
         onlyEven,
         onlyOdd
      }

      export enum OrientationMode {
         all,
         portraitOnly,
         landscapeOnly
      }

      export interface PageRotationArgs {
         direction: DirectionMode;
         pageNumbers: number[];
         evenOddMode: EvenOddMode;
         orientationMode: OrientationMode
      }

      interface PageRotationDlgUI<T> {
         directionSelect: T,
         range: {
            radioGroup: T,
            pageCount: T,
            currentPage: T,
            customPagesInput: T,
            condition: {
               evenOddSelect: T,
               orientationSelect: T
            }
         },
         applyBtn: T,
         hide: T
      }

      export class PageRotationDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: PageRotationDlgUI<string> = null;

         constructor() {
            var root = $("#dlgPageRotation");
            this.el = {
               directionSelect: "#dlgPageRotation_DirectionSelect",
               range: {
                  radioGroup: "#dlgPageRotation [name='dlgPageRotation_RangeOption']",
                  pageCount: "#dlgPageRotation_PageCount",
                  currentPage: "#dlgPageRotation_CurrentPage",
                  customPagesInput: "#dlgPageRotation_CustomRange",
                  condition: {
                     evenOddSelect: "#dlgPageRotation_Condition_EvenOddSelect",
                     orientationSelect: "#dlgPageRotation_Condition_OrientationSelect"
                  }
               },
               applyBtn: "#dlgPageRotation_Apply",
               hide: "#dlgPageRotation .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            this.inner.onRootClick = this.onHide;
            $(this.el.hide).on("click", this.onHide);

            $(this.el.applyBtn).on("click", this.apply_Click);
            $(this.el.range.customPagesInput).on("click", this.rangeCustomPagesInput_Click);

            var directionAsText = [
               "Clockwise, 90 degrees",
               "Counter-clockwise, 90 degrees",
               "180 degrees"
            ];
            var directionSelect = $(this.el.directionSelect);
            directionAsText.forEach((text) => {
               directionSelect.append($(document.createElement("option")).text(text));
            });

            var evenOddAsText = [
               "Even and odd pages",
               "Only even pages",
               "Only odd pages",
            ];
            var evenOddSelect = $(this.el.range.condition.evenOddSelect);
            evenOddAsText.forEach((text) => {
               evenOddSelect.append($(document.createElement("option")).text(text));
            });

            var orientationAsText = [
               "Pages of any orientation",
               "Portrait pages only",
               "Landscape pages only",
            ];
            var orientationSelect = $(this.el.range.condition.orientationSelect);
            orientationAsText.forEach((text) => {
               orientationSelect.append($(document.createElement("option")).text(text));
            });
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            $(this.el.applyBtn).on("click", this.apply_Click);
            $(this.el.range.customPagesInput).off("click", this.rangeCustomPagesInput_Click);

            this.apply_Click = null;
            this.rangeCustomPagesInput_Click = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private _pageCount: number;
         private _currentPageNumber: number;

         // Events 
         public onApply: (args: PageRotationArgs) => void;

         public show(currentPageNumber: number, pageCount: number): void {
            this._pageCount = pageCount;
            this._currentPageNumber = currentPageNumber;

            $(this.el.range.pageCount).text(this._pageCount.toString());
            $(this.el.range.currentPage).text(this._currentPageNumber.toString());

            this.inner.show();
         }

         private rangeCustomPagesInput_Click = (e: JQueryEventObject) => {
            $(this.el.range.radioGroup).prop("checked", false);
            $(this.el.range.radioGroup + "[value=" + PageRangeType.custom + "]").prop("checked", true);
         }

         private apply_Click = (e: JQueryEventObject) => {

            var rangeType: PageRangeType = parseInt($(this.el.range.radioGroup).filter(":checked").val(), 10);

            var args: PageRotationArgs = {
               pageNumbers: null,
               direction: parseInt($(this.el.directionSelect).prop("selectedIndex"), 10),
               evenOddMode: parseInt($(this.el.range.condition.evenOddSelect).prop("selectedIndex"), 10),
               orientationMode: parseInt($(this.el.range.condition.orientationSelect).prop("selectedIndex"), 10),
            }

            switch (rangeType) {

               case PageRangeType.current:
                  args.pageNumbers = [this._currentPageNumber];
                  break;
               case PageRangeType.custom:
                  var input = $(this.el.range.customPagesInput).val();
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
                  args.pageNumbers = result.pages;
                  break;

               case PageRangeType.all:
               default:
                  // Leave it null
                  break;
            }

            this.inner.hide();
            if (this.onApply)
               this.onApply(args);
         }
      }
   }
}