// ==UserScript==
// @name               글자렌더링（스크립트）
// @name:ja            フォントレンダリング（カスタマイズ）
// @name:en            Font Rendering (Customized)
// @version            2023.08.05.1
// @author             F9y4ng
// @description       MacType을 설치할 필요 없이 브라우저에서 글꼴 렌더링을 최적화하고 모든 페이지의 글꼴을 더욱 질감 있게 만들 수 있습니다. 기본적으로 Microsoft Black이 사용되지만 기본 설정에 따라 다른 글꼴을 사용자 지정할 수 있습니다. 이 스크립트는 글꼴 재작성, 글꼴 다듬기, 글꼴 크기 조정, 글꼴 획, 글꼴 그림자, 특수 스타일 요소의 필터링 및 라이선스, 사용자 지정 아이소메트릭 글꼴 등과 같은 브라우저 글꼴 렌더링을 위한 고급 기능을 제공합니다. 스크립트는 글로벌 렌더링과 개인화된 렌더링을 지원하며, '스크립트 관리자 아이콘을 클릭'하거나 '단축키를 사용하여' 구성 인터페이스를 호출하여 구성할 수 있습니다. 이 스크립트는 대부분의 주요 브라우저 및 주요 스크립트 관리자와 호환되며 Greasemonkey 스크립트 및 브라우저 확장 프로그램과도 호환됩니다.
// @description:en     Without MacType, improve browser displaying more textured. "Microsoft Yahei" is used by default. For browser displaying, the script provides advanced features such as font rewriting, smoothing, scaling, stroke, shadow, special style elements, custom monospaced, etc. It can configure by "click Script Manager icon" or "use hotkeys" to call out the setup. The script is already compatible with major browsers and userscript managers, also commonly used Greasemonkey scripts and browser extensions.
// @namespace          https://openuserjs.org/scripts/f9y4ng/Font_Rendering_(Customized)
// @icon               https://img.icons8.com/stickers/48/font-style-formatting.png
// @homepage           https://f9y4ng.github.io/GreasyFork-Scripts/
// @homepageURL        https://f9y4ng.github.io/GreasyFork-Scripts/
// @supportURL         https://github.com/F9y4ng/GreasyFork-Scripts/issues
// @updateURL          https://github.com/F9y4ng/GreasyFork-Scripts/raw/master/Font%20Rendering.meta.js
// @downloadURL        https://github.com/F9y4ng/GreasyFork-Scripts/raw/master/Font%20Rendering.user.js
// @require            https://greasyfork.org/scripts/437214/code/frColorPicker.js?version=1193185#sha256-ZQoXdFH5rNO+dCJE6qn/AV9rUGpLvY5cLlFCzvgfKro=
// @match              *://*/*
// @grant              GM_getValue
// @grant              GM.getValue
// @grant              GM_setValue
// @grant              GM.setValue
// @grant              GM_listValues
// @grant              GM.listValues
// @grant              GM_deleteValue
// @grant              GM.deleteValue
// @grant              GM_openInTab
// @grant              GM.openInTab
// @grant              GM_registerMenuCommand
// @grant              GM.registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @compatible         edge 兼容Tampermonkey, Violentmonkey
// @compatible         Chrome 兼容Tampermonkey, Violentmonkey
// @compatible         Firefox 兼容Greasemonkey, Tampermonkey, Violentmonkey
// @compatible         Opera 兼容Tampermonkey, Violentmonkey
// @compatible         Safari 兼容Tampermonkey, Userscripts
// @license            GPL-3.0-only
// @create             2020-11-24
// @copyright          2020-2023, F9y4ng
// @run-at             document-start
// ==/UserScript==

/* jshint esversion: 11 */

