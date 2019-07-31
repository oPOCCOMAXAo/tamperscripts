// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://wotblitz.ru/*
// @grant        none
// ==/UserScript==

let url = "wss://wotblitz.ru/tournament-season/watch/ccd52267c2924c5ebc365b7b3197fb73/";
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
    document.title = Math.floor(JSON.parse(msg.data).data / 60) * 500 + " " + t;
}
window.start = start;
start();
