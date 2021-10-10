/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module Dialogs {

      interface AnalysisDlg {
         rules: HTMLElement;
         actions: HTMLElement;
         hilite: HTMLElement;
         delete: HTMLElement;
         close: HTMLElement;
         apply: HTMLElement;
         applyCommit: HTMLElement;
      }

      export class AutoRedactionDlg {
         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private context: DocumentViewerDemo.DocumentViewerDemoApp = null;
         private helper: AutoRedactHelper = null;

         private el: AnalysisDlg = {
            delete: document.getElementById('redactPresets-delete'),
            hilite: document.getElementById('redactPresets-highlight'),
            rules: document.getElementById('redactPresets-rules'),
            actions: document.getElementById('redactPresets-actions'),
            close: document.getElementById('redactPresets-close'),
            apply: document.getElementById('redactPresets-apply'),
            applyCommit: document.getElementById('redactPresets-applyCommit')
         };

         private rules: string[] = [];
         private actions: string[] = [];

         constructor(appContext: DocumentViewerDemo.DocumentViewerDemoApp) {
            const root = $('#redactPresets-dlg');
            this.inner = new lt.Demos.Dialogs.InnerDialog(root);
            this.inner.onRootClick = this.onHide;
            this.el.close.onclick = this.onHide;
            this.el.apply.onclick = () => { this.apply(); };
            this.el.applyCommit.onclick = () => { this.applyCommit(); };

            this.context = appContext;
            lt.Document.Analytics.DocumentAnalyzer.getRuleSets().then(this.buildRulesUi);
            lt.Document.Analytics.DocumentAnalyzer.getActionSets().then(this.buildActionsUi);
         }

         private onHide = () => {
            this.toggleAllInputs(false);
            this.inner.hide();
         }

         private applyCommit(): void {
            if (!this.rules || !this.rules.length) {
               alert('No rules selected.  Please select at least one rule.');
               return;
            }

            if (!this.actions || !this.actions.length) {
               alert('No actions selected.  Please select at least one action.');
               return;
            }

            const documentId = this.context.documentViewer.document.documentId;

            const options = new lt.Document.Analytics.DocumentAnalyzerRunOptions();
            options.actionIds = this.actions;
            options.ruleSetIds = this.rules;
            options.returnResults = false;

            this.context.loadingDlg.show(false, false, "Applying rulesets", "", null);
            this.inner.hide();
            lt.Document.Analytics.DocumentAnalyzer.runAnalysis(documentId, options)
               .done((response) => {
                  this.context.loadingDlg.hide();
                  lt.Document.DocumentFactory.loadFromCache(documentId)
                     .done((document) => this.context.documentViewer.setDocument(document))
                     .fail(this.context.showServiceError);
               }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                  this.context.loadingDlg.hide();
                  this.inner.show();
                  this.context.showServiceError("Error analyzing the document", jqXHR, textStatus, errorThrown);
               });
         }

         private apply(): void {
            if (!this.rules || !this.rules.length) {
               alert('No rules selected.  Please select at least one rule.');
               return;
            }

            const documentId = this.context.documentViewer.document.documentId;

            const options = new lt.Document.Analytics.DocumentAnalyzerRunOptions();
            options.ruleSetIds = this.rules;

            this.context.loadingDlg.show(false, false, "Applying rulesets", "", null);
            this.inner.hide();
            lt.Document.Analytics.DocumentAnalyzer.runAnalysis(documentId, options)
               .done((results) => {
                  this.context.loadingDlg.hide();
                  this.inner.show();
                  this.helper = new AutoRedactHelper(document.getElementById('data-container'), results, this.context.documentViewer);

                  const button = document.getElementById('redactPresets-commit');
                  (button as HTMLButtonElement).disabled = false;

                  button.onclick = () => {
                     if (this.helper.selectedResults.length == 0) {
                        alert('Please accept at least one change.');
                        return;
                     }

                     if (this.actions.length == 0) {
                        alert('Please select an action');
                        return;
                     }

                     this.inner.hide();
                     this.context.loadingDlg.show(false, false, "Commiting changes to document...", "", null);
                     lt.Document.Analytics.DocumentAnalyzer.applyActions(documentId, this.actions, this.helper.selectedResults)
                        .done(() => {
                           lt.Document.DocumentFactory.loadFromCache(documentId)
                              .done((document) => {
                                 this.context.documentViewer.setDocument(document);
                                 this.context.loadingDlg.hide();
                              })
                              .fail(this.context.showServiceError);
                        }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                           alert('There was an issue running the rule sets');
                           this.context.loadingDlg.hide();
                           this.inner.show();
                        });
                  };

               }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                  this.context.loadingDlg.hide();
                  this.inner.show();
                  this.context.showServiceError("Error analyzing the document", jqXHR, textStatus, errorThrown);
               });
         }

         private buildRulesUi = (rules: lt.Document.Analytics.RuleSet[]) => {
            if (!rules || !rules.length) return;

            this.el.rules.innerHTML = '';
            this.buildRuleToggle();

            rules.forEach(rule => this.el.rules.appendChild(this.buildRuleSet(rule)));
         }

         private buildActionsUi = (actions: lt.Document.Analytics.ActionSet[]) => {
            if (!actions || !actions.length) return;

            this.el.actions.innerHTML = '';
            actions.forEach(action => this.el.actions.appendChild(this.buildActionSet(action)));
         }

         private buildRuleToggle = () => {
            const button = document.createElement('button');
            button.innerText = 'Enable all Rules';
            button.style.marginLeft = 'auto';
            button.style.marginRight = '5px';
            button.className = 'btn btn-default btn-sm';

            let toggle = false;
            button.onclick = () => {
               toggle = !toggle;
               this.toggleAllInputs(toggle);
               button.innerText = (toggle) ? 'Disable all Rules' : 'Enable all Rules';
            };

            const container = document.createElement('div');
            container.className = 'rule-row';
            container.style.marginTop = '2px';
            container.style.marginBottom = '5px';
            container.appendChild(button);

            this.el.rules.appendChild(container);
         }

         private buildActionSet = (rule: lt.Document.Analytics.ActionSet): HTMLDivElement => {
            const container = document.createElement('div');
            container.className = 'rule-container';

            const row = document.createElement('div');
            row.className = 'rule-row';

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'vcenter rule-input';
            check.id = rule.id;
            check.onclick = (e) => {
               const target = e.target as HTMLInputElement;
               const checked = target.checked;

               if (checked)
                  this.actions.push(target.id)
               else
                  this.actions = this.actions.filter(x => x !== target.id);
            }

            const label = document.createElement('label');
            label.className = 'vcenter';
            label.innerText = rule.title;
            label.htmlFor = rule.id;

            row.appendChild(check);
            row.appendChild(label);
            container.appendChild(row);

            return container;
         }

         private buildRuleSet = (rule: lt.Document.Analytics.RuleSet): HTMLDivElement => {
            const container = document.createElement('div');
            container.className = 'rule-container';

            const row = document.createElement('div');
            row.className = 'rule-row';

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'vcenter rule-input';
            check.id = rule.id;
            check.onclick = (e) => {
               const target = e.target as HTMLInputElement;
               const checked = target.checked;

               if (checked)
                  this.rules.push(target.id)
               else
                  this.rules = this.rules.filter(x => x !== target.id);
            }

            const label = document.createElement('label');
            label.className = 'vcenter';
            label.innerText = rule.title;
            label.htmlFor = rule.id;

            row.appendChild(check);
            row.appendChild(label);
            container.appendChild(row);

            return container;
         }

         private toggleAllInputs = (value: boolean) => {
            if (!value)
               this.rules = [];

            var elements = this.el.rules.getElementsByTagName('input');
            for (var i = 0; i < elements.length; i++) {
               var ele = elements.item(i);
               ele.checked = value;
               if (value)
                  this.rules.push(ele.id);
            }
         }

         public reset = () => {
            document.getElementById('data-container').innerHTML = '';

            this.toggleAllInputs(false);
            this.rules = [];

            const ele = (document.getElementById('redactPresets-commit') as HTMLButtonElement);
            ele.disabled = true;
            ele.onclick = null;
            if (this.helper) {
               this.helper.dispose();
               this.helper = null;
            }
         }
      }


      class AutoRedactHelper {
         private readonly colors = {
            highConfidence: '#28a745',
            mediumConfidence: '#ffc107',
            lowConfidence: '#dc3545'
         }

         private root: HTMLElement;
         public selectedResults: lt.Document.Analytics.AnalysisResult[];
         private viewer: lt.Document.Viewer.DocumentViewer;
         private acceptableConfidence = 70;

         constructor(root: HTMLElement, results: lt.Document.Analytics.AnalysisResult[], viewer: lt.Document.Viewer.DocumentViewer) {
            root.innerHTML = '';
            this.root = root;
            this.selectedResults = [];
            this.viewer = viewer;

            const buttonExists: any[] = [].slice.call(root.parentElement.querySelectorAll('.acceptAllRedact'));
            if (buttonExists && !buttonExists.length)
               root.parentElement.insertBefore(this.buildTogglePanel(root), root.parentElement.childNodes[0]);

            results.forEach((result) => {
               if (result.confidence < this.acceptableConfidence)
                  return;

               root.appendChild(this.buildResults(result));
               this.addAnnotations(result);
            })
         }

         dispose = () => {
            this.selectedResults = [];
            this.onCountChanged();
            this.viewer = null;
         }


         private buildResults = (result: lt.Document.Analytics.AnalysisResult) => {
            const row = document.createElement('div');
            row.className = 'ann-row';
            row.appendChild(this.buildInfoPanel(result));
            row.appendChild(this.buildContentPanel(result));
            row.appendChild(this.buildButtonPanel(result));

            return row;
         }

         private buildInfoPanel = (result: lt.Document.Analytics.AnalysisResult) => {
            const row = document.createElement('div');
            row.className = 'ann-column';
            row.style.marginLeft = '5px';

            const pageLabel = document.createElement('label');
            pageLabel.className = 'vcenter';
            pageLabel.style.pointerEvents = 'none';
            pageLabel.textContent = `Page ${result.pageNumber}`;
            row.appendChild(pageLabel);

            const annType = document.createElement('label');
            annType.className = 'vcenter annType';
            annType.style.pointerEvents = 'none';
            annType.textContent = `Redaction`;
            row.appendChild(annType);

            return row;
         }

         private buildContentPanel = (result: lt.Document.Analytics.AnalysisResult) => {
            const row = document.createElement('div');
            row.className = 'ann-content';

            const text = document.createElement('p');
            text.className = 'vcenter hcenter covered-text';
            text.style.pointerEvents = 'none';
            text.textContent = result.value;
            row.appendChild(text);

            const confidence = document.createElement('label');
            confidence.className = 'vcenter hcenter';
            confidence.style.pointerEvents = 'none';
            confidence.textContent = `${result.confidence}% Confidence`;
            confidence.style.color = this.getColorConfidence(result.confidence);

            row.appendChild(confidence);

            return row;
         }

         private buildTogglePanel = (root: HTMLElement) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.flexDirection = 'row';

            row.style.marginRight = '5px';
            row.style.marginLeft = '5px';

            const button = document.createElement('button');
            button.innerText = 'Accept All';
            button.style.margin = '5px';
            button.style.marginLeft = 'auto';
            button.style.borderBottom = '2px solid #ddd';
            button.className = 'btn btn-default acceptAllRedact';
            button.onclick = () => {
               if (!root) return;

               button.disabled = true;
               const elements = [].slice.call(root.querySelectorAll('.glyphicon-ok'));
               elements.forEach((ele: HTMLElement) => ele.click());
               button.disabled = false;
            };

            row.appendChild(button);
            return row;
         }

         private buildButtonPanel = (result: lt.Document.Analytics.AnalysisResult) => {
            const row = document.createElement('div');
            row.className = 'ann-button-container';
            row.style.marginRight = '5px';

            const accept = document.createElement('span');
            accept.className = 'glyphicon glyphicon-ok vcenter';
            accept.style.marginLeft = 'auto';
            accept.style.color = this.colors.highConfidence;
            accept.onclick = () => {
               this.selectedResults.push(result);
               this.onCountChanged();
               this.deleteRow(row);
               this.removeAnnotation(result);
            }
            row.appendChild(accept);

            const remove = document.createElement('span');
            remove.className = 'glyphicon glyphicon-remove vcenter';
            remove.style.marginLeft = 'auto';
            remove.style.color = this.colors.lowConfidence;
            remove.onclick = () => {
               this.deleteRow(row);
               this.removeAnnotation(result);
            }
            row.appendChild(remove);

            const toggle = document.createElement('span');
            toggle.className = 'glyphicon glyphicon-transfer vcenter';
            toggle.style.marginLeft = 'auto';
            toggle.onclick = () => {
               if (!this.viewer) return;

               this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageGoto, result.pageNumber);
            }
            row.appendChild(toggle);

            return row;
         }

         private getColorConfidence = (confidence: number) => {
            if (confidence >= 90)
               return this.colors.highConfidence;

            if (confidence >= 75)
               return this.colors.mediumConfidence;

            return this.colors.lowConfidence;
         }

         private deleteRow = (row: HTMLElement) => {
            const parentContainer = row.parentElement;
            const root = parentContainer.parentElement;

            root.removeChild(parentContainer);
         }

         private onCountChanged = () => document.getElementById('changes').innerText = `Accepted Changes: ${this.selectedResults.length}`;

         private addAnnotations = (result: lt.Document.Analytics.AnalysisResult) => {
            if (!this.viewer || !this.viewer.hasDocument) return;

            const document = this.viewer.document;
            const annContainer = this.viewer.annotations.automation.containers.get_item(result.pageNumber - 1);

            result.bounds.forEach(bound => {
               const rect = lt.LeadRectD.create(bound.x, bound.y, bound.width, bound.height);

               const hilite = new lt.Annotations.Engine.AnnTextHiliteObject();
               //hilite.fill = lt.Annotations.Engine.AnnSolidColorBrush.create(this.getColorConfidence(result.confidence));
               hilite.setRectangles([rect]);
               hilite.metadata['autoRedact'] = result.value;

               annContainer.children.add(hilite);
            })
           
            this.viewer.annotations.automation.invalidate(lt.LeadRectD.empty);
         }

         private removeAnnotation = (result: lt.Document.Analytics.AnalysisResult) => {
            if (!this.viewer || !this.viewer.hasDocument) return;
            const annContainer = this.viewer.annotations.automation.containers.get_item(result.pageNumber - 1);

            const items = annContainer.children.toArray().filter(x => x.metadata['autoRedact'] && x.metadata['autoRedact'] === result.value);
            if (!items || !items.length) return;

            annContainer.children.remove(items[0]);
            this.viewer.annotations.automation.invalidate(lt.LeadRectD.empty);
         }
      }
   }
}