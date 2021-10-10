// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AnnPropertyInfo = /** @class */ (function () {
                function AnnPropertyInfo(propertyName, readOnly, value, groupName, description, displayName, visible, editorType) {
                    var _this = this;
                    this.editorType_OnValueChanged = function (oldValue, newValue) {
                        _this._value = newValue;
                        if (_this.valueChanged != null)
                            _this.valueChanged(oldValue, newValue);
                    };
                    this._values = {};
                    this._isReadOnly = readOnly;
                    this._type = value;
                    this._groupName = groupName;
                    this._description = description;
                    this._isVisible = visible;
                    if (!displayName)
                        this._displayName = propertyName;
                    else
                        this._displayName = displayName;
                    // Call the constructor of our IAnnEditor
                    // (bind the arguments to the editorType constructor, then call "new" on it)
                    this._editor = new editorType(value, groupName, propertyName, this._displayName);
                    this._editor.onValueChanged = this.editorType_OnValueChanged;
                    this._value = value;
                }
                Object.defineProperty(AnnPropertyInfo.prototype, "editor", {
                    get: function () { return this._editor; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "isReadOnly", {
                    get: function () { return this._isReadOnly; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "isVisible", {
                    get: function () { return this._isVisible; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.valueChanged != null)
                            this.valueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "displayName", {
                    get: function () { return this._displayName; },
                    set: function (value) { this._displayName = value; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "values", {
                    get: function () { return this._values; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "type", {
                    get: function () { return this._type; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "hasValues", {
                    get: function () { return this._hasValues; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "groupName", {
                    get: function () { return this._groupName; },
                    set: function (value) { this._groupName = value; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnPropertyInfo.prototype, "description", {
                    get: function () { return this._description; },
                    set: function (value) { this._description = value; },
                    enumerable: false,
                    configurable: true
                });
                return AnnPropertyInfo;
            }());
            Annotations.AnnPropertyInfo = AnnPropertyInfo;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AudioPlayerDialog = /** @class */ (function () {
                function AudioPlayerDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the loading dialog UI elements
                    this.el = null;
                    // Run when close, "x", or background is clicked
                    this._onHide = function () {
                        if (_this.inner.isShowing) {
                            if (_this._audioElement) {
                                _this._audioElement.pause();
                                if (_this._sourceElement1.parentNode === _this._audioElement)
                                    _this._audioElement.removeChild(_this._sourceElement1);
                                if (_this._sourceElement2.parentNode === _this._audioElement)
                                    _this._audioElement.removeChild(_this._sourceElement2);
                                if (_this._sourceElement3.parentNode === _this._audioElement)
                                    _this._audioElement.removeChild(_this._sourceElement3);
                            }
                        }
                        // Call hide
                        _this.inner.hide();
                    };
                    this.el = {
                        audioObject: root.find(selectors.audioObject),
                        hide: root.find(selectors.hide)
                    };
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHide;
                    this.el.hide.on("click", this._onHide);
                }
                AudioPlayerDialog.prototype.play = function (source1, source2, source3) {
                    var _this = this;
                    if (!source1 && !source2 && !source3)
                        return;
                    this._audioElement = this.el.audioObject.get(0);
                    // Safari cannot play if QuickTime Player not installed
                    var canPlay = typeof (this._audioElement.play) === "function";
                    if (!canPlay) {
                        this._audioElement.innerHTML = "Your browser does not support HTML5 video.";
                    }
                    else {
                        this._sourceElement1 = document.createElement("source");
                        this._sourceElement1.src = source1;
                        this._sourceElement2 = document.createElement("source");
                        this._sourceElement2.src = source2;
                        this._sourceElement3 = document.createElement("source");
                        this._sourceElement3.src = source3;
                        this._audioElement.appendChild(this._sourceElement1);
                        this._audioElement.appendChild(this._sourceElement2);
                        this._audioElement.appendChild(this._sourceElement3);
                        this._audioElement.load();
                    }
                    this.inner.show(function () {
                        if (canPlay) {
                            _this._audioElement.play();
                        }
                    });
                };
                Object.defineProperty(AudioPlayerDialog.prototype, "audioElement", {
                    get: function () {
                        return this._audioElement;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AudioPlayerDialog;
            }());
            Annotations.AudioPlayerDialog = AudioPlayerDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationUpdateObjectDialog = /** @class */ (function () {
                function AutomationUpdateObjectDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._targetObject = null;
                    this._targetContainer = null;
                    this._automation = null;
                    this._userName = "";
                    this.showProperties = true;
                    this.showContent = true;
                    this.showReviews = true;
                    this.$allTabsAndPages = null;
                    // Rub when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        if (_this.showReviews) {
                            _this._reviewsPage.replacesReviewsIn(_this._targetObject);
                            _this._reviewsPage.cleanUp();
                        }
                        _this.showProperties = true;
                        _this.showContent = true;
                        _this.showReviews = true;
                        var annObjCol = new lt.Annotations.Engine.AnnObjectCollection();
                        annObjCol.add(_this._targetObject);
                        _this._automation.invokeAfterObjectChanged(annObjCol, lt.Annotations.Automation.AnnObjectChangedType.modified);
                        _this._automation.invokeAfterObjectChanged(annObjCol, lt.Annotations.Automation.AnnObjectChangedType.metadata);
                        _this._automation.invalidate(lt.LeadRectD.empty);
                        if (_this.onHide)
                            _this.onHide();
                        _this.inner.hide();
                    };
                    this.el = lt.Demos.Utils.findSelectorsInRoot(root, selectors);
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    this._propertiesPage = new lt.Demos.Annotations.PropertiesPage(this.el.properties.page);
                    this._contentPage = new lt.Demos.Annotations.ContentPage(this.el.content.page);
                    this._reviewsPage = new lt.Demos.Annotations.ReviewsPage(this.el.reviews.page);
                    // Set up the click handlers between the tabs one time, regardless of visibility
                    var selectedClass = AutomationUpdateObjectDialog.selectedClass;
                    this.$allTabsAndPages = this.el.properties.tab.add(this.el.properties.page).add(this.el.content.tab).add(this.el.content.page).add(this.el.reviews.tab).add(this.el.reviews.page);
                    this.$allTabsAndPages.removeClass(selectedClass);
                    var targets = [
                        [this.el.properties.tab, this.el.properties.page],
                        [this.el.content.tab, this.el.content.page],
                        [this.el.reviews.tab, this.el.reviews.page]
                    ];
                    targets.forEach(function (target) {
                        var $tab = target[0];
                        var $page = target[1];
                        $tab.on("click", function () {
                            if (!$tab.hasClass(selectedClass)) {
                                _this.$allTabsAndPages.removeClass(selectedClass);
                                $tab.addClass(selectedClass);
                                $page.addClass(selectedClass);
                            }
                        });
                    });
                }
                Object.defineProperty(AutomationUpdateObjectDialog.prototype, "targetObject", {
                    get: function () { return this._targetObject; },
                    set: function (value) {
                        this._targetObject = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationUpdateObjectDialog.prototype, "targetContainer", {
                    get: function () { return this._targetContainer; },
                    set: function (value) {
                        this._targetContainer = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationUpdateObjectDialog.prototype, "automation", {
                    get: function () { return this._automation; },
                    set: function (value) {
                        if (this._automation != value) {
                            if (this._automation != null)
                                this._automation.active = false;
                            this._automation = value;
                            this._automation.active = true;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationUpdateObjectDialog.prototype, "userName", {
                    get: function () { return this._userName; },
                    set: function (value) { this._userName = value; },
                    enumerable: false,
                    configurable: true
                });
                AutomationUpdateObjectDialog.prototype.show = function () {
                    var _this = this;
                    if (this._automation && !this._targetObject) {
                        this._targetObject = this._automation.currentEditObject;
                        this._targetContainer = this._automation.activeContainer;
                    }
                    if (!this._targetObject) {
                        alert("No target object specified");
                        return;
                    }
                    if (!this._automation)
                        this.showProperties = false;
                    var numTabs = 0;
                    // Set up the properties page
                    var showProperties = this.showProperties;
                    var $propertiesTab = this.el.properties.tab;
                    $propertiesTab.toggle(showProperties);
                    $propertiesTab.parent().removeClass("dlg-tabs-0 dlg-tabs-1 dlg-tabs-2 dlg-tabs-3 dlg-tabs-4 dlg-tabs-5 dlg-tabs-plus");
                    var $propertiesPage = this.el.properties.page;
                    if (showProperties) {
                        numTabs++;
                        this._propertiesPage.automation = this._automation;
                        lt.Demos.Annotations.PropertiesPage.onPropertiesChanged = function () {
                            _this._automation.invalidate(lt.LeadRectD.empty);
                        };
                        this._propertiesPage.initialize();
                    }
                    // Set up the content page
                    var showContent = this.showContent;
                    var $contentTab = this.el.content.tab;
                    $contentTab.toggle(showContent);
                    var $contentPage = this.el.content.page;
                    if (showContent) {
                        numTabs++;
                        if (this._targetObject != null) {
                            var metadata = this._targetObject.metadata;
                            if (metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] != undefined || metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] != null) //if Contains
                                this._contentPage.contentText = this._targetObject.metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey];
                        }
                        this._contentPage.targetObject = this._targetObject;
                        this._contentPage.initialize();
                        this._contentPage.onContentChange = function () {
                            _this._reviewsPage.updateContent(_this.targetObject, _this.targetContainer);
                        };
                    }
                    // Set up the reviews page
                    var showReviews = this.showReviews;
                    var $reviewsTab = this.el.reviews.tab;
                    $reviewsTab.toggle(showReviews);
                    var $reviewsPage = this.el.reviews.page;
                    if (showReviews) {
                        numTabs++;
                        this._reviewsPage.userName = this._userName;
                        this._reviewsPage.initialize();
                        this._reviewsPage.copyReviewsFrom(this._targetObject, this._targetContainer);
                    }
                    // Add a class to specify the number of items for css styles
                    $propertiesTab.parent().addClass("dlg-tabs-" + numTabs);
                    // Designate one tab/page to be the selected one
                    var selectedClass = AutomationUpdateObjectDialog.selectedClass;
                    this.$allTabsAndPages.removeClass(selectedClass);
                    if (showProperties) {
                        $propertiesTab.addClass(selectedClass);
                        $propertiesPage.addClass(selectedClass);
                    }
                    else if (showContent) {
                        $contentTab.addClass(selectedClass);
                        $contentPage.addClass(selectedClass);
                    }
                    else if (showReviews) {
                        $reviewsTab.addClass(selectedClass);
                        $reviewsPage.addClass(selectedClass);
                    }
                    this.inner.show();
                };
                AutomationUpdateObjectDialog.selectedClass = "selected";
                return AutomationUpdateObjectDialog;
            }());
            Annotations.AutomationUpdateObjectDialog = AutomationUpdateObjectDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ContentPage = /** @class */ (function () {
                function ContentPage($propertiesPage) {
                    var _this = this;
                    this._ui = {
                        textArea: "#contentTextArea"
                    };
                    //private _outputDivId: string = "ContentPageDiv";
                    //public get outputDivId(): string { return this._outputDivId; }
                    //public set outputDivId(value: string) { this._outputDivId = value; }
                    this._targetObject = null;
                    this._contentText = "";
                    this.initialize = function () {
                        _this.empty();
                        //this.createUIElement();
                        var $textArea = $(_this._ui.textArea);
                        $textArea.off();
                        $textArea.on("keydown", function (e) {
                            e.stopPropagation();
                        });
                        $textArea.val(_this._contentText);
                        $textArea.change(function () {
                            _this._contentText = $textArea.val();
                            _this._targetObject.metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] = _this._contentText;
                            if (_this._onContentChange != null) {
                                _this._onContentChange();
                            }
                        });
                    };
                    this.empty = function () {
                        $(_this._ui.textArea).val("");
                        //document.getElementById(this._outputDivId).innerHTML = '';
                    };
                    this._pageElement = $propertiesPage;
                }
                Object.defineProperty(ContentPage.prototype, "targetObject", {
                    get: function () { return this._targetObject; },
                    set: function (value) {
                        if (this._targetObject != value) {
                            this._targetObject = value;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ContentPage.prototype, "onContentChange", {
                    // Events mutators
                    set: function (value) {
                        this._onContentChange = null;
                        this._onContentChange = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ContentPage.prototype, "contentText", {
                    get: function () { return this._contentText; },
                    set: function (value) { this._contentText = value; },
                    enumerable: false,
                    configurable: true
                });
                return ContentPage;
            }());
            Annotations.ContentPage = ContentPage;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var SolidBrushPage = /** @class */ (function () {
                function SolidBrushPage($solidBrushPage) {
                    this._solidBrush = null;
                    this._pageElement = $solidBrushPage;
                }
                Object.defineProperty(SolidBrushPage.prototype, "solidBrush", {
                    get: function () { return this._solidBrush; },
                    set: function (value) {
                        this._solidBrush = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                SolidBrushPage.prototype.initialize = function () {
                    var _this = this;
                    // Reset all our saved info
                    this.clear();
                    // Initialize solid brush
                    if (this._solidBrush == null) {
                        // Create hatch brush with default values 
                        this._solidBrush = lt.Annotations.Engine.AnnSolidColorBrush.create("transparent");
                    }
                    // Add solid brush UI
                    var $row0 = $(document.createElement("div")).addClass("dropdown").attr("title", "Brush Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Brush Color");
                    $row0.append($label);
                    // <select onchange=... > </select>
                    var $row1 = $(document.createElement("div")).addClass("dropdown").attr("title", "Brush Color");
                    var $select = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    $select.on("change", function () {
                        _this._solidBrush.color = $select.val();
                    });
                    $row1.append($select);
                    $row1.append($span);
                    var dropdownFields = ["Transparent", "Red", "Blue", "Green", "Yellow", "Black", "White"];
                    // Create the <option> elements
                    if (dropdownFields && dropdownFields.length) {
                        $select.append($(document.createElement("option")).val("Color").text("Color").attr("disabled", ""));
                        var defaultValue = this._solidBrush.color.toLowerCase();
                        dropdownFields.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            $select.append($option);
                        });
                    }
                    this._pageElement.append($row0);
                    this._pageElement.append($row1);
                };
                SolidBrushPage.prototype.clear = function () {
                    this._pageElement.empty();
                };
                return SolidBrushPage;
            }());
            Annotations.SolidBrushPage = SolidBrushPage;
            var HatchBrushPage = /** @class */ (function () {
                function HatchBrushPage($hatchBrushPage) {
                    this._hatchBrush = null;
                    this._pageElement = $hatchBrushPage;
                }
                Object.defineProperty(HatchBrushPage.prototype, "hatchBrush", {
                    get: function () { return this._hatchBrush; },
                    set: function (value) {
                        this._hatchBrush = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                HatchBrushPage.prototype.initialize = function () {
                    var _this = this;
                    // Reset all our saved info
                    this.clear();
                    // Initialize hatch brush
                    if (this._hatchBrush == null) {
                        // Create hatch brush with default values 
                        this._hatchBrush = new lt.Annotations.Engine.AnnHatchBrush();
                        this._hatchBrush.backgroundColor = "white";
                        this._hatchBrush.foregroundColor = "black";
                        this._hatchBrush.hatchStyle = 0; // horizontal
                    }
                    // Add hatch brush UI
                    // Background color
                    var $row0 = $(document.createElement("div")).addClass("dropdown").attr("title", "Background Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Background Color");
                    $row0.append($label);
                    // <select onchange=... > </select>
                    var $row1 = $(document.createElement("div")).addClass("dropdown").attr("title", "Background Color");
                    this.$_backgroundSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$_backgroundSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row1.append(this.$_backgroundSelect);
                    $row1.append($span);
                    this._colorsList = ["Transparent", "Red", "Blue", "Green", "Yellow", "Black", "White"];
                    // Create the <option> elements
                    if (this._colorsList && this._colorsList.length) {
                        this.$_backgroundSelect.append($(document.createElement("option")).val("Color").text("Color").attr("disabled", ""));
                        var defaultValue = this._hatchBrush.backgroundColor.toLowerCase();
                        ;
                        this._colorsList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$_backgroundSelect.append($option);
                        });
                    }
                    this._pageElement.append($row0);
                    this._pageElement.append($row1);
                    // Foreground color
                    var $row2 = $(document.createElement("div")).addClass("dropdown").attr("title", "Foreground Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Foreground Color");
                    $row2.append($label);
                    // <select onchange=... > </select>
                    var $row3 = $(document.createElement("div")).addClass("dropdown").attr("title", "Foreground Color");
                    this.$_foregroundSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$_foregroundSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row3.append(this.$_foregroundSelect);
                    $row3.append($span);
                    // Create the <option> elements
                    if (this._colorsList && this._colorsList.length) {
                        this.$_foregroundSelect.append($(document.createElement("option")).val("Color").text("Color").attr("disabled", ""));
                        defaultValue = this._hatchBrush.foregroundColor.toLowerCase();
                        this._colorsList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$_foregroundSelect.append($option);
                        });
                    }
                    this._pageElement.append($row2);
                    this._pageElement.append($row3);
                    // Hatch style
                    var $row4 = $(document.createElement("div")).addClass("dropdown").attr("title", "Hatch style");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Hatch style");
                    $row4.append($label);
                    // <select onchange=... > </select>
                    var $row5 = $(document.createElement("div")).addClass("dropdown").attr("title", "Hatch style");
                    this.$_hatchStyleSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$_hatchStyleSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row5.append(this.$_hatchStyleSelect);
                    $row5.append($span);
                    this._hatchStyleList = ["Horizontal", "Vertical", "ForwardDiagonal", "BackwardDiagonal", "Cross", "DiagonalCross"];
                    // Create the <option> elements
                    if (this._hatchStyleList && this._hatchStyleList.length) {
                        this.$_hatchStyleSelect.append($(document.createElement("option")).val("Style").text("Style").attr("disabled", ""));
                        var defaultValue = "horizontal";
                        if (this._hatchBrush.hatchStyle < 6) {
                            defaultValue = this._hatchStyleList[this._hatchBrush.hatchStyle].toLowerCase();
                        }
                        this._hatchStyleList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$_hatchStyleSelect.append($option);
                        });
                    }
                    this._pageElement.append($row4);
                    this._pageElement.append($row5);
                };
                HatchBrushPage.prototype.clear = function () {
                    this._pageElement.empty();
                };
                HatchBrushPage.prototype.updateBrush = function () {
                    this._hatchBrush.backgroundColor = this.$_backgroundSelect.val();
                    this._hatchBrush.foregroundColor = this.$_foregroundSelect.val();
                    this._hatchBrush.hatchStyle = this._hatchStyleList.indexOf(this.$_hatchStyleSelect.val());
                };
                return HatchBrushPage;
            }());
            Annotations.HatchBrushPage = HatchBrushPage;
            var LinearGradientBrushPage = /** @class */ (function () {
                function LinearGradientBrushPage($linearGradientPage) {
                    this._linearGradientBrush = null;
                    this._pageElement = $linearGradientPage;
                }
                Object.defineProperty(LinearGradientBrushPage.prototype, "linearGradientBrush", {
                    get: function () { return this._linearGradientBrush; },
                    set: function (value) {
                        this._linearGradientBrush = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                LinearGradientBrushPage.prototype.initialize = function () {
                    var _this = this;
                    // Reset all our saved info
                    this.clear();
                    // Initialize linear gradient brush
                    if (this._linearGradientBrush == null) {
                        this._linearGradientBrush = lt.Annotations.Engine.AnnLinearGradientBrush.create(lt.Annotations.Engine.AnnLinearGradientMode.horizontal);
                        var stop1 = new lt.Annotations.Engine.AnnGradientStop("red", 0.5);
                        var stop2 = new lt.Annotations.Engine.AnnGradientStop("blue", 1);
                        this._linearGradientBrush.gradientStops.add(stop1);
                        this._linearGradientBrush.gradientStops.add(stop2);
                    }
                    // Add linear gradient brush UI
                    var $row0 = $(document.createElement("div")).addClass("dropdown").attr("title", "Brush Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Brush Color");
                    $row0.append($label);
                    // <select onchange=... > </select>
                    var $row1 = $(document.createElement("div")).addClass("dropdown").attr("title", "Brush Color");
                    this.$_gradientModeSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$_gradientModeSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row1.append(this.$_gradientModeSelect);
                    $row1.append($span);
                    this._gradientModeList = ["Horizontal", "Vertical", "Diagonal"];
                    // Create the <option> elements
                    if (this._gradientModeList != null) {
                        this.$_gradientModeSelect.append($(document.createElement("option")).val("Gradient Mode").text("Gradient Mode").attr("disabled", ""));
                        var defaultValue = "horizontal";
                        if (this._linearGradientBrush.linearGradientMode < 3) {
                            defaultValue = this._gradientModeList[this._linearGradientBrush.linearGradientMode].toLowerCase();
                        }
                        this._gradientModeList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$_gradientModeSelect.append($option);
                        });
                    }
                    this._pageElement.append($row0);
                    this._pageElement.append($row1);
                    // First Stop color
                    var $row2 = $(document.createElement("div")).addClass("dropdown").attr("title", "First Stop Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("First Stop Color");
                    $row2.append($label);
                    // <select onchange=... > </select>
                    var $row3 = $(document.createElement("div")).addClass("dropdown").attr("title", "First Stop Color");
                    this.$stop1ColorSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$stop1ColorSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row3.append(this.$stop1ColorSelect);
                    $row3.append($span);
                    this._colorsList = ["Transparent", "Red", "Blue", "Green", "Yellow", "Black", "White"];
                    // Create the <option> elements
                    if (this._colorsList && this._colorsList.length) {
                        this.$stop1ColorSelect.append($(document.createElement("option")).val("First Stop Color").text("First Stop Color").attr("disabled", ""));
                        var defaultValue = "red";
                        if (this._linearGradientBrush.gradientStops.count > 0)
                            defaultValue = this._linearGradientBrush.gradientStops.get_item(0).color.toLowerCase();
                        this._colorsList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$stop1ColorSelect.append($option);
                        });
                    }
                    this._pageElement.append($row2);
                    this._pageElement.append($row3);
                    // First Stop offset 
                    var $row4 = $(document.createElement("div")).addClass("dropdown").attr("title", "First Stop Offset");
                    var $label = $(document.createElement("label")).addClass("input-label").text("First Stop Offset");
                    $row4.append($label);
                    var $row5 = $(document.createElement("div")).addClass("dropdown").attr("title", "First Stop Offset");
                    // <input type="number" value=... onchange=... />
                    this.$stop1OffsetInput = $(document.createElement("input"))
                        .attr({
                        type: "text",
                        value: ""
                    });
                    if (this._linearGradientBrush.gradientStops.count > 0) {
                        this.$stop1OffsetInput.attr("value", this._linearGradientBrush.gradientStops.get_item(0).offset);
                    }
                    this.$stop1OffsetInput.on("change", function () {
                        _this.updateBrush();
                    });
                    $row5.append(this.$stop1OffsetInput);
                    this._pageElement.append($row4);
                    this._pageElement.append($row5);
                    // Second Stop color
                    var $row6 = $(document.createElement("div")).addClass("dropdown").attr("title", "Second Stop Color");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Second Stop Color");
                    $row6.append($label);
                    // <select onchange=... > </select>
                    var $row7 = $(document.createElement("div")).addClass("dropdown").attr("title", "Second Stop Color");
                    this.$stop2ColorSelect = $(document.createElement("select")).addClass("dropdown-button");
                    var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                    this.$stop2ColorSelect.on("change", function () {
                        _this.updateBrush();
                    });
                    $row7.append(this.$stop2ColorSelect);
                    $row7.append($span);
                    // Create the <option> elements
                    if (this._colorsList && this._colorsList.length) {
                        this.$stop2ColorSelect.append($(document.createElement("option")).val("Second Stop Color").text("Second Stop Color").attr("disabled", ""));
                        var defaultValue = "red";
                        if (this._linearGradientBrush.gradientStops.count > 1)
                            defaultValue = this._linearGradientBrush.gradientStops.get_item(1).color.toLowerCase();
                        this._colorsList.forEach(function (value) {
                            var $option = $(document.createElement("option")).val(value).text(value);
                            // Mark the default as selected
                            if (defaultValue === value.toLowerCase())
                                $option.attr("selected", "");
                            _this.$stop2ColorSelect.append($option);
                        });
                    }
                    this._pageElement.append($row6);
                    this._pageElement.append($row7);
                    // Second Stop offset 
                    var $row8 = $(document.createElement("div")).addClass("dropdown").attr("title", "Second Stop Offset");
                    var $label = $(document.createElement("label")).addClass("input-label").text("Second Stop Offset");
                    $row8.append($label);
                    var $row9 = $(document.createElement("div")).addClass("dropdown").attr("title", "Second Stop Offset");
                    // <input type="number" value=... onchange=... />
                    this.$stop2OffsetInput = $(document.createElement("input"))
                        .attr({
                        type: "text",
                        value: ""
                    });
                    if (this._linearGradientBrush.gradientStops.count > 1) {
                        this.$stop2OffsetInput.attr("value", this._linearGradientBrush.gradientStops.get_item(1).offset);
                    }
                    this.$stop2OffsetInput.on("change", function () {
                        _this.updateBrush();
                    });
                    $row9.append(this.$stop2OffsetInput);
                    this._pageElement.append($row8);
                    this._pageElement.append($row9);
                };
                LinearGradientBrushPage.prototype.clear = function () {
                    this._pageElement.empty();
                };
                LinearGradientBrushPage.prototype.updateBrush = function () {
                    this._linearGradientBrush.linearGradientMode = this._gradientModeList.indexOf(this.$_gradientModeSelect.val());
                    if (this._linearGradientBrush.gradientStops.count > 0) {
                        this._linearGradientBrush.gradientStops.get_item(0).color = this.$stop1ColorSelect.val();
                        this._linearGradientBrush.gradientStops.get_item(0).offset = this.$stop1OffsetInput.val();
                    }
                    if (this._linearGradientBrush.gradientStops.count > 1) {
                        this._linearGradientBrush.gradientStops.get_item(1).color = this.$stop2ColorSelect.val();
                        this._linearGradientBrush.gradientStops.get_item(1).offset = this.$stop2OffsetInput.val();
                    }
                };
                return LinearGradientBrushPage;
            }());
            Annotations.LinearGradientBrushPage = LinearGradientBrushPage;
            var BrushDialog = /** @class */ (function () {
                function BrushDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._allEditors = null;
                    this._brush = null;
                    this._solidBrush = null;
                    this._hatchBrush = null;
                    this._linearGradientBrush = null;
                    this.$allTabsAndPages = null;
                    // Rub when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        for (var i = 0; i < _this._allEditors.length; i++) {
                            var brushEditor = _this._allEditors[i];
                            if (brushEditor != null) {
                                if (_this._solidBrush != null) {
                                    brushEditor.annBrush = _this._solidBrushPage.solidBrush;
                                }
                                else if (_this._hatchBrush != null) {
                                    brushEditor.annBrush = _this._hatchBrushPage.hatchBrush;
                                }
                                else if (_this._linearGradientBrush != null) {
                                    brushEditor.annBrush = _this._linearGradientBrushPage.linearGradientBrush;
                                }
                            }
                        }
                        if (_this.onHide)
                            _this.onHide();
                        _this.inner.hide();
                    };
                    this.el = lt.Demos.Utils.findSelectorsInRoot(root, selectors);
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    this._solidBrushPage = new lt.Demos.Annotations.SolidBrushPage(this.el.solidBrush.page);
                    this._hatchBrushPage = new lt.Demos.Annotations.HatchBrushPage(this.el.hatchBrush.page);
                    this._linearGradientBrushPage = new lt.Demos.Annotations.LinearGradientBrushPage(this.el.linearGradientBrush.page);
                    // Set up the click handlers between the tabs one time, regardless of visibility
                    var selectedClass = BrushDialog.selectedClass;
                    this.$allTabsAndPages = this.el.solidBrush.tab.add(this.el.solidBrush.page).add(this.el.hatchBrush.tab).add(this.el.hatchBrush.page).add(this.el.linearGradientBrush.tab).add(this.el.linearGradientBrush.page);
                    this.$allTabsAndPages.removeClass(selectedClass);
                    var targets = [
                        [this.el.solidBrush.tab, this.el.solidBrush.page],
                        [this.el.hatchBrush.tab, this.el.hatchBrush.page],
                        [this.el.linearGradientBrush.tab, this.el.linearGradientBrush.page]
                    ];
                    targets.forEach(function (target) {
                        var $tab = target[0];
                        var $page = target[1];
                        $tab.on("click", function () {
                            if (!$tab.hasClass(selectedClass)) {
                                _this.$allTabsAndPages.removeClass(selectedClass);
                                $tab.addClass(selectedClass);
                                $page.addClass(selectedClass);
                                if ($tab.attr('id') == "brushDlg_solidBrushTab") {
                                    _this._solidBrush = _this._solidBrushPage.solidBrush;
                                    _this._hatchBrush = null;
                                    _this._linearGradientBrush = null;
                                }
                                else if ($tab.attr('id') == "brushDlg_hatchBrushTab") {
                                    _this._hatchBrush = _this._hatchBrushPage.hatchBrush;
                                    _this._solidBrush = null;
                                    _this._linearGradientBrush = null;
                                }
                                else if ($tab.attr('id') == "brushDlg_linearGradientBrushTab") {
                                    _this._hatchBrush = null;
                                    _this._solidBrush = null;
                                    _this._linearGradientBrush = _this._linearGradientBrushPage.linearGradientBrush;
                                }
                            }
                        });
                    });
                }
                Object.defineProperty(BrushDialog.prototype, "allEditors", {
                    get: function () { return this._allEditors; },
                    set: function (value) {
                        this._allEditors = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BrushDialog.prototype, "brush", {
                    get: function () { return this._brush; },
                    set: function (value) {
                        this._brush = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                BrushDialog.prototype.show = function () {
                    // Set up the solid brush page
                    var $solidBrushTab = this.el.solidBrush.tab;
                    var $solidBrushPage = this.el.solidBrush.page;
                    if (this._brush instanceof lt.Annotations.Engine.AnnSolidColorBrush)
                        this._solidBrushPage.solidBrush = this._brush;
                    this._solidBrushPage.initialize();
                    // Set up the hatch brush page
                    var $hatchBrushTab = this.el.hatchBrush.tab;
                    var $hatchBrushPage = this.el.hatchBrush.page;
                    if (this._brush instanceof lt.Annotations.Engine.AnnHatchBrush)
                        this._hatchBrushPage.hatchBrush = this._brush;
                    this._hatchBrushPage.initialize();
                    // Set up the linear gradient brush page
                    var $linearGradientBrushTab = this.el.linearGradientBrush.tab;
                    var $linearGradientBrushPage = this.el.linearGradientBrush.page;
                    if (this._brush instanceof lt.Annotations.Engine.AnnLinearGradientBrush)
                        this._linearGradientBrushPage.linearGradientBrush = this._brush;
                    this._linearGradientBrushPage.initialize();
                    // Add a class to specify the number of items for css styles
                    $solidBrushTab.parent().addClass("dlg-tabs-3");
                    // Designate brush type tab based on object current brush type
                    var selectedClass = BrushDialog.selectedClass;
                    this.$allTabsAndPages.removeClass(selectedClass);
                    if (this._brush instanceof lt.Annotations.Engine.AnnSolidColorBrush) {
                        $solidBrushTab.addClass(selectedClass);
                        $solidBrushPage.addClass(selectedClass);
                    }
                    else if (this._brush instanceof lt.Annotations.Engine.AnnHatchBrush) {
                        $hatchBrushTab.addClass(selectedClass);
                        $hatchBrushPage.addClass(selectedClass);
                    }
                    else if (this._brush instanceof lt.Annotations.Engine.AnnLinearGradientBrush) {
                        $linearGradientBrushTab.addClass(selectedClass);
                        $linearGradientBrushPage.addClass(selectedClass);
                    }
                    this.inner.show();
                };
                BrushDialog.selectedClass = "selected";
                return BrushDialog;
            }());
            Annotations.BrushDialog = BrushDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var RichTextDialog = /** @class */ (function () {
                function RichTextDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._password = "";
                    // Run when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        if (_this.onHide)
                            _this.onHide();
                        _this.inner.hide();
                    };
                    this.el = {
                        editor: root.find(selectors.editor),
                        hide: root.find(selectors.hide)
                    };
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    var editor = this.el.editor;
                    this._richTextEditor = editor.get(0);
                    // Create the view
                    if (lt.LTHelper.device === lt.LTDevice.mobile || lt.LTHelper.device === lt.LTDevice.tablet) {
                        if (editor["jqte"])
                            editor.jqte({ title: false });
                    }
                    else {
                        if (editor["jqte"])
                            editor.jqte();
                    }
                }
                Object.defineProperty(RichTextDialog.prototype, "richTextEditor", {
                    get: function () {
                        return this._richTextEditor;
                    },
                    enumerable: false,
                    configurable: true
                });
                RichTextDialog.prototype.show = function () {
                    this.inner.show();
                };
                return RichTextDialog;
            }());
            Annotations.RichTextDialog = RichTextDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ListTreeNode = /** @class */ (function () {
                function ListTreeNode() {
                    // Handle long touch on the thumbnails container
                    this._isTouchHold = false;
                    this._currentTouchPoint = null;
                    this._touchMoveTolerance = 20;
                    this._isExpanded = false;
                }
                Object.defineProperty(ListTreeNode.prototype, "childNodes", {
                    get: function () {
                        return this._childNodes;
                    },
                    set: function (value) {
                        this._childNodes = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "isExpanded", {
                    get: function () {
                        return this._isExpanded;
                    },
                    set: function (value) {
                        this._isExpanded = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "parentDiv", {
                    get: function () {
                        return this._parentDiv;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "headingDiv", {
                    get: function () {
                        return this._headingDiv;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "headingLabel", {
                    get: function () {
                        return this._headingLabel;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "collapseExpandBtn", {
                    get: function () {
                        return this._collapseExpandBtn;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "contentDiv", {
                    get: function () {
                        return this._contentDiv;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "contextMenu", {
                    set: function (value) {
                        this._contextMenu = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ListTreeNode.prototype, "contextMenu_collapseExpandBtn", {
                    set: function (value) {
                        this._contextMenu_collapseExpandBtn = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                ListTreeNode.prototype.createTreeNode = function () {
                    var _this = this;
                    // Create parent div
                    this._parentDiv = document.createElement("div");
                    lt.LTHelper.addClass(this._parentDiv, "panel");
                    lt.LTHelper.addClass(this._parentDiv, "panel-default");
                    // Create heading div
                    this._headingDiv = document.createElement("div");
                    lt.LTHelper.addClass(this._headingDiv, "panel-heading");
                    // Create anchor element as button, to collapse and expand the content div 
                    this._collapseExpandBtn = document.createElement("a");
                    lt.LTHelper.addClass(this._collapseExpandBtn, "accordion-toggle");
                    this._collapseExpandBtn.setAttribute("data-toggle", "collapse");
                    // Handle click event
                    this._collapseExpandBtn.onclick = function (e) { return _this.collapseExpandBtn_Click(e); };
                    // Create heading label
                    this._headingLabel = document.createElement("label");
                    lt.LTHelper.addClass(this._headingLabel, "collapse-expand");
                    lt.LTHelper.addClass(this._headingLabel, "toggleToExpand");
                    // Create content div
                    this._contentDiv = document.createElement("div");
                    lt.LTHelper.addClass(this._contentDiv, "panel-collapse");
                    lt.LTHelper.addClass(this._contentDiv, "collapse");
                    // Append to parent
                    this._collapseExpandBtn.appendChild(this._headingLabel);
                    this._headingDiv.appendChild(this._collapseExpandBtn);
                    this._parentDiv.appendChild(this._headingDiv);
                    this._parentDiv.appendChild(this._contentDiv);
                    if (this._contextMenu) {
                        if (lt.LTHelper.supportsTouch) {
                            this._headingDiv.addEventListener("touchstart", function (e) { return _this.touchstart(e); }, false);
                            this._headingDiv.addEventListener("touchmove", function (e) { return _this.touchmove(e); }, false);
                            this._headingDiv.addEventListener("touchend", function (e) { return _this.touchend(e); }, false);
                        }
                        else {
                            // For desktop device , handle context menu event
                            $(this._headingDiv).bind("contextmenu", $.proxy(this.contextmenu, this));
                        }
                        $(document).bind("click", $.proxy(this.hideContextMenu, this));
                    }
                    this.updateNodeExpansion();
                };
                ListTreeNode.prototype.clearContent = function () {
                    while (this._contentDiv.firstChild) {
                        this._contentDiv.removeChild(this._contentDiv.firstChild);
                    }
                };
                ListTreeNode.prototype.collapseExpandBtn_Click = function (e) {
                    this._isExpanded = !this._isExpanded;
                    this.updateNodeExpansion();
                    this.updateObjectInfoVisibility();
                };
                ListTreeNode.prototype.updateNodeExpansion = function () {
                    if (this._isExpanded) {
                        lt.LTHelper.removeClass(this._headingLabel, "toggleToExpand");
                        lt.LTHelper.addClass(this._headingLabel, "toggleToCollapse");
                        lt.LTHelper.removeClass(this._collapseExpandBtn, "collapsed");
                        lt.LTHelper.addClass(this._contentDiv, "in");
                    }
                    else {
                        lt.LTHelper.removeClass(this._headingLabel, "toggleToCollapse");
                        lt.LTHelper.addClass(this._headingLabel, "toggleToExpand");
                        lt.LTHelper.addClass(this._collapseExpandBtn, "collapsed");
                        lt.LTHelper.removeClass(this._contentDiv, "in");
                    }
                };
                ListTreeNode.prototype.updateObjectInfoVisibility = function () {
                    var objectInfoContainerDiv = this._headingDiv.getElementsByClassName("objectInfoContainer").item(0);
                    if (objectInfoContainerDiv) {
                        var objectNameLabel = objectInfoContainerDiv.getElementsByClassName("objectName").item(0);
                        objectNameLabel.style.visibility = this.isExpanded ? "visible" : "hidden";
                        var dateTimeLabel = objectInfoContainerDiv.getElementsByClassName("dateTime").item(0);
                        dateTimeLabel.style.visibility = this.isExpanded ? "visible" : "hidden";
                    }
                };
                ListTreeNode.prototype.showContextMenu = function (point) {
                    var _this = this;
                    this.onShowContextMenu();
                    this._contextMenu_collapseExpandBtn.children[0].textContent = this._isExpanded ? "Collapse" : "Expand";
                    this._contextMenu_collapseExpandBtn.onclick = null;
                    this._contextMenu_collapseExpandBtn.onclick = function (e) { return _this.contextMenu_collapseExpandBtn_Click(e); };
                    // Hide all menus
                    var menus = $(".dropup.clearfix");
                    menus.css("display", "none");
                    // Show node menu
                    if (point != null) {
                        $(this._contextMenu).css({
                            display: "block",
                            left: point.x,
                            top: point.y
                        });
                    }
                };
                // Abstract method
                ListTreeNode.prototype.onShowContextMenu = function () { };
                ListTreeNode.prototype.contextMenu_collapseExpandBtn_Click = function (e) {
                    this._isExpanded = !this._isExpanded;
                    this.updateNodeExpansion();
                    this.updateObjectInfoVisibility();
                };
                ListTreeNode.prototype.hideContextMenu = function (e) {
                    $(this._contextMenu).hide();
                };
                ListTreeNode.prototype.contextmenu = function (e) {
                    e.preventDefault();
                    var point = lt.LeadPointD.create(e.pageX, e.pageY);
                    this.showContextMenu(point);
                };
                ListTreeNode.prototype.touchstart = function (e) {
                    var _this = this;
                    this._isTouchHold = true;
                    this._currentTouchPoint = lt.LeadPointD.create(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
                    this._touchHoldTimeOutHandler = window.setTimeout(function () {
                        if (_this._isTouchHold) {
                            _this.showContextMenu(_this._currentTouchPoint);
                        }
                    }, 500);
                };
                ListTreeNode.prototype.touchmove = function (e) {
                    var hasShownMenu = $("#annTreeNodeContextMenu").css("display") == "block" || $("#annReviewNodeContextMenu").css("display") == "block";
                    if (hasShownMenu)
                        e.preventDefault();
                    var point = lt.LeadPointD.create(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
                    var dx = point.x - this._currentTouchPoint.x;
                    var dy = point.y - this._currentTouchPoint.y;
                    // +20 / -20 move tolerance
                    if (dx > this._touchMoveTolerance || dx < -(this._touchMoveTolerance) || dy > this._touchMoveTolerance || dy < -(this._touchMoveTolerance)) {
                        window.clearTimeout(this._touchHoldTimeOutHandler);
                        this._isTouchHold = false;
                    }
                };
                ListTreeNode.prototype.touchend = function (e) {
                    window.clearTimeout(this._touchHoldTimeOutHandler);
                    this._isTouchHold = false;
                };
                return ListTreeNode;
            }());
            Annotations.ListTreeNode = ListTreeNode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="./ListTreeNode.ts" />
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AnnObjectTreeNode = /** @class */ (function (_super) {
                __extends(AnnObjectTreeNode, _super);
                function AnnObjectTreeNode(owner, automation, imageViewer, annContainer, annObject) {
                    var _this = _super.call(this) || this;
                    /* When we select a node, we want to select the annotation in the view as well.
                     * But then when we select the annotation in the view, we also want to select the node.
                     * To stop the (node => view => node) issue, check this property.
                     */
                    _this._doFocusOnSelectedNode = true;
                    if (!automation)
                        throw new Error("automation cannot be null");
                    if (!imageViewer)
                        throw new Error("imageViewer cannot be null");
                    if (!annContainer)
                        throw new Error("annContainer cannot be null");
                    if (!annObject)
                        throw new Error("annObject cannot be null");
                    if (annObject.id == lt.Annotations.Engine.AnnObject.selectObjectId || annObject.id == lt.Annotations.Engine.AnnObject.none)
                        throw new Error("Cannot create this item with a selection or none annotation object");
                    _this._owner = owner;
                    _this._automation = automation;
                    _this._imageViewer = imageViewer;
                    _this._annContainer = annContainer;
                    _this._annObject = annObject;
                    _this.contextMenu = document.getElementById("annTreeNodeContextMenu");
                    _this.contextMenu_collapseExpandBtn = document.getElementById("annTreeNodeContextMenu_collapseExpand");
                    _this._contextMenu_replyBtn = document.getElementById("annTreeNodeContextMenu_reply");
                    _this._contextMenu_deleteBtn = document.getElementById("annTreeNodeContextMenu_delete");
                    _this._contextMenu_propertiesBtn = document.getElementById("annTreeNodeContextMenu_properties");
                    _this.childNodes = [];
                    _this.createTreeNode();
                    _this.customizeTreeNode();
                    _this.updateContent();
                    _this.hookEvents();
                    return _this;
                }
                Object.defineProperty(AnnObjectTreeNode.prototype, "annObject", {
                    get: function () {
                        return this._annObject;
                    },
                    enumerable: false,
                    configurable: true
                });
                AnnObjectTreeNode.createContextMenu = function () {
                    // Create menu as HTML
                    var menuHtml = "";
                    menuHtml += "<div id='annTreeNodeContextMenu' class='dropup clearfix' tabindex='-1' style='display:none;'>";
                    menuHtml += "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='display:block;margin-bottom:5px;'>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annTreeNodeContextMenu_collapseExpand' class='menuItem'>";
                    menuHtml += "<span class='text'></span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annTreeNodeContextMenu_reply' class='menuItem'>";
                    menuHtml += "<span class='text'>Reply</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annTreeNodeContextMenu_delete' class='menuItem'>";
                    menuHtml += "<span class='text'>Delete</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annTreeNodeContextMenu_properties' class='menuItem'>";
                    menuHtml += "<span class='text'>Properties</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "</ul>";
                    menuHtml += "</div>";
                    // Create menu as element and append it to demo body
                    var contextMenu = document.createElement("div");
                    contextMenu.innerHTML = menuHtml;
                    document.body.appendChild(contextMenu);
                };
                AnnObjectTreeNode.prototype.customizeTreeNode = function () {
                    lt.LTHelper.addClass(this.parentDiv, "object-panel");
                    // Span to view annotation object image
                    var labelSpan = document.createElement("span");
                    lt.LTHelper.addClass(labelSpan, "annObjectImage");
                    this.headingDiv.appendChild(labelSpan);
                    // Object info
                    var objectInfoContainerDiv = document.createElement("div");
                    lt.LTHelper.addClass(objectInfoContainerDiv, "objectInfoContainer");
                    this.headingDiv.appendChild(objectInfoContainerDiv);
                    var userNameLabel = document.createElement("label");
                    lt.LTHelper.addClass(userNameLabel, "userName");
                    var objectNameLabel = document.createElement("label");
                    lt.LTHelper.addClass(objectNameLabel, "objectName");
                    objectNameLabel.style.visibility = "hidden";
                    var dateTimeLabel = document.createElement("label");
                    lt.LTHelper.addClass(dateTimeLabel, "dateTime");
                    dateTimeLabel.style.visibility = "hidden";
                    objectInfoContainerDiv.appendChild(userNameLabel);
                    objectInfoContainerDiv.appendChild(objectNameLabel);
                    objectInfoContainerDiv.appendChild(dateTimeLabel);
                    // Update object info
                    var annAutomationObject = this._automation.manager.findObjectById(this._annObject.id);
                    if (annAutomationObject != null) {
                        objectNameLabel.textContent = annAutomationObject.name;
                        labelSpan.style.backgroundImage = "url(" + annAutomationObject.toolBarImage + ")";
                    }
                    else {
                        objectNameLabel.textContent = this._annObject.friendlyName;
                        labelSpan.style.backgroundImage = null;
                    }
                    this.updateMetadata();
                    // Text input, to update annotation object content (if not text object)
                    if (!lt.Annotations.Engine.AnnTextObject.isInstanceOfType(this._annObject)) {
                        var textareaContainerDiv = document.createElement("div");
                        lt.LTHelper.addClass(textareaContainerDiv, "textareaContainer");
                        this._contentTextArea = document.createElement("textarea");
                        this._contentTextArea.disabled = !this._annContainer.isEnabled;
                        this._contentTextArea.setAttribute("rows", "2");
                        textareaContainerDiv.appendChild(this._contentTextArea);
                        this._contentTextArea.textContent = this._annObject.metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey];
                        // append info labels and content text input to the heading div
                        this.headingDiv.appendChild(textareaContainerDiv);
                    }
                };
                AnnObjectTreeNode.toLocalTimeString = function (utcString) {
                    if (!utcString || utcString.length == 0)
                        return null;
                    try {
                        var date = new Date(utcString);
                        var localTimeString = date.toLocaleString();
                        return localTimeString;
                    }
                    catch (_a) {
                        return null;
                    }
                };
                AnnObjectTreeNode.prototype.updateMetadata = function () {
                    var userNameLabel = this.headingDiv.getElementsByClassName("userName")[0];
                    var dateTimeLabel = this.headingDiv.getElementsByClassName("dateTime")[0];
                    if (this._annObject.metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey] != null && this._annObject.metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey] != "") {
                        userNameLabel.textContent = this._annObject.metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey];
                    }
                    else {
                        userNameLabel.textContent = "[Author]";
                    }
                    if (this._annObject.metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey] != null && this._annObject.metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey] != "") {
                        dateTimeLabel.textContent = AnnObjectTreeNode.toLocalTimeString(this._annObject.metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey]);
                    }
                    else {
                        dateTimeLabel.textContent = "[Date]";
                    }
                };
                AnnObjectTreeNode.prototype.updateContent = function () {
                    if (this._annObject.reviews.length > 0) {
                        for (var i = 0; i < this._annObject.reviews.length; i++) {
                            var annReview = this._annObject.reviews[i];
                            var reviewNode = this.childNodes.filter(function (node) { return (node.annReview == annReview); })[0];
                            if (reviewNode) {
                                reviewNode.clearContent();
                                this.contentDiv.appendChild(reviewNode.parentDiv);
                                reviewNode.updateContent();
                            }
                            else {
                                reviewNode = new Annotations.ReviewTreeNode(this._automation, this._annObject, this._annContainer, this._annObject.reviews[i], this);
                                this.childNodes.push(reviewNode);
                                this.contentDiv.appendChild(reviewNode.parentDiv);
                                reviewNode.updateContent();
                            }
                        }
                    }
                };
                AnnObjectTreeNode.prototype.hookEvents = function () {
                    var _this = this;
                    this.parentDiv.onmousedown = function (e) { return _this.parentDiv_MouseDown(e); };
                    if (!lt.Annotations.Engine.AnnTextObject.isInstanceOfType(this._annObject))
                        this._contentTextArea.onchange = function (e) { return _this.contentTextArea_Change(e); };
                };
                AnnObjectTreeNode.prototype.parentDiv_MouseDown = function (e) {
                    if (e.button !== 1 && this._annContainer.isEnabled) {
                        this._automation.activeContainer = this._annContainer;
                        // Select the object, but don't trigger a re-selection of the node
                        var previousSelectNode = this._doFocusOnSelectedNode;
                        this._doFocusOnSelectedNode = false;
                        this._automation.selectObject(this._annObject);
                        this._doFocusOnSelectedNode = previousSelectNode;
                        if (e.target === this.headingDiv || this.headingDiv.contains(e.target)) {
                            this.selectNode(true);
                        }
                    }
                    e.stopPropagation();
                };
                AnnObjectTreeNode.prototype.contentTextArea_Change = function (e) {
                    var hasChanged = false;
                    var metadata = this._annObject.metadata;
                    if (metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] || metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] === "") {
                        var newVal = this._contentTextArea.value || "";
                        var oldVal = metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] || "";
                        if (newVal.toLowerCase() !== oldVal.toLowerCase()) {
                            metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] = newVal;
                            hasChanged = true;
                        }
                    }
                    if (hasChanged && this._owner && this._automation) {
                        var modifiedObjects = new lt.Annotations.Engine.AnnObjectCollection();
                        modifiedObjects.add(this._annObject);
                        this._owner.beginIgnoreChanged();
                        try {
                            this._automation.invokeAfterObjectChanged(modifiedObjects, lt.Annotations.Automation.AnnObjectChangedType.metadata);
                        }
                        finally {
                            this._owner.endIgnoreChanged();
                        }
                    }
                };
                AnnObjectTreeNode.prototype.selectNode = function (selectState) {
                    this._selectNodeWithFocus(selectState, this._doFocusOnSelectedNode);
                };
                AnnObjectTreeNode.prototype._selectNodeWithFocus = function (selectState, focusOnSelect) {
                    var _this = this;
                    if (selectState) {
                        lt.LTHelper.addClass(this.headingDiv, "selected");
                        if (this._contentTextArea && !this._contentTextArea.disabled && focusOnSelect) {
                            window.setTimeout(function () {
                                _this._contentTextArea.focus();
                            }, 0);
                        }
                    }
                    else {
                        lt.LTHelper.removeClass(this.headingDiv, "selected");
                    }
                };
                AnnObjectTreeNode.prototype.onShowContextMenu = function () {
                    var _this = this;
                    if (this._automation.activeContainer !== this._annContainer || !this._annContainer.isEnabled) {
                        // Our container is disabled
                        this._contextMenu_deleteBtn.disabled = true;
                        this._contextMenu_propertiesBtn.disabled = true;
                        this._contextMenu_replyBtn.disabled = true;
                        return;
                    }
                    this._contextMenu_deleteBtn.disabled = !this._automation.canDeleteObjects;
                    this._contextMenu_deleteBtn.onclick = function (e) { return _this.contextMenu_deleteBtn_Click(e); };
                    this._contextMenu_propertiesBtn.disabled = !this._automation.canShowObjectProperties;
                    this._contextMenu_propertiesBtn.onclick = function (e) { return _this.contextMenu_propertiesBtn_Click(e); };
                    this._contextMenu_replyBtn.disabled = !this._automation.canShowObjectContextMenu;
                    this._contextMenu_replyBtn.onclick = function (e) { return _this.contextMenu_replyBtn_Click(e); };
                };
                AnnObjectTreeNode.prototype.contextMenu_replyBtn_Click = function (e) {
                    var review = new lt.Annotations.Engine.AnnReview();
                    review.author = Annotations.AutomationObjectsListControl.userName;
                    review.date = new Date();
                    review.status = lt.Annotations.Engine.AnnReview.reply;
                    this._annObject.reviews.push(review);
                    var reviewNode = new Annotations.ReviewTreeNode(this._automation, this._annObject, this._annContainer, review, this);
                    this.childNodes.push(reviewNode);
                    this.contentDiv.appendChild(reviewNode.parentDiv);
                    reviewNode.updateContent();
                    this.isExpanded = true;
                    this.updateNodeExpansion();
                    this.updateObjectInfoVisibility();
                };
                AnnObjectTreeNode.prototype.contextMenu_deleteBtn_Click = function (e) {
                    this._automation.deleteSelectedObjects();
                };
                AnnObjectTreeNode.prototype.contextMenu_propertiesBtn_Click = function (e) {
                    if (this._automation != null && this._automation.canShowObjectProperties)
                        this._automation.showObjectProperties();
                };
                return AnnObjectTreeNode;
            }(Annotations.ListTreeNode));
            Annotations.AnnObjectTreeNode = AnnObjectTreeNode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationObjectsListControl = /** @class */ (function () {
                function AutomationObjectsListControl() {
                    this._ignoreChangedCounter = 0;
                    this._pages = [];
                    Annotations.ReviewTreeNode.createContextMenu();
                    Annotations.AnnObjectTreeNode.createContextMenu();
                }
                Object.defineProperty(AutomationObjectsListControl.prototype, "automation", {
                    get: function () {
                        return this._automation;
                    },
                    set: function (value) {
                        if (this._automation != value) {
                            if (this._automation != null) {
                                this.hookEvents(false);
                                this._pages = [];
                            }
                        }
                        this._automation = value;
                        if (this._automation != null)
                            this.hookEvents(true);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationObjectsListControl.prototype, "imageViewer", {
                    get: function () {
                        return this._imageViewer;
                    },
                    set: function (value) {
                        this._imageViewer = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationObjectsListControl.prototype, "listContainerDiv", {
                    get: function () {
                        return this._listContainerDiv;
                    },
                    set: function (value) {
                        this._listContainerDiv = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                AutomationObjectsListControl.prototype.hookEvents = function (hook) {
                    var _this = this;
                    if (hook) {
                        this._automation_AfterObjectChanged = this._automation.afterObjectChanged.add(function (sender, e) { return _this.automation_AfterObjectChanged(sender, e); });
                        this._automationContainers_CollectionChanged = this._automation.containers.collectionChanged.add(function (sender, e) { return _this.automationContainers_CollectionChanged(sender, e); });
                        this._automation_CurrentDesignerChanged = this._automation.currentDesignerChanged.add(function (sender, e) { return _this.automation_CurrentDesignerChanged(sender, e); });
                        this._automation_AfterUndoRedo = this._automation.afterUndoRedo.add(function (sender, e) { return _this.automation_AfterUndoRedo(sender, e); });
                    }
                    else {
                        this._automation.afterObjectChanged.remove(this._automation_AfterObjectChanged);
                        this._automation.containers.collectionChanged.remove(this._automationContainers_CollectionChanged);
                        this._automation.currentDesignerChanged.remove(this._automation_CurrentDesignerChanged);
                        this._automation.afterUndoRedo.remove(this._automation_AfterUndoRedo);
                    }
                };
                AutomationObjectsListControl.prototype.automationContainers_CollectionChanged = function (sender, e) {
                    this.populate();
                };
                AutomationObjectsListControl.prototype.automation_AfterUndoRedo = function (sender, e) {
                    this.populate();
                };
                AutomationObjectsListControl.prototype.beginIgnoreChanged = function () {
                    this._ignoreChangedCounter++;
                };
                AutomationObjectsListControl.prototype.endIgnoreChanged = function () {
                    this._ignoreChangedCounter--;
                };
                AutomationObjectsListControl.prototype.automation_AfterObjectChanged = function (sender, e) {
                    if (this._ignoreChangedCounter > 0)
                        return;
                    switch (e.changeType) {
                        case lt.Annotations.Automation.AnnObjectChangedType.added:
                        case lt.Annotations.Automation.AnnObjectChangedType.designerDraw:
                        case lt.Annotations.Automation.AnnObjectChangedType.deleted:
                        case lt.Annotations.Automation.AnnObjectChangedType.modified:
                        case lt.Annotations.Automation.AnnObjectChangedType.metadata:
                            this.populateContainer(this._automation.activeContainer);
                            break;
                        case lt.Annotations.Automation.AnnObjectChangedType.designerEdit:
                            this.updateAllMetadata();
                            break;
                        default:
                            break;
                    }
                };
                AutomationObjectsListControl.prototype.updateAllMetadata = function () {
                    var editObject = this._automation.currentEditObject;
                    if (editObject != null) {
                        var selectedItems = this.getSelectedItems(false);
                        if (selectedItems != null) {
                            for (var i = 0; i < selectedItems.length; i++) {
                                selectedItems[i].updateMetadata();
                            }
                        }
                    }
                };
                AutomationObjectsListControl.prototype.automation_CurrentDesignerChanged = function (sender, e) {
                    this.updateSelection();
                };
                AutomationObjectsListControl.prototype.updateSelection = function () {
                    var editObject = this._automation.currentEditObject;
                    if (editObject != null) {
                        this.getSelectedItems(true);
                    }
                    else {
                        // Clear selection 
                        $(".object-panel>.panel-heading").removeClass("selected");
                    }
                };
                AutomationObjectsListControl.prototype.getSelectedItems = function (autoSelectItems) {
                    var editObject = this._automation.currentEditObject;
                    if (editObject == null) {
                        return null;
                    }
                    var selectedItems = [];
                    var selectionObject = null;
                    if (lt.Annotations.Engine.AnnSelectionObject.isInstanceOfType(editObject)) {
                        selectionObject = editObject;
                    }
                    for (var i = 0; i < this._pages.length; i++) {
                        if (this._pages[i].annContainer !== this._automation.activeContainer)
                            continue;
                        var annObjectNodes = this._pages[i].childNodes;
                        for (var j = 0; j < annObjectNodes.length; j++) {
                            var annObjectNode = annObjectNodes[j];
                            if (selectionObject == null) {
                                if (annObjectNode.annObject === editObject) {
                                    selectedItems.push(annObjectNode);
                                    if (autoSelectItems) {
                                        annObjectNode.selectNode(true);
                                    }
                                }
                                else {
                                    if (autoSelectItems) {
                                        annObjectNode.selectNode(false);
                                    }
                                }
                            }
                            else {
                                for (var k = 0; k < selectionObject.selectedObjects.count; k++) {
                                    if (annObjectNode.annObject === selectionObject.selectedObjects.item(k)) {
                                        selectedItems.push(annObjectNode);
                                        if (autoSelectItems) {
                                            annObjectNode.selectNode(true);
                                        }
                                    }
                                    else {
                                        if (autoSelectItems) {
                                            var node = selectedItems.filter(function (node) { return (node.annObject === selectionObject.selectedObjects.item(k)); })[0];
                                            if (!node) {
                                                annObjectNode.selectNode(false);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return selectedItems;
                };
                AutomationObjectsListControl.prototype.clear = function () {
                    while (this._listContainerDiv.firstChild) {
                        this._listContainerDiv.removeChild(this._listContainerDiv.firstChild);
                    }
                };
                AutomationObjectsListControl.prototype.populate = function () {
                    this.clear();
                    if (this._automation != null) {
                        for (var i = 0; i < this._automation.containers.count; i++) {
                            var container = this._automation.containers.item(i);
                            if (container.children.count > 0) {
                                // Check if the page already exist (filter by page number)
                                var pageNode = this._pages.filter(function (node) { return (node.annContainer.pageNumber == container.pageNumber); })[0];
                                if (pageNode) {
                                    pageNode.updateTitle();
                                    pageNode.clearContent();
                                    if (pageNode.updateContent())
                                        this._listContainerDiv.appendChild(pageNode.parentDiv);
                                }
                                else {
                                    pageNode = new Annotations.PageTreeNode(this, this._automation, this._imageViewer, container);
                                    this._pages.push(pageNode);
                                    if (pageNode.updateContent())
                                        this._listContainerDiv.appendChild(pageNode.parentDiv);
                                }
                            }
                        }
                    }
                };
                AutomationObjectsListControl.prototype.populateContainer = function (annContainer) {
                    // Check if the page already exist (filter by page number)
                    var pageNode = this._pages.filter(function (node) { return (node.annContainer.pageNumber == annContainer.pageNumber); })[0];
                    if (pageNode) {
                        // Page already exists, update its content
                        pageNode.clearContent();
                        if (annContainer.children.count == 0 || !pageNode.updateContent()) {
                            // Empty page, remove it
                            var nodeIndex = this._pages.indexOf(pageNode);
                            this._pages.splice(nodeIndex, 1);
                            this._listContainerDiv.removeChild(pageNode.parentDiv);
                        }
                        else if (!this._listContainerDiv.contains(pageNode.parentDiv)) {
                            this._listContainerDiv.appendChild(pageNode.parentDiv);
                        }
                    }
                    else {
                        // Page not exist, insert it
                        if (annContainer.children.count > 0) {
                            pageNode = new Annotations.PageTreeNode(this, this._automation, this._imageViewer, annContainer);
                            pageNode.updateContent();
                            // Add pages array
                            this._pages.push(pageNode);
                            // Sort pages array by page number
                            this._pages.sort(function (a, b) { return (a.annContainer.pageNumber - b.annContainer.pageNumber); });
                            // Check if there is a page after the page that will be inserted
                            var pageAfter = this._pages.filter(function (node) { return (node.annContainer.pageNumber > annContainer.pageNumber); })[0];
                            if (pageAfter) {
                                // Insert before the first founded page
                                this._listContainerDiv.insertBefore(pageNode.parentDiv, pageAfter.parentDiv);
                            }
                            else {
                                this._listContainerDiv.appendChild(pageNode.parentDiv);
                            }
                        }
                    }
                    this.updateSelection();
                };
                return AutomationObjectsListControl;
            }());
            Annotations.AutomationObjectsListControl = AutomationObjectsListControl;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var PageTreeNode = /** @class */ (function (_super) {
                __extends(PageTreeNode, _super);
                function PageTreeNode(owner, automation, imageViewer, annContainer) {
                    var _this = this;
                    if (automation == null)
                        throw new Error("automation cannot be null");
                    if (imageViewer == null)
                        throw new Error("imageViewer cannot be null");
                    if (annContainer == null)
                        throw new Error("annContainer cannot be null");
                    _this = _super.call(this) || this;
                    _this._owner = owner;
                    _this._automation = automation;
                    _this._imageViewer = imageViewer;
                    _this._annContainer = annContainer;
                    _this.isExpanded = true;
                    _this.createTreeNode();
                    lt.LTHelper.addClass(_this.parentDiv, "page-panel");
                    _this.updateTitle();
                    return _this;
                }
                Object.defineProperty(PageTreeNode.prototype, "annContainer", {
                    get: function () {
                        return this._annContainer;
                    },
                    enumerable: false,
                    configurable: true
                });
                PageTreeNode.prototype.updateTitle = function () {
                    var text = "Page " + this._annContainer.pageNumber;
                    if (!this._annContainer.isEnabled)
                        text += " (Disabled)";
                    this.headingLabel.textContent = text;
                };
                PageTreeNode.prototype.updateContent = function () {
                    var updated = false;
                    this.childNodes = [];
                    for (var j = 0; j < this._annContainer.children.count; j++) {
                        var annObject = this._annContainer.children.item(j);
                        if (annObject.id != lt.Annotations.Engine.AnnObject.selectObjectId && annObject.id != lt.Annotations.Engine.AnnObject.none) {
                            var annNode = new Annotations.AnnObjectTreeNode(this._owner, this._automation, this._imageViewer, this._annContainer, annObject);
                            this.childNodes.push(annNode);
                            this.contentDiv.appendChild(annNode.parentDiv);
                            annNode.updateContent();
                            updated = true;
                        }
                    }
                    return updated;
                };
                return PageTreeNode;
            }(Annotations.ListTreeNode));
            Annotations.PageTreeNode = PageTreeNode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ReviewTreeNode = /** @class */ (function (_super) {
                __extends(ReviewTreeNode, _super);
                function ReviewTreeNode(automation, annObject, annContainer, annReview, parentTreeNode) {
                    var _this = this;
                    if (automation == null)
                        throw new Error("automation cannot be null");
                    if (annObject == null)
                        throw new Error("annObject cannot be null");
                    if (annObject.id == lt.Annotations.Engine.AnnObject.selectObjectId || annObject.id == lt.Annotations.Engine.AnnObject.none)
                        throw new Error("Cannot create this item with a selection or none annotation object");
                    _this = _super.call(this) || this;
                    _this._automation = automation;
                    _this._annObject = annObject;
                    _this._annContainer = annContainer;
                    _this._annReview = annReview;
                    _this._parentTreeNode = parentTreeNode;
                    _this.contextMenu = document.getElementById("annReviewNodeContextMenu");
                    _this.contextMenu_collapseExpandBtn = document.getElementById("annReviewNodeContextMenu_collapseExpand");
                    _this._contextMenu_replyBtn = document.getElementById("annReviewNodeContextMenu_reply");
                    _this._contextMenu_checkBtn = document.getElementById("annReviewNodeContextMenu_check");
                    _this._contextMenu_addBtn = document.getElementById("annReviewNodeContextMenu_add");
                    _this._contextMenu_deleteBtn = document.getElementById("annReviewNodeContextMenu_delete");
                    _this._statusBtns = $(".reviewStatus");
                    _this.childNodes = [];
                    _this.createTreeNode();
                    _this.customizeTreeNode();
                    _this.updateContent();
                    _this.hookEvents();
                    return _this;
                }
                Object.defineProperty(ReviewTreeNode.prototype, "annReview", {
                    get: function () {
                        return this._annReview;
                    },
                    enumerable: false,
                    configurable: true
                });
                ReviewTreeNode.createContextMenu = function () {
                    // Create menu as HTML
                    var menuHtml = "";
                    menuHtml += "<div id='annReviewNodeContextMenu' class='dropup clearfix' tabindex='-1' style='display:none;'>";
                    menuHtml += "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='display:block;margin-bottom:5px;'>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annReviewNodeContextMenu_collapseExpand' class='menuItem'>";
                    menuHtml += "<span class='text'></span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annReviewNodeContextMenu_reply' class='menuItem'>";
                    menuHtml += "<span class='text'>Reply</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='dropdown-submenu'>";
                    menuHtml += "<button class='menuItem'>";
                    menuHtml += "<span class='text'>Set Status</span>";
                    menuHtml += "</button>";
                    menuHtml += "<ul class='dropdown-menu'>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='accepted' value='Accepted' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Accepted</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='cancelled' value='Cancelled' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Cancelled</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='completed' value='Completed' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Completed</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='creted' value='Created' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Created</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='modified' value='Modified' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Modified</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='none' value='None' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>None</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='rejected' value='Rejected' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Rejected</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='reply' value='Reply' class='menuItem reviewStatus'>";
                    menuHtml += "<span class='text'>Reply</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "</ul>";
                    menuHtml += "</li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annReviewNodeContextMenu_check' class='menuItem'>";
                    menuHtml += "<span class='text'></span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annReviewNodeContextMenu_add' class='menuItem'>";
                    menuHtml += "<span class='text'>Add</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "<li class='divider'></li>";
                    menuHtml += "<li>";
                    menuHtml += "<button id='annReviewNodeContextMenu_delete' class='menuItem'>";
                    menuHtml += "<span class='text'>Delete</span>";
                    menuHtml += "</button>";
                    menuHtml += "</li>";
                    menuHtml += "</ul>";
                    // Create menu as element and append it to demo body
                    var contextMenu = document.createElement("div");
                    contextMenu.innerHTML = menuHtml;
                    document.body.appendChild(contextMenu);
                };
                ReviewTreeNode.prototype.customizeTreeNode = function () {
                    // Span to view annotation object image
                    var labelSpan = document.createElement("span");
                    lt.LTHelper.addClass(labelSpan, "annObjectImage");
                    labelSpan.style.backgroundImage = ReviewTreeNode.undoImageUrl;
                    this.headingDiv.appendChild(labelSpan);
                    lt.LTHelper.addClass(this.parentDiv, "review-panel");
                    // Checked checkbox
                    this._checkedCheckbox = document.createElement("input");
                    this._checkedCheckbox.disabled = !this._annContainer.isEnabled;
                    this._checkedCheckbox.title = "Check Review";
                    this._checkedCheckbox.type = "checkbox";
                    this.headingDiv.appendChild(this._checkedCheckbox);
                    // Object info
                    var objectInfoContainerDiv = document.createElement("div");
                    lt.LTHelper.addClass(objectInfoContainerDiv, "objectInfoContainer");
                    this.headingDiv.appendChild(objectInfoContainerDiv);
                    var userNameLabel = document.createElement("label");
                    lt.LTHelper.addClass(userNameLabel, "userName");
                    var objectNameLabel = document.createElement("label");
                    lt.LTHelper.addClass(objectNameLabel, "objectName");
                    objectNameLabel.style.visibility = "hidden";
                    this._dateTimeLabel = document.createElement("label");
                    lt.LTHelper.addClass(this._dateTimeLabel, "dateTime");
                    this._dateTimeLabel.style.visibility = "hidden";
                    objectInfoContainerDiv.appendChild(userNameLabel);
                    objectInfoContainerDiv.appendChild(objectNameLabel);
                    objectInfoContainerDiv.appendChild(this._dateTimeLabel);
                    // Update object info
                    var annAutomationObject = this._automation.manager.findObjectById(this._annObject.id);
                    if (annAutomationObject != null) {
                        objectNameLabel.textContent = annAutomationObject.name;
                    }
                    else {
                        objectNameLabel.textContent = this._annObject.friendlyName;
                    }
                    if (this._annReview.author != null && this._annReview.author != "") {
                        userNameLabel.textContent = this._annReview.author;
                    }
                    else {
                        userNameLabel.textContent = "[Author]";
                    }
                    this._dateTimeLabel.textContent = this._annReview.status + ": " + this._annReview.date.toLocaleString();
                    // Text input, to update review comment
                    var textareaContainerDiv = document.createElement("div");
                    lt.LTHelper.addClass(textareaContainerDiv, "textareaContainer");
                    this._commentTextArea = document.createElement("textarea");
                    this._commentTextArea.disabled = !this._annContainer.isEnabled;
                    this._commentTextArea.setAttribute("rows", "2");
                    textareaContainerDiv.appendChild(this._commentTextArea);
                    this._commentTextArea.textContent = this._annReview.comment;
                    // Checked checkbox 
                    this._checkedCheckbox.checked = this._annReview.isChecked;
                    // append info labels and content text input to the heading div
                    this.headingDiv.appendChild(textareaContainerDiv);
                };
                ReviewTreeNode.prototype.updateContent = function () {
                    if (this._annReview.replies.length > 0) {
                        for (var i = 0; i < this._annReview.replies.length; i++) {
                            var reply = this._annReview.replies[i];
                            var reviewNode = this.childNodes.filter(function (node) { return (node.annReview == reply); })[0];
                            if (reviewNode) {
                                reviewNode.clearContent();
                                this.contentDiv.appendChild(reviewNode.parentDiv);
                                reviewNode.updateContent();
                            }
                            else {
                                reviewNode = new ReviewTreeNode(this._automation, this._annObject, this._annContainer, reply, this);
                                this.childNodes.push(reviewNode);
                                this.contentDiv.appendChild(reviewNode.parentDiv);
                                reviewNode.updateContent();
                            }
                        }
                    }
                };
                ReviewTreeNode.prototype.hookEvents = function () {
                    var _this = this;
                    this._checkedCheckbox.onchange = function (e) { return _this.checkedCheckbox_Change(e); };
                    this._commentTextArea.onchange = function (e) { return _this.commentTextArea_Change(e); };
                };
                ReviewTreeNode.prototype.checkedCheckbox_Change = function (e) {
                    this._annReview.isChecked = this._checkedCheckbox.checked;
                };
                ReviewTreeNode.prototype.commentTextArea_Change = function (e) {
                    this._annReview.comment = this._commentTextArea.value;
                };
                ReviewTreeNode.prototype.onShowContextMenu = function () {
                    var _this = this;
                    this._contextMenu_checkBtn.children[0].textContent = this._annReview.isChecked ? "Uncheck" : "Check";
                    var isDisabled = !this._annContainer.isEnabled;
                    this._statusBtns.toggleClass("checked", false);
                    $("#" + this._annReview.status.toLowerCase()).toggleClass("checked", true);
                    if (isDisabled)
                        this._statusBtns.attr("disabled", "disabled");
                    else
                        this._statusBtns.removeAttr("disabled");
                    this._statusBtns.off("click");
                    this._statusBtns.on("click", this.statusBtns_BtnClicked.bind(this));
                    this._contextMenu_replyBtn.onclick = function (e) { return _this.contextMenu_replyBtn_Click(e); };
                    this._contextMenu_replyBtn.disabled = isDisabled;
                    this._contextMenu_checkBtn.onclick = function (e) { return _this.contextMenu_checkBtn_Click(e); };
                    this._contextMenu_checkBtn.disabled = isDisabled;
                    this._contextMenu_addBtn.onclick = function (e) { return _this.contextMenu_addBtn_Click(e); };
                    this._contextMenu_addBtn.disabled = isDisabled;
                    this._contextMenu_deleteBtn.onclick = function (e) { return _this.contextMenu_deleteBtn_Click(e); };
                    this._contextMenu_deleteBtn.disabled = isDisabled;
                };
                ReviewTreeNode.prototype.contextMenu_replyBtn_Click = function (e) {
                    var review = new lt.Annotations.Engine.AnnReview();
                    review.author = Annotations.AutomationObjectsListControl.userName;
                    review.date = new Date();
                    review.status = lt.Annotations.Engine.AnnReview.reply;
                    this.annReview.replies.push(review);
                    var reviewNode = new ReviewTreeNode(this._automation, this._annObject, this._annContainer, review, this);
                    this.childNodes.push(reviewNode);
                    this.contentDiv.appendChild(reviewNode.parentDiv);
                    reviewNode.updateContent();
                    this.isExpanded = true;
                    this.updateNodeExpansion();
                    this.updateObjectInfoVisibility();
                };
                ReviewTreeNode.prototype.contextMenu_checkBtn_Click = function (e) {
                    this._checkedCheckbox.checked = !this._checkedCheckbox.checked;
                    this._annReview.isChecked = this._checkedCheckbox.checked;
                };
                ReviewTreeNode.prototype.contextMenu_addBtn_Click = function (e) {
                    var review = new lt.Annotations.Engine.AnnReview();
                    review.author = Annotations.AutomationObjectsListControl.userName;
                    review.date = new Date();
                    review.status = lt.Annotations.Engine.AnnReview.reply;
                    this._annObject.reviews.push(review);
                    var reviewNode = new ReviewTreeNode(this._automation, this._annObject, this._annContainer, review, this._parentTreeNode);
                    this._parentTreeNode.childNodes.push(reviewNode);
                    this._parentTreeNode.contentDiv.appendChild(reviewNode.parentDiv);
                    reviewNode.updateContent();
                };
                ReviewTreeNode.prototype.contextMenu_deleteBtn_Click = function (e) {
                    var index = this._parentTreeNode.childNodes.indexOf(this);
                    this._parentTreeNode.childNodes.splice(index, 1);
                    if (Annotations.AnnObjectTreeNode.isInstanceOfType(this._parentTreeNode)) {
                        this._parentTreeNode.annObject.reviews.splice(index, 1);
                    }
                    else if (ReviewTreeNode.isInstanceOfType(this._parentTreeNode)) {
                        this._parentTreeNode.annReview.replies.splice(index, 1);
                    }
                    this._parentTreeNode.contentDiv.removeChild(this.parentDiv);
                };
                ReviewTreeNode.prototype.statusBtns_BtnClicked = function (e) {
                    this._annReview.status = $(e.currentTarget).val();
                    this._statusBtns.toggleClass("checked", false);
                    $("#" + this._annReview.status.toLowerCase()).toggleClass("checked", true);
                    this._dateTimeLabel.textContent = this._annReview.status + ": " + this._annReview.date.toLocaleString();
                };
                return ReviewTreeNode;
            }(Annotations.ListTreeNode));
            Annotations.ReviewTreeNode = ReviewTreeNode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationTextArea = /** @class */ (function () {
                function AutomationTextArea(parent, automation, editTextEvent, removeAction) {
                    var _this = this;
                    this.textAreaElement_StopPropagation = function (e) {
                        e.stopPropagation();
                    };
                    this.textAreaElement_FocusOut = function (e) {
                        // Focusout occurs during tab, click outside (including outside of browser window)
                        _this.tryInternalRemove(true);
                    };
                    if (parent == null)
                        throw new Error("parent passed as null");
                    if (editTextEvent == null)
                        throw new Error("editTextEvent passed as null");
                    this.textObject = editTextEvent.textObject;
                    if (this.textObject == null)
                        throw new Error("No annotation text object was found in the event");
                    this._removeAction = removeAction;
                    this._automation = automation;
                    // Create the textarea that will appear for the user to edit the content
                    this._textAreaElement = document.createElement("textArea");
                    this._textAreaElement.style.left = editTextEvent.bounds.left + 'px';
                    this._textAreaElement.style.top = editTextEvent.bounds.top + 'px';
                    this._textAreaElement.style.position = 'absolute';
                    this._textAreaElement.style.zIndex = '100';
                    this._textAreaElement.style.height = editTextEvent.bounds.height + 'px';
                    this._textAreaElement.style.width = editTextEvent.bounds.width + 'px';
                    this._textAreaElement.value = editTextEvent.textObject.text;
                    this._textAreaElement.style.color = editTextEvent.textObject.textForeground.color;
                    this._textAreaElement.style.fontFamily = editTextEvent.textObject.font.fontFamilyName;
                    this._textAreaElement.style.fontSize = editTextEvent.textObject.font.fontSize + 'pt';
                    this._textAreaElement.wrap = "off";
                    parent.appendChild(this._textAreaElement);
                    this._textAreaElement.focus();
                    // Handle interactions with the text area
                    this._textAreaElement.onkeydown = function (e) { return _this.textAreaElement_KeyDown(e); };
                    this._textAreaElement.addEventListener("focusout", this.textAreaElement_FocusOut);
                    // Application may have some event listeners to change focus on mousedown/pointerdown. Make sure we don't propagate.
                    this._textAreaElement.addEventListener("mousedown", this.textAreaElement_StopPropagation);
                    this._textAreaElement.addEventListener("pointerdown", this.textAreaElement_StopPropagation);
                    var imageViewerAutomationControl = this._automation.automationControl;
                }
                // Called by application to remove and clean up
                AutomationTextArea.prototype.remove = function (update) {
                    this._removeAction = null;
                    if (update)
                        this.updateTextObject();
                    var parent = this._textAreaElement.parentElement;
                    if (parent != null) {
                        this._textAreaElement.parentElement.removeChild(this._textAreaElement);
                        parent.focus();
                    }
                    this._textAreaElement = null;
                };
                // Update the text object with the changes from the text area
                AutomationTextArea.prototype.updateTextObject = function () {
                    if (!this.textObject)
                        return;
                    this.textObject.text = this._textAreaElement.value;
                    if (this._automation) {
                        var annObjects = new lt.Annotations.Engine.AnnObjectCollection();
                        annObjects.add(this.textObject);
                        this._automation.invokeObjectModified(annObjects, lt.Annotations.Automation.AnnObjectChangedType.text);
                        this._automation.invokeAfterObjectChanged(annObjects, lt.Annotations.Automation.AnnObjectChangedType.text);
                    }
                    this._automation.invalidate(lt.LeadRectD.empty);
                };
                AutomationTextArea.prototype.tryInternalRemove = function (update) {
                    if (this._removeAction)
                        this._removeAction(update);
                };
                AutomationTextArea.prototype.textAreaElement_KeyDown = function (e) {
                    // Tab key automatically triggers a focusOut and is handled above.
                    switch (e.keyCode) {
                        case 27: // Escape
                            this.tryInternalRemove(false);
                            break;
                        //case 13: // Enter
                        //case 37: // Arrow key
                        //case 38: // Arrow key
                        //case 39: // Arrow key
                        //case 40: // Arrow key
                        default:
                            // Prevent the application from moving
                            e.stopPropagation();
                            break;
                    }
                };
                return AutomationTextArea;
            }());
            Annotations.AutomationTextArea = AutomationTextArea;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var RubberStamp;
            (function (RubberStamp) {
                /*
                   Loader will hold the defaults and will store the dynamic rubberstamp list.
                   Client applications will need to create an instance of the loader.
                */
                var Loader = /** @class */ (function () {
                    function Loader(automationManager, element) {
                        var _this = this;
                        // The automation manager for the application (one per documentViewer)
                        this.automationManager = null;
                        this.element = null;
                        this.items = {};
                        this.recents = [];
                        this.quickSelect = null;
                        this.selectItem = function (index) {
                            if (_this.automationManager) {
                                _this.automationManager.currentRubberStampType = index;
                                _this.updateRecents();
                            }
                            if (_this.quickSelect)
                                _this.quickSelect.hide();
                        };
                        var itemsList = Loader.createDefaultEntities();
                        var items = {};
                        itemsList.forEach(function (item) {
                            items[item.index] = item;
                        });
                        this.items = items;
                        this.automationManager = automationManager;
                        this.element = element;
                        // Set up the UI components
                        this.quickSelect = new RubberStamp.QuickSelect();
                        // Update
                        this.update();
                    }
                    // A mapping from default stamp type to picture
                    Loader.createDefaultEntities = function () {
                        var Type = lt.Annotations.Engine.AnnRubberStampType;
                        var defaults = [
                            [Type.stampApproved, "Approved"],
                            [Type.stampAssigned, "Assigned"],
                            [Type.stampChecked, "Checked"],
                            [Type.stampClient, "Client"],
                            [Type.stampCopy, "Copy"],
                            [Type.stampDraft, "Draft"],
                            [Type.stampExtended, "Extended"],
                            [Type.stampFax, "Fax"],
                            [Type.stampFaxed, "Faxed"],
                            [Type.stampImportant, "Important"],
                            [Type.stampInvoice, "Invoice"],
                            [Type.stampNotice, "Notice"],
                            [Type.stampPaid, "Paid"],
                            [Type.stampOfficial, "Official"],
                            [Type.stampOnFile, "OnFile", "On File"],
                            [Type.stampPassed, "Passed"],
                            [Type.stampPending, "Pending"],
                            [Type.stampProcessed, "Processed"],
                            [Type.stampReceived, "Received"],
                            [Type.stampRejected, "Rejected"],
                            [Type.stampRelease, "Release"],
                            [Type.stampSent, "Sent"],
                            [Type.stampShipped, "Shipped"],
                            [Type.stampTopSecret, "TopSecret", "Top Secret"],
                            [Type.stampUrgent, "Urgent"],
                            [Type.stampVoid, "Void"]
                        ];
                        return defaults.map(function (tuple) {
                            var index = tuple[0];
                            var namePath = tuple[1];
                            var title = (tuple[2] || namePath);
                            var picture = new lt.Annotations.Engine.AnnPicture(Loader.defaultsPath + namePath + Loader.defaultsExtension);
                            return Entity.create(index, title, picture, "Default");
                        });
                    };
                    ;
                    Loader.createDefaults = function (target) {
                        var items = Loader.createDefaultEntities();
                        items.forEach(function (item) {
                            target[item.index] = item.picture;
                        });
                    };
                    Loader.prototype.update = function () {
                        var _this = this;
                        var stamps = this.automationManager.resources.rubberStamps;
                        var stampsKeys = Object.keys(stamps);
                        var items = this.items;
                        stampsKeys.forEach(function (key) {
                            var item = items[key];
                            if (!!item) {
                                // Keep
                                stamps[key] = item.picture;
                            }
                            else {
                                // Remove
                                stamps[key] = null;
                            }
                        });
                        var itemsKeys = Object.keys(this.items);
                        itemsKeys.forEach(function (i) {
                            // Add new
                            var item = _this.items[i];
                            stamps[item.index] = item.picture;
                        });
                    };
                    Loader.prototype.beginDraw = function () {
                        var manager = this.automationManager;
                        if (!manager)
                            return;
                        var currentObjectId = manager.currentObjectId;
                        if (currentObjectId !== lt.Annotations.Engine.AnnObject.rubberStampObjectId)
                            return;
                        this.updateRecents();
                        this.showQuickSelect();
                    };
                    Loader.prototype.updateRecents = function () {
                        var manager = this.automationManager;
                        var currentType = manager.currentRubberStampType;
                        var entity = this.items[currentType];
                        if (!entity)
                            entity = this.items[0];
                        var limit = this.quickSelect.limit - 1;
                        var newRecents = [entity];
                        for (var i = 0; i < limit; i++) {
                            var recent = this.recents[i];
                            if (recent) {
                                if (recent.index === entity.index) {
                                    limit++;
                                    continue;
                                }
                                newRecents.push(recent);
                            }
                        }
                        this.recents = newRecents;
                    };
                    Loader.prototype.showQuickSelect = function () {
                        if (this.quickSelect)
                            this.quickSelect.show(this.recents, this.items, this.element, this.selectItem);
                    };
                    // Where the default rubberStamps should be located
                    Loader.defaultsPath = "Resources/Objects/RubberStamps/";
                    // The extension
                    Loader.defaultsExtension = ".png";
                    return Loader;
                }());
                RubberStamp.Loader = Loader;
                var Entity = /** @class */ (function () {
                    function Entity() {
                    }
                    Entity.create = function (index, title, picture, category) {
                        var entity = new Entity();
                        entity.index = index;
                        entity.title = title;
                        entity.picture = picture;
                        entity.category = category;
                        return entity;
                    };
                    return Entity;
                }());
                RubberStamp.Entity = Entity;
            })(RubberStamp = Annotations.RubberStamp || (Annotations.RubberStamp = {}));
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var RubberStamp;
            (function (RubberStamp) {
                var QuickSelect = /** @class */ (function () {
                    function QuickSelect() {
                        var _this = this;
                        this.root = null;
                        this.rootBody = null;
                        this._isVisible = false;
                        this._currentRef = null;
                        this.showAbove = true;
                        this.limit = 4;
                        this._onResize = function (sender, e) {
                            if (!_this._isDisposed)
                                _this.hide();
                        };
                        this._onDown = function (sender, e) {
                            if (_this._isDisposed || !_this._isVisible)
                                return;
                            // Check for the root of the control in the event target ancestry to know
                            // if we clicked within it or not.
                            var hitRoot = _this.root === e.target || _this.root.contains(e.target);
                            if (!hitRoot)
                                _this.hide();
                        };
                        this._isDisposed = false;
                        QuickSelect._init();
                        QuickSelect._resize.add(this._onResize);
                        QuickSelect._down.add(this._onDown);
                        this.root = document.createElement("div");
                        lt.LTHelper.addClass(this.root, QuickSelect.className);
                        var rootArrow = document.createElement("div");
                        lt.LTHelper.addClass(rootArrow, "arrow");
                        this.root.appendChild(rootArrow);
                        this.rootBody = document.createElement("div");
                        lt.LTHelper.addClass(this.rootBody, "body");
                        this.root.appendChild(this.rootBody);
                        // Add to body, but keep display:none
                        this.hide();
                        document.body.appendChild(this.root);
                    }
                    QuickSelect._init = function () {
                        if (QuickSelect._didInit)
                            return;
                        QuickSelect._didInit = true;
                        QuickSelect._createDynamicStyle();
                        $(document).on("mousedown", function (e) {
                            QuickSelect._down.invoke(QuickSelect, e);
                        });
                        var resize = function (e) {
                            QuickSelect._resize.invoke(QuickSelect, e);
                        };
                        $(document).on("visibilitychange", resize);
                        $(window).on("resize orientationchange orientationchanged", resize);
                    };
                    QuickSelect._createDynamicStyle = function () {
                        if (QuickSelect._dynamicStyle)
                            return;
                        QuickSelect._dynamicStyle = new Demos.Utils.DynamicStyle("lt_demos_ann_quickselect", "Styles for the RubberStamps QuickSelect", [
                            // Root
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className, [
                                ["display", "block"],
                                ["position", "absolute"],
                                ["z-index", "10"],
                                ["border-radius", "1px"],
                                ["border", "1px solid #888"],
                                ["background-color", "#edeff1"]
                            ]),
                            // Root body
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " .body", [
                                ["position", "relative"],
                                ["overflow-y", "auto"],
                                ["color", "#888"],
                                ["margin", "2px 0px"],
                                ["padding", "1px 0px"],
                                // Don't show past the max width/height
                                ["min-width", "48px"],
                                ["min-height", "24px"],
                                ["max-width", "250px"],
                                ["max-height", "250px"],
                            ]),
                            // Root arrow
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " .arrow", [
                                ["position", "absolute"],
                                ["z-index", "5"],
                                ["right", "calc(50% - 10px)"],
                                ["width", "20px"],
                                ["height", "10px"],
                            ]),
                            // Root arrow
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " .arrow::before, ." + this.className + " .arrow::after", [
                                ["position", "absolute"],
                                ["content", "''"],
                                ["border-style", "solid"],
                                ["border-color", "transparent"]
                            ]),
                            // Root arrow - below icon
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".below .arrow", [
                                ["top", "-10px"],
                            ]),
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".below .arrow::before", [
                                ["top", "0"],
                                ["border-width", "0 10px 10px 10px"],
                                ["border-bottom-color", "#888"],
                            ]),
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".below .arrow::after", [
                                ["top", "1px"],
                                ["border-width", "0 10px 10px 10px"],
                                ["border-bottom-color", "#edeff1"],
                            ]),
                            // Root arrow - above icon
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".above .arrow", [
                                ["bottom", "-10px"],
                            ]),
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".above .arrow::before", [
                                ["bottom", "0"],
                                ["border-width", "10px 10px 0 10px"],
                                ["border-top-color", "#888"],
                            ]),
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + ".above .arrow::after", [
                                ["bottom", "1px"],
                                ["border-width", "10px 10px 0 10px"],
                                ["border-top-color", "#edeff1"],
                            ]),
                            // Lists
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " ul", [
                                ["list-style-type", "none"],
                                ["margin", "0"],
                                ["padding", "0"]
                            ]),
                            // List Item
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " li", [
                                ["display", "block"],
                                ["border", "none"],
                                ["margin", "0px 2px 0 2px"],
                                ["padding", "0px 12px 0 2px"],
                                ["background-color", "transparent"],
                                ["color", "#333"],
                                ["cursor", "pointer"],
                            ]),
                            // List Item - Hovered
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " li:hover", [
                                ["background-color", "#dfe3e6"],
                            ]),
                            // Top Recent item (current)
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " ul:first-child li:first-child", [
                                ["font-weight", "bold"],
                            ]),
                            // Separator between recents and all
                            Demos.Utils.DynamicStyle.createStyleBlock("." + this.className + " .separator", [
                                ["margin", "4px 2px"],
                                ["height", "1px"],
                                ["background-color", "#a3a6ad"]
                            ]),
                        ]);
                    };
                    QuickSelect.prototype.hide = function () {
                        lt.Demos.Utils.Visibility.toggle($(this.root), false);
                        this._isVisible = false;
                    };
                    QuickSelect.prototype.dispose = function () {
                        if (this._isDisposed)
                            return;
                        this._isDisposed = true;
                        var root = this.root;
                        if (root) {
                            this.hide();
                            this.root = null;
                            this.rootBody = null;
                            $(root).empty().remove();
                        }
                        QuickSelect._down.remove(this._onDown);
                        QuickSelect._resize.remove(this._onResize);
                    };
                    QuickSelect.prototype.show = function (recents, items, ref, click) {
                        if (this._isVisible)
                            return;
                        var rootBody = this.rootBody;
                        if (!rootBody)
                            return;
                        var $rootBody = $(rootBody);
                        this.createInnerUI($rootBody, recents, items, function (clickedEntity) {
                            click(clickedEntity.index);
                        });
                        this._isVisible = true;
                        this._currentRef = ref;
                        this._updatePosition();
                    };
                    QuickSelect.prototype.createInnerUI = function ($rootBody, recents, items, click) {
                        $rootBody.empty();
                        if (recents && recents.length) {
                            var $recentsUl = $(document.createElement("ul"));
                            $rootBody.append($recentsUl);
                            recents.forEach(function (item) {
                                var $li = $(document.createElement("li"));
                                $li.text(item.title).click(function () {
                                    click(item);
                                });
                                $recentsUl.append($li);
                            });
                            $rootBody.append($(document.createElement("div")).addClass("separator"));
                        }
                        var $itemsUl = $(document.createElement("ul"));
                        $rootBody.append($itemsUl);
                        var itemsKeys = Object.keys(items);
                        itemsKeys.forEach(function (i) {
                            var item = items[i];
                            var $li = $(document.createElement("li"));
                            $li.text(item.title).click(function () {
                                click(item);
                            });
                            $itemsUl.append($li);
                        });
                    };
                    QuickSelect.prototype.updatePosition = function (ref) {
                        this._currentRef = ref;
                        this._updatePosition();
                    };
                    QuickSelect.prototype._updatePosition = function () {
                        if (!this._isVisible)
                            return;
                        var ref = this._currentRef;
                        if (!ref)
                            return;
                        var root = this.root;
                        if (!root)
                            return;
                        var $root = $(root);
                        var $hook = $(ref);
                        var hookPosition = $hook.offset();
                        var hookWidth = $hook.outerWidth();
                        var hookHeight = $hook.outerHeight();
                        $root.css({ visibility: "hidden" });
                        lt.Demos.Utils.Visibility.toggle($root, true);
                        var rootWidth = $root.outerWidth(true);
                        var rootHeight = $root.outerHeight(true);
                        var top = hookPosition.top;
                        var arrowOffset = 5;
                        if (this.showAbove) {
                            top = hookPosition.top - rootHeight - arrowOffset;
                            $root.removeClass("below").addClass("above");
                        }
                        else {
                            top = hookPosition.top + hookHeight + arrowOffset;
                            $root.removeClass("above").addClass("below");
                        }
                        $root.css({
                            top: top,
                            left: hookPosition.left + ((hookWidth - rootWidth) / 2)
                        });
                        if (this.rootBody)
                            this.rootBody.scrollTop = 0;
                        $root.css({ visibility: "visible" });
                    };
                    // We will append a style to the DOM for our class so that it's easy to modify without any code.
                    QuickSelect.className = "lt_ann_rubberstamps_quickselect";
                    QuickSelect._dynamicStyle = null;
                    QuickSelect._didInit = false;
                    QuickSelect._down = lt.LeadEvent.create(QuickSelect, "down");
                    QuickSelect._resize = lt.LeadEvent.create(QuickSelect, "resize");
                    return QuickSelect;
                }());
                RubberStamp.QuickSelect = QuickSelect;
            })(RubberStamp = Annotations.RubberStamp || (Annotations.RubberStamp = {}));
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
// This class will simulate a tooltip when hovering over the specified object.
// Note, we use "ToolTip" (capitalized "tip"), not "Tooltip", to match the existing members in Leadtools.Annotations
// As of now, the tooltip does not support editing.
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ToolTip = /** @class */ (function () {
                function ToolTip(parent) {
                    if (!parent)
                        throw new Error("parent cannot be null");
                    ToolTip._init();
                    this._parent = parent;
                    var el = document.createElement("div");
                    lt.LTHelper.addClass(el, ToolTip.className);
                    this._element = el;
                }
                ToolTip._init = function () {
                    if (ToolTip._dynamicStyle)
                        return;
                    ToolTip._dynamicStyle = new Demos.Utils.DynamicStyle("lt_demos_ann_tooltip", "Styles for the Annotations Tooltip", [
                        Demos.Utils.DynamicStyle.createStyleBlock("." + this.className, [
                            ["display", "block"],
                            ["position", "absolute"],
                            // Wrap long lines
                            ["white-space", "pre-line"],
                            ["word-break", "break-all"],
                            ["word-break", "break-word"],
                            ["overflow-wrap", "break-word"],
                            // Don't show past the max width/height
                            ["overflow", "hidden"],
                            ["background-color", "#555"],
                            ["color", "#eee"],
                            ["padding", "5px 8px"],
                            ["border-radius", "3px"],
                            ["min-width", "48px"],
                            ["min-height", "24px"],
                            ["max-width", "250px"],
                            ["max-height", "350px"],
                            // Cursor will pass through (modern browsers only)
                            ["pointer-events", "none"],
                            ["box-shadow", "0 0 5px 1px #333 inset"]
                        ])
                    ]);
                };
                Object.defineProperty(ToolTip.prototype, "element", {
                    get: function () {
                        return this._element;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ToolTip.prototype, "parent", {
                    get: function () {
                        return this._parent;
                    },
                    enumerable: false,
                    configurable: true
                });
                ToolTip.prototype.show = function (position, text) {
                    var el = this._element;
                    if (!el)
                        return;
                    // Add the tooltip element if it is not added yet
                    if (!el.parentNode) {
                        this._parent.appendChild(el);
                    }
                    el.style.left = position.x + "px";
                    el.style.top = position.y + "px";
                    var $el = $(el);
                    $el.text(text);
                    lt.Demos.Utils.Visibility.toggle($el, true);
                };
                ToolTip.prototype.hide = function () {
                    lt.Demos.Utils.Visibility.toggle($(this.element), false);
                };
                ToolTip.prototype.remove = function () {
                    if (this._element && this._parent && this._element.parentElement === this._parent)
                        this._parent.removeChild(this._element);
                };
                // We will append a style to the DOM for our class so that it's easy to modify without any code.
                ToolTip.className = "lt_ann_tooltip";
                ToolTip._dynamicStyle = null;
                return ToolTip;
            }());
            Annotations.ToolTip = ToolTip;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var TreeView = /** @class */ (function () {
                function TreeView(divID) {
                    this._selectedNode = null;
                    this._nodes = [];
                    this.childNodesDiv = document.createElement("div");
                    this.root = document.getElementById(divID);
                    this.root.appendChild(this.childNodesDiv);
                }
                Object.defineProperty(TreeView.prototype, "selectedNode", {
                    get: function () { return this._selectedNode; },
                    set: function (value) {
                        //unselect the old node
                        if (this._selectedNode != null)
                            this._selectedNode.isSelected = false;
                        this._selectedNode = value;
                        if (this._selectedNode != null)
                            this._selectedNode.isSelected = true;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(TreeView.prototype, "nodes", {
                    get: function () { return this._nodes; },
                    set: function (value) { this._nodes = value; },
                    enumerable: false,
                    configurable: true
                });
                TreeView.prototype.addNode = function (node) {
                    node.parentDiv = this.root;
                    node.parent = null;
                    this.childNodesDiv.appendChild(node.root);
                    this._nodes.push(node);
                };
                TreeView.prototype.deleteNode = function (node) {
                    this.childNodesDiv.removeChild(node.root);
                    var index = this._nodes.indexOf(node, 0);
                    if (index != undefined) {
                        this._nodes.splice(index, 1);
                    }
                    this.selectedNode = null;
                };
                TreeView.prototype.updateUIElements = function () {
                };
                return TreeView;
            }());
            Annotations.TreeView = TreeView;
            var TreeNode = /** @class */ (function () {
                function TreeNode(treeView) {
                    var _this = this;
                    this.isCollapsed = true;
                    this._isSelected = false;
                    this._nodes = [];
                    // Top 
                    this.root = document.createElement("div");
                    $(this.root).addClass("tree-node");
                    this.root.addEventListener("click", function (ev) { return _this.mainDiv_Click(ev); }, true);
                    // Header
                    this.header = document.createElement("div");
                    $(this.header).addClass("tree-header");
                    // Label
                    this.collapseLabel = document.createElement("label");
                    $(this.collapseLabel).addClass("tree-indicator").text("+");
                    this.collapseLabel.addEventListener("click", function (ev) { return _this.collapseLabel_Click(ev); });
                    // Children
                    this.childNodesDiv = document.createElement("div");
                    $(this.childNodesDiv).addClass("tree-children").hide();
                    $(this.root)
                        .append(this.collapseLabel)
                        .append(this.header)
                        .append(this.childNodesDiv);
                    this.treeView = treeView;
                }
                Object.defineProperty(TreeNode.prototype, "isSelected", {
                    get: function () { return this._isSelected; },
                    set: function (value) {
                        this._isSelected = value;
                        $(this.header).toggleClass("selected", value);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(TreeNode.prototype, "nodes", {
                    get: function () { return this._nodes; },
                    set: function (value) { this._nodes = value; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(TreeNode.prototype, "tag", {
                    get: function () { return this._tag; },
                    set: function (value) { this._tag = value; },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(TreeNode.prototype, "content", {
                    get: function () { return this._content; },
                    set: function (value) {
                        this._content = value;
                        //remove all content
                        while (this.header.firstChild) {
                            this.header.removeChild(this.header.firstChild);
                        }
                        this.header.appendChild(value);
                    },
                    enumerable: false,
                    configurable: true
                });
                TreeNode.prototype.mainDiv_Click = function (ev) {
                    this.treeView.selectedNode = this;
                    if (this.treeView.onSelectionChanged != null) {
                        this.treeView.onSelectionChanged(ev);
                    }
                };
                TreeNode.prototype.collapseLabel_Click = function (ev) {
                    this.setCollapsed(!this.isCollapsed);
                };
                TreeNode.prototype.setCollapsed = function (collapsedState) {
                    this.isCollapsed = collapsedState;
                    if (this.isCollapsed) {
                        $(this.collapseLabel).text("+");
                        $(this.childNodesDiv).hide();
                    }
                    else {
                        $(this.collapseLabel).text("-");
                        $(this.childNodesDiv).show();
                    }
                };
                TreeNode.prototype.addNode = function (node) {
                    node.parentDiv = this.root;
                    node.parent = this;
                    this.childNodesDiv.appendChild(node.root);
                    this._nodes.push(node);
                };
                TreeNode.prototype.deleteNode = function (node) {
                    this.childNodesDiv.removeChild(node.root);
                    var index = this._nodes.indexOf(node, 0);
                    if (index != undefined) {
                        this._nodes.splice(index, 1);
                    }
                    this.treeView.selectedNode = null;
                };
                return TreeNode;
            }());
            Annotations.TreeNode = TreeNode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
///<reference path="./../../../../../Bin/JS/DemoLibraries/Leadtools.Demos.d.ts"/>
///<reference path="./../../../../../Bin/JS/ThirdParty/jquery/jquery.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Annotations.Automation.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Annotations.Designers.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Annotations.Engine.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Annotations.Rendering.JavaScript.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Controls.d.ts"/>
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var MediaPlayerDialog = /** @class */ (function () {
                function MediaPlayerDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    // Run when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        if (_this.inner.isShowing) {
                            if (_this._videoElement) {
                                _this._videoElement.pause();
                                if (_this._sourceElement1.parentNode === _this._videoElement)
                                    _this._videoElement.removeChild(_this._sourceElement1);
                                if (_this._sourceElement2.parentNode === _this._videoElement)
                                    _this._videoElement.removeChild(_this._sourceElement2);
                                if (_this._sourceElement3.parentNode === _this._videoElement)
                                    _this._videoElement.removeChild(_this._sourceElement3);
                            }
                        }
                        _this.inner.hide();
                    };
                    this.el = {
                        videoObject: root.find(selectors.videoObject),
                        hide: root.find(selectors.hide)
                    };
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                }
                MediaPlayerDialog.prototype.play = function (source1, source2, source3) {
                    var _this = this;
                    if (!source1 && !source2 && !source3)
                        return;
                    this._videoElement = this.el.videoObject.get(0);
                    // Safari cannot play if QuickTime Player not installed
                    var canPlay = typeof (this._videoElement.play) === "function";
                    if (!canPlay) {
                        this._videoElement.innerHTML = "Your browser does not support HTML5 video.";
                    }
                    else {
                        this._sourceElement1 = document.createElement("source");
                        this._sourceElement1.src = source1;
                        this._sourceElement2 = document.createElement("source");
                        this._sourceElement2.src = source2;
                        this._sourceElement3 = document.createElement("source");
                        this._sourceElement3.src = source3;
                        this._videoElement.appendChild(this._sourceElement1);
                        this._videoElement.appendChild(this._sourceElement2);
                        this._videoElement.appendChild(this._sourceElement3);
                        this._videoElement.load();
                    }
                    this.inner.show(function () {
                        if (canPlay) {
                            _this._videoElement.play();
                        }
                    });
                };
                Object.defineProperty(MediaPlayerDialog.prototype, "videoElement", {
                    get: function () {
                        return this._videoElement;
                    },
                    enumerable: false,
                    configurable: true
                });
                return MediaPlayerDialog;
            }());
            Annotations.MediaPlayerDialog = MediaPlayerDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var norbergObjectId = -1008; // Leadtools.Annotations.UserMedicalPack.AnnNorbergObjcet
            var AnnEditor = /** @class */ (function () {
                function AnnEditor() {
                    this._properties = {};
                }
                Object.defineProperty(AnnEditor.prototype, "groupName", {
                    get: function () {
                        return this._groupName;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnEditor.prototype, "properties", {
                    get: function () {
                        return this._properties;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnEditor;
            }());
            Annotations.AnnEditor = AnnEditor;
            var AnnColorEditor = /** @class */ (function (_super) {
                __extends(AnnColorEditor, _super);
                function AnnColorEditor(color, groupName) {
                    var _this = _super.call(this) || this;
                    _this._groupName = groupName;
                    _this.value = color;
                    return _this;
                }
                Object.defineProperty(AnnColorEditor.prototype, "value", {
                    get: function () { return this._color; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._color, value);
                        this._color = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnColorEditor;
            }(AnnEditor));
            Annotations.AnnColorEditor = AnnColorEditor;
            var AnnBooleanEditor = /** @class */ (function (_super) {
                __extends(AnnBooleanEditor, _super);
                function AnnBooleanEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = value;
                    _this._groupName = groupName;
                    return _this;
                }
                Object.defineProperty(AnnBooleanEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnBooleanEditor;
            }(AnnEditor));
            Annotations.AnnBooleanEditor = AnnBooleanEditor;
            var AnnLengthEditor = /** @class */ (function (_super) {
                __extends(AnnLengthEditor, _super);
                function AnnLengthEditor(annLength, groupName, propertyName, displayName) {
                    var _this = _super.call(this) || this;
                    _this.info_ValueChanged = function (oldValue, newValue) {
                        _this._annLength.value = newValue;
                        _this.onValueChanged(oldValue, newValue);
                    };
                    _this._annLength = annLength;
                    _this._groupName = groupName;
                    var info = new Annotations.AnnPropertyInfo(propertyName, false, annLength.value, groupName, "Length", displayName, true, AnnDoubleEditor);
                    info.valueChanged = _this.info_ValueChanged;
                    _this._properties[propertyName] = info;
                    return _this;
                }
                return AnnLengthEditor;
            }(AnnEditor));
            Annotations.AnnLengthEditor = AnnLengthEditor;
            var AnnBrushEditor = /** @class */ (function (_super) {
                __extends(AnnBrushEditor, _super);
                function AnnBrushEditor(annBrush, category) {
                    var _this = _super.call(this) || this;
                    _this._annBrush = new lt.Annotations.Engine.AnnBrush();
                    _this._annBrush = annBrush;
                    _this._category = category;
                    return _this;
                }
                Object.defineProperty(AnnBrushEditor.prototype, "annBrush", {
                    get: function () { return this._annBrush; },
                    set: function (anBrush) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._annBrush, anBrush);
                        this._annBrush = anBrush;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AnnBrushEditor.prototype, "category", {
                    get: function () { return this._category; },
                    enumerable: false,
                    configurable: true
                });
                return AnnBrushEditor;
            }(AnnEditor));
            Annotations.AnnBrushEditor = AnnBrushEditor;
            var AnnSolidColorBrushEditor = /** @class */ (function (_super) {
                __extends(AnnSolidColorBrushEditor, _super);
                function AnnSolidColorBrushEditor(annSolidColorBrush, groupName, propertyName, displayName) {
                    var _this = _super.call(this) || this;
                    _this._annSolidColorBrush = null;
                    _this.info_ValueChanged = function (oldValue, newValue) {
                        if (_this._annSolidColorBrush != null) {
                            _this._annSolidColorBrush.color = newValue;
                        }
                        if (_this.onValueChanged != null) {
                            _this.onValueChanged(oldValue, newValue);
                        }
                    };
                    _this._annSolidColorBrush = annSolidColorBrush;
                    _this._groupName = groupName;
                    var info;
                    if (annSolidColorBrush != null) {
                        info = new Annotations.AnnPropertyInfo(propertyName, false, annSolidColorBrush.color, groupName, "Color", displayName, true, AnnColorEditor);
                    }
                    else {
                        info = new Annotations.AnnPropertyInfo(propertyName, false, "transparent", groupName, "Color", displayName, true, AnnColorEditor);
                    }
                    info.valueChanged = _this.info_ValueChanged;
                    _this._properties[propertyName] = info;
                    return _this;
                }
                return AnnSolidColorBrushEditor;
            }(AnnEditor));
            Annotations.AnnSolidColorBrushEditor = AnnSolidColorBrushEditor;
            var AnnDoubleEditor = /** @class */ (function (_super) {
                __extends(AnnDoubleEditor, _super);
                function AnnDoubleEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = 0;
                    _this._groupName = groupName;
                    _this.value = value;
                    return _this;
                }
                Object.defineProperty(AnnDoubleEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnDoubleEditor;
            }(AnnEditor));
            Annotations.AnnDoubleEditor = AnnDoubleEditor;
            var AnnStringEditor = /** @class */ (function (_super) {
                __extends(AnnStringEditor, _super);
                function AnnStringEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = "";
                    _this._groupName = groupName;
                    _this.value = value;
                    return _this;
                }
                Object.defineProperty(AnnStringEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnStringEditor;
            }(AnnEditor));
            Annotations.AnnStringEditor = AnnStringEditor;
            var AnnPictureEditor = /** @class */ (function (_super) {
                __extends(AnnPictureEditor, _super);
                function AnnPictureEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = lt.Annotations.Engine.AnnPicture.empty;
                    _this._groupName = groupName;
                    _this.value = value;
                    return _this;
                }
                Object.defineProperty(AnnPictureEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnPictureEditor;
            }(AnnEditor));
            Annotations.AnnPictureEditor = AnnPictureEditor;
            var AnnMediaEditor = /** @class */ (function (_super) {
                __extends(AnnMediaEditor, _super);
                function AnnMediaEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = new lt.Annotations.Engine.AnnMedia();
                    _this._groupName = groupName;
                    _this.value = value;
                    return _this;
                }
                Object.defineProperty(AnnMediaEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnMediaEditor;
            }(AnnEditor));
            Annotations.AnnMediaEditor = AnnMediaEditor;
            var AnnIntegerEditor = /** @class */ (function (_super) {
                __extends(AnnIntegerEditor, _super);
                function AnnIntegerEditor(value, groupName) {
                    var _this = _super.call(this) || this;
                    _this._value = 0;
                    _this._groupName = groupName;
                    _this.value = value;
                    return _this;
                }
                Object.defineProperty(AnnIntegerEditor.prototype, "value", {
                    get: function () { return this._value; },
                    set: function (value) {
                        if (this.onValueChanged != null)
                            this.onValueChanged(this._value, value);
                        this._value = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                return AnnIntegerEditor;
            }(AnnEditor));
            Annotations.AnnIntegerEditor = AnnIntegerEditor;
            var AnnStrokeEditor = /** @class */ (function (_super) {
                __extends(AnnStrokeEditor, _super);
                function AnnStrokeEditor(annStroke, groupName) {
                    var _this = _super.call(this) || this;
                    _this.strokePropertyInfo_ValueChanged = function (oldValue, newValue) {
                        if (_this.onValueChanged != null) {
                            _this.onValueChanged(oldValue, newValue);
                        }
                    };
                    _this._groupName = groupName;
                    var strokePropertyInfo = new Annotations.AnnPropertyInfo("Stroke", false, annStroke.stroke, groupName, "Stroke", "", true, AnnSolidColorBrushEditor);
                    strokePropertyInfo.valueChanged = _this.strokePropertyInfo_ValueChanged;
                    _this._properties["Stroke"] = strokePropertyInfo;
                    var thicknessPropertyInfo = new Annotations.AnnPropertyInfo("Thickness", false, annStroke.strokeThickness, groupName, "Thickness", "", true, AnnLengthEditor);
                    thicknessPropertyInfo.valueChanged = _this.strokePropertyInfo_ValueChanged;
                    _this._properties["Thickness"] = thicknessPropertyInfo;
                    return _this;
                }
                return AnnStrokeEditor;
            }(AnnEditor));
            Annotations.AnnStrokeEditor = AnnStrokeEditor;
            var AnnFontEditor = /** @class */ (function (_super) {
                __extends(AnnFontEditor, _super);
                function AnnFontEditor(annFont, groupName) {
                    var _this = _super.call(this) || this;
                    _this._annFont = null;
                    _this.fontSize_ValueChanged = function (oldValue, newValue) {
                        _this._annFont.fontSize = newValue;
                    };
                    _this.fontFamilyName_ValueChanged = function (oldValue, newValue) {
                        _this._annFont.fontFamilyName = newValue;
                        _this.onValueChanged(oldValue, newValue);
                    };
                    _this._groupName = groupName;
                    _this._annFont = annFont;
                    var fontFamilyNameInfo = new Annotations.AnnPropertyInfo("", false, annFont.fontFamilyName, groupName, "Stroke", "Family Name", true, AnnStringEditor);
                    fontFamilyNameInfo.valueChanged = _this.fontFamilyName_ValueChanged;
                    fontFamilyNameInfo.values["Arial"] = "Arial";
                    fontFamilyNameInfo.values["Courier New"] = "Courier New";
                    fontFamilyNameInfo.values["Times New Roman"] = "Times New Roman";
                    fontFamilyNameInfo.values["Verdana"] = "Verdana";
                    var fontSize = new Annotations.AnnPropertyInfo("", false, annFont.fontSize, groupName, "FontSize", "Size in Points", true, AnnDoubleEditor);
                    fontSize.values["8"] = 8;
                    fontSize.values["10"] = 10;
                    fontSize.values["11"] = 11;
                    fontSize.values["12"] = 12;
                    fontSize.values["13"] = 13;
                    fontSize.values["14"] = 14;
                    fontSize.values["16"] = 16;
                    fontSize.values["18"] = 18;
                    fontSize.values["20"] = 20;
                    fontSize.valueChanged = _this.fontSize_ValueChanged;
                    _this._properties["FontFamilyName"] = fontFamilyNameInfo;
                    _this._properties["FontSize"] = fontSize;
                    return _this;
                }
                return AnnFontEditor;
            }(AnnEditor));
            Annotations.AnnFontEditor = AnnFontEditor;
            var AnnObjectEditor = /** @class */ (function () {
                function AnnObjectEditor(annObject) {
                    var _this = this;
                    this._properties = {};
                    this.wordWrapInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(_this._annObject)) {
                            var annTextObject = _this._annObject;
                            annTextObject.wordWrap = _this.properties["WordWrap"].values[newValue];
                        }
                    };
                    this.pictureInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnStampObject.isInstanceOfType(_this._annObject)) {
                            var annStampObject = _this._annObject;
                            annStampObject.picture = newValue;
                        }
                        //Setting Picture property in AnnHotspotObject
                        if (lt.Annotations.Engine.AnnHotspotObject.isInstanceOfType(_this._annObject)) {
                            var annHotspotObject = _this._annObject;
                            annHotspotObject.picture = newValue;
                        }
                        //Setting Picture property in AnnFreehandHotspotObject
                        if (lt.Annotations.Engine.AnnFreehandHotspotObject.isInstanceOfType(_this._annObject)) {
                            var annFreehandHotspotObject = _this._annObject;
                            annFreehandHotspotObject.picture = newValue;
                        }
                    };
                    this.hyperlink_ValueChanged = function (oldValue, newValue) {
                        if (_this._annObject != null) {
                            _this._annObject.hyperlink = newValue;
                        }
                    };
                    this.showPictureInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPointObject.isInstanceOfType(_this._annObject)) {
                            var annPointObject = _this._annObject;
                            annPointObject.showPicture = _this.properties["ShowPicture"].values[newValue];
                        }
                    };
                    this.expandedInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextRollupObject.isInstanceOfType(_this._annObject)) {
                            var annTextRollup = _this._annObject;
                            annTextRollup.expanded = _this.properties["Expanded"].values[newValue];
                        }
                    };
                    this.fillPropertyInfo_ValueChanged = function (oldValue, newValue) {
                        if (newValue != null) {
                            if (_this._annObject != null) {
                                _this._annObject.fill = newValue;
                            }
                        }
                    };
                    this.hiliteColorPropertyInfo_ValueChanged = function (oldValue, newValue) {
                        if (newValue != null) {
                            if (_this._annObject != null) {
                                if (lt.Annotations.Engine.AnnHiliteObject.isInstanceOfType(_this._annObject)) {
                                    var annHiliteObject = _this._annObject;
                                    if (annHiliteObject != null) {
                                        annHiliteObject.hiliteColor = newValue;
                                    }
                                }
                            }
                        }
                    };
                    this.strokePropertyInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(_this._annObject)) {
                            var annPolyRulerObject = _this._annObject;
                            annPolyRulerObject.tickMarksStroke = annPolyRulerObject.stroke;
                        }
                    };
                    this.ruberStampTypeinfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnRubberStampObject.isInstanceOfType(_this._annObject)) {
                            var annRubberStampObject = _this._annObject;
                            annRubberStampObject.rubberStampType = lt.Annotations.Engine.Utils.enumParse(lt.Annotations.Engine.AnnRubberStampType, "Stamp" + _this.properties["RuberStampType"].values[newValue]);
                        }
                        if (lt.Annotations.Engine.AnnSelectionObject.isInstanceOfType(_this._annObject)) {
                            var annSelectionObject = _this._annObject;
                            annSelectionObject.applyProperties();
                            for (var i = 0; i < annSelectionObject.selectedObjects.count; i++) {
                                var ruler = annSelectionObject.selectedObjects.item(i);
                                if (ruler != null) {
                                    ruler.stroke = annSelectionObject.stroke;
                                    ruler.tickMarksStroke = annSelectionObject.stroke;
                                }
                            }
                        }
                    };
                    this.acuteInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnProtractorObject.isInstanceOfType(_this._annObject)) {
                            var annProtractorObject = _this._annObject;
                            annProtractorObject.acute = _this.properties["Acute"].values[newValue];
                        }
                    };
                    this.fixedPointerInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextPointerObject.isInstanceOfType(_this._annObject)) {
                            var annTextPointerObject = _this._annObject;
                            annTextPointerObject.fixedPointer = _this.properties["FixedPointer"].values[newValue];
                        }
                    };
                    this.anglePrecisionInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnProtractorObject.isInstanceOfType(_this._annObject)) {
                            var annProtractorObject = _this._annObject;
                            annProtractorObject.anglePrecision = _this.properties["AnglePrecision"].values[newValue];
                        }
                    };
                    this.precisionInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(_this._annObject)) {
                            var annPolyRulerObject = _this._annObject;
                            annPolyRulerObject.precision = _this.properties["Precision"].values[newValue];
                        }
                    };
                    this.angularUnitInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnProtractorObject.isInstanceOfType(_this._annObject)) {
                            var annProtractorObject = _this._annObject;
                            annProtractorObject.angularUnit = lt.Annotations.Engine.Utils.enumParse(lt.Annotations.Engine.AnnAngularUnit, _this.properties["AngularUnit"].values[newValue]);
                        }
                    };
                    this.showTickMarksInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(_this._annObject)) {
                            var annPolyRulerObject = _this._annObject;
                            annPolyRulerObject.showTickMarks = _this.properties["ShowTickMarks"].values[newValue];
                        }
                    };
                    this.measurementUnitInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(_this._annObject)) {
                            var annPolyRulerObject = _this._annObject;
                            annPolyRulerObject.measurementUnit = lt.Annotations.Engine.Utils.enumParse(lt.Annotations.Engine.AnnUnit, _this.properties["MeasurementUnit"].values[newValue]);
                        }
                    };
                    this.showGauge_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(_this._annObject)) {
                            var annPolyRulerObject = _this._annObject;
                            annPolyRulerObject.showGauge = _this.properties["ShowGauge"].values[newValue];
                        }
                    };
                    this.tensionInfo_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnCurveObject.isInstanceOfType(_this._annObject)) {
                            var curve = _this._annObject;
                            var tenstion = newValue;
                            //Tension should be from 0 to 1
                            if (tenstion < 0) {
                                tenstion = 0;
                                alert("set value between 0 and 1");
                            }
                            else if (tenstion > 1) {
                                tenstion = 1;
                                alert("set value between 0 and 1");
                            }
                            curve.tension = tenstion;
                        }
                    };
                    this.horizontalAlignment_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(_this._annObject)) {
                            var annTextObject = _this._annObject;
                            annTextObject.horizontalAlignment = lt.Annotations.Engine.Utils.enumParse(lt.Annotations.Engine.AnnHorizontalAlignment, _this.properties["HorizontalAlignment"].values[newValue]);
                        }
                    };
                    this.verticalAlignment_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(_this._annObject)) {
                            var annTextObject = _this._annObject;
                            annTextObject.verticalAlignment = lt.Annotations.Engine.Utils.enumParse(lt.Annotations.Engine.AnnVerticalAlignment, _this.properties["VerticalAlignment"].values[newValue]);
                        }
                    };
                    this.text_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(_this._annObject)) {
                            var annTextObject = _this._annObject;
                            annTextObject.text = newValue;
                        }
                    };
                    this.media_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnMediaObject.isInstanceOfType(_this._annObject)) {
                            var annVideoObject = _this._annObject;
                            annVideoObject.media = newValue;
                        }
                    };
                    this.encryptKey_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnEncryptObject.isInstanceOfType(_this._annObject)) {
                            var annEncryptObject = _this._annObject;
                            annEncryptObject.key = newValue;
                        }
                    };
                    this.encryptor_ValueChanged = function (oldValue, newValue) {
                        if (lt.Annotations.Engine.AnnEncryptObject.isInstanceOfType(_this._annObject)) {
                            var annEncryptObject = _this._annObject;
                            annEncryptObject.encryptor = _this.properties["Encryptor"].values[newValue];
                        }
                    };
                    this._annObject = annObject;
                    // Fill
                    if (annObject.supportsFill && !(annObject instanceof lt.Annotations.Engine.AnnHotspotObject)) {
                        var fill = annObject.fill;
                        var fillPropertyInfo = new Annotations.AnnPropertyInfo("Fill", false, fill, "Fill", "Fill the object", "", annObject.supportsFill, AnnBrushEditor);
                        fillPropertyInfo.valueChanged = this.fillPropertyInfo_ValueChanged;
                        this._properties["Fill"] = fillPropertyInfo;
                    }
                    if (annObject instanceof lt.Annotations.Engine.AnnHiliteObject) {
                        var annHiliteObject = annObject;
                        var hiliteColor = lt.Annotations.Engine.AnnSolidColorBrush.create(annHiliteObject.hiliteColor);
                        var hiliteColorPropertyInfo = new Annotations.AnnPropertyInfo("Hilite", false, hiliteColor, "Hilite", "Hilite Color", "Hilite Color", true, AnnSolidColorBrushEditor);
                        hiliteColorPropertyInfo.valueChanged = this.hiliteColorPropertyInfo_ValueChanged;
                        this._properties["HiliteColor"] = hiliteColorPropertyInfo;
                    }
                    // Stroke
                    if (annObject.supportsStroke && !(annObject instanceof lt.Annotations.Engine.AnnHotspotObject)) {
                        var strokePropertyInfo = new Annotations.AnnPropertyInfo("Stroke", false, annObject.stroke, "Stroke", "Stroke the object", "", annObject.supportsStroke, AnnStrokeEditor);
                        strokePropertyInfo.valueChanged = this.strokePropertyInfo_ValueChanged;
                        this._properties["Stroke"] = strokePropertyInfo;
                    }
                    // Font
                    if (annObject.supportsFont) {
                        this._properties["Font"] = new Annotations.AnnPropertyInfo("", false, annObject.font, "Font", "Select Font", "", annObject.supportsFont, AnnFontEditor);
                    }
                    if (annObject.id !== lt.Annotations.Engine.AnnObject.mediaObjectId || annObject.id !== lt.Annotations.Engine.AnnObject.audioObjectId) {
                        var hyperlink = new Annotations.AnnPropertyInfo("", false, annObject.hyperlink, "Hyperlink", "Hyperlink", "Hyperlink", true, AnnStringEditor);
                        hyperlink.valueChanged = this.hyperlink_ValueChanged;
                        this._properties["Hyperlink"] = hyperlink;
                    }
                    if (lt.Annotations.Engine.AnnCurveObject.isInstanceOfType(annObject)) {
                        var closedCurveObject = annObject;
                        var tensionInfo;
                        if (closedCurveObject != null) {
                            tensionInfo = new Annotations.AnnPropertyInfo("", false, closedCurveObject.tension, "Curve", "Tension", "Tension", true, AnnDoubleEditor);
                        }
                        else {
                            var curveObject = annObject;
                            tensionInfo = new Annotations.AnnPropertyInfo("", false, curveObject.tension, "Curve", "Tension", "Tension", true, AnnDoubleEditor);
                        }
                        tensionInfo.valueChanged = (this.tensionInfo_ValueChanged);
                        this._properties["Tension"] = tensionInfo;
                    }
                    if (lt.Annotations.Engine.AnnPolyRulerObject.isInstanceOfType(annObject) && this._annObject.id != norbergObjectId) {
                        var annPolyRulerObject = annObject;
                        var showGauge = new Annotations.AnnPropertyInfo("", false, annPolyRulerObject.showGauge, "Ruler", "ShowGauge", "Show Gauge", true, AnnBooleanEditor);
                        showGauge.values["True"] = true;
                        showGauge.values["False"] = false;
                        showGauge.valueChanged = this.showGauge_ValueChanged;
                        this._properties["ShowGauge"] = showGauge;
                        var gaugeLengthInfo = new Annotations.AnnPropertyInfo("GaugeLength", false, annPolyRulerObject.gaugeLength, "Ruler", "GaugeLength", "Gauge Length", true, AnnLengthEditor);
                        this._properties["GaugeLength"] = gaugeLengthInfo;
                        var tickMarksLengthInfo = new Annotations.AnnPropertyInfo("TickMarksLength", false, annPolyRulerObject.tickMarksLength, "Ruler", "TickMarksLength", "TickMarks Length", true, AnnLengthEditor);
                        this._properties["TickMarksLength"] = tickMarksLengthInfo;
                        var measurementUnit = lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnUnit, annPolyRulerObject.measurementUnit);
                        var measurementUnitInfo = new Annotations.AnnPropertyInfo("", false, measurementUnit, "Ruler", "Measurement Unit", "Measurement Unit", true, AnnStringEditor);
                        measurementUnitInfo.valueChanged = this.measurementUnitInfo_ValueChanged;
                        AnnObjectEditor.fillEnumValue(measurementUnitInfo, lt.Annotations.Engine.AnnUnit);
                        this._properties["MeasurementUnit"] = measurementUnitInfo;
                        var precisionInfo = new Annotations.AnnPropertyInfo("", false, annPolyRulerObject.precision, "Ruler", "Precision", "Precision", true, AnnStringEditor);
                        precisionInfo.values["0"] = 0;
                        precisionInfo.values["1"] = 1;
                        precisionInfo.values["2"] = 2;
                        precisionInfo.values["3"] = 3;
                        precisionInfo.values["4"] = 4;
                        precisionInfo.values["5"] = 5;
                        precisionInfo.values["6"] = 6;
                        precisionInfo.valueChanged = this.precisionInfo_ValueChanged;
                        this._properties["Precision"] = precisionInfo;
                        var showTickMarksInfo = new Annotations.AnnPropertyInfo("", false, annPolyRulerObject.showTickMarks, "Ruler", "ShowTickMarks", "Show Tick Marks", true, AnnBooleanEditor);
                        showTickMarksInfo.values["True"] = true;
                        showTickMarksInfo.values["False"] = false;
                        showTickMarksInfo.valueChanged = this.showTickMarksInfo_ValueChanged;
                        this._properties["ShowTickMarks"] = showTickMarksInfo;
                    }
                    if (lt.Annotations.Engine.AnnProtractorObject.isInstanceOfType(annObject)) {
                        var annProtractorObject = annObject;
                        var acuteInfo = new Annotations.AnnPropertyInfo("", false, annProtractorObject.acute, "Protractor", "Acute", "Acute", true, AnnStringEditor);
                        acuteInfo.values["True"] = true;
                        acuteInfo.values["False"] = false;
                        acuteInfo.valueChanged = this.acuteInfo_ValueChanged;
                        this._properties["Acute"] = acuteInfo;
                        var anglePrecisionInfo = new Annotations.AnnPropertyInfo("", false, annProtractorObject.anglePrecision, "Protractor", "Angle Precision", "Precision", true, AnnStringEditor);
                        anglePrecisionInfo.values["0"] = 0;
                        anglePrecisionInfo.values["1"] = 1;
                        anglePrecisionInfo.values["2"] = 2;
                        anglePrecisionInfo.values["3"] = 3;
                        anglePrecisionInfo.values["4"] = 4;
                        anglePrecisionInfo.values["5"] = 5;
                        anglePrecisionInfo.values["6"] = 6;
                        anglePrecisionInfo.valueChanged = this.anglePrecisionInfo_ValueChanged;
                        this._properties["AnglePrecision"] = anglePrecisionInfo;
                        var angulartUnit = lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnAngularUnit, annProtractorObject.angularUnit);
                        var angularUnitInfo = new Annotations.AnnPropertyInfo("", false, angulartUnit, "Protractor", "AngularUnit", "Angular Unit", true, AnnStringEditor);
                        angularUnitInfo.valueChanged = this.angularUnitInfo_ValueChanged;
                        AnnObjectEditor.fillEnumValue(angularUnitInfo, lt.Annotations.Engine.AnnAngularUnit);
                        this._properties["AngularUnit"] = angularUnitInfo;
                    }
                    if (lt.Annotations.Engine.AnnRubberStampObject.isInstanceOfType(annObject)) {
                        var annRubberStampObject = annObject;
                        var rubberStamp = lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnRubberStampType, annRubberStampObject.rubberStampType);
                        rubberStamp = rubberStamp.replace("Stamp", "");
                        var ruberStampTypeinfo = new Annotations.AnnPropertyInfo("", false, rubberStamp, "RubberStamp", "RuberStampType", "Rubber Stamp Type", true, AnnStringEditor);
                        AnnObjectEditor.fillEnumValue(ruberStampTypeinfo, lt.Annotations.Engine.AnnRubberStampType, "Stamp");
                        ruberStampTypeinfo.valueChanged = this.ruberStampTypeinfo_ValueChanged;
                        this._properties["RuberStampType"] = ruberStampTypeinfo;
                    }
                    if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(annObject)) {
                        var annTextObject = annObject;
                        this._properties["TextBackground"] = new Annotations.AnnPropertyInfo("TextBackground", false, annTextObject.textBackground, "Text", "TextBackground", "Background", true, AnnSolidColorBrushEditor);
                        this._properties["TextForeground"] = new Annotations.AnnPropertyInfo("TextForeground", false, annTextObject.textForeground, "Text", "TextForeground", "Foreground", true, AnnSolidColorBrushEditor);
                        var text = new Annotations.AnnPropertyInfo("", false, annTextObject.text, "Text", "Acute", "Text", true, AnnStringEditor);
                        text.valueChanged = this.text_ValueChanged;
                        this._properties["Text"] = text;
                        var vertical = lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnVerticalAlignment, annTextObject.verticalAlignment);
                        var verticalAlignment = new Annotations.AnnPropertyInfo("", false, vertical, "Text", "VerticalAlignment", "Vertical Alignment", true, AnnStringEditor);
                        verticalAlignment.valueChanged = this.verticalAlignment_ValueChanged;
                        AnnObjectEditor.fillEnumValue(verticalAlignment, lt.Annotations.Engine.AnnVerticalAlignment);
                        this._properties["VerticalAlignment"] = verticalAlignment;
                        var horizontal = lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnHorizontalAlignment, annTextObject.horizontalAlignment);
                        var horizontalAlignment = new Annotations.AnnPropertyInfo("", false, horizontal, "Text", "HorizontalAlignment", "Horizontal Alignment", true, AnnStringEditor);
                        horizontalAlignment.valueChanged = this.horizontalAlignment_ValueChanged;
                        AnnObjectEditor.fillEnumValue(horizontalAlignment, lt.Annotations.Engine.AnnHorizontalAlignment);
                        this._properties["HorizontalAlignment"] = horizontalAlignment;
                        var wordWrapInfo = new Annotations.AnnPropertyInfo("", false, annTextObject.wordWrap, "Text", "Word Wrap", "Word Wrap", true, AnnBooleanEditor);
                        wordWrapInfo.values["True"] = true;
                        wordWrapInfo.values["False"] = false;
                        this._properties["WordWrap"] = wordWrapInfo;
                        wordWrapInfo.valueChanged = this.wordWrapInfo_ValueChanged;
                    }
                    if (lt.Annotations.Engine.AnnTextRollupObject.isInstanceOfType(annObject)) {
                        var annTextRollupObject = annObject;
                        var expandedInfo = new Annotations.AnnPropertyInfo("", false, annTextRollupObject.expanded, "TextRollup", "Expanded", "Expanded", true, AnnBooleanEditor);
                        expandedInfo.values["True"] = true;
                        expandedInfo.values["False"] = false;
                        expandedInfo.valueChanged = this.expandedInfo_ValueChanged;
                        this._properties["Expanded"] = expandedInfo;
                    }
                    if (lt.Annotations.Engine.AnnTextPointerObject.isInstanceOfType(annObject)) {
                        var annTextPointerObject = annObject;
                        var fixedPointerInfo = new Annotations.AnnPropertyInfo("", false, annTextPointerObject.fixedPointer, "TextPointer", "FixedPointer", "Fixed", true, AnnStringEditor);
                        fixedPointerInfo.valueChanged = this.fixedPointerInfo_ValueChanged;
                        fixedPointerInfo.values["True"] = true;
                        fixedPointerInfo.values["False"] = false;
                        this._properties["FixedPointer"] = fixedPointerInfo;
                    }
                    if (lt.Annotations.Engine.AnnStampObject.isInstanceOfType(annObject)) {
                        var annStampObject = annObject;
                        var pictureInfo = new Annotations.AnnPropertyInfo("", false, annStampObject.picture, "Picture", "Picture", "Picture", true, AnnPictureEditor);
                        pictureInfo.valueChanged = this.pictureInfo_ValueChanged;
                        this._properties["Picture"] = pictureInfo;
                    }
                    //Allow showing Picture property to AnnHotspotObject
                    if (lt.Annotations.Engine.AnnHotspotObject.isInstanceOfType(annObject)) {
                        var annHotspotObject = annObject;
                        var pictureInfo = new Annotations.AnnPropertyInfo("", false, annHotspotObject.picture, "Picture", "Picture", "Picture", true, AnnPictureEditor);
                        pictureInfo.valueChanged = this.pictureInfo_ValueChanged;
                        this._properties["Picture"] = pictureInfo;
                    }
                    //Allow showing Picture property to AnnFreehandHotspotObject
                    if (lt.Annotations.Engine.AnnFreehandHotspotObject.isInstanceOfType(annObject)) {
                        var annFreehandHotspotObject = annObject;
                        var pictureInfo = new Annotations.AnnPropertyInfo("", false, annFreehandHotspotObject.picture, "Picture", "Picture", "Picture", true, AnnPictureEditor);
                        pictureInfo.valueChanged = this.pictureInfo_ValueChanged;
                        this._properties["Picture"] = pictureInfo;
                    }
                    if (lt.Annotations.Engine.AnnPointObject.isInstanceOfType(annObject)) {
                        var annPointObject = annObject;
                        var showPictureInfo = new Annotations.AnnPropertyInfo("", false, annPointObject.showPicture, "Point", "ShowPicture", "Show Picture", true, AnnBooleanEditor);
                        showPictureInfo.values["True"] = true;
                        showPictureInfo.values["False"] = false;
                        showPictureInfo.valueChanged = this.showPictureInfo_ValueChanged;
                        this._properties["ShowPicture"] = showPictureInfo;
                    }
                    if (annObject.id == lt.Annotations.Engine.AnnObject.mediaObjectId || annObject.id == lt.Annotations.Engine.AnnObject.audioObjectId) {
                        var annMediaObject = annObject;
                        var media = new Annotations.AnnPropertyInfo("", false, annMediaObject.media, "Media", "Media", "Source", true, AnnMediaEditor);
                        media.valueChanged = this.media_ValueChanged;
                        this._properties["Media"] = media;
                    }
                    if (annObject.id == lt.Annotations.Engine.AnnObject.encryptObjectId) {
                        var annEncryptObject = annObject;
                        if (annEncryptObject != null) {
                            var key = new Annotations.AnnPropertyInfo("", false, annEncryptObject.key, "Encrypt", "", "Key", true, AnnIntegerEditor);
                            key.valueChanged = this.encryptKey_ValueChanged;
                            this._properties["Key"] = key;
                            if (!annEncryptObject.isEncrypted) {
                                var encryptor = new Annotations.AnnPropertyInfo("", false, annEncryptObject.encryptor, "Encrypt", "", "Encryptor", true, AnnBooleanEditor);
                                encryptor.values["True"] = true;
                                encryptor.values["False"] = false;
                                encryptor.valueChanged = this.encryptor_ValueChanged;
                                this._properties["Encryptor"] = encryptor;
                            }
                        }
                    }
                }
                Object.defineProperty(AnnObjectEditor.prototype, "properties", {
                    get: function () {
                        return this._properties;
                    },
                    enumerable: false,
                    configurable: true
                });
                AnnObjectEditor.prototype.RubberStampTypeToString = function (type) {
                    return lt.Annotations.Engine.Utils.enumToString(lt.Annotations.Engine.AnnRubberStampType, type);
                };
                AnnObjectEditor.fillEnumValue = function (info, type, removeText) {
                    for (var entry in type) {
                        if (isNaN(+entry)) {
                            var member = entry.substr(0, 1).toUpperCase() + entry.substr(1);
                            if (member == "__typeName")
                                break;
                            if (removeText)
                                member = member.replace(removeText, "");
                            info.values[member] = member;
                        }
                    }
                };
                return AnnObjectEditor;
            }());
            Annotations.AnnObjectEditor = AnnObjectEditor;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ObjectsAlignment;
            (function (ObjectsAlignment) {
                ObjectsAlignment[ObjectsAlignment["toLeft"] = -1] = "toLeft";
                ObjectsAlignment[ObjectsAlignment["toCenter"] = -2] = "toCenter";
                ObjectsAlignment[ObjectsAlignment["toRight"] = -3] = "toRight";
                ObjectsAlignment[ObjectsAlignment["toTop"] = -4] = "toTop";
                ObjectsAlignment[ObjectsAlignment["toMiddle"] = -5] = "toMiddle";
                ObjectsAlignment[ObjectsAlignment["toBottom"] = -6] = "toBottom";
                ObjectsAlignment[ObjectsAlignment["sameWidth"] = -7] = "sameWidth";
                ObjectsAlignment[ObjectsAlignment["sameHeight"] = -8] = "sameHeight";
                ObjectsAlignment[ObjectsAlignment["sameSize"] = -9] = "sameSize";
            })(ObjectsAlignment = Annotations.ObjectsAlignment || (Annotations.ObjectsAlignment = {}));
            var ObjectsAlignmentDialog = /** @class */ (function () {
                function ObjectsAlignmentDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._automation = null;
                    this._onHideClicked = function () {
                        _this.inner.hide();
                    };
                    this._enableObjectsAlignment_Changed = function (e) {
                        _this._automation.manager.enableObjectsAlignment = _this.el.enabledCheckbox.prop("checked");
                        // Update objects state
                        _this.el.objectAlignments.prop("disabled", !(_this._automation.manager.enableObjectsAlignment && _this._automation.canAlign));
                    };
                    this._objectsAlignmentButtons_Clicked = function (e) {
                        var actionId = parseInt($(e.target).val(), 10);
                        if (_this.onApply)
                            _this.onApply(actionId);
                        _this.inner.hide();
                    };
                    this.el = {
                        enabledCheckbox: root.find(selectors.enabledCheckbox),
                        objectAlignments: root.find(selectors.objectAlignments),
                        hide: root.find(selectors.hide)
                    };
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    this.el.enabledCheckbox.on("change", this._enableObjectsAlignment_Changed);
                    this.el.objectAlignments.on("click", this._objectsAlignmentButtons_Clicked);
                }
                Object.defineProperty(ObjectsAlignmentDialog.prototype, "automation", {
                    get: function () { return this._automation; },
                    set: function (value) {
                        if (this._automation != value) {
                            this._automation = value;
                            this._automation.active = true;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                ObjectsAlignmentDialog.prototype.show = function () {
                    this.el.enabledCheckbox.prop("checked", this._automation.manager.enableObjectsAlignment);
                    // Update objects state
                    this.el.objectAlignments.prop("disabled", !(this._automation.manager.enableObjectsAlignment && this._automation.canAlign));
                    this.inner.show();
                };
                return ObjectsAlignmentDialog;
            }());
            Annotations.ObjectsAlignmentDialog = ObjectsAlignmentDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var PasswordDialog = /** @class */ (function () {
                function PasswordDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._password = "";
                    // Run when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        _this.inner.hide();
                    };
                    this._onSubmitClicked = function (e) {
                        _this._password = _this.el.input.val();
                        if (_this._password) {
                            if (_this.onVerify) {
                                var shouldHide = _this.onVerify();
                                if (shouldHide)
                                    _this.inner.hide();
                            }
                            else {
                                _this.inner.hide();
                            }
                        }
                        else {
                            window.alert("Password can't be empty");
                        }
                    };
                    this.el = lt.Demos.Utils.findSelectorsInRoot(root, selectors);
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    this.el.submit.on("click", this._onSubmitClicked);
                }
                PasswordDialog.prototype.setLock = function (lock) {
                    this._lock = lock;
                    var lockText = this._lock ? "Lock" : "Unlock";
                    this.el.title.text(lockText);
                    this.el.submit.text(lockText);
                    this.el.input.val("");
                };
                Object.defineProperty(PasswordDialog.prototype, "password", {
                    get: function () {
                        return this._password;
                    },
                    enumerable: false,
                    configurable: true
                });
                PasswordDialog.prototype.show = function () {
                    this.inner.show();
                };
                return PasswordDialog;
            }());
            Annotations.PasswordDialog = PasswordDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var norbergObjectId = -1008; // Leadtools.Annotations.UserMedicalPack.AnnNorbergObjcet
            // Tabs              | Common, Text, Curve, Rubberstamp...
            //   Groups          | Stroke, Hyperlink...
            //    Properties     | Stroke, Hyperlink...
            //       Properties  | Stroke, Fill...
            var PropertiesPage = /** @class */ (function () {
                function PropertiesPage($propertiesPage) {
                    var _this = this;
                    // This will always be full, we just clear the items from within each tab
                    this._tabs = [];
                    this._tabHolder = null;
                    this._pageHolder = null;
                    this._automation = null;
                    this._dialogUI = {
                        propertiesPage: "#auoDlg_propertiesPage",
                    };
                    // Private variables
                    this._groups = [];
                    this._currentSelected = null;
                    this._pageElement = $propertiesPage;
                    // Create the <ul> for the actual tabs, and the <div> for their content
                    this._tabHolder = $(document.createElement("ul")).addClass("dlg-tabs dlg-tabs-props");
                    this._pageHolder = $(document.createElement("div")).addClass("dlg-tabview dlg-tabview-props");
                    this._pageElement.append(this._tabHolder).append(this._pageHolder);
                    // Create each tab. We do not do this every time, just once at start.
                    var tabs = [
                        "Common",
                        "Text",
                        "Curve",
                        "Ruler",
                        "Protractor",
                        "RubberStamp",
                        "TextRollup",
                        "Picture",
                        "Point",
                        "Media",
                        "Encrypt",
                    ];
                    tabs.forEach(function (tabName) {
                        _this._tabs.push(new Tab(tabName));
                    });
                }
                Object.defineProperty(PropertiesPage.prototype, "automation", {
                    get: function () { return this._automation; },
                    set: function (value) {
                        if (this._automation != value) {
                            if (this._automation != null)
                                this._automation.active = false;
                            this._automation = value;
                            this._automation.active = true;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(PropertiesPage.prototype, "groupCount", {
                    get: function () { return this._groups.length; },
                    enumerable: false,
                    configurable: true
                });
                PropertiesPage.prototype.initialize = function () {
                    if (!this._automation)
                        return;
                    var editObject = this._automation.currentEditObject;
                    if (!editObject)
                        return;
                    if (editObject.isLocked) {
                        alert('Cannot change properties for a locked object.');
                        return;
                    }
                    // Reset all our saved info
                    this.clear();
                    // If using the select object, we may have multiple objects selected
                    if (editObject.id == lt.Annotations.Engine.AnnObject.selectObjectId) {
                        var selection = this._automation.currentEditObject;
                        for (var i = 0; i < selection.selectedObjects.count; i++) {
                            var object = selection.selectedObjects.item(i);
                            if (object) {
                                // Create the editor properties for each object
                                var annEditObject = new Annotations.AnnObjectEditor(object);
                                this.recursiveProcessProperties(annEditObject.properties);
                            }
                        }
                    }
                    else {
                        // Create the editor properties for each object
                        var annEditObject = new Annotations.AnnObjectEditor(editObject);
                        this.recursiveProcessProperties(annEditObject.properties);
                    }
                    // RENDER THE ITEMS
                    this.renderAllProperties();
                };
                // The properties of an Ann object are in dictionary form like props["Hyperlink"] = ...
                PropertiesPage.prototype.recursiveProcessProperties = function (properties) {
                    for (var propertyName in properties) {
                        var property = properties[propertyName];
                        if (property && property.isVisible) {
                            // Recursion into additional properties from the attached editor
                            if (property.editor && property.editor.properties && Object.keys(property.editor.properties).length) {
                                this.recursiveProcessProperties(property.editor.properties);
                            }
                            else {
                                var editor = property.editor;
                                var dropdownFields = null;
                                var lowerCaseFields = null;
                                var htmlType = HTMLType.label;
                                if (editor instanceof Annotations.AnnStringEditor && !property.isReadOnly) {
                                    htmlType = HTMLType.input;
                                }
                                else if (editor instanceof Annotations.AnnColorEditor) {
                                    htmlType = HTMLType.dropdown;
                                    dropdownFields = ["Transparent", "Red", "Blue", "Green", "Yellow", "Black", "White"];
                                    lowerCaseFields = dropdownFields.map(function (value) { return value.toLowerCase(); });
                                    if (lowerCaseFields.indexOf(editor.value) === -1) {
                                        dropdownFields.push(editor.value);
                                    }
                                }
                                else if (editor instanceof Annotations.AnnBooleanEditor) {
                                    htmlType = HTMLType.dropdown;
                                    dropdownFields = ["True", "False"];
                                }
                                else if (editor instanceof Annotations.AnnDoubleEditor) {
                                    htmlType = HTMLType.num;
                                }
                                else if (editor instanceof Annotations.AnnPictureEditor) {
                                    htmlType = HTMLType.picture;
                                }
                                else if (editor instanceof Annotations.AnnIntegerEditor) {
                                    htmlType = HTMLType.integerInput;
                                }
                                else if (editor instanceof Annotations.AnnMediaEditor) {
                                    htmlType = HTMLType.media;
                                }
                                else if (editor instanceof Annotations.AnnBrushEditor) {
                                    htmlType = HTMLType.brush;
                                }
                                // Depending on the type, create our values for a dropdown
                                // if "dropdown", values should already be defined above, like with AnnColorEditor
                                if (htmlType !== HTMLType.dropdown) {
                                    var keys = Object.keys(property.values);
                                    if (keys.length) {
                                        htmlType = HTMLType.dropdown;
                                        dropdownFields = keys;
                                    }
                                }
                                var propertyItem = new PropertyItem(propertyName, htmlType, dropdownFields, editor, property.value, property.displayName);
                                this.addPropertyItemToGroup(propertyItem, property.groupName);
                            }
                        }
                    }
                };
                PropertiesPage.prototype.addPropertyItemToGroup = function (propertyItem, groupName) {
                    // Check if the group name ("Stroke", "Fill", etc - for the collapsing HTML) exists in our array of already-processed properties
                    var matchingGroup = null;
                    for (var i = 0; i < this._groups.length; i++) {
                        var potentialGroup = this._groups[i];
                        if (potentialGroup.groupName === groupName) {
                            // Found group
                            matchingGroup = potentialGroup;
                            break;
                        }
                    }
                    if (!matchingGroup) {
                        // Create a new group with item
                        matchingGroup = new Group(groupName);
                        this._groups.push(matchingGroup);
                    }
                    // Add to sub-dictionary of individual field names, organizing by prop name within group
                    // Since, for example, processing two rectangles means 2 sets of "stroke color" and "thickness" in the "stroke" group
                    // We only want to show the UI for one, but we want to set changes back to both rectangles
                    var byGroupByPropName = matchingGroup.itemsByPropName[propertyItem.propertyName];
                    if (byGroupByPropName && byGroupByPropName.length)
                        matchingGroup.itemsByPropName[propertyItem.propertyName].push(propertyItem);
                    else
                        matchingGroup.itemsByPropName[propertyItem.propertyName] = [propertyItem];
                };
                // Create the collapsible components that can be shown/hidden
                PropertiesPage.prototype.renderAllProperties = function () {
                    var _this = this;
                    try {
                        // We will store the JQuery objects that have class "checked" here
                        this._currentSelected = null;
                        // Add our groups to the right tabs.
                        // GroupName === TabName. If not, put the group in "Common"
                        var commonTab = null;
                        for (var i = 0; i < this._groups.length; i++) {
                            var group = this._groups[i];
                            if (!group)
                                continue;
                            var foundTab = false;
                            for (var j = 0; j < this._tabs.length; j++) {
                                var tab = this._tabs[j];
                                if (tab.tabName === "Common")
                                    commonTab = tab;
                                if (tab.tabName === group.groupName) {
                                    tab.groups.push(group);
                                    foundTab = true;
                                    break;
                                }
                            }
                            if (!foundTab) {
                                // Add to Common, reference will exist at this point
                                commonTab.groups.push(group);
                            }
                        }
                        // So at this point we have tabs, which hold groups, which hold properties
                        // We need to know how many tabs have groups in them to apply CSS classes
                        var totalTabs = 0;
                        this._tabs.forEach(function (tab, index) {
                            if (tab.groups.length) {
                                totalTabs++;
                                // We should not have a tab or page for this group yet, so create the tab and page
                                var $tab = $(document.createElement("li")).text(tab.tabName);
                                var $page = $(document.createElement("div"));
                                _this._tabHolder.append($tab);
                                _this._pageHolder.append($page);
                                // On click, show this tab and set the CSS class
                                $tab.on("click", function () {
                                    if ($tab.hasClass("selected"))
                                        return;
                                    if (_this._currentSelected) {
                                        _this._currentSelected.removeClass("selected");
                                    }
                                    _this._currentSelected = $tab.add($page);
                                    _this._currentSelected.addClass("selected");
                                });
                                if (index === 0) {
                                    _this._currentSelected = $tab.add($page);
                                    _this._currentSelected.addClass("selected");
                                }
                                // For each group in the tab, create a collapsible HTML element
                                // Remember, Group "Stroke" may have "Stroke" and "Thickness" properties inside it
                                // If there are few groups in the tab, open them to save the user a click.
                                var openGroupsAtStart = tab.groups.length < 3;
                                tab.groups.forEach(function (group) {
                                    if (group) {
                                        // Container
                                        var $collapse = $(document.createElement("div")).addClass("group collapse-container");
                                        // Heading
                                        var $collapseHeader = $(document.createElement("div")).addClass("collapse-header");
                                        var $collapseHeading = $(document.createElement("h4")).addClass("collapse-header-text").text(group.groupName);
                                        var $collapseIndicator = $(document.createElement("div")).addClass("collapse-indicator").text("+");
                                        $collapseHeader.append($collapseHeading, $collapseIndicator);
                                        // Body
                                        var $collapseHeight = $(document.createElement("div")).addClass("collapse-height");
                                        var $collapseTransform = $(document.createElement("div")).addClass("collapse-transform");
                                        $collapseHeight.append($collapseTransform);
                                        $collapse.append($collapseHeader, $collapseHeight);
                                        // Toggle the "open" class when the header is clicked
                                        var click = function () {
                                            $collapse.toggleClass("open");
                                            $collapseIndicator.text($collapse.hasClass("open") ? "-" : "+");
                                        };
                                        $collapseHeader.on("click", click);
                                        if (openGroupsAtStart) {
                                            // Open to start
                                            click();
                                        }
                                        // Render group's items
                                        // We will only render the first item, but we will capture the other editors so that they also receive the callback.
                                        // In this way, we are editing the common properties all at once for all the selected objects
                                        var keys = Object.keys(group.itemsByPropName);
                                        if (keys.length) {
                                            for (var m = 0; m < keys.length; m++) {
                                                var sameGroupSamePropName = group.itemsByPropName[keys[m]];
                                                var first = null;
                                                var editors = [];
                                                for (var n = 0; n < sameGroupSamePropName.length; n++) {
                                                    var propertyItem = sameGroupSamePropName[n];
                                                    if (!first)
                                                        first = propertyItem;
                                                    if (propertyItem.editor)
                                                        editors.push(propertyItem.editor);
                                                }
                                                if (first && editors.length)
                                                    $collapseTransform.append(_this.createPropertyItemsHTML(first, editors));
                                            }
                                        }
                                        $page.append($collapse);
                                    }
                                });
                            }
                        });
                        // Add the CSS class
                        if (totalTabs < 5)
                            this._tabHolder.addClass("dlg-tabs-" + totalTabs);
                        else
                            this._tabHolder.addClass("dlg-tabs-plus");
                    }
                    catch (e) {
                        alert(e);
                    }
                };
                // Since we only render one group for all common properties (Change to "stroke" should affect all shapes with that property),
                // We will go through the array of editors in our change callback, since they hold individual callbacks
                PropertiesPage.prototype.createPropertyItemsHTML = function (item, allEditors) {
                    // Creates the output row with the input controls for different types
                    var $row = $(document.createElement("div"))
                        .addClass("ann-dlg-property");
                    // Check if we just need to add one element
                    var isSingleElement = false;
                    switch (item.htmlType) {
                        case HTMLType.label:
                        case HTMLType.input:
                        case HTMLType.integerInput:
                        case HTMLType.num:
                        case HTMLType.picture:
                        case HTMLType.dropdown:
                        case HTMLType.brush:
                            isSingleElement = true;
                            break;
                        case HTMLType.media:
                            isSingleElement = false;
                            break;
                    }
                    if (isSingleElement) {
                        var $label = $(document.createElement("label")).addClass("input-label")
                            .text(item.displayName)
                            .attr({
                            // Clicking the label with focus on the element we create
                            for: item.htmlId
                        });
                        var $element = null;
                        if (item.htmlType === HTMLType.label) {
                            // <input type="text" value=... />
                            $element = $(document.createElement("input")).attr({
                                type: "text",
                                value: item.defaultValue
                            });
                        }
                        else if (item.htmlType === HTMLType.input) {
                            // <input type="text" value=... onchange=... />
                            $element = $(document.createElement("input"))
                                .attr({
                                type: "text",
                                value: item.defaultValue
                            });
                            $element.on("change", function () {
                                PropertiesPage._update(allEditors, -1, $element.val());
                            });
                        }
                        else if (item.htmlType === HTMLType.integerInput) {
                            // <input type="number" value=... onchange=... onkeypress=... />
                            $element = $(document.createElement("input"))
                                .attr({
                                type: "number",
                                value: item.defaultValue
                            });
                            $element.on("keypress", function (e) {
                                PropertiesPage.validateNumericKey(e);
                            });
                            $element.on("change", function () {
                                PropertiesPage._update(allEditors, -1, $element.val());
                            });
                        }
                        else if (item.htmlType === HTMLType.num) {
                            // <input type="number" value=... onchange=... />
                            $element = $(document.createElement("input"))
                                .attr({
                                type: "text",
                                value: item.defaultValue
                            });
                            $element.on("change", function () {
                                PropertiesPage._update(allEditors, -1, $element.val());
                            });
                        }
                        else if (item.htmlType === HTMLType.picture) {
                            // <input type="number" value=... onchange=... />
                            $label.text($label.text() + " URL");
                            var source = "";
                            if (item.defaultValue) {
                                source = item.defaultValue.get_source();
                            }
                            $element = $(document.createElement("input"))
                                .attr({
                                type: "text",
                                value: source
                            });
                            $element.on("change", function () {
                                var val = $element.val();
                                PropertiesPage._update(allEditors, -1, !val ? null : new lt.Annotations.Engine.AnnPicture(val));
                            });
                        }
                        else if (item.htmlType === HTMLType.dropdown) {
                            // <select onchange=... > </select>
                            $element = $(document.createElement("div")).addClass("dropdown").attr("title", item.displayName);
                            var $select = $(document.createElement("select")).addClass("dropdown-button");
                            var $span = $(document.createElement("span")).addClass("dropdown-indicator");
                            $select.on("change", function () {
                                PropertiesPage._update(allEditors, -1, $select.val());
                            });
                            $element.append($select);
                            $element.append($span);
                            // Create the <option> elements
                            if (item.dropdownFields && item.dropdownFields.length) {
                                $select.append($(document.createElement("option")).val(item.displayName).text(item.displayName).attr("disabled", ""));
                                var defaultValue = item.defaultValue.toString().toLowerCase();
                                item.dropdownFields.forEach(function (value) {
                                    var $option = $(document.createElement("option")).val(value).text(value);
                                    // Mark the default as selected
                                    if (defaultValue === value.toLowerCase())
                                        $option.attr("selected", "");
                                    $select.append($option);
                                });
                            }
                        }
                        else if (item.htmlType === HTMLType.brush) {
                            $element = $(document.createElement("div")).addClass("dropdown").attr("title", item.displayName);
                            var $button = $(document.createElement("button"));
                            $button.html('Fill Dialog ...');
                            $button.on("click", function () {
                                var hideSelector = ".dlg-close, .dlg-close-x";
                                var brushDialog = new Annotations.BrushDialog($("#brushDialog"), {
                                    solidBrush: {
                                        tab: "#brushDlg_solidBrushTab",
                                        page: "#brushDlg_solidBrushPage"
                                    },
                                    hatchBrush: {
                                        tab: "#brushDlg_hatchBrushTab",
                                        page: "#brushDlg_hatchBrushPage"
                                    },
                                    linearGradientBrush: {
                                        tab: "#brushDlg_linearGradientBrushTab",
                                        page: "#brushDlg_linearGradientBrushPage"
                                    },
                                    hide: hideSelector
                                });
                                brushDialog.allEditors = allEditors;
                                var brushEditor = item.editor;
                                if (brushEditor != null) {
                                    brushDialog.brush = brushEditor.annBrush;
                                }
                                brushDialog.show();
                            });
                            $element.append($button);
                        }
                        if ($label)
                            $row.append($label);
                        // Add ID and class, then append
                        $element.attr({
                            id: item.htmlId
                        });
                        $element.addClass("ann-dlg-value");
                        $row.append($element);
                    }
                    else if (item.htmlType === HTMLType.media) {
                        // 3 <label> and 3 <input>
                        var sources = [
                            (item.defaultValue && item.defaultValue.source1) || "",
                            (item.defaultValue && item.defaultValue.source2) || "",
                            (item.defaultValue && item.defaultValue.source3) || ""
                        ];
                        sources.forEach(function (source, index) {
                            var id = item.htmlId + "_" + index;
                            var $label = $(document.createElement("label")).addClass("input-label")
                                .text("URL " + (index + 1))
                                .attr({
                                // Clicking the label with focus on the element we create
                                for: id
                            });
                            var $element = $(document.createElement("input"))
                                .attr({
                                id: id,
                                type: "text",
                                value: source
                            });
                            $element.on("change", function () {
                                var val = $element.val();
                                PropertiesPage._update(allEditors, index + 1, $element.val());
                            });
                            var $container = $(document.createElement("div")).addClass("ann-dlg-property");
                            $container.append($label).append($element);
                            $row.append($container);
                        });
                    }
                    return $row;
                };
                PropertiesPage.validateNumericKey = function (event) {
                    var keyEvent = (event || window.event);
                    var key = keyEvent.keyCode || keyEvent.which;
                    switch (key) {
                        case 8:
                        case 37:
                        case 39:
                        case 46:
                            return;
                    }
                    key = parseFloat(String.fromCharCode(key).toString());
                    var regex = /[0-9]/;
                    if (!regex.test(key.toString())) {
                        if (keyEvent.preventDefault) {
                            keyEvent.preventDefault();
                        }
                    }
                };
                PropertiesPage._update = function (editors, mediaIndex, value) {
                    var didWarnNumber = false;
                    for (var i = 0; i < editors.length; i++) {
                        var editor = editors[i];
                        if (mediaIndex && mediaIndex > 0) {
                            var media = editor.value;
                            switch (mediaIndex) {
                                case 1:
                                    media.source1 = value;
                                    break;
                                case 2:
                                    media.source2 = value;
                                    break;
                                case 3:
                                    media.source3 = value;
                                    break;
                            }
                            value = media;
                        }
                        var change = true;
                        if (editor instanceof Annotations.AnnDoubleEditor && isNaN(value) && !didWarnNumber) {
                            didWarnNumber = true;
                            alert("Insert numeric value");
                            change = false;
                        }
                        if (change) {
                            // This triggers a callback, if value exists
                            editor["value"] = value;
                            //fire back to handler
                            if (PropertiesPage.onPropertiesChanged != null) {
                                PropertiesPage.onPropertiesChanged(value, editor);
                            }
                        }
                    }
                };
                PropertiesPage.prototype.clear = function () {
                    this._groups = [];
                    this._tabs.forEach(function (tab) {
                        tab.groups = [];
                    });
                    this._tabHolder.empty().removeClass("dlg-tabs-0 dlg-tabs-1 dlg-tabs-2 dlg-tabs-3 dlg-tabs-4 dlg-tabs-5 dlg-tabs-plus");
                    this._pageHolder.empty();
                };
                return PropertiesPage;
            }());
            Annotations.PropertiesPage = PropertiesPage;
            var HTMLType;
            (function (HTMLType) {
                HTMLType[HTMLType["label"] = 0] = "label";
                HTMLType[HTMLType["input"] = 1] = "input";
                HTMLType[HTMLType["dropdown"] = 2] = "dropdown";
                HTMLType[HTMLType["num"] = 3] = "num";
                HTMLType[HTMLType["picture"] = 4] = "picture";
                HTMLType[HTMLType["integerInput"] = 5] = "integerInput";
                HTMLType[HTMLType["brush"] = 6] = "brush";
                HTMLType[HTMLType["media"] = 7] = "media";
            })(HTMLType = Annotations.HTMLType || (Annotations.HTMLType = {}));
            var Tab = /** @class */ (function () {
                function Tab(tabName) {
                    this.tabName = tabName;
                    this.groups = [];
                }
                return Tab;
            }());
            var Group = /** @class */ (function () {
                function Group(groupName) {
                    this.groupName = groupName;
                    this.itemsByPropName = [];
                }
                return Group;
            }());
            var PropertyItem = /** @class */ (function () {
                function PropertyItem(propertyName, htmlType, dropdownFields, editor, defaultValue, displayName) {
                    this.propertyName = propertyName;
                    this.displayName = displayName;
                    this.htmlType = htmlType;
                    this.defaultValue = defaultValue;
                    this.dropdownFields = dropdownFields;
                    this.editor = editor;
                    this.htmlId = 'pg1_item_' + PropertyItem._index;
                    PropertyItem._index++;
                }
                PropertyItem._index = 0;
                return PropertyItem;
            }());
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var ReviewsPage = /** @class */ (function () {
                function ReviewsPage($propertiesPage) {
                    var _this = this;
                    this._userName = "";
                    this.date = new Date();
                    this.pageUI = {
                        //page: "reviewsPageDiv", /* The whole page */
                        header: "reviewsHeader",
                        content: "reviewsContnetText",
                        details: "detailsDiv",
                        author: "authorTextInput",
                        day: "dayInput",
                        month: "monthInput",
                        year: "yearInput",
                        status: "statusMenu",
                        checked: "isCheckedBox",
                        comment: "commentTextArea",
                        reply: "replyNode",
                        add: "addNode",
                        deleteBtn: "deleteNode",
                        treeView: "treeViewDiv",
                    };
                    this.empty = function () {
                        _this._pageElement.empty();
                        //document.getElementById(this.pageUI.page).innerHTML = '';
                    };
                    this.createUIElement = function () {
                        var htmlText = "";
                        htmlText += "<div class='ann-tree'>";
                        // Header
                        htmlText += "<div class='ann-tree-header'>";
                        htmlText += "<h3 id='" + _this.pageUI.header + "'>By [Author] at [Date]</h3>";
                        htmlText += "<textarea class='ann-tree-textarea' id='" + _this.pageUI.content + "' disabled='disabled'></textarea>";
                        htmlText += "<div class='ann-tree-controls'>";
                        htmlText += "<button id='" + _this.pageUI.add + "' type='button' title='Add New'>Add New</button>";
                        htmlText += "<button id='" + _this.pageUI.reply + "' type='button' title='Reply to Selected'>Reply to Selected</button>";
                        htmlText += "<button id='" + _this.pageUI.deleteBtn + "' type='button' title='Delete Selected'>Delete Selected</button>";
                        htmlText += "</div>";
                        htmlText += "<div class='ann-tree-view' id='" + _this.pageUI.treeView + "'></div>";
                        htmlText += "</div>";
                        // Details
                        htmlText += "<div class='ann-tree-details' id='" + _this.pageUI.details + "'>";
                        htmlText += "<h3>Details</h3>";
                        htmlText += "<input class='ann-tree-details-long' id='" + _this.pageUI.author + "' type='text' placeholder='Author' title='Author'>";
                        htmlText += "<div class='ann-tree-date'>";
                        htmlText += "<input id='" + _this.pageUI.day + "' type='text' placeholder='Day' title='Day'>";
                        htmlText += "<input id='" + _this.pageUI.month + "' type='text' placeholder='Month' title='Month'>";
                        htmlText += "<input id='" + _this.pageUI.year + "' type='text' placeholder='Year' title='Year'>";
                        htmlText += "</div>";
                        htmlText += "<div class='dropdown ann-tree-details-status' title='Status'>";
                        htmlText += "<select class='dropdown-button' id='" + _this.pageUI.status + "' >";
                        htmlText += "<option value='Status' disabled>Status</option>";
                        htmlText += "<option value='Accepted'>Accepted</option>";
                        htmlText += "<option value='Cancelled'>Cancelled</option>";
                        htmlText += "<option value='Completed'>Completed</option>";
                        htmlText += "<option value='Created'>Created</option>";
                        htmlText += "<option value='Modified'>Modified</option>";
                        htmlText += "<option value='None'>None</option>";
                        htmlText += "<option value='Rejected'>Rejected</option>";
                        htmlText += "<option value='Reply' selected>Reply</option>";
                        htmlText += "</select>";
                        htmlText += "<span class='dropdown-indicator'></span>";
                        htmlText += "</div>";
                        htmlText += "<div>";
                        htmlText += "<label for='" + _this.pageUI.checked + "' class='input-label'>Checked</label>";
                        htmlText += "<input id='" + _this.pageUI.checked + "' type='checkbox' class='custom-check' />";
                        htmlText += "<label class='custom-check' for='" + _this.pageUI.checked + "'></label>";
                        htmlText += "</div>";
                        htmlText += "<textarea class='ann-tree-textarea' id='" + _this.pageUI.comment + "' placeholder='Comment'></textarea>";
                        htmlText += "</div>";
                        htmlText += "</div>";
                        _this._pageElement.html(htmlText);
                        //document.getElementById(this.pageUI.page).innerHTML = htmlText;
                    };
                    this.treeView_SelectionChanged = function (ev) {
                        _this.updateUIState();
                        _this.reviewToDetails();
                    };
                    this._pageElement = $propertiesPage;
                }
                Object.defineProperty(ReviewsPage.prototype, "userName", {
                    get: function () { return this._userName; },
                    set: function (value) { this._userName = value; },
                    enumerable: false,
                    configurable: true
                });
                ReviewsPage.prototype.initialize = function () {
                    this.empty();
                    this.createUIElement();
                    this.addUIEventHandler();
                    this.treeView = new Annotations.TreeView("treeViewDiv");
                    this.treeView.onSelectionChanged = this.treeView_SelectionChanged;
                    this.treeView_SelectionChanged(null);
                };
                ReviewsPage.prototype.addUIEventHandler = function () {
                    $("#" + this.pageUI.author).on("change", this.detailsTextBox_TextChanged.bind(this));
                    $("#" + this.pageUI.day).on("change", this.dateTimePicker_ValueChanged.bind(this));
                    $("#" + this.pageUI.month).on("change", this.dateTimePicker_ValueChanged.bind(this));
                    $("#" + this.pageUI.year).on("change", this.dateTimePicker_ValueChanged.bind(this));
                    $("#" + this.pageUI.status).on("change", this.detailsTextBox_TextChanged.bind(this));
                    $("#" + this.pageUI.checked).on("change", this.checkedCheckBox_ValueChanged.bind(this));
                    $("#" + this.pageUI.comment).on("change", this.detailsTextBox_TextChanged.bind(this));
                    $("#" + this.pageUI.reply).on("click", this.replyNode_Click.bind(this));
                    $("#" + this.pageUI.add).on("click", this.addNode_Click.bind(this));
                    $("#" + this.pageUI.deleteBtn).on("click", this.deleteNode_Click.bind(this));
                };
                ReviewsPage.prototype.copyReviewsFrom = function (annObject, annContainer) {
                    if (annObject == null)
                        throw new Error("annObject cannot be null");
                    // Add the content (if available)
                    this.updateContent(annObject, annContainer);
                    for (var i = 0; i < annObject.reviews.length; i++) {
                        lt.Demos.Annotations.ReviewsPage.addNode(this.treeView, null, true, annObject.reviews[i]);
                    }
                    this.updateUIState();
                };
                ReviewsPage.prototype.updateContent = function (annObject, annContainer) {
                    var metadata = annObject.metadata;
                    var author = "";
                    if (metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey] != undefined || metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey] != null) //if Contains
                        author = metadata[lt.Annotations.Engine.AnnObject.authorMetadataKey];
                    if (!author)
                        author = "[author]";
                    var lastModified = "";
                    if (metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey] != undefined || metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey] != null) //if Contains
                        lastModified = Annotations.AnnObjectTreeNode.toLocalTimeString(metadata[lt.Annotations.Engine.AnnObject.modifiedMetadataKey]);
                    if (!lastModified)
                        lastModified = "[date]";
                    var headerText = "By " + author + " at " + lastModified;
                    if (!annContainer.isEnabled)
                        headerText += " (Disabled)";
                    $("#" + this.pageUI.header).text(headerText);
                    var text = "";
                    if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(annObject)) {
                        var textObject = annObject;
                        text = textObject.text;
                    }
                    else {
                        // Get it from the content
                        if (metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] != undefined || metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey] != null) //if Contains
                            text = metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey];
                    }
                    $("#" + this.pageUI.content).val(text);
                };
                ReviewsPage.prototype.replacesReviewsIn = function (annObject) {
                    if (annObject == null)
                        throw new Error("annObject cannot be null");
                    annObject.reviews.splice(0, annObject.reviews.length); //Clear Items
                    for (var i = 0; i < this.treeView.nodes.length; i++) {
                        lt.Demos.Annotations.ReviewsPage.getNode(this.treeView, this.treeView.nodes[i], annObject, null);
                    }
                };
                ReviewsPage.getNode = function (treeView, node, annObject, parentReview) {
                    var nodeReview = node != null ? node.tag : null;
                    var review = nodeReview != null ? nodeReview.clone() : null;
                    for (var i = 0; i < node.nodes.length; i++) {
                        lt.Demos.Annotations.ReviewsPage.getNode(treeView, node.nodes[i], annObject, review);
                    }
                    if (parentReview != null)
                        parentReview.replies.push(review);
                    else
                        annObject.reviews.push(review);
                };
                ReviewsPage.addNode = function (treeView, relativeNode, sibling, review) {
                    var node = new Annotations.TreeNode(treeView);
                    // add a copy so we don't change the original reviews if the user cancels
                    node.tag = review != null ? review.clone() : null;
                    review = node.tag;
                    for (var i = 0; i < review.replies.length; i++) {
                        lt.Demos.Annotations.ReviewsPage.addNode(treeView, node, true, review.replies[i]);
                    }
                    // Clean its replies, we don't need them here
                    review.replies.splice(0, review.replies.length);
                    if (sibling) {
                        if (relativeNode != null)
                            relativeNode.addNode(node);
                        else
                            treeView.addNode(node);
                    }
                    else {
                        if (relativeNode != null) {
                            if (relativeNode.parent != null)
                                relativeNode.parent.addNode(node);
                            else
                                treeView.addNode(node);
                        }
                        else {
                            treeView.addNode(node);
                        }
                    }
                    var label = document.createElement("label");
                    label.className = label.className + "treeNodeLabel";
                    label.textContent = this.getReviewNodeText(review);
                    node.content = label;
                    return node;
                };
                ReviewsPage.getReviewNodeText = function (review) {
                    var text = "";
                    if (!review)
                        return text;
                    var author = review.author || "[author]";
                    var dateString = ReviewsPage._monthArray[review.date.getMonth()] + " " + review.date.getDate();
                    if (review.date.getFullYear() !== (new Date()).getFullYear())
                        dateString += " " + review.date.getFullYear();
                    text += author + " (" + dateString + "): " + review.status;
                    if (review.comment)
                        text += " - " + review.comment;
                    return text;
                };
                ReviewsPage.prototype.updateUIState = function () {
                    var disabled = !this.treeView.selectedNode;
                    $("#" + this.pageUI.reply).prop("disabled", disabled);
                    $("#" + this.pageUI.deleteBtn).prop("disabled", disabled);
                    $("#" + this.pageUI.reply).prop("disabled", disabled);
                    $("#" + this.pageUI.details).prop("disabled", disabled);
                    $("#" + this.pageUI.comment).prop("disabled", disabled);
                };
                ReviewsPage.prototype.replyNode_Click = function () {
                    this.addOrReply(this.treeView.selectedNode, true);
                };
                ReviewsPage.prototype.addNode_Click = function () {
                    this.addOrReply(null, false);
                };
                ReviewsPage.prototype.deleteNode_Click = function () {
                    this.deleteReview(this.treeView.selectedNode);
                };
                ReviewsPage.prototype.deleteReview = function (node) {
                    if (node == null)
                        return;
                    // Remove it from its parent
                    if (node.parent != null) {
                        var parentReview = node.parent.tag;
                        node.parent.deleteNode(node);
                    }
                    else
                        this.treeView.deleteNode(node);
                    this.updateUIState();
                    this.reviewToDetails();
                };
                ReviewsPage.prototype.addOrReply = function (parentNode, isReply) {
                    // add after selected
                    var review = new lt.Annotations.Engine.AnnReview();
                    review.author = this._userName;
                    review.date = this.date;
                    review.status = lt.Annotations.Engine.AnnReview.reply;
                    review.comment = "";
                    var newNode = lt.Demos.Annotations.ReviewsPage.addNode(this.treeView, parentNode, isReply, review);
                    this.treeView.selectedNode = newNode;
                    if (parentNode && isReply)
                        parentNode.setCollapsed(false);
                    this.updateUIState();
                    this.reviewToDetails();
                };
                ReviewsPage.prototype.detailsTextBox_TextChanged = function () {
                    this.detailsToReview();
                };
                ReviewsPage.prototype.checkedCheckBox_ValueChanged = function () {
                    this.detailsToReview();
                };
                ReviewsPage.prototype.dateTimePicker_ValueChanged = function () {
                    this.detailsToReview();
                };
                ReviewsPage.prototype.reviewToDetails = function () {
                    var node = this.treeView.selectedNode;
                    var review = node != null ? node.tag : null;
                    var disable = !node;
                    $("#" + this.pageUI.details).prop("disabled", disable);
                    $("#" + this.pageUI.author).val(review != null ? review.author : "").prop("disabled", disable);
                    var date = review != null ? review.date : this.date;
                    $("#" + this.pageUI.day).val(date.getDate().toString()).prop("disabled", disable);
                    $("#" + this.pageUI.month).val((date.getMonth() + 1).toString()).prop("disabled", disable); //month zero based
                    $("#" + this.pageUI.year).val(date.getFullYear().toString()).prop("disabled", disable);
                    var statusSelectMenu = $("#" + this.pageUI.status);
                    statusSelectMenu.prop("disabled", disable);
                    statusSelectMenu.prop("selectedIndex", this.getStatusSelectIndex(!!review ? review.status : "accepted"));
                    $("#" + this.pageUI.checked).prop("disabled", disable);
                    var isCheckedBox = document.getElementById(this.pageUI.checked);
                    if (review != null) {
                        isCheckedBox.checked = review.isChecked;
                    }
                    else {
                        isCheckedBox.checked = false;
                    }
                    $("#" + this.pageUI.comment).val(review != null ? review.comment : "").prop("disabled", disable);
                };
                ReviewsPage.prototype.detailsToReview = function () {
                    var node = this.treeView.selectedNode;
                    if (node == null)
                        return;
                    var review = node.tag;
                    var author = $("#" + this.pageUI.author).val();
                    var year = $("#" + this.pageUI.year).val();
                    if (year < 1900 || isNaN(year)) {
                        alert("Please Enter Valid Value");
                        year = 2014;
                    }
                    var month = $("#" + this.pageUI.month).val();
                    if (month < 1 || month > 12 || isNaN(month)) {
                        alert("Please Enter Valid Value");
                        month = 1;
                    }
                    else {
                        month -= 1; //month zero based
                    }
                    var day = $("#" + this.pageUI.day).val();
                    if (day < 1 || day > 31 || isNaN(day)) {
                        alert("Please Enter Valid Value");
                        day = 1;
                    }
                    var date = new Date(year, month, day);
                    var status = $("#" + this.pageUI.status).val() == null ? "Reply" : $("#" + this.pageUI.status).val();
                    var isCheckedBox = document.getElementById(this.pageUI.checked);
                    var isChecked = isCheckedBox.checked;
                    var comment = $("#" + this.pageUI.comment).val();
                    if (review != null) {
                        if (review.author != author)
                            review.author = author;
                        if (review.date != date)
                            review.date = date;
                        if (review.status.toLowerCase() != status)
                            review.status = status;
                        if (review.isChecked != isChecked)
                            review.isChecked = isChecked;
                        if (review.comment != comment)
                            review.comment = comment;
                    }
                    var label = document.createElement("label");
                    label.className = label.className + "treeNodeLabel";
                    label.textContent = lt.Demos.Annotations.ReviewsPage.getReviewNodeText(review);
                    node.content = label;
                };
                ReviewsPage.prototype.getStatusSelectIndex = function (value) {
                    switch (value) {
                        case "accepted":
                            return 1;
                        case "cancelled":
                            return 2;
                        case "completed":
                            return 3;
                        case "created":
                            return 4;
                        case "modified":
                            return 5;
                        case "none":
                            return 6;
                        case "rejected":
                            return 7;
                        case "reply":
                            return 8;
                        default:
                            return 8;
                    }
                };
                ReviewsPage.prototype.cleanUp = function () {
                    $(this.pageUI.treeView).empty();
                    $(this.pageUI.treeView).remove();
                };
                ReviewsPage._monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return ReviewsPage;
            }());
            Annotations.ReviewsPage = ReviewsPage;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var SnapToGridPropertiesDialog = /** @class */ (function () {
                function SnapToGridPropertiesDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._onHideClicked = function () {
                        if (_this.onHide)
                            _this.onHide();
                        _this.inner.hide();
                    };
                    this._onApplyClicked = function (e) {
                        var opts = _this._snapToGridOptions;
                        opts.showGrid = _this.el.showGridCheckbox.prop("checked");
                        opts.gridStroke.stroke = lt.Annotations.Engine.AnnSolidColorBrush.create(_this.el.gridColorSelect.val());
                        if (_this.el.lineStyleSelect.val().toUpperCase() !== "DASH")
                            opts.gridStroke.strokeDashArray = null;
                        else
                            opts.gridStroke.strokeDashArray = [4, 4];
                        opts.gridLength = parseInt(_this.el.gridLength.val(), 10);
                        if (isNaN(opts.gridLength) || opts.gridLength > SnapToGridPropertiesDialog.gridLengthMax || opts.gridLength < SnapToGridPropertiesDialog.gridLengthMin) {
                            alert("Value for Grid Length is invalid or outside of the acceptable range.");
                            return;
                        }
                        opts.lineSpacing = parseInt(_this.el.lineSpacing.val(), 10);
                        if (isNaN(opts.lineSpacing) || opts.lineSpacing > SnapToGridPropertiesDialog.lineSpacingMax || opts.lineSpacing < SnapToGridPropertiesDialog.lineSpacingMin) {
                            alert("Value for Line Spacing is invalid or outside of the acceptable range.");
                            return;
                        }
                        opts.enableSnap = _this.el.enableSnapCheckbox.prop("checked");
                        _this._automation.manager.snapToGridOptions = opts.clone();
                        if (_this.onHide)
                            _this.onHide();
                        _this.inner.hide();
                    };
                    this.el = lt.Demos.Utils.findSelectorsInRoot(root, selectors);
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    this.el.apply.bind("click", this._onApplyClicked);
                }
                Object.defineProperty(SnapToGridPropertiesDialog.prototype, "automation", {
                    get: function () {
                        return this._automation;
                    },
                    set: function (value) {
                        this._automation = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                SnapToGridPropertiesDialog.prototype.show = function () {
                    var opts = this._automation.manager.snapToGridOptions.clone();
                    this._snapToGridOptions = opts;
                    this.el.showGridCheckbox.prop("checked", opts.showGrid);
                    this.el.lineSpacing.val(opts.lineSpacing.toString());
                    this.el.gridLength.val(opts.gridLength.toString());
                    this.el.gridColorSelect.val(this.getSelectedColorFromStroke(opts.gridStroke));
                    this.el.lineStyleSelect.val(this.getLineStyleFromStroke(opts.gridStroke));
                    this.el.enableSnapCheckbox.prop("checked", opts.enableSnap);
                    this.inner.show();
                };
                SnapToGridPropertiesDialog.prototype.getLineStyleFromStroke = function (annStroke) {
                    return !!annStroke.strokeDashArray ? "Dash" : "Solid";
                };
                SnapToGridPropertiesDialog.prototype.getSelectedColorFromStroke = function (annStroke) {
                    var color = annStroke.stroke.color;
                    return color[0].toUpperCase() + color.substring(1).toLowerCase();
                };
                SnapToGridPropertiesDialog.gridLengthMin = 5;
                SnapToGridPropertiesDialog.gridLengthMax = 999;
                SnapToGridPropertiesDialog.lineSpacingMin = 1;
                SnapToGridPropertiesDialog.lineSpacingMax = 1000;
                return SnapToGridPropertiesDialog;
            }());
            Annotations.SnapToGridPropertiesDialog = SnapToGridPropertiesDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AnnCursorType;
            (function (AnnCursorType) {
                AnnCursorType[AnnCursorType["selectObject"] = 0] = "selectObject";
                AnnCursorType[AnnCursorType["selectedObject"] = 1] = "selectedObject";
                AnnCursorType[AnnCursorType["controlPoint"] = 2] = "controlPoint";
                AnnCursorType[AnnCursorType["controlPointNWSE"] = 3] = "controlPointNWSE";
                AnnCursorType[AnnCursorType["controlPointNS"] = 4] = "controlPointNS";
                AnnCursorType[AnnCursorType["controlPointNESW"] = 5] = "controlPointNESW";
                AnnCursorType[AnnCursorType["controlPointWE"] = 6] = "controlPointWE";
                AnnCursorType[AnnCursorType["selectRectangle"] = 7] = "selectRectangle";
                AnnCursorType[AnnCursorType["run"] = 8] = "run";
                AnnCursorType[AnnCursorType["rotateCenterControlPoint"] = 9] = "rotateCenterControlPoint";
                AnnCursorType[AnnCursorType["rotateGripperControlPoint"] = 10] = "rotateGripperControlPoint";
                AnnCursorType[AnnCursorType["Default"] = 11] = "Default";
                AnnCursorType[AnnCursorType["count"] = 12] = "count";
            })(AnnCursorType = Annotations.AnnCursorType || (Annotations.AnnCursorType = {}));
            var AutomationManagerHelper = /** @class */ (function () {
                function AutomationManagerHelper(manager, resourcesPath) {
                    // The path to the resources. This is thee default value. Will replace all ##RESOURCES_PATH## in the code
                    this._resourcesPath = "../Resources";
                    this._drawCursors = {};
                    this._objectsImages = {};
                    if (manager == null)
                        alert("Error, AnnAutomationManager is null");
                    this._manager = manager;
                    if (this._manager.renderingEngine == null) {
                        this._manager.renderingEngine = new lt.Annotations.Rendering.AnnHtml5RenderingEngine();
                    }
                    var cursors = AutomationManagerHelper._automationCursors;
                    cursors[AnnCursorType.controlPoint] = "url('##RESOURCES_PATH##/Cursors/Edit/ControlPoint.cur'),default";
                    cursors[AnnCursorType.rotateCenterControlPoint] = "url('##RESOURCES_PATH##/Cursors/Edit/Anchor.cur'), default";
                    cursors[AnnCursorType.rotateGripperControlPoint] = "url('##RESOURCES_PATH##/Cursors/Edit/Rotate.cur'),default";
                    cursors[AnnCursorType.selectObject] = "url('##RESOURCES_PATH##/Cursors/Edit/SelectObject.cur'), default";
                    cursors[AnnCursorType.selectedObject] = "url('##RESOURCES_PATH##/Cursors/Edit/SelectedObject.cur'),default";
                    cursors[AnnCursorType.run] = "pointer";
                    // Update the resources
                    this.updateResourcePaths(resourcesPath);
                    // To track modifier keys
                    if (lt.LTHelper.supportsMouse) {
                        // Tell lt.Controls.InteractiveService to listen for modifier keys even if no ImageViewer exists
                        lt.Controls.InteractiveService.registerGlobalModifierKeys();
                        // Initialize the platform callbacks
                        var callbacks = lt.Annotations.Automation.AnnAutomationManager.platformCallbacks;
                        callbacks.checkModifier = AutomationManagerHelper.checkModifierKey;
                    }
                    this.updateAutomationObjects();
                }
                Object.defineProperty(AutomationManagerHelper.prototype, "automationManager", {
                    get: function () {
                        return this._manager;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationManagerHelper.prototype, "drawCursors", {
                    get: function () {
                        return this._drawCursors;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationManagerHelper.prototype, "automationCursors", {
                    get: function () {
                        return AutomationManagerHelper._automationCursors;
                    },
                    enumerable: false,
                    configurable: true
                });
                AutomationManagerHelper.prototype.updateResourcePaths = function (resourcesPath) {
                    for (var key in AutomationManagerHelper._drawCursorsTemplate) {
                        var originalValue = AutomationManagerHelper._drawCursorsTemplate[key];
                        var thisValue = originalValue.replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                        this._drawCursors[key] = thisValue;
                    }
                    for (var key in AutomationManagerHelper._objectsImagesTemplate) {
                        var originalValue = AutomationManagerHelper._objectsImagesTemplate[key];
                        var thisValue = originalValue.replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                        this._objectsImages[key] = thisValue;
                    }
                    AutomationManagerHelper._automationCursors[AnnCursorType.controlPoint] = AutomationManagerHelper._automationCursors[AnnCursorType.controlPoint].replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                    AutomationManagerHelper._automationCursors[AnnCursorType.rotateCenterControlPoint] = AutomationManagerHelper._automationCursors[AnnCursorType.rotateCenterControlPoint].replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                    AutomationManagerHelper._automationCursors[AnnCursorType.rotateGripperControlPoint] = AutomationManagerHelper._automationCursors[AnnCursorType.rotateGripperControlPoint].replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                    AutomationManagerHelper._automationCursors[AnnCursorType.selectObject] = AutomationManagerHelper._automationCursors[AnnCursorType.selectObject].replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                    AutomationManagerHelper._automationCursors[AnnCursorType.selectedObject] = AutomationManagerHelper._automationCursors[AnnCursorType.selectedObject].replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                    Annotations.ReviewTreeNode.undoImageUrl = AutomationManagerHelper._undoImageUrlTemplate.replace(AutomationManagerHelper._resourcesTamplate, resourcesPath);
                };
                AutomationManagerHelper.prototype.initAutomationDefaultRendering = function () {
                    var renderers = this._manager.renderingEngine.renderers;
                    if (renderers) {
                        // Update all renderers to use custom styles for the control points of the automations
                        var smallDiameter = 72;
                        var smallThumbSize = lt.LeadSizeD.create(smallDiameter, smallDiameter);
                        var bigDiameter = smallDiameter * 7 / 4;
                        var bigThumbSize = lt.LeadSizeD.create(bigDiameter, bigDiameter);
                        var locationFill = lt.Annotations.Engine.AnnSolidColorBrush.create("rgba(157, 202, 242, .7)");
                        var locationStroke = lt.Annotations.Engine.AnnStroke.create(lt.Annotations.Engine.AnnSolidColorBrush.create("rgba(35, 110, 128, .9)"), lt.LeadLengthD.create(1));
                        var rotateFill = lt.Annotations.Engine.AnnSolidColorBrush.create("rgba(136, 216, 141, .7)");
                        var rotateStroke = lt.Annotations.Engine.AnnStroke.create(lt.Annotations.Engine.AnnSolidColorBrush.create("rgba(37, 168, 43, .9)"), lt.LeadLengthD.create(1));
                        var locationThumbStyle = new lt.Annotations.Rendering.AnnRectangleThumbStyle();
                        locationThumbStyle.size = bigThumbSize;
                        locationThumbStyle.stroke = locationStroke;
                        locationThumbStyle.fill = locationFill;
                        var rotateCenterThumbStyle = new lt.Annotations.Rendering.AnnEllipseThumbStyle();
                        rotateCenterThumbStyle.size = smallThumbSize;
                        rotateCenterThumbStyle.stroke = rotateStroke;
                        rotateCenterThumbStyle.fill = rotateFill;
                        var rotateGripperThumbStyle = new lt.Annotations.Rendering.AnnEllipseThumbStyle();
                        rotateGripperThumbStyle.size = bigThumbSize;
                        rotateGripperThumbStyle.stroke = rotateStroke;
                        rotateGripperThumbStyle.fill = rotateFill;
                        var keys = Object.keys(renderers);
                        keys.forEach(function (key) {
                            var renderer = renderers[key];
                            renderer.locationsThumbStyle = locationThumbStyle;
                            renderer.rotateCenterThumbStyle = rotateCenterThumbStyle;
                            renderer.rotateGripperThumbStyle = rotateGripperThumbStyle;
                        });
                    }
                    var objects = this._manager.objects;
                    if (objects) {
                        for (var i = 0; i < objects.count; i++) {
                            var automationObject = objects.item(i);
                            if (!automationObject || !automationObject.objectTemplate)
                                continue;
                            var template = automationObject.objectTemplate;
                            switch (template.id) {
                                case lt.Annotations.Engine.AnnObject.selectObjectId:
                                    var ob = template;
                                    var selectionStroke = lt.Annotations.Engine.AnnStroke.create(lt.Annotations.Engine.AnnSolidColorBrush.create("rgba(50, 50, 50, .7)"), lt.LeadLengthD.create(1));
                                    selectionStroke.strokeDashArray = [4, 2, 2, 2, 2, 2];
                                    ob.selectionStroke = selectionStroke;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                };
                AutomationManagerHelper.prototype.updateAutomationObjects = function () {
                    if (this._manager == null)
                        return;
                    for (var i = 0; i < this._manager.objects.count; i++) {
                        var automationObject = this._manager.objects.item(i);
                        AutomationManagerHelper.updateAutomationObject(automationObject);
                    }
                };
                AutomationManagerHelper.updateAutomationObject = function (automationObject) {
                    if (automationObject.objectTemplate != null && automationObject.objectTemplate.supportsFill && automationObject.objectTemplate.fill == null)
                        automationObject.objectTemplate.fill = lt.Annotations.Engine.AnnSolidColorBrush.create("transparent");
                };
                // Gets the cursor for the automation object with this id
                AutomationManagerHelper.prototype.getAutomationObjectCursor = function (objectId) {
                    //don't add cursors for the these objects
                    if (objectId == lt.Annotations.Engine.AnnObject.imageObjectId)
                        return null;
                    if (objectId == lt.Annotations.Engine.AnnObject.textHiliteObjectId ||
                        objectId == lt.Annotations.Engine.AnnObject.textStrikeoutObjectId ||
                        objectId == lt.Annotations.Engine.AnnObject.textUnderlineObjectId ||
                        objectId == lt.Annotations.Engine.AnnObject.textRedactionObjectId)
                        return "text";
                    if (objectId == lt.Annotations.Engine.AnnObject.stickyNoteObjectId)
                        return "crosshair";
                    var annObject = this._manager.findObjectById(objectId);
                    if (annObject != null) {
                        return this._drawCursors[objectId.toString()];
                    }
                    return null;
                };
                AutomationManagerHelper.prototype.getAutomationObjectImage = function (objectId) {
                    var annObject = this._manager.findObjectById(objectId);
                    if (annObject != null) {
                        return this._objectsImages[objectId.toString()];
                    }
                    return null;
                };
                AutomationManagerHelper.checkModifierKey = function (annKey) {
                    // Map the AnnKeys to our lt.Controls modifier keys so we don't have to listen for keyup/keydown ourself.
                    var AnnKeys = lt.Annotations.Engine.AnnKeys;
                    var ControlsKeys = lt.Controls.Keys;
                    var ControlsModifierKeys = lt.Controls.InteractiveService.modifierKeys;
                    if ((annKey & AnnKeys.shift) == AnnKeys.shift)
                        return (ControlsModifierKeys & ControlsKeys.shift) === ControlsKeys.shift;
                    if ((annKey & lt.Annotations.Engine.AnnKeys.control) == lt.Annotations.Engine.AnnKeys.control)
                        return (ControlsModifierKeys & ControlsKeys.control) === ControlsKeys.control;
                    if ((annKey & lt.Annotations.Engine.AnnKeys.alt) == lt.Annotations.Engine.AnnKeys.alt)
                        return (ControlsModifierKeys & ControlsKeys.alt) === ControlsKeys.alt;
                    return false;
                };
                AutomationManagerHelper.prototype.loadPackage = function (annPackage) {
                    if (annPackage != null) {
                        // Update the automation objects as we load ...
                        var handler = this._manager.objects.collectionChanged.add(function (sender, e) {
                            if (e.action == lt.NotifyLeadCollectionChangedAction.add) {
                                for (var i = 0; i < e.newItems.length; i++)
                                    var automationObject = e.newItems[i];
                                AutomationManagerHelper.updateAutomationObject(automationObject);
                            }
                        });
                        this._manager.loadPackage(annPackage, annPackage.friendlyName);
                        this._manager.objects.collectionChanged.remove(handler);
                    }
                };
                AutomationManagerHelper._resourcesTamplate = "##RESOURCES_PATH##";
                AutomationManagerHelper._drawCursorsTemplate = {
                    "-2": "url('##RESOURCES_PATH##/Cursors/Draw/ToolLine.cur'),default",
                    "-3": "url('##RESOURCES_PATH##/Cursors/Draw/ToolRectangle.cur'),default",
                    "-4": "url('##RESOURCES_PATH##/Cursors/Draw/ToolEllipse.cur'),default",
                    "-5": "url('##RESOURCES_PATH##/Cursors/Draw/ToolPolyline.cur'),default",
                    "-6": "url('##RESOURCES_PATH##/Cursors/Draw/ToolPolygon.cur'),default",
                    "-7": "url('##RESOURCES_PATH##/Cursors/Draw/ToolCurve.cur'),default",
                    "-8": "url('##RESOURCES_PATH##/Cursors/Draw/ToolClosedCurve.cur'),default",
                    "-9": "url('##RESOURCES_PATH##/Cursors/Draw/ToolPointer.cur'),default",
                    "-10": "url('##RESOURCES_PATH##/Cursors/Draw/ToolFreehand.cur'),default",
                    "-11": "url('##RESOURCES_PATH##/Cursors/Draw/ToolHilite.cur'),default",
                    "-12": "url('##RESOURCES_PATH##/Cursors/Draw/ToolText.cur'),default",
                    "-14": "url('##RESOURCES_PATH##/Cursors/Draw/ToolTextPointer.cur'),default",
                    "-15": "url('##RESOURCES_PATH##/Cursors/Draw/ToolNote.cur'),default",
                    "-16": "url('##RESOURCES_PATH##/Cursors/Draw/ToolStamp.cur'),default",
                    "-17": "url('##RESOURCES_PATH##/Cursors/Draw/ToolRubberStamp.cur'),default",
                    "-18": "url('##RESOURCES_PATH##/Cursors/Draw/ToolHotspot.cur'),default",
                    "-19": "url('##RESOURCES_PATH##/Cursors/Draw/ToolFreehandHotspot.cur'),default",
                    "-21": "url('##RESOURCES_PATH##/Cursors/Draw/ToolPoint.cur'),default",
                    "-22": "url('##RESOURCES_PATH##/Cursors/Draw/ToolRedaction.cur'),default",
                    "-23": "url('##RESOURCES_PATH##/Cursors/Draw/ToolRuler.cur'),default",
                    "-24": "url('##RESOURCES_PATH##/Cursors/Draw/ToolPolyruler.cur'),default",
                    "-25": "url('##RESOURCES_PATH##/Cursors/Draw/ToolProtractor.cur'),default",
                    "-26": "url('##RESOURCES_PATH##/Cursors/Draw/ToolCrossProduct.cur'),default",
                    "-13": "url('##RESOURCES_PATH##/Cursors/Draw/ToolTextRollup.cur'),default",
                    "-28": "url('##RESOURCES_PATH##/Cursors/Draw/ToolAudio.cur'),default",
                    "-30": "url('##RESOURCES_PATH##/Cursors/Draw/ToolVideo.cur'),default",
                    "-27": "url('##RESOURCES_PATH##/Cursors/Draw/ToolEncrypt.cur'),default"
                };
                AutomationManagerHelper._objectsImagesTemplate = {
                    "-2": "##RESOURCES_PATH##/Images/Icons/Line.png",
                    "-3": "##RESOURCES_PATH##/Images/Icons/Rectangle.png",
                    "-4": "##RESOURCES_PATH##/Images/Icons/Circle.png",
                    "-5": "##RESOURCES_PATH##/Images/Icons/Polyline.png",
                    "-6": "##RESOURCES_PATH##/Images/Icons/Polygon.png",
                    "-7": "##RESOURCES_PATH##/Images/Icons/SCurve.png",
                    "-8": "##RESOURCES_PATH##/Images/Icons/BSpline.png",
                    "-9": "##RESOURCES_PATH##/Images/Icons/Pointer.png",
                    "-10": "##RESOURCES_PATH##/Images/Icons/Pen.png",
                    "-11": "##RESOURCES_PATH##/Images/Icons/Highlight.png",
                    "-12": "##RESOURCES_PATH##/Images/Icons/A.png",
                    "-14": "##RESOURCES_PATH##/Images/Icons/AArrow.png",
                    "-15": "##RESOURCES_PATH##/Images/Icons/Note.png",
                    "-16": "##RESOURCES_PATH##/Images/Icons/Image.png",
                    "-17": "##RESOURCES_PATH##/Images/Icons/Stamp.png",
                    "-18": "##RESOURCES_PATH##/Images/Icons/H.png",
                    "-19": "##RESOURCES_PATH##/Images/Icons/HSquiggles.png",
                    "-21": "##RESOURCES_PATH##/Images/Icons/RoundX.png",
                    "-22": "##RESOURCES_PATH##/Images/Icons/Redact.png",
                    "-23": "##RESOURCES_PATH##/Images/Icons/Ruler.png",
                    "-24": "##RESOURCES_PATH##/Images/Icons/90DegreeRuler.png",
                    "-25": "##RESOURCES_PATH##/Images/Icons/Protractor.png",
                    "-26": "##RESOURCES_PATH##/Images/Icons/Intersect.png",
                    "-13": "##RESOURCES_PATH##/Images/Icons/Pin.png",
                    "-28": "##RESOURCES_PATH##/Images/Icons/Sound.png",
                    "-30": "##RESOURCES_PATH##/Images/Icons/Video.png",
                    "-27": "##RESOURCES_PATH##/Images/Icons/Lock.png",
                    "-33": "##RESOURCES_PATH##/Images/Icons/THighlight.png",
                    "-34": "##RESOURCES_PATH##/Images/Icons/Strikethrough.png",
                    "-35": "##RESOURCES_PATH##/Images/Icons/Underline.png",
                    "-36": "##RESOURCES_PATH##/Images/Icons/TRedact.png",
                    "-32": "##RESOURCES_PATH##/Images/Icons/StickyNotes.png",
                };
                AutomationManagerHelper._undoImageUrlTemplate = "url('##RESOURCES_PATH##/Images/Icons/Undo.png')";
                AutomationManagerHelper._automationCursors = {};
                return AutomationManagerHelper;
            }());
            Annotations.AutomationManagerHelper = AutomationManagerHelper;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            // This version of IAnnAutomationControl derives from the image viewer
            var AutomationImageViewer = /** @class */ (function (_super) {
                __extends(AutomationImageViewer, _super);
                function AutomationImageViewer(createOptions) {
                    var _this = _super.call(this, createOptions) || this;
                    _this.handleGotFocus = function () {
                        _this.automationGotFocus.invoke(_this, lt.LeadEventArgs.empty);
                    };
                    _this.automationPointerDown = lt.LeadEvent.create(_this, "automationPointerDown"); // read-only
                    _this.automationPointerMove = lt.LeadEvent.create(_this, "automationPointerMove"); // read-only
                    _this.automationPointerUp = lt.LeadEvent.create(_this, "automationPointerUp"); // read-only
                    _this.automationDoubleClick = lt.LeadEvent.create(_this, "automationDoubleClick"); // read-only
                    _this.automationEnabledChanged = lt.LeadEvent.create(_this, "automationEnabledChanged"); // read-only
                    //Automation Focus Event Handler
                    _this.automationLostFocus = lt.LeadEvent.create(_this, "automationLostFocus"); // read-only
                    _this.automationGotFocus = lt.LeadEvent.create(_this, "automationGotFocus"); // read-only
                    // Automation items properties
                    _this.automationSizeChanged = lt.LeadEvent.create(_this, "automationSizeChanged"); // read-only
                    _this.automationTransformChanged = lt.LeadEvent.create(_this, "automationTransformChanged"); // read-only
                    _this.automationUseDpiChanged = lt.LeadEvent.create(_this, "automationUseDpiChanged"); // read-only
                    // Turn anti aliasing on and off
                    _this.automationAntiAlias = false;
                    _this.renderingEngine = null;
                    _this.automationContainerIndex = -1;
                    _this.isAutomationEventsHooked = false;
                    _this.interactiveService.tap.add(_this.handleGotFocus);
                    return _this;
                }
                AutomationImageViewer.prototype.get_automationObject = function () { return this.automationObject; };
                AutomationImageViewer.prototype.set_automationObject = function (value) { this.automationObject = value; };
                AutomationImageViewer.prototype.add_automationPointerDown = function (value) { this.automationPointerDown.add(value); };
                AutomationImageViewer.prototype.remove_automationPointerDown = function (value) { this.automationPointerDown.remove(value); };
                AutomationImageViewer.prototype.add_automationPointerMove = function (value) { this.automationPointerMove.add(value); };
                AutomationImageViewer.prototype.remove_automationPointerMove = function (value) { this.automationPointerMove.remove(value); };
                AutomationImageViewer.prototype.add_automationPointerUp = function (value) { this.automationPointerUp.add(value); };
                AutomationImageViewer.prototype.remove_automationPointerUp = function (value) { this.automationPointerUp.remove(value); };
                AutomationImageViewer.prototype.add_automationDoubleClick = function (value) { this.automationDoubleClick.add(value); };
                AutomationImageViewer.prototype.remove_automationDoubleClick = function (value) { this.automationDoubleClick.remove(value); };
                AutomationImageViewer.prototype.onAutomationPointerDown = function (args) {
                    if (this.automationPointerDown != null) {
                        this.automationPointerDown.invoke(this, args);
                    }
                };
                AutomationImageViewer.prototype.onAutomationPointerMove = function (args) {
                    if (this.automationPointerMove != null)
                        this.automationPointerMove.invoke(this, args);
                };
                AutomationImageViewer.prototype.onAutomationPointerUp = function (args) {
                    if (this.automationPointerUp != null)
                        this.automationPointerUp.invoke(this, args);
                };
                AutomationImageViewer.prototype.onAutomationDoubleClick = function (args) {
                    if (this.automationDoubleClick != null)
                        this.automationDoubleClick.invoke(this, args);
                };
                AutomationImageViewer.prototype.get_automationDpiX = function () { return 96; };
                AutomationImageViewer.prototype.get_automationDpiY = function () { return 96; };
                AutomationImageViewer.prototype.get_automationEnabled = function () { return true; };
                AutomationImageViewer.prototype.add_automationEnabledChanged = function (value) { this.automationEnabledChanged.add(value); };
                AutomationImageViewer.prototype.remove_automationEnabledChanged = function (value) { this.automationEnabledChanged.remove(value); };
                AutomationImageViewer.prototype.onEnabledChanged = function (e) {
                    if (this.automationEnabledChanged != null)
                        this.automationEnabledChanged.invoke(this, lt.LeadEventArgs.empty);
                };
                AutomationImageViewer.prototype.add_automationLostFocus = function (value) { this.automationLostFocus.add(value); };
                AutomationImageViewer.prototype.remove_automationLostFocus = function (value) { this.automationLostFocus.remove(value); };
                AutomationImageViewer.prototype.add_automationGotFocus = function (value) { this.automationGotFocus.add(value); };
                AutomationImageViewer.prototype.remove_automationGotFocus = function (value) { this.automationGotFocus.remove(value); };
                AutomationImageViewer.prototype.add_automationSizeChanged = function (value) { this.automationSizeChanged.add(value); };
                AutomationImageViewer.prototype.remove_automationSizeChanged = function (value) { this.automationSizeChanged.remove(value); };
                AutomationImageViewer.prototype.onItemChanged = function (e) {
                    switch (e.reason) {
                        case lt.Controls.ImageViewerItemChangedReason.url:
                        case lt.Controls.ImageViewerItemChangedReason.image:
                        case lt.Controls.ImageViewerItemChangedReason.imageChanged:
                        case lt.Controls.ImageViewerItemChangedReason.size:
                        case lt.Controls.ImageViewerItemChangedReason.transform:
                        case lt.Controls.ImageViewerItemChangedReason.visibility:
                            // When the item size changes (or the image inside the item, it might have a new size - for example, if the user
                            // resizes the image), we need to inform the automation of this to resize the container accordingly
                            // Fire the AutomationSizeChanged event
                            if (this.automationTransformChanged != null)
                                this.automationTransformChanged.invoke(this, lt.LeadEventArgs.empty);
                            if (this.automationSizeChanged != null)
                                this.automationSizeChanged.invoke(this, lt.LeadEventArgs.empty);
                            break;
                        default:
                            break;
                    }
                    _super.prototype.onItemChanged.call(this, e);
                };
                AutomationImageViewer.prototype.get_automationTransform = function () { return this.getImageTransformWithDpi(false); };
                AutomationImageViewer.prototype.add_automationTransformChanged = function (value) { this.automationTransformChanged.add(value); };
                AutomationImageViewer.prototype.remove_automationTransformChanged = function (value) { this.automationTransformChanged.remove(value); };
                // Inform the automation that the current transformation has changed, user scrolled or zoomed
                AutomationImageViewer.prototype.onTransformChanged = function (e) {
                    _super.prototype.onTransformChanged.call(this, e);
                    // Fire the AutomationTransformChanged event
                    if (this.automationTransformChanged != null) {
                        this.automationTransformChanged.invoke(this, lt.LeadEventArgs.empty);
                    }
                };
                AutomationImageViewer.prototype.get_automationUseDpi = function () { return this.useDpi; };
                AutomationImageViewer.prototype.add_automationUseDpiChanged = function (value) { this.automationUseDpiChanged.add(value); };
                AutomationImageViewer.prototype.remove_automationUseDpiChanged = function (value) { this.automationUseDpiChanged.remove(value); };
                // Override this property to call OnUseDpiChanged when UseDpi change
                AutomationImageViewer.prototype.get_useDpi = function () { return _super.prototype.get_useDpi.call(this); };
                AutomationImageViewer.prototype.set_useDpi = function (value) {
                    if (_super.prototype.get_useDpi.call(this) != value) {
                        _super.prototype.set_useDpi.call(this, value);
                        if (this.automationUseDpiChanged != null)
                            this.automationUseDpiChanged.invoke(this, lt.LeadEventArgs.empty);
                    }
                };
                AutomationImageViewer.prototype.get_automationXResolution = function () { return this.imageResolution.width; };
                AutomationImageViewer.prototype.get_automationYResolution = function () { return this.imageResolution.height; };
                // Rendering
                AutomationImageViewer.prototype.automationInvalidate = function (rc) {
                    if (rc.isEmpty) {
                        this.invalidate(lt.LeadRectD.empty);
                    }
                    else {
                        var rect = lt.LeadRectD.create((rc.x + 0.5), (rc.y + 0.5), (rc.width + 0.5), (rc.height + 0.5));
                        this.invalidate(rect);
                    }
                };
                AutomationImageViewer.prototype.get_automationAntiAlias = function () { return this.automationAntiAlias; };
                AutomationImageViewer.prototype.set_automationAntiAlias = function (value) {
                    this.automationAntiAlias = value;
                    this.invalidate(lt.LeadRectD.empty);
                };
                AutomationImageViewer.prototype.get_renderingEngine = function () { return this.renderingEngine; };
                AutomationImageViewer.prototype.set_renderingEngine = function (value) { this.renderingEngine = value; };
                AutomationImageViewer.prototype.onPostRender = function (e) {
                    if (e == null)
                        alert("Error, ImageViewerRenderEventArgs equals null");
                    var engine = this.get_renderingEngine();
                    var context = e.context;
                    var saveSmoothingMode = context["msImageSmoothingEnabled"];
                    try {
                        // Set the anti alias mode
                        if (this.get_automationAntiAlias()) {
                            if (!context["msImageSmoothingEnabled"])
                                context["msImageSmoothingEnabled"] = true;
                        }
                        else {
                            if (context["msImageSmoothingEnabled"])
                                context["msImageSmoothingEnabled"] = false;
                        }
                        // Render all containers
                        if (this.automationGetContainersCallback != null) {
                            // Using multi-containers
                            var containers = this.automationGetContainersCallback().toArray();
                            for (var i = 0; i < containers.length; i++) {
                                lt.Demos.Annotations.AutomationImageViewer.renderContainer(e, engine, containers[i]);
                            }
                        }
                        else {
                            // Using single-containers, just render the active
                            lt.Demos.Annotations.AutomationImageViewer.renderContainer(e, engine, this.container);
                        }
                    }
                    finally {
                        if (context["msImageSmoothingEnabled"] !== saveSmoothingMode)
                            context["msImageSmoothingEnabled"] = saveSmoothingMode;
                    }
                    _super.prototype.onPostRender.call(this, e);
                };
                AutomationImageViewer.renderContainer = function (e, engine, container) {
                    // Attach to the current container and context.
                    var context = e.context;
                    var clipRectangle = e.clipRectangle;
                    try {
                        engine.attach(container, context);
                        // Render the annotations
                        var rc = lt.LeadRectD.empty;
                        engine.render(rc, true);
                    }
                    finally {
                        engine.detach();
                    }
                };
                AutomationImageViewer.prototype.get_automationGetContainersCallback = function () { return this.automationGetContainersCallback; };
                AutomationImageViewer.prototype.set_automationGetContainersCallback = function (value) { this.automationGetContainersCallback = value; };
                AutomationImageViewer.prototype.get_automationContainerIndex = function () { return this.automationContainerIndex; };
                AutomationImageViewer.prototype.set_automationContainerIndex = function (value) { this.automationContainerIndex = value; };
                AutomationImageViewer.prototype.automationAttach = function (container) {
                    this.container = container;
                };
                AutomationImageViewer.prototype.automationDetach = function () { this.container = null; };
                AutomationImageViewer.prototype.get_automationContainer = function () { return this.container; };
                AutomationImageViewer.prototype.get_automationDataProvider = function () { return this.automationDataProvider; };
                AutomationImageViewer.prototype.set_automationDataProvider = function (value) { this.automationDataProvider = value; };
                AutomationImageViewer.prototype.get_automationScrollOffset = function () {
                    return this.get_scrollOffset();
                };
                AutomationImageViewer.prototype.get_automationRotateAngle = function () {
                    return this.get_automationRotateAngle();
                };
                AutomationImageViewer.prototype.get_automationScaleFactor = function () {
                    return this.get_automationScaleFactor();
                };
                AutomationImageViewer.prototype.get_isAutomationEventsHooked = function () { return this.isAutomationEventsHooked; };
                AutomationImageViewer.prototype.set_isAutomationEventsHooked = function (value) {
                    this.isAutomationEventsHooked = value;
                };
                return AutomationImageViewer;
            }(lt.Controls.ImageViewer));
            Annotations.AutomationImageViewer = AutomationImageViewer;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationInteractiveMode = /** @class */ (function (_super) {
                __extends(AutomationInteractiveMode, _super);
                function AutomationInteractiveMode() {
                    var _this = _super.call(this) || this;
                    _this.automationId = AutomationInteractiveMode.userModeId;
                    _this._id = _this.automationId;
                    _this.interactiveService_DragStarted = function (sender, e) {
                        if (_this.canStartWork(e)) {
                            _this.onWorkStarted(lt.LeadEventArgs.empty);
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, false);
                            if (!e.isHandled) {
                                _this.workAutomationControl.onAutomationPointerDown(annArgs);
                                e.isHandled = annArgs.isHandled;
                                if (!e.isHandled)
                                    _this.onWorkCompleted(lt.LeadEventArgs.empty);
                            }
                        }
                    };
                    _this.interactiveService_DragDelta = function (sender, e) {
                        if (_this.isWorking) {
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, false);
                            if (!e.isHandled) {
                                if (_this._lastNativeEvent !== e.nativeEvent) {
                                    _this._lastNativeEvent = e.nativeEvent;
                                    _this.workAutomationControl.onAutomationPointerMove(annArgs);
                                }
                                e.isHandled = annArgs.isHandled;
                            }
                        }
                    };
                    _this.interactiveService_DragCompleted = function (sender, e) {
                        if (_this.isWorking) {
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, false);
                            if (!e.isHandled) {
                                _this.workAutomationControl.onAutomationPointerUp(annArgs);
                                e.isHandled = annArgs.isHandled;
                                _this.onWorkCompleted(lt.LeadEventArgs.empty);
                            }
                        }
                    };
                    _this.interactiveService_Tap = function (sender, e) {
                        if (!_this.isWorking && _this.canStartWork(e)) {
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, true);
                            if (!e.isHandled) {
                                _this.workAutomationControl.onAutomationPointerUp(annArgs);
                                e.isHandled = annArgs.isHandled;
                            }
                        }
                    };
                    _this.interactiveService_DoubleTap = function (sender, e) {
                        if (_this.canStartWork(e)) {
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, true);
                            if (!e.isHandled) {
                                _this.onWorkStarted(lt.LeadEventArgs.empty);
                                _this.workAutomationControl.onAutomationDoubleClick(annArgs);
                                e.isHandled = annArgs.isHandled;
                                _this.onWorkCompleted(lt.LeadEventArgs.empty);
                            }
                        }
                    };
                    _this.interactiveService_Move = function (sender, e) {
                        if (_this.workAutomationControl == null) {
                            return;
                        }
                        if (_this._lastNativeEvent !== e.nativeEvent) {
                            _this._lastNativeEvent = e.nativeEvent;
                            var annArgs = lt.Demos.Annotations.AutomationInteractiveMode.convertPointerEventArgs(e, false);
                            _this.workAutomationControl.onAutomationPointerMove(annArgs);
                        }
                    };
                    // Hook to left and right mouse button (if supported)
                    _this.mouseButtons = lt.Controls.MouseButtons.left; //| lt.Controls.MouseButtons.right;
                    // Setup our item mode, when the user first click, make this our item
                    _this.autoItemMode = lt.Controls.ImageViewerAutoItemMode.autoSet;
                    // Work on the image
                    _this.itemPart = lt.Controls.ImageViewerItemPart.image;
                    // So selection works even if we click outside the items
                    _this.workOnBounds = false;
                    // Don't  fire drag events on mouse wheel
                    _this.isDragMouseWheelEnabled = false;
                    // Previously these were function overrides
                    // I.e. - override get name()
                    // However if you are compiling TypeScript >= 4.0, there is a breaking change that prevents overriding properties with accessors.
                    _this.name = "Context";
                    _this.id = _this.automationId;
                    return _this;
                }
                AutomationInteractiveMode.prototype.get_id = function () { return this._id; };
                AutomationInteractiveMode.prototype.setId = function (value) {
                    this._id = value;
                };
                Object.defineProperty(AutomationInteractiveMode.prototype, "automationControl", {
                    get: function () {
                        return this._automationControl;
                    },
                    set: function (value) {
                        this._automationControl = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(AutomationInteractiveMode.prototype, "workAutomationControl", {
                    get: function () {
                        if (this._automationControl != null)
                            return this._automationControl;
                        else
                            return (this.imageViewer);
                    },
                    enumerable: false,
                    configurable: true
                });
                AutomationInteractiveMode.prototype.get_name = function () {
                    return "AutomationInteractiveMode";
                };
                AutomationInteractiveMode.prototype.canStartWork = function (e) {
                    return _super.prototype.canStartWork.call(this, e) && this.workAutomationControl != null;
                };
                AutomationInteractiveMode.prototype.start = function (imageViewer) {
                    _super.prototype.start.call(this, imageViewer);
                    var interactiveService = this.interactiveService;
                    this._dragStartedHandler = interactiveService.dragStarted.add(this.interactiveService_DragStarted);
                    this._dragDeltaHandler = interactiveService.dragDelta.add(this.interactiveService_DragDelta);
                    this._dragCompletedHandler = interactiveService.dragCompleted.add(this.interactiveService_DragCompleted);
                    this._tapHandler = interactiveService.tap.add(this.interactiveService_Tap);
                    this._doubleTapHandler = interactiveService.doubleTap.add(this.interactiveService_DoubleTap);
                    this._moveHandler = interactiveService.move.add(this.interactiveService_Move);
                };
                AutomationInteractiveMode.prototype.stop = function (imageViewer) {
                    if (this.isStarted) {
                        var interactiveService = _super.prototype.get_interactiveService.call(this);
                        interactiveService.dragStarted.remove(this._dragStartedHandler);
                        interactiveService.dragDelta.remove(this._dragDeltaHandler);
                        interactiveService.dragCompleted.remove(this._dragCompletedHandler);
                        interactiveService.tap.remove(this.interactiveService_Tap);
                        interactiveService.doubleTap.remove(this._doubleTapHandler);
                        interactiveService.move.remove(this._moveHandler);
                        _super.prototype.stop.call(this, imageViewer);
                    }
                };
                AutomationInteractiveMode.convertPointerEventArgs = function (e, isDoubleTap) {
                    // Convert the point
                    var point = lt.LeadPointD.create(e.position.x, e.position.y);
                    // Convert the mouse button
                    var mouseButton = lt.Annotations.Engine.AnnMouseButton.none;
                    if (!isDoubleTap) {
                        if (e.mouseButton == lt.Controls.MouseButtons.left)
                            mouseButton = lt.Annotations.Engine.AnnMouseButton.left;
                        if (e.mouseButton == lt.Controls.MouseButtons.right)
                            mouseButton = lt.Annotations.Engine.AnnMouseButton.right;
                    }
                    else {
                        mouseButton = lt.Annotations.Engine.AnnMouseButton.left;
                    }
                    var args = lt.Annotations.Engine.AnnPointerEventArgs.create(mouseButton, point);
                    args.isHandled = e.isHandled;
                    return args;
                };
                return AutomationInteractiveMode;
            }(lt.Controls.ImageViewerInteractiveMode));
            Annotations.AutomationInteractiveMode = AutomationInteractiveMode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var DocumentPackDialog = /** @class */ (function () {
                function DocumentPackDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    // Run when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        _this._objectID = lt.Annotations.Engine.AnnObject.selectObjectId;
                        if (_this.onHide) {
                            _this.onHide(_this._objectID);
                        }
                        _this.inner.hide();
                    };
                    this._documentObjectBtns_BtnClicked = function (e) {
                        _this._objectID = parseInt($(e.target).val(), 10);
                        if (_this.onHide) {
                            _this.onHide(_this._objectID);
                        }
                        _this.inner.hide();
                    };
                    this.el = {
                        objects: root.find(selectors.objects),
                        hide: root.find(selectors.hide)
                    };
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    root.on("click", this.el.objects, this._documentObjectBtns_BtnClicked);
                }
                Object.defineProperty(DocumentPackDialog.prototype, "objectID", {
                    get: function () {
                        return this._objectID;
                    },
                    enumerable: false,
                    configurable: true
                });
                DocumentPackDialog.prototype.show = function () {
                    this._objectID = lt.Annotations.Engine.AnnObject.selectObjectId;
                    this.inner.show();
                };
                return DocumentPackDialog;
            }());
            Annotations.DocumentPackDialog = DocumentPackDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var CanvasDataProvider = /** @class */ (function (_super) {
                __extends(CanvasDataProvider, _super);
                function CanvasDataProvider(acitveCanvas) {
                    var _this = _super.call(this) || this;
                    _this._acitveCanvas = null;
                    _this._orginalImageData = null;
                    _this._acitveCanvas = acitveCanvas;
                    var context = _this._acitveCanvas.getContext("2d");
                    _this._orginalImageData = context.getImageData(0, 0, _this._acitveCanvas.width, _this._acitveCanvas.height);
                    return _this;
                }
                CanvasDataProvider.prototype.applyEncryptDecrypt = function (flags, bounds, key) {
                    var data = this.getImageData(null, lt.LeadRectD.empty);
                    flags |= lt.Annotations.Engine.ScrambleImageFlags.intersect;
                    var scrambleImage = new lt.Annotations.Engine.ScrambleImage();
                    scrambleImage.key = key.toString();
                    scrambleImage.flags = flags;
                    scrambleImage.rectangle = bounds;
                    scrambleImage.imageWidth = this._acitveCanvas.width;
                    scrambleImage.imageHeight = this._acitveCanvas.height;
                    scrambleImage.imageData = data.data;
                    var imageBounds = lt.LeadRectD.create(0, 0, this._acitveCanvas.width, this._acitveCanvas.height);
                    if (imageBounds.containsRect(bounds)) {
                        scrambleImage.scramble();
                    }
                    this.setImageData(null, lt.LeadRectD.create(0, 0, this._acitveCanvas.width, this._acitveCanvas.height), data);
                };
                CanvasDataProvider.prototype.decrypt = function (container, bounds, key) {
                    this.applyEncryptDecrypt(lt.Annotations.Engine.ScrambleImageFlags.decrypt, bounds, key);
                };
                CanvasDataProvider.prototype.encrypt = function (container, bounds, key) {
                    this.applyEncryptDecrypt(lt.Annotations.Engine.ScrambleImageFlags.encrypt, bounds, key);
                };
                CanvasDataProvider.prototype.fill = function (container, bounds, color) {
                    var canvas = document.createElement("canvas");
                    var width = bounds.width;
                    var height = bounds.height;
                    canvas.width = width;
                    canvas.height = height;
                    var tmpContext = canvas.getContext("2d");
                    tmpContext.fillStyle = color;
                    tmpContext.fillRect(0, 0, bounds.width, bounds.height);
                    var imageData = tmpContext.getImageData(0, 0, bounds.width, bounds.height);
                    this.setImageData(container, bounds, imageData);
                };
                CanvasDataProvider.prototype.getImageData = function (container, bounds) {
                    var imageCanvas = this._acitveCanvas;
                    var imageData;
                    var context = imageCanvas.getContext('2d');
                    if (bounds.isEmpty) {
                        imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
                    }
                    else {
                        imageData = context.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
                    }
                    return imageData;
                };
                CanvasDataProvider.prototype.setImageData = function (container, bounds, data) {
                    if (bounds.isEmpty || data == null)
                        return;
                    var imageCanvas = this._acitveCanvas;
                    var context = imageCanvas.getContext("2d");
                    context.putImageData(data, bounds.x, bounds.y);
                };
                return CanvasDataProvider;
            }(lt.Annotations.Engine.AnnDataProvider));
            Annotations.CanvasDataProvider = CanvasDataProvider;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationControlMultiContainerMode;
            (function (AutomationControlMultiContainerMode) {
                AutomationControlMultiContainerMode[AutomationControlMultiContainerMode["SinglePage"] = 0] = "SinglePage";
                AutomationControlMultiContainerMode[AutomationControlMultiContainerMode["MultiPage"] = 1] = "MultiPage"; // One container per image viewer item
            })(AutomationControlMultiContainerMode = Annotations.AutomationControlMultiContainerMode || (Annotations.AutomationControlMultiContainerMode = {}));
            // this version of IAnnAutomationControl contains an image viewer
            var ImageViewerAutomationControl = /** @class */ (function () {
                function ImageViewerAutomationControl() {
                    var _this = this;
                    this._multiContainerMode = AutomationControlMultiContainerMode.SinglePage;
                    this.handleGotFocus = function () {
                        _this.automationGotFocus.invoke(_this, lt.LeadEventArgs.empty);
                    };
                    this.automationPointerDown = lt.LeadEvent.create(this, "automationPointerDown"); // read-only
                    this.automationPointerMove = lt.LeadEvent.create(this, "automationPointerMove"); // read-only
                    this.automationPointerUp = lt.LeadEvent.create(this, "automationPointerUp"); // read-only
                    this.automationDoubleClick = lt.LeadEvent.create(this, "automationDoubleClick"); // read-only
                    this.automationEnabledChanged = lt.LeadEvent.create(this, "automationEnabledChanged"); // read-only
                    //Automation Focus Event Handler
                    this.automationLostFocus = lt.LeadEvent.create(this, "automationLostFocus"); // read-only
                    this.automationGotFocus = lt.LeadEvent.create(this, "automationGotFocus"); // read-only
                    // Automation items properties
                    this.automationSizeChanged = lt.LeadEvent.create(this, "automationSizeChanged"); // read-only
                    this.imageViewer_ItemChanged = function (sender, e) {
                        switch (e.reason) {
                            case lt.Controls.ImageViewerItemChangedReason.url:
                            case lt.Controls.ImageViewerItemChangedReason.image:
                            case lt.Controls.ImageViewerItemChangedReason.imageChanged:
                            case lt.Controls.ImageViewerItemChangedReason.size:
                            case lt.Controls.ImageViewerItemChangedReason.transform:
                            case lt.Controls.ImageViewerItemChangedReason.visibility:
                                // Let the automation know the size of item has changed
                                if (_this.automationTransformChanged != null)
                                    _this.automationTransformChanged.invoke(_this, lt.LeadEventArgs.empty);
                                if (_this.automationSizeChanged != null)
                                    _this.automationSizeChanged.invoke(_this, lt.LeadEventArgs.empty);
                                break;
                            default:
                                break;
                        }
                    };
                    this.imageViewer_ActiveItemChanged = function (sender, e) {
                        _this.syncActiveItemContainer(true);
                    };
                    this.automationObject_ActiveContainerChanged = function (sender, e) {
                        _this.syncActiveItemContainer(false);
                    };
                    this.automationTransformChanged = lt.LeadEvent.create(this, "automationTransformChanged"); // read-only
                    this.imageViewer_TransformChanged = function (sender, e) {
                        // Let the automation know
                        if (_this.automationTransformChanged != null)
                            _this.automationTransformChanged.invoke(_this, lt.LeadEventArgs.empty);
                    };
                    this.automationUseDpiChanged = lt.LeadEvent.create(this, "automationUseDpiChanged"); // read-only
                    this.imageViewer_PropertyChanged = function (sender, e) {
                        switch (e.propertyName) {
                            case "UseDpi":
                                if (_this.automationUseDpiChanged != null)
                                    _this.automationUseDpiChanged.invoke(_this, lt.LeadEventArgs.empty);
                                break;
                            default:
                                break;
                        }
                    };
                    // Turn anti aliasing on and off
                    this.automationAntiAlias = false;
                    this.renderingEngine = null;
                    this.imageViewer_PostRender = function (sender, e) {
                        // Do we have a rendering engine?
                        var renderingEngine = _this.renderingEngine;
                        if (renderingEngine == null)
                            return;
                        var runMode = false;
                        if (_this.automationObject != null && _this.automationObject.manager != null)
                            runMode = (_this.automationObject.manager.userMode == lt.Annotations.Engine.AnnUserMode.run);
                        var context = e.context;
                        var saveSmoothingMode = context["msImageSmoothingEnabled"];
                        try {
                            // Set the anti alias mode
                            if (_this.automationAntiAlias) {
                                if (!context["msImageSmoothingEnabled"])
                                    context["msImageSmoothingEnabled"] = true;
                            }
                            else {
                                if (context["msImageSmoothingEnabled"])
                                    context["msImageSmoothingEnabled"] = false;
                            }
                            // Do we have multiple containers?
                            var container;
                            if (_this.automationGetContainersCallback != null) {
                                // Yes, get the container for this item
                                var containers = _this.automationGetContainersCallback().toArray();
                                if (containers != null) {
                                    switch (_this._multiContainerMode) {
                                        case AutomationControlMultiContainerMode.MultiPage:
                                            // Each container belong to an item
                                            for (var index = 0; index < containers.length; index++) {
                                                if (index < _this._imageViewer.items.count) {
                                                    var container = containers[index];
                                                    var item = _this._imageViewer.items.item(index);
                                                    var containerBounds = _this.automationObject.getContainerInvalidRect(container, true);
                                                    var intersects = !containerBounds.isEmpty;
                                                    if (intersects || !_this._imageViewer.getItemViewBounds(item, lt.Controls.ImageViewerItemPart.item, true).isEmpty)
                                                        lt.Demos.Annotations.ImageViewerAutomationControl.renderContainer(e, renderingEngine, container, runMode);
                                                }
                                            }
                                            break;
                                        case AutomationControlMultiContainerMode.SinglePage:
                                        default:
                                            // All containers belong to the active item
                                            if (_this._imageViewer.activeItem != null &&
                                                !_this._imageViewer.getItemViewBounds(_this._imageViewer.activeItem, lt.Controls.ImageViewerItemPart.item, true).isEmpty) {
                                                for (var index = 0; index < containers.length; index++) {
                                                    var container = containers[index];
                                                    var containerBounds = _this.automationObject.getContainerInvalidRect(container, true);
                                                    var intersects = !containerBounds.isEmpty;
                                                    if (intersects)
                                                        lt.Demos.Annotations.ImageViewerAutomationControl.renderContainer(e, renderingEngine, container, runMode);
                                                }
                                            }
                                            break;
                                    }
                                }
                            }
                            else {
                                // Using single-containers, just render the one the user set
                                container = _this._container;
                                if (container != null)
                                    lt.Demos.Annotations.ImageViewerAutomationControl.renderContainer(e, renderingEngine, container, runMode);
                            }
                        }
                        finally {
                            if (context["msImageSmoothingEnabled"] !== saveSmoothingMode)
                                context["msImageSmoothingEnabled"] = saveSmoothingMode;
                        }
                    };
                    this.automationContainerIndex = -1;
                    // Data provider for the images
                    this.automationDataProvider = null;
                    this.isAutomationEventsHooked = false;
                }
                Object.defineProperty(ImageViewerAutomationControl.prototype, "multiContainerMode", {
                    get: function () { return this._multiContainerMode; },
                    set: function (value) { this._multiContainerMode = value; },
                    enumerable: false,
                    configurable: true
                });
                ImageViewerAutomationControl.prototype.dispose = function () { this.unHook(); };
                Object.defineProperty(ImageViewerAutomationControl.prototype, "imageViewer", {
                    get: function () { return this._imageViewer; },
                    set: function (value) {
                        if (this._imageViewer != value) {
                            this.unHook();
                            this._imageViewer = value;
                            this.hook();
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                ImageViewerAutomationControl.prototype.hook = function () {
                    if (this._imageViewer == null)
                        return;
                    // Hook to the image viewer events we need
                    this._imageViewer.propertyChanged.add(this.imageViewer_PropertyChanged);
                    this._imageViewer.itemChanged.add(this.imageViewer_ItemChanged);
                    this._imageViewer.activeItemChanged.add(this.imageViewer_ActiveItemChanged);
                    this._imageViewer.transformChanged.add(this.imageViewer_TransformChanged);
                    this._imageViewer.postRender.add(this.imageViewer_PostRender);
                    this._imageViewer.interactiveService.tap.add(this.handleGotFocus);
                };
                ImageViewerAutomationControl.prototype.unHook = function () {
                    if (this._imageViewer == null)
                        return;
                    // Unhook from the image viewer events
                    this._imageViewer.propertyChanged.remove(this.imageViewer_PropertyChanged);
                    this._imageViewer.itemChanged.remove(this.imageViewer_ItemChanged);
                    this._imageViewer.activeItemChanged.remove(this.imageViewer_ActiveItemChanged);
                    this._imageViewer.transformChanged.remove(this.imageViewer_TransformChanged);
                    this._imageViewer.postRender.remove(this.imageViewer_PostRender);
                    this._imageViewer.interactiveService.tap.remove(this.handleGotFocus);
                    if (this.automationObject != null)
                        this.automationObject.activeContainerChanged.remove(this.automationObject_ActiveContainerChanged);
                };
                ImageViewerAutomationControl.prototype.get_automationObject = function () { return this.automationObject; };
                ImageViewerAutomationControl.prototype.set_automationObject = function (value) {
                    this.automationObject = value;
                    if (this.automationObject != null)
                        this.automationObject.activeContainerChanged.remove(this.automationObject_ActiveContainerChanged);
                    this.automationObject = value;
                    if (this.automationObject != null)
                        this.automationObject.activeContainerChanged.add(this.automationObject_ActiveContainerChanged);
                };
                ImageViewerAutomationControl.prototype.add_automationPointerDown = function (value) { this.automationPointerDown.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationPointerDown = function (value) { this.automationPointerDown.remove(value); };
                ImageViewerAutomationControl.prototype.add_automationPointerMove = function (value) { this.automationPointerMove.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationPointerMove = function (value) { this.automationPointerMove.remove(value); };
                ImageViewerAutomationControl.prototype.add_automationPointerUp = function (value) { this.automationPointerUp.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationPointerUp = function (value) { this.automationPointerUp.remove(value); };
                ImageViewerAutomationControl.prototype.add_automationDoubleClick = function (value) { this.automationDoubleClick.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationDoubleClick = function (value) { this.automationDoubleClick.remove(value); };
                ImageViewerAutomationControl.prototype.onAutomationPointerDown = function (args) {
                    if (this.automationPointerDown != null) {
                        this.automationPointerDown.invoke(this, args);
                    }
                };
                ImageViewerAutomationControl.prototype.onAutomationPointerMove = function (args) {
                    if (this.automationPointerMove != null)
                        this.automationPointerMove.invoke(this, args);
                };
                ImageViewerAutomationControl.prototype.onAutomationPointerUp = function (args) {
                    if (this.automationPointerUp != null)
                        this.automationPointerUp.invoke(this, args);
                };
                ImageViewerAutomationControl.prototype.onAutomationDoubleClick = function (args) {
                    if (this.automationDoubleClick != null)
                        this.automationDoubleClick.invoke(this, args);
                };
                ImageViewerAutomationControl.prototype.get_automationDpiX = function () { return this._imageViewer != null ? this._imageViewer.screenDpi.width : 96; };
                ImageViewerAutomationControl.prototype.get_automationDpiY = function () { return this._imageViewer != null ? this._imageViewer.screenDpi.height : 96; };
                ImageViewerAutomationControl.prototype.get_automationEnabled = function () { return true; };
                ImageViewerAutomationControl.prototype.add_automationEnabledChanged = function (value) { this.automationEnabledChanged.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationEnabledChanged = function (value) { this.automationEnabledChanged.remove(value); };
                ImageViewerAutomationControl.prototype.onEnabledChanged = function (e) {
                    if (this.automationEnabledChanged != null)
                        this.automationEnabledChanged.invoke(this, lt.LeadEventArgs.empty);
                };
                ImageViewerAutomationControl.prototype.add_automationLostFocus = function (value) { this.automationLostFocus.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationLostFocus = function (value) { this.automationLostFocus.remove(value); };
                ImageViewerAutomationControl.prototype.add_automationGotFocus = function (value) { this.automationGotFocus.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationGotFocus = function (value) { this.automationGotFocus.remove(value); };
                ImageViewerAutomationControl.prototype.add_automationSizeChanged = function (value) { this.automationSizeChanged.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationSizeChanged = function (value) { this.automationSizeChanged.remove(value); };
                ImageViewerAutomationControl.prototype.syncActiveItemContainer = function (fromViewer) {
                    // Ensure that both the image viewer and automation active "item" is the same
                    if (this.automationObject == null || this._imageViewer == null)
                        return;
                    var itemsCount = this._imageViewer.items.count;
                    var containersCount = this.automationObject.containers.count;
                    if (itemsCount == 0 || itemsCount != containersCount)
                        return;
                    var imageViewerIndex = this._imageViewer.items.indexOf(this._imageViewer.activeItem);
                    var containerIndex = -1;
                    if (this.automationObject.activeContainer != null)
                        containerIndex = this.automationObject.containers.indexOf(this.automationObject.activeContainer);
                    if (imageViewerIndex != containerIndex) {
                        if (fromViewer) {
                            if (imageViewerIndex != -1)
                                this.automationObject.activeContainer = this.automationObject.containers.item(imageViewerIndex);
                        }
                        else {
                            if (containerIndex != -1)
                                this._imageViewer.activeItem = this._imageViewer.items.item(containerIndex);
                        }
                    }
                };
                ImageViewerAutomationControl.prototype.getItemForCurrentContainer = function () {
                    if (this._imageViewer == null)
                        return null;
                    // Multiple container support?
                    if (this.automationContainerIndex != -1) {
                        // Yes, get the item
                        switch (this._multiContainerMode) {
                            case AutomationControlMultiContainerMode.MultiPage:
                                // One container for each item
                                // Sanity check
                                if (this.automationContainerIndex >= 0 && this.automationContainerIndex < this._imageViewer.items.count)
                                    return this._imageViewer.items.item(this.automationContainerIndex);
                                return null;
                            case AutomationControlMultiContainerMode.SinglePage:
                            default:
                                // All containers belong to the first item
                                return this._imageViewer.activeItem;
                        }
                    }
                    else {
                        // No, active item
                        return this._imageViewer.activeItem;
                    }
                };
                ImageViewerAutomationControl.prototype.getCurrentContainer = function () {
                    if (this.automationObject != null && this.automationContainerIndex != -1)
                        return this.automationObject.containers.item(this.automationContainerIndex);
                    return null;
                };
                ImageViewerAutomationControl.prototype.get_automationTransform = function () {
                    var item = this.getItemForCurrentContainer();
                    var container = this.getCurrentContainer();
                    if (item != null) {
                        return this._imageViewer.getItemImageTransformWithDpi(item, false);
                    }
                    else
                        return lt.LeadMatrix.identity;
                };
                ImageViewerAutomationControl.prototype.add_automationTransformChanged = function (value) { this.automationTransformChanged.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationTransformChanged = function (value) { this.automationTransformChanged.remove(value); };
                ImageViewerAutomationControl.prototype.get_automationUseDpi = function () { return this._imageViewer != null && this._imageViewer.useDpi; };
                ImageViewerAutomationControl.prototype.add_automationUseDpiChanged = function (value) { this.automationUseDpiChanged.add(value); };
                ImageViewerAutomationControl.prototype.remove_automationUseDpiChanged = function (value) { this.automationUseDpiChanged.remove(value); };
                ImageViewerAutomationControl.prototype.get_automationXResolution = function () {
                    var item = this.getItemForCurrentContainer();
                    if (item != null)
                        return item.resolution.width;
                    else
                        return 96.0;
                };
                ImageViewerAutomationControl.prototype.get_automationYResolution = function () {
                    var item = this.getItemForCurrentContainer();
                    if (item != null)
                        return item.resolution.height;
                    else
                        return 96.0;
                };
                // Rendering
                ImageViewerAutomationControl.prototype.automationInvalidate = function (rc) {
                    // Invalidate the viewer
                    if (this._imageViewer != null) {
                        this._imageViewer.invalidate(rc);
                    }
                };
                ImageViewerAutomationControl.prototype.get_automationAntiAlias = function () { return this.automationAntiAlias; };
                ImageViewerAutomationControl.prototype.set_automationAntiAlias = function (value) {
                    this.automationAntiAlias = value;
                    if (this._imageViewer) {
                        this._imageViewer.invalidate(lt.LeadRectD.empty);
                    }
                };
                ImageViewerAutomationControl.prototype.get_renderingEngine = function () { return this.renderingEngine; };
                ImageViewerAutomationControl.prototype.set_renderingEngine = function (value) { this.renderingEngine = value; };
                ImageViewerAutomationControl.renderContainer = function (e, renderingEngine, container, runMode) {
                    // Attach to the current container and context.
                    var context = e.context;
                    var clipRectangle = e.clipRectangle;
                    // Render the annotations
                    renderingEngine.attach(container, context);
                    try {
                        // Convert the clip rectangle to annotation coordinates
                        var annClipRect = container.mapper.rectToContainerCoordinates(clipRectangle);
                        renderingEngine.render(annClipRect, runMode);
                    }
                    finally {
                        renderingEngine.detach();
                    }
                };
                ImageViewerAutomationControl.prototype.get_automationGetContainersCallback = function () { return this.automationGetContainersCallback; };
                ImageViewerAutomationControl.prototype.set_automationGetContainersCallback = function (value) { this.automationGetContainersCallback = value; };
                ImageViewerAutomationControl.prototype.get_automationContainerIndex = function () { return this.automationContainerIndex; };
                ImageViewerAutomationControl.prototype.set_automationContainerIndex = function (value) { this.automationContainerIndex = value; };
                ImageViewerAutomationControl.prototype.automationAttach = function (container) { this._container = container; };
                ImageViewerAutomationControl.prototype.automationDetach = function () { this._container = null; };
                ImageViewerAutomationControl.prototype.get_automationDataProvider = function () { return this.automationDataProvider; };
                ImageViewerAutomationControl.prototype.set_automationDataProvider = function (value) { this.automationDataProvider = value; };
                ImageViewerAutomationControl.prototype.get_automationScrollOffset = function () {
                    return this._imageViewer != null ? this._imageViewer.scrollOffset : lt.LeadPointD.create(0, 0);
                };
                ImageViewerAutomationControl.prototype.get_automationRotateAngle = function () {
                    return this._imageViewer != null ? this._imageViewer.rotateAngle : 0;
                };
                ImageViewerAutomationControl.prototype.get_automationScaleFactor = function () {
                    return this._imageViewer != null ? this._imageViewer.scaleFactor : 0;
                };
                ImageViewerAutomationControl.prototype.get_isAutomationEventsHooked = function () { return this.isAutomationEventsHooked; };
                ImageViewerAutomationControl.prototype.set_isAutomationEventsHooked = function (value) {
                    this.isAutomationEventsHooked = value;
                };
                return ImageViewerAutomationControl;
            }());
            Annotations.ImageViewerAutomationControl = ImageViewerAutomationControl;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var MedicalPackDialog = /** @class */ (function () {
                function MedicalPackDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    // Run when close, "x", or background is clicked
                    this._onHideClicked = function () {
                        _this._objectID = lt.Annotations.Engine.AnnObject.selectObjectId;
                        if (_this.onHide) {
                            _this.onHide(_this._objectID);
                        }
                        _this.inner.hide();
                    };
                    this._medicalObjectBtns_BtnClicked = function (e) {
                        _this._objectID = parseInt($(e.target).val(), 10);
                        if (_this.onHide) {
                            _this.onHide(_this._objectID);
                        }
                        _this.inner.hide();
                    };
                    this.el = {
                        objects: root.find(selectors.objects),
                        hide: root.find(selectors.hide)
                    };
                    // Set root of dialog
                    this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    root.on("click", this.el.objects, this._medicalObjectBtns_BtnClicked);
                }
                Object.defineProperty(MedicalPackDialog.prototype, "objectID", {
                    get: function () {
                        return this._objectID;
                    },
                    enumerable: false,
                    configurable: true
                });
                MedicalPackDialog.prototype.show = function () {
                    this._objectID = lt.Annotations.Engine.AnnObject.selectObjectId;
                    this.inner.show();
                };
                return MedicalPackDialog;
            }());
            Annotations.MedicalPackDialog = MedicalPackDialog;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Annotations;
        (function (Annotations) {
            var AutomationContextInteractiveMode = /** @class */ (function (_super) {
                __extends(AutomationContextInteractiveMode, _super);
                function AutomationContextInteractiveMode() {
                    var _this = _super.call(this) || this;
                    _this._automation = null;
                    _this.id = AutomationContextInteractiveMode._id;
                    _this.name = AutomationContextInteractiveMode._name;
                    return _this;
                }
                AutomationContextInteractiveMode.prototype.get_name = function () { return AutomationContextInteractiveMode._name; };
                AutomationContextInteractiveMode.prototype.toString = function () { return "AutomationContextInteractiveMode"; };
                AutomationContextInteractiveMode.prototype.get_id = function () { return AutomationContextInteractiveMode._id; };
                Object.defineProperty(AutomationContextInteractiveMode.prototype, "automation", {
                    get: function () { return this._automation; },
                    set: function (value) {
                        if (this._automation != value) {
                            if (this._automation != null)
                                this._automation.active = false;
                            this._automation = value;
                            this._automation.active = true;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                // override
                AutomationContextInteractiveMode.prototype._invokeContext = function (args) {
                    if (this._automation == null)
                        return;
                    if (!this.canStartWork(args.eventArgs)) {
                        return;
                    }
                    if (this._automation.manager.userMode === lt.Annotations.Engine.AnnUserMode.run) {
                        return;
                    }
                    // Inform whoever is listening that we have started working
                    this.onWorkStarted(args.eventArgs);
                    // check if the automation is drawing an object
                    var automation = this._automation;
                    var currentDesigner = automation.currentDesigner;
                    if (currentDesigner != null && (currentDesigner instanceof lt.Annotations.Designers.AnnDrawDesigner)) {
                        // End the current designer. 
                        var drawingObject = currentDesigner.targetObject;
                        // End it
                        currentDesigner.end(); //automation.endDesigner();
                        // Select it
                        if (drawingObject != null) {
                            automation.selectObject(drawingObject);
                        }
                        // Don't fire, just return
                    }
                    else {
                        this.context.invoke(this, args);
                    }
                    // Inform whoever is listening that we have stopped working
                    this.onWorkCompleted(args.eventArgs);
                };
                // override
                AutomationContextInteractiveMode._name = "AutomationContext";
                // override
                AutomationContextInteractiveMode._id = lt.Controls.ImageViewerInteractiveMode.userModeId;
                return AutomationContextInteractiveMode;
            }(lt.Demos.Viewer.ContextInteractiveMode));
            Annotations.AutomationContextInteractiveMode = AutomationContextInteractiveMode;
        })(Annotations = Demos.Annotations || (Demos.Annotations = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
