/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var DocumentRedactionOptionsDlg = /** @class */ (function () {
            function DocumentRedactionOptionsDlg(appContext) {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.appContext = null;
                this._presetOptions = null;
                this._cachedText = [];
                this.clearTextCache = function () { _this._cachedText = []; };
                this.addTextEntry = function (e) {
                    // We need to keep track of when the Document Viewer pulls in the text for each page.
                    if (e.operation !== lt.Document.Viewer.DocumentViewerOperation.getText || !e.isPostOperation)
                        return;
                    // Make sure that we don't already have the page data cached.
                    var pageNumber = e.pageNumber;
                    var obj = _this._cachedText.filter(function (x) { return x.page === pageNumber; });
                    if (obj && obj.length > 0)
                        return;
                    _this._cachedText.push({
                        page: pageNumber,
                        text: e.data1
                    });
                };
                this.onApply = function () {
                    _this.redactionOptions.viewOptions.mode = $(_this.el.viewOptions.redactionModeSelect).prop("selectedIndex");
                    _this.redactionOptions.viewOptions.replaceCharacter = _this.getReplaceCharacter(_this.el.viewOptions.replaceCharacterInput);
                    _this.redactionOptions.convertOptions.mode = $(_this.el.convertOptions.redactionModeSelect).prop("selectedIndex");
                    _this.redactionOptions.convertOptions.replaceCharacter = _this.getReplaceCharacter(_this.el.convertOptions.replaceCharacterInput);
                    _this.onHide();
                    _this.onApplyOptions();
                };
                this.onHide = function () {
                    _this.inner.hide();
                };
                this.generatePresetChecks = function () {
                    if (!_this._presetOptions)
                        return;
                    // First, clear the container
                    $(_this.el.autoOptions.presets).empty();
                    // Add custom checkbox fields for each preset
                    _this._presetOptions.forEach(function (option) {
                        var checkContainer = document.createElement('div');
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.dataset.regex = option.regex;
                        checkbox.checked = option.checked;
                        var label = document.createElement('label');
                        label.innerText = option.name;
                        checkContainer.appendChild(checkbox);
                        checkContainer.appendChild(label);
                        $(_this.el.autoOptions.presets).append(checkContainer);
                    });
                };
                this.getDocumentText = function () {
                    var type = +$(_this.el.autoOptions.type).val();
                    if (!_this.buildRegex()) {
                        alert("No presets selected");
                        return;
                    }
                    // none options specified
                    if (type === 0) {
                        alert('No type selected');
                        return;
                    }
                    // value not expected
                    if (type > 2) {
                        alert('Type not supported');
                        return;
                    }
                    // Hide the DocumentRedactionOptionsDlg temporarily to avoid UI clutter.
                    _this.inner.hide();
                    // Reach out to the main app context to grab the text for every page in the document
                    _this.appContext.manualGetText(null, _this.applyPreset);
                };
                this.buildRegex = function () {
                    // Concatenate the preset options into a single Regex.
                    var container = $(_this.el.autoOptions.presets);
                    var children = container.find('input');
                    var regex = "";
                    children.each(function (i, e) {
                        var input = e;
                        if (!input.checked)
                            return;
                        var inputRegex = input.dataset.regex;
                        if (!regex)
                            regex = inputRegex;
                        else
                            regex = regex + "|" + inputRegex;
                    });
                    return regex;
                };
                this.applyPreset = function (canceled, error) {
                    if (canceled || !_this._cachedText)
                        return;
                    var viewer = _this.appContext.documentViewer;
                    var automation = viewer.annotations.get_automation();
                    var regex = new RegExp(_this.buildRegex());
                    var type = +$(_this.el.autoOptions.type).val();
                    if (viewer.thumbnails)
                        viewer.thumbnails.imageViewer.beginUpdate();
                    _this._cachedText.forEach(function (item) {
                        // Retrieve the container for the cached page
                        var annContainer = automation.containers.get_item(item.page - 1);
                        automation.activeContainer = annContainer;
                        var rects = PageTextParser.parseText(item.text, regex);
                        rects.forEach(function (rect) {
                            var annObj = null;
                            if (type == 1) {
                                annObj = new lt.Annotations.Engine.AnnRedactionObject();
                                annObj.fill = lt.Annotations.Engine.AnnSolidColorBrush.create('black');
                            }
                            if (type == 2)
                                annObj = new lt.Annotations.Engine.AnnHiliteObject();
                            annObj.rect = rect;
                            annContainer.children.add(annObj);
                            // Fire the invokeAfterObjectChanged automation event so that the Document Viewer hooks into 
                            // the new annObject.
                            var annObjects = new lt.Annotations.Engine.AnnObjectCollection();
                            annObjects.add(annObj);
                            automation.invokeAfterObjectChanged(annObjects, lt.Annotations.Automation.AnnObjectChangedType.added);
                        });
                    });
                    if (viewer.thumbnails)
                        viewer.thumbnails.imageViewer.endUpdate();
                    _this.inner.show();
                };
                this.appContext = appContext;
                var root = $("#dlgRedactionOptions");
                this.el = {
                    autoOptions: {
                        presets: "#dlgAutoRedaction_Presets",
                        type: "#dlgAutoRedaction_Type",
                        apply: "#dlgAutoRedaction_Apply"
                    },
                    viewOptions: {
                        redactionModeSelect: "#dlgViewRedaction_Mode",
                        replaceCharacterInput: "#dlgViewRedaction_ReplaceCharacter"
                    },
                    convertOptions: {
                        redactionModeSelect: "#dlgConvertRedaction_Mode",
                        replaceCharacterInput: "#dlgConvertRedaction_ReplaceCharacter"
                    },
                    applyButton: "#dlgRedactionOptions_Apply",
                    hideButton: "#dlgRedactionOptions .dlg-close"
                };
                $(this.el.viewOptions.redactionModeSelect).on("change", function (e) {
                    var selectedIndex = parseInt($(e.currentTarget).val());
                    $(_this.el.viewOptions.replaceCharacterInput).prop("disabled", (selectedIndex) == lt.Document.DocumentRedactionMode.none);
                });
                $(this.el.convertOptions.redactionModeSelect).on("change", function (e) {
                    var selectedIndex = parseInt($(e.currentTarget).val());
                    $(_this.el.convertOptions.replaceCharacterInput).prop("disabled", (selectedIndex) == lt.Document.DocumentRedactionMode.none);
                });
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hideButton).on("click", this.onHide);
                $(this.el.applyButton).on("click", this.onApply);
                $(this.el.autoOptions.apply).on("click", this.getDocumentText);
            }
            Object.defineProperty(DocumentRedactionOptionsDlg.prototype, "presetOptions", {
                get: function () { return this._presetOptions; },
                set: function (value) {
                    this._presetOptions = value;
                    this.generatePresetChecks();
                },
                enumerable: false,
                configurable: true
            });
            DocumentRedactionOptionsDlg.prototype.dispose = function () {
                $(this.el.applyButton).off("click", this.onApply);
                this.onHide = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            DocumentRedactionOptionsDlg.prototype.getReplaceCharacter = function (input) {
                var replaceCharacter = $(input).val();
                return replaceCharacter && replaceCharacter.length > 0 ? replaceCharacter : '\0';
            };
            DocumentRedactionOptionsDlg.prototype.show = function (options) {
                this.redactionOptions = options;
                $(this.el.viewOptions.redactionModeSelect).prop("selectedIndex", (options.viewOptions.mode));
                $(this.el.viewOptions.replaceCharacterInput).val(options.viewOptions.replaceCharacter == '\0' ? '' : options.viewOptions.replaceCharacter);
                $(this.el.viewOptions.replaceCharacterInput).prop("disabled", options.viewOptions.mode == lt.Document.DocumentRedactionMode.none);
                $(this.el.convertOptions.redactionModeSelect).prop("selectedIndex", (options.convertOptions.mode));
                $(this.el.convertOptions.replaceCharacterInput).val(options.convertOptions.replaceCharacter == '\0' ? '' : options.convertOptions.replaceCharacter);
                $(this.el.convertOptions.replaceCharacterInput).prop("disabled", options.convertOptions.mode == lt.Document.DocumentRedactionMode.none);
                this.inner.show();
            };
            DocumentRedactionOptionsDlg.prototype.onApplyOptions = function () {
            };
            return DocumentRedactionOptionsDlg;
        }());
        Dialogs.DocumentRedactionOptionsDlg = DocumentRedactionOptionsDlg;
        var PageTextParser = /** @class */ (function () {
            function PageTextParser() {
            }
            PageTextParser.parseText = function (pageText, regex) {
                // Re-generate the regex with the global flag set.
                var gRegex = new RegExp(regex.source, 'g');
                pageText.buildTextWithMap();
                var text = pageText.text;
                var nextInstance;
                var bounds = [];
                while ((nextInstance = gRegex.exec(text)) !== null) {
                    var str = nextInstance[0];
                    var results = PageTextParser.mapString(pageText, str, gRegex.lastIndex);
                    bounds = bounds.concat(results);
                }
                return bounds;
            };
            PageTextParser.mapString = function (pageText, input, index) {
                var map = pageText.textMap;
                // Since the index is coming from regex.exec() we know the index value is the character position immediately after 
                // the last character in the input string.  To find the start of the string in the text map we can just
                // take the index - input.length
                var mapIndex = index - input.length;
                var results = [];
                while (mapIndex < index) {
                    var charIndex = map[mapIndex];
                    if (charIndex >= 0) {
                        var char = pageText.characters[charIndex];
                        results.push(char.bounds);
                    }
                    mapIndex++;
                }
                return PageTextParser.mergeRects(results);
            };
            PageTextParser.mergeRects = function (input) {
                var results = [];
                var currentRect = null;
                input.forEach(function (rect) {
                    // Slightly inflate the rect so we can easily check for intersections
                    rect.inflate(2, 2);
                    if (!currentRect) {
                        currentRect = rect;
                        return;
                    }
                    // Check and make sure the rects are on the same line, and that they intersect with each other before we merge.
                    // We don't want to merge rects existing on different lines in the document
                    if (currentRect.y === rect.y && currentRect.intersectsWith(rect)) {
                        currentRect.union(rect);
                    }
                    else {
                        results.push(currentRect);
                        currentRect = rect;
                    }
                });
                if (currentRect)
                    results.push(currentRect);
                return results;
            };
            return PageTextParser;
        }());
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
