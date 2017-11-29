// ==UserScript==
// @name         APIDog redirect to wbprx
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       POCCOMAXA
// @match        https://apidog.ru/*
// ==/UserScript==
const matchRegex = /https:\/\/vk\.com\//g;
const toReplace = "http://vk.com.https.w2.wbprx.com/";
new MutationObserver(mutations => mutations.forEach(m => m.target && matchRegex.test(m.target.innerHTML) && (m.target.innerHTML = m.target.innerHTML.replace(matchRegex, toReplace)))).observe(document.body, {	attributes: true, childList: true, subtree: true, attributeFilter: ["innerHTML"] });