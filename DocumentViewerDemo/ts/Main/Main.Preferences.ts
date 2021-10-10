/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      // Contains the preferences part and demo settings
      export class PreferencesPart {
         // Reference to the DocumentViewerDemoApp
         private _mainApp: DocumentViewerDemo.DocumentViewerDemoApp = null;

         // Preferred item type
         public preferredItemType: lt.Document.Viewer.DocumentViewerItemType;
         // Show the text indicators on thumbnails and viewer
         public showTextIndicators: boolean;
         // Show document links, if they exist
         public showLinks: boolean;
         // Enable inertia-scroll
         public enableInertiaScroll: boolean;

         private headerToolbar_PreferencesMenu = {
            preferencesMenuItem: "#preferencesMenuItem",
            userNameMenuItem: "#userNameMenuItem",
            showTextIndicatorsMenuItem: "#showTextIndicators",
            showLinksMenuItem: "#showLinks",
            documentViewerOptionsMenuItem: "#documentViewerOptions",
         };

         constructor(main: DocumentViewerDemo.DocumentViewerDemoApp) {
            this._mainApp = main;
            this.preferredItemType = lt.Document.Viewer.DocumentViewerItemType.image;
            if (this._mainApp.demoMode != DemoMode.Barcode)
               this.showTextIndicators = true;
            this.showLinks = false;
            this.enableInertiaScroll = true;

            this.initPreferencesUI();
         }

         private initPreferencesUI(): void {
            $(this.headerToolbar_PreferencesMenu.preferencesMenuItem).on("click", this.preferencesMenuItem_Click.bind(this));
            $(this.headerToolbar_PreferencesMenu.userNameMenuItem).on("click", this.userNameMenuItem_Click.bind(this));
            $(this.headerToolbar_PreferencesMenu.showTextIndicatorsMenuItem).on("click", this.showTextIndicatorsMenuItem_Click.bind(this));
            $(this.headerToolbar_PreferencesMenu.showLinksMenuItem).on("click", this.showLinksMenuItem_Click.bind(this));
            $(this.headerToolbar_PreferencesMenu.documentViewerOptionsMenuItem).on("click", this.documentViewerOptionsMenuItem_Click.bind(this));
         }

         private preferencesMenuItem_Click(e: JQueryEventObject): void {
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_PreferencesMenu.showTextIndicatorsMenuItem).find(".icon"), this.showTextIndicators);
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_PreferencesMenu.showLinksMenuItem).find(".icon"), this.showLinks);
         }

         private userNameMenuItem_Click(e: JQueryEventObject): void {
            var inputDlg = this._mainApp.inputDlg;
            inputDlg.showWith("User Name", "Enter the user name for modifying annotations in the document.", this._mainApp.documentViewer.userName, false, false);
            inputDlg.onApply = (userName: string) => {
               if (userName) {
                  this._mainApp.documentViewer.userName = userName;
                  lt.Demos.Annotations.AutomationObjectsListControl.userName = userName;
               } else {
                  this._mainApp.documentViewer.userName = "Author";
                  lt.Demos.Annotations.AutomationObjectsListControl.userName = "Author";
               }
               return true;
            };
         }

         private showTextIndicatorsMenuItem_Click(e: JQueryEventObject): void {
            this.showTextIndicators = !this.showTextIndicators;
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_PreferencesMenu.showTextIndicatorsMenuItem).find(".icon"), this.showTextIndicators);

            // Invalidate the view
            this._mainApp.documentViewer.view.invalidate(lt.LeadRectD.empty);
            if (this._mainApp.documentViewer.thumbnails != null)
               this._mainApp.documentViewer.thumbnails.invalidate(lt.LeadRectD.empty);
         }

         private showLinksMenuItem_Click(e: JQueryEventObject): void {
            this.showLinks = !this.showLinks;
            lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_PreferencesMenu.showLinksMenuItem).find(".icon"), this.showLinks);

            this._mainApp.documentViewer.diagnostics.showLinks = this.showLinks;
         }

         private documentViewerOptionsMenuItem_Click(e: JQueryEventObject): void {
            // Set the documentViewer for the dialog
            var dlg = this._mainApp.documentViewerOptionsDlg;
            var app = this._mainApp;
            dlg.hookPrepareAjax = app.hookPrepareAjax;
            dlg.useCSSTransitions = app.useCSSTransitions;
            dlg.useSvgBackImage = app.useSvgBackImage;
            dlg.useStatusQueryRequests = app.useStatusQueryRequests;
            dlg.verifyUploadedMimeTypes = app.verifyUploadedMimeTypes;
            dlg.loadDocumentMode = app.loadDocumentMode;

            if (app.serviceHeartbeat) {
               dlg.heartbeatEnabled = app.serviceHeartbeat.isStarted;
               dlg.heartbeatStart = app.serviceHeartbeat.startTimeout;
               dlg.heartbeatInterval = app.serviceHeartbeat.interval;
               dlg.heartbeatAutoPause = app.serviceHeartbeat.autoPauseInteractionTimeout;
            }

            dlg.documentViewer = this._mainApp.documentViewer;
            dlg.hasUserToken = this._mainApp.hasUserToken;
            dlg.show();
         }
      }
   }
}