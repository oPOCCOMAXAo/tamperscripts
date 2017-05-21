// ==UserScript==
// @name         chillispot skip
// @namespace    http://lefterov.at.ua/
// @version      1.0
// @author       POCCOMAXA
// @match        http://192.168.182.1/*
// @include      http://192.168.182.1/*
// ==/UserScript==
var t = document.getElementById("top_menu");
if(t) t.style.visibility = 'visible';
t = document.getElementById("msg1_wait");
if(t) t.style.visibility = 'hidden';