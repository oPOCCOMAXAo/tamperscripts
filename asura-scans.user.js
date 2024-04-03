// ==UserScript==
// @name         Asura-scans mobile fix
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  try to take over the world!
// @author       POCCOMAXA
// @match        https://asura-scans.org/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asura-scans.org
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

GM_addStyle(`.text-left{max-width: max-content;}`);
GM_addStyle(`.site-header.mobile{display:none;}`);

async function onReady() {
    document
        .querySelectorAll(".sticky-enabled")
        .forEach(e => e.classList.remove("sticky-enabled"));
}

window.addEventListener("DOMContentLoaded", onReady);
setTimeout(onReady, 3000);
