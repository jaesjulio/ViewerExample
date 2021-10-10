﻿/**************************************************
Copyright (c) 1991-2021 LEAD Technologies, Inc. ALL RIGHTS RESERVED.
This software is protected by United States and International copyright laws.
Any copying, duplication, deployment, redistribution, modification or other
disposition hereof is STRICTLY PROHIBITED without an express written license
granted by LEAD Technologies, Inc. Specifically, no portion of this file may be modified, 
altered or otherwise changed under any circumstances, nor may any portion of this file be 
merged with any other file(s) or code.
Portions of this product are licensed under US patent 5,327,254 and foreign
counterparts.
For more information, contact LEAD Technologies, Inc. at 704-332-5532 or visit
https://www.leadtools.com
**************************************************/
/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Library: Leadtools.Pdf.Compatibility.js
// Version:22.0.0.3
var $jscomp=$jscomp||{};$jscomp['scope']={};$jscomp['arrayIteratorImpl']=function(c){var d=0x0;return function(){return d<c['length']?{'done':!0x1,'value':c[d++]}:{'done':!0x0};};};$jscomp['arrayIterator']=function(e){return{'next':$jscomp['arrayIteratorImpl'](e)};};$jscomp['makeIterator']=function(f){var g='undefined'!=typeof Symbol&&Symbol['iterator']&&f[Symbol['iterator']];return g?g['call'](f):$jscomp['arrayIterator'](f);};if(!('undefined'!==typeof PDFJSDev&&PDFJSDev['test']('SKIP_BABEL')||'undefined'!==typeof globalThis&&globalThis['_pdfjsCompatibilityChecked'])){if('undefined'===typeof globalThis||globalThis['Math']!==Math)globalThis=require('core-js/es/global-this');globalThis['_pdfjsCompatibilityChecked']=!0x0;globalThis['PDFJS']={};var $jscomp$destructuring$var0=require('./is_node'),isNodeJS=$jscomp$destructuring$var0['isNodeJS'],hasDOM='object'===typeof window&&'object'===typeof document,userAgent='undefined'!==typeof navigator&&navigator['userAgent']||'',isIE=/Trident/['test'](userAgent);(function(){!globalThis['btoa']&&isNodeJS&&(globalThis['btoa']=function(h){return Buffer['from'](h,'binary')['toString']('base64');});}());(function(){!globalThis['atob']&&isNodeJS&&(globalThis['atob']=function(i){return Buffer['from'](i,'base64')['toString']('binary');});}());(function(){hasDOM&&'undefined'===typeof Element['prototype']['remove']&&(Element['prototype']['remove']=function(){this['parentNode']&&this['parentNode']['removeChild'](this);});}());(function(){if(hasDOM&&!isNodeJS){var j=document['createElement']('div');j['classList']['add']('testOne','testTwo');if(!0x0!==j['classList']['contains']('testOne')||!0x0!==j['classList']['contains']('testTwo')){var k=DOMTokenList['prototype']['add'],l=DOMTokenList['prototype']['remove'];DOMTokenList['prototype']['add']=function(j){for(var n=[],o=0x0;o<arguments['length'];++o)n[o-0x0]=arguments[o];n=$jscomp['makeIterator'](n);for(o=n['next']();!o['done'];o=n['next']())k['call'](this,o['value']);};DOMTokenList['prototype']['remove']=function(j){for(var q=[],r=0x0;r<arguments['length'];++r)q[r-0x0]=arguments[r];q=$jscomp['makeIterator'](q);for(r=q['next']();!r['done'];r=q['next']())l['call'](this,r['value']);};}}}());(function(){hasDOM&&!isNodeJS&&!0x1!==document['createElement']('div')['classList']['toggle']('test',0x0)&&(DOMTokenList['prototype']['toggle']=function(s){var t=0x1<arguments['length']?!!arguments[0x1]:!this['contains'](s);return this[t?'add':'remove'](s),t;});}());(function(){if(hasDOM&&isIE){var u=window['history']['pushState'],v=window['history']['replaceState'];window['history']['pushState']=function(v,x,y){u['apply'](this,void 0x0===y?[v,x]:[v,x,y]);};window['history']['replaceState']=function(u,A,B){v['apply'](this,void 0x0===B?[u,A]:[u,A,B]);};}}());(function(){String['prototype']['startsWith']||require('core-js/es/string/starts-with');}());(function(){String['prototype']['endsWith']||require('core-js/es/string/ends-with');}());(function(){String['prototype']['includes']||require('core-js/es/string/includes');}());(function(){Array['prototype']['includes']||require('core-js/es/array/includes');}());(function(){Array['from']||require('core-js/es/array/from');}());(function(){Object['assign']||require('core-js/es/object/assign');}());(function(){Math['log2']||(Math['log2']=require('core-js/es/math/log2'));}());(function(){Number['isNaN']||(Number['isNaN']=require('core-js/es/number/is-nan'));}());(function(){Number['isInteger']||(Number['isInteger']=require('core-js/es/number/is-integer'));}());(function(){'undefined'!==typeof PDFJSDev&&PDFJSDev['test']('IMAGE_DECODERS')||globalThis['Promise']&&globalThis['Promise']['prototype']&&globalThis['Promise']['prototype']['finally']||(globalThis['Promise']=require('core-js/es/promise/index'));}());(function(){if('undefined'===typeof PDFJSDev||!PDFJSDev['test']('IMAGE_DECODERS'))if('undefined'===typeof PDFJSDev||PDFJSDev['test']('GENERIC'))globalThis['URL']=require('core-js/web/url');}());(function(){globalThis['WeakMap']||(globalThis['WeakMap']=require('core-js/es/weak-map/index'));}());(function(){globalThis['WeakSet']||(globalThis['WeakSet']=require('core-js/es/weak-set/index'));}());(function(){String['prototype']['codePointAt']||require('core-js/es/string/code-point-at');}());(function(){String['fromCodePoint']||(String['fromCodePoint']=require('core-js/es/string/from-code-point'));}());(function(){globalThis['Symbol']||require('core-js/es/symbol/index');}());(function(){String['prototype']['padStart']||require('core-js/es/string/pad-start');}());(function(){String['prototype']['padEnd']||require('core-js/es/string/pad-end');}());(function(){Object['values']||(Object['values']=require('core-js/es/object/values'));}());};