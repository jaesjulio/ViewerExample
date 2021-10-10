/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
// Import
const updateFiles = require("../../../Common/JS//Build/update-files");

// Update the files
updateFiles(
   __dirname, "../../../../Bin/JS", "./site/Common", true,
   [
      "Leadtools.js",
      "Leadtools.Annotations.Automation.js",
      "Leadtools.Annotations.Designers.js",
      "Leadtools.Annotations.Engine.js",
      "Leadtools.Annotations.Rendering.JavaScript.js",
      "Leadtools.Controls.js",
      "Leadtools.Document.js",
      "Leadtools.Multimedia.js",
      "Leadtools.ContentManager.js",
      "Leadtools.Extensions.js",
      "Leadtools.Document.Viewer.js",
      "Leadtools.ImageProcessing.Color.js",
      "Leadtools.ImageProcessing.Core.js",
      "Leadtools.ImageProcessing.Effects.js",
      "Leadtools.ImageProcessing.Main.js",
      "Leadtools.Pdf.js",
      "Leadtools.Pdf.Compatibility.js",
      "Leadtools.Pdf.Worker.js",
      "DemoLibraries/Leadtools.Demos.js",
      "DemoLibraries/Leadtools.Demos.Annotations.js"
   ]
);
