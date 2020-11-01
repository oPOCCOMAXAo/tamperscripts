// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @exclude      https://ru.wotblitz.com/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://watchblitz-ru.wotblitz.com/v1/groups/2/watch?token=d36347df-8eee-434b-815f-017bad75db93";
let ws = null;
function start(){
    ws = new WebSocket(url);
    ws.onopen = onopen;
    ws.onmessage = onmessage;
}
function send() { ws.send('{\"operation\":\"watching\"}'); }
function onopen() { ws.send('{\"operation\":\"close\"}'); }
function onmessage(msg) {
    let t = JSON.parse(msg.data).time;
    document.title = t + " сек";
}
setInterval(send, 2000);
window.start = start;
start();
