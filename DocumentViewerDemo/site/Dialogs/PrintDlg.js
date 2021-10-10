/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var PageOption;
        (function (PageOption) {
            PageOption[PageOption["All"] = 0] = "All";
            PageOption[PageOption["Current"] = 1] = "Current";
            PageOption[PageOption["Select"] = 2] = "Select";
            PageOption[PageOption["Visible"] = 3] = "Visible";
        })(PageOption || (PageOption = {}));
        var PrintPageUnits;
        (function (PrintPageUnits) {
            PrintPageUnits[PrintPageUnits["inches"] = 0] = "inches";
            PrintPageUnits[PrintPageUnits["millimeters"] = 1] = "millimeters";
        })(PrintPageUnits || (PrintPageUnits = {}));
        var PrintPageSize = /** @class */ (function () {
            function PrintPageSize(name, width, height, unit) {
                var unitsPerInch = lt.Document.LEADDocument.unitsPerInch;
                this._name = name;
                this._size = lt.LeadSizeD.create(width, height);
                this._units = unit;
                if (this._units === PrintPageUnits.inches) {
                    this._documentUnits = lt.LeadSizeD.create(this._size.width * unitsPerInch, this._size.height * unitsPerInch);
                }
                else {
                    this._documentUnits = lt.LeadSizeD.create(this._size.width / 25.4 * unitsPerInch, this._size.height / 25.4 * unitsPerInch);
                }
            }
            Object.defineProperty(PrintPageSize.prototype, "name", {
                get: function () { return this._name; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PrintPageSize.prototype, "size", {
                get: function () { return this._size; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PrintPageSize.prototype, "units", {
                get: function () { return this._units; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PrintPageSize.prototype, "documentUnits", {
                get: function () { return this._documentUnits; },
                enumerable: false,
                configurable: true
            });
            PrintPageSize.prototype.toString = function () {
                var unit = this._units === PrintPageUnits.inches ? "in" : "mm";
                return this._name + " (" + this._size.width + " x " + this._size.height + " " + unit + ")";
            };
            return PrintPageSize;
        }());
        var PrintDlg = /** @class */ (function () {
            function PrintDlg() {
                var _this = this;
                this._title = null;
                this._sizes = [
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
                this._documentViewer = null;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this._firstPageSize = null;
                this.pagesTextInput_Click = function (e) {
                    $(_this.el.pageRadioBtns).prop("checked", false);
                    $(_this.el.pageRadioBtns + "[value=" + PageOption.Select + "]").prop("checked", true);
                    _this.updatePagesReadioState();
                };
                this.pagesRadio_Change = function (e) {
                    _this.updatePagesReadioState();
                };
                this.printBtn_Click = function (e) {
                    // Be aware that the pages list is by page index (0-based), not page number (1-based)!
                    var options = new lt.Document.Viewer.PrintDocumentOptions();
                    // Defaults
                    options.useViewportLayout = false;
                    options.viewportClip = lt.LeadRectD.empty;
                    var pageOption = parseInt($(_this.el.pageRadioBtns).filter(':checked').val(), 10);
                    if (pageOption !== PageOption.All) {
                        if (pageOption === PageOption.Current) {
                            options.pagesList.push(_this._currentPageNumber - 1);
                        }
                        else if (pageOption === PageOption.Visible) {
                            var indices = _this.tryGetAllVisibleItemIndices(true);
                            if (!indices)
                                return;
                            options.pagesList = indices;
                            // We will clip to the visible screen area and make it a screenshot
                            options.useViewportLayout = true;
                            // We know at this point the imageViewer must exist
                            var size = _this._documentViewer.view.imageViewer.controlSize;
                            options.viewportClip = lt.LeadRectD.create(0, 0, size.width, size.height);
                        }
                        else {
                            var input = $(_this.el.pagesTextInput).val();
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
                            var pages = result.pages;
                            // Convert to indices
                            for (var i = 0; i < pages.length; i++) {
                                options.pagesList.push(pages[i] - 1);
                            }
                        }
                    }
                    var dpi = parseInt($(_this.el.dpiInput).val(), 10);
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
                    options.title = _this._title;
                    options.orientation = parseInt($(_this.el.orientationSelectElement).val());
                    options.rotateToOrientation = $(_this.el.orientationRotateCheckbox).is(":checked");
                    var selectedIndex = parseInt($(_this.el.pageSizeSelectElement).prop("selectedIndex"));
                    var entry = null;
                    if (selectedIndex === 0) {
                        // Use the size of the first page
                        entry = _this._firstPageSize;
                    }
                    else {
                        entry = _this._sizes[selectedIndex - 1];
                    }
                    options.pageSize = entry.documentUnits;
                    options.showAnnotations = $(_this.el.showAnnotationsCheckbox).is(":checked");
                    options.removeMargins = $(_this.el.removeMarginsCheckbox).is(":checked");
                    _this.inner.hide();
                    if (_this.onPrint)
                        _this.onPrint(options);
                };
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
                if (lt.LTHelper.browser === lt.LTBrowser.safari ||
                    lt.LTHelper.browser === lt.LTBrowser.internetExplorer ||
                    lt.LTHelper.browser === lt.LTBrowser.edge ||
                    lt.LTHelper.OS === lt.LTOS.android) {
                    // RemoveMargins will have no effect/ unwanted effects in the above browsers, so let's just hide the option.
                    $(this.el.removeMarginsContainer).empty().append($(document.createElement("p")).addClass("print-message").text("Your browser / device combination does not support options to remove margins."));
                }
                if (lt.LTHelper.browser === lt.LTBrowser.firefox) {
                    // Annotations will only print on the first page in Firefox (Firefox bug), so disable the option.
                    $(this.el.showAnnotationsContainer).empty().append($(document.createElement("p")).addClass("print-message").text("Your browser / device combination does not support options to print annotations."));
                }
                if (lt.LTHelper.browser === lt.LTBrowser.firefox ||
                    lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                    // Firefox and IE will sometimes leave pages totally blank.
                    var browser = lt.LTHelper.browser === lt.LTBrowser.firefox ? "Firefox" : "Internet Explorer";
                    $(this.el.messageContainer).empty().append($(document.createElement("p")).addClass("print-message").text(browser + " is known to return some blank pages when printing a large selection."));
                }
                // Add all the page sizes
                var $select = $(this.el.pageSizeSelectElement);
                $select.append($(document.createElement("option")).text("Use size of first page").val("Use size of first page"));
                this._sizes.forEach(function (entry) {
                    var toString = entry.toString();
                    var $option = $(document.createElement("option")).text(toString).val(toString);
                    $select.append($option);
                });
                // Add the DPI
                var $dpi = $(this.el.dpiInput);
                $dpi.prop("placeholder", "Enter a number between " + PrintDlg._dpiMin + " and " + PrintDlg._dpiMax);
                $dpi.val(PrintDlg._dpiDefault.toString());
                // Prevent keys from causing the ImageViewer to move
                $dpi.on("keydown", function (e) {
                    e.stopPropagation();
                });
                // Listen for changes to the page selection radio
                var $pageOptions = $(this.el.pageRadioBtns);
                $pageOptions.first().prop("checked", true);
                // Prevent keys from causing the ImageViewer to move
                $pageOptions.on("keydown", function (e) {
                    e.stopPropagation();
                });
                $pageOptions.on("change", this.pagesRadio_Change);
            }
            PrintDlg.prototype.dispose = function () {
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
            };
            PrintDlg.prototype.show = function (documentViewer) {
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
                var page = doc.pages.item(0);
                var pageSize = page.size;
                var sizeInches = lt.LeadSizeD.create(pageSize.width / lt.Document.LEADDocument.unitsPerInch, pageSize.height / lt.Document.LEADDocument.unitsPerInch);
                this._firstPageSize = new PrintPageSize("First Page", sizeInches.width, sizeInches.height, PrintPageUnits.inches);
                var sizeMm = lt.LeadSizeD.create(sizeInches.width * 25.4, sizeInches.height * 25.4);
                var toFixed = 2;
                var pageSizeText = sizeInches.width.toFixed(toFixed) + " x " + sizeInches.height.toFixed(toFixed) + " in/ " + sizeMm.width.toFixed(toFixed) + " x " + sizeMm.height.toFixed(toFixed) + " mm";
                $(this.el.pageSizeDocumentSize).text(" " + pageSizeText);
                this.inner.show();
            };
            PrintDlg.prototype.updatePagesReadioState = function () {
                var pageOption = parseInt($(this.el.pageRadioBtns).filter(':checked').val(), 10);
                var doPrintVisible = pageOption === PageOption.Visible;
                $(this.el.orientationSelectElement).prop("disabled", doPrintVisible);
                $(this.el.orientationRotateCheckbox).prop("disabled", doPrintVisible);
            };
            PrintDlg.prototype.tryGetAllVisibleItemIndices = function (alertIfFail) {
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
                allVisible.forEach(function (item) {
                    indices.push(viewer.items.indexOf(item));
                });
                return indices;
            };
            PrintDlg._dpiDefault = 300;
            PrintDlg._dpiMax = 2100;
            PrintDlg._dpiMin = 1;
            return PrintDlg;
        }());
        Dialogs.PrintDlg = PrintDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
