/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var ColorPicker = /** @class */ (function () {
            function ColorPicker(props) {
                var _this = this;
                this._baseColor = "red";
                this._color = "";
                this._picker = null;
                this._preview = null;
                this._hiddenPicker = null;
                this.enable = function () {
                    if (_this._picker && _this._picker.disabled) {
                        _this._picker.disabled = false;
                        _this._hiddenPicker.disabled = false;
                    }
                };
                this.disable = function () {
                    if (_this._picker && !_this._picker.disabled) {
                        _this._picker.disabled = true;
                        _this._hiddenPicker.disabled = true;
                    }
                };
                this.generateColorPicker = function (props) {
                    var root = document.getElementById(props.rootDivID);
                    if (!root) {
                        alert("There was an error creating the color picker - root id does not exist");
                        return;
                    }
                    var picker = document.createElement("input");
                    picker.setAttribute('type', 'text');
                    picker.className = "colorPicker float";
                    picker.value = _this._baseColor;
                    picker.disabled = true;
                    var preview = document.createElement("div");
                    preview.className = "colorSwatch float";
                    preview.style.backgroundColor = _this._baseColor;
                    preview.style.borderColor = _this._baseColor;
                    var hiddenPicker = document.createElement("input");
                    hiddenPicker.setAttribute('type', 'color');
                    hiddenPicker.value = _this._baseColor;
                    hiddenPicker.style.display = "none";
                    hiddenPicker.disabled = true;
                    var colorHandle = function (e) {
                        var inputColor = e.target.value;
                        if (picker.value != inputColor) {
                            picker.value = inputColor;
                        }
                        preview.style.backgroundColor = inputColor;
                        preview.style.borderColor = inputColor;
                        if (_this.isValidColor(inputColor))
                            _this._color = inputColor;
                    };
                    var previewClick = function () {
                        hiddenPicker.click();
                    };
                    picker.addEventListener('input', colorHandle);
                    picker.addEventListener('propertyChange', colorHandle); //Fix for IE8 and below
                    preview.addEventListener('click', previewClick);
                    hiddenPicker.addEventListener('input', colorHandle);
                    _this._picker = picker;
                    _this._preview = preview;
                    _this._hiddenPicker = hiddenPicker;
                    root.appendChild(picker);
                    root.appendChild(preview);
                    root.appendChild(hiddenPicker);
                };
                this.isValidColor = function (testColor) {
                    if (testColor === _this._baseColor)
                        return true;
                    var test = document.createElement('div');
                    test.style.color = _this._baseColor;
                    test.style.color = testColor;
                    var isValid = true;
                    if (test.style.color === _this._baseColor || test.style.color === '')
                        isValid = false;
                    test.remove();
                    return isValid;
                };
                this.colorToRGBA = function (color) {
                    if (!color)
                        throw new Error("Invalid color string passed");
                    var temp = document.createElement('div');
                    temp.style.color = color;
                    document.body.appendChild(temp);
                    var style = window.getComputedStyle(temp).color;
                    var parsedColor = style.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
                    if (!parsedColor)
                        throw new Error("Failed to parse color");
                    var rgba = {
                        r: parseInt(parsedColor[1]),
                        g: parseInt(parsedColor[2]),
                        b: parseInt(parsedColor[3]),
                        a: parsedColor.length === 5 && parsedColor[4] ? +parsedColor[4] : 1
                    };
                    temp.remove();
                    return rgba;
                };
                this.generateColorPicker(props);
            }
            Object.defineProperty(ColorPicker.prototype, "color", {
                get: function () { return this._color; },
                set: function (color) {
                    if (this.isValidColor(color)) {
                        if (this._picker)
                            this._picker.value = color;
                        if (this._preview) {
                            this._preview.style.backgroundColor = color;
                            this._preview.style.borderColor = color;
                        }
                        this._color = color;
                    }
                },
                enumerable: false,
                configurable: true
            });
            return ColorPicker;
        }());
        Dialogs.ColorPicker = ColorPicker;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
