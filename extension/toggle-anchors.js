(function() {
/* jshint browser:true, maxlen:100 */
'use strict';

// Prefer "#anchor", and only use /pathname?query#anchor if base-href is set.
// #anchor is preferred to deal correctly with pages that use the history API to rewrite the URL.
var baseURI = document.querySelector('base[href]') ? location.pathname + location.search : '';

// Non-standard HTML element to avoid collisions with page's scripts
// Hey, this name is so exotic that it must be unique ;)
var baseHolder = document.createElement(':a.href:');
var baseAnchor = document.createElement('a');

baseAnchor.style.cssText =
    'position: relative;' +
    'display: inline-block;' +
    'white-space: pre;' +
    'margin-top: -2px;' +
    'padding: 2px 4px;' +
    'background-color: rgba(255, 255, 255, 0.9);' +
    (baseAnchor.style.transform === '' ? '' : '-webkit-') + 'transform: none !important;'
    ;

function stopPropagation(event) {
    event.stopPropagation();
}

function addAnchor(elem) {
    var anchorValue = elem.id || elem.name;
    if (!anchorValue) return;

    var holder = baseHolder.cloneNode();
    var anchor = baseAnchor.cloneNode();
    var shadow = holder.createShadowRoot ? holder.createShadowRoot() :
                                           holder.webkitCreateShadowRoot();
    shadow.resetStyleInheritance = true;

    anchor.href = baseURI + '#' + anchorValue;
    anchor.textContent = '#' + anchorValue;
    shadow.appendChild(anchor);

    anchor.addEventListener('click', stopPropagation);
    anchor.addEventListener('dblclick', stopPropagation);
    anchor.addEventListener('mousedown', stopPropagation);
    elem.appendChild(holder);
}

function removeAllAnchors() {
    [].forEach.call(document.body.querySelectorAll('\\:a\\.href\\:'), function(elem) {
        elem.parentNode.removeChild(elem);
    });
}

function addAllAnchors() {
    [].forEach.call(document.querySelectorAll('[id],[name]'), addAnchor);
}


// Content script is programatically activated. So, do something (toggle):
removeAllAnchors();
if (!window.hasrun) {
    addAllAnchors();
}
window.hasrun = !window.hasrun;
})();