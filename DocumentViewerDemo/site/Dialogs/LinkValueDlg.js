/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var LinkValueDlg = /** @class */ (function () {
            function LinkValueDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.close_Clicked = function () {
                    _this.inner.hide(function () {
                        if (_this.onClose)
                            _this.onClose();
                    });
                };
                var root = $("#dlgLinkValue");
                this.el = {
                    link: "#dlgLinkValue_Link",
                    alwaysOpenLinks: "#dlgLinkValue_AlwaysOpenLinks",
                    hide: "#dlgLinkValue .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                $(this.el.hide).on("click", this.close_Clicked);
            }
            LinkValueDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.close_Clicked);
                this.close_Clicked = null;
                this.onClose = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            LinkValueDlg.prototype.show = function (linkValue) {
                var link = $(this.el.link);
                link.text(linkValue);
                link.prop("href", Tools.normalizeLinkValue(linkValue));
                link.prop("target", "_blank");
                link.prop("rel", "noopener noreferrer");
                this.inner.show();
            };
            Object.defineProperty(LinkValueDlg.prototype, "doNotShowAgain", {
                get: function () {
                    return $(this.el.alwaysOpenLinks).is(':checked');
                },
                enumerable: false,
                configurable: true
            });
            return LinkValueDlg;
        }());
        Dialogs.LinkValueDlg = LinkValueDlg;
        var LinkMessageDlg = /** @class */ (function () {
            function LinkMessageDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onHide = function () {
                    _this.inner.hide();
                };
                var root = $("#dlgLinkMessage");
                this.el = {
                    title: "#dlgLinkMessage_Title",
                    message: "#dlgLinkMessage_Message",
                    link: "#dlgLinkMessage_Link",
                    hide: "#dlgLinkMessage .dlg-close"
                };
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                $(this.el.hide).on("click", this.onHide);
            }
            LinkMessageDlg.prototype.dispose = function () {
                $(this.el.hide).off("click", this.onHide);
                this.onHide = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            LinkMessageDlg.prototype.show = function (title, message, linkText, linkValue) {
                $(this.el.title).text(title);
                $(this.el.message).text(message);
                var link = $(this.el.link);
                link.text(linkText);
                link.prop("href", Tools.normalizeLinkValue(linkValue));
                link.prop("target", "_blank");
                link.prop("rel", "noopener noreferrer");
                this.inner.show();
            };
            return LinkMessageDlg;
        }());
        Dialogs.LinkMessageDlg = LinkMessageDlg;
        var Tools = /** @class */ (function () {
            function Tools() {
            }
            Tools.normalizeLinkValue = function (linkValue) {
                linkValue = linkValue.trim();
                if ((linkValue.toLowerCase().indexOf("http:") !== 0) && (linkValue.toLowerCase().indexOf("https:") !== 0)) {
                    if (linkValue.indexOf("//") === 0) {
                        // Like "//leadtools.com"
                        return "http:" + linkValue;
                    }
                    else {
                        // Like "leadtools.com"
                        return "http://" + linkValue;
                    }
                }
                else {
                    return linkValue;
                }
            };
            return Tools;
        }());
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
