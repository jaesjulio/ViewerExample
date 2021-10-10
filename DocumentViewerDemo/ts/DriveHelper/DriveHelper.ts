/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DriveHelper {

      export enum Mode {
         save,
         open
      }

      export class DriveFile {
         public name: string;
         public link: string;
         public fileBlob: Blob;

         constructor(name: string) {
            this.name = name;
         }
      }

      export module LTOneDrive {
         // declare OneDrive object from OneDrive.js
         declare var OneDrive;

         class OneDriveOpenOptions {
            public linkType: string;
            public multiSelect: boolean;
            // Event handlers
            public success: { (files: any): void };
            public cancel: { (): void };

            constructor() {
               this.linkType = "downloadLink";
               this.multiSelect = false;
            }
         }

         class OneDriveSaveOptions {
            public file: string;
            public fileName: string;
            // Event handlers
            public success: { (): void };
            public error: { (error: any): void };
            public cancel: { (): void };
         }

         export class OneDriveHelper {
            // OneDrive open options
            private _openOptions: OneDriveOpenOptions;

            // OneDrive save options
            private _saveOptions: OneDriveSaveOptions;

            // Open event
            private _openDone: { (file: DriveFile): void };
            set openDone(value: { (file: DriveFile): void }) {
               this._openDone = value;
            }

            // Save event
            private _saveDone: { (error: any): void };
            set saveDone(value: { (error: any): void }) {
               this._saveDone = value;
            }

            private _isRegisteredForLoadSave: boolean = false;
            public get isRegisteredForLoadSave(): boolean {
               return this._isRegisteredForLoadSave;
            }

            // alert
            private static _firstTimer: boolean = true;

            constructor() {
               // Confirm that we have an application ID
               var clientId = $("#onedrive-js").attr("client-id");
               if (!clientId || clientId.toLowerCase() === "app_id") {
                  return;
               }

               this._isRegisteredForLoadSave = true;

               // Init OneDrive open options
               this._openOptions = new OneDriveOpenOptions();
               this._openOptions.success = (files: any) => this.openSuccess(files);
               this._openOptions.cancel = () => this.openCancel();

               // Init OneDrive save options
               this._saveOptions = new OneDriveSaveOptions();
               this._saveOptions.success = () => this.saveSuccess();
               this._saveOptions.error = (error: any) => this.saveError(error);
               this._saveOptions.cancel = () => this.saveCancel();
            }

            public open(): void {
               if (OneDriveHelper._firstTimer && lt.LTHelper.browser == lt.LTBrowser.internetExplorer) {
                  OneDriveHelper._firstTimer = false;
                  alert("Tip: OneDrive access from Internet Explorer requires 'Protected Mode' to be enabled for both 'Internet' and 'Local intranet' zones. Continuing to access OneDrive without setting these options may result in an error.");
               }
               OneDrive.open(this._openOptions);
            }

            public save(url: string, name: string): void {
               this._saveOptions.file = url;
               this._saveOptions.fileName = name;
               OneDrive.save(this._saveOptions);
            }

            private openSuccess(files: any): void {
               if (files.values.length > 0) {
                  var file = new DriveFile(files.values[0].fileName);
                  file.link = files.values[0].link;
                  if (this._openDone != null)
                     this._openDone(file);
               }
            }

            private openCancel(): void {
               if (this._openDone != null)
                  this._openDone(null);
            }

            private saveSuccess(): void {
               if (this._saveDone != null)
                  this._saveDone(null);
            }

            private saveError(error: any): void {
               if (this._saveDone != null)
                  this._saveDone(error);
            }

            private saveCancel(): void {
               if (this._saveDone != null)
                  this._saveDone(null);
            }
         }
      }

      export module LTGoogleDrive {
         // declare gapi and google objects from google api.js
         declare var gapi;
         declare var google;

         export class GoogleDriveHelper {
            // Credentials
            private _developerKey: string = null;
            private _clientId: string = null;

            constructor() {
               this._authScopes = new Array<string>("https://www.googleapis.com/auth/drive.readonly");
               if (window["gapi"]) {
                  // Load picker API
                  gapi.load('picker');
                  // Load auth API
                  gapi.load('auth');
                  // Load drive API
                  gapi.client.load('drive', 'v2');
               }
            }

            public registerForLoad(clientId: string, key: string): void {
               this._clientId = clientId || null;
               this._developerKey = key || null;
            }
            public get isRegisteredForLoad(): boolean {
               return !!this._developerKey && !!this._clientId;
            }

            // Access token
            private _accessToken: string = null;

            // Auth scopes
            private _authScopes: Array<string>;

            // Open done event 
            private _openDone: { (file: DriveFile): void };
            set openDone(value: { (file: DriveFile): void }) {
               this._openDone = value;
            }

            public open(): void {
               if (!this.isRegisteredForLoad)
                  return;

               // Google drive picker only for open
               if (this._accessToken) {
                  var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
                  view.setIncludeFolders(true);
                  var picker = new google.picker.PickerBuilder()
                     .addView(view)
                     .setOAuthToken(this._accessToken)
                     .setDeveloperKey(this._developerKey)
                     .setCallback((data: any) => this.pickerCallback(data))
                     .build();

                  picker.setVisible(true);
                  // Picker in front of all elements
                  $(".picker-dialog").css("z-index", "20000");
                  $(".picker-dialog-bg").css("z-index", "20000");

                  // Full Screen on mobile/tablet devices 
                  if (lt.LTHelper.device == lt.LTDevice.mobile || lt.LTHelper.device == lt.LTDevice.tablet) {
                     $(".picker-dialog").css("top", "0px");
                     $(".picker-dialog").css("left", "0px");
                     $(".picker-dialog").css("width", "100%");
                     $(".picker-dialog").css("height", "100%");
                     $(".picker-dialog-content").css("width", "100%");
                     $(".picker-dialog-content").css("height", "100%");
                  }
               } else {
                  // Authentication required
                  this.authorize();
               }
            }

            public get canSave(): boolean {
               // We cannot save to google drive in IE
               var isIE = lt.LTHelper.browser === lt.LTBrowser.internetExplorer;
               return !isIE;
            }

            public showSaveButton(url: string, name: string): void {
               if (this.canSave && gapi)
                  gapi.savetodrive.render("googleSaveButtonContainer", { "src": url, "filename": name, "sitename": "LEADTOOLS Document Viewer Demo" });
            }

            private authorize(): void {
               gapi.auth.authorize(
                  {
                     'client_id': this._clientId,
                     'scope': this._authScopes,
                     'immediate': false
                  },
                  (authResult: any) => this.handleAuthResult(authResult));
            }

            private handleAuthResult(authResult): void {
               if (authResult && !authResult.error) {
                  // Set accessToken and load picker api
                  this._accessToken = authResult.access_token;
                  // Authentication required for open only
                  this.open();
               }
            }

            private pickerCallback(data: any): void {
               if (data.action == google.picker.Action.PICKED) {
                  var fileId = data.docs[0].id;
                  // Get file contents using the obtained file Id 
                  this.getFileContents(fileId);
               } else if (data.action == google.picker.Action.CANCEL) {
                  if (this._openDone != null)
                     this._openDone(null);
               }
            }

            private getFileContents(fileId: string): void {
               // Get file data
               var request = gapi.client.drive.files.get({ 'fileId': fileId });
               request.execute((googleFile: any) => {
                  // Download URL - for normal files
                  var url = googleFile.downloadUrl;
                  // exportLinks may be available if the item is a Google Sheet, Text, etc
                  if (!url && googleFile.exportLinks) {
                     var links = googleFile.exportLinks;
                     //var mimeType = googleFile.mimeType;
                     url = links["application/pdf"];
                  }

                  if (url) {
                     var file = new DriveFile(googleFile.originalFilename || googleFile.title || "File");
                     var accessToken = gapi.auth.getToken().access_token;
                     var xhr = new XMLHttpRequest();
                     xhr.open('GET', url.replace('content.google', 'www.google'));
                     // Get file contents as array buffer
                     xhr.responseType = "arraybuffer";
                     xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                     xhr.onload = () => {
                        if (xhr.status == 200) {
                           var base64 = xhr.response;
                           if (base64) {
                              // Convert to byte array 
                              var byteArray = new Uint8Array(base64);
                              // Create blob object
                              file.fileBlob = new Blob([byteArray]);
                              if (this._openDone != null)
                                 this._openDone(file);
                           }
                        } else {
                           alert("Error loading from Google Drive: " + xhr.status + "\n" + xhr.statusText);
                        }
                     }
                     xhr.send();
                  } else {
                     // No downloadUrl. This happens with strange content types.
                     if (googleFile)
                        alert("The selected item cannot be loaded from Google Drive.");
                     else
                        alert("Invalid selection. Please try again.");
                  }
               });
            }
         }
      }

      export module LTSharePoint {
         export class SharePointHelper {
            private _picker: SharePointPickerDlg;
            // Open event
            private _openDone: { (file: DriveFile): void };
            set openDone(value: { (file: DriveFile): void }) {
               this._openDone = value;
            }

            private _saveDone: { (error: any): void };
            set saveDone(value: { (error: any): void }) {
               this._saveDone = value;
            }

            constructor() {
               // Create Picker
               this._picker = new SharePointPickerDlg();
               this._picker.openSuccess = (file: DriveFile) => this.openSuccess(file);
               this._picker.openCancel = () => this.openCancel();
               this._picker.saveSuccess = () => this.saveSuccess();
               this._picker.saveError = (error: any) => this.saveError(error);
               this._picker.saveCancel = () => this.saveCancel();
            }

            public open(): void {
               this._picker.showOpen();
            }

            public save(url: string, name: string): void {
               this._picker.showSave(name, url);
            }

            private openSuccess(file: DriveFile): void {
               if (this._openDone != null)
                  this._openDone(file);
            }

            private openCancel(): void {
               if (this._openDone != null)
                  this._openDone(null);
            }

            private saveSuccess(): void {
               if (this._saveDone != null)
                  this._saveDone(null);
            }

            private saveError(error: any): void {
               if (this._saveDone != null)
                  this._saveDone(error);
            }

            private saveCancel(): void {
               if (this._saveDone != null)
                  this._saveDone(null);
            }
         }
      }
   }
}