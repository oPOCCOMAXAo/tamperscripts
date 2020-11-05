// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @require      https://raw.githubusercontent.com/oPOCCOMAXAo/jslib/master/asyncxhr.js
// @grant        none
// ==/UserScript==
/*global AsyncXHR*/
const gebi = id => document.getElementById(id);
const localeOffset = new Date().getTimezoneOffset() * 60000;
let token;
let table;
let watches = {};

class Watch {
  /** @type {WebSocket} */
  socket = null;

  constructor(id, maxTime = 86400) {
    this.id = id;
    this.maxTime = maxTime;
  }

  start() {
    if (this.socket != null) return;
    let timer;
    this.socket = new WebSocket(`wss://watchblitz-ru.wotblitz.com/v1/groups/${this.id}/watch?token=${token}`);
    this.socket.onopen = this.socket.send.bind(this.socket, "{\"operation\":\"close\"}");
    this.socket.onmessage = msg => {
      let t = JSON.parse(msg.data).time;
      updateTime(this.id, t);
      if (t > this.maxTime) {
        this.stop();
      }
    };
    this.socket.onclose = () => {
      clearInterval(timer);
      if (this.socket != null) this.start();
    };
    timer = setInterval(this.socket.send.bind(this.socket, "{\"operation\":\"watching\"}"), 4500);
    updateControls(this.id, true);
  }

  stop() {
    let s = this.socket;
    this.socket = null;
    s.close();
    updateControls(this.id, false);
  }
}

function updateTime(id, time) {
  let el = gebi(`time-${id}`);
  if (el) el.innerHTML = time;
}

function updateControls(id, started) {
  let el = gebi(`start-${id}`);
  if (el) el.disabled = started;
  el = gebi(`stop-${id}`);
  if (el) el.disabled = !started;
}

async function getToken() {
  return (await AsyncXHR.request("POST", "https://ru.wotblitz.com/ru/api/watch-blitz/v1/user/", "{}", { "Content-Type": "application/json" })).object.token;
}

async function getStreams() {
  return (await AsyncXHR.get("https://ru.wotblitz.com/ru/api/watch-blitz/v1/streams")).object;
}

function makeStyle() {
  let style = document.createElement("style");
  style.innerHTML = `
#startbtn {opacity:0.7;position:fixed;top:1em;left:1em;z-index:1000;}
td, th {padding:0.2em;}
`;
  document.head.appendChild(style);
}

function makeUIstart() {
  document.body.appendChild(makeElement("button", { id: "startbtn", innerHTML: "Start!" }, { click: makeUIfinal }));
}

function formatDate(date) {
  let d = new Date(date);
  d = new Date(d.getTime() - localeOffset);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function makeElement(tag, props, listeners) {
  let el = document.createElement(tag);
  if (props != null) {
    for (let prop in props) {
      if (props.hasOwnProperty(prop))
        el[prop] = props[prop];
    }
  }
  if (listeners != null) {
    for (let event in listeners) {
      if (listeners.hasOwnProperty(event))
        el.addEventListener(event, listeners[event]);
    }
  }
  return el;
}

function makeTable(streams) {
  let table = makeElement("table");
  let row;

  row = makeElement("tr");
  ["Название", "Дата", "Секунды", "Макс.наград", "Управление"]
    .forEach(innerHTML => row.appendChild(makeElement("th", { innerHTML })));
  table.appendChild(row);

  for (let stream of streams) {
    let id = stream.stream_group_id;
    row = makeElement("tr");

    row.appendChild(makeElement("td", { innerHTML: stream.title }));

    row.appendChild(makeElement("td", { innerHTML: formatDate(stream.start_at) }));

    let maxTime = Math.max(...(stream.rewards.map(a => a.max_amount / a.reward_amount * a.time)));
    row.appendChild(makeElement("td", {
      id: `time-${id}`,
      "data-max": maxTime,
      innerHTML: "0",
    }));

    row.appendChild(makeElement("td", { innerHTML: maxTime }));

    let cell = makeElement("td");
    let watch = new Watch(id, maxTime);
    row.appendChild(cell);
    cell.appendChild(makeElement("button", {
      id: `start-${id}`,
      innerHTML: "▶",
    }, {
      click: watch.start.bind(watch),
    }));
    cell.appendChild(makeElement("button", {
      id: `stop-${id}`,
      innerHTML: "■",
      disabled: true,
    }, {
      click: watch.stop.bind(watch),
    }));
    watches[id] = watch;

    table.appendChild(row);
  }

  return table;
}

function makeUIfinal() {
  document.body.innerHTML = "";
  document.body.appendChild(table);
  for (let w in watches) {
    watches[w].start();
  }
}

async function start() {
  // получение токена, проверка авторизации
  token = await getToken();
  if (token == null) {
    alert("Авторизуйся и обнови");
    return;
  }

  // получение стримов, фильтр нужных
  let streams = (await getStreams()).result.filter(s => s.end_at == null);
  if (streams.length === 0) {
    alert("Сорян, стримов нет");
    return;
  }
  table = makeTable(streams);

  makeStyle();
  makeUIstart();
}

window.start = start;
start().catch(console.error);