~(function (w) {
  "use strict";

  /**
   * LICENSE FOR OPEN SOURCE USE: GPLv3.
   * CUSTOM SCRIPT DEBUGGING, DO NOT TURN ON FOR DAILY USE.
   * SET TO "TRUE" FOR SCRIPT DEBUGGING, MAY CAUSE THE SCRIPT TO RUN SLOWLY.
   * THE SETTING VALUE TYPE MUST BE BOOLEAN, FALSE BY DEFAULT.
   */

  const IS_OPEN_DEBUG = false;

  /* PERFECTLY COMPATIBLE FOR GREASEMONKEY, TAMPERMONKEY, VIOLENTMONKEY, USERSCRIPTS 2023-04-08 F9Y4NG */

  const GMinfo = GM_info;
  const GMversion = GMinfo.version ?? GMinfo.scriptHandlerVersion ?? "unknown";
  const GMscriptHandler = GMinfo.scriptHandler;
  const GMsetValue = gmSelector("setValue");
  const GMgetValue = gmSelector("getValue");
  const GMdeleteValue = gmSelector("deleteValue");
  const GMlistValues = gmSelector("listValues");
  const GMopenInTab = gmSelector("openInTab");
  const GMregisterMenuCommand = gmSelector("registerMenuCommand");
  const GMunregisterMenuCommand = gmSelector("unregisterMenuCommand");
  const GMunsafeWindow = gmSelector("unsafeWindow");
  const GMcontentMode = gmSelector("contentMode");

  /* INITIALIZE_DEBUG_FUNCTIONS */

  const IS_DEBUG = setDebuggerMode() || IS_OPEN_DEBUG;

  const DEBUG = IS_DEBUG ? __console.bind(console, "log") : () => {};
  const INFO = IS_DEBUG ? __console.bind(console, "info") : () => {};
  const ERROR = IS_DEBUG ? __console.bind(console, "error") : () => {};
  const COUNT = IS_DEBUG ? __console.bind(console, "count") : () => {};

  /* INITIALIZE_COMMON_CONSTANTS */

  const def = {
    array: { exps: [], values: [], scaleMatrix: [], props: { Window: [], Element: [], HTMLElement: [] } },
    count: { domainCount: 0, clickTimer: 0, exsiteSearch: 0, domainSearch: 0 },
    const: {
      ft: parseFloat(1000 / 60),
      seed: generateRandomString(6, "mix"),
      raf: `__FR_rAF_${generateRandomString(24, "attr")}`,
      caf: `__FR_cAF_${generateRandomString(24, "attr")}`,
      boldAttrName: `fr-fix-${generateRandomString(8, "attr")}`,
      cssAttrName: `fr-css-${generateRandomString(8, "attr")}`,
      frameAttrName: `fr-frames-${generateRandomString(8, "attr")}`,
      gfHost: decrypt("aHR0cHMlM0ElMkYlMkZncmVhc3lmb3JrLm9yZyUyRnNjcmlwdHMlMkY0MTY2ODg="),
      defaultFont: decrypt("JUU3JUJEJTkxJUU3JUFCJTk5JUU5JUJCJTk4JUU4JUFFJUE0JUU1JUFEJTk3JUU0JUJEJTkz"),
      fontlistImg: decrypt("aHR0cHMlM0ElMkYlMkZzMS5heDF4LmNvbSUyRjIwMjIlMkYwNCUyRjAyJTJGcW9SZldkLmdpZg=="),
      loadImg: decrypt("aHR0cHMlM0ElMkYlMkZpbWcuemNvb2wuY24lMkZjb21tdW5pdHklMkYwMzhkZGU0NThmOWE4NzRhODAxMjE2MGY3NDE3ZjZlLmdpZg=="),
      exQueryString: `html,head,head *,base,meta,style,link,script,noscript,iframe,img,br,hr,map,area,canvas,svg,svg *,defs,symbol,g,path,polygon,polyline,rect,ellipse,circle,line,text,tspan,tref,textpath,lineargradient,radialgradient,use,images,clippath,mask,pattern,filter,stop,picture,form,object,param,embed,audio,video,source,track,progress,fr-colorpicker,fr-colorpicker *,fr-configure,fr-configure *,fr-dialogbox,fr-dialogbox *,gb-notice,gb-notice *`,
    },
    variable: {
      undefined: void 0,
      prototype: {
        getScreenCTM: SVGGraphicsElement.prototype.getScreenCTM,
        getClientRects: Element.prototype.getClientRects,
        getBoundingClientRect: Element.prototype.getBoundingClientRect,
      },
      feedback: getMetaValue("supportURL") ?? "",
      curVersion: getMetaValue("version") ?? GMinfo.script.version ?? "2023.08.05.0",
      scriptAuthor: getMetaValue("author") ?? GMinfo.script.author ?? "F9y4ng",
      scriptName: getMetaValue(`name:${navigator.language ?? "zh-CN"}`) ?? GMinfo.script.name ?? "Font Rendering",
    },
    dialog: {
      alert: alert.bind(w),
      prompt: prompt.bind(w),
      confirm: confirm.bind(w),
    },
    class: {
      guide: generateRandomString(6, "mix"),
      title: generateRandomString(8, "char"),
      rotation: generateRandomString(7, "char"),
      emoji: generateRandomString(7, "mix"),
      main: generateRandomString(8, "char"),
      fontList: generateRandomString(8, "char"),
      spanlabel: generateRandomString(6, "mix"),
      label: generateRandomString(6, "mix"),
      placeholder: generateRandomString(6, "mix"),
      checkbox: generateRandomString(8, "char"),
      flex: generateRandomString(9, "char"),
      tooltip: generateRandomString(8, "char"),
      tooltiptext: generateRandomString(9, "char"),
      ps1: generateRandomString(6, "mix"),
      ps2: generateRandomString(6, "mix"),
      ps3: generateRandomString(6, "mix"),
      ps4: generateRandomString(6, "mix"),
      ps5: generateRandomString(6, "mix"),
      slider: generateRandomString(8, "char"),
      frColorPicker: generateRandomString(9, "char"),
      readonly: generateRandomString(8, "char"),
      notreadonly: generateRandomString(8, "char"),
      reset: generateRandomString(7, "mix"),
      cancel: generateRandomString(7, "mix"),
      submit: generateRandomString(7, "mix"),
      selector: generateRandomString(9, "char"),
      selectFontId: generateRandomString(8, "char"),
      close: generateRandomString(7, "char"),
      db: generateRandomString(10, "char"),
      dbbc: generateRandomString(9, "char"),
      dbb: generateRandomString(8, "char"),
      dbm: generateRandomString(8, "char"),
      dbt: generateRandomString(8, "char"),
      dbbt: generateRandomString(7, "mix"),
      dbbf: generateRandomString(7, "mix"),
      dbbn: generateRandomString(7, "mix"),
      switch: generateRandomString(6, "mix"),
      anim: generateRandomString(6, "mix"),
      range: generateRandomString(10, "char"),
      rangeProgress: generateRandomString(9, "mix"),
    },
    id: {
      rndStyle: generateRandomString(12, "char"),
      configure: generateRandomString(12, "char"),
      dialogbox: generateRandomString(12, "char"),
      container: generateRandomString(10, "char"),
      field: generateRandomString(10, "char"),
      fontList: generateRandomString(8, "char"),
      fontFace: generateRandomString(8, "char"),
      fontSmooth: generateRandomString(8, "char"),
      fontStroke: generateRandomString(8, "char"),
      fontShadow: generateRandomString(8, "char"),
      shadowColor: generateRandomString(8, "char"),
      fontCss: generateRandomString(8, "char"),
      fontEx: generateRandomString(8, "char"),
      submit: generateRandomString(8, "char"),
      fface: generateRandomString(8, "char"),
      smooth: generateRandomString(8, "char"),
      fontSize: generateRandomString(8, "char"),
      fontScale: generateRandomString(8, "char"),
      scaleSize: generateRandomString(8, "char"),
      fviewport: generateRandomString(8, "mix"),
      fixViewport: generateRandomString(8, "mix"),
      strokeSize: generateRandomString(8, "mix"),
      stroke: generateRandomString(8, "char"),
      fstroke: generateRandomString(8, "mix"),
      fixStroke: generateRandomString(8, "mix"),
      shadowSize: generateRandomString(8, "mix"),
      shadow: generateRandomString(8, "char"),
      color: generateRandomString(8, "char"),
      cssinclued: generateRandomString(8, "char"),
      cssexclude: generateRandomString(8, "char"),
      mono: generateRandomString(8, "char"),
      cm: generateRandomString(8, "mix"),
      iscusmono: generateRandomString(6, "char"),
      selector: generateRandomString(8, "char"),
      cleaner: generateRandomString(6, "char"),
      fonttooltip: generateRandomString(9, "char"),
      fontName: generateRandomString(8, "char"),
      cSwitch: generateRandomString(6, "mix"),
      eSwitch: generateRandomString(6, "mix"),
      backup: generateRandomString(8, "char"),
      files: generateRandomString(6, "char"),
      tfiles: generateRandomString(7, "mix"),
      db: generateRandomString(6, "char"),
      ct: generateRandomString(6, "char"),
      isclosetip: generateRandomString(7, "mix"),
      bk: generateRandomString(6, "char"),
      isbackup: generateRandomString(7, "mix"),
      pv: generateRandomString(6, "char"),
      ispreview: generateRandomString(7, "mix"),
      fs: generateRandomString(6, "char"),
      isfontsize: generateRandomString(7, "mix"),
      fvp: generateRandomString(6, "char"),
      isfixviewport: generateRandomString(7, "mix"),
      hk: generateRandomString(6, "char"),
      ishotkey: generateRandomString(7, "mix"),
      mps: generateRandomString(6, "char"),
      maxps: generateRandomString(7, "mix"),
      gc: generateRandomString(6, "char"),
      globaldisable: generateRandomString(7, "char"),
      feedback: generateRandomString(7, "char"),
      flc: generateRandomString(6, "char"),
      flcid: generateRandomString(7, "mix"),
    },
  };

  if (checkRedundantScript(GMunsafeWindow)) return;

  /* INITIALIZE_SETTIMEOUT_AND_SETINTERVAL_FUNCTION_CLASSES */

  class RAF {
    constructor(global) {
      this.timerMap = { timeout: {}, interval: {} };
      this.setTimeout = this.setTimeout.bind(this);
      this.global = global;
      registerWindowsProperties();
    }
    _ticking(fn, type, interval, lastTime = Date.now()) {
      const timerSymbol = Symbol(type);
      const step = () => {
        this._setTimerMap(timerSymbol, type, step);
        if (interval < def.const.ft || Date.now() - lastTime >= interval) {
          typeof fn === "function" && fn();
          if (type === "interval") {
            lastTime = Date.now();
          } else {
            this.clearTimeout(timerSymbol);
          }
        }
      };
      this._setTimerMap(timerSymbol, type, step);
      return timerSymbol;
    }
    _setTimerMap(timerSymbol, type, step) {
      this.timerMap[type][timerSymbol] = this.global[def.const.raf](step);
    }
    setTimeout(fn, interval) {
      return this._ticking(fn, "timeout", interval);
    }
    clearTimeout(timer) {
      this.global[def.const.caf](this.timerMap.timeout[timer]);
      delete this.timerMap.timeout[timer];
    }
    setInterval(fn, interval) {
      return this._ticking(fn, "interval", interval);
    }
    clearInterval(timer) {
      this.global[def.const.caf](this.timerMap.interval[timer]);
      delete this.timerMap.interval[timer];
    }
  }

  const raf = new RAF(w);

  /* GLOBAL_GENERAL_FUNCTIONS */

  function gmSelector(rec) {
    const gmFunctions = {
      setValue: typeof GM_setValue !== "undefined" ? GM_setValue : GM?.setValue ?? localStorage.setItem.bind(localStorage),
      getValue: typeof GM_getValue !== "undefined" ? GM_getValue : GM?.getValue ?? localStorage.getItem.bind(localStorage),
      deleteValue: typeof GM_deleteValue !== "undefined" ? GM_deleteValue : GM?.deleteValue ?? localStorage.removeItem.bind(localStorage),
      listValues: typeof GM_listValues !== "undefined" ? GM_listValues : GM?.listValues ?? (() => []),
      openInTab: typeof GM_openInTab !== "undefined" ? GM_openInTab : GM?.openInTab ?? w.open,
      registerMenuCommand: typeof GM_registerMenuCommand !== "undefined" ? GM_registerMenuCommand : GM?.registerMenuCommand ?? (() => []),
      unregisterMenuCommand: typeof GM_unregisterMenuCommand !== "undefined" ? GM_unregisterMenuCommand : GM?.unregisterMenuCommand ?? (() => []),
      unsafeWindow: typeof unsafeWindow !== "undefined" ? unsafeWindow : w,
      contentMode: GMinfo.injectInto === "content" || GMinfo.script["inject-into"] === "content" || ["dom", "js"].includes(GMinfo.sandboxMode),
    };
    return gmFunctions[rec] ?? (() => {});
  }

  function __console(act) {
    const __this = console;
    const __arguments = [...arguments];
    const [argm = "", ...args] = __arguments.slice(1);
    switch (__arguments[0]) {
      case "log":
        __this[act](`%c\u27A4 %c${argm}`, "display:inline-block", "font-family:monospace", ...args);
        break;
      case "info":
        __this.log(`%c\u27A4 ${argm}`, "display:inline-block;padding:4px 0", ...args);
        break;
      case "error":
      case "warn":
        __this[act](`%c\ud83d\udea9 ${argm}`, "display:inline-block;font-family:monospace", ...args);
        break;
      case "count":
        __this[act](`\u27A4 ${argm}`);
        break;
      default:
        __this.log(argm, ...args);
        break;
    }
  }

  function registerWindowsProperties() {
    // REGISTER RAF
    w[def.const.raf] =
      w.requestAnimationFrame ||
      w.webkitRequestAnimationFrame ||
      w.mozRequestAnimationFrame ||
      w.oRequestAnimationFrame ||
      (function () {
        const delay = def.const.ft;
        const animationStartTime = Date.now();
        let previousCallTime = animationStartTime;
        return function requestAnimationFrame(callback) {
          const requestTime = Date.now();
          const timeout = Math.max(0, delay - (requestTime - previousCallTime));
          const timeToCall = requestTime + timeout;
          previousCallTime = timeToCall;
          return setTimeout(function onAnimationFrame() {
            callback(timeToCall - animationStartTime);
          }, timeout);
        };
      })();
    // REGISTER CAF
    w[def.const.caf] =
      w.cancelAnimationFrame ||
      w.webkitCancelAnimationFrame ||
      w.mozCancelAnimationFrame ||
      w.oCancelAnimationFrame ||
      w.cancelRequestAnimationFrame ||
      w.webkitCancelRequestAnimationFrame ||
      w.mozCancelRequestAnimationFrame ||
      w.oCancelRequestAnimationFrame ||
      function cancelAnimationFrame(id) {
        clearTimeout(id);
      };
    // REGISTER UNSAFEWINDOW RAF/CAF
    GMunsafeWindow[def.const.raf] = w[def.const.raf];
    GMunsafeWindow[def.const.caf] = w[def.const.caf];
    // REGISTER PUSHSTATE/REPLACESTATE
    history.pushState = wrapHistory("pushState");
    history.replaceState = wrapHistory("replaceState");

    function wrapHistory(type) {
      const original = history[type];
      const event = new Event(type);
      return function () {
        const fn = original.apply(this, arguments);
        event.arguments = arguments;
        w.dispatchEvent(event);
        return fn;
      };
    }
  }

  function qS(expr, target = document) {
    try {
      if (/^#[\w:-]+$/.test(expr)) return target.getElementById(expr.slice(1));
      return target.querySelector(expr);
    } catch (e) {
      return null;
    }
  }

  function qA(expr, target = document) {
    try {
      return Array.prototype.slice.call(target.querySelectorAll(expr), 0);
    } catch (e) {
      return [];
    }
  }

  function cE(nodeName) {
    return document.createElement(nodeName);
  }

  function aS(target) {
    return target.attachShadow({ mode: "open" });
  }

  function gS(target, value = null, opt = null) {
    if (value) {
      return w.getComputedStyle(target, opt).getPropertyValue(value);
    } else {
      return w.getComputedStyle(target, opt);
    }
  }

  function random(range, type = "round") {
    return Math[type]((w.crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * range);
  }

  function unescape(input) {
    input = input?.toString() ?? "";
    if (input.search("%") === -1) return input;
    let output = "";
    const hexDigits = "0123456789ABCDEF";
    for (let i = 0, len = input.length; i < len; i++) {
      let char = input[i];
      if (char === "%") {
        if (
          i <= len - 6 &&
          input[i + 1] === "u" &&
          hexDigits.includes(input[i + 2]) &&
          hexDigits.includes(input[i + 3]) &&
          hexDigits.includes(input[i + 4]) &&
          hexDigits.includes(input[i + 5])
        ) {
          char = String.fromCharCode(parseInt(input.substring(i + 2, i + 7), 16));
          i += 5;
        } else if (i <= len - 3 && hexDigits.includes(input[i + 1]) && hexDigits.includes(input[i + 2])) {
          char = decodeURIComponent(input.substring(i, i + 3));
          i += 2;
        }
      }
      output += char;
    }
    return output;
  }

  function uniq(array) {
    if (!Array.isArray(array)) return [];
    return Array.from(new Set(array)).filter(Boolean);
  }

  function capitalize(string) {
    string = String(string ?? "").toLowerCase();
    return string.replace(/\b[a-z]|\s[a-z]/g, str => str.toUpperCase());
  }

  function getNodeName(node) {
    return node?.nodeName?.toLowerCase() ?? "";
  }

  function encrypt(string) {
    if (typeof string !== "string") return "";
    return btoa(encodeURIComponent(string));
  }

  function decrypt(string) {
    if (typeof string !== "string") return "";
    return decodeURIComponent(atob(string.replace(/[^A-Za-z0-9+/=]/g, "")));
  }

  function compareArray(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
    return (
      array1.length === array2.length &&
      array1.sort().every(function (element, index) {
        return element === array2.sort()[index];
      })
    );
  }

  function generateRandomString(length, type) {
    const digits = "0123456789";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let characters = upperCaseLetters;
    let prefix = "";
    let randomString = "";
    switch (type) {
      case "mix":
        characters = lowerCaseLetters + digits + upperCaseLetters;
        prefix = upperCaseLetters[random(upperCaseLetters.length, "floor")];
        length--;
        break;
      case "char":
        characters = lowerCaseLetters + upperCaseLetters;
        break;
      case "digit":
        characters = digits;
        break;
      case "attr":
        characters = digits + lowerCaseLetters.slice(0, 6);
        break;
    }
    for (let i = length; i > 0; i--) {
      randomString += characters[random(characters.length, "floor")];
    }
    return prefix + randomString;
  }

  function createTrustedTypePolicy() {
    const policy = { createHTML: string => string };
    if (!w.trustedTypes?.createPolicy) return policy;
    const currentHostName = location.hostname;
    const whiteList = new Set([
      { host: "teams.live.com", policy: "goog#html" },
      { host: "github.dev", policy: "safeInnerHtml" },
      { host: "vscode.dev", policy: "safeInnerHtml" },
    ]);
    let policyName = "fr#safeCreateHTML";
    for (const item of whiteList) {
      if (currentHostName.endsWith(item.host)) {
        policyName = item.policy;
        break;
      }
    }
    return w.trustedTypes.createPolicy(policyName, policy);
  }

  function getMainStyleElements({ currentScope, target } = {}) {
    return currentScope ? qS(`#${def.id.rndStyle}`) : qA("style[id]", target ?? document.head).filter(item => item.attributes[0]?.name.startsWith("fr-css-"));
  }

  function checkRedundantScript(global) {
    const { isTop: CUR_WINDOW_TOP } = getLocationInfo();
    // PAGE_MODE
    const redundantScripts = global["fr-init-redundantcheck"];
    if (redundantScripts === true) return scriptRedundancyWarning();
    global["fr-init-redundantcheck"] = true;
    // CONTENT_MODE
    if (GMcontentMode) {
      const redundantScriptsInfo = document.documentElement?.getAttribute("fr-init-redundantcheck");
      if (redundantScriptsInfo === "true") {
        document.documentElement?.removeAttribute("fr-init-redundantcheck");
        return scriptRedundancyWarning();
      }
      CUR_WINDOW_TOP &&
        __console("warn", `${def.variable.scriptName}警告：\r\n스크립트의 주입 모드가 다음과 같이 설정됨"content"，프레임 화면의 일부 함수가 유효하지 않고 글꼴 크기 조정 후 좌표를 전역적으로 수정할 수 없는 등 스크립트 기능 중 일부가 제한됩니다.`);
    }
    document.documentElement?.setAttribute("fr-init-redundantcheck", true);
    return false;

    function scriptRedundancyWarning() {
      if (CUR_WINDOW_TOP) {
        __console("error", `\ud83d\udea9 [Redundant Scripts]:\r\n중복 설치된 스크립트 발견：${def.variable.scriptName}，새로 고친 후에도 문제가 지속되면，방문하세요 ${def.variable.feedback}/117 오류확인。`);
        GMregisterMenuCommand("\ufff8\ud83d\uded1 중복 설치된 스크립트 발견, 문제 해결을 클릭하세요.！", () => {
          GMopenInTab(`${def.variable.feedback}/117`, false);
          location.reload();
        });
      }
      return true;
    }
  }

  function getNavigatorInfo() {
    const certificate = `${GMscriptHandler} ${GMversion}`;
    const vmuad = (uad => {
      if (!uad) return;
      const archs = uad.arch?.split("-") ?? [];
      return {
        brands: [{ brand: capitalize(uad.browserName), version: uad.browserVersion }],
        platform: capitalize(uad.os),
        bitness: archs[1] ?? "unknown",
        architecture: archs[0] ?? "unknown",
        credit: certificate,
      };
    })(GMinfo.platform);
    const tmuad = (uad => {
      if (!uad) return;
      uad.credit = certificate;
      return uad;
    })(GMinfo.userAgentData);
    const uad = vmuad ?? tmuad ?? navigator.userAgentData;
    const trustengine = w.webkitRequestFileSystem ? "Blink" : !isNaN(parseFloat(w.mozInnerScreenX)) ? "Gecko" : w.GestureEvent ? "WebKit" : "Unknown";
    let engine = "Unknown";
    let brand = "Unknown";
    let brandversion = "0.00";
    if (uad) {
      const os = capitalize(uad.platform);
      const brandMap = {
        IE: { engine: "Trident", brand: "IE" },
        SAFARI: { engine: "WebKit", brand: "Safari" },
        FIREFOX: { engine: "Gecko", brand: "Firefox" },
        EDGE: { engine: "Blink", brand: "Edge" },
        CHROME: { engine: "Blink", brand: "Chrome" },
        OPERA: { engine: "Blink", brand: "Opera" },
        BRAVE: { engine: "Blink", brand: "Brave" },
        YANDEX: { engine: "Blink", brand: "Yandex" },
        "MICROSOFT EDGE": { engine: "Blink", brand: "Edge" },
        "GOOGLE CHROME": { engine: "Blink", brand: "Chrome" },
      };
      uad.brands.some(b => {
        const reqBrand = b.brand.toUpperCase();
        const brandInfo = brandMap[reqBrand];
        if (brandInfo) {
          engine = brandInfo.engine;
          brand = brandInfo.brand;
          brandversion = b.version;
          return true;
        } else if (reqBrand === "CHROMIUM") {
          engine = "Blink";
          brand = "Chromium";
          brandversion = b.version;
        }
      });
      return { engine, brand, brandversion, os, "trust-engine": trustengine, credit: uad.credit ?? null };
    } else {
      const ua = navigator.userAgent;
      let nameOffset, verOffset, ix;
      if ((verOffset = ua.indexOf("OPR")) !== -1) {
        brand = "Opera";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 4);
        if ((verOffset = ua.indexOf("Version")) !== -1) brandversion = ua.substring(verOffset + 8);
      } else if ((verOffset = ua.indexOf("UBrowser")) !== -1) {
        brand = "UCBrowser";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 9);
      } else if ((verOffset = ua.indexOf("YaBrowser")) !== -1) {
        brand = "Yandex";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 10);
      } else if ((verOffset = ua.indexOf("Brave")) !== -1) {
        brand = "Brave";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 6);
      } else if ((verOffset = ua.indexOf("Edg")) !== -1) {
        brand = "Edge";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 4);
      } else if ((verOffset = ua.indexOf("Chromium")) !== -1) {
        brand = "Chromium";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 9);
      } else if ((verOffset = ua.indexOf("Maxthon")) !== -1) {
        brand = "Maxthon";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 8);
      } else if ((verOffset = ua.indexOf("Chrome")) !== -1) {
        brand = "Chrome";
        engine = "Blink";
        brandversion = ua.substring(verOffset + 7);
      } else if ((verOffset = ua.indexOf("Safari")) !== -1) {
        brand = "Safari";
        engine = "WebKit";
        brandversion = ua.substring(verOffset + 7);
        if ((verOffset = ua.indexOf("Version")) !== -1) brandversion = ua.substring(verOffset + 8);
      } else if ((verOffset = ua.indexOf("Waterfox")) !== -1) {
        brand = "Waterfox";
        engine = "Gecko";
        brandversion = ua.substring(verOffset + 9);
      } else if ((verOffset = ua.indexOf("Firefox")) !== -1) {
        brand = "Firefox";
        engine = "Gecko";
        brandversion = ua.substring(verOffset + 8);
      } else if ((verOffset = ua.indexOf("Trident")) !== -1) {
        brand = "IE";
        engine = "Trident";
        brandversion = String(parseFloat(ua.substring(ua.indexOf("MSIE") + 5)) || parseFloat(ua.substring(ua.indexOf("rv") + 3)));
      } else if ((nameOffset = ua.lastIndexOf(" ") + 1) < (verOffset = ua.lastIndexOf("/"))) {
        brand = ua.substring(nameOffset, verOffset);
        engine = trustengine;
        brandversion = ua.substring(verOffset + 1);
        if (brand.toLowerCase() === brand.toUpperCase()) {
          brand = navigator.appName;
        }
      }
      if ((ix = brandversion.indexOf(";")) !== -1) brandversion = brandversion.substring(0, ix);
      if ((ix = brandversion.indexOf(" ")) !== -1) brandversion = brandversion.substring(0, ix);
      let os = "Unknown";
      if (ua.indexOf("Win") !== -1) os = "Windows";
      if (ua.indexOf("Mac") !== -1) os = "MacOS";
      if (ua.indexOf("Linux") !== -1) os = "Linux";
      if (ua.indexOf("Android") !== -1) os = "Android";
      if (ua.indexOf("like Mac") !== -1) os = "iOS";
      return { engine, brand, brandversion, os, "trust-engine": trustengine, credit: null };
    }
  }

  function getLocationInfo() {
    const { pathname: cPN, hostname: cHN, protocol: cP } = location;
    const isTop = self === top;
    const pHN = parent !== self ? getParentHost() : cHN;
    return { cHN, cPN, cP, pHN, isTop };

    function getParentHost() {
      try {
        return parent.location.hostname;
      } catch (e) {
        return new URL(document.referrer || location).hostname;
      }
    }
  }

  function getMetaValue(str) {
    const queryReg = new RegExp(`//\\s+@${str}\\s+(.+)`);
    const metaValue = (GMinfo.scriptMetaStr || GMinfo.scriptSource)?.match(queryReg);
    return metaValue?.[1];
  }

  function setDebuggerMode() {
    return new URLSearchParams(location.search).get("whoami") === (getMetaValue("author") ?? GMinfo.script.author);
  }

  function sleep(delay, { useCachedSetTimeout } = {}) {
    const timeoutFunction = useCachedSetTimeout ? setTimeout : raf.setTimeout;
    const sleepPromise = new Promise(resolve => {
      timeoutFunction(resolve, delay);
    });
    const promiseFunction = value => sleepPromise.then(() => value);
    promiseFunction.then = (...args) => sleepPromise.then(...args);
    promiseFunction.catch = Promise.resolve().catch;
    return promiseFunction;
  }

  function deBounce({ fn, delay, timer, immed, once } = {}) {
    if (typeof fn !== "function") return;
    let caller = 0;
    const threshold = Number(Boolean(immed));
    return function () {
      const context = this;
      const args = arguments;
      if (once === true) {
        if (!def.count[timer]) {
          def.count[timer] = true;
          fn.apply(context, args);
        }
      } else {
        if (typeof def.count[timer] === "undefined") {
          immed === true && fn.apply(context, args);
        } else {
          raf.clearTimeout(def.count[timer]);
          caller++;
        }
        def.count[timer] = raf.setTimeout(() => {
          caller >= threshold && fn.apply(context, args);
          delete def.count[timer];
          caller = null;
        }, delay);
      }
    };
  }

  function safeRemove(expr, scope) {
    let removedNodes = [];
    let pendingNodes = [];
    switch (typeof expr) {
      case "string":
        pendingNodes = qA(expr, scope);
        pendingNodes.forEach(item => removeNode(item));
        break;
      case "object":
        if (expr instanceof Element) {
          pendingNodes.push(expr);
          removeNode(expr);
        }
        break;
    }
    return compareArray(removedNodes, pendingNodes);

    function removeNode(item) {
      try {
        removedNodes.push(item.parentNode.removeChild(item));
      } catch (e) {
        removedNodes.push(item);
        item.remove();
      }
    }
  }

  function convertToUnicode(str) {
    if (typeof str !== "string") return "";
    let ret = "";
    for (let i = 0, l = str.length; i < l; i++) {
      ret += `\\${("00" + str.charCodeAt(i).toString(16)).slice(-4)}`;
    }
    return ret.toUpperCase();
  }

  function debugOnce(name, ...logs) {
    deBounce({ fn: DEBUG, timer: name, once: true })(...logs);
  }

  /* ENVIRONMENT_VARIABLE_PREPROCESSING */

  ~(async function (tTP, requestEnvironmentConstants) {
    "use strict";

    const SET_BOOL_FOR_UPDATE = true; // DON'T TOUCH IT! MUST BE BOOLEAN TYPE. RECONSTRUCTION DATE: 2023.04.08

    const { navigatorInfo, locationInfo } = requestEnvironmentConstants();
    const { engine, brand, brandversion, os, "trust-engine": trustengine, credit } = navigatorInfo;
    const { cHN: CUR_HOST_NAME, cPN: CUR_HOST_PATH, cP: CUR_PROTOCOL, pHN: TOP_HOST_NAME, isTop: CUR_WINDOW_TOP } = locationInfo;

    const IS_REAL_BLINK = trustengine === "Blink";
    const IS_REAL_GECKO = trustengine === "Gecko";
    const IS_REAL_WEBKIT = trustengine === "WebKit";
    const IS_CHEAT_UA = !credit && (engine !== trustengine || checkBlinkCheatingUA());
    const IS_IN_FRAMES = CUR_WINDOW_TOP ? "" : "[FRAMES]";
    const IS_GREASEMONKEY = GMscriptHandler === "Greasemonkey";
    const IS_INTERNALSTYLE_ALLOWED = await isInternalStyleAllowed(10);
    const CAN_I_USE = detectBrowserCompatibility();

    /* CUSTOMIZE_UPDATE_PROMPT_INFORMATION */

    const UPDATE_VERSION_NOTICE = String(
      `<li class="${def.const.seed}_fix">优化第三方Emoji字体图标与系统字体图标的优先级。</li>
        <li class="${def.const.seed}_fix">修正在content-context模式下冗余脚本检测的错误。</li>
        <li class="${def.const.seed}_fix">修复粗体修正功能在:hover样式下无法触发的问题。</li>
        <li class="${def.const.seed}_fix">修正一些已知的问题，优化样式，优化代码。</li>`
    );

    /* INITIALIZE_FONT_LIBRARY */

    const fontCheck = new Set([
      { ch: "微软雅黑", en: "Microsoft YaHei UI", ps: "MicrosoftYaHeiUI" },
      { ch: "微軟正黑體", en: "Microsoft JhengHei", ps: "MicrosoftJhengHeiRegular" },
      { ch: "苹方-简", en: "PingFang SC", ps: "PingFangSC-Regular" },
      { ch: "蘋方-繁", en: "PingFang TC", ps: "PingFangTC-Regular" },
      { ch: "蘋方-港", en: "PingFang HK", ps: "PingFangHK-Regular" },
      { ch: "更纱黑体 SC", en: "Sarasa Gothic SC", ps: "Sarasa-Gothic-SC-Regular" },
      { ch: "更紗黑體 TC", en: "Sarasa Gothic TC", ps: "Sarasa-Gothic-TC-Regular" },
      { ch: "冬青黑体简", en: "Hiragino Sans GB", ps: "HiraginoSansGB-Regular" },
      { ch: "兰亭黑-简", en: "Lantinghei SC", ps: "FZLTTHK--GBK1-0" },
      { ch: "OPPOSans", en: "OPPOSans", ps: "OPPOSans-R" },
      { ch: "霞鹜文楷", en: "LXGW WenKai", ps: "LXGWWenKai-Regular" },
      { ch: "鸿蒙黑体", en: "HarmonyOS Sans SC", ps: "HarmonyOS_Sans_SC" },
      { ch: "浪漫雅圆", en: "LMYY", ps: "浪漫雅圆" },
      { ch: "思源黑体", en: "Source Han Sans SC", ps: "SourceHanSansSC-Regular" },
      { ch: "思源宋体", en: "Source Han Serif SC", ps: "SourceHanSerifSC-Regular" },
      { ch: "汉仪旗黑", en: "HYQiHei", ps: "HYQiHei-EES" },
      { ch: "文泉驿微米黑", en: "WenQuanYi Micro Hei", ps: "WenQuanYiMicroHei" },
      { ch: "文泉驿正黑", en: "WenQuanYi Zen Hei", ps: "WenQuanYiZenHei" },
      { ch: "方正舒体", en: "FZShuTi", ps: "FZSTK--GBK1-0" },
      { ch: "方正姚体", en: "FZYaoti", ps: "FZYTK--GBK1-0" },
      { ch: "华文仿宋", en: "STFangsong", ps: "STFangsong" },
      { ch: "华文楷体", en: "STKaiti", ps: "STKaiti" },
      { ch: "华文细黑", en: "STXihei", ps: "STXihei" },
      { ch: "华文彩云", en: "STCaiyun", ps: "STCaiyun" },
      { ch: "华文琥珀", en: "STHupo", ps: "STHupo" },
      { ch: "华文新魏", en: "STXinwei", ps: "STXinwei" },
      { ch: "华文隶书", en: "STLiti", ps: "STLiti" },
      { ch: "华文行楷", en: "STXingkai", ps: "STXingkai" },
      { ch: "雅痞-简", en: "Yuppy SC", ps: "YuppySC-Regular" },
      { ch: "圆体-简", en: "Yuanti SC", ps: "YuantiSC-Regular" },
      { ch: "手书体", en: "ShouShuti", ps: "ShouShuti" },
      { ch: "幼圆", en: "YouYuan", ps: "YouYuan" },
      { ch: "微软雅黑（置换版）", en: "Microsoft YaHei", ps: "MicrosoftYaHei" },
    ]);

    /* INITIALIZE_FONT_RENDERING_PARAMETERS */

    const INITIAL_VALUES = {
      fontBase: `system-ui,-apple-system,BlinkMacSystemFont,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji','Android Emoji','EmojiSymbols','emojione mozilla','twemoji mozilla','office365icons','iconfont','icomoon','FontAwesome','Font Awesome 5 Pro','Font Awesome 6 Pro','IcoFont','fontello','themify','Material Icons','Material Icons Extended','bootstrap-icons','Segoe Fluent Icons','Material-Design-Iconic-Font'`,
      fontSelect: IS_REAL_WEBKIT ? `'PingFang SC'` : `'Microsoft YaHei UI'`,
      fontFace: true,
      fontSmooth: true,
      fontSize: 1.0,
      fixViewport: true,
      fontStroke: IS_REAL_GECKO ? 0.08 : IS_REAL_BLINK ? 0.015 : 0.0,
      fixStroke: IS_REAL_BLINK,
      fontShadow: IS_REAL_GECKO ? 0.36 : 0.75,
      shadowColor: IS_REAL_GECKO ? "#7C7C7C70" : "#7C7C7CDD",
      fontCSS: `:not(i,head *):not([class*='glyph']):not([class*='symbols']):not([class*='icon']):not([class*='fa-']):not([class*='vjs-'])`,
      fontEx: `progress,meter,datalist,samp,kbd,pre,pre *,code,code *`,
      monospacedFont: `'Operator Mono Lig','Fira Code','Source Code Pro','DejaVu Sans Mono','Anonymous Pro','Ubuntu Mono','Roboto Mono','JetBrains Mono','Droid Sans Mono','Mono','Monaco','Menlo','Inconsolata','Liberation Mono'`,
      monospacedFeature: `"liga" 0,"tnum","zero"`,
      editorialSites: `vscode.dev|github.dev|github1s.com|kdocs.cn|docs.qq.com|cdn.addon.tencentsuite.com|yuque.com|xiezuocat.com|wolai.com|shimo.im|note.youdao.com|feishu.cn|docs.google.com|newassets.hcaptcha.com|image.baidu.com|weread.qq.com|.notion.so|.notion.site`,
    };

    /* INITIALIZE_SHADOWROOT_STYLE */

    def.const.style = {
      mainStyle: `display:inline-block;font-family:monospace,${INITIAL_VALUES.fontSelect},sans-serif`,
      global: "input:is([type='text'],[type='password'],[type='search']),input:not([type]){font-family:initial!important}",
      frDialogBox: String(
        `:host(#${def.id.dialogbox}){position:fixed!important;top:0;left:0;width:100%;height:100%;background:0 0!important;pointer-events:none;z-index:2147483647}div.${def.class.db}{z-index:99999;box-sizing:content-box;max-width:420px;border:2px solid #efefef;color:#444444;pointer-events:auto}.${def.class.db}{position:absolute;top:calc(12% + 10px);right:15px;display:block;overflow:hidden;width:100%;border-radius:6px;background:#ffffff;box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.3);transition:opacity .5s}.${def.class.db} *{text-shadow:0 0 1px #777!important;font-family:${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;line-height:1.5!important;-webkit-text-stroke:0 transparent!important}.${def.class.dbt}{display:flex;margin-top:0;padding:10px 15px;width:auto;background:#efefef;text-align:left;font-weight:700;font-size:18px!important;flex-wrap:wrap;justify-content:space-between;align-items:center;align-content:center}.${def.class.dbt},.${def.class.dbt} *{font-weight:700;font-size:20px!important;font-family:Candara,'Times New Roman',${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}.${def.class.dbm}{margin:5px;padding:10px;color:#444444;text-align:left;font-weight:500;font-size:16px!important}.${def.class.dbb}{display:inline-block;box-sizing:content-box;margin:2px 1%;padding:8px 12px;min-width:12%;border-radius:4px;text-align:center;text-decoration:none!important;letter-spacing:0;font-weight:400;cursor:pointer}.${def.class.db} .${def.class.readonly}{background:linear-gradient(45deg,#ffe9e9,#ffe9e9 25%,transparent 0,transparent 50%,#ffe9e9 0,#ffe9e9 75%,transparent 0,transparent)!important;background-color:#fff7f7!important;background-size:50px 50px!important}.${def.class.db} .gradient-bg{background:#e7ffd9;animation:gradient 2s ease-in-out forwards}@keyframes gradient{0%{background:#e7ffd9}to{background:transparent}}` +
          `.${def.class.dbb}:hover{box-sizing:content-box;color:#ffffff;text-decoration:none!important;font-weight:700;opacity:.8}.${def.class.db} .${def.class.dbt},.${def.class.dbb},.${def.class.dbb}:hover{text-shadow:none!important;-webkit-text-stroke:0 transparent!important;-webkit-user-select:none;user-select:none}.${def.class.dbbf},.${def.class.dbbf}:hover{border:1px solid #d93223!important;border-radius:6px;background:#d93223!important;color:#ffffff!important;font-size:14px!important}.${def.class.dbbf}:hover{box-shadow:0 0 3px #d93223!important}.${def.class.dbbt},.${def.class.dbbt}:hover{border:1px solid #038c5a!important;border-radius:6px;background:#038c5a!important;color:#ffffff!important;font-size:14px!important}.${def.class.dbbt}:hover{box-shadow:0 0 3px #038c5a!important}.${def.class.dbbn},.${def.class.dbbn}:hover{border:1px solid #777777!important;border-radius:6px;background:#777777!important;color:#ffffff!important;font-size:14px!important}.${def.class.dbbn}:hover{box-shadow:0 0 3px #777!important}.${def.class.dbbc}{padding:2.5%;background:#efefef;color:#ffffff;text-align:right;font-size:initial}.${def.class.dbm} textarea{cursor:auto;scrollbar-width:thin;overscroll-behavior:contain}.${def.class.dbm} textarea::-webkit-scrollbar{width:8px;height:8px}.${def.class.dbm} textarea::-webkit-scrollbar-corner{border-radius:2px;background:#efefef;box-shadow:inset 0 0 3px #aaaaaa;}.${def.class.dbm} textarea::-webkit-scrollbar-thumb{border-radius:2px;background:#cfcfcf;box-shadow:inset 0 0 5px #999;}.${def.class.dbm} textarea::-webkit-scrollbar-track{border-radius:2px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}.${def.class.dbm} textarea::-webkit-scrollbar-track-piece{border-radius:2px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}` +
          `.${def.class.dbm} button:hover{background:#f6f6f6!important;box-shadow:0 0 3px #a7a7a7!important;cursor:pointer}.${def.class.dbm} p{margin:5px 0!important;text-align:left;text-indent:0!important;font-weight:400;font-size:16px!important;line-height:1.5!important;-webkit-user-select:none;user-select:none}.${def.class.dbm} ul{margin:0 0 0 10px!important;padding:2px;color:gray;list-style:none;font:italic 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;-webkit-user-select:none;user-select:none;scrollbar-width:thin}.${def.class.dbm} ul::-webkit-scrollbar{width:10px;height:1px}.${def.class.dbm} ul::-webkit-scrollbar-thumb{border-radius:10px;background:#cfcfcf;box-shadow:inset 0 0 5px #999999;}.${def.class.dbm} ul::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}.${def.class.dbm} ul::-webkit-scrollbar-track-piece{border-radius:6px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}.${def.class.dbm} ul li{display:list-item;list-style-type:none;word-break:break-all}.${def.class.dbm} li:before{display:none}.${def.class.dbm} #${def.id.bk},.${def.class.dbm} #${def.id.pv},.${def.class.dbm} #${def.id.fs},.${def.class.dbm} #${def.id.fvp},.${def.class.dbm} #${def.id.hk},.${def.class.dbm} #${def.id.ct},.${def.class.dbm} #${def.id.mps},.${def.class.dbm} #${def.id.flc},.${def.class.dbm} #${def.id.gc},.${def.class.dbm} #${def.id.cm}{display:flex;box-sizing:content-box;margin:0;padding:2px 4px!important;width:calc(96% - 10px);height:max-content;min-width:auto;min-height:40px;list-style:none;font-style:normal;justify-content:space-between;align-items:flex-start;word-break:break-word}.${def.class.dbm} ul#${def.const.seed}_d_d_ li:hover{background-color:#fdf6eccc!important}.${def.class.dbm} #${def.const.seed}_temporary{padding:18px 8px;text-align:center;color:#555555;font-size:14px!important}` +
          `.${def.class.checkbox}{display:none!important}.${def.class.checkbox}+label{position:relative;display:inline-block;box-sizing:content-box;margin:0 2px 0 0;padding:0;width:76px;height:32px;border-radius:7px;background:#f7836d;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(245,146,146,.4);white-space:nowrap;cursor:pointer}.${def.class.checkbox}+label::before{position:absolute;top:0;left:0;z-index:99;width:24px;height:32px;border-radius:7px;background:#ffffff;box-shadow:0 0 1px rgba(0,0,0,.6);color:#ffffff;content:' '}.${def.class.checkbox}+label::after{position:absolute;top:0;left:28px;padding:5px;border-radius:100px;color:#ffffff;content:'OFF';font-weight:700;font-style:normal;font-size:16px}.${def.class.checkbox}:checked+label{margin:0 2px 0 0;background:#67a5df!important;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(146,196,245,.4);cursor:pointer}.${def.class.checkbox}:checked+label::after{left:10px;content:'ON'}.${def.class.checkbox}:checked+label::before{position:absolute;left:52px;z-index:99;content:' '}` +
          `.${def.class.dbm} .${def.const.seed}_VIP,.${def.class.dbm} .${def.const.seed}_cusmono{margin:2px 0 0 0;color:#b8860b!important;font:normal 400 16px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}.${def.class.dbm} #${def.id.flc} button,.${def.class.dbm} #${def.id.gc} button{box-sizing:border-box!important;margin:0 5px 0 0!important;padding:2px 5px!important;border:1px solid #999!important;border-radius:4px!important;background-color:#eeeeee;color:#444444!important;letter-spacing:normal!important;font-weight:400!important;font-size:14px!important}#${def.const.seed}_monospaced_siterules:placeholder-shown{color:#555555!important;white-space:pre-line!important;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}#${def.const.seed}_monospaced_siterules::-webkit-input-placeholder,#${def.const.seed}_monospaced_siterules::-moz-placeholder,#${def.const.seed}_monospaced_font::-moz-placeholder{color:#555555!important;white-space:pre-line!important;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}.${def.class.dbm} a{color:#0969da;text-decoration:none!important;font-style:inherit}.${def.class.dbm} a:hover{color:#dc143c;text-decoration:underline}.${def.class.dbm} #${def.id.feedback}{padding:2px 10px;width:max-content;height:22px;min-width:auto}.${def.class.dbm} #${def.id.files}{display:none}.${def.class.dbm} #${def.id.feedback}:hover{color:crimson!important}` +
          `.${def.class.dbm} #${def.id.feedback}:after{width:0;height:0;background:url('${def.const.loadImg}') no-repeat -400px -300px;content:""}` +
          `.${def.class.dbm} #${def.const.seed}_custom_Fontlist:placeholder-shown{color:#aaaaaa!important;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}.${def.class.dbm} #${def.const.seed}_custom_Fontlist::-webkit-input-placeholder{color:#aaaaaa!important;white-space:pre-line!important;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important;word-break:break-all!important}.${def.class.dbm} #${def.const.seed}_custom_Fontlist::-moz-placeholder{color:#555555!important;white-space:pre-line;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}.${def.class.dbm} #${def.const.seed}_update li{margin:0;padding:1px 0;color:gray;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important}.${def.class.dbm} .${def.const.seed}_add:before{display:inline;margin:0 4px 0 -10px;content:'+'}.${def.class.dbm} .${def.const.seed}_del:before{display:inline;margin:0 4px 0 -10px;content:'-'}.${def.class.dbm} .${def.const.seed}_fix:before{display:inline;margin:0 4px 0 -10px;content:'@'}.${def.class.dbm} .${def.const.seed}_info{color:#daa520!important}.${def.class.dbm} .${def.const.seed}_info:before{display:inline;margin:0 4px 0 -10px;content:'#'}.${def.class.dbm} .${def.const.seed}_warn{color:#e90000!important}.${def.class.dbm} .${def.const.seed}_warn:before{display:inline;margin:0 4px 0 -10px;content:'!'}.${def.class.dbm} .${def.const.seed}_init{color:#65a16a!important}.${def.class.dbm} .${def.const.seed}_init:before{display:inline;margin:0 4px 0 -10px;content:'$'}.${def.class.dbm} input:focus,.${def.class.dbm} textarea:focus{box-shadow:inset 0 1px 3px rgb(0 0 0/10%),0 0 4px rgb(110 111 112/60%)!important}`
      ),
      frConfigure:
        String(
          `:host(#${def.id.configure}){position:fixed!important;top:0;left:0;width:100%;height:100%;background:0 0!important;pointer-events:none;z-index:2147483646}#${def.id.container}{position:absolute;top:10px;right:24px;z-index:99999;overflow-x:hidden;overflow-y:auto;box-sizing:content-box;padding:4px;max-height:calc(100% - 40px);min-height:10%;border-radius:12px;background:#f0f6ff!important;box-shadow:0 0 4px 0 rgb(0 0 0/30%);color:#333333;text-align:left;font-weight:700;font-size:16px!important;opacity:0;transition:opacity .5s;width:auto;overscroll-behavior:contain;scrollbar-color:rgb(51 102 153/85%) rgb(0 0 0/25%);scrollbar-width:thin;pointer-events:auto}#${def.id.container}::-webkit-scrollbar{width:10px;height:1px}#${def.id.container}::-webkit-scrollbar-thumb{border-radius:10px;background:#487baf;box-shadow:inset 0 0 5px #67a5df;}#${def.id.container}::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 5px #67a5df;}#${def.id.container}::-webkit-scrollbar-track-piece{border-radius:10px;background:#efefef;box-shadow:inset 0 0 5px #67a5df;}#${def.id.container} *{text-shadow:none!important;font-weight:700;font-size:16px;font-family:${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji,Android Emoji,EmojiSymbols!important;line-height:1.5!important;-webkit-text-stroke:0 transparent!important}` +
            `#${def.id.container} fieldset{display:block;margin:2px;padding:4px 6px;width:auto;height:auto;min-height:475px;border:2px groove #67a5df!important;border-radius:10px;background:#f0f6ff!important}#${def.id.container} legend{position:relative!important;float:none!important;display:block!important;visibility:visible!important;box-sizing:content-box;margin:0;padding:0 32px 0 8px;width:auto!important;height:auto!important;border:none!important;background:#f0f6ff!important;font:normal 700 16px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}#${def.id.container} fieldset ul{margin:0;padding:0;background:#f0f6ff!important}#${def.id.container} ul li{float:none;display:inherit;box-sizing:content-box;margin:3px 0;min-width:-webkit-fill-available;min-width:-moz-available;border:none;background:#f0f6ff!important;list-style:none;cursor:default;-webkit-user-select:none;user-select:none}#${def.id.container} ul li:before{display:none}#${def.id.container} .${def.class.rotation} svg{visibility:visible!important;overflow:hidden;width:24px;height:24px;vertical-align:initial!important;fill:#67a5df;}#${def.id.container} .${def.class.rotation} svg:hover{cursor:help}#${def.const.seed}_scriptname{display:inline-block;vertical-align:bottom;overflow:hidden;max-width:225px;text-overflow:ellipsis;white-space:nowrap;font-weight:700!important;-webkit-user-select:all;user-select:all}#${def.id.container} .${def.class.title} .${def.class.guide}{position:absolute;display:inline-block;cursor:pointer}@keyframes rotation{0%{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(1turn)}}.${def.class.title} .${def.class.rotation}{top:auto;right:auto;bottom:auto;left:auto;margin:0;padding:0;width:24px;height:24px;-webkit-transform:rotate(1turn);transform-origin:center 50% 0;animation:rotation 5s linear infinite}` +
            `#${def.id.container} input:not([type='range'],[type='checkbox']):focus,#${def.id.container} textarea:focus{box-shadow:inset 0 1px 3px rgb(0 0 0/10%),0 0 6px rgb(82 168 236/60%)!important}#${def.id.fontList}{padding:2px 10px 0;min-height:73px}#${def.id.fontFace},#${def.id.fontSmooth}{display:flex!important;padding:2px 10px;width:calc(100% - 18px);height:40px;min-width:auto;align-items:center;justify-content:space-between}#${def.id.fontSize}{padding:2px 10px;height:60px}#${def.id.fontStroke}{padding:2px 10px;height:60px}#${def.id.fontShadow}{padding:2px 10px;height:60px}#${def.id.shadowColor}{display:flex;margin:4px;padding:2px 10px;width:auto;min-height:45px;align-items:center;justify-content:space-between;flex-wrap:nowrap;flex-direction:row}#${def.id.fontCss},#${def.id.fontEx}{padding:2px 10px;height:110px;min-height:110px}#${def.id.submit}{padding:2px 10px;height:40px}` +
            `#${def.id.fontList} .${def.class.selector} a{text-decoration:none;font-weight:400}#${def.id.fontList} .${def.class.label}{display:inline-block;margin:0 4px 14px 0;padding:0;height:24px;line-height:24px!important}#${def.id.fontList} .${def.class.label} span{display:inline-block;overflow:hidden;box-sizing:border-box;padding:5px;width:max-content;height:max-content;max-width:200px;min-width:12px;background:#67a5df;color:#ffffff;text-overflow:ellipsis;white-space:nowrap;font-weight:400;font-size:16px!important}#${def.id.fontList} .${def.class.close}{width:12px}#${def.id.fontList} .${def.class.close}:hover{border-radius:2px;background-color:#2d7dca;color:tomato}#${def.id.selector}{width:100%;max-width:100%}#${def.id.selector} label{display:block;margin:0 0 4px;color:#333333;cursor:auto}#${def.id.selector} #${def.id.cleaner}{margin-left:5px;cursor:pointer}#${def.id.selector} #${def.id.cleaner}:hover{color:#ff0000;}#${def.id.fontList} .${def.class.selector}{overflow-x:hidden;box-sizing:border-box;margin:0 0 6px;padding:6px 6px 0;width:100%;max-width:min-content;max-width:-moz-min-content;max-height:90px;min-width:100%;min-height:45px;border:2px solid #67a5df!important;border-radius:6px;overscroll-behavior:contain;scrollbar-color:#336699 rgba(0,0,0,.25);scrollbar-width:thin}#${def.id.fontList} .${def.class.selector}::-webkit-scrollbar{width:6px;height:1px}#${def.id.fontList} .${def.class.selector}::-webkit-scrollbar-thumb{border-radius:10px;background:#487baf;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontList} .${def.class.selector}::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontList} .${def.class.selector}::-webkit-scrollbar-track-piece{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px #67a5df}#${def.id.fontList} .${def.class.selectFontId} span.${def.class.spanlabel},#${def.id.selector} span.${def.class.spanlabel}{display:block!important;margin:0!important;padding:0 0 4px;width:auto;border:0;background-color:transparent!important;color:#333333;text-align:left!important}` +
            `#${def.id.fontList} .${def.class.selectFontId}{width:auto}#${def.id.fontList} .${def.class.selectFontId} input{overflow:hidden;box-sizing:border-box;margin:0;padding:1px 23px 1px 2px;width:230px;height:42px!important;max-width:100%;min-width:100%;outline:none!important;outline-color:#67a5df;border:2px solid #67a5df!important;border-radius:6px;background:#fafafa;text-indent:8px;text-overflow:ellipsis;font-weight:700;font-size:16px!important;font-family:${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}#${def.id.fontList} .${def.class.selectFontId} input[disabled]{pointer-events:none!important}#${def.id.fontList} .${def.class.selectFontId} input::-webkit-search-cancel-button{margin:0 7px}.${def.class.placeholder}:placeholder-shown{color:#336699!important;font:normal 700 16px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;opacity:.95!important}.${def.class.placeholder}::-webkit-input-placeholder{color:#336699!important;font:normal 700 16px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;opacity:.65!important}.${def.class.placeholder}::-moz-placeholder{color:#336699!important;font:normal 700 16px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;opacity:.65!important}#${def.id.fontList} .${def.class.selectFontId} dl{position:absolute;z-index:1000;overflow-x:hidden;box-sizing:content-box;margin:4px 0 0;padding:4px 8px;width:auto;max-width:calc(100% - 68px);max-height:298px;min-width:60%;border:2px solid #67a5df!important;border-radius:6px;background-color:#ffffff;white-space:nowrap;font-size:18px!important;overscroll-behavior:contain;scrollbar-color:#487baf rgba(0,0,0,.25);scrollbar-width:thin}` +
            `#${def.id.fontList} .${def.class.selectFontId} dl::-webkit-scrollbar{width:10px;height:1px}#${def.id.fontList} .${def.class.selectFontId} dl::-webkit-scrollbar-thumb{border-radius:10px;background:#487baf;box-shadow:inset 0 0 5px #67a5df;}#${def.id.fontList} .${def.class.selectFontId} dl::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 5px #67a5df;}#${def.id.fontList} .${def.class.selectFontId} dl::-webkit-scrollbar-track-piece{border-radius:10px;background:#efefef;box-shadow:inset 0 0 5px #67a5df;}#${def.id.fontList} .${def.class.selectFontId} dl dd{display:block;overflow-x:hidden;box-sizing:content-box;margin:1px 8px;padding:5px 0;width:-moz-available;width:-webkit-fill-available;max-width:100%;min-width:100%;text-overflow:ellipsis;font-weight:400;font-size:21px!important}#${def.id.fontList} .${def.class.selectFontId} dl dd:hover{overflow-x:hidden;box-sizing:content-box;min-width:-moz-available;min-width:-webkit-fill-available;background-color:#67a5df;color:#ffffff;text-overflow:ellipsis}` +
            `.${def.class.checkbox}{display:none!important}.${def.class.checkbox}+label{position:relative;display:inline-block;box-sizing:content-box;margin:0 2px 0 0;padding:0;width:76px;height:32px;border-radius:7px;background:#f7836d;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(245,146,146,.4);white-space:nowrap;cursor:pointer}.${def.class.checkbox}+label::before{position:absolute;top:0;left:0;z-index:99;width:24px;height:32px;border-radius:7px;background:#ffffff;box-shadow:0 0 1px rgba(0,0,0,.6);color:#ffffff;content:" "}.${def.class.checkbox}+label::after{position:absolute;top:0;left:28px;padding:5px;border-radius:100px;color:#ffffff;content:"OFF";font-weight:700;font-style:normal;font-size:16px}.${def.class.checkbox}:checked+label{margin:0 2px 0 0;background:#67a5df!important;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(146,196,245,.4);cursor:pointer}.${def.class.checkbox}:checked+label::after{left:10px;content:"ON"}.${def.class.checkbox}:checked+label::before{position:absolute;left:52px;z-index:99;content:" "}#${def.id.fface} label,#${def.id.fface}+label::after,#${def.id.fface}+label::before,#${def.id.smooth} label,#${def.id.smooth}+label::after,#${def.id.smooth}+label::before{-webkit-transition:all .3s ease-in;transition:all .3s ease-in}` +
            `#${def.id.fontShadow} div.${def.class.flex}:before,#${def.id.fontShadow} div.${def.class.flex}:after,#${def.id.fontStroke} div.${def.class.flex}:before,#${def.id.fontStroke} div.${def.class.flex}:after,#${def.id.fontSize} div.${def.class.flex}:before,#${def.id.fontSize} div.${def.class.flex}:after{display:none}#${def.id.fontShadow} #${def.id.shadowSize},#${def.id.fontStroke} #${def.id.strokeSize},#${def.id.fontSize} #${def.id.fontScale}{box-sizing:content-box;margin:0 10px 0 0!important;padding:0;width:56px!important;height:32px!important;outline:none!important;border:2px solid #67a5df!important;border-radius:4px;background:#fafafa!important;color:#111111!important;text-align:center;text-indent:0;font-weight:400!important;font-size:17px!important;font-family:Impact,Times,serif!important}#${def.id.fontSize} #${def.id.fontScale}[disabled]{background-color:rgba(228,231,237,.82)!important;color:#555555!important;filter:grayscale(.9)}#${def.id.fontSize} #${def.id.fviewport}>label,#${def.id.fontStroke} #${def.id.fstroke}>label{float:none!important;display:inline!important;margin:0!important;padding:0 0 0 2px!important;color:#666666!important;font-size:12px!important;cursor:help!important}#${def.id.fixViewport},#${def.id.fixStroke}{display:inline-block;margin:0 2px 0 0!important;width:14px!important;height:14px!important;vertical-align:text-bottom;cursor:pointer;-webkit-appearance:none!important}` +
            `#${def.id.fixViewport}::after,#${def.id.fixStroke}::after{position:relative;top:0;display:inline-block;margin:0;padding:0;width:14px;height:14px;border-radius:3px;background-color:#aaaaaa;color:#ffffff;content:"\u2717";vertical-align:top;text-align:center;font-weight:700;font-size:10px;line-height:14px}#${def.id.fixViewport}:checked::after,#${def.id.fixStroke}:checked::after{border:0!important;background-color:#65a0db;color:#ffffff;content:"\u2713";font-weight:700;font-size:12px;line-height:14px}.${def.class.flex}{display:flex;width:auto;min-width:100%;align-items:center;justify-content:space-between;flex-wrap:nowrap;flex-direction:row}.${def.class.slider} input{visibility:hidden}#${def.id.shadowColor} *{box-sizing:content-box}#${def.id.shadowColor} .${def.class.frColorPicker}{margin:0;padding:0;width:auto}#${def.id.shadowColor} .${def.class.frColorPicker} #${def.id.color}{box-sizing:border-box;margin:0;padding:0 8px 0 0;width:160px!important;height:35px!important;min-width:160px;outline:none!important;border:2px solid #67a5df!important;border-radius:4px;background:rgba(253,253,255,.69);color:#333333!important;text-align:center;text-indent:0;font-weight:400!important;font-size:18px!important;font-family:Impact,Times,serif!important;cursor:pointer}` +
            `#${def.id.fontCss} textarea,#${def.id.fontEx} textarea{box-sizing:border-box;margin:0;padding:5px;width:calc(100% - 2px)!important;height:78px;max-width:calc(100% - 2px);max-height:78px;min-width:calc(100% - 2px);min-height:78px;outline:none!important;border:2px solid #67a5df!important;border-radius:6px;color:#0b5b9c!important;font:normal 700 14px/150% monospace,${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont!important;resize:none;cursor:auto;word-break:break-all;scrollbar-color:#487baf rgba(0,0,0,.25);scrollbar-width:thin;overscroll-behavior:contain}#${def.id.fontCss} textarea::-webkit-scrollbar{width:6px;height:1px}#${def.id.fontCss} textarea::-webkit-scrollbar-thumb{border-radius:10px;background:#487baf;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontCss} textarea::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px rgba(0,0,0,.2);}#${def.id.fontCss} textarea::-webkit-scrollbar-track-piece{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontEx} textarea{background:#fafafa!important}#${def.id.fontEx} textarea::-webkit-scrollbar{width:6px;height:1px}#${def.id.fontEx} textarea::-webkit-scrollbar-thumb{border-radius:10px;background:#487baf;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontEx} textarea::-webkit-scrollbar-track{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px #67a5df;}#${def.id.fontEx} textarea::-webkit-scrollbar-track-piece{border-radius:10px;background:#efefef;box-shadow:inset 0 0 2px #67a5df;}.${def.class.switch}{float:right;box-sizing:border-box;margin:-2px 4px 0 0;padding:0 6px;border:2px double #67a5df;border-radius:4px;color:#0a68c1;}#${def.id.cSwitch}:hover,#${def.id.eSwitch}:hover{cursor:pointer;-webkit-user-select:none;user-select:none}.${def.class.readonly}{background:linear-gradient(45deg,#ffe9e9,#ffe9e9 25%,transparent 0,transparent 50%,#ffe9e9 0,#ffe9e9 75%,transparent 0,transparent)!important;background-color:#fff7f7!important;background-size:50px 50px!important}.${def.class.notreadonly}{background:linear-gradient(45deg,#e9ffe9,#e9ffe9 25%,transparent 0,transparent 50%,#e9ffe9 0,#e9ffe9 75%,transparent 0,transparent)!important;background-color:#f7fff7!important;background-size:50px 50px}` +
            `.${def.class.dbm} textarea{cursor:auto;scrollbar-width:thin;overscroll-behavior:contain}.${def.class.dbm} textarea::-webkit-scrollbar{width:8px;height:8px}.${def.class.dbm} textarea::-webkit-scrollbar-corner{border-radius:2px;background:#efefef;box-shadow:inset 0 0 3px #aaaaaa;}.${def.class.dbm} textarea::-webkit-scrollbar-thumb{border-radius:2px;background:#cfcfcf;box-shadow:inset 0 0 5px #999999;}.${def.class.dbm} textarea::-webkit-scrollbar-track{border-radius:2px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}.${def.class.dbm} textarea::-webkit-scrollbar-track-piece{border-radius:2px;background:#efefef;box-shadow:inset 0 0 5px #aaaaaa;}` +
            `#${def.id.submit} button{box-sizing:border-box;margin:0;padding:5px 10px;width:auto;height:35px;min-width:min-content;min-height:35px;border:2px solid #6ba7e0;border-radius:6px;background-color:#67a5df;background-image:none;color:#ffffff!important;font:normal 600 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;cursor:pointer}#${def.id.submit} button:hover{box-shadow:0 0 5px rgba(0,0,0,.4)!important}#${def.id.submit} .${def.class.cancel},#${def.id.submit} .${def.class.reset}{float:left;margin-right:10px}#${def.id.submit} .${def.class.submit}{float:right}#${def.id.submit} #${def.id.backup}{display:none;margin:0 10px 0 0}.${def.class.anim}{border:2px solid #dc143c!important;background:#dc143c!important;animation:jiggle 1.8s ease-in infinite}@keyframes jiggle{48%,62%{transform:scale(1,1)}50%{transform:scale(1.1,.9)}56%{transform:scale(.9,1.1) translate(0,-5px)}59%{transform:scale(1,1) translate(0,-3px)}}`
        ) +
        String(
          `.${def.class.tooltip}{position:relative;cursor:help;-webkit-user-select:none;user-select:none}.${def.class.tooltip} span.${def.class.emoji}{font-weight:400!important}.${def.class.tooltip}:active .${def.class.tooltip}{display:block}.${def.class.tooltip} .${def.class.tooltip}{position:absolute;z-index:999999;display:none;box-sizing:content-box;padding:10px;width:234px;max-width:234px;border:2px solid #b8c4ce;border-radius:6px;background-color:#54a2ec;color:#ffffff;font-weight:400;opacity:.9;word-break:break-all}.${def.class.tooltip} .${def.class.tooltip} *{font-size:14px!important;font-family:${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}.${def.class.tooltip} .${def.class.tooltip} em{font-style:normal!important}.${def.class.tooltip} .${def.class.tooltip} strong{color:darkorange;font-size:18px!important}.${def.class.tooltip} .${def.class.tooltip} p{display:block;margin:0 0 10px;color:#ffffff;text-indent:0!important;line-height:150%}.${def.class.ps1}{position:relative;top:-33px;right:5px;float:right;margin:0;padding:0;width:24px;height:0}.${def.class.ps2}{top:35px;right:-7px}` +
            `.${def.class.ps3}{top:-197px;${IS_REAL_WEBKIT ? "left:-72px" : "left:auto"}}` +
            `.${def.class.ps4}{top:-197px;${IS_REAL_WEBKIT ? "right:-64px" : "left:auto"}}` +
            `.${def.class.ps5}{top:-322px;${IS_REAL_WEBKIT ? "right:-54px" : "left:auto"}}`
        ) +
        String(
          `.${def.class.range}{--primary-color:#67a5df;--value-offset-y:var(--ticks-gap);--value-active-color:white;--value-background:transparent;--value-background-hover:var(--primary-color);--value-font:italic 700 14px/14px monospace,serif;--fill-color:var(--primary-color);--progress-background:rgb(223, 223, 223);--progress-radius:20px;--show-min-max:none;--track-height:calc(var(--thumb-size) / 2);--min-max-font:12px serif;--min-max-opacity:0.5;--min-max-x-offset:10%;--thumb-size:22px;--thumb-color:white;--thumb-shadow:0 0 3px rgba(0, 0, 0, 0.4),0 0 1px rgba(0, 0, 0, 0.5) inset,0 0 0 99px var(--thumb-color) inset;--thumb-shadow-active:0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color),0 0 0 99px var(--primary-color) inset,0 0 3px rgba(0, 0, 0, 0.4);--thumb-shadow-hover:0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color),0 0 0 99px darkorange inset,0 0 3px rgba(0, 0, 0, 0.4);--ticks-thickness:1px;--ticks-height:5px;--ticks-gap:var(--ticks-height, 0);--ticks-color:transparent;--step:1;--ticks-count:(var(--max) - var(--min))/var(--step);--maxTicksAllowed:1000;--too-many-ticks:Min(1, Max(var(--ticks-count) - var(--maxTicksAllowed), 0));--x-step:Max(var(--step), var(--too-many-ticks) * (var(--max) - var(--min)));--tickIntervalPerc_1:Calc((var(--max) - var(--min)) / var(--x-step));--tickIntervalPerc:calc((100% - var(--thumb-size)) / var(--tickIntervalPerc_1) * var(--tickEvery, 1));--value-a:Clamp(var(--min), var(--value, 0), var(--max));--value-b:var(--value, 0);--text-value-a:var(--text-value, "");--completed-a:calc((var(--value-a) - var(--min)) / (var(--max) - var(--min)) * 100);--completed-b:calc((var(--value-b) - var(--min)) / (var(--max) - var(--min)) * 100);--ca:Min(var(--completed-a), var(--completed-b));--cb:Max(var(--completed-a), var(--completed-b));--thumbs-too-close:Clamp(-1, 1000 * (Min(1, Max(var(--cb) - var(--ca) - 5, -1)) + 0.001), 1);--thumb-close-to-min:Min(1, Max(var(--ca) - 5, 0));--thumb-close-to-max:Min(1, Max(95 - var(--cb), 0))}` +
            `.${def.class.range}{width:auto;min-width:105%!important;margin:-3px 0 0 -7px;box-sizing:content-box;display:inline-block;height:Max(var(--track-height),var(--thumb-size));background:linear-gradient(to right,var(--ticks-color) var(--ticks-thickness),transparent 1px) repeat-x;background-size:var(--tickIntervalPerc) var(--ticks-height);background-position-x:calc(var(--thumb-size)/ 2 - var(--ticks-thickness)/ 2);background-position-y:var(--flip-y,bottom);padding-bottom:var(--flip-y,var(--ticks-gap));padding-top:calc(var(--flip-y) * var(--ticks-gap));position:relative;z-index:1}.${def.class.range}[disabled]{filter:grayscale(0.9);}.${def.class.range}[data-ticks-position=top]{--flip-y:1}.${def.class.range}::after,.${def.class.range}::before{--offset:calc(var(--thumb-size) / 2);content:counter(x);display:var(--show-min-max,block);font:var(--min-max-font);position:absolute;bottom:var(--flip-y,-2.5ch);top:calc(-2.5ch * var(--flip-y));opacity:Clamp(0,var(--at-edge),var(--min-max-opacity));transform:translateX(calc(var(--min-max-x-offset) * var(--before,-1) * -1)) scale(var(--at-edge));pointer-events:none}.${def.class.range}::before{--before:1;--at-edge:var(--thumb-close-to-min);counter-reset:x var(--min);left:var(--offset)}.${def.class.range}::after{--at-edge:var(--thumb-close-to-max);counter-reset:x var(--max);right:var(--offset)}` +
            `.${def.class.rangeProgress}{--start-end:calc(var(--thumb-size) / 2);--clip-end:calc(100% - (var(--cb)) * 1%);--clip-start:calc(var(--ca) * 1%);--clip:inset(-20px var(--clip-end) -20px var(--clip-start));position:absolute;left:var(--start-end);right:var(--start-end);top:calc(var(--ticks-gap) * var(--flip-y,0) + var(--thumb-size)/ 2 - var(--track-height)/ 2);height:calc(var(--track-height));background:var(--progress-background,#eee);pointer-events:none;z-index:-1;border-radius:var(--progress-radius)}.${def.class.rangeProgress}::before{content:"";position:absolute;left:0;right:0;clip-path:var(--clip);top:0;bottom:0;background:var(--fill-color,#000);box-shadow:var(--progress-flll-shadow);z-index:1;border-radius:inherit}.${def.class.rangeProgress}::after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;box-shadow:var(--progress-shadow);pointer-events:none;border-radius:inherit}.${def.class.range}>input:only-of-type~.${def.class.rangeProgress}{--clip-start:0}` +
            `.${def.class.range}>input::-webkit-slider-runnable-track{background:transparent!important;box-shadow:none!important;border:none!important}.${def.class.range}>input{-webkit-appearance:none;box-shadow:none!important;width:100%;height:var(--thumb-size)!important;margin:0!important;padding:0!important;position:absolute!important;left:0;top:calc(50% - Max(var(--track-height),var(--thumb-size))/ 2 + calc(var(--ticks-gap)/ 2 * var(--flip-y,-1)))!important;border:0!important;cursor:grab;outline:0!important;background:0 0!important;--thumb-shadow:var(--thumb-shadow-active)}.${def.class.range}>input:not(:only-of-type){pointer-events:none}.${def.class.range}>input::-webkit-slider-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}.${def.class.range}>input::-moz-range-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}.${def.class.range}>input::-ms-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}` +
            `.${def.class.range}>input:hover{--thumb-shadow:var(--thumb-shadow-active)}.${def.class.range}>input:hover+output{--value-background:var(--value-background-hover);--y-offset:-1px;color:var(--value-active-color);box-shadow:0 0 0 3px var(--value-background)}.${def.class.range}>input:active{--thumb-shadow:var(--thumb-shadow-hover);cursor:grabbing;z-index:2}.${def.class.range}>input:active+output{transition:0s;opacity:0.9;display:-webkit-box;-webkit-box-orient:horizontal;-webkit-box-pack:center;-webkit-box-align:center;-moz-box-orient:horizontal;-moz-box-pack:center;-moz-box-align:center}.${def.class.range}>input:nth-of-type(1){--is-left-most:Clamp(0, (var(--value-a) - var(--value-b)) * 99999, 1)}.${def.class.range}>input:nth-of-type(1)+output{--value:var(--value-a);--x-offset:calc(var(--completed-a) * -1%)}.${def.class.range}>input:nth-of-type(1)+output:not(:only-of-type){--flip:calc(var(--thumbs-too-close) * -1)}.${def.class.range}>input:nth-of-type(1)+output::after{content:var(--prefix, "") var(--text-value-a) var(--suffix, "")}.${def.class.range}>input:nth-of-type(2){--is-left-most:Clamp(0, (var(--value-b) - var(--value-a)) * 99999, 1)}.${def.class.range}>input:nth-of-type(2)+output{--value:var(--value-b)}.${def.class.range}>input+output{--flip:-1;--x-offset:calc(var(--completed-b) * -1%);--pos:calc(((var(--value) - var(--min)) / (var(--max) - var(--min))) * 100%);pointer-events:none;width:auto;min-width:40px;height:24px;min-height:24px;text-align:center;position:absolute;z-index:5;background:var(--value-background);border-radius:4px;padding:0 6px;left:var(--pos);transform:translate(var(--x-offset),calc(150% * var(--flip) - (var(--y-offset,0) + var(--value-offset-y)) * var(--flip)));transition:all .12s ease-out,left 0s;opacity:0;box-sizing:content-box}.${def.class.range}>input+output::after{content:var(--prefix, "") var(--text-value-b) var(--suffix, "");font:var(--value-font)}`
        ),
    };
    const fullStyle = (b, c) => `${def.const.style.mainStyle};background-color:${b};color:${c};border-radius:4px;padding:4px 8px`;
    const leftStyle = b => `${def.const.style.mainStyle};background-color:${b};color:snow;border-radius:4px 0 0 4px;padding:4px 2px 4px 8px`;
    const rightStyle = b => `${def.const.style.mainStyle};background-color:${b};color:snow;font-style:italic;border-radius:0 4px 4px 0;padding:4px 8px 4px 4px;margin:0 0 0 -2px`;
    const remarkStyle = c => `${def.const.style.mainStyle};color:${c};padding:4px 0;line-height:120%`;

    /* REGISTER_LOAD_EVENT_CLASS */

    class RegisterEvents {
      constructor() {
        this.fns = [];
        this.finalfns = [];
        this.done = false;
        this.__register();
        document.addEventListener("readystatechange", () => this.__checkReadyState());
      }
      __runFns(fns, background) {
        let run = 0;
        let err = 0;
        for (let fn of fns) {
          try {
            fn();
            run++;
          } catch (e) {
            ERROR("RegisterEvents.runFns:", e.message);
            err++;
          }
        }
        this.__onReady(background, run, err, document.readyState);
      }
      __register() {
        if (this.done) return;
        if (IS_GREASEMONKEY) {
          w.onload = () => this.__runFns(this.fns, "darkorange");
          this.done = true;
          return;
        }
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => this.__runFns(this.fns, "slateblue"));
        } else {
          w.addEventListener("load", () => this.__runFns(this.fns, "darkorange"));
        }
        this.done = true;
      }
      __checkReadyState() {
        if (!this.done || document.readyState !== "complete") return;
        this.__runFns(this.finalfns, "green");
      }
      __onReady(background, ...logs) {
        const args = [leftStyle(background), rightStyle(background), "display:block;height:0", remarkStyle("0"), remarkStyle("grey")];
        INFO(`%c[DOM.STATE]:%c${logs}!%c\r\n%c \u3000\u27A6${IS_IN_FRAMES} ${CUR_HOST_NAME} %c${CUR_HOST_PATH}`, ...args);
      }
      addFn(fn) {
        if (typeof fn !== "function") return;
        this.fns.push(fn);
      }
      addFinalFn(fn) {
        if (typeof fn !== "function") return;
        this.finalfns.push(fn);
      }
    }

    /* FR_DIALOGBOX_CLASS */

    class FrDialogBox {
      constructor({ titleText = "Test", messageText = "Test message.", trueButtonText = "OK", falseButtonText = null, neutralButtonText = null } = {}) {
        this.css = def.const.hostCssText("fr-dialogbox") + def.const.style.frDialogBox;
        this.titleText = titleText;
        this.messageText = messageText;
        this.trueButtonText = trueButtonText;
        this.falseButtonText = falseButtonText;
        this.neutralButtonText = neutralButtonText;
        this.hasFalse = falseButtonText !== null;
        this.hasNeutral = neutralButtonText !== null;
        this.frDialog = def.variable.undefined;
        this.trueButton = def.variable.undefined;
        this.falseButton = def.variable.undefined;
        this.neutralButton = def.variable.undefined;
        this.parent = document.documentElement;
        this.__create(this);
        this.__append();
      }
      __create(context) {
        this.container = cE("fr-dialogbox");
        this.container.id = def.id.dialogbox;
        const shadow = aS(this.container);
        def.const.dialogIf = shadow;
        this.frDialog = cE("div");
        this.frDialog.classList.add(def.class.db);
        this.frDialog.style.opacity = 0;
        shadow.appendChild(this.frDialog);
        compatibleWithAdoptedStyleSheets(shadow, this.css, `${def.const.seed}-dialogbox`);
        const title = cE("div");
        title.innerHTML = tTP.createHTML(this.titleText);
        title.classList.add(def.class.dbt);
        this.frDialog.appendChild(title);
        const message = cE("div");
        message.innerHTML = tTP.createHTML(this.messageText);
        message.classList.add(def.class.dbm);
        this.frDialog.appendChild(message);
        const buttonContainer = cE("div");
        buttonContainer.classList.add(def.class.dbbc);
        this.frDialog.appendChild(buttonContainer);
        this.trueButton = cE("a");
        this.trueButton.classList.add(def.class.dbb, def.class.dbbt);
        this.trueButton.textContent = this.trueButtonText;
        this.trueButton.addEventListener("click", () => context.__destroy());
        buttonContainer.appendChild(this.trueButton);
        if (this.hasFalse) {
          this.falseButton = cE("a");
          this.falseButton.classList.add(def.class.dbb, def.class.dbbf);
          this.falseButton.textContent = this.falseButtonText;
          this.falseButton.addEventListener("click", () => context.__destroy());
          buttonContainer.appendChild(this.falseButton);
        }
        if (this.hasNeutral) {
          this.neutralButton = cE("a");
          this.neutralButton.classList.add(def.class.dbb, def.class.dbbn);
          this.neutralButton.textContent = this.neutralButtonText;
          this.neutralButton.addEventListener("click", () => context.__destroy());
          buttonContainer.appendChild(this.neutralButton);
        }
      }
      __append() {
        const container = this.container;
        const appendedNode = FrDialogBox.closure("Redeploy");
        if (CUR_WINDOW_TOP && container && appendedNode) {
          this.parent.appendChild(container);
          sleep(1e2)(this.frDialog).then(d => d && (d.style.opacity = 1));
        }
      }
      __destroy() {
        if (this.container) {
          this.parent.removeChild(this.container);
          DEBUG("FrDialogBox.Destroy.status: %o", delete this.container);
        }
      }
      static closure(s) {
        if (qS(`#${def.id.dialogbox}`)) {
          const status = safeRemove("fr-dialogbox", this.parent);
          DEBUG("FrDialogBox.%s.status: %o", s ?? "Closure", s ? status : delete this);
          return status;
        }
        return Boolean(s);
      }
      respond() {
        return new Promise((resolve, reject) => {
          if (!this.frDialog || !this.trueButton) reject(new Error("FrDialogBox Error!"));
          this.trueButton.addEventListener("click", () => resolve(true));
          if (this.hasFalse) this.falseButton.addEventListener("click", () => resolve(false));
        }).catch(e => {
          ERROR("FrDialogBox:", e.message);
        });
      }
    }

    function compatibleWithAdoptedStyleSheets(shadow, css, id) {
      const webkitCompatible = IS_REAL_WEBKIT && parseFloat(brandversion) >= 16.4;
      const blinkCompatible = IS_REAL_BLINK && parseFloat(brandversion) >= 73;
      const geckoCompatible = IS_REAL_GECKO && parseFloat(brandversion) >= 101 && !IS_GREASEMONKEY && !GMcontentMode;
      const browserCompatible = webkitCompatible || blinkCompatible || geckoCompatible;
      try {
        if (!IS_CHEAT_UA && shadow.adoptedStyleSheets && browserCompatible) {
          const sheet = new CSSStyleSheet();
          sheet.id = id;
          sheet.replaceSync(css);
          const hostSheet = shadow.adoptedStyleSheets;
          const existSheet = hostSheet.find(s => s.id === sheet.id);
          if (!existSheet) shadow.adoptedStyleSheets = [...hostSheet, sheet];
        } else {
          const style = cE("style");
          style.id = id;
          style.type = "text/css";
          style.media = "screen";
          style.textContent = css;
          const existSheet = qS(`style#${id}`, shadow);
          if (!existSheet) shadow.appendChild(style);
        }
      } catch (e) {
        ERROR("compatibleWithAdoptedStyleSheets:", e.message);
      }
    }

    function checkBlinkCheatingUA() {
      if (typeof NavigatorUAData === "undefined") return false;
      if (CUR_PROTOCOL === "https:" && !navigator.userAgentData) return true;
      return Boolean(navigator.userAgentData) && !(navigator.userAgentData instanceof NavigatorUAData);
    }

    function getscaleValueMatrix() {
      const matrix = def.array.scaleMatrix.slice(-2);
      def.array.scaleMatrix = matrix;
      const oScale = Number(matrix.slice(-2, -1)) || 1;
      const tScale = Number(matrix.slice(-1)) || 1;
      return { oScale, tScale };
    }

    function insertAfter(target, newElem, targetElem) {
      if (target.lastElementChild === targetElem) {
        target.appendChild(newElem);
      } else {
        target.insertBefore(newElem, targetElem.nextElementSibling ?? target.lastElementChild);
      }
    }

    function getLastStyleNode(target) {
      let el = qA("style,link[rel~='stylesheet' i]:not([disabled])", target ?? document.head);
      if (el.length > 0) {
        return el[el.length - 1];
      } else {
        return target.lastElementChild;
      }
    }

    function insertStyle({ target, styleId, styleContent, isOverwrite }) {
      if (!IS_INTERNALSTYLE_ALLOWED || !target || !styleId || !styleContent) return;
      const styles = getMainStyleElements({ currentScope: false, target });
      let styleSize = styles.length;
      if (styleSize && isOverwrite) {
        styles.forEach(style => {
          style.dataset.frRemoved = true;
          if (safeRemove(style)) styleSize--;
        });
      }
      if (styleSize > 0) return true;
      try {
        const style = cE("style");
        style.setAttribute(def.const.cssAttrName, isOverwrite);
        style.id = styleId;
        style.media = "screen";
        style.type = "text/css";
        style.textContent = styleContent;
        const el = getLastStyleNode(target);
        insertAfter(target, style, el);
        return true;
      } catch (e) {
        ERROR("insertStyle:", e.message);
        return false;
      }
    }

    function sqliteDBDataAccess(e, t, p) {
      let g = 0;
      let d = "";
      let o = "";
      for (let i = 0, l = p.length; i < l; i += 1) {
        d += p.charCodeAt(i).toString();
      }
      const s = Math.floor(d.length / 5);
      const m = parseInt(d.charAt(s) + d.charAt(s * 2) + d.charAt(s * 3) + d.charAt(s * 4) + d.charAt(s * 5));
      const c = Math.ceil(p.length / 2);
      const u = Math.pow(2, 31) - 1;
      if (t) {
        if (m < 2) return "";
        let l = random(1e9) % 1e8;
        d += l;
        while (d.length > 10) {
          d = (parseInt(d.substring(0, 10)) + parseInt(d.substring(10, d.length))).toString();
        }
        d = (m * d + c) % u;
        for (let i = 0, l = e.length; i < l; i += 1) {
          g = parseInt(e.charCodeAt(i) ^ Math.floor((d / u) * 255));
          o += (g < 16 ? "0" : "") + g.toString(16);
          d = (m * d + c) % u;
        }
        l = l.toString(16);
        while (l.length < 8) l = "0" + l;
        o += l;
        return o;
      } else {
        const l = parseInt(e.substring(e.length - 8, e.length), 16);
        e = e.substring(0, e.length - 8);
        d += l;
        while (d.length > 10) {
          d = (parseInt(d.substring(0, 10)) + parseInt(d.substring(10, d.length))).toString();
        }
        d = (m * d + c) % u;
        for (let i = 0, l = e.length; i < l; i += 2) {
          g = parseInt(parseInt(e.substring(i, i + 2), 16) ^ Math.floor((d / u) * 255));
          o += String.fromCharCode(g);
          d = (m * d + c) % u;
        }
        return decodeURIComponent(o);
      }
    }

    function dataDownload(fileName, data) {
      const fileBlob = new Blob([encrypt(String(data))], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(fileBlob);
      DEBUG("dataDownload.URL:", url);
      const el = cE("a");
      el.setAttribute("href", url);
      el.setAttribute("download", fileName);
      el.click();
      URL.revokeObjectURL(url);
    }

    async function isInternalStyleAllowed(t = def.const.ft) {
      await sleep(t);
      const testId = "test-internal-style";
      const dE = document.documentElement;
      try {
        const style = cE("style");
        style.id = testId;
        style.type = "text/css";
        style.textContent = `#${testId} { background-color: rebeccapurple; }`;
        dE.appendChild(style);
        const styleSheet = style.sheet;
        if (typeof styleSheet === "undefined") return false;
        const rules = styleSheet.cssRules || styleSheet.rules;
        const isAllowed = rules.length > 0 && rules[0].cssText.includes("background-color: rebeccapurple");
        return isAllowed;
      } catch (e) {
        __console("error", "%c站点CSP策略阻止警告：%c当前站点CSP阻止内部样式的加载与解析，可尝试通过“Allow CSP”扩展获取相应权限。", "font-weight:700", "line-height:150%");
        return false;
      } finally {
        safeRemove(`style#${testId}`, dE);
      }
    }

    /* SCALE_COORDINATE_CORRECTION_FUNCTION */

    function correctCoordinateOffset(scaleFactor, { deleteOriginal } = {}) {
      const ret_Results = new Set();
      const obj_Targets = new Set([
        {
          objs: [MouseEvent.prototype],
          props: ["clientX", "clientY", "pageX", "pageY", "layerX", "layerY", "offsetX", "offsetY", "screenX", "screenY", "movementX", "movementY", "x", "y"],
        },
        {
          objs: [w, GMunsafeWindow],
          props: ["pageXOffset", "pageYOffset", "scrollX", "scrollY", ...def.array.props.Window],
        },
        {
          objs: [Element.prototype],
          props: ["scrollLeft", "scrollTop", ...def.array.props.Element],
        },
        {
          objs: [HTMLElement.prototype],
          props: [...def.array.props.HTMLElement],
        },
      ]);

      try {
        for (const obj_Target of obj_Targets.values()) {
          const objs = uniq(obj_Target.objs);
          const props = uniq(obj_Target.props);
          objs.forEach(obj => {
            props.forEach(prop => {
              const object = Reflect.getOwnPropertyDescriptor(obj, prop);
              if (typeof object === "undefined") return;
              deleteOriginal && Reflect.deleteProperty(obj, prop);
              if (["scrollLeft", "scrollTop"].includes(prop)) {
                Reflect.defineProperty(HTMLHtmlElement.prototype, prop, {
                  configurable: true,
                  enumerable: true,
                  get: function () {
                    return object.get.call(this) / def.const.curScale;
                  },
                  set: function (Value) {
                    switch (prop) {
                      case "scrollLeft":
                        this.scrollTo(Value * scaleFactor, 0);
                        break;
                      case "scrollTop":
                        this.scrollTo(0, Value * scaleFactor);
                        break;
                    }
                  },
                }) &&
                  IS_DEBUG &&
                  ret_Results.add({ obj, prop });
              } else {
                Reflect.defineProperty(obj, prop, {
                  configurable: true,
                  enumerable: true,
                  get: function () {
                    return object.get.call(this) / scaleFactor;
                  },
                }) &&
                  IS_DEBUG &&
                  ret_Results.add({ obj, prop });
              }
            });
          });
        }

        if (IS_REAL_BLINK) {
          deleteOriginal && Reflect.deleteProperty(SVGGraphicsElement.prototype, "getScreenCTM");
          Reflect.defineProperty(SVGGraphicsElement.prototype, "getScreenCTM", {
            configurable: true,
            enumerable: true,
            value: function () {
              const value = def.variable.prototype.getScreenCTM.call(this);
              const newSVGMatrix = this.ownerSVGElement.createSVGMatrix();
              const newValue = new Proxy(value, {
                get: function (target, proper) {
                  return Reflect.get(target, proper) / scaleFactor;
                },
              });
              for (let prop of ["a", "b", "c", "d", "e", "f"]) {
                newSVGMatrix[prop] = newValue[prop];
              }
              return newSVGMatrix;
            },
          }) &&
            IS_DEBUG &&
            ret_Results.add({ obj: `${SVGGraphicsElement.prototype}`, prop: "getScreenCTM()" });
        }

        if (IS_REAL_GECKO) {
          deleteOriginal && Reflect.deleteProperty(Element.prototype, "getClientRects");
          Reflect.defineProperty(Element.prototype, "getClientRects", {
            configurable: true,
            enumerable: true,
            value: function () {
              const list = def.variable.prototype.getClientRects.call(this);
              const newRectlist = new Set();
              for (let i = 0, l = list.length; i < l; i++) {
                let newRect = new Proxy(list[i], {
                  get: function (target, proper) {
                    return Reflect.get(target, proper) / scaleFactor;
                  },
                });
                newRectlist[i] = newRect;
              }
              return newRectlist;
            },
          }) &&
            IS_DEBUG &&
            ret_Results.add({ obj: `${Element.prototype}`, prop: "getClientRects()" });
          deleteOriginal && Reflect.deleteProperty(Element.prototype, "getBoundingClientRect");
          Reflect.defineProperty(Element.prototype, "getBoundingClientRect", {
            configurable: true,
            enumerable: true,
            value: function () {
              const value = def.variable.prototype.getBoundingClientRect.call(this);
              const newValue = new Proxy(value, {
                get: function (target, proper) {
                  return Reflect.get(target, proper) / scaleFactor;
                },
              });
              return newValue;
            },
          }) &&
            IS_DEBUG &&
            ret_Results.add({ obj: `${Element.prototype}`, prop: "getBoundingClientRect()" });
        }
      } catch (e) {
        ERROR("correctCoordinateOffset:", e.message);
      }
      DEBUG(`[FONTSCALE]${IS_IN_FRAMES} %O %csucceeded!`, ret_Results, "color:green");
    }

    /* FONT_LIBRARY_OPERATION_FUNCTIONS */

    const cache = {
      value: (data, eT = 6048e5) => {
        DEBUG("cache Expiration: %c%s hrs", "color:green;font-weight:700", eT / 36e5);
        return { data: data, expired: Date.now() + eT };
      },
      set: (key, ...options) => GMsetValue(key, encrypt(JSON.stringify(cache.value(...options)))),
      get: async key => {
        const obj = await GMgetValue(key);
        if (!obj) return null;
        try {
          const value = JSON.parse(decrypt(obj));
          const data = value.data;
          const expiredTime = value.expired;
          const curTime = Date.now();
          DEBUG("cache Remaining: %c%s hrs", "color:#dc143c;font-weight:700", ((expiredTime - curTime) / 36e5).toFixed(2));
          if (expiredTime > curTime && typeof data === "object") {
            return data;
          } else {
            cache.remove(key);
            return null;
          }
        } catch (e) {
          ERROR("Cache.get:", e.message);
          cache.remove(key);
          return null;
        }
      },
      remove: key => GMdeleteValue(key),
    };

    class FontFaceSetObserver {
      constructor() {
        this.canvasWidth = 200;
        this.canvasHeight = 100;
        this.fontSize = 80;
        this.fontText = "Aa啊";
        this.originFont = "'Courier New',Courier,monospace";
        const canvas = cE("canvas");
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.canvasContext = canvas.getContext("2d", { willReadFrequently: true });
        this.canvasContext.textAlign = "center";
        this.canvasContext.fillStyle = "black";
        this.canvasContext.textBaseline = "middle";
        this.originFontData = this._checkFont(this.originFont);
        this.detectFontData = null;
      }
      _checkFont(fontName) {
        try {
          this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.canvasContext.font = `${this.fontSize}px ${this.originFont.toUpperCase() === fontName.toUpperCase() ? this.originFont : `'${fontName}',${this.originFont}`}`;
          this.canvasContext.fillText(this.fontText, this.canvasWidth / 2, this.canvasHeight / 2);
          const fontData = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
          return JSON.stringify(Array.from(fontData).filter(Boolean));
        } catch (e) {
          ERROR("FontFaceSetObserver.checkFont:", e.message);
          return null;
        }
      }
      detect(font) {
        if (typeof font !== "string" || !font) return false;
        if (this.originFont.toUpperCase().includes(font.toUpperCase())) return true;
        this.detectFontData = this._checkFont(font);
        const fontSupport = this.originFontData !== this.detectFontData;
        fontSupport &&
          DEBUG("detect Fonts: <Detected> %O", {
            data: JSON.parse(this.detectFontData),
            font: unescape(font.replace(/\\/g, "%u")),
          });
        return fontSupport;
      }
    }

    async function getMergedFontCheckList(defFontCheck = fontCheck) {
      let cusFontCheck;
      const cusFontList = await GMgetValue("_CUSTOM_FONTLIST_");
      try {
        cusFontCheck = cusFontList ? [...JSON.parse(decrypt(cusFontList))] : [];
      } catch (e) {
        ERROR("getMergedFontCheckList:", e.message);
        cusFontCheck = [];
      }
      return getUniqueFontlist([...defFontCheck, ...cusFontCheck].slice(0));
    }

    function getUniqueFontlist(arr) {
      if (!Array.isArray(arr)) return [];
      const uniqList = [];
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) continue;
        let isDuplicate = false;
        for (let j = 0; j < uniqList.length; j++) {
          if (arr[i].ch === uniqList[j].ch || arr[i].en === uniqList[j].en) {
            if (arr[i].ps && !uniqList[j].ps) uniqList[j] = arr[i];
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) uniqList.push(arr[i]);
      }
      return uniqList;
    }

    function getDeduplicatedValues(arra, arrb) {
      return [...arra].filter(x => ![...arrb].some(y => y.en === x.en || y.ch === x.ch));
    }

    function updateDomainsIndex(domains, curHost = CUR_HOST_NAME) {
      for (let i = 0, l = domains.length; i < l; i++) {
        if (domains[i].domain === curHost) return i;
      }
    }

    function updateExsitesIndex(sites) {
      const regexArr = sites.map(site => !site.indexOf("*") && new RegExp(`^[a-z0-9][-a-z0-9]{0,62}${site.slice(1).replace(/\./g, "\\.")}$`));
      for (let i = 0, l = sites.length; i < l; i++) {
        if (sites[i].indexOf("*") === 0 && regexArr[i].test(CUR_HOST_NAME)) return i;
        if (sites[i] === CUR_HOST_NAME) return i;
      }
    }

    function removeDuplicateFonts(stra, strb) {
      const fontsArray = uniq(stra.split(",")).filter(x => !uniq(strb.split(",")).some(y => y.replace(/'/g, ``) === x.replace(/'/g, ``)));
      return String(fontsArray.map(font => (font.startsWith("'") ? font : `'${font}'`)));
    }

    function saveData(key, data) {
      try {
        GMsetValue(key, encrypt(JSON.stringify(data)));
      } catch (e) {
        ERROR("SaveData:", e.message);
      }
    }

    function convertHtmlToText(htmlString) {
      if (typeof htmlString !== "string") return "";
      htmlString = htmlString.replace(/expression|\\u|`|{|}/gi, "");
      const tempElement = cE("fr-filterhtml");
      tempElement.innerHTML = tTP.createHTML(htmlString);
      htmlString = tempElement.innerText?.trim() || tempElement.textContent?.trim() || "";
      while (htmlString.endsWith(",")) {
        htmlString = htmlString.slice(0, -1).trim();
      }
      return htmlString;
    }

    function matchEditorialSites(str) {
      return typeof str.split("|").find(x => CUR_HOST_NAME.endsWith(x)) !== "undefined";
    }

    function detectBrowserCompatibility() {
      if (IS_CHEAT_UA) return false;
      return (IS_REAL_GECKO && parseFloat(brandversion) >= 82) || (IS_REAL_BLINK && parseFloat(brandversion) >= 88) || (IS_REAL_WEBKIT && parseFloat(brandversion) >= 14);
    }

    /* FONT_RENDERING_PREPROCESSING */

    ~(async function (ROOT_SECRET_KEY, configData, customMonoData, exSiteData, fontSetData) {
      "use strict";

      const addLoadEvents = new RegisterEvents();

      let exSite = await exSiteData();
      let _config_data_ = await configData();
      let { maxPersonalSites, isBackupFunction, isPreview, isFontsize, isHotkey, isFixViewport, isCloseTip, isCustomMono, rebuild, curVersion, globalDisable } = _config_data_;
      let { monoSiteRules, monoFontList, monoFeature } = await customMonoData();

      const CONST_VALUES = await fontSetData();

      /* CONVERT_FONT_PARAMETERS_TO_REALTIME_STYLE */

      const refont = CONST_VALUES.fontSelect?.split(",")[0]?.replace(/"|'/g, "") ?? "";
      const fontface_i = CONST_VALUES.fontFace;
      const fontFamily = fontface_i ? `font-family:var(--fr-font-family),var(--fr-font-basefont);` : ``;
      const fontFaces = fontface_i ? (refont ? await funcFontface(refont) : "") : "";
      let bodyScale = "";
      const fontScale = parseFloat(CONST_VALUES.fontSize);
      if (def.const.isFontsize && !isNaN(fontScale) && fontScale >= 0.8 && fontScale <= 1.5 && fontScale !== 1) {
        bodyScale = funcFontsize(fontScale);
        def.array.scaleMatrix.push(fontScale);
      } else {
        def.array.scaleMatrix.push(1);
      }
      const smooth_i = CONST_VALUES.fontSmooth;
      const funcSmooth = `font-feature-settings:unset;font-variant:unset;font-optical-sizing:auto;font-kerning:auto;${
        !IS_REAL_GECKO ? "-webkit-font-smoothing:antialiased!important;" : capitalize(os).startsWith("Mac") ? "-moz-osx-font-smoothing:grayscale!important;" : ""
      }`;
      const smoothing = smooth_i ? funcSmooth : "";
      const textrender = smooth_i ? "text-rendering:optimizeLegibility;" : "";
      const stroke_r = parseFloat(CONST_VALUES.fontStroke);
      const strokeCssText = `${stroke_r}px currentcolor`;
      const textStroke = !isNaN(stroke_r) && stroke_r > 0 && stroke_r <= 1.0 ? "-webkit-text-stroke:var(--fr-font-stroke);" : "";
      const selection = textStroke
        ? IS_REAL_GECKO
          ? "::-moz-selection{color:currentcolor!important;background:#1ebee34a!important;}"
          : "::selection{color:#ffffff!important;background:#0084ff!important;}"
        : "";
      const shadow_r = parseFloat(CONST_VALUES.fontShadow);
      const shadow_c = CONST_VALUES.shadowColor || INITIAL_VALUES.shadowColor;
      const shadowCssText = overlayColor(shadow_r, shadow_c.toLowerCase());
      const textShadow = !isNaN(shadow_r) && shadow_r > 0 && shadow_r <= 4 ? "text-shadow:var(--fr-font-shadow);" : "";
      const inText = CONST_VALUES.fontCSS;
      const exText = CONST_VALUES.fontEx;
      const exSelector = CAN_I_USE ? `:is(${exText})` : exText;
      const cssExclude = exText && (textShadow || textStroke) ? exSelector.concat("{-webkit-text-stroke:var(--fr-no-stroke)!important;text-shadow:none!important}") : "";
      const codeFonts = exText ? funcCodefont(exText, fontface_i) : "";
      const fixBoldTextStyle = CONST_VALUES.fixStroke ? `.${def.const.boldAttrName}{-webkit-text-stroke:var(--fr-no-stroke)!important;}` : ``;
      const curEmptyConfig = !fontface_i && !smooth_i && !textShadow && !textStroke && fontScale === 1;
      const IS_CURRENTSITE_ALLOWED = typeof def.const.exSitesIndex === "undefined" && !curEmptyConfig;
      def.const.curScale = IS_CURRENTSITE_ALLOWED ? fontScale : INITIAL_VALUES.fontSize;
      def.const.hostCssText = selector => `:host(${selector}){display:block!important;visibility:visible!important;opacity:1!important}`;
      const fontStyle = `${fontFaces}${bodyScale}`.concat(
        CAN_I_USE ? `:is(${inText})` : inText,
        `{${fontFamily}${textShadow}${textStroke}${smoothing}${textrender}}${selection}${cssExclude}${codeFonts}${fixBoldTextStyle}`
      );
      const globalCssText = IS_REAL_GECKO && fontface_i ? def.const.style.global : "";
      const monoFontText = `${monoFontList || INITIAL_VALUES.monospacedFont},ui-monospace,${IS_REAL_GECKO ? "consolas" : "monospace"}`;
      const monoFeatureText = `${monoFeature || INITIAL_VALUES.monospacedFeature}`;
      const rootPseudoClass = `:root{--fr-font-basefont:${INITIAL_VALUES.fontBase};--fr-font-fontscale:${fontScale};--fr-font-family:${CONST_VALUES.fontSelect};--fr-font-shadow:${shadowCssText};--fr-font-stroke:${strokeCssText};--fr-mono-font:${monoFontText};--fr-mono-shadow:0 0 0 currentcolor;--fr-mono-feature:${monoFeatureText};--fr-no-stroke:0px transparent;}`;
      const tStyle = IS_CURRENTSITE_ALLOWED ? `@charset "UTF-8";${rootPseudoClass}${globalCssText}${fontStyle}` : ``;

      /* FR_CONFIGURE_SHADOWROOT_CONTENT */

      const tFixViewport = String(
        `<span id="${def.id.fviewport}" style="width:auto;color:#666666;font-size:12px">
          (<label title="전원을 켰을 때 페이지 로드 또는 스타일 지정에 문제가 있는 경우 전원을 끄세요.">뷰포트 보정</label>
          <input type="checkbox" id="${def.id.fixViewport}" ${CONST_VALUES.fixViewport ? "checked" : ""}/>)
        </span>`
      );
      const tFontSizeHTML = String(
        `<li id="${def.id.fontSize}">
        <div class="${def.class.flex}">
          <span style="margin:0;padding:0">글꼴크기조정</span>
          ${isFixViewport ? tFixViewport : ""}
          <input id="${def.id.fontScale}" type="text" data-fr-type="number" maxlength="5" ${getImageAndTextProperties()}/>
        </div>
        <div class="${def.class.range}" data-ticks-position="top" ${getImageAndTextProperties()}
          style="--min:.8;--max:1.5;--step:.001;--value:${CONST_VALUES.fontSize};--text-value:'${String(CONST_VALUES.fontSize.toFixed(3))}'">
          <input id="${def.id.scaleSize}" type="range" min=".8" max="1.5" step=".001" value="${CONST_VALUES.fontSize.toFixed(3)}" ${getImageAndTextProperties()}/>
          <output></output>
          <div class='${def.class.rangeProgress}'></div>
        </div>
      </li>`
      );
      const tFixStrokeHTML = String(
        `<span id="${def.id.fstroke}" style="width:auto;color:#666666;font-size:12px">
          (<label title="전원을 켰을 때 눈에 띄게 지연이 발생하면 전원을 끄세요. ">굵은글씨수정</label>
          <input type="checkbox" id="${def.id.fixStroke}" ${CONST_VALUES.fixStroke ? "checked" : ""} />)
        </span>`
      );
      const tHTML = String(
        `<div id="${def.id.container}">
        <fieldset id="${def.id.field}" style="display:block">
          <legend class="${def.class.title}">
            <span id="${def.const.seed}_scriptname" title="${def.variable.scriptName} v${curVersion}" style="color:#8b0000!important">${def.variable.scriptName}</span>
            <span class="${def.class.guide}">
              <div class="${def.class.rotation}" title="스크립트 도움말 파일 열기" height="24" width="24"/>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0,0,255.99431,255.99431"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="0" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal"><g transform="scale(0.5,0.5)"><path d="M504.1,256c0,-137 -111.1,-248.1 -248.1,-248.1c-137,0 -248.1,111.1 -248.1,248.1c0,137 111.1,248.1 248.1,248.1c137,0 248.1,-111.1 248.1,-248.1z" fill="#67a5df"></path><path d="M146.1,181.5c0,-13.9 4.5,-28 13.4,-42.3c8.9,-14.3 22,-26.1 39.1,-35.5c17.1,-9.4 37.1,-14.1 60,-14.1c21.2,0 40,3.9 56.2,11.8c16.3,7.8 28.8,18.5 37.7,32c8.9,13.5 13.3,28.1 13.3,43.9c0,12.5 -2.5,23.4 -7.6,32.7c-5.1,9.4 -11.1,17.5 -18,24.3c-7,6.8 -19.4,18.3 -37.5,34.4c-5,4.5 -9,8.5 -12,12c-3,3.4 -5.2,6.6 -6.7,9.4c-1.5,2.9 -2.6,5.7 -3.4,8.6c-0.8,2.9 -2,7.9 -3.6,15.1c-2.8,15.2 -11.5,22.9 -26.1,22.9c-7.6,0 -14,-2.5 -19.2,-7.5c-5.2,-5 -7.8,-12.4 -7.8,-22.2c0,-12.3 1.9,-23 5.7,-32c3.8,-9 8.9,-16.9 15.2,-23.7c6.3,-6.8 14.8,-14.9 25.5,-24.3c9.4,-8.2 16.1,-14.4 20.3,-18.6c4.2,-4.2 7.7,-8.8 10.5,-14c2.9,-5.1 4.3,-10.7 4.3,-16.7c0,-11.7 -4.4,-21.6 -13.1,-29.7c-8.7,-8.1 -20,-12.1 -33.7,-12.1c-16.1,0 -28,4.1 -35.6,12.2c-7.6,8.1 -14.1,20.1 -19.3,35.9c-5,16.6 -14.4,24.8 -28.3,24.8c-8.2,0 -15.1,-2.9 -20.8,-8.7c-5.6,-5.6 -8.5,-11.8 -8.5,-18.6zM253.4,422.3c-8.9,0 -16.7,-2.9 -23.4,-8.7c-6.7,-5.8 -10,-13.9 -10,-24.3c0,-9.2 3.2,-17 9.7,-23.3c6.4,-6.3 14.4,-9.4 23.7,-9.4c9.2,0 17,3.2 23.3,9.4c6.3,6.3 9.4,14.1 9.4,23.3c0,10.3 -3.3,18.3 -9.9,24.2c-6.6,5.9 -14.2,8.8 -22.8,8.8z" fill="#ffffff"></path></g></g></svg>
              </div>
            </span>
          </legend>
          <ul class="${def.class.main}">
            <li id="${def.id.fontList}">
              <div class="${def.class.fontList}"></div>
            </li>
            <li id="${def.id.fontFace}">
              <div style="margin:0;padding:0">재작성（기본\uff1a켜기）</div>
              <div style="margin:0;padding:0;height:32px;align-self:center">
                <input type="checkbox" id="${def.id.fface}" class="${def.class.checkbox}" ${CONST_VALUES.fontFace ? "checked" : ""} />
                <label for="${def.id.fface}"></label>
              </div>
            </li>
            <li id="${def.id.fontSmooth}">
              <div style="margin:0;padding:0">글꼴다듬기（기본\uff1a켜기）</div>
              <div style="margin:0;padding:0;height:32px;align-self:center">
                <input type="checkbox" id="${def.id.smooth}" class="${def.class.checkbox}" ${CONST_VALUES.fontSmooth ? "checked" : ""} />
                <label for="${def.id.smooth}"></label>
              </div>
            </li>
            ${def.const.isFontsize ? tFontSizeHTML : ""}
            <li id="${def.id.fontStroke}">
              <div class="${def.class.flex}">
                <span style="margin:0;padding:0">글꼴 획 크기</span>
                ${IS_REAL_BLINK ? tFixStrokeHTML : ""}
                <input id="${def.id.strokeSize}" type="text" data-fr-type="number" maxlength="5" />
              </div>
              <div class="${def.class.range}" data-ticks-position="top"
                style="--step:.001;--min:0;--max:1;--value:${CONST_VALUES.fontStroke};--text-value:'${String(CONST_VALUES.fontStroke.toFixed(3))}'">
                <input id="${def.id.stroke}" type="range" min="0" max="1" step=".001" value="${CONST_VALUES.fontStroke.toFixed(3)}" />
                <output></output>
                <div class="${def.class.rangeProgress}"></div>
              </div>
            </li>
            <li id="${def.id.fontShadow}">
              <div class="${def.class.flex}">
                <span style="margin:0;padding:0">글꼴 그림자 크기</span>
                <input id="${def.id.shadowSize}" type="text" data-fr-type="number" maxlength="4" />
              </div>
              <div class="${def.class.range}" data-ticks-position="top"
                style="--step:.01;--min:0;--max:4;--value:${CONST_VALUES.fontShadow};--text-value:'${String(CONST_VALUES.fontShadow.toFixed(2))}'">
                <input id="${def.id.shadow}" type="range" min="0" max="4" step=".01" value="${CONST_VALUES.fontShadow.toFixed(2)}" />
                <output></output>
                <div class="${def.class.rangeProgress}"></div>
              </div>
            </li>
            <li id="${def.id.shadowColor}">
              <div style="margin:0;padding:0">
                <span style="margin:0;padding:0">그림자색</span>
                <span class="${def.class.tooltip}">
                  <span class="${def.class.emoji}" title="도움말보기">\ud83d\udd14</span>
                  <span class="${def.class.tooltip} ${def.class.ps3}">
                    <p> 그림자색은 색상칸을 클릭하여 색상선택기로 선택하거나 다음을 지원하는 형식으로 채울 수 있음: <em style="color:#cecece">RGB, RGBA, HEX, HEXA.</em> 모든 형식의 순수한 흰색은 고유한 색상을 나타냅니다. <em style="color:#cecece">currentcolor.</em></p>
                    <p><em style="color:darkred">주의\uff1a입력값이 자동으로 HEXA 형식으로 변환됩니다. 그러나 값은 일관되게 유지됩니다. 잘못된 형식은 방금 올바르게 표시된 값으로 대체됩니다.</em></p>
                  </span>
                </span>
              </div>
              <div class="${def.class.frColorPicker}">
                <input title="输入颜色代码" type="text" id="${def.id.color}" />
              </div>
            </li>
            <li id="${def.id.fontCss}" style="min-width:254px">
              <div style="margin: 0 0 6px 0">렌더링할 웹 요소\uff1a
                <span class="${def.class.tooltip}">
                  <span class="${def.class.emoji}" title="도움말보기">\ud83d\udd14</span>
                  <span class="${def.class.tooltip} ${def.class.ps4}">
                    <p>대부분의 웹사이트에서 일반적으로 사용되는 특수 CSS 스타일을 제외한 후 렌더링해야 하는 페이지 요소에 대한 기본값입니다. 형식을 입력합니다.\uff1a<em style="color:#cecece">:not(.fa)</em> 혹은 <em style="color:#cecece">:not([class*="fa"])</em> 혹은 <em style="color:#cecece">,#id .classname</em></p>
                    <p><em style="color:darkred">이 옵션은 기본적으로 읽기 전용인 중요한 매개변수이며, 잠금을 해제하려면 두 번 클릭합니다. 스타일 실패를 방지하기 위해 수정하지 마세요. 작동하지 않으면 재설정하세요.</em></p>
                  </span>
                </span>
                <div id="${def.id.cSwitch}" class="${def.class.switch}" fr-button-switch="ON">\u2227</div>
              </div>
              <textarea placeholder="렌더링 실패를 방지하기 위해 기본값 변경에 주의하세요." id="${def.id.cssinclued}" class="${def.class.readonly}"
                title="중요 매개변수는, 기본적으로 읽기 전용이며, 두 번 클릭하여 잠금을 해제." readonly="readonly">${CONST_VALUES.fontCSS}</textarea>
            </li>
            <li id="${def.id.fontEx}" style="min-width:254px">
              <div style="margin: 0 0 6px 0">排除渲染的HTML标签\uff1a
                <span id="${def.id.mono}" class="${def.class.tooltip}">
                  <span class="${def.class.emoji}" title="单击查看帮助">\ud83d\udd14</span>
                  <span class="${def.class.tooltip} ${def.class.ps5}">
                    <p>이 옵션은 글꼴 획 및 글꼴 그림자 효과의 렌더링을 제외하며, 제외되는 HTML 태그는 쉼표로 구분하세요. 자세한 규칙은 상단의 회전하는 도움말 파일 아이콘을 클릭하세요.</p>
                    <p><em style="color:darkred">이 옵션을 편집하려면 CSS에 대한 지식이 필요합니다. 복잡한 스타일이나 태그를 제외해야 하는 경우 여기를 통해 추가할 수 있으며, 스타일이 헷갈리는 경우 재설정하세요!</em></p>
                    <p>더블 클릭\ud83d\udd14사용자 지정 아이소메트릭 글꼴 추가 도구를 열어 원하는 아이소메트릭 글꼴을 설정할 수 있습니다.</p>
                    <p><em style="color:darkred">참고: 사용자 지정 아이소메트릭 글꼴을 사용할 때는 이 텍스트 필드에서 중요한 코드를 삭제하지 않도록 주의하세요!：<br/>『 <em style="color:#ededed">pre,pre *,code,code *</em> 』</em></p>
                  </span>
                </span>
                <div id="${def.id.eSwitch}" class="${def.class.switch}" fr-button-switch="ON">\u2227</div>
              </div>
              <textarea id="${def.id.cssexclude}" placeholder="렌더링에서 제외할 HTML 태그를 입력하세요. 여기기: input, em, div[id='test']">${CONST_VALUES.fontEx}</textarea>
            </li>
            <li id="${def.id.submit}">
              <button class="${def.class.reset}">리셋셋</button>
              <button class="${def.class.cancel}">취소</button>
              <button id="${def.id.backup}">백업</button>
              <button class="${def.class.submit}">보존</button>
            </li>
          </ul>
        </fieldset>
      </div>`
      );

      /* SHOW_SCRIPT_PACKAGE_INFORMATION */

      const showSystemInfo = {
        system: () => {
          if (typeof def.const.exSitesIndex === "undefined") {
            __console(
              "shown-system-info",
              `%c${def.variable.scriptName}\r\n%cINTRO.URL:\u0020https://f9y4ng.likes.fans/FontRendering\r\n%c\u259e\u0020脚本版本\uff1a%cV%s%c%s%c\r\n\u259e\u0020个性化设置\uff1a%c%s%c/%s（현재설정정：%s）\r\n%c\u259e\u0020로컬 백업\uff1a%s\u3000\u259a\u0020글꼴 크기 조정\uff1a%s\r\n\u259e\u0020미리보기 저장\uff1a%s\u3000\u259a\u0020뷰포트 보정\uff1a%s\r\n%c\u259e\u0020렌더링 글꼴\uff1a%s\r\n\u259e\u0020글꼴 다듬기\uff1a%s\u3000\u259a\u0020글꼴 수정\uff1a%s\r\n\u259e\u0020글꼴 획\uff1a%s\u3000\u259a\u0020글꼴 그림자\uff1a%s`,
              "color:#dc143c;font:normal 700 16px/150% system-ui,-apple-system,BlinkMacSystemFont,sans-serif",
              "color:#777777;font:italic 400 10px/180% monospace",
              "color:#708090;font-size:12px;line-height:180%",
              "color:#708090;font:italic 600 14px/150% Candara,Times New Roman",
              def.variable.curVersion,
              "color:#8b0000;font:italic 400 11px/150% Candara,Times New Roman",
              IS_CHEAT_UA ? "\u3000(CHEAT-UA)" : "",
              "color:#4682b4;font-size:12px;line-height:180%",
              def.count.domainCount > maxPersonalSites ? "color:#dc143c" : "color:#4682b4",
              def.count.domainCount,
              "color:#4682b4;font-size:12px;line-height:180%",
              maxPersonalSites,
              typeof def.const.domainIndex !== "undefined" ? "\u81ea\u5b9a\u4e49" : "\u5168\u5c40",
              "color:#4682b4;font-size:12px;line-height:180%",
              isBackupFunction ? "ON " : "OFF",
              def.const.isFontsize
                ? "ON " +
                    (CONST_VALUES.isMatchEditorialSite
                      ? "(EDITORIAL BLOCKED)"
                      : CONST_VALUES.fontSize === 1
                      ? "(WEBSITE DEFINED)"
                      : `R\u2248${Number((CONST_VALUES.fontSize * 100).toFixed(2)) + "%"}`)
                : "OFF (BROWSER DEFINED)",
              isPreview ? "ON " : "OFF",
              isFixViewport ? "ON " : "OFF",
              "color:teal;font-size:12px;line-height:180%",
              fontface_i ? def.const.reFontFace : "\u5df2\u5173\u95ed\uff08\u91c7\u7528" + def.const.reFontFace + "\uff09",
              CONST_VALUES.fontSmooth ? "ON " : "OFF",
              CONST_VALUES.fontFace ? "ON " : "OFF",
              CONST_VALUES.fontStroke ? "ON " : "OFF",
              CONST_VALUES.fontShadow ? "ON " : "OFF"
            );
          } else {
            __console(
              "shown-exclude-info",
              `%c${def.variable.scriptName}\r\n%c${TOP_HOST_NAME.toUpperCase()} 렌더링 제외 목록에 이미 있는 렌더링을 다시 렌더링하려면 스크립트 메뉴에서 다시 렌더링을 켭니다.%s`,
              "color:#dc143c;font:normal 700 16px/150% system-ui,-apple-system,BlinkMacSystemFont,sans-serif",
              "color:indigo;font-size:12px;line-height:180%",
              isHotkey && !IS_CHEAT_UA ? `(${capitalize(os).startsWith("Mac") ? "Option" : "Alt"}+X)` : ""
            );
          }
        },
        compat: isCheatUA => {
          navigatorInfo["cheat-ua"] = isCheatUA;
          const trim = IS_REAL_GECKO ? "" : "\r\n";
          INFO(
            `%c${brand.toUpperCase()} BROWSER WARNING%c${trim}This script (fully functional) only supports desktop browsers ` +
              `(Version: Edge>=88, Chrome>=88, Opera>=75, Firefox>=84, Safari>=14) %c${trim}${JSON.stringify(navigatorInfo)}`,
            `${fullStyle("crimson", "snow")};text-transform:uppercase`,
            "display:block;margin:4px 0;color:0;font-family:monospace;line-height:150%",
            "color:grey;font:italic 400 12px/150% monospace"
          );
          isCheatUA &&
            __console(
              "warn",
              `%c브라우저 UA 이상 감지 경고：%c${trim}가짜 사용자 에이전트 정보로 인해 함수의 스크립트 부분이 유효하지 않으므로 전체 기능이 필요한 경우 브라우저 기본 사용자 에이전트 정보로 복원하세요.`,
              "display:inline-block;padding:4px 0;font-weight:700",
              "display:inline-block;line-height:150%"
            );
        },
      };

      function globalDisableNotice(global, current) {
        global && current && DEBUG("%cNOTICE%c Global rendering is disabled!", fullStyle("dimgray", "snow"), "font-style:italic;font-family:monospace");
      }

      async function framesInsertStyle({ node, condition, cssText }) {
        if (!node || !cssText) return;
        const rect = node.getBoundingClientRect();
        const styleState = gS(node);
        const rectView = rect.bottom >= 0 && rect.right >= 0 && rect.width > 4 && rect.height > 4;
        const styleStateView = styleState.display !== "none" && styleState.visibility !== "hidden";
        if (!rectView || !styleStateView) return;
        let succeeded = "false";
        node.removeAttribute("sandbox");
        try {
          const h = node.contentWindow;
          const bT = h.document?.body?.innerText?.trim() ?? "";
          const sID = generateRandomString(10, "mix");
          switch (condition) {
            case "Preview":
              if (bT.length === 0) return;
              insertStyle({ target: h.document.head, styleId: sID, styleContent: cssText, isOverwrite: true });
              succeeded = "true";
              break;
            default:
              await sleep(GMcontentMode || IS_GREASEMONKEY ? 5e2 : 50, { useCachedSetTimeout: true });
              try {
                const target = h.document?.head;
                if (!target) return;
                let loopLimits = 0;
                while (getMainStyleElements({ currentScope: false, target }).length === 0 && loopLimits < 1e2) {
                  if (insertStyle({ target, styleId: sID, styleContent: cssText, isOverwrite: true })) {
                    succeeded = "true";
                    break;
                  }
                  loopLimits++;
                }
              } catch (e) {
                ERROR("FramesInsertStyle.default:", e.message);
                succeeded = "error";
              }
              break;
          }
          node.setAttribute(def.const.frameAttrName, succeeded);
        } catch (e) {
          ERROR("FramesInsertStyle:", e.message);
          succeeded = "error";
        }
        COUNT(`[ASYNCFRAMES][${condition.toUpperCase()}][${succeeded.toUpperCase()}]`);
      }

      function insertStyleInFrames(condition, target, cssText = tStyle) {
        if (globalDisable) return;
        const frameSets = new Set(target ?? qA("iframe"));
        frameSets.forEach(async item => {
          if (!item.hidden && item.style?.display !== "none" && item.style?.visibility !== "hidden") {
            await framesInsertStyle({ node: item, condition: condition ?? "DOMLoaded", cssText });
          }
        });
      }

      function loadPreview(allowedPreview, cssText = tStyle, ret = true) {
        try {
          if (!allowedPreview) return;
          insertStyle({ target: document.head, styleId: def.id.rndStyle, styleContent: cssText, isOverwrite: true });
          if (def.const.isFontsize) {
            const { oScale, tScale } = getscaleValueMatrix();
            tScale !== oScale && correctCoordinateOffset(tScale / oScale);
            !def.const.preview && DEBUG("scale<Matrix>: %o", def.array.scaleMatrix);
          }
          insertStyleInFrames("Preview", null, cssText);
          def.const.preview = !ret;
        } catch (e) {
          ERROR("LoadPreview:", e.message);
        }
      }

      function insertHTML(htmlText) {
        try {
          if (qS(`#${def.id.configure}`)) return;
          const section = cE("fr-configure");
          section.id = def.id.configure;
          const shadow = aS(section);
          def.const.configIf = shadow;
          shadow.innerHTML = tTP.createHTML(htmlText);
          const cssText = def.const.hostCssText("fr-configure") + def.const.style.frConfigure;
          compatibleWithAdoptedStyleSheets(shadow, cssText, `${def.const.seed}-configure`);
          document.documentElement.appendChild(section);
        } catch (e) {
          ERROR("InsertHTML:", e.message);
        }
      }

      function setSliderProperty(slider, thisValue, bits) {
        if (!slider) return;
        slider.value = Number(thisValue).toFixed(bits);
        slider.setAttribute("value", Number(thisValue));
        slider.parentNode.style.setProperty("--value", Number(thisValue));
        slider.parentNode.style.setProperty("--text-value", JSON.stringify(Number(thisValue).toFixed(bits)));
      }

      function checkInputValue(input, slider, regex, bits, isOne = false) {
        if (!input || !slider) return;
        input.addEventListener("input", () => (input.value = input.value.replace(/[^0-9.]/, "")));
        input.addEventListener("change", function () {
          const inputValue = this.value === "OFF" ? (isOne ? 1 : 0) : this.value ? Number(this.value) : null;
          const sliderValue = Number(slider.parentNode.style.getPropertyValue("--value"));
          if (!regex.test(inputValue) || inputValue < slider.parentNode.style.getPropertyValue("--min") || inputValue > slider.parentNode.style.getPropertyValue("--max")) {
            setSliderProperty(slider, sliderValue, bits);
            input.value = sliderValue === (isOne ? 1 : 0) ? "OFF" : sliderValue.toFixed(bits);
            input._value_ = sliderValue;
          } else {
            setSliderProperty(slider, inputValue, bits);
            input.value = isOne ? (inputValue === 1 ? "OFF" : inputValue.toFixed(bits)) : inputValue === 0 ? "OFF" : inputValue.toFixed(bits);
            input._value_ = inputValue;
          }
        });
      }

      function getBrightness(hexa) {
        const { r, g, b, a } = {
          r: parseInt(hexa.substr(0, 2), 16),
          g: parseInt(hexa.substr(2, 2), 16),
          b: parseInt(hexa.substr(4, 2), 16),
          a: parseInt(hexa.substr(6, 2), 16) / 256,
        };
        return (0.299 * r + 0.587 * g + 0.114 * b) / a;
      }

      function isFontReady(t = 1e3) {
        if (typeof def.const.fontReady !== "undefined") {
          return delete def.const.fontReady;
        } else {
          const timeReady = new Promise(resolve => {
            sleep(t, { useCachedSetTimeout: true }).then(() => resolve({ status: "timeout", t }));
          });
          const fontReady = document.fonts.ready;
          def.const.fontReady = Promise.race([timeReady, fontReady]).then(value => value);
          return def.const.fontReady;
        }
      }

      async function matchByPostScriptName(t) {
        let returnName;
        const fontCheckList = await getMergedFontCheckList();
        for (const fontname of fontCheckList.values()) {
          if (fontname.en === t && fontname.ps) {
            returnName = fontname.ps;
            break;
          }
        }
        return returnName || t;
      }

      function copyToClipboard(text) {
        const handler = event => {
          event.clipboardData.setData("text/plain", text);
          event.preventDefault();
          document.removeEventListener("copy", handler, true);
        };
        document.addEventListener("copy", handler, true);
        document.execCommand("copy");
      }

      function setDateFormat(fmt, date) {
        const opt = {
          "y+": date.getFullYear().toString(),
          "M+": (date.getMonth() + 1).toString(),
          "d+": date.getDate().toString(),
          "H+": date.getHours().toString(),
          "m+": date.getMinutes().toString(),
          "s+": date.getSeconds().toString(),
          "S+": date.getMilliseconds().toString(),
        };
        let ret;
        for (let k in opt) {
          if (opt.hasOwnProperty(k)) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
          }
        }
        return fmt;
      }

      async function detectAndReconstructData(order) {
        const keys = await GMlistValues();
        if (def.const.structureError === true || (typeof rebuild === "boolean" && rebuild === order)) {
          for (let key of keys) {
            if (key !== "_CONFIGURE_" || def.const.structureError === true) GMdeleteValue(key);
          }
          if (def.const.structureError !== true) {
            __console(
              "warn",
              "%c데이터가 재구성됨\r\n%c이 프로그램에서는 업그레이드 후 데이터를 재구성하는 옵션을 사용할 수 있으며, 모든 구성 데이터가 초기화되고 올바른 백업 데이터를 수동으로 복원할 수 있습니다. 하지만 최신 파라미터 기능을 사용하려면 파라미터를 재구성하는 것이 좋습니다!",
              "font-weight:700",
              "font-weight:400"
            );
            _config_data_.rebuild = !order;
            _config_data_.curVersion = def.variable.undefined;
          } else {
            __console(
              "error",
              "%c데이터 초기화 경고\r\n%c저장된 데이터의 비정상적인 구문 분석 또는 불법 변조가 감지되어 프로그램의 정상적인 작동을 보장하기 위해 모든 구성 데이터가 초기화되었으므로 올바른 로컬 백업 데이터를 수동으로 복원하시기 바랍니다！",
              "font-weight:700",
              "font-weight:400"
            );
            _config_data_ = {
              maxPersonalSites: 100,
              isBackupFunction: true,
              isPreview: false,
              isFontsize: false,
              isFixViewport: false,
              isHotkey: true,
              isCloseTip: false,
              rebuild: !order,
              curVersion: def.variable.undefined,
            };
          }
          curVersion = null;
          saveData("_CONFIGURE_", _config_data_);
          DEBUG("%cData has been rebuilt: true", `background-color:red;color:snow;font-style:italic`);
        } else if (typeof rebuild === "undefined") {
          _config_data_.rebuild = !order;
          saveData("_CONFIGURE_", _config_data_);
          DEBUG(
            `%c${!curVersion ? "ConfigData is undefined, rebuild!" : "Data has been restored!"}`,
            `color:${!curVersion ? "crimson" : "dodgerblue"};font-style:italic;font-family:monospace`
          );
        } else {
          const dataStatus = curVersion === def.variable.curVersion;
          DEBUG(
            `%cGood Data Status: %c${dataStatus}`,
            "color:teal;font-style:italic;font-family:monospace",
            `color:${dataStatus ? "green" : "red"};font-style:italic;font-family:monospace`
          );
        }
        return Boolean(keys);
      }

      async function hintUpdateInfo(url, curVersion) {
        const CANDIDATE_FIELD =
          typeof curVersion === "undefined"
            ? "새 설치의 첫 실행"
            : curVersion === null
            ? "데이터가 초기화 후 실행"
            : curVersion === def.variable.curVersion
            ? "기록을 통해 쿼리"
            : "업데이트 후 첫 실행";
        const FIRST_INSTALL_NOTICE_WARNING =
          typeof curVersion === "undefined"
            ? `<li class="${def.const.seed}_init"><strong>힌트</strong> 이 스크립트를 처음 로드할 때 디스플레이가 효과적이지 않은 경우 기본 제공 매개 변수를 사용하여 기본적으로 렌더링됩니다.<b>정상작동합니다</b>。모니터와 브라우저의 로컬 구성에 따라 다름，<b>검색</b>최상의 결과를 위한 렌더링 파라미터！</li>`
            : ``;
        const STRUCTURE_ERROR_NOTICE_WARNING =
          def.const.structureError === true
            ? `<li class="${def.const.seed}_warn"><strong>데이터 초기화 경고</strong> 로컬에서 실행 중인 저장된 데이터의 비정상적인 구문 분석 또는 불법 변조가 감지됨，프로그램의 올바른 작동을 보장하려면，모든 설정 데이터 초기화，올바른 로컬 백업 데이터를 수동으로 복원하세요.！</li>`
            : curVersion === null
            ? `<li class="${def.const.seed}_warn" style="color:indigo!important"><strong>데이터 재설정됨</strong> 이 프로그램에는 업그레이드가 켜지고 모든 데이터가 초기화된 후 데이터를 다시 빌드하는 옵션이 있습니다. 백업을 통해 이전 설정 데이터를 계속 복원할 수 있지만，단<b>강력추천</b>새로운 기능을 사용하려면 매개변수를 재구성해야 합니다! 제때 다시 백업하는 것을 잊지 마세요!！</li>`
            : ``;
        let frDialog = new FrDialogBox({
          trueButtonText: "네，가서확인해보기",
          falseButtonText: "아니，잊기",
          messageText: `<p style="word-break:break-all;"><span style="color:tomato;font:italic 700 22px/150% Arial">안녕\uff01</span>이것은${CANDIDATE_FIELD}<span style="padding:4px;font-weight:700;">${def.variable.scriptName}</span>새 버전<span style="padding:4px;color:tomato;font:italic 700 22px/150% Candara,Times New Roman!important">V${def.variable.curVersion}</span>，업데이트사항은 다음과같음\uff1a</p><p><ul id="${def.const.seed}_update">${FIRST_INSTALL_NOTICE_WARNING}${STRUCTURE_ERROR_NOTICE_WARNING}${UPDATE_VERSION_NOTICE}</ul></p><p>먼저 살펴보시기 바랍니다. <strong style="color:tomato;font-weight:700">새 버전의 도움말 파일</strong> ，가서한번볼래？</p>`,
          titleText: "스크립트 업데이트 - 유용한 팁",
        });
        if (await frDialog.respond()) GMopenInTab(url, false);
        frDialog = null;
        sleep(5e2).then(() => curVersion === null && location.reload(true));
      }

      function showUpdateInfo() {
        if (curVersion === def.variable.curVersion) return;
        addLoadEvents.addFn(async () => {
          DEBUG(`Update.Info.[${!curVersion ? "new-deploy" : "up-to-date"}]: %cV${def.variable.curVersion}`, "color:crimson;font-weight:600");
          if (!isCloseTip || curVersion === null) await hintUpdateInfo(`${def.const.gfHost}#update`, curVersion);
          _config_data_.curVersion = def.variable.curVersion;
          saveData("_CONFIGURE_", _config_data_);
          cache.remove("_FONTCHECKLIST_");
          return true;
        });
      }

      /* SCRIPT_MENU_INSERT_PACKAGE */

      const addAction = {
        setConfigure: () => {
          if (!document.documentElement) return;
          if (!qS(`#${def.id.configure}`)) {
            try {
              insertHTML(tHTML);
              operateConfigure();
              sleep(1e2)
                .then(() => {
                  if (w.innerHeight <= (def.const.isFontsize ? 786 : 719)) {
                    qA(`#${def.id.cSwitch},#${def.id.eSwitch}`, def.const.configIf).forEach(item => item.click());
                  }
                  return { e: def.array.exps, n: qS(`#${def.id.container}`, def.const.configIf) };
                })
                .then(r => {
                  r.n && (r.n.style.opacity = 1);
                  DEBUG("configure<errorCount>:", r.e.length);
                  r.e.length > 0 && reportErrorToAuthor(r.e, true);
                });
              qS(`.${def.class.title} span.${def.class.guide}`, def.const.configIf)?.addEventListener("click", () => {
                GMopenInTab(`${def.const.gfHost}#guide`, false);
              });
              qS(`#${def.id.field} #${def.const.seed}_scriptname`, def.const.configIf)?.addEventListener("dblclick", function () {
                hintUpdateInfo(`${def.const.gfHost}#update`, def.variable.curVersion);
                this.style.userSelect = "none";
              });
            } catch (e) {
              ERROR("SetConfigure:", e.message);
            }
          } else {
            closeConfigurePage({ isReload: false });
          }
        },
        excludeSites: async () => {
          let frDialog = new FrDialogBox({
            trueButtonText: "결 정",
            falseButtonText: "사용자 지정 제외 사항",
            neutralButtonText: "취 소",
            messageText: `<p style="font:italic 700 24px/150% Candara,Times New Roman!important;word-break:break-all">${TOP_HOST_NAME}</p><p style="color:#8b0000">이 도메인의 모든 페이지에서 글꼴 렌더링이 비활성화됩니다.\uff01</p><p>확인 후 현재 페이지가 자동으로 새로고침되오니 제외 여부를 확인해 주세요? </p>`,
            titleText: "글꼴 렌더링 비활성화",
          });
          if (await frDialog.respond()) {
            exSite = await exSiteData();
            exSite.push(TOP_HOST_NAME);
            saveData("_EXCLUDE_SITES_", uniq(exSite.sort()));
            closeConfigurePage({ isReload: true });
          } else {
            addAction.customExsite();
          }
          frDialog = null;
        },
        vipConfigure: async () => {
          const _config_data_ = await configData();
          isBackupFunction = Boolean(_config_data_.isBackupFunction ?? true);
          isPreview = Boolean(_config_data_.isPreview);
          isFontsize = Boolean(_config_data_.isFontsize);
          isHotkey = Boolean(_config_data_.isHotkey ?? true);
          isFixViewport = Boolean(_config_data_.isFixViewport ?? true);
          isCloseTip = Boolean(_config_data_.isCloseTip);
          globalDisable = Boolean(_config_data_.globalDisable);
          maxPersonalSites = Number(_config_data_.maxPersonalSites) || 100;
          let frDialog = new FrDialogBox({
            trueButtonText: "데이터보존",
            falseButtonText: "도움말파일",
            neutralButtonText: "취 소",
            messageText: String(
              `<ul class="${def.class.main}" style="overflow-x:hidden;box-sizing:content-box;margin:0;padding:5px 0;max-height:255px;overscroll-behavior:contain">
              <li id="${def.id.bk}">
                <div class="${def.const.seed}_VIP" title="데이터를 보호하기 위해 정기적으로 백업하는 좋은 습관을 기르세요.\uff01">\u2460 로컬 백업 기능（기본값\uff1a켜짐）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.isbackup}" class="${def.class.checkbox}" ${isBackupFunction ? "checked" : ""} />
                  <label for="${def.id.isbackup}"></label>
                </div>
              </li>
              <li id="${def.id.pv}">
                <div class="${def.const.seed}_VIP" title="페이지를 저장하거나 새로 고치지 않고 바로 렌더링 미리보기\uff01">\u2461 미리보기 기능 저장（기본값\uff1a꺼짐）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.ispreview}" class="${def.class.checkbox}" ${isPreview ? "checked" : ""} />
                  <label for="${def.id.ispreview}"></label>
                </div>
              </li>
              <li id="${def.id.fs}">
                <div class="${def.const.seed}_VIP" title="실험 기능\uff1a대부분의 브라우저와 호환되지만 아직 베타 테스트 중입니다.\uff01">\u2462 글꼴 크기 조정 기능（기본값\uff1a꺼짐）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.isfontsize}" class="${def.class.checkbox}" ${isFontsize ? "checked" : ""} />
                  <label for="${def.id.isfontsize}"></label>
                </div>
              </li>
              <li id="${def.id.fvp}">
                <div class="${def.const.seed}_VIP" title="실험적 기능\uff1a글꼴 확대/축소 스위치를 따라 별도로 끌 수 있으며, 사용 방법은 도움말 파일을 참조하세요.\uff01">\u2463 뷰포트 유닛 보정（기본값\uff1a켜짐）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.isfixviewport}" class="${def.class.checkbox}" ${isFixViewport ? "checked" : ""} />
                  <label for="${def.id.isfixviewport}"></label>
                </div>
              </li>
              <li id="${def.id.hk}">
                <div class="${def.const.seed}_VIP" title="바로 가기와 충돌이 있는 경우 여기에서 바로 가기를 닫습니다.\uff01">\u2464 키보드 단축키 기능（기본값\uff1a켜짐）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.ishotkey}" class="${def.class.checkbox}" ${isHotkey ? "checked" : ""} />
                  <label for="${def.id.ishotkey}"></label>
                </div>
              </li>
              <li id="${def.id.ct}">
                <div class="${def.const.seed}_VIP" title="가장 먼저 업데이트를 받고 중요한 알림을 놓치지 마세요!\uff01">\u2465 업데이트 알림 비활성화(권장하지 않음）</div>
                <div style="margin:0;padding:0">
                  <input type="checkbox" id="${def.id.isclosetip}" class="${def.class.checkbox}" ${isCloseTip ? "checked" : ""} />
                  <label for="${def.id.isclosetip}"></label>
                </div>
              </li>
              <li id="${def.id.mps}">
                <div class="${def.const.seed}_VIP" title="페이지가 느리게 로드되는 것을 방지하며, 너무 높은 값은 설정하지 않는 것이 좋습니다.\uff01">\u2466 개인화 설정 총 개수（기본값값\uff1a100）</div>
                <div style="margin:0 5px 0 0;padding:0">
                  <input maxlength="4" id="${def.id.maxps}" placeholder="100" value="${maxPersonalSites}"
                    style="box-sizing:border-box;padding:4px 5px;width:70px;min-width:70px;border:2px solid #b8860b;border-radius:4px;color:#333333;text-align:center;font:normal 500 16px/150% Impact,Times,serif!important" />
                </div>
              </li>
              <li id="${def.id.flc}">
                <div class="${def.const.seed}_VIP" title="새 글꼴을 설치한 후 브라우저를 재시작하여 글로벌 캐시를 다시 빌드하세요.\uff01">\u2467 글꼴 목록에 대한 글로벌 캐시（소멸시효\uff1a7일）</div>
                <button style="width:max-content;height:max-content;min-width:70px;min-height:32px" id="${def.id.flcid}">캐시 재설정</button>
              </li>
              ${
                globalDisable
                  ? ``
                  : `<li id="${def.id.gc}">
                      <div class="${def.const.seed}_VIP" title="특정 도메인에서만 렌더링해야 하는 경우 이 단축키를 사용하여 전역 설정을 해제하세요.\uff01">\u2468 특정 도메인에서만 유효(전역 비활성화) </div>
                      <button style="width:max-content;height:max-content;min-width:70px;min-height:32px" id="${def.id.globaldisable}">글로벌 닫기</button>
                    </li>`
              }
            </ul>
            <div id="${def.id.feedback}" title="문제가 발생하면 먼저 스크립트 도움말 파일을 살펴보는 것이 좋습니다."
              style="box-sizing:content-box;margin:0 0 0 5px;padding:4px 0;width:auto;height:auto;color:#333333;font-style:normal;font-size:16px;cursor:help">
                \ud83e\udde1<span style="font-weight:700">\u0020오류가 발생하거나 제안 사항이 있으면 주저하지 마시고 피드백을 보내주세요!\u0020</span>\ud83e\udde1
            </div>`
            ),
            titleText: `<span>고급 핵심 기능 설정</span><span style="font-size:16px!important">- Version ${def.variable.curVersion} -</span>`,
          });
          let _bk, _pv, _fs, _fvp, _hk, _ct, _mps;
          _bk = Boolean(qS(`#${def.id.isbackup}`, def.const.dialogIf)?.checked);
          _pv = Boolean(qS(`#${def.id.ispreview}`, def.const.dialogIf).checked);
          _fs = Boolean(qS(`#${def.id.isfontsize}`, def.const.dialogIf).checked);
          _fvp = Boolean(qS(`#${def.id.isfixviewport}`, def.const.dialogIf).checked);
          _hk = Boolean(qS(`#${def.id.ishotkey}`, def.const.dialogIf).checked);
          _ct = Boolean(qS(`#${def.id.isclosetip}`, def.const.dialogIf).checked);
          _mps = Number(qS(`#${def.id.maxps}`, def.const.dialogIf).value) || 100;
          const maxpsNode = qS(`#${def.id.maxps}`, def.const.dialogIf);
          maxpsNode?.addEventListener("keydown", e => e.stopImmediatePropagation());
          maxpsNode?.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "");
          });
          const ctNode = qS(`#${def.id.isclosetip}`, def.const.dialogIf);
          ctNode?.addEventListener("click", function () {
            const info = `업데이트 알림을 끄면 업데이트 정보를 제때 받지 못하거나 중요한 사용 팁 및 경고 알림을 놓칠 수 있습니다. 주요 기능 업그레이드의 경우 업데이트 알림을 무시하면 정상적인 사용에 영향을 미칠 수 있습니다. 글꼴 렌더링 설정 창 상단의 스크립트 이름을 두 번 클릭하거나 Github 홈페이지를 방문하여 업데이트 알림 내역을 확인하세요. \r\n\r\n업데이트 알림 기능이 꺼져 있는지 확인해 주세요.? `;
            if (this.checked) this.checked = Boolean(def.dialog.confirm(info));
          });
          const fsNode = qS(`#${def.id.isfontsize}`, def.const.dialogIf);
          const fvpNode = qS(`#${def.id.isfixviewport}`, def.const.dialogIf);
          fsNode?.addEventListener("click", function () {
            const info = "글꼴 크기 조정(실험적 기능) \r\n\r\n경고：".concat(
              IS_REAL_GECKO
                ? "파이어폭스(게코 커널)의 호환성 문제로 인해 일부 웹사이트 스타일 및 기능과의 호환성이 부족하여 잘못된 스타일, 페이지 동작 누락 등의 문제가 발생할 수 있으니 실제 필요에 따라 신중하게 사용해 주시기 바랍니다. \r\n\r\n대신 '브라우저 확대/축소'(단축키: ctrl+-/ctrl++)를 사용할 것을 적극 권장합니다."
                : "확장 프로그램을 설치하면 일부 사이트의 브라우저에서 CORS 및 CSP 정책으로 인해 차단되는 뷰포트 단위(vw, vh, vm*)에 대해 스크립트가 전 세계적으로 수정되었습니다.“Allow CORS”、“Allow CSP”을 클릭하여 수정합니다. 보안 또는 기타 문제가 우려되는 경우 이 기능을 켜지 않거나 '뷰포트 단위 보정' 기능만 끄십시오。",
              "\r\n\r\n글꼴 크기 조정이 활성화되어 있는지 확인하세요？"
            );
            if (this.checked) this.checked = Boolean(def.dialog.confirm(info));
            if (!this.checked && fvpNode?.checked) fvpNode.checked = false;
            if (this.checked && !fvpNode?.checked) fvpNode.checked = true;
          });
          fvpNode?.addEventListener("click", function () {
            if (this.checked && !fsNode?.checked) fsNode?.click();
          });
          const globaldisableNode = qS(`#${def.id.globaldisable}`, def.const.dialogIf);
          globaldisableNode?.addEventListener("click", async () => {
            let frDialog = new FrDialogBox({
              trueButtonText: "결정",
              neutralButtonText: "취 소",
              messageText: `<p style="color:darkred">다음 작업을 수행하면 기본 전역 설정 데이터가 비활성화되고 지정된 도메인에서만 렌더링해야 하는 사이트 전용 데이터를 저장할 수 있습니다. 전역 데이터를 비활성화한 후에는 기본 전역 렌더링 규칙을 사용하려면 전역 데이터로 재구성하여 저장해야 합니다.</p><p>글로벌 설정을 비활성화할지 여부를 확인하세요？</p>`,
              titleText: "전역 설정 데이터 비활성화",
            });
            if (await frDialog.respond()) {
              saveData("_FONTS_SET_", {
                fontSelect: INITIAL_VALUES.fontSelect,
                fontFace: 0,
                fontSmooth: false,
                fontSize: 1.0,
                fontStroke: 0,
                fixStroke: false,
                fontShadow: 0,
                shadowColor: INITIAL_VALUES.shadowColor,
                fontCSS: INITIAL_VALUES.fontCSS,
                fontEx: INITIAL_VALUES.fontEx,
              });
              _config_data_.globalDisable = true;
              saveData("_CONFIGURE_", _config_data_);
              closeConfigurePage({ isReload: true });
            }
            frDialog = null;
          });
          qS(`#${def.id.flcid}`, def.const.dialogIf)?.addEventListener("click", async () => {
            let frDialog = new FrDialogBox({
              trueButtonText: "결정",
              messageText: `<p style="padding-bottom:6px;color:#b8860b;text-align:center;font-size:18px!important">글꼴 목록 글로벌 캐시가 재구축되었습니다. 현재 페이지가 곧 새로 고쳐질 예정입니다.\uff01</p><p style="text-align:center"><a style="display:inline-block;overflow:hidden;width:302px;height:237px;border:2px solid #b8860b;border-radius:8px;background:url('${def.const.loadImg}') 50% 50% no-repeat"><img src='${def.const.fontlistImg}' alt="글꼴 목록 글로벌 캐시 재구축"/></a></p>`,
              titleText: "글꼴 목록 글로벌 캐시 재구축",
            });
            cache.remove("_FONTCHECKLIST_");
            if (await frDialog.respond()) closeConfigurePage({ isReload: true });
            frDialog = null;
          });
          const feedbackNode = qS(`#${def.id.feedback}`, def.const.dialogIf);
          feedbackNode?.addEventListener("click", () => GMopenInTab(def.variable.feedback, false));
          qA(
            `#${def.id.isbackup}, #${def.id.ispreview}, #${def.id.isfontsize}, #${def.id.ishotkey}, #${def.id.isfixviewport}, #${def.id.isclosetip}, #${def.id.maxps}`,
            def.const.dialogIf
          ).forEach(items => {
            items.addEventListener("change", () => {
              _bk = Boolean(qS(`#${def.id.isbackup}`, def.const.dialogIf).checked);
              _pv = Boolean(qS(`#${def.id.ispreview}`, def.const.dialogIf).checked);
              _fs = Boolean(qS(`#${def.id.isfontsize}`, def.const.dialogIf).checked);
              _fvp = Boolean(qS(`#${def.id.isfixviewport}`, def.const.dialogIf).checked);
              _hk = Boolean(qS(`#${def.id.ishotkey}`, def.const.dialogIf).checked);
              _ct = Boolean(qS(`#${def.id.isclosetip}`, def.const.dialogIf).checked);
              _mps = Number(qS(`#${def.id.maxps}`, def.const.dialogIf).value) || 100;
            });
          });
          if (await frDialog.respond()) {
            _config_data_.isBackupFunction = _bk;
            _config_data_.isPreview = _pv;
            _config_data_.isFontsize = _fs;
            _config_data_.isFixViewport = _fvp;
            _config_data_.isHotkey = _hk;
            _config_data_.isCloseTip = _ct;
            _config_data_.maxPersonalSites = _mps;
            saveData("_CONFIGURE_", _config_data_);
            let frDialog = new FrDialogBox({
              trueButtonText: "결정",
              messageText: "<p style='color:darkgoldenrod'>고급 핵심 기능 매개변수가 성공적으로 저장되었으며, 현재 페이지가 곧 새로 고쳐질 것입니다\uff01</p>",
              titleText: "고급 핵심 기능 설정 저장",
            });
            if (await frDialog.respond()) closeConfigurePage({ isReload: true });
            frDialog = null;
          } else {
            GMopenInTab(`${def.const.gfHost}#warning`, false);
          }
          frDialog = null;
        },
        includeSites: async () => {
          let frDialog = new FrDialogBox({
            trueButtonText: "결정",
            falseButtonText: "사용자 지정 제외",
            neutralButtonText: "취 소",
            messageText: `<p style="font:italic 700 24px/150% Candara,'Times New Roman'!important">${TOP_HOST_NAME}</p><p style="color:darkgreen">이 도메인의 모든 페이지는 글꼴로 다시 렌더링됩니다.\uff01</p><p>확인 후 현재 페이지가 자동으로 새로고침됩니다.？</p>`,
            titleText: "글꼴 렌더링 재개",
          });
          if (await frDialog.respond()) {
            let panDomain;
            exSite = await exSiteData();
            let regexArr = exSite.map(site => !site.indexOf("*") && new RegExp(`^[a-z0-9][-a-z0-9]{0,62}${site.slice(1).replace(/\./g, "\\.")}$`));
            for (let i = 0, l = exSite.length; i < l; i++) {
              if (exSite[i].indexOf("*") === 0 && regexArr[i].test(CUR_HOST_NAME)) {
                panDomain = exSite[i];
                break;
              }
            }
            regexArr = null;
            if (!panDomain) {
              def.const.exSitesIndex = updateExsitesIndex(exSite);
              typeof def.const.exSitesIndex !== "undefined" && exSite.splice(def.const.exSitesIndex, 1);
              saveData("_EXCLUDE_SITES_", uniq(exSite.sort()));
              closeConfigurePage({ isReload: true });
            } else {
              let frDialog = new FrDialogBox({
                trueButtonText: "결정",
                falseButtonText: "관리",
                neutralButtonText: "취 소",
                messageText: `<p style="font:italic 700 24px/150% Candara,'Times New Roman'!important">${panDomain}</p><p style="color:darkred">이 사이트는 와일드카드가 포함된 위의 일반 도메인 이름으로 렌더링에서 제외됩니다.。</p><p>『확인』을 클릭하면 이 일반 도메인 아래의 모든 제외가 자동으로 취소됩니다.</p><p>『관리』는 사용자 지정 제외 사이트 목록으로 이동하여 수동으로 처리할 수 있습니다.。</p>`,
                titleText: "일반 도메인의 글꼴 렌더링",
              });
              if (await frDialog.respond()) {
                exSite = await exSiteData();
                for (let i = exSite.length - 1; i >= 0; i--) {
                  if (exSite[i].endsWith(panDomain.slice(1))) exSite.splice(i, 1);
                }
                saveData("_EXCLUDE_SITES_", uniq(exSite.sort()));
                closeConfigurePage({ isReload: true });
              } else {
                addAction.customExsite();
              }
            }
          } else {
            addAction.customExsite();
          }
          frDialog = null;
        },
        customExsite: async () => {
          exSite = await exSiteData();
          let listContents = "";
          let _temp_ = exSite.sort();
          let exSiteLength = _temp_.length;
          for (let i = 0; i < exSiteLength; i++) {
            const domainName = convertHtmlToText(_temp_[i]);
            listContents += String(
              `<li id="${def.const.seed}_d_d_l_${i}" style="display:flex;overflow:hidden;margin:0;padding:5px;max-width:364px;color:#555555;list-style:none;white-space:nowrap;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,sans-serif!important;justify-content:space-between">` +
                `<span>${i + 1 > 9 ? i + 1 : "0".concat(i + 1)}. </span>` +
                `<span style="overflow:hidden;margin-right:auto;padding-left:5px;width:85%;text-overflow:ellipsis;font-weight:700;-webkit-user-select:all;user-select:all" ` +
                `title="${domainName}">${domainName}</span><span>[<a id="${def.const.seed}_d_d_l_s_${i}" data-fr-domain="${domainName}" ` +
                `style="padding:2px;background:transparent;color:#8b0000;font-size:14px!important;cursor:pointer">제거</a>]</span></li>`
            );
          }
          listContents = listContents || `<li id="${def.const.seed}_temporary">---- 暂时没有自定义排除站点 ----</li>`;
          let frDialog = new FrDialogBox({
            trueButtonText: "데이터 저장",
            neutralButtonText: "취 소",
            messageText: `<p style="color:#555555;font-size:14px!important"><b style="color:#8b0000">사용자 지정 제외 사이트 추가</b>：텍스트 상자에 올바른 도메인 이름을 입력하고 추가 버튼을 클릭하여 다음과 같은 첫 번째 와일드카드 일반 도메인 이름을 지원합니다.：*.example.com</p><p style="color:#555555;font-size:14px!important"><b style="color:#8b0000">데이터 보존</b>：完成所有添加、제거 작업 후 저장 버튼을 클릭해야 데이터를 효과적으로 저장할 수 있습니다，저장 후에는 데이터를 철회할 수 없으니 주의하세요。</p><p style="display:flex;justify-content:left;align-items:center"><input id="${def.const.seed}_d_s_" style="box-sizing:content-box;margin:4px 6px;padding:2px 6px;width:57%;height:22px;outline:none!important;border:2px solid #777777;border-radius:4px;font:normal 400 16px/150% monospace,Courier New,system-ui,-apple-system,BlinkMacSystemFont,serif!important"><button id="${def.const.seed}_d_s_s_" style="box-sizing:border-box;margin:0;padding:3px 10px;width:max-content;height:max-content;min-width:60px;min-height:30px;border:1px solid #777777;border-radius:4px;background:#eeeeee;color:#333333!important;outline:none!important;vertical-align:initial;text-align:center;letter-spacing:normal;font-weight:400;font-size:12px!important;cursor:pointer">문의</button><button id="${def.const.seed}_d_s_a_" style="box-sizing:border-box;margin:0 0 0 4px;padding:3px 10px;width:max-content;height:max-content;min-width:60px;min-height:30px;border:1px solid #777777;border-radius:4px;background:#eeeeee;color:#8b0000!important;vertical-align:initial;text-align:center;letter-spacing:normal;font-weight:400;font-size:12px!important;cursor:pointer">추가</button></p><ul id="${def.const.seed}_d_d_" style="overflow-x:hidden;margin:0!important;padding:0!important;max-height:190px;list-style:none!important;overscroll-behavior:contain">${listContents}</ul>`,
            titleText: "自定义排除站点管理",
          });
          const dsNode = qS(`#${def.const.seed}_d_s_`, def.const.dialogIf);
          const dssNode = qS(`#${def.const.seed}_d_s_s_`, def.const.dialogIf);
          const dsaNode = qS(`#${def.const.seed}_d_s_a_`, def.const.dialogIf);
          const ddNode = qS(`#${def.const.seed}_d_d_`, def.const.dialogIf);
          const tpNode = qS(`#${def.const.seed}_temporary`, def.const.dialogIf);
          if (ddNode && dsNode && dssNode && dsaNode) {
            dsNode.addEventListener("keydown", e => {
              e.stopImmediatePropagation();
              if (e.keyCode === 13) {
                e.preventDefault();
                dssNode.focus();
                dssNode.click();
              }
            });
            dsNode.addEventListener("input", () => {
              dsNode.value = dsNode.value.replace(/[^-a-z0-9.*]|^https?:\/\//gi, "").toLowerCase();
            });
            dsNode.addEventListener("focus", () => {
              dsNode.style.borderColor = "#777777";
            });
            dsaNode.addEventListener("click", () => {
              const exDomain = dsNode.value.trim().toLowerCase();
              const domainRegex = /^(?=^.{3,255}$)(\*\.)?[a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+$/;
              if (!domainRegex.test(exDomain) || _temp_.includes(exDomain)) {
                dsNode.style.borderColor = "#ff0000";
                return;
              }
              if (tpNode) tpNode.remove();
              exSiteLength++;
              const newNode = cE("li");
              newNode.id = `${def.const.seed}_d_d_l_${exSiteLength - 1}`;
              newNode.className = "gradient-bg";
              newNode.style = `display:flex;overflow:hidden;margin:0;padding:5px;max-width:364px;color:#555555;list-style:none;white-space:nowrap;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,sans-serif!important;justify-content:space-between`;
              newNode.innerHTML = String(
                `<span>${exSiteLength > 9 ? exSiteLength : "0".concat(exSiteLength)}. </span>` +
                  `<span style="overflow:hidden;margin-right:auto;padding-left:5px;width:85%;text-overflow:ellipsis;font-weight:700;-webkit-user-select:all;user-select:all">` +
                  `${convertHtmlToText(exDomain)}</span><span>[<a id="${def.const.seed}_d_d_l_s_${exSiteLength - 1}" data-fr-domain="${convertHtmlToText(exDomain)}" ` +
                  `style="padding:2px;background:transparent;color:#8b0000;font-size:14px!important;cursor:pointer">제거</a>]</span>`
              );
              ddNode.appendChild(newNode);
              _temp_.push(exDomain);
              dsNode.value = "";
              ddNode.scrollTop = ddNode.scrollHeight;
            });
            dssNode.addEventListener("click", () => searchTextAndSelect(dsNode, ddNode, "exsite", "li>:nth-child(2)"));
          }
          ddNode.addEventListener("click", event => {
            const target = event.target;
            if (getNodeName(target) === "a" && target.id.startsWith(`${def.const.seed}_d_d_l_s_`)) {
              const _list_Id_ = Number(target.id.replace(`${def.const.seed}_d_d_l_s_`, "")) || -1;
              const nodeDomain = target.dataset.frDomain;
              if (!target.hasAttribute("data-del")) {
                const _index_ = _temp_.indexOf(nodeDomain);
                Boolean(~_index_) && _temp_.splice(_index_, 1);
                target.setAttribute("data-del", _list_Id_);
                target.textContent = "재개";
                target.style.color = "darkgreen";
                target.parentNode.previousElementSibling.style.cssText += "text-decoration:line-through;font-style:italic";
              } else {
                !_temp_.includes(nodeDomain) && _temp_.push(nodeDomain);
                target.removeAttribute("data-del");
                target.textContent = "제거";
                target.style.color = "darkred";
                target.parentNode.previousElementSibling.style.cssText += "text-decoration:none;font-style:normal";
              }
            }
          });
          if (await frDialog.respond()) {
            saveData("_EXCLUDE_SITES_", uniq(_temp_.sort()));
            let frDialog = new FrDialogBox({
              trueButtonText: "이용감사",
              messageText: `<p style="color:darkgreen">웹사이트 데이터의 사용자 지정 제외가 성공적으로 저장되었습니다.\uff01</p><p>확인 후 페이지가 자동으로 새로 고쳐집니다.</p>`,
              titleText: "웹사이트 데이터 보존의 사용자 지정 제외",
            });
            if (await frDialog.respond()) closeConfigurePage({ isReload: true });
            frDialog = null;
          }
          frDialog = null;
        },
      };

      function searchTextAndSelect(input, target, counter, searchStr) {
        const keyword = input?.value?.trim().replace(/([.*])/g, "\\$1");
        if (!keyword) return;
        if (def.const[`${counter}Keyword`] !== keyword) def.count[`${counter}Search`] = 0;
        let match, textNode;
        const reg = new RegExp(keyword, "i");
        const textNodes = qA(searchStr, target);
        def.const[`${counter}Keyword`] = keyword;
        while (!match) {
          textNode = textNodes[def.count[`${counter}Search`]].firstChild;
          match = reg.exec(textNode.data);
          if (def.count[`${counter}Search`] >= textNodes.length - 1) {
            def.count[`${counter}Search`] = 0;
            break;
          } else {
            def.count[`${counter}Search`]++;
          }
        }
        if (match) {
          const range = document.createRange();
          range.setStart(textNode, 0);
          range.setEnd(textNode, textNode.data.length);
          if (w.getSelection) {
            const _sTxt = w.getSelection();
            _sTxt.removeAllRanges();
            _sTxt.addRange(range);
            const _sNode = _sTxt.anchorNode?.parentNode?.parentNode;
            const _rows = Number(_sNode?.id?.replace(`${def.const.seed}_d_d_l_`, ``)) || 0;
            const _offsetHeight = Number(_sNode?.offsetHeight) || 0;
            target.scrollTop = _rows * _offsetHeight;
          }
          input.style.borderColor = "#777777";
        } else {
          input.style.borderColor = "darkorange";
        }
      }

      function insertMenus(loading) {
        sleep(1e3, { useCachedSetTimeout: true })(2e3)
          .then(async r => {
            const fontReady = await isFontReady(r);
            DEBUG("isFontReady:", { status: fontReady?.status, delay: parseInt(fontReady?.t) });
            return fontReady;
          })
          .then(font_Ready => {
            let font_Set, exclude_site, parameter_Set, include_site, feed_Back;
            loading ? GMunregisterMenuCommand(loading) : DEBUG("%cNo Loading_Menu", "color:grey");
            if (font_Ready) {
              if (typeof def.const.exSitesIndex === "undefined") {
                font_Set ? GMunregisterMenuCommand(font_Set) : DEBUG("%cInstalling Font_Set_Menu", "color:gray");
                font_Set = GMregisterMenuCommand(`\ufff1\ud83c\udf13 글꼴 렌더링 설정${isHotkey ? "(P)" : ""}`, addAction.setConfigure);
                exclude_site ? GMunregisterMenuCommand(exclude_site) : DEBUG("%cInstalling Exclude_Site_Menu", "color:gray");
                exclude_site = GMregisterMenuCommand(`\ufff2\u26d4 렌더링 제외 ${TOP_HOST_NAME} ${isHotkey ? "(X)" : ""}`, addAction.excludeSites);
                parameter_Set ? GMunregisterMenuCommand(parameter_Set) : DEBUG("%cInstalling Parameter_Set_Menu", "color:gray");
                parameter_Set = GMregisterMenuCommand(`\ufff3\ud83d\udc8e 고급 핵심 기능 설정${isHotkey ? "(G)" : ""}`, addAction.vipConfigure);
              } else {
                include_site ? GMunregisterMenuCommand(include_site) : DEBUG("%cInstalling Include_Site_Menu", "color:gray");
                include_site = GMregisterMenuCommand(`\ufff4\ud83c\udf40 重新渲染 ${TOP_HOST_NAME} ${isHotkey ? "(X)" : ""}`, addAction.includeSites);
                feed_Back ? GMunregisterMenuCommand(feed_Back) : DEBUG("%cInstalling Feed_Back_Menu", "color:gray");
                feed_Back = GMregisterMenuCommand(`\ufff5\ud83e\udde1 작성자에게 피드백 보내기${isHotkey ? "(T)" : ""}`, () => GMopenInTab(def.variable.feedback, false));
              }
            } else {
              loading = GMregisterMenuCommand("\ufff0\ud83c\udf13 스크립트 다시 로드 메뉴", () => location.reload(true));
            }
          })
          .catch(e => ERROR("MenusInsert:", e.message));
      }

      function insertHotkey() {
        sleep(2e3, { useCachedSetTimeout: true })
          .then(() => (isHotkey ? !DEBUG("%cInstalling Hotkey_Setting", "color:gray") : DEBUG("%cNo Hotkey_Setting", "color:grey")))
          .then(installHotkey => {
            if (!installHotkey) return;
            document.addEventListener("keydown", e => {
              const ekey = e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey;
              if (e.keyCode === 80 && ekey) {
                e.preventDefault();
                if (Date.now() - def.count.clickTimer > 1e3) {
                  def.count.clickTimer = Date.now();
                  addAction[typeof def.const.exSitesIndex === "undefined" ? "setConfigure" : "includeSites"]();
                }
              }
              if (e.keyCode === 88 && ekey) {
                e.preventDefault();
                if (Date.now() - def.count.clickTimer > 1e3) {
                  def.count.clickTimer = Date.now();
                  addAction[typeof def.const.exSitesIndex === "undefined" ? "excludeSites" : "includeSites"]();
                }
              }
              if (e.keyCode === 71 && ekey) {
                e.preventDefault();
                if (Date.now() - def.count.clickTimer > 1e3) {
                  def.count.clickTimer = Date.now();
                  addAction[typeof def.const.exSitesIndex === "undefined" ? "vipConfigure" : "includeSites"]();
                }
              }
              if (e.keyCode === 84 && ekey) {
                e.preventDefault();
                if (Date.now() - def.count.clickTimer > 10e3) {
                  def.count.clickTimer = Date.now();
                  GMopenInTab(def.variable.feedback, false);
                }
              }
            });
          });
      }

      async function manageDomainsList() {
        let domains, domainValue, domainValueIndex;
        let _temp_ = [];
        let listContents = "";
        try {
          domains = await GMgetValue("_DOMAINS_FONTS_SET_");
          try {
            domainValue = domains ? [...JSON.parse(decrypt(domains))] : [];
          } catch (e) {
            ERROR("DomainValue.JSON.parse:", e.message);
            domainValue = [];
          }
          const _data_search_ =
            domainValue.length > 6
              ? `<p style="display:flex;justify-content:left;align-items:center"><input id="${def.const.seed}_d_s_" style="box-sizing:content-box;margin:4px 6px;padding:2px 6px;width:57%;height:22px;outline:none!important;border:2px solid #777777;border-radius:4px;font:normal 400 16px/150% monospace,Courier New,system-ui,-apple-system,BlinkMacSystemFont,serif!important"><button id="${def.const.seed}_d_s_s_" style="box-sizing:border-box;margin:0;padding:3px 10px;width:max-content;height:max-content;min-width:60px;min-height:30px;border:1px solid #777777;border-radius:4px;background:#eeeeee;color:#333333!important;outline:none!important;vertical-align:initial;text-align:center;letter-spacing:normal;font-weight:400;font-size:12px!important;cursor:pointer">查 询</button><button id="${def.const.seed}_d_s_c_" style="box-sizing:border-box;margin:0 0 0 4px;padding:3px 10px;width:max-content;height:max-content;min-width:60px;min-height:30px;border:1px solid #777777;border-radius:4px;background:#eeeeee;color:#333333!important;vertical-align:initial;text-align:center;letter-spacing:normal;font-weight:400;font-size:12px!important;cursor:pointer">清 除</button></p>`
              : ``;
          for (let i = 0, l = domainValue.length; i < l; i++) {
            const domainName = convertHtmlToText(domainValue[i].domain);
            listContents += String(
              `<li id="${def.const.seed}_d_d_l_${i}" style="display:flex;overflow:hidden;margin:0;padding:5px;max-width:364px;color:#555555;list-style:none;` +
                `white-space:nowrap;font:normal 400 14px/150% ${INITIAL_VALUES.fontSelect},system-ui,-apple-system,sans-serif!important;justify-content:space-between">` +
                `<span>[<a id="${def.const.seed}_d_d_l_s_${i}" style="display:inline;padding:2px;background:transparent;color:#8b0000;font-size:14px!important;` +
                `cursor:pointer">제거</a>]<span>\u0020${i + 1 > 9 ? i + 1 : "0".concat(i + 1)}.</span></span><span style="overflow:hidden;margin-left:5px;width:57%;` +
                `text-overflow:ellipsis;font-weight:700;-webkit-user-select:all;user-select:all" title="${domainName}">${domainName}</span>` +
                `<span style="margin:0 5px">${setDateFormat("yyyy-MM-dd", new Date(domainValue[i].fontDate))}</span></li>`
            );
          }
          let frDialog = new FrDialogBox({
            trueButtonText: "작업을 확인하고 데이터 저장",
            neutralButtonText: "취 소",
            messageText: `<p style="color:#8b0000;text-indent:6px!important;font-size:14px!important">저장 후 적용되며 삭제 된 데이터는 복구 할 수 없으므로주의해서 진행하십시오.\uff01</p>${_data_search_}<ul id="${def.const.seed}_d_d_" style="overflow-x:hidden;margin:0!important;padding:0!important;max-height:190px;list-style:none!important;overscroll-behavior:contain">${listContents}</ul>`,
            titleText: "웹사이트 개인화 데이터 목록",
          });
          const dsNode = qS(`#${def.const.seed}_d_s_`, def.const.dialogIf);
          const dscNode = qS(`#${def.const.seed}_d_s_c_`, def.const.dialogIf);
          const dssNode = qS(`#${def.const.seed}_d_s_s_`, def.const.dialogIf);
          const ddNode = qS(`#${def.const.seed}_d_d_`, def.const.dialogIf);
          if (ddNode && dsNode && dscNode && dssNode) {
            dsNode.addEventListener("keydown", e => {
              e.stopImmediatePropagation();
              if (e.keyCode === 13) {
                e.preventDefault();
                dssNode.focus();
                dssNode.click();
              }
            });
            dsNode.addEventListener("input", () => (dsNode.value = dsNode.value.replace(/[^-a-z0-9.]/gi, "").toLowerCase()));
            dscNode.addEventListener("click", () => {
              dsNode.value = "";
              dsNode.style.borderColor = "#777777";
              ddNode.scrollTop = 0;
              dsNode.focus();
            });
            dssNode.addEventListener("click", () => searchTextAndSelect(dsNode, ddNode, "domain", "li>:nth-child(2)"));
          }
          ddNode.addEventListener("click", event => {
            const target = event.target;
            if (getNodeName(target) === "a" && target.id.startsWith(`${def.const.seed}_d_d_l_s_`)) {
              if (!target.hasAttribute("data-del")) {
                const _list_Id_ = Number(target.id.replace(`${def.const.seed}_d_d_l_s_`, "")) || 0;
                _temp_.push(domainValue[_list_Id_].domain);
                target.setAttribute("data-del", domainValue[_list_Id_].domain);
                target.textContent = "재개";
                target.style.color = "darkgreen";
                target.parentNode.nextElementSibling.style.cssText += "text-decoration:line-through;font-style:italic";
                target.parentNode.nextElementSibling.nextElementSibling.style.cssText += "text-decoration:line-through;font-style:italic";
              } else {
                const _index_ = _temp_.indexOf(target.getAttribute("data-del"));
                Boolean(~_index_) && _temp_.splice(_index_, 1);
                target.removeAttribute("data-del");
                target.textContent = "제거";
                target.style.color = "darkred";
                target.parentNode.nextElementSibling.style.cssText += "text-decoration:none;font-style:normal";
                target.parentNode.nextElementSibling.nextElementSibling.style.cssText += "text-decoration:none;font-style:normal";
              }
            }
          });
          if (await frDialog.respond()) {
            domains = await GMgetValue("_DOMAINS_FONTS_SET_");
            try {
              domainValue = domains ? [...JSON.parse(decrypt(domains))] : [];
            } catch (e) {
              ERROR("DomainValue.JSON.parse:", e.message);
              domainValue = [];
            }
            for (let l = _temp_.length - 1; l >= 0; l--) {
              domainValueIndex = updateDomainsIndex(domainValue, _temp_[l]);
              typeof domainValueIndex !== "undefined" && domainValue.splice(domainValueIndex, 1);
              if (_temp_[l] === CUR_HOST_NAME) def.const.equal = true;
            }
            saveData("_DOMAINS_FONTS_SET_", domainValue);
            let frDialog = new FrDialogBox({
              trueButtonText: "이용해 주셔서 감사합니다.",
              messageText: `<p style="color:darkgreen">웹사이트 개인화 데이터가 성공적으로 저장되었습니다.\uff01</p><p>${
                def.const.equal ? "현재 웹사이트 데이터의 변경 사항을 확인하면 페이지가 자동으로 새로고침됩니다.。" : "팁: 다른 작업을 위해 현재 페이지에 계속 머물러도 됩니다. "
              }</p>`,
              titleText: "개인화된 데이터 저장",
            });
            if (await frDialog.respond()) closeConfigurePage({ isReload: Boolean(def.const.equal) });
            frDialog = null;
          }
          frDialog = null;
        } catch (e) {
          ERROR("ManageDomainsList:", e.message);
          def.array.exps.push(`[manageDomainsList]: ${e}`);
          reportErrorToAuthor(def.array.exps);
        }
      }

      /* FONT_LIST_GENERATION_AND_SELECTION */

      function fontSet(s) {
        if (typeof s !== "string" && typeof s !== "undefined") return;
        return {
          hide: () => qA(s, def.const.configIf).forEach(item => (item.style.display = "none")),
          show: () => qA(s, def.const.configIf).forEach(item => (item.style.display = "block")),
          cloze: async (item, fontData) => {
            ddRemove(item.parentNode);
            const value = item.parentNode.children[1].value;
            const sort = Number(item.parentNode.children[1].attributes.sort.value) || -1;
            const text = item.parentNode.children[0].textContent;
            fontData.push({ ch: text, en: value, sort: sort });
            fontData = getUniqueFontlist(fontData).sort((a, b) => a.sort - b.sort);
            const submitButton = qS(`#${def.id.submit} .${def.class.submit}`, def.const.configIf);
            if (!submitButton) return;
            if (qA(`#${def.id.fontList} .${def.class.close}`, def.const.configIf).length === 0) {
              const fontIndex = def.array.values.indexOf(def.id.fontName);
              Boolean(~fontIndex) && def.array.values.splice(fontIndex, 1);
              if (def.array.values.length === 0) {
                submitButton.classList.contains(def.class.anim) && submitButton.classList.remove(def.class.anim);
                if (def.const.isPreview) {
                  submitButton.textContent = "\u4fdd\u5b58";
                  submitButton.removeAttribute("style");
                  submitButton.removeAttribute("v-Preview");
                  loadPreview(def.const.preview);
                }
              } else {
                def.const.isPreview && changePreviewButtonStyle(submitButton, def.array.values);
              }
              qS(`#${def.id.selector}`, def.const.configIf).style.display = "none";
              const ffaceT = qS(`#${def.id.fface}`, def.const.configIf);
              const inputFont = qS(`#${def.id.fontList} .${def.class.selectFontId} input`, def.const.configIf);
              if (ffaceT.checked) {
                const fontCheckList = await getMergedFontCheckList();
                for (let i = 0, l = fontCheckList.length; i < l; i++) {
                  if (fontCheckList[i].en === refont || convertToUnicode(fontCheckList[i].ch) === refont) {
                    def.const.curFont = fontCheckList[i].ch;
                    break;
                  }
                }
                inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${def.const.curFont}`);
              }
            } else {
              def.const.isPreview && changePreviewButtonStyle(submitButton, def.array.values);
            }
          },
          fdeleteList: fontData => {
            const closeNodes = qA(`#${def.id.fontList} .${def.class.close}`, def.const.configIf);
            closeNodes.forEach(item => fontSet().cloze(item, fontData));
          },
          fresetList: fontData => {
            fontSet().fdeleteList(fontData);
            const fontlistSelectorNode = qS(`#${def.id.fontList} .${def.class.selector}`, def.const.configIf);
            const resetDefaultFont = INITIAL_VALUES.fontSelect.replace(/'|"/g, "");
            fontlistSelectorNode.insertAdjacentHTML(
              "beforeend",
              tTP.createHTML(
                `<a class="${def.class.label}"><span style="border-bottom-left-radius:4px;border-top-left-radius:4px;font-family:${INITIAL_VALUES.fontSelect}!important">微软雅黑</span><input type="hidden" name="${def.id.fontName}" sort="0" value="${resetDefaultFont}"/><span class="${def.class.close}" style="border-top-right-radius:4px;border-bottom-right-radius:4px;font-family:system-ui,-apple-system,BlinkMacSystemFont,serif!important;cursor:pointer">\u0026\u0023\u0032\u0031\u0035\u003b</span></a>`
              )
            );
            fontlistSelectorNode.parentNode.style.display = "block";
            for (let i = 0; i < fontData.length; i++) {
              if (fontData[i].en === resetDefaultFont) {
                fontData.splice(i, 1);
                break;
              }
            }
            def.array.values.push(def.id.fontName);
            const submitButton = qS(`#${def.id.submit} .${def.class.submit}`, def.const.configIf);
            def.const.isPreview && submitButton && changePreviewButtonStyle(submitButton, def.array.values);
            const cleanerNode = qS(`#${def.id.selector} #${def.id.cleaner}`, def.const.configIf);
            cleanerNode?.addEventListener("click", () => fontSet().fdeleteList(fontData));
            const closeNode = qS(`#${def.id.fontList} input[name="${def.id.fontName}"][sort="0"]~.${def.class.close}`, def.const.configIf);
            closeNode.addEventListener("click", function () {
              fontSet().cloze(this, fontData);
            });
          },
          fsearchList: name => {
            let arr = [];
            const inputListNodes = qA(`#${def.id.selector} .${def.class.selector} input[name="${name}"]`, def.const.configIf);
            inputListNodes.forEach(item => arr.push(item.value));
            return arr.filter(Boolean);
          },
          fsearch: fontData => {
            const fHtml = String(
              `<div id="${def.id.selector}">
                <span class="${def.class.spanlabel}">선택한 글꼴\uff1a<span id="${def.id.cleaner}">[비우기]</span></span>
                <div class="${def.class.selector}"></div>
              </div>
              <div class="${def.class.selectFontId}">
                <span class="${def.class.spanlabel}">글꼴을 설정하려면\uff1a</span>
                <input type="search" placeholder="키워드를 입력하여 글꼴 검색" autocomplete="off" class="${def.class.placeholder}">
                <dl style="display:none"></dl>
                <span class="${def.class.tooltip} ${def.class.ps1}" id="${def.id.fonttooltip}">
                  <span class="${def.class.emoji}" title="도움말 보기를 클릭">\ud83d\udd14</span>
                  <span class="${def.class.tooltip} ${def.class.ps2}">
                  <p><strong>힌트 </strong>스크립트에는 일반적으로 사용되는 중국어 글꼴이 미리 로드되어 있으며, 드롭다운 메뉴에 나열된 글꼴은 코드 글꼴 목록에 설치한 글꼴이며, 설치하지 않은 경우 표시되지 않습니다.</p>
                  <p><em style="color:darkred">（注一）</em>글꼴을 다시 선택하지 않으면 마지막으로 저장한 글꼴이 사용됩니다. 처음 사용할 때의 기본값은 Microsoft Black입니다. </p>
                  <p><em style="color:darkred">（注二）</em>입력 상자에는 검색할 키워드를 입력할 수 있으며 중국어와 영어 글꼴 이름을 모두 지원합니다. </p>
                  <p><em style="color:darkred">（注三）</em>글꼴은 선택한 순서대로 먼저 렌더링되므로 가장 원하는 글꼴 하나만 선택하기보다는 두 개 이상을 선택하는 것이 좋습니다. </p>
                  <p><em style="color:darkred">（注四）</em>'글꼴 다시 쓰기'를 끄면 이 기능이 자동으로 비활성화되고 웹 페이지 글꼴은 '사이트 기본값' 글꼴 설정을 사용합니다. </p>
                  <p><em style="color:darkred">（注五）</em>두번 클릭하면\ud83d\udd14사용자 정의 글꼴용 추가 도구를 열어 더 많은 새 글꼴을 사용할 수 있습니다. </p>
                  </span>
                </span>
              </div>`
            );
            const fontListNode = qS(s, def.const.configIf);
            if (!qS(`#${def.id.selector}`, def.const.configIf) && fontListNode) fontListNode.innerHTML = tTP.createHTML(fHtml);
            const ffaceT = qS(`#${def.id.fface}`, def.const.configIf);
            const fselectorT = qS(`#${def.id.fontList} .${def.class.selectFontId} input`, def.const.configIf);
            fselectorT?.addEventListener("keydown", e => e.stopImmediatePropagation());
            if (ffaceT && fselectorT) {
              changeSelectorStatus(ffaceT.checked, fselectorT, def.class.readonly);
              ffaceT.addEventListener("change", () => changeSelectorStatus(ffaceT.checked, fselectorT, def.class.readonly));
            }
            qS(`#${def.id.selector}`, def.const.configIf).style.display = "none";
            fselectorT.addEventListener("input", () => searchEvents(fselectorT.value));
            fselectorT.addEventListener("click", function (e) {
              if (this.value.length === 0) {
                const selector = `#${def.id.fontList} .${def.class.selectFontId} dl`;
                const selectFontNode = qS(selector, def.const.configIf);
                fontSet(selector).show();
                if (fontData.length === 0 && selectFontNode) {
                  selectFontNode.innerHTML = tTP.createHTML("<dd>\u6570\u636e\u6e90\u6682\u65e0\u6570\u636e</dd>");
                } else {
                  selectFontNode.textContent = "";
                  fontData = getUniqueFontlist(fontData).sort((a, b) => a.sort - b.sort);
                  fontData.forEach(item => {
                    selectFontNode.insertAdjacentHTML(
                      "beforeend",
                      tTP.createHTML(`<dd title="${item.ch}" style="font-family:'${item.en}'!important" sort="${item.sort}" value="${item.en}">${item.ch}</dd>`)
                    );
                  });
                }
                clickEvents();
              } else {
                searchEvents(this.value);
              }
              e.stopPropagation();
            });
            document.addEventListener("click", selectorHidden);

            function changeSelectorStatus(inputCheckedStatus, target, cssName) {
              if (!target) return;
              if (inputCheckedStatus) {
                target.removeAttribute("disabled");
                target.classList.remove(cssName);
              } else {
                fontSet().fdeleteList(fontData);
                target.setAttribute("disabled", "disabled");
                target.classList.add(cssName);
              }
            }

            function selectorHidden() {
              fontSet(`#${def.id.fontList} .${def.class.selectFontId} dl`).hide();
              const selectorInput = qS(`#${def.id.fontList} .${def.class.selectFontId} input`, def.const.configIf);
              if (selectorInput) selectorInput.value = "";
            }

            function searchEvents(t) {
              const selector = `#${def.id.fontList} .${def.class.selectFontId} dl`;
              const selectFontNode = qS(selector, def.const.configIf);
              fontSet(selector).hide();
              if (fontData.length > 0 && selectFontNode) {
                fontSet(selector).show();
                const sText = t.replace(/([.:?*+^$[\-=\](){}\\/|])/g, "\\$1");
                const sRegExp = new RegExp(sText, "i");
                let sMatched = false;
                selectFontNode.textContent = "";
                fontData = getUniqueFontlist(fontData).sort((a, b) => a.sort - b.sort);
                fontData.forEach(item => {
                  if (sRegExp.test(item.ch) || sRegExp.test(item.en)) {
                    sMatched = true;
                    selectFontNode.insertAdjacentHTML(
                      "beforeend",
                      tTP.createHTML(`<dd title="${item.ch}" style="font-family:'${item.en}'!important" sort="${item.sort}" value="${item.en}">${item.ch}</dd>`)
                    );
                  }
                });
                if (!sMatched) selectFontNode.innerHTML = tTP.createHTML("<dd>\u6682\u65e0\u60a8\u641c\u7d22\u7684\u5b57\u4f53</dd>");
                clickEvents();
              }
            }

            function clickEvents() {
              const selectFontNodes = qA(`#${def.id.fontList} .${def.class.selectFontId} dl dd`, def.const.configIf);
              selectFontNodes.forEach(item => {
                item.addEventListener("click", function (e) {
                  const value = this.attributes?.value?.value;
                  const sort = this.attributes?.sort?.value;
                  const selector = qS(`#${def.id.fontList} .${def.class.selector}`, def.const.configIf);
                  if (value && sort && selector) {
                    selector.insertAdjacentHTML(
                      "beforeend",
                      tTP.createHTML(
                        `<a class="${def.class.label}"><span style="border-bottom-left-radius:4px;border-top-left-radius:4px;font-family:'${value}'!important">${this.textContent}</span><input type="hidden" name="${def.id.fontName}" sort="${sort}" value="${value}"/><span class="${def.class.close}" style="border-bottom-right-radius:4px;border-top-right-radius:4px;cursor:pointer;font-family:system-ui,-apple-system,BlinkMacSystemFont,serif!important">\u0026\u0023\u0032\u0031\u0035\u003b</span></a>`
                      )
                    );
                    selector.parentNode.style.display = "block";
                    fontData = getUniqueFontlist(fontData).sort((a, b) => a.sort - b.sort);
                    for (let i = 0; i < fontData.length; i++) {
                      if (fontData[i].en === value) {
                        fontData.splice(i, 1);
                        i = fontData.length;
                      }
                    }
                    const cleanerNode = qS(`#${def.id.selector} #${def.id.cleaner}`, def.const.configIf);
                    cleanerNode?.addEventListener("click", () => fontSet().fdeleteList(fontData));
                    const closeNode = qS(`#${def.id.fontList} input[name="${def.id.fontName}"][sort="${sort}"]~.${def.class.close}`, def.const.configIf);
                    closeNode.addEventListener("click", function () {
                      fontSet().cloze(this, fontData);
                    });
                    const submitButton = qS(`#${def.id.submit} .${def.class.submit}`, def.const.configIf);
                    if (submitButton) {
                      !def.array.values.includes(def.id.fontName) && def.array.values.push(def.id.fontName);
                      !submitButton.classList.contains(def.class.anim) && submitButton.classList.add(def.class.anim);
                      def.const.isPreview && changePreviewButtonStyle(submitButton, def.array.values);
                    }
                  }
                  selectorHidden();
                  e.stopPropagation();
                });
              });
            }
          },
        };

        function ddRemove(item) {
          if (!item) return;
          safeRemove(item);
          const temp = item.nextElementSibling;
          if (getNodeName(temp) === "dd") ddRemove(temp);
        }
      }

      async function funcFontface(t) {
        const postscriptName = await matchByPostScriptName(t);
        const fontList = [
          ...["Arial", "Helvetica", "Helvetica Neue", "Verdana", "Georgia", "Tahoma", "Noto Sans", "Open Sans", "Segoe UI", "HanHei SC"],
          ...["Roboto", "RobotoDraft", "Ubuntu", "SimSun", "NSimSun", "SimHei", "FangSong", "KaiTi", "MingLiU", "PMingLiU", "SF Pro SC"],
          ...["Microsoft YaHei", "PingFangSC-Regular", "PingFangSC-Medium", "PingFangSC-Semibold", "PingFangHK-Regular", "PingFangHK-Medium"],
          ...[convertToUnicode("宋体"), convertToUnicode("楷体"), convertToUnicode("仿宋"), convertToUnicode("黑体"), convertToUnicode("微软雅黑")],
        ];
        let returnFontface = "";
        for (let i = 0; i < fontList.length; i++) {
          if (fontList[i] !== t) returnFontface += `@font-face{font-family:"${fontList[i]}";src:local("${postscriptName}");}`;
        }
        return returnFontface;
      }

      function funcFontsize(t) {
        const GKText = `transform:scale(var(--fr-font-fontscale));transform-origin:0 0;width:${100 / t}%;height:${100 / t}%;`;
        const WKtext = `zoom:var(--fr-font-fontscale)!important;overflow-x:hidden;`;
        return `:root>body{${IS_REAL_GECKO ? GKText : WKtext}}`;
      }

      function overlayColor(r, c) {
        return c.substring(1) !== "FFFFFFFF" ? `0 0 ${r}px ${c}` : `0 0 ${r}px currentcolor`;
      }

      function fixScaleOffset(scaleValue) {
        if (scaleValue === 1) return;
        const predefinedSitesProps = {
          ".smzdm.com": { Element: ["clientWidth"] },
          ".bilibili.com": { Element: ["scrollHeight"], HTMLElement: ["offsetHeight"] },
        };
        sleep(20, { useCachedSetTimeout: true })(scaleValue).then(scale => {
          for (let [domain, props] of Object.entries(predefinedSitesProps)) {
            if (CUR_HOST_NAME.endsWith(domain)) {
              def.array.props.Window.push(...uniq(props.Window));
              def.array.props.Element.push(...uniq(props.Element));
              def.array.props.HTMLElement.push(...uniq(props.HTMLElement));
              break;
            }
          }
          correctCoordinateOffset(scale, { deleteOriginal: false });
        });
      }

      function funcCodefont(t, s) {
        if (!isCustomMono) return "";
        let customMonoRules = [];
        const pre = t.search(/\bpre\b/gi) > -1 ? ["pre", "pre *"] : [];
        const code = t.search(/\bcode\b/gi) > -1 ? ["code", "code *"] : [];
        const elcode = [".cm-editor [class*='cm-'] *", ".code", ".code *"];
        const siterules = ["@github.com##.blob-num,.blob-num *,.blob-code,.blob-code *,textarea,.react-line-numbers *,.react-code-lines *", ...monoSiteRules];
        const regex = /@([\w\-.]+)##(?!.*(?<sp>[#])\k<sp>{1})([\w\-*.#:+>()~[\]=^$|,' ]+)/;
        siterules.forEach(siterule => {
          const rule = regex.exec(siterule);
          if (CUR_HOST_NAME.endsWith(rule[1])) customMonoRules.push(...rule[3].split(","));
        });
        const code_text = pre.concat(code, elcode, uniq(customMonoRules)).join();
        const codeSelector = CAN_I_USE ? `:is(${code_text})` : code_text;
        const base = s ? "var(--fr-font-family),var(--fr-font-basefont)" : "var(--fr-font-basefont)";
        const monoTextShadow = IS_REAL_GECKO ? "" : "text-shadow:var(--fr-mono-shadow)!important;";
        return codeSelector.concat(
          `{line-height:${CUR_HOST_NAME.endsWith("github.com") ? "unset" : "150%"}!important;font-size:14px!important;`,
          `-webkit-text-stroke:var(--fr-no-stroke)!important;${monoTextShadow}font-family:var(--fr-mono-font),${base}!important;`,
          `font-feature-settings:var(--fr-mono-feature)!important;${IS_REAL_WEBKIT ? "-webkit-user-select" : "user-select"}:text!important;}${
            CUR_HOST_NAME.endsWith("github.com") ? `${codeSelector}::selection{color:currentcolor!important;background:#71bbff6e!important}` : ``
          }`
        );
      }

      function insertMainStyleElement({ overwrite } = {}) {
        if (!IS_INTERNALSTYLE_ALLOWED || !IS_CURRENTSITE_ALLOWED) return;
        const styleNode = getMainStyleElements({ currentScope: true });
        if (!overwrite && styleNode) return;
        const insertResult = insertStyle({
          target: document.head,
          styleId: styleNode?.id ?? def.id.rndStyle,
          styleContent: styleNode?.textContent ?? tStyle,
          isOverwrite: Boolean(overwrite),
        });
        insertResult && COUNT(`[INSERTSTYLE]${IS_IN_FRAMES}[i:${def.id.rndStyle}]`);
        return insertResult;
      }

      function couldMoveStyleElements(element) {
        return (
          (element instanceof HTMLStyleElement || (element instanceof HTMLLinkElement && element.rel?.toLowerCase().includes("stylesheet") && !element.disabled)) &&
          element.media?.toLowerCase() !== "print" &&
          !element.attributes[0]?.name.startsWith("fr-css-") &&
          !element.classList.contains("darkreader")
        );
      }

      async function moveStyleToLast(node) {
        try {
          const rndStyleNode = qS(`#${def.id.rndStyle}`);
          if (rndStyleNode?.nextElementSibling && couldMoveStyleElements(node) && getLastStyleNode(document.head) !== rndStyleNode) {
            COUNT(`[MOVESTYLE]${IS_IN_FRAMES}[i:${rndStyleNode.id}]`);
            insertMainStyleElement({ overwrite: true });
          }
        } catch (e) {
          ERROR("moveStyleToLast:", e.message);
        }
      }

      function getImageAndTextProperties() {
        return CONST_VALUES.isMatchEditorialSite ? `disabled="disabled" title="\u56fe\u6587/\u7f16\u8f91\u7f51\u7ad9\u81ea\u52a8\u7981\u7528" ` : ``;
      }

      async function operateConfigure() {
        if (!CUR_WINDOW_TOP) return;
        try {
          // set fontData with cache expires
          let fontData = await detectFontData();
          // Fonts selection
          fontSelectionAndCustomFonts(fontData);
          // selector placeholder style
          const ffaceT = qS(`#${def.id.fface}`, def.const.configIf);
          const inputFont = qS(`#${def.id.fontList} .${def.class.selectFontId} input`, def.const.configIf);
          await getAndMonitorCurrentFont(ffaceT, inputFont);
          // Fonts Face
          const submitButton = qS(`#${def.id.submit} .${def.class.submit}`, def.const.configIf);
          saveChangeStatus(ffaceT, CONST_VALUES.fontFace, submitButton, def.array.values);
          // Font Smooth
          const smoothT = qS(`#${def.id.smooth}`, def.const.configIf);
          saveChangeStatus(smoothT, CONST_VALUES.fontSmooth, submitButton, def.array.values);
          // FontSize Scale
          const fontScale = qS(`#${def.id.fontScale}`, def.const.configIf);
          let drawScale = getFontSizeScale(fontScale, submitButton) ?? {};
          fontScale?.addEventListener("keydown", e => e.stopImmediatePropagation());
          // Fix Viewport
          let fixViewportT = getFixViewportBool(fontScale, submitButton) ?? {};
          // Fonts stroke
          const stroke = qS(`#${def.id.strokeSize}`, def.const.configIf);
          let drawStrock = getFontsStroke(stroke, submitButton);
          stroke?.addEventListener("keydown", e => e.stopImmediatePropagation());
          // Fix Fonts stroke
          let fixStrokeT = getFixStrokeBool(stroke, submitButton) ?? {};
          // Fonts shadow
          const shadows = qS(`#${def.id.shadowSize}`, def.const.configIf);
          const shadowColorNode = qS(`#${def.id.shadowColor}`, def.const.configIf);
          let drawShadow = getFontShadow(shadows, shadowColorNode, submitButton);
          shadows?.addEventListener("keydown", e => e.stopImmediatePropagation());
          // Fonts shadow color selection
          const colorshow = qS(`#${def.id.color}`, def.const.configIf);
          const colorReg = /^#[0-9A-F]{8}$|^currentcolor$/i;
          let colorPicker = getColorAndColorPicker(colorshow, submitButton);
          colorshow?.addEventListener("keydown", e => e.stopImmediatePropagation());
          // Double-click allows to edit
          const fontCssT = qS(`#${def.id.cssinclued}`, def.const.configIf);
          const fontExT = qS(`#${def.id.cssexclude}`, def.const.configIf);
          fontCssT?.addEventListener("keydown", e => e.stopImmediatePropagation());
          fontExT?.addEventListener("keydown", e => e.stopImmediatePropagation());
          doubleClickToEdit(fontCssT);
          saveChangeStatus(fontCssT, CONST_VALUES.fontCSS, submitButton, def.array.values);
          saveChangeStatus(fontExT, CONST_VALUES.fontEx, submitButton, def.array.values);
          // Expand & Collapse
          expandOrCollapse(qS(`#${def.id.cSwitch}`, def.const.configIf), fontCssT, qS(`#${def.id.fontCss}`, def.const.configIf));
          expandOrCollapse(qS(`#${def.id.eSwitch}`, def.const.configIf), fontExT, qS(`#${def.id.fontEx}`, def.const.configIf));
          // Customized monospaced fontlist
          const customMonoNode = qS(`#${def.id.mono}`, def.const.configIf);
          customMonospceFont(customMonoNode);
          // Reset Button control
          const resetButtonNode = qS(`#${def.id.submit} .${def.class.reset}`, def.const.configIf);
          controlResetButton(
            resetButtonNode,
            { ffaceT, smoothT, fontScale, fixViewportT, stroke, fixStrokeT, shadows, colorPicker, colorshow, fontCssT, fontExT },
            { fontData, drawScale, drawStrock, drawShadow, submitButton }
          );
          // Submit Button control
          const submitButtonNode = qS(`#${def.id.submit} .${def.class.submit}`, def.const.configIf);
          controlSubmitButton(submitButtonNode, { ffaceT, smoothT, fontScale, fixViewportT, stroke, fixStrokeT, shadows, colorshow, colorReg, fontCssT, fontExT });
          // Backup Button control
          const backupButtonNode = qS(`#${def.id.backup}`, def.const.configIf);
          controlBackupButton(backupButtonNode, isBackupFunction);
          // cancel Button control
          const cancelButtonNode = qS(`#${def.id.submit} .${def.class.cancel}`, def.const.configIf);
          controlCancelButton(cancelButtonNode);
        } catch (e) {
          ERROR("OperateConfigure:", e.message);
          def.array.exps.push(`[operateConfigure]: ${e}`);
        }

        async function detectFontData(FontCheckList) {
          try {
            const cache_FontCheckList = await cache.get("_FONTCHECKLIST_");
            if (Array.isArray(cache_FontCheckList) && cache_FontCheckList.length > 0) {
              DEBUG("%cLoad fontData from Cache", "color:green;font-weight:700");
              FontCheckList = cache_FontCheckList;
            } else {
              DEBUG("%cStart real-time font detection", "color:crimson;font-weight:700");
              FontCheckList = await fontCheck_DetectOnce();
              cache.set("_FONTCHECKLIST_", FontCheckList);
            }
            return uniq(FontCheckList);
          } catch (e) {
            ERROR("FontCheckList with cache:", e.message);
            cache.remove("_FONTCHECKLIST_");
            return [];
          }
        }

        function fontSelectionAndCustomFonts(fontData) {
          try {
            if (!qS(`#${def.id.fontList} .${def.class.fontList}`, def.const.configIf)) return;
            fontSet(`#${def.id.fontList} .${def.class.fontList}`).fsearch(fontData);
            qS(`#${def.id.fonttooltip}`, def.const.configIf)?.addEventListener("dblclick", async () => {
              let received_Fontlist = "";
              let save_Fontlist = [];
              let cusFontCheck = [];
              const cusFontList = await GMgetValue("_CUSTOM_FONTLIST_");
              try {
                cusFontCheck = cusFontList ? [...JSON.parse(decrypt(cusFontList))] : [];
              } catch (e) {
                ERROR("CusFontCheck.JSON.parse:", e.message);
                cusFontCheck = [];
              }
              cusFontCheck.forEach(item => {
                item.sort && delete item.sort;
                received_Fontlist += JSON.stringify(item) + "\r\n";
              });
              let frDialog = new FrDialogBox({
                trueButtonText: "보 존",
                falseButtonText: "도움말 파일",
                neutralButtonText: "취 소",
                messageText: `<p style="color:#555555;font-size:14px!important">다음 텍스트 필드에는 미리 정해진 형식의 사용자 지정 글꼴을 추가할 수 있습니다. 팁을 사용하거나 샘플에 따라 필드를 채우면 입력 오류가 자동으로 필터링됩니다. 다음 항목과 비교『<a href="${def.const.gfHost}#fontlist" title="查看内置字体表" target="_blank">内置字体表</a>』重复的字体将被自动剔除。【功能小贴士\uff1a<span id="${def.const.seed}_addTools" title="点击开启工具" style="color:crimson;cursor:pointer">字体添加辅助工具</span>】</p><p><textarea id="${def.const.seed}_custom_Fontlist" style="box-sizing:border-box;margin:0!important;padding:5px!important;max-width:388px!important;min-width:388px!important;min-height:160px!important;outline:none!important;border:1px solid #999999;border-radius:6px;white-space:pre;font:normal 400 14px/150% monospace,${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;resize:vertical;scrollbar-width:thin;overscroll-behavior:contain" placeholder='字体表自定义格式样例，每行一组字体名称数据，如下\uff1a\r\n{ "ch":"中文字体名一","en":"EN Fontname 1" }\u21b2\r\n{ "ch":"中文字体名二","en":"EN Fontname 2","ps":"Post-Script Name" }\u21b2\r\n\r\n（注一\uff1a“ps:”该项为字体PostScript名称，可选填写）\r\n（注二\uff1a\u21b2为换行符号，输入(Enter)回车即可）'>${received_Fontlist}</textarea></p><p style="display:block;margin:-5px 0 0 -7px!important;height:max-content;color:#dc143c;font-size:14px!important">（请勿添加过多自定义字体，避免造成页面加载缓慢）</p>`,
                titleText: "사용자 정의 글꼴 테이블",
              });
              const customFontlistNode = qS(`#${def.const.seed}_custom_Fontlist`, def.const.dialogIf);
              customFontlistNode?.addEventListener("keydown", e => e.stopImmediatePropagation());
              let custom_Fontlist = customFontlistNode?.value.trim() ?? "";
              qS(`#${def.const.seed}_addTools`, def.const.dialogIf)?.addEventListener("click", () => {
                let chName, enName, psName, cusFontName;
                chName = def.dialog.prompt(
                  "입력하시오「중국어 글꼴 패밀리 이름」\uff1a\r\n(예시\uff1a홍멍 굵게는 중국어, 일본어, 한국어, 영어, 숫자, 소수점, 빼기 기호, 밑줄, 공백을 포함한 반모서리 입력 모드만 지원합니다, @)",
                  "鸿蒙黑体"
                );
                if (chName === null) {
                  return;
                } else if (/^@?[\w\u2E80-\uD7FF\-.,!/（）() ]+$/.test(chName.trim())) {
                  enName = def.dialog.prompt(
                    "입력하시오「영어 글꼴 패밀리 이름」\uff1a\r\n(예시\uff1aHarmonyOS Sans SC，영어, 숫자, 소수점, 빼기 기호, 밑줄, 공백을 포함한 절반 너비 입력 모드만 지원됩니다, @)",
                    "HarmonyOS Sans SC"
                  );
                  if (enName === null) {
                    return;
                  } else if (/^@?[\w\-., !/()]+$/.test(enName.trim())) {
                    psName = def.dialog.prompt(
                      "입력하시오「PostScript이름」\uff1a\r\n(추가된 글꼴을 전 세계에서 사용할 수 있도록 PostScript 이름을 최대한 많이 입력해 주세요. 현재 포스트스크립트 이름을 입력할 수 없는 경우 비워두셔도 됩니다(문의는 Fontke.com을 참조하세요). ",
                      ""
                    );
                    if (psName === null) {
                      return;
                    } else if (/^[\w\u2E80-\uD7FF\-.,@!&=?|+~ ]+$/.test(psName.trim())) {
                      cusFontName = `{"ch":"${chName.trim()}","en":"${enName.trim()}","ps":"${psName.trim()}"}`;
                    } else {
                      cusFontName = `{"ch":"${chName.trim()}","en":"${enName.trim()}"}`;
                    }
                    const aTrim = customFontlistNode.value.trim() ? "\r\n" : "";
                    customFontlistNode.value = customFontlistNode.value.trim().concat(aTrim, cusFontName, "\r\n");
                    custom_Fontlist = customFontlistNode.value.trim();
                  } else {
                    def.dialog.alert("영어 글꼴 패밀리 이름 형식 입력 오류\uff01");
                  }
                } else {
                  def.dialog.alert("중국어 글꼴 패밀리 이름 형식 입력 오류\uff01");
                }
              });
              customFontlistNode?.addEventListener("change", function () {
                this.value = convertFullToHalf(this.value)
                  .replace(/'|`|·|“|”|‘|’/g, `"`)
                  .replace(/，/g, `,`)
                  .replace(/：/g, `:`);
                custom_Fontlist = this.value.trim();
              });
              if (await frDialog.respond()) {
                const regex = /{\s*"ch":\s*"@?[\w\u2E80-\uD7FF\-.,!/（）() ]+"\s*,\s*"en":\s*"@?[\w\-., !/()]+"\s*(,\s*"ps":\s*"[\w\u2E80-\uD7FF\-.,@!&=?|+~ ]+"\s*)?}/g;
                const fontListArray = custom_Fontlist.match(regex);
                if (!custom_Fontlist.length) {
                  GMdeleteValue("_CUSTOM_FONTLIST_");
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: "<p style='color:indigo'>사용자 정의 글꼴 테이블이 성공적으로 초기화되었습니다.\uff01<p><p>글꼴 목록 글로벌 캐시가 자동으로 다시 작성되었으며 현재 페이지가 곧 새로 고쳐질 예정입니다.</p>",
                    titleText: "사용자 지정 글꼴 데이터 재설정",
                  });
                  cache.remove("_FONTCHECKLIST_");
                  if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                  frDialog = null;
                } else if (Array.isArray(fontListArray) && fontListArray.length > 0) {
                  fontListArray.forEach(item => save_Fontlist.push(JSON.parse(item)));
                  const unique_Save_Fontlist = getUniqueFontlist(save_Fontlist);
                  saveData("_CUSTOM_FONTLIST_", getDeduplicatedValues(unique_Save_Fontlist, fontCheck));
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: `<p style="color:darkgreen">제출한 사용자 정의 글꼴이 성공적으로 저장되었습니다.\uff01<p><p>글꼴 목록 글로벌 캐시가 자동으로 다시 작성되었으며 현재 페이지가 곧 새로 고쳐질 예정입니다.</p><p style='color:coral;font-size:12px!important'>참고: 형식이 잘못되었거나 중복된 글꼴 코드는 자동으로 필터링됩니다.</p>`,
                    titleText: "사용자 지정 글꼴 데이터 저장",
                  });
                  cache.remove("_FONTCHECKLIST_");
                  if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                  frDialog = null;
                } else {
                  copyToClipboard(custom_Fontlist);
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: "<p style='color:crimson'>제출한 사용자 지정 글꼴 데이터가 잘못된 형식입니다. 다시 입력해 주세요。<p><p>참고: 이전에 제출한 정보는 클립보드에 자동으로 저장중.</p>",
                    titleText: "글꼴 테이블 데이터 형식 오류",
                  });
                  if (await frDialog.respond()) {
                    let clickEvent = new Event("dblclick", { bubbles: true, cancelable: false });
                    qS(`#${def.id.fonttooltip}`, def.const.configIf)?.dispatchEvent(clickEvent);
                    clickEvent = null;
                  }
                  frDialog = null;
                }
              } else {
                GMopenInTab(`${def.const.gfHost}#custom`, false);
              }
              frDialog = null;
            });
          } catch (e) {
            ERROR("Fonts selection:", e.message);
            def.array.exps.push(`[Fonts selection]: ${e}`);
          }
        }

        async function getAndMonitorCurrentFont(fontfaceNode, inputNode) {
          await getCurrentFontName(CONST_VALUES.fontFace, refont, def.const.defaultFont);
          if (!fontfaceNode || !inputNode) return;
          fontfaceNode.addEventListener("change", async () => {
            await getCurrentFontName(CONST_VALUES.fontFace, refont, def.const.defaultFont);
            if (fontfaceNode.checked && !CONST_VALUES.fontFace) {
              inputNode.setAttribute("placeholder", "이전에 설정한 글꼴이 복원 중…");
              sleep(120)
                .then(() => qS(`#${def.id.submit} .${def.class.submit}[v-Preview="true"]`, def.const.configIf))
                .then(submitPreview => submitPreview?.click());
            }
          });
        }

        function getFontSizeScale(fontScale, submitButton) {
          if (!def.const.isFontsize || !fontScale) return;
          try {
            const drawScale = qS(`#${def.id.scaleSize}`, def.const.configIf);
            fontScale.value = CONST_VALUES.fontSize === 1 ? "OFF" : CONST_VALUES.fontSize.toFixed(3);
            rangeSliderWidget(drawScale, fontScale, 3, true);
            checkInputValue(fontScale, drawScale, /^[0-1](\.[0-9]{1,3})?$/, 3, true);
            return drawScale;
          } catch (e) {
            ERROR("FontSize Scale:", e.message);
            def.array.exps.push(`[FontSize Scale]: ${e}`);
          } finally {
            saveChangeStatus(fontScale, CONST_VALUES.fontSize, submitButton, def.array.values, true);
          }
        }

        function getFixViewportBool(fontScale, submitButton) {
          const fixViewportT = qS(`#${def.id.fixViewport}`, def.const.configIf);
          if (!def.const.isFontsize || !isFixViewport || !fontScale || !fixViewportT) return;
          try {
            const fviewportNode = qS(`#${def.id.fviewport}`, def.const.configIf);
            if (fviewportNode) {
              fviewportNode.style.visibility = fontScale.value === "OFF" ? "hidden" : "visible";
              fontScale.addEventListener("change", function () {
                fviewportNode.style.visibility = this.value === "OFF" ? "hidden" : "visible";
              });
            }
            return fixViewportT;
          } catch (e) {
            ERROR("Fix Viewport:", e.message);
            def.array.exps.push(`[Fix Viewport]: ${e}`);
          } finally {
            saveChangeStatus(fixViewportT, CONST_VALUES.fixViewport, submitButton, def.array.values);
          }
        }

        function getFontsStroke(stroke, submitButton) {
          if (!stroke) return;
          try {
            const drawStrock = qS(`#${def.id.stroke}`, def.const.configIf);
            stroke.value = CONST_VALUES.fontStroke === 0 ? "OFF" : CONST_VALUES.fontStroke.toFixed(3);
            rangeSliderWidget(drawStrock, stroke, 3);
            checkInputValue(stroke, drawStrock, /^[0-1](\.[0-9]{1,3})?$/, 3);
            return drawStrock;
          } catch (e) {
            ERROR("Fonts stroke:", e.message);
            def.array.exps.push(`[Fonts stroke]: ${e}`);
          } finally {
            saveChangeStatus(stroke, CONST_VALUES.fontStroke, submitButton, def.array.values);
          }
        }

        function getFixStrokeBool(stroke, submitButton) {
          if (!IS_REAL_BLINK || !stroke) return;
          const fixStrokeT = qS(`#${def.id.fixStroke}`, def.const.configIf);
          try {
            const fstrokeNode = qS(`#${def.id.fstroke}`, def.const.configIf);
            if (fstrokeNode) {
              fstrokeNode.style.visibility = stroke.value === "OFF" ? "hidden" : "visible";
              stroke.addEventListener("change", function () {
                fstrokeNode.style.visibility = this.value === "OFF" ? "hidden" : "visible";
              });
            }
            return fixStrokeT;
          } catch (e) {
            ERROR("Fix Stroke:", e.message);
            def.array.exps.push(`[Fix Stroke]: ${e}`);
          } finally {
            saveChangeStatus(fixStrokeT, CONST_VALUES.fixStroke, submitButton, def.array.values);
          }
        }

        function getFontShadow(shadows, shadowColorNode, submitButton) {
          if (!shadows || !shadowColorNode) return;
          try {
            const drawShadow = qS(`#${def.id.shadow}`, def.const.configIf);
            shadows.value = CONST_VALUES.fontShadow === 0 ? "OFF" : CONST_VALUES.fontShadow.toFixed(2);
            rangeSliderWidget(drawShadow, shadows, 2);
            checkInputValue(shadows, drawShadow, /^[0-8](\.[0-9]{1,2})?$/, 2);
            shadowColorNode.style.display = shadows.value === "OFF" ? "none" : "flex";
            shadows.addEventListener("change", function () {
              shadowColorNode.style.display = this.value === "OFF" ? "none" : "flex";
            });
            return drawShadow;
          } catch (e) {
            ERROR("Fonts shadow:", e.message);
            def.array.exps.push(`[Fonts shadow]: ${e}`);
          } finally {
            saveChangeStatus(shadows, CONST_VALUES.fontShadow, submitButton, def.array.values);
          }
        }

        function getColorAndColorPicker(colorshow, submitButton) {
          if (!colorshow) return {};
          try {
            const colorPicker = new w.frColorPicker(`#${def.id.color}`, {
              value: CONST_VALUES.shadowColor,
              alpha: 1.0,
              format: "hexa",
              previewSize: 35,
              position: "top",
              zIndex: 2147483647,
              backgroundColor: "rgba(206,226,237,0.91)",
              controlBorderColor: "rgba(187,187,187,0.7)",
              pointerBorderColor: "rgba(255,255,255,0.6)",
              borderRadius: 4,
              padding: 9,
              width: 186,
              height: 210,
              sliderSize: 12,
              shadow: 0,
              onChange: function () {
                colorshow.value = this.toHEXAString() === "#FFFFFFFF" ? "currentcolor" : this.toHEXAString();
                colorshow._value_ = colorshow.value;
              },
            });
            colorPicker.fromString(CONST_VALUES.shadowColor);
            const cp = colorPicker.toHEXAString();
            const cl = getBrightness(cp.substring(1)) > 182 ? "#333333" : "#eeeeee";
            colorshow.value = cp === "#FFFFFFFF" ? "currentcolor" : cp;
            DEBUG(`frColorPicker: %c${cp}`, `${fullStyle(cp, cl)};border:1px solid #eeeeee`);
            return colorPicker;
          } catch (e) {
            ERROR("Fonts shadowColor:", e.message);
            def.array.exps.push(`[Fonts shadowColor]: ${e}`);
          } finally {
            saveChangeStatus(colorshow, CONST_VALUES.shadowColor, submitButton, def.array.values);
          }
        }

        function doubleClickToEdit(fontCssT) {
          if (!fontCssT) return;
          fontCssT.addEventListener("dblclick", () => {
            fontCssT.setAttribute("class", def.class.notreadonly);
            fontCssT.title = "\u8bf7\u8c28\u614e\u4fee\u6539\u8be5\u53c2\u6570\uff01";
            fontCssT.readOnly = false;
          });
        }

        function customMonospceFont(monoT) {
          if (!monoT) return;
          monoT.addEventListener("dblclick", async () => {
            try {
              const { monoSiteRules: siteRule, monoFontList: fontlist, monoFeature: feature } = await customMonoData();
              const _config_data_ = await configData();
              const monospacedsiterules = siteRule.join("\r\n").trim();
              const monospacedfont = fontlist.trim();
              const monospacedfeature = feature.trim();
              let frDialog = new FrDialogBox({
                trueButtonText: "데이터 저장",
                neutralButtonText: "취소",
                messageText:
                  `<div id="${def.id.cm}" style="margin:0 0 8px;border-bottom:1px groove #cccccc;width:97%!important">
                    <span class="${def.const.seed}_cusmono" style="color:#555555!important;font-weight:700!important">사용자 지정 아이소메트릭 글꼴 사용(기본값: 꺼짐) </span>
                    <input type="checkbox" id="${def.id.iscusmono}" class="${def.class.checkbox}" ${_config_data_.isCustomMono ? "checked" : ""} />
                    <label for="${def.id.iscusmono}"></label>
                  </div>` +
                  `<p style="display:block;color:#555555;font-size:14px!important">\u2474 다음 텍스트 필드는 동일한 너비의 글꼴을 적용할 루트 필드 및 요소 선택기를 설정합니다.<br><em style="color:#dc143c">CSS 구문 규칙에 익숙하지 않은 경우 스타일 실패를 방지하기 위해 비워 두세요.</em></p><p><textarea id="${def.const.seed}_monospaced_siterules" style="box-sizing:border-box;margin:0!important;padding:5px!important;max-width:388px!important;min-width:388px!important;min-height:140px!important;outline:0!important;border:1px solid #999999;border-radius:6px;white-space:pre;font:normal 400 14px/150% monospace,${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;resize:vertical;scrollbar-width:thin;overscroll-behavior:contain;word-break:keep-all!important" placeholder="한 줄당 하나의 규칙만 허용되며 동일한 사이트에 대해 서로 다른 규칙을 반복해서 추가할 수 있습니다.\r\n형식예：@도메인명##요소선택기1,요소선택기2,……\r\n예시：\r\n@github.com##[class~='blob-code'] *\r\n@github.com##.example,#abc,div:not(.test)\r\n@github.dev###test:not([class*='test'])">${monospacedsiterules}\r\n</textarea></p><p style="display:block;margin-top:10px!important;color:#555555;font-size:14px!important">\u2475 다음은 영문 이소 너비 글꼴을 사용자 지정하기 위해 설정할 수 있으며, 예제에 따라 형식을 입력하세요.。<br><em style="color:#dc143c">참고: 모노스페이스 글꼴 패밀리는 이미 기본 제공되므로 다시 추가할 필요가 없습니다.</em></p><p><input id="${def.const.seed}_monospaced_font" style="box-sizing:border-box;padding:5px;width:380px;outline:0!important;border:1px solid #999999;border-radius:6px;font:normal 400 14px/150% monospace,${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important" placeholder="예시：'Source Code Pro','Mono','Monaco'" value="${monospacedfont}"></p><p style="display:block;margin-top:10px!important;color:#555555;font-size:14px!important">\u2476 다음은 OpenType 글꼴 글꼴-기능-설정 속성을 설정합니다.<br><em style="color:#dc143c">이 속성을 모르는 경우 스타일링 오류를 방지하기 위해 비워 두세요.</em></p><p><input id="${def.const.seed}_monospaced_feature" style="box-sizing:border-box;padding:5px;width:380px;outline:0!important;border:1px solid #999999;border-radius:6px;font:normal 400 14px/150% monospace,${INITIAL_VALUES.fontSelect},system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important" placeholder='예시："liga" 0,"tnum","zero"' value='${monospacedfeature}'></p>`,
                titleText: "사용자 지정 아이소메트릭 글꼴 설정",
              });
              const monospacedSiteRulesNode = qS(`#${def.const.seed}_monospaced_siterules`, def.const.dialogIf);
              const monospacedFontNode = qS(`#${def.const.seed}_monospaced_font`, def.const.dialogIf);
              const monospacedFeatureNode = qS(`#${def.const.seed}_monospaced_feature`, def.const.dialogIf);
              const customMonoSwitch = qS(`#${def.id.iscusmono}`, def.const.dialogIf);
              monospacedSiteRulesNode?.addEventListener("keydown", e => e.stopImmediatePropagation());
              monospacedFontNode?.addEventListener("keydown", e => e.stopImmediatePropagation());
              monospacedFeatureNode?.addEventListener("keydown", e => e.stopImmediatePropagation());
              const changeDisabledStatus = (listenerCheck, nodes, cssName) => {
                nodes.forEach(node => {
                  if (listenerCheck) {
                    node.removeAttribute("disabled");
                    node.classList.remove(cssName);
                  } else {
                    node.setAttribute("disabled", "disabled");
                    node.classList.add(cssName);
                  }
                });
              };
              const monoNodes = [monospacedSiteRulesNode, monospacedFontNode, monospacedFeatureNode];
              changeDisabledStatus(customMonoSwitch.checked, monoNodes, def.class.readonly);
              customMonoSwitch?.addEventListener("change", function () {
                changeDisabledStatus(this.checked, monoNodes, def.class.readonly);
              });
              let custom_MonospacedSiteRules = convertHtmlToText(monospacedSiteRulesNode.value.trim());
              let custom_MonospacedFontList = convertHtmlToText(monospacedFontNode.value.trim());
              let custom_MonospacedFontFeature = convertHtmlToText(monospacedFeatureNode.value.trim());
              monospacedFontNode.addEventListener("change", function () {
                this.value = convertFullToHalf(this.value)
                  .replace(/"|`|·|“|”|‘|’/g, `'`)
                  .replace(/，/g, `,`)
                  .replace(/'monospace',?/gi, ``);
                custom_MonospacedFontList = convertHtmlToText(this.value.trim());
              });
              monospacedSiteRulesNode.addEventListener("change", function () {
                this.value = convertFullToHalf(this.value)
                  .replace(/"|`|·|“|”|‘|’/g, `'`)
                  .replace(/，/g, `,`);
                custom_MonospacedSiteRules = convertHtmlToText(this.value.trim());
              });
              monospacedFeatureNode.addEventListener("change", function () {
                this.value = convertFullToHalf(this.value)
                  .replace(/'|`|·|“|”|‘|’/g, `"`)
                  .replace(/，/g, `,`)
                  .replace(/[^\w", ]/g, ``);
                custom_MonospacedFontFeature = convertHtmlToText(this.value.trim());
              });
              if (await frDialog.respond()) {
                const monospaced_SiteRulesArray = custom_MonospacedSiteRules.match(/@[\w\-.]+##(?!.*(?<sp>[#])\k<sp>{1})[\w\-*.#:+>()~[\]=^$|,' ]+/g);
                if (custom_MonospacedSiteRules && !monospaced_SiteRulesArray) {
                  copyToClipboard(custom_MonospacedSiteRules);
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: "<p style='color:crimson'>사용자 지정 루트 도메인 및 요소 선택기에 오류가 발생했습니다. 다시 입력하세요.</p><p>참고: 이전에 제출한 정보는 클립보드에 자동으로 저장됩니다.</p>",
                    titleText: "사용자 지정 루트 도메인 및 요소 선택기 데이터 오류",
                  });
                  if (await frDialog.respond()) {
                    let clickEvent = new Event("dblclick", { bubbles: true, cancelable: false });
                    qS(`#${def.id.mono}`, def.const.configIf)?.dispatchEvent(clickEvent);
                    clickEvent = null;
                  }
                  frDialog = null;
                  return;
                }
                const monospaced_FontListArray = custom_MonospacedFontList.match(/'@?[\w\-.()!/ ]+'/g);
                if (custom_MonospacedFontList && !monospaced_FontListArray) {
                  copyToClipboard(custom_MonospacedFontList);
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: "<p style='color:crimson'>제출한 사용자 지정 아이소메트릭 글꼴 데이터가 올바르지 않습니다. 다시 입력해 주세요.</p><p>참고: 이전에 제출한 정보는 클립보드에 자동으로 저장됩니다.</p>",
                    titleText: "사용자 지정 아이소메트릭 글꼴 데이터 오류",
                  });
                  if (await frDialog.respond()) {
                    let clickEvent = new Event("dblclick", { bubbles: true, cancelable: false });
                    qS(`#${def.id.mono}`, def.const.configIf)?.dispatchEvent(clickEvent);
                    clickEvent = null;
                  }
                  frDialog = null;
                  return;
                }
                if (
                  (!custom_MonospacedSiteRules || (Array.isArray(monospaced_SiteRulesArray) && monospaced_SiteRulesArray.length > 0)) &&
                  (!custom_MonospacedFontList || (Array.isArray(monospaced_FontListArray) && monospaced_FontListArray.length > 0))
                ) {
                  const monospaced_fontListString = uniq(monospaced_FontListArray).join();
                  !custom_MonospacedSiteRules ? GMdeleteValue("_MONOSPACED_SITERULES_") : saveData("_MONOSPACED_SITERULES_", uniq(monospaced_SiteRulesArray));
                  !custom_MonospacedFontList ? GMdeleteValue("_MONOSPACED_FONTLIST_") : saveData("_MONOSPACED_FONTLIST_", monospaced_fontListString);
                  !custom_MonospacedFontFeature ? GMdeleteValue("_MONOSPACED_FEATURE_") : saveData("_MONOSPACED_FEATURE_", custom_MonospacedFontFeature);
                  _config_data_.isCustomMono = Boolean(qS(`#${def.id.iscusmono}`, def.const.dialogIf).checked);
                  saveData("_CONFIGURE_", _config_data_);
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결정",
                    messageText: `<p style="color:darkgreen">사용자 지정 아이소메트릭 글꼴과 관련된 데이터가 성공적으로 저장되었습니다.\uff01</p><p>확인 후 현재 페이지가 자동으로 새로고침됩니다.</p><p style="color:coral;font-size:12px!important">참고: 잘못된 형식의 입력은 자동으로 필터링됩니다.</p>`,
                    titleText: "사용자 지정 아이소메트릭 글꼴 관련 데이터 저장",
                  });
                  if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                  frDialog = null;
                }
              }
              frDialog = null;
            } catch (e) {
              ERROR("Monospaced Set:", e.message);
            }
          });
        }

        function controlResetButton(
          resetT,
          { smoothT, ffaceT, fontScale, fixViewportT, stroke, fixStrokeT, shadows, colorPicker, colorshow, fontCssT, fontExT },
          { fontData, drawScale, drawStrock, drawShadow, submitButton }
        ) {
          if (!resetT) return;
          resetT.addEventListener("click", async () => {
            let frDialog = new FrDialogBox({
              trueButtonText: "재설정",
              falseButtonText: "복원",
              neutralButtonText: "취소",
              messageText: `<p> 초기화/복원은 현재 설정을 다음과 같이 초기화합니다<span style="color:slategray">프로그램의 기본 초기 데이터</span> 或 <span style="color:slategrey">마지막으로 올바르게 저장된 데이터</span>。매개변수 재설정은 일반적으로 매개변수를 잘못 구성하여 상황을 되돌릴 수 없는 경우에 수행합니다.</p><p style="color:darkgreen">재설정\uff1a현재 데이터를 프로그램의 초기 값으로 재설정하고 수동으로 저장하여 적용합니다.</p><p style="color:darkred">복원\uff1a데이터를 마지막으로 올바르게 저장된 데이터로 바꾸고 미리 보기를 자동으로 복원합니다.</p><p style="color:gray">취소\uff1a재설정 작업을 중단합니다.</p>`,
              titleText: "매개변수 재설정 확인",
            });
            if (await frDialog.respond()) {
              smoothT.checked !== INITIAL_VALUES.fontSmooth ? smoothT.click() : DEBUG("<fontSmooth> NOT MODIFIED");
              ffaceT.checked !== INITIAL_VALUES.fontFace ? ffaceT.click() : DEBUG("<fontFace> NOT MODIFIED");
              CONST_VALUES.fontSelect.split(",")[0] !== INITIAL_VALUES.fontSelect ? fontSet().fresetList(fontData) : fontSet().fdeleteList(fontData);
              if (def.const.isFontsize) {
                fontScale.value = INITIAL_VALUES.fontSize === 1 ? "OFF" : INITIAL_VALUES.fontSize.toFixed(3);
                fontScale._value_ = INITIAL_VALUES.fontSize;
                setSliderProperty(drawScale, INITIAL_VALUES.fontSize, 3);
                def.const.curScale = INITIAL_VALUES.fontSize;
                if (isFixViewport) {
                  fixViewportT.checked !== INITIAL_VALUES.fixViewport ? fixViewportT.click() : DEBUG("<fixViewport> NOT MODIFIED");
                  const fviewportNode = qS(`#${def.id.fviewport}`, def.const.configIf);
                  fviewportNode && (fviewportNode.style.visibility = fontScale.value === "OFF" ? "hidden" : "visible");
                }
              }
              stroke.value = INITIAL_VALUES.fontStroke === 0 ? "OFF" : INITIAL_VALUES.fontStroke.toFixed(3);
              stroke._value_ = INITIAL_VALUES.fontStroke;
              setSliderProperty(drawStrock, INITIAL_VALUES.fontStroke, 3);
              if (IS_REAL_BLINK) {
                fixStrokeT.checked !== INITIAL_VALUES.fixStroke ? fixStrokeT.click() : DEBUG("<fixStroke> NOT MODIFIED");
                const fstrokeNode = qS(`#${def.id.fstroke}`, def.const.configIf);
                fstrokeNode && (fstrokeNode.style.visibility = stroke.value === "OFF" ? "hidden" : "visible");
              }
              shadows.value = INITIAL_VALUES.fontShadow === 0 ? "OFF" : INITIAL_VALUES.fontShadow.toFixed(2);
              shadows._value_ = INITIAL_VALUES.fontShadow;
              setSliderProperty(drawShadow, INITIAL_VALUES.fontShadow, 2);
              qS(`#${def.id.shadowColor}`, def.const.configIf).style.display = shadows.value === "OFF" ? "none" : "flex";
              colorPicker.fromString(INITIAL_VALUES.shadowColor);
              colorshow.value = INITIAL_VALUES.shadowColor;
              colorshow._value_ = INITIAL_VALUES.shadowColor;
              fontCssT.value = INITIAL_VALUES.fontCSS;
              setEffectIntoSubmit(fontCssT.value, CONST_VALUES.fontCSS, def.array.values, fontCssT, submitButton);
              fontExT.value = INITIAL_VALUES.fontEx;
              setEffectIntoSubmit(fontExT.value, CONST_VALUES.fontEx, def.array.values, fontExT, submitButton);
              await getCurrentFontName(ffaceT.checked, INITIAL_VALUES.fontSelect.replace(/'/g, ""), def.const.defaultFont);
              sleep(120)
                .then(() => qS(`#${def.id.submit} .${def.class.submit}[v-Preview="true"]`, def.const.configIf))
                .then(submitPreview => submitPreview?.click());
            } else {
              smoothT.checked !== CONST_VALUES.fontSmooth ? smoothT.click() : DEBUG("<fontSmooth> NOT MODIFIED");
              ffaceT.checked !== CONST_VALUES.fontFace ? ffaceT.click() : DEBUG("<fontFace> NOT MODIFIED");
              fontSet().fdeleteList(fontData);
              if (def.const.isFontsize) {
                fontScale.value = CONST_VALUES.fontSize === 1 ? "OFF" : CONST_VALUES.fontSize.toFixed(3);
                fontScale._value_ = CONST_VALUES.fontSize;
                setSliderProperty(drawScale, CONST_VALUES.fontSize, 3);
                def.array.scaleMatrix.push(CONST_VALUES.fontSize);
                def.const.curScale = CONST_VALUES.fontSize;
                if (isFixViewport) {
                  fixViewportT.checked !== CONST_VALUES.fixViewport ? fixViewportT.click() : DEBUG("<fixViewport> NOT MODIFIED");
                  const fviewportNode = qS(`#${def.id.fviewport}`, def.const.configIf);
                  fviewportNode && (fviewportNode.style.visibility = fontScale.value === "OFF" ? "hidden" : "visible");
                }
              }
              stroke.value = CONST_VALUES.fontStroke === 0 ? "OFF" : CONST_VALUES.fontStroke.toFixed(3);
              stroke._value_ = CONST_VALUES.fontStroke;
              setSliderProperty(drawStrock, CONST_VALUES.fontStroke, 3);
              if (IS_REAL_BLINK) {
                fixStrokeT.checked !== CONST_VALUES.fixStroke ? fixStrokeT.click() : DEBUG("<fixStroke> NOT MODIFIED");
                const fstrokeNode = qS(`#${def.id.fstroke}`, def.const.configIf);
                fstrokeNode && (fstrokeNode.style.visibility = stroke.value === "OFF" ? "hidden" : "visible");
              }
              shadows.value = CONST_VALUES.fontShadow === 0 ? "OFF" : CONST_VALUES.fontShadow.toFixed(2);
              shadows._value_ = CONST_VALUES.fontShadow;
              setSliderProperty(drawShadow, CONST_VALUES.fontShadow, 2);
              const shadowColorNode = qS(`#${def.id.shadowColor}`, def.const.configIf);
              shadowColorNode && (shadowColorNode.style.display = shadows.value === "OFF" ? "none" : "flex");
              colorPicker.fromString(CONST_VALUES.shadowColor);
              colorshow.value = CONST_VALUES.shadowColor === "#FFFFFFFF" ? "currentcolor" : colorPicker.toHEXAString();
              colorshow._value_ = colorshow.value;
              fontCssT.value = CONST_VALUES.fontCSS;
              setEffectIntoSubmit(fontCssT.value, CONST_VALUES.fontCSS, def.array.values, fontCssT, submitButton);
              fontExT.value = CONST_VALUES.fontEx;
              setEffectIntoSubmit(fontExT.value, CONST_VALUES.fontEx, def.array.values, fontExT, submitButton);
              await getCurrentFontName(ffaceT.checked, refont, def.const.defaultFont);
              loadPreview(def.const.preview);
              delete def.const.preview;
            }
            frDialog = null;
          });
        }

        function controlSubmitButton(submitT, { ffaceT, smoothT, fontScale, fixViewportT, stroke, fixStrokeT, shadows, colorshow, colorReg, fontCssT, fontExT }) {
          if (!submitT) return;
          submitT.addEventListener("click", async function () {
            const fontlists = fontSet().fsearchList(def.id.fontName);
            const fontselect = fontlists.length > 0 ? addSingleQuoteToArray(fontlists) : CONST_VALUES.fontSelect;
            const fontface = ffaceT.checked;
            const smooth = smoothT.checked;
            const prefscale = !def.const.isFontsize ? 1 : /^[0-1](\.[0-9]{1,3})?$/.test(fontScale.value) ? Number(fontScale.value) : INITIAL_VALUES.fontSize;
            const fscale = CONST_VALUES.isMatchEditorialSite ? 1 : prefscale < 0.8 ? 0.8 : prefscale > 1.5 ? 1.5 : prefscale;
            const fixfviewport = isFixViewport && fscale !== 1 && fixViewportT.checked;
            const fstroke = /^[0-1](\.[0-9]{1,3})?$/.test(stroke.value) ? Number(stroke.value) : stroke.value === "OFF" ? 0 : INITIAL_VALUES.fontStroke;
            const fixfstroke = IS_REAL_BLINK && fstroke && fixStrokeT.checked;
            const fshadow = /^[0-8](\.[0-9]{1,2})?$/.test(shadows.value) ? Number(shadows.value) : shadows.value === "OFF" ? 0 : INITIAL_VALUES.fontShadow;
            const pickedcolor = colorshow.value;
            const fscolor = colorReg.test(pickedcolor) ? (pickedcolor.toLowerCase() === "currentcolor" ? "#FFFFFFFF" : pickedcolor) : INITIAL_VALUES.shadowColor;
            const fcss = fontCssT.value;
            const fontcss = fcss ? fcss.replace(/"|`/g, "'") : INITIAL_VALUES.fontCSS;
            const fex = fontExT.value;
            const fontex = fex ? fex.replace(/"|`/g, "'") : "";
            const _curEmptyConfig = !fontface && !smooth && !fshadow && !fstroke && fscale === 1;
            if (def.const.isPreview && this.hasAttribute("v-Preview")) {
              try {
                const _bodyscale = !def.const.isFontsize ? "" : fscale >= 0.8 && fscale <= 1.5 && fscale !== 1 ? funcFontsize(fscale) : "";
                const _shadowcsstext = overlayColor(fshadow, fscolor.toLowerCase());
                const _shadow = fshadow > 0 && fshadow <= 4 ? "text-shadow:var(--fr-font-shadow);" : "";
                const _strokecsstext = `${fstroke}px currentcolor`;
                const _stroke = fstroke > 0 && fstroke <= 1.0 ? "-webkit-text-stroke:var(--fr-font-stroke);" : "";
                const _smoothing = smooth ? funcSmooth : "";
                const _textrender = smooth ? "text-rendering:optimizeLegibility;" : "";
                const _fontfamily = fontface ? "font-family:var(--fr-font-family),var(--fr-font-basefont);" : "";
                const _refont = fontselect?.split(",")[0].replace(/"|'/g, "") ?? "";
                const _fontfaces = !fontface ? "" : _refont ? await funcFontface(_refont) : "";
                const _exselector = CAN_I_USE ? `:is(${convertHtmlToText(fontex)})` : convertHtmlToText(fontex);
                const _exclude = !fontex || (!fshadow && !fstroke) ? "" : _exselector.concat("{-webkit-text-stroke:var(--fr-no-stroke)!important;text-shadow:none!important}");
                const _codefont = !fontex ? "" : funcCodefont(fontex, fontface);
                const _fixfontstroke = fixfstroke ? `.${def.const.boldAttrName}{-webkit-text-stroke:var(--fr-no-stroke)!important}` : ``;
                const _tshadow = `${_fontfaces}${_bodyscale}`.concat(
                  CAN_I_USE ? `:is(${convertHtmlToText(fontcss)})` : convertHtmlToText(fontcss),
                  `{${_fontfamily}${_shadow}${_stroke}${_smoothing}${_textrender}}`,
                  `${_exclude}${_codefont}${_fixfontstroke}`
                );
                const _globalCssText = IS_REAL_GECKO && fontface ? def.const.style.global : "";
                const _rootpseudoclass = `:root{--fr-font-basefont:${INITIAL_VALUES.fontBase};--fr-font-fontscale:${fscale};--fr-font-family:${fontselect};--fr-font-shadow:${_shadowcsstext};--fr-font-stroke:${_strokecsstext};--fr-mono-font:${monoFontText};--fr-mono-shadow:0 0 0 currentcolor;--fr-mono-feature:${monoFeatureText};--fr-no-stroke:0px transparent;}`;
                const __tshadow = _curEmptyConfig ? `/* BLANK_STYLE_SHEET */` : `@charset "UTF-8";${_rootpseudoclass}${_globalCssText}${_tshadow}`;
                this.textContent = "\u4fdd\u5b58";
                this.removeAttribute("style");
                this.removeAttribute("v-Preview");
                def.const.curScale = fscale;
                def.array.scaleMatrix.push(fscale);
                loadPreview(def.const.isPreview, __tshadow, false);
                await getCurrentFontName(fontface, _refont, def.const.defaultFont)
                  .then(() => {
                    const cl = getBrightness(fscolor.substring(1)) > 182 ? "#333" : "#eee";
                    DEBUG(`frColorPicker<Preview>: %c${fscolor}`, `${fullStyle(fscolor, cl)};border:1px solid #eee`);
                  })
                  .then(() => fixFontStrokeStyleErrors(_fixfontstroke, { permit: isFixStrokeTask(fstroke && fixfstroke) }))
                  .catch(e => ERROR("Preview:", e.message));
              } catch (e) {
                ERROR("SubmitPreview:", e.message);
                def.array.exps.push(`[submitPreview]: ${e}`);
                reportErrorToAuthor(def.array.exps);
              }
            } else {
              try {
                let frDialog = new FrDialogBox({
                  trueButtonText: "글로벌 데이터에 저장",
                  falseButtonText: "웹사이트 데이터에 저장",
                  neutralButtonText: "취 소",
                  messageText: `<p style="color:darkgreen;font-weight:700">글로벌 데이터에 저장\uff1a</p><p>현재 설정을 전역 설정으로 저장하고 기본적으로 전역 매개 변수를 사용합니다.</p><p style="color:#8b0000;font-weight:700">현재 사이트 데이터에 저장\uff1a<span id="${def.const.seed}_a_w_d_l_">[<span style="margin:0;padding:0 2px;color:#3e3e3e;font-weight:400;font-size:12px!important;cursor:pointer">전체 데이터 목록</span>]</span></p><p style="min-height:22px"><span title="웹사이트에 데이터를 저장하면 이전 데이터를 자동으로 덮어씁니다." style="color:indigo;cursor:help;word-break:break-all" id="${def.const.seed}_c_w_d_">为 ${TOP_HOST_NAME} 독립적인 설정 데이터를 저장.</span>`,
                  titleText: "설정 데이터 저장",
                });
                let domains, domainValue, domainValueIndex;
                domains = await GMgetValue("_DOMAINS_FONTS_SET_");
                try {
                  domainValue = domains ? [...JSON.parse(decrypt(domains))] : [];
                } catch (e) {
                  ERROR("DomainValue.JSON.parse:", e.message);
                  domainValue = [];
                }
                const _awdl = qS(`#${def.const.seed}_a_w_d_l_`, def.const.dialogIf);
                if (_awdl) {
                  _awdl.style.display = domainValue.length > 0 ? "line-block" : "none";
                  _awdl.addEventListener("click", async () => await manageDomainsList());
                }
                domainValueIndex = updateDomainsIndex(domainValue);
                const cwdNode = qS(`#${def.const.seed}_c_w_d_`, def.const.dialogIf);
                if (typeof domainValueIndex !== "undefined" && cwdNode) {
                  const fontDate = setDateFormat("yyyy-MM-dd HH:mm:ss", new Date(domainValue[domainValueIndex].fontDate));
                  cwdNode.innerHTML = tTP.createHTML(
                    `<p style="display:flex;height:30px;align-items:center"><span style="color:indigo"><strong>上次保存\uff1a</strong>${fontDate} </span><button id="${def.const.seed}_c_w_d_d_" style="box-sizing:border-box;margin-left:15px;padding:3px 5px;width:max-content;height:max-content;max-width:120px;min-height:30px;border:1px solid #777777;border-radius:4px;background-color:#eeeeee;color:#333333!important;letter-spacing:normal;font-weight:400;font-size:12px!important;cursor:pointer" title="제거数据后将刷新页面">제거当前网站数据</button></p>`
                  );
                  qS(`#${def.const.seed}_c_w_d_d_`, def.const.dialogIf).addEventListener("click", async () => {
                    typeof domainValueIndex !== "undefined" && domainValue.splice(domainValueIndex, 1);
                    saveData("_DOMAINS_FONTS_SET_", domainValue);
                    let frDialog = new FrDialogBox({
                      trueButtonText: "이용감사",
                      messageText: "<p style='color:darkred'>현재 웹사이트의 개인화된 데이터가 성공적으로 삭제되었습니다.\uff01</p><p>확인 후 현재 페이지가 자동으로 새로고침됩니다.</p>",
                      titleText: "개인 맞춤형 데이터 삭제",
                    });
                    if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                    frDialog = null;
                  });
                }
                if (await frDialog.respond()) {
                  saveData("_FONTS_SET_", {
                    fontSelect: convertHtmlToText(fontselect),
                    fontFace: Boolean(fontface),
                    fontSmooth: Boolean(smooth),
                    fontSize: Number(fscale),
                    fixViewport: Boolean(fixfviewport),
                    fontStroke: Number(fstroke),
                    fixStroke: Boolean(fixfstroke),
                    fontShadow: Number(fshadow),
                    shadowColor: convertHtmlToText(fscolor),
                    fontCSS: convertHtmlToText(fontcss),
                    fontEx: convertHtmlToText(fontex),
                  });
                  if (globalDisable && !_curEmptyConfig) {
                    _config_data_.globalDisable = false;
                    saveData("_CONFIGURE_", _config_data_);
                  }
                  if (!globalDisable && _curEmptyConfig) {
                    _config_data_.globalDisable = true;
                    saveData("_CONFIGURE_", _config_data_);
                  }
                  def.const.successId = true;
                } else {
                  const _savedata_ = {
                    domain: TOP_HOST_NAME,
                    fontDate: Date.now(),
                    fontSelect: convertHtmlToText(fontselect),
                    fontFace: Boolean(fontface),
                    fontSmooth: Boolean(smooth),
                    fontSize: Number(fscale),
                    fixViewport: Boolean(fixfviewport),
                    fontStroke: Number(fstroke),
                    fixStroke: Boolean(fixfstroke),
                    fontShadow: Number(fshadow),
                    shadowColor: convertHtmlToText(fscolor),
                    fontCSS: convertHtmlToText(fontcss),
                    fontEx: convertHtmlToText(fontex),
                  };
                  domains = await GMgetValue("_DOMAINS_FONTS_SET_");
                  try {
                    domainValue = domains ? [...JSON.parse(decrypt(domains))] : [];
                  } catch (e) {
                    ERROR("DomainValue.JSON.parse:", e.message);
                    domainValue = [];
                  }
                  domainValueIndex = updateDomainsIndex(domainValue);
                  if (typeof domainValueIndex !== "undefined") {
                    domainValue.splice(domainValueIndex, 1, _savedata_);
                  } else {
                    domainValue.push(_savedata_);
                  }
                  if (domainValue.length <= maxPersonalSites || typeof domainValueIndex !== "undefined") {
                    saveData("_DOMAINS_FONTS_SET_", domainValue);
                    def.const.successId = true;
                  } else {
                    let frDialog = new FrDialogBox({
                      trueButtonText: "계속 보존됨",
                      falseButtonText: "목록 관리",
                      neutralButtonText: "포기하기",
                      messageText: `<p style="color:gray">다음을 초과하여 저장했습니다<span style="color:#dc143c;font-weight:700;font-style:italic;font-size:20px">${maxPersonalSites} </span>각 사이트의 개인화 데이터, 데이터가 너무 많으면 스크립트가 너무 느리게 실행되어 검색 웹 페이지의 응답성에 영향을 미치므로 일반적으로 덜 방문하는 사이트 설정 중 일부를 삭제한 다음 새 사이트 설정의 데이터를 저장하는 것이 좋습니다.</p><p style="color:crimson">계속 사용하시겠습니까？</p>`,
                      titleText: "데이터 과잉에 대한 팁",
                    });
                    if (await frDialog.respond()) {
                      saveData("_DOMAINS_FONTS_SET_", domainValue);
                      def.const.successId = true;
                    } else {
                      await manageDomainsList();
                      def.const.successId = false;
                    }
                    frDialog = null;
                  }
                }
                frDialog = null;
              } catch (e) {
                ERROR("SubmitData:", e.message);
                def.array.exps.push(`[submitData]: ${e}`);
                reportErrorToAuthor(def.array.exps);
                def.const.successId = false;
              } finally {
                if (def.const.successId) {
                  let frDialog = new FrDialogBox({
                    trueButtonText: "이용해주셔서감사",
                    messageText: "<p style='color:darkgreen'>설정한 글꼴 렌더링 데이터가 성공적으로 저장됨\uff01</p><p>확인 후 현재 페이지가 자동으로 새로고침됩니다.</p>",
                    titleText: "글꼴 렌더링 데이터 저장",
                  });
                  if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                  frDialog = null;
                }
              }
            }
          });
        }

        function controlBackupButton(backupT, needBackup) {
          if (!needBackup || !backupT) return;
          backupT.style.display = "inline-block";
          backupT.addEventListener("click", async () => {
            try {
              let frDialog = new FrDialogBox({
                trueButtonText: "백업",
                falseButtonText: "복원",
                neutralButtonText: "취 소",
                messageText: `<p style="color:darkgreen;font-weight:700">로컬 파일에 백업\uff1a</p><p>로컬로 백업하면 backup.*.sqlitedb 파일이 자동으로 다운로드됩니다. </p><p style="color:#8b0000;font-weight:700">로컬 파일에서 복원\uff1a</p><p><span style="color:indigo;cursor:pointer" id="${def.id.tfiles}">\ud83d\udd0e\u0020[여기를 클릭하여 *.sqlitedb 백업 파일을 로드하세요.]</span><input accept=".sqlitedb" type="file" id="${def.id.files}"/></p>`,
                titleText: "데이터 백업 및 복원",
              });
              const tfs = qS(`#${def.id.tfiles}`, def.const.dialogIf);
              const fs = qS(`#${def.id.files}`, def.const.dialogIf);
              if (tfs && fs) {
                tfs.addEventListener("click", () => fs.click());
                fs.addEventListener("change", () => {
                  tfs.innerHTML = tTP.createHTML(
                    fs.files[0]
                      ? `<em style="color:indigo;font-size:11px!important;word-break:break-all">${fs.files[0].name}</em><br/><span style="color:crimson">\u0020\ud83d\udd0e\u0020[다시 선택]</span>`
                      : `\ud83d\udd0e\u0020[여기를 클릭하여 *.sqlitedb 백업 파일을 로드하세요.]`
                  );
                });
              }
              if (await frDialog.respond()) {
                const _fonts_Set__ = await GMgetValue("_FONTS_SET_");
                const _exclude_Site__ = await GMgetValue("_EXCLUDE_SITES_");
                const _domains_Fonts_Set_ = await GMgetValue("_DOMAINS_FONTS_SET_");
                const _domains_Fonts_Set__ = _domains_Fonts_Set_ || encrypt(JSON.stringify([]));
                const _custom_Fontlist_ = await GMgetValue("_CUSTOM_FONTLIST_");
                const _custom_Fontlist__ = _custom_Fontlist_ || encrypt(JSON.stringify([]));
                const _monospaced_Fontlist_ = await GMgetValue("_MONOSPACED_FONTLIST_");
                const _monospaced_Fontlist__ = _monospaced_Fontlist_ || "";
                const _monospaced_SiteRules_ = await GMgetValue("_MONOSPACED_SITERULES_");
                const _monospaced_SiteRules__ = _monospaced_SiteRules_ || "";
                const _monospaced_feature_ = await GMgetValue("_MONOSPACED_FEATURE_");
                const _monospaced_feature__ = _monospaced_feature_ || "";
                const _configure__ = await GMgetValue("_CONFIGURE_");
                const db_R = "QXV0aGVyJUUyJTlBJUExRjl5NG5nJUYwJTlGJTkyJTk2JTQw".concat(encrypt(def.variable.scriptName));
                const db_0 = encrypt(String(new Date()));
                const db_1 = _fonts_Set__;
                const db_2 = _exclude_Site__;
                const db_3 = _domains_Fonts_Set__;
                const db_4 = _custom_Fontlist__;
                const db_5 = _configure__;
                const db_6 = _monospaced_Fontlist__;
                const db_7 = _monospaced_SiteRules__;
                const db_8 = _monospaced_feature__;
                const db = { db_R, db_0, db_1, db_2, db_3, db_4, db_5, db_6, db_7, db_8 };
                const via = brand.toLowerCase();
                const timeStamp = setDateFormat("yyyy-MM-ddTHH-mm-ssZ", new Date());
                const _fileName_ = `FontRendering-backup-${via}-${timeStamp}.sqlitedb`;
                dataDownload(_fileName_, sqliteDBDataAccess(JSON.stringify(db), 22, decrypt(ROOT_SECRET_KEY)));
                let frDialog = new FrDialogBox({
                  trueButtonText: "결 정",
                  messageText: `<p style="color:darkgreen">백업 데이터가 보관되었으며 백업 파일 내보내기 및 다운로드가 진행 중……</p><p style="color:#8b0000;font-style:italic;font-size:12px!important;word-break:break-all">${_fileName_}</p>`,
                  titleText: "데이터 백업",
                });
                if (await frDialog.respond()) {
                  closeConfigurePage({ isReload: false });
                  DEBUG(`Backup succeeded: ${_fileName_}`);
                }
                frDialog = null;
              } else {
                try {
                  const thatFile = fs.files[0];
                  DEBUG("loadBackupData:", thatFile.name, thatFile.size);
                  let reader = new FileReader();
                  reader.addEventListener(
                    "load",
                    async function () {
                      try {
                        const _file = decrypt(String(this.result));
                        const _rs = JSON.parse(sqliteDBDataAccess(_file, null, decrypt(ROOT_SECRET_KEY)));
                        const _data_R = decrypt(_rs.db_R);
                        const _data_0 = decrypt(_rs.db_0);
                        const _data_1 = JSON.parse(decrypt(_rs.db_1));
                        const _data_2 = JSON.parse(decrypt(_rs.db_2));
                        const _data_3 = _rs.db_3 ? JSON.parse(decrypt(_rs.db_3)) : [];
                        const _data_4 = _rs.db_4 ? JSON.parse(decrypt(_rs.db_4)) : [];
                        const _data_5 = _rs.db_5 ? JSON.parse(decrypt(_rs.db_5)) : def.variable.undefined;
                        const _data_6 = _rs.db_6 ? JSON.parse(decrypt(_rs.db_6)) : def.variable.undefined;
                        const _data_7 = _rs.db_7 ? JSON.parse(decrypt(_rs.db_7)) : def.variable.undefined;
                        const _data_8 = _rs.db_8 ? JSON.parse(decrypt(_rs.db_8)) : def.variable.undefined;
                        if (!isNaN(Date.parse(_data_0)) && new Date(_data_0) < new Date() && _data_R.includes(def.variable.scriptAuthor)) {
                          for (let key of await GMlistValues()) GMdeleteValue(key);
                          saveData("_FONTS_SET_", _data_1);
                          saveData("_EXCLUDE_SITES_", _data_2);
                          saveData("_DOMAINS_FONTS_SET_", _data_3);
                          saveData("_CUSTOM_FONTLIST_", _data_4);
                          _data_6 && saveData("_MONOSPACED_FONTLIST_", _data_6);
                          _data_7 && saveData("_MONOSPACED_SITERULES_", _data_7);
                          _data_8 && saveData("_MONOSPACED_FEATURE_", _data_8);
                          if (_data_5) {
                            _data_5.curVersion = def.variable.curVersion;
                            _data_5.rebuild = def.variable.undefined;
                            saveData("_CONFIGURE_", _data_5);
                          } else {
                            DEBUG("no configure data");
                          }
                          let frDialog = new FrDialogBox({
                            trueButtonText: "결 정",
                            messageText: "<p style='color:darkgreen'>로컬 백업 데이터 복원 완료\uff01</p><p>현재 페이지는 확인 후 자동으로 새로고침됩니다.。</p>",
                            titleText: "데이터 복원 성공",
                          });
                          if (await frDialog.respond()) closeConfigurePage({ isReload: true });
                          frDialog = null;
                        } else {
                          throw new Error("Invalid Data Error");
                        }
                      } catch (e) {
                        ERROR("FileReader.load:", e.message);
                        let frDialog = new FrDialogBox({
                          trueButtonText: "결 정",
                          messageText: "<p style='color:red'>데이터 유효성 검사 오류, 올바른 로컬 백업 파일을 선택하세요.\uff01</p>",
                          titleText: "데이터 파일 오류",
                        });
                        if (await frDialog.respond()) qS(`#${def.id.backup}`, def.const.configIf)?.click();
                        frDialog = null;
                      }
                    },
                    false
                  );
                  reader.readAsText(thatFile);
                  reader = null;
                } catch (e) {
                  ERROR("<The file is null>", e.name);
                  let frDialog = new FrDialogBox({
                    trueButtonText: "결 정",
                    messageText: "<p style='color:indigo'>로드 파일이 비어 있습니다. 복원할 백업 파일을 선택하세요\uff01</p>",
                    titleText: "로드된 문서 없음",
                  });
                  if (await frDialog.respond()) qS(`#${def.id.backup}`, def.const.configIf)?.click();
                  frDialog = null;
                }
              }
              frDialog = null;
            } catch (e) {
              ERROR("LoadBackupData:", e.message);
              def.array.exps.push(`[loadBackupData]: ${e}`);
              reportErrorToAuthor(def.array.exps);
            }
          });
        }

        function controlCancelButton(cancelT) {
          if (!cancelT) return;
          cancelT.addEventListener("click", () => closeConfigurePage({ isReload: false }));
        }
      }

      async function fontCheck_DetectOnce() {
        const fontReady = await isFontReady();
        let checkFont = new FontFaceSetObserver();
        const fontAvailable = new Set();
        let ii = 1;
        if (fontReady) {
          const fontCheckList = await getMergedFontCheckList();
          for (const font of fontCheckList.values()) {
            font.ps && delete font.ps;
            if (checkFont.detect(font.en)) {
              font.sort = ii;
              fontAvailable.add(font);
            } else if (checkFont.detect(convertToUnicode(font.ch))) {
              font.en = convertToUnicode(font.ch);
              font.sort = ii;
              fontAvailable.add(font);
            }
            ii += 1;
          }
        }
        const fontData = [...fontAvailable.values()].sort((a, b) => a.sort - b.sort);
        checkFont = null;
        return fontData;
      }

      async function getCurrentFontName(_isfontface_, refont, defaultFont) {
        const inputFont = qS(`#${def.id.fontList} .${def.class.selectFontId} input`, def.const.configIf);
        def.const.reFontFace = defaultFont;
        def.const.curFont = defaultFont;
        if (_isfontface_) {
          const fontCheckList = await getMergedFontCheckList();
          for (let i = 0, l = fontCheckList.length; i < l; i++) {
            if (fontCheckList[i].en === refont || convertToUnicode(fontCheckList[i].ch) === refont) {
              def.const.curFont = refont.includes("\\") ? `` : `（${fontCheckList[i].en}）`;
              def.const.reFontFace = fontCheckList[i].ch + def.const.curFont;
              def.const.curFont = fontCheckList[i].ch;
              break;
            } else {
              def.const.reFontFace = `\u672a\u77e5\u5b57\u4f53\u540d\uff08\u8bf7\u91cd\u65b0\u6dfb\u52a0\u8be5\u81ea\u5b9a\u4e49\u5b57\u4f53\u003a\u0020${refont}\uff09`;
              def.const.curFont = "\u672a\u77e5\u5b57\u4f53\u540d";
            }
          }
        }
        if (inputFont) {
          inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${def.const.curFont}`);
          inputFont.addEventListener("mouseover", () => inputFont.setAttribute("placeholder", "\u8f93\u5165\u5173\u952e\u5b57\u53ef\u68c0\u7d22\u5b57\u4f53"));
          inputFont.addEventListener("mouseout", () => inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${def.const.curFont}`));
        }
      }

      function closeConfigurePage({ isReload }) {
        const container = qS(`#${def.id.container}`, def.const.configIf);
        if (container) {
          def.array.values.length = 0;
          container.style.opacity = 0;
          sleep(5e2)(safeRemove("fr-colorpicker")).then(r => r && safeRemove("fr-configure"));
          if (isReload === false && def.const.preview) {
            def.array.scaleMatrix.push(CONST_VALUES.fontSize);
            def.const.curScale = CONST_VALUES.fontSize;
            loadPreview(def.const.isPreview);
            delete def.const.preview;
          }
        }
        FrDialogBox.closure();
        isReload === true && location.reload();
      }

      function rangeSliderWidget(listener, target, bits, isOne = false) {
        if (!listener || !target) return;
        listener.addEventListener("input", function () {
          setSliderProperty(this, this.value, bits);
          target.value = Number(this.value) === (isOne ? 1 : 0) ? "OFF" : Number(this.value).toFixed(bits);
          target._value_ = Number(this.value).toFixed(bits);
          let queryNode;
          switch (listener.id) {
            case def.id.shadow:
              queryNode = qS(`#${def.id.shadowColor}`, def.const.configIf);
              queryNode && queryNode.style.setProperty("display", target.value === "OFF" ? "none" : "flex");
              break;
            case def.id.scaleSize:
              queryNode = qS(`#${def.id.fviewport}`, def.const.configIf);
              isFixViewport && queryNode && queryNode.style.setProperty("visibility", target.value === "OFF" ? "hidden" : "visible");
              break;
            case def.id.stroke:
              queryNode = qS(`#${def.id.fstroke}`, def.const.configIf);
              IS_REAL_BLINK && queryNode && queryNode.style.setProperty("visibility", target.value === "OFF" ? "hidden" : "visible");
              break;
          }
          queryNode = null;
        });
      }

      function expandOrCollapse(button, textarea, node) {
        if (!button || !textarea || !node) return;
        const at = button.attributes["fr-button-switch"];
        button.addEventListener("click", () => {
          if (at.value === "ON") {
            textarea.style = "display:none";
            button.textContent = "\u2228";
            node.style.cssText += "height:35px;min-height:35px";
            at.value = "OFF";
          } else {
            textarea.style = "display:block";
            button.textContent = "\u2227";
            node.style.cssText += "height:110px;min-height:110px";
            at.value = "ON";
          }
        });
      }

      function saveChangeStatus(input, initVal, button, arr, isOne = false) {
        try {
          if (!input) return;
          if (input.type !== "text") {
            const method = input.type === "textarea" ? "input" : "change";
            input.addEventListener(method, () => {
              const newVal = input.type === "checkbox" ? input.checked : input.value;
              setEffectIntoSubmit(newVal, initVal, arr, input, button);
            });
          } else {
            Object.defineProperty(input, "_value_", {
              enumerable: true,
              configurable: true,
              get: function () {
                return this.value;
              },
              set: newVal => {
                deBounce({ fn: setEffectIntoSubmit, delay: 1e2, timer: input.id })(newVal, initVal, arr, input, button, isOne);
              },
            });
          }
        } catch (exp) {
          ERROR("SaveChangeStatus:", exp);
          def.array.exps.push(`[saveChangeStatus]: ${exp}`);
        }
      }

      function setEffectIntoSubmit(newVal, initVal, arr, input, button, isOne = false) {
        try {
          if (!button || !input) return;
          const _thatoffvalue = isOne ? 1 : 0;
          const _value =
            typeof input.dataset.frType !== "undefined"
              ? newVal === "OFF"
                ? _thatoffvalue
                : Number(newVal)
              : typeof newVal === "string" && newVal.toLowerCase() === "currentcolor"
              ? "#FFFFFFFF"
              : newVal;
          if (_value !== initVal) {
            !arr.includes(input.id) && arr.push(input.id);
            if (def.const.isPreview) changePreviewButtonStyle(button, arr);
          } else {
            const vI = arr.indexOf(input.id);
            Boolean(~vI) && arr.splice(vI, 1);
          }
          DEBUG("changed Element IDs:\r\n", (def.array.values = arr));
          if (arr.length > 0) {
            if (!button.classList.contains(def.class.anim)) button.classList.add(def.class.anim);
          } else {
            if (button.classList.contains(def.class.anim)) button.classList.remove(def.class.anim);
            if (def.const.isPreview) {
              button.textContent = "\u4fdd\u5b58";
              button.removeAttribute("style");
              button.removeAttribute("v-Preview");
              loadPreview(def.const.preview);
              def.const.curScale = CONST_VALUES.fontSize;
              def.array.scaleMatrix.push(def.const.curScale);
            }
          }
        } catch (exp) {
          ERROR("SetEffectIntoSubmit:", exp);
        }
      }

      function changePreviewButtonStyle(button, arr) {
        if (IS_REAL_GECKO && arr.includes(def.id.fontScale)) {
          button.textContent = "\u4fdd\u5b58";
          button.title = "Firefox: 글꼴 크기 조정의 호환성 문제로 인해 미리보기 기능이 일시 중단되었으니 저장하여 효과를 확인하시기 바랍니다!";
          button.setAttribute("style", "background-color:#da09b7!important;border-color:#da09b7!important");
          button.removeAttribute("v-Preview");
        } else {
          button.textContent = "\u9884\u89c8";
          button.setAttribute("style", "background-color:coral!important;border-color:coral!important");
          button.setAttribute("v-Preview", "true");
        }
      }

      function addSingleQuoteToArray(arr) {
        if (!Array.isArray(arr)) return INITIAL_VALUES.fontSelect;
        let returnStr = "";
        arr.forEach((item, index, array) => {
          if (item) returnStr += `'${item}'`.concat(array.length - 1 === index ? "" : ",");
        });
        return String(uniq(returnStr.split(","))) || INITIAL_VALUES.fontSelect;
      }

      function convertFullToHalf(str) {
        let tmp = "";
        for (let i = 0, l = str.length; i < l; i++) {
          if (str.charCodeAt(i) === 12288) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
            continue;
          }
          if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
          } else {
            tmp += String.fromCharCode(str.charCodeAt(i));
          }
        }
        return tmp;
      }

      function reportErrorToAuthor(exps, showDialogBox = IS_DEBUG) {
        if (!showDialogBox || !Array.isArray(exps)) return;
        closeConfigurePage({ isReload: false });
        sleep(1e2 + random(1e3))("").then(async expReport => {
          try {
            if (qS("fr-dialogbox[fr-error]")) return;
            for (let i = 0; i < exps.length; i++) {
              expReport += `${i + 1}、${exps[i]}${i + 1 !== exps.length ? "\u3000<br/>" : ""}`;
            }
            let frDialog = new FrDialogBox({
              trueButtonText: "피드백 문제",
              falseButtonText: "페이지 새로 고침",
              messageText:
                `<p style="color:#dc143c;font-size:14px!important">'페이지 새로 고침' 후에도 오류가 계속 발생하면 '피드백'을 통해 작성자에게 제때 알려주시면 감사하겠습니다!\uff01<br/><kbd style="display:inline-block;box-sizing:content-box;margin:4px 0 0;padding:3px 10px;width:94%;border:1px solid rgba(175, 184, 193, 0.4);border-radius:6px;background-color:#f6f8fa;color:#666666;vertical-align:middle;text-align:center;font-size:14px!important">다음 정보가 클립보드에 자동으로 저장됩니다.</kbd></p>` +
                `<p><ul id="${def.const.seed}_copy_to_author" style="overflow-y:auto;margin:0!important;padding:0!important;max-height:300px;list-style-position:outside">` +
                `<li>브라우저 정보\uff1a${JSON.stringify(navigatorInfo)}\u3000</li><li>脚本扩展信息\uff1a${GMscriptHandler} ${GMversion}\u3000</li>` +
                `<li>스크립트 버전 정보\uff1a${def.variable.curVersion}\u3000</li><li>当前访问域名\uff1a${CUR_HOST_NAME}<span hidden>\u0020${CUR_HOST_PATH}</span>\u3000</li>` +
                `<li>오류메시지목록\uff1a\u3000<span style="display:block;color:tan">${expReport}</span></li></ul></p>`,
              titleText: def.variable.scriptName + "오류보고",
            });
            frDialog.container.setAttribute("fr-error", true);
            const copyText = qS(`#${def.const.seed}_copy_to_author`, def.const.dialogIf)
              .textContent.replace(/\u3000/g, "\n")
              .replace(/\u0020\u0020/g, "")
              .replace(/\n\n/g, "\n")
              .trim();
            def.array.exps.length = 0;
            if (await frDialog.respond()) {
              copyToClipboard("```log\n" + copyText + "\n```");
              GMopenInTab(`${def.variable.feedback}/new?assignees=F9y4ng&template=bug_report.md`, false);
            } else {
              location.reload(true);
            }
            frDialog = null;
          } catch (e) {
            ERROR("ReportErrorToAuthor:", e.message);
          }
        });
      }

      function getStyleLoadStatus() {
        if (!IS_CURRENTSITE_ALLOWED || !IS_INTERNALSTYLE_ALLOWED || !IS_DEBUG) return;
        sleep(3e3).then(() => {
          const styleElement = getMainStyleElements({ currentScope: true });
          const lastStyleElement = getLastStyleNode(document.head);
          if (styleElement && lastStyleElement === styleElement) {
            return DEBUG(`lastStyle${IS_IN_FRAMES}.ID: %c%s`, "color:teal;font-weight:700;font-family:monospace", styleElement?.id || "<NULL>");
          }
          getStyleLoadStatus();
        });
      }

      /* FIX_VIEWPORT_ZOOM_STYLE_ERRORS 2023-04-08 F9Y4NG */

      const isNotFixViewportTask = !IS_INTERNALSTYLE_ALLOWED || !CONST_VALUES.fixViewport || def.const.curScale === 1;

      function runFixViewportUnits() {
        if (!isFixViewport || isNotFixViewportTask) return;
        fixViewportCssStyle(null, def.const.curScale);
        w.addEventListener("pushState", historyStateFix);
        w.addEventListener("replaceState", historyStateFix);
      }

      function historyStateFix() {
        sleep(1e2)(def.const.curScale).then(r => fixViewportCssStyle(null, r));
      }

      function fixViewportCssStyle(node, scaleValue) {
        if (isNotFixViewportTask || typeof node === "undefined") return;
        const fixRegex = /\b(\d+(?:\.\d+)?)(v[wh]|vmin|vmax)\b(?!\\)/g;
        const base64Regex = /(?:;base64,)((?:[a-zA-Z0-9/+]+)\b\d+(v[wh]|vmin|vmax)\b)+/g;
        const triggerNode = node === null ? "dom" : getNodeName(node);
        switch (triggerNode) {
          case "link":
            fixViewportLinks();
            break;
          case "style":
            fixViewportStyles();
            break;
          case "dom":
            fixViewportLinks();
            fixViewportStyles();
            break;
        }

        function fixViewportLinks() {
          qA(`link[rel~="stylesheet" i]:not([data-fr-processed])`).forEach(node => {
            let url = node.href || node.getAttribute("data-href");
            if (!url) return;
            url = url.replace(/^http:/, "https:");
            node.setAttribute("data-fr-processed", false);
            debugOnce("fixlinks", "detect viewport.Links:", true);
            return new Promise(() => {
              const xhr = new XMLHttpRequest();
              xhr.timeout = 5e3;
              xhr.onreadystatechange = () => {
                if (xhr.status === 200 && xhr.readyState === 4) {
                  try {
                    let cssText = xhr.responseText ?? xhr.response ?? "";
                    const parent = node.parentNode ?? document.head;
                    if (!cssText || !parent || !detectMatchingResults(cssText, fixRegex)) return;
                    cssText = replaceStyle(cssText, fixRegex, scaleValue);
                    cssText = replaceBaseURL(cssText, url);
                    const style = cE("style");
                    style.textContent = "/*# sourceURL=" + url + " */\r\n" + cssText;
                    if (node.media) style.media = node.media;
                    if (node.disabled) style.disabled = node.disabled;
                    for (const ds in node.dataset) {
                      if (node.dataset.hasOwnProperty(ds)) style.dataset[ds] = node.dataset[ds];
                    }
                    style.setAttribute("data-href", node.getAttribute("href"));
                    style.setAttribute("data-fr-seed", Date.now());
                    style.setAttribute("data-fr-processed", true);
                    style.setAttribute("type", "text/css");
                    if (node.className) {
                      style.className = node.className;
                      node.removeAttribute("href");
                      node.removeAttribute("data-fr-processed");
                      safeRemove(`style[class="${node.className}"]`, document.head);
                      insertAfter(document.head, style, node);
                    } else {
                      if (node.id) style.id = node.id;
                      parent.replaceChild(style, node);
                    }
                    DEBUG("viewport.Link Fixed: %O", style);
                  } catch (e) {
                    ERROR("fixViewportLinks.xhr:", e.message);
                  }
                }
              };
              xhr.onerror = e => ERROR("Network Error: Blocked by CORS/CSP.");
              try {
                xhr.open("GET", url, true);
                xhr.send(null);
              } catch (e) {
                ERROR("fixViewportLinks:", e.message);
              }
            });
          });
        }

        function fixViewportStyles() {
          qA(`style:not([data-fr-processed]):not(.darkreader)`).forEach(node => {
            if (node.attributes[0]?.name.startsWith("fr-css-")) return;
            if (/^S[SC]\d+$/.test(node.id) || node.id === def.id.rndStyle) return;
            let cssText = node.textContent;
            node.setAttribute("data-fr-processed", false);
            debugOnce("fixstyles", "detect viewport.Styles:", true);
            if (!detectMatchingResults(cssText, fixRegex)) return;
            return new Promise(() => {
              try {
                cssText = replaceStyle(cssText, fixRegex, scaleValue);
                node.textContent = cssText;
                node.setAttribute("data-fr-seed", Date.now());
                node.setAttribute("data-fr-processed", true);
                node.setAttribute("type", "text/css");
                DEBUG("viewport.Style Fixed: %O", node);
              } catch (e) {
                ERROR("fixViewportStyles:", e.message);
              }
            });
          });
        }

        function detectMatchingResults(txt, reg) {
          const getBase64Eigenvalue = JSON.stringify(txt.match(base64Regex));
          const matching = txt.match(reg);
          if (!matching) return false;
          const matchingResults = matching.filter(match => !getBase64Eigenvalue.includes(match));
          return matchingResults.length > 0;
        }

        function replaceStyle(txt, reg, scale) {
          const getBase64Eigenvalue = JSON.stringify(txt.match(base64Regex));
          return txt.replace(reg, function (match, num, unit) {
            if (getBase64Eigenvalue.includes(match)) {
              return match;
            } else {
              return Number((num / scale).toFixed(4)) + unit;
            }
          });
        }

        function replaceBaseURL(txt, url) {
          const regex = /url\((?<mark>['"]?)(?!\/|https?:)([\w\-/.?=]+)\k<mark>\)/g;
          url = url.substring(0, url.lastIndexOf("/") + 1);
          return txt.replace(regex, function (match, mark, file) {
            const markReg = mark ? new RegExp(`${mark}`, "g") : "";
            return match.replace(markReg, "").replace(file, url + file);
          });
        }
      }

      /* FIX_FONT_BOLD_STROKE_STYLE_ERRORS 2023-04-08 F9Y4NG */

      function isFixStrokeTask(condition) {
        return Boolean(IS_INTERNALSTYLE_ALLOWED && !IS_CHEAT_UA && IS_REAL_BLINK && parseFloat(brandversion) >= 96 && condition);
      }

      function fixFontStrokeStyleErrors(fixedstyle, { permit } = {}) {
        if (typeof permit === "boolean") {
          if (!permit) return;
        } else {
          if (!isFixStrokeTask(IS_CURRENTSITE_ALLOWED && CONST_VALUES.fixStroke)) return;
        }

        const MAX_MODIFIED_NODES = 50;
        const MAX_REPEATED_NODES = 3;
        const MAX_TIME_INTERVAL = 50;
        const styleMap = new WeakMap();
        const shadowRootSet = new Set();
        const repeatedModifiedNodes = { childList: [], attributes: [] };
        const fixBoldObserver = new MutationObserver(fixBoldProcess);
        const config = { attributeOldValue: true, childList: true, subtree: true };
        const excludeNodeSet = new Set(def.const.exQueryString.split(",").filter(i => i.indexOf("*") === -1));
        const changeAttribute = {
          add: el => raf.setTimeout(el.classList.add(def.const.boldAttrName), def.const.ft),
          del: el => raf.setTimeout(el.classList.remove(def.const.boldAttrName), def.const.ft),
        };

        function isBold(element) {
          if (element instanceof Element) {
            if (styleMap.has(element)) {
              return styleMap.get(element).fontWeight >= 600;
            }
            const style = gS(element);
            styleMap.set(element, style);
            return style.fontWeight >= 600;
          }
          return false;
        }

        function getBoldStyles(elements) {
          const boldStyles = [];
          const els = uniq(elements);
          for (let index = 0, len = els.length; index < len; index++) {
            const node = els[index];
            if (node.nodeType !== 1 || excludeNodeSet.has(getNodeName(node))) continue;
            boldStyles.push({ isbold: isBold(node), node });
          }
          return boldStyles;
        }

        function getAndProcessBoldStyles(node) {
          const nodes = getSuitableElements(`:not(${def.const.exQueryString})`, node);
          const items = getBoldStyles(nodes);
          for (let i = 0; i < items.length; i++) {
            boldFixedHandler(items[i]);
          }
        }

        function shadowRootNodeFixStroke(host, syncStyle) {
          if (host instanceof ShadowRoot) {
            getAndProcessBoldStyles(host);
            const curSyncStyle = `:host(${getNodeName(host.host)}){--fr-no-stroke:0px transparent}` + syncStyle;
            compatibleWithAdoptedStyleSheets(host, curSyncStyle, `${def.const.seed}-fixboldstroke`);
          }
        }

        function querySelectorAllShadows(selector, root) {
          const docNodes = qA(selector, root);
          const childShadows = docNodes
            .map(el => {
              if (!el.shadowRoot) return;
              shadowRootNodeFixStroke(el.shadowRoot, fixedstyle);
              fixBoldObserver.observe(el.shadowRoot, config);
              shadowRootSet.add(el.shadowRoot);
              return el.shadowRoot;
            })
            .filter(Boolean);
          const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));
          return docNodes.concat(childResults.flat());
        }

        function getSuitableElements(expr, node) {
          switch (node.nodeType) {
            case 1:
              return qA(expr, node).concat(node);
            case 9:
            case 11:
              return qA(expr, node);
          }
        }

        function boldFixedHandler(target) {
          if (!target) return;
          const bold = target.isbold ?? isBold(target);
          const item = target.node ?? target;
          const attr = item.classList.contains(def.const.boldAttrName);
          if (!attr && bold) changeAttribute.add(item);
          if (attr && !bold) changeAttribute.del(item);
        }

        function mutationListMonitor(treeNodes, obs) {
          if (!Array.isArray(treeNodes) || !treeNodes.length) return;
          treeNodes.forEach(node => {
            if (![1, 9, 11].includes(node.nodeType)) return;
            const subtreeNodes = getSuitableElements(`:not(${def.const.exQueryString})`, node);
            for (let i = 0, l = subtreeNodes.length; i < l; i++) {
              const item = subtreeNodes[i];
              if (item.nodeType !== 1 || excludeNodeSet.has(getNodeName(item))) continue;
              if (item.shadowRoot) {
                shadowRootNodeFixStroke(item.shadowRoot, fixedstyle);
                obs.observe(item.shadowRoot, config);
                shadowRootSet.add(item.shadowRoot);
                mutationListMonitor([item.shadowRoot], obs);
              } else {
                boldFixedHandler(item);
              }
            }
          });
          return true;
        }

        function fixBoldProcess(mutationsList, observer) {
          const subtrees = new Set();
          const pendingList = observer.takeRecords();
          observer.disconnect();
          const uniqueMutations = uniq(pendingList.concat(mutationsList));
          for (let i = 0; i < uniqueMutations.length; i++) {
            const mutation = uniqueMutations[i];
            const targetEl = mutation.target;
            const type = mutation.type;
            switch (type) {
              case "childList": {
                const addedNodes = mutation.addedNodes;
                const removedNodes = mutation.removedNodes;
                for (let j = 0; j < addedNodes.length; j++) {
                  const node = addedNodes[j];
                  if (node.nodeType !== 1 || excludeNodeSet.has(getNodeName(node))) continue;
                  subtrees.add(node);
                }
                for (let k = 0; k < removedNodes.length; k++) {
                  const node = removedNodes[k];
                  if (node.nodeType !== 1 || excludeNodeSet.has(getNodeName(node))) continue;
                  if (runLoopLimitChecker(node, type)) return;
                  styleMap.delete(node);
                }
                break;
              }
              case "attributes": {
                if (targetEl.nodeType !== 1 || excludeNodeSet.has(getNodeName(targetEl))) continue;
                let oldValue, newValue;
                switch (mutation.attributeName) {
                  case "style":
                    oldValue = mutation.oldValue?.replace(/\s/g, "") ?? "";
                    newValue = targetEl.style?.cssText?.replace(/\s/g, "") ?? "";
                    if (newValue !== oldValue) {
                      const oldArray = uniq(oldValue.split(";"));
                      const newArray = uniq(newValue.split(";"));
                      const retValue = String([...oldArray.filter(x => !newArray.includes(x)), ...newArray.filter(y => !oldArray.includes(y))]);
                      if (!/font:|font-weight:/gi.test(retValue)) continue;
                    }
                    break;
                  case "class":
                    oldValue = mutation.oldValue ?? "";
                    newValue = typeof targetEl.className === "object" ? targetEl.className?.baseVal ?? "" : targetEl.className ?? "";
                    if (newValue !== oldValue) {
                      if (!oldValue.includes(def.const.boldAttrName) && newValue.includes(def.const.boldAttrName)) continue;
                      if (oldValue.includes(def.const.boldAttrName) && !newValue.includes(def.const.boldAttrName)) {
                        if (runLoopLimitChecker(targetEl, type)) return;
                        continue;
                      }
                    }
                    break;
                  default:
                    oldValue = mutation.oldValue;
                    newValue = targetEl.getAttribute(mutation.attributeName);
                    break;
                }
                if (newValue === oldValue) continue;
                break;
              }
            }
            subtrees.add(targetEl);
          }
          mutationListMonitor(Array.from(subtrees), observer) && subtrees.clear();
          Array.from(shadowRootSet).forEach(s => observer.observe(s, config));
        }

        function runLoopLimitChecker(node, mode) {
          repeatedModifiedNodes[mode].push({ node, previousTime: performance.now() });
          if (repeatedModifiedNodes[mode].length > MAX_MODIFIED_NODES) repeatedModifiedNodes[mode].length = 0;
          if (defineLoopLimitChecker(node, performance.now(), mode)) return true;
        }

        function defineLoopLimitChecker(node, currentTime, mode) {
          const modifiedNodes = repeatedModifiedNodes[mode];
          if (modifiedNodes.length < MAX_MODIFIED_NODES) return;
          const findFixedBold = item => mode === "attributes" || qS(`.${def.const.boldAttrName}`, item) || item.classList.contains(def.const.boldAttrName);
          const groups = modifiedNodes.reduce((acc, cur) => {
            const key = cur.node.outerHTML;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          const object = Object.keys(groups);
          const count = object.length;
          const maxKey = object.reduce((a, b) => (groups[a] > groups[b] ? a : b));
          const filterNodeRules = r => r.node.isEqualNode(node) && r.node.outerHTML === maxKey && findFixedBold(node) && currentTime - r.previousTime <= MAX_TIME_INTERVAL;
          const repeatedNodes = modifiedNodes.filter(filterNodeRules);
          if (count > MAX_REPEATED_NODES || repeatedNodes.length < MAX_MODIFIED_NODES / count) return false;
          repeatedModifiedNodes[mode].length = 0;
          __console("warn", "Ignored:", capitalize(mode), "loop limit exceeded", IS_IN_FRAMES);
          return true;
        }

        function observeBoldElements() {
          const eventType = w.event?.type ?? "initial";
          const el = querySelectorAllShadows(`:not(${def.const.exQueryString})`, document);
          const items = getBoldStyles(el);
          for (let i = 0; i < items.length; i++) {
            boldFixedHandler(items[i]);
          }
          fixBoldObserver.observe(document, config);
          shadowRootSet.add(document);
          debugOnce(eventType, `detect fontbold.Stroke${IS_IN_FRAMES}:`, { eventType });
        }

        function mouseEventsHandler(target) {
          if (target.nodeType !== 1 || excludeNodeSet.has(getNodeName(target))) return;
          target.addEventListener("transitionend", () => boldFixedHandler(target), { once: true });
          boldFixedHandler(target);
        }

        function handlingMouseEvents() {
          const type = event.type;
          const target = event.target;
          deBounce({ fn: mouseEventsHandler, delay: def.const.ft, timer: type, immed: type === "mouseout" })(target);
          event.stopPropagation();
        }

        w.addEventListener("pushState", observeBoldElements);
        w.addEventListener("replaceState", observeBoldElements);
        document.addEventListener("mouseover", handlingMouseEvents);
        document.addEventListener("mouseout", handlingMouseEvents);
        observeBoldElements();
      }

      /* CSS_STYLE_PROCESSING_MAIN_THREAD */

      function monitorMainStyleProcess() {
        if (!IS_CURRENTSITE_ALLOWED || !IS_INTERNALSTYLE_ALLOWED) return;
        const mainStyleObserver = new MutationObserver(mainStyleProcess);
        const config = { attributes: true, childList: true, subtree: true };
        mainStyleObserver.observe(document, config);

        function mainStyleProcess(mutationsList, observer) {
          const hasMainStyle = getMainStyleElements({ currentScope: true });
          const pendingList = observer.takeRecords();
          observer.disconnect();
          const uniqueMutations = uniq(pendingList.concat(mutationsList));
          for (let i = 0; i < uniqueMutations.length; i++) {
            const mutation = uniqueMutations[i];
            const targetEl = mutation.target;
            switch (mutation.type) {
              case "childList": {
                const addedNodes = mutation.addedNodes;
                const removedNodes = mutation.removedNodes;
                for (let j = 0; j < addedNodes.length; j++) {
                  const node = addedNodes[j];
                  const nodeName = getNodeName(node);
                  if (node.nodeType !== 1) continue;
                  if (!hasMainStyle && document.head) deBounce({ fn: insertMainStyleElement, delay: 1e2, timer: "repeatcheck", immed: true })();
                  if (nodeName === "iframe") insertStyleInFrames("addedNodes", [node]);
                  if (["link", "style"].includes(nodeName)) {
                    if (isFixViewport) deBounce({ fn: fixViewportCssStyle, delay: 1e2, timer: "fixviewport" })(node, def.const.curScale);
                    if (targetEl === document.head) deBounce({ fn: moveStyleToLast, delay: 3e2, timer: "movestyle" })(node);
                  }
                }
                for (let k = 0; k < removedNodes.length; k++) {
                  const node = removedNodes[k];
                  const nodeName = getNodeName(node);
                  if (targetEl === document.head && nodeName === "style" && node.id === def.id.rndStyle && !node.dataset.frRemoved) {
                    const insertSuccess = insertMainStyleElement({ overwrite: false });
                    if (insertSuccess) INFO(`%c[MO]${IS_IN_FRAMES}[REINSERT]:%c<${nodeName}> ${insertSuccess}`, leftStyle("brown"), rightStyle("brown"));
                  }
                }
                break;
              }
              case "attributes":
                if (getNodeName(targetEl) === "iframe" && mutation.attributeName === "src") {
                  if (targetEl.src) insertStyleInFrames("Attributes", [targetEl]);
                }
                break;
            }
          }
          observer.observe(document, config);
        }
      }

      /* FONT_RENDERING_MAIN_PROCESS */

      !(async function FontRendering(initMenus) {
        "use strict";
        if (CUR_WINDOW_TOP) {
          // DATA_AND_UPDATE
          if (await detectAndReconstructData(SET_BOOL_FOR_UPDATE)) {
            showUpdateInfo();
          }
          // SYSTEM_INFO
          await getCurrentFontName(CONST_VALUES.fontFace, refont, def.const.defaultFont);
          showSystemInfo.system();
          showSystemInfo.compat(IS_CHEAT_UA);
          // MENUS
          globalDisableNotice(globalDisable, curEmptyConfig);
          insertMenus(initMenus());
          insertHotkey();
        }
        // MAIN_THREAD
        fixScaleOffset(def.const.curScale);
        insertMainStyleElement();
        monitorMainStyleProcess();
        fixFontStrokeStyleErrors(fixBoldTextStyle);
        // LOADEVENTS
        addLoadEvents.addFn(insertStyleInFrames);
        addLoadEvents.addFn(runFixViewportUnits);
        addLoadEvents.addFinalFn(getStyleLoadStatus);
      })(() => {
        "use strict";
        if (CUR_WINDOW_TOP && !IS_GREASEMONKEY) {
          return GMregisterMenuCommand("\ufff0\ud83d\udd52\u0020正在载入脚本菜单，请稍候…", () => location.reload());
        }
      });
    })(
      "JUU4JUFBJUIxSlZpWSVFNyU5MCU4OSVFNiU5RiU5MyVFNSVBRCVCQSVFOCU4MiVCQXAyTyVFNiU5MyU5MzAlRTglODUlOTF0JUU1JUIyJTgwJUU1JUFFJTlBJUU4JTg2JUJBZQ==",
      async () => {
        "use strict";
        let maxPersonalSites, isBackupFunction, isPreview, isFontsize, isHotkey, isFixViewport, isCloseTip, isCustomMono, rebuild, curVersion, globalDisable, _config_data_;
        const configure = await GMgetValue("_CONFIGURE_");
        if (!configure) {
          maxPersonalSites = 100;
          isBackupFunction = true;
          isPreview = false;
          isFontsize = false;
          isFixViewport = false;
          isHotkey = true;
          isCloseTip = false;
          rebuild = def.variable.undefined;
          curVersion = def.variable.undefined;
          globalDisable = false;
          isCustomMono = false;
          _config_data_ = { maxPersonalSites, isBackupFunction, isPreview, isFontsize, isFixViewport, isHotkey, isCloseTip, rebuild, curVersion, globalDisable };
          saveData("_CONFIGURE_", _config_data_);
        } else {
          try {
            _config_data_ = JSON.parse(decrypt(configure));
          } catch (e) {
            ERROR("_config_data_.JSON.parse:", e.message);
            def.const.structureError = true;
            _config_data_ = {};
          }
          maxPersonalSites = Number(_config_data_.maxPersonalSites) || 100;
          isBackupFunction = Boolean(_config_data_.isBackupFunction ?? true);
          isPreview = Boolean(_config_data_.isPreview);
          isFontsize = Boolean(_config_data_.isFontsize);
          isFixViewport = isFontsize ? Boolean(_config_data_.isFixViewport ?? true) : false;
          isHotkey = Boolean(_config_data_.isHotkey ?? true);
          isCloseTip = Boolean(_config_data_.isCloseTip);
          rebuild = _config_data_.rebuild;
          curVersion = _config_data_.curVersion;
          globalDisable = Boolean(_config_data_.globalDisable);
          isCustomMono = Boolean(_config_data_.isCustomMono);
        }
        def.const.isPreview = isPreview;
        def.const.isFontsize = isFontsize;
        return { maxPersonalSites, isBackupFunction, isPreview, isFontsize, isFixViewport, isHotkey, isCloseTip, isCustomMono, rebuild, curVersion, globalDisable };
      },
      async () => {
        "use strict";
        let monoSiteRules = await GMgetValue("_MONOSPACED_SITERULES_");
        try {
          monoSiteRules = monoSiteRules ? [...JSON.parse(decrypt(monoSiteRules))] : [];
        } catch (e) {
          ERROR("Monospaced_siteRules.Array.parse:", e.message);
          monoSiteRules = [];
        }
        let monoFontList = await GMgetValue("_MONOSPACED_FONTLIST_");
        try {
          monoFontList = monoFontList ? convertHtmlToText(JSON.parse(decrypt(monoFontList))) : "";
        } catch (e) {
          ERROR("Monospaced_Fontlist.String.parse:", e.message);
          monoFontList = "";
        }
        let monoFeature = await GMgetValue("_MONOSPACED_FEATURE_");
        try {
          monoFeature = monoFeature ? convertHtmlToText(JSON.parse(decrypt(monoFeature))) : "";
        } catch (e) {
          ERROR("Monospaced_Feature.String.parse:", e.message);
          monoFeature = "";
        }
        return { monoSiteRules, monoFontList, monoFeature };
      },
      async () => {
        "use strict";
        let exSite;
        const defautlExSite = ["workstation-xi", "127.0.0.1"].sort();
        const exSiteSave = await GMgetValue("_EXCLUDE_SITES_");
        if (!exSiteSave) {
          saveData("_EXCLUDE_SITES_", defautlExSite);
          exSite = defautlExSite;
        } else {
          try {
            exSite = [...JSON.parse(decrypt(exSiteSave))];
          } catch (e) {
            ERROR("ExSite.JSON.parse:", e.message);
            def.const.structureError = true;
            exSite = defautlExSite;
          }
        }
        def.const.exSitesIndex = updateExsitesIndex(exSite);
        return exSite;
      },
      async () => {
        "use strict";
        let fontValue, domainValue, domainValueIndex, fontSelect, fontFace, fontSmooth, fontSize, fixViewport, fontStroke, fixStroke, fontShadow, shadowColor, fontCSS, fontEx;
        const domains = await GMgetValue("_DOMAINS_FONTS_SET_");
        const fonts = await GMgetValue("_FONTS_SET_");
        const isMatchEditorialSite = matchEditorialSites(INITIAL_VALUES.editorialSites);
        if (!domains) {
          saveData("_DOMAINS_FONTS_SET_", []);
        } else {
          try {
            domainValue = [...JSON.parse(decrypt(domains))];
          } catch (e) {
            ERROR("DomainValue.JSON.parse:", e.message);
            def.const.structureError = true;
            domainValue = [];
          }
          domainValueIndex = updateDomainsIndex(domainValue);
          def.count.domainCount = domainValue.length;
          def.const.domainIndex = domainValueIndex;
        }
        if (!fonts) {
          saveData("_FONTS_SET_", {
            fontSelect: INITIAL_VALUES.fontSelect,
            fontFace: INITIAL_VALUES.fontFace,
            fontSmooth: INITIAL_VALUES.fontSmooth,
            fontSize: INITIAL_VALUES.fontSize,
            fixViewport: INITIAL_VALUES.fixViewport,
            fontStroke: INITIAL_VALUES.fontStroke,
            fixStroke: INITIAL_VALUES.fixStroke,
            fontShadow: INITIAL_VALUES.fontShadow,
            shadowColor: INITIAL_VALUES.shadowColor,
            fontCSS: INITIAL_VALUES.fontCSS,
            fontEx: INITIAL_VALUES.fontEx,
          });
          fontSelect = INITIAL_VALUES.fontSelect;
          fontFace = INITIAL_VALUES.fontFace;
          fontSmooth = INITIAL_VALUES.fontSmooth;
          fontSize = INITIAL_VALUES.fontSize;
          fixViewport = INITIAL_VALUES.fixViewport;
          fontStroke = INITIAL_VALUES.fontStroke;
          fixStroke = INITIAL_VALUES.fixStroke;
          fontShadow = INITIAL_VALUES.fontShadow;
          shadowColor = INITIAL_VALUES.shadowColor;
          fontCSS = INITIAL_VALUES.fontCSS;
          fontEx = INITIAL_VALUES.fontEx;
        } else {
          try {
            fontValue = JSON.parse(decrypt(fonts));
          } catch (e) {
            ERROR("FontValue.JSON.parse:", e.message);
            def.const.structureError = true;
            fontValue = {};
          }
          if (typeof domainValueIndex !== "undefined") {
            fontSelect = removeDuplicateFonts(convertHtmlToText(domainValue[domainValueIndex].fontSelect), INITIAL_VALUES.fontBase);
            fontFace = Boolean(domainValue[domainValueIndex].fontFace);
            fontSmooth = Boolean(domainValue[domainValueIndex].fontSmooth);
            fontSize = !def.const.isFontsize ? 1 : isMatchEditorialSite ? 1 : Number(domainValue[domainValueIndex].fontSize) || 1;
            fixViewport = fontSize !== 1 && Boolean(domainValue[domainValueIndex].fixViewport ?? true);
            fontStroke = Number(domainValue[domainValueIndex].fontStroke) || 0;
            fixStroke = Boolean(IS_REAL_BLINK && fontStroke && (domainValue[domainValueIndex].fixStroke ?? true));
            fontShadow = Number(domainValue[domainValueIndex].fontShadow) || 0;
            shadowColor = convertHtmlToText(domainValue[domainValueIndex].shadowColor);
            fontCSS = convertHtmlToText(domainValue[domainValueIndex].fontCSS) || INITIAL_VALUES.fontCSS;
            fontEx = convertHtmlToText(domainValue[domainValueIndex].fontEx) || "";
          } else {
            fontSelect = removeDuplicateFonts(convertHtmlToText(fontValue.fontSelect), INITIAL_VALUES.fontBase);
            fontFace = Boolean(fontValue.fontFace);
            fontSmooth = Boolean(fontValue.fontSmooth);
            fontSize = !def.const.isFontsize ? 1 : isMatchEditorialSite ? 1 : Number(fontValue.fontSize) || 1;
            fixViewport = fontSize !== 1 && Boolean(fontValue.fixViewport ?? true);
            fontStroke = Number(fontValue.fontStroke) || 0;
            fixStroke = Boolean(IS_REAL_BLINK && fontStroke && (fontValue.fixStroke ?? true));
            fontShadow = Number(fontValue.fontShadow) || 0;
            shadowColor = convertHtmlToText(fontValue.shadowColor);
            fontCSS = convertHtmlToText(fontValue.fontCSS) || INITIAL_VALUES.fontCSS;
            fontEx = convertHtmlToText(fontValue.fontEx) || "";
          }
        }
        return { fontSelect, fontFace, fontSmooth, fontSize, fixViewport, fontStroke, fixStroke, fontShadow, shadowColor, fontCSS, fontEx, isMatchEditorialSite };
      }
    );
  })(createTrustedTypePolicy(), () => {
    "use strict";
    const navigatorInfo = getNavigatorInfo();
    const locationInfo = getLocationInfo();
    return { navigatorInfo, locationInfo };
  });
})(typeof window !== "undefined" ? window : this);
