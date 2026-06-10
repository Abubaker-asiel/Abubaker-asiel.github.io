// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It should return a JS Array containing 2 elements. The first
  //   should be the bytes for the wasm module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The second
  //   should be the result of using the JS 'import' API on the js file path.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _4: (o, c) => o instanceof c,
      _5: o => Object.keys(o),
      _8: (o, a) => o + a,
      _36: x0 => new Array(x0),
      _38: x0 => x0.length,
      _40: (x0,x1) => x0[x1],
      _41: (x0,x1,x2) => { x0[x1] = x2 },
      _43: x0 => new Promise(x0),
      _45: (x0,x1,x2) => new DataView(x0,x1,x2),
      _47: x0 => new Int8Array(x0),
      _48: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _49: x0 => new Uint8Array(x0),
      _51: x0 => new Uint8ClampedArray(x0),
      _53: x0 => new Int16Array(x0),
      _55: x0 => new Uint16Array(x0),
      _57: x0 => new Int32Array(x0),
      _59: x0 => new Uint32Array(x0),
      _61: x0 => new Float32Array(x0),
      _63: x0 => new Float64Array(x0),
      _65: (x0,x1,x2) => x0.call(x1,x2),
      _70: (decoder, codeUnits) => decoder.decode(codeUnits),
      _71: () => new TextDecoder("utf-8", {fatal: true}),
      _72: () => new TextDecoder("utf-8", {fatal: false}),
      _73: (s) => +s,
      _74: x0 => new Uint8Array(x0),
      _75: (x0,x1,x2) => x0.set(x1,x2),
      _76: (x0,x1) => x0.transferFromImageBitmap(x1),
      _78: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._78(f,arguments.length,x0) }),
      _79: x0 => new window.FinalizationRegistry(x0),
      _80: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _81: (x0,x1) => x0.unregister(x1),
      _82: (x0,x1,x2) => x0.slice(x1,x2),
      _83: (x0,x1) => x0.decode(x1),
      _84: (x0,x1) => x0.segment(x1),
      _85: () => new TextDecoder(),
      _86: (x0,x1) => x0.get(x1),
      _87: x0 => x0.buffer,
      _88: x0 => x0.wasmMemory,
      _89: () => globalThis.window._flutter_skwasmInstance,
      _90: x0 => x0.rasterStartMilliseconds,
      _91: x0 => x0.rasterEndMilliseconds,
      _92: x0 => x0.imageBitmaps,
      _196: x0 => x0.stopPropagation(),
      _197: x0 => x0.preventDefault(),
      _199: x0 => x0.remove(),
      _200: (x0,x1) => x0.append(x1),
      _201: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _246: x0 => x0.unlock(),
      _247: x0 => x0.getReader(),
      _248: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _249: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _250: (x0,x1) => x0.item(x1),
      _251: x0 => x0.next(),
      _252: x0 => x0.now(),
      _253: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._253(f,arguments.length,x0) }),
      _254: (x0,x1) => x0.addListener(x1),
      _255: (x0,x1) => x0.removeListener(x1),
      _256: (x0,x1) => x0.matchMedia(x1),
      _257: (x0,x1) => x0.revokeObjectURL(x1),
      _258: x0 => x0.close(),
      _259: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _260: x0 => new window.ImageDecoder(x0),
      _261: x0 => ({frameIndex: x0}),
      _262: (x0,x1) => x0.decode(x1),
      _263: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._263(f,arguments.length,x0) }),
      _264: (x0,x1) => x0.getModifierState(x1),
      _265: (x0,x1) => x0.removeProperty(x1),
      _266: (x0,x1) => x0.prepend(x1),
      _267: x0 => new Intl.Locale(x0),
      _268: x0 => x0.disconnect(),
      _269: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._269(f,arguments.length,x0) }),
      _270: (x0,x1) => x0.getAttribute(x1),
      _271: (x0,x1) => x0.contains(x1),
      _272: (x0,x1) => x0.querySelector(x1),
      _273: x0 => x0.blur(),
      _274: x0 => x0.hasFocus(),
      _275: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _276: (x0,x1) => x0.hasAttribute(x1),
      _277: (x0,x1) => x0.getModifierState(x1),
      _278: (x0,x1) => x0.createTextNode(x1),
      _279: (x0,x1) => x0.appendChild(x1),
      _280: (x0,x1) => x0.removeAttribute(x1),
      _281: x0 => x0.getBoundingClientRect(),
      _282: (x0,x1) => x0.observe(x1),
      _283: x0 => x0.disconnect(),
      _284: (x0,x1) => x0.closest(x1),
      _707: () => globalThis.window.flutterConfiguration,
      _709: x0 => x0.assetBase,
      _714: x0 => x0.canvasKitMaximumSurfaces,
      _715: x0 => x0.debugShowSemanticsNodes,
      _716: x0 => x0.hostElement,
      _717: x0 => x0.multiViewEnabled,
      _718: x0 => x0.nonce,
      _720: x0 => x0.fontFallbackBaseUrl,
      _730: x0 => x0.console,
      _731: x0 => x0.devicePixelRatio,
      _732: x0 => x0.document,
      _733: x0 => x0.history,
      _734: x0 => x0.innerHeight,
      _735: x0 => x0.innerWidth,
      _736: x0 => x0.location,
      _737: x0 => x0.navigator,
      _738: x0 => x0.visualViewport,
      _739: x0 => x0.performance,
      _741: x0 => x0.URL,
      _743: (x0,x1) => x0.getComputedStyle(x1),
      _744: x0 => x0.screen,
      _745: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._745(f,arguments.length,x0) }),
      _746: (x0,x1) => x0.requestAnimationFrame(x1),
      _751: (x0,x1) => x0.warn(x1),
      _754: x0 => globalThis.parseFloat(x0),
      _755: () => globalThis.window,
      _756: () => globalThis.Intl,
      _757: () => globalThis.Symbol,
      _758: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _760: x0 => x0.clipboard,
      _761: x0 => x0.maxTouchPoints,
      _762: x0 => x0.vendor,
      _763: x0 => x0.language,
      _764: x0 => x0.platform,
      _765: x0 => x0.userAgent,
      _766: (x0,x1) => x0.vibrate(x1),
      _767: x0 => x0.languages,
      _768: x0 => x0.documentElement,
      _769: (x0,x1) => x0.querySelector(x1),
      _772: (x0,x1) => x0.createElement(x1),
      _775: (x0,x1) => x0.createEvent(x1),
      _776: x0 => x0.activeElement,
      _779: x0 => x0.head,
      _780: x0 => x0.body,
      _782: (x0,x1) => { x0.title = x1 },
      _785: x0 => x0.visibilityState,
      _786: () => globalThis.document,
      _787: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._787(f,arguments.length,x0) }),
      _788: (x0,x1) => x0.dispatchEvent(x1),
      _796: x0 => x0.target,
      _798: x0 => x0.timeStamp,
      _799: x0 => x0.type,
      _801: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _808: x0 => x0.firstChild,
      _812: x0 => x0.parentElement,
      _814: (x0,x1) => { x0.textContent = x1 },
      _815: x0 => x0.parentNode,
      _817: (x0,x1) => x0.removeChild(x1),
      _818: x0 => x0.isConnected,
      _826: x0 => x0.clientHeight,
      _827: x0 => x0.clientWidth,
      _828: x0 => x0.offsetHeight,
      _829: x0 => x0.offsetWidth,
      _830: x0 => x0.id,
      _831: (x0,x1) => { x0.id = x1 },
      _834: (x0,x1) => { x0.spellcheck = x1 },
      _835: x0 => x0.tagName,
      _836: x0 => x0.style,
      _838: (x0,x1) => x0.querySelectorAll(x1),
      _839: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _840: (x0,x1) => { x0.tabIndex = x1 },
      _841: x0 => x0.tabIndex,
      _842: (x0,x1) => x0.focus(x1),
      _843: x0 => x0.scrollTop,
      _844: (x0,x1) => { x0.scrollTop = x1 },
      _845: x0 => x0.scrollLeft,
      _846: (x0,x1) => { x0.scrollLeft = x1 },
      _847: x0 => x0.classList,
      _849: (x0,x1) => { x0.className = x1 },
      _851: (x0,x1) => x0.getElementsByClassName(x1),
      _852: x0 => x0.click(),
      _853: (x0,x1) => x0.attachShadow(x1),
      _856: x0 => x0.computedStyleMap(),
      _857: (x0,x1) => x0.get(x1),
      _863: (x0,x1) => x0.getPropertyValue(x1),
      _864: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _865: x0 => x0.offsetLeft,
      _866: x0 => x0.offsetTop,
      _867: x0 => x0.offsetParent,
      _869: (x0,x1) => { x0.name = x1 },
      _870: x0 => x0.content,
      _871: (x0,x1) => { x0.content = x1 },
      _875: (x0,x1) => { x0.src = x1 },
      _876: x0 => x0.naturalWidth,
      _877: x0 => x0.naturalHeight,
      _881: (x0,x1) => { x0.crossOrigin = x1 },
      _883: (x0,x1) => { x0.decoding = x1 },
      _884: x0 => x0.decode(),
      _889: (x0,x1) => { x0.nonce = x1 },
      _894: (x0,x1) => { x0.width = x1 },
      _896: (x0,x1) => { x0.height = x1 },
      _899: (x0,x1) => x0.getContext(x1),
      _960: x0 => x0.width,
      _961: x0 => x0.height,
      _963: (x0,x1) => x0.fetch(x1),
      _964: x0 => x0.status,
      _965: x0 => x0.headers,
      _966: x0 => x0.body,
      _967: x0 => x0.arrayBuffer(),
      _970: x0 => x0.read(),
      _971: x0 => x0.value,
      _972: x0 => x0.done,
      _979: x0 => x0.name,
      _980: x0 => x0.x,
      _981: x0 => x0.y,
      _984: x0 => x0.top,
      _985: x0 => x0.right,
      _986: x0 => x0.bottom,
      _987: x0 => x0.left,
      _997: x0 => x0.height,
      _998: x0 => x0.width,
      _999: x0 => x0.scale,
      _1000: (x0,x1) => { x0.value = x1 },
      _1003: (x0,x1) => { x0.placeholder = x1 },
      _1005: (x0,x1) => { x0.name = x1 },
      _1006: x0 => x0.selectionDirection,
      _1007: x0 => x0.selectionStart,
      _1008: x0 => x0.selectionEnd,
      _1011: x0 => x0.value,
      _1013: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1014: x0 => x0.readText(),
      _1015: (x0,x1) => x0.writeText(x1),
      _1017: x0 => x0.altKey,
      _1018: x0 => x0.code,
      _1019: x0 => x0.ctrlKey,
      _1020: x0 => x0.key,
      _1021: x0 => x0.keyCode,
      _1022: x0 => x0.location,
      _1023: x0 => x0.metaKey,
      _1024: x0 => x0.repeat,
      _1025: x0 => x0.shiftKey,
      _1026: x0 => x0.isComposing,
      _1028: x0 => x0.state,
      _1029: (x0,x1) => x0.go(x1),
      _1031: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1032: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1033: x0 => x0.pathname,
      _1034: x0 => x0.search,
      _1035: x0 => x0.hash,
      _1039: x0 => x0.state,
      _1042: (x0,x1) => x0.createObjectURL(x1),
      _1044: x0 => new Blob(x0),
      _1046: x0 => new MutationObserver(x0),
      _1047: (x0,x1,x2) => x0.observe(x1,x2),
      _1048: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1048(f,arguments.length,x0,x1) }),
      _1051: x0 => x0.attributeName,
      _1052: x0 => x0.type,
      _1053: x0 => x0.matches,
      _1054: x0 => x0.matches,
      _1058: x0 => x0.relatedTarget,
      _1060: x0 => x0.clientX,
      _1061: x0 => x0.clientY,
      _1062: x0 => x0.offsetX,
      _1063: x0 => x0.offsetY,
      _1066: x0 => x0.button,
      _1067: x0 => x0.buttons,
      _1068: x0 => x0.ctrlKey,
      _1072: x0 => x0.pointerId,
      _1073: x0 => x0.pointerType,
      _1074: x0 => x0.pressure,
      _1075: x0 => x0.tiltX,
      _1076: x0 => x0.tiltY,
      _1077: x0 => x0.getCoalescedEvents(),
      _1080: x0 => x0.deltaX,
      _1081: x0 => x0.deltaY,
      _1082: x0 => x0.wheelDeltaX,
      _1083: x0 => x0.wheelDeltaY,
      _1084: x0 => x0.deltaMode,
      _1091: x0 => x0.changedTouches,
      _1094: x0 => x0.clientX,
      _1095: x0 => x0.clientY,
      _1098: x0 => x0.data,
      _1101: (x0,x1) => { x0.disabled = x1 },
      _1103: (x0,x1) => { x0.type = x1 },
      _1104: (x0,x1) => { x0.max = x1 },
      _1105: (x0,x1) => { x0.min = x1 },
      _1106: x0 => x0.value,
      _1107: (x0,x1) => { x0.value = x1 },
      _1108: x0 => x0.disabled,
      _1109: (x0,x1) => { x0.disabled = x1 },
      _1111: (x0,x1) => { x0.placeholder = x1 },
      _1112: (x0,x1) => { x0.name = x1 },
      _1115: (x0,x1) => { x0.autocomplete = x1 },
      _1116: x0 => x0.selectionDirection,
      _1117: x0 => x0.selectionStart,
      _1119: x0 => x0.selectionEnd,
      _1122: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1123: (x0,x1) => x0.add(x1),
      _1126: (x0,x1) => { x0.noValidate = x1 },
      _1127: (x0,x1) => { x0.method = x1 },
      _1128: (x0,x1) => { x0.action = x1 },
      _1154: x0 => x0.orientation,
      _1155: x0 => x0.width,
      _1156: x0 => x0.height,
      _1157: (x0,x1) => x0.lock(x1),
      _1176: x0 => new ResizeObserver(x0),
      _1179: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1179(f,arguments.length,x0,x1) }),
      _1187: x0 => x0.length,
      _1188: x0 => x0.iterator,
      _1189: x0 => x0.Segmenter,
      _1190: x0 => x0.v8BreakIterator,
      _1191: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1194: x0 => x0.language,
      _1195: x0 => x0.script,
      _1196: x0 => x0.region,
      _1214: x0 => x0.done,
      _1215: x0 => x0.value,
      _1216: x0 => x0.index,
      _1220: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1221: (x0,x1) => x0.adoptText(x1),
      _1222: x0 => x0.first(),
      _1223: x0 => x0.next(),
      _1224: x0 => x0.current(),
      _1238: x0 => x0.hostElement,
      _1239: x0 => x0.viewConstraints,
      _1242: x0 => x0.maxHeight,
      _1243: x0 => x0.maxWidth,
      _1244: x0 => x0.minHeight,
      _1245: x0 => x0.minWidth,
      _1246: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1246(f,arguments.length,x0) }),
      _1247: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1247(f,arguments.length,x0) }),
      _1248: (x0,x1) => ({addView: x0,removeView: x1}),
      _1251: x0 => x0.loader,
      _1252: () => globalThis._flutter,
      _1253: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1254: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1254(f,arguments.length,x0) }),
      _1255: f => finalizeWrapper(f, function() { return dartInstance.exports._1255(f,arguments.length) }),
      _1256: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1259: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1259(f,arguments.length,x0) }),
      _1260: x0 => ({runApp: x0}),
      _1262: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1262(f,arguments.length,x0,x1) }),
      _1263: x0 => x0.length,
      _1264: () => globalThis.window.ImageDecoder,
      _1265: x0 => x0.tracks,
      _1267: x0 => x0.completed,
      _1269: x0 => x0.image,
      _1275: x0 => x0.displayWidth,
      _1276: x0 => x0.displayHeight,
      _1277: x0 => x0.duration,
      _1280: x0 => x0.ready,
      _1281: x0 => x0.selectedTrack,
      _1282: x0 => x0.repetitionCount,
      _1283: x0 => x0.frameCount,
      _1337: x0 => globalThis.URL.createObjectURL(x0),
      _1343: (x0,x1) => x0.querySelector(x1),
      _1344: (x0,x1) => x0.createElement(x1),
      _1345: (x0,x1) => x0.append(x1),
      _1348: x0 => x0.click(),
      _1359: x0 => x0.toArray(),
      _1360: x0 => x0.toUint8Array(),
      _1361: x0 => ({serverTimestamps: x0}),
      _1362: x0 => ({source: x0}),
      _1363: x0 => ({merge: x0}),
      _1365: x0 => new firebase_firestore.FieldPath(x0),
      _1366: (x0,x1) => new firebase_firestore.FieldPath(x0,x1),
      _1367: (x0,x1,x2) => new firebase_firestore.FieldPath(x0,x1,x2),
      _1368: (x0,x1,x2,x3) => new firebase_firestore.FieldPath(x0,x1,x2,x3),
      _1369: (x0,x1,x2,x3,x4) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4),
      _1370: (x0,x1,x2,x3,x4,x5) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5),
      _1371: (x0,x1,x2,x3,x4,x5,x6) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6),
      _1372: (x0,x1,x2,x3,x4,x5,x6,x7) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7),
      _1373: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8),
      _1374: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9),
      _1375: () => globalThis.firebase_firestore.documentId(),
      _1376: (x0,x1) => new firebase_firestore.Timestamp(x0,x1),
      _1377: (x0,x1) => new firebase_firestore.GeoPoint(x0,x1),
      _1378: x0 => globalThis.firebase_firestore.vector(x0),
      _1379: x0 => globalThis.firebase_firestore.Bytes.fromUint8Array(x0),
      _1380: x0 => globalThis.firebase_firestore.writeBatch(x0),
      _1381: (x0,x1) => globalThis.firebase_firestore.collection(x0,x1),
      _1383: (x0,x1) => globalThis.firebase_firestore.doc(x0,x1),
      _1386: x0 => x0.call(),
      _1410: x0 => x0.commit(),
      _1413: (x0,x1,x2) => x0.set(x1,x2),
      _1414: x0 => globalThis.firebase_firestore.deleteDoc(x0),
      _1415: x0 => globalThis.firebase_firestore.getDoc(x0),
      _1416: x0 => globalThis.firebase_firestore.getDocFromServer(x0),
      _1417: x0 => globalThis.firebase_firestore.getDocFromCache(x0),
      _1418: (x0,x1) => ({includeMetadataChanges: x0,source: x1}),
      _1419: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1419(f,arguments.length,x0) }),
      _1420: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1420(f,arguments.length,x0) }),
      _1421: (x0,x1,x2,x3) => globalThis.firebase_firestore.onSnapshot(x0,x1,x2,x3),
      _1422: (x0,x1,x2) => globalThis.firebase_firestore.onSnapshot(x0,x1,x2),
      _1423: (x0,x1,x2) => globalThis.firebase_firestore.setDoc(x0,x1,x2),
      _1424: (x0,x1) => globalThis.firebase_firestore.setDoc(x0,x1),
      _1425: (x0,x1) => globalThis.firebase_firestore.query(x0,x1),
      _1426: x0 => globalThis.firebase_firestore.getDocs(x0),
      _1427: x0 => globalThis.firebase_firestore.getDocsFromServer(x0),
      _1428: x0 => globalThis.firebase_firestore.getDocsFromCache(x0),
      _1429: x0 => globalThis.firebase_firestore.limit(x0),
      _1430: x0 => globalThis.firebase_firestore.limitToLast(x0),
      _1431: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1431(f,arguments.length,x0) }),
      _1432: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1432(f,arguments.length,x0) }),
      _1433: (x0,x1) => globalThis.firebase_firestore.orderBy(x0,x1),
      _1435: (x0,x1,x2) => globalThis.firebase_firestore.where(x0,x1,x2),
      _1437: x0 => globalThis.firebase_firestore.doc(x0),
      _1440: (x0,x1) => x0.data(x1),
      _1444: x0 => x0.docChanges(),
      _1451: () => globalThis.firebase_firestore.deleteField(),
      _1452: () => globalThis.firebase_firestore.serverTimestamp(),
      _1462: (x0,x1) => globalThis.firebase_firestore.getFirestore(x0,x1),
      _1464: x0 => globalThis.firebase_firestore.Timestamp.fromMillis(x0),
      _1465: f => finalizeWrapper(f, function() { return dartInstance.exports._1465(f,arguments.length) }),
      _1596: () => globalThis.firebase_firestore.updateDoc,
      _1597: () => globalThis.firebase_firestore.or,
      _1598: () => globalThis.firebase_firestore.and,
      _1612: x0 => x0.path,
      _1615: () => globalThis.firebase_firestore.GeoPoint,
      _1616: x0 => x0.latitude,
      _1617: x0 => x0.longitude,
      _1619: () => globalThis.firebase_firestore.VectorValue,
      _1620: () => globalThis.firebase_firestore.Bytes,
      _1623: x0 => x0.type,
      _1625: x0 => x0.doc,
      _1627: x0 => x0.oldIndex,
      _1629: x0 => x0.newIndex,
      _1631: () => globalThis.firebase_firestore.DocumentReference,
      _1635: x0 => x0.path,
      _1644: x0 => x0.metadata,
      _1645: x0 => x0.ref,
      _1650: x0 => x0.docs,
      _1652: x0 => x0.metadata,
      _1657: () => globalThis.firebase_firestore.Timestamp,
      _1658: x0 => x0.seconds,
      _1659: x0 => x0.nanoseconds,
      _1695: x0 => x0.hasPendingWrites,
      _1697: x0 => x0.fromCache,
      _1704: x0 => x0.source,
      _1709: () => globalThis.firebase_firestore.startAfter,
      _1710: () => globalThis.firebase_firestore.startAt,
      _1711: () => globalThis.firebase_firestore.endBefore,
      _1712: () => globalThis.firebase_firestore.endAt,
      _1751: () => globalThis.Notification.requestPermission(),
      _1753: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1754: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1760: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1774: (x0,x1) => globalThis.firebase_auth.reauthenticateWithCredential(x0,x1),
      _1778: x0 => x0.reload(),
      _1783: (x0,x1) => globalThis.firebase_auth.updatePassword(x0,x1),
      _1788: x0 => x0.toJSON(),
      _1789: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1789(f,arguments.length,x0) }),
      _1790: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1790(f,arguments.length,x0) }),
      _1791: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1792: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1792(f,arguments.length,x0) }),
      _1793: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1793(f,arguments.length,x0) }),
      _1794: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1794(f,arguments.length,x0) }),
      _1795: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1795(f,arguments.length,x0) }),
      _1796: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      _1800: (x0,x1,x2) => globalThis.firebase_auth.createUserWithEmailAndPassword(x0,x1,x2),
      _1810: (x0,x1,x2) => globalThis.firebase_auth.signInWithEmailAndPassword(x0,x1,x2),
      _1815: x0 => x0.signOut(),
      _1816: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1821: (x0,x1) => globalThis.firebase_auth.EmailAuthProvider.credential(x0,x1),
      _1839: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      _1854: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      _1855: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1856: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1862: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      _1877: () => globalThis.firebase_auth.debugErrorMap,
      _1880: () => globalThis.firebase_auth.browserSessionPersistence,
      _1882: () => globalThis.firebase_auth.browserLocalPersistence,
      _1884: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1887: x0 => globalThis.firebase_auth.multiFactor(x0),
      _1888: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      _1890: x0 => x0.currentUser,
      _1894: x0 => x0.tenantId,
      _1904: x0 => x0.displayName,
      _1905: x0 => x0.email,
      _1906: x0 => x0.phoneNumber,
      _1907: x0 => x0.photoURL,
      _1908: x0 => x0.providerId,
      _1909: x0 => x0.uid,
      _1910: x0 => x0.emailVerified,
      _1911: x0 => x0.isAnonymous,
      _1912: x0 => x0.providerData,
      _1913: x0 => x0.refreshToken,
      _1914: x0 => x0.tenantId,
      _1915: x0 => x0.metadata,
      _1917: x0 => x0.providerId,
      _1918: x0 => x0.signInMethod,
      _1919: x0 => x0.accessToken,
      _1920: x0 => x0.idToken,
      _1921: x0 => x0.secret,
      _1933: x0 => x0.creationTime,
      _1934: x0 => x0.lastSignInTime,
      _1939: x0 => x0.code,
      _1941: x0 => x0.message,
      _1953: x0 => x0.email,
      _1954: x0 => x0.phoneNumber,
      _1955: x0 => x0.tenantId,
      _1978: x0 => x0.user,
      _1981: x0 => x0.providerId,
      _1982: x0 => x0.profile,
      _1983: x0 => x0.username,
      _1984: x0 => x0.isNewUser,
      _1987: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _1992: x0 => x0.displayName,
      _1993: x0 => x0.enrollmentTime,
      _1994: x0 => x0.factorId,
      _1995: x0 => x0.uid,
      _1997: x0 => x0.hints,
      _1998: x0 => x0.session,
      _2000: x0 => x0.phoneNumber,
      _2012: (x0,x1) => x0.getItem(x1),
      _2017: (x0,x1) => x0.appendChild(x1),
      _2019: (x0,x1) => x0.removeItem(x1),
      _2020: (x0,x1,x2) => x0.setItem(x1,x2),
      _2021: x0 => ({type: x0}),
      _2022: (x0,x1) => new Blob(x0,x1),
      _2023: (x0,x1) => x0.item(x1),
      _2024: () => new FileReader(),
      _2026: (x0,x1) => x0.readAsArrayBuffer(x1),
      _2027: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2027(f,arguments.length,x0) }),
      _2028: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _2029: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2029(f,arguments.length,x0) }),
      _2030: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _2031: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2031(f,arguments.length,x0) }),
      _2032: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2032(f,arguments.length,x0) }),
      _2033: (x0,x1) => x0.removeChild(x1),
      _2037: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _2038: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _2039: x0 => globalThis.firebase_core.getApp(x0),
      _2040: () => globalThis.firebase_core.getApp(),
      _2041: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      _2042: x0 => globalThis.firebase_core.deleteApp(x0),
      _2049: (x0,x1) => globalThis.firebase_storage.getStorage(x0,x1),
      _2051: x0 => globalThis.firebase_storage.deleteObject(x0),
      _2054: x0 => globalThis.firebase_storage.getDownloadURL(x0),
      _2058: (x0,x1) => globalThis.firebase_storage.ref(x0,x1),
      _2060: (x0,x1,x2) => globalThis.firebase_storage.uploadBytesResumable(x0,x1,x2),
      _2094: x0 => x0.snapshot,
      _2104: x0 => x0.state,
      _2117: (x0,x1) => { x0.contentType = x1 },
      _2119: (x0,x1) => { x0.customMetadata = x1 },
      _2130: () => ({}),
      _2131: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2131(f,arguments.length,x0) }),
      _2132: (x0,x1) => x0.then(x1),
      _2137: x0 => globalThis.firebase_storage.getStorage(x0),
      _2138: x0 => globalThis.firebase_messaging.getMessaging(x0),
      _2139: x0 => globalThis.firebase_messaging.deleteToken(x0),
      _2140: (x0,x1) => globalThis.firebase_messaging.getToken(x0,x1),
      _2142: (x0,x1) => globalThis.firebase_messaging.onMessage(x0,x1),
      _2143: (x0,x1) => ({next: x0,error: x1}),
      _2148: x0 => x0.title,
      _2149: x0 => x0.body,
      _2150: x0 => x0.image,
      _2151: x0 => x0.messageId,
      _2152: x0 => x0.collapseKey,
      _2153: x0 => x0.fcmOptions,
      _2154: x0 => x0.notification,
      _2155: x0 => x0.data,
      _2156: x0 => x0.from,
      _2157: x0 => x0.analyticsLabel,
      _2158: x0 => x0.link,
      _2159: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2159(f,arguments.length,x0) }),
      _2160: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2160(f,arguments.length,x0) }),
      _2162: () => globalThis.firebase_core.SDK_VERSION,
      _2168: x0 => x0.apiKey,
      _2170: x0 => x0.authDomain,
      _2172: x0 => x0.databaseURL,
      _2174: x0 => x0.projectId,
      _2176: x0 => x0.storageBucket,
      _2178: x0 => x0.messagingSenderId,
      _2180: x0 => x0.measurementId,
      _2182: x0 => x0.appId,
      _2184: x0 => x0.name,
      _2185: x0 => x0.options,
      _2186: (x0,x1) => x0.debug(x1),
      _2187: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2187(f,arguments.length,x0) }),
      _2188: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._2188(f,arguments.length,x0,x1) }),
      _2189: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _2190: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _2191: (x0,x1) => x0.createScriptURL(x1),
      _2192: (x0,x1,x2) => x0.createScript(x1,x2),
      _2193: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2193(f,arguments.length,x0) }),
      _2198: Date.now,
      _2200: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _2201: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _2202: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _2203: () => typeof dartUseDateNowForTicks !== "undefined",
      _2204: () => 1000 * performance.now(),
      _2205: () => Date.now(),
      _2206: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _2208: () => new WeakMap(),
      _2209: (map, o) => map.get(o),
      _2210: (map, o, v) => map.set(o, v),
      _2211: x0 => new WeakRef(x0),
      _2212: x0 => x0.deref(),
      _2219: () => globalThis.WeakRef,
      _2222: s => JSON.stringify(s),
      _2223: s => printToConsole(s),
      _2224: (o, p, r) => o.replaceAll(p, () => r),
      _2225: (o, p, r) => o.replace(p, () => r),
      _2226: Function.prototype.call.bind(String.prototype.toLowerCase),
      _2227: s => s.toUpperCase(),
      _2228: s => s.trim(),
      _2229: s => s.trimLeft(),
      _2230: s => s.trimRight(),
      _2231: (string, times) => string.repeat(times),
      _2232: Function.prototype.call.bind(String.prototype.indexOf),
      _2233: (s, p, i) => s.lastIndexOf(p, i),
      _2234: (string, token) => string.split(token),
      _2235: Object.is,
      _2236: o => o instanceof Array,
      _2237: (a, i) => a.push(i),
      _2241: a => a.pop(),
      _2242: (a, i) => a.splice(i, 1),
      _2243: (a, s) => a.join(s),
      _2244: (a, s, e) => a.slice(s, e),
      _2247: a => a.length,
      _2249: (a, i) => a[i],
      _2250: (a, i, v) => a[i] = v,
      _2252: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _2253: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _2255: o => o instanceof Uint8Array,
      _2256: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _2257: o => o instanceof Int8Array,
      _2258: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _2259: o => o instanceof Uint8ClampedArray,
      _2260: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _2261: o => o instanceof Uint16Array,
      _2262: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _2263: o => o instanceof Int16Array,
      _2264: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _2265: o => o instanceof Uint32Array,
      _2266: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _2267: o => o instanceof Int32Array,
      _2268: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _2270: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _2271: o => o instanceof Float32Array,
      _2272: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _2273: o => o instanceof Float64Array,
      _2274: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _2275: (t, s) => t.set(s),
      _2276: l => new DataView(new ArrayBuffer(l)),
      _2277: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _2279: o => o.buffer,
      _2280: o => o.byteOffset,
      _2281: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _2282: (b, o) => new DataView(b, o),
      _2283: (b, o, l) => new DataView(b, o, l),
      _2284: Function.prototype.call.bind(DataView.prototype.getUint8),
      _2285: Function.prototype.call.bind(DataView.prototype.setUint8),
      _2286: Function.prototype.call.bind(DataView.prototype.getInt8),
      _2287: Function.prototype.call.bind(DataView.prototype.setInt8),
      _2288: Function.prototype.call.bind(DataView.prototype.getUint16),
      _2289: Function.prototype.call.bind(DataView.prototype.setUint16),
      _2290: Function.prototype.call.bind(DataView.prototype.getInt16),
      _2291: Function.prototype.call.bind(DataView.prototype.setInt16),
      _2292: Function.prototype.call.bind(DataView.prototype.getUint32),
      _2293: Function.prototype.call.bind(DataView.prototype.setUint32),
      _2294: Function.prototype.call.bind(DataView.prototype.getInt32),
      _2295: Function.prototype.call.bind(DataView.prototype.setInt32),
      _2298: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _2299: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _2300: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _2301: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _2302: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _2303: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _2316: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _2317: (handle) => clearTimeout(handle),
      _2318: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _2319: (handle) => clearInterval(handle),
      _2320: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _2321: () => Date.now(),
      _2322: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2323: (x0,x1) => x0.exec(x1),
      _2324: (x0,x1) => x0.test(x1),
      _2325: x0 => x0.pop(),
      _2327: o => o === undefined,
      _2329: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2331: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2332: o => o instanceof RegExp,
      _2333: (l, r) => l === r,
      _2334: o => o,
      _2335: o => o,
      _2336: o => o,
      _2337: b => !!b,
      _2338: o => o.length,
      _2340: (o, i) => o[i],
      _2341: f => f.dartFunction,
      _2342: () => ({}),
      _2343: () => [],
      _2345: () => globalThis,
      _2346: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2347: (o, p) => p in o,
      _2348: (o, p) => o[p],
      _2349: (o, p, v) => o[p] = v,
      _2350: (o, m, a) => o[m].apply(o, a),
      _2352: o => String(o),
      _2353: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _2354: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2354(f,arguments.length,x0) }),
      _2355: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._2355(f,arguments.length,x0,x1) }),
      _2356: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      _2357: o => [o],
      _2358: (o0, o1) => [o0, o1],
      _2359: (o0, o1, o2) => [o0, o1, o2],
      _2360: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _2361: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2362: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2365: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2366: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2367: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2368: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2369: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2370: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2371: x0 => new ArrayBuffer(x0),
      _2372: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2374: x0 => x0.index,
      _2375: x0 => x0.groups,
      _2376: x0 => x0.flags,
      _2377: x0 => x0.multiline,
      _2378: x0 => x0.ignoreCase,
      _2379: x0 => x0.unicode,
      _2380: x0 => x0.dotAll,
      _2381: (x0,x1) => { x0.lastIndex = x1 },
      _2382: (o, p) => p in o,
      _2383: (o, p) => o[p],
      _2384: (o, p, v) => o[p] = v,
      _2385: (o, p) => delete o[p],
      _2393: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2393(f,arguments.length,x0) }),
      _2401: () => new AbortController(),
      _2402: x0 => x0.abort(),
      _2403: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _2404: (x0,x1) => globalThis.fetch(x0,x1),
      _2405: (x0,x1) => x0.get(x1),
      _2406: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._2406(f,arguments.length,x0,x1,x2) }),
      _2407: (x0,x1) => x0.forEach(x1),
      _2408: x0 => x0.getReader(),
      _2409: x0 => x0.cancel(),
      _2410: x0 => x0.read(),
      _2411: (x0,x1) => x0.key(x1),
      _2412: x0 => x0.trustedTypes,
      _2413: (x0,x1) => { x0.text = x1 },
      _2414: x0 => x0.random(),
      _2415: (x0,x1) => x0.getRandomValues(x1),
      _2416: () => globalThis.crypto,
      _2417: () => globalThis.Math,
      _2426: Function.prototype.call.bind(Number.prototype.toString),
      _2427: Function.prototype.call.bind(BigInt.prototype.toString),
      _2428: Function.prototype.call.bind(Number.prototype.toString),
      _2429: (d, digits) => d.toFixed(digits),
      _2595: (x0,x1) => { x0.draggable = x1 },
      _2611: x0 => x0.style,
      _3540: (x0,x1) => { x0.accept = x1 },
      _3554: x0 => x0.files,
      _3580: (x0,x1) => { x0.multiple = x1 },
      _3598: (x0,x1) => { x0.type = x1 },
      _3850: (x0,x1) => { x0.type = x1 },
      _3858: (x0,x1) => { x0.crossOrigin = x1 },
      _3860: (x0,x1) => { x0.text = x1 },
      _4316: () => globalThis.window,
      _4359: x0 => x0.location,
      _4378: x0 => x0.navigator,
      _4640: x0 => x0.trustedTypes,
      _4641: x0 => x0.sessionStorage,
      _4642: x0 => x0.localStorage,
      _4657: x0 => x0.hostname,
      _4767: x0 => x0.userAgent,
      _4975: x0 => x0.length,
      _6920: x0 => x0.signal,
      _6981: x0 => x0.firstChild,
      _6992: () => globalThis.document,
      _7073: x0 => x0.body,
      _7075: x0 => x0.head,
      _7404: (x0,x1) => { x0.id = x1 },
      _7431: x0 => x0.children,
      _8750: x0 => x0.value,
      _8752: x0 => x0.done,
      _8932: x0 => x0.size,
      _8933: x0 => x0.type,
      _8940: x0 => x0.name,
      _8946: x0 => x0.length,
      _8951: x0 => x0.result,
      _9448: x0 => x0.url,
      _9450: x0 => x0.status,
      _9452: x0 => x0.statusText,
      _9453: x0 => x0.headers,
      _9454: x0 => x0.body,
      _11860: (x0,x1) => { x0.display = x1 },
      _13082: x0 => x0.name,
      _13798: () => globalThis.console,
      _13826: x0 => x0.name,
      _13827: x0 => x0.message,
      _13828: x0 => x0.code,
      _13830: x0 => x0.customData,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      S: new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
