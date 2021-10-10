/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {

      export module Converter {

         export class Format {
            // Friendly name
            public friendlyName: string;
            // Default file extension to use when saving
            public extension: string;

            constructor(name: string, extension: string) {
               this.friendlyName = name;
               this.extension = extension;
            }
         }

         export class RasterFormat extends Format {
            // Bits/pixel to use when saving
            public bitsPerPixel: number;
            // Format to use when saving
            public format: lt.Document.RasterImageFormat;

            constructor(name: string, bpp: number, format: lt.Document.RasterImageFormat, extension: string) {
               super(name, extension);
               this.bitsPerPixel = bpp;
               this.format = format;
            }
         }

         export class DocumentFormat extends Format {
            // Format to use when saving
            public format: lt.Document.Writer.DocumentFormat;
            // Saving options object
            public options: lt.Document.Writer.DocumentOptions;

            constructor(name: string, format: lt.Document.Writer.DocumentFormat, options: lt.Document.Writer.DocumentOptions, extension: string) {
               super(name, extension);
               this.format = format;
               this.options = options;
            }
         }

         export class Formats {
            static rasterFormats: RasterFormat[] = [
               new RasterFormat(
                  "TIFF Color",
                  24,
                  lt.Document.RasterImageFormat.tifJpeg422,
                  "tif"),
               new RasterFormat(
                  "TIFF B/W",
                  1,
                  lt.Document.RasterImageFormat.ccittGroup4,
                  "tif"),
               new RasterFormat(
                  "PDF Color with JPEG",
                  24,
                  lt.Document.RasterImageFormat.rasPdfJpeg422,
                  "pdf"),
               new RasterFormat(
                  "PDF Color with JPEG 2000",
                  24,
                  lt.Document.RasterImageFormat.rasPdfJpx,
                  "pdf"),
               new RasterFormat(
                  "PDF B/W",
                  1,
                  lt.Document.RasterImageFormat.rasPdfG4,
                  "pdf"),
            ];

            static documentFormats: DocumentFormat[] = [
               // PDF
               new DocumentFormat(
                  "Adobe Portable Document Format",
                  lt.Document.Writer.DocumentFormat.pdf,
                  new lt.Document.Writer.PdfDocumentOptions(),
                  "pdf"),

               // DOCX
               new DocumentFormat(
                  "Microsoft Word",
                  lt.Document.Writer.DocumentFormat.docx,
                  new lt.Document.Writer.DocxDocumentOptions(),
                  "docx"),

               // RTF
               new DocumentFormat(
                  "Rich Text Format",
                  lt.Document.Writer.DocumentFormat.rtf,
                  new lt.Document.Writer.RtfDocumentOptions(),
                  "rtf"),

               // TXT
               new DocumentFormat(
                  "Text",
                  lt.Document.Writer.DocumentFormat.text,
                  new lt.Document.Writer.TextDocumentOptions(),
                  "txt"),

               // DOC
               new DocumentFormat(
                  "Microsoft Word (97-2003)",
                  lt.Document.Writer.DocumentFormat.doc,
                  new lt.Document.Writer.DocDocumentOptions(),
                  "doc"),

               // XLS
               new DocumentFormat(
                  "Microsoft Excel (97-2003)",
                  lt.Document.Writer.DocumentFormat.xls,
                  new lt.Document.Writer.XlsDocumentOptions(),
                  "xls"),

               // HTML
               new DocumentFormat(
                  "Hyper Text Markup Language",
                  lt.Document.Writer.DocumentFormat.html,
                  new lt.Document.Writer.HtmlDocumentOptions(),
                  "htm"),

               // EMF
               new DocumentFormat(
                  "Windows Enhanced Metafile",
                  lt.Document.Writer.DocumentFormat.emf,
                  new lt.Document.Writer.DocumentOptions(lt.Document.Writer.DocumentFormat.emf),
                  "emf"),

               // XPS
               new DocumentFormat(
                  "Open XML Paper Specification",
                  lt.Document.Writer.DocumentFormat.xps,
                  new lt.Document.Writer.XpsDocumentOptions(),
                  "xps"),

               // EPUB
               new DocumentFormat(
                  "Electronic Publication",
                  lt.Document.Writer.DocumentFormat.pub,
                  new lt.Document.Writer.PubDocumentOptions(),
                  "epub"),

               // MOB
               new DocumentFormat(
                  "Mobipocket",
                  lt.Document.Writer.DocumentFormat.mob,
                  new lt.Document.Writer.MobDocumentOptions(),
                  "mob"),

               // SVG
               new DocumentFormat(
                  "Scalable Vector Graphics",
                  lt.Document.Writer.DocumentFormat.svg,
                  new lt.Document.Writer.SvgDocumentOptions(),
                  "svg"),

               new DocumentFormat(
                  "Analyzed Layout and Text Object",
                  lt.Document.Writer.DocumentFormat.altoXml,
                  new lt.Document.Writer.AltoXmlDocumentOptions(),
                  "xml")
            ];

            static getExtension(rasterFormat: lt.Document.RasterImageFormat, documentFormat: lt.Document.Writer.DocumentFormat): string {
               if (rasterFormat != lt.Document.RasterImageFormat.unknown) {
                  for (var i = 0; i < Formats.rasterFormats.length; i++) {
                     if (Formats.rasterFormats[i].format == rasterFormat) {
                        return Formats.rasterFormats[i].extension;
                     }
                  }
               } else if (documentFormat != lt.Document.Writer.DocumentFormat.user) {
                  for (var i = 0; i < Formats.documentFormats.length; i++) {
                     if (Formats.documentFormats[i].format == documentFormat) {
                        return Formats.documentFormats[i].extension;
                     }
                  }
               }
               return null;
            }
         }
      }
   }
}