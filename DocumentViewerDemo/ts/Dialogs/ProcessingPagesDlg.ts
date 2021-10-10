/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface ProcessingPagesDlgUI<T> {
         nameElements: T,
         pagesElements: T,
         cancelElement: T,
         resultsElement: T,
         statusElement: T,
         summaryElement: T,
         loadingElement: T,
         hide: T
      }

      export class ProcessingPagesDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: ProcessingPagesDlgUI<string> = null;

         constructor() {
            var root = $("#dlgProcessPages");
            this.el = {
               nameElements: "#dlgProcessPages .process-name",
               pagesElements: "#dlgProcessPages .process-pages",
               cancelElement: "#dlgProcessPages .process-cancel",
               resultsElement: "#dlgProcessPages .process-content",
               statusElement: "#dlgProcessPages .process-status",
               summaryElement: "#dlgProcessPages .process-summary",
               loadingElement: "#dlgProcessPages .process-loading",
               hide: "#dlgProcessPages .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            $(this.el.hide).on("click", this.onHide);
         }

         private onHide = () => {
            this._isCanceled = true;
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private tableSchema: { [key: string]: number } = null;
         private tableBody: HTMLElement = null;
         private dataPerPage: number[] = null;

         public show(process: string, pages: number, headings: string[], onceStarted: (didToggle: boolean) => void): void {
            this._isCanceled = false;
            this.dataPerPage = [];
            $(this.el.summaryElement).empty();
            $(this.el.loadingElement).show();
            $(this.el.nameElements).text(process);
            $(this.el.pagesElements).text(pages);
            $(this.el.cancelElement).prop("disabled", false);
            $(this.el.cancelElement).click(() => {
               this._isCanceled = true;
               this.updateStatus(process + " canceled.");
               this.finishProcessing();
            });
            $(this.el.resultsElement).empty();
            this.buildTable(headings);

            this.inner.show(onceStarted);
         }

         public finishProcessing() {
            $(this.el.cancelElement).prop("disabled", true);
            $(this.el.loadingElement).hide();
         }

         public updateStatus(statusMessage: string) {
            $(this.el.statusElement).text(statusMessage);
         }

         private buildTable(headings: string[]) {
            // Create table and headings
            var table: HTMLElement = document.createElement("table");
            lt.LTHelper.addClass(table, "table");
            var tableHead: HTMLElement = document.createElement("thead");
            var tableHeadRow: HTMLElement = document.createElement("tr");
            headings.forEach((heading: string) => {
               var tableHeading: HTMLElement = document.createElement("th");
               tableHeading.innerHTML = heading;
               tableHeadRow.appendChild(tableHeading);
            })
            tableHead.appendChild(tableHeadRow);
            table.appendChild(tableHead);

            // create body
            this.tableBody = document.createElement("tbody");
            table.appendChild(this.tableBody);

            $(this.el.resultsElement).append(table);
         }

         // sent as an array because object properties are iterated in arbitrary order.
         public addData(pageNumber: number, data: string[]) {
            var tableRow: HTMLElement = document.createElement("tr");
            data = [pageNumber.toString()].concat(data);
            data.forEach((value: string, index: number) => {
               var tableDefinition: HTMLElement = document.createElement("td");
               if (index == 0) {
                  tableDefinition.id = "firstOfPage" + pageNumber;
               }
               tableDefinition.innerHTML = value;
               tableRow.appendChild(tableDefinition);
            })
            this.tableBody.appendChild(tableRow);
            
            if (!this.dataPerPage[pageNumber])
               this.dataPerPage[pageNumber] = 1;
            else
               this.dataPerPage[pageNumber]++;
            this.updateSummary();
         }

         private updateSummary() {
            var totals: string[] = [];
            this.dataPerPage.forEach((count: number, pageNumber: number) => {
               totals.push("page " + pageNumber + (count > 1 ? " (" + count + ")" : ""));
            })
            $(this.el.summaryElement).empty().text("Entries: " + totals.join(", "));
         }

         private _isCanceled: boolean = false;
         public get isCanceled(): boolean {
            return this._isCanceled;
         }
      }
   }
}