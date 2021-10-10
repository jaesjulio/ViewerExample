var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var FileUrlLoadOption;
        (function (FileUrlLoadOption) {
            FileUrlLoadOption[FileUrlLoadOption["sample"] = 0] = "sample";
            FileUrlLoadOption[FileUrlLoadOption["url"] = 1] = "url";
        })(FileUrlLoadOption || (FileUrlLoadOption = {}));
        // Custom event args for the UploadDocumentDlg load event
        var UploadDocumentEventArgs = /** @class */ (function () {
            function UploadDocumentEventArgs() {
                this.annotationsLoadOption = HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.none;
            }
            return UploadDocumentEventArgs;
        }());
        Dialogs.UploadDocumentEventArgs = UploadDocumentEventArgs;
        // Custom event args for the OpenDocumentFromUrlDlg load event
        var OpenDocumentFromUrlEventArgs = /** @class */ (function () {
            function OpenDocumentFromUrlEventArgs() {
                this.fileUrl = "";
                this.annotationsLoadOption = HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.none;
                this.annotationsUrl = "";
            }
            return OpenDocumentFromUrlEventArgs;
        }());
        Dialogs.OpenDocumentFromUrlEventArgs = OpenDocumentFromUrlEventArgs;
        // Custom event args for the OpenDocumentFromUrlDlg load event
        var OpenFromDocumentStorageEventArgs = /** @class */ (function () {
            function OpenFromDocumentStorageEventArgs() {
                this.annotationsLoadOption = HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.none;
            }
            return OpenFromDocumentStorageEventArgs;
        }());
        Dialogs.OpenFromDocumentStorageEventArgs = OpenFromDocumentStorageEventArgs;
        //Custom event args for the LoadDocumentPageRangeDlg set event
        var LoadPageRangeEventArgs = /** @class */ (function () {
            function LoadPageRangeEventArgs() {
                this.firstPage = 1;
                this.lastPage = -1;
                this.pageDescription = "All Pages";
            }
            return LoadPageRangeEventArgs;
        }());
        Dialogs.LoadPageRangeEventArgs = LoadPageRangeEventArgs;
        var UploadDocumentDlg = /** @class */ (function () {
            function UploadDocumentDlg(app) {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.pageRangeDlg = null;
                this.cachedFirstPage = null;
                this.cachedLastPage = null;
                this.loadAttachmentsMode = lt.Document.DocumentLoadAttachmentsMode.none;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.pageRangeBtn_Click = function (e) {
                    _this.pageRangeDlg.inner.show();
                };
                this.loadDocument = function (file) {
                    var args = new UploadDocumentEventArgs();
                    args.documentFile = file;
                    args.loadAttachmentsMode = $(_this.el.loadAttachmentsModeSelect).prop("selectedIndex");
                    args.firstPage = _this.cachedFirstPage;
                    args.lastPage = _this.cachedLastPage;
                    var selectedAnnotationsLoadOption = parseInt($(_this.el.annotationsLoadOptionsRadioBtns).filter(':checked').val(), 10);
                    args.annotationsLoadOption = selectedAnnotationsLoadOption;
                    if (args.annotationsLoadOption === HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external) {
                        args.annotationsLoadOption = selectedAnnotationsLoadOption;
                        var annotationsFile = $(_this.el.annotationsFileInput)[0].files[0];
                        if (!annotationsFile) {
                            alert("Please choose an annotations file first.");
                            return;
                        }
                        args.annotationFile = annotationsFile;
                    }
                    else {
                        args.annotationFile = null;
                    }
                    _this.inner.hide();
                    if (_this.onUpload)
                        _this.onUpload(args);
                };
                this.loadVideo = function (file) { return __awaiter(_this, void 0, void 0, function () {
                    var url, options, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this.context.loadingDlg.show(false, false, 'Uploading Video...', '', null);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, 4, 5]);
                                options = new lt.Multimedia.ConvertVideoOptions();
                                options.preFetch = this.context.addUserTokenToFetch;
                                return [4 /*yield*/, lt.Multimedia.MultimediaFactory.convertVideo(file, options)];
                            case 2:
                                url = _b.sent();
                                this.context.addUserTokenToUrl(url);
                                return [3 /*break*/, 5];
                            case 3:
                                _a = _b.sent();
                                alert('There was an issue uploading the video');
                                return [2 /*return*/];
                            case 4:
                                this.context.loadingDlg.hide();
                                return [7 /*endfinally*/];
                            case 5:
                                this.inner.hide();
                                this.context.videoPlayer.createFromUrl(url.toString());
                                return [2 /*return*/];
                        }
                    });
                }); };
                this.uploadBtn_Click = function (e) {
                    // Get the file object
                    var documentFile = $(_this.el.documentFileInput)[0].files[0];
                    if (!documentFile) {
                        alert("Please choose a document file first.");
                        return;
                    }
                    try {
                        // Run the file through the Content-Manager so it gets routed appropriately.
                        _this.context.contentManager.loadFromFile(documentFile);
                    }
                    catch (_a) {
                        alert('Failed to load file');
                    }
                };
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = function (e) {
                    var selectedAnnotationsLoadOption = $(e.currentTarget).val();
                    // If loading external annotations, enable annotations file input
                    $(_this.el.annotationsFileInput).prop("disabled", !(selectedAnnotationsLoadOption == HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external));
                };
                this.context = app;
                var root = $("#dlgUploadDoc");
                this.el = {
                    documentFileInput: "#dlgUploadDoc_DocumentFile",
                    annotationsLoadOptionsRadioBtns: "#dlgUploadDoc input[name=dlgUploadDoc_AnnotationsLoadOptions]",
                    annotationsFileInput: "#dlgUploadDoc_AnnotationsFile",
                    uploadBtn: "#dlgUploadDoc_Upload",
                    pageRangeBtn: "#dlgUploadDoc_PageRange",
                    pageRangeDescription: "#dlgUploadDoc_PageRangeDescription",
                    loadAttachmentsModeSelect: "#dlgUploadDoc_LoadAttachmentsMode",
                    hide: "#dlgUploadDoc .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.pageRangeDlg = new LoadDocumentPageRangeDlg();
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
                // Reset the dialog input elements, to avoid cached data
                $(this.el.documentFileInput).val("");
                $(this.el.annotationsFileInput).val("");
                var radioBtns = $(this.el.annotationsLoadOptionsRadioBtns);
                radioBtns.first().click();
                radioBtns.on("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.pageRangeBtn).on("click", this.pageRangeBtn_Click);
                $(this.el.pageRangeDescription).text(this.pageRangeDlg.results.pageDescription);
                this.cachedFirstPage = this.pageRangeDlg.results.firstPage;
                this.cachedLastPage = this.pageRangeDlg.results.lastPage;
                this.pageRangeDlg.onSet = function (e) {
                    $(_this.el.pageRangeDescription).text(e.pageDescription);
                    _this.cachedLastPage = e.lastPage;
                    _this.cachedFirstPage = e.firstPage;
                };
                $(this.el.uploadBtn).on("click", this.uploadBtn_Click);
            }
            UploadDocumentDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                $(this.el.annotationsLoadOptionsRadioBtns).off("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = null;
                $(this.el.uploadBtn).off("click", this.uploadBtn_Click);
                this.uploadBtn_Click = null;
                $(this.el.pageRangeBtn).off("click", this.pageRangeBtn_Click);
                this.pageRangeBtn_Click = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            UploadDocumentDlg.prototype.show = function () {
                $(this.el.loadAttachmentsModeSelect).prop("selectedIndex", this.loadAttachmentsMode);
                this.inner.show();
            };
            return UploadDocumentDlg;
        }());
        Dialogs.UploadDocumentDlg = UploadDocumentDlg;
        var OpenDocumentFromUrlDlg = /** @class */ (function () {
            function OpenDocumentFromUrlDlg(sampleDocuments, app) {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.pageRangeDlg = null;
                this.cachedFirstPage = null;
                this.cachedLastPage = null;
                this.loadAttachmentsMode = lt.Document.DocumentLoadAttachmentsMode.none;
                this._sampleDocuments = null;
                this._selectedLoadAnnotations = HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.none;
                this._selectedLoadFileUrl = FileUrlLoadOption.sample;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.urlLoadOptionsRadioBtnsGroup_BtnClicked = function (e) {
                    var fileUrl = parseInt($(e.currentTarget).val(), 10);
                    _this._selectedLoadFileUrl = fileUrl;
                    _this.updateUI();
                };
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = function (e) {
                    var selectedAnnotationsLoadOption = parseInt($(e.currentTarget).val());
                    _this._selectedLoadAnnotations = selectedAnnotationsLoadOption;
                    _this.updateUI();
                };
                this.pageRangeBtn_Click = function (e) {
                    _this.pageRangeDlg.inner.show();
                };
                this.loadDocument = function () {
                    var args = new OpenDocumentFromUrlEventArgs();
                    args.firstPage = _this.cachedFirstPage;
                    args.lastPage = _this.cachedLastPage;
                    args.loadAttachmentsMode = $(_this.el.loadAttachmentsModeSelect).prop("selectedIndex");
                    var urlLoadOption = _this._selectedLoadFileUrl;
                    var annLoadOption = _this._selectedLoadAnnotations;
                    if (urlLoadOption === FileUrlLoadOption.sample) {
                        var selectedSampleIndex = $(_this.el.fileSampleSelectElement).find(":selected").index();
                        var sample = _this._sampleDocuments[selectedSampleIndex];
                        // If using a sample document, no annotations
                        annLoadOption = HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.none;
                        args.fileUrl = OpenDocumentFromUrlDlg.getSampleUrl(sample);
                    }
                    else {
                        var documentUrl = $(_this.el.fileUrlTextInput).val();
                        if (documentUrl)
                            documentUrl = documentUrl.trim();
                        if (!documentUrl) {
                            alert("Must enter a document URL first");
                            return;
                        }
                        args.fileUrl = documentUrl;
                    }
                    args.annotationsLoadOption = annLoadOption;
                    if (args.annotationsLoadOption === HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external) {
                        var annotationsUrl = $(_this.el.annotationsUrlTextInput).val();
                        if (annotationsUrl)
                            annotationsUrl = annotationsUrl.trim();
                        if (!annotationsUrl) {
                            alert("Must enter an external annotations URL first");
                            return;
                        }
                        args.annotationsUrl = $(_this.el.annotationsUrlTextInput).val();
                    }
                    else {
                        args.annotationsUrl = null;
                    }
                    _this.inner.hide();
                    if (_this.onLoad)
                        _this.onLoad(args);
                };
                this.loadVideo = function (uri) { return __awaiter(_this, void 0, void 0, function () {
                    var urlLoadOption, url, playableUrl;
                    return __generator(this, function (_a) {
                        urlLoadOption = this._selectedLoadFileUrl;
                        url = (urlLoadOption === FileUrlLoadOption.sample) ? OpenDocumentFromUrlDlg.getSampleUrl(this._sampleDocuments[$(this.el.fileSampleSelectElement).find(":selected").index()]) : $(this.el.fileUrlTextInput).val();
                        this.inner.hide();
                        playableUrl = lt.Multimedia.MultimediaFactory.getPlayableUrl(url);
                        this.context.addUserTokenToUrl(playableUrl);
                        this.context.videoPlayer.createFromUrl(playableUrl.toString());
                        return [2 /*return*/];
                    });
                }); };
                this.loadBtn_Click = function () {
                    var urlLoadOption = _this._selectedLoadFileUrl;
                    var url = (urlLoadOption === FileUrlLoadOption.sample) ? OpenDocumentFromUrlDlg.getSampleUrl(_this._sampleDocuments[$(_this.el.fileSampleSelectElement).find(":selected").index()]) : $(_this.el.fileUrlTextInput).val();
                    if (!url) {
                        alert('Please enter a url');
                        return;
                    }
                    try {
                        var proxyUrl = lt.Document.DocumentFactory.buildUrlProxy(url);
                        _this.context.contentManager.loadFromUri(proxyUrl);
                    }
                    catch (_a) {
                        alert('Failed to retrieve resource');
                    }
                };
                this.context = app;
                this._sampleDocuments = sampleDocuments.slice();
                var root = $("#dlgOpenUrl");
                this.el = {
                    urlLoadOptionsRadioBtns: "#dlgOpenUrl input[name=dlgOpenUrl_UrlOptions]",
                    fileSampleSelectElement: "#dlgOpenUrl_FileSelect",
                    fileUrlTextInput: "#dlgOpenUrl_FileUrl",
                    annotationsLoadOptionsRadioBtns: "#dlgOpenUrl input[name=dlgOpenUrl_AnnotationsLoadOptions]",
                    annotationsUrlTextInput: "#dlgOpenUrl_AnnotationsUrl",
                    loadBtn: "#dlgOpenUrl_Load",
                    pageRangeBtn: "#dlgOpenUrl_PageRange",
                    pageRangeDescription: "#dlgOpenUrl_PageRangeDescription",
                    loadAttachmentsModeSelect: "#dlgOpenUrl_LoadAttachmentsMode",
                    hide: "#dlgOpenUrl .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.pageRangeDlg = new LoadDocumentPageRangeDlg();
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
                // Reset the dialog input elements, to avoid cached data
                var $fileSelectElement = $(this.el.fileSampleSelectElement);
                $fileSelectElement.empty();
                $fileSelectElement.prop("selectedIndex", 0);
                // Add the options to the <select>
                this._sampleDocuments.forEach(function (documentUrl, index) {
                    var $option = $(document.createElement("option")).text(documentUrl);
                    if (index === 0)
                        $option.attr("selected", "");
                    $fileSelectElement.append($option);
                });
                $(this.el.urlLoadOptionsRadioBtns).on("click", this.urlLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.annotationsLoadOptionsRadioBtns).on("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.loadBtn).on("click", this.loadBtn_Click);
                $(this.el.pageRangeBtn).on("click", this.pageRangeBtn_Click);
                $(this.el.pageRangeDescription).text(this.pageRangeDlg.results.pageDescription);
                this.cachedFirstPage = this.pageRangeDlg.results.firstPage;
                this.cachedLastPage = this.pageRangeDlg.results.lastPage;
                this.pageRangeDlg.onSet = function (e) {
                    $(_this.el.pageRangeDescription).text(e.pageDescription);
                    _this.cachedLastPage = e.lastPage;
                    _this.cachedFirstPage = e.firstPage;
                };
                this.updateUI();
            }
            OpenDocumentFromUrlDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                $(this.el.urlLoadOptionsRadioBtns).off("click", this.urlLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.annotationsLoadOptionsRadioBtns).off("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.loadBtn).off("click", this.loadBtn_Click);
                this.urlLoadOptionsRadioBtnsGroup_BtnClicked = null;
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = null;
                this.loadBtn_Click = null;
                $(this.el.pageRangeBtn).off("click", this.pageRangeBtn_Click);
                this.pageRangeBtn_Click = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            OpenDocumentFromUrlDlg.prototype.show = function () {
                $(this.el.loadAttachmentsModeSelect).prop("selectedIndex", this.loadAttachmentsMode);
                this.inner.show();
            };
            OpenDocumentFromUrlDlg.prototype.updateUI = function () {
                $(this.el.fileUrlTextInput).prop("disabled", this._selectedLoadFileUrl !== FileUrlLoadOption.url);
                $(this.el.annotationsLoadOptionsRadioBtns).prop("disabled", this._selectedLoadFileUrl !== FileUrlLoadOption.url);
                $(this.el.annotationsUrlTextInput).prop("disabled", this._selectedLoadFileUrl !== FileUrlLoadOption.url || this._selectedLoadAnnotations !== HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external);
                $(this.el.fileSampleSelectElement).prop("disabled", this._selectedLoadFileUrl !== FileUrlLoadOption.sample);
            };
            OpenDocumentFromUrlDlg.getSampleUrl = function (name) {
                if (name.indexOf("http") === 0) {
                    return name;
                }
                else {
                    var newDocumentUrl = 'Samples/' + name;
                    var serviceBase = lt.Document.DocumentFactory.serviceUri;
                    var serviceApiPath = lt.Document.DocumentFactory.serviceApiPath;
                    if (serviceApiPath) {
                        var serviceApiPathIndex = serviceBase.lastIndexOf(serviceApiPath);
                        if (serviceApiPathIndex !== -1) {
                            serviceBase = serviceBase.substring(0, serviceApiPathIndex);
                        }
                    }
                    if (serviceBase.charAt(serviceBase.length - 1) !== "/")
                        serviceBase += "/";
                    return serviceBase + newDocumentUrl;
                }
            };
            return OpenDocumentFromUrlDlg;
        }());
        Dialogs.OpenDocumentFromUrlDlg = OpenDocumentFromUrlDlg;
        var OpenFromDocumentStorageDlg = /** @class */ (function () {
            function OpenFromDocumentStorageDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.pageRangeDlg = null;
                this.cachedFirstPage = null;
                this.cachedLastPage = null;
                this.loadAttachmentsMode = lt.Document.DocumentLoadAttachmentsMode.none;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.pageRangeBtn_Click = function (e) {
                    _this.pageRangeDlg.inner.show();
                };
                this._openFromDocumentStorageEventArgs = null;
                this.openDocumentFromOneDriveBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = false;
                    _this._oneDriveHelper.open();
                };
                this.openDocumentFromSharePointBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = false;
                    _this._sharePointHelper.open();
                };
                this.openDocumentFromGoogleDriveBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = false;
                    _this._googleDriveHelper.open();
                };
                this.openAnnotationsFromOneDriveBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = true;
                    _this._oneDriveHelper.open();
                };
                this.openAnnotationsFromSharePointBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = true;
                    _this._sharePointHelper.open();
                };
                this.openAnnotationsFromGoogleDriveBtn_Clicked = function (e) {
                    _this._loadingAnnotationsFile = true;
                    _this._googleDriveHelper.open();
                };
                // Open done handler 
                this.openDone = function (file) {
                    if (file) {
                        if (!_this._loadingAnnotationsFile) {
                            // Open document file
                            $(_this.el.document.name).text(file.name);
                            _this._openFromDocumentStorageEventArgs.documentFile = file;
                        }
                        else {
                            // Open annotations file
                            $(_this.el.annotations.name).text(file.name);
                            _this._openFromDocumentStorageEventArgs.annotationsFile = file;
                        }
                    }
                };
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = function (e) {
                    var selectedAnnotationsLoadOption = $(e.currentTarget).val();
                    var loadExternal = selectedAnnotationsLoadOption == HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external;
                    // If loading external annotations, enable annotations url text input
                    $(_this.el.annotations.sharePointBtn).prop("disabled", !loadExternal);
                    // They must be disabled on Microsoft Edge
                    if (lt.LTHelper.browser !== lt.LTBrowser.edge) {
                        $(_this.el.annotations.oneDriveBtn).prop("disabled", !loadExternal || !_this._oneDriveHelper || !_this._oneDriveHelper.isRegisteredForLoadSave);
                        $(_this.el.annotations.googleDriveBtn).prop("disabled", !loadExternal || !_this._googleDriveHelper || !_this._googleDriveHelper.isRegisteredForLoad);
                    }
                };
                this.loadBtn_Click = function (e) {
                    var args = _this._openFromDocumentStorageEventArgs;
                    args.firstPage = _this.cachedFirstPage;
                    args.lastPage = _this.cachedLastPage;
                    args.loadAttachmentsMode = $(_this.el.loadAttachmentsModeSelect).prop("selectedIndex");
                    if (!args.documentFile) {
                        alert("Please choose a document to load.");
                        return;
                    }
                    var selectedAnnotationsLoadOption = parseInt($(_this.el.annotations.loadOptionsRadioBtns).filter(':checked').val(), 10);
                    args.annotationsLoadOption = selectedAnnotationsLoadOption;
                    if (args.annotationsLoadOption === HTML5Demos.DocumentViewerDemo.AnnotationsLoadOption.external) {
                        if (!args.annotationsFile) {
                            alert("Please choose an annotations file to load.");
                            return;
                        }
                    }
                    else {
                        args.annotationsFile = null;
                    }
                    _this.inner.hide();
                    if (_this.onLoad)
                        _this.onLoad(args);
                };
                var root = $("#dlgOpenCloud");
                this.el = {
                    infoText: "#dlgOpenCloud_InfoText",
                    document: {
                        oneDriveBtn: "#dlgOpenCloud_Document_OneDrive",
                        sharePointBtn: "#dlgOpenCloud_Document_SharePoint",
                        googleDriveBtn: "#dlgOpenCloud_Document_GoogleDrive",
                        name: "#dlgOpenCloud_Document_File"
                    },
                    annotations: {
                        loadOptionsRadioBtns: "#dlgOpenCloud input[name=dlgOpenCloud_Annotations_LoadOptions]",
                        oneDriveBtn: "#dlgOpenCloud_Annotations_OneDrive",
                        sharePointBtn: "#dlgOpenCloud_Annotations_SharePoint",
                        googleDriveBtn: "#dlgOpenCloud_Annotations_GoogleDrive",
                        name: "#dlgOpenCloud_Annotations_File"
                    },
                    loadBtn: "#dlgOpenCloud_Load",
                    pageRangeBtn: "#dlgOpenCloud_Document_PageRange",
                    pageRangeDescription: "#dlgOpenCloud_Document_PageRangeDescription",
                    loadAttachmentsModeSelect: "#dlgOpenCloud_LoadAttachmentsMode",
                    hide: "#dlgOpenCloud .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.pageRangeDlg = new LoadDocumentPageRangeDlg();
                $(this.el.hide).on("click", this.onHide);
                // Reset the dialog input elements, to avoid cached data
                $(this.el.annotations.loadOptionsRadioBtns).first().click();
                $(this.el.annotations.loadOptionsRadioBtns).on("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                $(this.el.loadBtn).on("click", this.loadBtn_Click);
                // Create the arguments
                this._openFromDocumentStorageEventArgs = new OpenFromDocumentStorageEventArgs();
                this._oneDriveHelper = new HTML5Demos.DriveHelper.LTOneDrive.OneDriveHelper();
                this._googleDriveHelper = new HTML5Demos.DriveHelper.LTGoogleDrive.GoogleDriveHelper();
                $(this.el.pageRangeBtn).on("click", this.pageRangeBtn_Click);
                $(this.el.pageRangeDescription).text(this.pageRangeDlg.results.pageDescription);
                this.cachedFirstPage = this.pageRangeDlg.results.firstPage;
                this.cachedLastPage = this.pageRangeDlg.results.lastPage;
                this.pageRangeDlg.onSet = function (e) {
                    $(_this.el.pageRangeDescription).text(e.pageDescription);
                    _this.cachedLastPage = e.lastPage;
                    _this.cachedFirstPage = e.firstPage;
                };
            }
            OpenFromDocumentStorageDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                $(this.el.annotations.loadOptionsRadioBtns).off("click", this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked);
                this.annotationsLoadOptionsRadioBtnsGroup_BtnClicked = null;
                $(this.el.loadBtn).off("click", this.loadBtn_Click);
                this.loadBtn_Click = null;
                $(this.el.pageRangeBtn).off("click", this.pageRangeBtn_Click);
                this.pageRangeBtn_Click = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            OpenFromDocumentStorageDlg.prototype.show = function () {
                $(this.el.loadAttachmentsModeSelect).prop("selectedIndex", this.loadAttachmentsMode);
                this.inner.show();
            };
            Object.defineProperty(OpenFromDocumentStorageDlg.prototype, "googleDriveHelper", {
                get: function () {
                    return this._googleDriveHelper;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(OpenFromDocumentStorageDlg.prototype, "sharePointHelper", {
                set: function (value) {
                    this._sharePointHelper = value;
                },
                enumerable: false,
                configurable: true
            });
            // SharePoint should be set and Google Drive should be registered before calling init
            OpenFromDocumentStorageDlg.prototype.init = function () {
                // OneDrive
                this._oneDriveHelper.openDone = this.openDone;
                // SharePoint
                this._sharePointHelper.openDone = this.openDone;
                // GoogleDrive
                // if IE9, Google Drive (which is not supported) will throw an error. So don't create it.
                if (!(lt.LTHelper.browser === lt.LTBrowser.internetExplorer && lt.LTHelper.version <= 9)) {
                    this._googleDriveHelper.openDone = this.openDone;
                }
                // Right now Google Drive and Microsoft OneDrive will get blocked on Microsoft Edge, so we disable them.
                if (lt.LTHelper.browser == lt.LTBrowser.edge) {
                    $(this.el.infoText).text("Opening files from Microsoft OneDrive or Google Drive is not currently supported by Microsoft Edge.");
                    $(this.el.document.oneDriveBtn).prop("disabled", true);
                    $(this.el.document.googleDriveBtn).prop("disabled", true);
                    $(this.el.annotations.oneDriveBtn).prop("disabled", true);
                    $(this.el.annotations.googleDriveBtn).prop("disabled", true);
                }
                else {
                    var googleIsRegistered = this._googleDriveHelper && this._googleDriveHelper.isRegisteredForLoad;
                    var oneDriveIsRegistered = this._oneDriveHelper && this._oneDriveHelper.isRegisteredForLoadSave;
                    if (googleIsRegistered) {
                        $(this.el.document.googleDriveBtn).on("click", this.openDocumentFromGoogleDriveBtn_Clicked);
                        $(this.el.annotations.googleDriveBtn).on("click", this.openAnnotationsFromGoogleDriveBtn_Clicked);
                    }
                    else {
                        $(this.el.document.googleDriveBtn).prop("disabled", true);
                        $(this.el.annotations.googleDriveBtn).prop("disabled", true);
                    }
                    if (oneDriveIsRegistered) {
                        $(this.el.document.oneDriveBtn).on("click", this.openDocumentFromOneDriveBtn_Clicked);
                        $(this.el.annotations.oneDriveBtn).on("click", this.openAnnotationsFromOneDriveBtn_Clicked);
                    }
                    else {
                        $(this.el.document.oneDriveBtn).prop("disabled", true);
                        $(this.el.annotations.oneDriveBtn).prop("disabled", true);
                    }
                    var vendorsDisabled = "";
                    if (!googleIsRegistered) {
                        vendorsDisabled = "Google Drive";
                    }
                    if (!oneDriveIsRegistered) {
                        if (!googleIsRegistered)
                            vendorsDisabled += " and OneDrive are";
                        else
                            vendorsDisabled += "OneDrive is";
                    }
                    else if (!googleIsRegistered) {
                        vendorsDisabled += " is";
                    }
                    if (vendorsDisabled) {
                        $(this.el.infoText).text(vendorsDisabled + " not registered for loading.");
                    }
                    lt.Demos.Utils.Visibility.toggle($(this.el.infoText), !!vendorsDisabled);
                }
                $(this.el.document.sharePointBtn).on("click", this.openDocumentFromSharePointBtn_Clicked);
                $(this.el.annotations.sharePointBtn).on("click", this.openAnnotationsFromSharePointBtn_Clicked);
            };
            return OpenFromDocumentStorageDlg;
        }());
        Dialogs.OpenFromDocumentStorageDlg = OpenFromDocumentStorageDlg;
        var LoadDocumentPageRangeDlg = /** @class */ (function () {
            function LoadDocumentPageRangeDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.results = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.allPagesBtn_Click = function (e) {
                    $(_this.el.firstPageNumInput).val("1");
                    $(_this.el.lastPageNumInput).val("-1");
                    _this.updateResults();
                };
                this.setPagesBtn_Click = function (e) {
                    var firstPageValue = +$(_this.el.firstPageNumInput).val();
                    var lastPageValue = +$(_this.el.lastPageNumInput).val();
                    if (firstPageValue < 1) {
                        alert("First page value needs to be greater than or equal to 1");
                        return;
                    }
                    if (lastPageValue < -1) {
                        alert("Last page value needs to be greater than or equal to -1");
                        return;
                    }
                    if (lastPageValue != -1 && lastPageValue != 0) {
                        if (firstPageValue > lastPageValue) {
                            alert("The last page value must be greater than or equal to the first page value, except if passing a value of 0 or -1 to indicate all pages.");
                            return;
                        }
                    }
                    _this.updateResults();
                    _this.inner.hide();
                    if (_this.onSet)
                        _this.onSet(_this.results);
                };
                var root = $("#dlgLoadPageRangeOptions");
                this.el = {
                    firstPageNumInput: "#dlgLoadPageRangeOptions_FirstPage",
                    lastPageNumInput: "#dlgLoadPageRangeOptions_LastPage",
                    allPagesBtn: "#dlgLoadPageRangeOptions_AllPages",
                    setPagesBtn: "#dlgLoadPageRangeOptions_Set",
                    hide: "#dlgLoadPageRangeOptions .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
                // Reset the dialog input elements, to avoid cached data
                $(this.el.firstPageNumInput).val("1");
                $(this.el.lastPageNumInput).val("-1");
                this.results = {
                    firstPage: 1,
                    lastPage: -1,
                    pageDescription: "All Pages"
                };
                $(this.el.allPagesBtn).on("click", this.allPagesBtn_Click);
                $(this.el.setPagesBtn).on("click", this.setPagesBtn_Click);
            }
            LoadDocumentPageRangeDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                $(this.el.allPagesBtn).off("click", this.allPagesBtn_Click);
                this.allPagesBtn_Click = null;
                $(this.el.setPagesBtn).off("click", this.setPagesBtn_Click);
                this.setPagesBtn_Click = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            LoadDocumentPageRangeDlg.prototype.updateResults = function () {
                var firstPageValue = +$(this.el.firstPageNumInput).val();
                var lastPageValue = +$(this.el.lastPageNumInput).val();
                this.results.firstPage = firstPageValue;
                this.results.lastPage = lastPageValue;
                if (lastPageValue === -1 || lastPageValue === 0) {
                    if (firstPageValue === 1)
                        this.results.pageDescription = "All pages";
                    else
                        this.results.pageDescription = "All pages starting with page " + firstPageValue.toString();
                }
                else {
                    if (this.results.firstPage == this.results.lastPage)
                        this.results.pageDescription = "Only page " + firstPageValue.toString();
                    else
                        this.results.pageDescription = "From page " + firstPageValue.toString() + " to page " + lastPageValue.toString();
                }
            };
            return LoadDocumentPageRangeDlg;
        }());
        Dialogs.LoadDocumentPageRangeDlg = LoadDocumentPageRangeDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
