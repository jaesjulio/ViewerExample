/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      export enum DemoMode {
         Default = 0,
         SVG = 1,
         OCR = 2,
         Barcode = 3
      }

      export enum GetTextReason {
         // We don't know or don't care how it was called.
         other,

         // We are manually calling "GetText" before an operation such as ExportText.
         manual,

         // We are calling an internal Document.Viewer operation that needs to GetText, like FindText.
         internalOperation,
      }

      //Annotations Load Options 
      export enum AnnotationsLoadOption {
         none,
         render,
         embedded,
         external
      }


      // Callbacks to when we are changing the current document in the viewer
      export class ViewerDocumentChangedCallback {
         changing: (documentViewer: lt.Document.Viewer.DocumentViewer, currentDocument: lt.Document.LEADDocument, newDocument: lt.Document.LEADDocument) => boolean;
         changed: (documentViewer: lt.Document.Viewer.DocumentViewer, document: lt.Document.LEADDocument) => void;
         aborted: () => void;
      };

      export class DocumentViewerDemoApp {
         // We'll do certain actions only for the mobile version
         static isMobileVersion: boolean = false;

         // Set this to a value other than null to force the demo to pass it with all calls to the service
         private _userToken: string = null;
         //private _userToken: string = "my-secret";
         public get hasUserToken(): boolean {
            if (this._userToken)
               return true;
            else
               return false;
         }

         public contentManager: lt.ContentManager.ContentManager;

         // Demo modes include SVG, OCR, Barcode (for showing off those specific features)
         public demoMode: DemoMode;

         private _defaultSampleDocument: string;
         // These are set in the OpenFromUrlDialog
         public sampleDocuments: string[] = [];

         private _sampleDocumentFilter: string[] = [
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
         public supportedVideoMimetypes: string[] = [
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
         public documentCompareLocation: string = null;
         public documentCompareLocationLink: string = "#openInComparison";
         public documentComposerLocation: string = null;
         public documentComposerLocationLink: string = "#openInVirtualDocument";

         // Demo parts
         private _filePart: FilePart = null;
         private _editPart: EditPart = null;
         private _viewPart: ViewPart = null;
         private _pagePart: PagePart = null;
         private _interactivePart: InteractivePart = null;
         private _annotationsPart: AnnotationsPart = null;
         private _attachmentsPart: AttachmentsPart = null;
         public get attachmentsPart(): AttachmentsPart {
            return this._attachmentsPart;
         }
         private _historyPart: HistoryPart = null;
         public get historyPart(): HistoryPart {
            return this._historyPart;
         }
         public preferencesPart: PreferencesPart = null;

         // Document viewer
         private _documentViewer: lt.Document.Viewer.DocumentViewer = null;
         private _operationHandler: lt.Document.Viewer.DocumentViewerOperationEventHandler;
         // Operation errors, so we do not show an alert for the same type of errors twice
         private _operationErrors: lt.Document.Viewer.DocumentViewerOperation[];

         // Add a logging line whenever a page renders
         private _countPageRenders: boolean = false;
         private _viewPageRendersByIndex: number[];
         private _thumbnailsPageRendersByIndex: number[];

         // UI Command binder
         public commandsBinder: CommandsBinder;

         private _isInsideBusyOperation: boolean = false;

         // Indicates that the thumbnails are still in loading operation
         private _loadingThumbnailsBar = "#loadingThumbnailsBar";

         // Indicates that the annotations are still in loading operation
         private _loadingAnnotationsBar = "#loadingAnnotationsBar";

         // Tooltip element
         private _toolTipUI = {
            container: "#tooltip",
            title: "#tooltip_Title",
            tip: "#tooltip_Tip",
         }
         private _toolTipHighlightPageIndex: number = -1;
         private _toolTipHighlightCursorPosition: lt.LeadPointD = lt.LeadPointD.empty;
         private _toolTipHighlightLinkBounds: lt.LeadRectD = lt.LeadRectD.empty;

         private _automaticallyRunLinks: boolean = false;

         private _printElement: HTMLElement;

         private _useElements: boolean = false;
         public get useElements(): boolean {
            return this._useElements;
         }

         public videoPlayer: Dialogs.VideoPlayer;
         // Demo dialogs
         public autoRedactionDlg: Dialogs.AutoRedactionDlg;
         public uploadDocumentDlg: Dialogs.UploadDocumentDlg;
         public openDocumentFromUrlDlg: Dialogs.OpenDocumentFromUrlDlg;
         public printDlg: Dialogs.PrintDlg;
         public openFromDocumentStorageDlg: Dialogs.OpenFromDocumentStorageDlg;
         public documentConverterDlg: Converter.Dialogs.DocumentConverterDlg;
         public saveToDlg: Converter.Dialogs.SaveToDlg;
         public exportJobDlg: Converter.Dialogs.ExportJobDlg;
         public pagesDlg: Dialogs.PagesDlg;
         public textResultDlg: lt.Demos.Dialogs.TextResultDialog;
         public documentPropertiesDlg: Dialogs.DocumentPropertiesDlg;
         public attachmentPropertiesDlg: Dialogs.AttachmentPropertiesDlg;

         public customizeRenderModeDlg: Dialogs.CustomRenderModeDlg;
         public automationUpdateObjectDlg: lt.Demos.Annotations.AutomationUpdateObjectDialog;
         public inputDlg: Dialogs.InputDlg;
         public cacheDlg: Dialogs.CacheDlg;
         public documentViewerOptionsDlg: Dialogs.DocumentViewerOptionsDlg;
         public linkValueDlg: Dialogs.LinkValueDlg;
         public linkMessageDlg: Dialogs.LinkMessageDlg;
         public aboutDlg: lt.Demos.Dialogs.AboutDialog;
         public loadingDlg: Dialogs.DocumentViewerDemoLoadingDlg;
         public processingPagesDlg: Dialogs.ProcessingPagesDlg;
         public redactionDocumentDlg: Dialogs.DocumentRedactionOptionsDlg;

         public imageViewerContainerDiv = "#imageViewerContainer";

         public navigationbar = {
            showThumbnailsBtn: "#showThumbnails",
            showBookmarksBtn: "#showBookmarks",
            showAttachmentsBtn: "#showAttachments",
            showAnnotationsListControlsBtn: "#showAnnotationsListControls",
         };

         public headerToolbarContainer = "#headerToolbarContainer";
         public footerToolbarContainer = ".footerToolbar";
         public navigationbarContainer = "#navigationbar";
         public thumbnailsContainer = "#thumbnailsControl";
         public bookmarksContainer = "#bookmarksControl";
         public attachmentsContainer = "#attachmentsControl";
         public annotationsListControlsContainer = "#annotationsListControls";
         // Viewer, thumbnails, bookmarks and attachments containers
         // These containers will have same top/bottom effects when window resized
         // Or when show/hide annotations list
         public affectedContainers = ".affectedContainers";

         // All mobile version controls containers
         public mobileVersionControlsContainers = ".mobileVersionControls";

         private _demoName: string;
         set demoName(value: string) {
            this._demoName = value;
            // demo title
            $("#demoTitle").text(value);
            // demo name label in the about dialog
            this.aboutDlg.name = value;
         }

         // Operations names
         private _documentViewerOperationDictionary: { [operationNumber: number]: string } = {
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


         constructor() {
            window.onresize = ((e: Event) => this.onResize(e));
            window.onunload = ((e: Event) => this.onUnload(e));
            
            this.InitUI();
            // Bind necessary functions
            this._endDocumentPrint = this._endDocumentPrint.bind(this);
         }
         private async getDemoFiles() {
            const files = await fetch(`${lt.Document.DocumentFactory.serviceUri}/Test/GetSampleFiles`)
               .then(async response => {
                  if (!response.ok)
                     throw new Error('Failed to fetch sample files.');

                  return await response.json().then(json => json['files']);
               });
            files.forEach(query => {
               if (this._sampleDocumentFilter.findIndex(item => query.toLowerCase() === item.toLowerCase()) >= 0)
                  this.sampleDocuments.push(query);

            });

            // We will init the OpenFromUrlDlg after we have our sample files.
            this.openDocumentFromUrlDlg = new Dialogs.OpenDocumentFromUrlDlg(this.sampleDocuments, this);
         }

         private onResize(e: Event) {
            // Hide all menus
            var menus = $(".dropup.clearfix");
            menus.css("display", "none");

            this.updateContainers();
         }

         private InitContainers(): void {
            if (DocumentViewerDemoApp.isMobileVersion) {
               // We only need to update thumbnails Container, bookmarks, attachments container not included in mobile version too
               $(this.thumbnailsContainer).css({ "left": 0, "right": 0, "width": "inherit" });
            }
         }

         public updateContainers(): void {
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
         }

         public showContainer(container, flipState: boolean): void {
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
               } else {
                  if (flipState) {
                     $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                     $(this.thumbnailsContainer).hide();
                  }
               }
            } else if (container == this.bookmarksContainer) {
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
               } else {
                  if (flipState) {
                     $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                     $(this.bookmarksContainer).hide();
                  }
               }
            } else if (container == this.attachmentsContainer) {
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
               } else {
                  if (flipState) {
                     $(this.navigationbar.showAttachmentsBtn).removeClass("activeNavigationbarBtn");
                     $(this.attachmentsContainer).hide();
                  }
               }
            }

            this.updateContainers();
         }

         private onUnload(e: Event): void {
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
         }

         private InitUI(): void {
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
               onLoadFromFile: (file: File) => this.uploadDocumentDlg.loadDocument(file),
               onLoadFromUri: () => this.openDocumentFromUrlDlg.loadDocument()
            });

            this.contentManager.registry.register({
               mimetypes: this.supportedVideoMimetypes,
               onLoadFromFile: (file: File) => { return this.uploadDocumentDlg.loadVideo(file) },
               onLoadFromUri: (uri: string) => { return this.openDocumentFromUrlDlg.loadVideo(uri) }
            })
         }

         private InitDialogs(): void {
            // Upload document dialog
            this.uploadDocumentDlg = new Dialogs.UploadDocumentDlg(this);
            this.videoPlayer = new Dialogs.VideoPlayer(this);

            // Open document from url dialog
            

            // Print dialog
            this.printDlg = new Dialogs.PrintDlg();

            // Document Converter dialog
            this.documentConverterDlg = new Converter.Dialogs.DocumentConverterDlg();

            // Use same SharePoint helper instance for both open and save dialogs
            var sharePointHelper = new DriveHelper.LTSharePoint.SharePointHelper();
            // Open from external document storage dialog
            this.openFromDocumentStorageDlg = new Dialogs.OpenFromDocumentStorageDlg();
            this.openFromDocumentStorageDlg.sharePointHelper = sharePointHelper;
            // Wait to init until we have Google Drive credentials

            // Save to dialog
            this.saveToDlg = new Converter.Dialogs.SaveToDlg();
            this.saveToDlg.init(sharePointHelper);

            this.exportJobDlg = new Converter.Dialogs.ExportJobDlg();

            // Text result dialog
            this.textResultDlg = new lt.Demos.Dialogs.TextResultDialog($("#dlgTextResults"), {
               title: "#dlgTextResults_Title",
               textResult: "#dlgTextResults_Results",
               hide: ".dlg-close"
            });

            // Automation properties dialog
            var automationUpdateRoot = $("#dlgAutomationUpdate");
            this.automationUpdateObjectDlg = new lt.Demos.Annotations.AutomationUpdateObjectDialog(automationUpdateRoot,
               {
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
            this.loadingDlg = new Dialogs.DocumentViewerDemoLoadingDlg();

            // Processing pages dialog
            this.processingPagesDlg = new Dialogs.ProcessingPagesDlg();

            // Document viewer options dialog
            this.documentViewerOptionsDlg = new Dialogs.DocumentViewerOptionsDlg();
            this.documentViewerOptionsDlg.onApply = () => {
               var dlg = this.documentViewerOptionsDlg;
               this.loadDocumentMode = dlg.loadDocumentMode;
               this.loadDocumentTimeoutMilliseconds = dlg.loadDocumentTimeoutMilliseconds;
               this.hookPrepareAjax = dlg.hookPrepareAjax;
               this.useCSSTransitions = dlg.useCSSTransitions;
               this.useSvgBackImage = dlg.useSvgBackImage;
               this.useStatusQueryRequests = dlg.useStatusQueryRequests;
               this.verifyUploadedMimeTypes = dlg.verifyUploadedMimeTypes;

               this.serviceHeartbeatStartTimer = dlg.heartbeatStart;
               this.serviceHeartbeatIntervalTimer = dlg.heartbeatInterval;
               this.serviceHeartbeatAutoPauseTimer = dlg.heartbeatAutoPause;
               this.resetServiceHeartbeat(dlg.heartbeatEnabled);
            };

            // User name dialog
            this.inputDlg = new Dialogs.InputDlg();

            this.cacheDlg = new Dialogs.CacheDlg();

            // Document properties dialog
            this.documentPropertiesDlg = new Dialogs.DocumentPropertiesDlg();
            this.attachmentPropertiesDlg = new Dialogs.AttachmentPropertiesDlg();

            // Link value dialog
            this.linkValueDlg = new Dialogs.LinkValueDlg();
            this.linkMessageDlg = new Dialogs.LinkMessageDlg();

            this.redactionDocumentDlg = new Dialogs.DocumentRedactionOptionsDlg(this);

            if (!DocumentViewerDemoApp.isMobileVersion) {
               // Pages dialog
               this.pagesDlg = new Dialogs.PagesDlg();

               // Customize render mode dialog
               this.customizeRenderModeDlg = new Dialogs.CustomRenderModeDlg();
            }
         }

         public run(): void {
            DocumentViewerDemoApp._loadDisabledSymbolImage();
            this.browserPageSetup();
         }

         private _postBrowserPageSetup(): void {
            this.setDemoMode();
            this.Init();
         }

         private browserPageSetup(): void {
            // a place for all initializing browser-specific code.

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
               })
               // Write a hook for future dynamically-created elements (DOMNodeInserted is now deprecated, but works in IE9 and IE10)
               $("body").on("DOMNodeInserted", "button:not([type])", function () {
                  this.setAttribute("type", "button");
               })
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

            lt.RasterSupport.setLicenseUri("https://demo.leadtools.com/licenses/js/LEADTOOLSEVAL.txt", "EVAL", () => {
               if (!lt.RasterSupport.kernelExpired) {
                  lt.LTHelper.log("LEADTOOLS client license set successfully");
                  setTimeout(() => {
                     this._postBrowserPageSetup();
                  }, 10);
               } else {
                  var msg = "No LEADTOOLS License\n\nYour license file is missing, invalid or expired. LEADTOOLS will not function. Please contact LEAD Sales for information on obtaining a valid license.";
                  alert(msg);
               }
            });

            /* If you are using a license file set in the LEADTOOLS directory, and you commented out the code above, then uncomment out this line */
            //this._postBrowserPageSetup();
         }

         private checkDemoMode(): number {
            // We can check for 3 different styles:
            // - .../[demo_name]/ in URL
            // - param ?mode=[demo_name] in params
            // - param ?mode=[demo_index] in params (1, 2, or 3)

            // by default, regular
            var mode: number = 0;
            // get our demo modes as an array of lowercase strings from the enum
            var demoNames: string[] = Object.keys(DemoMode)
               .filter((mode) => { return isNaN(parseInt(mode, 10)); })
               .map((mode: string) => { return mode.toLowerCase(); });

            var pathname = decodeURIComponent(window.location.pathname).toLowerCase();
            if (pathname) {
               // check for the name of the demo in the url path
               demoNames.some((demoName: string, demoIndex: number) => {
                  var index = pathname.indexOf(demoName);
                  if (index > -1) {
                     mode = demoIndex;
                     return true;
                  }
                  return false;
               })
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
                     demoNames.some((demoName: string, demoIndex: number) => {
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
         }

         private setDemoMode(): void {
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
         }

         private Init(): void {
            // Demo parts
            this._filePart = new FilePart(this);
            this._editPart = new EditPart(this);
            this._viewPart = new ViewPart(this);
            this._pagePart = new PagePart(this);
            this._interactivePart = new InteractivePart(this);
            this._annotationsPart = new AnnotationsPart(this);
            this._attachmentsPart = new AttachmentsPart(this);
            // Use document history, keep last 10 document
            this._historyPart = new HistoryPart(this, 10);
            this.redactionDocumentDlg.onApplyOptions = this._annotationsPart.redactionOnApplyOptions;
            this.preferencesPart = new PreferencesPart(this);

            // Init the document viewer...
            this.initDocumentViewer();
            this._annotationsPart.initAutomation();

            this.commandsBinder = new CommandsBinder(this._documentViewer);

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
            this.loadingDlg.show(false, false, "Verifying Service Connection...", null, () => {

               // The Document Library contains properties to set that will connect to the Document Service.
               // However, sometimes these values may need to be specified outside of the client side code, like in a configuration file.
               // Here we show how that approach is used, and provide manual setting of the properties as a backup.

               $.getJSON("./serviceConfig.json", { _: new Date().getTime() })
                  .done((json: {}) => {

                     // You can set the directory in which to check the license (client side)
                     // commented out, because we're using the default value ("./LEADTOOLS")
                     //lt.LTHelper.licenseDirectory = json["licenseDirectory"];

                     this.initFromJSON(json);
                  })
                  .fail(() => {

                     // You can set the directory in which to check the license (client side)
                     // commented out, because we're using the default value ("./LEADTOOLS")
                     //lt.LTHelper.licenseDirectory = "leadtools_license_dir";

                     // The json configuration file wasn't found. Just manually set.
                     this.initFromJSON(null);
                  })
                  .always(() => {
                     // Regardless of what happens, this runs after.
                     this.autoRedactionDlg = new Dialogs.AutoRedactionDlg(this);
                     var hasService =
                        (lt.Document.DocumentFactory.serviceHost && lt.Document.DocumentFactory.serviceHost.length > 0) ||
                        (lt.Document.DocumentFactory.servicePath && lt.Document.DocumentFactory.servicePath.length > 0);
                     if (hasService) {
                        this.createServiceHeartbeat();

                        lt.Document.DocumentFactory.verifyService()
                           .done((response: lt.Document.ServiceStatus) => {
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
                              } else if (response.isLicenseExpired) {
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
                              const fileUrl = queryString['fileUrl'];

                              if (cacheIdArray) {
                                 // The demo is called from another demo (Comparison, External Storage, Virtual Document)
                                 this.loadCachedDocument(cacheIdArray[0], false);
                              }
                              else if (fileUrl) {
                                 lt.LTHelper.log("Loading initial document from '" + fileUrl[0] + "'. If this is the incorrect URL, check your values in the URL");

                                 // If a file URL query string parameter exists, and we weren't called from another demo, load the file.
                                 var loadOptions = this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                                 loadOptions.loadAttachmentsMode = this.loadDocumentOptions.loadAttachmentsMode;
                                 this.loadDocument(fileUrl[0], null, loadOptions);
                              }
                              else {
                                 // Load default sample, which is on the server root.
                                 // We will need to remove the ServiceApiPath, so make sure it is set correctly.
                                 var defaultDocument = Dialogs.OpenDocumentFromUrlDlg.getSampleUrl(this._defaultSampleDocument);

                                 lt.LTHelper.log("Loading initial document from '" + defaultDocument + "'. If this is the incorrect URL, check your values in serviceConfig.json");
                                 var loadOptions = this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                                 loadOptions.loadAttachmentsMode = this.loadDocumentOptions.loadAttachmentsMode;
                                 this.loadDocument(defaultDocument, null, loadOptions);
                              }

                              this.resetServiceHeartbeat(this.serviceHeartbeatStartEnabled);

                              window.setTimeout(() => {
                                 if (queryString['redact']) {
                                    const redactOptions = this.documentViewer.document.annotations.redactionOptions.clone();
                                    redactOptions.viewOptions.mode = 2;
                                    redactOptions.convertOptions.mode = 2;
                                    this.redactionDocumentDlg.show(redactOptions);
                                 }
                              }, 300);
                           })
                           .fail((jqXHR, statusText, errorThrown) => {
                              window.alert("Cannot reach the LEADTOOLS Document Service.\n\nPlease Make sure LEADTOOLS DocumentService is running\n - Examples/Document/JS/DocumentServiceDotNet\n - Examples/Document/JS/DocumentServiceJava\nand verify that the service path is correct, then refresh the application.");
                              this.endBusyOperation();
                           })
                     } else {
                        this.loadDocumentMode = lt.Document.DocumentLoadMode.local;
                        var loadOptions = this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.none);
                        loadOptions.loadAttachmentsMode = this.loadDocumentOptions.loadAttachmentsMode;
                        this.loadDocument("https://demo.leadtools.com/images/pdf/leadtools.pdf", null, loadOptions);
                     }
                  });
            });
         }

         private _prepareAjaxEventHandler: lt.Document.PrepareAjaxEventHandler = null;
         public get hookPrepareAjax(): boolean {
            return this._logAjax;
         }
         public set hookPrepareAjax(value: boolean) {
            if (value && this._prepareAjaxEventHandler == null) {
               // Add our handler to DocumentFactory.prepareAjax
               this._prepareAjaxEventHandler = lt.Document.DocumentFactory.prepareAjax.add((sender: any, e: lt.Document.PrepareAjaxEventArgs) => this.prepareAjaxHandler(sender, e));
            } else if (!value && this._prepareAjaxEventHandler != null) {
               // If we are using a user token, then we must use prepare AJAX
               if (this._userToken) {
               } else {
                  // Remove our handler to DocumentFactory.prepareAjax
                  lt.Document.DocumentFactory.prepareAjax.remove(this._prepareAjaxEventHandler);
                  this._prepareAjaxEventHandler = null;
               }
            }

            // And log
            this._logAjax = value;
         }

         addUserTokenToUrl = (url: URL) => {
            if (!this.hasUserToken)
               return;

            url.searchParams.append('documentUserToken', this._userToken);
         }

         public addUserTokenToFetch = (fetchData: RequestInit) => {
            if (!this.hasUserToken)
               return;

            if (!fetchData.headers)
               fetchData.headers = {};

            fetchData.headers["user-token"] = this._userToken;
         }

         private _logAjax: boolean = true;
         // DocumentFactory.prepareAjax event handler to inspect (or modify) all calls made to DocumentService
         private prepareAjaxHandler(sender: any, e: lt.Document.PrepareAjaxEventArgs): void {
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
               } else {
                  dataObj = JSON.parse(e.settings.data);
               }
            } else {
               dataObj = e.settings.data;
            }

            // Here, we will parse some of the data
            if (dataObj && (dataObj["uri"] || dataObj["documentId"])) {
               if (e.sourceMethod == "LoadFromUri") {
                  // Load from URL, get the URL being used
                  msg += " uri:" + dataObj["uri"];
               } else {
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
         }

         private initFromJSON(json?: {}): void {
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
                  } catch (e) { }

               }
            }

            if (json && json['presetExpressions']) {
               const expressionList: Dialogs.PresetOption[] = [];
               const unparsedExpressions: any[] = json['presetExpressions'];
               unparsedExpressions.forEach((obj) => {
                  const name = obj['name'];
                  const regex = obj['regex'];
                  const checked = obj['checked'] as boolean;
                  if (!name || !regex) return;
                  expressionList.push({
                     name: name,
                     regex: regex,
                     checked: checked
                  });
               });

               this.redactionDocumentDlg.presetOptions = expressionList;
            }
         }

         // load LEADDocument type(Service, Local, Local Then Serivce)
         public loadDocumentMode: lt.Document.DocumentLoadMode = lt.Document.DocumentLoadMode.service;
         // Last successful load options
         public loadDocumentOptions: lt.Document.LoadDocumentOptions = new lt.Document.LoadDocumentOptions();

         // Default load document timeout in milliseconds (0 = no timeout)
         public loadDocumentTimeoutMilliseconds: number = 0;

         // If true, document conversion (export) will be done in a non-blocking fashion on the service
         // (though still blocking in the UI) and the status of the conversion will be checked with polling.
         public useStatusQueryRequests: boolean = true;
         private static _queryStatusMinWaitFromResponse: number = 2000;
         private static _queryStatusMinWaitFromRequest: number = 3000;

         // If true, verify the mimetype of an uploaded document before loading it to ensure it's acceptable.
         public verifyUploadedMimeTypes: boolean = true;

         // By default, CSS Transitions are off in all browsers.
         // Use of this feature may cause issues with annotations rendering.
         private _useCSSTransitions: boolean = false;
         public get useCSSTransitions(): boolean {
            return this._useCSSTransitions;
         }
         public set useCSSTransitions(value: boolean) {
            if (this._useCSSTransitions === value)
               return;

            this._useCSSTransitions = value;
            this.updateUseCSSTransitions();
         }
         private updateUseCSSTransitions(): void {
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
         }

         private static _cssTransformsHideCanvasClass = "hide-for-transitions";
         private static _cssTransformsReadyCanvasClass = "ready-for-transitions";
         private _cssTransitionsCallbackPending: boolean = false;
         private _cssTransitionsEnded = (event: TransitionEvent) => {
            if (this._cssTransitionsCallbackPending) {
               /// DONE ///
               this._cssTransitionsStopListening();
            }
         }
         private _cssTransitionsStopListening(): void {
            this._cssTransitionsCallbackPending = false;
            var imageViewer = this._documentViewer.view.imageViewer;
            imageViewer.viewDiv.removeEventListener("transitionend", this._cssTransitionsEnded, false);
            lt.LTHelper.removeClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsHideCanvasClass);
         }
         private imageViewer_elementsUpdatedCSS = (sender: any, e: lt.Controls.ImageViewerElementsUpdatedEventArgs) => {
            if (!e.isTransitionsEnabled) {
               // transitions are disabled. End our listening.
               if (this._cssTransitionsCallbackPending)
                  this._cssTransitionsStopListening();
            }
            else if (!this._cssTransitionsCallbackPending) {
               /// START ///
               this._cssTransitionsCallbackPending = true;
               var imageViewer = this._documentViewer.view.imageViewer;
               imageViewer.viewDiv.addEventListener("transitionend", this._cssTransitionsEnded, false);
               lt.LTHelper.addClass(imageViewer.foreCanvas, DocumentViewerDemoApp._cssTransformsHideCanvasClass);
            }
         }

         // Use SVG back image
         public useSvgBackImage: boolean = true;

         public serviceHeartbeatStartEnabled: boolean = false;
         public serviceHeartbeatStartTimer: number = 2000;
         public serviceHeartbeatIntervalTimer: number = 15000;
         public serviceHeartbeatAutoPauseTimer: number = 60000;
         private static serviceHeartbeatFailureMessage_default: string = "The client is no longer connected to the service.\nDocument '${documentId}' will not be saved. Please verify the connection to the service and try again.";
         public serviceHeartbeatFailureMessage: string = DocumentViewerDemoApp.serviceHeartbeatFailureMessage_default;
         public serviceHeartbeat: lt.Demos.Utils.ServiceHeartbeat = null;
         private createServiceHeartbeat(): void {
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
         }

         public resumeServiceHeartbeat(): void {
            if (this.serviceHeartbeat) {
               this.serviceHeartbeat.resume();
            }
         }

         public resetServiceHeartbeat(onOff: boolean): void {
            if (this.serviceHeartbeat) {
               this.serviceHeartbeat.stop();
               this.serviceHeartbeat.startTimeout = this.serviceHeartbeatStartTimer;
               this.serviceHeartbeat.resumeTimeout = this.serviceHeartbeatStartTimer;
               this.serviceHeartbeat.interval = this.serviceHeartbeatIntervalTimer;
               this.serviceHeartbeat.autoPauseInteractionTimeout = this.serviceHeartbeatAutoPauseTimer;
               if (onOff)
                  this.serviceHeartbeat.start();
            }
         }

         private beforeServiceHeartbeat = (sender, args: lt.Demos.Utils.ServiceHeartbeatPreRequestEventArgs) => {
            // Create Endpoint URL using serviceUri
            var endpointUrl = lt.Document.Service.Custom.createEndpointUrl("Test", "Heartbeat");
            // Create GET settings using URL and param
            var settings = lt.Document.Service.Custom.createGetAjaxSettings<lt.Document.Service.Request>(endpointUrl, {
               userData: lt.Document.DocumentFactory.serviceUserData
            });

            // Send PrepareAjax, cancel if needed
            if (lt.Document.DocumentFactory.cancelFromPrepareAjax(this, "DocumentViewerDemoApp", "Heartbeat", settings, false)) {
               // Cancel this request
               args.cancel = true;
            }
            else {
               args.serviceHeartbeat.requestSettings = settings;
            }
         }

         private afterServiceHeartbeat = (sender, args: lt.Demos.Utils.ServiceHeartbeatPostRequestEventArgs) => {
            if (this.serviceHeartbeat && args.isError) {
               lt.LTHelper.logError(args);
               this.showServiceFailure();
            }
         }

         private showServiceFailure(): void {
            var message = this.serviceHeartbeatFailureMessage || DocumentViewerDemoApp.serviceHeartbeatFailureMessage_default;
            message = message.replace("${documentId}", this.documentViewer.hasDocument ? this.documentViewer.document.documentId : "[null]");
            alert(message);
            lt.LTHelper.logError(message);
            if (this.serviceHeartbeat) {
               this.serviceHeartbeat.stop();
            }
         }

         // Create the document viewer
         private initDocumentViewer(): void {
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
            } else if (lt.LTHelper.browser === lt.LTBrowser.firefox) {
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

            var logRenderErrors = function (sender: any, e: lt.Controls.ImageViewerRenderEventArgs) {
               var item = e.item != null ? e.item.imageViewer.items.indexOf(e.item) : -1;
               var message = "Error during render item " + item + " part " + (e.part) + ": " + (e.error.message);
               lt.LTHelper.logError({ message: message, error: e.error });
            }

            var imageViewer = this._documentViewer.view.imageViewer;

            // Helps with debugging of there was a rendering error
            imageViewer.renderError.add(logRenderErrors);
            if (this._documentViewer.thumbnails && this._documentViewer.thumbnails.imageViewer)
               this._documentViewer.thumbnails.imageViewer.renderError.add(logRenderErrors);
            imageViewer.interpolation.add((sender: any, e: lt.Controls.InterpolationEventArgs) => {
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

            this._operationHandler = this._documentViewer.operation.add((sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => this.documentViewer_Operation(sender, e));

            // Hook to a post render handler, to render text indicators
            this._documentViewer.view.imageViewer.postRenderItem.add((sender: any, e: lt.Controls.ImageViewerRenderEventArgs) => this.imageViewer_PostRenderItem(sender, e));
            if (this._documentViewer.thumbnails != null)
               this._documentViewer.thumbnails.imageViewer.postRenderItem.add((sender: any, e: lt.Controls.ImageViewerRenderEventArgs) => this.imageViewer_PostRenderItem(sender, e));

            // Set runLinkKeyModifier for the page links interactive mode (Ctrl + Click, will run page links)
            var imageViewerInteractiveModes = imageViewer.interactiveModes;
            imageViewerInteractiveModes.beginUpdate();
            for (var i = 0; i < imageViewerInteractiveModes.count; i++) {
               var mode = <lt.Controls.ImageViewerInteractiveMode>imageViewerInteractiveModes.item(i);
               if (mode.id == lt.Document.Viewer.DocumentViewer.pageLinksInteractiveModeId) {
                  (<lt.Document.Viewer.DocumentViewerPageLinksInteractiveMode>mode).runLinkKeyModifier = lt.Controls.Keys.control;
               }
            }
            imageViewerInteractiveModes.endUpdate();

            // Set up the ImageViewer keydown to delete annotation
            var parentDiv = imageViewer.interactiveService.eventsSource;
            var $parentDiv = $(parentDiv);
            $parentDiv.on("mousedown pointerdown", (e: JQueryEventObject) => {
               if (parentDiv !== document.activeElement)
                  parentDiv.focus();
            });
            $parentDiv.on("keydown", (e: JQueryEventObject) => {
               this._annotationsPart.interactiveService_keyDown(e);
            });
         }

         // Update the UI state of the app
         private updateDemoUIState(): void {
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
               } else {
                  $(this.navigationbar.showBookmarksBtn).removeClass("activeNavigationbarBtn");
                  if (!($(this.navigationbar.showBookmarksBtn).is(":disabled")))
                     $(this.navigationbar.showBookmarksBtn).prop("disabled", true);
                  if (!lt.Demos.Utils.Visibility.isHidden($(this.bookmarksContainer)))
                     $(this.bookmarksContainer).hide();
               }

               if (this._documentViewer.document.attachments.count > 0) {
                  if ($(this.navigationbar.showAttachmentsBtn).is(":disabled"))
                     $(this.navigationbar.showAttachmentsBtn).prop("disabled", false);
               } else {
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
               } else if (this._documentViewer.thumbnails) {
                  this.showContainer(this.thumbnailsContainer, false);
               }
            } else {
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
         }

         public updateUIState(): void {
            this.commandsBinder.run();
            this.updateContainers();
         }

         public showServiceError(message: string, jqXHR: JQueryXHR, statusText: string, errorThrown: string): void {
            var serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);

            var serviceMessage;
            var showAlert = true;
            if (!serviceError.isParseError && !serviceError.isBrowserError && !serviceError.isError && !!serviceError.methodName && !!serviceError.exceptionType) {
               var parts: string[] = [];

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
                  serviceMessage = "The request failed for an unknown reason. Check the connection to the Document Service."
               }
            }

            if (showAlert) {
               window.alert(message + "\n" + serviceMessage);
            }
         }

         public setDocument(document: lt.Document.LEADDocument): void {
            this._annotationsPart.closeDocument();

            // Check if the document is encrypted
            if (document.isEncrypted && !document.isDecrypted) {
               // This document requires a password
               this.endBusyOperation();
               this.decryptDocument(document);
            } else {
               this.checkParseStructure(document);
            }
         }

         private decryptDocument(document: lt.Document.LEADDocument): void {
            this.inputDlg.showWith("Enter Password", "This document is encrypted. Enter the password to decrypt it.", null, true, false);
            this.inputDlg.onApply = (password: string) => {
               var decryptPromise = document.decrypt(password);
               decryptPromise.done((): void => {
                  this.beginBusyOperation();
                  this.loadingDlg.show(false, false, "Set Document...", null, () => {
                     this.checkParseStructure(document);
                  });
               });
               decryptPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
                  this.showServiceError("Error decrypting the document.", jqXHR, statusText, errorThrown);
                  this.inputDlg.show();
               });
               return true;
            };
         }

         private checkParseStructure(document: lt.Document.LEADDocument): void {
            // See if we need to parse the document structure
            if (document.isStructureSupported) {
               if (document.structure.isParsed) {
                  this.checkLoadAnnotationsFile(document);
                  // Customize bookmarks list
                  this.populateBookmarks(document.structure)
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
         }

         private parseStructure(document: lt.Document.LEADDocument): void {
            document.structure.parse()
               .done((document: lt.Document.LEADDocument): void => {
                  this.checkLoadAnnotationsFile(document);
                  // Customize bookmarks list
                  this.populateBookmarks(document.structure);
               })
               .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  this.showServiceError("Error parsing the document structure.", jqXHR, statusText, errorThrown);
                  this.checkLoadAnnotationsFile(document);
               });
         }

         private populateBookmarks(structure: lt.Document.DocumentStructure): void {

            this.clearBookmarks();

            var list = document.getElementById("bookmarksTree");
            if (list) {

               if (structure != null && structure.bookmarks != null) {
                  var bookmarks = new Array<lt.Document.DocumentBookmark>(structure.bookmarks.length);
                  for (var i = 0; i < structure.bookmarks.length; i++)
                     bookmarks[i] = structure.bookmarks[i];

                  this.addBookmarks(bookmarks, list);
               }
            }
         }

         private clearBookmarks(): void {
            var list = document.getElementById("bookmarksTree");
            if (list) {
               for (var i = list.childNodes.length - 1; i >= 0; i--)
                  list.removeChild(list.childNodes[i]);
            }
         }

         private addBookmarks(bookmarks: lt.Document.DocumentBookmark[], baseElement: HTMLElement): void {
            if (bookmarks == null)
               return;

            for (var i = 0; i < bookmarks.length; i++) {
               var titleElement: HTMLElement = document.createElement("li");

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
               $(titleSpan).data("bookmark", bookmarks[i])
               titleElement.appendChild(titleSpan);
               baseElement.appendChild(titleElement);
               // handle click event, to go to the selected bookmark
               // using the attached data
               titleSpan.onclick = (e: MouseEvent) => this.bookmarkTitleSpan_Click(e);

               var parentElement = titleElement;
               if (bookmarks[i].children.length > 0) {
                  parentElement = <HTMLElement>document.createElement("ul");
                  titleElement.appendChild(parentElement);
               }
               this.addBookmarks(bookmarks[i].children, parentElement);
            }
         }

         private bookmarkTitleSpan_Click(e: MouseEvent): void {
            // Get attached data
            var bookmark = <lt.Document.DocumentBookmark>$(e.currentTarget).data("bookmark");
            this._documentViewer.gotoBookmark(bookmark);

            // Unmark all bookmarks
            lt.Demos.Utils.UI.toggleChecked($(".bookmark"), false);
            // Mark the selected one
            lt.Demos.Utils.UI.toggleChecked($(e.currentTarget), true);
         }

         public finishSetDocument(document: lt.Document.LEADDocument): void {
            const currentDocument = this._documentViewer.document;
            const autoDisposeDocumentState = this._documentViewer.autoDisposeDocument;
            let autoDisposeDocument = autoDisposeDocumentState;

            // Inform whoever is listening that we are about to set a new document in the viewer
            // This includes history
            const documentChangedCallback = this._historyPart.documentChangedCallbacks;
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
            } else {
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
            } finally {
               this._documentViewer.autoDisposeDocument = autoDisposeDocumentState;
            }
             
            if (this.documentViewer.thumbnails != null)
               this.documentViewer.thumbnails.imageViewer.selectedItemsChanged.add((sender: any, e: lt.LeadEventArgs) => this.thumbnailsActiveItemChanged(sender, e));

            if (document) {
               this.setInterpolationMode(document, !this._documentViewer.commands.canRun(lt.Document.Viewer.DocumentViewerCommands.viewItemType, lt.Document.Viewer.DocumentViewerItemType.svg));
            } else {
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
         }

         private _loadDocumentAnnotationsFile: any = null;
         private checkLoadAnnotationsFile(document: lt.Document.LEADDocument): void {
            var annotations = this._loadDocumentAnnotationsFile;
            this._loadDocumentAnnotationsFile = null;

            // Check if annotations passed as file or blob - Since File extends Blob, we only need to check if the object is an instance of the base class Blob.
            if (annotations && lt.LTHelper.supportsFileReader && annotations instanceof Blob) {
               var fileReader = new FileReader();
               fileReader.readAsText(annotations);
               fileReader.onload = (ev: any) => {
                  // done reading annotations
                  var annotations: string = ev.target.result;
                  if (annotations != null && annotations.length > 0) {
                     var annCodecs = new lt.Annotations.Engine.AnnCodecs();
                     var containers: lt.Annotations.Engine.AnnContainer[] = annCodecs.loadAll(annotations);
                     if (containers != null && containers.length > 0) {
                        var setAnnotationsPromise: JQueryPromise<void> = document.annotations.setAnnotations(containers);

                        setAnnotationsPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                           this.showServiceError("Error setting document annotations.", jqXHR, statusText, errorThrown);
                        });

                        setAnnotationsPromise.always((): void => {
                           // Even if error occurred while setting document annotations, we should still be able to view the document without annotations
                           this.finishSetDocument(document);
                        });
                     }
                     else {
                        alert("No annotations could be found in the provided annotations file.");
                        this.finishSetDocument(document);
                     }
                  } else {
                     // Text is empty
                     this.finishSetDocument(document);
                     window.alert("The provided annotations file is empty.");
                  }
               };
               fileReader.onerror = () => {
                  // could not read as text
                  window.alert("An error has occurred while reading annotations file as text.");
                  this.finishSetDocument(document);
               };
            } else {
               this.finishSetDocument(document);
            }
         }

         private thumbnailsActiveItemChanged(sender: any, e: lt.LeadEventArgs): void {
            // Hide thumbnails container after select page on mobile version
            if (DocumentViewerDemoApp.isMobileVersion) {
               var visibleThumbnails = !lt.Demos.Utils.Visibility.isHidden($(this.thumbnailsContainer));
               if (visibleThumbnails) {
                  $(this.navigationbar.showThumbnailsBtn).removeClass("activeNavigationbarBtn");
                  $(this.thumbnailsContainer).hide();
                  this.updateContainers();
               }
            }
         }

         public closeDocument(): void {
            if (this._documentViewer.document == null)
               return;

            this.finishSetDocument(null);
         }

         private _documentPrintCanceled: boolean = false;
         private _endDocumentPrint(): void {
            if (!this._documentPrintCanceled) {
               if (this.loadingDlg && this.loadingDlg.cancelClick === this._endDocumentPrint)
                  this.loadingDlg.cancelClick = null;
               this._documentPrintCanceled = true;
               this.endBusyOperation();
            }
         }

         public doPrint(options: lt.Document.Viewer.PrintDocumentOptions): void {
            this._documentPrintCanceled = false;
            this.beginBusyOperation();

            this.loadingDlg.progress(0);

            this.loadingDlg.cancelClick = this._endDocumentPrint;
            this.loadingDlg.show(true, true, "Preparing for print...", null, () => {
               if (options.usePdfPrinting)
                  this.loadingDlg.progress(100);

               options.parent = (options.usePdfPrinting) ? document.getElementById('pdfPrintFrame') :this._printElement;
               // Force all the pages to be loaded by URL
               //options.usePDFClientRendering = false;

               // Optionally, you can specify not to automatically open the browser print dialog once the pages are ready.
               // You are then responsible for opening it after you've done what you need to the data
               //options.autoOpenBrowserPrint = false;

               this._documentViewer.print(options)
                  .done((data: any) => {

                     if (!options.usePdfPrinting) {

                        const printData = data as lt.Document.Viewer.DocumentPrintData;

                        // You may modify the data here and then open the browser print yourself
                        // Otherwise, by the time this callback is called the dialog should already be open.
                        if (printData && printData.options && !printData.options.autoOpenBrowserPrint)
                           this._documentViewer.openBrowserPrint(printData.options.parent, printData.root, printData.options.title, printData.printStyles);
                     }

                     // PDF-printing will only return an object if options.autoOpenBrowserPrint = false;
                     if (options.usePdfPrinting && !options.autoOpenBrowserPrint) {

                        // PDFPrintResult will contain a local object URI to the PDF document.
                        // If the document needed to be converted to PDF, it will also contain the document ID
                        // for the converted document in the cache.
                        //
                        // Calling PDFPrintResult.dispose() will revoke the local object URI & dispose of the converted
                        // document from the cache.
                        const pdfData = data as lt.Document.PDFPrintResult;
                     }
                  })
                  .fail((err: Error) => {
                     // All errors will come here
                     this.endBusyOperation();

                     if (this._documentPrintCanceled && options.usePdfPrinting) {
                        // aborted, supress error.
                        return;
                     }
                     
                     if (this.loadingDlg.cancelClick === this._endDocumentPrint)
                        this.loadingDlg.cancelClick = null;

                     // Check if canceled / aborted
                     if (err) {
                        window.alert(err);
                     }
                  })
                  .always(() => {
                     if (options.usePdfPrinting)
                        this.loadingDlg.hide();
                  })
                  .progress((data: any) => {
                     if (typeof (data) === "string" && lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                        this.loadingDlg.hide();
                     }

                     // If PDF printing is enabled, and conversion is required to natively print the PDF,
                     // the print method will fire a progress event with the RunConvertJobResult.
                     if (this._documentPrintCanceled && data instanceof lt.Document.Converter.RunConvertJobResult)
                        lt.Document.Converter.StatusJobDataRunner.abortConvertJob(data.userToken, data.jobToken);
                  });
            });
         }

         private static _elementsPageErrorClass: string = "lt-image-error";

         private documentViewer_Operation(sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            var index = e.pageNumber - 1;

            // If we have an error, show it
            // Printing errors are handled by the promise returned from the Print() call
            if (e.error && e.operation !== lt.Document.Viewer.DocumentViewerOperation.printPages) {
               // If using client PDF rendering, setDocument may have an error as well
               if (e.operation === lt.Document.Viewer.DocumentViewerOperation.setDocument && e.pageNumber === -1) {
                  var viewer = <lt.Document.Viewer.DocumentViewer>sender;
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

            var runCommandsBinder: boolean = true;
            var updateContainers: boolean = e.isPostOperation;

            var documentViewer = <lt.Document.Viewer.DocumentViewer>sender;
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
                     var printData = <lt.Document.Viewer.DocumentPrintData>e.data1;
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
                  } else {
                     // An error occurred
                     if (e.pageNumber === 0) {
                        // This an error that occurred when loading the whole document, set the class in the view itself
                        // The document viewer adds lt-image-error style to the whole view lt-item.
                     } else {
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
                           lt.Demos.Utils.Visibility.toggle($(this._toolTipUI.tip), false)
                        }
                     }

                     // Get the link and check if its an external one
                     var link = <lt.Document.DocumentLink>e.data1;
                     if (link.linkType == lt.Document.DocumentLinkType.value && link.value) {
                        this.runValueLink(link.value);
                     }
                  }
                  break;

               case lt.Document.Viewer.DocumentViewerOperation.hoverLink:
                  if (e.isPostOperation && !e.error) {
                     if (e.data1) {
                        this.showLinkTooltip(e.pageNumber, <lt.Document.DocumentLink>e.data1, <lt.Controls.InteractiveEventArgs>e.data2);
                     } else {
                        this.hideTooltip();
                     }
                  }
                  break;

               case lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged:
                  if (e.isPostOperation && e.data1) {
                     this._pagePart.updateCurrentPageNumber(<lt.Document.Viewer.CurrentPageNumberChangeData>e.data1);
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
         }

         private _bookmarkLinkClicks: number = 0;
         private _bookmarkLinkClickThreshold: number = 3;

         private showLinkTooltip(sourcePageNumber: number, link: lt.Document.DocumentLink, interactiveEventArgs: lt.Controls.InteractiveEventArgs): void {
            if (!link || !this._documentViewer.view || !this._documentViewer.view.imageViewer)
               return;

            var tooltipTitle: string = "";
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
         }

         private getToolTipBounds(): lt.LeadRectD {
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
         }

         private updateToolTipPosition(bounds: lt.LeadRectD): void {
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
         }


         private drawToolTipHighlight(item: lt.Controls.ImageViewerItem, ctx: CanvasRenderingContext2D): void {
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
         }

         public hideTooltip(): void {
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
         }

         public beginBusyOperation(): void {
            // Get ready ...
            this._isInsideBusyOperation = true;
         }

         public get isInsideBusyOperation(): boolean {
            return this._isInsideBusyOperation;
         }

         public endBusyOperation(): void {
            if (this._isInsideBusyOperation) {
               this._isInsideBusyOperation = false;
               this.loadingDlg.hide();
               // clear the errors
               this._operationErrors = [];
            }
         }

         public toggleInertiaScroll(turnOn?: boolean): void {
            // These commands have ImageViewerPanZoomInteractiveMode in the tag, update the value
            var commandNames = [lt.Document.Viewer.DocumentViewerCommands.interactivePanZoom, lt.Document.Viewer.DocumentViewerCommands.interactivePan];
            for (var i = 0; i < commandNames.length; i++) {
               var mode = <lt.Controls.ImageViewerPanZoomInteractiveMode>this._documentViewer.commands.getCommand(commandNames[i]).tag;
               if (mode != null) {
                  // Use "turnOn" value if defined, else toggle
                  var isEnabled = turnOn !== undefined ? turnOn : !mode.inertiaScrollOptions.isEnabled;
                  mode.inertiaScrollOptions.isEnabled = isEnabled;
                  this.preferencesPart.enableInertiaScroll = isEnabled;
               }
            }
         }

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

         public getTextReason: GetTextReason = GetTextReason.other;

         // For 'Other" get text.
         // In this case, there's probably no callback for after this get text.
         // We really just want to show the busy dialog and hide it after.
         private _otherGetTextCancelClick: () => void;
         private _otherGetTextHandle(e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
            if (!e.isPostOperation) {
               // Start the busy screen
               if (!this._isInsideBusyOperation) {
                  this.beginBusyOperation();
                  this._otherGetTextCancelClick = this.loadingDlg.cancelClick;

                  this.loadingDlg.cancelClick = () => {
                     this.loadingDlg.cancelClick = this._otherGetTextCancelClick;
                     // Show a timeout so users can see the "cancel" feedback in the UI for a moment
                     setTimeout(() => {
                        this.endBusyOperation();
                     }, 500);
                  }
                  this.loadingDlg.show(true, false, "Retrieving Text...", "Page " + e.pageNumber, null);
               }
            }
            else {
               this.loadingDlg.cancelClick = this._otherGetTextCancelClick;
               this.endBusyOperation();
            }
         }

         // For Manual Get Text
         private _manualGetTextPagesNeeded: number[] = null;
         private _manualGetTextPagesRequested: number[] = null;
         // Downside to higher values to limit: You can't always accurately say what page is being worked on for canceling
         private static _manualGetTextRequestLimit: number = 1;
         private _manualGetTextPostOperation: (canceled: boolean, error: Error) => void = null;

         // Manually request page text before operations like ExportText or SelectAll
         public manualGetText(pageNumbers: number[], postOperationCallback: (canceled: boolean, error: Error) => void): void {
            // Start the busy screen
            this.beginBusyOperation();
            this.getTextReason = GetTextReason.manual;

            this._manualGetTextPostOperation = postOperationCallback;

            // Set our cancel callback to force our manual operation to complete
            this.loadingDlg.cancelClick = () => {
               this.loadingDlg.cancelClick = null;

               // In case a GetText returns before our timeout does...
               this._manualGetTextPagesNeeded = [];

               // Show a timeout so users can see the "cancel" feedback in the UI for a moment
               setTimeout(() => {
                  // This does nothing if we already finished,
                  // but does the finish operations if not yet finished
                  this._manualGetTextComplete(true, null);
               }, 500);
            }

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

            this.loadingDlg.show(true, false, "Start Get Text...", null, () => {
               // Start the progression
               this._manualGetTextNextPage();
            });
         }

         private _manualGetTextPageComplete(pageNumber: number, e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
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
         }

         private _manualGetTextNextPage(): void {
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
         }

         private _manualGetTextComplete(canceled: boolean, error: Error): void {
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
         }

         public setInterpolationMode(document: lt.Document.LEADDocument, isSvg: boolean): void {
            var interpolationMode = lt.Controls.InterpolationMode.none;

            // If we are viewing as SVG, then we should not do any interpolation.
            // Also don't do interpolation if we're in UseElements Mode, because all browsers (except IE) will do decent interpolation of img elements.
            if (document != null && !isSvg && (!this._useElements || (lt.LTHelper.browser === lt.LTBrowser.internetExplorer || lt.LTHelper.browser === lt.LTBrowser.edge))) {
               // We are viewing as an image, instruct the image viewer in the view to perform interpolation to smooth out the image
               // when zoomed out

               // If the document is B/W, then it is faster to perform the interpolation using scale to gray. Otherwise, use resample
               if (document.defaultBitsPerPixel == 1) {
                  interpolationMode = lt.Controls.InterpolationMode.scaleToGray;
               } else {
                  interpolationMode = lt.Controls.InterpolationMode.resample;
               }
            }

            this._documentViewer.view.imageViewer.interpolationMode = interpolationMode;
         }

         private imageViewer_PostRenderItem(sender: any, e: lt.Controls.ImageViewerRenderEventArgs): void {
            var imageViewer = <lt.Controls.ImageViewer>sender;
            var isView = imageViewer === this._documentViewer.view.imageViewer;
            if (this.demoMode === DemoMode.Barcode && isView)
               this.drawBarcodes(e.item, e.context);

            var bounds = DocumentViewerDemoApp._getTransformedBounds(e.item);

            var showTextIndicators = this.preferencesPart.showTextIndicators;
            this.drawPageIndicators(imageViewer, e.item, bounds, isView, showTextIndicators, e.context);

            this.drawToolTipHighlight(e.item, e.context);
         }

         private static _getTransformedBounds(item: lt.Controls.ImageViewerItem): lt.LeadRectD {
            var bounds = lt.LeadRectD.create(0, 0, item.imageSize.width, item.imageSize.height);
            var transform = item.imageViewer.getItemImageTransform(item);
            var corners = lt.GeometryTools.getCornerPoints(bounds);
            transform.transformPoints(corners);
            bounds = lt.GeometryTools.getBoundingRect(corners);
            return bounds;
         }

         private static _getScaledRender(bounds: lt.LeadRectD, maxSizeRatio: number, original: number): number {
            var shortSide = Math.min(bounds.width, bounds.height);
            var sizeRatio = Math.min(maxSizeRatio, original / shortSide);
            original = sizeRatio * shortSide;
            return original;
         }

         private static _disabledSymbolDataUrl: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEM0lEQVRIS4VWXWgcVRT+zkyySbCzK1VTEFJEIqWuhOy9o9vtSrPagogWtBBQ8U0FpfomCvokKNIHH0TjSx/FH4wG0RZ8qHVA0+1u9k6o6SoWf1BQaO2P6do62c3ukbPeWSfNpr1PM+d+53znf4ZwjaOUGgewg4juALDFwk8z80kAx8Mw/PFqJmijS6WUdhxnPzM/AGB0A9wZIjrc6XRmwjA0/TDrCAqFwkiz2XwdwH4AA9eK0N6vApgB8JIx5nJSZw1BPp/f0mq15ohoZwLUAXCEiL4AcJaZNwG4AcBeAHcC6Nlg5mODg4P7KpXK6Vi/d6m1zgA4CkDZSzH8cbPZfHppaelCv0iy2WxqeHj4HQBPJO5DAPcaY5ZF1iNQSn1ARI8kDYlHKysr99Xr9b83SlWhUNjcarWeYeZXALiCY+YPwzB8tEeglHqQiD63RpoAUvaZAZzzPG8sCILoSpJ8Pp8eGRm5HARBWyl1mIjujzHMvDcMw0MSAWmtywDyQg6gSkQrzLwrYbBijCnY+664VCp1G0CMi7xUKg03Go1TAMasXleHfN/PMbPkrRud4zg3p1KpS1EU/Qbg+gTJSWPMRJJEnCsUCsNDQ0MsEY6Pjw9lMpl/4tQTkRKCF5j5gDV0yhizTZ4nJydvcV1Xhum6BMlxALuMMa1YJmmqVCoX43et9RyAh7v5J3pR0vMegMcsYMIYsxSDrUdnAKStTNLRdF13rFqtnrOeSlp7Ryk1QUQnrOB9IfhS2koExph1g1csFr0oimRKb0vYuRBF0dZ+3SURra6u/mXJjwrBV1IzUXZdd1u1WpVCrTm2gAsAZB/JkRn5wfO8iSAIZIrXHK21pFCaIJAafMLM+wThOM5dCwsLYqjv0VpLJPEgCuZiFEU31et1ae3eiQmIaI6UUq8S0cv29nljzBsJrKSsl2OpSTqdPkREexKYXzqdTn5xcfFPkWmttwL4VZ6Z+TXK5XK7Hcc5YhXaqVRqtFwun5e0BEEgnkk6aHp62pmdnZUii5Fep1gHfnddd1IK7/v+ZzJk3Tx2OnvI5rcO4Nb/SLmcTqd3B0GwYpWpWCxump+fbyQj01p/m6iJYH8iopCZH7e4nz3Py3a7xvf9Z5n5LXshJFNhGH4t7zaSdWvCRiIbYEccfbyL5J2InqvVam93CexWFHBykx4YGBh4M7l6+1Xe9/13E17HkDCKooIUP7lNtxPRNwA2JwzJZG+3dejbWUqpgIimEpfnmfnuMAy/70aS1PJ9v8jMnwK4MSG/BOAPAHPMLDMzSET3ENEoM2sAslociz9LRA/VarX5WH/d5OZyuduJ6OAVXzVp1Q2/3zbn5Xa7/eTi4uJ3Saf7KskqbjQaT9nvcrZvbv4XSgfOeJ53sN9UX9UrIVpeXt7pOM4UEWWZOf5tkS6pt9vtjzKZzLF+hmP+fwH48rr13f+87gAAAABJRU5ErkJggg==";
         private static _disabledSymbolImage: HTMLImageElement = null;
         private static _loadDisabledSymbolImage(): void {
            var app = DocumentViewerDemoApp;
            if (app._disabledSymbolImage)
               return;
            var image = document.createElement("img");
            image.src = app._disabledSymbolDataUrl;
            app._disabledSymbolImage = image;
         }

         private _disabledPageIconCanvas: HTMLCanvasElement = null;
         private drawPageIndicators(imageViewer: lt.Controls.ImageViewer, item: lt.Controls.ImageViewerItem, bounds: lt.LeadRectD, isView: boolean, showTextIndicator: boolean, context: CanvasRenderingContext2D): void {
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
               var topRight: lt.LeadPointD = bounds.topRight;
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
               var topLeft: lt.LeadPointD = lt.LeadPointD.create(Math.floor(bounds.topLeft.x), Math.floor(bounds.topLeft.y));
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
         }

         private static _emailRegEx: RegExp = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

         private runValueLink(linkValue: string): void {
            // Check if this is an email address
            if (linkValue.toLowerCase().slice(0, "mailto:".length) != "mailto:" && DocumentViewerDemoApp._emailRegEx.test(linkValue)) {
               // Yes
               linkValue = "mailto:" + linkValue;
               window.location.href = linkValue;
            } else {
               if (this._automaticallyRunLinks) {
                  if ((linkValue.toLowerCase().slice(0, "http:".length) != "http:") && (linkValue.toLowerCase().slice(0, "https:".length) != "https:")) {
                     window.open("http://" + linkValue);
                  } else {
                     window.open(linkValue);
                  }
               } else {
                  this.linkValueDlg.show(linkValue);
                  this.linkValueDlg.onClose = () => {
                     this._automaticallyRunLinks = this.linkValueDlg.doNotShowAgain;
                  }
               }
            }
         }

         get documentViewer(): lt.Document.Viewer.DocumentViewer {
            return this._documentViewer;
         }

         // annotations may be passed as File or as string
         public loadDocument(documentUri: string, annotations: any, loadOptions: lt.Document.LoadDocumentOptions): void {
            this.videoPlayer.hide();
            
            // Clear the errors
            this._operationErrors = [];

            // Go ahead and load the URI
            this.beginBusyOperation();
            if (this.verifyUploadedMimeTypes && documentUri && lt.Document.DocumentFactory.isUploadDocumentUri(documentUri)) {
               this.loadingDlg.show(false, false, "Loading Document...", "Verifying Document", () => {
                  // If we are dealing with an uploaded document, we can verify that it's a supported mimeType
                  lt.Document.DocumentFactory.checkCacheInfo(documentUri)
                     .done((cacheInfo: lt.Document.CacheInfo) => {

                        if (!cacheInfo || cacheInfo.isMimeTypeAccepted) {
                           // If it doesn't exist, let the LoadFromUri fail.
                           // If successful, continue.
                           this.loadingDlg.processing("Loading Document...", null);
                           this.loadFromUri(documentUri, annotations, loadOptions);
                        }
                        else {
                           // This mimeType is not acceptable. Show a download link instead.
                           var downloadUrl = lt.Document.Service.Custom.createEndpointGetUrl("Factory", "DownloadDocument", {
                              uri: documentUri,
                              includeAnnotations: true,
                              userData: lt.Document.DocumentFactory.serviceUserData
                           }, true)

                           this.linkMessageDlg.show(
                              "Download Document",
                              "The document with URI '" + documentUri + "' was rejected by the service. Use the link below to download this document for viewing in a different application.",
                              documentUri,
                              downloadUrl
                           );
                           this.endBusyOperation();
                        }
                     })
                     .fail((xhr: JQueryXHR, statusText: string, errorThrown: string) => {
                        lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                        this.endBusyOperation();
                     });
               });
            }
            else {
               this.loadingDlg.show(false, false, "Loading Document...", null, () => {
                  this.loadFromUri(documentUri, annotations, loadOptions);
               });
            }
         }

         public createLoadOptions(annotations: any, annotationsLoadOption: DocumentViewerDemo.AnnotationsLoadOption, documentName?: string, firstPage?: number, lastPage?: number): lt.Document.LoadDocumentOptions {
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
         }

         private setAnnotationsFile(annotations: any, loadOptions: lt.Document.LoadDocumentOptions) {
            // Check if annotations passed as file or blob - Since File extends Blob, we only need to check if the object is an instance of the base class Blob.
            if (annotations && lt.LTHelper.supportsFileReader && annotations instanceof Blob) {
               // Set this provided file for us to load after everything else
               this._loadDocumentAnnotationsFile = annotations;
            } else {
               // we're here either because the annotations were a URI or we don't support FileReader
               if (annotations && !loadOptions.annotationsUri && !lt.LTHelper.supportsFileReader) {
                  alert("Your browser does not support the FileReader API, so annotations could not be loaded.")
               }
               this._loadDocumentAnnotationsFile = null;
            }
         }

         private loadFromUri(documentUri: string, annotations: any, loadOptions: lt.Document.LoadDocumentOptions): void {
            lt.Document.DocumentFactory.loadFromUri(documentUri, loadOptions)
               .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  this.endBusyOperation();
                  this.showServiceError("Error loading the document.", jqXHR, statusText, errorThrown);
               })
               .done((document: lt.Document.LEADDocument): void => {
                  this.loadingDlg.processing("Set Document...", null);
                  this.loadDocumentOptions.loadAttachmentsMode = loadOptions.loadAttachmentsMode;

                  // Set this provided file for us to load after everything else
                  this.setAnnotationsFile(annotations, loadOptions);
                  this.setDocument(document);

                  this.loadDocumentOptions = loadOptions.clone();
               });
         }

         // annotations may be passed as File or as string
         public loadDocumentAttachment(ownerDocument: lt.Document.LEADDocument, attachmentNumber: number): void {
            // Clear the errors
            this._operationErrors = [];

            // Go ahead and load the URI
            this.beginBusyOperation();
            this.loadingDlg.show(false, false, "Loading Attachment...", null, () => {
               var loadAttachmentOptions = new lt.Document.LoadAttachmentOptions();
               loadAttachmentOptions.attachmentNumber = attachmentNumber;
               // Use the last load options we used.
               loadAttachmentOptions.loadDocumentOptions = this.loadDocumentOptions.clone();
               // Reset the variables that may have been set which do not concern us
               loadAttachmentOptions.loadDocumentOptions.firstPageNumber = 1;
               loadAttachmentOptions.loadDocumentOptions.lastPageNumber = -1;
               loadAttachmentOptions.loadDocumentOptions.documentId = null;
               lt.Document.DocumentFactory.loadDocumentAttachment(ownerDocument, null, loadAttachmentOptions)
                  .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                     this.endBusyOperation();
                     this.showServiceError("Error loading the document.", jqXHR, statusText, errorThrown);
                  })
                  .done((document: lt.Document.LEADDocument): void => {
                     // Update the attachment of the owner document
                     DocumentViewerDemoApp.updateAttachment(ownerDocument, attachmentNumber, document);
                     this.loadingDlg.processing("Set Document...", null);
                     this.setDocument(document);
                  });
            });
         }

         private static updateAttachment(ownerDocument: lt.Document.LEADDocument, attachmentNumber: number, attachmentDocument: lt.Document.LEADDocument): void {
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
         }

         public uploadDocument(documentFile: File, annotationsFile: File, loadOptions: lt.Document.LoadDocumentOptions): void {
            this.beginBusyOperation();
            this.loadingDlg.show(true, true, "Uploading Document...", null, () => {

               var uploadPromise;

               if (this.loadDocumentMode == lt.Document.DocumentLoadMode.service) {
                  uploadPromise = lt.Document.DocumentFactory.uploadFile(documentFile)
                  uploadPromise.done((uploadedDocumentUrl: string): void => {
                     this.loadingDlg.progress(100);
                     this.loadDocument(uploadedDocumentUrl, annotationsFile, loadOptions);
                  });
               } else {
                  uploadPromise = lt.Document.DocumentFactory.loadFromFile(documentFile, loadOptions);
                  uploadPromise.done((document: lt.Document.LEADDocument): void => {
                     this.loadingDlg.progress(100);

                     this.loadingDlg.processing("Set Document...", null);
                     // Set this provided file for us to load after everything else
                     this.setAnnotationsFile(annotationsFile, loadOptions);
                     this.setDocument(document);
                     this.loadDocumentOptions = loadOptions.clone();
                  });
               }

               uploadPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  var serviceError = lt.Document.ServiceError.parseError(jqXHR, statusText, errorThrown);
                  if (serviceError.isAbortError) {
                     // aborted
                     return;
                  }

                  this.endBusyOperation();
                  this.showServiceError("Error uploading document.", jqXHR, statusText, errorThrown);
               });

               uploadPromise.progress((progressOb: lt.Document.DocumentUploadProgress): void => {
                  this.loadingDlg.progress(Math.round(progressOb.progress));
                  if (this.loadingDlg.isCancelled) {
                     uploadPromise.abort();
                     this.loadingDlg.progress(100);
                     this.endBusyOperation();
                  }
               });
            });
         }

         public loadCachedDocument(cacheId: string, showLoadFromCacheDialog: boolean): void {
            const documentChangedCallback = this._historyPart.documentChangedCallbacks;

            this.beginBusyOperation();
            this.loadingDlg.show(false, false, "Loading Cached Document...", null, () => {

               var loadFromCachePromise = lt.Document.DocumentFactory.loadFromCache(cacheId);

               loadFromCachePromise.done((document: lt.Document.LEADDocument): void => {
                  if (document) {
                     this.loadingDlg.processing("Set Document...", null);
                     this._loadDocumentAnnotationsFile = null;
                     this.setDocument(document);
                  }
                  else {
                     // Delay for UI smoothing
                     setTimeout(() => {
                        // No document was found in the cache, try again
                        if (showLoadFromCacheDialog) {
                           this._filePart.openFromCacheClick(cacheId);
                        }
                        this.endBusyOperation();
                        var message = "No document could be found in the cache for the identifier '" + cacheId + "'.";
                        lt.LTHelper.logError(message);
                        alert(message);
                        if (documentChangedCallback && documentChangedCallback.aborted)
                           documentChangedCallback.aborted();
                     }, 500);
                  }
               });

               loadFromCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  this.endBusyOperation();
                  this.showServiceError("Error loading cached document.", jqXHR, statusText, errorThrown);
                  if (documentChangedCallback && documentChangedCallback.aborted)
                     documentChangedCallback.aborted();
               });
            });
         }

         public saveDocumentToCache(document: lt.Document.LEADDocument): JQueryPromise<void> {
            this._historyPart.documentSavedToCache(document);
            return lt.Document.DocumentFactory.saveToCache(document);
         }

         public saveAttachmentToCache(document: lt.Document.LEADDocument, attachmentNumber: number): JQueryPromise<string> {
            var saveAttachmentToCacheOptions = new lt.Document.SaveAttachmentToCacheOptions();
            saveAttachmentToCacheOptions.attachmentNumber = attachmentNumber;
            return lt.Document.DocumentFactory.saveAttachmentToCache(document, null, saveAttachmentToCacheOptions);
         }

         public static isDocumentInCache(document: lt.Document.LEADDocument): boolean {
            return (document && document.dataType != lt.Document.DocumentDataType.transient) ? true : false;;
         }

         public convertDocument(jobData: lt.Document.DocumentConverterJobData): void {
            var doc = this.documentViewer.document;

            // Finally, try to add the name of the document for the conversion result
            var name: string = null;
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
            this.loadingDlg.show(false, false, "Saving to cache...", null, () => {

               if (hasChanged || doc.isAnyCacheStatusNotSynced) {
                  // Save will update the document in the server
                  var saveToCachePromise = this.saveDocumentToCache(doc);
                  saveToCachePromise.done((): void => {
                     this.runConvertPromise(doc, jobData);
                  });
                  saveToCachePromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                     this.endBusyOperation();
                     this.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                  });
               }
               else {
                  this.runConvertPromise(doc, jobData);
               }
            });
         }

         private runConvertPromise(documentToConvert: lt.Document.LEADDocument, jobData: lt.Document.DocumentConverterJobData): void {
            this.loadingDlg.processing("Converting...", null);

            // Now convert it
            if (this.useStatusQueryRequests)
               this.runConvertJob(documentToConvert, jobData);
            else
               this.runConvert(documentToConvert, jobData);
         }

         private runConvert(documentToConvert: lt.Document.LEADDocument, jobData: lt.Document.DocumentConverterJobData): void {
            var convertPromise = documentToConvert.convert(jobData);

            convertPromise.done((docConversion: lt.Document.DocumentConvertResult): void => {
               var documentId = docConversion.documentId;

               // If we have an archive, that's all we will have.
               // If it doesn't exist, handle the document and possible annotations
               if (docConversion.archive && docConversion.archive.url) {
                  this.saveToDlg.show(documentId, [docConversion.archive]);
               }
               else if (docConversion.document && docConversion.document.url) {
                  var items = [docConversion.document];
                  if (docConversion.annotations && docConversion.annotations.url) {
                     items.push(docConversion.annotations);
                  }
                  this.saveToDlg.show(documentId, items);
               }
               else if (documentId) {
                  this.saveToDlg.show(documentId, null);
               }
               else if (docConversion.document) {
                  // Special case - if no URL is set, the document ID is set as the document name.
                  var id = docConversion.document.name;
                  setTimeout(() => {
                     // Inform the user about the cache ID. Use the input dialog so it's easy to copy.
                     var text = "Document conversion successful. ";
                     lt.LTHelper.log(text + id);
                     text += "The converted document is now in the cache with the below identifier.";
                     var cacheDialog = this.cacheDlg;
                     cacheDialog.showSave(text, id);
                     cacheDialog.onReloadCurrentFromSave = () => {
                        this.loadCachedDocument(id, false);
                     };
                  }, 50);
               }
            });

            convertPromise.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
               this.showServiceError("Error converting the document.", jqXHR, statusText, errorThrown);
            });

            convertPromise.always((): void => {
               this.endBusyOperation();
            });
         }

         private runConvertJob(documentToConvert: lt.Document.LEADDocument, jobData: lt.Document.DocumentConverterJobData): void {
            var userToken: string = null;
            var jobToken: string = null;

            var fail = (jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
               if (abort)
                  return;

               if (userToken && jobToken)
                  lt.LTHelper.logError("Document Conversion Job Failure. User: '" + userToken + "', Job: '" + jobToken + "'");
               this.showServiceError("Error converting the document.", jqXHR, statusText, errorThrown);
               this.endBusyOperation();
            }

            var abort = false;

            this.loadingDlg.enableCancellation = true;
            this.loadingDlg.cancelClick = () => {
               this.loadingDlg.cancelClick = null;
               abort = true;

               if (userToken && jobToken) {
                  this.loadingDlg.processing("Canceled...", "Waiting for verification");
                  lt.Document.Converter.StatusJobDataRunner.abortConvertJob(userToken, jobToken)
                     .fail(() => {
                        alert("Failed to cancel the conversion job. Check the console for more information");
                        lt.LTHelper.logError("Failed to cancel: User: " + userToken + "; Job: " + jobData);
                     })
                     .always(() => {
                        setTimeout(() => {
                           this.endBusyOperation();
                        }, 1500);
                     });
               }
               else {
                  setTimeout(() => {
                     this.endBusyOperation();
                  }, 1200);
               }
            };

            var convertJobPromise = lt.Document.Converter.StatusJobDataRunner.runConvertJob(documentToConvert.documentId, jobData)
               .done((convertJobResult: lt.Document.Converter.RunConvertJobResult): void => {
                  if (abort)
                     return;

                  var minWaitFromResponse = DocumentViewerDemoApp._queryStatusMinWaitFromResponse;
                  var minWaitFromRequest = DocumentViewerDemoApp._queryStatusMinWaitFromRequest;
                  userToken = convertJobResult.userToken;
                  jobToken = convertJobResult.jobToken;

                  var requestTime = -1;
                  var responseTime = -1;
                  var runQuery: (responseTime: number) => void = null;

                  var queryDone = (statusJobData: lt.Document.Converter.StatusJobData) => {
                     if (abort)
                        return;

                     if (statusJobData.abort) {
                        this.endBusyOperation();
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

                        this.endBusyOperation();
                        return;
                     }
                     else if (statusJobData.isCompleted) {

                        this.loadingDlg.processing("Converting...", "Finishing");
                        lt.Document.Converter.StatusJobDataRunner.deleteConvertJob(userToken, jobToken)
                           .fail(() => {
                              lt.LTHelper.logError("Failed to delete after completion: User: " + userToken + "; Job: " + jobData);
                           })
                           .always(() => {
                              this.endBusyOperation();
                              this.exportJobDlg.show(this, statusJobData, null);
                              this.exportJobDlg.onLoad = (uri) => {
                                 var loadOptions = this.createLoadOptions(null, DocumentViewerDemo.AnnotationsLoadOption.embedded);
                                 this.loadDocument(uri, null, loadOptions);
                              }
                           });
                        return;
                     }

                     this.loadingDlg.processing("Converting...", statusJobData.jobStatusMessage);

                     // Keep querying
                     runQuery(Date.now());
                  };

                  runQuery = (responseTime: number) => {
                     var now = Date.now();

                     if (requestTime !== -1) {
                        var timeSinceRequest = now - requestTime;
                        var timeSinceResponse = now - responseTime;

                        // If we haven't waited the minimum since the response and haven't waited the maximum since the request, wait
                        if (timeSinceResponse < minWaitFromResponse || timeSinceRequest < minWaitFromRequest) {
                           var waitTime = Math.max(minWaitFromResponse - timeSinceResponse, minWaitFromRequest - timeSinceRequest);
                           setTimeout(() => {
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
                  }

                  runQuery(Date.now());
               })
               .fail(fail)
         }

         // OCR mode
         public recognize(page: lt.Document.DocumentPage, searchArea: lt.LeadRectD): void {
            var promcmd = page.getText(searchArea);
            this.beginBusyOperation();
            this.loadingDlg.show(false, false, "Recognizing...", null, () => {
               promcmd.done((pageText: lt.Document.DocumentPageText): void => {
                  var text = "";
                  if (pageText) {
                     pageText.buildText();
                     var text = pageText.text;
                  }
                  this.textResultDlg.update("Results", text.trim());
                  this.textResultDlg.show();
               });
               promcmd.fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
                  this.showServiceError("Error retrieving text", jqXHR, statusText, errorThrown);
               });
               promcmd.always((): void => {
                  this.endBusyOperation();
               });
            });
         }

         private _allBarcodes: lt.Barcode.BarcodeData[][] = null;
         private _currentBarcodes: lt.Barcode.BarcodeData[][] = [];
         public readBarcodes(page: lt.Document.DocumentPage, searchArea: lt.LeadRectD): void {
            // If we have a page, process just that page (with the bounds, if available)
            // If we have a null page and haven't processed all pages before, process all pages (with no bounds)

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

            var barcodesRead: number = 0;
            var currentPageNumber = 1; // 1-based
            var length = 1;
            var index = 0;
            var pages: lt.Document.DocumentPage[] = [];
            if (page == null) {
               // do all pages

               length = this._documentViewer.document.pages.count;
               // 0-based
               for (var i: number = 0; i < length; i++) {
                  pages.push(this._documentViewer.document.pages.item(i));
               }
            }
            else {
               // 1 page total
               pages = [page];
            }

            // Show our dialog
            this.processingPagesDlg.show("Reading Barcodes", pages.length,
               [
                  "Page",
                  "Symbology",
                  "Value",
                  "Location",
               ], null);

            var pageDone = (barcodes: lt.Barcode.BarcodeData[]): void => {
               if (!this.processingPagesDlg.isCanceled) {

                  this._currentBarcodes[currentPageNumber - 1] = barcodes;
                  if (page == null && searchArea.isEmpty) {
                     this._allBarcodes.push(barcodes);
                  }
                  if (barcodes) {
                     barcodesRead += barcodes.length;
                     barcodes.forEach((barcodeData: lt.Barcode.BarcodeData) => {
                        this.processingPagesDlg.addData(currentPageNumber, [
                           DocumentViewerDemoApp._barcodeSymbologyNames[barcodeData.symbology],
                           barcodeData.value,
                           [barcodeData.bounds.top, barcodeData.bounds.right, barcodeData.bounds.bottom, barcodeData.bounds.left]
                              .map((val: number) => {
                                 // clean up
                                 return parseFloat(val.toFixed(2))
                              })
                              .join(", "),
                        ]);
                     })
                  }

                  // Draw the barcodes
                  this._documentViewer.view.imageViewer.invalidate(lt.LeadRectD.empty);

                  index++;
                  if (index < length) {
                     chooseNext();
                  }
                  else {
                     this.processingPagesDlg.finishProcessing();
                     this.processingPagesDlg.updateStatus("Barcode reading complete - " + barcodesRead + " found.");
                  }
               }
               else {
                  // It was canceled, don't save this work
                  this._allBarcodes = null;
               }
            };

            var pageFail = (jqXHR: JQueryXHR, statusText: string, errorThrown: string): void => {
               this._allBarcodes = null;
               this.processingPagesDlg.finishProcessing();
               this.processingPagesDlg.updateStatus("Barcode reading failed on page " + currentPageNumber + ".");
               this.showServiceError("Error reading barcodes", jqXHR, statusText, errorThrown);
            }

            var chooseNext = () => {
               var newPage = pages[index];
               currentPageNumber = newPage.pageNumber;
               this.processingPagesDlg.updateStatus("Processing page " + currentPageNumber);
               newPage.readBarcodes(searchArea, 0, null)
                  .done(pageDone)
                  .fail(pageFail)
            }
            chooseNext();

            //this.beginBusyOperation();
            //this.endBusyOperation();
         }

         public checkBarcodeData(index: number, searchArea: lt.LeadRectD) {
            if (this._currentBarcodes && this._currentBarcodes[index] && this._currentBarcodes[index].length > 0) {
               var pageBarcodes = this._currentBarcodes[index];
               var searchX = searchArea.x;
               var searchY = searchArea.y;
               var barcodesToShow: lt.Barcode.BarcodeData[] = pageBarcodes.filter((data: lt.Barcode.BarcodeData) => {
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
         }

         private showPreviousBarcodeData(barcodePages: lt.Barcode.BarcodeData[][]): void {
            var count: number = barcodePages.filter((barcodePage: lt.Barcode.BarcodeData[]) => {
               return barcodePage && barcodePage.length > 0;
            }).length;
            this.processingPagesDlg.show("Barcode", count,
               [
                  "Page",
                  "Symbology",
                  "Value",
                  "Location",
               ], null);
            this.processingPagesDlg.updateStatus("Barcodes previously read.");
            this.processingPagesDlg.finishProcessing();
            barcodePages.forEach((barcodeDataPage: lt.Barcode.BarcodeData[], pageIndex: number) => {
               barcodeDataPage.forEach((barcodeData: lt.Barcode.BarcodeData) => {
                  this.processingPagesDlg.addData(pageIndex + 1, [
                     DocumentViewerDemoApp._barcodeSymbologyNames[barcodeData.symbology],
                     barcodeData.value,
                     [barcodeData.bounds.top, barcodeData.bounds.right, barcodeData.bounds.bottom, barcodeData.bounds.left]
                        .map((val: number) => {
                           // clean up
                           return parseFloat(val.toFixed(2))
                        })
                        .join(", "),
                  ]);
               })
            })
         }

         // Friendly Names
         private static _barcodeSymbologyNames: string[] =
            [
               "Unknown", "EAN-13", "EAN-8", "UPC-A", "UPC-E", "Code 3 Of 9", "Code 128", "Code Interleaved 2 Of 5", "CODABAR",
               "UCC/EAN 128", "Code 93", "EAN-EXT-5", "EAN-EXT-2", "MSI", "Code 11", "Code Standard 2 Of 5", "GS1 Databar",
               "GS1 Databar Limited", "GS1 Databar Expanded", "Patch Code", "POSTNET", "Planet", "Australian Post 4State",
               "Royal Mail (RM4SCC)", "USPS OneCode Intelligent Mail", "GS1 Databar Stacked", "GS1 Databar Expanded Stacked",
               "PDF417", "MicroPDF417", "Datamatrix", "QR", "Aztec", "Maxi", "MicroQR", "Pharma Code"
            ];

         private drawBarcodes(item: lt.Controls.ImageViewerItem, context: CanvasRenderingContext2D) {
            var itemIndex = this._documentViewer.view.imageViewer.items.indexOf(item);
            if (this._documentViewer.hasDocument && this._currentBarcodes && this._currentBarcodes[itemIndex] && this._currentBarcodes[itemIndex].length > 0) {
               var imageViewer = this._documentViewer.view.imageViewer;
               var mat: lt.LeadMatrix = this._documentViewer.view.imageViewer.getItemImageTransform(item);
               // Draw the barcodes we found
               context.save();
               context.beginPath();

               var itemBarcodes = this._currentBarcodes[itemIndex];
               itemBarcodes.forEach((barcodeData: lt.Barcode.BarcodeData) => {
                  var bounds = this._documentViewer.document.rectToPixels(barcodeData.bounds);
                  bounds = mat.transformRect(bounds);
                  context.lineWidth = 3;

                  context.strokeStyle = "red";
                  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

                  bounds.inflate(3, 3);
                  context.strokeStyle = "green";
                  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
               })

               context.closePath();
               context.restore();
            }
         }
      }
   }
}

window.onload = () => {

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
   } else {
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