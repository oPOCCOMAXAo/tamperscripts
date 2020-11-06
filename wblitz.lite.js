const sleep = ms => new Promise(r => setTimeout(r, ms));

function request(url, data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  return new Promise(r => {
    xhr.onload = () => r({
      text: xhr.responseText,
      status: xhr.status,
    });
    xhr.onerror = () => r({
      object: {},
      status: -1,
    });
    xhr.send(data);
  });
}

async function getToken() {
  while (true) {
    let res = await request("https://ru.wotblitz.com/ru/api/watch-blitz/v1/user/", "{}");
    if (res.status === 200) {
      return JSON.parse(res.text).token;
    }
    await sleep(5000);
  }
}

async function sendToken(token) {
  while (true) {
    let res = await request("https://wbstream.mircloud.host/watch", `{"token":"${token}"}`);
    if (res.status === 200) {
      return res.text === "ok";
    }
    await sleep(5000);
  }
}

async function start() {
  // получение токена, проверка авторизации
  let token = await getToken();
  if (token == null) {
    alert("Авторизуйся и обнови");
    return;
  }

  // отправка токена
  if (await sendToken(token)) {
    alert("Всё ок, можешь закрывать вкладку");
  } else {
    alert("Что-то пошло не так, напиши в дискорд");
  }
}

start();