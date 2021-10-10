/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        var Converter;
        (function (Converter) {
            var Dialogs;
            (function (Dialogs) {
                var AdvancedPdfOptionsDlg = /** @class */ (function () {
                    function AdvancedPdfOptionsDlg() {
                        var _this = this;
                        this.inner = null;
                        this.el = null;
                        this.onHide = function () {
                            _this.inner.hide();
                        };
                        this.ui_UpdateState = function () {
                            _this.updateUIState();
                        };
                        this.qualityFactorTextInput_Changed = function (e) {
                            var target = $(e.currentTarget);
                            var qualityFactor = parseInt(target.val(), 10);
                            // Check for valid integer number between [0 - 255]
                            if (isNaN(qualityFactor))
                                target.val(_this._pdfOptions.qualityFactor.toString());
                            else if (qualityFactor < 0)
                                target.val("0");
                            else if (qualityFactor > 255)
                                target.val("255");
                        };
                        this.initialPageNumberTextInput_Changed = function (e) {
                            var target = $(e.currentTarget);
                            var initialPageNumber = parseInt(target.val(), 10);
                            if (isNaN(initialPageNumber))
                                target.val(_this._pdfOptions.initialPageNumber.toString());
                            else if (initialPageNumber < 1)
                                target.val("1");
                            else if (initialPageNumber > _this._totalPages)
                                target.val(_this._totalPages.toString());
                        };
                        this.hideMenubarCheckbox_CheckedChanged = function (e) {
                            // Hide Window Controls and Hide Menubar doesn't work together even on Adobe Acrobat side, so we will uncheck the other one if one of them is checked
                            $(_this.el.initialView.hideWindowUICheckbox).prop("checked", false);
                        };
                        this.hideWindowUICheckbox_CheckedChanged = function (e) {
                            // Hide Window Controls and Hide Menubar doesn't work together even on Adobe Acrobat side, so we will uncheck the other one if one of them is checked
                            $(_this.el.initialView.hideMenubarCheckbox).prop("checked", false);
                        };
                        this.applyBtn_Click = function (e) {
                            var opts = _this._pdfOptions;
                            // Description options
                            opts.title = $(_this.el.description.titleTextInput).val();
                            opts.subject = $(_this.el.description.subjectTextInput).val();
                            opts.author = $(_this.el.description.authorTextInput).val();
                            opts.keywords = $(_this.el.description.keywordsTextInput).val();
                            // Font options
                            opts.fontEmbedMode = parseInt($(_this.el.font.fontEmbeddingSelect).val(), 10);
                            opts.linearized = $(_this.el.font.linearizedCheckbox).is(":checked");
                            // Security options
                            opts.isProtected = $(_this.el.security.protectedDocumentCheckbox).is(":checked");
                            opts.encryptionMode = parseInt($(_this.el.security.encryptionModeSelect).val(), 10);
                            opts.userPassword = $(_this.el.security.userPasswordTextInput).val();
                            opts.ownerPassword = $(_this.el.security.ownerPasswordTextInput).val();
                            opts.copyEnabled = $(_this.el.security.copyEnabledCheckbox).is(":checked");
                            opts.editEnabled = $(_this.el.security.editEnabledCheckbox).is(":checked");
                            opts.annotationsEnabled = $(_this.el.security.annotationsEnabledCheckbox).is(":checked");
                            opts.printEnabled = $(_this.el.security.printEnabledCheckbox).is(":checked");
                            opts.assemblyEnabled = $(_this.el.security.assemblyEnabledCheckbox).is(":checked");
                            opts.highQualityPrintEnabled = $(_this.el.security.highQualityPrintEnabledCheckbox).is(":checked");
                            // Compression options
                            opts.oneBitImageCompression = parseInt($(_this.el.compression.oneBitImageCompressionSelect).val(), 10);
                            opts.coloredImageCompression = parseInt($(_this.el.compression.coloredImageCompressionSelect).val(), 10);
                            opts.qualityFactor = parseInt($(_this.el.compression.qualityFactorTextInput).val(), 10);
                            opts.imageOverTextSize = parseInt($(_this.el.compression.imageOverTextSizeSelect).val(), 10);
                            opts.imageOverTextMode = parseInt($(_this.el.compression.imageOverTextModeSelect).val(), 10);
                            // Initial view options
                            opts.pageModeType = parseInt($(_this.el.initialView.documentPageModeTypeSelect).val(), 10);
                            opts.pageLayoutType = parseInt($(_this.el.initialView.documentPageLayoutTypeSelect).val(), 10);
                            var selectedPageFitVal = parseInt($(_this.el.initialView.documentPageFitTypeSelect).val(), 10);
                            if (selectedPageFitVal >= 0 && selectedPageFitVal <= 5) {
                                // Selected value is one of the original enum members, so just use it
                                opts.pageFitType = selectedPageFitVal;
                                opts.zoomPercent = 0;
                            }
                            else {
                                opts.zoomPercent = selectedPageFitVal;
                            }
                            opts.initialPageNumber = parseInt($(_this.el.initialView.initialPageNumberTextInput).val(), 10);
                            opts.fitWindow = $(_this.el.initialView.fitWindowCheckbox).is(":checked");
                            opts.centerWindow = $(_this.el.initialView.centerWindowCheckbox).is(":checked");
                            opts.displayDocTitle = ($(_this.el.initialView.displayDocTitleSelect).val() === "1") ? true : false;
                            opts.hideMenubar = $(_this.el.initialView.hideMenubarCheckbox).is(":checked");
                            opts.hideToolbar = $(_this.el.initialView.hideToolbarCheckbox).is(":checked");
                            opts.hideWindowUI = $(_this.el.initialView.hideWindowUICheckbox).is(":checked");
                            _this.inner.hide();
                        };
                        var root = $("#dlgAdvancedPDF");
                        this.el = {
                            tabs: "#dlgAdvancedPDF_Tabs",
                            description: {
                                titleTextInput: "#dlgAdvancedPDF_Desc_Title",
                                subjectTextInput: "#dlgAdvancedPDF_Desc_Subject",
                                authorTextInput: "#dlgAdvancedPDF_Desc_Author",
                                keywordsTextInput: "#dlgAdvancedPDF_Desc_Keywords"
                            },
                            font: {
                                fontEmbeddingSelect: "#dlgAdvancedPDF_Font_FontEmbedding",
                                linearizedCheckbox: "#dlgAdvancedPDF_Font_Linearized"
                            },
                            security: {
                                allInputs: "#dlgAdvancedPDF .dlg-advanced-pdf-security",
                                protectedDocumentCheckbox: "#dlgAdvancedPDF_Security_ProtectedDocument",
                                encryptionModeSelect: "#dlgAdvancedPDF_Security_EncryptionMode",
                                userPasswordTextInput: "#dlgAdvancedPDF_Security_UserPassword",
                                ownerPasswordTextInput: "#dlgAdvancedPDF_Security_OwnerPassword",
                                permissionsGroup: "#dlgAdvancedPDF .dlg-advanced-pdf-security-permissions",
                                copyEnabledCheckbox: "#dlgAdvancedPDF_Security_CopyEnabled",
                                editEnabledCheckbox: "#dlgAdvancedPDF_Security_EditEnabled",
                                annotationsEnabledCheckbox: "#dlgAdvancedPDF_Security_AnnotationsEnabled",
                                printEnabledCheckbox: "#dlgAdvancedPDF_Security_PrintEnabled",
                                assemblyEnabledCheckbox: "#dlgAdvancedPDF_Security_AssemblyEnabled",
                                highQualityPrintEnabledCheckbox: "#dlgAdvancedPDF_Security_HighQualityPrintEnabled"
                            },
                            compression: {
                                oneBitImageCompressionSelect: "#dlgAdvancedPDF_Compress_OneBitImageCompression",
                                coloredImageCompressionSelect: "#dlgAdvancedPDF_Compress_ColoredImageCompression",
                                qualityFactorTextInput: "#dlgAdvancedPDF_Compress_QualityFactor",
                                imageOverTextSizeSelect: "#dlgAdvancedPDF_Compress_ImageOverTextSize",
                                imageOverTextModeSelect: "#dlgAdvancedPDF_Compress_ImageOverTextMode",
                            },
                            initialView: {
                                documentPageModeTypeSelect: "#dlgAdvancedPDF_Init_DocumentPageModeType",
                                documentPageLayoutTypeSelect: "#dlgAdvancedPDF_Init_DocumentPageLayoutType",
                                documentPageFitTypeSelect: "#dlgAdvancedPDF_Init_DocumentPageFitType",
                                initialPageNumberTextInput: "#dlgAdvancedPDF_Init_InitialPageNumber",
                                totalPagesLabel: "#dlgAdvancedPDF_Init_TotalPages",
                                fitWindowCheckbox: "#dlgAdvancedPDF_Init_FitWindow",
                                centerWindowCheckbox: "#dlgAdvancedPDF_Init_CenterWindow",
                                displayDocTitleSelect: "#dlgAdvancedPDF_Init_DisplayDocTitle",
                                hideMenubarCheckbox: "#dlgAdvancedPDF_Init_HideMenubar",
                                hideToolbarCheckbox: "#dlgAdvancedPDF_Init_HideToolbar",
                                hideWindowUICheckbox: "#dlgAdvancedPDF_Init_HideWindowUI",
                            },
                            applyBtn: "#dlgAdvancedPDF_Apply",
                            hide: "#dlgAdvancedPDF .dlg-close"
                        };
                        this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                        // If mobile, use the stacked pills (so the tabs don't look so ugly as they wrap)
                        if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                            $(this.el.tabs).removeClass("nav-tabs").addClass("nav-pills nav-stacked");
                        }
                        $(this.el.hide).on("click", this.onHide);
                        $(this.el.applyBtn).on("click", this.applyBtn_Click);
                        $(this.el.security.protectedDocumentCheckbox).on("change", this.ui_UpdateState);
                        $(this.el.security.encryptionModeSelect).on("change", this.ui_UpdateState);
                        $(this.el.security.printEnabledCheckbox).on("change", this.ui_UpdateState);
                        $(this.el.security.editEnabledCheckbox).on("change", this.ui_UpdateState);
                        $(this.el.compression.coloredImageCompressionSelect).on("change", this.ui_UpdateState);
                        $(this.el.compression.qualityFactorTextInput).on("change", this.qualityFactorTextInput_Changed);
                        $(this.el.initialView.initialPageNumberTextInput).on("change", this.initialPageNumberTextInput_Changed);
                        $(this.el.initialView.hideMenubarCheckbox).on("change", this.hideMenubarCheckbox_CheckedChanged);
                        $(this.el.initialView.hideWindowUICheckbox).on("change", this.hideWindowUICheckbox_CheckedChanged);
                    }
                    AdvancedPdfOptionsDlg.prototype.dispose = function () {
                        $(this.el.hide).off("click", this.onHide);
                        this.onHide = null;
                        $(this.el.security.protectedDocumentCheckbox).off("change", this.ui_UpdateState);
                        $(this.el.security.encryptionModeSelect).off("change", this.ui_UpdateState);
                        $(this.el.security.printEnabledCheckbox).off("change", this.ui_UpdateState);
                        $(this.el.security.editEnabledCheckbox).off("change", this.ui_UpdateState);
                        $(this.el.compression.coloredImageCompressionSelect).off("change", this.ui_UpdateState);
                        $(this.el.compression.qualityFactorTextInput).off("change", this.qualityFactorTextInput_Changed);
                        $(this.el.initialView.initialPageNumberTextInput).off("change", this.initialPageNumberTextInput_Changed);
                        $(this.el.initialView.hideMenubarCheckbox).off("change", this.hideMenubarCheckbox_CheckedChanged);
                        $(this.el.initialView.hideWindowUICheckbox).off("change", this.hideWindowUICheckbox_CheckedChanged);
                        this.ui_UpdateState = null;
                        this.qualityFactorTextInput_Changed = null;
                        this.initialPageNumberTextInput_Changed = null;
                        this.hideWindowUICheckbox_CheckedChanged = null;
                        this.hideMenubarCheckbox_CheckedChanged = null;
                        this.inner.dispose();
                        this.inner = null;
                        this.el = null;
                    };
                    AdvancedPdfOptionsDlg.prototype.show = function (totalPages, pdfOptions, showLinearized) {
                        this._totalPages = totalPages;
                        this._pdfOptions = pdfOptions;
                        this.initInputsValues(showLinearized);
                        this.inner.show();
                    };
                    AdvancedPdfOptionsDlg.prototype.initInputsValues = function (showLinearized) {
                        var opts = this._pdfOptions;
                        // Description tab options
                        $(this.el.description.titleTextInput).val(opts.title);
                        $(this.el.description.subjectTextInput).val(opts.subject);
                        $(this.el.description.authorTextInput).val(opts.author);
                        $(this.el.description.keywordsTextInput).val(opts.keywords);
                        // Font tab options
                        $(this.el.font.fontEmbeddingSelect).prop("selectedIndex", opts.fontEmbedMode);
                        $(this.el.font.linearizedCheckbox).prop("checked", opts.linearized);
                        if (!showLinearized) {
                            $(this.el.font.linearizedCheckbox).hide();
                            $("label[for=" + $(this.el.font.linearizedCheckbox).attr("id") + "]").hide();
                        }
                        // Security tab options
                        $(this.el.security.protectedDocumentCheckbox).prop("checked", opts.isProtected);
                        $(this.el.security.encryptionModeSelect).prop("selectedIndex", opts.encryptionMode);
                        $(this.el.security.userPasswordTextInput).val(opts.userPassword);
                        $(this.el.security.ownerPasswordTextInput).val(opts.ownerPassword);
                        $(this.el.security.copyEnabledCheckbox).prop("checked", opts.copyEnabled);
                        $(this.el.security.editEnabledCheckbox).prop("checked", opts.editEnabled);
                        $(this.el.security.annotationsEnabledCheckbox).prop("checked", opts.annotationsEnabled);
                        $(this.el.security.printEnabledCheckbox).prop("checked", opts.printEnabled);
                        $(this.el.security.assemblyEnabledCheckbox).prop("checked", opts.assemblyEnabled);
                        $(this.el.security.highQualityPrintEnabledCheckbox).prop("checked", opts.highQualityPrintEnabled);
                        // Compression tab options
                        $(this.el.compression.oneBitImageCompressionSelect).prop("selectedIndex", opts.oneBitImageCompression);
                        $(this.el.compression.coloredImageCompressionSelect).prop("selectedIndex", opts.coloredImageCompression);
                        $(this.el.compression.qualityFactorTextInput).val(opts.qualityFactor.toString());
                        $(this.el.compression.imageOverTextSizeSelect).prop("selectedIndex", opts.imageOverTextSize);
                        $(this.el.compression.imageOverTextModeSelect).prop("selectedIndex", opts.imageOverTextMode);
                        // Initial view tab options
                        $(this.el.initialView.documentPageModeTypeSelect).prop("selectedIndex", opts.pageModeType);
                        $(this.el.initialView.documentPageLayoutTypeSelect).prop("selectedIndex", opts.pageLayoutType);
                        $(this.el.initialView.documentPageFitTypeSelect).prop("selectedIndex", opts.zoomPercent === 0 ? opts.pageFitType : opts.zoomPercent);
                        $(this.el.initialView.initialPageNumberTextInput).val(opts.initialPageNumber.toString());
                        $(this.el.initialView.totalPagesLabel).text("of " + this._totalPages.toString());
                        $(this.el.initialView.fitWindowCheckbox).prop("checked", opts.fitWindow);
                        $(this.el.initialView.centerWindowCheckbox).prop("checked", opts.centerWindow);
                        $(this.el.initialView.displayDocTitleSelect).prop("selectedIndex", (opts.displayDocTitle) ? 1 : 0);
                        $(this.el.initialView.hideMenubarCheckbox).prop("checked", opts.hideMenubar);
                        $(this.el.initialView.hideToolbarCheckbox).prop("checked", opts.hideToolbar);
                        $(this.el.initialView.hideWindowUICheckbox).prop("checked", opts.hideWindowUI);
                        this.updateUIState();
                    };
                    AdvancedPdfOptionsDlg.prototype.updateUIState = function () {
                        if (this._pdfOptions.documentType === lt.Document.Writer.PdfDocumentType.pdfA) {
                            // Disable the font embedding option
                            $(this.el.font.fontEmbeddingSelect).prop("disabled", true);
                            // Disable the all security options
                            $(this.el.security.allInputs).prop("disabled", true);
                        }
                        else {
                            $(this.el.font.fontEmbeddingSelect).prop("disabled", false);
                            $(this.el.security.allInputs).prop("disabled", false);
                            var protectedDocument = $(this.el.security.protectedDocumentCheckbox).is(":checked");
                            // Disable encryption mode, passwords, and the permissions options if not a protected document
                            $(this.el.security.encryptionModeSelect).prop("disabled", !protectedDocument);
                            $(this.el.security.userPasswordTextInput).prop("disabled", !protectedDocument);
                            $(this.el.security.ownerPasswordTextInput).prop("disabled", !protectedDocument);
                            $(this.el.security.permissionsGroup).prop("disabled", !protectedDocument);
                            if (protectedDocument && $(this.el.security.encryptionModeSelect).val() != null) {
                                var encryptionMode = parseInt($(this.el.security.encryptionModeSelect).val(), 10);
                                var encryptionIsRc128 = encryptionMode === lt.Document.Writer.PdfDocumentEncryptionMode.rc128Bit;
                                var enabledAssemblyEnabledCheckbox = encryptionIsRc128 && !($(this.el.security.editEnabledCheckbox).is(":checked"));
                                $(this.el.security.assemblyEnabledCheckbox).prop("disabled", !enabledAssemblyEnabledCheckbox);
                                var enabledHighQualityPrintEnabledCheckbox = encryptionIsRc128 && ($(this.el.security.printEnabledCheckbox).is(":checked"));
                                $(this.el.security.highQualityPrintEnabledCheckbox).prop("disabled", !enabledHighQualityPrintEnabledCheckbox);
                            }
                        }
                        // Disable the image over text options if not image over text
                        $(this.el.compression.imageOverTextSizeSelect).prop("disabled", !this._pdfOptions.imageOverText);
                        $(this.el.compression.imageOverTextModeSelect).prop("disabled", !this._pdfOptions.imageOverText);
                        var CompressionType = lt.Document.Writer.ColoredImageCompressionType;
                        var val = parseInt($(this.el.compression.coloredImageCompressionSelect).val(), 10);
                        var disableQualityFactor = false;
                        if (!isNaN(val)) {
                            switch (val) {
                                case CompressionType.flateJpeg:
                                case CompressionType.lzwJpeg:
                                case CompressionType.jpeg:
                                case CompressionType.flateJpx:
                                case CompressionType.lzwJpx:
                                case CompressionType.jpx:
                                    disableQualityFactor = false;
                                    break;
                                default:
                                    disableQualityFactor = true;
                                    break;
                            }
                        }
                        $(this.el.compression.qualityFactorTextInput).prop("disabled", disableQualityFactor);
                    };
                    return AdvancedPdfOptionsDlg;
                }());
                Dialogs.AdvancedPdfOptionsDlg = AdvancedPdfOptionsDlg;
            })(Dialogs = Converter.Dialogs || (Converter.Dialogs = {}));
        })(Converter = DocumentViewerDemo.Converter || (DocumentViewerDemo.Converter = {}));
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
