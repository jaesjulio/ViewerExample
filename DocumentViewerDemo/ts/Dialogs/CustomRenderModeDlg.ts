/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface CustomRenderModeDlgUI<T> {
         visibleObjectSelect: T,
         invisibleObjectSelect: T,
         moveToInvisibleBtn: T,
         moveToVisibleBtn: T,
         apply: T,
         hide: T
      }

      export class CustomRenderModeDlg implements lt.Demos.Dialogs.Dialog {

         // Events 
         public onApply: () => void;

         public automationManager: lt.Annotations.Automation.AnnAutomationManager;
         public allRenderers: { [key: number]: lt.Annotations.Engine.IAnnObjectRenderer };
         public currentRenderers: { [key: number]: lt.Annotations.Engine.IAnnObjectRenderer };
         public resultRenderers: { [key: number]: lt.Annotations.Engine.IAnnObjectRenderer };

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: CustomRenderModeDlgUI<string> = null;

         constructor() {

            var root = $("#dlgCustomRenderMode");
            this.el = {
               visibleObjectSelect: "#dlgCustomRenderMode_VisibleObjectSelect",
               invisibleObjectSelect: "#dlgCustomRenderMode_InvisibleObjectSelect",
               moveToInvisibleBtn: "#dlgCustomRenderMode_MoveToInvisible",
               moveToVisibleBtn: "#dlgCustomRenderMode_MoveToVisible",
               apply: "#dlgCustomRenderMode_Apply",
               hide: "#dlgCustomRenderMode .dlg-close"
            };

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            $(this.el.visibleObjectSelect).on("click change", this.onChange).on("keydown", this.visibleObjectsSelect_KeyDown);
            $(this.el.invisibleObjectSelect).on("click change", this.onChange).on("keydown", this.invisibleObjectsSelect_KeyDown);

            $(this.el.moveToInvisibleBtn).on("click", this.moveToInvisibleBtn_Click);
            $(this.el.moveToVisibleBtn).on("click", this.moveToVisibleBtn_Click);
            $(this.el.apply).on("click", this.apply_Click);

            this.inner.onRootClick = this.onHide;
            $(this.el.hide).on("click", this.onHide);
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            this.automationManager = null;
            this.allRenderers = null;
            this.currentRenderers = null;
            this.resultRenderers = null;

            $(this.el.visibleObjectSelect)
               .empty()
               .off("click change", this.onChange)
               .off("keydown", this.visibleObjectsSelect_KeyDown);

            $(this.el.invisibleObjectSelect)
               .empty()
               .off("click change", this.onChange)
               .off("keydown", this.invisibleObjectsSelect_KeyDown);

            $(this.el.moveToInvisibleBtn).off("click", this.moveToInvisibleBtn_Click);
            $(this.el.moveToVisibleBtn).off("click", this.moveToVisibleBtn_Click);
            $(this.el.apply).off("click", this.apply_Click);
            $(this.el.hide).off("click", this.onHide);
            this.onHide = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;

            this.onApply = null;
            this.onChange = null;
            this.apply_Click = null;
            this.visibleObjectsSelect_KeyDown = null;
            this.invisibleObjectsSelect_KeyDown = null;
            this.moveToInvisibleBtn_Click = null;
            this.moveToVisibleBtn_Click = null;
         }

         public show(): void {
            var visibleObjectSelect = $(this.el.visibleObjectSelect);
            visibleObjectSelect.empty();
            var invisibleObjectSelect = $(this.el.invisibleObjectSelect);
            invisibleObjectSelect.empty();

            var keys = Object.keys(this.allRenderers);
            for (var i = 0; i < keys.length; i++) {
               var key = parseInt(keys[i], 10);
               switch (key) {
                  // Ignore these types.
                  case lt.Annotations.Engine.AnnObject.selectObjectId:
                  case lt.Annotations.Engine.AnnObject.imageObjectId:
                     break;

                  default:
                     var automationObject = this.automationManager.findObjectById(key);
                     if (automationObject) {

                        var option = document.createElement("option");
                        option.value = key.toString();
                        option.text = automationObject.name;

                        // CurrentRenderers: current renderers in RenderMode
                        if (this.currentRenderers[key])
                           visibleObjectSelect.append(option);
                        else
                           invisibleObjectSelect.append(option);
                     }
                     break;
               }
            }

            this.updateUIState();
            this.inner.show();
         }

         private onChange = () => {
            this.updateUIState();
         }

         private visibleObjectsSelect_KeyDown = (e: JQueryKeyEventObject) => {
            e.preventDefault();
            // Ctrl + A, select all
            if (e.keyCode == 65 && e.ctrlKey)
               $(this.el.visibleObjectSelect).children("option").prop("selected", true);
         }

         private invisibleObjectsSelect_KeyDown = (e: JQueryKeyEventObject) => {
            e.preventDefault();
            // Ctrl + A, select all
            if (e.keyCode == 65 && e.ctrlKey)
               $(this.el.invisibleObjectSelect).children("option").prop("selected", true);
         }

         private updateUIState(): void {
            var numVisibleSelected = $(this.el.visibleObjectSelect).children("option:selected").length;
            $(this.el.moveToInvisibleBtn).prop("disabled", numVisibleSelected === 0);

            var numInvisibleSelected = $(this.el.invisibleObjectSelect).children("option:selected").length;
            $(this.el.moveToVisibleBtn).prop("disabled", numInvisibleSelected === 0);
         }

         private moveToInvisibleBtn_Click = (e: JQueryEventObject) => {
            this.moveObjects($(this.el.visibleObjectSelect), $(this.el.invisibleObjectSelect));
         }

         private moveToVisibleBtn_Click = (e: JQueryEventObject) => {
            this.moveObjects($(this.el.invisibleObjectSelect), $(this.el.visibleObjectSelect));
         }

         private moveObjects(source: JQuery, target: JQuery): void {
            var selectedOptions = source.children("option:selected");
            if (selectedOptions.length < 1)
               return;
            target.append(selectedOptions);
            this.updateUIState();
         }

         private apply_Click = () => {
            var visibleObjects = $(this.el.visibleObjectSelect).children("option");
            this.resultRenderers = {};
            for (var i = 0; i < visibleObjects.length; i++) {
               var option = <HTMLOptionElement>visibleObjects.get(i);
               this.resultRenderers[option.value] = this.allRenderers[option.value];
            }

            this.inner.hide();
            if (this.onApply)
               this.onApply();
         }
      }
   }
}