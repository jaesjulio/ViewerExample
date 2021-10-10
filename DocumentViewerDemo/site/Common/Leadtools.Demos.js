/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
///<reference path="./../../../../../Bin/JS/ThirdParty/jquery/jquery.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.d.ts"/>
///<reference path="./../../../../../Bin/JS/Leadtools.Controls.d.ts"/>
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Utils;
        (function (Utils) {
            /** Choices for how a TransitionToggle instance should react when toggle is called in the middle of a toggle operation. */
            var TransitionToggleInterruptionAction;
            (function (TransitionToggleInterruptionAction) {
                /** Ignore and finish what we were doing */
                TransitionToggleInterruptionAction[TransitionToggleInterruptionAction["ignore"] = 0] = "ignore";
                /** Immediately toggle with the new action */
                TransitionToggleInterruptionAction[TransitionToggleInterruptionAction["immediate"] = 1] = "immediate";
                /** Wait for completion of toggle, then swap */
                TransitionToggleInterruptionAction[TransitionToggleInterruptionAction["wait"] = 2] = "wait";
            })(TransitionToggleInterruptionAction = Utils.TransitionToggleInterruptionAction || (Utils.TransitionToggleInterruptionAction = {}));
            // Transition Toggle
            // Most transitions can be handled easily with just one class (like color change on hover).
            // Advanced animations, like dialogs and notifications, need one "ready" class for positioning (or displaying)
            // and then another for the actual transition (like moving in from top or left).
            /**
            * A generic class for applying a "ready" class and "apply" class to a set of elements and running callbacks after the CSS transitions complete.
            */
            var TransitionToggle = /** @class */ (function () {
                /**
                 * Creates a new TransitionToggle instance.
                 * @param root The root elements to apply classes to.
                 */
                function TransitionToggle(root) {
                    // The element to which we'll be applying the classes
                    // May be separate from the one on which we listen to the transition event endings, based on the settings
                    this._roots = null;
                    /**
                    * The "base" class name for initial positioning or display state.
                    * Default: "tt-ready"
                    */
                    this.classReady = "tt-ready";
                    /**
                    * The "extension"/"application" class name that handles the real transition.
                    * Default: "tt-apply"
                    */
                    this.classApply = "tt-apply";
                    /**
                    * Whether or not transitions are enabled.
                    * If false, the toggle callback will be immediate and no transition listeners will be registered.
                    * Default: true
                    */
                    this.transitionEnabled = false;
                    /**
                    * A safety value, in ms, to force the transition to end with the callback if it has not yet been called.
                    * This could occur in cases where the CSS styles change but the JavaScript is not updated.
                    * If negative, there is no safety check.
                    * How long to wait, in ms, to force the end of a toggle (if transitions happen to be enabled in code but not in styles).
                    * Default: 2000
                    */
                    this.transitionMaxTime = 2000;
                    /**
                    * The action to take if toggle is called during a toggle operation.
                    * If the chosen action is "wait", the onWaitTime will be honored also.
                    * Default: TransitionToggleInterruptionAction.immediate (1)
                    */
                    this.interruptionAction = TransitionToggleInterruptionAction.immediate;
                    /**
                    * In ms, the time to wait in the "on" toggle state before allowing the "off" toggle to take effect
                    * if using TransitionToggleInterruptionAction.wait (2) as the interruption action.
                    * Default: 0
                    */
                    this.interruptionWaitTime = 0;
                    /**
                    * The JQuery object to listen for the transition completion events.
                    * A falsy value means to only allow transitions from the root.
                    * Default: null
                    */
                    this.transitionEndTargets = null;
                    this._isTransitioning = false;
                    this._isApplied = false;
                    this._timeoutId = -1;
                    this._transitionCallback = null;
                    this._waitTimeoutId = -1;
                    // Time in ms when the "on" state completed
                    this._onTime = -1;
                    this._waitCallbackToggleOnOff = false;
                    this._roots = root;
                }
                Object.defineProperty(TransitionToggle.prototype, "roots", {
                    /** The root elements provided in the constructor. */
                    get: function () {
                        return this._roots;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Dispose the toggle and destroy all pending callbacks.
                 */
                TransitionToggle.prototype.dispose = function () {
                    if (this._roots && this._transitionCallback) {
                        this._roots.off(TransitionToggle._transitionEvents, this._transitionCallback);
                        this._transitionCallback = null;
                    }
                    if (this._timeoutId !== -1) {
                        clearTimeout(this._timeoutId);
                        this._timeoutId = -1;
                    }
                    this._roots = null;
                    this.classReady = null;
                    this.classApply = null;
                    this.transitionEnabled = false;
                    this.transitionMaxTime = -1;
                    this.interruptionAction = null;
                    this.interruptionWaitTime = -1;
                    this.transitionEndTargets = null;
                    if (this._waitTimeoutId !== -1) {
                        clearTimeout(this._waitTimeoutId);
                        this._waitTimeoutId = -1;
                    }
                    this._waitCallback = null;
                    this._waitCallbackToggleOnOff = false;
                };
                TransitionToggle.prototype.update = function (options) {
                    if (!options)
                        return;
                    if (options.classReady !== undefined)
                        this.classReady = options.classReady;
                    if (options.classApply !== undefined)
                        this.classApply = options.classApply;
                    if (options.transitionEnabled !== undefined)
                        this.transitionEnabled = options.transitionEnabled;
                    if (options.transitionMaxTime !== undefined)
                        this.transitionMaxTime = options.transitionMaxTime;
                    if (options.transitionEndTargets !== undefined)
                        this.transitionEndTargets = options.transitionEndTargets;
                    if (options.interruptionAction !== undefined)
                        this.interruptionAction = options.interruptionAction;
                    if (options.interruptionWaitTime !== undefined)
                        this.interruptionWaitTime = options.interruptionWaitTime;
                };
                Object.defineProperty(TransitionToggle.prototype, "isTransitioning", {
                    /** Returns true between the time where the classes are applied and the callback is called. */
                    get: function () {
                        return this._isTransitioning;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(TransitionToggle.prototype, "isApplied", {
                    /** Returns true when the toggle is called to "on". */
                    get: function () {
                        return this._isApplied;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Toggles the transition state.
                 *
                 * @param onOff Optional on / off state. If not present, the opposite of the current state is applied.
                 * @param callback Optional callback to be run after the toggle. If the onOff parameter is the same as the given
                 * state, the "didToggle" parameter of this callback will be false.
                 */
                TransitionToggle.prototype.toggle = function (onOff, callback) {
                    var _this = this;
                    // Need a root element
                    if (!this._roots || !this._roots.length)
                        throw new Error("Cannot transition without root");
                    // In case an accidental param is passed
                    if (!callback || typeof (callback) !== "function")
                        callback = TransitionToggle._no_op;
                    if (this._isTransitioning && this.interruptionAction === TransitionToggleInterruptionAction.ignore) {
                        callback(false);
                        return;
                    }
                    // Add these to our closures
                    var roots = this._roots;
                    var interruptAction = this.interruptionAction;
                    var waitOnTime = this.interruptionWaitTime;
                    var endTargets = this.transitionEndTargets;
                    var events = TransitionToggle._transitionEvents;
                    var wasApplied = this._isApplied;
                    var newApplied = onOff !== undefined ? onOff : !wasApplied;
                    // Clear wait state always, regardless
                    if (this._waitTimeoutId !== -1) {
                        clearTimeout(this._waitTimeoutId);
                        this._waitTimeoutId = -1;
                        this._waitCallback = null;
                        this._waitCallbackToggleOnOff = false;
                    }
                    // We only wait on the transition in the "on" state
                    if (interruptAction === TransitionToggleInterruptionAction.wait) {
                        // Check to see if we can toggle or not
                        if (this._isTransitioning) {
                            // The toggle is still in progress, save
                            this._waitCallback = callback;
                            this._waitCallbackToggleOnOff = newApplied;
                            return;
                        }
                        else if (wasApplied && !newApplied && waitOnTime >= 0 && this._onTime !== -1) {
                            // The "on" state toggle is complete
                            var timeDiff = Math.max(0, Date.now() - this._onTime);
                            if (timeDiff < waitOnTime) {
                                // Wait
                                this._waitTimeoutId = setTimeout(function () {
                                    _this._waitTimeoutId = 1;
                                    _this.toggle(false, callback);
                                }, waitOnTime - timeDiff);
                                return;
                            }
                        }
                    }
                    this._isApplied = newApplied;
                    if (this._isApplied !== wasApplied) {
                        // Clear previous for an immediate toggle
                        roots.off(events, this._transitionCallback);
                        clearTimeout(this._timeoutId);
                        this._timeoutId = -1;
                    }
                    if (this._isApplied && !wasApplied) {
                        // Was not showing, now should be showing
                        // If we have a callback and are using transitions, call the callback *after*
                        if (lt.LTHelper.supportsCSSTransitions && this.transitionEnabled && callback) {
                            var showTransitionCallback = function (e) {
                                if (TransitionToggle.matches(e, roots, endTargets)) {
                                    showCallback();
                                }
                            };
                            this._transitionCallback = showTransitionCallback;
                            var showCallback = function () {
                                roots.off(events, showTransitionCallback);
                                _this._transitionCallback = null;
                                if (_this._timeoutId !== -1) {
                                    clearTimeout(_this._timeoutId);
                                    _this._timeoutId = -1;
                                }
                                if (_this._isTransitioning) {
                                    _this._isTransitioning = false;
                                    callback(true);
                                    // Handle wait callback if applicable and not already waiting
                                    _this._onTime = Date.now();
                                    _this._handleWaitCallback();
                                }
                            };
                            // Bind to the transitions
                            roots.one(events, this._transitionCallback);
                            // Set a backup timeout
                            this._timeoutId = setTimeout(function () {
                                showCallback();
                            }, this.transitionMaxTime);
                            this._isTransitioning = true;
                            roots.addClass(this.classReady);
                            roots.addClass(this.classApply);
                        }
                        else {
                            // Open and callback, immediately
                            roots.addClass(this.classReady);
                            roots.addClass(this.classApply);
                            callback(true);
                            // Handle wait callback if applicable and not already waiting
                            this._onTime = Date.now();
                            this._handleWaitCallback();
                        }
                    }
                    else if (!this._isApplied && wasApplied) {
                        // Was showing, now should not be showing
                        // Here we remove the apply class, bind to transitions, then call the callback after if it exists
                        if (lt.LTHelper.supportsCSSTransitions && this.transitionEnabled) {
                            var hideTransitionCallback = function (e) {
                                if (TransitionToggle.matches(e, roots, endTargets)) {
                                    hideCallback();
                                }
                            };
                            this._transitionCallback = hideTransitionCallback;
                            var hideCallback = function () {
                                roots.off(events, hideTransitionCallback);
                                _this._transitionCallback = null;
                                if (_this._timeoutId !== -1) {
                                    clearTimeout(_this._timeoutId);
                                    _this._timeoutId = -1;
                                }
                                if (_this._isTransitioning) {
                                    _this._isTransitioning = false;
                                    roots.removeClass(_this.classReady);
                                    callback(true);
                                    // Handle wait callback if applicable and not already waiting
                                    _this._handleWaitCallback();
                                }
                            };
                            // Bind to the transitions
                            roots.one(events, this._transitionCallback);
                            // Set a backup timeout
                            this._timeoutId = setTimeout(function () {
                                hideCallback();
                            }, this.transitionMaxTime);
                            this._isTransitioning = true;
                            roots.removeClass(this.classApply);
                        }
                        else {
                            roots.removeClass(this.classApply);
                            roots.removeClass(this.classReady);
                            callback(true);
                            // Handle wait callback if applicable and not already waiting
                            this._handleWaitCallback();
                        }
                    }
                    else {
                        // Call the callback still, but show that we didn't toggle
                        callback(false);
                    }
                };
                // Handle wait callback if applicable and not already waiting
                TransitionToggle.prototype._handleWaitCallback = function () {
                    var cb = this._waitCallback;
                    this._waitCallback = null;
                    var onOff = this._waitCallbackToggleOnOff;
                    if (cb && this._waitTimeoutId === -1) {
                        var toggleOp = this.toggle.bind(this, onOff, cb);
                        if (!onOff) {
                            this._waitTimeoutId = setTimeout(toggleOp, this.interruptionWaitTime);
                        }
                        else {
                            this._waitTimeoutId = setTimeout(toggleOp, 0);
                        }
                    }
                };
                // Check if the target is in the root JQuery object or the targets JQuery object
                TransitionToggle.matches = function (e, roots, targets) {
                    if (!e || !e.target)
                        return false;
                    if (targets) {
                        if (targets instanceof jQuery)
                            return targets.is(e.target);
                    }
                    else {
                        return roots.is(e.target);
                    }
                    return false;
                };
                TransitionToggle._transitionEvents = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd";
                TransitionToggle._no_op = function () { };
                return TransitionToggle;
            }());
            Utils.TransitionToggle = TransitionToggle;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="../utils/transition-toggle.ts" />
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Dialogs;
        (function (Dialogs) {
            /**
             * A class to handle the common aspects of a dialog UI component, replacing Bootstrap's implementation.
             * Used as a property of a wrapper dialog class.
             * Allows a simple show/hide method with a callback for transitions by using a TransitionToggle instance.
             */
            var InnerDialog = /** @class */ (function () {
                function InnerDialog(root) {
                    var _this = this;
                    this._root = null;
                    /** The transition toggle to handle CSS animations for this UI component. */
                    this.transitionToggle = null;
                    // State for detecting background-click dismissal
                    this._isBackgroundMouseDown = false;
                    this._onMouseDown = function (e) {
                        // The target must be the root, not any of its children
                        if (e.target === _this._root.get(0)) {
                            _this._isBackgroundMouseDown = true;
                            e.stopPropagation();
                        }
                        else {
                            _this._isBackgroundMouseDown = false;
                        }
                    };
                    this._onMouseUp = function (e) {
                        var mouseWasDown = _this._isBackgroundMouseDown;
                        _this._isBackgroundMouseDown = false;
                        if (mouseWasDown && e.target === _this._root.get(0) && _this.onRootClick)
                            _this.onRootClick();
                    };
                    /**
                    * Invoked when a click is made directly on the root.
                    * Set the property to call hide() to auto-hide on background click.
                    */
                    this.onRootClick = null;
                    /**
                    * Boolean value that, when true, prevents the effect of show() and hide().
                    * Any callbacks of show() and hide() are immediately called with false.
                    */
                    this.lockState = false;
                    if (root.length === 0)
                        throw new Error("Provided root element for dialog could not be found");
                    // Only use the first element
                    this._root = root.eq(0);
                    var toggle = new Demos.Utils.TransitionToggle(root);
                    // Configure our transition toggle from the defaults
                    toggle.update({
                        classReady: "dlg-ready",
                        classApply: "dlg-show",
                        transitionEnabled: true,
                        transitionMaxTime: 1000,
                        transitionEndTargets: null,
                        interruptionAction: Demos.Utils.TransitionToggleInterruptionAction.immediate,
                        interruptionWaitTime: 1000,
                    });
                    this.transitionToggle = toggle;
                    // Get the root element outside of JQuery
                    var rootElement = root.get(0);
                    // A common application is to auto-hide the dialog if the user clicks 
                    // within the overall dialog bounds but outside the visible dialog area
                    // We will call onRootClick() when this occurs
                    root.on("mousedown pointerdown", this._onMouseDown);
                    root.on("mouseup pointerup", this._onMouseUp);
                }
                Object.defineProperty(InnerDialog.prototype, "root", {
                    /** The root of the dialog, which is passed to the transitionToggle. */
                    get: function () {
                        return this._root;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(InnerDialog.prototype, "isShowing", {
                    // You do NOT *need* to check this value before calling show/hide
                    // Unless you have other conditional actions beyond show/hide
                    /** A shortcut for checking if the transition toggle classes are applied. */
                    get: function () {
                        return this.transitionToggle && this.transitionToggle.isApplied;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Show the dialog by invoking the transition toggle.
                 * If lockState is true, the callback fires immediately without toggling.
                 * @param postTransitionCallback Optional post-toggle callback.
                 */
                InnerDialog.prototype.show = function (postTransitionCallback) {
                    if (!this.transitionToggle || this.lockState) {
                        if (postTransitionCallback)
                            postTransitionCallback(false);
                        return;
                    }
                    this.transitionToggle.toggle(true, postTransitionCallback);
                };
                /**
                 * Hide the dialog by invoking the transition toggle.
                 * If lockState is true, the callback fires immediately without toggling.
                 * @param postTransitionCallback Optional post-toggle callback.
                 */
                InnerDialog.prototype.hide = function (postTransitionCallback) {
                    if (!this.transitionToggle || this.lockState) {
                        if (postTransitionCallback)
                            postTransitionCallback(false);
                        return;
                    }
                    this.transitionToggle.toggle(false, postTransitionCallback);
                };
                InnerDialog.prototype.dispose = function () {
                    if (this._root) {
                        this._root.off("mousedown pointerdown", this._onMouseDown);
                        this._root.off("mouseup pointerup", this._onMouseUp);
                        this._root = null;
                    }
                    if (this.transitionToggle) {
                        this.transitionToggle.dispose();
                        this.transitionToggle = null;
                    }
                };
                return InnerDialog;
            }());
            Dialogs.InnerDialog = InnerDialog;
        })(Dialogs = Demos.Dialogs || (Demos.Dialogs = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="./dialog.ts" />
// ^ Add manual reference to base dialog file because order matters for extending a class
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Dialogs;
        (function (Dialogs) {
            var AboutDialog = /** @class */ (function () {
                function AboutDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._onHideClicked = function () {
                        _this.inner.hide();
                    };
                    this.el = {
                        title: root.find(selectors.title),
                        hide: root.find(selectors.hide)
                    };
                    // Set root of dialog
                    this.inner = new Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                }
                Object.defineProperty(AboutDialog.prototype, "name", {
                    set: function (value) {
                        this.el.title.text(value);
                    },
                    enumerable: false,
                    configurable: true
                });
                AboutDialog.prototype.show = function (postTransitionCallback) {
                    this.inner.show(postTransitionCallback);
                };
                AboutDialog.prototype.dispose = function () {
                    this.el.hide.off("click", this._onHideClicked);
                    this._onHideClicked = null;
                    if (this.inner) {
                        this.inner.dispose();
                        this.inner = null;
                    }
                    this.el = null;
                };
                return AboutDialog;
            }());
            Dialogs.AboutDialog = AboutDialog;
        })(Dialogs = Demos.Dialogs || (Demos.Dialogs = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="./dialog.ts" />
// ^ Add manual reference to base dialog file because order matters for extending a class
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Dialogs;
        (function (Dialogs) {
            var LoadingDialog = /** @class */ (function () {
                function LoadingDialog(root, selectors) {
                    this.inner = null;
                    // Create shortcuts for the loading dialog UI elements
                    this.el = null;
                    this.el = {
                        title: root.find(selectors.title)
                    };
                    // Set root of dialog
                    this.inner = new Dialogs.InnerDialog(root);
                    // Set the loading dialog to always be open for at certain ms before starting closing transition
                    this.inner.transitionToggle.update({
                        interruptionAction: Demos.Utils.TransitionToggleInterruptionAction.wait,
                        interruptionWaitTime: 1000, // ms
                    });
                }
                LoadingDialog.prototype.show = function (title, postTransitionCallback) {
                    this.title = title;
                    this.inner.show(postTransitionCallback);
                };
                Object.defineProperty(LoadingDialog.prototype, "title", {
                    set: function (value) {
                        this.el.title.text(value || "");
                    },
                    enumerable: false,
                    configurable: true
                });
                LoadingDialog.prototype.hide = function (postTransitionCallback) {
                    this.inner.hide(postTransitionCallback);
                };
                LoadingDialog.prototype.dispose = function () {
                    if (this.inner) {
                        this.inner.dispose();
                        this.inner = null;
                    }
                    this.el = null;
                };
                return LoadingDialog;
            }());
            Dialogs.LoadingDialog = LoadingDialog;
        })(Dialogs = Demos.Dialogs || (Demos.Dialogs = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="./dialog.ts" />
// ^ Add manual reference to base dialog file because order matters for extending a class
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Dialogs;
        (function (Dialogs) {
            var OpenFileDialog = /** @class */ (function () {
                function OpenFileDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._onHideClicked = function () {
                        _this.inner.hide();
                    };
                    this._onSelectChanged = function () {
                        // When the select changes, if the value is "Enter URL" show the url text input (and ok button)
                        if (_this.el.itemSelect.val() === "Enter URL") {
                            _this.el.urlInput.container.show();
                        }
                        else {
                            _this.el.urlInput.container.hide();
                            // Trigger the callback and hide the dialog
                            if (_this.onIndexSelected)
                                _this.onIndexSelected(_this.el.itemSelect.prop("selectedIndex"));
                            _this.inner.hide();
                        }
                    };
                    // When input is confirmed with URL
                    this._onAcceptClicked = function () {
                        if (_this.onUrlGoClick)
                            _this.onUrlGoClick(_this.el.urlInput.textInput.val());
                        _this.inner.hide();
                    };
                    // Since all elements are within the root, use our recursive fill method
                    this.el = Demos.Utils.findSelectorsInRoot(root, selectors);
                    // Set root of dialog
                    this.inner = new Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                    // Initial UI setup
                    this.el.itemSelect.prop("selectedIndex", 0);
                    this.el.itemSelect.on("change", this._onSelectChanged);
                    this.el.urlInput.container.hide();
                    this.el.urlInput.acceptButton.on("click", this._onAcceptClicked);
                }
                OpenFileDialog.prototype.show = function (postTransitionCallback) {
                    this.inner.show(postTransitionCallback);
                };
                OpenFileDialog.prototype.dispose = function () {
                    this.el.hide.off("click", this._onHideClicked);
                    this.el.itemSelect.off("change", this._onSelectChanged);
                    this.el.urlInput.acceptButton.off("click", this._onAcceptClicked);
                    this._onHideClicked = null;
                    this._onSelectChanged = null;
                    this._onAcceptClicked = null;
                    if (this.inner) {
                        this.inner.dispose();
                        this.inner = null;
                    }
                    this.el = null;
                };
                return OpenFileDialog;
            }());
            Dialogs.OpenFileDialog = OpenFileDialog;
        })(Dialogs = Demos.Dialogs || (Demos.Dialogs = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2021 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
/// <reference path="./dialog.ts" />
// ^ Add manual reference to base dialog file because order matters for extending a class
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Dialogs;
        (function (Dialogs) {
            var TextResultDialog = /** @class */ (function () {
                function TextResultDialog(root, selectors) {
                    var _this = this;
                    this.inner = null;
                    // Create shortcuts for the dialog UI elements
                    this.el = null;
                    this._onHideClicked = function () {
                        _this.inner.hide();
                    };
                    this.el = {
                        title: root.find(selectors.title),
                        textResult: root.find(selectors.textResult),
                        hide: root.find(selectors.hide)
                    };
                    // Set root of dialog
                    this.inner = new Dialogs.InnerDialog(root);
                    // Set auto-hide on background click
                    // Set hide on click
                    this.inner.onRootClick = this._onHideClicked;
                    this.el.hide.on("click", this._onHideClicked);
                }
                TextResultDialog.prototype.update = function (title, text) {
                    this.el.title.text(title);
                    this.el.textResult.text(Demos.Utils.UI.normalizeIEText(text));
                };
                TextResultDialog.prototype.show = function (postTransitionCallback) {
                    this.inner.show(postTransitionCallback);
                };
                TextResultDialog.prototype.dispose = function () {
                    this.el.hide.off("click", this._onHideClicked);
                    this._onHideClicked = null;
                    if (this.inner) {
                        this.inner.dispose();
                        this.inner = null;
                    }
                    this.el = null;
                };
                return TextResultDialog;
            }());
            Dialogs.TextResultDialog = TextResultDialog;
        })(Dialogs = Demos.Dialogs || (Demos.Dialogs = {}));
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
        // A place for methods that don't really belong in any of the subfolder groups
        var Utils;
        (function (Utils) {
            /** Function to recursively fill a tree of string selectors with their JQuery objects by searching within the provided root. */
            function findSelectorsInRoot(root, selectors) {
                var newObject = {};
                var keys = Object.keys(selectors);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = selectors[key];
                    // If string, find the element under the root.
                    if (typeof value === "string") {
                        newObject[key] = root.find(value);
                    }
                    else if (typeof value === "object" && !Array.isArray(value)) {
                        // If the value is itself an object, use recursion
                        newObject[key] = findSelectorsInRoot(root, value);
                    }
                }
                return newObject;
            }
            Utils.findSelectorsInRoot = findSelectorsInRoot;
            function byteArrayToArrayBuffer(array) {
                var bytes = new Uint8Array(array.length);
                array.forEach(function (val, i) {
                    bytes[i] = val;
                });
                return bytes.buffer;
            }
            Utils.byteArrayToArrayBuffer = byteArrayToArrayBuffer;
            // A "polyfill" for Object.Assign (ES2015), which merges objects (shallow copy)
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
            function objectAssign(target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                if (typeof Object["assign"] === "function") {
                    return Object["assign"].apply(Object, arguments);
                }
                else {
                    // We must check against these specific cases.
                    if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var output = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var source = arguments[index];
                        if (source !== undefined && source !== null) {
                            for (var nextKey in source) {
                                if (source.hasOwnProperty(nextKey)) {
                                    output[nextKey] = source[nextKey];
                                }
                            }
                        }
                    }
                    return output;
                }
            }
            Utils.objectAssign = objectAssign;
            // A "polyfill" for String.Format from .NET, which allows for string formatting like the following:
            //    .format("{0} + {1} is {2}", 4, 5, 9) ==> "4 + 5 is 9"
            // Keeps nulls/false, etc, allows multiple of a number
            // When ES6 is available, use string interpolation instead (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
            function stringFormat(template) {
                var replacements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    replacements[_i - 1] = arguments[_i];
                }
                return template.replace(/{(\d+)}/g, function (matchedString, matchedNumber) {
                    return typeof replacements[matchedNumber] !== "undefined" ? replacements[matchedNumber] : matchedString;
                });
            }
            Utils.stringFormat = stringFormat;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Utils;
        (function (Utils) {
            /**
             * Creates a <style> element to be appended to the page with the given declarations.
             */
            var DynamicStyle = /** @class */ (function () {
                function DynamicStyle(id, comment, blocks) {
                    this._element = null;
                    // Check if ID is already in use
                    if (DynamicStyle.exists(id))
                        throw "Element with given id '" + id + "' already exists in <head>";
                    var style = document.createElement("style");
                    this._element = style;
                    style.setAttribute("data-dynamic-id", id);
                    style.type = "text/css";
                    if (!comment)
                        comment = "Dynamic styles for '" + id + "'";
                    var text = "/* " + comment + " */\n";
                    for (var i = 0; i < blocks.length; i++) {
                        var block = blocks[i];
                        text += DynamicStyle.createStyleBlockString(block);
                    }
                    style.innerHTML = text;
                    document.head.appendChild(style);
                }
                /**
                 * Checks if a <style> already exists with the given ID.
                 * @param id the ID
                 */
                DynamicStyle.exists = function (id) {
                    return !!document.head.querySelector("[data-dynamic-id='" + id + "']");
                };
                Object.defineProperty(DynamicStyle.prototype, "element", {
                    /**
                     * The <style> element.
                     */
                    get: function () {
                        return this._element;
                    },
                    enumerable: false,
                    configurable: true
                });
                /**
                 * Removes the <style> element.
                 */
                DynamicStyle.prototype.dispose = function () {
                    if (this._element) {
                        if (this._element.parentNode)
                            this._element.parentNode.removeChild(this._element);
                        this._element = null;
                    }
                };
                /**
                 * Creates a StyleBlock object.
                 * @param rule
                 * @param declarations
                 */
                DynamicStyle.createStyleBlock = function (rule, declarations) {
                    return {
                        rule: rule,
                        declarations: declarations
                    };
                };
                /**
                 * Creates a string from the StyleBlock.
                 * @param block
                 */
                DynamicStyle.createStyleBlockString = function (block) {
                    var output = [block.rule + " {"];
                    block.declarations.forEach(function (tuple) {
                        output.push("   " + tuple[0] + ": " + tuple[1] + ";");
                    });
                    output.push("}");
                    return output.join("\n") + "\n";
                };
                return DynamicStyle;
            }());
            Utils.DynamicStyle = DynamicStyle;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Utils;
        (function (Utils) {
            var Network = /** @class */ (function () {
                function Network() {
                }
                Object.defineProperty(Network, "queryString", {
                    get: function () {
                        return Network._queryString;
                    },
                    enumerable: false,
                    configurable: true
                });
                ;
                Network.isValidURI = function (uri) {
                    var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    if (RegExp.test(uri)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Network.showRequestError = function (jqueryXHR, statusText, errorThrown) {
                    var body = null;
                    var detail = null;
                    try {
                        body = JSON.parse(jqueryXHR.responseText);
                        detail = "(" + body["detail"] + ")";
                        (window.console && console.log && console.log("Error: " + detail));
                    }
                    catch (e) {
                        (window.console && console.log && console.log("Could not parse JSON from Error"));
                        detail = "(Error " + jqueryXHR.status + ": " + jqueryXHR.statusText + ")";
                    }
                    var message = [
                        "An error has occurred in the application.",
                        detail
                    ].join("\n");
                    window.alert(message);
                    jqueryXHR = null;
                };
                Network.addParamsToUrl = function (url, params, encodeUriComponent) {
                    url += "?";
                    var keys = Object.keys(params);
                    keys.forEach(function (key, idx) {
                        var value = params[key];
                        if (!encodeUriComponent)
                            url += key + "=" + value;
                        else
                            url += encodeURIComponent(key) + "=" + encodeURIComponent(value);
                        if (idx != keys.length - 1) {
                            url += "&";
                        }
                    });
                    return url;
                };
                // Example: ..../index.html?a=b&c=d&e=f&a=g ==> {"a":["b","g"], "c":["d"], "e":["f"]}
                // All values are strings
                Network._queryString = (function () {
                    var queryString = {};
                    var search = window.location.search;
                    var hash = window.location.hash;
                    if (search === "" && hash) {
                        search = hash;
                    }
                    var query = search.substring(1);
                    // Trim the slash if it's at the end
                    if (query[query.length - 1] === "/")
                        query = query.substring(0, query.length - 1);
                    var vars = query.split("&");
                    for (var i = 0; i < vars.length; i++) {
                        var keyVal = vars[i].split("=");
                        var key = keyVal[0];
                        var val = decodeURIComponent(keyVal[1]);
                        if (typeof queryString[key] === "undefined") {
                            queryString[key] = [val];
                        }
                        else {
                            queryString[key].push(val);
                        }
                    }
                    return queryString;
                })();
                return Network;
            }());
            Utils.Network = Network;
            var ServiceHeartbeatPreRequestEventArgs = /** @class */ (function (_super) {
                __extends(ServiceHeartbeatPreRequestEventArgs, _super);
                function ServiceHeartbeatPreRequestEventArgs() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.serviceHeartbeat = null;
                    _this.eventTime = -1;
                    _this.cancel = false;
                    return _this;
                }
                ServiceHeartbeatPreRequestEventArgs.create = function (serviceHeartbeat, eventTime) {
                    var args = new ServiceHeartbeatPreRequestEventArgs();
                    args.serviceHeartbeat = serviceHeartbeat;
                    args.eventTime = eventTime;
                    args.cancel = false;
                    return args;
                };
                return ServiceHeartbeatPreRequestEventArgs;
            }(lt.LeadEventArgs));
            Utils.ServiceHeartbeatPreRequestEventArgs = ServiceHeartbeatPreRequestEventArgs;
            var ServiceHeartbeatPostRequestEventArgs = /** @class */ (function (_super) {
                __extends(ServiceHeartbeatPostRequestEventArgs, _super);
                function ServiceHeartbeatPostRequestEventArgs() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.serviceHeartbeat = null;
                    _this.eventTime = -1;
                    _this.requestTime = -1;
                    _this.responseTime = -1;
                    _this.jqueryXHR = null;
                    _this.isSuccess = false;
                    _this.isError = false;
                    return _this;
                }
                ServiceHeartbeatPostRequestEventArgs.create = function (serviceHeartbeat, eventTime, requestTime, responseTime, jqueryXHR, isSuccess, isError) {
                    var args = new ServiceHeartbeatPostRequestEventArgs();
                    args.serviceHeartbeat = serviceHeartbeat;
                    args.eventTime = eventTime;
                    args.requestTime = requestTime;
                    args.responseTime = responseTime;
                    args.jqueryXHR = jqueryXHR;
                    args.isSuccess = isSuccess;
                    args.isError = isError;
                    return args;
                };
                return ServiceHeartbeatPostRequestEventArgs;
            }(lt.LeadEventArgs));
            Utils.ServiceHeartbeatPostRequestEventArgs = ServiceHeartbeatPostRequestEventArgs;
            /** Makes repeated calls to a server and executes a callback on failure. */
            var ServiceHeartbeat = /** @class */ (function () {
                function ServiceHeartbeat(options) {
                    var _this = this;
                    this.requestSettings = null;
                    this.autoPauseInteractionTimeout = null;
                    this.timer = null;
                    this.preRequest = lt.LeadEvent.create(this, "preRequest");
                    this.postRequest = lt.LeadEvent.create(this, "postRequest");
                    this.onTick = function (args, timerTickDone) {
                        if (_this._isDisposed) {
                            if (_this.timer)
                                _this.timer.dispose();
                            timerTickDone();
                            return;
                        }
                        // Internal timer is now paused. Call timerTickDone to restart...
                        var preArgs = ServiceHeartbeatPreRequestEventArgs.create(_this, args.tickTime);
                        _this.preRequest.invoke(_this, preArgs);
                        if (!_this.requestSettings) {
                            _this.timer.stop();
                            timerTickDone();
                            return;
                        }
                        if (preArgs.cancel) {
                            timerTickDone();
                            return;
                        }
                        var requestTime = Date.now();
                        var responseTime = -1;
                        var isSuccess = false;
                        var isError = false;
                        var jqXHR = $.ajax(_this.requestSettings)
                            .done(function () {
                            responseTime = Date.now();
                            isSuccess = true;
                        })
                            .fail(function () {
                            responseTime = Date.now();
                            isError = true;
                        })
                            .always(function () {
                            if (_this._isDisposed)
                                return;
                            var postArgs = ServiceHeartbeatPostRequestEventArgs.create(_this, args.tickTime, requestTime, responseTime, jqXHR, isSuccess, isError);
                            _this.postRequest.invoke(_this, postArgs);
                            // Give control back to the timer
                            if (isError)
                                _this.timer.stop();
                            timerTickDone();
                        });
                    };
                    this._autoPauseTimeoutId = -1;
                    this._isDisposed = false;
                    if (!options)
                        throw new Error("options cannot be falsy");
                    this.requestSettings = options.requestSettings;
                    this.autoPauseInteractionTimeout = options.autoPauseInteractionTimeout;
                    this.timer = new Timer({
                        startTimeout: options.startTimeout,
                        interval: options.interval,
                        resumeTimeout: options.resumeTimeout,
                        onTickAsync: this.onTick,
                    });
                }
                Object.defineProperty(ServiceHeartbeat.prototype, "startTimeout", {
                    get: function () {
                        return this.timer.startTimeout;
                    },
                    set: function (value) {
                        this.timer.startTimeout = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ServiceHeartbeat.prototype, "interval", {
                    get: function () {
                        return this.timer.interval;
                    },
                    set: function (value) {
                        this.timer.interval = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ServiceHeartbeat.prototype, "resumeTimeout", {
                    get: function () {
                        return this.timer.resumeTimeout;
                    },
                    set: function (value) {
                        this.timer.resumeTimeout = value;
                    },
                    enumerable: false,
                    configurable: true
                });
                ServiceHeartbeat.prototype.clearAutoPause = function () {
                    if (this._autoPauseTimeoutId !== -1) {
                        clearTimeout(this._autoPauseTimeoutId);
                        this._autoPauseTimeoutId = -1;
                    }
                };
                ServiceHeartbeat.prototype.restartAutoPauseTimer = function () {
                    var _this = this;
                    this.clearAutoPause();
                    if (!this.isStarted)
                        return;
                    if (this.autoPauseInteractionTimeout > 0) {
                        this._autoPauseTimeoutId = setTimeout(function () {
                            _this.timer.pause();
                        }, this.autoPauseInteractionTimeout);
                    }
                };
                ServiceHeartbeat.prototype.start = function () {
                    this.timer.start();
                    this.restartAutoPauseTimer();
                };
                Object.defineProperty(ServiceHeartbeat.prototype, "isStarted", {
                    get: function () {
                        return this.timer.isStarted;
                    },
                    enumerable: false,
                    configurable: true
                });
                ServiceHeartbeat.prototype.stop = function () {
                    this.timer.stop();
                    this.clearAutoPause();
                };
                ServiceHeartbeat.prototype.pause = function () {
                    this.timer.pause();
                    this.clearAutoPause();
                };
                Object.defineProperty(ServiceHeartbeat.prototype, "isPaused", {
                    get: function () {
                        return this.timer.isPaused;
                    },
                    enumerable: false,
                    configurable: true
                });
                ServiceHeartbeat.prototype.resume = function () {
                    this.timer.resume();
                    this.restartAutoPauseTimer();
                };
                Object.defineProperty(ServiceHeartbeat.prototype, "isRequesting", {
                    get: function () {
                        return this.timer.isInTickAsync;
                    },
                    enumerable: false,
                    configurable: true
                });
                ServiceHeartbeat.prototype.dispose = function () {
                    if (this._isDisposed)
                        return;
                    this._isDisposed = true;
                    this.stop();
                    this.timer.dispose();
                    this.timer = null;
                    this.requestSettings = null;
                    this.preRequest = null;
                    this.postRequest = null;
                };
                return ServiceHeartbeat;
            }());
            Utils.ServiceHeartbeat = ServiceHeartbeat;
            var Timer = /** @class */ (function () {
                function Timer(options) {
                    /** The time (in ms) to wait before the first tick. This value will take affect the next time the timer is stopped. */
                    this.startTimeout = -1;
                    /** The time (in ms) to wait between subsequent ticks after the first. This value will take affect the next time the timer is stopped. */
                    this.interval = -1;
                    /** The time (in ms) to wait before the first tick after resuming. This value will take affect the next time the timer is stopped. */
                    this.resumeTimeout = -1;
                    /** The callback to be run when the timer ticks. The second argument must be called to return control to the timer. */
                    this.onTickAsync = null;
                    /** Any data to attach to the Timer, optionally set from the options object in the constructor. */
                    this.data = null;
                    // Used to clear the setTimeout
                    this._currentTimeoutId = -1;
                    this._currentStartTimeout = -1;
                    this._currentInterval = -1;
                    this._currentResumeTimeout = -1;
                    this._tickCount = 0;
                    this._isStarted = false;
                    this._isPaused = false;
                    this._internalTickAsyncDone = null;
                    if (!options)
                        throw new Error("options cannot be falsy");
                    this.startTimeout = options.startTimeout;
                    this.interval = options.interval;
                    this.resumeTimeout = options.resumeTimeout;
                    this.onTickAsync = options.onTickAsync;
                    if (options.data)
                        this.data = options.data;
                    this.stop();
                }
                /**
                 * Creates a new instance.
                 */
                Timer.create = function (options) {
                    return new Timer(options);
                };
                /** Starts the timer if it is stopped. If it is started, it stops the timer and starts it again. The tick count is reset. */
                Timer.prototype.start = function () {
                    if (this.isStarted)
                        this.stop();
                    // Set to started
                    this._isStarted = true;
                    // Copy over the startTimeout and interval
                    this._currentStartTimeout = this.startTimeout;
                    this._currentInterval = this.interval;
                    this._currentResumeTimeout = this.resumeTimeout;
                    // Reset tick count
                    this._tickCount = 0;
                    // Resume
                    this._resume(this._currentStartTimeout, true);
                };
                Object.defineProperty(Timer.prototype, "currentStartTimeout", {
                    /** The current startTimeout. */
                    get: function () {
                        return this._currentStartTimeout;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Timer.prototype, "currentInterval", {
                    /** The current interval. */
                    get: function () {
                        return this._currentInterval;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Timer.prototype, "currentResumeTimeout", {
                    /** The current resumeTimeout. */
                    get: function () {
                        return this._currentResumeTimeout;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Timer.prototype, "tickCount", {
                    /** The number of ticks since the timer was last stopped. */
                    get: function () {
                        return this._tickCount;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Timer.prototype, "isStarted", {
                    /** Whether or not the timer is started. */
                    get: function () {
                        return this._isStarted;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Timer.prototype, "isPaused", {
                    /** Whether or not the timer is started and paused. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
                    get: function () {
                        return this._isStarted && this._isPaused;
                    },
                    enumerable: false,
                    configurable: true
                });
                /** Pauses a started timer. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
                Timer.prototype.pause = function () {
                    // If paused, we can't pause. If not started, we can't pause.
                    if (this.isPaused || !this.isStarted)
                        return;
                    this._isPaused = true;
                    // Clear the timeout. It will be restarted in resume.
                    if (this._currentTimeoutId !== -1) {
                        clearTimeout(this._currentTimeoutId);
                        this._currentTimeoutId = -1;
                    }
                };
                /** Resumes a paused timer. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
                Timer.prototype.resume = function () {
                    this._resume(this._currentResumeTimeout, false);
                };
                Timer.prototype._resume = function (timeout, skipPauseCheck) {
                    var _this = this;
                    // Check for isInTickAsync - if true, user's callback is calling resume, which is not allowed.
                    if (this.isInTickAsync || !this._isStarted)
                        return;
                    if (skipPauseCheck) {
                        /* Reasons to skip pause check:
                         * - Coming from start
                         * - Coming from the tick, which didn't have a user-supplied callback
                         */
                    }
                    else {
                        if (!this.isPaused)
                            return;
                    }
                    this._isPaused = false;
                    // Restart the timeout.
                    if (timeout < 0)
                        timeout = 0;
                    this._currentTimeoutId = setTimeout(function () {
                        _this.tickAsync();
                    }, timeout);
                };
                Object.defineProperty(Timer.prototype, "isInTickAsync", {
                    /** Returns true if the async tick callback is running and the timer is not stopped. */
                    get: function () {
                        return !!this._internalTickAsyncDone;
                    },
                    enumerable: false,
                    configurable: true
                });
                /** Stops the timer. */
                Timer.prototype.stop = function () {
                    if (!this.isStarted)
                        return;
                    this.pause();
                    this._isStarted = false;
                    this._internalTickAsyncDone = null;
                };
                /** Stops the timer and cleans it up. */
                Timer.prototype.dispose = function () {
                    this.stop();
                    this.startTimeout = -1;
                    this.interval = -1;
                    this.resumeTimeout = -1;
                    this.onTickAsync = null;
                };
                Timer.prototype.tickAsync = function () {
                    var _this = this;
                    if (this.isPaused || !this.isStarted)
                        return;
                    // Increment the counter. It is reset on start.
                    this._tickCount++;
                    if (!this.onTickAsync) {
                        // If no callback, resume with the interval time
                        // We already checked for pause outside of this
                        this._resume(this._currentInterval, true);
                        return;
                    }
                    else {
                        // When the user calls "done", resume...
                        this._internalTickAsyncDone = function () {
                            // Resume with the interval time.
                            // Do the opposite of what's expected - if not paused, resume; if paused, don't resume.
                            if (!_this.isPaused)
                                _this._resume(_this._currentInterval, true);
                        };
                        // Create our arguments
                        var args = {
                            timer: this,
                            tickTime: Date.now()
                        };
                        // Call the callback with our arguments.
                        this.onTickAsync(args, function () {
                            // After running, check that we still have an internal callback.
                            // If we don't, we should be stopped.
                            var done = _this._internalTickAsyncDone;
                            _this._internalTickAsyncDone = null;
                            if (done)
                                done();
                        });
                    }
                };
                return Timer;
            }());
            Utils.Timer = Timer;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Utils;
        (function (Utils) {
            // A utility to make system-like notifications within a certain container.
            // Issues with this utility is more likely to be from the CSS, not the JS.
            // To use, just pass the root that you want notifications in.
            // You made need to modify "lt-notify-container" to be position: relative if you want notifications to push the boundary of the root.
            var NotificationGroup = /** @class */ (function () {
                function NotificationGroup(root) {
                    // To tell the difference between groups
                    this._id = 0;
                    this._currentNotifications = [];
                    // This value is changed when the checkbox changes, but you can override it later
                    this.showGroupNotifications = true;
                    this._isShowingNotification = false;
                    // Add classes to the root
                    this._root = root;
                    this._root.addClass("lt-notify-root");
                    this._id = NotificationGroup._id++;
                    // Check if we already have a container. If not, add it. Otherwise, use it
                    var container = this._root.children(".lt-notify-container");
                    if (!container.length) {
                        this._container = $(document.createElement("div")).addClass("lt-notify-container");
                        this._root.append(this._container);
                    }
                    else {
                        this._container = container;
                    }
                }
                Object.defineProperty(NotificationGroup.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(NotificationGroup.prototype, "isShowingNotification", {
                    get: function () {
                        return false;
                    },
                    enumerable: false,
                    configurable: true
                });
                NotificationGroup.prototype.notify = function (header, message, opts) {
                    if (!this.showGroupNotifications || !NotificationGroup._showAllNotifications)
                        return;
                    this._isShowingNotification = true;
                    // Create a copy of our defaults with our additional opts over the top
                    opts = Utils.objectAssign({}, opts || {}, NotificationGroup.defaultOpts);
                    var notification = new Notification(this, header, message, opts);
                    notification.groupToggleGroupChange = this._toggleGroupChange.bind(this);
                    notification.groupToggleAllChange = this._toggleAllChange.bind(this);
                    notification.groupHide = this._hideNotification.bind(this);
                    this._currentNotifications.push(notification);
                    this._container.append(notification.ui.root);
                    // Set a timeout so the notification has time to display
                    setTimeout(function () {
                        notification.show();
                    }, 500);
                };
                NotificationGroup.prototype.dispose = function () {
                    this._currentNotifications.forEach(function (notification) {
                        notification.dispose();
                    });
                    this._currentNotifications = null;
                    this._root = null;
                    this._container = null;
                };
                // When any notification says "don't show any", change all the checkboxes
                NotificationGroup.prototype._toggleAllChange = function (checked) {
                    var show = !checked;
                    if (NotificationGroup._showAllNotifications !== show) {
                        NotificationGroup._showAllNotifications = show;
                        $(".lt-notify").each(function (index, element) {
                            var $notify = $(element);
                            $notify.find(".lt-notify-check-all input").prop("checked", checked);
                            $notify.find(".lt-notify-check-group input").prop("disabled", checked);
                        });
                    }
                };
                // When any notification says "no more of this type", change all for that group
                NotificationGroup.prototype._toggleGroupChange = function (checked) {
                    var show = !checked;
                    if (this.showGroupNotifications !== show) {
                        this.showGroupNotifications = show;
                        $(".lt-notify-input-group-" + this.id).prop("checked", checked);
                    }
                };
                NotificationGroup.prototype._hideNotification = function (notification) {
                    var index = this._currentNotifications.indexOf(notification);
                    if (index !== -1) {
                        this._currentNotifications.splice(index, 1);
                        // Set timeout to allow for transitions
                        setTimeout(function () {
                            notification.dispose();
                        }, 1000);
                    }
                };
                // Track the different groups with IDs
                NotificationGroup._id = 0;
                NotificationGroup._showAllNotifications = true;
                // modifying these opts will not effect previous notifications
                NotificationGroup.defaultOpts = {
                    seconds: 5,
                    useTransitions: true,
                    className: null
                };
                return NotificationGroup;
            }());
            Utils.NotificationGroup = NotificationGroup;
            var Notification = /** @class */ (function () {
                function Notification(group, header, message, opts) {
                    this._header = header;
                    this._message = message;
                    this._group = group;
                    this._opts = opts;
                    this.ui = new NotificationUI(group.id, opts.useTransitions);
                    // You can pass a special class for different styles
                    if (this._opts.className)
                        this.ui.root.addClass(this._opts.className);
                    // Set our text
                    this.ui.header.text(header);
                    this.ui.message.text(message);
                    // Bind the input changes
                    this.ui.checkGroupInput.change(this.toggleGroupChange.bind(this));
                    this.ui.checkAllInput.change(this.toggleAllChange.bind(this));
                    // When the controls button is click, hide it and show the controls
                    this.ui.controlsButton.click(this.controlsButtonClick.bind(this));
                    // When time is clicked, hide it and show close
                    this.ui.time.click(this.stopTimeout.bind(this));
                    // Close
                    this.ui.close.click(this.hide.bind(this));
                }
                // Stop our countdown, and show the close button instead
                Notification.prototype.stopTimeout = function () {
                    this.ui.root.addClass("lt-notify-no-time");
                    if (this._intervalId !== -1) {
                        clearInterval(this._intervalId);
                        this._intervalId = -1;
                    }
                };
                // Stop our countdown, and show the controls
                Notification.prototype.controlsButtonClick = function () {
                    this.stopTimeout();
                    this.ui.root.addClass("lt-notify-show-controls");
                };
                Notification.prototype.toggleGroupChange = function () {
                    this.stopTimeout();
                    var checked = this.ui.checkGroupInput.is(":checked");
                    this.groupToggleGroupChange(checked);
                };
                Notification.prototype.toggleAllChange = function () {
                    this.stopTimeout();
                    var checked = this.ui.checkAllInput.is(":checked");
                    this.groupToggleAllChange(checked);
                };
                Notification.prototype.show = function () {
                    var _this = this;
                    this.ui.show(function () {
                        // Start the timing sequence
                        var timeLeft = _this._opts.seconds;
                        var update = function () {
                            if (timeLeft <= 0) {
                                clearInterval(_this._intervalId);
                                _this._intervalId = -1;
                                _this.hide();
                                return;
                            }
                            _this.ui.time.text(timeLeft);
                            timeLeft--;
                        };
                        _this._intervalId = setInterval(function () {
                            update();
                        }, 1000);
                        update();
                    });
                };
                Notification.prototype.hide = function () {
                    var _this = this;
                    this.stopTimeout();
                    this.ui.hide(function () {
                        _this.groupHide(_this);
                    });
                };
                // Currently unused
                //public flash(): void {
                //   this.ui.root.removeClass("lt-notify-flash");
                //   this.ui.root.addClass("lt-notify-flash");
                //}
                Notification.prototype.dispose = function () {
                    this.stopTimeout();
                    this.ui.dispose();
                    this._opts = null;
                    this.groupHide = null;
                    this.groupToggleAllChange = null;
                    this.groupToggleGroupChange = null;
                    this._group = null;
                    this._header = null;
                    this._message = null;
                    this._intervalId = -1;
                };
                return Notification;
            }());
            var NotificationUI = /** @class */ (function () {
                function NotificationUI(groupId, useTransitions) {
                    // Don't listen for callbacks if we shouldn't
                    this._useTransitions = true;
                    this._toggle = null;
                    this.root = null;
                    this.time = null;
                    this.close = null;
                    this.header = null;
                    this.message = null;
                    this.controlsButton = null;
                    this.controls = null;
                    this.checkGroupInput = null;
                    this.checkAllInput = null;
                    this._useTransitions = useTransitions && lt.LTHelper.supportsCSSTransitions;
                    this.constructUI(NotificationUI.id++, groupId);
                    this._toggle = new Utils.TransitionToggle(this.root);
                    this._toggle.update({
                        classReady: NotificationUI._readyClass,
                        classApply: NotificationUI._showClass
                    });
                }
                // Optional callback, since CSS Transitions may cause an async opening
                NotificationUI.prototype.show = function (postTransitionCallback) {
                    this._toggle.toggle(true, postTransitionCallback);
                };
                // Optional callback, since CSS Transitions may cause an async closing
                NotificationUI.prototype.hide = function (postTransitionsCallback) {
                    this._toggle.toggle(false, postTransitionsCallback);
                };
                NotificationUI.prototype.constructUI = function (uiId, groupId) {
                    this.root = $(document.createElement("div")).addClass("lt-notify");
                    var $inner = $(document.createElement("div")).addClass("lt-notify-inner");
                    this.time = $(document.createElement("span")).addClass("lt-notify-time");
                    this.close = $(document.createElement("span")).addClass("lt-notify-close").text("x");
                    var $headerBorder = $(document.createElement("div")).addClass("lt-notify-header-border");
                    this.header = $(document.createElement("h3")).addClass("lt-notify-header");
                    $headerBorder.append(this.header);
                    this.message = $(document.createElement("p")).addClass("lt-notify-message");
                    this.controlsButton = $(document.createElement("button")).addClass("lt-notify-controls-button");
                    this.controls = $(document.createElement("div")).addClass("lt-notify-controls");
                    var inputId = "lt_notify_inputA_" + uiId;
                    var $checkGroupHolder = $(document.createElement("div")).addClass("lt-notify-check-holder lt-notify-check-group");
                    this.checkGroupInput = $(document.createElement("input")).attr({ type: "checkbox", id: inputId }).addClass("lt-notify-input-group-" + groupId);
                    var $checkGroupHolderCheckLabel = $(document.createElement("label")).addClass("lt-notify-label-special").attr({ for: inputId });
                    var $checkGroupHolderLabel = $(document.createElement("label")).addClass("lt-notify-label").text("Don't show notifications like this").attr({ for: inputId });
                    $checkGroupHolder.append(this.checkGroupInput, $checkGroupHolderCheckLabel, $checkGroupHolderLabel);
                    inputId = "lt_notify_inputB_" + uiId;
                    var $checkAllHolder = $(document.createElement("div")).addClass("lt-notify-check-holder lt-notify-check-all");
                    this.checkAllInput = $(document.createElement("input")).attr({ type: "checkbox", id: inputId });
                    var $checkAllHolderCheckLabel = $(document.createElement("label")).addClass("lt-notify-label-special").attr({ for: inputId });
                    var $checkAllHolderLabel = $(document.createElement("label")).addClass("lt-notify-label").text("Don't show any more notifications").attr({ for: inputId });
                    $checkAllHolder.append(this.checkAllInput, $checkAllHolderCheckLabel, $checkAllHolderLabel);
                    this.controls.append($checkGroupHolder, $checkAllHolder);
                    $inner.append(this.time, this.close, $headerBorder, this.message, this.controlsButton, this.controls);
                    this.root.append($inner);
                };
                NotificationUI.prototype.dispose = function () {
                    if (this.root) {
                        this._toggle.dispose();
                        this._toggle = null;
                        this.root.empty();
                        this.root.remove();
                        this.root = null;
                        this.time = null;
                        this.close = null;
                        this.header = null;
                        this.message = null;
                        this.controlsButton = null;
                        this.controls = null;
                        this.checkGroupInput = null;
                        this.checkAllInput = null;
                    }
                };
                // For label-input binding
                NotificationUI.id = 0;
                // For toggling
                NotificationUI._readyClass = "lt-notify-ready";
                NotificationUI._showClass = "lt-notify-show";
                return NotificationUI;
            }());
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Viewer;
        (function (Viewer) {
            /**
             * The state of an item in the context menu.
             **/
            var ContextMenuUpdateState;
            (function (ContextMenuUpdateState) {
                /** Default active state. Can be run. */
                ContextMenuUpdateState[ContextMenuUpdateState["active"] = 0] = "active";
                /** Selected. Can be de-selected. */
                ContextMenuUpdateState[ContextMenuUpdateState["selected"] = 1] = "selected";
                /** Generic "Disabled" state. Cannot be run. */
                ContextMenuUpdateState[ContextMenuUpdateState["disabled"] = 2] = "disabled";
                /** Not visible. Cannot be run. */
                ContextMenuUpdateState[ContextMenuUpdateState["disabledHidden"] = 3] = "disabledHidden";
                /** "Completed" state. Cannot be run. */
                ContextMenuUpdateState[ContextMenuUpdateState["disabledCompleted"] = 4] = "disabledCompleted";
                /** "Selected" state. Cannot be run. */
                ContextMenuUpdateState[ContextMenuUpdateState["disabledSelected"] = 5] = "disabledSelected";
            })(ContextMenuUpdateState = Viewer.ContextMenuUpdateState || (Viewer.ContextMenuUpdateState = {}));
            /**
             * A generic ContextMenu implementation. Hooks to a lt.Controls.ImageViewer via a ContextInteractiveMode to receive Context events.
             * When a context event is received, callbacks are run for each entry to determine the entry state. When an action entry is clicked,
             * a separate callback will run.
             **/
            var ContextMenu = /** @class */ (function () {
                /**
                 * Creates a context menu instance from the provided options.
                 */
                function ContextMenu(options) {
                    var _this = this;
                    /** Whether or not the context menu is currently showing. */
                    this._isShowing = false;
                    /** Whether or not the context menu may position itself outside of the ImageViewer in the x-direction. */
                    this.constrainX = false;
                    /** Whether or not the context menu may position itself outside of the ImageViewer in the y-direction. */
                    this.constrainY = false;
                    /** Any arbitrary data attached to the instance, passed from the options. */
                    this.data = null;
                    /** The ImageViewer associated with this context menu. The context menu receives Context events from this ImageViewer. */
                    this.viewer = null;
                    /** The entries of this context menu. */
                    this.entries = null;
                    /** The ContextInteractiveMode through which this instance will receive context events from the ImageViewer. */
                    this.contextMenuMode = null;
                    /** The root element of the context menu.*/
                    this._rootElement = null;
                    /** The container (parent) element of the context menu.*/
                    this._containerElement = null;
                    // Hide on resizes.
                    this._onResize = function (sender, e) {
                        if (!_this._isDisposed)
                            _this.hide();
                    };
                    this._onDown = function (sender, e) {
                        if (_this._isDisposed || !_this._isShowing)
                            return;
                        // Check for the root of the control in the event target ancestry to know
                        // if we clicked within it or not.
                        var hitRoot = _this._containerElement === e.target || _this._containerElement.contains(e.target);
                        if (!hitRoot)
                            _this.hide();
                    };
                    this._onBadChange = function (sender, e) {
                        if (!_this._isDisposed)
                            _this.hide();
                    };
                    this._isDisposed = false;
                    this._previousArgs = null;
                    /** The callback for a ContextInteractiveMode. */
                    this.onContextMenu = function (sender, e) {
                        if (_this._isShowing || !_this.entries || e.eventArgs.isHandled)
                            return;
                        e.eventArgs.isHandled = true;
                        // Stop any inertia scrolling.
                        e.imageViewer.stopInertiaScroll();
                        var contextMenuArgs = {
                            menu: _this,
                            action: null,
                            actionElement: null,
                            updateState: ContextMenuUpdateState.disabled,
                            event: e.eventArgs,
                            item: e.item,
                            itemIndex: e.imageViewer.items.indexOf(e.item)
                        };
                        _this._previousArgs = contextMenuArgs;
                        _this.updateFromArgs(contextMenuArgs);
                    };
                    /** Callback run immediately after the Context event is received. Returns the title of the context menu UI. */
                    this.onUpdate = null;
                    this._condensed = false;
                    this._showCondenseButton = true;
                    if (!options)
                        throw new Error("must supply valid options");
                    // Set the options
                    this._containerElement = options.containerElement;
                    this.data = options.data;
                    this.viewer = options.viewer;
                    this.entries = options.entries;
                    // Initialize the stylesheet
                    ContextMenu._init();
                    // Create and add the interactive mode to the viewer
                    this.contextMenuMode = new lt.Demos.Viewer.ContextInteractiveMode();
                    this.viewer.interactiveModes.add(this.contextMenuMode);
                    this.viewer.interactiveService.preventContextMenu = true;
                    this.contextMenuMode.context.add(this.onContextMenu);
                    this.viewer.scrollOffsetChanged.add(this._onBadChange);
                    this.viewer.foreCanvasSizeChanged.add(this._onBadChange);
                    // Add the root of the actual context menu UI element
                    this._rootElement = options.rootElement || document.createElement("div");
                    lt.LTHelper.addClass(this._rootElement, ContextMenu._rootClassName);
                    this.hide();
                    ContextMenu._resize.add(this._onResize);
                    ContextMenu._down.add(this._onDown);
                    // When the root element itself gets a contextmenu event, ignore it
                    this._rootElement.addEventListener("contextmenu", function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }, true);
                    // When there's a click somewhere other than this container element, hide this context menu
                    $(document).on("mousedown pointerdown", function (e) {
                        if (!_this._containerElement.contains(e.target))
                            _this.hide();
                    });
                }
                /** Sets up resize events and shared CSS styles. */
                ContextMenu._init = function () {
                    if (ContextMenu._didInit)
                        return;
                    ContextMenu._didInit = true;
                    if (!ContextMenu._dynamicStyle) {
                        var classSpecifier = "." + ContextMenu._rootClassName;
                        var loaderClassSpecifier = "." + ContextMenu._tempSizeLoaderClassName;
                        ContextMenu._dynamicStyle = new lt.Demos.Utils.DynamicStyle("lt_demos_imageviewer_contextmenu", "Context Menu for ImageViewer", [
                            // Root
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier, [
                                ["display", "block"],
                                ["position", "absolute"],
                                ["z-index", "1"],
                                ["overflow", "hidden"],
                                ["background-color", "#f8f9fa"],
                                ["color", "#333"],
                                ["padding", "0"],
                                ["border-radius", "2px"],
                                ["border", "1px solid #888"],
                                ["box-shadow", "0 4px 2px -1px rgba(0, 0, 0, 0.4)"],
                            ]),
                            // .header
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " .header", [
                                ["display", "block"],
                                ["margin", "0"],
                                ["padding", "0 10px 0 0"],
                                ["border-bottom", "1px solid #ccc"],
                            ]),
                            // .header:after
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " .header:after", [
                                ["clear", "both"],
                                ["content", "''"],
                                ["display", "block"],
                            ]),
                            // header condense button
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " .header .condense", [
                                ["display", "block"],
                                ["float", "left"],
                                ["height", "28px"],
                                ["width", "18px"],
                                ["background-color", "transparent"],
                                ["border", "0"],
                                ["border-right", "1px solid transparent"],
                                ["padding", "0"],
                            ]),
                            // header condense button:after
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " .header .condense:after", [
                                ["content", "'\\002807'"],
                                ["color", "#333"],
                                ["display", "block"],
                                ["width", "100%"],
                                ["height", "100%"],
                                ["padding", "3px 0 0 5px"],
                                ["font-size", "130%"],
                            ]),
                            // header title
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " .header > span", [
                                ["display", "block"],
                                ["float", "right"],
                                ["font-weight", "bold"],
                                ["font-size", "120%"],
                                ["line-height", "28px"],
                                ["height", "28px"],
                            ]),
                            // ul
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " ul", [
                                ["padding", "3px 0"],
                                ["margin", "0"],
                                ["list-style-type", "none"]
                            ]),
                            // li
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li", [
                                ["display", "block"],
                                ["border", "none"],
                                ["margin", "0"],
                                ["padding", "1px 8px"],
                                ["background-color", "transparent"],
                                ["color", "#333"],
                                ["cursor", "pointer"]
                            ]),
                            // li:after
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ":not(.condensed) li:after", [
                                ["clear", "both"],
                                ["content", "''"],
                                ["display", "block"],
                            ]),
                            // li:not(.disabled):hover
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li:not(.disabled):hover", [
                                ["background-color", "#e9ebed"],
                            ]),
                            // li.disabled
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li.disabled", [
                                ["opacity", ".6"],
                                ["cursor", "not-allowed"],
                            ]),
                            // li.selected
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li.selected .cm-icon-holder", [
                                ["border-color", "#62a2e4"],
                                ["background-color", "#c9e0f7"]
                            ]),
                            // li icon-holder
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li span.cm-icon-holder", [
                                ["display", "block"],
                                ["float", "left"],
                                ["border", "1px solid transparent"],
                                ["margin", "1px 0 0 0"],
                                ["padding", "2px"],
                                ["font-size", "0"],
                            ]),
                            // li icon
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li span.cm-icon", [
                                ["display", "inline-block"],
                                ["margin", "0"],
                                ["padding", "0"],
                                ["background-size", "100%"],
                                ["background-repeat", "no-repeat"],
                                ["background-position", "center"],
                                ["width", "18px"],
                                ["height", "18px"],
                            ]),
                            // li text
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + " li span.cm-text", [
                                ["display", "block"],
                                ["float", "left"],
                                ["margin", "0"],
                                ["padding", "4px 0 0 8px"],
                            ]),
                            // loader div
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(loaderClassSpecifier, [
                                ["position", "absolute"],
                                ["overflow", "hidden"],
                                ["z-index", "0"],
                                ["width", "100%"],
                                ["height", "0"],
                            ]),
                            // header
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ".condensed .header", [
                                ["border", "0"],
                                ["padding", "0 4px 0 0"],
                            ]),
                            // header condensed condensed button
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ".condensed .condense", [
                                ["border-color", "#ccc"],
                            ]),
                            // ul
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ".condensed ul", [
                                ["display", "block"],
                                ["float", "left"],
                                ["padding", "0 0 0 3px"],
                                ["font-size", "0"],
                                ["vertical-align", "top"],
                            ]),
                            // li
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ".condensed li", [
                                ["display", "inline-block"],
                                ["padding", "1px 4px"],
                                ["vertical-align", "top"],
                            ]),
                            lt.Demos.Utils.DynamicStyle.createStyleBlock(classSpecifier + ".condensed li span.cm-icon-holder", [
                                ["margin", "1px 0"],
                            ]),
                        ]);
                    }
                    if (!ContextMenu._tempSizeLoader) {
                        // Create a temporary loading element
                        var loader = document.createElement("div");
                        lt.LTHelper.addClass(loader, ContextMenu._tempSizeLoaderClassName);
                        document.body.appendChild(loader);
                        ContextMenu._tempSizeLoader = loader;
                    }
                    // On clicks, send an event for us to respond to
                    $(document).on("mousedown pointerdown", function (e) {
                        ContextMenu._down.invoke(ContextMenu, e);
                    });
                    // On resize, send an event for us to respond to
                    var resize = function (e) {
                        ContextMenu._resize.invoke(ContextMenu, e);
                    };
                    $(document).on("visibilitychange", resize);
                    $(window).on("resize orientationchange orientationchanged", resize);
                };
                Object.defineProperty(ContextMenu.prototype, "isShowing", {
                    /** Readonly. Whether or not the context menu is currently showing. */
                    get: function () {
                        return this._isShowing;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ContextMenu.prototype, "rootElement", {
                    /** The root element of the context menu.*/
                    get: function () {
                        return this._rootElement;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ContextMenu.prototype, "containerElement", {
                    /** The container (parent) element of the context menu.*/
                    get: function () {
                        return this._containerElement;
                    },
                    enumerable: false,
                    configurable: true
                });
                ContextMenu.prototype.dispose = function () {
                    if (this._isDisposed)
                        return;
                    this._isDisposed = true;
                    if (this.contextMenuMode) {
                        if (this.viewer) {
                            this.viewer.interactiveModes.remove(this.contextMenuMode);
                        }
                        this.contextMenuMode.context.remove(this.onContextMenu);
                        this.contextMenuMode = null;
                    }
                    this.viewer.scrollOffsetChanged.remove(this._onBadChange);
                    this.viewer.foreCanvasSizeChanged.remove(this._onBadChange);
                    if (this._rootElement) {
                        if (this._rootElement.parentNode)
                            this._rootElement.parentNode.removeChild(this._rootElement);
                        this._rootElement = null;
                    }
                    this._containerElement = null;
                    this.data = null;
                    this.viewer = null;
                };
                ContextMenu.prototype.hide = function () {
                    if (this._isShowing) {
                        this._isShowing = false;
                        lt.Demos.Utils.Visibility.toggle($(this._rootElement), false);
                    }
                };
                Object.defineProperty(ContextMenu.prototype, "condensed", {
                    /** Whether or not the context menu is in a condensed state where only icons are shown. */
                    get: function () {
                        return this._condensed;
                    },
                    set: function (value) {
                        if (this._condensed != value) {
                            this._condensed = value;
                            if (this._isShowing) {
                                this.updateFromArgs(this._previousArgs);
                            }
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(ContextMenu.prototype, "showCondenseButton", {
                    /** Whether or not the context menu contains the UI button to change the condensed state. */
                    get: function () {
                        return this._showCondenseButton;
                    },
                    set: function (value) {
                        if (this._showCondenseButton != value) {
                            this._showCondenseButton = value;
                            if (this._isShowing) {
                                this.updateFromArgs(this._previousArgs);
                            }
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                ContextMenu.prototype.updateFromArgs = function (args) {
                    var _this = this;
                    // Destroy the current UI.
                    var root = $(this._rootElement);
                    root.empty();
                    // Set the "condensed" class based on the property.
                    root.toggleClass("condensed", this.condensed);
                    // Set the title. Allow the callback to set it.
                    var title = null;
                    if (this.onUpdate)
                        title = this.onUpdate(args);
                    title = title !== undefined ? title : (args.itemIndex === -1 ? "" : "Item " + args.itemIndex);
                    // Create the header and the condense toggle.
                    var header = $(document.createElement("div")).addClass("header");
                    if (this.showCondenseButton) {
                        var condensedBtn = $(document.createElement("button")).addClass("condense");
                        header.append(condensedBtn);
                        condensedBtn.on("click", function () {
                            _this.condensed = !_this.condensed;
                        });
                    }
                    // Only show the title if not condensed.
                    if (!this._condensed) {
                        var titleSpan = $(document.createElement("span")).text(title || "");
                        header.append(titleSpan);
                    }
                    root.append(header);
                    var entries = this.entries;
                    // Create the menu entries UI.
                    var parent = this.condensed ? header.get(0) : this._rootElement;
                    ContextMenu._createMenuEntry(parent, this.entries, args);
                    // Update the position of the context menu.
                    var mouseEvent = args.event.nativeEvent;
                    this.updateMenuLocation(mouseEvent.pageX, mouseEvent.pageY);
                    // Make the context menu visible.
                    this._isShowing = true;
                    lt.Demos.Utils.Visibility.toggle($(this._rootElement), true);
                };
                ContextMenu._isActionEntry = function (entry) {
                    return !!entry.update;
                };
                ContextMenu._isFolderEntry = function (entry) {
                    return !!entry.entries;
                };
                ContextMenu._createMenuEntry = function (parent, entries, args) {
                    // The menu instance.
                    var menu = args.menu;
                    // The hide function for the menu. Re-use this as much as possible.
                    var hide = menu.hide.bind(menu);
                    var list = document.createElement("ul");
                    parent.appendChild(list);
                    var $list = $(list);
                    // Reset these. We will set them in this loop to indicate the current action element.
                    args.action = null;
                    args.actionElement = null;
                    entries.forEach(function (entry) {
                        // Get the original name. The callbacks may modify it for this current UI update.
                        var name = entry.name;
                        // If action...
                        if (ContextMenu._isActionEntry(entry)) {
                            // To be accessed by the callbacks...
                            args.action = entry;
                            // Update the entry. The callback should update the updateState.
                            entry.update(args);
                            // Callback may provide an HTMLElement to use as the list item.
                            var hasActionElement = !!args.actionElement;
                            args.actionElement = args.actionElement || document.createElement("li");
                            var state = args.updateState;
                            // Only show if not hidden (and if condensed, it must have an icon)
                            var show = state !== ContextMenuUpdateState.disabledHidden;
                            if (menu.condensed)
                                show = show && !!entry.icon;
                            if (show) {
                                var $li = $(args.actionElement);
                                // If callback did not provide a list item HTMLElement (default/common case)
                                if (!hasActionElement) {
                                    // Create the icon by URL
                                    var iconHolder = $(document.createElement("span")).addClass("cm-icon-holder");
                                    var icon = $(document.createElement("span")).addClass("cm-icon");
                                    if (entry.icon) {
                                        icon.css({ "background-image": "url(" + entry.icon + ")" });
                                    }
                                    iconHolder.append(icon);
                                    $li.append(iconHolder);
                                    // If not condensed, also add the text.
                                    if (!menu.condensed) {
                                        var text = $(document.createElement("span")).addClass("cm-text").text(entry.name);
                                        $li.append(text);
                                    }
                                    $li.attr("title", entry.name);
                                }
                                // Set the other states:
                                if (state === ContextMenuUpdateState.disabled ||
                                    state === ContextMenuUpdateState.disabledCompleted ||
                                    state === ContextMenuUpdateState.disabledSelected ||
                                    state === ContextMenuUpdateState.disabledHidden)
                                    $li.toggleClass("disabled", true);
                                if (state === ContextMenuUpdateState.disabledCompleted)
                                    $li.toggleClass("completed", true);
                                if (state === ContextMenuUpdateState.selected ||
                                    state === ContextMenuUpdateState.disabledSelected)
                                    $li.toggleClass("selected", true);
                                var canRun = false;
                                if (state === ContextMenuUpdateState.active ||
                                    state === ContextMenuUpdateState.selected)
                                    canRun = true;
                                if (canRun) {
                                    $li.on("click", function () {
                                        entry.run(args);
                                        hide();
                                    });
                                }
                                $list.append($li);
                            }
                        }
                        else if (ContextMenu._isFolderEntry(entry)) {
                            // TODO: NOT_IMPLEMENTED
                        }
                        // else, ignore
                        // Reset properties
                        args.actionElement = null;
                        entry.name = name;
                    });
                    args.action = null;
                    args.actionElement = null;
                };
                ContextMenu.prototype.updateMenuLocation = function (x, y) {
                    // Get the size of the element by temporarily adding it to the page.
                    var contextMenuSize = ContextMenu._getContextMenuSize(this._rootElement);
                    // Add it to the container (if not already).
                    this._containerElement.appendChild(this._rootElement);
                    // Get the bounds of the viewer we need to fit in to.
                    var bounds = Demos.Utils.UI.getPageBounds(this.viewer.eventCanvas);
                    // Get the fit position for our context menu in the viewer bounds.
                    var rect = ContextMenu._fitRect(lt.LeadRectD.create(x, y, contextMenuSize.width, contextMenuSize.height), bounds, this.constrainX, this.constrainY);
                    $(this._rootElement).css({
                        left: rect.x,
                        top: rect.y,
                    });
                };
                ContextMenu._getContextMenuSize = function (root) {
                    // Get the size of the element by adding it to a hidden element on the page.
                    var $root = $(root);
                    root.style.left = "0";
                    root.style.top = "0";
                    lt.Demos.Utils.Visibility.toggle($root, true);
                    ContextMenu._tempSizeLoader.appendChild(root);
                    var bounds = Demos.Utils.UI.getPageBounds(root);
                    lt.Demos.Utils.Visibility.toggle($root, false);
                    return lt.LeadSizeD.create(bounds.width, bounds.height);
                };
                ContextMenu._fitRect = function (source, target, constrainX, constrainY) {
                    // Fit source into target
                    if (target.isEmpty)
                        return lt.LeadPointD.empty;
                    var targetPoint = lt.LeadPointD.create(target.x, target.y);
                    if (source.isEmpty)
                        return targetPoint;
                    /*
                     * Source is in page (screen) coordinates.
                     * Target is also in page (screen) coordinates.
                     *
                     * Works differently for X vs Y fit.
                     * X fit will go to right edge when out of space;
                     * Y fit will put the bottom at the pointer instead of the top.
                     */
                    // Do we fit inside the bounds?
                    if (!constrainX || source.right < target.right) {
                        // Fits
                        targetPoint.x = source.x;
                    }
                    // Can we be right-aligned?
                    else if (target.right - source.width > 0) {
                        targetPoint.x = target.right - source.width;
                    }
                    // Else, be the X and Width of the target
                    // Do we fit inside the bounds?
                    if (!constrainY || source.bottom < target.bottom) {
                        targetPoint.y = source.y;
                    }
                    // Can we move up?
                    else if (source.y - source.height > 0) {
                        targetPoint.y = source.y - source.height;
                    }
                    // Else, be the Y and Height of the target
                    return targetPoint;
                };
                /** Class name of the root element of the menu. */
                ContextMenu._rootClassName = "lt_demos_imageviewer_contextmenu";
                /** Class name of the temp size loader. */
                ContextMenu._tempSizeLoaderClassName = "lt_demos_imageviewer_contextmenu_loader";
                /** Element used for temporarily holding the root to calculate sizes. */
                ContextMenu._tempSizeLoader = null;
                /** Dynamic style to add CSS for the context menu. */
                ContextMenu._dynamicStyle = null;
                /** Whether or not the static initialization was run. */
                ContextMenu._didInit = false;
                /** Down event, to know when to hide */
                ContextMenu._down = lt.LeadEvent.create(ContextMenu, "down");
                /** Resize event, to know when to hide */
                ContextMenu._resize = lt.LeadEvent.create(ContextMenu, "resize");
                return ContextMenu;
            }());
            Viewer.ContextMenu = ContextMenu;
        })(Viewer = Demos.Viewer || (Demos.Viewer = {}));
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
        var Utils;
        (function (Utils) {
            var Validation;
            (function (Validation) {
                var PageRange = /** @class */ (function () {
                    function PageRange() {
                    }
                    PageRange.validate = function (args) {
                        var result = {
                            invalidError: null,
                            outOfRangePages: [],
                            pages: []
                        };
                        if (!args)
                            throw new Error("args cannot be empty");
                        var input = args.input;
                        if (input)
                            input = input.trim();
                        if (!input) {
                            result.invalidError = new Error("range cannot be empty");
                            return result;
                        }
                        var hasParseError = false;
                        try {
                            hasParseError = !PageRange._pageRangeValidator.test(input);
                        }
                        catch (e) {
                            hasParseError = true;
                        }
                        if (hasParseError) {
                            result.invalidError = new Error("input does not match expected format");
                            return result;
                        }
                        try {
                            var pages = PageRange._parseInput(input);
                            // Sort, and remove duplicates
                            pages = pages.sort().filter(function (val, i, arr) {
                                if (i === 0 || val !== arr[i - 1])
                                    return true;
                                return false;
                            });
                            if (pages.length === 0) {
                                result.invalidError = new Error("no pages parsed from input");
                                return result;
                            }
                            result.pages = pages.slice();
                            // If a min/max were provided, check against them
                            var min = args.minPageNumber;
                            if (min !== -1) {
                                var minIndex = pages.length - 1;
                                while (minIndex > -1) {
                                    var pageNumber = pages[minIndex];
                                    if (pageNumber < min) {
                                        var removed = pages.splice(minIndex, 1);
                                        result.outOfRangePages = result.outOfRangePages.concat(removed);
                                    }
                                    minIndex--;
                                }
                            }
                            var max = args.maxPageNumber;
                            if (max !== -1) {
                                var maxIndex = pages.length - 1;
                                while (maxIndex > -1) {
                                    var pageNumber = pages[maxIndex];
                                    if (pageNumber > max) {
                                        var removed = pages.splice(maxIndex, 1);
                                        result.outOfRangePages = result.outOfRangePages.concat(removed);
                                    }
                                    maxIndex--;
                                }
                            }
                            result.outOfRangePages.sort();
                        }
                        catch (e) {
                            result.invalidError = e;
                            return result;
                        }
                        return result;
                    };
                    // Parses and includes duplicates
                    PageRange._parseInput = function (input) {
                        // Split on commas
                        var inputArray = input.split(",");
                        var pageIndices = [];
                        for (var inputIndex = 0; inputIndex < inputArray.length; inputIndex++) {
                            var str = inputArray[inputIndex];
                            if (str)
                                str = str.trim();
                            // Ignore double commas
                            if (!str)
                                continue;
                            if (str.indexOf("-") !== -1) {
                                // Add a range
                                var range = str.split("-");
                                var start = parseInt(range[0], 10);
                                var end = parseInt(range[1], 10);
                                if (isNaN(start) || isNaN(end))
                                    throw new Error(Utils.stringFormat("range of '{0}' to '{1}' could not be parsed", range[0], range[1]));
                                if (start > end)
                                    throw new Error(Utils.stringFormat("range of '{0}' to '{1}' is invalid", start, end));
                                for (var i = start; i <= end; i++) {
                                    pageIndices.push(i);
                                }
                            }
                            else {
                                // Add a single page
                                var num = parseInt(str, 10);
                                if (pageIndices.indexOf(num) === -1)
                                    pageIndices.push(num);
                            }
                        }
                        return pageIndices;
                    };
                    // Matches digits separated by spaces, commas, and - (e.g.: 1-4, 7, 8, 12-14)
                    PageRange._pageRangeValidator = /^\s*(?:\d+\s*\-\s*\d+|\d+)\s*(?:,\s*(?:\d+\s*\-\s*\d+|\d+)\s*)*$/;
                    return PageRange;
                }());
                Validation.PageRange = PageRange;
            })(Validation = Utils.Validation || (Utils.Validation = {}));
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Utils;
        (function (Utils) {
            var UI = /** @class */ (function () {
                function UI() {
                }
                UI.normalizeIEText = function (text) {
                    // New line for IE versions
                    if (lt.LTHelper.browser == lt.LTBrowser.internetExplorer && lt.LTHelper.device === lt.LTDevice.desktop) {
                        if (lt.LTHelper.version === 9) {
                            text = text.replace(new RegExp('\r\n|\n', 'g'), '\n\r');
                        }
                        else if (lt.LTHelper.version > 9) {
                            text = text.replace(new RegExp('\r\n', 'g'), '\n');
                        }
                    }
                    return text;
                };
                UI.createThumbnailCanvas = function (originalCanvas, thumbnailCanvas, maxWidth, maxHeight) {
                    var scaleFactor = 1;
                    var originalWidth = originalCanvas.width;
                    var originalHeight = originalCanvas.height;
                    if (originalWidth > originalHeight)
                        scaleFactor = maxWidth / originalWidth;
                    else
                        scaleFactor = maxHeight / originalHeight;
                    thumbnailCanvas.width = originalWidth * scaleFactor;
                    thumbnailCanvas.height = originalHeight * scaleFactor;
                    var thumbnailCtx = thumbnailCanvas.getContext("2d");
                    thumbnailCtx.save();
                    thumbnailCtx.scale(scaleFactor, scaleFactor);
                    thumbnailCtx.drawImage(originalCanvas, 0, 0);
                    thumbnailCtx.restore();
                };
                UI.cloneCanvas = function (oldCanvas) {
                    var newCanvas = document.createElement('canvas');
                    var context = newCanvas.getContext('2d');
                    newCanvas.width = oldCanvas.width;
                    newCanvas.height = oldCanvas.height;
                    context.drawImage(oldCanvas, 0, 0);
                    return newCanvas;
                };
                UI.toggleChecked = function (element, checkUncheck) {
                    element.toggleClass("checked", checkUncheck);
                };
                UI.isChecked = function (element) {
                    return element.hasClass("checked");
                };
                UI.selectText = function (textElement, startIndex, endIndex) {
                    if (textElement.setSelectionRange) {
                        textElement.setSelectionRange(startIndex, endIndex);
                    }
                    else if (textElement["createTextRange"]) {
                        var range = textElement["createTextRange"]();
                        range.moveStart("character", startIndex);
                        range.moveEnd("character", endIndex);
                        range.select();
                    }
                    textElement.focus();
                };
                UI.ensureSafeIEButtons = function () {
                    /* For IE9 and IE10:
                      * If
                      *    - You have an <input> element not inside a <form>
                      *    - You have any <button> element anywhere in the HTML
                      *    - You acquire selection of that input element (clicking, typing, etc)
                      *    - You hit the "enter" key
                      * Then IE tries to find a suitable button to click because it still believes
                      * it is inside a form that must be submitted.
                      *
                      * To prevent this, all buttons must have 'type="button"'.
                      * At the start, we add a hook with JQuery to add this attribute to an element
                      * when created if it doesn't have it.
                      */
                    if (lt.LTHelper.browser == lt.LTBrowser.internetExplorer && (lt.LTHelper.version == 9 || lt.LTHelper.version == 10)) {
                        // First, get all our elements without a "type" attribute
                        $("button:not([type])").each(function (idx, el) {
                            el.setAttribute("type", "button");
                        });
                        // Write a hook for future dynamically-created elements (DOMNodeInserted is now deprecated, but works in IE9 and IE10)
                        $("body").on("DOMNodeInserted", "button:not([type])", function () {
                            this.setAttribute("type", "button");
                        });
                    }
                };
                UI.getPageBounds = function (element) {
                    //NOTE: getBoundingClientRect is an expensive call, particularly on mobile. It will cause a RecalculateStyle call in the DOM.
                    // For IE <= 11, if node is disconnected
                    if (element == null || element.getClientRects().length < 1)
                        return lt.LeadRectD.create(0, 0, 0, 0);
                    var boundingRect = element.getBoundingClientRect();
                    var rect = lt.LeadRectD.create(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height);
                    // Make sure the element is not hidden (display: none)
                    if (!rect.isEmpty && rect.width > 0 && rect.height > 0) {
                        rect.left = window.pageXOffset - document.documentElement.clientLeft;
                        rect.top = window.pageYOffset - document.documentElement.clientTop;
                    }
                    return rect;
                };
                return UI;
            }());
            Utils.UI = UI;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Utils;
        (function (Utils) {
            var Visibility = /** @class */ (function () {
                function Visibility() {
                }
                Visibility._init = function () {
                    if (this._hideElementsClassStyle)
                        return;
                    // Create and append a style declaration for hiding elements
                    this._hideElementsClassStyle = document.createElement("style");
                    this._hideElementsClassStyle.innerHTML = "." + this._hideElementClass + " { display: none !important; }";
                    document.head.appendChild(this._hideElementsClassStyle);
                };
                // Only returns for first element
                // Modeled after the JQuery "isHiddenWithinTree" function
                // Whereas "toggle" will use the classes, this function falls back on JQuery if toggle() has not been called before
                Visibility.isHidden = function (element) {
                    return element.length &&
                        ((this._hideElementsClassStyle && lt.LTHelper.hasClass(element[0], this._hideElementClass)) ||
                            element[0].style.display === "none" ||
                            (element[0].style.display === "" && element.css("display") === "none"));
                };
                // Not to be mixed with JQuery's toggle()
                // Simply adds or removes the class created from _init()
                Visibility.toggle = function (elements, showOrHide) {
                    var toggleEach = typeof showOrHide === "undefined";
                    // Can't remove the class if not yet initialized!
                    if (!this._hideElementsClassStyle && !toggleEach && showOrHide)
                        return;
                    this._init();
                    var remove;
                    for (var i = 0; i < elements.length; i++) {
                        var el = elements[i];
                        if (toggleEach)
                            remove = lt.LTHelper.hasClass(el, this._hideElementClass);
                        else
                            remove = showOrHide;
                        if (remove)
                            lt.LTHelper.removeClass(el, this._hideElementClass);
                        else
                            lt.LTHelper.addClass(el, this._hideElementClass);
                    }
                };
                // JQuery, although helpful for most things, does not have the best performance when it comes to toggling element visibility.
                // The utility functions below provide better speed for showing and hiding UI elements by using classes instead of
                // directly modifying the DOM. These functions also only deal with the passed elements, not their parent elements as .is(":visible")
                // and is(":hidden") do.
                // Overall, this is between 2 and 10 times faster than JQuery's .toggle/.show/.hide methods (37ms ==> 4ms, for example)
                Visibility._hideElementClass = "lt_utils_hide";
                Visibility._hideElementsClassStyle = null;
                return Visibility;
            }());
            Utils.Visibility = Visibility;
        })(Utils = Demos.Utils || (Demos.Utils = {}));
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
        var Viewer;
        (function (Viewer) {
            var ContextInteractiveMode = /** @class */ (function (_super) {
                __extends(ContextInteractiveMode, _super);
                function ContextInteractiveMode() {
                    var _this = _super.call(this) || this;
                    _this.context = lt.LeadEvent.create(_this, "context");
                    _this._onContextMenu = function (sender, e) {
                        var viewer = _this.imageViewer;
                        var item = viewer.hitTestItem(e.position);
                        var itemIndex = item ? viewer.items.indexOf(item) : -1;
                        _this._invokeContext({
                            eventArgs: e,
                            imageViewer: viewer,
                            item: item,
                            itemIndex: itemIndex
                        });
                    };
                    // Work anywhere in the viewer instead of just on an item part
                    _this.workOnBounds = false;
                    _this.mouseButtons = lt.Controls.MouseButtons.right;
                    // Previously these were function overrides
                    // I.e. - override get name()
                    // However if you are compiling TypeScript >= 4.0, there is a breaking change that prevents overriding properties with accessors.
                    _this.name = "Context";
                    _this.id = ContextInteractiveMode._id;
                    return _this;
                }
                ContextInteractiveMode.prototype.get_name = function () { return ContextInteractiveMode._name; };
                ContextInteractiveMode.prototype.toString = function () { return "ContextInteractiveMode"; };
                ContextInteractiveMode.prototype.get_id = function () { return ContextInteractiveMode._id; };
                ContextInteractiveMode.prototype._invokeContext = function (args) {
                    this.context.invoke(this, args);
                };
                // override
                ContextInteractiveMode.prototype.start = function (imageViewer) {
                    _super.prototype.start.call(this, imageViewer);
                    var service = this.interactiveService;
                    service.contextMenu.add(this._onContextMenu);
                };
                // override
                ContextInteractiveMode.prototype.stop = function (imageViewer) {
                    if (this.isStarted) {
                        var service = this.interactiveService;
                        service.contextMenu.remove(this._onContextMenu);
                        _super.prototype.stop.call(this, imageViewer);
                    }
                };
                // override
                ContextInteractiveMode._name = "Context";
                // override
                ContextInteractiveMode._id = lt.Controls.ImageViewerInteractiveMode.userModeId;
                return ContextInteractiveMode;
            }(lt.Controls.ImageViewerInteractiveMode));
            Viewer.ContextInteractiveMode = ContextInteractiveMode;
        })(Viewer = Demos.Viewer || (Demos.Viewer = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
