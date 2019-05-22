// ==UserScript==
// @name         AntiSTB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuck Starlight group
// @author       oPOCCOMAXAo
// @match        https://*.stb.ua/*
// @include      https://*.stb.ua/*
// @exclude      https://*.stb.ua/vplayer/*
// ==/UserScript==
function get(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://antistb.mircloud.us/api?url=" + location.href);
    xhr.onload = () => {
        try{
            let obj = JSON.parse(xhr.responseText);
            show(obj.url, obj.name);
        } catch(e) {}
    }
    xhr.onerror = get;
    xhr.send();
}
function show(url, name){
    let a = document.createElement("a");
    a.className = "btn";
    a.innerHTML = `Открыть "${name}"`;
    a.href = url;
    a.target = "_blank";
    document.body.appendChild(a);
}
function createStyle(){
    let s = document.createElement("style");
    s.innerHTML = "a.btn{position:fixed;z-index:100000;top:2em;left:2em;padding:1em;background:black;color:white;border-radius:1em;}";
    document.head.appendChild(s);
}
get();
createStyle();
