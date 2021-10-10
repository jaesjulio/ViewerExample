/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var CustomRenderModeDlg = /** @class */ (function () {
            function CustomRenderModeDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.onChange = function () {
                    _this.updateUIState();
                };
                this.visibleObjectsSelect_KeyDown = function (e) {
                    e.preventDefault();
                    // Ctrl + A, select all
                    if (e.keyCode == 65 && e.ctrlKey)
                        $(_this.el.visibleObjectSelect).children("option").prop("selected", true);
                };
                this.invisibleObjectsSelect_KeyDown = function (e) {
                    e.preventDefault();
                    // Ctrl + A, select all
                    if (e.keyCode == 65 && e.ctrlKey)
                        $(_this.el.invisibleObjectSelect).children("option").prop("selected", true);
                };
                this.moveToInvisibleBtn_Click = function (e) {
                    _this.moveObjects($(_this.el.visibleObjectSelect), $(_this.el.invisibleObjectSelect));
                };
                this.moveToVisibleBtn_Click = function (e) {
                    _this.moveObjects($(_this.el.invisibleObjectSelect), $(_this.el.visibleObjectSelect));
                };
                this.apply_Click = function () {
                    var visibleObjects = $(_this.el.visibleObjectSelect).children("option");
                    _this.resultRenderers = {};
                    for (var i = 0; i < visibleObjects.length; i++) {
                        var option = visibleObjects.get(i);
                        _this.resultRenderers[option.value] = _this.allRenderers[option.value];
                    }
                    _this.inner.hide();
                    if (_this.onApply)
                        _this.onApply();
                };
                var root = $("#dlgCustomRenderMode");
                this.el = {
                    visibleObjectSelect: "#dlgCustomRenderMode_VisibleObjectSelect",
                    invisibleObjectSelect: "#dlgCustomRenderMode_InvisibleObjectSelect",
                    moveToInvisibleBtn: "#dlgCustomRenderMode_MoveToInvisible",
                    moveToVisibleBtn: "#dlgCustomRenderMode_MoveToVisible",
                    apply: "#dlgCustomRenderMode_Apply",
                    hide: "#dlgCustomRenderMode .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                $(this.el.visibleObjectSelect).on("click change", this.onChange).on("keydown", this.visibleObjectsSelect_KeyDown);
                $(this.el.invisibleObjectSelect).on("click change", this.onChange).on("keydown", this.invisibleObjectsSelect_KeyDown);
                $(this.el.moveToInvisibleBtn).on("click", this.moveToInvisibleBtn_Click);
                $(this.el.moveToVisibleBtn).on("click", this.moveToVisibleBtn_Click);
                $(this.el.apply).on("click", this.apply_Click);
                this.inner.onRootClick = this.onHide;
                $(this.el.hide).on("click", this.onHide);
            }
            CustomRenderModeDlg.prototype.dispose = function () {
                this.automationManager = null;
                this.allRenderers = null;
                this.currentRenderers = null;
                this.resultRenderers = null;
                $(this.el.visibleObjectSelect)
                    .empty()
                    .off("click change", this.onChange)
                    .off("keydown", this.visibleObjectsSelect_KeyDown);
                $(this.el.invisibleObjectSelect)
                    .empty()
                    .off("click change", this.onChange)
                    .off("keydown", this.invisibleObjectsSelect_KeyDown);
                $(this.el.moveToInvisibleBtn).off("click", this.moveToInvisibleBtn_Click);
                $(this.el.moveToVisibleBtn).off("click", this.moveToVisibleBtn_Click);
                $(this.el.apply).off("click", this.apply_Click);
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
                this.onApply = null;
                this.onChange = null;
                this.apply_Click = null;
                this.visibleObjectsSelect_KeyDown = null;
                this.invisibleObjectsSelect_KeyDown = null;
                this.moveToInvisibleBtn_Click = null;
                this.moveToVisibleBtn_Click = null;
            };
            CustomRenderModeDlg.prototype.show = function () {
                var visibleObjectSelect = $(this.el.visibleObjectSelect);
                visibleObjectSelect.empty();
                var invisibleObjectSelect = $(this.el.invisibleObjectSelect);
                invisibleObjectSelect.empty();
                var keys = Object.keys(this.allRenderers);
                for (var i = 0; i < keys.length; i++) {
                    var key = parseInt(keys[i], 10);
                    switch (key) {
                        // Ignore these types.
                        case lt.Annotations.Engine.AnnObject.selectObjectId:
                        case lt.Annotations.Engine.AnnObject.imageObjectId:
                            break;
                        default:
                            var automationObject = this.automationManager.findObjectById(key);
                            if (automationObject) {
                                var option = document.createElement("option");
                                option.value = key.toString();
                                option.text = automationObject.name;
                                // CurrentRenderers: current renderers in RenderMode
                                if (this.currentRenderers[key])
                                    visibleObjectSelect.append(option);
                                else
                                    invisibleObjectSelect.append(option);
                            }
                            break;
                    }
                }
                this.updateUIState();
                this.inner.show();
            };
            CustomRenderModeDlg.prototype.updateUIState = function () {
                var numVisibleSelected = $(this.el.visibleObjectSelect).children("option:selected").length;
                $(this.el.moveToInvisibleBtn).prop("disabled", numVisibleSelected === 0);
                var numInvisibleSelected = $(this.el.invisibleObjectSelect).children("option:selected").length;
                $(this.el.moveToVisibleBtn).prop("disabled", numInvisibleSelected === 0);
            };
            CustomRenderModeDlg.prototype.moveObjects = function (source, target) {
                var selectedOptions = source.children("option:selected");
                if (selectedOptions.length < 1)
                    return;
                target.append(selectedOptions);
                this.updateUIState();
            };
            return CustomRenderModeDlg;
        }());
        Dialogs.CustomRenderModeDlg = CustomRenderModeDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
