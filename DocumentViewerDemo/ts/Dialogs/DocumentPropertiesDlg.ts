/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module Dialogs {

      interface DocumentPropertiesDlgUI<T> {
         propertiesTable: T,
         metadataTable: T,
         hide: T
      }

      export class DocumentPropertiesDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: DocumentPropertiesDlgUI<string> = null;

         constructor() {
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

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         public show(document: lt.Document.LEADDocument): void {
            this.createPropertiesTable(document);
            this.createMetadataTable(document.metadata);
            this.inner.show();
         }

         private createPropertiesTable(doc: lt.Document.LEADDocument): void {
            var documentInfo: string[] = [];

            documentInfo["Document ID"] = doc.documentId;
            documentInfo["Name"] = doc.name;
            documentInfo["URL"] = DocumentPropertiesDlg.getUriString(doc.uri);
            documentInfo["MIME Type"] = doc.mimeType;
            documentInfo["Encrypted"] = doc.isDecrypted ? "Yes" : "No";

            if (doc.annotations.annotationsUri != null) {
               documentInfo["Annotations URL"] = DocumentPropertiesDlg.getUriString(doc.annotations.annotationsUri);
            }

            documentInfo["Pages"] = doc.pages.count.toString();
            documentInfo["Is cached on service"] = DocumentViewerDemo.DocumentViewerDemoApp.isDocumentInCache(doc) ? "Yes" : "No";
            documentInfo["Cache Status"] = doc.isAnyCacheStatusNotSynced ? "Not Synced" : "Synced";
            documentInfo["Last Synced"] = doc.lastCacheSyncTime ? doc.lastCacheSyncTime.toString() : "N/A";

            if (doc.pages.count > 0) {
               var page: lt.Document.DocumentPage = doc.pages.item(0);
               var pageSize: lt.LeadSizeD = page.size;
               var sizeInches: lt.LeadSizeD = lt.LeadSizeD.create(pageSize.width / lt.Document.LEADDocument.unitsPerInch, pageSize.height / lt.Document.LEADDocument.unitsPerInch);
               var sizeMm: lt.LeadSizeD = lt.LeadSizeD.create(sizeInches.width * 25.4, sizeInches.height * 25.4);
               var sizePixels: lt.LeadSizeD = doc.sizeToPixels(pageSize);
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
         }

         public static DATES: string[] = ["created", "accessed", "modified"];

         private createMetadataTable(metadata: { [key: string]: string }): void {
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
         }

         private static getUriString(uri: string): string {
            // If data uri, truncate it.
            if (uri && uri.length > 30 && (<any>uri).startsWith("data:")) {
               return uri.substr(0, 30) + " ... [truncated]";
            } else {
               return uri;
            }
         }

         private createRow(key: string, value: string): JQuery {
            var keyCell = $(document.createElement("td")).addClass("col-short").text(key);
            var valueCell = $(document.createElement("td")).addClass("full-width").text(value);
            var row = $(document.createElement("tr")).append(keyCell, valueCell);
            return row;
         }
      }
   }
}