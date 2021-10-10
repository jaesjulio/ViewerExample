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
                var DocumentConverterDlg = /** @class */ (function () {
                    function DocumentConverterDlg() {
                        var _this = this;
                        this.inner = null;
                        this.el = null;
                        this.onHide = function () {
                            _this.inner.hide();
                        };
                        this._documentId = null;
                        this.mainConverterFormatsSelectElement_SelectedIndexChanged = function (e) {
                            var selectedOptionValue = $(e.currentTarget).val();
                            var isDocument = selectedOptionValue === "document";
                            lt.Demos.Utils.Visibility.toggle($(_this.el.documentTab.format.documentContainer), isDocument);
                            lt.Demos.Utils.Visibility.toggle($(_this.el.documentTab.format.rasterContainer), !isDocument);
                        };
                        this.documentFormatOptionsBtn_Click = function (e) {
                            var documentFormat = Converter.Formats.documentFormats[parseInt($(_this.el.documentTab.format.documentTypeSelect).val(), 10)];
                            _this._documentFormatOptionsDlg.show(_this._totalPages, documentFormat);
                        };
                        this.makeFirstBtn_Clicked = function (e) {
                            $(_this.el.documentTab.inputPages.startTextInput).val("1");
                        };
                        this.makeLastBtn_Clicked = function (e) {
                            $(_this.el.documentTab.inputPages.endTextInput).val(_this._totalPages.toString());
                        };
                        this.defaultsBtn_Click = function () {
                            var jobData = new lt.Document.DocumentConverterJobData();
                            jobData.jobName = "My Job";
                            $(_this.el.optionsTab.useSvgConversion).prop("checked", jobData.enableSvgConversion);
                            $(_this.el.optionsTab.svgImagesRecognitionModeSelectElement).prop("selectedIndex", jobData.svgImagesRecognitionMode);
                            $(_this.el.optionsTab.emptyPageModeSelectElement).prop("selectedIndex", jobData.emptyPageMode);
                            $(_this.el.optionsTab.jobErrorModeCheckbox).prop("checked", (jobData.jobErrorMode == lt.Document.DocumentConverterJobErrorMode.resume));
                            $(_this.el.optionsTab.pageNumberingTemplateTextInput).val(jobData.pageNumberingTemplate);
                            $(_this.el.optionsTab.jobNameTextInput).val(jobData.jobName);
                            $(_this.el.optionsTab.preprocessorDeskewCheckbox).prop("checked", jobData.preprocessorDeskew);
                            $(_this.el.optionsTab.preprocessorInvertCheckbox).prop("checked", jobData.preprocessorInvert);
                            $(_this.el.optionsTab.preprocessorOrientCheckbox).prop("checked", jobData.preprocessorOrient);
                        };
                        this.exportTab_Click = function (e) {
                            _this.updateExportButtons(false);
                        };
                        this.quickExportTab_Click = function (e) {
                            _this.updateExportButtons(true);
                            _this.updateQuickExportLink();
                        };
                        this.quickExportTab_IncludeCheckboxChanged = function (e) {
                            _this.updateQuickExportLink();
                        };
                        this.OkBtn_Click = function (e) {
                            var jobData = new lt.Document.DocumentConverterJobData();
                            _this.inner.hide();
                            var startPage = parseInt($(_this.el.documentTab.inputPages.startTextInput).val(), 10);
                            if (isNaN(startPage) || startPage < 1) {
                                alert("Please enter a valid starting page number.");
                                return;
                            }
                            var endPage = parseInt($(_this.el.documentTab.inputPages.endTextInput).val(), 10);
                            if (isNaN(endPage) || endPage > _this._totalPages) {
                                alert("Please enter a valid ending page number.");
                                return;
                            }
                            if (startPage > endPage) {
                                alert("Please enter valid page numbers for conversion.");
                                return;
                            }
                            jobData.inputDocumentFirstPageNumber = startPage;
                            jobData.inputDocumentLastPageNumber = endPage;
                            // Set the selected output format
                            var type = $(_this.el.documentTab.format.typeSelect).val();
                            if (type === "document") {
                                var documentFormatIndex = parseInt($(_this.el.documentTab.format.documentTypeSelect).val(), 10);
                                var documentFormat = Converter.Formats.documentFormats[documentFormatIndex];
                                jobData.documentFormat = documentFormat.format;
                                jobData.documentOptions = documentFormat.options;
                                jobData.rasterImageFormat = lt.Document.RasterImageFormat.unknown;
                            }
                            else if (type === "raster") {
                                var rasterFormatIndex = parseInt($(_this.el.documentTab.format.rasterTypeSelect).val(), 10);
                                var rasterFormat = Converter.Formats.rasterFormats[rasterFormatIndex];
                                jobData.rasterImageFormat = rasterFormat.format;
                                jobData.rasterImageBitsPerPixel = rasterFormat.bitsPerPixel;
                                jobData.documentFormat = lt.Document.Writer.DocumentFormat.user;
                            }
                            // Set the selected annotations mode
                            jobData.annotationsMode = parseInt($(_this.el.documentTab.annotationsSelect).val(), 10);
                            jobData.enableSvgConversion = $(_this.el.optionsTab.useSvgConversion).is(":checked");
                            jobData.svgImagesRecognitionMode = parseInt($(_this.el.optionsTab.svgImagesRecognitionModeSelectElement).val(), 10);
                            jobData.emptyPageMode = parseInt($(_this.el.optionsTab.emptyPageModeSelectElement).val(), 10);
                            jobData.jobErrorMode = $(_this.el.optionsTab.jobErrorModeCheckbox).is(":checked") ? lt.Document.DocumentConverterJobErrorMode.resume : lt.Document.DocumentConverterJobErrorMode.abort;
                            jobData.jobName = $(_this.el.optionsTab.jobNameTextInput).val();
                            jobData.pageNumberingTemplate = $(_this.el.optionsTab.pageNumberingTemplateTextInput).val();
                            jobData.preprocessorDeskew = $(_this.el.optionsTab.preprocessorDeskewCheckbox).is(":checked");
                            jobData.preprocessorInvert = $(_this.el.optionsTab.preprocessorInvertCheckbox).is(":checked");
                            jobData.preprocessorOrient = $(_this.el.optionsTab.preprocessorOrientCheckbox).is(":checked");
                            if (_this.onConvert)
                                _this.onConvert(jobData);
                        };
                        var root = $("#dlgConvert");
                        this.el = {
                            mobileInputGroupMakeSmall: "#dlgConvert .dlg-convert-mobile-sm",
                            tabButtons: {
                                document: "#dlgConvert_TabBtn_Document",
                                options: "#dlgConvert_TabBtn_Options",
                                quick: "#dlgConvert_TabBtn_Quick",
                            },
                            documentTab: {
                                inputPages: {
                                    startTextInput: "#dlgConvert_Input_Start",
                                    makeFirstBtn: "#dlgConvert_Input_MakeFirst",
                                    endTextInput: "#dlgConvert_Input_End",
                                    makeLastBtn: "#dlgConvert_Input_MakeLast"
                                },
                                format: {
                                    typeSelect: "#dlgConvert_Format_TypeSelect",
                                    documentContainer: "#dlgConvert_Format_DocumentContainer",
                                    documentTypeSelect: "#dlgConvert_Format_DocumentSelect",
                                    documentOptionsBtn: "#dlgConvert_Format_DocumentOptions",
                                    rasterContainer: "#dlgConvert_Format_RasterContainer",
                                    rasterTypeSelect: "#dlgConvert_Format_RasterSelect",
                                },
                                annotationsSelect: "#dlgConvert_AnnotationsSelect"
                            },
                            optionsTab: {
                                useSvgConversion: "#dlgConvert_Options_UseSvgConversion",
                                jobErrorModeCheckbox: "#dlgConvert_Options_JobErrorMode",
                                svgImagesRecognitionModeSelectElement: "#dlgConvert_Options_SvgImagesRecognitionMode",
                                emptyPageModeSelectElement: "#dlgConvert_Options_EmptyPageMode",
                                jobNameTextInput: "#dlgConvert_Options_JobName",
                                pageNumberingTemplateTextInput: "#dlgConvert_Options_PageNumberingTemplate",
                                preprocessorDeskewCheckbox: "#dlgConvert_Options_PreprocessorDeskew",
                                preprocessorInvertCheckbox: "#dlgConvert_Options_PreprocessorInvert",
                                preprocessorOrientCheckbox: "#dlgConvert_Options_PreprocessorOrient",
                                defaultsBtn: "#dlgConvert_Options_RevertToDefaults"
                            },
                            quickExportTab: {
                                id: "#dlgConvert_Quick_Id",
                                includeDocument: "#dlgConvert_Quick_IncludeDocument",
                                includeAnnotations: "#dlgConvert_Quick_IncludeAnnotations",
                            },
                            quickConvertBtn: "#dlgConvert_Quick_LinkBtn",
                            convertBtn: "#dlgConvert_Convert",
                            hide: "#dlgConvert .dlg-close"
                        };
                        this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                        $(this.el.hide).on("click", this.onHide);
                        // Add the document formats options to documentFormatsSelectElement
                        var documentFormats = Converter.Formats.documentFormats;
                        var documentFormatsSelect = $(this.el.documentTab.format.documentTypeSelect);
                        for (var i = 0; i < documentFormats.length; i++) {
                            // Add the option, set the value to the index
                            var docFormat = documentFormats[i];
                            documentFormatsSelect.append($(document.createElement("option")).val(i.toString()).text(docFormat.friendlyName + " (" + docFormat.extension.toUpperCase() + ")"));
                        }
                        // Add the raster formats options to rasterFormatsSelectElement
                        var rasterFormats = Converter.Formats.rasterFormats;
                        var rasterFormatsSelect = $(this.el.documentTab.format.rasterTypeSelect);
                        for (var i = 0; i < rasterFormats.length; i++) {
                            // Add the option, set the value to the index
                            var rasterFormat = rasterFormats[i];
                            rasterFormatsSelect.append($(document.createElement("option")).val(i.toString()).text(rasterFormat.friendlyName + " (" + rasterFormat.extension.toUpperCase() + ")"));
                        }
                        lt.Demos.Utils.Visibility.toggle($(this.el.documentTab.format.documentContainer), true);
                        lt.Demos.Utils.Visibility.toggle($(this.el.documentTab.format.rasterContainer), false);
                        if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                            $(this.el.mobileInputGroupMakeSmall).addClass("input-group-sm");
                            // Make this button a little smaller
                            $(this.el.documentTab.format.documentOptionsBtn).html("<strong>...</strong>");
                        }
                        // Init document format options dialog
                        this._documentFormatOptionsDlg = new Converter.Dialogs.DocumentFormatOptionsDlg();
                        $(this.el.documentTab.format.typeSelect).on("change", this.mainConverterFormatsSelectElement_SelectedIndexChanged);
                        $(this.el.documentTab.format.documentOptionsBtn).on("click", this.documentFormatOptionsBtn_Click);
                        $(this.el.documentTab.inputPages.makeFirstBtn).on("click", this.makeFirstBtn_Clicked);
                        $(this.el.documentTab.inputPages.makeLastBtn).on("click", this.makeLastBtn_Clicked);
                        $(this.el.optionsTab.defaultsBtn).on("click", this.defaultsBtn_Click);
                        $(this.el.convertBtn).on("click", this.OkBtn_Click);
                        // Quick Export setup
                        $(this.el.tabButtons.document).on("click", this.exportTab_Click);
                        $(this.el.tabButtons.options).on("click", this.exportTab_Click);
                        $(this.el.tabButtons.quick).on("click", this.quickExportTab_Click);
                        $(this.el.quickExportTab.includeDocument).on("change", this.quickExportTab_IncludeCheckboxChanged);
                        $(this.el.quickExportTab.includeAnnotations).on("change", this.quickExportTab_IncludeCheckboxChanged);
                        this.updateQuickExportLink();
                        this.updateExportButtons(undefined);
                        this.defaultsBtn_Click();
                    }
                    DocumentConverterDlg.prototype.dispose = function () {
                        $(this.el.hide).off("click", this.onHide);
                        this.onHide = null;
                        $(this.el.tabButtons.document).off("click", this.exportTab_Click);
                        $(this.el.tabButtons.options).off("click", this.exportTab_Click);
                        this.exportTab_Click = null;
                        $(this.el.tabButtons.quick).off("click", this.quickExportTab_Click);
                        this.quickExportTab_Click = null;
                        $(this.el.quickExportTab.includeDocument).off("change", this.quickExportTab_IncludeCheckboxChanged);
                        $(this.el.quickExportTab.includeAnnotations).off("change", this.quickExportTab_IncludeCheckboxChanged);
                        this.quickExportTab_IncludeCheckboxChanged = null;
                        this.inner.dispose();
                        this.inner = null;
                        this.el = null;
                    };
                    DocumentConverterDlg.prototype.show = function (doc) {
                        this._totalPages = doc.pages.count;
                        this._documentId = doc.documentId;
                        var total = this._totalPages.toString();
                        $(this.el.documentTab.inputPages.makeFirstBtn).text("Reset to 1");
                        $(this.el.documentTab.inputPages.makeLastBtn).text("Reset to " + total);
                        $(this.el.documentTab.inputPages.startTextInput).val("1");
                        $(this.el.documentTab.inputPages.endTextInput).val(total);
                        this.updateQuickExportLink();
                        this.inner.show();
                    };
                    DocumentConverterDlg.prototype.updateExportButtons = function (doQuickExport) {
                        doQuickExport = doQuickExport !== undefined ? doQuickExport : $(this.el.tabButtons.quick).parent().hasClass("active");
                        lt.Demos.Utils.Visibility.toggle($(this.el.convertBtn), !doQuickExport);
                        lt.Demos.Utils.Visibility.toggle($(this.el.quickConvertBtn), doQuickExport);
                    };
                    DocumentConverterDlg.prototype.updateQuickExportLink = function () {
                        var includeDocument = $(this.el.quickExportTab.includeDocument).is(":checked");
                        var includeAnnotations = $(this.el.quickExportTab.includeAnnotations).is(":checked");
                        var linkBtn = $(this.el.quickConvertBtn);
                        var documentId = this._documentId;
                        $(this.el.quickExportTab.id).text(documentId ? documentId : "Unknown");
                        var text = null;
                        var doDisable = true;
                        if (documentId && includeDocument) {
                            doDisable = false;
                            if (includeAnnotations)
                                text = "Download document and annotations";
                            else
                                text = "Download document";
                        }
                        else if (documentId && includeAnnotations) {
                            doDisable = false;
                            text = "Download annotations";
                        }
                        else {
                            doDisable = true;
                            text = "Please select files to include";
                        }
                        if (doDisable)
                            linkBtn.attr("disabled", "disabled");
                        else
                            linkBtn.removeAttr("disabled");
                        linkBtn.text(text);
                        linkBtn.attr("href", DocumentConverterDlg.createDownloadLink(documentId, includeDocument, includeAnnotations));
                    };
                    DocumentConverterDlg.createDownloadLink = function (documentId, includeDocument, includeAnnotations) {
                        if (!documentId || (!includeDocument && !includeAnnotations))
                            return "javascript:void(0);";
                        var endpoint = null;
                        var params = null;
                        if (includeDocument) {
                            endpoint = "DownloadDocument";
                            params = {
                                documentId: documentId,
                                includeAnnotations: includeAnnotations,
                            };
                        }
                        else {
                            endpoint = "DownloadAnnotations";
                            params = {
                                documentId: documentId,
                            };
                        }
                        params["userData"] = lt.Document.DocumentFactory.serviceUserData;
                        var downloadUrl = lt.Document.Service.Custom.createEndpointGetUrl("Factory", endpoint, params, true);
                        return downloadUrl;
                    };
                    return DocumentConverterDlg;
                }());
                Dialogs.DocumentConverterDlg = DocumentConverterDlg;
            })(Dialogs = Converter.Dialogs || (Converter.Dialogs = {}));
        })(Converter = DocumentViewerDemo.Converter || (DocumentViewerDemo.Converter = {}));
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
