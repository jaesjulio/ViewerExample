/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      export module Converter {
         export module Dialogs {

            interface SaveToDlgUI<T> {
               message: T,
               cache: {
                  container: T,
                  header: T,
                  input: T
               },
               export: {
                  container: T,
                  header: T,
                  localSaveBtn: T,
                  btnGroup: T,
                  saveToOneDriveBtn: T,
                  saveToSharePointBtn: T,
                  saveToGoogleDriveBtn: T,
                  googleSaveContainer: T,
                  fileNameTextInput: T,
                  fileSavingImage: T,
               }
               closeNextBtn: T
            }

            export class SaveToDlg implements lt.Demos.Dialogs.Dialog {

               public inner: lt.Demos.Dialogs.InnerDialog = null;
               private el: SaveToDlgUI<string> = null;

               constructor() {
                  var root = $("#dlgExportSave");
                  this.el = {
                     message: "#dlgExportSave_Message",
                     cache: {
                        container: "#dlgExportSave_Cache",
                        header: "#dlgExportSave_Cache_Header",
                        input: "#dlgExportSave_Cache_Input"
                     },
                     export: {
                        container: "#dlgExportSave_Export",
                        header: "#dlgExportSave_Export_Header",
                        localSaveBtn: "#dlgExportSave_LocalSave",
                        btnGroup: "#dlgExportSave_Group",
                        saveToOneDriveBtn: "#dlgExportSave_SaveToOneDrive",
                        saveToSharePointBtn: "#dlgExportSave_SaveToSharePoint",
                        saveToGoogleDriveBtn: "#dlgExportSave_SaveToGoogleDrive",
                        googleSaveContainer: "#dlgExportSave_GoogleSaveContainer",
                        fileNameTextInput: "#dlgExportSave_FileName",
                        fileSavingImage: "#dlgExportSave_FileSaving",
                     },
                     closeNextBtn: "#dlgExportSave_CloseNext",
                  };

                  this.inner = new lt.Demos.Dialogs.InnerDialog(root);
               }

               public dispose(): void {
                  this.inner.dispose();
                  this.inner = null;
                  this.el = null;
               }

               // Helpers 
               private _oneDriveHelper: DriveHelper.LTOneDrive.OneDriveHelper;
               private _googleDriveHelper: DriveHelper.LTGoogleDrive.GoogleDriveHelper;
               private _sharePointHelper: DriveHelper.LTSharePoint.SharePointHelper;

               public init(sharepointHelper: DriveHelper.LTSharePoint.SharePointHelper): void {
                  this._sharePointHelper = sharepointHelper;

                  // OneDrive
                  this._oneDriveHelper = new DriveHelper.LTOneDrive.OneDriveHelper();
                  this._oneDriveHelper.saveDone = (error: any) => this.saveDone(error);
                  // SharePoint
                  this._sharePointHelper.saveDone = (error: any) => this.saveDone(error);

                  // GoogleDrive
                  // if IE, Google Drive save is not supported.
                  this._googleDriveHelper = new DriveHelper.LTGoogleDrive.GoogleDriveHelper();

                  lt.Demos.Utils.Visibility.toggle($(this.el.export.googleSaveContainer), false);
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.fileSavingImage), false);

                  if (DocumentViewerDemoApp.isMobileVersion) {
                     // Create more space for titles in mobile
                     var group = $(this.el.export.btnGroup);
                     group.addClass("btn-group-vertical");
                     var childrenOfChildren = group.children().children();
                     group.empty().append(childrenOfChildren);
                  }

                  $(this.el.export.localSaveBtn).on("click", this.localSaveBtn_Click);
                  $(this.el.export.saveToSharePointBtn).on("click", this.saveToSharePointBtn_Click);

                  var googleDriveCanSave = this._googleDriveHelper && this._googleDriveHelper.canSave;
                  var oneDriveIsRegistered = this._oneDriveHelper && this._oneDriveHelper.isRegisteredForLoadSave;

                  if (googleDriveCanSave)
                     $(this.el.export.saveToGoogleDriveBtn).on("click", this.saveToGoogleDriveBtn_Click);
                  else
                     $(this.el.export.saveToGoogleDriveBtn).prop("disabled", true);

                  if (oneDriveIsRegistered)
                     $(this.el.export.saveToOneDriveBtn).on("click", this.saveToOneDriveBtn_Click);
                  else
                     $(this.el.export.saveToOneDriveBtn).prop("disabled", true);

                  var vendorsDisabled = "";
                  if (!oneDriveIsRegistered) {
                     vendorsDisabled += "OneDrive must be registered before saving is available. ";
                  }
                  if (!googleDriveCanSave) {
                     // Cannot save in IE
                     vendorsDisabled += "Save to Google Drive is not available for this browser."
                  }

                  if (vendorsDisabled) {
                     $(this.el.message).text(vendorsDisabled);
                  }
                  lt.Demos.Utils.Visibility.toggle($(this.el.message), !!vendorsDisabled);

                  $(this.el.closeNextBtn).on("click", this.closeBtn_Click);
               }

               private _remaining: lt.Document.ConvertItem[];
               private _convertItem: lt.Document.ConvertItem;
               private _fileOriginalName: string;
               public show(cacheId: string, convertItems: lt.Document.ConvertItem[]): void {
                  var hasConvertItems = !!(convertItems && convertItems.length);
                  if (!cacheId && !hasConvertItems)
                     return;

                  // Show the headers only if both are needed
                  var hasBoth = !!cacheId && hasConvertItems;
                  lt.Demos.Utils.Visibility.toggle($(this.el.cache.header), hasBoth);
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.header), hasBoth);

                  lt.Demos.Utils.Visibility.toggle($(this.el.cache.container), !!cacheId);
                  if (cacheId) {
                     $(this.el.cache.input).val(cacheId);
                  }

                  lt.Demos.Utils.Visibility.toggle($(this.el.export.container), hasConvertItems);
                  if (hasConvertItems) {
                     this.showConvertItems(convertItems);
                  }

                  this.inner.show();
               }

               private showConvertItems(convertItems: lt.Document.ConvertItem[]): void {
                  var convertItem = convertItems[0];
                  this._remaining = convertItems.slice(1, convertItems.length);
                  var lengthRemaining = this._remaining.length;
                  if (lengthRemaining)
                     $(this.el.closeNextBtn).text("Next (" + lengthRemaining + ")");
                  else
                     $(this.el.closeNextBtn).text("Close");

                  var name = convertItem.name;
                  $(this.el.export.fileNameTextInput).val(name);

                  // Fix the URL for this convertItem by adding to the relative end
                  convertItem.url = lt.Document.DocumentFactory.serviceUri + "/" + convertItem.url;

                  this._convertItem = convertItem;
                  this._fileOriginalName = name;
               }

               private localSaveBtn_Click = (e: JQueryEventObject) => {
                  var url = this._convertItem.url;
                  var win = null;
                  if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                     win = window.open("");
                     win.navigate(url);
                  }
                  else {
                     win = window.open(url);
                  }

                  if (win == null || typeof (win) == "undefined")
                     alert("A Popup Blocker may have blocked opening a new window.\nIf this is the case, disable the Popup Blocker for this page and try again.");
               }

               private closeBtn_Click = () => {
                  if (!this._remaining || this._remaining.length == 0)
                     this.inner.hide();
                  else
                     this.showConvertItems(this._remaining);
               }

               private saveToOneDriveBtn_Click = (e: JQueryEventObject) => {
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.fileSavingImage), true);
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.googleSaveContainer), false);

                  var fileName: string = $(this.el.export.fileNameTextInput).val() || this._fileOriginalName;
                  fileName = fileName.trim();
                  this._oneDriveHelper.save(this._convertItem.url, fileName);
               }

               private saveToSharePointBtn_Click = (e: JQueryEventObject) => {
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.fileSavingImage), true);
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.googleSaveContainer), false);

                  var fileName: string = $(this.el.export.fileNameTextInput).val() || this._fileOriginalName;
                  fileName = fileName.trim();

                  this._sharePointHelper.save(this._convertItem.url, fileName);
               }

               private saveToGoogleDriveBtn_Click = (e: JQueryEventObject) => {
                  var fileName: string = $(this.el.export.fileNameTextInput).val() || this._fileOriginalName;
                  fileName = fileName.trim();

                  this._googleDriveHelper.showSaveButton(this._convertItem.url, fileName);
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.googleSaveContainer), true);
               }

               // Save done handler 
               private saveDone(error: any): void {
                  lt.Demos.Utils.Visibility.toggle($(this.el.export.fileSavingImage), false);
                  if (error)
                     alert(error);
               }
            }

            interface ExportJobDlgUI<T> {
               help: {
                  conversionHelp: T,
                  attachmentHelp: T,
               },
               uri: {
                  input: T,
                  loadBtn: T
               },
               export: {
                  localSaveLink: T,
               },
               hide: T
            }

            export class ExportJobDlg implements lt.Demos.Dialogs.Dialog {

               public inner: lt.Demos.Dialogs.InnerDialog = null;
               private el: ExportJobDlgUI<string> = null;

               constructor() {
                  var root = $("#dlgExportJob");
                  this.el = {
                     help: {
                        conversionHelp: "#dlgExportJob_ConversionHelp",
                        attachmentHelp: "#dlgExportJob_AttachmentHelp",
                     },
                     uri: {
                        input: "#dlgExportJob_Uri_Input",
                        loadBtn: "#dlgExportJob_Uri_Load",
                     },
                     export: {
                        localSaveLink: "#dlgExportJob_LocalSave",
                     },
                     hide: "#dlgExportJob .dlg-close"
                  };

                  this.inner = new lt.Demos.Dialogs.InnerDialog(root);

                  $(this.el.hide).on("click", this.onHide);
                  $(this.el.uri.loadBtn).on("click", this.loadBtn_Click);
               }

               private onHide = () => {
                  this.inner.hide();
               }

               public dispose(): void {
                  $(this.el.hide).off("click", this.onHide);
                  this.onHide = null;

                  $(this.el.uri.loadBtn).off("click", this.loadBtn_Click);
                  this.onLoad = null;

                  this._statusJobData = null;
                  this._attachment = null;
                  this._documentUri = null;

                  this.inner.dispose();
                  this.inner = null;
                  this.el = null;
               }

               private _statusJobData: lt.Document.Converter.StatusJobData = null;
               private _attachment: lt.Document.DocumentAttachment = null;
               private _documentUri: string = null;
               private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

               public show(mainApp: DocumentViewerDemo.DocumentViewerDemoApp, statusJobData: lt.Document.Converter.StatusJobData, attachment: lt.Document.DocumentAttachment): void {
                  this._statusJobData = statusJobData;
                  this._attachment = attachment;

                  // One of these is not null
                  if (this._statusJobData) {
                     this._documentUri = this._statusJobData.outputDocumentUri;
                     $(this.el.help.conversionHelp).css("display", "block");
                     $(this.el.help.attachmentHelp).css("display", "none");
                  } else if (this._attachment) {
                     this._documentUri = lt.Document.DocumentFactory.makeLeadCacheUri(attachment.documentId);
                     $(this.el.help.attachmentHelp).css("display", "block");
                     $(this.el.help.conversionHelp).css("display", "none");
                  } else {
                     throw new Error("Invalid demo state");
                  }

                  $(this.el.uri.input).val(this._documentUri);

                  if (mainApp.documentViewer.useAjaxImageLoading) {
                     this._mainApp = mainApp;
                     $(this.el.export.localSaveLink).off("click");
                     $(this.el.export.localSaveLink).on("click", this.localSaveWithAjax);
                     $(this.el.export.localSaveLink).attr("href", "javascript:void(0);");
                     // Local save with AJAX on IE is not supported
                     if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                        $(this.el.export.localSaveLink).removeAttr("target");
                     } else {
                        $(this.el.export.localSaveLink).attr("target", "_blank");
                     }
                  } else {
                     var url = lt.Document.Service.Custom.createEndpointGetUrl("Factory", "DownloadDocument", {
                        uri: this._documentUri,
                        includeAnnotations: true,
                        // To force download, use this
                        // contentDisposition: "attachment",
                        userData: lt.Document.DocumentFactory.serviceUserData
                     }, true);
                     $(this.el.export.localSaveLink).off("click");
                     $(this.el.export.localSaveLink).attr("target", "_blank");
                     $(this.el.export.localSaveLink).attr("href", url);
                  }

                  this.inner.show();
               }

               public onLoad: (uri: string) => void = null;

               private loadBtn_Click = (e: JQueryEventObject) => {
                  if (this.onLoad)
                     this.onLoad(this._documentUri);
                  this.inner.hide();
               }

               private localSaveWithAjax = (e: JQueryEventObject) => {
                  if (lt.LTHelper.browser === lt.LTBrowser.internetExplorer) {
                     alert("Local save with AJAX is not supported by this browser");
                     return;
                  }
                  // Do it with AJAX
                  lt.Document.DocumentFactory.downloadDocumentData(null, this._documentUri, true, true)
                     .done((result: lt.Document.Service.DownloadDocumentResponse) => {
                        var newBlob = new Blob([result.data], { type: result.mimeType });

                        // Build the name
                        var extension: string;
                        if (result.mimeType === "application/zip") {
                           extension = "zip";
                        } else {
                           if (this._statusJobData) {
                              extension = DocumentViewerDemo.Converter.Formats.getExtension(this._statusJobData.rasterImageFormat, this._statusJobData.documentFormat);
                           } else {
                              var index = this._attachment.fileName.lastIndexOf(".");
                              if (index != -1) {
                                 extension = this._attachment.fileName.substring(index + 1);
                              } else {
                                 extension = "bin";
                              }
                           }
                        }
                        var name = "file." + extension;

                        // Internet Explorer does not allow using a blob object directly as link href
                        if (window.navigator && window.navigator.msSaveOrOpenBlob && window.navigator.userAgent.indexOf("Edge") == -1) {
                           window.navigator.msSaveOrOpenBlob(newBlob, name);
                           return;
                        }
                        var url = window.URL.createObjectURL(newBlob);
                        var link = <HTMLAnchorElement>document.createElement('a');
                        link.href = url;
                        link.download = name;
                        link.target = "_blank";
                        link.click();
                        setTimeout(function () {
                           // For some browsers (Firefox) it is necessary to delay revoking the ObjectURL
                           window.URL.revokeObjectURL(url);
                        }, 100);
                     })
                     .fail((jqXHR: JQueryXHR, statusText: string, errorThrown: string) => {
                        this._mainApp.showServiceError("Could not save the document locally.", jqXHR, statusText, errorThrown);
                     });
               }
            }
         }
      }
   }
}