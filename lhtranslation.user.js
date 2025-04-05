// ==UserScript==
// @name         lhtranslation
// @namespace    http://tampermonkey.net/
// @version      2025-04-05
// @author       oPOCCOMAXAo
// @match        https://lhtranslation.net/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lhtranslation.net
// @grant        none
// ==/UserScript==

const id = "GM_addStyle" + Math.floor(Math.random()*36**4).toString(36);

function GM_addStyle(css) {
    const style = document.getElementById(id) || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = id;
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

GM_addStyle(`.container {
    width: 100%;
    max-width: 100%;
    padding: 0;
}`);
GM_addStyle(`.reading-content {
    padding: 0 !important;
}`);
