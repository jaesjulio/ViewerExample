/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface PagesDlgUI<T> {
         title: T,
         description: T,
         pageCount: T,
         allPagesCheckbox: T,
         pageNumberInput: T,
         currentPage: T,
         applyBtn: T,
         hide: T
      }

      export class PagesDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: PagesDlgUI<string> = null;

         constructor() {
            var root = $("#dlgPages");
            this.el = {
               title: "#dlgPages_Title",
               description: "#dlgPages_Description",
               pageCount: "#dlgPages_PageCount",
               allPagesCheckbox: "#dlgPages_AllPages",
               pageNumberInput: "#dlgPages_PageNumberInput",
               currentPage: "#dlgPages_CurrentPage",
               applyBtn: "#dlgPages_Apply",
               hide: "#dlgPages .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            this.inner.onRootClick = this.onHide;
            $(this.el.hide).on("click", this.onHide);

            $(this.el.applyBtn).on("click", this.apply_Click);
            $(this.el.allPagesCheckbox).on("click", this.allPagesCheckbox_Click);
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            $(this.el.applyBtn).on("click", this.apply_Click);
            $(this.el.allPagesCheckbox).on("click", this.allPagesCheckbox_Click);

            this.apply_Click = null;
            this.allPagesCheckbox_Click = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private _pageCount: number;
         private _currentPageNumber: number;

         // Events 
         public onApply: (pageNumber: number) => void;

         public show(operation: string, pageCount: number, currentPageNumber: number): void {
            this._pageCount = pageCount;
            this._currentPageNumber = currentPageNumber;

            $(this.el.title).text(operation);
            $(this.el.description).text("Select the page number(s) for the " + operation + " operation.");

            $(this.el.pageCount).text(this._pageCount.toString());
            $(this.el.currentPage).text(this._currentPageNumber.toString());
            $(this.el.pageNumberInput).text(this._currentPageNumber.toString());

            $(this.el.allPagesCheckbox).prop("checked", false);
            $(this.el.pageNumberInput).prop("disabled", false);

            this.inner.show();
         }

         private allPagesCheckbox_Click = (e: JQueryEventObject) => {
            $(this.el.pageNumberInput).prop("disabled", $(this.el.allPagesCheckbox).is(":checked"));
         }

         private apply_Click = (e: JQueryEventObject) => {
            var pageNumber: number = -1;
            var forAllPages = $(this.el.allPagesCheckbox).is(":checked");

            if (forAllPages) {
               pageNumber = 0;
            } else {
               var pageNumberInput = $(this.el.pageNumberInput);
               var pageNumber = parseInt(pageNumberInput.val(), 10);
               // Do we have valid page number
               if (pageNumber && pageNumber >= 1 && pageNumber <= this._pageCount) {
                  pageNumber = pageNumber;
               } else {
                  alert("Please enter a valid page number between 1 and " + this._pageCount + ".");
                  pageNumberInput.val(this._currentPageNumber.toString());
                  return;
               }
            }

            this.inner.hide();
            if (this.onApply)
               this.onApply(pageNumber);
         }
      }
   }
}