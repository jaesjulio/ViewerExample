/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DocumentViewerDemo {
      // Binds document viewer command to UI elements
      export class CommandBinderElement {
         public commandName: string;
         public commandNames: Array<string>;
         public userInterfaceElement: JQuery;
         public updateEnabled: boolean;
         public updateVisible: boolean;
         public updateChecked: boolean;
         public hasDocumentVisible: boolean;
         public hasDocumentEmptyEnabled: boolean;
         public autoRun: boolean;
         // Get value call back
         public getValue: { (): Object };
         public data: Object;
         public canRun: { (documentViewer: lt.Document.Viewer.DocumentViewer, value: Object): boolean };
         public canRunValue: Object;

         constructor() {
            this.updateEnabled = true;
            this.hasDocumentVisible = true;
            this.hasDocumentEmptyEnabled = true;
            this.autoRun = true;
         }

         public runCommand(documentViewer: lt.Document.Viewer.DocumentViewer): void {
            if (this.commandName != null) {
               documentViewer.commands.run(this.commandName, this.getValue != null ? this.getValue() : null);
            }
            else if (this.commandNames != null) {
               for (var i: number = 0; i < this.commandNames.length; i++)
                  documentViewer.commands.run(this.commandNames[i], this.getValue != null ? this.getValue() : null);
            }
         }

         public canRunCommand(documentViewer: lt.Document.Viewer.DocumentViewer): boolean {
            if (this.commandName != null)
               return documentViewer.commands.canRun(this.commandName, this.getValue != null ? this.getValue() : null);

            for (var i: number = 0; i < this.commandNames.length; i++) {
               if (documentViewer.commands.canRun(this.commandNames[i], this.getValue != null ? this.getValue() : null))
                  return true;
            }

            return false;
         }

         get hasAnyCommand(): boolean {
            return (this.commandName != null || this.commandNames != null);
         }
      }

      export class CommandsBinder {
         private _documentViewer: lt.Document.Viewer.DocumentViewer;
         private _elements: Array<CommandBinderElement> = new Array<CommandBinderElement>();
         private _postRuns: Array<{ (): void }> = new Array<{ (): void }>();

         constructor(documentViewer: lt.Document.Viewer.DocumentViewer) {
            this._documentViewer = documentViewer;
         }

         get elements(): Array<CommandBinderElement> {
            return this._elements;
         }

         get postRuns(): Array<{ (): void }> {
            return this._postRuns;
         }

         public bindActions(): void {
            for (var i: number = 0; i < this._elements.length; i++) {
               if (this._elements[i].autoRun && this._elements[i].hasAnyCommand) {
                  this._elements[i].userInterfaceElement.data("commandIndex", i);
                  this._elements[i].userInterfaceElement.on("click", this.itemClick);
               }
            }
         }

         private itemClick = (e: JQueryEventObject) => {
            var element: CommandBinderElement = this._elements[parseInt($(e.currentTarget).data("commandIndex"), 10)];
            element.runCommand(this._documentViewer);
         }

         public run(): void {
            var hasDocument: boolean = this._documentViewer.hasDocument;
            var isDocumentEmpty = this._documentViewer.pageCount === 0;

            for (var i: number = 0; i < this._elements.length; i++) {
               var element: CommandBinderElement = this._elements[i];
               var userInterfaceElement: JQuery = element.userInterfaceElement;
               var canRun: boolean = false;

               if (element.canRun != null) {
                  canRun = element.canRun(this._documentViewer, element.canRunValue);
               }
               else if (element.hasDocumentVisible) {
                  canRun = hasDocument;
                  lt.Demos.Utils.Visibility.toggle(userInterfaceElement, canRun);
               }

               if (canRun && element.hasAnyCommand)
                  canRun = element.canRunCommand(this._documentViewer);

               var updateCheckedState: boolean = element.updateChecked;
               var command: lt.Document.Viewer.DocumentViewerCommand = null;
               if (element.commandName != null) {
                  // This might be a state command, check
                  command = this._documentViewer.commands.getCommand(element.commandName);
               }

               if (!updateCheckedState)
                  updateCheckedState = (command != null && command.hasState);

               if (!updateCheckedState) {
                  if (canRun && !element.hasDocumentEmptyEnabled && isDocumentEmpty)
                     canRun = false;

                  if (element.updateEnabled && (!userInterfaceElement.is(":disabled") != canRun))
                     userInterfaceElement.prop("disabled", !canRun);
               }
               else {
                  if (hasDocument) {
                     userInterfaceElement.prop("disabled", false);
                     var checkedState: boolean = false;
                     if (command != null && command.hasState)
                        checkedState = command.state;
                     else
                        checkedState = !canRun;

                     if (userInterfaceElement.hasClass("menuItem")) {
                        lt.Demos.Utils.UI.toggleChecked(userInterfaceElement.find(".icon"), checkedState);
                     } else {
                        lt.Demos.Utils.UI.toggleChecked(userInterfaceElement, checkedState);
                     }
                  } else {
                     if (userInterfaceElement.hasClass("menuItem")) {
                        lt.Demos.Utils.UI.toggleChecked(userInterfaceElement.find(".icon"), false);
                     } else {
                        lt.Demos.Utils.UI.toggleChecked(userInterfaceElement, false);
                     }
                     userInterfaceElement.prop("disabled", true);
                  }
               }
               if (element.updateVisible)
                  lt.Demos.Utils.Visibility.toggle(userInterfaceElement, canRun);
            }

            for (var i: number = 0; i < this._postRuns.length; i++)
               this._postRuns[i]();
         }
      }
   }
}
