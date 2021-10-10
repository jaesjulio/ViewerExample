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
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        var DemoMode;
        (function (DemoMode) {
            DemoMode[DemoMode["Default"] = 0] = "Default";
            DemoMode[DemoMode["SVG"] = 1] = "SVG";
            DemoMode[DemoMode["OCR"] = 2] = "OCR";
            DemoMode[DemoMode["Barcode"] = 3] = "Barcode";
        })(DemoMode = DocumentViewerDemo.DemoMode || (DocumentViewerDemo.DemoMode = {}));
        var GetTextReason;
        (function (GetTextReason) {
            // We don't know or don't care how it was called.
            GetTextReason[GetTextReason["other"] = 0] = "other";
            // We are manually calling "GetText" before an operation such as ExportText.
            GetTextReason[GetTextReason["manual"] = 1] = "manual";
            // We are calling an internal Document.Viewer operation that needs to GetText, like FindText.
            GetTextReason[GetTextReason["internalOperation"] = 2] = "internalOperation";
        })(GetTextReason = DocumentViewerDemo.GetTextReason || (DocumentViewerDemo.GetTextReason = {}));
        //Annotations Load Options 
        var AnnotationsLoadOption;
        (function (AnnotationsLoadOption) {
            AnnotationsLoadOption[AnnotationsLoadOption["none"] = 0] = "none";
            AnnotationsLoadOption[AnnotationsLoadOption["render"] = 1] = "render";
            AnnotationsLoadOption[AnnotationsLoadOption["embedded"] = 2] = "embedded";
            AnnotationsLoadOption[AnnotationsLoadOption["external"] = 3] = "external";
        })(AnnotationsLoadOption = DocumentViewerDemo.AnnotationsLoadOption || (DocumentViewerDemo.AnnotationsLoadOption = {}));
        // Callbacks to when we are changing the current document in the viewer
        var ViewerDocumentChangedCallback = /** @class */ (function () {
            function ViewerDocumentChangedCallback() {
            }
            return ViewerDocumentChangedCallback;
        }());
        DocumentViewerDemo.ViewerDocumentChangedCallback = ViewerDocumentChangedCallback;
        ;
        var DocumentViewerDemoApp = /** @class */ (function () {
            function DocumentViewerDemoApp() {
                var _this = this;
                // Set this to a value other than null to force the demo to pass it with all calls to the service
                this._userToken = null;
                // These are set in the OpenFromUrlDialog
                this.sampleDocuments = [];
                this._sampleDocumentFilter = [
                    "1040EZ.pdf",
                    "Combined.pdf",
                    "Leadtools.pdf",
                    "NewHome.pdf",
                    "PortfolioStatement.pdf",
                    "W2.pdf",
                    "W4.pdf",
                    "W9.pdf",
                    "barcodes.pdf",
                    "ocr1 - 4.tif",
                    "Marketing.ts",
                    "form_2t.pdf",
                    "Marketing.mp4"
                ];
                // The MimeTypes
                this.supportedVideoMimetypes = [
                    'video/mp4',
                    'video/avi',
                    "video/3gpp2",
                    "video/3gpp",
                    "video/3gpp2",
                    "video/3gpp",
                    "video/x-ms-asf",
                    "video/x-msvideo",
                    "video/annodex",
                    "video/x-dv",
                    "video/divx",
                    "video/x-dv",
                    "video/x-flv",
                    "video/x-ivf",
                    "video/x-la-asf",
                    "video/mpeg",
                    "video/vnd.dlna.mpeg-tts",
                    "video/x-m4v",
                    "video/x-matroska-3d",
                    "video/x-matroska",
                    "video/quicktime",
                    "video/x-sgi-movie",
                    "video/ogg",
                    "video/webm",
                    "video/x-ms-wm",
                    "video/x-ms-wmp",
                    "video/x-ms-wmv",
                    "video/x-ms-wmx",
                    "video/x-ms-wvx"
                ];
                // For opening documents in other demos
                this.documentCompareLocation = null;
                this.documentCompareLocationLink = "#openInComparison";
                this.documentComposerLocation = null;
                this.documentComposerLocationLink = "#openInVirtualDocument";
                // Demo parts
                this._filePart = null;
                this._editPart = null;
                this._viewPart = null;
                this._pagePart = null;
                this._interactivePart = null;
                this._annotationsPart = null;
                this._attachmentsPart = null;
                this._historyPart = null;
                this.preferencesPart = null;
                // Document viewer
                this._documentViewer = null;
                // Add a logging line whenever a page renders
                this._countPageRenders = false;
                this._isInsideBusyOperation = false;
                // Indicates that the thumbnails are still in loading operation
                this._loadingThumbnailsBar = "#loadingThumbnailsBar";
                // Indicates that the annotations are still in loading operation
                this._loadingAnnotationsBar = "#loadingAnnotationsBar";
                // Tooltip element
                this._toolTipUI = {
                    container: "#tooltip",
                    title: "#tooltip_Title",
                    tip: "#tooltip_Tip",
                };
                this._toolTipHighlightPageIndex = -1;
                this._toolTipHighlightCursorPosition = lt.LeadPointD.empty;
                this._toolTipHighlightLinkBounds = lt.LeadRectD.empty;
                this._automaticallyRunLinks = false;
                this._useElements = false;
                this.imageViewerContainerDiv = "#imageViewerContainer";
                this.navigationbar = {
                    showThumbnailsBtn: "#showThumbnails",
                    showBookmarksBtn: "#showBookmarks",
                    showAttachmentsBtn: "#showAttachments",
                    showAnnotationsListControlsBtn: "#showAnnotationsListControls",
                };
                this.headerToolbarContainer = "#headerToolbarContainer";
                this.footerToolbarContainer = ".footerToolbar";
                this.navigationbarContainer = "#navigationbar";
                this.thumbnailsContainer = "#thumbnailsControl";
                this.bookmarksContainer = "#bookmarksControl";
                this.attachmentsContainer = "#attachmentsControl";
                this.annotationsListControlsContainer = "#annotationsListControls";
                // Viewer, thumbnails, bookmarks and attachments containers
                // These containers will have same top/bottom effects when window resized
                // Or when show/hide annotations list
                this.affectedContainers = ".affectedContainers";
                // All mobile version controls containers
                this.mobileVersionControlsContainers = ".mobileVersionControls";
                // Operations names
                this._documentViewerOperationDictionary = {
                    0: "setDocument",
                    1: "loadingThumbnails",
                    2: "getThumbnail",
                    3: "loadingPages",
                    4: "getPage",
                    5: "runCommand",
                    6: "gotoPage",
                    7: "itemTypeChanged",
                    8: "getText",
                    9: "pageTextSelectionChanged",
                    10: "textSelectionChanged",
                    11: "renderItemPlaceholder",
                    12: "renderSelectedText",
                    13: "gotoBookmark",
                    14: "runLink",
                    15: "loadingAnnotations",
                    16: "getAnnotations",
                    17: "createAutomation",
                    18: "destroyAutomation",
                    19: "automationStateChanged",
                    20: "selectedTextToReviewObject",
                    21: "loadingBookmarks",
                    22: "hoverLink",
                    23: "printPages",
                    24: "pagesAdded",
                    25: "pagesRemoved",
                    26: "findText",
                    27: "renderFoundText",
                    28: "renderViewPage",
                    29: "renderThumbnailPage",
                    30: "detachFromDocument",
                    31: "attachToDocument",
                    32: "pageRotate",
                    33: "pageDisabled",
                    34: "pageEnabled",
                    35: "pagesDisabledEnabled",
                    36: "currentPageNumberChanged",
                    37: "loadingPage",
                    38: "saveToCache"
                };
                this._prepareAjaxEventHandler = null;
                this.addUserTokenToUrl = function (url) {
                    if (!_this.hasUserToken)
                        return;
                    url.searchParams.append('documentUserToken', _this._userToken);
                };
                this.addUserTokenToFetch = function (fetchData) {
                    if (!_this.hasUserToken)
                        return;
                    if (!fetchData.headers)
                        fetchData.headers = {};
                    fetchData.headers["user-token"] = _this._userToken;
                };
                this._logAjax = true;
                // load LEADDocument type(Service, Local, Local Then Serivce)
                this.loadDocumentMode = lt.Document.DocumentLoadMode.service;
                // Last successful load options
                this.loadDocumentOptions = new lt.Document.LoadDocumentOptions();
                // Default load document timeout in milliseconds (0 = no timeout)
                this.loadDocumentTimeoutMilliseconds = 0;
                // If true, document conversion (export) will be done in a non-blocking fashion on the service
                // (though still blocking in the UI) and the status of the conversion will be checked with polling.
                this.useStatusQueryRequests = true;
                // If true, verify the mimetype of an uploaded document before loading it to ensure it's acceptable.
                this.verifyUploadedMimeTypes = true;
                // By default, CSS Transitions are off in all browsers.
                // Use of this feature may cause issues with annotations rendering.
                this._useCSSTransitions = false;
                this._cssTransitionsCallbackPending = false;
                this._cssTransitionsEnded = function (event) {
                    if (_this._cssTransitionsCallbackPending) {
                        /// DONE ///
                        _this._cssTransitionsStopListening();
                    }
                };
                this.imageViewer_elementsUpdatedCSS = function (sender, e) {
                    if (!e.isTransitionsEnabled) {
                        // transitions are disabled. End our listening.
                        if (_this._cssTransitionsCallbackPending)
                            _this._cssTransitionsStopListening();
                    }
                    else if (!_this._cssTransitionsCallbackPending) {
                        /// START ///
                        _this._cssTransitionsCallbackPending = true;
                        var imageViewer = _this._documentViewer.view.imageViewer;
                        imageViewer.viewDiv.addEventListener("transitionend", _this._cssTransitionsEnded, false);
                        lt.LTHelper.addClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsHideCanvasClass);
                    }
                };
                // Use SVG back image
                this.useSvgBackImage = true;
                this.serviceHeartbeatStartEnabled = false;
                this.serviceHeartbeatStartTimer = 2000;
                this.serviceHeartbeatIntervalTimer = 15000;
                this.serviceHeartbeatAutoPauseTimer = 60000;
                this.serviceHeartbeatFailureMessage = DocumentViewerDemoApp.serviceHeartbeatFailureMessage_default;
                this.serviceHeartbeat = null;
                this.beforeServiceHeartbeat = function (sender, args) {
                    // Create Endpoint URL using serviceUri
                    var endpointUrl = lt.Document.Service.Custom.createEndpointUrl("Test", "Heartbeat");
                    // Create GET settings using URL and param
                    var settings = lt.Document.Service.Custom.createGetAjaxSettings(endpointUrl, {
                        userData: lt.Document.DocumentFactory.serviceUserData
                    });
                    // Send PrepareAjax, cancel if needed
                    if (lt.Document.DocumentFactory.cancelFromPrepareAjax(_this, "DocumentViewerDemoApp", "Heartbeat", settings, false)) {
                        // Cancel this request
                        args.cancel = true;
                    }
                    else {
                        args.serviceHeartbeat.requestSettings = settings;
                    }
                };
                this.afterServiceHeartbeat = function (sender, args) {
                    if (_this.serviceHeartbeat && args.isError) {
                        lt.LTHelper.logError(args);
                        _this.showServiceFailure();
                    }
                };
                this._loadDocumentAnnotationsFile = null;
                this._documentPrintCanceled = false;
                this._bookmarkLinkClicks = 0;
                this._bookmarkLinkClickThreshold = 3;
                /*
                   There are three ways that the text can be requested:
                   1. Through a manual client request, before executing tasks such as ExportText or SelectAll.
                      - We manually loop through the pages and get the text.
                      - These may be internal lt.Document.UI operations that don't call GetText automatically,
                      or other tasks that we just need text for.
                   2. Through an interaction, such as SelectTextInteractiveMode.
                      - We don't know ahead of time when GetText will be called.
                   3. As part of an internal lt.Document.UI action called by the application, such as FindText.
                      - If we know the operation will call GetText, we can prepare for it.
       
                   In all cases, we need to provide the ability for the GetText operation to be canceled
                   and for the calling operation to know about it.
       
                   See GetTextReason enum.
                */
                this.getTextReason = GetTextReason.other;
                // For Manual Get Text
                this._manualGetTextPagesNeeded = null;
                this._manualGetTextPagesRequested = null;
                this._manualGetTextPostOperation = null;
                this._disabledPageIconCanvas = null;
                this._allBarcodes = null;
                this._currentBarcodes = [];
                window.onresize = (function (e) { return _this.onResize(e); });
                window.onunload = (function (e) { return _this.onUnload(e); });
                this.InitUI();
                // Bind necessary functions
                this._endDocumentPrint = this._endDocumentPrint.bind(this);
            }
            Object.defineProperty(DocumentViewerDemoApp.prototype, "hasUserToken", {
                //private _userToken: string = "my-secret";
                get: function () {
                    if (this._userToken)
                        return true;
                    else
                        return false;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DocumentViewerDemoApp.prototype, "attachmentsPart", {
                get: function () {
                    return this._attachmentsPart;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DocumentViewerDemoApp.prototype, "historyPart", {
                get: function () {
                    return this._historyPart;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DocumentViewerDemoApp.prototype, "useElements", {
                get: function () {
                    return this._useElements;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DocumentViewerDemoApp.prototype, "demoName", {
                set: function (value) {
                    this._demoName = value;
                    // demo title
                    $("#demoTitle").text(value);
                    // demo name label in the about dialog
                    this.aboutDlg.name = value;
                },
                enumerable: false,
                configurable: true
            });
            DocumentViewerDemoApp.prototype.getDemoFiles = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var files;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch(lt.Document.DocumentFactory.serviceUri + "/Test/GetSampleFiles")
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!response.ok)
                                                    throw new Error('Failed to fetch sample files.');
                                                return [4 /*yield*/, response.json().then(function (json) { return json['files']; })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); })];
                            case 1:
                                files = _a.sent();
                                files.forEach(function (query) {
                                    if (_this._sampleDocumentFilter.findIndex(function (item) { return query.toLowerCase() === item.toLowerCase(); }) >= 0)
                                        _this.sampleDocuments.push(query);
                                });
                                // We will init the OpenFromUrlDlg after we have our sample files.
                                this.openDocumentFromUrlDlg = new HTML5Demos.Dialogs.OpenDocumentFromUrlDlg(this.sampleDocuments, this);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            DocumentViewerDemoApp.prototype.onResize = function (e) {
                // Hide all menus
                var menus = $(".dropup.clearfix");
                menus.css("display", "none");
                this.updateContainers();
            };
            DocumentViewerDemoApp.prototype.InitContainers = function () {
                if (DocumentViewerDemoApp.isMobileVersion) {
                    // We only need to update thumbnails Container, bookmarks, attachments container not included in mobile version too
                    $(this.thumbnailsContainer).css({ "left": 0, "right": 0, "width": "inherit" });
                }
            };
            DocumentViewerDemoApp.prototype.updateContainers = function () {
                var headerToolbarContainer = !DocumentViewerDemoApp.isMobileVersion ? $(this.headerToolbarContainer) : $(this.headerToolbarContainer).children(".navbar-header");
                var headerToolbarContainerHeight = $(headerToolbarContainer).height();
                var footerToolbarContainerHeight = this.demoMode == DemoMode.Default ? $(this.footerToolbarContainer).height() : 0;
                // Check visibility
                var visibleAnnotationsListControls = !lt.Demos.Utils.Visibility.isHidden($(this.annotationsListControlsContainer));
                var visibleThumbnails = !lt.Demos.Utils.Visibility.isHidden($(this.thumbnailsContainer));
                var visibleBookmarks = !lt.Demos.Utils.Visibility.isHidden($(this.bookmarksContainer));
                var visibleAttachments = !lt.Demos.Utils.Visibility.isHidden($(this.attachmentsContainer));
                // Update navigationbar container top/bottom
                $(this.navigationbarContainer).css("top", headerToolbarContainerHeight);
                $(this.navigationbarContainer).css("bottom", footerToolbarContainerHeight);
                if (!DocumentViewerDemoApp.isMobileVersion)
                    $(this._editPart.findTextPanel.panel).css("top", headerToolbarContainerHeight);
                // Update annotations list controls bottom
                $(this.annotationsListControlsContainer).css("bottom", footerToolbarContainerHeight);
                // Update affected containers top/bottom
                $(this.affectedContainers).css("top", headerToolbarContainerHeight);
                var affectedContainersBottom = footerToolbarContainerHeight;
                if (visibleAnnotationsListControls)
                    affectedContainersBottom += $(this.annotationsListControlsContainer).height();
                $(this.affectedContainers).css("bottom", affectedContainersBottom);
                if (!DocumentViewerDemoApp.isMobileVersion) {
                    var navigationbarContainerWidth = $(this.navigationbarContainer).width();
                    // Thumbnails, bookmarks and attachments Containers has same width
                    // Use thumbnails container as common
                    var containerWidth = $(this.thumbnailsContainer).width();
                    // Now update viewer container
                    var imageViewerContainerDivLeft = navigationbarContainerWidth;
                    if (visibleThumbnails || visibleBookmarks || visibleAttachments)
                        imageViewerContainerDivLeft += containerWidth;
                    $(this.imageViewerContainerDiv).css("left", imageViewerContainerDivLeft);
                }
                // The viewer container size might be changed; call onSizeChanged
                this._documentViewer.view.imageViewer.onSizeChanged();
                if (this.documentViewer.thumbnails != null) {
                    this.documentViewer.thumbnails.imageViewer.onSizeChanged();
                    this.documentViewer.thumbnails.imageViewer.invalidate(lt.LeadRectD.empty);
                }
                this._attachmentsPart.onSizeChanged();
            };
            DocumentViewerDemoApp.prototype.showContainer = function (container, flipState) {
                // Show either thumbnails/bookmarks/attachments containers
                var visibleThumbnails = !lt.Demos.Utils.Visibility.isHidden($(this.thumbnailsContainer));
                var visibleBookmarks = !lt.Demos.Utils.Visibility.isHidden($(this.bookmarksContainer));
                var visibleAttachments = !lt.Demos.Utils.Visibility.isHidden($(this.attachmentsContainer));
                if (container == this.thumbnailsContainer) {
                    if (!visibleThumbnails) {
                        // Hide others
                        if (visibleBookmarks) {
                            $(this.bookmarksContainer).hide();
                            $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                        }
                        if (visibleAttachments) {
                            $(this.attachmentsContainer).hide();
                            $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                        }
                        $(this.navigationbar.showThumbnailsBtn).addClass("activeNavigationbarBtn");
                        $(this.thumbnailsContainer).show();
                    }
                    else {
                        if (flipState) {
                            $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                            $(this.thumbnailsContainer).hide();
                        }
                    }
                }
                else if (container == this.bookmarksContainer) {
                    if (!visibleBookmarks) {
                        // Hide others
                        if (visibleThumbnails) {
                            $(this.thumbnailsContainer).hide();
                            $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                        }
                        if (visibleAttachments) {
                            $(this.attachmentsContainer).hide();
                            $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                        }
                        $(this.navigationbar.showBookmarksBtn).addClass("activeNavigationbarBtn");
                        $(this.bookmarksContainer).show();
                    }
                    else {
                        if (flipState) {
                            $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                            $(this.bookmarksContainer).hide();
                        }
                    }
                }
                else if (container == this.attachmentsContainer) {
                    if (!visibleAttachments) {
                        // Hide others
                        if (visibleBookmarks) {
                            $(this.bookmarksContainer).hide();
                            $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                        }
                        if (visibleThumbnails) {
                            $(this.thumbnailsContainer).hide();
                            $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                        }
                        $(this.navigationbar.showAttachmentsBtn).addClass("activeNavigationbarBtn");
                        $(this.attachmentsContainer).show();
                    }
                    else {
                        if (flipState) {
                            $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                            $(this.attachmentsContainer).hide();
                        }
                    }
                }
                this.updateContainers();
            };
            DocumentViewerDemoApp.prototype.onUnload = function (e) {
                if (this._documentViewer != null) {
                    this._documentViewer.operation.remove(this._operationHandler);
                    this._documentViewer.dispose();
                }
                if (this._historyPart != null) {
                    this._historyPart.clear();
                }
                if (this._attachmentsPart != null) {
                    this._attachmentsPart.clear();
                }
            };
            DocumentViewerDemoApp.prototype.InitUI = function () {
                var _this = this;
                this.hideTooltip();
                $(this.thumbnailsContainer).hide();
                $(this.bookmarksContainer).hide();
                $(this.attachmentsContainer).hide();
                $(this.annotationsListControlsContainer).hide();
                if (lt.LTHelper.device == lt.LTDevice.mobile || lt.LTHelper.device == lt.LTDevice.tablet) {
                    $(".shortcutsbar").css({
                        "overflow-y": "hidden",
                        "overflow-x": "auto",
                        "white-space": "nowrap"
                    });
                }
                this.InitContainers();
                this.InitDialogs();
                this.contentManager = new lt.ContentManager.ContentManager();
                this.contentManager.registry.register({
                    default: true,
                    mimetypes: [],
                    onLoadFromFile: function (file) { return _this.uploadDocumentDlg.loadDocument(file); },
                    onLoadFromUri: function () { return _this.openDocumentFromUrlDlg.loadDocument(); }
                });
                this.contentManager.registry.register({
                    mimetypes: this.supportedVideoMimetypes,
                    onLoadFromFile: function (file) { return _this.uploadDocumentDlg.loadVideo(file); },
                    onLoadFromUri: function (uri) { return _this.openDocumentFromUrlDlg.loadVideo(uri); }
                });
            };
            DocumentViewerDemoApp.prototype.InitDialogs = function () {
                var _this = this;
                // Upload document dialog
                this.uploadDocumentDlg = new HTML5Demos.Dialogs.UploadDocumentDlg(this);
                this.videoPlayer = new HTML5Demos.Dialogs.VideoPlayer(this);
                // Open document from url dialog
                // Print dialog
                this.printDlg = new HTML5Demos.Dialogs.PrintDlg();
                // Document Converter dialog
                this.documentConverterDlg = new DocumentViewerDemo.Converter.Dialogs.DocumentConverterDlg();
                // Use same SharePoint helper instance for both open and save dialogs
                var sharePointHelper = new HTML5Demos.DriveHelper.LTSharePoint.SharePointHelper();
                // Open from external document storage dialog
                this.openFromDocumentStorageDlg = new HTML5Demos.Dialogs.OpenFromDocumentStorageDlg();
                this.openFromDocumentStorageDlg.sharePointHelper = sharePointHelper;
                // Wait to init until we have Google Drive credentials
                // Save to dialog
                this.saveToDlg = new DocumentViewerDemo.Converter.Dialogs.SaveToDlg();
                this.saveToDlg.init(sharePointHelper);
                this.exportJobDlg = new DocumentViewerDemo.Converter.Dialogs.ExportJobDlg();
                // Text result dialog
                this.textResultDlg = new lt.Demos.Dialogs.TextResultDialog($("#dlgTextResults"), {
                    title: "#dlgTextResults_Title",
                    textResult: "#dlgTextResults_Results",
                    hide: ".dlg-close"
                });
                // Automation properties dialog
                var automationUpdateRoot = $("#dlgAutomationUpdate");
                this.automationUpdateObjectDlg = new lt.Demos.Annotations.AutomationUpdateObjectDialog(automationUpdateRoot, {
                    properties: {
                        tab: "#dlgAutomationUpdate_PropertiesTab",
                        page: "#dlgAutomationUpdate_PropertiesPage",
                    },
                    content: {
                        tab: "#dlgAutomationUpdate_ContentTab",
                        page: "#dlgAutomationUpdate_ContentPage",
                    },
                    reviews: {
                        tab: "#dlgAutomationUpdate_ReviewsTab",
                        page: "#dlgAutomationUpdate_ReviewsPage",
                    },
                    hide: ".dlg-close",
                });
                // About dialog
                this.aboutDlg = new lt.Demos.Dialogs.AboutDialog($("#dlgAbout"), {
                    title: "#dlgAbout_Title",
                    hide: ".dlg-close"
                });
                this.aboutDlg.name = "";
                // Loading dialog
                this.loadingDlg = new HTML5Demos.Dialogs.DocumentViewerDemoLoadingDlg();
                // Processing pages dialog
                this.processingPagesDlg = new HTML5Demos.Dialogs.ProcessingPagesDlg();
                // Document viewer options dialog
                this.documentViewerOptionsDlg = new HTML5Demos.Dialogs.DocumentViewerOptionsDlg();
                this.documentViewerOptionsDlg.onApply = function () {
                    var dlg = _this.documentViewerOptionsDlg;
                    _this.loadDocumentMode = dlg.loadDocumentMode;
                    _this.loadDocumentTimeoutMilliseconds = dlg.loadDocumentTimeoutMilliseconds;
                    _this.hookPrepareAjax = dlg.hookPrepareAjax;
                    _this.useCSSTransitions = dlg.useCSSTransitions;
                    _this.useSvgBackImage = dlg.useSvgBackImage;
                    _this.useStatusQueryRequests = dlg.useStatusQueryRequests;
                    _this.verifyUploadedMimeTypes = dlg.verifyUploadedMimeTypes;
                    _this.serviceHeartbeatStartTimer = dlg.heartbeatStart;
                    _this.serviceHeartbeatIntervalTimer = dlg.heartbeatInterval;
                    _this.serviceHeartbeatAutoPauseTimer = dlg.heartbeatAutoPause;
                    _this.resetServiceHeartbeat(dlg.heartbeatEnabled);
                };
                // User name dialog
                this.inputDlg = new HTML5Demos.Dialogs.InputDlg();
                this.cacheDlg = new HTML5Demos.Dialogs.CacheDlg();
                // Document properties dialog
                this.documentPropertiesDlg = new HTML5Demos.Dialogs.DocumentPropertiesDlg();
                this.attachmentPropertiesDlg = new HTML5Demos.Dialogs.AttachmentPropertiesDlg();
                // Link value dialog
                this.linkValueDlg = new HTML5Demos.Dialogs.LinkValueDlg();
                this.linkMessageDlg = new HTML5Demos.Dialogs.LinkMessageDlg();
                this.redactionDocumentDlg = new HTML5Demos.Dialogs.DocumentRedactionOptionsDlg(this);
                if (!DocumentViewerDemoApp.isMobileVersion) {
                    // Pages dialog
                    this.pagesDlg = new HTML5Demos.Dialogs.PagesDlg();
                    // Customize render mode dialog
                    this.customizeRenderModeDlg = new HTML5Demos.Dialogs.CustomRenderModeDlg();
                }
            };
            DocumentViewerDemoApp.prototype.run = function () {
                DocumentViewerDemoApp._loadDisabledSymbolImage();
                this.browserPageSetup();
            };
            DocumentViewerDemoApp.prototype._postBrowserPageSetup = function () {
                this.setDemoMode();
                this.Init();
            };
            DocumentViewerDemoApp.prototype.browserPageSetup = function () {
                // a place for all initializing browser-specific code.
                var _this = this;
                /* For IE9 and IE10:
                 * If
                 *    - You have an <input> element not inside a <form>
                 *    - You have any <button> element anywhere in the HTML
                 *    - You acquire selection of that input element (clicking, typing, etc)
                 *    - You hit the "enter" key
                 * Then IE tries to find a suitable button to click because it still believes
                 * it is inside a form that must be submitted.
                 *
                 * To prevent this, all buttons must have 'type="button"'.
                 * At the start, we add a hook with JQuery to add this attribute to an element
                 * when created if it doesn't have it.
                 */
                if (lt.LTHelper.browser == lt.LTBrowser.internetExplorer && (lt.LTHelper.version == 9 || lt.LTHelper.version == 10)) {
                    // First, get all our elements without a "type" attribute
                    $("button:not([type])").each(function (idx, el) {
                        el.setAttribute("type", "button");
                    });
                    // Write a hook for future dynamically-created elements (DOMNodeInserted is now deprecated, but works in IE9 and IE10)
                    $("body").on("DOMNodeInserted", "button:not([type])", function () {
                        this.setAttribute("type", "button");
                    });
                }
                if (lt.LTHelper.OS == lt.LTOS.android && lt.LTHelper.browser == lt.LTBrowser.chrome) {
                    // For Android Chrome: use the printDIV instead of iframe element - window.print prints the whole screen regardless
                    this._printElement = document.getElementById("printDiv");
                    $("#printFrame").remove();
                }
                else {
                    // Use iframe element directly
                    this._printElement = document.getElementById("printFrame");
                    if (lt.LTHelper.OS == lt.LTOS.iOS && this._printElement) {
                        // Prevent issues with iOS post-print UI
                        this._printElement.style.position = "relative";
                    }
                }
                /* License Setup:
                 *
                 * When checking for a client license, failure results in an on-screen alert() message.
                 * You can set the license in three ways:
                 *    - Do nothing, and wait for the default license check in Leadtools (using LTHelper.licenseDirectory), provided that you set the license and developer key files in the LEADTOOLS folder at the server
                 *    - lt.RasterSupport.setLicenseUri(licenseUri, developerKey, callback)
                 *       - Allows us to set an absolute or relative path to the license file (makes a GET request)
                 *    - lt.RasterSupport.setLicenseText(licenseText, developerKey) or setLicenseBuffer(licenseBuffer, developerKey)
                 *       - Allows us to make our own request for the license and just provide the text or byte array buffer
                 *
                 * See lt.RasterSupport JavaScript documentation for more information.
                 *
                 * We will attempt to set the license here because of a Firefox issue:
                 *    Our client-side PDF rendering uses Web Workers for drawing the PDF in a different thread.
                 *    If an alert() (or another main-thread-blocking-action) pops up while these Web Workers are
                 *    being set up and the main thread is blocked for more than ~12 seconds, Firefox discards the
                 *    messages to "conserve resources". This can cause the application to enter an unknown state.
                 *
                 * Note: If you choose to comment out this code, know that LEADTOOLS will check for the license
                 * using LTHelper.licenseDirectory.
                 */
                lt.RasterSupport.setLicenseUri("https://demo.leadtools.com/licenses/js/LEADTOOLSEVAL.txt", "EVAL", function () {
                    if (!lt.RasterSupport.kernelExpired) {
                        lt.LTHelper.log("LEADTOOLS client license set successfully");
                        setTimeout(function () {
                            _this._postBrowserPageSetup();
                        }, 10);
                    }
                    else {
                        var msg = "No LEADTOOLS License\n\nYour license file is missing, invalid or expired. LEADTOOLS will not function. Please contact LEAD Sales for information on obtaining a valid license.";
                        alert(msg);
                    }
                });
                /* If you are using a license file set in the LEADTOOLS directory, and you commented out the code above, then uncomment out this line */
                //this._postBrowserPageSetup();
            };
            DocumentViewerDemoApp.prototype.checkDemoMode = function () {
                // We can check for 3 different styles:
                // - .../[demo_name]/ in URL
                // - param ?mode=[demo_name] in params
                // - param ?mode=[demo_index] in params (1, 2, or 3)
                // by default, regular
                var mode = 0;
                // get our demo modes as an array of lowercase strings from the enum
                var demoNames = Object.keys(DemoMode)
                    .filter(function (mode) { return isNaN(parseInt(mode, 10)); })
                    .map(function (mode) { return mode.toLowerCase(); });
                var pathname = decodeURIComponent(window.location.pathname).toLowerCase();
                if (pathname) {
                    // check for the name of the demo in the url path
                    demoNames.some(function (demoName, demoIndex) {
                        var index = pathname.indexOf(demoName);
                        if (index > -1) {
                            mode = demoIndex;
                            return true;
                        }
                        return false;
                    });
                }
                // check the params. If it's in the params, it should override whatever is
                // previously found in the path.
                var paramKey = "mode=";
                var paramsString = decodeURIComponent(window.location.search).toLowerCase();
                if (!paramsString) {
                    // if no params string, it may be a hash-based URL (".../#/...?mode=...")
                    paramsString = decodeURI(window.location.href).toLowerCase();
                }
                if (paramsString) {
                    var splitQMark = paramsString.indexOf("?");
                    if (splitQMark > -1) {
                        paramsString = paramsString.substring(splitQMark + 1, paramsString.length);
                    }
                }
                if (paramsString) {
                    // look for "mode=" and the value that comes after
                    var modeIndex = paramsString.lastIndexOf(paramKey);
                    if (modeIndex > -1) {
                        paramsString = paramsString.substring(modeIndex + paramKey.length, paramsString.length);
                        var checkValue = paramsString.split("&")[0];
                        if (checkValue) {
                            demoNames.some(function (demoName, demoIndex) {
                                if (checkValue === demoName) {
                                    mode = demoIndex;
                                    return true;
                                }
                                if (parseInt(checkValue, 10) === demoIndex) {
                                    mode = demoIndex;
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
                return mode;
            };
            DocumentViewerDemoApp.prototype.setDemoMode = function () {
                var mode = this.checkDemoMode();
                var url = window.location.href;
                //var modeIndex = url.search("mode=") + 5;
                //var mode = <DemoMode>parseInt(url.charAt(modeIndex));
                this.demoMode = mode;
                switch (mode) {
                    case DemoMode.SVG:
                        this.demoName = "LEADTOOLS Document SVG Demo";
                        // Set default sample
                        this._defaultSampleDocument = "Combined.pdf";
                        // Hide bookmarks
                        $(this.navigationbar.showBookmarksBtn).hide();
                        $(this.bookmarksContainer).hide();
                        // Hide annotations stuff
                        $(".annotations").hide();
                        // Hide save
                        $("#saveDocument").hide();
                        // Hide user name
                        $("#userNameMenuItem").hide();
                        break;
                    case DemoMode.OCR:
                        this.demoName = "LEADTOOLS Document OCR Demo";
                        // Set default sample
                        this._defaultSampleDocument = "ocr1-4.tif";
                        // Hide bookmarks
                        $(this.navigationbar.showBookmarksBtn).hide();
                        $(this.bookmarksContainer).hide();
                        // Hide annotations stuff
                        $(".annotations").hide();
                        // Hide save
                        $("#saveDocument").hide();
                        // Hide user name
                        $("#userNameMenuItem").hide();
                        $("#rubberBandInteractiveMode").show();
                        $("#rubberBandInteractiveMode>.text").text("Recognize area");
                        $("#rubberBandInteractiveMode_shortcut").prop('title', 'Recognize area');
                        $("#rubberBandInteractiveMode_shortcut").show();
                        $("#ocrSave_shortcut").show();
                        break;
                    case DemoMode.Barcode:
                        this.demoName = "LEADTOOLS Document Barcode Demo";
                        // Set default sample
                        this._defaultSampleDocument = "barcodes.pdf";
                        // Hide bookmarks
                        $(this.navigationbar.showBookmarksBtn).hide();
                        $(this.bookmarksContainer).hide();
                        // Hide annotations stuff
                        $(".annotations").hide();
                        // Hide save
                        $("#saveDocument").hide();
                        // Hide user name
                        $("#userNameMenuItem").hide();
                        // Hide all references to text.
                        $("#exportText").hide();
                        $("#editMenuItem").hide();
                        $("#currentPageGetText").hide();
                        $("#allPagesGetText").hide();
                        $("#selectTextMode").hide();
                        $("#selectTextMode_shortcut").hide();
                        $("#showTextIndicators").hide();
                        if (DocumentViewerDemoApp.isMobileVersion) {
                            $(".footerTextControls").hide();
                        }
                        $("#readPageBarcodes").show();
                        $("#readAllBarcodes").show();
                        $("#rubberBandInteractiveMode").show();
                        $("#rubberBandInteractiveMode>.text").text("Select barcode area");
                        $("#rubberBandInteractiveMode_shortcut").prop('title', 'Select barcode area');
                        $("#rubberBandInteractiveMode_shortcut").show();
                        $("#processAllPages_shortcut").prop('title', 'Read all barcodes');
                        $("#processAllPages_shortcut").show();
                        break;
                    default:
                        this.demoName = "LEADTOOLS Document Viewer Demo";
                        this.demoMode = DemoMode.Default;
                        this._defaultSampleDocument = "Leadtools.pdf";
                        $("#demoDescription").show();
                        // Show annotations stuff
                        $(".annotations").show();
                        $("#saveToCache").show();
                        $("#saveCurrentView").show();
                        break;
                }
            };
            DocumentViewerDemoApp.prototype.Init = function () {
                var _this = this;
                // Demo parts
                this._filePart = new DocumentViewerDemo.FilePart(this);
                this._editPart = new DocumentViewerDemo.EditPart(this);
                this._viewPart = new DocumentViewerDemo.ViewPart(this);
                this._pagePart = new DocumentViewerDemo.PagePart(this);
                this._interactivePart = new DocumentViewerDemo.InteractivePart(this);
                this._annotationsPart = new DocumentViewerDemo.AnnotationsPart(this);
                this._attachmentsPart = new DocumentViewerDemo.AttachmentsPart(this);
                // Use document history, keep last 10 document
                this._historyPart = new DocumentViewerDemo.HistoryPart(this, 10);
                this.redactionDocumentDlg.onApplyOptions = this._annotationsPart.redactionOnApplyOptions;
                this.preferencesPart = new DocumentViewerDemo.PreferencesPart(this);
                // Init the document viewer...
                this.initDocumentViewer();
                this._annotationsPart.initAutomation();
                this.commandsBinder = new DocumentViewerDemo.CommandsBinder(this._documentViewer);
                this._filePart.bindElements();
                this._editPart.bindElements();
                this._viewPart.bindElements();
                this._pagePart.bindElements();
                this._interactivePart.bindElements();
                this._annotationsPart.bindElements();
                this._attachmentsPart.bindElements();
                this._historyPart.bindElements();
                this.commandsBinder.bindActions();
                // Init the UI
                this.updateDemoUIState();
                // Load attachments by default
                this.loadDocumentOptions.loadAttachmentsMode = lt.Document.DocumentLoadAttachmentsMode.asAttachments;
                // If a user token is required then we must pass it in a custom header to the service
                if (this._userToken) {
                    this.hookPrepareAjax = true;
                }
                // Before starting, verify that the service is hooked up
                this.beginBusyOperation();
                this.loadingDlg.show(false, false, "Verifying Service Connection...", null, function () {
                    // The Document Library contains properties to set that will connect to the Document Service.
                    // However, sometimes these values may need to be specified outside of the client side code, like in a configuration file.
                    // Here we show how that approach is used, and provide manual setting of the properties as a backup.
                    $.getJSON("./serviceConfig.json", { _: new Date().getTime() })
                        .done(function (json) {
                        // You can set the directory in which to check the license (client side)
                        // commented out, because we're using the default value ("./LEADTOOLS")
                        //lt.LTHelper.licenseDirectory = json["licenseDirectory"];
                        _this.initFromJSON(json);
                    })
                        .fail(function () {
                        // You can set the directory in which to check the license (client side)
                        // commented out, because we're using the default value ("./LEADTOOLS")
                        //lt.LTHelper.licenseDirectory = "leadtools_license_dir";
                        // The json configuration file wasn't found. Just manually set.
                        _this.initFromJSON(null);
                    })
                        .always(function () {
                        // Regardless of what happens, this runs after.
                        _this.autoRedactionDlg = new HTML5Demos.Dialogs.AutoRedactionDlg(_this);
                        var hasService = (lt.Document.DocumentFactory.serviceHost && lt.Document.DocumentFactory.serviceHost.length > 0) ||
                            (lt.Document.DocumentFactory.servicePath && lt.Document.DocumentFactory.servicePath.length > 0);
                        if (hasService) {
                            _this.createServiceHeartbeat();
                            lt.Document.DocumentFactory.verifyService()
                                .done(function (response) {
                                var serviceInfo = "Service name: '" + response.serviceName + "'";
                                serviceInfo += " version: '" + response.serviceVersion + "'";
                                serviceInfo += " platform: '" + response.servicePlatform + "'";
                                serviceInfo += " OS: '" + response.serviceOperatingSystem + "'";
                                lt.LTHelper.log(serviceInfo);
                                var message = [];
                                // Check if the LEADTOOLS license on the server is usable, otherwise, show a warning
                                if (!response.isLicenseChecked) {
                                    // The server has failed to check the license, could be an invalid license or one that does not exist
                                    message = ["Warning!", "The LEADTOOLS License used in the service could not be found. This demo may not function as expected."];
                                    window.alert(message.join("\n\n"));
                                    lt.LTHelper.logWarning(message.join(" "));
                                }
                                else if (response.isLicenseExpired) {
                                    // The server has detected that the license used has expired
                                    message = ["Warning!", "The LEADTOOLS Kernel has expired. This demo may not function as expected."];
                                    window.alert(message.join("\n\n"));
                                    lt.LTHelper.logWarning(message.join(" "));
                                }
                                if (!response.isCacheAccessible) {
                                    // The cache directory set in the .config for the server doesn't exist or has improper permissions
                                    message = ["Warning!", "The server's cache directory does not exist or cannot be written to. This demo may not function as expected."];
                                    window.alert(message.join("\n\n"));
                                    lt.LTHelper.logWarning(message.join(" "));
                                }
                                if (response.kernelType != null && response.kernelType != "Release") {
                                    // If the kernel is not release, log it (for debugging)
                                    lt.LTHelper.log("Server LEADTOOLS Kernel type: " + response.kernelType);
                                }
                                if (response.ocrEngineStatus !== lt.Document.OcrEngineStatus.ready) {
                                    // The OCR Engine on the service is not working properly
                                    if (response.ocrEngineStatus === lt.Document.OcrEngineStatus.unset)
                                        lt.LTHelper.logWarning("The LEADTOOLS OCR Engine Runtime was not set on the service. OCR is not supported.");
                                    else if (response.ocrEngineStatus === lt.Document.OcrEngineStatus.error)
                                        lt.LTHelper.logError("The LEADTOOLS OCR Engine setup experienced an error. OCR is not supported.");
                                }
                                var queryString = lt.Demos.Utils.Network.queryString;
                                var cacheIdArray = queryString["cacheId"] || queryString["cacheid"];
                                var fileUrl = queryString['fileUrl'];
                                if (cacheIdArray) {
                                    // The demo is called from another demo (Comparison, External Storage, Virtual Document)
                                    _this.loadCachedDocument(cacheIdArray[0], false);
                                }
                                else if (fileUrl) {
                                    lt.LTHelper.log("Loading initial document from '" + fileUrl[0] + "'. If this is the incorrect URL, check your values in the URL");
                                    // If a file URL query string parameter exists, and we weren't called from another demo, load the file.
                                    var loadOptions = _this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                                    loadOptions.loadAttachmentsMode = _this.loadDocumentOptions.loadAttachmentsMode;
                                    _this.loadDocument(fileUrl[0], null, loadOptions);
                                }
                                else {
                                    // Load default sample, which is on the server root.
                                    // We will need to remove the ServiceApiPath, so make sure it is set correctly.
                                    var defaultDocument = HTML5Demos.Dialogs.OpenDocumentFromUrlDlg.getSampleUrl(_this._defaultSampleDocument);
                                    lt.LTHelper.log("Loading initial document from '" + defaultDocument + "'. If this is the incorrect URL, check your values in serviceConfig.json");
                                    var loadOptions = _this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                                    loadOptions.loadAttachmentsMode = _this.loadDocumentOptions.loadAttachmentsMode;
                                    _this.loadDocument(defaultDocument, null, loadOptions);
                                }
                                _this.resetServiceHeartbeat(_this.serviceHeartbeatStartEnabled);
                                window.setTimeout(function () {
                                    if (queryString['redact']) {
                                        var redactOptions = _this.documentViewer.document.annotations.redactionOptions.clone();
                                        redactOptions.viewOptions.mode = 2;
                                        redactOptions.convertOptions.mode = 2;
                                        _this.redactionDocumentDlg.show(redactOptions);
                                    }
                                }, 300);
                            })
                                .fail(function (jqXHR, statusText, errorThrown) {
                                window.alert("Cannot reach the LEADTOOLS Document Service.\n\nPlease Make sure LEADTOOLS DocumentService is running\n - Examples/Document/JS/DocumentServiceDotNet\n - Examples/Document/JS/DocumentServiceJava\nand verify that the service path is correct, then refresh the application.");
                                _this.endBusyOperation();
                            });
                        }
                        else {
                            _this.loadDocumentMode = lt.Document.DocumentLoadMode.local;
                            var loadOptions = _this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                            loadOptions.loadAttachmentsMode = _this.loadDocumentOptions.loadAttachmentsMode;
                            _this.loadDocument("https://demo.leadtools.com/images/pdf/leadtools.pdf", null, loadOptions);
                        }
                    });
                });
            };
            Object.defineProperty(DocumentViewerDemoApp.prototype, "hookPrepareAjax", {
                get: function () {
                    return this._logAjax;
                },
                set: function (value) {
                    var _this = this;
                    if (value && this._prepareAjaxEventHandler == null) {
                        // Add our handler to DocumentFactory.prepareAjax
                        this._prepareAjaxEventHandler = lt.Document.DocumentFactory.prepareAjax.add(function (sender, e) { return _this.prepareAjaxHandler(sender, e); });
                    }
                    else if (!value && this._prepareAjaxEventHandler != null) {
                        // If we are using a user token, then we must use prepare AJAX
                        if (this._userToken) {
                        }
                        else {
                            // Remove our handler to DocumentFactory.prepareAjax
                            lt.Document.DocumentFactory.prepareAjax.remove(this._prepareAjaxEventHandler);
                            this._prepareAjaxEventHandler = null;
                        }
                    }
                    // And log
                    this._logAjax = value;
                },
                enumerable: false,
                configurable: true
            });
            // DocumentFactory.prepareAjax event handler to inspect (or modify) all calls made to DocumentService
            DocumentViewerDemoApp.prototype.prepareAjaxHandler = function (sender, e) {
                // If we have a user token, pass it in a custom header
                if (this._userToken && !e.isLocalResource) {
                    // Yes, add to the headers. If headers do not exist, initialize first
                    if (!e.settings.headers) {
                        e.settings.headers = {};
                    }
                    e.settings.headers["user-token"] = this._userToken;
                }
                if (!this._logAjax)
                    return;
                // In this demo, we will collect information and output the result into the console
                // Show the Leadtools.Document class and method making the call
                var msg = "documentFactory.prepareAjax " + e.sourceClass + "." + e.sourceMethod;
                if (this._userToken) {
                    msg += " userToken:" + this._userToken;
                }
                if (e.isLocalResource) {
                    msg += " localResource";
                }
                // Parse the message for more info
                // If this is a POST method, the data is in a string, otherwise, it is an object.
                var dataObj;
                if (e.settings.type == "POST") {
                    if (e.settings.data instanceof FormData) {
                        // This is form data for upload most probably. Show the URL
                        msg += " FormData";
                    }
                    else {
                        dataObj = JSON.parse(e.settings.data);
                    }
                }
                else {
                    dataObj = e.settings.data;
                }
                // Here, we will parse some of the data
                if (dataObj && (dataObj["uri"] || dataObj["documentId"])) {
                    if (e.sourceMethod == "LoadFromUri") {
                        // Load from URL, get the URL being used
                        msg += " uri:" + dataObj["uri"];
                    }
                    else {
                        // Everything else will have a document ID
                        var documentId = dataObj["documentId"];
                        if (documentId) {
                            msg += " documentId:" + documentId;
                        }
                        // Most will have a page number (for example, GetSvg or GetImage)
                        var pageNumber = dataObj["pageNumber"];
                        if (pageNumber) {
                            msg += " pageNumber:" + pageNumber;
                        }
                        // Thumbnails grid use first and last page number
                        var firstPageNumber = dataObj["firstPageNumber"];
                        var lastPageNumber = dataObj["lastPageNumber"];
                        if (firstPageNumber && lastPageNumber) {
                            msg += " firstPageNumber:" + firstPageNumber + " lastPageNumber:" + lastPageNumber;
                        }
                    }
                }
                else {
                    // If we don't have any data, just output the url.
                    msg += " uri:" + e.settings.url;
                }
                lt.LTHelper.log(msg);
            };
            DocumentViewerDemoApp.prototype.initFromJSON = function (json) {
                // Change the path from our client side to service routing
                lt.Document.DocumentFactory.serviceHost = (json && json["serviceHost"] !== undefined) ? json["serviceHost"] : null;
                lt.Document.DocumentFactory.servicePath = (json && json["servicePath"] !== undefined) ? json["servicePath"] : null;
                lt.Document.DocumentFactory.serviceApiPath = (json && json["serviceApiPath"] !== undefined) ? json["serviceApiPath"] : "api";
                // Set local proxy url template (Used in local load mode)
                lt.Document.DocumentFactory.localProxyUrlTemplate = (json && json["localProxyUrlTemplate"] !== undefined) ? json["localProxyUrlTemplate"] : null;
                this.getDemoFiles();
                if (json) {
                    // Set possible links to other applications
                    this.documentCompareLocation = json["documentCompare"] || null;
                    this.documentComposerLocation = json["documentComposer"] || null;
                }
                var openFromDocStorageDlg = this.openFromDocumentStorageDlg;
                if (json) {
                    // Set up Google Drive credentials
                    var googleClientId = json["GoogleDriveLoad_ClientID"];
                    var googleApiKey = json["GoogleDriveLoad_APIKey"];
                    if (googleClientId && googleApiKey) {
                        var googleDriveHelper = openFromDocStorageDlg.googleDriveHelper;
                        if (googleDriveHelper)
                            googleDriveHelper.registerForLoad(googleClientId, googleApiKey);
                    }
                }
                openFromDocStorageDlg.init();
                if (json) {
                    var heartbeatJson = json["heartbeatDefaults"];
                    if (heartbeatJson) {
                        try {
                            var startEnabledJson = heartbeatJson["startEnabled"];
                            if (startEnabledJson)
                                this.serviceHeartbeatStartEnabled = startEnabledJson;
                            var startTimerJson = heartbeatJson["startTimer"];
                            if (startTimerJson)
                                this.serviceHeartbeatStartTimer = parseInt(startTimerJson, 10);
                            var intervalTimerJson = heartbeatJson["intervalTimer"];
                            if (intervalTimerJson)
                                this.serviceHeartbeatIntervalTimer = parseInt(intervalTimerJson, 10);
                            var inactivityTimerJson = heartbeatJson["inactivityTimer"];
                            if (inactivityTimerJson)
                                this.serviceHeartbeatAutoPauseTimer = parseInt(inactivityTimerJson, 10);
                            var failureMessageJson = heartbeatJson["failureMessage"];
                            if (failureMessageJson)
                                this.serviceHeartbeatFailureMessage = failureMessageJson;
                        }
                        catch (e) { }
                    }
                }
                if (json && json['presetExpressions']) {
                    var expressionList_1 = [];
                    var unparsedExpressions = json['presetExpressions'];
                    unparsedExpressions.forEach(function (obj) {
                        var name = obj['name'];
                        var regex = obj['regex'];
                        var checked = obj['checked'];
                        if (!name || !regex)
                            return;
                        expressionList_1.push({
                            name: name,
                            regex: regex,
                            checked: checked
                        });
                    });
                    this.redactionDocumentDlg.presetOptions = expressionList_1;
                }
            };
            Object.defineProperty(DocumentViewerDemoApp.prototype, "useCSSTransitions", {
                get: function () {
                    return this._useCSSTransitions;
                },
                set: function (value) {
                    if (this._useCSSTransitions === value)
                        return;
                    this._useCSSTransitions = value;
                    this.updateUseCSSTransitions();
                },
                enumerable: false,
                configurable: true
            });
            DocumentViewerDemoApp.prototype.updateUseCSSTransitions = function () {
                if (this.useElements && lt.LTHelper.supportsCSSTransitions) {
                    var imageViewer = this._documentViewer.view.imageViewer;
                    this._cssTransitionsCallbackPending = false;
                    if (this._useCSSTransitions) {
                        lt.LTHelper.addClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        lt.LTHelper.addClass(imageViewer.viewDiv, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        if (imageViewer.passthroughDiv)
                            lt.LTHelper.addClass(imageViewer.passthroughDiv, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        imageViewer.elementsUpdated.add(this.imageViewer_elementsUpdatedCSS);
                    }
                    else {
                        this._cssTransitionsStopListening();
                        lt.LTHelper.removeClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        lt.LTHelper.removeClass(imageViewer.viewDiv, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        if (imageViewer.passthroughDiv)
                            lt.LTHelper.removeClass(imageViewer.passthroughDiv, DocumentViewerDemoApp._cssTransformsReadyCanvasClass);
                        imageViewer.elementsUpdated.remove(this.imageViewer_elementsUpdatedCSS);
                    }
                }
            };
            DocumentViewerDemoApp.prototype._cssTransitionsStopListening = function () {
                this._cssTransitionsCallbackPending = false;
                var imageViewer = this._documentViewer.view.imageViewer;
                imageViewer.viewDiv.removeEventListener("transitionend", this._cssTransitionsEnded, false);
                lt.LTHelper.removeClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsHideCanvasClass);
            };
            DocumentViewerDemoApp.prototype.createServiceHeartbeat = function () {
                if (this.serviceHeartbeat)
                    return;
                this.serviceHeartbeat = new lt.Demos.Utils.ServiceHeartbeat({
                    // Treat start/resume as the same
                    startTimeout: this.serviceHeartbeatStartTimer,
                    resumeTimeout: this.serviceHeartbeatStartTimer,
                    interval: this.serviceHeartbeatIntervalTimer,
                    autoPauseInteractionTimeout: this.serviceHeartbeatAutoPauseTimer,
                    requestSettings: null
                });
                this.serviceHeartbeat.preRequest.add(this.beforeServiceHeartbeat);
                this.serviceHeartbeat.postRequest.add(this.afterServiceHeartbeat);
            };
            DocumentViewerDemoApp.prototype.resumeServiceHeartbeat = function () {
                if (this.serviceHeartbeat) {
                    this.serviceHeartbeat.resume();
                }
            };
            DocumentViewerDemoApp.prototype.resetServiceHeartbeat = function (onOff) {
                if (this.serviceHeartbeat) {
                    this.serviceHeartbeat.stop();
                    this.serviceHeartbeat.startTimeout = this.serviceHeartbeatStartTimer;
                    this.serviceHeartbeat.resumeTimeout = this.serviceHeartbeatStartTimer;
                    this.serviceHeartbeat.interval = this.serviceHeartbeatIntervalTimer;
                    this.serviceHeartbeat.autoPauseInteractionTimeout = this.serviceHeartbeatAutoPauseTimer;
                    if (onOff)
                        this.serviceHeartbeat.start();
                }
            };
            DocumentViewerDemoApp.prototype.showServiceFailure = function () {
                var message = this.serviceHeartbeatFailureMessage || DocumentViewerDemoApp.serviceHeartbeatFailureMessage_default;
                message = message.replace("${documentId}", this.documentViewer.hasDocument ? this.documentViewer.document.documentId : "[null]");
                alert(message);
                lt.LTHelper.logError(message);
                if (this.serviceHeartbeat) {
                    this.serviceHeartbeat.stop();
                }
            };
            // Create the document viewer
            DocumentViewerDemoApp.prototype.initDocumentViewer = function () {
                var _this = this;
                // For interpolation
                lt.Controls.ImageViewer.imageProcessingLibrariesPath = "./Common";
                var createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
                // Set the UI part where the main view is displayed
                createOptions.viewContainer = document.getElementById("imageViewerDiv");
                // Set the UI part where the thumbnails are displayed
                createOptions.thumbnailsContainer = document.getElementById("thumbnails");
                // Set the UI part where the bookmarks are displayed (Set bookmarks container will show them in simple list)
                // createOptions.bookmarksContainer = document.getElementById("bookmarks");
                createOptions.useAnnotations = this.demoMode == DemoMode.Default;
                // Now create the viewer
                try {
                    this._documentViewer = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);
                }
                catch (e) {
                    // Backup error handling
                    alert("DocumentViewer creation failed. Please use a supported browser.");
                    lt.LTHelper.logError(e);
                    return;
                }
                // Uncomment to use Ajax to load Images, instead of the typical image.src way
                // You can also change this value from Preferences/Document Viewer options dialog.
                // If we are using a user token, then must use AJAX image loading to pass it in a custom header to the service
                this._documentViewer.useAjaxImageLoading = (this._userToken) ? true : false;
                if (this._documentViewer.view != null) {
                    this.useSvgBackImage = this._documentViewer.view.useSvgBackImage;
                }
                // By default, update current page number on activity (clicks) as well as percent visibility.
                // Change to `false` to just update on activity (old behavior)
                //this._documentViewer.smartCurrentPageNumber = false;
                // UseElements Mode
                this._useElements = this._documentViewer.view.imageViewer.useElements;
                // Speeding up the Annotations
                this._documentViewer.view.imageViewer.enableRequestAnimationFrame = true;
                // Set the maximum raster image size to render in local mode in the following conditions:
                // - Internet Explorer and Edge (Chakra) are very slow at rendering such pages
                // - Firefox cannot create a Canvas with either width or height greater than 8000
                if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer || lt.LTHelper.browser === lt.LTBrowser.edge) {
                    this._documentViewer.maximumPDFRenderingRasterPagePixelSize = 3500;
                }
                else if (lt.LTHelper.browser === lt.LTBrowser.firefox) {
                    this._documentViewer.maximumPDFRenderingRasterPagePixelSize = 4000;
                }
                // Lazy loading can be used for the view and thumbnails to only initially load what is on screen
                // Disabled by default and can be enabled with this code (or from Preferences/Document Viewer Options dialog)
                this._documentViewer.view.lazyLoad = true;
                if (this._documentViewer.thumbnails)
                    this._documentViewer.thumbnails.lazyLoad = true;
                // Set a custom size for viewing thumbnails and enable interpolation if PDF client-side rendering is used
                if (this._documentViewer.thumbnails) {
                    this._documentViewer.thumbnails.maximumSize = lt.LeadSizeD.create(128, 128);
                    this._documentViewer.thumbnails.pdfRenderingInterpolationMode = lt.Controls.InterpolationMode.resample;
                }
                // Set the user name
                this._documentViewer.userName = "Author";
                this._documentViewer.view.preferredItemType = this.preferencesPart.preferredItemType;
                var logRenderErrors = function (sender, e) {
                    var item = e.item != null ? e.item.imageViewer.items.indexOf(e.item) : -1;
                    var message = "Error during render item " + item + " part " + (e.part) + ": " + (e.error.message);
                    lt.LTHelper.logError({ message: message, error: e.error });
                };
                var imageViewer = this._documentViewer.view.imageViewer;
                // Helps with debugging of there was a rendering error
                imageViewer.renderError.add(logRenderErrors);
                if (this._documentViewer.thumbnails && this._documentViewer.thumbnails.imageViewer)
                    this._documentViewer.thumbnails.imageViewer.renderError.add(logRenderErrors);
                imageViewer.interpolation.add(function (sender, e) {
                    // For errors during the interpolation command
                    if (e.error) {
                        var message = "Interpolation: " + (e.error.message);
                        throw new Error(message);
                    }
                });
                if (this.useElements) {
                    this.updateUseCSSTransitions();
                }
                this._documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveAutoPan, null);
                this._documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom, null);
                // Set view mode to svg
                this._viewPart.setViewMode(true);
                // See if we need to enable inertia scroll
                if (this.preferencesPart.enableInertiaScroll)
                    this.toggleInertiaScroll(true);
                this._operationErrors = [];
                this._operationHandler = this._documentViewer.operation.add(function (sender, e) { return _this.documentViewer_Operation(sender, e); });
                // Hook to a post render handler, to render text indicators
                this._documentViewer.view.imageViewer.postRenderItem.add(function (sender, e) { return _this.imageViewer_PostRenderItem(sender, e); });
                if (this._documentViewer.thumbnails != null)
                    this._documentViewer.thumbnails.imageViewer.postRenderItem.add(function (sender, e) { return _this.imageViewer_PostRenderItem(sender, e); });
                // Set runLinkKeyModifier for the page links interactive mode (Ctrl + Click, will run page links)
                var imageViewerInteractiveModes = imageViewer.interactiveModes;
                imageViewerInteractiveModes.beginUpdate();
                for (var i = 0; i < imageViewerInteractiveModes.count; i++) {
                    var mode = imageViewerInteractiveModes.item(i);
                    if (mode.id == lt.Document.Viewer.DocumentViewer.pageLinksInteractiveModeId) {
                        mode.runLinkKeyModifier = lt.Controls.Keys.control;
                    }
                }
                imageViewerInteractiveModes.endUpdate();
                // Set up the ImageViewer keydown to delete annotation
                var parentDiv = imageViewer.interactiveService.eventsSource;
                var $parentDiv = $(parentDiv);
                $parentDiv.on("mousedown pointerdown", function (e) {
                    if (parentDiv !== document.activeElement)
                        parentDiv.focus();
                });
                $parentDiv.on("keydown", function (e) {
                    _this._annotationsPart.interactiveService_keyDown(e);
                });
            };
            // Update the UI state of the app
            DocumentViewerDemoApp.prototype.updateDemoUIState = function () {
                var hasDocument = this._documentViewer.hasDocument;
                if (hasDocument) {
                    if (lt.Demos.Utils.Visibility.isHidden($(this.imageViewerContainerDiv))) {
                        $(this.imageViewerContainerDiv).show();
                        this._documentViewer.view.imageViewer.updateTransform();
                    }
                    if ($(this.navigationbar.showThumbnailsBtn).is(":disabled"))
                        $(this.navigationbar.showThumbnailsBtn).prop("disabled", false);
                    if ($(this.navigationbar.showAnnotationsListControlsBtn).is(":disabled"))
                        $(this.navigationbar.showAnnotationsListControlsBtn).prop("disabled", false);
                    if (this._documentViewer.document.isStructureSupported) {
                        if ($(this.navigationbar.showBookmarksBtn).is(":disabled"))
                            $(this.navigationbar.showBookmarksBtn).prop("disabled", false);
                    }
                    else {
                        $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                        if (!($(this.navigationbar.showBookmarksBtn).is(":disabled")))
                            $(this.navigationbar.showBookmarksBtn).prop("disabled", true);
                        if (!lt.Demos.Utils.Visibility.isHidden($(this.bookmarksContainer)))
                            $(this.bookmarksContainer).hide();
                    }
                    if (this._documentViewer.document.attachments.count > 0) {
                        if ($(this.navigationbar.showAttachmentsBtn).is(":disabled"))
                            $(this.navigationbar.showAttachmentsBtn).prop("disabled", false);
                    }
                    else {
                        $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                        if (!($(this.navigationbar.showAttachmentsBtn).is(":disabled")))
                            $(this.navigationbar.showAttachmentsBtn).prop("disabled", true);
                        if (!lt.Demos.Utils.Visibility.isHidden($(this.attachmentsContainer)))
                            $(this.attachmentsContainer).hide();
                    }
                    this._annotationsPart.updateAnnotationsControlsVisiblity();
                    // If we have no pages, just attachments then show the attachments panel, otherwise, the thumbnails panel
                    if (this._documentViewer.document.pages.count == 0 && this._documentViewer.document.attachments.count > 0) {
                        this.showContainer(this.attachmentsContainer, false);
                    }
                    else if (this._documentViewer.thumbnails) {
                        this.showContainer(this.thumbnailsContainer, false);
                    }
                }
                else {
                    if (!lt.Demos.Utils.Visibility.isHidden($(this.imageViewerContainerDiv)))
                        $(this.imageViewerContainerDiv).hide();
                    $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                    if (!($(this.navigationbar.showThumbnailsBtn).is(":disabled")))
                        $(this.navigationbar.showThumbnailsBtn).prop("disabled", true);
                    if (!lt.Demos.Utils.Visibility.isHidden($(this.thumbnailsContainer)))
                        $(this.thumbnailsContainer).hide();
                    $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                    if (!($(this.navigationbar.showBookmarksBtn).is(":disabled")))
                        $(this.navigationbar.showBookmarksBtn).prop("disabled", true);
                    if (!lt.Demos.Utils.Visibility.isHidden($(this.bookmarksContainer)))
                        $(this.bookmarksContainer).hide();
                    $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                    if (!($(this.navigationbar.showAttachmentsBtn).is(":disabled")))
                        $(this.navigationbar.showAttachmentsBtn).prop("disabled", true);
                    if (!lt.Demos.Utils.Visibility.isHidden($(this.attachmentsContainer)))
                        $(this.attachmentsContainer).hide();
                    $(this.navigationbar.showAnnotationsListControlsBtn).removeClass("activeNavigationbarBtn");
                    if (!($(this.navigationbar.showAnnotationsListControlsBtn).is(":disabled")))
                        $(this.navigationbar.showAnnotationsListControlsBtn).prop("disabled", true);
                    if (!lt.Demos.Utils.Visibility.isHidden($(this.annotationsListControlsContainer)))
                        $(this.annotationsListControlsContainer).hide();
                }
                // Set the links to the other demos, if applicable
                var cachedDocument = hasDocument && this.documentViewer.document.dataType != lt.Document.DocumentDataType.transient;
                var urlEnd = cachedDocument ? "?cacheId=" + this.documentViewer.document.documentId : "";
                $(this.documentCompareLocationLink).toggle(!!this.documentCompareLocation && cachedDocument).attr("href", !!this.documentCompareLocation && cachedDocument ? this.documentCompareLocation + urlEnd : "#");
                $(this.documentComposerLocationLink).toggle(!!this.documentComposerLocation && cachedDocument).attr("href", !!this.documentComposerLocation && cachedDocument ? this.documentComposerLocation + urlEnd : "#");
                $(this._editPart.findTextPanel.panel).removeClass('visiblePanel');
                this.updateUIState();
            };
            DocumentViewerDemoApp.prototype.updateUIState = function () {
                this.commandsBinder.run();
                this.updateContainers();
            };
            DocumentViewerDemoApp.prototype.showServiceError = function (message, jqXHR, statusText, errorThrown) {
                var serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
                var serviceMessage;
                var showAlert = true;
                if (!serviceError.isParseError && !serviceError.isBrowserError && !serviceError.isError && !!serviceError.methodName && !!serviceError.exceptionType) {
                    var parts = [];
                    parts.push(serviceError.detail);
                    parts.push("\nMethod name: " + serviceError.methodName);
                    parts.push("Exception type: " + serviceError.exceptionType);
                    if (serviceError.exceptionType.indexOf("Leadtools") != -1) {
                        // This is a LEADTOOLS error, get the details
                        parts.push("Code: " + serviceError.code);
                    }
                    if (serviceError.link) {
                        parts.push("Link: " + serviceError.link);
                        lt.LTHelper.logError("Service Error - Help Link:");
                        lt.LTHelper.logError(serviceError.link);
                        lt.LTHelper.logError(serviceError);
                    }
                    else {
                        lt.LTHelper.logError("Service Error");
                        lt.LTHelper.logError(serviceError);
                    }
                    parts.push("\nInformation available in the console.");
                    serviceMessage = parts.join("\n");
                }
                else {
                    if (serviceError.isParseError || serviceError.isBrowserError) {
                        serviceMessage = serviceError.errorThrown;
                    }
                    else if (serviceError.isError) {
                        serviceMessage = (serviceError.statusCode) ? (serviceError.statusCode + " " + serviceError.errorThrown) : serviceError.errorThrown;
                    }
                    else if (serviceError.isTimeoutError || (serviceError.jqXHR && serviceError.jqXHR.status === 0)) {
                        showAlert = false;
                        this.showServiceFailure();
                    }
                    else {
                        serviceMessage = "The request failed for an unknown reason. Check the connection to the Document Service.";
                    }
                }
                if (showAlert) {
                    window.alert(message + "\n" + serviceMessage);
                }
            };
            DocumentViewerDemoApp.prototype.setDocument = function (document) {
                this._annotationsPart.closeDocument();
                // Check if the document is encrypted
                if (document.isEncrypted && !document.isDecrypted) {
                    // This document requires a password
                    this.endBusyOperation();
                    this.decryptDocument(document);
                }
                else {
                    this.checkParseStructure(document);
                }
            };
            DocumentViewerDemoApp.prototype.decryptDocument = function (document) {
                var _this = this;
                this.inputDlg.showWith("Enter Password", "This document is encrypted. Enter the password to decrypt it.", null, true, false);
                this.inputDlg.onApply = function (password) {
                    var decryptPromise = document.decrypt(password);
                    decryptPromise.done(function () {
                        _this.beginBusyOperation();
                        _this.loadingDlg.show(false, false, "Set Document...", null, function () {
                            _this.checkParseStructure(document);
                        });
                    });
                    decryptPromise.fail(function (jqXHR, statusText, errorThrown) {
                        _this.showServiceError("Error decrypting the document.", jqXHR, statusText, errorThrown);
                        _this.inputDlg.show();
                    });
                    return true;
                };
            };
            DocumentViewerDemoApp.prototype.checkParseStructure = function (document) {
                // See if we need to parse the document structure
                if (document.isStructureSupported) {
                    if (document.structure.isParsed) {
                        this.checkLoadAnnotationsFile(document);
                        // Customize bookmarks list
                        this.populateBookmarks(document.structure);
                    }
                    else {
                        this.parseStructure(document);
                    }
                }
                else {
                    // Structure not supported
                    this.clearBookmarks();
                    this.checkLoadAnnotationsFile(document);
                }
            };
            DocumentViewerDemoApp.prototype.parseStructure = function (document) {
                var _this = this;
                document.structure.parse()
                    .done(function (document) {
                    _this.checkLoadAnnotationsFile(document);
                    // Customize bookmarks list
                    _this.populateBookmarks(document.structure);
                })
                    .fail(function (jqXHR, statusText, errorThrown) {
                    _this.showServiceError("Error parsing the document structure.", jqXHR, statusText, errorThrown);
                    _this.checkLoadAnnotationsFile(document);
                });
            };
            DocumentViewerDemoApp.prototype.populateBookmarks = function (structure) {
                this.clearBookmarks();
                var list = document.getElementById("bookmarksTree");
                if (list) {
                    if (structure != null && structure.bookmarks != null) {
                        var bookmarks = new Array(structure.bookmarks.length);
                        for (var i = 0; i < structure.bookmarks.length; i++)
                            bookmarks[i] = structure.bookmarks[i];
                        this.addBookmarks(bookmarks, list);
                    }
                }
            };
            DocumentViewerDemoApp.prototype.clearBookmarks = function () {
                var list = document.getElementById("bookmarksTree");
                if (list) {
                    for (var i = list.childNodes.length - 1; i >= 0; i--)
                        list.removeChild(list.childNodes[i]);
                }
            };
            DocumentViewerDemoApp.prototype.addBookmarks = function (bookmarks, baseElement) {
                var _this = this;
                if (bookmarks == null)
                    return;
                for (var i = 0; i < bookmarks.length; i++) {
                    var titleElement = document.createElement("li");
                    if (i + 1 == bookmarks.length)
                        lt.LTHelper.addClass(titleElement, "last");
                    // If bookmark has children, add collapse/expand checkbox
                    if (bookmarks[i].children.length > 0) {
                        lt.LTHelper.addClass(titleElement, "hasChildren");
                        var checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        // Create unique id for the checkbox
                        checkbox.id = (bookmarks[i].title + Date.now().toString()).replace(/\s/g, '');
                        // Create checkbox label
                        var checkboxLabel = document.createElement("label");
                        checkboxLabel.setAttribute("for", checkbox.id);
                        titleElement.appendChild(checkbox);
                        titleElement.appendChild(checkboxLabel);
                    }
                    // Create title span
                    var titleSpan = document.createElement("span");
                    titleSpan.textContent = bookmarks[i].title;
                    lt.LTHelper.addClass(titleSpan, "bookmark");
                    // attach current bookmark as data to the title span
                    $(titleSpan).data("bookmark", bookmarks[i]);
                    titleElement.appendChild(titleSpan);
                    baseElement.appendChild(titleElement);
                    // handle click event, to go to the selected bookmark
                    // using the attached data
                    titleSpan.onclick = function (e) { return _this.bookmarkTitleSpan_Click(e); };
                    var parentElement = titleElement;
                    if (bookmarks[i].children.length > 0) {
                        parentElement = document.createElement("ul");
                        titleElement.appendChild(parentElement);
                    }
                    this.addBookmarks(bookmarks[i].children, parentElement);
                }
            };
            DocumentViewerDemoApp.prototype.bookmarkTitleSpan_Click = function (e) {
                // Get attached data
                var bookmark = $(e.currentTarget).data("bookmark");
                this._documentViewer.gotoBookmark(bookmark);
                // Unmark all bookmarks
                lt.Demos.Utils.UI.toggleChecked($(".bookmark"), false);
                // Mark the selected one
                lt.Demos.Utils.UI.toggleChecked($(e.currentTarget), true);
            };
            DocumentViewerDemoApp.prototype.finishSetDocument = function (document) {
                var _this = this;
                var currentDocument = this._documentViewer.document;
                var autoDisposeDocumentState = this._documentViewer.autoDisposeDocument;
                var autoDisposeDocument = autoDisposeDocumentState;
                // Inform whoever is listening that we are about to set a new document in the viewer
                // This includes history
                var documentChangedCallback = this._historyPart.documentChangedCallbacks;
                if (documentChangedCallback && documentChangedCallback.changing)
                    autoDisposeDocument = documentChangedCallback.changing(this._documentViewer, currentDocument, document);
                // Remove any previous tooltips that may remain
                this.hideTooltip();
                if (document) {
                    // When disposing a virtual document, also disposal all its sub-documents
                    document.autoDisposeDocuments = autoDisposeDocument;
                    if (this.documentViewer.thumbnails) {
                        // Change the thumbnail pixel size to the larger size
                        document.images.thumbnailPixelSize = this.documentViewer.thumbnails.maximumSize.clone();
                    }
                }
                else {
                    this._annotationsPart.closeDocument();
                }
                if (this._documentViewer.view != null) {
                    this._documentViewer.view.useSvgBackImage = this.useSvgBackImage;
                }
                // If the existing document is in the history then do not dispose it, the navigation clean up will take care of it
                if (autoDisposeDocumentState != autoDisposeDocument) {
                    this._documentViewer.autoDisposeDocument = autoDisposeDocument;
                }
                // Set it in the document viewer
                try {
                    this._documentViewer.setDocument(document);
                }
                finally {
                    this._documentViewer.autoDisposeDocument = autoDisposeDocumentState;
                }
                if (this.documentViewer.thumbnails != null)
                    this.documentViewer.thumbnails.imageViewer.selectedItemsChanged.add(function (sender, e) { return _this.thumbnailsActiveItemChanged(sender, e); });
                if (document) {
                    this.setInterpolationMode(document, !this._documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.viewItemType, lt.Document.Viewer.DocumentViewerItemType.svg));
                }
                else {
                    this.clearBookmarks();
                    $(this._printElement).hide();
                }
                // Update the UI
                this.updateDemoUIState();
                // Call onResize so the DIV sizes get updated
                this.onResize(null);
                // Clear all barcodes so they aren't redrawn in a place that doesn't make sense
                this._currentBarcodes = [];
                this._allBarcodes = null;
                if (document) {
                    if (document.viewOptions == null) {
                        if (DocumentViewerDemoApp.isMobileVersion)
                            this.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitWidth, null);
                        else
                            this.documentViewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitPage, null);
                    }
                }
                this._pagePart.updateCurrentPageNumber(null);
                if (documentChangedCallback && documentChangedCallback.changed != null)
                    documentChangedCallback.changed(this._documentViewer, document);
                this._attachmentsPart.populateAttachments(document);
                this.endBusyOperation();
            };
            DocumentViewerDemoApp.prototype.checkLoadAnnotationsFile = function (document) {
                var _this = this;
                var annotations = this._loadDocumentAnnotationsFile;
                this._loadDocumentAnnotationsFile = null;
                // Check if annotations passed as file or blob - Since File extends Blob, we only need to check if the object is an instance of the base class Blob.
                if (annotations && lt.LTHelper.supportsFileReader && annotations instanceof Blob) {
                    var fileReader = new FileReader();
                    fileReader.readAsText(annotations);
                    fileReader.onload = function (ev) {
                        // done reading annotations
                        var annotations = ev.target.result;
                        if (annotations != null && annotations.length > 0) {
                            var annCodecs = new lt.Annotations.Engine.AnnCodecs();
                            var containers = annCodecs.loadAll(annotations);
                            if (containers != null && containers.length > 0) {
                                var setAnnotationsPromise = document.annotations.setAnnotations(containers);
                                setAnnotationsPromise.fail(function (jqXHR, statusText, errorThrown) {
                                    _this.showServiceError("Error setting document annotations.", jqXHR, statusText, errorThrown);
                                });
                                setAnnotationsPromise.always(function () {
                                    // Even if error occurred while setting document annotations, we should still be able to view the document without annotations
                                    _this.finishSetDocument(document);
                                });
                            }
                            else {
                                alert("No annotations could be found in the provided annotations file.");
                                _this.finishSetDocument(document);
                            }
                        }
                        else {
                            // Text is empty
                            _this.finishSetDocument(document);
                            window.alert("The provided annotations file is empty.");
                        }
                    };
                    fileReader.onerror = function () {
                        // could not read as text
                        window.alert("An error has occurred while reading annotations file as text.");
                        _this.finishSetDocument(document);
                    };
                }
                else {
                    this.finishSetDocument(document);
                }
            };
            DocumentViewerDemoApp.prototype.thumbnailsActiveItemChanged = function (sender, e) {
                // Hide thumbnails container after select page on mobile version
                if (DocumentViewerDemoApp.isMobileVersion) {
                    var visibleThumbnails = !lt.Demos.Utils.Visibility.isHidden($(this.thumbnailsContainer));
                    if (visibleThumbnails) {
                        $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                        $(this.thumbnailsContainer).hide();
                        this.updateContainers();
                    }
                }
            };
            DocumentViewerDemoApp.prototype.closeDocument = function () {
                if (this._documentViewer.document == null)
                    return;
                this.finishSetDocument(null);
            };
            DocumentViewerDemoApp.prototype._endDocumentPrint = function () {
                if (!this._documentPrintCanceled) {
                    if (this.loadingDlg && this.loadingDlg.cancelClick === this._endDocumentPrint)
                        this.loadingDlg.cancelClick = null;
                    this._documentPrintCanceled = true;
                    this.endBusyOperation();
                }
            };
            DocumentViewerDemoApp.prototype.doPrint = function (options) {
                var _this = this;
                this._documentPrintCanceled = false;
                this.beginBusyOperation();
                this.loadingDlg.progress(0);
                this.loadingDlg.cancelClick = this._endDocumentPrint;
                this.loadingDlg.show(true, true, "Preparing for print...", null, function () {
                    if (options.usePdfPrinting)
                        _this.loadingDlg.progress(100);
                    options.parent = (options.usePdfPrinting) ? document.getElementById('pdfPrintFrame') : _this._printElement;
                    // Force all the pages to be loaded by URL
                    //options.usePDFClientRendering = false;
                    // Optionally, you can specify not to automatically open the browser print dialog once the pages are ready.
                    // You are then responsible for opening it after you've done what you need to the data
                    //options.autoOpenBrowserPrint = false;
                    _this._documentViewer.print(options)
                        .done(function (data) {
                        if (!options.usePdfPrinting) {
                            var printData = data;
                            // You may modify the data here and then open the browser print yourself
                            // Otherwise, by the time this callback is called the dialog should already be open.
                            if (printData && printData.options && !printData.options.autoOpenBrowserPrint)
                                _this._documentViewer.openBrowserPrint(printData.options.parent, printData.root, printData.options.title, printData.printStyles);
                        }
                        // PDF-printing will only return an object if options.autoOpenBrowserPrint = false;
                        if (options.usePdfPrinting && !options.autoOpenBrowserPrint) {
                            // PDFPrintResult will contain a local object URI to the PDF document.
                            // If the document needed to be converted to PDF, it will also contain the document ID
                            // for the converted document in the cache.
                            //
                            // Calling PDFPrintResult.dispose() will revoke the local object URI & dispose of the converted
                            // document from the cache.
                            var pdfData = data;
                        }
                    })
                        .fail(function (err) {
                        // All errors will come here
                        _this.endBusyOperation();
                        if (_this._documentPrintCanceled && options.usePdfPrinting) {
                            // aborted, supress error.
                            return;
                        }
                        if (_this.loadingDlg.cancelClick === _this._endDocumentPrint)
                            _this.loadingDlg.cancelClick = null;
                        // Check if canceled / aborted
                        if (err) {
                            window.alert(err);
                        }
                    })
                        .always(function () {
                        if (options.usePdfPrinting)
                            _this.loadingDlg.hide();
                    })
                        .progress(function (data) {
                        if (typeof (data) === "string" && lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                            _this.loadingDlg.hide();
                        }
                        // If PDF printing is enabled, and conversion is required to natively print the PDF,
                        // the print method will fire a progress event with the RunConvertJobResult.
                        if (_this._documentPrintCanceled && data instanceof lt.Document.Converter.RunConvertJobResult)
                            lt.Document.Converter.StatusJobDataRunner.abortConvertJob(data.userToken, data.jobToken);
                    });
                });
            };
            DocumentViewerDemoApp.prototype.documentViewer_Operation = function (sender, e) {
                var index = e.pageNumber - 1;
                // If we have an error, show it
                // Printing errors are handled by the promise returned from the Print() call
                if (e.error && e.operation !== lt.Document.Viewer.DocumentViewerOperation.printPages) {
                    // If using client PDF rendering, setDocument may have an error as well
                    if (e.operation === lt.Document.Viewer.DocumentViewerOperation.setDocument && e.pageNumber === -1) {
                        var viewer = sender;
                        if (viewer.view) {
                            $(viewer.view.imageViewer.viewDiv).find(".lt-item").addClass(DocumentViewerDemoApp._elementsPageErrorClass);
                        }
                    }
                    // Check if we had this error before
                    if (this._operationErrors.indexOf(e.operation) == -1) {
                        this._operationErrors.push(e.operation);
                        var postPre = e.isPostOperation ? "Post-" : "Pre-";
                        var message = "Error in '" + (this._documentViewerOperationDictionary[e.operation]) + "' " + postPre + "operation. \n" + (e.error.message ? e.error.message : e.error);
                        window.alert(message);
                    }
                }
                switch (e.operation) {
                    case lt.Document.Viewer.DocumentViewerOperation.getThumbnail:
                    case lt.Document.Viewer.DocumentViewerOperation.getAnnotations:
                    case lt.Document.Viewer.DocumentViewerOperation.renderItemPlaceholder:
                        // We are not interested in these
                        return;
                }
                var runCommandsBinder = true;
                var updateContainers = e.isPostOperation;
                var documentViewer = sender;
                var document = (documentViewer != null) ? documentViewer.document : null;
                switch (e.operation) {
                    case lt.Document.Viewer.DocumentViewerOperation.pageTextSelectionChanged:
                    case lt.Document.Viewer.DocumentViewerOperation.detachFromDocument:
                    case lt.Document.Viewer.DocumentViewerOperation.attachToDocument:
                    case lt.Document.Viewer.DocumentViewerOperation.renderViewPage:
                    case lt.Document.Viewer.DocumentViewerOperation.renderThumbnailPage:
                        runCommandsBinder = false;
                    case lt.Document.Viewer.DocumentViewerOperation.textSelectionChanged:
                    case lt.Document.Viewer.DocumentViewerOperation.renderFoundText:
                    case lt.Document.Viewer.DocumentViewerOperation.renderSelectedText:
                    case lt.Document.Viewer.DocumentViewerOperation.loadingThumbnails:
                        updateContainers = false;
                        break;
                    default:
                        break;
                }
                switch (e.operation) {
                    case lt.Document.Viewer.DocumentViewerOperation.printPages:
                        // No errors will come here - those are handled in the promise
                        if (this._documentPrintCanceled)
                            e.abort = true;
                        if ((e.isPostOperation && e.pageNumber === 0) || this._documentPrintCanceled) {
                            this._endDocumentPrint();
                        }
                        else {
                            var printData = e.data1;
                            var progress = printData.progress;
                            if (progress) {
                                var progressInt = parseInt((progress.pagesCompleted / progress.pagesTotal * 100).toString(), 10);
                                this.loadingDlg.progress(progressInt);
                            }
                            //if (e.pageNumber !== 0 && e.data2 && !e.isPostOperation) {
                            //   // We can modify the page data for any of the printing pages to print what we like.
                            //   // Only really useful to do this in the pre-operation.
                            //   var pageData = <lt.Document.Viewer.DocumentPrintPageData>e.data2;
                            //}
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.loadingPages:
                    case lt.Document.Viewer.DocumentViewerOperation.getPage:
                        if (this.loadingDlg.isCancelled) {
                            if (e.isPostOperation) {
                                e.abort = true;
                                this.endBusyOperation();
                            }
                        }
                        if (!e.isPostOperation)
                            runCommandsBinder = false;
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.loadingPage:
                        // This occurs in elements mode when a page is about/after it has been rendered.
                        // By default, this is handled by DocumentViewer to add the lt-image-loading, lt-image-loaded and lt-image-error
                        // css classes to the item elements for visual indication.
                        //
                        // Therefore, the following is just comments on how to handle this operation.
                        //
                        // We can add trap this event and do anything we want once the page image is in view.
                        // Note that this event will occur multiple times for the same element if AutoRemoveItemElements is true any
                        // time an element is added to the DOM.
                        // Only if we have a view
                        if (!this._documentViewer.view) {
                            break;
                        }
                        if (!e.error) {
                            // No error, the state is this:
                            // e.isPostOperation = true: image is being loaded/rendered, the document viewer adds lt-image-loading and remove lt-image-loaded styles
                            // e.isPostOperation = false: image has been loaded/rendered, the document viewer adds lt-image-loaded and removes lt-image-loading styles
                            break;
                        }
                        else {
                            // An error occurred
                            if (e.pageNumber === 0) {
                                // This an error that occurred when loading the whole document, set the class in the view itself
                                // The document viewer adds lt-image-error style to the whole view lt-item.
                            }
                            else {
                                // An error for a page, the document viewer adds lt-image-error to this item.
                            }
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.attachToDocument:
                        if (!e.isPostOperation) {
                            this._viewPageRendersByIndex = [];
                            this._thumbnailsPageRendersByIndex = [];
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.setDocument:
                        this.redactionDocumentDlg.clearTextCache();
                        this.autoRedactionDlg.reset();
                        if (this._currentBarcodes.length > 0) {
                            this._currentBarcodes = [];
                            if (this._documentViewer.view) {
                                this._documentViewer.view.imageViewer.invalidate(lt.LeadRectD.empty);
                            }
                            $(this._printElement).show();
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.runCommand:
                        this._annotationsPart.handleRunCommand(e);
                        this._pagePart.handleRunCommand(e);
                        this._attachmentsPart.handleRunCommand(e);
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.loadingThumbnails:
                        !e.isPostOperation ? $(this._loadingThumbnailsBar).css("display", "block") : $(this._loadingThumbnailsBar).css("display", "none");
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.loadingAnnotations:
                        !e.isPostOperation ? $(this._loadingAnnotationsBar).css("display", "block") : $(this._loadingAnnotationsBar).css("display", "none");
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.pagesAdded:
                    case lt.Document.Viewer.DocumentViewerOperation.pagesRemoved:
                        if (e.isPostOperation) {
                            if (this._documentViewer.annotations)
                                this._annotationsPart.handleContainersAddedOrRemoved();
                            this.updateDemoUIState();
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.findText:
                        this._editPart.findTextOperationHandle(e);
                        updateContainers = e.isPostOperation && e.pageNumber == 0;
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.getText:
                        {
                            if (e.isPostOperation)
                                this.redactionDocumentDlg.addTextEntry(e);
                            if (this.getTextReason == GetTextReason.manual) {
                                // We are manually controlling the GetText loop
                                if (e.isPostOperation)
                                    this._manualGetTextPageComplete(e.pageNumber, e);
                            }
                            else if (this.getTextReason == GetTextReason.internalOperation) {
                                // This is from an internal Document.Viewer operation
                                // We should have stuff in place to handle this (see FindText above)
                                this._editPart.checkFindTextGetTextOperationHandle(e);
                            }
                            else if (this.getTextReason == GetTextReason.other) {
                                // Default case, outside of our usual control
                                this._otherGetTextHandle(e);
                            }
                            // By default, update the dialog to show the page we're getting text for
                            if (!e.isPostOperation && !e.abort && this._isInsideBusyOperation) {
                                this.loadingDlg.processing("Retrieving Text...", "Page " + e.pageNumber);
                            }
                            break;
                        }
                    case lt.Document.Viewer.DocumentViewerOperation.gotoPage:
                        lt.Demos.Utils.UI.toggleChecked($(".bookmark"), false);
                        this.hideTooltip();
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.renderViewPage:
                    case lt.Document.Viewer.DocumentViewerOperation.renderThumbnailPage:
                        if (this._countPageRenders) {
                            // If using client-side PDF rendering, the first data property is *true* if the render was cancelled (interrupted by user actions like zooming or panning)
                            var isDoneRendering = e.isPostOperation && !e.data1;
                            if (isDoneRendering) {
                                var isView = e.operation === lt.Document.Viewer.DocumentViewerOperation.renderViewPage;
                                var renders = isView ? this._viewPageRendersByIndex : this._thumbnailsPageRendersByIndex;
                                var index = e.pageNumber - 1;
                                if (renders[index]) {
                                    renders[index]++;
                                }
                                else {
                                    renders[index] = 1;
                                    lt.LTHelper.log("First " + (isView ? "View" : "Thumbnails") + " Render for page " + e.pageNumber);
                                }
                            }
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.saveToCache:
                        // This occurs in elements mode when the DocumentViewer tries to automatically save the document to the cache to
                        // go from local to service mode in certain situations. For instance, when the value of 
                        // DocumentViewer.maximumPDFRenderingRasterPagePixelSize is not 0 and a PDF document is being rendered with pages that 
                        // have raster images greater than the value
                        if (!e.isPostOperation) {
                            // Start the busy screen
                            if (!this._isInsideBusyOperation) {
                                this.beginBusyOperation();
                                this.loadingDlg.show(false, false, "Saving to cache...", null, null);
                            }
                        }
                        else {
                            this.endBusyOperation();
                            if (e.error) {
                                window.alert("Error saving to cache\n" + e.error.message);
                            }
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.pagesDisabledEnabled:
                        if (e.isPostOperation) {
                            this._annotationsPart.handlePagesDisabledEnabled();
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.createAutomation:
                        if (e.isPostOperation)
                            this._annotationsPart.handleCreateAutomation();
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.destroyAutomation:
                        if (!e.isPostOperation)
                            this._annotationsPart.handleDestroyAutomation();
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.runLink:
                        if (e.isPostOperation && !e.error) {
                            // Hide the link tip after multiple uses
                            if (this._bookmarkLinkClicks < this._bookmarkLinkClickThreshold) {
                                this._bookmarkLinkClicks++;
                                if (this._bookmarkLinkClicks === this._bookmarkLinkClickThreshold) {
                                    lt.Demos.Utils.Visibility.toggle($(this._toolTipUI.tip), false);
                                }
                            }
                            // Get the link and check if its an external one
                            var link = e.data1;
                            if (link.linkType == lt.Document.DocumentLinkType.value && link.value) {
                                this.runValueLink(link.value);
                            }
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.hoverLink:
                        if (e.isPostOperation && !e.error) {
                            if (e.data1) {
                                this.showLinkTooltip(e.pageNumber, e.data1, e.data2);
                            }
                            else {
                                this.hideTooltip();
                            }
                        }
                        break;
                    case lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged:
                        if (e.isPostOperation && e.data1) {
                            this._pagePart.updateCurrentPageNumber(e.data1);
                        }
                        else {
                            runCommandsBinder = false;
                            updateContainers = false;
                        }
                        break;
                    default:
                        break;
                }
                if (runCommandsBinder) {
                    this.commandsBinder.run();
                    this.resumeServiceHeartbeat();
                }
                if (updateContainers)
                    this.updateContainers();
            };
            DocumentViewerDemoApp.prototype.showLinkTooltip = function (sourcePageNumber, link, interactiveEventArgs) {
                if (!link || !this._documentViewer.view || !this._documentViewer.view.imageViewer)
                    return;
                var tooltipTitle = "";
                if (link.linkType == lt.Document.DocumentLinkType.value) {
                    // External, like URL or email address
                    if (!link.value)
                        return;
                    // Check if this is an email address
                    if (link.value.toLowerCase().slice(0, "mailto:".length) != "mailto:" && DocumentViewerDemoApp._emailRegEx.test(link.value))
                        tooltipTitle = "mailto:";
                    tooltipTitle += link.value;
                }
                else {
                    // lt.Document.DocumentLinkType.targetPage
                    tooltipTitle = "Page " + link.target.pageNumber.toString();
                }
                // Create tooltip content
                $(this._toolTipUI.title).text(tooltipTitle);
                lt.Demos.Utils.Visibility.toggle($(this._toolTipUI.container), true);
                this._toolTipHighlightLinkBounds = link.bounds;
                this._toolTipHighlightPageIndex = sourcePageNumber - 1;
                this._toolTipHighlightCursorPosition = interactiveEventArgs.position;
                this.updateToolTipPosition(this.getToolTipBounds());
                // Trigger a paint for the half-box we draw around the link bounds
                var imageViewer = this._documentViewer.view.imageViewer;
                // Disable transitions to prevent flashing of annotations if scrolling at the same time
                imageViewer.disableTransitions();
                imageViewer.invalidateItemByIndex(sourcePageNumber - 1);
                imageViewer.enableTransitions();
            };
            DocumentViewerDemoApp.prototype.getToolTipBounds = function () {
                var bounds = this._toolTipHighlightLinkBounds;
                if (bounds.isEmpty || this._toolTipHighlightPageIndex === -1 || !this._documentViewer.view)
                    return bounds;
                var viewer = this._documentViewer.view.imageViewer;
                if (!viewer)
                    return bounds;
                // Convert our stored bounds to pixel coordinates
                bounds = this._documentViewer.document.rectToPixels(bounds);
                var item = viewer.items.item(this._toolTipHighlightPageIndex);
                bounds = viewer.convertRect(item, lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, bounds);
                return bounds;
            };
            DocumentViewerDemoApp.prototype.updateToolTipPosition = function (bounds) {
                if (!bounds || bounds.isEmpty)
                    bounds = this.getToolTipBounds();
                if (bounds.isEmpty)
                    return;
                var container = $(this._toolTipUI.container);
                var height = container.height();
                var top = bounds.top - height - 20;
                var position = this._toolTipHighlightCursorPosition;
                var left = Math.max(Math.min(position.x, bounds.right), bounds.left);
                container.css({
                    top: top,
                    left: left
                });
            };
            DocumentViewerDemoApp.prototype.drawToolTipHighlight = function (item, ctx) {
                if (this._toolTipHighlightPageIndex === -1 || this._toolTipHighlightLinkBounds.isEmpty || this._toolTipHighlightCursorPosition.isEmpty)
                    return;
                if (!item || !this._documentViewer.view)
                    return;
                var imageViewer = item.imageViewer;
                if (!imageViewer || imageViewer !== this._documentViewer.view.imageViewer)
                    return;
                var pageIndex = imageViewer.items.indexOf(item);
                if (pageIndex !== this._toolTipHighlightPageIndex)
                    return;
                var bounds = this.getToolTipBounds();
                if (bounds.isEmpty)
                    return;
                // Update the position of the tooltip in case we zoomed in
                this.updateToolTipPosition(bounds);
                ctx.fillStyle = "#888";
                ctx.globalAlpha = .2;
                ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            };
            DocumentViewerDemoApp.prototype.hideTooltip = function () {
                // Hide the tooltip
                lt.Demos.Utils.Visibility.toggle($(this._toolTipUI.container), false);
                // Reset our state
                this._toolTipHighlightLinkBounds = lt.LeadRectD.empty;
                if (this._toolTipHighlightPageIndex !== -1) {
                    this._toolTipHighlightPageIndex = -1;
                    // Clear any drawings we may have done on the canvas
                    if (this._documentViewer.view) {
                        var index = this._toolTipHighlightPageIndex;
                        var imageViewer = this.documentViewer.view.imageViewer;
                        // Disable transitions to prevent flashing of annotations if scrolling at the same time
                        imageViewer.disableTransitions();
                        imageViewer.invalidateItemByIndex(index);
                        imageViewer.enableTransitions();
                    }
                }
            };
            DocumentViewerDemoApp.prototype.beginBusyOperation = function () {
                // Get ready ...
                this._isInsideBusyOperation = true;
            };
            Object.defineProperty(DocumentViewerDemoApp.prototype, "isInsideBusyOperation", {
                get: function () {
                    return this._isInsideBusyOperation;
                },
                enumerable: false,
                configurable: true
            });
            DocumentViewerDemoApp.prototype.endBusyOperation = function () {
                if (this._isInsideBusyOperation) {
                    this._isInsideBusyOperation = false;
                    this.loadingDlg.hide();
                    // clear the errors
                    this._operationErrors = [];
                }
            };
            DocumentViewerDemoApp.prototype.toggleInertiaScroll = function (turnOn) {
                // These commands have ImageViewerPanZoomInteractiveMode in the tag, update the value
                var commandNames = [lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom, lt.Document.Viewer.DocumentViewerCommands.interactivePan];
                for (var i = 0; i < commandNames.length; i++) {
                    var mode = this._documentViewer.commands.getCommand(commandNames[i]).tag;
                    if (mode != null) {
                        // Use "turnOn" value if defined, else toggle
                        var isEnabled = turnOn !== undefined ? turnOn : !mode.inertiaScrollOptions.isEnabled;
                        mode.inertiaScrollOptions.isEnabled = isEnabled;
                        this.preferencesPart.enableInertiaScroll = isEnabled;
                    }
                }
            };
            DocumentViewerDemoApp.prototype._otherGetTextHandle = function (e) {
                var _this = this;
                if (!e.isPostOperation) {
                    // Start the busy screen
                    if (!this._isInsideBusyOperation) {
                        this.beginBusyOperation();
                        this._otherGetTextCancelClick = this.loadingDlg.cancelClick;
                        this.loadingDlg.cancelClick = function () {
                            _this.loadingDlg.cancelClick = _this._otherGetTextCancelClick;
                            // Show a timeout so users can see the "cancel" feedback in the UI for a moment
                            setTimeout(function () {
                                _this.endBusyOperation();
                            }, 500);
                        };
                        this.loadingDlg.show(true, false, "Retrieving Text...", "Page " + e.pageNumber, null);
                    }
                }
                else {
                    this.loadingDlg.cancelClick = this._otherGetTextCancelClick;
                    this.endBusyOperation();
                }
            };
            // Manually request page text before operations like ExportText or SelectAll
            DocumentViewerDemoApp.prototype.manualGetText = function (pageNumbers, postOperationCallback) {
                var _this = this;
                // Start the busy screen
                this.beginBusyOperation();
                this.getTextReason = GetTextReason.manual;
                this._manualGetTextPostOperation = postOperationCallback;
                // Set our cancel callback to force our manual operation to complete
                this.loadingDlg.cancelClick = function () {
                    _this.loadingDlg.cancelClick = null;
                    // In case a GetText returns before our timeout does...
                    _this._manualGetTextPagesNeeded = [];
                    // Show a timeout so users can see the "cancel" feedback in the UI for a moment
                    setTimeout(function () {
                        // This does nothing if we already finished,
                        // but does the finish operations if not yet finished
                        _this._manualGetTextComplete(true, null);
                    }, 500);
                };
                if (!pageNumbers) {
                    // Get text for all pages if none were passed
                    var pageCount = this._documentViewer.pageCount;
                    pageNumbers = [];
                    for (var i = 1; i <= pageCount; i++) {
                        // Add pages that didn't have their text parsed
                        if (!this.documentViewer.text.hasDocumentPageText(i))
                            pageNumbers.push(i);
                    }
                    this._manualGetTextPagesNeeded = pageNumbers;
                }
                else {
                    // Make a copy
                    this._manualGetTextPagesNeeded = pageNumbers.slice();
                }
                this._manualGetTextPagesRequested = [];
                this.loadingDlg.show(true, false, "Start Get Text...", null, function () {
                    // Start the progression
                    _this._manualGetTextNextPage();
                });
            };
            DocumentViewerDemoApp.prototype._manualGetTextPageComplete = function (pageNumber, e) {
                // We want to avoid the scenario where we request 1-2, cancel, request 3-4, and then treat page 2 as one of ours being completed
                var index = this._manualGetTextPagesRequested.indexOf(pageNumber);
                if (index != -1) {
                    // We are confident this is from this current loop of GetText.
                    this._manualGetTextPagesRequested.splice(index, 1);
                    if (e && e.error) {
                        this._manualGetTextComplete(false, e.error);
                        return;
                    }
                }
                this._manualGetTextNextPage();
            };
            DocumentViewerDemoApp.prototype._manualGetTextNextPage = function () {
                // Check if we are already cancelled
                if (!this._manualGetTextPagesNeeded || !this._manualGetTextPagesRequested)
                    return;
                if (!this._manualGetTextPagesRequested.length && !this._manualGetTextPagesNeeded.length) {
                    // Done
                    this._manualGetTextComplete(false, null);
                    return;
                }
                // Otherwise, request page text
                var currentRequested = this._manualGetTextPagesRequested.length;
                var numToRequest = Math.min(DocumentViewerDemoApp._manualGetTextRequestLimit - currentRequested, this._manualGetTextPagesNeeded.length);
                // Up to our limit, request multiple at a time
                for (var i = 0; i < numToRequest; i++) {
                    // Get the next page
                    var pageNumber = this._manualGetTextPagesNeeded.shift();
                    this._manualGetTextPagesRequested.push(pageNumber);
                    // Run the "GetText" command
                    var textGet = lt.Document.Viewer.DocumentViewerCommands.textGet;
                    var commands = this._documentViewer.commands;
                    // The command may not need to be run because the page is disabled.
                    if (commands.canRun(textGet, pageNumber))
                        commands.run(lt.Document.Viewer.DocumentViewerCommands.textGet, pageNumber);
                    else
                        this._manualGetTextPageComplete(pageNumber, null);
                }
            };
            DocumentViewerDemoApp.prototype._manualGetTextComplete = function (canceled, error) {
                if (!error) {
                    this._documentViewer.view.imageViewer.invalidate(lt.LeadRectD.empty);
                    if (this._documentViewer.thumbnails != null)
                        this._documentViewer.thumbnails.imageViewer.invalidate(lt.LeadRectD.empty);
                }
                // Clean up for next time
                this._manualGetTextPagesNeeded = null;
                this._manualGetTextPagesRequested = null;
                var postOp = this._manualGetTextPostOperation;
                this._manualGetTextPostOperation = null;
                // Return to default reason
                this.getTextReason = GetTextReason.other;
                this.endBusyOperation();
                if (postOp)
                    postOp(canceled, error);
            };
            DocumentViewerDemoApp.prototype.setInterpolationMode = function (document, isSvg) {
                var interpolationMode = lt.Controls.InterpolationMode.none;
                // If we are viewing as SVG, then we should not do any interpolation.
                // Also don't do interpolation if we're in UseElements Mode, because all browsers (except IE) will do decent interpolation of img elements.
                if (document != null && !isSvg && (!this._useElements || (lt.LTHelper.browser === lt.LTBrowser.internetExplorer || lt.LTHelper.browser === lt.LTBrowser.edge))) {
                    // We are viewing as an image, instruct the image viewer in the view to perform interpolation to smooth out the image
                    // when zoomed out
                    // If the document is B/W, then it is faster to perform the interpolation using scale to gray. Otherwise, use resample
                    if (document.defaultBitsPerPixel == 1) {
                        interpolationMode = lt.Controls.InterpolationMode.scaleToGray;
                    }
                    else {
                        interpolationMode = lt.Controls.InterpolationMode.resample;
                    }
                }
                this._documentViewer.view.imageViewer.interpolationMode = interpolationMode;
            };
            DocumentViewerDemoApp.prototype.imageViewer_PostRenderItem = function (sender, e) {
                var imageViewer = sender;
                var isView = imageViewer === this._documentViewer.view.imageViewer;
                if (this.demoMode === DemoMode.Barcode && isView)
                    this.drawBarcodes(e.item, e.context);
                var bounds = DocumentViewerDemoApp._getTransformedBounds(e.item);
                var showTextIndicators = this.preferencesPart.showTextIndicators;
                this.drawPageIndicators(imageViewer, e.item, bounds, isView, showTextIndicators, e.context);
                this.drawToolTipHighlight(e.item, e.context);
            };
            DocumentViewerDemoApp._getTransformedBounds = function (item) {
                var bounds = lt.LeadRectD.create(0, 0, item.imageSize.width, item.imageSize.height);
                var transform = item.imageViewer.getItemImageTransform(item);
                var corners = lt.GeometryTools.getCornerPoints(bounds);
                transform.transformPoints(corners);
                bounds = lt.GeometryTools.getBoundingRect(corners);
                return bounds;
            };
            DocumentViewerDemoApp._getScaledRender = function (bounds, maxSizeRatio, original) {
                var shortSide = Math.min(bounds.width, bounds.height);
                var sizeRatio = Math.min(maxSizeRatio, original / shortSide);
                original = sizeRatio * shortSide;
                return original;
            };
            DocumentViewerDemoApp._loadDisabledSymbolImage = function () {
                var app = DocumentViewerDemoApp;
                if (app._disabledSymbolImage)
                    return;
                var image = document.createElement("img");
                image.src = app._disabledSymbolDataUrl;
                app._disabledSymbolImage = image;
            };
            DocumentViewerDemoApp.prototype.drawPageIndicators = function (imageViewer, item, bounds, isView, showTextIndicator, context) {
                if (!imageViewer || !item || !this._documentViewer.hasDocument)
                    return;
                var pageIndex = imageViewer.items.indexOf(item);
                var page = this._documentViewer.document.pages.item(pageIndex);
                if (!page)
                    return;
                var isDisabled = page.isDeleted;
                var size = isView ? 30 : 20;
                if (isView) {
                    // Keep the size reasonable when the page scales
                    size = DocumentViewerDemoApp._getScaledRender(bounds, .2, size);
                }
                if (showTextIndicator && !isDisabled) {
                    // Render a small T at the top-right corner
                    var topRight = bounds.topRight;
                    var textIndicatorText = "T";
                    var hasText = this._documentViewer.text.hasDocumentPageText(pageIndex + 1);
                    context.save();
                    var font = size + "px Arial";
                    var fillStyle = "gray";
                    if (hasText) {
                        font = "bold " + font;
                        fillStyle = "#4b67bc"; // darkblue
                    }
                    context.textBaseline = "bottom";
                    context.textAlign = "right";
                    context.font = font;
                    context.fillStyle = fillStyle;
                    var xOffset = size * .1;
                    var yOffset = size * .05;
                    context.fillText(textIndicatorText, topRight.x - xOffset, topRight.y + size + yOffset);
                    context.restore();
                }
                var symbol = DocumentViewerDemoApp._disabledSymbolImage;
                if (symbol && isDisabled) {
                    // Render an X in the top-left corner
                    var topLeft = lt.LeadPointD.create(Math.floor(bounds.topLeft.x), Math.floor(bounds.topLeft.y));
                    var style = "#a56161"; // darkred
                    if (!this._disabledPageIconCanvas)
                        this._disabledPageIconCanvas = document.createElement("canvas");
                    var iconCanvas = this._disabledPageIconCanvas;
                    var triangleLength = (size * 1.8);
                    iconCanvas.width = triangleLength;
                    iconCanvas.height = triangleLength;
                    var iconCtx = iconCanvas.getContext("2d");
                    iconCtx.save();
                    iconCtx.clearRect(0, 0, triangleLength, triangleLength);
                    // Cut out the triangle
                    iconCtx.fillStyle = style;
                    iconCtx.beginPath();
                    iconCtx.moveTo(0, 0);
                    iconCtx.lineTo(triangleLength, 0);
                    iconCtx.lineTo(0, triangleLength);
                    iconCtx.closePath();
                    // Fill in the triangle
                    iconCtx.globalCompositeOperation = "source-over";
                    iconCtx.fill();
                    // Draw the icon
                    var padding = size * .1;
                    var iconRect = lt.LeadRectD.create(0, 0, size, size);
                    iconRect = lt.LeadRectD.inflateRect(iconRect, -padding, -padding);
                    iconCtx.globalCompositeOperation = "destination-out";
                    iconCtx.drawImage(symbol, iconRect.x, iconRect.y, iconRect.width, iconRect.height);
                    iconCtx.restore();
                    var oldAlpha = context.globalAlpha;
                    context.save();
                    // Draw the cover
                    context.globalAlpha = .4;
                    var outerRect = lt.LeadRectD.create(topLeft.x, topLeft.y, Math.ceil(bounds.width), Math.ceil(bounds.height));
                    context.fillStyle = "#d6cfcf";
                    context.fillRect(outerRect.x, outerRect.y, Math.ceil(outerRect.width), Math.ceil(outerRect.height));
                    context.globalAlpha = oldAlpha;
                    context.drawImage(iconCanvas, topLeft.x, topLeft.y);
                    context.restore();
                }
            };
            DocumentViewerDemoApp.prototype.runValueLink = function (linkValue) {
                var _this = this;
                // Check if this is an email address
                if (linkValue.toLowerCase().slice(0, "mailto:".length) != "mailto:" && DocumentViewerDemoApp._emailRegEx.test(linkValue)) {
                    // Yes
                    linkValue = "mailto:" + linkValue;
                    window.location.href = linkValue;
                }
                else {
                    if (this._automaticallyRunLinks) {
                        if ((linkValue.toLowerCase().slice(0, "http:".length) != "http:") && (linkValue.toLowerCase().slice(0, "https:".length) != "https:")) {
                            window.open("http://" + linkValue);
                        }
                        else {
                            window.open(linkValue);
                        }
                    }
                    else {
                        this.linkValueDlg.show(linkValue);
                        this.linkValueDlg.onClose = function () {
                            _this._automaticallyRunLinks = _this.linkValueDlg.doNotShowAgain;
                        };
                    }
                }
            };
            Object.defineProperty(DocumentViewerDemoApp.prototype, "documentViewer", {
                get: function () {
                    return this._documentViewer;
                },
                enumerable: false,
                configurable: true
            });
            // annotations may be passed as File or as string
            DocumentViewerDemoApp.prototype.loadDocument = function (documentUri, annotations, loadOptions) {
                var _this = this;
                this.videoPlayer.hide();
                // Clear the errors
                this._operationErrors = [];
                // Go ahead and load the URI
                this.beginBusyOperation();
                if (this.verifyUploadedMimeTypes && documentUri && lt.Document.DocumentFactory.isUploadDocumentUri(documentUri)) {
                    this.loadingDlg.show(false, false, "Loading Document...", "Verifying Document", function () {
                        // If we are dealing with an uploaded document, we can verify that it's a supported mimeType
                        lt.Document.DocumentFactory.checkCacheInfo(documentUri)
                            .done(function (cacheInfo) {
                            if (!cacheInfo || cacheInfo.isMimeTypeAccepted) {
                                // If it doesn't exist, let the LoadFromUri fail.
                                // If successful, continue.
                                _this.loadingDlg.processing("Loading Document...", null);
                                _this.loadFromUri(documentUri, annotations, loadOptions);
                            }
                            else {
                                // This mimeType is not acceptable. Show a download link instead.
                                var downloadUrl = lt.Document.Service.Custom.createEndpointGetUrl("Factory", "DownloadDocument", {
                                    uri: documentUri,
                                    includeAnnotations: true,
                                    userData: lt.Document.DocumentFactory.serviceUserData
                                }, true);
                                _this.linkMessageDlg.show("Download Document", "The document with URI '" + documentUri + "' was rejected by the service. Use the link below to download this document for viewing in a different application.", documentUri, downloadUrl);
                                _this.endBusyOperation();
                            }
                        })
                            .fail(function (xhr, statusText, errorThrown) {
                            lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                            _this.endBusyOperation();
                        });
                    });
                }
                else {
                    this.loadingDlg.show(false, false, "Loading Document...", null, function () {
                        _this.loadFromUri(documentUri, annotations, loadOptions);
                    });
                }
            };
            DocumentViewerDemoApp.prototype.createLoadOptions = function (annotations, annotationsLoadOption, documentName, firstPage, lastPage) {
                var loadOptions = new lt.Document.LoadDocumentOptions();
                loadOptions.timeoutMilliseconds = this.loadDocumentTimeoutMilliseconds;
                loadOptions.loadMode = this.loadDocumentMode;
                switch (annotationsLoadOption) {
                    case DocumentViewerDemo.AnnotationsLoadOption.embedded:
                        loadOptions.loadEmbeddedAnnotations = true;
                        loadOptions.renderAnnotations = false;
                        break;
                    case DocumentViewerDemo.AnnotationsLoadOption.render:
                        loadOptions.loadEmbeddedAnnotations = true;
                        loadOptions.renderAnnotations = true;
                        break;
                    default:
                        loadOptions.loadEmbeddedAnnotations = false;
                        loadOptions.renderAnnotations = false;
                        break;
                }
                if (documentName)
                    loadOptions.name = documentName;
                //Check if the first page value exists -- if it doesn't exist, set the first page value to 1.
                if (!firstPage)
                    firstPage = 1;
                loadOptions.firstPageNumber = firstPage;
                //Check if the last page value exists -- if it doesn't exist, set the last page value to -1.  This will signify to the Document Service that all pages between the first page value, and the actual last page in the file should be loaded.
                if (isNaN(lastPage) || lastPage === null)
                    lastPage = -1;
                loadOptions.lastPageNumber = lastPage;
                // Check if annotations passed as file uri
                if (typeof annotations === "string")
                    loadOptions.annotationsUri = annotations;
                // Check the device to set max image size (for scaling)
                if (lt.LTHelper.device == lt.LTDevice.desktop)
                    loadOptions.maximumImagePixelSize = 4096;
                else
                    loadOptions.maximumImagePixelSize = 2048;
                return loadOptions;
            };
            DocumentViewerDemoApp.prototype.setAnnotationsFile = function (annotations, loadOptions) {
                // Check if annotations passed as file or blob - Since File extends Blob, we only need to check if the object is an instance of the base class Blob.
                if (annotations && lt.LTHelper.supportsFileReader && annotations instanceof Blob) {
                    // Set this provided file for us to load after everything else
                    this._loadDocumentAnnotationsFile = annotations;
                }
                else {
                    // we're here either because the annotations were a URI or we don't support FileReader
                    if (annotations && !loadOptions.annotationsUri && !lt.LTHelper.supportsFileReader) {
                        alert("Your browser does not support the FileReader API, so annotations could not be loaded.");
                    }
                    this._loadDocumentAnnotationsFile = null;
                }
            };
            DocumentViewerDemoApp.prototype.loadFromUri = function (documentUri, annotations, loadOptions) {
                var _this = this;
                lt.Document.DocumentFactory.loadFromUri(documentUri, loadOptions)
                    .fail(function (jqXHR, statusText, errorThrown) {
                    _this.endBusyOperation();
                    _this.showServiceError("Error loading the document.", jqXHR, statusText, errorThrown);
                })
                    .done(function (document) {
                    _this.loadingDlg.processing("Set Document...", null);
                    _this.loadDocumentOptions.loadAttachmentsMode = loadOptions.loadAttachmentsMode;
                    // Set this provided file for us to load after everything else
                    _this.setAnnotationsFile(annotations, loadOptions);
                    _this.setDocument(document);
                    _this.loadDocumentOptions = loadOptions.clone();
                });
            };
            // annotations may be passed as File or as string
            DocumentViewerDemoApp.prototype.loadDocumentAttachment = function (ownerDocument, attachmentNumber) {
                var _this = this;
                // Clear the errors
                this._operationErrors = [];
                // Go ahead and load the URI
                this.beginBusyOperation();
                this.loadingDlg.show(false, false, "Loading Attachment...", null, function () {
                    var loadAttachmentOptions = new lt.Document.LoadAttachmentOptions();
                    loadAttachmentOptions.attachmentNumber = attachmentNumber;
                    // Use the last load options we used.
                    loadAttachmentOptions.loadDocumentOptions = _this.loadDocumentOptions.clone();
                    // Reset the variables that may have been set which do not concern us
                    loadAttachmentOptions.loadDocumentOptions.firstPageNumber = 1;
                    loadAttachmentOptions.loadDocumentOptions.lastPageNumber = -1;
                    loadAttachmentOptions.loadDocumentOptions.documentId = null;
                    lt.Document.DocumentFactory.loadDocumentAttachment(ownerDocument, null, loadAttachmentOptions)
                        .fail(function (jqXHR, statusText, errorThrown) {
                        _this.endBusyOperation();
                        _this.showServiceError("Error loading the document.", jqXHR, statusText, errorThrown);
                    })
                        .done(function (document) {
                        // Update the attachment of the owner document
                        DocumentViewerDemoApp.updateAttachment(ownerDocument, attachmentNumber, document);
                        _this.loadingDlg.processing("Set Document...", null);
                        _this.setDocument(document);
                    });
                });
            };
            DocumentViewerDemoApp.updateAttachment = function (ownerDocument, attachmentNumber, attachmentDocument) {
                /*
                var ownerDocumentCached = DocumentViewerDemoApp.isDocumentInCache(ownerDocument);
                var attachmentDocumentCached = DocumentViewerDemoApp.isDocumentInCache(attachmentDocument);
                var documentAttachment: lt.Document.DocumentAttachment = ownerDocument.attachments.item(attachmentNumber - 1);
    
                if (ownerDocumentCached && attachmentDocumentCached) {
                   // If everything is in the service cache then it is updated in the service.
                   // Nothing to do here
                } else if (!ownerDocumentCached && attachmentDocumentCached) {
                   // This means the owner document is not in the service cache, only the attachment.
                   // Update the attachment document ID
                   documentAttachment.documentId = attachmentDocument.documentId;
                } else if (!ownerDocumentCached && !attachmentDocumentCached) {
                   // This means neither the owner document nor the attachment is in the service cache.
                   // Update the attachment document reference
                   //documentAttachment.document = attachmentDocument;
                }
    
                console.log("ownerDocumentCached:" + ownerDocumentCached + " attachmentDocumentCached:" + attachmentDocumentCached + " documentAttachment:" + documentAttachment.documentId);
                */
            };
            DocumentViewerDemoApp.prototype.uploadDocument = function (documentFile, annotationsFile, loadOptions) {
                var _this = this;
                this.beginBusyOperation();
                this.loadingDlg.show(true, true, "Uploading Document...", null, function () {
                    var uploadPromise;
                    if (_this.loadDocumentMode == lt.Document.DocumentLoadMode.service) {
                        uploadPromise = lt.Document.DocumentFactory.uploadFile(documentFile);
                        uploadPromise.done(function (uploadedDocumentUrl) {
                            _this.loadingDlg.progress(100);
                            _this.loadDocument(uploadedDocumentUrl, annotationsFile, loadOptions);
                        });
                    }
                    else {
                        uploadPromise = lt.Document.DocumentFactory.loadFromFile(documentFile, loadOptions);
                        uploadPromise.done(function (document) {
                            _this.loadingDlg.progress(100);
                            _this.loadingDlg.processing("Set Document...", null);
                            // Set this provided file for us to load after everything else
                            _this.setAnnotationsFile(annotationsFile, loadOptions);
                            _this.setDocument(document);
                            _this.loadDocumentOptions = loadOptions.clone();
                        });
                    }
                    uploadPromise.fail(function (jqXHR, statusText, errorThrown) {
                        var serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
                        if (serviceError.isAbortError) {
                            // aborted
                            return;
                        }
                        _this.endBusyOperation();
                        _this.showServiceError("Error uploading document.", jqXHR, statusText, errorThrown);
                    });
                    uploadPromise.progress(function (progressOb) {
                        _this.loadingDlg.progress(Math.round(progressOb.progress));
                        if (_this.loadingDlg.isCancelled) {
                            uploadPromise.abort();
                            _this.loadingDlg.progress(100);
                            _this.endBusyOperation();
                        }
                    });
                });
            };
            DocumentViewerDemoApp.prototype.loadCachedDocument = function (cacheId, showLoadFromCacheDialog) {
                var _this = this;
                var documentChangedCallback = this._historyPart.documentChangedCallbacks;
                this.beginBusyOperation();
                this.loadingDlg.show(false, false, "Loading Cached Document...", null, function () {
                    var loadFromCachePromise = lt.Document.DocumentFactory.loadFromCache(cacheId);
                    loadFromCachePromise.done(function (document) {
                        if (document) {
                            _this.loadingDlg.processing("Set Document...", null);
                            _this._loadDocumentAnnotationsFile = null;
                            _this.setDocument(document);
                        }
                        else {
                            // Delay for UI smoothing
                            setTimeout(function () {
                                // No document was found in the cache, try again
                                if (showLoadFromCacheDialog) {
                                    _this._filePart.openFromCacheClick(cacheId);
                                }
                                _this.endBusyOperation();
                                var message = "No document could be found in the cache for the identifier '" + cacheId + "'.";
                                lt.LTHelper.logError(message);
                                alert(message);
                                if (documentChangedCallback && documentChangedCallback.aborted)
                                    documentChangedCallback.aborted();
                            }, 500);
                        }
                    });
                    loadFromCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                        _this.endBusyOperation();
                        _this.showServiceError("Error loading cached document.", jqXHR, statusText, errorThrown);
                        if (documentChangedCallback && documentChangedCallback.aborted)
                            documentChangedCallback.aborted();
                    });
                });
            };
            DocumentViewerDemoApp.prototype.saveDocumentToCache = function (document) {
                this._historyPart.documentSavedToCache(document);
                return lt.Document.DocumentFactory.saveToCache(document);
            };
            DocumentViewerDemoApp.prototype.saveAttachmentToCache = function (document, attachmentNumber) {
                var saveAttachmentToCacheOptions = new lt.Document.SaveAttachmentToCacheOptions();
                saveAttachmentToCacheOptions.attachmentNumber = attachmentNumber;
                return lt.Document.DocumentFactory.saveAttachmentToCache(document, null, saveAttachmentToCacheOptions);
            };
            DocumentViewerDemoApp.isDocumentInCache = function (document) {
                return (document && document.dataType != lt.Document.DocumentDataType.transient) ? true : false;
                ;
            };
            DocumentViewerDemoApp.prototype.convertDocument = function (jobData) {
                var _this = this;
                var doc = this.documentViewer.document;
                // Finally, try to add the name of the document for the conversion result
                var name = null;
                var uri = doc.uri;
                if (uri && uri.indexOf("http:") === 0) {
                    if (uri[uri.length - 1] === "/")
                        uri = uri.slice(0, -1);
                    name = uri.substring(uri.lastIndexOf("/") + 1);
                    if (name) {
                        var dotIndex = name.indexOf(".");
                        if (dotIndex !== -1) {
                            name = name.substring(0, dotIndex);
                            // Could be a query parameter string, if so, do not use it
                            if (name.indexOf('?') !== -1 || name.indexOf('&') !== -1) {
                                name = null;
                            }
                        }
                    }
                }
                if (!name && doc.metadata) {
                    name = doc.metadata["title"] || null;
                }
                if (name)
                    name = name.toLowerCase();
                jobData.documentName = name;
                // Prepare to save will update the document in the server
                // if needed (such as annotations)
                var hasChanged = this.documentViewer.prepareToSave();
                this.beginBusyOperation();
                this.loadingDlg.show(false, false, "Saving to cache...", null, function () {
                    if (hasChanged || doc.isAnyCacheStatusNotSynced) {
                        // Save will update the document in the server
                        var saveToCachePromise = _this.saveDocumentToCache(doc);
                        saveToCachePromise.done(function () {
                            _this.runConvertPromise(doc, jobData);
                        });
                        saveToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                            _this.endBusyOperation();
                            _this.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                        });
                    }
                    else {
                        _this.runConvertPromise(doc, jobData);
                    }
                });
            };
            DocumentViewerDemoApp.prototype.runConvertPromise = function (documentToConvert, jobData) {
                this.loadingDlg.processing("Converting...", null);
                // Now convert it
                if (this.useStatusQueryRequests)
                    this.runConvertJob(documentToConvert, jobData);
                else
                    this.runConvert(documentToConvert, jobData);
            };
            DocumentViewerDemoApp.prototype.runConvert = function (documentToConvert, jobData) {
                var _this = this;
                var convertPromise = documentToConvert.convert(jobData);
                convertPromise.done(function (docConversion) {
                    var documentId = docConversion.documentId;
                    // If we have an archive, that's all we will have.
                    // If it doesn't exist, handle the document and possible annotations
                    if (docConversion.archive && docConversion.archive.url) {
                        _this.saveToDlg.show(documentId, [docConversion.archive]);
                    }
                    else if (docConversion.document && docConversion.document.url) {
                        var items = [docConversion.document];
                        if (docConversion.annotations && docConversion.annotations.url) {
                            items.push(docConversion.annotations);
                        }
                        _this.saveToDlg.show(documentId, items);
                    }
                    else if (documentId) {
                        _this.saveToDlg.show(documentId, null);
                    }
                    else if (docConversion.document) {
                        // Special case - if no URL is set, the document ID is set as the document name.
                        var id = docConversion.document.name;
                        setTimeout(function () {
                            // Inform the user about the cache ID. Use the input dialog so it's easy to copy.
                            var text = "Document conversion successful. ";
                            lt.LTHelper.log(text + id);
                            text += "The converted document is now in the cache with the below identifier.";
                            var cacheDialog = _this.cacheDlg;
                            cacheDialog.showSave(text, id);
                            cacheDialog.onReloadCurrentFromSave = function () {
                                _this.loadCachedDocument(id, false);
                            };
                        }, 50);
                    }
                });
                convertPromise.fail(function (jqXHR, statusText, errorThrown) {
                    _this.showServiceError("Error converting the document.", jqXHR, statusText, errorThrown);
                });
                convertPromise.always(function () {
                    _this.endBusyOperation();
                });
            };
            DocumentViewerDemoApp.prototype.runConvertJob = function (documentToConvert, jobData) {
                var _this = this;
                var userToken = null;
                var jobToken = null;
                var fail = function (jqXHR, statusText, errorThrown) {
                    if (abort)
                        return;
                    if (userToken && jobToken)
                        lt.LTHelper.logError("Document Conversion Job Failure. User: '" + userToken + "', Job: '" + jobToken + "'");
                    _this.showServiceError("Error converting the document.", jqXHR, statusText, errorThrown);
                    _this.endBusyOperation();
                };
                var abort = false;
                this.loadingDlg.enableCancellation = true;
                this.loadingDlg.cancelClick = function () {
                    _this.loadingDlg.cancelClick = null;
                    abort = true;
                    if (userToken && jobToken) {
                        _this.loadingDlg.processing("Canceled...", "Waiting for verification");
                        lt.Document.Converter.StatusJobDataRunner.abortConvertJob(userToken, jobToken)
                            .fail(function () {
                            alert("Failed to cancel the conversion job. Check the console for more information");
                            lt.LTHelper.logError("Failed to cancel: User: " + userToken + "; Job: " + jobData);
                        })
                            .always(function () {
                            setTimeout(function () {
                                _this.endBusyOperation();
                            }, 1500);
                        });
                    }
                    else {
                        setTimeout(function () {
                            _this.endBusyOperation();
                        }, 1200);
                    }
                };
                var convertJobPromise = lt.Document.Converter.StatusJobDataRunner.runConvertJob(documentToConvert.documentId, jobData)
                    .done(function (convertJobResult) {
                    if (abort)
                        return;
                    var minWaitFromResponse = DocumentViewerDemoApp._queryStatusMinWaitFromResponse;
                    var minWaitFromRequest = DocumentViewerDemoApp._queryStatusMinWaitFromRequest;
                    userToken = convertJobResult.userToken;
                    jobToken = convertJobResult.jobToken;
                    var requestTime = -1;
                    var responseTime = -1;
                    var runQuery = null;
                    var queryDone = function (statusJobData) {
                        if (abort)
                            return;
                        if (statusJobData.abort) {
                            _this.endBusyOperation();
                            return;
                        }
                        if (statusJobData.errorMessages && statusJobData.errorMessages.length) {
                            var messages = [
                                "The conversion job encountered an error:",
                                statusJobData.errorMessages[0],
                                "Check the console for more information."
                            ];
                            alert(messages.join("\n"));
                            lt.LTHelper.logError(messages.join(" "));
                            lt.LTHelper.logError("User: " + userToken + "; Job: " + jobData);
                            lt.LTHelper.logError(statusJobData.errorMessages);
                            _this.endBusyOperation();
                            return;
                        }
                        else if (statusJobData.isCompleted) {
                            _this.loadingDlg.processing("Converting...", "Finishing");
                            lt.Document.Converter.StatusJobDataRunner.deleteConvertJob(userToken, jobToken)
                                .fail(function () {
                                lt.LTHelper.logError("Failed to delete after completion: User: " + userToken + "; Job: " + jobData);
                            })
                                .always(function () {
                                _this.endBusyOperation();
                                _this.exportJobDlg.show(_this, statusJobData, null);
                                _this.exportJobDlg.onLoad = function (uri) {
                                    var loadOptions = _this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.embedded);
                                    _this.loadDocument(uri, null, loadOptions);
                                };
                            });
                            return;
                        }
                        _this.loadingDlg.processing("Converting...", statusJobData.jobStatusMessage);
                        // Keep querying
                        runQuery(Date.now());
                    };
                    runQuery = function (responseTime) {
                        var now = Date.now();
                        if (requestTime !== -1) {
                            var timeSinceRequest = now - requestTime;
                            var timeSinceResponse = now - responseTime;
                            // If we haven't waited the minimum since the response and haven't waited the maximum since the request, wait
                            if (timeSinceResponse < minWaitFromResponse || timeSinceRequest < minWaitFromRequest) {
                                var waitTime = Math.max(minWaitFromResponse - timeSinceResponse, minWaitFromRequest - timeSinceRequest);
                                setTimeout(function () {
                                    runQuery(responseTime);
                                }, waitTime);
                                return;
                            }
                        }
                        lt.Document.Converter.StatusJobDataRunner.queryConvertJobStatus(userToken, jobToken)
                            .done(queryDone)
                            .fail(fail);
                        requestTime = Date.now();
                        return;
                    };
                    runQuery(Date.now());
                })
                    .fail(fail);
            };
            // OCR mode
            DocumentViewerDemoApp.prototype.recognize = function (page, searchArea) {
                var _this = this;
                var promcmd = page.getText(searchArea);
                this.beginBusyOperation();
                this.loadingDlg.show(false, false, "Recognizing...", null, function () {
                    promcmd.done(function (pageText) {
                        var text = "";
                        if (pageText) {
                            pageText.buildText();
                            var text = pageText.text;
                        }
                        _this.textResultDlg.update("Results", text.trim());
                        _this.textResultDlg.show();
                    });
                    promcmd.fail(function (jqXHR, statusText, errorThrown) {
                        _this.showServiceError("Error retrieving text", jqXHR, statusText, errorThrown);
                    });
                    promcmd.always(function () {
                        _this.endBusyOperation();
                    });
                });
            };
            DocumentViewerDemoApp.prototype.readBarcodes = function (page, searchArea) {
                // If we have a page, process just that page (with the bounds, if available)
                // If we have a null page and haven't processed all pages before, process all pages (with no bounds)
                var _this = this;
                if (page == null && searchArea.isEmpty) {
                    if (this._allBarcodes) {
                        // We've done this before. Show the data.
                        this.showPreviousBarcodeData(this._allBarcodes);
                        return;
                    }
                    else {
                        this._allBarcodes = [];
                    }
                }
                var barcodesRead = 0;
                var currentPageNumber = 1; // 1-based
                var length = 1;
                var index = 0;
                var pages = [];
                if (page == null) {
                    // do all pages
                    length = this._documentViewer.document.pages.count;
                    // 0-based
                    for (var i = 0; i < length; i++) {
                        pages.push(this._documentViewer.document.pages.item(i));
                    }
                }
                else {
                    // 1 page total
                    pages = [page];
                }
                // Show our dialog
                this.processingPagesDlg.show("Reading Barcodes", pages.length, [
                    "Page",
                    "Symbology",
                    "Value",
                    "Location",
                ], null);
                var pageDone = function (barcodes) {
                    if (!_this.processingPagesDlg.isCanceled) {
                        _this._currentBarcodes[currentPageNumber - 1] = barcodes;
                        if (page == null && searchArea.isEmpty) {
                            _this._allBarcodes.push(barcodes);
                        }
                        if (barcodes) {
                            barcodesRead += barcodes.length;
                            barcodes.forEach(function (barcodeData) {
                                _this.processingPagesDlg.addData(currentPageNumber, [
                                    DocumentViewerDemoApp._barcodeSymbologyNames[barcodeData.symbology],
                                    barcodeData.value,
                                    [barcodeData.bounds.top, barcodeData.bounds.right, barcodeData.bounds.bottom, barcodeData.bounds.left]
                                        .map(function (val) {
                                        // clean up
                                        return parseFloat(val.toFixed(2));
                                    })
                                        .join(", "),
                                ]);
                            });
                        }
                        // Draw the barcodes
                        _this._documentViewer.view.imageViewer.invalidate(lt.LeadRectD.empty);
                        index++;
                        if (index < length) {
                            chooseNext();
                        }
                        else {
                            _this.processingPagesDlg.finishProcessing();
                            _this.processingPagesDlg.updateStatus("Barcode reading complete - " + barcodesRead + " found.");
                        }
                    }
                    else {
                        // It was canceled, don't save this work
                        _this._allBarcodes = null;
                    }
                };
                var pageFail = function (jqXHR, statusText, errorThrown) {
                    _this._allBarcodes = null;
                    _this.processingPagesDlg.finishProcessing();
                    _this.processingPagesDlg.updateStatus("Barcode reading failed on page " + currentPageNumber + ".");
                    _this.showServiceError("Error reading barcodes", jqXHR, statusText, errorThrown);
                };
                var chooseNext = function () {
                    var newPage = pages[index];
                    currentPageNumber = newPage.pageNumber;
                    _this.processingPagesDlg.updateStatus("Processing page " + currentPageNumber);
                    newPage.readBarcodes(searchArea, 0, null)
                        .done(pageDone)
                        .fail(pageFail);
                };
                chooseNext();
                //this.beginBusyOperation();
                //this.endBusyOperation();
            };
            DocumentViewerDemoApp.prototype.checkBarcodeData = function (index, searchArea) {
                if (this._currentBarcodes && this._currentBarcodes[index] && this._currentBarcodes[index].length > 0) {
                    var pageBarcodes = this._currentBarcodes[index];
                    var searchX = searchArea.x;
                    var searchY = searchArea.y;
                    var barcodesToShow = pageBarcodes.filter(function (data) {
                        if (searchX > data.bounds.left && searchX < data.bounds.right && searchY > data.bounds.top && searchY < data.bounds.bottom)
                            return true;
                    });
                    if (barcodesToShow.length > 0) {
                        // make into a [][], by page index
                        var barcodesByPage = [];
                        barcodesByPage[index] = barcodesToShow;
                        this.showPreviousBarcodeData(barcodesByPage);
                    }
                }
            };
            DocumentViewerDemoApp.prototype.showPreviousBarcodeData = function (barcodePages) {
                var _this = this;
                var count = barcodePages.filter(function (barcodePage) {
                    return barcodePage && barcodePage.length > 0;
                }).length;
                this.processingPagesDlg.show("Barcode", count, [
                    "Page",
                    "Symbology",
                    "Value",
                    "Location",
                ], null);
                this.processingPagesDlg.updateStatus("Barcodes previously read.");
                this.processingPagesDlg.finishProcessing();
                barcodePages.forEach(function (barcodeDataPage, pageIndex) {
                    barcodeDataPage.forEach(function (barcodeData) {
                        _this.processingPagesDlg.addData(pageIndex + 1, [
                            DocumentViewerDemoApp._barcodeSymbologyNames[barcodeData.symbology],
                            barcodeData.value,
                            [barcodeData.bounds.top, barcodeData.bounds.right, barcodeData.bounds.bottom, barcodeData.bounds.left]
                                .map(function (val) {
                                // clean up
                                return parseFloat(val.toFixed(2));
                            })
                                .join(", "),
                        ]);
                    });
                });
            };
            DocumentViewerDemoApp.prototype.drawBarcodes = function (item, context) {
                var _this = this;
                var itemIndex = this._documentViewer.view.imageViewer.items.indexOf(item);
                if (this._documentViewer.hasDocument && this._currentBarcodes && this._currentBarcodes[itemIndex] && this._currentBarcodes[itemIndex].length > 0) {
                    var imageViewer = this._documentViewer.view.imageViewer;
                    var mat = this._documentViewer.view.imageViewer.getItemImageTransform(item);
                    // Draw the barcodes we found
                    context.save();
                    context.beginPath();
                    var itemBarcodes = this._currentBarcodes[itemIndex];
                    itemBarcodes.forEach(function (barcodeData) {
                        var bounds = _this._documentViewer.document.rectToPixels(barcodeData.bounds);
                        bounds = mat.transformRect(bounds);
                        context.lineWidth = 3;
                        context.strokeStyle = "red";
                        context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
                        bounds.inflate(3, 3);
                        context.strokeStyle = "green";
                        context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
                    });
                    context.closePath();
                    context.restore();
                }
            };
            // We'll do certain actions only for the mobile version
            DocumentViewerDemoApp.isMobileVersion = false;
            DocumentViewerDemoApp._queryStatusMinWaitFromResponse = 2000;
            DocumentViewerDemoApp._queryStatusMinWaitFromRequest = 3000;
            DocumentViewerDemoApp._cssTransformsHideCanvasClass = "hide-for-transitions";
            DocumentViewerDemoApp._cssTransformsReadyCanvasClass = "ready-for-transitions";
            DocumentViewerDemoApp.serviceHeartbeatFailureMessage_default = "The client is no longer connected to the service.\nDocument '${documentId}' will not be saved. Please verify the connection to the service and try again.";
            DocumentViewerDemoApp._elementsPageErrorClass = "lt-image-error";
            // Downside to higher values to limit: You can't always accurately say what page is being worked on for canceling
            DocumentViewerDemoApp._manualGetTextRequestLimit = 1;
            DocumentViewerDemoApp._disabledSymbolDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEM0lEQVRIS4VWXWgcVRT+zkyySbCzK1VTEFJEIqWuhOy9o9vtSrPagogWtBBQ8U0FpfomCvokKNIHH0TjSx/FH4wG0RZ8qHVA0+1u9k6o6SoWf1BQaO2P6do62c3ukbPeWSfNpr1PM+d+53znf4ZwjaOUGgewg4juALDFwk8z80kAx8Mw/PFqJmijS6WUdhxnPzM/AGB0A9wZIjrc6XRmwjA0/TDrCAqFwkiz2XwdwH4AA9eK0N6vApgB8JIx5nJSZw1BPp/f0mq15ohoZwLUAXCEiL4AcJaZNwG4AcBeAHcC6Nlg5mODg4P7KpXK6Vi/d6m1zgA4CkDZSzH8cbPZfHppaelCv0iy2WxqeHj4HQBPJO5DAPcaY5ZF1iNQSn1ARI8kDYlHKysr99Xr9b83SlWhUNjcarWeYeZXALiCY+YPwzB8tEeglHqQiD63RpoAUvaZAZzzPG8sCILoSpJ8Pp8eGRm5HARBWyl1mIjujzHMvDcMw0MSAWmtywDyQg6gSkQrzLwrYbBijCnY+664VCp1G0CMi7xUKg03Go1TAMasXleHfN/PMbPkrRud4zg3p1KpS1EU/Qbg+gTJSWPMRJJEnCsUCsNDQ0MsEY6Pjw9lMpl/4tQTkRKCF5j5gDV0yhizTZ4nJydvcV1Xhum6BMlxALuMMa1YJmmqVCoX43et9RyAh7v5J3pR0vMegMcsYMIYsxSDrUdnAKStTNLRdF13rFqtnrOeSlp7Ryk1QUQnrOB9IfhS2koExph1g1csFr0oimRKb0vYuRBF0dZ+3SURra6u/mXJjwrBV1IzUXZdd1u1WpVCrTm2gAsAZB/JkRn5wfO8iSAIZIrXHK21pFCaIJAafMLM+wThOM5dCwsLYqjv0VpLJPEgCuZiFEU31et1ae3eiQmIaI6UUq8S0cv29nljzBsJrKSsl2OpSTqdPkREexKYXzqdTn5xcfFPkWmttwL4VZ6Z+TXK5XK7Hcc5YhXaqVRqtFwun5e0BEEgnkk6aHp62pmdnZUii5Fep1gHfnddd1IK7/v+ZzJk3Tx2OnvI5rcO4Nb/SLmcTqd3B0GwYpWpWCxump+fbyQj01p/m6iJYH8iopCZH7e4nz3Py3a7xvf9Z5n5LXshJFNhGH4t7zaSdWvCRiIbYEccfbyL5J2InqvVam93CexWFHBykx4YGBh4M7l6+1Xe9/13E17HkDCKooIUP7lNtxPRNwA2JwzJZG+3dejbWUqpgIimEpfnmfnuMAy/70aS1PJ9v8jMnwK4MSG/BOAPAHPMLDMzSET3ENEoM2sAslociz9LRA/VarX5WH/d5OZyuduJ6OAVXzVp1Q2/3zbn5Xa7/eTi4uJ3Saf7KskqbjQaT9nvcrZvbv4XSgfOeJ53sN9UX9UrIVpeXt7pOM4UEWWZOf5tkS6pt9vtjzKZzLF+hmP+fwH48rr13f+87gAAAABJRU5ErkJggg==";
            DocumentViewerDemoApp._disabledSymbolImage = null;
            DocumentViewerDemoApp._emailRegEx = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
            // Friendly Names
            DocumentViewerDemoApp._barcodeSymbologyNames = [
                "Unknown", "EAN-13", "EAN-8", "UPC-A", "UPC-E", "Code 3 Of 9", "Code 128", "Code Interleaved 2 Of 5", "CODABAR",
                "UCC/EAN 128", "Code 93", "EAN-EXT-5", "EAN-EXT-2", "MSI", "Code 11", "Code Standard 2 Of 5", "GS1 Databar",
                "GS1 Databar Limited", "GS1 Databar Expanded", "Patch Code", "POSTNET", "Planet", "Australian Post 4State",
                "Royal Mail (RM4SCC)", "USPS OneCode Intelligent Mail", "GS1 Databar Stacked", "GS1 Databar Expanded Stacked",
                "PDF417", "MicroPDF417", "Datamatrix", "QR", "Aztec", "Maxi", "MicroQR", "Pharma Code"
            ];
            return DocumentViewerDemoApp;
        }());
        DocumentViewerDemo.DocumentViewerDemoApp = DocumentViewerDemoApp;
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
window.onload = function () {
    if (lt.LTHelper.device == lt.LTDevice.mobile) {
        // Run mobile version
        HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion = true;
        if (window.location.href.toLocaleLowerCase().indexOf("index.mobile.html") == -1) {
            var cacheId = "";
            if (window.location.href.indexOf("?cacheId") > -1) {
                // The demo is called from external storage manager
                // So run the default mode
                cacheId = window.location.href.substring(window.location.href.indexOf("?cacheId"));
                window.location.href = "index.mobile.html" + cacheId;
                return;
            }
            var demoMode = "";
            if (window.location.href.indexOf("?mode") > -1)
                demoMode = window.location.href.substring(window.location.href.indexOf("?mode"));
            window.location.href = "index.mobile.html" + demoMode;
            return;
        }
    }
    else {
        // Run desktop version
        if (window.location.href.toLocaleLowerCase().indexOf("index.html") == -1) {
            var cacheId = "";
            if (window.location.href.indexOf("?cacheId") > -1) {
                // The demo is called from external storage manager
                // So run the default mode
                cacheId = window.location.href.substring(window.location.href.indexOf("?cacheId"));
                window.location.href = "index.html" + cacheId;
                return;
            }
            var demoMode = "";
            if (window.location.href.indexOf("?mode") > -1)
                demoMode = window.location.href.substring(window.location.href.indexOf("?mode"));
            window.location.href = "index.html" + demoMode;
            return;
        }
    }
    $(document.body).css("display", "block");
    var app = new HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp();
    window["lt_app"] = app;
    app.run();
};
