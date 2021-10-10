/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module Dialogs {

      interface AttachmentPropertiesDlgUI<T> {
         propertiesTable: T,
         hide: T
      }

      export class AttachmentPropertiesDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: AttachmentPropertiesDlgUI<string> = null;

         constructor() {
            var root = $("#dlgAttachmentProperties");
            this.el = {
               propertiesTable: "#dlgAttachmentProperties_Properties",
               hide: "#dlgAttachmentProperties .dlg-close"
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

         public show(attachment: lt.Document.DocumentAttachment): void {
            this.createPropertiesTable(attachment);
            this.inner.show();
         }

         private createPropertiesTable(attachment: lt.Document.DocumentAttachment): void {
            var documentInfo: string[] = [];

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
                        if (DocumentPropertiesDlg.DATES.indexOf(key.toLowerCase()) !== -1) {
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