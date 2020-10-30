// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @exclude      https://ru.wotblitz.com/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://watchblitz-ru.wotblitz.com/v1/groups/3/watch?token=4ba160b2-7561-46e4-ab9f-92286e4a3beb";
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
