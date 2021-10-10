/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DriveHelper;
    (function (DriveHelper) {
        var LTSharePoint;
        (function (LTSharePoint) {
            var DirectoryItemValue;
            (function (DirectoryItemValue) {
                DirectoryItemValue[DirectoryItemValue["back"] = -1] = "back";
            })(DirectoryItemValue = LTSharePoint.DirectoryItemValue || (LTSharePoint.DirectoryItemValue = {}));
            var SharePointPickerDlg = /** @class */ (function () {
                function SharePointPickerDlg() {
                    var _this = this;
                    this.inner = null;
                    this.el = null;
                    this.loadingImageInvisibleClass = "sharepoint-picker-loading-invisible";
                    this.onHide = function () {
                        _this.inner.hide();
                        // When picker closed by user, fire cancel event
                        if (_this._pickerMode === DriveHelper.Mode.open && _this.openCancel)
                            _this.openCancel();
                        else if (_this._pickerMode === DriveHelper.Mode.save && _this.saveCancel)
                            _this.saveCancel();
                    };
                    // Current opened directory, from Shared Documents/
                    this._currentDirectory = "";
                    this.useCredentials_Changed = function (e) {
                        var useCredentials = $(_this.el.properties.credentials.useCredentials).is(':checked');
                        $(_this.el.properties.credentials.usernameTextInput).prop("disabled", !useCredentials);
                        $(_this.el.properties.credentials.passwordTextInput).prop("disabled", !useCredentials);
                        $(_this.el.properties.credentials.domainTextInput).prop("disabled", !useCredentials);
                    };
                    this.backToPropertiesBtn_Click = function (e) {
                        // Reset
                        _this.disconnect();
                    };
                    this.goBtn_Click = function (e) {
                        if (!_this._isConnected) {
                            // Connect to server
                            var tempProperties = new LTSharePoint.SharePointServerProperties();
                            // Get the uri input value and check if it valid
                            var uri = $(_this.el.properties.serverTextInput).val();
                            uri = uri.replace(/\\/g, "/");
                            if (!lt.Demos.Utils.Network.isValidURI(uri)) {
                                alert("Please provide a valid URI.");
                                return;
                            }
                            tempProperties.uri = uri;
                            // If user check the use credentials checkbox, get the credentials inputs values
                            tempProperties.useCredentials = $(_this.el.properties.credentials.useCredentials).is(":checked");
                            if (tempProperties.useCredentials) {
                                tempProperties.userName = $(_this.el.properties.credentials.usernameTextInput).val();
                                if (!tempProperties.userName) {
                                    alert("Please enter a valid user name.");
                                    return;
                                }
                                tempProperties.password = $(_this.el.properties.credentials.passwordTextInput).val();
                                tempProperties.domain = $(_this.el.properties.credentials.domainTextInput).val();
                            }
                            _this._serverProperties = tempProperties;
                            // Connect to the server, and get shared documents list items 
                            _this.getServerDocuments(null);
                        }
                        else {
                            // Button will act as open or upload button
                            var currentSelectedItem = _this._currentDirectoryItems[_this._currentDirectorySelectedItemIndex];
                            if (!currentSelectedItem && _this._pickerMode === DriveHelper.Mode.save) {
                                // Save to the current directory
                                _this.uploadFile(_this._currentDirectory);
                                return;
                            }
                            var selectedPath = _this.getPath(currentSelectedItem);
                            if (currentSelectedItem.type === LTSharePoint.ItemType.Folder) {
                                // Item is a folder
                                if (_this._pickerMode === DriveHelper.Mode.open) {
                                    // Open mode, Navigate to the folder
                                    _this.getServerDocuments(selectedPath);
                                }
                                else if (_this._pickerMode === DriveHelper.Mode.save) {
                                    // Save mode, Upload file
                                    _this.uploadFile(selectedPath);
                                }
                            }
                            else if (currentSelectedItem.type === LTSharePoint.ItemType.File) {
                                // Item is a file
                                if (_this._pickerMode === DriveHelper.Mode.open)
                                    // Open mode, Download file
                                    _this.downloadFile();
                            }
                        }
                    };
                    this.directoryItemTableRows_Click = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var rows = $(_this.el.directory.tableRows);
                        // Unmark all table rows
                        lt.Demos.Utils.UI.toggleChecked(rows, false);
                        // Mark the selected one
                        lt.Demos.Utils.UI.toggleChecked($(e.currentTarget), true);
                        var itemIndex = parseInt($(e.currentTarget).data("value"), 10);
                        if (itemIndex === DirectoryItemValue.back) {
                            // Go back
                            _this.navigateBackDirectory();
                        }
                        else {
                            _this._currentDirectorySelectedItemIndex = itemIndex;
                            var selectedItem = _this._currentDirectoryItems[itemIndex];
                            // On touch, navigate to the folder
                            if (lt.LTHelper.supportsTouch && selectedItem.type === LTSharePoint.ItemType.Folder) {
                                _this.getServerDocuments(_this.getPath(selectedItem));
                            }
                        }
                    };
                    this.directoryItemTableRows_dblClick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var itemIndex = parseInt($(e.currentTarget).data("value"), 10);
                        if (itemIndex === DirectoryItemValue.back) {
                            // If back, do nothing
                            return;
                        }
                        var selectedItem = _this._currentDirectoryItems[itemIndex];
                        if (selectedItem.type === LTSharePoint.ItemType.Folder)
                            _this.getServerDocuments(_this.getPath(selectedItem));
                        else if (selectedItem.type === LTSharePoint.ItemType.File)
                            _this.downloadFile();
                    };
                    this._serverProperties = new LTSharePoint.SharePointServerProperties();
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
                SharePointPickerDlg.prototype.dispose = function () {
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
                };
                SharePointPickerDlg.prototype.showOpen = function () {
                    this.open(DriveHelper.Mode.open);
                };
                SharePointPickerDlg.prototype.showSave = function (fileName, fileUri) {
                    this._saveFileName = fileName;
                    this._saveFileUri = fileUri;
                    this.open(DriveHelper.Mode.save);
                };
                SharePointPickerDlg.prototype.open = function (mode) {
                    // If picker mode changed, connect again
                    if (this._pickerMode !== mode)
                        this.disconnect();
                    this._pickerMode = mode;
                    if (this._isConnected) {
                        // If connected and run over same mode, show shared documents directory
                        this.getServerDocuments(null);
                    }
                    this.inner.show();
                };
                SharePointPickerDlg.prototype.hide = function () {
                    this.inner.hide();
                };
                SharePointPickerDlg.prototype.disconnect = function () {
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
                };
                SharePointPickerDlg.prototype.navigateBackDirectory = function () {
                    var lastSlash = (this._currentDirectory || "").lastIndexOf("/");
                    if (lastSlash > 0) {
                        var newDirectory = this._currentDirectory.substring(0, lastSlash);
                        this.getServerDocuments(newDirectory);
                    }
                    else {
                        this.getServerDocuments(null);
                    }
                };
                SharePointPickerDlg.prototype.getPath = function (item) {
                    if (item)
                        return this._currentDirectory ? this._currentDirectory + "/" + item.name : item.name;
                    return null;
                };
                SharePointPickerDlg.prototype.getServerDocuments = function (folderUri) {
                    // Use folderUri to navigate to a sub folder in the shared documents list.
                    // If null, go to the root.
                    var _this = this;
                    $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, false);
                    LTSharePoint.SharePointService.getDocumentsListItems(this._serverProperties, folderUri)
                        .done(function (items) {
                        _this._currentDirectory = folderUri || "";
                        _this._isConnected = true;
                        items = items || [];
                        if (items.length && _this._pickerMode === DriveHelper.Mode.save) {
                            // Show only folders when saving
                            items = items.filter(function (item) {
                                return item.type === LTSharePoint.ItemType.Folder;
                            });
                        }
                        _this._currentDirectoryItems = items;
                        _this._currentDirectorySelectedItemIndex = -1;
                        // Sort the array by type, so the folders are at the top
                        if (_this._currentDirectoryItems && _this._currentDirectoryItems.length) {
                            _this._currentDirectoryItems.sort(function (a, b) { return (b.type - a.type); });
                        }
                        _this.showDirectory();
                    })
                        .fail(function (xhr, statusText, errorThrown) {
                        lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                    })
                        .always(function () {
                        $(_this.el.loading).toggleClass(_this.loadingImageInvisibleClass, true);
                    });
                };
                SharePointPickerDlg.prototype.showDirectory = function () {
                    // Set picker title
                    $(this.el.title).text(this._serverProperties.uri);
                    var currentPath = $(this.el.directory.currentPath);
                    lt.Demos.Utils.Visibility.toggle(currentPath, true);
                    var limit = HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion ? 30 : 45;
                    var currentDirectoryShow = "/Shared Documents/";
                    if (this._currentDirectory)
                        currentDirectoryShow += this._currentDirectory + "/";
                    if (currentDirectoryShow.length > limit)
                        currentDirectoryShow = "..." + currentDirectoryShow.substr(currentDirectoryShow.length - (limit - 3));
                    currentPath.text(currentDirectoryShow);
                    // Set Go button text
                    $(this.el.goBtn).text(this._pickerMode === DriveHelper.Mode.open ? "Open" : "Upload");
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
                        var backRow = $(document.createElement("tr"));
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
                            var row = $(document.createElement("tr"));
                            row.append($(document.createElement("td")).attr("data-value", key).addClass("directory-item").addClass(item.type == LTSharePoint.ItemType.Folder ? "folder" : "file").text(item.name));
                            tableBody.append(row);
                        }
                    }
                    else {
                        $(this.el.goBtn).prop("disabled", this._pickerMode === DriveHelper.Mode.open);
                        var row = $(document.createElement("tr"));
                        row.append($(document.createElement("td")).addClass("inline-center").text("This folder is empty."));
                        tableBody.append(row);
                    }
                    // Bind click and doubleclick events
                    $(this.el.directory.tableRows).on("click", this.directoryItemTableRows_Click);
                    $(this.el.directory.tableRows).on("dblclick", this.directoryItemTableRows_dblClick);
                };
                SharePointPickerDlg.prototype.downloadFile = function () {
                    var _this = this;
                    var selectedItem = this._currentDirectoryItems[this._currentDirectorySelectedItemIndex];
                    var path = this.getPath(selectedItem);
                    $(this.el.loading).toggleClass(this.loadingImageInvisibleClass, false);
                    LTSharePoint.SharePointService.downloadFile(this._serverProperties, path)
                        .done(function (base64) {
                        var data = lt.LTHelper.base64DecodeToByteArray(base64);
                        var byteArray = new Uint8Array(data);
                        // Create drive file
                        var file = new DriveHelper.DriveFile(selectedItem.name);
                        file.fileBlob = new Blob([byteArray]);
                        // Fire success event
                        _this.hide();
                        if (_this.openSuccess)
                            _this.openSuccess(file);
                    })
                        .fail(function (xhr, statusText, errorThrown) {
                        lt.Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                    })
                        .always(function () {
                        $(_this.el.loading).toggleClass(_this.loadingImageInvisibleClass, true);
                    });
                };
                SharePointPickerDlg.prototype.uploadFile = function (folderUri) {
                    var _this = this;
                    this.hide();
                    LTSharePoint.SharePointService.uploadFile(this._serverProperties, this._saveFileUri, this._saveFileName, folderUri)
                        .done(function () {
                        if (_this.saveSuccess)
                            _this.saveSuccess();
                    })
                        .fail(function (xhr, statusText, errorThrown) {
                        if (_this.saveError)
                            _this.saveError(errorThrown);
                    });
                };
                return SharePointPickerDlg;
            }());
            LTSharePoint.SharePointPickerDlg = SharePointPickerDlg;
        })(LTSharePoint = DriveHelper.LTSharePoint || (DriveHelper.LTSharePoint = {}));
    })(DriveHelper = HTML5Demos.DriveHelper || (HTML5Demos.DriveHelper = {}));
})(HTML5Demos || (HTML5Demos = {}));
