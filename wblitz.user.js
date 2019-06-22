// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://wotblitz.ru/*
// @grant        none
// ==/UserScript==

let url = "wss://wotblitz.ru/tournament-season/watch/88fd5f322a3743909f32de9ede94422d/";
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
