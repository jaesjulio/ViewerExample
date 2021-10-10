/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var VideoPlayer = /** @class */ (function () {
            function VideoPlayer(app) {
                var _this = this;
                this.appContext = null;
                this.el = {
                    viewerRoot: document.getElementById('videoPlayer-viewer'),
                    playerRoot: document.getElementById('videoPlayer-root'),
                    closeVideo: 'closeVideo'
                };
                this.hide = function () {
                    _this.clear();
                    _this.el.playerRoot.style.left = '-100%';
                };
                this.clear = function () {
                    if (_this.viewer) {
                        _this.toggleDemoSpecificSwitches(false);
                        $("#" + _this.el.closeVideo).hide();
                        _this.viewer.dispose();
                        _this.viewer = null;
                    }
                };
                this.show = function () {
                    _this.el.playerRoot.style.left = '0';
                    _this.toggleDemoSpecificSwitches(true);
                    $("#" + _this.el.closeVideo).show();
                };
                this.appContext = app;
                this.viewer = null;
                $("#" + this.el.closeVideo).on('click', function () {
                    _this.hide();
                });
            }
            VideoPlayer.prototype.createFromUrl = function (uri) {
                this.clear();
                this.show();
                this.viewer = new lt.Multimedia.VideoViewer({ root: this.el.viewerRoot });
                this.viewer.setVideo(uri);
                this.viewer.video.autoplay = true;
            };
            VideoPlayer.prototype.toggleDemoSpecificSwitches = function (hide) {
                var mode = this.appContext.demoMode;
                var rubberBand = $('#rubberBandInteractiveMode_shortcut');
                var ocr = $('#ocrSave_shortcut');
                var proccessAll = $('#processAllPages_shortcut');
                var saveCurrentView = $('#saveCurrentView');
                var saveToCache = $('#saveToCache');
                var saveDocument = $('#saveDocument');
                if (hide)
                    $("." + VideoPlayer.toggle).hide();
                else
                    $("." + VideoPlayer.toggle).show();
                switch (mode) {
                    case HTML5Demos.DocumentViewerDemo.DemoMode.OCR: {
                        if (hide) {
                            rubberBand.hide();
                            ocr.hide();
                        }
                        else {
                            rubberBand.show();
                            ocr.show();
                        }
                        break;
                    }
                    case HTML5Demos.DocumentViewerDemo.DemoMode.Barcode: {
                        if (hide) {
                            rubberBand.hide();
                            proccessAll.hide();
                        }
                        else {
                            rubberBand.show();
                            proccessAll.show();
                        }
                        break;
                    }
                    case HTML5Demos.DocumentViewerDemo.DemoMode.Default: {
                        if (hide) {
                            saveCurrentView.hide();
                            saveToCache.hide();
                            saveDocument.hide();
                        }
                        else {
                            saveCurrentView.show();
                            saveToCache.show();
                            saveDocument.show();
                        }
                        break;
                    }
                }
            };
            VideoPlayer.toggle = 'lt-hide-video';
            return VideoPlayer;
        }());
        Dialogs.VideoPlayer = VideoPlayer;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
