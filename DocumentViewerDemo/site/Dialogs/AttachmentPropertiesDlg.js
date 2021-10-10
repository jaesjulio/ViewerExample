/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var AttachmentPropertiesDlg = /** @class */ (function () {
            function AttachmentPropertiesDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                var root = $("#dlgAttachmentProperties");
                this.el = {
                    propertiesTable: "#dlgAttachmentProperties_Properties",
                    hide: "#dlgAttachmentProperties .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
            }
            AttachmentPropertiesDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            AttachmentPropertiesDlg.prototype.show = function (attachment) {
                this.createPropertiesTable(attachment);
                this.inner.show();
            };
            AttachmentPropertiesDlg.prototype.createPropertiesTable = function (attachment) {
                var documentInfo = [];
                if (attachment) {
                    documentInfo["Document ID"] = attachment.documentId;
                    documentInfo["File name"] = attachment.fileName;
                    documentInfo["Display name"] = attachment.displayName;
                    documentInfo["File length"] = attachment.fileLength;
                    documentInfo["Mime type"] = attachment.mimeType;
                    documentInfo["Is embedded"] = attachment.isEmbedded ? "Yes" : "No";
                    var metadata = attachment.metadata;
                    if (metadata) {
                        for (var key in metadata) {
                            if (metadata.hasOwnProperty(key)) {
                                var value = metadata[key];
                                if (Dialogs.DocumentPropertiesDlg.DATES.indexOf(key.toLowerCase()) !== -1) {
                                    try {
                                        var date = new Date(Date.parse(value));
                                        value = date.toString();
                                    }
                                    catch (e) { }
                                }
                                documentInfo[key] = value;
                            }
                        }
                    }
                }
                var propertiesTable = $(this.el.propertiesTable);
                propertiesTable.empty();
                for (var key in documentInfo) {
                    if (documentInfo.hasOwnProperty(key)) {
                        var row = this.createRow(key, documentInfo[key]);
                        propertiesTable.append(row);
                    }
                }
            };
            AttachmentPropertiesDlg.prototype.createRow = function (key, value) {
                var keyCell = $(document.createElement("td")).addClass("col-short").text(key);
                var valueCell = $(document.createElement("td")).addClass("full-width").text(value);
                var row = $(document.createElement("tr")).append(keyCell, valueCell);
                return row;
            };
            return AttachmentPropertiesDlg;
        }());
        Dialogs.AttachmentPropertiesDlg = AttachmentPropertiesDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
