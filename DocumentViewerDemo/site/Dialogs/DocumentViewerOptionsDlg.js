/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var DocumentViewerOptionsDlg = /** @class */ (function () {
            function DocumentViewerOptionsDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                // Track whether we have logged to the console that PDF Rendering is unavailable.
                this._hasGivenPDFRenderingWarning = false;
                this.loadDocumentTimeoutMilliseconds = 0;
                this.heartbeatEnabled = false;
                this.heartbeatStart = 0;
                this.heartbeatInterval = 0;
                this.heartbeatAutoPause = 0;
                this.usePDFRenderingCheckbox_Changed = function (e) {
                    // It must not be disabled at this point
                    // We update this ourselves now, so we don't need to when the OK button is clicked
                    _this._documentViewer.usePDFRendering = $(e.currentTarget).is(':checked') && lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported;
                    _this.initInputsValues(true);
                };
                this.usePDFTextCheckbox_Changed = function (e) {
                    // It must not be disabled at this point
                    // We update this ourselves now, so we don't need to when the OK button is clicked
                    _this._documentViewer.usePDFText = $(e.currentTarget).is(':checked') && lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported;
                    _this.initInputsValues(true);
                };
                this.usePDFThumbnailsInterpolationCheckbox_Changed = function (e) {
                    // It must not be disabled at this point
                    // We update this ourselves now, so we don't need to when the OK button is clicked
                    var use = $(e.currentTarget).is(':checked') && lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported;
                    if (_this._documentViewer.thumbnails) {
                        if (use) {
                            _this._documentViewer.thumbnails.pdfRenderingInterpolationMode = lt.Controls.InterpolationMode.resample;
                        }
                        else {
                            _this._documentViewer.thumbnails.pdfRenderingInterpolationMode = lt.Controls.InterpolationMode.none;
                        }
                    }
                };
                this.maximumPDFRenderingRasterPagePixelSizeTextInput_Changed = function (e) {
                    // Check for valid inputs from the user(integer number : must be 0 and up)
                    var value = parseInt($(e.currentTarget).val());
                    if (!(value >= 0)) {
                        $(e.currentTarget).val(_this._documentViewer.maximumPDFRenderingRasterPagePixelSize.toString());
                    }
                    else {
                        _this._documentViewer.maximumPDFRenderingRasterPagePixelSize = value;
                    }
                };
                this.documentLoadModeSelection_Changed = function (e) {
                    _this.loadDocumentMode = (parseInt($(e.currentTarget).val()));
                    _this.updateOptions(_this.loadDocumentMode);
                };
                this.loadDocumentTimeoutTextInput_Changed = function (e) {
                    // Check for valid inputs from the user(integer number : must be 0 and up)
                    var value = parseInt($(e.currentTarget).val());
                    if (!(value >= 0)) {
                        $(e.currentTarget).val(_this.loadDocumentTimeoutMilliseconds.toString());
                    }
                };
                this.viewNumberOfWorkersTextInput_Changed = function (e) {
                    // Check for valid inputs from the user(integer number : must be 1 and up)
                    var value = parseInt($(e.currentTarget).val());
                    if (!(value && value >= 1)) {
                        $(e.currentTarget).val(_this._documentViewer.view.workerCount.toString());
                    }
                };
                this.thumbnailsNumberOfWorkersTextInput_Changed = function (e) {
                    // Check for valid inputs from the user(integer number : must be 1 and up)
                    var value = parseInt($(e.currentTarget).val());
                    if (!(value && value >= 1)) {
                        $(e.currentTarget).val(_this._documentViewer.thumbnails.workerCount.toString());
                    }
                };
                this.pixelSizeTextInput_Changed = function (e) {
                    // Check for valid inputs from the user(integer number : must be 1 and up)
                    var value = parseInt($(e.currentTarget).val());
                    if (!(value && value >= 1 && value <= 4000)) {
                        $(e.currentTarget).val(_this._documentViewer.thumbnails.gridPixelSize.toString());
                    }
                };
                this.useGridsCheckbox_CheckedChanged = function (e) {
                    $(_this.el.thumbs.pixelSizeTextInput).prop("disabled", !($(e.currentTarget).is(':checked')));
                };
                this.heartbeatEnabledCheckbox_CheckedChanged = function (e) {
                    var isDisabled = !($(e.currentTarget).is(':checked'));
                    $(_this.el.heartbeat.start).prop("disabled", isDisabled);
                    $(_this.el.heartbeat.interval).prop("disabled", isDisabled);
                    $(_this.el.heartbeat.inactivity).prop("disabled", isDisabled);
                };
                this.apply_Click = function (e) {
                    _this.hookPrepareAjax = $(_this.el.hookPrepareAjax).is(':checked');
                    _this.useCSSTransitions = $(_this.el.view.useCSSTransitions).is(':checked');
                    _this.useSvgBackImage = $(_this.el.view.useSvgBackImage).is(':checked');
                    _this.verifyUploadedMimeTypes = $(_this.el.verifyUploadedMimeTypes).is(':checked');
                    _this.loadDocumentTimeoutMilliseconds = parseInt($(_this.el.timeouts.loadDocumentTimeoutTextInput).val(), 10);
                    _this._documentViewer.useAjaxImageLoading = $(_this.el.useAjaxImageLoading).is(':checked');
                    _this._documentViewer.view.workerCount = parseInt($(_this.el.view.numberOfWorkersTextInput).val(), 10);
                    _this._documentViewer.view.lazyLoad = $(_this.el.view.lazyLoadCheckbox).is(':checked');
                    if (_this._documentViewer.thumbnails) {
                        _this._documentViewer.thumbnails.workerCount = parseInt($(_this.el.thumbs.numberOfWorkersTextInput).val(), 10);
                        _this._documentViewer.thumbnails.lazyLoad = $(_this.el.thumbs.lazyLoadCheckbox).is(':checked');
                        _this._documentViewer.thumbnails.useGrids = $(_this.el.thumbs.useGridsCheckbox).is(':checked');
                        _this._documentViewer.thumbnails.gridPixelSize = parseInt($(_this.el.thumbs.pixelSizeTextInput).val(), 10);
                    }
                    _this.useStatusQueryRequests = $(_this.el.export.useStatusQueryRequestsCheckbox).is(':checked');
                    if (!HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                        _this.heartbeatEnabled = !$(_this.el.heartbeat.enabled).is(':disabled') && $(_this.el.heartbeat.enabled).is(':checked');
                        if (_this.heartbeatEnabled) {
                            var start = parseInt($(_this.el.heartbeat.start).val(), 10);
                            if (isNaN(start) || start < 1000) {
                                alert("Invalid value for Heartbeat Start Timeout.\nPlease provide a number larger than or equal to 1000.");
                                return;
                            }
                            var interval = parseInt($(_this.el.heartbeat.interval).val(), 10);
                            if (isNaN(interval) || interval < 5000) {
                                alert("Invalid value for Heartbeat Interval.\nPlease provide a number larger than or equal to 5000.");
                                return;
                            }
                            var inactivity = parseInt($(_this.el.heartbeat.inactivity).val(), 10);
                            if (isNaN(inactivity) || inactivity < 1000) {
                                alert("Invalid value for Heartbeat Inactivity Timeout.\nPlease provide a larger than or equal to 1000 and larger than the Heartbeat Start Timeout.");
                                return;
                            }
                            if (inactivity < start) {
                                alert("The Heartbeat Inactivity Timeout must be greater than the Heartbeat Start Timeout.");
                                return;
                            }
                            _this.heartbeatStart = start;
                            _this.heartbeatInterval = interval;
                            _this.heartbeatAutoPause = inactivity;
                        }
                    }
                    _this.inner.hide();
                    if (_this.onApply)
                        _this.onApply();
                };
                var root = $("#dlgOptions");
                this.el = {
                    hookPrepareAjax: "#dlgOptions_HookPrepareAjax",
                    useAjaxImageLoading: "#dlgOptions_UseAjaxImageLoading",
                    usePDFRenderingCheckbox: "#dlgOptions_UsePDFRendering",
                    usePDFTextCheckbox: "#dlgOptions_UsePDFText",
                    usePDFThumbnailsInterpolationCheckbox: "#dlgOptions_UsePDFThumbnailsInterpolation",
                    maximumPDFRenderingRasterPagePixelSizeTextInput: "#dlgOptions_MaximumPDFRenderingRasterPagePixelSizeTextInput",
                    verifyUploadedMimeTypes: "#dlgOptions_VerifyUploadedMimeTypes",
                    view: {
                        numberOfWorkersTextInput: "#dlgOptions_View_NumberOfWorkers",
                        lazyLoadCheckbox: "#dlgOptions_View_LazyLoad",
                        useCSSTransitions: "#dlgOptions_View_CSSTransitions",
                        useSvgBackImage: "#dlgOptions_View_UseSvgBackImage",
                    },
                    thumbs: {
                        numberOfWorkersTextInput: "#dlgOptions_Thumbs_NumberOfWorkers",
                        lazyLoadCheckbox: "#dlgOptions_Thumbs_LazyLoad",
                        useGridsCheckbox: "#dlgOptions_Thumbs_UseGrids",
                        pixelSizeTextInput: "#dlgOptions_Thumbs_PixelSize",
                    },
                    export: {
                        useStatusQueryRequestsCheckbox: "#dlgOptions_Export_UseStatus"
                    },
                    heartbeat: {
                        enabled: "#dlgOptions_Heartbeat_Enabled",
                        start: "#dlgOptions_Heartbeat_Start",
                        interval: "#dlgOptions_Heartbeat_Interval",
                        inactivity: "#dlgOptions_Heartbeat_AutoPause"
                    },
                    loadMode: {
                        documentLoadModeSelection: "#dlgOptions_LoadDocumentMode",
                        documentLoadModeDescription: "#dlgOptions_LoadDocumentModeDescription",
                    },
                    timeouts: {
                        loadDocumentTimeoutTextInput: "#dlgOptions_LoadDocumentTimeout",
                    },
                    applyBtn: "#dlgOptions_Apply",
                    hide: "#dlgOptions .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
                $(this.el.usePDFRenderingCheckbox).on("change", this.usePDFRenderingCheckbox_Changed);
                $(this.el.usePDFTextCheckbox).on("change", this.usePDFTextCheckbox_Changed);
                $(this.el.usePDFThumbnailsInterpolationCheckbox).on("change", this.usePDFThumbnailsInterpolationCheckbox_Changed);
                $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).on("change", this.maximumPDFRenderingRasterPagePixelSizeTextInput_Changed);
                $(this.el.view.numberOfWorkersTextInput).on("change", this.viewNumberOfWorkersTextInput_Changed);
                $(this.el.thumbs.numberOfWorkersTextInput).on("change", this.thumbnailsNumberOfWorkersTextInput_Changed);
                $(this.el.thumbs.pixelSizeTextInput).on("change", this.pixelSizeTextInput_Changed);
                $(this.el.thumbs.useGridsCheckbox).on("change", this.useGridsCheckbox_CheckedChanged);
                $(this.el.heartbeat.enabled).on("change", this.heartbeatEnabledCheckbox_CheckedChanged);
                $(this.el.loadMode.documentLoadModeSelection).on("change", this.documentLoadModeSelection_Changed);
                $(this.el.timeouts.loadDocumentTimeoutTextInput).on("change", this.loadDocumentTimeoutTextInput_Changed);
                $(this.el.applyBtn).on("click", this.apply_Click);
            }
            DocumentViewerOptionsDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                $(this.el.usePDFRenderingCheckbox).off("change", this.usePDFRenderingCheckbox_Changed);
                $(this.el.usePDFTextCheckbox).off("change", this.usePDFTextCheckbox_Changed);
                $(this.el.usePDFThumbnailsInterpolationCheckbox).off("change", this.usePDFThumbnailsInterpolationCheckbox_Changed);
                $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).off("change", this.maximumPDFRenderingRasterPagePixelSizeTextInput_Changed);
                $(this.el.loadMode.documentLoadModeSelection).off("change", this.documentLoadModeSelection_Changed);
                $(this.el.view.numberOfWorkersTextInput).off("change", this.viewNumberOfWorkersTextInput_Changed);
                $(this.el.thumbs.numberOfWorkersTextInput).off("change", this.thumbnailsNumberOfWorkersTextInput_Changed);
                $(this.el.thumbs.pixelSizeTextInput).off("change", this.pixelSizeTextInput_Changed);
                $(this.el.thumbs.useGridsCheckbox).off("change", this.useGridsCheckbox_CheckedChanged);
                $(this.el.timeouts.loadDocumentTimeoutTextInput).off("change", this.loadDocumentTimeoutTextInput_Changed);
                $(this.el.applyBtn).off("click", this.apply_Click);
                this.usePDFRenderingCheckbox_Changed = null;
                this.usePDFTextCheckbox_Changed = null;
                this.usePDFThumbnailsInterpolationCheckbox_Changed = null;
                this.maximumPDFRenderingRasterPagePixelSizeTextInput_Changed = null;
                this.documentLoadModeSelection_Changed = null;
                this.viewNumberOfWorkersTextInput_Changed = null;
                this.thumbnailsNumberOfWorkersTextInput_Changed = null;
                this.pixelSizeTextInput_Changed = null;
                this.useGridsCheckbox_CheckedChanged = null;
                this.loadDocumentTimeoutTextInput_Changed = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
            };
            Object.defineProperty(DocumentViewerOptionsDlg.prototype, "documentViewer", {
                set: function (value) {
                    this._documentViewer = value;
                    if (!this._hasGivenPDFRenderingWarning && !lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported) {
                        this._hasGivenPDFRenderingWarning = true;
                        // PDF Rendering is only supported on certain browsers and devices, and "shouldUsePDFRendering" checks for the presence of the global PDF Rendering object and the browser.
                        lt.LTHelper.logWarning("PDF Rendering is unavailable, and thus not selectable.");
                        $(this.el.usePDFRenderingCheckbox).prop("disabled", true);
                        $(this.el.usePDFTextCheckbox).prop("disabled", true);
                        $(this.el.usePDFThumbnailsInterpolationCheckbox).prop("disabled", true);
                        $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).prop("disabled", true);
                    }
                    // Initialize the inputs values from the viewer
                    this.initInputsValues(false);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DocumentViewerOptionsDlg.prototype, "hasUserToken", {
                set: function (value) {
                    if (value) {
                        $(this.el.useAjaxImageLoading).prop("disabled", true);
                    }
                    else {
                        $(this.el.useAjaxImageLoading).prop("disabled", false);
                    }
                },
                enumerable: false,
                configurable: true
            });
            // Run each time the PDF Rendering checkbox is set
            DocumentViewerOptionsDlg.prototype.initInputsValues = function (afterPDFRenderingChange) {
                var usePDFRendering = this._documentViewer.usePDFRendering;
                $(this.el.usePDFRenderingCheckbox).prop("checked", usePDFRendering);
                var usePDFText = this._documentViewer.usePDFText;
                $(this.el.usePDFTextCheckbox)
                    .prop("disabled", !usePDFRendering)
                    .prop("checked", usePDFText);
                var usePDFThumbnailsInterpolation = (this._documentViewer.thumbnails) && (this._documentViewer.thumbnails.pdfRenderingInterpolationMode !== lt.Controls.InterpolationMode.none);
                $(this.el.usePDFThumbnailsInterpolationCheckbox)
                    .prop("disabled", !usePDFRendering)
                    .prop("checked", usePDFThumbnailsInterpolation);
                $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput)
                    .prop("disabled", !usePDFRendering);
                if (!afterPDFRenderingChange) {
                    $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).val(this._documentViewer.maximumPDFRenderingRasterPagePixelSize.toString());
                }
                // Document Viewer
                if (!afterPDFRenderingChange) {
                    // Hook Prepare Ajax
                    $(this.el.hookPrepareAjax).prop("checked", this.hookPrepareAjax);
                }
                // Use Ajax Image Loading (off for pages when using PDF Rendering)
                $(this.el.useAjaxImageLoading).prop("checked", this._documentViewer.useAjaxImageLoading);
                $(this.el.verifyUploadedMimeTypes).prop("checked", this.verifyUploadedMimeTypes);
                // View
                // Number of Workers - (not used with PDF Rendering)
                $(this.el.view.numberOfWorkersTextInput).val(this._documentViewer.view.workerCount.toString());
                // Lazy Load - (not used with PDF Rendering)
                $(this.el.view.lazyLoadCheckbox).prop("checked", this._documentViewer.view.lazyLoad);
                // CSS Transitions
                if (!afterPDFRenderingChange) {
                    $(this.el.view.useCSSTransitions).prop("checked", this.useCSSTransitions);
                }
                $(this.el.view.useSvgBackImage).prop("checked", this.useSvgBackImage);
                // Thumbnails
                if (!this._documentViewer.thumbnails) {
                    // Disable and clear all thumbnails options
                    $(this.el.thumbs.numberOfWorkersTextInput).prop("disabled", true).val("");
                    $(this.el.thumbs.lazyLoadCheckbox).prop("disabled", true).prop("checked", false);
                    $(this.el.thumbs.useGridsCheckbox).prop("disabled", true).prop("checked", false);
                    $(this.el.thumbs.pixelSizeTextInput).prop("disabled", true).val("");
                }
                else {
                    // Enable all thumbnails options, and set the values from the viewer
                    // Number of Workers - (not used with PDF Rendering)
                    $(this.el.thumbs.numberOfWorkersTextInput).val(this._documentViewer.thumbnails.workerCount.toString());
                    // Lazy Load - (not used with PDF Rendering)
                    $(this.el.thumbs.lazyLoadCheckbox).prop("checked", this._documentViewer.thumbnails.lazyLoad);
                    // Use Grids - (not used with PDF Rendering)
                    $(this.el.thumbs.useGridsCheckbox).prop("checked", this._documentViewer.thumbnails.useGrids);
                    // Pixel Size - (not used with PDF Rendering)
                    $(this.el.thumbs.pixelSizeTextInput)
                        .prop("disabled", !this._documentViewer.thumbnails.useGrids)
                        .val(this._documentViewer.thumbnails.gridPixelSize.toString());
                }
                // Load document mode
                $(this.el.loadMode.documentLoadModeSelection).prop("selectedIndex", (this.loadDocumentMode));
                this.updateOptions(this.loadDocumentMode);
                // Timeouts
                $(this.el.timeouts.loadDocumentTimeoutTextInput).val(this.loadDocumentTimeoutMilliseconds.toString());
                // Heartbeat
                if (!HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    $(this.el.heartbeat.enabled).prop("checked", this.heartbeatEnabled);
                    $(this.el.heartbeat.start).prop("disabled", !this.heartbeatEnabled).val(this.heartbeatStart.toString());
                    $(this.el.heartbeat.interval).prop("disabled", !this.heartbeatEnabled).val(this.heartbeatInterval.toString());
                    $(this.el.heartbeat.inactivity).prop("disabled", !this.heartbeatEnabled).val(this.heartbeatAutoPause.toString());
                }
                $(this.el.export.useStatusQueryRequestsCheckbox).prop("checked", this.useStatusQueryRequests);
            };
            DocumentViewerOptionsDlg.prototype.show = function () {
                this.inner.show();
            };
            DocumentViewerOptionsDlg.prototype.updateOptions = function (loadMode) {
                var disableHeartbeat = false;
                if (loadMode != lt.Document.DocumentLoadMode.service) {
                    disableHeartbeat = true;
                    if (lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported) {
                        $(this.el.usePDFRenderingCheckbox).prop("disabled", true).prop("checked", true);
                        $(this.el.usePDFTextCheckbox).prop("disabled", true).prop("checked", true);
                        $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).prop("disabled", loadMode != lt.Document.DocumentLoadMode.localThenService);
                        this._documentViewer.usePDFRendering = true;
                        this._documentViewer.usePDFText = true;
                    }
                }
                else {
                    $(this.el.usePDFRenderingCheckbox).prop("disabled", !lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported);
                    $(this.el.usePDFTextCheckbox).prop("disabled", !lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported);
                    $(this.el.usePDFThumbnailsInterpolationCheckbox).prop("disabled", !lt.Document.Viewer.DocumentViewer.isPDFRenderingSupported);
                    $(this.el.maximumPDFRenderingRasterPagePixelSizeTextInput).prop("disabled", $(this.el.usePDFRenderingCheckbox).prop("disabled") || !$(this.el.usePDFRenderingCheckbox).prop("checked"));
                }
                $(this.el.loadMode.documentLoadModeDescription).text($(this.el.loadMode.documentLoadModeSelection).children("option:selected").attr("description"));
                $(this.el.heartbeat.enabled).prop("disabled", disableHeartbeat);
            };
            return DocumentViewerOptionsDlg;
        }());
        Dialogs.DocumentViewerOptionsDlg = DocumentViewerOptionsDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
