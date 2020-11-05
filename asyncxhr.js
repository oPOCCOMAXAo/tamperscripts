"use strict";

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

/*global AsyncXHR*/
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