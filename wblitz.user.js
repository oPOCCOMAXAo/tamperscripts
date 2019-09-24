// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://wotblitz.ru/*
// @exclude      https://wotblitz.ru/*tournament*
// @grant        none
// ==/UserScript==

let url = "wss://wotblitz.ru/tournament-season/watch/62180f0566104dfdb9caad0b1eb4f7f6/";
let ws = null;
function start(){
    ws = new WebSocket(url);
    ws.onopen = onopen;
    ws.onmessage = onmessage;
}
function send(){
    ws.send('{\"command\":\"watching\"}');
}
function onopen(){
    ws.send('{\"command\":\"close\"}');
}
function onmessage(msg){
    setTimeout(send, 1000);
    let t = JSON.parse(msg.data).data;
    document.title = Math.floor(JSON.parse(msg.data).data / 1800) + " конт. " + t;
}
window.start = start;
start();
