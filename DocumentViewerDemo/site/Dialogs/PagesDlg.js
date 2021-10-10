/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var PagesDlg = /** @class */ (function () {
            function PagesDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.allPagesCheckbox_Click = function (e) {
                    $(_this.el.pageNumberInput).prop("disabled", $(_this.el.allPagesCheckbox).is(":checked"));
                };
                this.apply_Click = function (e) {
                    var pageNumber = -1;
                    var forAllPages = $(_this.el.allPagesCheckbox).is(":checked");
                    if (forAllPages) {
                        pageNumber = 0;
                    }
                    else {
                        var pageNumberInput = $(_this.el.pageNumberInput);
                        var pageNumber = parseInt(pageNumberInput.val(), 10);
                        // Do we have valid page number
                        if (pageNumber && pageNumber >= 1 && pageNumber <= _this._pageCount) {
                            pageNumber = pageNumber;
                        }
                        else {
                            alert("Please enter a valid page number between 1 and " + _this._pageCount + ".");
                            pageNumberInput.val(_this._currentPageNumber.toString());
                            return;
                        }
                    }
                    _this.inner.hide();
                    if (_this.onApply)
                        _this.onApply(pageNumber);
                };
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
            PagesDlg.prototype.dispose = function () {
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
            };
            PagesDlg.prototype.show = function (operation, pageCount, currentPageNumber) {
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
            };
            return PagesDlg;
        }());
        Dialogs.PagesDlg = PagesDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
