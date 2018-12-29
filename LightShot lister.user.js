// ==UserScript==
// @name         LightShot lister
// @version      0.1
// @description  List over LightShot screenshots
// @author       POCCOMAXA
// @match        https://prnt.sc/*
// @include      https://prnt.sc/*
// ==/UserScript==

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const max = alphabet.length;
const numerify = s => s.split("").map(a => alphabet.indexOf(a)).reverse();
const stringify = n => n.map(a => alphabet[a]).reverse().join("");
const incCurrent = n => document.location.replace("/" + stringify(add(numerify(document.location.pathname.substr(1)), n)));
function add(num, int){
    let carry = int;
    for(let a = 0; a < num.length; a++){
        let t = num[a] + carry;
        if(t < 0 || t >= max) {
            let t2 = ((t % max) + max) % max;
            carry = (t - t2) / max;
            num[a] = t2;
        } else {
            num[a] = t;
            break;
        }
    }
    return num;
}
function onkey(e){
    switch(e.keyCode){
        case 39: case 40: case 68: case 83:
            incCurrent(1);
            break;
        case 37: case 38: case 65: case 87:
            incCurrent(-1);
            break;
    }
    return false;
}
window.addEventListener("keyup", onkey, true);