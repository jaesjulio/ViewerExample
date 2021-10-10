/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var AutoRedactionDlg = /** @class */ (function () {
            function AutoRedactionDlg(appContext) {
                var _this = this;
                this.inner = null;
                this.context = null;
                this.helper = null;
                this.el = {
                    delete: document.getElementById('redactPresets-delete'),
                    hilite: document.getElementById('redactPresets-highlight'),
                    rules: document.getElementById('redactPresets-rules'),
                    actions: document.getElementById('redactPresets-actions'),
                    close: document.getElementById('redactPresets-close'),
                    apply: document.getElementById('redactPresets-apply'),
                    applyCommit: document.getElementById('redactPresets-applyCommit')
                };
                this.rules = [];
                this.actions = [];
                this.onHide = function () {
                    _this.toggleAllInputs(false);
                    _this.inner.hide();
                };
                this.buildRulesUi = function (rules) {
                    if (!rules || !rules.length)
                        return;
                    _this.el.rules.innerHTML = '';
                    _this.buildRuleToggle();
                    rules.forEach(function (rule) { return _this.el.rules.appendChild(_this.buildRuleSet(rule)); });
                };
                this.buildActionsUi = function (actions) {
                    if (!actions || !actions.length)
                        return;
                    _this.el.actions.innerHTML = '';
                    actions.forEach(function (action) { return _this.el.actions.appendChild(_this.buildActionSet(action)); });
                };
                this.buildRuleToggle = function () {
                    var button = document.createElement('button');
                    button.innerText = 'Enable all Rules';
                    button.style.marginLeft = 'auto';
                    button.style.marginRight = '5px';
                    button.className = 'btn btn-default btn-sm';
                    var toggle = false;
                    button.onclick = function () {
                        toggle = !toggle;
                        _this.toggleAllInputs(toggle);
                        button.innerText = (toggle) ? 'Disable all Rules' : 'Enable all Rules';
                    };
                    var container = document.createElement('div');
                    container.className = 'rule-row';
                    container.style.marginTop = '2px';
                    container.style.marginBottom = '5px';
                    container.appendChild(button);
                    _this.el.rules.appendChild(container);
                };
                this.buildActionSet = function (rule) {
                    var container = document.createElement('div');
                    container.className = 'rule-container';
                    var row = document.createElement('div');
                    row.className = 'rule-row';
                    var check = document.createElement('input');
                    check.type = 'checkbox';
                    check.className = 'vcenter rule-input';
                    check.id = rule.id;
                    check.onclick = function (e) {
                        var target = e.target;
                        var checked = target.checked;
                        if (checked)
                            _this.actions.push(target.id);
                        else
                            _this.actions = _this.actions.filter(function (x) { return x !== target.id; });
                    };
                    var label = document.createElement('label');
                    label.className = 'vcenter';
                    label.innerText = rule.title;
                    label.htmlFor = rule.id;
                    row.appendChild(check);
                    row.appendChild(label);
                    container.appendChild(row);
                    return container;
                };
                this.buildRuleSet = function (rule) {
                    var container = document.createElement('div');
                    container.className = 'rule-container';
                    var row = document.createElement('div');
                    row.className = 'rule-row';
                    var check = document.createElement('input');
                    check.type = 'checkbox';
                    check.className = 'vcenter rule-input';
                    check.id = rule.id;
                    check.onclick = function (e) {
                        var target = e.target;
                        var checked = target.checked;
                        if (checked)
                            _this.rules.push(target.id);
                        else
                            _this.rules = _this.rules.filter(function (x) { return x !== target.id; });
                    };
                    var label = document.createElement('label');
                    label.className = 'vcenter';
                    label.innerText = rule.title;
                    label.htmlFor = rule.id;
                    row.appendChild(check);
                    row.appendChild(label);
                    container.appendChild(row);
                    return container;
                };
                this.toggleAllInputs = function (value) {
                    if (!value)
                        _this.rules = [];
                    var elements = _this.el.rules.getElementsByTagName('input');
                    for (var i = 0; i < elements.length; i++) {
                        var ele = elements.item(i);
                        ele.checked = value;
                        if (value)
                            _this.rules.push(ele.id);
                    }
                };
                this.reset = function () {
                    document.getElementById('data-container').innerHTML = '';
                    _this.toggleAllInputs(false);
                    _this.rules = [];
                    var ele = document.getElementById('redactPresets-commit');
                    ele.disabled = true;
                    ele.onclick = null;
                    if (_this.helper) {
                        _this.helper.dispose();
                        _this.helper = null;
                    }
                };
                var root = $('#redactPresets-dlg');
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                this.el.close.onclick = this.onHide;
                this.el.apply.onclick = function () { _this.apply(); };
                this.el.applyCommit.onclick = function () { _this.applyCommit(); };
                this.context = appContext;
                lt.Document.Analytics.DocumentAnalyzer.getRuleSets().then(this.buildRulesUi);
                lt.Document.Analytics.DocumentAnalyzer.getActionSets().then(this.buildActionsUi);
            }
            AutoRedactionDlg.prototype.applyCommit = function () {
                var _this = this;
                if (!this.rules || !this.rules.length) {
                    alert('No rules selected.  Please select at least one rule.');
                    return;
                }
                if (!this.actions || !this.actions.length) {
                    alert('No actions selected.  Please select at least one action.');
                    return;
                }
                var documentId = this.context.documentViewer.document.documentId;
                var options = new lt.Document.Analytics.DocumentAnalyzerRunOptions();
                options.actionIds = this.actions;
                options.ruleSetIds = this.rules;
                options.returnResults = false;
                this.context.loadingDlg.show(false, false, "Applying rulesets", "", null);
                this.inner.hide();
                lt.Document.Analytics.DocumentAnalyzer.runAnalysis(documentId, options)
                    .done(function (response) {
                    _this.context.loadingDlg.hide();
                    lt.Document.DocumentFactory.loadFromCache(documentId)
                        .done(function (document) { return _this.context.documentViewer.setDocument(document); })
                        .fail(_this.context.showServiceError);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    _this.context.loadingDlg.hide();
                    _this.inner.show();
                    _this.context.showServiceError("Error analyzing the document", jqXHR, textStatus, errorThrown);
                });
            };
            AutoRedactionDlg.prototype.apply = function () {
                var _this = this;
                if (!this.rules || !this.rules.length) {
                    alert('No rules selected.  Please select at least one rule.');
                    return;
                }
                var documentId = this.context.documentViewer.document.documentId;
                var options = new lt.Document.Analytics.DocumentAnalyzerRunOptions();
                options.ruleSetIds = this.rules;
                this.context.loadingDlg.show(false, false, "Applying rulesets", "", null);
                this.inner.hide();
                lt.Document.Analytics.DocumentAnalyzer.runAnalysis(documentId, options)
                    .done(function (results) {
                    _this.context.loadingDlg.hide();
                    _this.inner.show();
                    _this.helper = new AutoRedactHelper(document.getElementById('data-container'), results, _this.context.documentViewer);
                    var button = document.getElementById('redactPresets-commit');
                    button.disabled = false;
                    button.onclick = function () {
                        if (_this.helper.selectedResults.length == 0) {
                            alert('Please accept at least one change.');
                            return;
                        }
                        if (_this.actions.length == 0) {
                            alert('Please select an action');
                            return;
                        }
                        _this.inner.hide();
                        _this.context.loadingDlg.show(false, false, "Commiting changes to document...", "", null);
                        lt.Document.Analytics.DocumentAnalyzer.applyActions(documentId, _this.actions, _this.helper.selectedResults)
                            .done(function () {
                            lt.Document.DocumentFactory.loadFromCache(documentId)
                                .done(function (document) {
                                _this.context.documentViewer.setDocument(document);
                                _this.context.loadingDlg.hide();
                            })
                                .fail(_this.context.showServiceError);
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            alert('There was an issue running the rule sets');
                            _this.context.loadingDlg.hide();
                            _this.inner.show();
                        });
                    };
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    _this.context.loadingDlg.hide();
                    _this.inner.show();
                    _this.context.showServiceError("Error analyzing the document", jqXHR, textStatus, errorThrown);
                });
            };
            return AutoRedactionDlg;
        }());
        Dialogs.AutoRedactionDlg = AutoRedactionDlg;
        var AutoRedactHelper = /** @class */ (function () {
            function AutoRedactHelper(root, results, viewer) {
                var _this = this;
                this.colors = {
                    highConfidence: '#28a745',
                    mediumConfidence: '#ffc107',
                    lowConfidence: '#dc3545'
                };
                this.acceptableConfidence = 70;
                this.dispose = function () {
                    _this.selectedResults = [];
                    _this.onCountChanged();
                    _this.viewer = null;
                };
                this.buildResults = function (result) {
                    var row = document.createElement('div');
                    row.className = 'ann-row';
                    row.appendChild(_this.buildInfoPanel(result));
                    row.appendChild(_this.buildContentPanel(result));
                    row.appendChild(_this.buildButtonPanel(result));
                    return row;
                };
                this.buildInfoPanel = function (result) {
                    var row = document.createElement('div');
                    row.className = 'ann-column';
                    row.style.marginLeft = '5px';
                    var pageLabel = document.createElement('label');
                    pageLabel.className = 'vcenter';
                    pageLabel.style.pointerEvents = 'none';
                    pageLabel.textContent = "Page " + result.pageNumber;
                    row.appendChild(pageLabel);
                    var annType = document.createElement('label');
                    annType.className = 'vcenter annType';
                    annType.style.pointerEvents = 'none';
                    annType.textContent = "Redaction";
                    row.appendChild(annType);
                    return row;
                };
                this.buildContentPanel = function (result) {
                    var row = document.createElement('div');
                    row.className = 'ann-content';
                    var text = document.createElement('p');
                    text.className = 'vcenter hcenter covered-text';
                    text.style.pointerEvents = 'none';
                    text.textContent = result.value;
                    row.appendChild(text);
                    var confidence = document.createElement('label');
                    confidence.className = 'vcenter hcenter';
                    confidence.style.pointerEvents = 'none';
                    confidence.textContent = result.confidence + "% Confidence";
                    confidence.style.color = _this.getColorConfidence(result.confidence);
                    row.appendChild(confidence);
                    return row;
                };
                this.buildTogglePanel = function (root) {
                    var row = document.createElement('div');
                    row.style.display = 'flex';
                    row.style.flexDirection = 'row';
                    row.style.marginRight = '5px';
                    row.style.marginLeft = '5px';
                    var button = document.createElement('button');
                    button.innerText = 'Accept All';
                    button.style.margin = '5px';
                    button.style.marginLeft = 'auto';
                    button.style.borderBottom = '2px solid #ddd';
                    button.className = 'btn btn-default acceptAllRedact';
                    button.onclick = function () {
                        if (!root)
                            return;
                        button.disabled = true;
                        var elements = [].slice.call(root.querySelectorAll('.glyphicon-ok'));
                        elements.forEach(function (ele) { return ele.click(); });
                        button.disabled = false;
                    };
                    row.appendChild(button);
                    return row;
                };
                this.buildButtonPanel = function (result) {
                    var row = document.createElement('div');
                    row.className = 'ann-button-container';
                    row.style.marginRight = '5px';
                    var accept = document.createElement('span');
                    accept.className = 'glyphicon glyphicon-ok vcenter';
                    accept.style.marginLeft = 'auto';
                    accept.style.color = _this.colors.highConfidence;
                    accept.onclick = function () {
                        _this.selectedResults.push(result);
                        _this.onCountChanged();
                        _this.deleteRow(row);
                        _this.removeAnnotation(result);
                    };
                    row.appendChild(accept);
                    var remove = document.createElement('span');
                    remove.className = 'glyphicon glyphicon-remove vcenter';
                    remove.style.marginLeft = 'auto';
                    remove.style.color = _this.colors.lowConfidence;
                    remove.onclick = function () {
                        _this.deleteRow(row);
                        _this.removeAnnotation(result);
                    };
                    row.appendChild(remove);
                    var toggle = document.createElement('span');
                    toggle.className = 'glyphicon glyphicon-transfer vcenter';
                    toggle.style.marginLeft = 'auto';
                    toggle.onclick = function () {
                        if (!_this.viewer)
                            return;
                        _this.viewer.commands.run(lt.Document.Viewer.DocumentViewerCommands.pageGoto, result.pageNumber);
                    };
                    row.appendChild(toggle);
                    return row;
                };
                this.getColorConfidence = function (confidence) {
                    if (confidence >= 90)
                        return _this.colors.highConfidence;
                    if (confidence >= 75)
                        return _this.colors.mediumConfidence;
                    return _this.colors.lowConfidence;
                };
                this.deleteRow = function (row) {
                    var parentContainer = row.parentElement;
                    var root = parentContainer.parentElement;
                    root.removeChild(parentContainer);
                };
                this.onCountChanged = function () { return document.getElementById('changes').innerText = "Accepted Changes: " + _this.selectedResults.length; };
                this.addAnnotations = function (result) {
                    if (!_this.viewer || !_this.viewer.hasDocument)
                        return;
                    var document = _this.viewer.document;
                    var annContainer = _this.viewer.annotations.automation.containers.get_item(result.pageNumber - 1);
                    result.bounds.forEach(function (bound) {
                        var rect = lt.LeadRectD.create(bound.x, bound.y, bound.width, bound.height);
                        var hilite = new lt.Annotations.Engine.AnnTextHiliteObject();
                        //hilite.fill = lt.Annotations.Engine.AnnSolidColorBrush.create(this.getColorConfidence(result.confidence));
                        hilite.setRectangles([rect]);
                        hilite.metadata['autoRedact'] = result.value;
                        annContainer.children.add(hilite);
                    });
                    _this.viewer.annotations.automation.invalidate(lt.LeadRectD.empty);
                };
                this.removeAnnotation = function (result) {
                    if (!_this.viewer || !_this.viewer.hasDocument)
                        return;
                    var annContainer = _this.viewer.annotations.automation.containers.get_item(result.pageNumber - 1);
                    var items = annContainer.children.toArray().filter(function (x) { return x.metadata['autoRedact'] && x.metadata['autoRedact'] === result.value; });
                    if (!items || !items.length)
                        return;
                    annContainer.children.remove(items[0]);
                    _this.viewer.annotations.automation.invalidate(lt.LeadRectD.empty);
                };
                root.innerHTML = '';
                this.root = root;
                this.selectedResults = [];
                this.viewer = viewer;
                var buttonExists = [].slice.call(root.parentElement.querySelectorAll('.acceptAllRedact'));
                if (buttonExists && !buttonExists.length)
                    root.parentElement.insertBefore(this.buildTogglePanel(root), root.parentElement.childNodes[0]);
                results.forEach(function (result) {
                    if (result.confidence < _this.acceptableConfidence)
                        return;
                    root.appendChild(_this.buildResults(result));
                    _this.addAnnotations(result);
                });
            }
            return AutoRedactHelper;
        }());
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
