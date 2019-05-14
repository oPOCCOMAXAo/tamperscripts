// ==UserScript==
// @name         LightShot lister
// @version      0.2
// @description  List over LightShot screenshots
// @author       POCCOMAXA
// @match        https://prnt.sc/*
// @include      https://prnt.sc/*
// ==/UserScript==

const incCurrent = n => document.location.replace("/" + (parseInt(document.location.pathname.substr(1), 36) + n).toString(36));
function onkey(e){
    switch(e.keyCode){
        case 39: case 40: case 68: case 83: incCurrent(1); break;
        case 37: case 38: case 65: case 87: incCurrent(-1); break;
    }
    return false;
}
window.addEventListener("keyup", onkey, true);
