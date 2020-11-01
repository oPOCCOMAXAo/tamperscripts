// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @exclude      https://ru.wotblitz.com/*tournament*
// @require      https://raw.githubusercontent.com/oPOCCOMAXAo/jslib/master/asyncxhr.js
// @grant        none
// ==/UserScript==
/*global AsyncXHR*/

function watch(url) {
  let ws = new WebSocket(url);
  let timer;
  ws.onopen = ws.send.bind(ws, "{\"operation\":\"close\"}");
  ws.onmessage = msg => {
    let t = JSON.parse(msg.data).time;
    document.title = t + " сек";
  };
  ws.onclose = () => {
    clearInterval(timer);
    watch(url);
  };
  timer = setInterval(ws.send.bind(ws, "{\"operation\":\"watching\"}"), 4500);
}

async function getToken() {
  let res = await AsyncXHR.request("POST", "https://ru.wotblitz.com/ru/api/watch-blitz/v1/user/", "{}", { "Content-Type": "application/json" });
  return res.object.token;
}

async function getStreams() {
  return (await AsyncXHR.get("https://ru.wotblitz.com/ru/api/watch-blitz/v1/streams")).object;
}

async function start() {
  // получение токена, проверка авторизации
  let token = await getToken();
  if (token == null) {
    alert("Авторизуйся и обнови");
    return;
  }

  // получение стримов, фильтр нужных
  let stream = (await getStreams()).result.filter(s => s.end_at == null)[0];
  if (stream == null) {
    alert("Сорян, стрима нет");
    return;
  }

  // просмотр стрима
  watch(`wss://watchblitz-ru.wotblitz.com/v1/groups/${stream.stream_group_id}/watch?token=${token}`);
}

window.start = start;
start().catch(console.error);
