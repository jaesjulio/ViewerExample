/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module Dialogs {

      interface IVideoPlayer{
         viewerRoot: HTMLElement;
         playerRoot: HTMLElement;
         closeVideo: string;
      }

      export class VideoPlayer {
         private viewer: lt.Multimedia.VideoViewer | null;
         private appContext: DocumentViewerDemo.DocumentViewerDemoApp = null;
         private static toggle: string = 'lt-hide-video';

         private el: IVideoPlayer = {
            viewerRoot: document.getElementById('videoPlayer-viewer'),
            playerRoot: document.getElementById('videoPlayer-root'),
            closeVideo: 'closeVideo'
         }

         public constructor(app: DocumentViewerDemo.DocumentViewerDemoApp) {
            this.appContext = app;
            this.viewer = null;

            $(`#${this.el.closeVideo}`).on('click', () => {
               this.hide();
            });
         }

         public createFromUrl(uri: string) {
            this.clear();
            this.show();

            this.viewer = new lt.Multimedia.VideoViewer({ root: this.el.viewerRoot });
            this.viewer.setVideo(uri);
            this.viewer.video.autoplay = true;
         }

         public hide = () => {
            this.clear();
            this.el.playerRoot.style.left = '-100%';
         }

         public clear = () => {
            if (this.viewer) {
               this.toggleDemoSpecificSwitches(false);
               $(`#${this.el.closeVideo}`).hide();
               this.viewer.dispose();
               this.viewer = null;
            }
         }

         public show = () => {
            this.el.playerRoot.style.left = '0';
            this.toggleDemoSpecificSwitches(true);
            $(`#${this.el.closeVideo}`).show();
         }

         private toggleDemoSpecificSwitches(hide: boolean) {
            const mode = this.appContext.demoMode;

            const rubberBand = $('#rubberBandInteractiveMode_shortcut');
            const ocr = $('#ocrSave_shortcut');
            const proccessAll = $('#processAllPages_shortcut');
            const saveCurrentView = $('#saveCurrentView');
            const saveToCache = $('#saveToCache');
            const saveDocument = $('#saveDocument');

            if (hide)
               $(`.${VideoPlayer.toggle}`).hide();
            else
               $(`.${VideoPlayer.toggle}`).show();

            switch (mode) {
               case DocumentViewerDemo.DemoMode.OCR: {
                  if (hide) {
                     rubberBand.hide();
                     ocr.hide();
                  } else {
                     rubberBand.show();
                     ocr.show();
                  }

                  break;
               }
               case DocumentViewerDemo.DemoMode.Barcode: {
                  if (hide) {
                     rubberBand.hide();
                     proccessAll.hide();
                  } else {
                     rubberBand.show();
                     proccessAll.show();
                  }
                  break;
               }
               case DocumentViewerDemo.DemoMode.Default: {
                  if (hide) {
                     saveCurrentView.hide();
                     saveToCache.hide();
                     saveDocument.hide();
                  } else {
                     saveCurrentView.show();
                     saveToCache.show();
                     saveDocument.show();
                  }
                  break;
               }
            }
         }
      }
   }
}