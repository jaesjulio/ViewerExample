/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var CacheDlg = /** @class */ (function () {
            function CacheDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this._currentCacheIdForLoad = null;
                this.pasteCurrentForLoad_Click = function () {
                    $(_this.el.input).val(_this._currentCacheIdForLoad || "");
                };
                this.reloadCurrentForSave_Click = function () {
                    if (_this.onReloadCurrentFromSave)
                        _this.onReloadCurrentFromSave();
                    _this.onHide();
                };
                this.loadApply_Click = function () {
                    var cacheId = $(_this.el.input).val();
                    if (cacheId)
                        cacheId = cacheId.trim();
                    if (!cacheId) {
                        alert("Please enter a valid cache identifier.");
                        return;
                    }
                    if (_this.onLoad)
                        _this.onLoad(cacheId);
                    _this.onHide();
                };
                var root = $("#dlgCache");
                this.el = {
                    title: "#dlgCache_Title",
                    description: "#dlgCache_Description",
                    pasteCurrentForLoadBtn: "#dlgCache_PasteCurrentForLoad",
                    pasteCurrentForLoadSyncedMessageBtn: "#dlgCache_PasteCurrentForLoad_Synced",
                    input: "#dlgCache_Input",
                    reloadCurrentFromSaveBtn: "#dlgCache_ReloadCurrentFromSave",
                    loadApplyBtn: "#dlgInput_Load",
                    hideBtn: "#dlgCache .dlg-close",
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                // React immediately to open/close (default is to ignore between last call and the end of animation)
                this.inner.transitionToggle.update({
                    interruptionAction: lt.Demos.Utils.TransitionToggleInterruptionAction.immediate,
                });
                $(this.el.hideBtn).on("click", this.onHide);
                $(this.el.pasteCurrentForLoadBtn).on("click", this.pasteCurrentForLoad_Click);
                $(this.el.loadApplyBtn).on("click", this.loadApply_Click);
                $(this.el.reloadCurrentFromSaveBtn).on("click", this.reloadCurrentForSave_Click);
            }
            CacheDlg.prototype.dispose = function () {
                $(this.el.hideBtn).off("click", this.onHide);
                this.onHide = null;
                $(this.el.pasteCurrentForLoadBtn).off("click", this.pasteCurrentForLoad_Click);
                this.pasteCurrentForLoad_Click = null;
                $(this.el.loadApplyBtn).off("click", this.loadApply_Click);
                this.loadApply_Click = null;
                $(this.el.reloadCurrentFromSaveBtn).off("click", this.reloadCurrentForSave_Click);
                this.reloadCurrentForSave_Click = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            CacheDlg.prototype.showSave = function (description, documentId) {
                $(this.el.title).text("Save To Cache");
                $(this.el.description).text(description);
                lt.Demos.Utils.Visibility.toggle($(this.el.reloadCurrentFromSaveBtn), true);
                lt.Demos.Utils.Visibility.toggle($(this.el.loadApplyBtn), false);
                lt.Demos.Utils.Visibility.toggle($(this.el.pasteCurrentForLoadBtn), false);
                $(this.el.input).prop("readonly", true);
                $(this.el.input).val(documentId);
                this.inner.show();
            };
            CacheDlg.prototype.showLoad = function (inputValue, doc, hasChanged) {
                $(this.el.title).text("Open From Cache");
                $(this.el.description).text("Open a document using its cache identifier.");
                lt.Demos.Utils.Visibility.toggle($(this.el.reloadCurrentFromSaveBtn), false);
                // Only show the "Paste Current For Load" button if the document has been synced at least once.
                // Show a "Not Synced" message if it's not currently synced.
                if (doc && !!doc.lastCacheSyncTime) {
                    this._currentCacheIdForLoad = doc.documentId;
                    lt.Demos.Utils.Visibility.toggle($(this.el.pasteCurrentForLoadBtn), true);
                    var notSynced = hasChanged || doc.isAnyCacheStatusNotSynced;
                    lt.Demos.Utils.Visibility.toggle($(this.el.pasteCurrentForLoadSyncedMessageBtn), notSynced);
                }
                else {
                    this._currentCacheIdForLoad = null;
                    lt.Demos.Utils.Visibility.toggle($(this.el.pasteCurrentForLoadBtn), false);
                    lt.Demos.Utils.Visibility.toggle($(this.el.pasteCurrentForLoadSyncedMessageBtn), false);
                }
                lt.Demos.Utils.Visibility.toggle($(this.el.loadApplyBtn), true);
                $(this.el.input).prop("readonly", false);
                $(this.el.input).val(inputValue || "");
                this.inner.show();
            };
            return CacheDlg;
        }());
        Dialogs.CacheDlg = CacheDlg;
        var InputDlg = /** @class */ (function () {
            function InputDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.apply_Click = function (e) {
                    var input = $(_this.el.input).val();
                    if (input)
                        input = input.trim();
                    var doHide = true;
                    if (_this.onApply)
                        doHide = _this.onApply(input);
                    if (doHide)
                        _this.inner.hide();
                };
                var root = $("#dlgInput");
                this.el = {
                    title: "#dlgInput_Title",
                    description: "#dlgInput_Description",
                    input: "#dlgInput_Input",
                    applyBtn: "#dlgInput_Apply",
                    hideBtn: "#dlgInput_Hide",
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                // React immediately to open/close (default is to ignore between last call and the end of animation)
                this.inner.transitionToggle.update({
                    interruptionAction: lt.Demos.Utils.TransitionToggleInterruptionAction.immediate,
                });
                $(this.el.hideBtn).on("click", this.onHide);
                $(this.el.applyBtn).on("click", this.apply_Click);
            }
            InputDlg.prototype.dispose = function () {
                $(this.el.hideBtn).off("click", this.onHide);
                this.onHide = null;
                $(this.el.applyBtn).off("click", this.apply_Click);
                this.apply_Click = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            InputDlg.prototype.showWith = function (title, description, value, isPassword, isReadOnly) {
                $(this.el.title).text(title);
                $(this.el.description).text(description);
                $(this.el.input).attr("type", isPassword ? "password" : "text");
                lt.Demos.Utils.Visibility.toggle($(this.el.applyBtn), !isReadOnly);
                $(this.el.hideBtn).text(isReadOnly ? "Close" : "Cancel");
                $(this.el.input)
                    .attr({
                    readOnly: isReadOnly
                })
                    .val(value || "");
                this.show();
            };
            InputDlg.prototype.show = function () {
                this.inner.show();
            };
            return InputDlg;
        }());
        Dialogs.InputDlg = InputDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
