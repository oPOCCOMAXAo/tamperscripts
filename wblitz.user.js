// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://wotblitz.ru/*
// @exclude      https://wotblitz.ru/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://wotblitz.ru/tournament-season/watch/39368a1761d74819ad904f1837b1a351/";
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
    document.title = Math.floor(t / 1800) + " конт. " + t;
}
setInterval(send, 2000);
window.start = start;
start();
