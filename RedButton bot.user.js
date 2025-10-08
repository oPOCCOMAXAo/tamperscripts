// ==UserScript==
// @name         RedButton bot
// @version      2025-10-08
// @description  Autoclicker
// @author       Wolverine
// @match        https://redbutton.gru0.dev/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gru0.dev
// @grant        none
// ==/UserScript==

async function sendClicks(clicks) {
  const response = await fetch("https://redbutton.gru0.dev/api/click", {
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
    },
    referrer: "https://redbutton.gru0.dev/",
    body: JSON.stringify({ clicks }),
    method: "POST",
    mode: "cors",
  });

  const result = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${result}`);
}

setInterval(() => sendClicks(1500), 5000);

