/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var DocumentPropertiesDlg = /** @class */ (function () {
            function DocumentPropertiesDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                var root = $("#dlgDocumentProperties");
                this.el = {
                    propertiesTable: "#dlgDocumentProperties_Properties",
                    metadataTable: "#dlgDocumentProperties_Metadata",
                    hide: "#dlgDocumentProperties .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
            }
            DocumentPropertiesDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            DocumentPropertiesDlg.prototype.show = function (document) {
                this.createPropertiesTable(document);
                this.createMetadataTable(document.metadata);
                this.inner.show();
            };
            DocumentPropertiesDlg.prototype.createPropertiesTable = function (doc) {
                var documentInfo = [];
                documentInfo["Document ID"] = doc.documentId;
                documentInfo["Name"] = doc.name;
                documentInfo["URL"] = DocumentPropertiesDlg.getUriString(doc.uri);
                documentInfo["MIME Type"] = doc.mimeType;
                documentInfo["Encrypted"] = doc.isDecrypted ? "Yes" : "No";
                if (doc.annotations.annotationsUri != null) {
                    documentInfo["Annotations URL"] = DocumentPropertiesDlg.getUriString(doc.annotations.annotationsUri);
                }
                documentInfo["Pages"] = doc.pages.count.toString();
                documentInfo["Is cached on service"] = HTML5Demos.DocumentViewerDemo.DocumentViewerDemoApp.isDocumentInCache(doc) ? "Yes" : "No";
                documentInfo["Cache Status"] = doc.isAnyCacheStatusNotSynced ? "Not Synced" : "Synced";
                documentInfo["Last Synced"] = doc.lastCacheSyncTime ? doc.lastCacheSyncTime.toString() : "N/A";
                if (doc.pages.count > 0) {
                    var page = doc.pages.item(0);
                    var pageSize = page.size;
                    var sizeInches = lt.LeadSizeD.create(pageSize.width / lt.Document.LEADDocument.unitsPerInch, pageSize.height / lt.Document.LEADDocument.unitsPerInch);
                    var sizeMm = lt.LeadSizeD.create(sizeInches.width * 25.4, sizeInches.height * 25.4);
                    var sizePixels = doc.sizeToPixels(pageSize);
                    documentInfo["Page Size"] = sizeInches.width.toFixed(3) + " x " + sizeInches.height.toFixed(3) + " in, " + sizeMm.width.toFixed(3) + " x " + sizeMm.height.toFixed(3) + " mm, " + sizePixels.width.toString() + " x " + sizePixels.height.toString() + " px";
                }
                documentInfo["Load Mode"] = doc.dataType == lt.Document.DocumentDataType.transient ? "Local" : "Service";
                var propertiesTable = $(this.el.propertiesTable);
                propertiesTable.empty();
                for (var key in documentInfo) {
                    if (documentInfo.hasOwnProperty(key)) {
                        var row = this.createRow(key, documentInfo[key]);
                        propertiesTable.append(row);
                    }
                }
            };
            DocumentPropertiesDlg.prototype.createMetadataTable = function (metadata) {
                var metadataTable = $(this.el.metadataTable);
                metadataTable.empty();
                for (var key in metadata) {
                    if (metadata.hasOwnProperty(key)) {
                        var value = metadata[key];
                        if (DocumentPropertiesDlg.DATES.indexOf(key.toLowerCase()) !== -1) {
                            try {
                                var date = new Date(Date.parse(value));
                                value = date.toString();
                            }
                            catch (e) { }
                        }
                        var row = this.createRow(key, value);
                        metadataTable.append(row);
                    }
                }
            };
            DocumentPropertiesDlg.getUriString = function (uri) {
                // If data uri, truncate it.
                if (uri && uri.length > 30 && uri.startsWith("data:")) {
                    return uri.substr(0, 30) + " ... [truncated]";
                }
                else {
                    return uri;
                }
            };
            DocumentPropertiesDlg.prototype.createRow = function (key, value) {
                var keyCell = $(document.createElement("td")).addClass("col-short").text(key);
                var valueCell = $(document.createElement("td")).addClass("full-width").text(value);
                var row = $(document.createElement("tr")).append(keyCell, valueCell);
                return row;
            };
            DocumentPropertiesDlg.DATES = ["created", "accessed", "modified"];
            return DocumentPropertiesDlg;
        }());
        Dialogs.DocumentPropertiesDlg = DocumentPropertiesDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
