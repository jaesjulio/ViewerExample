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
            var SharePointServerProperties = /** @class */ (function () {
                function SharePointServerProperties() {
                }
                return SharePointServerProperties;
            }());
            LTSharePoint.SharePointServerProperties = SharePointServerProperties;
            var SharePointItem = /** @class */ (function () {
                function SharePointItem() {
                }
                return SharePointItem;
            }());
            LTSharePoint.SharePointItem = SharePointItem;
            var ItemType;
            (function (ItemType) {
                ItemType[ItemType["File"] = 0] = "File";
                ItemType[ItemType["Folder"] = 1] = "Folder";
            })(ItemType = LTSharePoint.ItemType || (LTSharePoint.ItemType = {}));
            var SharePointService = /** @class */ (function () {
                function SharePointService() {
                }
                SharePointService.getDocumentsListItems = function (serverProperties, folderUri) {
                    // Create Endpoint URL using serviceUri
                    var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "GetDocumentsListItems");
                    // Create POST settings using URL and params
                    var settings = lt.Document.Service.Custom.createPostAjaxSettings(endpointUrl, {
                        serverProperties: serverProperties,
                        folderUri: folderUri,
                        userData: lt.Document.DocumentFactory.serviceUserData
                    });
                    // Create deferred (promise)
                    var d = $.Deferred();
                    // Call PrepareAjax and execute request
                    lt.Document.Service.Custom.requestAjax(this, SharePointService._className, "GetDocumentsListItems", settings)
                        .done(function (response) {
                        // Access userData here if needed
                        d.resolve(response.items);
                    })
                        .fail(d.reject);
                    return d.promise();
                };
                SharePointService.downloadFile = function (serverProperties, fileUri) {
                    // Create Endpoint URL using serviceUri
                    var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "DownloadFile");
                    // Create POST settings using URL and params
                    var settings = lt.Document.Service.Custom.createPostAjaxSettings(endpointUrl, {
                        serverProperties: serverProperties,
                        fileUri: fileUri,
                        userData: lt.Document.DocumentFactory.serviceUserData
                    });
                    // Create deferred (promise)
                    var d = $.Deferred();
                    // Call PrepareAjax and execute request
                    lt.Document.Service.Custom.requestAjax(this, SharePointService._className, "DownloadFile", settings)
                        .done(function (response) {
                        // Access userData here if needed
                        d.resolve(response.data);
                    })
                        .fail(d.reject);
                    return d.promise();
                };
                SharePointService.uploadFile = function (serverProperties, fileUri, name, folderUri) {
                    // Create Endpoint URL using serviceUri
                    var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "UploadFile");
                    // Create POST settings using URL and params
                    var settings = lt.Document.Service.Custom.createPostAjaxSettings(endpointUrl, {
                        serverProperties: serverProperties,
                        fileUri: fileUri,
                        name: name,
                        folderUri: folderUri,
                        userData: lt.Document.DocumentFactory.serviceUserData
                    });
                    // Create deferred (promise)
                    var d = $.Deferred();
                    // Call PrepareAjax and execute request
                    lt.Document.Service.Custom.requestAjax(this, SharePointService._className, "UploadFile", settings).done(d.resolve).fail(d.reject);
                    return d.promise();
                };
                SharePointService._className = "SharePointService";
                SharePointService._controllerName = "SharePoint";
                return SharePointService;
            }());
            LTSharePoint.SharePointService = SharePointService;
        })(LTSharePoint = DriveHelper.LTSharePoint || (DriveHelper.LTSharePoint = {}));
    })(DriveHelper = HTML5Demos.DriveHelper || (HTML5Demos.DriveHelper = {}));
})(HTML5Demos || (HTML5Demos = {}));
