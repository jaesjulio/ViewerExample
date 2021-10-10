/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DriveHelper;
    (function (DriveHelper) {
        var Mode;
        (function (Mode) {
            Mode[Mode["save"] = 0] = "save";
            Mode[Mode["open"] = 1] = "open";
        })(Mode = DriveHelper.Mode || (DriveHelper.Mode = {}));
        var DriveFile = /** @class */ (function () {
            function DriveFile(name) {
                this.name = name;
            }
            return DriveFile;
        }());
        DriveHelper.DriveFile = DriveFile;
        var LTOneDrive;
        (function (LTOneDrive) {
            var OneDriveOpenOptions = /** @class */ (function () {
                function OneDriveOpenOptions() {
                    this.linkType = "downloadLink";
                    this.multiSelect = false;
                }
                return OneDriveOpenOptions;
            }());
            var OneDriveSaveOptions = /** @class */ (function () {
                function OneDriveSaveOptions() {
                }
                return OneDriveSaveOptions;
            }());
            var OneDriveHelper = /** @class */ (function () {
                function OneDriveHelper() {
                    var _this = this;
                    this._isRegisteredForLoadSave = false;
                    // Confirm that we have an application ID
                    var clientId = $("#onedrive-js").attr("client-id");
                    if (!clientId || clientId.toLowerCase() === "app_id") {
                        return;
                    }
                    this._isRegisteredForLoadSave = true;
                    // Init OneDrive open options
                    this._openOptions = new OneDriveOpenOptions();
                    this._openOptions.success = function (files) { return _this.openSuccess(files); };
                    this._openOptions.cancel = function () { return _this.openCancel(); };
                    // Init OneDrive save options
                    this._saveOptions = new OneDriveSaveOptions();
                    this._saveOptions.success = function () { return _this.saveSuccess(); };
                    this._saveOptions.error = function (error) { return _this.saveError(error); };
                    this._saveOptions.cancel = function () { return _this.saveCancel(); };
                }
                Object.defineProperty(OneDriveHelper.prototype, "openDone", {
                    set: function (value) {
                        this._openDone = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(OneDriveHelper.prototype, "saveDone", {
                    set: function (value) {
                        this._saveDone = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(OneDriveHelper.prototype, "isRegisteredForLoadSave", {
                    get: function () {
                        return this._isRegisteredForLoadSave;
                    },
                    enumerable: false,
                    configurable: true
                });
                OneDriveHelper.prototype.open = function () {
                    if (OneDriveHelper._firstTimer && lt.LTHelper.browser == lt.LTBrowser.internetExplorer) {
                        OneDriveHelper._firstTimer = false;
                        alert("Tip: OneDrive access from Internet Explorer requires 'Protected Mode' to be enabled for both 'Internet' and 'Local intranet' zones. Continuing to access OneDrive without setting these options may result in an error.");
                    }
                    OneDrive.open(this._openOptions);
                };
                OneDriveHelper.prototype.save = function (url, name) {
                    this._saveOptions.file = url;
                    this._saveOptions.fileName = name;
                    OneDrive.save(this._saveOptions);
                };
                OneDriveHelper.prototype.openSuccess = function (files) {
                    if (files.values.length > 0) {
                        var file = new DriveFile(files.values[0].fileName);
                        file.link = files.values[0].link;
                        if (this._openDone != null)
                            this._openDone(file);
                    }
                };
                OneDriveHelper.prototype.openCancel = function () {
                    if (this._openDone != null)
                        this._openDone(null);
                };
                OneDriveHelper.prototype.saveSuccess = function () {
                    if (this._saveDone != null)
                        this._saveDone(null);
                };
                OneDriveHelper.prototype.saveError = function (error) {
                    if (this._saveDone != null)
                        this._saveDone(error);
                };
                OneDriveHelper.prototype.saveCancel = function () {
                    if (this._saveDone != null)
                        this._saveDone(null);
                };
                // alert
                OneDriveHelper._firstTimer = true;
                return OneDriveHelper;
            }());
            LTOneDrive.OneDriveHelper = OneDriveHelper;
        })(LTOneDrive = DriveHelper.LTOneDrive || (DriveHelper.LTOneDrive = {}));
        var LTGoogleDrive;
        (function (LTGoogleDrive) {
            var GoogleDriveHelper = /** @class */ (function () {
                function GoogleDriveHelper() {
                    // Credentials
                    this._developerKey = null;
                    this._clientId = null;
                    // Access token
                    this._accessToken = null;
                    this._authScopes = new Array("https://www.googleapis.com/auth/drive.readonly");
                    if (window["gapi"]) {
                        // Load picker API
                        gapi.load('picker');
                        // Load auth API
                        gapi.load('auth');
                        // Load drive API
                        gapi.client.load('drive', 'v2');
                    }
                }
                GoogleDriveHelper.prototype.registerForLoad = function (clientId, key) {
                    this._clientId = clientId || null;
                    this._developerKey = key || null;
                };
                Object.defineProperty(GoogleDriveHelper.prototype, "isRegisteredForLoad", {
                    get: function () {
                        return !!this._developerKey && !!this._clientId;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(GoogleDriveHelper.prototype, "openDone", {
                    set: function (value) {
                        this._openDone = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                GoogleDriveHelper.prototype.open = function () {
                    var _this = this;
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
                            .setCallback(function (data) { return _this.pickerCallback(data); })
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
                    }
                    else {
                        // Authentication required
                        this.authorize();
                    }
                };
                Object.defineProperty(GoogleDriveHelper.prototype, "canSave", {
                    get: function () {
                        // We cannot save to google drive in IE
                        var isIE = lt.LTHelper.browser === lt.LTBrowser.internetExplorer;
                        return !isIE;
                    },
                    enumerable: false,
                    configurable: true
                });
                GoogleDriveHelper.prototype.showSaveButton = function (url, name) {
                    if (this.canSave && gapi)
                        gapi.savetodrive.render("googleSaveButtonContainer", { "src": url, "filename": name, "sitename": "LEADTOOLS Document Viewer Demo" });
                };
                GoogleDriveHelper.prototype.authorize = function () {
                    var _this = this;
                    gapi.auth.authorize({
                        'client_id': this._clientId,
                        'scope': this._authScopes,
                        'immediate': false
                    }, function (authResult) { return _this.handleAuthResult(authResult); });
                };
                GoogleDriveHelper.prototype.handleAuthResult = function (authResult) {
                    if (authResult && !authResult.error) {
                        // Set accessToken and load picker api
                        this._accessToken = authResult.access_token;
                        // Authentication required for open only
                        this.open();
                    }
                };
                GoogleDriveHelper.prototype.pickerCallback = function (data) {
                    if (data.action == google.picker.Action.PICKED) {
                        var fileId = data.docs[0].id;
                        // Get file contents using the obtained file Id 
                        this.getFileContents(fileId);
                    }
                    else if (data.action == google.picker.Action.CANCEL) {
                        if (this._openDone != null)
                            this._openDone(null);
                    }
                };
                GoogleDriveHelper.prototype.getFileContents = function (fileId) {
                    var _this = this;
                    // Get file data
                    var request = gapi.client.drive.files.get({ 'fileId': fileId });
                    request.execute(function (googleFile) {
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
                            xhr.onload = function () {
                                if (xhr.status == 200) {
                                    var base64 = xhr.response;
                                    if (base64) {
                                        // Convert to byte array 
                                        var byteArray = new Uint8Array(base64);
                                        // Create blob object
                                        file.fileBlob = new Blob([byteArray]);
                                        if (_this._openDone != null)
                                            _this._openDone(file);
                                    }
                                }
                                else {
                                    alert("Error loading from Google Drive: " + xhr.status + "\n" + xhr.statusText);
                                }
                            };
                            xhr.send();
                        }
                        else {
                            // No downloadUrl. This happens with strange content types.
                            if (googleFile)
                                alert("The selected item cannot be loaded from Google Drive.");
                            else
                                alert("Invalid selection. Please try again.");
                        }
                    });
                };
                return GoogleDriveHelper;
            }());
            LTGoogleDrive.GoogleDriveHelper = GoogleDriveHelper;
        })(LTGoogleDrive = DriveHelper.LTGoogleDrive || (DriveHelper.LTGoogleDrive = {}));
        var LTSharePoint;
        (function (LTSharePoint) {
            var SharePointHelper = /** @class */ (function () {
                function SharePointHelper() {
                    var _this = this;
                    // Create Picker
                    this._picker = new LTSharePoint.SharePointPickerDlg();
                    this._picker.openSuccess = function (file) { return _this.openSuccess(file); };
                    this._picker.openCancel = function () { return _this.openCancel(); };
                    this._picker.saveSuccess = function () { return _this.saveSuccess(); };
                    this._picker.saveError = function (error) { return _this.saveError(error); };
                    this._picker.saveCancel = function () { return _this.saveCancel(); };
                }
                Object.defineProperty(SharePointHelper.prototype, "openDone", {
                    set: function (value) {
                        this._openDone = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(SharePointHelper.prototype, "saveDone", {
                    set: function (value) {
                        this._saveDone = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                SharePointHelper.prototype.open = function () {
                    this._picker.showOpen();
                };
                SharePointHelper.prototype.save = function (url, name) {
                    this._picker.showSave(name, url);
                };
                SharePointHelper.prototype.openSuccess = function (file) {
                    if (this._openDone != null)
                        this._openDone(file);
                };
                SharePointHelper.prototype.openCancel = function () {
                    if (this._openDone != null)
                        this._openDone(null);
                };
                SharePointHelper.prototype.saveSuccess = function () {
                    if (this._saveDone != null)
                        this._saveDone(null);
                };
                SharePointHelper.prototype.saveError = function (error) {
                    if (this._saveDone != null)
                        this._saveDone(error);
                };
                SharePointHelper.prototype.saveCancel = function () {
                    if (this._saveDone != null)
                        this._saveDone(null);
                };
                return SharePointHelper;
            }());
            LTSharePoint.SharePointHelper = SharePointHelper;
        })(LTSharePoint = DriveHelper.LTSharePoint || (DriveHelper.LTSharePoint = {}));
    })(DriveHelper = HTML5Demos.DriveHelper || (HTML5Demos.DriveHelper = {}));
})(HTML5Demos || (HTML5Demos = {}));
