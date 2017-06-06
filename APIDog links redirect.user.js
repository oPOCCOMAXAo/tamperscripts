// ==UserScript==
// @name         apidog links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apidog.ru/6.4/*
// @grant        none
// ==/UserScript==

var tomatch = "https://vk.com/doc";
var count = tomatch.length;
function onchange(){
    var links = document.links;
    for(var i = 0; i < links.length; i++)
        if(links[i].href.indexOf(tomatch) != -1)
            links[i].href = "http://vk.com.https.w2.wbprx.com/doc" + links[i].href.substr(count);
}
window.addEventListener("DOMSubtreeModified", onchange);