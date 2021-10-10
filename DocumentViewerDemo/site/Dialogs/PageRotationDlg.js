/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var PageRotation;
        (function (PageRotation) {
            var PageRangeType;
            (function (PageRangeType) {
                PageRangeType[PageRangeType["all"] = 0] = "all";
                PageRangeType[PageRangeType["current"] = 1] = "current";
                PageRangeType[PageRangeType["custom"] = 2] = "custom";
            })(PageRangeType || (PageRangeType = {}));
            var DirectionMode;
            (function (DirectionMode) {
                DirectionMode[DirectionMode["direction90Clockwise"] = 0] = "direction90Clockwise";
                DirectionMode[DirectionMode["direction90CounterClockwise"] = 1] = "direction90CounterClockwise";
                DirectionMode[DirectionMode["direction180"] = 2] = "direction180";
            })(DirectionMode = PageRotation.DirectionMode || (PageRotation.DirectionMode = {}));
            var EvenOddMode;
            (function (EvenOddMode) {
                EvenOddMode[EvenOddMode["all"] = 0] = "all";
                EvenOddMode[EvenOddMode["onlyEven"] = 1] = "onlyEven";
                EvenOddMode[EvenOddMode["onlyOdd"] = 2] = "onlyOdd";
            })(EvenOddMode = PageRotation.EvenOddMode || (PageRotation.EvenOddMode = {}));
            var OrientationMode;
            (function (OrientationMode) {
                OrientationMode[OrientationMode["all"] = 0] = "all";
                OrientationMode[OrientationMode["portraitOnly"] = 1] = "portraitOnly";
                OrientationMode[OrientationMode["landscapeOnly"] = 2] = "landscapeOnly";
            })(OrientationMode = PageRotation.OrientationMode || (PageRotation.OrientationMode = {}));
            var PageRotationDlg = /** @class */ (function () {
                function PageRotationDlg() {
                    var _this = this;
                    this.inner = null;
                    this.el = null;
                    this.onHide = function () {
                        _this.inner.hide();
                    };
                    this.rangeCustomPagesInput_Click = function (e) {
                        $(_this.el.range.radioGroup).prop("checked", false);
                        $(_this.el.range.radioGroup + "[value=" + PageRangeType.custom + "]").prop("checked", true);
                    };
                    this.apply_Click = function (e) {
                        var rangeType = parseInt($(_this.el.range.radioGroup).filter(":checked").val(), 10);
                        var args = {
                            pageNumbers: null,
                            direction: parseInt($(_this.el.directionSelect).prop("selectedIndex"), 10),
                            evenOddMode: parseInt($(_this.el.range.condition.evenOddSelect).prop("selectedIndex"), 10),
                            orientationMode: parseInt($(_this.el.range.condition.orientationSelect).prop("selectedIndex"), 10),
                        };
                        switch (rangeType) {
                            case PageRangeType.current:
                                args.pageNumbers = [_this._currentPageNumber];
                                break;
                            case PageRangeType.custom:
                                var input = $(_this.el.range.customPagesInput).val();
                                var result = lt.Demos.Utils.Validation.PageRange.validate({
                                    input: input,
                                    minPageNumber: 1,
                                    maxPageNumber: _this._pageCount
                                });
                                if (result.invalidError) {
                                    alert("Please enter a valid list of page numbers between 1 and " + _this._pageCount + ".\nNo letters are allowed. Use dashes for ranges and use commas to separate list items.\n" + result.invalidError);
                                    return;
                                }
                                else if (result.outOfRangePages.length > 0) {
                                    var first = result.outOfRangePages[0];
                                    alert("Page '" + first + "' is out of range.\nPlease use page numbers between 1 and " + _this._pageCount + ".");
                                    return;
                                }
                                args.pageNumbers = result.pages;
                                break;
                            case PageRangeType.all:
                            default:
                                // Leave it null
                                break;
                        }
                        _this.inner.hide();
                        if (_this.onApply)
                            _this.onApply(args);
                    };
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
                    directionAsText.forEach(function (text) {
                        directionSelect.append($(document.createElement("option")).text(text));
                    });
                    var evenOddAsText = [
                        "Even and odd pages",
                        "Only even pages",
                        "Only odd pages",
                    ];
                    var evenOddSelect = $(this.el.range.condition.evenOddSelect);
                    evenOddAsText.forEach(function (text) {
                        evenOddSelect.append($(document.createElement("option")).text(text));
                    });
                    var orientationAsText = [
                        "Pages of any orientation",
                        "Portrait pages only",
                        "Landscape pages only",
                    ];
                    var orientationSelect = $(this.el.range.condition.orientationSelect);
                    orientationAsText.forEach(function (text) {
                        orientationSelect.append($(document.createElement("option")).text(text));
                    });
                }
                PageRotationDlg.prototype.dispose = function () {
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
                };
                PageRotationDlg.prototype.show = function (currentPageNumber, pageCount) {
                    this._pageCount = pageCount;
                    this._currentPageNumber = currentPageNumber;
                    $(this.el.range.pageCount).text(this._pageCount.toString());
                    $(this.el.range.currentPage).text(this._currentPageNumber.toString());
                    this.inner.show();
                };
                return PageRotationDlg;
            }());
            PageRotation.PageRotationDlg = PageRotationDlg;
        })(PageRotation = Dialogs.PageRotation || (Dialogs.PageRotation = {}));
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
