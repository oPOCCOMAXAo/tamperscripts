// ==UserScript==
// @name         wblitz stream collector
// @namespace    http://tampermonkey.net/
// @version      0.17.2
// @description  run blitz stream
// @author       oPOCCOMAXAo
// @match        https://ru.wotblitz.com/*
// @grant        none
// ==/UserScript==
const sleep = ms => new Promise(r => setTimeout(r, ms));
const RESTART_TIME = 10000;
const localeOffset = new Date().getTimezoneOffset() * 60000;
let token;
let table;
let watches = {};

class XHRResult {
  constructor(status, text, error) {
    this.status = status;
    this.text = text;
    this.error = error;
  }

  get object() {
    let res = {};
    try {
      res = JSON.parse(this.text);
    } catch (e) {
      console.error("During parse %s occured error: ", this.text);
      console.error(e);
    }
    return res;
  }
}

class AsyncXHR {
  /**
   * @param method {string}
   * @param url {string}
   * @param data {string}
   * @param headers {object<string, string>}
   * @return {Promise<XHRResult>}
   */
  static request(method, url, data, headers) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (headers) {
      for (let a of Object.keys(headers)) {
        xhr.setRequestHeader(a, headers[a]);
      }
    }
    return new Promise(resolve => {
      xhr.onload = () => resolve(new XHRResult(xhr.status, xhr.responseText));
      xhr.onerror = (e) => resolve(new XHRResult(-1, "", e));
      xhr.send(data);
    });
  }

  static async get(url) {
    return await AsyncXHR.request("GET", url, null, {});
  }

  static async post(url, data) {
    return await AsyncXHR.request("POST", url, data, { "Content-Type": "application/x-www-form-urlencoded" });
  }

  static async postObject(url, data) {
    return await AsyncXHR.post(url, AsyncXHR.stringify(data));
  }

  static stringify(obj) {
    return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&");
  }
}

class Watch {
  /** @type {WebSocket} */
  socket = null;
  timer = null;

  constructor(id, maxTime = 86400) {
    this.id = id;
    this.maxTime = maxTime;
    this.time = 0;
  }

  _onClose = async () => {
    clearInterval(this.timer);
    if (this.socket != null) {
      await this.stop();
      if (this.time > 0) {
        await sleep(RESTART_TIME);
        this.start();
      }
    }
  };

  _onMessage = msg => {
    try {
      msg = JSON.parse(msg.data);
    } catch (e) {
      msg = {};
    }
    this.time = msg.time;
    if (msg.detail === "Invalid token") {
      this.stop(true).catch(console.error);
    } else if (this.time > this.maxTime) {
      this.stop().catch(console.error);
    }
    updateTime(this.id, this.time);
  };

  _onOpen = () => {
    this.socket.send("{\"operation\":\"close\"}");
    this.socket.send("{\"operation\":\"watching\"}");
    this.timer = setInterval(this._watchTick, 4500);
  };

  _watchTick = () => this.socket.send("{\"operation\":\"watching\"}");

  start() {
    if (this.socket != null) return;
    this.socket = new WebSocket(`wss://watchblitz-ru.wotblitz.com/v1/groups/${this.id}/watch?token=${token}`);
    this.socket.onopen = this._onOpen;
    this.socket.onmessage = this._onMessage;
    this.socket.onclose = this._onClose;
    updateControls(this.id, true);
  }

  async stop(expired = false) {
    let s = this.socket;
    this.socket = null;
    s.close();
    updateControls(this.id, false);
    if (expired && await updateToken()) {
      this.start();
    }
  }
}

function updateTime(id, time) {
  let el = document.getElementById(`time-${id}`);
  if (el) el.innerHTML = time;
}

function updateControls(id, started) {
  let el = document.getElementById(`start-${id}`);
  if (el) el.disabled = started;
  el = document.getElementById(`stop-${id}`);
  if (el) el.disabled = !started;
}

async function getToken() {
  while (true) {
    let res = await AsyncXHR.request("POST", "https://ru.wotblitz.com/ru/api/watch-blitz/v1/user/", "{}", { "Content-Type": "application/json" });
    if (res.status === 200) {
      return res.object.token;
    } else {
      await sleep(5000);
    }
  }
}

async function getStreams() {
  while (true) {
    let res = await AsyncXHR.get("https://ru.wotblitz.com/ru/api/watch-blitz/v1/streams/");
    if (res.status === 200) {
      return res.object;
    } else {
      await sleep(5000);
    }
  }
}

function makeStyle() {
  let style = document.createElement("style");
  style.innerHTML = `
#startbtn {opacity:0.7;position:fixed;top:3em;left:1em;z-index:1000;}
#startstage {background-color:white;color:black;opacity:0.7;position:fixed;top:0em;left:0em;z-index:1000;padding:0.5em;}
td, th {padding:0.2em;}
`;
  document.head.appendChild(style);
}

function makeUIstart() {
  document.body.appendChild(makeElement("div", {
    id: "startstage",
    innerHTML: "Инициализация ...",
  }));
  document.body.appendChild(makeElement("button", {
    id: "startbtn",
    innerHTML: "Start!",
    disabled: true,
  }, { click: makeUIfinal }));
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
    let { stream_group_id: id } = stream;
    row = makeElement("tr");

    row.appendChild(makeElement("td", { innerHTML: stream.title }));

    row.appendChild(makeElement("td", { innerHTML: formatDate(stream.start_at) }));

    let maxTime = Math.max(0, ...(stream.rewards.map(a => a.max_amount / a.reward_amount * a.time)));
    row.appendChild(makeElement("td", {
      id: `time-${id}`,
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

function setStage(text) {
  let el = document.getElementById("startstage");
  if (el) el.innerHTML = text;
}

/** @return {Promise<boolean>} */
async function updateToken() {
  // получение токена, проверка авторизации
  setStage("Получение токена ...");
  token = await getToken();
  if (token == null) {
    setStage("Авторизуйся и обнови");
    return false;
  }
  return true;
}

async function start() {
  makeStyle();
  makeUIstart();

  if (!await updateToken()) return;

  // получение стримов, фильтр нужных
  let streams = (await getStreams()).result.filter(s => s.end_at == null);
  if (streams.length === 0) {
    setStage("Стримов нет");
    return;
  }
  table = makeTable(streams);

  setStage("Всё готово");
  document.getElementById("startbtn").disabled = false;
}

window.start = start;
start().catch(console.error);
