/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var ProcessingPagesDlg = /** @class */ (function () {
            function ProcessingPagesDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this._isCanceled = true;
                    _this.inner.hide();
                };
                this.tableSchema = null;
                this.tableBody = null;
                this.dataPerPage = null;
                this._isCanceled = false;
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
            ProcessingPagesDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            ProcessingPagesDlg.prototype.show = function (process, pages, headings, onceStarted) {
                var _this = this;
                this._isCanceled = false;
                this.dataPerPage = [];
                $(this.el.summaryElement).empty();
                $(this.el.loadingElement).show();
                $(this.el.nameElements).text(process);
                $(this.el.pagesElements).text(pages);
                $(this.el.cancelElement).prop("disabled", false);
                $(this.el.cancelElement).click(function () {
                    _this._isCanceled = true;
                    _this.updateStatus(process + " canceled.");
                    _this.finishProcessing();
                });
                $(this.el.resultsElement).empty();
                this.buildTable(headings);
                this.inner.show(onceStarted);
            };
            ProcessingPagesDlg.prototype.finishProcessing = function () {
                $(this.el.cancelElement).prop("disabled", true);
                $(this.el.loadingElement).hide();
            };
            ProcessingPagesDlg.prototype.updateStatus = function (statusMessage) {
                $(this.el.statusElement).text(statusMessage);
            };
            ProcessingPagesDlg.prototype.buildTable = function (headings) {
                // Create table and headings
                var table = document.createElement("table");
                lt.LTHelper.addClass(table, "table");
                var tableHead = document.createElement("thead");
                var tableHeadRow = document.createElement("tr");
                headings.forEach(function (heading) {
                    var tableHeading = document.createElement("th");
                    tableHeading.innerHTML = heading;
                    tableHeadRow.appendChild(tableHeading);
                });
                tableHead.appendChild(tableHeadRow);
                table.appendChild(tableHead);
                // create body
                this.tableBody = document.createElement("tbody");
                table.appendChild(this.tableBody);
                $(this.el.resultsElement).append(table);
            };
            // sent as an array because object properties are iterated in arbitrary order.
            ProcessingPagesDlg.prototype.addData = function (pageNumber, data) {
                var tableRow = document.createElement("tr");
                data = [pageNumber.toString()].concat(data);
                data.forEach(function (value, index) {
                    var tableDefinition = document.createElement("td");
                    if (index == 0) {
                        tableDefinition.id = "firstOfPage" + pageNumber;
                    }
                    tableDefinition.innerHTML = value;
                    tableRow.appendChild(tableDefinition);
                });
                this.tableBody.appendChild(tableRow);
                if (!this.dataPerPage[pageNumber])
                    this.dataPerPage[pageNumber] = 1;
                else
                    this.dataPerPage[pageNumber]++;
                this.updateSummary();
            };
            ProcessingPagesDlg.prototype.updateSummary = function () {
                var totals = [];
                this.dataPerPage.forEach(function (count, pageNumber) {
                    totals.push("page " + pageNumber + (count > 1 ? " (" + count + ")" : ""));
                });
                $(this.el.summaryElement).empty().text("Entries: " + totals.join(", "));
            };
            Object.defineProperty(ProcessingPagesDlg.prototype, "isCanceled", {
                get: function () {
                    return this._isCanceled;
                },
                enumerable: false,
                configurable: true
            });
            return ProcessingPagesDlg;
        }());
        Dialogs.ProcessingPagesDlg = ProcessingPagesDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
