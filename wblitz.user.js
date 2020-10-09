// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @exclude      https://ru.wotblitz.com/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://ru.wotblitz.com/tournament-season/watch/8adfde840b1644b196930697d409227b/";
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
