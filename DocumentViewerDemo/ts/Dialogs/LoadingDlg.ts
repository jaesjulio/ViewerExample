/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface DocumentViewerDemoLoadingDlgUI<T> {
         processTextLabel: T,
         processSubTextLabel: T,
         progress: {
            bar: T,
            percentage: T
         },
         cancelDiv: T,
         cancelBtn: T,
         hide: T
      }

      export class DocumentViewerDemoLoadingDlg implements lt.Demos.Dialogs.Dialog {

         public cancelClick: () => void = null;

         public isCancelled: boolean;

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: DocumentViewerDemoLoadingDlgUI<string> = null;

         constructor() {

            var root = $("#dlgLoading");
            this.el = {
               processTextLabel: "#dlgLoading_ProcessText",
               processSubTextLabel: "#dlgLoading_ProcessSubText",
               progress: {
                  bar: "#dlgLoading_ProgressBar",
                  percentage: "#dlgLoading_ProgressPercentage"
               },
               cancelDiv: "#dlgLoading_CancelDiv",
               cancelBtn: "#dlgLoading_Cancel",
               hide: "#dlgLoading .dlg-close"
            }

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);
            this.inner.transitionToggle.update({
               interruptionAction: lt.Demos.Utils.TransitionToggleInterruptionAction.wait,
               interruptionWaitTime: 200
            });

            $(this.el.cancelBtn).on("click", this.cancelBtn_Click);

            $(this.el.hide).on("click", this.onHide);
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.cancelBtn).off("click", this.cancelBtn_Click);
            this.cancelBtn_Click = null;

            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            this.inner.dispose();
            this.inner = null;
         }

         public show(enableCancellation: boolean, enableProgress: boolean, processText: string, processSubText: string, onceStarted: (didToggle: boolean) => void): void {
            $(this.el.progress.bar)
               .width(enableProgress ? "0%" : "100%")
               .attr("aria-valuenow", enableProgress ? 0 : 100);
            $(this.el.progress.percentage).text("");

            this.initInputs(processText, processSubText);

            this.enableCancellation = enableCancellation;

            this.inner.show(onceStarted);
         }

         public processing(processText: string, processSubText: string): void {
            this.initInputs(processText, processSubText);
         }

         private initInputs(processText: string, processSubText: string): void {
            $(this.el.processTextLabel).text(processText);
            $(this.el.processSubTextLabel).text(processSubText || "");
         }

         private _enableCancellation: boolean = undefined;
         public get enableCancellation(): boolean {
            return this._enableCancellation;
         }
         public set enableCancellation(value: boolean) {
            this.isCancelled = false;
            $(this.el.cancelBtn).prop("disabled", false);

            if (this._enableCancellation !== value) {
               this._enableCancellation = value;
               $(this.el.cancelDiv).css("display", value ? "block" : "none");
            }
         }

         public progress(percentage: number): void {
            $(this.el.progress.bar)
               .width(percentage + "%")
               .attr("aria-valuenow", percentage);
            $(this.el.progress.percentage).text(percentage + "%");
         }

         public hide(onceEnded?: (didToggle: boolean) => void): void {
            this.inner.hide(onceEnded);
         }

         private cancelBtn_Click = () => {
            this.isCancelled = true;
            this.processing("Canceled...", null);
            $(this.el.cancelBtn).prop("disabled", true);
            if (this.cancelClick)
               this.cancelClick();
         }
      }
   }
}