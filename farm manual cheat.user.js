// ==UserScript==
// @name         farm manual cheat
// @namespace    farm
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://real-ferma.ru/*
// @match        http://game-wm.ru/*
// @match        http://animal-farm.su/*
// @grant        none
// ==/UserScript==

var text = "<style>.cheatwindow{position: fixed;top:1em;left:2em; opacity: 0.7;}</style>\
<div class='cheatwindow'>\
<input type='number' id='cheat_amount'><button id='cheat_convert'>Обменять деньги</button><br>\
<input type='number' id='cheat_type'><button id='cheat_buy'>Купить купон</button><br>\
<input type='number' id='cheat_id'><button id='cheat_sell'>Собрать купон</button><br>\
<button id='cheat_eat'>Поесть блины</button> <button id='cheat_lavka'>Деньги в лавку</button>\
</div>";
var el = document.createElement("div");
document.body.appendChild(el);
el.innerHTML = text;
var gebi = document.getElementById.bind(document);
function eat(n){
    $.ajax({
        type: "POST",
        url: "/ajax/blin.php",
        data: "text="+n,
        success: function(html) {
            DoMsg(html, 'success');
        }
    });
}
function convert(n){
    $.ajax({
        type: "POST",
        url: "/convert/",
        data: "amount="+n,
        success: function(html){
            location.reload();
        }
    });
}
function lavka_action(type,count,buy,n){
    $.ajax({
        type: "POST",
        url: "/lavka",
        data: "type=" + type + "&kol=" + count + (buy? "&kupiti=%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C" : "&prodati=%D0%9F%D1%80%D0%BE%D0%B4%D0%B0%D1%82%D1%8C"),
        success: function(html){
            if(buy)
                lavka_action(type,count,false,n);
            else if(n > 0)
                lavka_action(type,count,true,n-1);
            else
                location.reload();
        }
    });
}
gebi("cheat_buy").addEventListener("click", function (){
    _data("vbcoupon",gebi("cheat_type").value);
});
gebi("cheat_sell").addEventListener("click", function (){
    let id = gebi("cheat_id").value;
    for(let i = 0; i < 300; i++) _data("vpcoupon",id);
});
gebi("cheat_eat").addEventListener("click", function (){
    for(let i = 0; i < 200; i++) {eat(1);eat(2);eat(3);}
});
gebi("cheat_convert").addEventListener("click", function (){
    convert(gebi("cheat_amount").value);
});
gebi("cheat_lavka").addEventListener("click", function (){
    lavka_action("korm_3",20000,true, 100);
});