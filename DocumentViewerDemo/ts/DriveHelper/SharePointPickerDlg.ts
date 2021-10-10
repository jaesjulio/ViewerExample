/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DriveHelper {

      export module LTSharePoint {
         export enum DirectoryItemValue {
            back = -1,
         }

         interface SharePointPickerDlgUI<T> {
            title: T,
            properties: {
               container: T,
               serverTextInput: T,
               credentials: {
                  useCredentials: T,
                  usernameTextInput: T,
                  passwordTextInput: T,
                  domainTextInput: T
               }
            },
            directory: {
               currentPath: T,
               container: T,
               tableBody: T,
               tableRows: T
            },
            backToProperties: T,
            loading: T,
            goBtn: T,
            hide: T
         }

         export class SharePointPickerDlg implements lt.Demos.Dialogs.Dialog {

            public inner: lt.Demos.Dialogs.InnerDialog = null;
            private el: SharePointPickerDlgUI<string> = null;

            private loadingImageInvisibleClass = "sharepoint-picker-loading-invisible";

            constructor() {
               this._serverProperties = new SharePointServerProperties();

               var root = $("#dlgSharePointPicker");

               this.el = {
                  title: "#dlgSharePointPicker_Title",
                  properties: {
                     container: "#dlgSharePointPicker_Properties",
                     serverTextInput: "#dlgSharePointPicker_Properties_Server",
                     credentials: {
                        useCredentials: "#dlgSharePointPicker_Credentials_Use",
                        usernameTextInput: "#dlgSharePointPicker_Credentials_Username",
                        passwordTextInput: "#dlgSharePointPicker_Credentials_Password",
                        domainTextInput: "#dlgSharePointPicker_Credentials_Domain"
                     }
                  },
                  directory: {
                     container: "#dlgSharePointPicker_Directory",
                     currentPath: "#dlgSharePointPicker_Directory_CurrentPath",
                     tableBody: "#dlgSharePointPicker_Directory_Body",
                     tableRows: "#dlgSharePointPicker_Directory .directory-item"
                  },
                  backToProperties: "#dlgSharePointPicker_SetProperties",
                  loading: "#dlgSharePointPicker_Loading",
                  goBtn: "#dlgSharePointPicker_Go",
                  hide: "#dlgSharePointPicker .dlg-close"
               };

               this.inner = new lt.Demos.Dialogs.InnerDialog(root);

               $(this.el.hide).on("click", this.onHide);

               $(this.el.properties.credentials.useCredentials).on("change", this.useCredentials_Changed);
               $(this.el.backToProperties).on("click", this.backToPropertiesBtn_Click);
               $(this.el.goBtn).on("click", this.goBtn_Click);
            }

            private onHide = () => {
               this.inner.hide();

               // When picker closed by user, fire cancel event
               if (this._pickerMode === Mode.open && this.openCancel)
                  this.openCancel();
               else if (this._pickerMode === Mode.save && this.saveCancel)
                  this.saveCancel();
            }

            public dispose(): void {

               $(this.el.hide).off("click", this.onHide);
               this.onHide = null;

               $(this.el.properties.credentials.useCredentials).off("change", this.useCredentials_Changed);
               this.useCredentials_Changed = null;
               $(this.el.backToProperties).off("click", this.backToPropertiesBtn_Click);
               this.backToPropertiesBtn_Click = null;

               $(this.el.goBtn).off("click", this.goBtn_Click);
               this.goBtn_Click = null;

               this.inner.onRootClick = null;
               this.inner.dispose();
               this.inner = null;
               this.el = null;
            }

            // Properties of currently connected server 
            private _serverProperties: SharePointServerProperties;

            // Current opened directory, from Shared Documents/
            private _currentDirectory: string = "";
            // Current retrieved items 
            private _currentDirectoryItems: SharePointItem[];
            // Current selected item
            private _currentDirectorySelectedItemIndex: number;

            // Events 
            public openSuccess: (file: DriveHelper.DriveFile) => void;
            public openCancel: () => void;
            public saveSuccess: () => void;
            public saveError: (error: any) => void;
            public saveCancel: () => void;

            private _isConnected: boolean;
            private _pickerMode: Mode;

            public showOpen(): void {
               this.open(Mode.open);
            }

            private _saveFileName: string;
            private _saveFileUri: string;
            public showSave(fileName: string, fileUri: string): void {
               this._saveFileName = fileName;
               this._saveFileUri = fileUri;

               this.open(Mode.save);
            }

            private open(mode: Mode): void {
               // If picker mode changed, connect again
               if (this._pickerMode !== mode)
                  this.disconnect();
               this._pickerMode = mode;

               if (this._isConnected) {
                  // If connected and run over same mode, show shared documents directory
                  this.getServerDocuments(null);
               }

               this.inner.show();
            }

            private hide(): void {
               this.inner.hide();
            }

            private disconnect(): void {
               this._isConnected = false;

               // Hide directory controls
               lt.Demos.Utils.Visibility.toggle($(this.el.directory.container), false);
               lt.Demos.Utils.Visibility.toggle($(this.el.directory.currentPath), false);
               lt.Demos.Utils.Visibility.toggle($(this.el.backToProperties), false);

               $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, true);

               // Reset connection controls
               var cred = this.el.properties.credentials;

               $(cred.useCredentials).prop("checked", false);

               var allInputs = $(cred.usernameTextInput).add(cred.passwordTextInput).add(cred.domainTextInput);
               allInputs.val("").prop("disabled", true);

               $(this.el.title).text("SharePoint Server Properties");
               $(this.el.goBtn).text("Connect");

               // Show connection controls
               lt.Demos.Utils.Visibility.toggle($(this.el.properties.container), true);
            }

            private useCredentials_Changed = (e: JQueryEventObject) => {
               var useCredentials = $(this.el.properties.credentials.useCredentials).is(':checked');
               $(this.el.properties.credentials.usernameTextInput).prop("disabled", !useCredentials);
               $(this.el.properties.credentials.passwordTextInput).prop("disabled", !useCredentials);
               $(this.el.properties.credentials.domainTextInput).prop("disabled", !useCredentials);
            }

            private backToPropertiesBtn_Click = (e: JQueryEventObject) => {
               // Reset
               this.disconnect();
            }

            private goBtn_Click = (e: JQueryEventObject) => {
               if (!this._isConnected) {
                  // Connect to server
                  var tempProperties = new SharePointServerProperties();
                  // Get the uri input value and check if it valid
                  var uri = $(this.el.properties.serverTextInput).val() as string;
                  uri = uri.replace(/\\/g, "/");
                  if (!lt.Demos.Utils.Network.isValidURI(uri)) {
                     alert("Please provide a valid URI.");
                     return;
                  }
                  tempProperties.uri = uri;

                  // If user check the use credentials checkbox, get the credentials inputs values
                  tempProperties.useCredentials = $(this.el.properties.credentials.useCredentials).is(":checked");
                  if (tempProperties.useCredentials) {
                     tempProperties.userName = $(this.el.properties.credentials.usernameTextInput).val();
                     if (!tempProperties.userName) {
                        alert("Please enter a valid user name.");
                        return;
                     }

                     tempProperties.password = $(this.el.properties.credentials.passwordTextInput).val();
                     tempProperties.domain = $(this.el.properties.credentials.domainTextInput).val();
                  }

                  this._serverProperties = tempProperties;
                  // Connect to the server, and get shared documents list items 
                  this.getServerDocuments(null);
               }
               else {
                  // Button will act as open or upload button
                  var currentSelectedItem = this._currentDirectoryItems[this._currentDirectorySelectedItemIndex];
                  if (!currentSelectedItem && this._pickerMode === Mode.save) {
                     // Save to the current directory
                     this.uploadFile(this._currentDirectory);
                     return;
                  }

                  var selectedPath = this.getPath(currentSelectedItem);

                  if (currentSelectedItem.type === ItemType.Folder) {
                     // Item is a folder
                     if (this._pickerMode === Mode.open) {
                        // Open mode, Navigate to the folder
                        this.getServerDocuments(selectedPath);
                     }
                     else if (this._pickerMode === Mode.save) {
                        // Save mode, Upload file
                        this.uploadFile(selectedPath);
                     }
                  }
                  else if (currentSelectedItem.type === ItemType.File) {
                     // Item is a file
                     if (this._pickerMode === Mode.open)
                        // Open mode, Download file
                        this.downloadFile();
                  }
               }
            }

            private navigateBackDirectory(): void {
               var lastSlash = (this._currentDirectory || "").lastIndexOf("/");
               if (lastSlash > 0) {
                  var newDirectory = this._currentDirectory.substring(0, lastSlash);
                  this.getServerDocuments(newDirectory);
               }
               else {
                  this.getServerDocuments(null);
               }
            }

            private getPath(item: SharePointItem): string {
               if (item)
                  return this._currentDirectory ? this._currentDirectory + "/" + item.name : item.name;
               return null;
            }

            private getServerDocuments(folderUri: string): void {
               // Use folderUri to navigate to a sub folder in the shared documents list.
               // If null, go to the root.

               $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, false);

               SharePointService.getDocumentsListItems(this._serverProperties, folderUri)
                  .done((items: SharePointItem[]) => {
                     this._currentDirectory = folderUri || "";
                     this._isConnected = true;

                     items = items || [];
                     if (items.length && this._pickerMode === Mode.save) {
                        // Show only folders when saving
                        items = items.filter(function (item) {
                           return item.type === ItemType.Folder;
                        });
                     }

                     this._currentDirectoryItems = items;
                     this._currentDirectorySelectedItemIndex = -1;

                     // Sort the array by type, so the folders are at the top
                     if (this._currentDirectoryItems && this._currentDirectoryItems.length) {
                        this._currentDirectoryItems.sort(function (a: SharePointItem, b: SharePointItem) { return (b.type - a.type) });
                     }

                     this.showDirectory();
                  })
                  .fail((xhr: JQueryXHR, statusText: string, errorThrown: string) => {
                     lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                  })
                  .always(() => {
                     $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, true);
                  });
            }

            private showDirectory(): void {
               // Set picker title
               $(this.el.title).text(this._serverProperties.uri);

               var currentPath = $(this.el.directory.currentPath);
               lt.Demos.Utils.Visibility.toggle(currentPath, true);
               var limit = DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion ? 30 : 45;
               var currentDirectoryShow = "/Shared Documents/";
               if (this._currentDirectory)
                  currentDirectoryShow += this._currentDirectory + "/";
               if (currentDirectoryShow.length > limit)
                  currentDirectoryShow = "..." + currentDirectoryShow.substr(currentDirectoryShow.length - (limit - 3));
               currentPath.text(currentDirectoryShow);

               // Set Go button text
               $(this.el.goBtn).text(this._pickerMode === Mode.open ? "Open" : "Upload");
               // Hide connect controls
               lt.Demos.Utils.Visibility.toggle($(this.el.properties.container), false);
               // Show directory controls
               lt.Demos.Utils.Visibility.toggle($(this.el.backToProperties), true);
               // Show directory controls
               lt.Demos.Utils.Visibility.toggle($(this.el.directory.container), true);
               // Show directory controls
               lt.Demos.Utils.Visibility.toggle($(this.el.backToProperties), true);

               var tableBody = $(this.el.directory.tableBody).empty();

               // If we don't have a current directory, we're at the root.
               // Add a back button so we can navigate back to previous directory
               if (this._currentDirectory) {
                  var backRow = $(document.createElement("tr"))
                  backRow.append($(document.createElement("td")).attr("data-value", DirectoryItemValue.back).addClass("directory-item undoIcon").text("Back"));
                  tableBody.append(backRow);
               }

               var items = this._currentDirectoryItems;
               if (items.length) {
                  $(this.el.goBtn).prop("disabled", false);

                  var keys = Object.keys(items);
                  for (var i = 0; i < keys.length; i++) {
                     var key = parseInt(keys[i], 10);
                     var item = items[key];

                     var row = $(document.createElement("tr"))
                     row.append($(document.createElement("td")).attr("data-value", key).addClass("directory-item").addClass(item.type == ItemType.Folder ? "folder" : "file").text(item.name));
                     tableBody.append(row);
                  }
               } else {
                  $(this.el.goBtn).prop("disabled", this._pickerMode === Mode.open);
                  var row = $(document.createElement("tr"))
                  row.append($(document.createElement("td")).addClass("inline-center").text("This folder is empty."));
                  tableBody.append(row);
               }

               // Bind click and doubleclick events
               $(this.el.directory.tableRows).on("click", this.directoryItemTableRows_Click);
               $(this.el.directory.tableRows).on("dblclick", this.directoryItemTableRows_dblClick);
            }

            private directoryItemTableRows_Click = (e: JQueryEventObject) => {
               e.preventDefault();
               e.stopPropagation();
               var rows = $(this.el.directory.tableRows);
               // Unmark all table rows
               lt.Demos.Utils.UI.toggleChecked(rows, false);
               // Mark the selected one
               lt.Demos.Utils.UI.toggleChecked($(e.currentTarget), true);

               var itemIndex = parseInt($(e.currentTarget).data("value"), 10);
               if (itemIndex === DirectoryItemValue.back) {
                  // Go back
                  this.navigateBackDirectory();
               }
               else {
                  this._currentDirectorySelectedItemIndex = itemIndex;
                  var selectedItem = this._currentDirectoryItems[itemIndex];

                  // On touch, navigate to the folder
                  if (lt.LTHelper.supportsTouch && selectedItem.type === ItemType.Folder) {
                     this.getServerDocuments(this.getPath(selectedItem));
                  }
               }
            }

            private directoryItemTableRows_dblClick = (e: JQueryEventObject) => {
               e.preventDefault();
               e.stopPropagation();
               var itemIndex = parseInt($(e.currentTarget).data("value"), 10);
               if (itemIndex === DirectoryItemValue.back) {
                  // If back, do nothing
                  return;
               }

               var selectedItem = this._currentDirectoryItems[itemIndex];

               if (selectedItem.type === ItemType.Folder)
                  this.getServerDocuments(this.getPath(selectedItem));
               else if (selectedItem.type === ItemType.File)
                  this.downloadFile();
            }

            private downloadFile(): void {
               var selectedItem = this._currentDirectoryItems[this._currentDirectorySelectedItemIndex];
               var path = this.getPath(selectedItem);

               $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, false);

               SharePointService.downloadFile(this._serverProperties, path)
                  .done((base64: string) => {
                     var data: number[] = lt.LTHelper.base64DecodeToByteArray(base64);
                     var byteArray = new Uint8Array(data);
                     // Create drive file
                     var file = new DriveFile(selectedItem.name);
                     file.fileBlob = new Blob([byteArray]);
                     // Fire success event
                     this.hide();
                     if (this.openSuccess)
                        this.openSuccess(file);
                  })
                  .fail((xhr: JQueryXHR, statusText: string, errorThrown: string) => {
                     lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                  })
                  .always(() => {
                     $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, true);
                  });
            }

            private uploadFile(folderUri: string): void {
               this.hide();
               SharePointService.uploadFile(this._serverProperties, this._saveFileUri, this._saveFileName, folderUri)
                  .done(() => {
                     if (this.saveSuccess)
                        this.saveSuccess();
                  })
                  .fail((xhr: JQueryXHR, statusText: string, errorThrown: string) => {
                     if (this.saveError)
                        this.saveError(errorThrown);
                  })
            }
         }
      }
   }
}