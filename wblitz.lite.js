function getToken() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://ru.wotblitz.com/ru/api/watch-blitz/v1/user/");
  xhr.setRequestHeader("Content-Type", "application/json");
  return new Promise(r => {
    xhr.onload = () => r(JSON.parse(xhr.responseText).token);
    xhr.send("{}");
  });
}

function sendToken(token) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://wbstream.mircloud.host/watch");
  xhr.setRequestHeader("Content-Type", "application/json");
  return new Promise(r => {
    xhr.onload = () => r(xhr.responseText == "ok");
    xhr.send(`{"token":"${token}"}`);
  });
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
    alert("Всё ок!");
  } else {
    alert("Что-то пошло не так");
  }
}

start();