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
/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var DocumentViewerDemo;
    (function (DocumentViewerDemo) {
        var Converter;
        (function (Converter) {
            var Format = /** @class */ (function () {
                function Format(name, extension) {
                    this.friendlyName = name;
                    this.extension = extension;
                }
                return Format;
            }());
            Converter.Format = Format;
            var RasterFormat = /** @class */ (function (_super) {
                __extends(RasterFormat, _super);
                function RasterFormat(name, bpp, format, extension) {
                    var _this = _super.call(this, name, extension) || this;
                    _this.bitsPerPixel = bpp;
                    _this.format = format;
                    return _this;
                }
                return RasterFormat;
            }(Format));
            Converter.RasterFormat = RasterFormat;
            var DocumentFormat = /** @class */ (function (_super) {
                __extends(DocumentFormat, _super);
                function DocumentFormat(name, format, options, extension) {
                    var _this = _super.call(this, name, extension) || this;
                    _this.format = format;
                    _this.options = options;
                    return _this;
                }
                return DocumentFormat;
            }(Format));
            Converter.DocumentFormat = DocumentFormat;
            var Formats = /** @class */ (function () {
                function Formats() {
                }
                Formats.getExtension = function (rasterFormat, documentFormat) {
                    if (rasterFormat != lt.Document.RasterImageFormat.unknown) {
                        for (var i = 0; i < Formats.rasterFormats.length; i++) {
                            if (Formats.rasterFormats[i].format == rasterFormat) {
                                return Formats.rasterFormats[i].extension;
                            }
                        }
                    }
                    else if (documentFormat != lt.Document.Writer.DocumentFormat.user) {
                        for (var i = 0; i < Formats.documentFormats.length; i++) {
                            if (Formats.documentFormats[i].format == documentFormat) {
                                return Formats.documentFormats[i].extension;
                            }
                        }
                    }
                    return null;
                };
                Formats.rasterFormats = [
                    new RasterFormat("TIFF Color", 24, lt.Document.RasterImageFormat.tifJpeg422, "tif"),
                    new RasterFormat("TIFF B/W", 1, lt.Document.RasterImageFormat.ccittGroup4, "tif"),
                    new RasterFormat("PDF Color with JPEG", 24, lt.Document.RasterImageFormat.rasPdfJpeg422, "pdf"),
                    new RasterFormat("PDF Color with JPEG 2000", 24, lt.Document.RasterImageFormat.rasPdfJpx, "pdf"),
                    new RasterFormat("PDF B/W", 1, lt.Document.RasterImageFormat.rasPdfG4, "pdf"),
                ];
                Formats.documentFormats = [
                    // PDF
                    new DocumentFormat("Adobe Portable Document Format", lt.Document.Writer.DocumentFormat.pdf, new lt.Document.Writer.PdfDocumentOptions(), "pdf"),
                    // DOCX
                    new DocumentFormat("Microsoft Word", lt.Document.Writer.DocumentFormat.docx, new lt.Document.Writer.DocxDocumentOptions(), "docx"),
                    // RTF
                    new DocumentFormat("Rich Text Format", lt.Document.Writer.DocumentFormat.rtf, new lt.Document.Writer.RtfDocumentOptions(), "rtf"),
                    // TXT
                    new DocumentFormat("Text", lt.Document.Writer.DocumentFormat.text, new lt.Document.Writer.TextDocumentOptions(), "txt"),
                    // DOC
                    new DocumentFormat("Microsoft Word (97-2003)", lt.Document.Writer.DocumentFormat.doc, new lt.Document.Writer.DocDocumentOptions(), "doc"),
                    // XLS
                    new DocumentFormat("Microsoft Excel (97-2003)", lt.Document.Writer.DocumentFormat.xls, new lt.Document.Writer.XlsDocumentOptions(), "xls"),
                    // HTML
                    new DocumentFormat("Hyper Text Markup Language", lt.Document.Writer.DocumentFormat.html, new lt.Document.Writer.HtmlDocumentOptions(), "htm"),
                    // EMF
                    new DocumentFormat("Windows Enhanced Metafile", lt.Document.Writer.DocumentFormat.emf, new lt.Document.Writer.DocumentOptions(lt.Document.Writer.DocumentFormat.emf), "emf"),
                    // XPS
                    new DocumentFormat("Open XML Paper Specification", lt.Document.Writer.DocumentFormat.xps, new lt.Document.Writer.XpsDocumentOptions(), "xps"),
                    // EPUB
                    new DocumentFormat("Electronic Publication", lt.Document.Writer.DocumentFormat.pub, new lt.Document.Writer.PubDocumentOptions(), "epub"),
                    // MOB
                    new DocumentFormat("Mobipocket", lt.Document.Writer.DocumentFormat.mob, new lt.Document.Writer.MobDocumentOptions(), "mob"),
                    // SVG
                    new DocumentFormat("Scalable Vector Graphics", lt.Document.Writer.DocumentFormat.svg, new lt.Document.Writer.SvgDocumentOptions(), "svg"),
                    new DocumentFormat("Analyzed Layout and Text Object", lt.Document.Writer.DocumentFormat.altoXml, new lt.Document.Writer.AltoXmlDocumentOptions(), "xml")
                ];
                return Formats;
            }());
            Converter.Formats = Formats;
        })(Converter = DocumentViewerDemo.Converter || (DocumentViewerDemo.Converter = {}));
    })(DocumentViewerDemo = HTML5Demos.DocumentViewerDemo || (HTML5Demos.DocumentViewerDemo = {}));
})(HTML5Demos || (HTML5Demos = {}));
