// ==UserScript==
// @name         ChessWare Loader
// @namespace    chessware.loader
// @version      1.0.0
// @description  Load ChessWare from its GitHub repository on demand.
// @author       ChessWare
// @license      GPL-3.0-or-later
// @match        https://www.chess.com/*
// @match        https://chess.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      release-assets.githubusercontent.com
// @connect      api.chess.com
// @updateURL    https://raw.githubusercontent.com/Viktor1002/ChessWare/main/ChessWare.loader.user.js
// @downloadURL  https://raw.githubusercontent.com/Viktor1002/ChessWare/main/ChessWare.loader.user.js
// @run-at       document-idle
// @sandbox      JavaScript
// @noframes
// ==/UserScript==
(() => {
  // loader/loader.css
  var loader_default = ':host{all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;color-scheme:dark;font:700 9px/15px Verdana,sans-serif;color:#b7b7b7}\n*,*::before,*::after{box-sizing:border-box} [hidden]{display:none!important}\n.loader{pointer-events:auto;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:520px;height:400px;padding:20px;background:repeating-linear-gradient(90deg,#161616 0 1px,#191919 1px 2px);border:1px solid #080808;outline:1px solid #454545;box-shadow:inset 0 0 0 3px #252525,inset 0 0 0 4px #090909,0 0 0 2px #080808;text-shadow:0 1px #000}\n.loader::before{content:"";position:absolute;left:5px;right:5px;top:5px;height:1px;background:linear-gradient(90deg,#43b8d0,#8760ad,#b95aa4,#b3b748)}\n.drag{position:absolute;left:6px;right:6px;top:7px;height:12px;cursor:move;touch-action:none}\n.products{position:absolute;left:20px;top:20px;width:272px;height:140px;border:1px solid #080808;outline:1px solid #303030;background:#222}\n.product{display:flex;align-items:center;gap:10px;min-height:40px;padding:5px 10px;background:#1b1b1b}\n.product-icon{width:28px;height:28px;flex:none;background:linear-gradient(90deg,#344255 50%,#d5ad27 50%);color:#fff;display:grid;place-items:center}\n.product-icon svg{width:25px;height:27px;filter:drop-shadow(0 1px #0005)}\n.product-name{margin:0;color:#99be35;font:700 9px/15px Verdana,sans-serif}.release-label{font-size:9px;line-height:15px;color:#b7b7b7;white-space:nowrap}\nfieldset{padding:0;margin:0;min-width:0;border:1px solid #080808;outline:1px solid #303030;background:#111}\nlegend{margin-left:9px;padding:0 3px;font:700 9px/13px Verdana,sans-serif;color:#ccc;letter-spacing:.3px}\n.options{position:absolute;left:302px;right:20px;top:16px;height:144px}\nbutton{display:block;appearance:none;border-radius:0;border:1px solid #080808;outline:1px solid #303030;background:linear-gradient(#242424,#191919);color:#c5c5c5;font:700 9px Verdana,sans-serif;text-shadow:0 1px #000;height:38px;width:160px;margin:15px auto 0;cursor:pointer;box-shadow:inset 0 0 0 1px #1b1b1b}\nbutton+button{margin-top:12px}button:hover:enabled{background:linear-gradient(#303030,#222);color:#fff}button:active:enabled{background:#191919}button:disabled{color:#666;cursor:default}button:focus-visible{outline:1px solid #99be35}\n.status{position:absolute;left:20px;right:20px;top:170px;bottom:20px}\n.log{position:absolute;left:14px;right:14px;top:6px;bottom:14px;padding:2px 0;overflow:auto;scrollbar-width:thin;scrollbar-color:#494949 #161616;background:#222;border:1px solid #080808;outline:1px solid #303030;font:700 9px/15px Verdana,sans-serif}\n.line{padding:0 12px;overflow-wrap:anywhere;min-height:15px}.line.success{color:#99be35;background:#1b1d19}.line.error{color:#ec8d80;background:#291c19}\n@media(max-width:540px){.loader{transform:translate(-50%,-50%) scale(.8)}}\n@media(max-width:430px){.loader{transform:translate(-50%,-50%) scale(.65)}}\n';

  // loader/loader.js
  var RELEASE_URL = "https://raw.githubusercontent.com/Viktor1002/ChessWare/main/release.json";
  var RELEASE_PREFIX = "https://raw.githubusercontent.com/Viktor1002/ChessWare/main/dist/";
  var MAX_BYTES = 8 * 1024 * 1024;
  function startLoader() {
    if (document.querySelector("#chessware-loader")) return;
    const host = document.createElement("div");
    host.id = "chessware-loader";
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${loader_default}</style><section class="loader" role="dialog" aria-label="ChessWare Loader" aria-modal="false">
  <div class="drag" title="Drag to move"></div><div class="products"><div class="product"><div class="product-icon" aria-hidden="true"><svg viewBox="0 0 28 30" fill="currentColor"><path d="M15 1 9 6l-5 5 2 5 6-2-5 9h17l-4-7 1-6-5-5 1-4zm-5 9 2-1-1 3zM6 25h19v4H6z"/></svg></div><div><h1 class="product-name">ChessWare</h1><div class="release-label">Connecting to GitHub\u2026</div></div></div></div>
  <fieldset class="options"><legend>Options</legend><button data-action="load" disabled>Load</button><button data-action="exit">Exit</button></fieldset>
  <fieldset class="status"><legend>Status</legend><div class="log" role="log" aria-live="polite" aria-relevant="additions"></div></fieldset></section>`;
    document.documentElement.append(host);
    const dialog = root.querySelector(".loader"), button = root.querySelector("[data-action=load]");
    const log = root.querySelector(".log"), label = root.querySelector(".release-label");
    let state = "idle", payload = null, disposed = false, progress = null;
    const requests = /* @__PURE__ */ new Set();
    function line(text, kind = "") {
      const node = document.createElement("div");
      node.className = `line ${kind}`;
      node.textContent = text;
      log.append(node);
      log.scrollTop = log.scrollHeight;
      return node;
    }
    function request(url, maxBytes, report) {
      return new Promise((resolve, reject) => {
        let handle, finished = false;
        const finish = (error, value) => {
          if (finished) return;
          finished = true;
          requests.delete(handle);
          error ? reject(error) : resolve(value);
        };
        try {
          handle = GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "arraybuffer",
            anonymous: true,
            timeout: 6e4,
            onprogress: (event) => {
              if (event.loaded > maxBytes) {
                finish(new Error("Download exceeds the size limit."));
                handle?.abort();
                return;
              }
              report?.(event.loaded, event.total);
            },
            onload: (response) => {
              if (response.status !== 200) return finish(new Error(`GitHub returned HTTP ${response.status}.`));
              if (response.finalUrl && !response.finalUrl.startsWith("https://raw.githubusercontent.com/Viktor1002/ChessWare/")) return finish(new Error("Unexpected download destination."));
              const bytes = new Uint8Array(response.response);
              if (!bytes.length || bytes.length > maxBytes) return finish(new Error("Invalid download size."));
              finish(null, bytes);
            },
            onerror: () => finish(new Error("GitHub connection failed. Check your connection and Tampermonkey permissions.")),
            ontimeout: () => finish(new Error("GitHub request timed out. Press Retry to reconnect.")),
            onabort: () => finish(new Error("Download cancelled."))
          });
          if (!finished) requests.add(handle);
        } catch (error) {
          finish(error);
        }
      });
    }
    async function connect() {
      if (disposed || state === "connecting" || state === "loaded") return;
      if (document.querySelector("#chess-skeet-root")) {
        state = "loaded";
        button.disabled = true;
        label.textContent = "Already running on this page";
        line("ChessWare is already loaded. Press Insert to open it.", "success");
        return;
      }
      state = "connecting";
      button.disabled = true;
      button.textContent = "Load";
      payload = null;
      line("Connecting to GitHub\u2026");
      label.textContent = "Connecting to GitHub\u2026";
      try {
        const manifest = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await request(RELEASE_URL, 16384)));
        if (manifest.schema !== 1 || !/^\d+\.\d+\.\d+$/.test(manifest.version) || !Number.isSafeInteger(manifest.bytes) || manifest.bytes < 1 || manifest.bytes > MAX_BYTES || !/^[a-f0-9]{64}$/.test(manifest.sha256) || typeof manifest.url !== "string" || !manifest.url.startsWith(RELEASE_PREFIX) || !/^ChessWare-[\d.]+\.protected\.user\.js$/.test(manifest.url.slice(RELEASE_PREFIX.length))) throw new Error("Invalid release manifest.");
        line("Connected");
        label.textContent = `Version ${manifest.version}`;
        line(`Added ChessWare ${manifest.version}`);
        progress = line("Downloading script\u2026");
        const bytes = await request(manifest.url, manifest.bytes, (loaded, total) => {
          progress.textContent = `Downloading script: ${Math.min(100, Math.floor(loaded / (total || manifest.bytes) * 100))}%`;
        });
        if (bytes.length !== manifest.bytes) throw new Error("Incomplete script download.");
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (value) => value.toString(16).padStart(2, "0")).join("");
        if (hash !== manifest.sha256) throw new Error("SHA-256 verification failed. Script was not executed.");
        const code = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        if (!code.startsWith("// ==UserScript==") || !code.includes("// @name         ChessWare")) throw new Error("Downloaded file is not a ChessWare userscript.");
        if (disposed) return;
        payload = code;
        state = "ready";
        progress.textContent = "Script downloaded \xB7 SHA-256 verified";
        line("Ready. Press Load to start ChessWare.", "success");
        button.disabled = false;
      } catch (error) {
        if (disposed) return;
        state = "error";
        label.textContent = "Connection unavailable";
        line(error.message, "error");
        button.textContent = "Retry";
        button.disabled = false;
      }
    }
    function load() {
      if (state === "error") {
        connect();
        return;
      }
      if (state !== "ready" || !payload) return;
      state = "loading";
      button.disabled = true;
      try {
        const run = new Function("window", "document", "location", "navigator", "localStorage", "unsafeWindow", "GM_xmlhttpRequest", "GM_registerMenuCommand", "cloneInto", payload);
        run(
          window,
          document,
          location,
          navigator,
          localStorage,
          typeof unsafeWindow === "undefined" ? window : unsafeWindow,
          GM_xmlhttpRequest,
          typeof GM_registerMenuCommand === "function" ? GM_registerMenuCommand : void 0,
          typeof cloneInto === "function" ? cloneInto : void 0
        );
        if (!document.querySelector("#chess-skeet-root")) throw new Error("ChessWare did not start.");
        payload = null;
        state = "loaded";
        label.textContent += " \xB7 loaded";
        line("ChessWare loaded. Press Insert to open the menu.", "success");
        line("Modes and automatic moves require manual activation.");
      } catch (error) {
        payload = null;
        state = "error";
        button.textContent = "Retry";
        button.disabled = false;
        line(`Load failed: ${error.message}`, "error");
      }
    }
    button.addEventListener("click", load);
    root.querySelector("[data-action=exit]").addEventListener("click", () => {
      dialog.hidden = true;
    });
    const reopen = () => {
      dialog.hidden = !dialog.hidden;
      if (!dialog.hidden && state === "error") connect();
    };
    if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand("Show / hide ChessWare Loader", reopen);
    document.addEventListener("keydown", (event) => {
      if (event.code !== "Insert" || event.repeat || document.querySelector("#chess-skeet-root") || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      event.preventDefault();
      reopen();
    });
    const drag = root.querySelector(".drag");
    let origin = null;
    drag.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = dialog.getBoundingClientRect();
      origin = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
      drag.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    drag.addEventListener("pointermove", (event) => {
      if (!origin) return;
      dialog.style.transform = "none";
      dialog.style.left = `${Math.max(0, Math.min(innerWidth - 80, origin.left + event.clientX - origin.x))}px`;
      dialog.style.top = `${Math.max(0, Math.min(innerHeight - 24, origin.top + event.clientY - origin.y))}px`;
    });
    drag.addEventListener("pointerup", () => {
      origin = null;
    });
    drag.addEventListener("pointercancel", () => {
      origin = null;
    });
    window.addEventListener("pagehide", () => {
      disposed = true;
      payload = null;
      for (const request2 of requests) request2?.abort();
      requests.clear();
    }, { once: true });
    connect();
  }
  startLoader();
})();
