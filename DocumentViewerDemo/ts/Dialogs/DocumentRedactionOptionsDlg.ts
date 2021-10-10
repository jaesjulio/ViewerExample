/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module Dialogs {

      interface DocumentRedactionOptionsDlgUI<T> {
         autoOptions: {
            presets: T,
            type: T,
            apply: T,
         },
         viewOptions: {
            redactionModeSelect: T,
            replaceCharacterInput: T
         },
         convertOptions: {
            redactionModeSelect: T,
            replaceCharacterInput: T
         },
         applyButton: T,
         hideButton: T
      }

      export class DocumentRedactionOptionsDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: DocumentRedactionOptionsDlgUI<string> = null;
         private appContext: DocumentViewerDemo.DocumentViewerDemoApp = null;
          
         public redactionOptions: lt.Document.DocumentRedactionOptions;

         private _presetOptions: PresetOption[] = null;
         public get presetOptions(): PresetOption[] { return this._presetOptions; }
         public set presetOptions(value: PresetOption[]) {
            this._presetOptions = value;
            this.generatePresetChecks();
         }

         private _cachedText: CachedText[] = [];
         public clearTextCache = () => { this._cachedText = [];}
         public addTextEntry = (e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => {
            // We need to keep track of when the Document Viewer pulls in the text for each page.
            if (e.operation !== lt.Document.Viewer.DocumentViewerOperation.getText || !e.isPostOperation) return;

            // Make sure that we don't already have the page data cached.
            const pageNumber = e.pageNumber;
            let obj = this._cachedText.filter((x) => x.page === pageNumber);
            if (obj && obj.length > 0) return;

            this._cachedText.push({
               page: pageNumber,
               text: e.data1 as lt.Document.DocumentPageText
            });
         }

         constructor(appContext: DocumentViewerDemo.DocumentViewerDemoApp) {
            this.appContext = appContext;

            var root = $("#dlgRedactionOptions");
            this.el = {
               autoOptions: {
                  presets: "#dlgAutoRedaction_Presets",
                  type: "#dlgAutoRedaction_Type",
                  apply: "#dlgAutoRedaction_Apply"
               },
               viewOptions: {
                  redactionModeSelect: "#dlgViewRedaction_Mode",
                  replaceCharacterInput: "#dlgViewRedaction_ReplaceCharacter"
               },
               convertOptions: {
                  redactionModeSelect: "#dlgConvertRedaction_Mode",
                  replaceCharacterInput: "#dlgConvertRedaction_ReplaceCharacter"
               },
               applyButton: "#dlgRedactionOptions_Apply",
               hideButton: "#dlgRedactionOptions .dlg-close"
            };


             $(this.el.viewOptions.redactionModeSelect).on("change", (e: JQueryEventObject) => {
                var selectedIndex: number = parseInt($(e.currentTarget).val());
                $(this.el.viewOptions.replaceCharacterInput).prop("disabled", <lt.Document.DocumentRedactionMode>(selectedIndex) == lt.Document.DocumentRedactionMode.none);
             });
             $(this.el.convertOptions.redactionModeSelect).on("change", (e: JQueryEventObject) => {
                var selectedIndex: number = parseInt($(e.currentTarget).val());
                $(this.el.convertOptions.replaceCharacterInput).prop("disabled", <lt.Document.DocumentRedactionMode>(selectedIndex) == lt.Document.DocumentRedactionMode.none);
             });

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            this.inner.onRootClick = this.onHide;
            $(this.el.hideButton).on("click", this.onHide);
            $(this.el.applyButton).on("click", this.onApply);
            $(this.el.autoOptions.apply).on("click", this.getDocumentText);
         }

         private onApply = () => {
            this.redactionOptions.viewOptions.mode = <lt.Document.DocumentRedactionMode>$(this.el.viewOptions.redactionModeSelect).prop("selectedIndex");
            this.redactionOptions.viewOptions.replaceCharacter = this.getReplaceCharacter(this.el.viewOptions.replaceCharacterInput);
            this.redactionOptions.convertOptions.mode = <lt.Document.DocumentRedactionMode>$(this.el.convertOptions.redactionModeSelect).prop("selectedIndex");
            this.redactionOptions.convertOptions.replaceCharacter = this.getReplaceCharacter(this.el.convertOptions.replaceCharacterInput);

            this.onHide();
            this.onApplyOptions();
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.applyButton).off("click", this.onApply);
            this.onHide = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private getReplaceCharacter(input: string): string {
            var replaceCharacter: string = $(input).val();
            return replaceCharacter && replaceCharacter.length > 0 ? replaceCharacter : '\0';
         }

         public show(options: lt.Document.DocumentRedactionOptions): void {
            this.redactionOptions = options;

            $(this.el.viewOptions.redactionModeSelect).prop("selectedIndex", <number>(options.viewOptions.mode));
            $(this.el.viewOptions.replaceCharacterInput).val(options.viewOptions.replaceCharacter == '\0' ? '' : options.viewOptions.replaceCharacter);
            $(this.el.viewOptions.replaceCharacterInput).prop("disabled", options.viewOptions.mode == lt.Document.DocumentRedactionMode.none);
            $(this.el.convertOptions.redactionModeSelect).prop("selectedIndex", <number>(options.convertOptions.mode));
            $(this.el.convertOptions.replaceCharacterInput).val(options.convertOptions.replaceCharacter == '\0' ? '' : options.convertOptions.replaceCharacter);
            $(this.el.convertOptions.replaceCharacterInput).prop("disabled", options.convertOptions.mode == lt.Document.DocumentRedactionMode.none);

            this.inner.show();
         }

         public onApplyOptions(): void {
         }

         private generatePresetChecks = () => {
            if (!this._presetOptions) return;

            // First, clear the container
            $(this.el.autoOptions.presets).empty();

            // Add custom checkbox fields for each preset
            this._presetOptions.forEach((option: PresetOption) => {
               const checkContainer = document.createElement('div');

               const checkbox = document.createElement('input');
               checkbox.type = 'checkbox';
               checkbox.dataset.regex = option.regex;
               checkbox.checked = option.checked;

               const label = document.createElement('label');
               label.innerText = option.name;

               checkContainer.appendChild(checkbox);
               checkContainer.appendChild(label);
               $(this.el.autoOptions.presets).append(checkContainer);
            });
         }

         private getDocumentText = () => {
            const type = +$(this.el.autoOptions.type).val();
            if (!this.buildRegex()) {
               alert("No presets selected");
               return;
            }

            // none options specified
            if (type === 0) {
               alert('No type selected');
               return;
            } 

            // value not expected
            if (type > 2) {
               alert('Type not supported');
               return;
            }

            // Hide the DocumentRedactionOptionsDlg temporarily to avoid UI clutter.
            this.inner.hide();
            // Reach out to the main app context to grab the text for every page in the document
            this.appContext.manualGetText(null, this.applyPreset);
         }

         private buildRegex = (): string => {
            // Concatenate the preset options into a single Regex.
            const container = $(this.el.autoOptions.presets);
            const children = container.find('input');

            let regex:string = "";
            children.each((i: number, e: Element) => {
               const input = e as HTMLInputElement;
               if (!input.checked) return;

               const inputRegex = input.dataset.regex;
               if (!regex) regex = inputRegex;
               else regex = regex + "|" + inputRegex;
            });

            return regex;
         }

         private applyPreset = (canceled: boolean, error: Error) => {
            if (canceled || !this._cachedText) return;

            const viewer = this.appContext.documentViewer;
            const automation = viewer.annotations.get_automation();
            const regex: RegExp = new RegExp(this.buildRegex());
            const type = +$(this.el.autoOptions.type).val();
            if (viewer.thumbnails)
               viewer.thumbnails.imageViewer.beginUpdate();


            this._cachedText.forEach((item) => {
               // Retrieve the container for the cached page
               const annContainer: lt.Annotations.Engine.AnnContainer = automation.containers.get_item(item.page - 1);
               automation.activeContainer = annContainer;

               const rects = PageTextParser.parseText(item.text, regex);
               rects.forEach((rect) => {
                  let annObj: lt.Annotations.Engine.AnnRectangleObject = null;
                  if (type == 1) {
                     annObj = new lt.Annotations.Engine.AnnRedactionObject();
                     annObj.fill = lt.Annotations.Engine.AnnSolidColorBrush.create('black');
                  }
                  if (type == 2) annObj = new lt.Annotations.Engine.AnnHiliteObject();

                  annObj.rect = rect;
                  annContainer.children.add(annObj);

                  // Fire the invokeAfterObjectChanged automation event so that the Document Viewer hooks into 
                  // the new annObject.
                  const annObjects = new lt.Annotations.Engine.AnnObjectCollection();
                  annObjects.add(annObj);
                  automation.invokeAfterObjectChanged(annObjects, lt.Annotations.Automation.AnnObjectChangedType.added);
               });
            });

            if (viewer.thumbnails)
               viewer.thumbnails.imageViewer.endUpdate();

            this.inner.show();
         }
      }

      export interface PresetOption {
         name: string;
         regex: string;
         checked: boolean;
      }

      export interface CachedText {
         page: number;
         text: lt.Document.DocumentPageText;
      }

      class PageTextParser {
         public static parseText = (pageText: lt.Document.DocumentPageText, regex: RegExp): lt.LeadRectD[] => {
            // Re-generate the regex with the global flag set.
            const gRegex = new RegExp(regex.source, 'g');

            pageText.buildTextWithMap();
            const text = pageText.text;
            
            let nextInstance;
            let bounds: lt.LeadRectD[] = [];
            while ((nextInstance = gRegex.exec(text)) !== null) {
               const str = nextInstance[0];
               const results = PageTextParser.mapString(pageText, str, gRegex.lastIndex);
               bounds = bounds.concat(results);
            }

            return bounds;
         }

         private static mapString = (pageText: lt.Document.DocumentPageText, input: string, index: number): lt.LeadRectD[] => {
            const map = pageText.textMap;

            // Since the index is coming from regex.exec() we know the index value is the character position immediately after 
            // the last character in the input string.  To find the start of the string in the text map we can just
            // take the index - input.length
            let mapIndex = index - input.length;
            const results: lt.LeadRectD[] = [];
            while (mapIndex < index) {
               const charIndex = map[mapIndex];
               if (charIndex >= 0) {
                  const char = pageText.characters[charIndex];
                  results.push(char.bounds);
               }
               mapIndex++;
            }

            return PageTextParser.mergeRects(results);
         }

         private static mergeRects = (input:lt.LeadRectD[]): lt.LeadRectD[] => {

            const results: lt.LeadRectD[] = [];
            let currentRect: lt.LeadRectD = null;
            input.forEach((rect: lt.LeadRectD) => {
               // Slightly inflate the rect so we can easily check for intersections
               rect.inflate(2, 2);

               if (!currentRect) {
                  currentRect = rect;
                  return;
               }

               // Check and make sure the rects are on the same line, and that they intersect with each other before we merge.
               // We don't want to merge rects existing on different lines in the document
               if (currentRect.y === rect.y && currentRect.intersectsWith(rect)) {
                  currentRect.union(rect);
               } else {
                  results.push(currentRect);
                  currentRect = rect;
               }
            });

            if(currentRect)
               results.push(currentRect);

            return results;
         }
      }
   }
}