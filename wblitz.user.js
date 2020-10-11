// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @exclude      https://ru.wotblitz.com/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://ru.wotblitz.com/tournament-season/watch/1b7ecd13ab88460ca1c7d97735698ab3/";
let ws = null;
function start(){
    ws = new WebSocket(url);
    ws.onopen = onopen;
    ws.onmessage = onmessage;
}
function send() { ws.send('{\"command\":\"watching\"}'); }
function onopen() { ws.send('{\"command\":\"close\"}'); }
function onmessage(msg) {
    let t = JSON.parse(msg.data).data;
    document.title = t + " сек";
}
setInterval(send, 2000);
window.start = start;
start();
