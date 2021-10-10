/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var DocumentViewerDemoLoadingDlg = /** @class */ (function () {
            function DocumentViewerDemoLoadingDlg() {
                var _this = this;
                this.cancelClick = null;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this._enableCancellation = undefined;
                this.cancelBtn_Click = function () {
                    _this.isCancelled = true;
                    _this.processing("Canceled...", null);
                    $(_this.el.cancelBtn).prop("disabled", true);
                    if (_this.cancelClick)
                        _this.cancelClick();
                };
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
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.transitionToggle.update({
                    interruptionAction: lt.Demos.Utils.TransitionToggleInterruptionAction.wait,
                    interruptionWaitTime: 200
                });
                $(this.el.cancelBtn).on("click", this.cancelBtn_Click);
                $(this.el.hide).on("click", this.onHide);
            }
            DocumentViewerDemoLoadingDlg.prototype.dispose = function () {
                $(this.el.cancelBtn).off("click", this.cancelBtn_Click);
                this.cancelBtn_Click = null;
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.dispose();
                this.inner = null;
            };
            DocumentViewerDemoLoadingDlg.prototype.show = function (enableCancellation, enableProgress, processText, processSubText, onceStarted) {
                $(this.el.progress.bar)
                    .width(enableProgress ? "0%" : "100%")
                    .attr("aria-valuenow", enableProgress ? 0 : 100);
                $(this.el.progress.percentage).text("");
                this.initInputs(processText, processSubText);
                this.enableCancellation = enableCancellation;
                this.inner.show(onceStarted);
            };
            DocumentViewerDemoLoadingDlg.prototype.processing = function (processText, processSubText) {
                this.initInputs(processText, processSubText);
            };
            DocumentViewerDemoLoadingDlg.prototype.initInputs = function (processText, processSubText) {
                $(this.el.processTextLabel).text(processText);
                $(this.el.processSubTextLabel).text(processSubText || "");
            };
            Object.defineProperty(DocumentViewerDemoLoadingDlg.prototype, "enableCancellation", {
                get: function () {
                    return this._enableCancellation;
                },
                set: function (value) {
                    this.isCancelled = false;
                    $(this.el.cancelBtn).prop("disabled", false);
                    if (this._enableCancellation !== value) {
                        this._enableCancellation = value;
                        $(this.el.cancelDiv).css("display", value ? "block" : "none");
                    }
                },
                enumerable: false,
                configurable: true
            });
            DocumentViewerDemoLoadingDlg.prototype.progress = function (percentage) {
                $(this.el.progress.bar)
                    .width(percentage + "%")
                    .attr("aria-valuenow", percentage);
                $(this.el.progress.percentage).text(percentage + "%");
            };
            DocumentViewerDemoLoadingDlg.prototype.hide = function (onceEnded) {
                this.inner.hide(onceEnded);
            };
            return DocumentViewerDemoLoadingDlg;
        }());
        Dialogs.DocumentViewerDemoLoadingDlg = DocumentViewerDemoLoadingDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
