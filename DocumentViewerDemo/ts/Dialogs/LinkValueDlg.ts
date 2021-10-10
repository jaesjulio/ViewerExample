/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface LinkValueDlgUI<T> {
         link: T,
         alwaysOpenLinks: T,
         hide: T
      }

      export class LinkValueDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: LinkValueDlgUI<string> = null;

         constructor() {
            var root = $("#dlgLinkValue");
            this.el = {
               link: "#dlgLinkValue_Link",
               alwaysOpenLinks: "#dlgLinkValue_AlwaysOpenLinks",
               hide: "#dlgLinkValue .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            $(this.el.hide).on("click", this.close_Clicked);
         }

         // Events
         public onClose: () => void;

         private close_Clicked = () => {
            this.inner.hide(() => {
               if (this.onClose)
                  this.onClose();
            });
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.close_Clicked);
            this.close_Clicked = null;

            this.onClose = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         public show(linkValue: string): void {
            var link = $(this.el.link);
            link.text(linkValue);

            link.prop("href", Tools.normalizeLinkValue(linkValue));
            link.prop("target", "_blank");
            link.prop("rel", "noopener noreferrer");

            this.inner.show();
         }

         get doNotShowAgain(): boolean {
            return $(this.el.alwaysOpenLinks).is(':checked');
         }
      }

      interface LinkMessageDlgUI<T> {
         title: T,
         message: T,
         link: T,
         hide: T
      }

      export class LinkMessageDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: LinkMessageDlgUI<string> = null;

         constructor() {
            var root = $("#dlgLinkMessage");
            this.el = {
               title: "#dlgLinkMessage_Title",
               message: "#dlgLinkMessage_Message",
               link: "#dlgLinkMessage_Link",
               hide: "#dlgLinkMessage .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            $(this.el.hide).on("click", this.onHide);
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         public show(title: string, message: string, linkText: string, linkValue: string): void {
            $(this.el.title).text(title);
            $(this.el.message).text(message);

            var link = $(this.el.link);
            link.text(linkText);
            link.prop("href", Tools.normalizeLinkValue(linkValue));
            link.prop("target", "_blank");
            link.prop("rel", "noopener noreferrer");

            this.inner.show();
         }

      }

      class Tools {
         public static normalizeLinkValue(linkValue: string): string {
            linkValue = linkValue.trim();

            if ((linkValue.toLowerCase().indexOf("http:") !== 0) && (linkValue.toLowerCase().indexOf("https:") !== 0)) {
               if (linkValue.indexOf("//") === 0) {
                  // Like "//leadtools.com"
                  return "http:" + linkValue;
               }
               else {
                  // Like "leadtools.com"
                  return "http://" + linkValue;
               }
            } else {
               return linkValue;
            }
         }
      }
   }
}