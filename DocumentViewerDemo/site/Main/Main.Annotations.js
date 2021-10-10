/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        // Contains the annotations part
        var AnnotationsPart = /** @class */ (function () {
            function AnnotationsPart(main) {
                var _this = this;
                // Reference to the DocumentViewerDemoApp
                this._mainApp = null;
                this._loadPictureTimeout = -1;
                // annotations Objects buttons
                this._annotationsObjectsBtns = ".annotationObjectBtn";
                this._rubberStampLoader = null;
                this.addStampTimeLabel = false;
                // Annotations menu items
                this.headerToolbar_AnnotationsMenu = {
                    annotationsMenuItem: "#annotationsMenuItem",
                    userModeMenuItems: {
                        runModeMenuItem: "#runUserMode",
                        designModeMenuItem: "#designUserMode",
                        renderModeMenuItem: "#renderUserMode",
                    },
                    customizeRenderModeMenuItem: "#customizeRenderMode",
                    bringToFrontMenuItem: "#bringToFront",
                    sendToBackMenuItem: "#sendToBack",
                    bringToFirstMenuItem: "#bringToFirst",
                    sendToLastMenuItem: "#sendToLast",
                    verticalFlipMenuItem: "#verticalFlip",
                    horizontalFlipMenuItem: "#horizontalFlip",
                    groupSelectedObjectsMenuItem: "#groupSelectedObjects",
                    ungroupMenuItem: "#ungroup",
                    lockObjectMenuItem: "#lockObject",
                    unlockObjectMenuItem: "#unlockObject",
                    addStampTimeLabelsMenuItem: "#addStampTimeLabels",
                    resetRotatePointMenuItem: "#resetRotatePoint",
                    annotationsPropertiesMenuItem: "#annotationsProperties",
                    useRotateThumbMenuItem: "#useRotateThumb",
                    renderOnThumbnailsMenuItem: "#renderOnThumbnails",
                    deselectOnDownMenuItem: "#deselectOnDown",
                    rubberbandSelectMenuItem: "#rubberbandSelect",
                    redactionOptionsMenuItem: "#redactionOptions",
                    autoRedactionMenuItem: "#autoRedaction"
                };
                this.mobileVersionAnnotationsEditControls = {
                    showAnnotationsEditControlsBtn: "#showAnnotationsEditControls",
                    doneAnnotationsEditBtn: "#doneAnnotationsEdit",
                    annotationsEditControls: ".annotationsEditControls"
                };
                this.showAutoRedaction = function () {
                    _this._mainApp.autoRedactionDlg.inner.show();
                };
                this.redactionOnApplyOptions = function () {
                    var currentDocument = _this._mainApp.documentViewer.document;
                    var hasChanged = !currentDocument.annotations.redactionOptions.viewOptions.equals(_this._mainApp.redactionDocumentDlg.redactionOptions.viewOptions);
                    currentDocument.annotations.redactionOptions = _this._mainApp.redactionDocumentDlg.redactionOptions;
                    if (hasChanged) {
                        _this._mainApp.documentViewer.prepareToSave();
                        _this._mainApp.beginBusyOperation();
                        _this._mainApp.loadingDlg.show(false, false, "Saving to cache...", null, function () {
                            // Save will update the document in the server
                            var saveToCachePromise = _this._mainApp.saveDocumentToCache(currentDocument);
                            saveToCachePromise.fail(function (jqXHR, statusText, errorThrown) {
                                _this._mainApp.showServiceError("Error saving the document.", jqXHR, statusText, errorThrown);
                            });
                            saveToCachePromise.done(function () {
                                _this._mainApp.loadCachedDocument(currentDocument.documentId, false);
                            });
                            saveToCachePromise.always(function () {
                                _this._mainApp.endBusyOperation();
                            });
                        });
                    }
                };
                this._mainApp = main;
                this.initAnnotationsUI();
            }
            AnnotationsPart.prototype.initAnnotationsUI = function () {
                if (lt.LTHelper.supportsTouch) {
                    $("#deselectOnDown>.icon").addClass("deselectOnDown-TouchIcon");
                }
                else {
                    $("#deselectOnDown>.icon").addClass("deselectOnDown-MouseIcon");
                }
                if (lt.LTHelper.supportsTouch) {
                    $("#rubberbandSelect>.icon").addClass("rubberbandSelect-TouchIcon");
                }
                else {
                    $("#rubberbandSelect>.icon").addClass("rubberbandSelect-MouseIcon");
                }
                // Annotations menu
                $(this.headerToolbar_AnnotationsMenu.annotationsMenuItem).on("click", this.annotationsMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.customizeRenderModeMenuItem).on("click", this.customizeRenderModeMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.lockObjectMenuItem).on("click", this.lockObjectMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.unlockObjectMenuItem).on("click", this.unlockObjectMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.addStampTimeLabelsMenuItem).on("click", this.addStampTimeLabelsMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.deselectOnDownMenuItem).on("click", this.deselectOnDownMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.rubberbandSelectMenuItem).on("click", this.rubberbandSelectMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.redactionOptionsMenuItem).on("click", this.redactionOptionsMenuItem_Click.bind(this));
                $(this.headerToolbar_AnnotationsMenu.autoRedactionMenuItem).on("click", this.showAutoRedaction);
                // Annotations objects 
                $(this._annotationsObjectsBtns).on("click", this.annotationsObjectsBtns_BtnClicked.bind(this));
                // Navigation bar
                $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).on("click", this.showAnnotationsListBtn_Click.bind(this));
                // Only for mobile version
                if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    $(this.mobileVersionAnnotationsEditControls.showAnnotationsEditControlsBtn).on("click", this.showAnnotationsObjectsBtn_Click.bind(this));
                    $(this.mobileVersionAnnotationsEditControls.doneAnnotationsEditBtn).on("click", this.doneAnnotationsEditBtn_Click.bind(this));
                }
            };
            AnnotationsPart.prototype.initAutomation = function () {
                var _this = this;
                if (this._mainApp.documentViewer.annotations == null)
                    return;
                // Get the automation manager from the document viewer
                var automationManager = this._mainApp.documentViewer.annotations.automationManager;
                automationManager.userModeChanged.add(function (sender, e) {
                    // Hide/Show the toolbars
                    if (automationManager.userMode == lt.Annotations.Engine.AnnUserMode.design) {
                        if ($(_this._annotationsObjectsBtns).is(":disabled"))
                            $(_this._annotationsObjectsBtns).prop("disabled", false);
                    }
                    else {
                        if (!$(_this._annotationsObjectsBtns).is(":disabled"))
                            $(_this._annotationsObjectsBtns).prop("disabled", true);
                    }
                    // Disable/Enable annotations menu UI elements   
                    _this.updateAnnotationsMenu();
                    if (automationManager.userMode == lt.Annotations.Engine.AnnUserMode.render) {
                        // Setup our custom renderer
                        automationManager.renderingEngine.renderers = _this._renderModeRenderers;
                    }
                    else {
                        automationManager.renderingEngine.renderers = _this._originalRenderers;
                    }
                    _this._mainApp.documentViewer.view.invalidate(lt.LeadRectD.empty);
                    if (_this._mainApp.documentViewer.thumbnails != null)
                        _this._mainApp.documentViewer.thumbnails.invalidate(lt.LeadRectD.empty);
                });
                automationManager.currentObjectIdChanged.add(function (sender, e) { return _this.automationManager_CurrentObjectIdChanged(sender, e); });
                // Create the manager helper. This sets the rendering engine
                this._automationManagerHelper = new lt.Demos.Annotations.AutomationManagerHelper(automationManager, "Resources");
                // Save the rendering engine
                this._originalRenderers = automationManager.renderingEngine.renderers;
                // And create the render mode renderers, make a copy of it
                this._renderModeRenderers = {};
                for (var key in this._originalRenderers) {
                    if (this._originalRenderers.hasOwnProperty(key)) {
                        this._renderModeRenderers[key] = this._originalRenderers[key];
                    }
                }
                // Inform the document viewer that automation manager helper is created
                this._mainApp.documentViewer.annotations.initialize();
                // Update our automation objects (set transparency, etc)
                this._automationManagerHelper.updateAutomationObjects();
                this._automationManagerHelper.initAutomationDefaultRendering();
                // Set https://www.leadtools.com as the default hyperlink for all object templates
                var automationObjectsCount = automationManager.objects.count;
                for (var i = 0; i < automationObjectsCount; i++) {
                    var automationObject = automationManager.objects.item(i);
                    var annObjectTemplate = automationObject.objectTemplate;
                    if (annObjectTemplate != null) {
                        // Set the object draw cursor
                        automationObject.drawCursor = this._automationManagerHelper.getAutomationObjectCursor(automationObject.id);
                        automationObject.toolBarImage = this._automationManagerHelper.getAutomationObjectImage(automationObject.id);
                        if (annObjectTemplate instanceof lt.Annotations.Engine.AnnAudioObject) {
                            var audioObject = annObjectTemplate;
                            audioObject.media.source1 = "https://demo.leadtools.com/media/mp3/NewAudio.mp3";
                            audioObject.media.type1 = "audio/mp3";
                            audioObject.media.source2 = "https://demo.leadtools.com/media/wav/newaudio.wav";
                            audioObject.media.type2 = "audio/wav";
                            audioObject.media.source3 = "https://demo.leadtools.com/media/OGG/NewAudio_uncompressed.ogg";
                            audioObject.media.type3 = "audio/ogg";
                        }
                        else if (annObjectTemplate instanceof lt.Annotations.Engine.AnnMediaObject) {
                            var videoObject = annObjectTemplate;
                            videoObject.media.source1 = "https://demo.leadtools.com/media/mp4/dada_h264.mp4";
                            videoObject.media.type1 = "video/mp4";
                            videoObject.media.source2 = "https://demo.leadtools.com/media/WebM/DaDa_VP8_Vorbis.mkv";
                            videoObject.media.type2 = "video/webm";
                            videoObject.media.source3 = "https://demo.leadtools.com/media/OGG/DaDa_Theora_Vorbis.ogg";
                            videoObject.media.type3 = "video/ogg";
                        }
                        annObjectTemplate.hyperlink = "https://www.leadtools.com";
                    }
                }
                // Set up resources
                var resources = new lt.Annotations.Engine.AnnResources();
                var imagesPath = "Resources/Objects/";
                var imagesType = ".png";
                var imagesNames = [
                    "Point", "Lock", "Hotspot", "Audio", "Video", "EncryptPrimary", "EncryptSecondary", "Note", "StickyNote"
                ];
                imagesNames.forEach(function (name) {
                    resources.images.push(new lt.Annotations.Engine.AnnPicture(imagesPath + name + imagesType));
                });
                automationManager.resources = resources;
                // Set up the rubberstamps
                if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    lt.Demos.Annotations.RubberStamp.Loader.createDefaults(resources.rubberStamps);
                }
                else {
                    if (!this._rubberStampLoader)
                        this._rubberStampLoader = new lt.Demos.Annotations.RubberStamp.Loader(automationManager, document.querySelector(".annotationObjectBtn[value='-17']"));
                }
                if (!DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    // Automation objects list is not supported on mobile version
                    this._automationObjectsList = new lt.Demos.Annotations.AutomationObjectsListControl();
                    if (this._mainApp.documentViewer.view) {
                        var viewer = this._mainApp.documentViewer.view.imageViewer;
                        automationManager.enableToolTip = true;
                        this._stickyToolTip = new lt.Demos.Annotations.ToolTip(viewer.mainDiv.parentNode);
                        // Prevent the default context menu for right-clicks
                        viewer.interactiveService.preventContextMenu = true;
                        // Add an interactive mode to open the options dialog
                        var automationContextMode = new lt.Demos.Annotations.AutomationContextInteractiveMode();
                        automationContextMode.isEnabled = true;
                        automationContextMode.context.add(this.annotations_Context.bind(this));
                        this._automationContextInteractiveMode = automationContextMode;
                        viewer.interactiveModes.add(automationContextMode);
                    }
                }
            };
            AnnotationsPart.prototype.bindElements = function () {
                var elements = this._mainApp.commandsBinder.elements;
                var element;
                // Annotations menu
                if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.Default) {
                    element = new DocumentViewerDemo.CommandBinderElement();
                    element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.annotationsMenuItem);
                    element.updateEnabled = false;
                    element.updateVisible = true;
                    element.canRun = function (documentViewer, value) {
                        return documentViewer != null && documentViewer.hasDocument && documentViewer.annotations != null;
                    };
                    elements.push(element);
                }
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUserModeRun;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.userModeMenuItems.runModeMenuItem);
                element.updateChecked = true;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUserModeDesign;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.userModeMenuItems.designModeMenuItem);
                element.updateChecked = true;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUserModeRender;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.userModeMenuItems.renderModeMenuItem);
                element.updateChecked = true;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsBringToFront;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.bringToFrontMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsSendToBack;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.sendToBackMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsBringToFirst;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.bringToFirstMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsSendToLast;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.sendToLastMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsFlip;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.verticalFlipMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsReverse;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.horizontalFlipMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsGroup;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.groupSelectedObjectsMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUngroup;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.ungroupMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsLock;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.lockObjectMenuItem);
                element.autoRun = false;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUnlock;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.unlockObjectMenuItem);
                element.autoRun = false;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsResetRotatePoints;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.resetRotatePointMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsProperties;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.annotationsPropertiesMenuItem);
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsUseRotateThumbs;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.useRotateThumbMenuItem);
                element.updateChecked = true;
                elements.push(element);
                element = new DocumentViewerDemo.CommandBinderElement();
                element.commandName = lt.Document.Viewer.DocumentViewerCommands.annotationsRenderOnThumbnails;
                element.userInterfaceElement = $(this.headerToolbar_AnnotationsMenu.renderOnThumbnailsMenuItem);
                element.updateChecked = true;
                elements.push(element);
            };
            AnnotationsPart.prototype.interactiveService_keyDown = function (e) {
                // Delete the selected annotations object, if delete key was pressed
                if (e.keyCode == 46) {
                    var automation = this._mainApp.documentViewer.annotations.automation;
                    if (automation.canDeleteObjects) {
                        automation.deleteSelectedObjects();
                        this.removeAutomationTextArea(false);
                    }
                }
            };
            AnnotationsPart.prototype.annotationsObjectsBtns_BtnClicked = function (e) {
                this._mainApp.documentViewer.annotations.automationManager.currentObjectId = parseInt($(e.currentTarget).val());
                this.UpdateAnnotationsObjectsBtnsCheckedState();
            };
            AnnotationsPart.prototype.updateAnnotationsMenu = function () {
                if (this._automationManagerHelper == null)
                    return;
                var designMode = (this._automationManagerHelper.automationManager.userMode == lt.Annotations.Engine.AnnUserMode.design);
                // Only the user mode is available
                for (var item in this.headerToolbar_AnnotationsMenu) {
                    if (this.headerToolbar_AnnotationsMenu.hasOwnProperty(item)) {
                        if (item != "annotationsMenuItem" && item != "customizeRenderModeMenuItem") {
                            $(this.headerToolbar_AnnotationsMenu[item]).prop("disabled", !designMode);
                        }
                    }
                }
            };
            AnnotationsPart.prototype.updateAnnotationsControlsVisiblity = function () {
                if (this._mainApp.documentViewer.annotations == null || this._mainApp.documentViewer.annotations.automation == null) {
                    $(this.headerToolbar_AnnotationsMenu.annotationsMenuItem).hide();
                    $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).removeClass("activeNavigationbarBtn");
                    if (!($(this._mainApp.navigationbar.showAnnotationsListControlsBtn).is(":disabled")))
                        $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).prop("disabled", true);
                    $(this._mainApp.annotationsListControlsContainer).hide();
                }
                else {
                    if (this._mainApp.demoMode == DocumentViewerDemo.DemoMode.Default)
                        $(this.headerToolbar_AnnotationsMenu.annotationsMenuItem).show();
                    if (this._mainApp.documentViewer.annotations.automationManager.userMode == lt.Annotations.Engine.AnnUserMode.design) {
                        if ($(this._mainApp.navigationbar.showAnnotationsListControlsBtn).is(":disabled"))
                            $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).prop("disabled", false);
                    }
                    else {
                        if (!($(this._mainApp.navigationbar.showAnnotationsListControlsBtn).is(":disabled")))
                            $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).prop("disabled", true);
                    }
                }
            };
            AnnotationsPart.prototype.handleRunCommand = function (e) {
                // Make sure the right-click interactive mode is enabled and started (can be disabled when running commands)
                var rightClick = this._automationContextInteractiveMode;
                if (rightClick && !rightClick.isStarted) {
                    var view = this._mainApp.documentViewer.view;
                    if (view) {
                        rightClick.isEnabled = true;
                        rightClick.start(view.imageViewer);
                    }
                }
            };
            AnnotationsPart.prototype.handleContainersAddedOrRemoved = function () {
                if (this._automationObjectsList)
                    this._automationObjectsList.populate();
            };
            AnnotationsPart.prototype.handlePagesDisabledEnabled = function () {
                if (this._automationObjectsList)
                    this._automationObjectsList.populate();
            };
            AnnotationsPart.prototype.handleCreateAutomation = function () {
                var _this = this;
                this.updateAnnotationsControlsVisiblity();
                if (!this._mainApp.documentViewer.hasDocument)
                    return;
                // Get the automation object from the document viewer
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (automation == null)
                    return;
                var automationManager = this._mainApp.documentViewer.annotations.automationManager;
                // Optional: If the document is PDF then switch annotations to use PDF mode
                // This will instruct the document viewer to render automation in a similar manner to Adobe Acrobat where
                var mimeType = this._mainApp.documentViewer.document.mimeType;
                if (mimeType && mimeType.toLowerCase() == "application/pdf") {
                    automationManager.usePDFMode = true;
                }
                else {
                    automationManager.usePDFMode = false;
                }
                var automationControl = this._mainApp.documentViewer.annotations.automationControl;
                var renderingEngine = automationManager.renderingEngine;
                // Hook to the events
                automation.setCursor.add(function (sender, e) { return _this.automation_SetCursor(sender, e); });
                automation.restoreCursor.add(function (sender, e) { return _this.automation_RestoreCursor(sender, e); });
                automation.onShowObjectProperties.add(function (sender, e) { return _this.automation_OnShowObjectProperties(sender, e); });
                automation.editText.add(function (sender, e) { return _this.automation_EditText(sender, e); });
                automation.editContent.add(function (sender, e) { return _this.automation_EditContent(sender, e); });
                automation.toolTip.add(function (sender, e) { return _this.automation_ToolTip(sender, e); });
                automation.draw.add(function (sender, e) { return _this.automation_Draw(sender, e); });
                if (DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    automation.edit.add(function (sender, e) { return _this.automation_edit(sender, e); });
                }
                renderingEngine.loadPicture.add(function (sender, e) { return _this.renderingEngine_LoadPicture(sender, e); });
                if (!DocumentViewerDemo.DocumentViewerDemoApp.isMobileVersion) {
                    // Automation objects list is not supported on mobile version
                    this._automationObjectsList.automation = automation;
                    this._automationObjectsList.imageViewer = this._mainApp.documentViewer.view.imageViewer;
                    lt.Demos.Annotations.AutomationObjectsListControl.userName = this._mainApp.documentViewer.userName;
                    this._automationObjectsList.listContainerDiv = document.getElementById("annotationslist");
                    this._automationObjectsList.populate();
                    if (this._automationContextInteractiveMode)
                        this._automationContextInteractiveMode.automation = automation;
                }
            };
            AnnotationsPart.prototype.handleDestroyAutomation = function () {
                this.removeAutomationTextArea(true);
            };
            AnnotationsPart.prototype.automationManager_CurrentObjectIdChanged = function (sender, e) {
                // If rubberstamp, we should show the rubberstamp quick-select
                if (this._rubberStampLoader)
                    this._rubberStampLoader.beginDraw();
                this.UpdateAnnotationsObjectsBtnsCheckedState();
            };
            // Update which button is currently Checked
            AnnotationsPart.prototype.UpdateAnnotationsObjectsBtnsCheckedState = function () {
                var manager = this._mainApp.documentViewer.annotations.automationManager;
                if (manager == null)
                    return;
                var currentObjectId = manager.currentObjectId;
                var btns = $(this._annotationsObjectsBtns);
                btns.each(function () {
                    // "this" here is for current JQuery element (i.e current Annotations Object Button)
                    if ($(this).val() != null) {
                        var buttonObjectId = parseInt($(this).val());
                        if (buttonObjectId == lt.Annotations.Engine.AnnObject.selectObjectId)
                            lt.Demos.Utils.UI.toggleChecked($(this), (buttonObjectId == currentObjectId || currentObjectId == lt.Annotations.Engine.AnnObject.none));
                        else
                            lt.Demos.Utils.UI.toggleChecked($(this), (buttonObjectId == currentObjectId));
                    }
                });
            };
            AnnotationsPart.commonCursorName = function (input) {
                if (input) {
                    input = input.trim().toLowerCase().replace(/[\s\'\"]/g, "");
                }
                return input;
            };
            AnnotationsPart.prototype.automation_SetCursor = function (sender, e) {
                // If there's an interactive mode working and its not automation, then don't do anything
                var imageViewer = this._mainApp.documentViewer.view.imageViewer;
                if (imageViewer.workingInteractiveMode != null && imageViewer.workingInteractiveMode.id != lt.Document.Viewer.DocumentViewer.annotationsInteractiveModeId)
                    return;
                // Get the canvas the viewer is using to listen to the events.
                var cursorCanvas = imageViewer.eventCanvas ? imageViewer.eventCanvas : imageViewer.foreCanvas;
                var automation = sender;
                var newCursor = null;
                if (!automation.activeContainer || !automation.activeContainer.isEnabled) {
                    newCursor = "default";
                }
                else {
                    switch (e.designerType) {
                        case lt.Annotations.Automation.AnnDesignerType.draw:
                            {
                                var allow = true;
                                var drawDesigner = automation.currentDesigner;
                                if (drawDesigner != null && !drawDesigner.isTargetObjectAdded && e.pointerEvent != null) {
                                    // See if we can draw or not
                                    var container = automation.activeContainer;
                                    allow = false;
                                    if (automation.hitTestContainer(e.pointerEvent.location, false) != null)
                                        allow = true;
                                }
                                if (allow) {
                                    var annAutomationObject = automation.manager.findObjectById(e.id);
                                    if (annAutomationObject != null)
                                        newCursor = annAutomationObject.drawCursor;
                                }
                                else {
                                    newCursor = "not-allowed";
                                }
                            }
                            break;
                        case lt.Annotations.Automation.AnnDesignerType.edit:
                            if (e.isRotateCenter)
                                newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.rotateCenterControlPoint];
                            else if (e.isRotateGripper)
                                newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.rotateGripperControlPoint];
                            else if (e.thumbIndex < 0) {
                                if (e.dragDropEvent != null && !e.dragDropEvent.allowed)
                                    newCursor = "not-allowed";
                                else
                                    newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.selectedObject];
                            }
                            else {
                                newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.controlPoint];
                            }
                            break;
                        case lt.Annotations.Automation.AnnDesignerType.run:
                            newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.run];
                            break;
                        default:
                            newCursor = this._automationManagerHelper.automationCursors[lt.Demos.Annotations.AnnCursorType.selectObject];
                            break;
                    }
                }
                // Some browsers may re-format the cursor text after it is set.
                // Compare by removing all spaces and making lowercase.
                var currentFormatted = AnnotationsPart.commonCursorName(cursorCanvas.style.cursor);
                var newCursorFormatted = AnnotationsPart.commonCursorName(newCursor);
                if (currentFormatted !== newCursorFormatted)
                    cursorCanvas.style.cursor = newCursor;
            };
            AnnotationsPart.prototype.automation_RestoreCursor = function (sender, e) {
                var imageViewer = this._mainApp.documentViewer.view.imageViewer;
                var cursor = "default";
                var interactiveModeCursor = null;
                // Get the canvas the viewer is using to listen to the events.
                var cursorCanvas = imageViewer.eventCanvas ? imageViewer.eventCanvas : imageViewer.foreCanvas;
                // See if we have an interactive mode, use its cursor
                // Is any working?
                if (imageViewer.workingInteractiveMode != null) {
                    interactiveModeCursor = imageViewer.workingInteractiveMode.workingCursor;
                }
                // is any hit-testing?
                else if (imageViewer.hitTestStateInteractiveMode != null) {
                    interactiveModeCursor = imageViewer.hitTestStateInteractiveMode.hitTestStateCursor;
                }
                // is any idle?
                else if (imageViewer.idleInteractiveMode != null) {
                    interactiveModeCursor = imageViewer.idleInteractiveMode.idleCursor;
                }
                if (interactiveModeCursor != null)
                    cursor = interactiveModeCursor;
                // Some browsers may re-format the cursor text after it is set.
                // Compare by removing all spaces and making lowercase.
                var currentFormatted = AnnotationsPart.commonCursorName(cursorCanvas.style.cursor);
                var newCursorFormatted = AnnotationsPart.commonCursorName(cursor);
                if (currentFormatted !== newCursorFormatted)
                    cursorCanvas.style.cursor = cursor;
            };
            AnnotationsPart.prototype.automation_OnShowObjectProperties = function (sender, e) {
                // Get the automation object from the document viewer
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (automation == null)
                    return;
                var isSelectionObject = lt.Annotations.Engine.AnnSelectionObject.isInstanceOfType(automation.currentEditObject);
                // If is a text or selection, hide the content
                if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(automation.currentEditObject) || isSelectionObject) {
                    this._mainApp.automationUpdateObjectDlg.showContent = false;
                    if (isSelectionObject) {
                        this._mainApp.automationUpdateObjectDlg.showReviews = false;
                    }
                }
                this._mainApp.automationUpdateObjectDlg.userName = this._mainApp.documentViewer.userName;
                this._mainApp.automationUpdateObjectDlg.automation = this._mainApp.documentViewer.annotations.automation;
                this._mainApp.automationUpdateObjectDlg.targetObject = automation.currentEditObject;
                this._mainApp.automationUpdateObjectDlg.targetContainer = automation.activeContainer;
                this._mainApp.automationUpdateObjectDlg.show();
                // Since we are showing a dialog, the update will be performed later. Tell Automation we canceled this
                e.cancel = true;
            };
            AnnotationsPart.prototype.annotations_Context = function (sender, args) {
                // get the automation object and select the object under the current pointer position
                var automation = this._mainApp.documentViewer.annotations.automation;
                var e = args.eventArgs;
                if (!automation || e.isHandled)
                    return;
                var automationControl = automation.automationControl;
                var container = automation.container;
                var point = e.position.clone();
                point = container.mapper.pointToContainerCoordinates(point);
                var objects = container.hitTestPoint(point); // perform the hit test
                if (objects != null && objects.length > 0) { // if we hit an object, select it and then show the properties
                    if (automation.currentEditObject == null) {
                        var targetObject = objects[objects.length - 1];
                        automation.selectObject(targetObject);
                    }
                    automationControl.automationInvalidate(lt.LeadRectD.empty);
                    if (automation.canShowProperties) {
                        e.isHandled = true;
                        setTimeout(function () {
                            // Set a timeout so we escape the right-click event
                            automation.showObjectProperties();
                        });
                    }
                }
            };
            AnnotationsPart.prototype.automation_EditText = function (sender, e) {
                var _this = this;
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (automation == null)
                    return;
                this.removeAutomationTextArea(true);
                if (e.textObject == null)
                    return;
                var imageViewer = this._mainApp.documentViewer.view.imageViewer;
                if (lt.LTHelper.device === lt.LTDevice.mobile || lt.LTHelper.device === lt.LTDevice.tablet)
                    this._automationTextArea = new lt.Demos.Annotations.AutomationTextArea(imageViewer.mainDiv, automation, e, function (update) { return _this.removeAutomationTextArea(update); });
                else
                    this._automationTextArea = new lt.Demos.Annotations.AutomationTextArea(imageViewer.mainDiv.parentNode, automation, e, function (update) { return _this.removeAutomationTextArea(update); });
                e.cancel;
            };
            AnnotationsPart.prototype.automation_EditContent = function (sender, e) {
                // Get the automation object from the document viewer
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (automation == null)
                    return;
                var targetObject = e.targetObject;
                if (targetObject == null)
                    return;
                if (targetObject.id == lt.Annotations.Engine.AnnObject.groupObjectId || targetObject.id == lt.Annotations.Engine.AnnObject.selectObjectId)
                    return;
                if (lt.Annotations.Engine.AnnTextObject.isInstanceOfType(targetObject))
                    return;
                if (lt.Annotations.Designers.AnnDrawDesigner.isInstanceOfType(sender) && e.targetObject.id != lt.Annotations.Engine.AnnObject.stickyNoteObjectId)
                    return;
                this._mainApp.automationUpdateObjectDlg.showProperties = false;
                this._mainApp.automationUpdateObjectDlg.showReviews = false;
                this._mainApp.automationUpdateObjectDlg.userName = this._mainApp.documentViewer.userName;
                this._mainApp.automationUpdateObjectDlg.automation = this._mainApp.documentViewer.annotations.automation;
                this._mainApp.automationUpdateObjectDlg.targetObject = targetObject;
                this._mainApp.automationUpdateObjectDlg.show();
            };
            AnnotationsPart.prototype.automation_ToolTip = function (sender, e) {
                if (!this._stickyToolTip)
                    return;
                // Get the automation object from the document viewer
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (!automation)
                    return;
                var annObject = e.annotationObject;
                if (annObject && annObject.id === lt.Annotations.Engine.AnnObject.stickyNoteObjectId) {
                    var stickyNoteContent = annObject.metadata[lt.Annotations.Engine.AnnObject.contentMetadataKey];
                    if (stickyNoteContent) {
                        var rect = automation.container.mapper.rectFromContainerCoordinates(e.bounds, lt.Annotations.Engine.AnnFixedStateOperations.none);
                        this._stickyToolTip.show(rect.bottomLeft, stickyNoteContent);
                        return;
                    }
                }
                this._stickyToolTip.hide();
            };
            AnnotationsPart.prototype.automation_edit = function (sender, e) {
                $(this._mainApp.mobileVersionControlsContainers).removeClass('visiblePanel');
                $(this.mobileVersionAnnotationsEditControls.annotationsEditControls).addClass('visiblePanel');
            };
            AnnotationsPart.prototype.automation_Draw = function (sender, e) {
                // Get the automation object from the document viewer
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (!automation)
                    return;
                // Below, add a date-time label to stamps and rubberstamps.
                if (this.addStampTimeLabel && e.operationStatus == lt.Annotations.Engine.AnnDesignerOperationStatus.end) {
                    var object = e.object;
                    if (object.id == lt.Annotations.Engine.AnnObject.rubberStampObjectId || object.id == lt.Annotations.Engine.AnnObject.stampObjectId) {
                        var label = new lt.Annotations.Engine.AnnLabel();
                        label.background = lt.Annotations.Engine.AnnSolidColorBrush.create("White");
                        label.foreground = lt.Annotations.Engine.AnnSolidColorBrush.create("Black");
                        label.isVisible = true;
                        label.text = (new Date()).toLocaleString();
                        label.positionMode = lt.Annotations.Engine.AnnLabelPositionMode.relativeToObject;
                        label.originalPosition = lt.LeadPointD.create(0, 0);
                        label.offsetHeight = true;
                        object.labels["dateTimeLabel"] = label; // Add new label to object labels list
                        automation.invalidateObject(object);
                    }
                }
            };
            AnnotationsPart.prototype.closeDocument = function () {
                // The document has been closed or a new one is set, clear the load picture timeout if we have any
                if (this._loadPictureTimeout !== -1) {
                    clearTimeout(this._loadPictureTimeout);
                    this._loadPictureTimeout = -1;
                }
            };
            AnnotationsPart.prototype.renderingEngine_LoadPicture = function (sender, e) {
                // The renderingEngine.loadPicture occurs for every annotation object that has an embedded image
                // So instead of re-rendering the annotations every time one of these images is loaded, we will use a timer
                // to group the paints together for optimization.
                var _this = this;
                if (this._loadPictureTimeout !== -1) {
                    return;
                }
                this._loadPictureTimeout = setTimeout(function () {
                    _this._loadPictureTimeout = -1;
                    _this._mainApp.documentViewer.annotations.automation.invalidate(lt.LeadRectD.empty);
                    if (_this._mainApp.documentViewer.thumbnails != null)
                        _this._mainApp.documentViewer.thumbnails.invalidate(lt.LeadRectD.empty);
                }, 1000);
            };
            AnnotationsPart.prototype.removeAutomationTextArea = function (update) {
                if (this._automationTextArea == null)
                    return;
                this._automationTextArea.remove(update);
                this._automationTextArea = null;
            };
            AnnotationsPart.prototype.annotationsMenuItem_Click = function (e) {
                if (this._automationManagerHelper == null)
                    return;
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.addStampTimeLabelsMenuItem).find(".icon"), this.addStampTimeLabel);
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.deselectOnDownMenuItem).find(".icon"), this._automationManagerHelper.automationManager.deselectOnDown);
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.rubberbandSelectMenuItem).find(".icon"), !this._automationManagerHelper.automationManager.forceSelectionModifierKey);
            };
            AnnotationsPart.prototype.customizeRenderModeMenuItem_Click = function (e) {
                var _this = this;
                this._mainApp.customizeRenderModeDlg.automationManager = this._automationManagerHelper.automationManager;
                this._mainApp.customizeRenderModeDlg.allRenderers = this._originalRenderers;
                this._mainApp.customizeRenderModeDlg.currentRenderers = this._renderModeRenderers;
                this._mainApp.customizeRenderModeDlg.show();
                this._mainApp.customizeRenderModeDlg.onApply = function () {
                    // Clear render mode renderers
                    _this._renderModeRenderers = {};
                    // Get the result renderers
                    for (var key in _this._mainApp.customizeRenderModeDlg.resultRenderers) {
                        if (_this._originalRenderers.hasOwnProperty(key)) {
                            _this._renderModeRenderers[key] = _this._mainApp.customizeRenderModeDlg.resultRenderers[key];
                        }
                    }
                    // If in render mode, update the renderers
                    if (_this._automationManagerHelper.automationManager.userMode == lt.Annotations.Engine.AnnUserMode.render) {
                        _this._automationManagerHelper.automationManager.renderingEngine.renderers = _this._renderModeRenderers;
                    }
                    // Invalidate
                    _this._mainApp.documentViewer.view.invalidate(lt.LeadRectD.empty);
                    if (_this._mainApp.documentViewer.thumbnails != null)
                        _this._mainApp.documentViewer.thumbnails.invalidate(lt.LeadRectD.empty);
                };
            };
            AnnotationsPart.prototype.lockObjectMenuItem_Click = function (e) {
                var _this = this;
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (!automation)
                    return;
                var inputDlg = this._mainApp.inputDlg;
                inputDlg.showWith("Lock Annotation", "Enter a password that will be required when modifying the annotation.", null, true, false);
                inputDlg.onApply = function (password) {
                    automation.currentEditObject.lock(password);
                    automation.invalidate(lt.LeadRectD.empty);
                    _this._mainApp.updateUIState();
                    return true;
                };
            };
            AnnotationsPart.prototype.unlockObjectMenuItem_Click = function (e) {
                var _this = this;
                var automation = this._mainApp.documentViewer.annotations.automation;
                if (!automation)
                    return;
                var inputDlg = this._mainApp.inputDlg;
                inputDlg.showWith("Unlock Annotation", "Provide the password needed to unlock this annotation for modification.", null, true, false);
                inputDlg.onApply = function (password) {
                    automation.currentEditObject.unlock(password);
                    if (automation.currentEditObject.isLocked) {
                        alert("Invalid password.");
                        return false;
                    }
                    inputDlg.inner.lockState = false;
                    automation.invalidate(lt.LeadRectD.empty);
                    _this._mainApp.updateUIState();
                    return true;
                };
            };
            AnnotationsPart.prototype.addStampTimeLabelsMenuItem_Click = function (e) {
                this.addStampTimeLabel = !this.addStampTimeLabel;
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.addStampTimeLabelsMenuItem).find(".icon"), this.addStampTimeLabel);
            };
            AnnotationsPart.prototype.deselectOnDownMenuItem_Click = function (e) {
                if (this._automationManagerHelper == null)
                    return;
                this._automationManagerHelper.automationManager.deselectOnDown = !this._automationManagerHelper.automationManager.deselectOnDown;
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.deselectOnDownMenuItem).find(".icon"), this._automationManagerHelper.automationManager.deselectOnDown);
            };
            AnnotationsPart.prototype.rubberbandSelectMenuItem_Click = function (e) {
                if (this._automationManagerHelper == null)
                    return;
                this._automationManagerHelper.automationManager.forceSelectionModifierKey = !this._automationManagerHelper.automationManager.forceSelectionModifierKey;
                lt.Demos.Utils.UI.toggleChecked($(this.headerToolbar_AnnotationsMenu.rubberbandSelectMenuItem).find(".icon"), !this._automationManagerHelper.automationManager.forceSelectionModifierKey);
            };
            AnnotationsPart.prototype.redactionOptionsMenuItem_Click = function (e) {
                var currentDocument = this._mainApp.documentViewer.document;
                this._mainApp.redactionDocumentDlg.show(currentDocument.annotations.redactionOptions.clone());
                this._mainApp.redactionDocumentDlg.onApplyOptions = this.redactionOnApplyOptions;
            };
            AnnotationsPart.prototype.showAnnotationsListBtn_Click = function (e) {
                var visibleAnnotationsList = !lt.Demos.Utils.Visibility.isHidden($(this._mainApp.annotationsListControlsContainer));
                if (!visibleAnnotationsList) {
                    $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).addClass("activeNavigationbarBtn");
                    $(this._mainApp.annotationsListControlsContainer).show();
                }
                else {
                    $(this._mainApp.navigationbar.showAnnotationsListControlsBtn).removeClass("activeNavigationbarBtn");
                    $(this._mainApp.annotationsListControlsContainer).hide();
                }
                this._mainApp.updateContainers();
            };
            AnnotationsPart.prototype.showAnnotationsObjectsBtn_Click = function (e) {
                $(this._mainApp.mobileVersionControlsContainers).removeClass('visiblePanel');
                $(this.mobileVersionAnnotationsEditControls.annotationsEditControls).addClass('visiblePanel');
            };
            AnnotationsPart.prototype.doneAnnotationsEditBtn_Click = function (e) {
                $(this.mobileVersionAnnotationsEditControls.annotationsEditControls).removeClass('visiblePanel');
            };
            return AnnotationsPart;
        }());
        DocumentViewerDemo.AnnotationsPart = AnnotationsPart;
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
