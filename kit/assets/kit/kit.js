/* STORY OF EVERYTHING (formerly Old Routes) motion kit — paper-cutout cartography for HyperFrames.
 * Global: window.Kit. Needs gsap, d3 (array, geo, geo-projection), topojson and the land data loaded first.
 * Everything is built synchronously and deterministically at load; all motion goes on the scene's paused GSAP timeline.
 * API reference: KIT_API.md (project root). */
(function () {
  "use strict";
  if (window.Kit) return; // the runtime de-duplicates script tags, but be safe

  var NS = "http://www.w3.org/2000/svg";
  var W = 1920, H = 1080;

  // ---------------------------------------------------------------- tokens
  var C = {
    paper: "#E7DEC8", paperCorner: "#C3B9A3", navy: "#192733", navyCorner: "#1C242B",
    ink: "#242018", ink2: "#625949", inkMute: "#A69C86", inkNavy: "#EFE9D9", ink2Navy: "#8C9BA5",
    red: "#C03F27", redNavy: "#DF716B", blue: "#24506C", blueNavy: "#7FA7C2", gold: "#E2AF51", goldCore: "#FCE59E",
    teal: "#376B67", tealNavy: "#8FC3B8", mace: "#B5332A",
    land: "#E0D8C0", sea: "#C0D0D4", globeSea: "#9AB3BE", landNavy: "#6E8494", seaNavy: "#192D3E",
    shallows: "#D2DEDF", shallowsNavy: "#24394A",
    card: "#EFE9D9", cardNavy: "#22313D", ivory: "#F4EFE2",
    // cutout paper colours
    parchment: "#EADFC0", sand: "#D9C9A0", ochre: "#C99A4B", apricot: "#E3B562", apricotDark: "#C98F45",
    flesh: "#F2E6C4", seed: "#5E3A22", seedLight: "#80542F", brown: "#7A4E2D", darkBrown: "#4E3220",
    wood: "#9A6B3F", woodLight: "#B78450", burlap: "#C9A877", burlapDark: "#A9885A",
    stone: "#B7AD97", stoneDark: "#8C836F", stoneLight: "#D8CFB8", iron: "#3D3B37",
    orange: "#D9772E", white: "#F4F0E6", silver: "#C9C6BC", silverDark: "#97948B", leaf: "#2E5651", leafLight: "#4A7D73",
    shadow: "#14120E"
  };
  // theme-aware tokens: [cream, navy]
  var TOK = {
    ink: [C.ink, C.inkNavy], ink2: [C.ink2, C.ink2Navy], red: [C.red, C.redNavy], blue: [C.blue, C.blueNavy],
    gold: [C.gold, C.gold], teal: [C.teal, C.tealNavy], mace: [C.mace, C.mace],
    accent: [C.blue, C.gold], land: [C.land, C.landNavy], sea: [C.sea, C.seaNavy], globeSea: [C.globeSea, C.seaNavy],
    shallows: [C.shallows, C.shallowsNavy], bg: [C.paper, C.navy], card: [C.card, C.cardNavy], kicker: [C.blue, "#B9C7D1"]
  };
  function tok(name, theme) {
    if (!name) return null;
    if (TOK[name]) return TOK[name][theme === "navy" ? 1 : 0];
    if (C[name]) return C[name];
    return name; // a literal colour
  }
  function pair(name) { // {cream, navy} for a token or literal
    if (TOK[name]) return { cream: TOK[name][0], navy: TOK[name][1] };
    var c = C[name] || name; return { cream: c, navy: c };
  }

  // ---------------------------------------------------------------- determinism
  function hashStr(s) { var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { // mulberry32
    var a = (typeof seed === "string" ? hashStr(seed) : (seed | 0)) >>> 0;
    return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hash2(seed, n) { return rng((Math.imul(seed | 0, 2654435761) ^ Math.imul(n | 0, 40503) ^ 0x9e3779b9) >>> 0)(); }

  // ---------------------------------------------------------------- dom helpers
  function S(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function D(tag, cls, parent, styles) {
    var e = document.createElement(tag || "div");
    if (cls) e.className = cls;
    if (styles) for (var k in styles) e.style[k] = styles[k];
    if (parent) parent.appendChild(e);
    return e;
  }
  function f2(n) { return Math.round(n * 100) / 100; }
  function fmtInt(n) { var s = String(Math.round(Math.abs(n))); var o = ""; while (s.length > 3) { o = "," + s.slice(-3) + o; s = s.slice(0, -3); } return (n < 0 ? "−" : "") + s + o; }

  // ---------------------------------------------------------------- textures (canvas → dataURL, once per page)
  var TEX = {};
  function smooth(t) { return t * t * (3 - 2 * t); }
  function periodicNoise(size, cells, r) {
    var g = new Float32Array(cells * cells), out = new Float32Array(size * size), i, x, y;
    for (i = 0; i < g.length; i++) g[i] = r();
    for (y = 0; y < size; y++) {
      var fy = y / size * cells, iy = Math.floor(fy), ty = smooth(fy - iy), y0 = iy % cells, y1 = (iy + 1) % cells;
      for (x = 0; x < size; x++) {
        var fx = x / size * cells, ix = Math.floor(fx), tx = smooth(fx - ix), x0 = ix % cells, x1 = (ix + 1) % cells;
        var a = g[y0 * cells + x0], b = g[y0 * cells + x1], c = g[y1 * cells + x0], d = g[y1 * cells + x1];
        out[y * size + x] = (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
      }
    }
    return out;
  }
  function makeTexture(kind) {
    if (TEX[kind]) return TEX[kind];
    var size = kind === "desk" ? 512 : 256;
    var cv = document.createElement("canvas"); cv.width = cv.height = size;
    var ctx = cv.getContext("2d"), r = rng("kit-tex-" + kind);
    var img = ctx.createImageData(size, size), px = img.data;
    var n1 = periodicNoise(size, kind === "desk" ? 6 : 8, r), n2 = periodicNoise(size, kind === "desk" ? 24 : 32, r), n3 = periodicNoise(size, 64, r);
    for (var i = 0; i < size * size; i++) {
      var grain = r() - 0.5;
      var m = (n1[i] - 0.5) * 0.9 + (n2[i] - 0.5) * 0.6 + (n3[i] - 0.5) * 0.35;
      var p = i * 4;
      if (kind === "speck") { // ink-impression mask: opaque with worn specks
        var v = n2[i] * 0.55 + n3[i] * 0.45 + grain * 0.25;
        px[p] = px[p + 1] = px[p + 2] = 0; px[p + 3] = v > 0.66 ? 70 : v > 0.6 ? 170 : 255;
        continue;
      }
      var d = m * (kind === "desk" ? 0.32 : 0.4) + grain * (kind === "desk" ? 0.55 : 0.7);
      if (d > 0) { px[p] = px[p + 1] = px[p + 2] = 255; px[p + 3] = Math.min(255, d * (kind === "desk" ? 46 : 62)); }
      else { px[p] = 40; px[p + 1] = 30; px[p + 2] = 15; px[p + 3] = Math.min(255, -d * (kind === "desk" ? 44 : 50)); }
    }
    ctx.putImageData(img, 0, 0);
    if (kind !== "speck") { // fibres, drawn wrapped so the tile is seamless
      var count = kind === "desk" ? 260 : 150;
      for (var f = 0; f < count; f++) {
        var x = r() * size, y = r() * size, len = 6 + r() * (kind === "desk" ? 40 : 26), ang = r() * Math.PI * 2, bend = (r() - 0.5) * 10;
        var light = r() < 0.72, a = light ? 0.05 + r() * 0.11 : 0.03 + r() * 0.05;
        ctx.strokeStyle = light ? "rgba(255,255,255," + a + ")" : "rgba(60,45,25," + a + ")";
        ctx.lineWidth = 0.5 + r() * 0.9;
        for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) {
          var sx = x + ox * size, sy = y + oy * size, ex = sx + Math.cos(ang) * len, ey = sy + Math.sin(ang) * len;
          ctx.beginPath(); ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo((sx + ex) / 2 - Math.sin(ang) * bend, (sy + ey) / 2 + Math.cos(ang) * bend, ex, ey); ctx.stroke();
        }
      }
    }
    TEX[kind] = { url: cv.toDataURL("image/png"), size: size };
    return TEX[kind];
  }

  // ---------------------------------------------------------------- scene context
  var CUR = null; // the scene currently being built (set by Kit.stage)
  var CTX_N = 0;
  function sceneId(el) {
    var host = el.closest ? el.closest("[data-composition-id]") : null;
    return (host && host.getAttribute("data-composition-id")) || ("kit" + (++CTX_N));
  }
  function makeCtx(anchorEl, defsParentSvg, theme) {
    var ctx = { id: "k-" + sceneId(anchorEl).replace(/[^a-zA-Z0-9_-]/g, "") + "-" + (++CTX_N), theme: theme || "cream", themables: [], patterns: {}, defs: null };
    var defs = S("defs", null, defsParentSvg);
    ctx.defs = defs;
    installFilters(ctx);
    return ctx;
  }
  function ctxOf(el) {
    var n = el;
    while (n) { if (n.__kit) return n.__kit; n = n.parentNode; }
    if (CUR) return CUR;
    // no stage: install defs in the nearest svg
    var svg = el.ownerSVGElement || (el.tagName && el.tagName.toLowerCase() === "svg" ? el : null);
    if (!svg) svg = S("svg", { width: 0, height: 0, style: "position:absolute;width:0;height:0" }, el);
    svg.__kit = makeCtx(svg, svg, "cream");
    return svg.__kit;
  }
  function fid(ctx, name) { return "url(#" + ctx.id + "-" + name + ")"; }
  function themeOf(ctx, opts) { return (opts && opts.theme) || ctx.theme; }
  // Register a property that the theme flip changes. prop is a CSS property name (fill, stroke, color, backgroundColor, opacity...).
  function reg(ctx, el, prop, p) { var m = { el: el, prop: prop, p: p }; ctx.themables.push(m); return m; }
  function applyStyle(el, prop, v) { el.style[prop] = v; }

  // ---------------------------------------------------------------- filters
  function installFilters(ctx) {
    var p = ctx.id, defs = ctx.defs;
    var html =
      // sheet: rough cut edge + lighter paper core rim + soft drop shadow
      '<filter id="' + p + '-cut" x="-8%" y="-8%" width="118%" height="122%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="11" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="cut"/>' +
      '<feMorphology in="cut" operator="erode" radius="1.3" result="er"/>' +
      '<feComposite in="cut" in2="er" operator="out" result="rimA"/>' +
      '<feFlood flood-color="#FFFDF6" flood-opacity="0.55"/><feComposite in2="rimA" operator="in" result="rim"/>' +
      '<feGaussianBlur in="cut" stdDeviation="4" result="b"/><feOffset in="b" dx="3" dy="5" result="bo"/>' +
      '<feFlood flood-color="' + C.shadow + '" flood-opacity="0.32"/><feComposite in2="bo" operator="in" result="sh"/>' +
      '<feMerge><feMergeNode in="sh"/><feMergeNode in="cut"/><feMergeNode in="rim"/></feMerge></filter>' +
      // piece: a layer glued on another sheet (smaller shadow)
      '<filter id="' + p + '-piece" x="-12%" y="-12%" width="128%" height="130%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" result="cut"/>' +
      '<feMorphology in="cut" operator="erode" radius="1" result="er"/>' +
      '<feComposite in="cut" in2="er" operator="out" result="rimA"/>' +
      '<feFlood flood-color="#FFFDF6" flood-opacity="0.45"/><feComposite in2="rimA" operator="in" result="rim"/>' +
      '<feGaussianBlur in="cut" stdDeviation="1.6" result="b"/><feOffset in="b" dx="1.5" dy="2.2" result="bo"/>' +
      '<feFlood flood-color="' + C.shadow + '" flood-opacity="0.28"/><feComposite in2="bo" operator="in" result="sh"/>' +
      '<feMerge><feMergeNode in="sh"/><feMergeNode in="cut"/><feMergeNode in="rim"/></feMerge></filter>' +
      // lift: soft shadow only (whole cutout off the desk; pins)
      '<filter id="' + p + '-lift" x="-15%" y="-15%" width="135%" height="140%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/><feOffset in="b" dx="3" dy="5" result="bo"/>' +
      '<feFlood flood-color="' + C.shadow + '" flood-opacity="0.30"/><feComposite in2="bo" operator="in" result="sh"/>' +
      '<feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      // pinlift: small shadow for pins / dots
      '<filter id="' + p + '-pinlift" x="-60%" y="-60%" width="240%" height="240%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="b"/><feOffset in="b" dx="1.5" dy="2.5" result="bo"/>' +
      '<feFlood flood-color="' + C.shadow + '" flood-opacity="0.35"/><feComposite in2="bo" operator="in" result="sh"/>' +
      '<feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      // rough: displacement only (stamps, ink)
      '<filter id="' + p + '-rough" x="-5%" y="-10%" width="110%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="3" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      // glow for night routes
      '<filter id="' + p + '-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>';
    // innerHTML on <defs> parses as SVG in modern Chrome
    defs.insertAdjacentHTML("beforeend", html);
  }

  // A texture-filled paper colour as an SVG pattern. key → a private pattern whose colour the theme flip can tween.
  function paperFill(target, color, key) {
    var ctx = target && target.themables ? target : ctxOf(target);
    var k = key || ("c" + String(color).replace(/[^a-zA-Z0-9]/g, ""));
    if (ctx.patterns[k]) return ctx.patterns[k].url;
    var tex = makeTexture("fibre"), id = ctx.id + "-pf-" + k;
    var pat = S("pattern", { id: id, patternUnits: "userSpaceOnUse", width: tex.size, height: tex.size }, ctx.defs);
    var rect = S("rect", { width: tex.size, height: tex.size }, pat);
    rect.style.fill = color;
    S("image", { href: tex.url, width: tex.size, height: tex.size }, pat);
    ctx.patterns[k] = { url: "url(#" + id + ")", rect: rect };
    return ctx.patterns[k].url;
  }
  function paperFillThemed(ctx, tokenName, key) {
    var p = pair(tokenName), url = paperFill(ctx, p[ctx.theme], key);
    reg(ctx, ctx.patterns[key].rect, "fill", p);
    return url;
  }

  // ---------------------------------------------------------------- stage
  function getVars() { try { return (window.__hyperframes && window.__hyperframes.getVariables && window.__hyperframes.getVariables()) || {}; } catch (e) { return {}; } }

  function stage(root, opts) {
    opts = opts || {};
    var theme = opts.theme || "cream";
    W = +(root.getAttribute("data-width") || 1920); H = +(root.getAttribute("data-height") || 1080);
    var el = D("div", "kit-stage", root);
    var defsSvg = S("svg", { class: "kit-defs", width: 0, height: 0, "aria-hidden": "true" }, el);
    var ctx = makeCtx(root, defsSvg, theme);
    el.__kit = ctx; ctx.el = el; ctx.root = root; CUR = ctx;
    var desk = makeTexture("desk");
    var bgC = D("div", "kit-bg", el, { backgroundColor: C.paper, backgroundImage: "url(" + desk.url + ")" });
    var bgN = D("div", "kit-bg", el, { backgroundColor: C.navy, backgroundImage: "url(" + desk.url + ")", opacity: theme === "navy" ? 1 : 0 });
    reg(ctx, bgN, "opacity", { cream: 0, navy: 1 });
    var svg = S("svg", { class: "kit-svg", viewBox: "0 0 " + W + " " + H, width: W, height: H }, el);
    var layer = D("div", "kit-layer", el);
    var top = S("svg", { class: "kit-svg kit-top", viewBox: "0 0 " + W + " " + H, width: W, height: H }, el);
    var vig = D("div", "kit-vignette", el, { opacity: theme === "navy" ? 0.45 : 1 });
    reg(ctx, vig, "opacity", { cream: 1, navy: 0.45 });
    var chromeEl = D("div", "kit-chrome", el);
    ctx.svg = svg; ctx.top = top; ctx.layer = layer; ctx.chrome = chromeEl;
    var st = { el: el, svg: svg, top: top, layer: layer, chrome: chromeEl, ctx: ctx, theme: theme, tabs: null,
      fadeIn: function (tl, t, dur) { tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur || 0.5, ease: "power1.inOut" }, t || 0); return st; },
      fadeOut: function (tl, t, dur) { tl.to(el, { opacity: 0, duration: dur || 0.5, ease: "power1.inOut" }, t); return st; }
    };
    el.__stage = st;
    if (opts.chrome !== false) {
      var v = getVars(), cs = getComputedStyle(root);
      var cssChan = (cs.getPropertyValue("--channel") || "").trim().replace(/^["']|["']$/g, "");
      var cssTabs = (cs.getPropertyValue("--chapters") || "").trim().replace(/^["']|["']$/g, "");
      logo(st, { channel: opts.channel || v.channel || cssChan || "STORY OF EVERYTHING" }); // v2: bottom-right
      if (opts.date != null) dateLabel(st, opts.date); // v2: top-left
      var v1tabs = (opts.tabs && opts.tabs !== true) || (!opts.reasons && (v.chapters || cssTabs));
      if (opts.tabs !== false && opts.reasons !== false) {
        if (v1tabs) { // v1 text tabs, only when labels are passed explicitly
          var labels = opts.tabs || v.chapters || cssTabs;
          if (typeof labels === "string") labels = labels.split(/\s*[,|]\s*/);
          st.tabs = chapterTabs(st, labels, opts.active == null ? 0 : opts.active);
        } else reasonBar(st, opts.reasons || v.reasons || REASONS, opts.active == null ? 0 : opts.active); // v2: icons top-right
      }
    }
    if (opts.disclaimer) chip(st, opts.disclaimer);
    return st;
  }
  function layerOf(target) { // HTML parent for cards, titles...
    if (target && target.__stage) return target.__stage.layer;
    if (target && target.layer && target.el) return target.layer;
    var n = target; while (n) { if (n.__stage) return n.__stage.layer; n = n.parentNode; }
    var s = target && target.querySelector && target.querySelector(".kit-stage");
    if (s && s.__stage) return s.__stage.layer;
    return target;
  }
  function chromeOf(target) { var s = target.__stage || (target.el && target.el.__stage); return s ? s.chrome : layerOf(target); }
  function svgOf(target, which) { // SVG parent for cutouts
    if (target && target.namespaceURI === NS) return target.tagName.toLowerCase() === "svg" ? target : target;
    var s = target && (target.__stage || (target.el && target.el.__stage));
    if (!s) { var n = target; while (n && !s) { s = n.__stage; n = n.parentNode; } }
    if (!s && target && target.querySelector) { var q = target.querySelector(".kit-stage"); s = q && q.__stage; }
    if (s) return which === "map" ? s.svg : s.top;
    return S("svg", { class: "kit-svg", viewBox: "0 0 " + W + " " + H, width: W, height: H }, target);
  }

  function compassMark(parent, size, ctx) {
    var svg = S("svg", { width: size, height: size, viewBox: "-50 -50 100 100", class: "kit-mark" }, parent);
    var g = S("g", { filter: fid(ctx, "pinlift") }, svg);
    S("circle", { r: 44, fill: paperFill(ctx, C.ivory) }, g);
    S("circle", { r: 36, fill: "none", stroke: C.ink, "stroke-width": 2.5, opacity: 0.85 }, g);
    var star = S("g", null, g);
    function pt(len, w, rot, col) { S("path", { d: "M0," + (-len) + " L" + w + ",0 L0," + (len * 0.18) + " L" + (-w) + ",0Z", fill: col, transform: "rotate(" + rot + ")" }, star); }
    pt(30, 6, 45, C.ink2); pt(30, 6, 135, C.ink2); pt(30, 6, 225, C.ink2); pt(30, 6, 315, C.ink2);
    pt(42, 8, 90, C.ink); pt(42, 8, 180, C.ink); pt(42, 8, 270, C.ink); pt(42, 8, 0, C.red);
    S("circle", { r: 4, fill: C.ivory }, g);
    return svg;
  }
  function logo(st, opts) {
    var ctx = st.ctx, wrap = D("div", "kit-logo", st.chrome);
    compassMark(wrap, 40, ctx);
    var strip = D("div", "kit-wordstrip", wrap);
    D("div", "kit-tab-sheet", strip, { backgroundColor: C.ivory, backgroundImage: "url(" + makeTexture("fibre").url + ")", filter: fid(ctx, "cut") });
    var word = D("div", "kit-wordmark kit-mono", strip); word.textContent = opts.channel; word.style.color = C.ink;
    word.setAttribute("data-layout-allow-overlap", ""); // identical chrome overlaps itself during scene crossfades
    return wrap;
  }
  var TAB_MUTE = "#5A5142";
  function chapterTabs(target, labels, active) {
    var ctx = ctxOf(target.el || target), host = chromeOf(target);
    var bar = D("div", "kit-tabs", host), tex = makeTexture("fibre"), tabs = [];
    labels.forEach(function (lab, i) {
      var tab = D("div", "kit-tab", bar);
      var sheet = D("div", "kit-tab-sheet", tab, { backgroundImage: "url(" + tex.url + ")", filter: fid(ctx, "cut") });
      var edge = D("div", "kit-tab-edge", tab);
      var txt = D("div", "kit-tab-label kit-mono", tab); txt.textContent = String(lab).toUpperCase(); txt.setAttribute("data-layout-allow-overlap", "");
      var on = i === active;
      gsap.set(tab, { y: on ? -7 : 0 });
      edge.style.opacity = on ? 1 : 0; txt.style.color = on ? C.ink : TAB_MUTE;
      sheet.style.backgroundColor = on ? C.ivory : "#E3DAC4";
      tabs.push({ el: tab, sheet: sheet, edge: edge, label: txt });
    });
    var api = { el: bar, tabs: tabs, active: active,
      setActive: function (tl, t, i) {
        var a = api.active;
        if (a != null && tabs[a]) { tl.to(tabs[a].el, { y: 0, duration: 0.35, ease: "power2.out" }, t); tl.to(tabs[a].edge, { opacity: 0, duration: 0.25 }, t); tl.to(tabs[a].label, { color: TAB_MUTE, duration: 0.25 }, t); tl.to(tabs[a].sheet, { backgroundColor: "#E3DAC4", duration: 0.25 }, t); }
        tl.to(tabs[i].el, { y: -7, duration: 0.45, ease: "back.out(1.2)" }, t + 0.05); tl.to(tabs[i].edge, { opacity: 1, duration: 0.25 }, t + 0.05);
        tl.to(tabs[i].label, { color: C.ink, duration: 0.25 }, t + 0.05); tl.to(tabs[i].sheet, { backgroundColor: C.ivory, duration: 0.25 }, t + 0.05);
        api.active = i; return api;
      } };
    return api;
  }
  function chip(target, text, opts) {
    opts = opts || {};
    var ctx = ctxOf(target.el || target), e = D("div", "kit-chip", chromeOf(target));
    D("div", "kit-tab-sheet", e, { backgroundColor: "#E9E1CC", backgroundImage: "url(" + makeTexture("fibre").url + ")", filter: fid(ctx, "cut") });
    var tx = D("span", "kit-chip-text kit-mono", e); tx.textContent = String(text).toUpperCase(); tx.setAttribute("data-layout-allow-overlap", "");
    if (opts.x != null) { e.style.left = opts.x + "px"; } if (opts.y != null) { e.style.top = opts.y + "px"; e.style.bottom = "auto"; }
    return { el: e, in: function (tl, t) { tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, t); return this; } };
  }

  // ---------------------------------------------------------------- maps
  var LANDCACHE = {};
  function landPolys(res) {
    if (LANDCACHE[res]) return LANDCACHE[res];
    var topo = res === "110m" ? window.LAND_110m : window.LAND_50m;
    var fc = topojson.feature(topo, topo.objects.land), out = [];
    (fc.features || [fc]).forEach(function (f) {
      var g = f.geometry; if (!g) return;
      if (g.type === "Polygon") out.push({ type: "Feature", geometry: g });
      else if (g.type === "MultiPolygon") g.coordinates.forEach(function (c) { out.push({ type: "Feature", geometry: { type: "Polygon", coordinates: c } }); });
    });
    LANDCACHE[res] = { polys: out, all: fc };
    return LANDCACHE[res];
  }
  function boundsFeature(b) { // [[w,s],[e,n]] as a densified polygon so fitExtent respects curved projections
    var w = b[0][0], s = b[0][1], e = b[1][0], n = b[1][1], ring = [], i;
    for (i = 0; i <= 10; i++) ring.push([w + (e - w) * i / 10, s]);
    for (i = 0; i <= 10; i++) ring.push([e, s + (n - s) * i / 10]);
    for (i = 10; i >= 0; i--) ring.push([w + (e - w) * i / 10, n]);
    for (i = 10; i >= 0; i--) ring.push([w, s + (n - s) * i / 10]);
    return { type: "MultiPoint", coordinates: ring };
  }
  function flatMap(svgTarget, opts) {
    opts = opts || {};
    var svg = svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map");
    var ctx = ctxOf(svg), theme = themeOf(ctx, opts);
    var kind = opts.projection || "equirect";
    var proj = kind === "mercator" ? d3.geoMercator() : kind === "naturalEarth" ? d3.geoNaturalEarth1() : d3.geoEquirectangular();
    var w = opts.width || W, h = opts.height || H, pad = opts.pad == null ? 40 : opts.pad;
    if (opts.fitBounds) proj.fitExtent([[pad, pad], [w - pad, h - pad]], boundsFeature(opts.fitBounds));
    else { proj.scale(opts.scale || 300).center(opts.center || [0, 0]).translate(opts.translate || [w / 2, h / 2]); }
    if (opts.rotate) proj.rotate(opts.rotate);
    proj.clipExtent([[-30, -30], [w + 30, h + 30]]);
    var path = d3.geoPath(proj);
    var mk = "map" + (++CTX_N);
    var g = S("g", { class: "kit-map" }, svg);
    var gSea = S("g", { class: "kit-sea" }, g);
    S("rect", { x: -40, y: -40, width: w + 80, height: h + 80, fill: paperFillThemed(ctx, opts.seaColor || "sea", mk + "sea") }, gSea);
    var gGrat = S("g", { class: "kit-grat" }, g);
    if (opts.graticule !== false) {
      var gp = S("path", { d: path(d3.geoGraticule().step([opts.graticuleStep || 15, opts.graticuleStep || 15])()), fill: "none", "stroke-width": 1.2, opacity: 0.09 }, gGrat);
      gp.style.stroke = tok("ink", theme); reg(ctx, gp, "stroke", pair("ink"));
    }
    var gLand = S("g", { class: "kit-land" }, g);
    if (opts.paper !== false) gLand.setAttribute("filter", fid(ctx, "cut"));
    var landFill = paperFillThemed(ctx, opts.landColor || "land", mk + "land");
    var minArea = opts.minArea == null ? 2 : opts.minArea, sheets = [];
    landPolys(opts.land || "50m").polys.forEach(function (f) {
      var b = path.bounds(f);
      if (!isFinite(b[0][0]) || b[1][0] < -20 || b[0][0] > w + 20 || b[1][1] < -20 || b[0][1] > h + 20) return;
      if ((b[1][0] - b[0][0]) * (b[1][1] - b[0][1]) < minArea) return;
      var d = path(f); if (!d) return;
      sheets.push(S("path", { d: d, fill: landFill }, gLand));
    });
    var gRoutes = S("g", { class: "kit-routes" }, g), gPins = S("g", { class: "kit-pins" }, g), gLabels = S("g", { class: "kit-labels" }, g);
    return { kind: "flat", g: g, gSea: gSea, gGrat: gGrat, gLand: gLand, gRoutes: gRoutes, gPins: gPins, gLabels: gLabels, sheets: sheets,
      proj: proj, path: path, svg: svg, theme: theme, project: function (ll) { return proj(ll); },
      visible: function () { return true; } };
  }

  function globe(svgTarget, opts) {
    opts = opts || {};
    var svg = svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map");
    var ctx = ctxOf(svg), theme = themeOf(ctx, opts);
    var R = opts.radius || 440, cen = opts.center || [W / 2, 580];
    var proj = d3.geoOrthographic().scale(R).translate(cen).clipAngle(90).rotate(opts.rotate || [0, 0, 0]).precision(0.4);
    var path = d3.geoPath(proj), mk = "globe" + (++CTX_N);
    var g = S("g", { class: "kit-globe" }, svg);
    var sea = S("path", { fill: paperFillThemed(ctx, "globeSea", mk + "sea") }, g);
    if (opts.paper !== false) sea.setAttribute("filter", fid(ctx, "cut"));
    var grat = S("path", { fill: "none", "stroke-width": 1.2, opacity: 0.1 }, g);
    grat.style.stroke = tok("ink", theme); reg(ctx, grat, "stroke", pair("ink"));
    var gLand = S("g", { class: "kit-land" }, g);
    if (opts.paper !== false) gLand.setAttribute("filter", fid(ctx, "piece"));
    var land = S("path", { fill: paperFillThemed(ctx, "land", mk + "land") }, gLand);
    var rim = S("path", { fill: "none", "stroke-width": 2 }, g);
    rim.style.stroke = theme === "navy" ? "rgba(190,210,225,0.55)" : C.ink; reg(ctx, rim, "stroke", { cream: C.ink, navy: "rgba(190,210,225,0.55)" });
    var gRoutes = S("g", { class: "kit-routes" }, g), gPins = S("g", { class: "kit-pins" }, g), gLabels = S("g", { class: "kit-labels" }, g);
    var landF = landPolys(opts.land || "110m").all, gratF = d3.geoGraticule().step([15, 15])(), sphere = { type: "Sphere" };
    var listeners = [];
    var api = { kind: "globe", g: g, gLand: gLand, gRoutes: gRoutes, gPins: gPins, gLabels: gLabels, proj: proj, path: path, svg: svg, theme: theme,
      rot: (opts.rotate || [0, 0, 0]).slice(),
      project: function (ll) { return proj(ll); },
      visible: function (ll) { var r = proj.rotate(); return d3.geoDistance(ll, [-r[0], -r[1]]) < Math.PI / 2 - 0.01; },
      render: function () { sea.setAttribute("d", path(sphere)); grat.setAttribute("d", path(gratF)); land.setAttribute("d", path(landF) || ""); rim.setAttribute("d", path(sphere)); listeners.forEach(function (f) { f(); }); },
      setRotate: function (r) { api.rot = r.slice(); proj.rotate(r); api.render(); },
      onRender: function (f) { listeners.push(f); },
      // tween the globe from its current rotation to r (shortest path via geoInterpolate on the centre)
      rotateTo: function (tl, t, r, dur, ease) {
        var o = { k: 0 }, from = null, to = r.slice(), interp;
        tl.fromTo(o, { k: 0 }, { k: 1, duration: dur || 1, ease: ease || "power3.inOut",
          onStart: function () { }, onUpdate: function () {
            if (!from) { from = api._chainFrom(tl, t); interp = d3.geoInterpolate([-from[0], -from[1]], [-to[0], -to[1]]); }
            var c = interp(o.k), gam = from[2] + ((to[2] || 0) - (from[2] || 0)) * o.k; api.setRotate([-c[0], -c[1], gam]); } }, t);
        api._keys.push({ t: t, r: to }); return api;
      }, _keys: [] };
    api._chainFrom = function (tl, t) { // rotation in force before time t (keys are applied in time order)
      var r0 = (opts.rotate || [0, 0, 0]).slice(), best = -1;
      api._keys.forEach(function (k) { if (k.t < t && k.t > best) { best = k.t; r0 = k.r; } });
      return r0;
    };
    api.render();
    return api;
  }

  // ---------------------------------------------------------------- routes
  var INK_NAMES = { red: 1, blue: 1, gold: 1, teal: 1, ink: 1, mace: 1, ink2: 1 };
  function catmull(pts, n) { // open Catmull-Rom through screen points → dense polyline
    if (pts.length < 3) return pts.slice();
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      for (var k = 0; k < n; k++) {
        var t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  function route(svgTarget, map, coords, opts) {
    opts = opts || {};
    var ctx = ctxOf(map && map.svg ? map.svg : svgTarget), theme = themeOf(ctx, opts);
    var parent = (map && map.gRoutes) || (svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map"));
    var colorName = opts.color || "red", width = opts.width || 5;
    var dash = opts.dash === false ? null : opts.dash === "dotted" ? [0.1, width * 2.2] : (opts.dash || [16, 10]);
    var mid = "rt" + (++CTX_N), maskId = ctx.id + "-" + mid;
    var g = S("g", { class: "kit-route" }, parent);
    var mask = S("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: -50, y: -50, width: W + 100, height: H + 100 }, ctx.defs);
    var mpath = S("path", { fill: "none", stroke: "#fff", "stroke-width": width + 8 + (opts.glow ? 40 : 0), "stroke-linecap": "round", "stroke-linejoin": "round" }, mask);
    var inner = S("g", { mask: "url(#" + maskId + ")" }, g);
    var glow = null;
    if (opts.glow) {
      glow = S("path", { fill: "none", "stroke-width": width * 4, "stroke-linecap": "round", filter: fid(ctx, "glow"), opacity: 0.55 }, inner);
      glow.style.stroke = opts.glow === true ? C.gold : tok(opts.glow, theme);
    }
    if (opts.casing) { var cas = S("path", { fill: "none", "stroke-width": width + 5, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.9 }, inner); cas.style.stroke = tok("bg", theme); reg(ctx, cas, "stroke", pair("bg")); }
    var line = S("path", { fill: "none", "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round" }, inner);
    if (dash) line.setAttribute("stroke-dasharray", dash.join(" "));
    line.style.stroke = tok(colorName, theme);
    if (INK_NAMES[colorName]) reg(ctx, line, "stroke", pair(colorName));
    var gc = opts.greatCircle !== false, smoothN = opts.smooth ? (opts.smooth === true ? 16 : opts.smooth) : 0;
    // dense geo points for great circles
    var geo = [];
    if (gc) {
      for (var i = 0; i < coords.length - 1; i++) {
        var a = coords[i], b = coords[i + 1], n = Math.max(2, Math.ceil(d3.geoDistance(a, b) * 180 / Math.PI / 0.5)), ip = d3.geoInterpolate(a, b);
        for (var k = 0; k < n; k++) geo.push(ip(k / n));
      }
      geo.push(coords[coords.length - 1]);
    } else geo = coords.slice();
    var r = { el: line, g: g, glow: glow, mask: mpath, coords: coords, geo: geo, length: 0, lut: [], _t: 0, map: map };
    r.rebuild = function () {
      var vis = map && map.visible ? map.visible : function () { return true; };
      var proj = map && map.project ? map.project : function (p) { return p; };
      var pts = geo.map(function (p) { return proj(p); });
      if (smoothN && !gc) pts = catmull(pts, smoothN);
      var visArr = (smoothN && !gc) ? pts.map(function () { return true; }) : geo.map(vis);
      var d = "", L = 0, lut = [], pen = false;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!visArr[i]) { pen = false; lut.push({ x: p[0], y: p[1], l: L, v: false }); continue; }
        if (pen) { var q = pts[i - 1]; L += Math.hypot(p[0] - q[0], p[1] - q[1]); d += "L" + f2(p[0]) + "," + f2(p[1]); }
        else d += "M" + f2(p[0]) + "," + f2(p[1]);
        pen = true; lut.push({ x: p[0], y: p[1], l: L, v: true });
      }
      r.length = L; r.lut = lut; r.d = d;
      line.setAttribute("d", d); mpath.setAttribute("d", d); if (glow) glow.setAttribute("d", d);
      if (cas) cas.setAttribute("d", d);
      mpath.setAttribute("stroke-dasharray", (L + 1) + " " + (L + 1000));
      r.draw(r._t);
    };
    var arrow = null;
    if (opts.arrow) { arrow = S("path", { d: "M2,0 L-13,-8 L-9,0 L-13,8Z", "stroke-linejoin": "round" }, g); arrow.style.fill = tok(colorName, theme); if (INK_NAMES[colorName]) reg(ctx, arrow, "fill", pair(colorName)); }
    r.arrow = arrow;
    r.draw = function (t) {
      r._t = t; mpath.setAttribute("stroke-dashoffset", f2((r.length + 1) * (1 - t)));
      mpath.setAttribute("visibility", t <= 0.0001 ? "hidden" : "visible");
      if (arrow) { var q = pathPoint(r, t); arrow.setAttribute("transform", "translate(" + f2(q.x) + "," + f2(q.y) + ") rotate(" + f2(q.angle) + ") scale(" + (width / 5) + ")"); arrow.setAttribute("visibility", t <= 0.02 || !q.visible ? "hidden" : "visible"); }
      return r;
    };
    Object.defineProperty(r, "progress", { get: function () { return r._t; }, set: function (v) { r.draw(v); } });
    r.drawOn = function (tl, t, dur, ease) { tl.fromTo(r, { progress: 0 }, { progress: 1, duration: dur || 1.6, ease: ease || "power2.inOut" }, t); return r; };
    r.rebuild(); r.draw(opts.drawn ? 1 : 0);
    if (map && map.onRender) map.onRender(r.rebuild);
    return r;
  }
  // position + heading (degrees, 0 = east, clockwise positive in screen space) at fraction t of the drawn length
  function pathPoint(r, t) {
    var lut = r.lut, L = r.length * Math.max(0, Math.min(1, t));
    if (!lut.length) return { x: 0, y: 0, angle: 0, visible: false };
    var lo = 0, hi = lut.length - 1;
    while (lo < hi) { var m = (lo + hi) >> 1; if (lut[m].l < L) lo = m + 1; else hi = m; }
    var b = lut[lo], a = lut[Math.max(0, lo - 1)];
    while (lo > 0 && a.l === b.l && a !== b) { lo--; a = lut[Math.max(0, lo - 1)]; if (lo === 0) break; }
    var span = b.l - a.l, k = span > 0 ? (L - a.l) / span : 0;
    var x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
    // heading from a window around the point (smooths polyline corners)
    var w = Math.max(4, r.length * 0.012), p0 = sampleAt(r, L - w), p1 = sampleAt(r, L + w);
    return { x: x, y: y, angle: Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI, dx: p1.x - p0.x, visible: b.v !== false };
  }
  function sampleAt(r, L) {
    var lut = r.lut; L = Math.max(0, Math.min(r.length, L));
    var lo = 0, hi = lut.length - 1;
    while (lo < hi) { var m = (lo + hi) >> 1; if (lut[m].l < L) lo = m + 1; else hi = m; }
    var b = lut[lo], a = lut[Math.max(0, lo - 1)], span = b.l - a.l, k = span > 0 ? (L - a.l) / span : 0;
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  }
  // the route fraction nearest a lon/lat (or screen point), e.g. to time a pin to the moment the ship passes it
  function routeT(r, ll, isScreen) {
    var p = (!isScreen && r.map && r.map.project) ? r.map.project(ll) : ll;
    var best = 0, bd = Infinity;
    r.lut.forEach(function (q) { var d = (q.x - p[0]) * (q.x - p[0]) + (q.y - p[1]) * (q.y - p[1]); if (d < bd) { bd = d; best = q.l; } });
    return r.length ? best / r.length : 0;
  }

  // ---------------------------------------------------------------- paper art helpers
  // Build a cutout from a list of pieces. Each piece: {d|circle|ellipse|rect|text|stroke, fill, ...}
  function art(ctx, parent, pieces) {
    pieces.forEach(function (p) {
      if (p.group) { var gg = S("g", { transform: p.transform, filter: p.flat ? null : fid(ctx, "piece") }, parent); art(ctx, gg, p.group.map(function (q) { return Object.assign({ flat: true }, q); })); if (p.name) parent.__parts = parent.__parts || {}; if (p.name) (parent.__parts[p.name] = gg); return; }
      var fill = p.fill ? (p.solid ? tok(p.fill) : paperFill(ctx, tok(p.fill))) : "none", e;
      var a = { fill: fill, transform: p.transform, opacity: p.opacity, filter: p.flat ? null : fid(ctx, "piece") };
      if (p.stroke) { a.stroke = tok(p.stroke); a["stroke-width"] = p.sw || 3; a["stroke-linecap"] = "round"; a["stroke-linejoin"] = "round"; if (!p.fill) a.fill = "none"; if (p.dash) a["stroke-dasharray"] = p.dash; }
      if (p.circle) { a.cx = p.circle[0]; a.cy = p.circle[1]; a.r = p.circle[2]; e = S("circle", a, parent); }
      else if (p.ellipse) { a.cx = p.ellipse[0]; a.cy = p.ellipse[1]; a.rx = p.ellipse[2]; a.ry = p.ellipse[3]; e = S("ellipse", a, parent); }
      else if (p.text != null) {
        a.x = p.x || 0; a.y = p.y || 0; a["text-anchor"] = p.anchor || "middle"; a["font-family"] = p.font || "Newsreader"; a["font-size"] = p.size || 40;
        a["font-weight"] = p.weight || 600; if (p.italic) a["font-style"] = "italic"; if (p.tracking) a["letter-spacing"] = p.tracking;
        a.fill = tok(p.fill || "ink"); e = S("text", a, parent); e.textContent = p.text;
      }
      else { a.d = p.d; if (p.evenodd) a["fill-rule"] = "evenodd"; e = S("path", a, parent); }
      if (p.name) { parent.__parts = parent.__parts || {}; parent.__parts[p.name] = e; }
    });
  }
  function pathFromPts(pts, closed) { return pts.map(function (p, i) { return (i ? "L" : "M") + f2(p[0]) + "," + f2(p[1]); }).join("") + (closed ? "Z" : ""); }
  function smoothClosed(pts, n) { // closed Catmull-Rom
    var out = [], m = pts.length;
    for (var i = 0; i < m; i++) {
      var p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
      for (var k = 0; k < n; k++) {
        var t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    return out;
  }
  // irregular blob: radii multipliers around a centre (authored), plus seeded coastline noise
  function blob(cx, cy, rx, ry, radii, seed, rot, jitter) {
    var r = rng(seed), n = radii.length, pts = [], c = Math.cos(rot || 0), s = Math.sin(rot || 0);
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, m = radii[i] * (1 + ((r() - 0.5) * (jitter == null ? 0.12 : jitter)));
      var x = Math.cos(a) * rx * m, y = Math.sin(a) * ry * m;
      pts.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return smoothClosed(pts, 6);
  }
  function wavyFlag(x0, x1, yTop, yBot, amp) { // cloth edges as functions so stripes follow the wave
    function wave(x) { var u = (x - x0) / (x1 - x0); return Math.sin(u * Math.PI * 1.6 + 0.4) * amp * (0.35 + u); }
    return function (v0, v1, xa, xb) { // horizontal band between fractions v0..v1, optionally limited to [xa,xb]
      xa = xa == null ? x0 : xa; xb = xb == null ? x1 : xb;
      var top = [], bot = [], steps = 16;
      for (var i = 0; i <= steps; i++) { var x = xa + (xb - xa) * i / steps, y0 = yTop + (yBot - yTop) * v0 + wave(x), y1 = yTop + (yBot - yTop) * v1 + wave(x); top.push([x, y0]); bot.unshift([x, y1]); }
      return pathFromPts(top.concat(bot), true);
    };
  }

  // ---------------------------------------------------------------- cutout library (nominal box ~ 200 x 200, centred on 0,0)
  var CUT = {};
  // mace (aril) strands around a seed centred near (4,6), ~54 x 80: [path, width]
  var MACE_STRANDS = [
    ["M-2,-34 C-18,-22 -26,-4 -20,14 C-16,28 -10,38 -2,44", 5], ["M6,-35 C0,-18 -8,-2 -2,12 C4,26 0,36 6,46", 5],
    ["M12,-33 C24,-18 30,0 24,16 C20,30 16,38 10,44", 5], ["M-8,-36 C0,-43 10,-43 16,-34", 6],
    ["M-19,-8 C-12,-14 -6,-4 0,-10", 3.5], ["M2,4 C8,-2 16,8 25,0", 3.5], ["M-18,22 C-10,16 -4,26 2,20", 3.5],
    ["M4,30 C10,24 16,32 21,26", 3.5], ["M-8,-24 C-2,-30 8,-22 16,-26", 3.5]];
  CUT.nutmegFruit = function () {
    return [
      { d: "M0,-90 C46,-90 88,-56 88,2 C88,54 50,92 0,92 C-50,92 -88,54 -88,2 C-88,-56 -46,-90 0,-90Z", fill: "apricot" },
      { d: "M34,-78 C72,-56 92,-12 82,30 C72,70 40,90 6,92 C46,70 62,34 60,0 C58,-36 50,-60 34,-78Z", fill: "apricotDark" },
      { d: "M2,-74 C40,-44 46,28 6,80 C-36,42 -40,-38 2,-74Z", fill: "flesh" },
      { ellipse: [4, 6, 27, 39], fill: "seed" },
      { ellipse: [-6, -8, 9, 14], fill: "seedLight", flat: true },
      { group: MACE_STRANDS.map(function (m) { return { d: m[0], stroke: "mace", sw: m[1] }; }) },
      { d: "M-2,-88 C0,-102 6,-110 14,-116", stroke: "darkBrown", sw: 6, flat: true },
      { d: "M10,-108 C28,-130 56,-126 64,-112 C46,-98 24,-98 10,-108Z", fill: "leaf" },
      { d: "M14,-109 C30,-114 46,-114 60,-112", stroke: "leafLight", sw: 2, flat: true }
    ];
  };
  CUT.nutmegSeed = function () {
    return [
      { d: "M0,-72 C34,-72 54,-40 54,4 C54,48 30,74 0,74 C-32,74 -54,46 -54,2 C-54,-42 -32,-72 0,-72Z", fill: "seed" },
      { ellipse: [-16, -26, 14, 22], fill: "seedLight", flat: true, opacity: 0.8 },
      { d: "M-30,-44 C-40,-10 -36,30 -20,58", stroke: "darkBrown", sw: 3.5, flat: true },
      { d: "M-6,-62 C-16,-20 -10,30 2,64", stroke: "darkBrown", sw: 3.5, flat: true },
      { d: "M20,-56 C30,-20 30,24 18,58", stroke: "darkBrown", sw: 3.5, flat: true },
      { d: "M-34,-6 C-20,-12 -6,0 10,-8 C22,-14 34,-6 44,-10", stroke: "darkBrown", sw: 3, flat: true },
      { d: "M-38,26 C-24,20 -8,32 8,24 C22,18 34,28 44,22", stroke: "darkBrown", sw: 3, flat: true }
    ];
  };
  CUT.mace = function () { // the aril on its own, enlarged: wavy branching strands
    return [{ group: MACE_STRANDS.map(function (m) { return { d: m[0], stroke: "mace", sw: m[1] * 0.85, transform: "translate(-8,-14) scale(2.25)" }; }) }];
  };
  CUT.nutmegTree = function () {
    return [
      { d: "M-12,96 C-10,60 -8,20 -4,-20 L6,-20 C8,20 10,60 14,96Z", fill: "darkBrown" },
      { d: "M-2,10 C-20,0 -34,-6 -44,-20", stroke: "darkBrown", sw: 6, flat: true },
      { ellipse: [0, -44, 80, 58], fill: "leaf" },
      { ellipse: [-34, -62, 46, 38], fill: "teal" },
      { ellipse: [30, -76, 42, 34], fill: "leafLight" },
      { ellipse: [4, -22, 50, 26], fill: "teal" },
      { circle: [-40, -30, 8], fill: "apricot" }, { circle: [22, -40, 8], fill: "apricot" }, { circle: [-8, -74, 8], fill: "apricot" },
      { circle: [48, -54, 7], fill: "apricot" }, { circle: [-58, -58, 7], fill: "apricot" }, { circle: [8, -6, 7], fill: "apricot" }
    ];
  };
  CUT.sack = function () {
    return [
      { d: "M-62,-46 C-84,-16 -88,60 -62,88 L62,88 C88,60 84,-16 62,-46 C40,-60 -40,-60 -62,-46Z", fill: "burlap" },
      { d: "M-36,-54 C-30,-78 -42,-94 -22,-100 C-8,-90 8,-90 22,-100 C42,-94 30,-78 36,-54Z", fill: "burlapDark" },
      { d: "M-40,-56 C-12,-46 12,-46 40,-56", stroke: "darkBrown", sw: 7, flat: true },
      { d: "M30,-52 C40,-40 46,-34 54,-34", stroke: "darkBrown", sw: 4, flat: true },
      { d: "M-50,0 C-44,30 -46,56 -54,80", stroke: "burlapDark", sw: 2.5, flat: true },
      { d: "M44,-10 C52,20 50,56 44,82", stroke: "burlapDark", sw: 2.5, flat: true },
      { text: "BANDA", y: 34, font: "IBM Plex Mono", size: 22, weight: 600, tracking: "0.18em", fill: "darkBrown", flat: true, opacity: 0.75 },
      { text: "· VOC ·", y: 58, font: "IBM Plex Mono", size: 14, weight: 600, tracking: "0.2em", fill: "darkBrown", flat: true, opacity: 0.6 }
    ];
  };
  CUT.barrel = function () {
    return [
      { d: "M-56,-82 C-72,-40 -72,40 -56,82 L56,82 C72,40 72,-40 56,-82Z", fill: "wood" },
      { d: "M-28,-82 C-36,-40 -36,40 -28,82 M0,-82 L0,82 M28,-82 C36,-40 36,40 28,82", stroke: "brown", sw: 2.5, flat: true },
      { ellipse: [0, -82, 56, 12], fill: "woodLight" },
      { d: "M-64,-50 C-20,-42 20,-42 64,-50", stroke: "iron", sw: 8 },
      { d: "M-68,48 C-20,56 20,56 68,48", stroke: "iron", sw: 8 }
    ];
  };
  CUT.scales = function () {
    return [
      { d: "M-54,92 L54,92 L40,76 L-40,76Z", fill: "darkBrown" },
      { d: "M-5,78 L5,78 L4,-70 L-4,-70Z", fill: "ochre" },
      { d: "M-6,-62 L-82,-58 M6,-62 L82,-66", stroke: "ochre", sw: 7 },
      { circle: [0, -66, 9], fill: "gold" },
      { d: "M-82,-58 L-108,8 M-82,-58 L-56,8 M82,-66 L56,0 M82,-66 L108,0", stroke: "iron", sw: 1.6, flat: true },
      { d: "M-114,8 C-104,30 -60,30 -50,8Z", fill: "gold" },
      { d: "M50,0 C60,22 104,22 114,0Z", fill: "gold" },
      { ellipse: [-92, 1, 9, 7], fill: "seed" }, { ellipse: [-76, 2, 9, 7], fill: "seed" }, { ellipse: [-84, -8, 9, 7], fill: "seed" },
      { ellipse: [82, -4, 20, 5], fill: "ochre" }, { ellipse: [82, -11, 20, 5], fill: "gold" }, { ellipse: [82, -18, 20, 5], fill: "ochre" }
    ];
  };
  function coin(face, edge, ring, glyph) {
    var dots = [];
    for (var i = 0; i < 36; i++) { var a = i / 36 * Math.PI * 2; dots.push("M" + f2(Math.cos(a) * 76) + "," + f2(Math.sin(a) * 76) + "h0.1"); }
    return [
      { circle: [0, 0, 92], fill: edge },
      { circle: [0, 0, 82], fill: face },
      { d: dots.join(""), stroke: ring, sw: 4, flat: true },
      { circle: [0, 0, 66], stroke: ring, sw: 2, flat: true },
      { text: glyph, y: 36, size: 108, italic: glyph === "ƒ", weight: 700, fill: ring, flat: true },
      { text: "1667", y: 58, font: "IBM Plex Mono", size: 13, weight: 600, tracking: "0.2em", fill: ring, flat: true }
    ];
  }
  CUT.guilderCoin = function () { return coin("silver", "silverDark", "#6E6B63", "ƒ"); };
  CUT.poundCoin = function () { return coin("gold", "ochre", "#7E5F2A", "£"); };
  CUT.ledger = function () {
    var lines = [], ents = [];
    for (var i = 0; i < 8; i++) { var y = -42 + i * 14; lines.push("M-90," + (y + 3) + " C-60," + (y - 6) + " -24," + (y - 5) + " -6," + (y + 4) + " M6," + (y + 4) + " C24," + (y - 5) + " 60," + (y - 6) + " 90," + (y + 3)); }
    for (var j = 0; j < 6; j++) { var yy = -45 + j * 14, w = 26 + ((j * 37) % 30); ents.push("M-80," + yy + " l" + w + ",-2 M-34," + (yy - 1) + " l18,0 M18," + (yy + 1) + " l" + (w + 10) + ",-2 M66," + (yy - 1) + " l16,0"); }
    return [
      { d: "M-108,-66 C-60,-80 -20,-78 0,-64 C20,-78 60,-80 108,-66 L108,86 C60,74 20,76 0,90 C-20,76 -60,74 -108,86Z", fill: "#6E3A28" },
      { d: "M-100,-60 C-60,-72 -20,-70 -2,-58 L-2,80 C-20,68 -60,66 -100,78Z", fill: "ivory" },
      { d: "M2,-58 C20,-70 60,-72 100,-60 L100,78 C60,66 20,68 2,80Z", fill: "ivory" },
      { d: lines.join(" "), stroke: "blue", sw: 0.8, flat: true, opacity: 0.45 },
      { d: "M-44,-62 L-44,74 M60,-64 L60,72", stroke: "red", sw: 1.2, flat: true, opacity: 0.7 },
      { d: ents.join(" "), stroke: "ink", sw: 2, flat: true, opacity: 0.75 }
    ];
  };
  CUT.treatyScroll = function () {
    var txt = [];
    for (var i = 0; i < 7; i++) { var y = -38 + i * 14, w = i === 6 ? 70 : 128 - (i % 3) * 8; txt.push("M" + (-w / 2) + "," + y + " l" + w + ",0"); }
    return [
      { d: "M-80,-84 L80,-84 L82,84 C40,90 -40,78 -82,84Z", fill: "parchment" },
      { d: "M-96,-100 L96,-100 C104,-100 108,-94 108,-88 C108,-82 104,-76 96,-76 L-96,-76 C-104,-76 -108,-82 -108,-88 C-108,-94 -104,-100 -96,-100Z", fill: "sand" },
      { d: "M-94,-94 L94,-94", stroke: "ochre", sw: 2, flat: true, opacity: 0.6 },
      { d: "M-96,78 L96,78 C104,78 108,84 108,90 C108,96 104,102 96,102 L-96,102 C-104,102 -108,96 -108,90 C-108,84 -104,78 -96,78Z", fill: "sand" },
      { text: "Breda", y: -50, size: 28, italic: true, weight: 600, fill: "ink", flat: true },
      { d: txt.join(" "), stroke: "ink", sw: 2.4, flat: true, opacity: 0.55, dash: "9 4 22 5 14 4" },
      { d: "M34,62 L22,100 L34,92 L40,104 Z M50,62 L60,100 L48,92 L44,104Z", fill: "#9E2A22" },
      { circle: [42, 58, 23], fill: "mace" },
      { circle: [42, 58, 15], stroke: "#8A2420", sw: 2.5, flat: true },
      { text: "VOC", x: 42, y: 63, font: "IBM Plex Mono", size: 11, weight: 700, fill: "#8A2420", flat: true }
    ];
  };
  CUT.quill = function () {
    var barbs = [];
    for (var i = 0; i < 9; i++) { var t = 0.15 + i * 0.09, x = -40 + 100 * t, y = 70 - 172 * t; barbs.push("M" + f2(x) + "," + f2(y) + " l" + (-14 - i) + "," + (-6 - i * 0.5)); }
    return [
      { d: "M-36,64 C-30,4 4,-58 64,-104 C46,-48 18,12 -26,70Z", fill: "white" },
      { d: "M-36,64 C-44,30 -28,-20 4,-56 C-14,-10 -24,30 -30,66Z", fill: "#E1D9C6" },
      { d: barbs.join(" "), stroke: "#CFC5AE", sw: 1.6, flat: true },
      { d: "M-54,96 C-24,24 18,-46 64,-104", stroke: "#B9AE95", sw: 3, flat: true },
      { d: "M-58,104 L-50,80 L-42,84Z", fill: "ink" }
    ];
  };
  CUT.fort = function () {
    var out = [], i, R = 96, r = 60;
    for (i = 0; i < 5; i++) {
      var a = (-90 + 72 * i) * Math.PI / 180, a1 = a - 0.26, a2 = a + 0.26, am = a + 36 * Math.PI / 180;
      out.push([Math.cos(a1) * r, Math.sin(a1) * r], [Math.cos(a - 0.12) * (R - 8), Math.sin(a - 0.12) * (R - 8)], [Math.cos(a) * R, Math.sin(a) * R],
        [Math.cos(a + 0.12) * (R - 8), Math.sin(a + 0.12) * (R - 8)], [Math.cos(a2) * r, Math.sin(a2) * r], [Math.cos(am) * (r - 6), Math.sin(am) * (r - 6)]);
    }
    var inner = [];
    for (i = 0; i < 5; i++) { var b = (-90 + 72 * i) * Math.PI / 180; inner.push([Math.cos(b) * 40, Math.sin(b) * 40]); }
    var flag = wavyFlag(2, 34, -62, -42, 2);
    return [
      { d: pathFromPts(out.map(function (p) { return [p[0], p[1] + 6]; }), true), fill: "stoneDark" },
      { d: pathFromPts(out, true), fill: "stone" },
      { d: pathFromPts(inner, true), fill: "stoneLight" },
      { d: "M-14,-10 L14,-10 L14,14 L-14,14Z", fill: "stoneDark" },
      { d: "M0,-10 L0,-64", stroke: "darkBrown", sw: 2.5, flat: true },
      { d: flag(0, 1 / 3), fill: "orange" }, { d: flag(1 / 3, 2 / 3), fill: "white", flat: true }, { d: flag(2 / 3, 1), fill: "blue", flat: true }
    ];
  };
  CUT.windmill = function () {
    var blades = [];
    for (var i = 0; i < 4; i++) blades.push({ d: "M-3,-6 L3,-6 L3,-104 L-3,-104Z M5,-30 L24,-30 L24,-100 L5,-100Z", fill: "ivory", transform: "rotate(" + (i * 90 + 20) + ")" });
    return [
      { d: "M-36,92 L-22,-36 L22,-36 L36,92Z", fill: "#BFAE8E" },
      { d: "M-46,92 L46,92 L46,80 L-46,80Z", fill: "stoneDark" },
      { d: "M-10,92 L-10,62 C-10,50 10,50 10,62 L10,92Z", fill: "darkBrown" },
      { d: "M-26,-34 C-26,-64 26,-64 26,-34Z", fill: "#6E4A30" },
      { group: blades, name: "sails", transform: "translate(0,-48)" },
      { circle: [0, -48, 6], fill: "iron" }
    ];
  };
  CUT.canon = function () {
    return [
      { d: "M-70,22 L44,22 L34,50 L-60,50Z", fill: "wood" },
      { d: "M-80,-16 L62,-24 C72,-24 76,-16 76,-10 L76,8 C76,14 72,20 62,20 L-80,12 C-90,12 -96,6 -96,-2 C-96,-10 -90,-16 -80,-16Z", fill: "iron", transform: "rotate(-8)" },
      { d: "M56,-26 L56,22", stroke: "#57544E", sw: 4, flat: true, transform: "rotate(-8)" },
      { circle: [-40, 54, 24], fill: "#5E3E24" }, { circle: [-40, 54, 6], fill: "iron" },
      { circle: [28, 56, 20], fill: "#5E3E24" }, { circle: [28, 56, 5], fill: "iron" },
      { circle: [76, 76, 11], fill: "iron" }, { circle: [98, 76, 11], fill: "iron" }, { circle: [87, 58, 11], fill: "iron" }
    ];
  };
  CUT.flagVOC = function () {
    var f = wavyFlag(-86, 96, -100, -2, 7);
    return [
      { d: "M-90,104 L-90,-112", stroke: "#5E4A36", sw: 6 },
      { circle: [-90, -114, 6], fill: "gold" },
      { d: f(0, 1 / 3), fill: "orange" }, { d: f(1 / 3, 2 / 3), fill: "white" }, { d: f(2 / 3, 1), fill: "blue" },
      { d: "M-15,-64 L0,-37 L15,-64 M-13,-52 A6,6 0 1 1 -1,-52 A6,6 0 1 1 -13,-52 M10.9,-56.6 A6,6 0 1 0 10.9,-47.4", stroke: "ink", sw: 3, flat: true }
    ];
  };
  CUT.flagEngland = function () {
    var f = wavyFlag(-86, 96, -100, -2, 7);
    return [
      { d: "M-90,104 L-90,-112", stroke: "#5E4A36", sw: 6 },
      { circle: [-90, -114, 6], fill: "gold" },
      { d: f(0, 1), fill: "white" },
      { d: f(0.4, 0.6), fill: "red", flat: true },
      { d: f(0, 1, -4, 16), fill: "red", flat: true }
    ];
  };
  var MANHATTAN = [[-74.017, 40.7005], [-74.0195, 40.706], [-74.0175, 40.712], [-74.014, 40.72], [-74.0125, 40.728], [-74.011, 40.736], [-74.0105, 40.745],
    [-74.007, 40.754], [-74.002, 40.762], [-73.996, 40.772], [-73.99, 40.78], [-73.985, 40.788], [-73.979, 40.796], [-73.97, 40.808], [-73.96, 40.822],
    [-73.952, 40.835], [-73.946, 40.847], [-73.938, 40.86], [-73.93, 40.871], [-73.924, 40.877], [-73.917, 40.8795], [-73.911, 40.878], [-73.912, 40.872],
    [-73.917, 40.865], [-73.926, 40.856], [-73.932, 40.846], [-73.935, 40.834], [-73.934, 40.82], [-73.933, 40.808], [-73.929, 40.798], [-73.936, 40.789],
    [-73.943, 40.78], [-73.95, 40.771], [-73.958, 40.76], [-73.966, 40.749], [-73.971, 40.739], [-73.973, 40.728], [-73.975, 40.719], [-73.978, 40.711],
    [-73.987, 40.708], [-73.997, 40.706], [-74.006, 40.703], [-74.012, 40.7005]];
  function llShape(ll, lon0, lat0, k) { var cl = Math.cos(lat0 * Math.PI / 180); return ll.map(function (p) { return [(p[0] - lon0) * cl * k, -(p[1] - lat0) * k]; }); }
  CUT.manhattanIsland = function (o) {
    var pts = llShape(MANHATTAN, -73.965, 40.79, 1120).map(function (p) { return [p[0] * 1.3, p[1]]; }); // widened ~30% so it reads at small sizes
    var water = blob(0, 0, 92, 110, [1, 0.95, 1.05, 1, 0.92, 1.04, 1, 0.97, 1.02, 1, 0.96, 1.05], "mh-water", 0.15, 0.08);
    var dot = pts[0];
    var a = o && o.water === false ? [] : [{ d: pathFromPts(water, true), fill: "sea" }];
    return a.concat([
      { d: pathFromPts(smoothClosed(pts, 3), true), fill: "land" },
      { circle: [dot[0] + 6, dot[1] - 8, 6], fill: "red", flat: true }
    ]);
  };
  // Banda islands geometry (lon/lat), shared by Kit.islands and the 'runIsland' cutout
  var BANDA = {
    run: { c: [129.69, -4.55], rx: 0.0145, ry: 0.0042, rot: 58, radii: [1, 0.9, 1.1, 1.2, 1, 0.95, 1, 0.85, 1.1, 1.15, 1, 0.9], label: "RUN" },
    nailaka: { c: [129.7035, -4.5345], rx: 0.0022, ry: 0.0016, rot: 0, radii: [1, 1, 1, 1, 1, 1, 1, 1], label: "NAILAKA" },
    ai: { c: [129.77, -4.53], rx: 0.0115, ry: 0.0092, rot: -20, radii: [1, 1.1, 1.05, 0.9, 1, 1.05, 0.95, 1, 1.1, 0.95, 1, 0.9], label: "AI" },
    api: { c: [129.871, -4.512], rx: 0.0135, ry: 0.0135, rot: 0, radii: [1, 1.02, 0.98, 1, 1.03, 0.97, 1, 1, 1.02, 0.99, 1, 0.98], label: "GUNUNG API" },
    neira: { c: [129.899, -4.527], rx: 0.0125, ry: 0.0068, rot: 62, radii: [1, 0.95, 1.05, 0.9, 0.82, 0.95, 1.08, 1.12, 1, 0.9, 0.95, 1.05], label: "BANDA NEIRA" }
  };
  function lonthorLL() { // Banda Besar: a thick crescent (caldera rim remnant) south and east of Gunung Api and Neira
    var c = [129.915, -4.515], pts = [], a0 = 212, a1 = 352, n = 22, r = rng("lonthor"), i, sx = 1.3;
    for (i = 0; i <= n; i++) { var u = i / n, a = (a0 + (a1 - a0) * u) * Math.PI / 180, taper = Math.pow(Math.sin(Math.PI * u), 0.55), ro = 0.036 + 0.014 * taper * (1 - 0.25 * u) + (r() - 0.5) * 0.0018; pts.push([c[0] + Math.cos(a) * ro * sx, c[1] + Math.sin(a) * ro]); }
    for (i = n; i >= 0; i--) { var b = (a0 + (a1 - a0) * i / n) * Math.PI / 180, ri = 0.036 + (r() - 0.5) * 0.0014; pts.push([c[0] + Math.cos(b) * ri * sx, c[1] + Math.sin(b) * ri]); }
    return pts;
  }
  function bandaShapeLL(key) {
    if (key === "lonthor") return lonthorLL();
    var s = BANDA[key];
    return blob(s.c[0], s.c[1], s.rx, s.ry, s.radii, "banda-" + key, s.rot * Math.PI / 180, 0.1).map(function (p) { return p; });
  }
  CUT.runIsland = function (o) {
    var s = BANDA.run, k = 6200 * ((o && o.k) || 1);
    var pts = bandaShapeLL("run").map(function (p) { return [(p[0] - s.c[0]) * k, -(p[1] - s.c[1]) * k]; });
    var nl = bandaShapeLL("nailaka").map(function (p) { return [(p[0] - s.c[0]) * k, -(p[1] - s.c[1]) * k]; });
    var water = blob(20, -20, 118, 96, [1, 0.95, 1.05, 1, 0.92, 1.04, 1, 0.97, 1.02, 1, 0.96, 1.05], "run-water", -0.5, 0.08);
    var a = o && o.water === false ? [] : [{ d: pathFromPts(water, true), fill: "sea" }];
    return a.concat([
      { d: pathFromPts(pts, true), fill: "land" },
      { d: pathFromPts(nl, true), fill: "land" },
      { circle: [-24, 18, 7], fill: "leaf" }, { circle: [-6, 4, 8], fill: "leaf" }, { circle: [12, -10, 7], fill: "leaf" }, { circle: [28, -24, 6], fill: "leaf" }
    ]);
  };
  function person(pose, color) {
    color = color || "ink";
    if (pose === "kneel") return [
      { circle: [4, -6, 15], fill: color },
      { d: "M-18,14 C-22,16 -26,24 -26,34 L-24,64 C-24,74 -20,80 -10,80 L40,82 C48,82 52,76 50,70 C48,64 42,62 34,62 L12,62 L14,36 C14,24 10,16 4,14 C-4,12 -12,12 -18,14Z", fill: color },
      { d: "M-24,24 C-30,40 -20,54 -6,56", stroke: color, sw: 10, flat: true }
    ];
    return [
      { circle: [0, -74, 16], fill: color },
      { d: "M-24,-52 C-30,-50 -34,-42 -34,-32 L-32,16 C-32,22 -28,24 -24,22 L-20,90 L-4,90 L0,30 L4,90 L20,90 L24,22 C28,24 32,22 32,16 L34,-32 C34,-42 30,-50 24,-52 C14,-56 -14,-56 -24,-52Z", fill: color }
    ];
  }
  CUT.silhouettePerson = function (o) { return person(o && o.pose, o && o.color); };
  CUT.crowdRow = function (o) {
    var n = (o && o.n) || 10, gap = (o && o.gap) || 58, out = [], hi = (o && o.highlight) || [];
    for (var i = 0; i < n; i++) out.push({ group: person((o && o.pose) || "stand", hi.indexOf(i) >= 0 ? "red" : ((o && o.color) || "ink")), transform: "translate(" + ((i - (n - 1) / 2) * gap) + ",0) scale(0.7)", name: "fig" + i });
    return out;
  };

  // ---------------------------------------------------------------- vehicles (side views facing right, waterline at y=0, ~200 long)
  function sq(x, y, w, h, bulge) { var b = bulge == null ? 7 : bulge; return "M" + (x - w / 2) + "," + y + " L" + (x + w / 2) + "," + y + " C" + (x + w / 2 + b) + "," + (y + h * 0.4) + " " + (x + w / 2 + b) + "," + (y + h * 0.6) + " " + (x + w / 2) + "," + (y + h) + " L" + (x - w / 2) + "," + (y + h) + " C" + (x - w / 2 + b) + "," + (y + h * 0.6) + " " + (x - w / 2 + b) + "," + (y + h * 0.4) + " " + (x - w / 2) + "," + y + "Z"; }
  var VEH = {};
  VEH.dhow = function () {
    return [
      { d: "M-104,-18 L-92,-2 C-74,16 40,18 72,12 C92,6 102,-6 112,-26 C82,-12 -40,-12 -104,-18Z", fill: "wood" },
      { d: "M-96,-12 C-40,-6 60,-6 106,-18", stroke: "darkBrown", sw: 2, flat: true },
      { d: "M4,-8 L10,-128", stroke: "darkBrown", sw: 4 },
      { d: "M-76,-42 L76,-150 C44,-104 34,-62 40,-14 C2,-18 -40,-28 -76,-42Z", fill: "ivory" },
      { d: "M-86,-34 L84,-156", stroke: "darkBrown", sw: 3 },
      { d: "M10,-128 L30,-134 L12,-140Z", fill: "red", flat: true }
    ];
  };
  VEH.junk = function () {
    function sail(x, y, w, h) {
      var d = "M" + x + "," + y + " C" + (x + w * 0.7) + "," + (y - 6) + " " + (x + w) + "," + (y + h * 0.3) + " " + (x + w * 1.05) + "," + (y + h) + " L" + x + "," + (y + h) + "Z", bat = [];
      for (var i = 1; i < 5; i++) { var yy = y + h * i / 5; bat.push("M" + x + "," + yy + " L" + (x + w * (0.85 + 0.2 * i / 5)) + "," + (yy - 4)); }
      return [{ d: d, fill: "#B4552E" }, { d: bat.join(" "), stroke: "darkBrown", sw: 2, flat: true }];
    }
    return [
      { d: "M-108,-40 L-84,-40 L-74,-12 L74,-12 C88,-12 100,-20 108,-34 L104,-10 C92,12 60,20 0,20 C-52,20 -88,10 -100,-6Z", fill: "#6E4A2E" },
      { d: "M-100,-6 C-60,4 40,6 104,-10", stroke: "ochre", sw: 3, flat: true },
      { d: "M-6,-12 L-6,-150 M56,-12 L56,-108 M-64,-12 L-64,-96", stroke: "darkBrown", sw: 3.5 }
    ].concat(sail(-6, -146, 62, 130), sail(56, -104, 40, 88), sail(-64, -92, 34, 76));
  };
  function squareRigger(o) {
    var hull = o.hull, sails = [], masts = o.masts;
    masts.forEach(function (m) { var y = m.top; m.sails.forEach(function (s) { sails.push({ d: sq(m.x, y, s[0], s[1]), fill: "ivory" }); y += s[1] + 4; }); });
    var out = [
      { d: "M-112,-34 L-104,-34 L-100,-50 L-70,-50 L-66,-26 L78,-26 C94,-26 104,-32 118,-44 L112,-22 C102,8 72,22 0,24 C-62,24 -98,12 -106,-8Z", fill: hull },
      { d: "M-104,-16 C-60,-10 60,-10 112,-24 L110,-16 C60,-2 -60,-2 -102,-8Z", fill: o.stripe, flat: true },
      { d: "M-72,-12 h8 v6 h-8Z M-46,-11 h8 v6 h-8Z M-20,-10 h8 v6 h-8Z M6,-10 h8 v6 h-8Z M32,-11 h8 v6 h-8Z M58,-13 h8 v6 h-8Z", fill: "#2B1C12", solid: true, flat: true },
      { d: masts.map(function (m) { return "M" + m.x + ",-26 L" + m.x + "," + (m.top - 14); }).join(" ") + " M112,-36 L160,-64", stroke: "darkBrown", sw: 3.5 },
      { d: "M116,-40 L156,-62 L96,-62Z", fill: "ivory" }
    ].concat(sails);
    return out.concat(o.flag);
  }
  VEH.eastIndiaman = function () {
    var f = wavyFlag(-104, -76, -82, -64, 1.5);
    return squareRigger({ hull: "#5B3A24", stripe: "ochre",
      masts: [{ x: 60, top: -120, sails: [[50, 34], [42, 28], [30, 20]] }, { x: 4, top: -150, sails: [[62, 40], [52, 32], [38, 24]] }, { x: -56, top: -118, sails: [[44, 32], [34, 24]] }],
      flag: [{ d: "M-104,-50 L-104,-84", stroke: "darkBrown", sw: 2.5, flat: true }, { d: f(0, 1 / 3), fill: "orange", flat: true }, { d: f(1 / 3, 2 / 3), fill: "white", flat: true }, { d: f(2 / 3, 1), fill: "blue", flat: true }] });
  };
  VEH.englishShip = function () {
    var f = wavyFlag(4, 34, -186, -168, 1.5);
    return squareRigger({ hull: "#6A4528", stripe: "#8E3B2A",
      masts: [{ x: 56, top: -112, sails: [[46, 32], [36, 26]] }, { x: 4, top: -150, sails: [[58, 40], [48, 32], [34, 22]] }, { x: -54, top: -108, sails: [[40, 30], [30, 22]] }],
      flag: [{ d: "M4,-160 L4,-188", stroke: "darkBrown", sw: 2.5, flat: true }, { d: f(0, 1), fill: "white", flat: true }, { d: f(0.38, 0.62), fill: "red", flat: true }, { d: f(0, 1, 15, 21), fill: "red", flat: true }] });
  };
  VEH.prau = function () {
    return [
      { d: "M-96,6 L-84,8 M-40,8 L-40,-8 M40,8 L40,-8 M84,8 L96,6", stroke: "darkBrown", sw: 2.5, flat: true },
      { d: "M-90,10 C-40,16 40,16 90,10 C40,20 -40,20 -90,10Z", fill: "darkBrown" },
      { d: "M-108,-26 C-96,-14 -80,-6 -60,-4 L60,-4 C80,-6 96,-14 108,-26 C96,-2 70,8 0,8 C-70,8 -96,-2 -108,-26Z", fill: "#7A5232" },
      { d: "M-6,-4 L4,-112", stroke: "darkBrown", sw: 3 },
      { d: "M-14,-10 C-58,-58 -50,-128 -16,-152 C-14,-104 16,-60 62,-40 C34,-28 10,-18 -14,-10Z", fill: "#C7A36B" },
      { d: "M-14,-10 C-40,-50 -40,-110 -18,-148 M-14,-10 C10,-30 34,-38 60,-40", stroke: "darkBrown", sw: 2, flat: true }
    ];
  };

  // ---------------------------------------------------------------- cutout object
  function makeCutoutObject(ctx, parent, pieces, opts, kind) {
    var x = opts.x || 0, y = opts.y || 0, sc = opts.scale != null ? opts.scale : (opts.size ? opts.size / 200 : 1), rot = opts.rotate || 0;
    var outer = S("g", { class: "kit-cutout " + kind, transform: "translate(" + x + "," + y + ") rotate(" + rot + ") scale(" + sc + ")" }, parent);
    if (opts.id) outer.id = opts.id;
    var body = S("g", null, outer), wob = S("g", null, body);
    var a = S("g", { filter: opts.paper === false ? null : fid(ctx, "lift") }, wob);
    art(ctx, a, pieces);
    var o = { el: outer, body: body, wob: wob, art: a, parts: a.__parts || {}, x: x, y: y, scale: sc, rotate: rot, flip: 1,
      place: function (tl, t, po) { place(tl, o, t, po); return o; },
      in: function (tl, t, po) { place(tl, o, t, po); return o; },
      out: function (tl, t, dur) { tl.to(body, { opacity: 0, duration: dur || 0.3, ease: "power1.inOut" }, t); return o; },
      wobble: function (tl, t, dur, wo) { wobble(tl, o, t, dur, wo); return o; },
      setPose: function (px, py, ang, flip) { o.x = px; o.y = py; outer.setAttribute("transform", "translate(" + f2(px) + "," + f2(py) + ") rotate(" + f2(ang || 0) + ") scale(" + f2(sc * (flip || 1)) + "," + f2(sc) + ")"); }
    };
    if (opts.label) {
      var lab = label(parent, [x, y + (opts.labelDy || 120 * sc)], opts.label, Object.assign({ anchor: "middle", halo: false }, opts.labelOpts || {}));
      o.label = lab; body.__label = lab;
    }
    return o;
  }
  function cutout(target, name, opts) {
    opts = opts || {};
    var parent = target.namespaceURI === NS ? target : svgOf(target, "top");
    var ctx = ctxOf(parent);
    if (!CUT[name]) throw new Error("Kit.cutout: unknown cutout '" + name + "'. Known: " + Object.keys(CUT).join(", "));
    return makeCutoutObject(ctx, parent, CUT[name](opts), opts, "cut-" + name);
  }
  function vehicle(target, type, opts) {
    opts = opts || {};
    var parent = target.gRoutes ? target.gRoutes : (target.namespaceURI === NS ? target : svgOf(target, "map"));
    var ctx = ctxOf(parent);
    if (!VEH[type]) throw new Error("Kit.vehicle: unknown type '" + type + "'. Known: " + Object.keys(VEH).join(", "));
    var o = makeCutoutObject(ctx, parent, VEH[type](opts), Object.assign({ scale: 0.4 }, opts), "veh-" + type);
    o.type = type;
    return o;
  }
  // a vehicle (or any cutout object) rides a route; also draws the route behind it unless draw:false
  function ride(v, r, tl, start, dur, ease, opts) {
    opts = opts || {};
    var proxy = { t: 0 }, orient = opts.orient || "flip", tilt = opts.maxTilt == null ? 10 : opts.maxTilt, lift = opts.lift == null ? -6 : opts.lift;
    function upd() {
      var p = pathPoint(r, proxy.t), flip = 1, ang = 0;
      if (orient === "rotate") ang = p.angle;
      else if (orient === "flip") { flip = p.dx < 0 ? -1 : 1; var a = flip > 0 ? p.angle : 180 - p.angle; a = ((a + 540) % 360) - 180; ang = Math.max(-tilt, Math.min(tilt, a)) * flip; }
      v.setPose(p.x, p.y + lift, ang, flip);
      v.el.style.opacity = p.visible ? "" : "0";
      if (opts.draw !== false) r.draw(proxy.t);
    }
    tl.fromTo(proxy, { t: 0 }, { t: 1, duration: dur, ease: ease || "none", onUpdate: upd }, start);
    proxy.t = 0; upd(); // pose at frame 0 too
    if (r.map && r.map.onRender) r.map.onRender(function () { if (r.lut.length) { var dr = opts.draw; opts.draw = false; upd(); opts.draw = dr; } });
    return proxy;
  }

  // ---------------------------------------------------------------- motion helpers
  function place(tl, o, t, po) { // hand-placed cutout: slide 30–60px with ±4° rotation, settle with a tiny overshoot
    po = po || {};
    var r = rng(po.seed != null ? po.seed : ((o.x * 7 + o.y * 13) | 0)), dir = po.from || ["left", "right", "top", "bottom"][Math.floor(r() * 4)];
    var dist = po.dist || (30 + r() * 30), dx = dir === "left" ? -dist : dir === "right" ? dist : (r() - 0.5) * 16, dy = dir === "top" ? -dist : dir === "bottom" ? dist : (r() - 0.5) * 16;
    var rot = po.rot != null ? po.rot : (r() < 0.5 ? -1 : 1) * (2.5 + r() * 1.5), dur = po.dur || 0.55;
    var tgt = o.body || o;
    tl.fromTo(tgt, { x: dx / (o.scale || 1), y: dy / (o.scale || 1), rotation: rot, svgOrigin: "0 0" },
      { x: 0, y: 0, rotation: 0, duration: dur, ease: po.ease || "back.out(1.2)", svgOrigin: "0 0" }, t);
    tl.fromTo(tgt, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, t);
    if (o.label) enter(tl, o.label.el, t + dur * 0.6, "fadeUp");
    return tl;
  }
  // stop-motion wobble: seeded jitter stepped at fps, from t for dur seconds (illustrations only)
  function wobble(tl, o, t, dur, opts) {
    opts = opts || {};
    var fps = opts.fps || 12, px = opts.px == null ? 0.6 : opts.px, deg = opts.deg == null ? 0.3 : opts.deg, seed = opts.seed != null ? opts.seed : ((o.x * 31 + o.y * 17) | 0);
    var sc = o.scale || 1, el = o.wob || o, proxy = { s: 0 };
    tl.fromTo(proxy, { s: 0 }, { s: dur, duration: dur, ease: "none", onUpdate: function () {
      var step = Math.floor(proxy.s * fps);
      var jx = (hash2(seed, step * 3) - 0.5) * 2 * px / sc, jy = (hash2(seed, step * 3 + 1) - 0.5) * 2 * px / sc, jr = (hash2(seed, step * 3 + 2) - 0.5) * 2 * deg;
      el.setAttribute("transform", proxy.s >= dur ? "" : "translate(" + f2(jx) + "," + f2(jy) + ") rotate(" + f2(jr) + ")");
    } }, t);
    return proxy;
  }
  function enter(tl, el, t, preset, o) {
    o = o || {};
    var dur = o.dur;
    switch (preset || "fadeUp") {
      case "fade": tl.fromTo(el, { opacity: 0 }, { opacity: o.to || 1, duration: dur || 0.35, ease: "power2.out" }, t); break;
      case "pop": tl.fromTo(el, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: dur || 0.22, ease: "back.out(1.6)" }, t); break;
      case "blur": tl.fromTo(el, { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: dur || 0.2, ease: "power4.out" }, t); break;
      default: tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: dur || 0.35, ease: "power2.out" }, t);
    }
    return tl;
  }
  // v2: exit(tl, t, targets, {style: "lift"|"fade", dur, stagger, dist, rot}); v1: exit(tl, el, t, dur) (opacity only)
  function exitTargets(x, out) {
    out = out || [];
    if (!x) return out;
    if (Array.isArray(x)) { x.forEach(function (y) { exitTargets(y, out); }); return out; }
    if (x.nodeType) { out.push({ el: x, s: 1 }); return out; }
    if (x.all) return exitTargets(x.all, out);
    if (x.body && x.body.nodeType) { out.push({ el: x.body, s: x.scale || 1 }); if (x.label && x.label.el) out.push({ el: x.label.el, s: 1 }); return out; }
    if (x.group) return exitTargets(x.group, out);
    if (x.g && x.g.nodeType) { out.push({ el: x.g, s: 1 }); return out; }
    if (x.el && x.el.nodeType) { out.push({ el: x.el, s: 1 }); return out; }
    return out;
  }
  function exit(tl, a, b, c) {
    if (typeof a !== "number") { tl.to(a, { opacity: 0, duration: c || 0.3, ease: "power1.inOut" }, b); return tl; }
    var o = c || {}, style = o.style || "lift", dur = o.dur || (style === "lift" ? 0.5 : 0.35);
    exitTargets(b).forEach(function (it, i) {
      var at = a + i * (o.stagger || 0);
      if (style === "fade") { tl.to(it.el, { opacity: 0, duration: dur, ease: "power1.inOut" }, at); return; }
      var sgn = hash2(o.seed || 17, i) < 0.5 ? -1 : 1;
      tl.to(it.el, { opacity: 0, y: "-=" + f2((o.dist || 26) / it.s), rotation: sgn * (o.rot || 3.5), scale: 1.03, transformOrigin: "50% 50%",
        duration: dur, ease: "power2.in" }, at);
    });
    return tl;
  }
  function els(targets) { return (Array.isArray(targets) ? targets : [targets]).map(function (x) { return x && (x.g || (x.el && x.el.nodeType ? x.el : null) || x); }); }
  function dim(tl, targets, t, to, dur) { tl.to(els(targets), { opacity: to == null ? 0.28 : to, duration: dur || 0.4, ease: "power1.inOut" }, t); return tl; }
  function themeFlip(tl, t, opts) {
    opts = opts || {};
    var ctx = opts.stage ? opts.stage.ctx : CUR; if (!ctx) return tl;
    var from = ctx.theme, to = opts.to || (from === "navy" ? "cream" : "navy"), dur = opts.dur || 0.28;
    ctx.themables.forEach(function (m) {
      var a = {}, b = { duration: dur, ease: "power2.inOut", immediateRender: false };
      a[m.prop] = m.p[from]; b[m.prop] = m.p[to];
      if (a[m.prop] === b[m.prop]) return;
      tl.fromTo(m.el, a, b, t);
    });
    ctx.theme = to;
    return tl;
  }

  // ---------------------------------------------------------------- pins & labels
  function label(svgTarget, xy, text, opts) {
    opts = opts || {};
    var parent = svgTarget.gLabels || (svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map"));
    var ctx = ctxOf(parent), theme = themeOf(ctx, opts), font = opts.font || "mono";
    var size = opts.size || (font === "mono" ? 24 : 32);
    var t = S("text", { x: f2(xy[0]), y: f2(xy[1]), class: "kit-label kit-label-" + font, "text-anchor": opts.anchor || "start", "font-size": size }, parent);
    t.textContent = font === "mono" && opts.upper !== false ? String(text).toUpperCase() : text;
    if (opts.tracking) t.setAttribute("letter-spacing", opts.tracking);
    if (opts.weight) t.setAttribute("font-weight", opts.weight);
    var col = opts.color || "ink";
    t.style.fill = tok(col, theme); if (TOK[col]) reg(ctx, t, "fill", pair(col));
    if (opts.halo !== false) {
      var hc = opts.haloColor || "sea";
      t.style.stroke = tok(hc, theme); t.style.strokeWidth = (opts.haloWidth || 6) * 2; if (TOK[hc]) reg(ctx, t, "stroke", pair(hc));
    }
    if (opts.opacity != null) t.setAttribute("opacity", opts.opacity);
    return { el: t, in: function (tl, at, preset) { enter(tl, t, at, preset || "fadeUp"); return this; }, out: function (tl, at) { exit(tl, t, at); return this; } };
  }
  var OFFS = { ur: [14, -14, "start"], ul: [-14, -14, "end"], r: [18, 8, "start"], l: [-18, 8, "end"], b: [0, 38, "middle"], t: [0, -22, "middle"], dr: [14, 30, "start"], dl: [-14, 30, "end"] };
  function pin(svgTarget, xy, text, opts) {
    opts = opts || {};
    var parent = svgTarget.gPins || (svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map"));
    var ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    if (svgTarget.project && opts.screen !== true) xy = svgTarget.project(xy); // on a map, xy is [lon, lat]
    var r = opts.r || 10, g = S("g", { class: "kit-pin" }, parent);
    var dg = S("g", { filter: fid(ctx, "pinlift") }, g);
    var dot = S("circle", { cx: f2(xy[0]), cy: f2(xy[1]), r: r, "stroke-width": 2.5 }, dg);
    var col = opts.color || "red";
    dot.style.fill = tok(col, theme); if (TOK[col]) reg(ctx, dot, "fill", pair(col));
    dot.style.stroke = theme === "navy" ? C.inkNavy : C.ink; reg(ctx, dot, "stroke", { cream: C.ink, navy: C.inkNavy });
    var lab = null;
    if (text) {
      var o = OFFS[opts.pos || "ur"];
      var lp = svgTarget.gLabels || parent;
      lab = label(lp, [xy[0] + o[0] + (opts.dx || 0), xy[1] + o[1] + (opts.dy || 0)], text, Object.assign({ anchor: o[2] }, opts.label || {}, { theme: theme, font: opts.font, size: opts.size }));
    }
    var api = { el: g, dot: dot, label: lab, xy: xy,
      in: function (tl, t) { tl.fromTo(dot, { scale: 0, opacity: 0, svgOrigin: xy[0] + " " + xy[1] }, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2)", svgOrigin: xy[0] + " " + xy[1] }, t); if (lab) enter(tl, lab.el, t + 0.05, "fadeUp", { dur: 0.3 }); return api; },
      out: function (tl, t) { exit(tl, [g, lab && lab.el].filter(Boolean), t); return api; } };
    api.g = g; if (lab) api.group = [g, lab.el];
    if (svgTarget.kind === "globe" && opts.screen !== true) {
      var ll = arguments[1], lo = lab ? [+lab.el.getAttribute("x") - xy[0], +lab.el.getAttribute("y") - xy[1]] : null;
      svgTarget.onRender(function () {
        var p = svgTarget.project(ll), vis = svgTarget.visible(ll);
        dot.setAttribute("cx", f2(p[0])); dot.setAttribute("cy", f2(p[1])); g.setAttribute("visibility", vis ? "visible" : "hidden");
        if (lab) { lab.el.setAttribute("x", f2(p[0] + lo[0])); lab.el.setAttribute("y", f2(p[1] + lo[1])); lab.el.setAttribute("visibility", vis ? "visible" : "hidden"); }
      });
    }
    return api;
  }
  function scaleBar(svgTarget, xy, km, pxPerKm, opts) {
    opts = opts || {};
    var parent = svgTarget.gLabels || (svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map"));
    var ctx = ctxOf(parent), theme = themeOf(ctx, opts), w = km * pxPerKm, g = S("g", { class: "kit-scalebar" }, parent);
    var c = tok("ink", theme);
    S("path", { d: "M" + xy[0] + "," + (xy[1] - 6) + " v6 h" + f2(w) + " v-6 M" + f2(xy[0] + w / 2) + "," + (xy[1] - 4) + " v4", fill: "none", stroke: c, "stroke-width": 2 }, g);
    var t1 = S("text", { x: xy[0], y: xy[1] + 24, class: "kit-label kit-label-mono kit-mono", "font-size": 16, fill: c }, g); t1.textContent = "0";
    var t2 = S("text", { x: f2(xy[0] + w), y: xy[1] + 24, class: "kit-label kit-label-mono kit-mono", "font-size": 16, "text-anchor": "middle", fill: c }, g); t2.textContent = km + " KM";
    return { el: g, in: function (tl, t) { enter(tl, g, t, "fade", { to: 0.7 }); return this; } };
  }

  // ---------------------------------------------------------------- Banda islands zoom map
  function islands(svgTarget, spec) {
    spec = spec || {};
    var svg = svgTarget.namespaceURI === NS ? svgTarget : svgOf(svgTarget, "map");
    var ctx = ctxOf(svg), theme = themeOf(ctx, spec);
    var center = spec.center || [129.825, -4.535], k = spec.scale || 5300, cx = spec.x || W / 2, cy = spec.y || H / 2 + 40;
    function project(ll) { return [cx + (ll[0] - center[0]) * k, cy - (ll[1] - center[1]) * k]; }
    var mk = "isl" + (++CTX_N);
    var g = S("g", { class: "kit-islands" }, svg);
    if (spec.sea !== false) S("rect", { x: -40, y: -40, width: W + 80, height: H + 80, fill: paperFillThemed(ctx, "sea", mk + "sea") }, g);
    var gShal = S("g", { class: "kit-shallows" }, g);
    var gLand = S("g", { class: "kit-land", filter: fid(ctx, "cut") }, g);
    var gTop = S("g", null, g), gLabels = S("g", { class: "kit-labels" }, g);
    var landFill = paperFillThemed(ctx, "land", mk + "land"), shalFill = paperFillThemed(ctx, "shallows", mk + "shal");
    var out = {};
    var order = ["lonthor", "api", "neira", "ai", "run", "nailaka"];
    var labelSide = Object.assign({ lonthor: "below", api: "above", neira: "right", ai: "below", run: "left", nailaka: "right" }, spec.labelSide || {});
    var names = { lonthor: "BANDA BESAR", api: "GUNUNG API", neira: "BANDA NEIRA", ai: "AI", run: "RUN", nailaka: "NAILAKA" };
    var hi = spec.highlight ? [].concat(spec.highlight) : [];
    order.forEach(function (key) {
      var ll = bandaShapeLL(key), pts = ll.map(project), d = pathFromPts(pts, true);
      var cxy = pts.reduce(function (a, p) { return [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length]; }, [0, 0]);
      var shal = null;
      if (spec.shallows !== false) {
        var sp = pts.map(function (p) { var dx = p[0] - cxy[0], dy = p[1] - cxy[1], L = Math.hypot(dx, dy) || 1, e = key === "lonthor" ? 14 : 16; return [p[0] + dx / L * e, p[1] + dy / L * e]; });
        if (key === "lonthor") sp = pts.map(function (p, i) { var q = pts[(i + 1) % pts.length], o = pts[(i - 1 + pts.length) % pts.length], nx = q[1] - o[1], ny = -(q[0] - o[0]), L = Math.hypot(nx, ny) || 1; return [p[0] + nx / L * 14, p[1] + ny / L * 14]; });
        shal = S("path", { d: pathFromPts(sp, true), fill: shalFill, opacity: 0.9, "stroke-linejoin": "round" }, gShal);
      }
      var ig = S("g", { class: "kit-island kit-island-" + key }, gLand);
      var shape = S("path", { d: d, fill: landFill }, ig);
      var extra = [];
      if (key === "api") { // the volcano cone, top-down: slope ring and crater
        var c0 = project(BANDA.api.c), rr = BANDA.api.rx * k;
        extra.push(S("path", { d: pathFromPts(blob(c0[0] + 2, c0[1] - 3, rr * 0.62, rr * 0.6, [1, 1.05, 0.95, 1, 1.04, 0.96, 1, 1], "api-mid", 0, 0.08), true), fill: paperFill(ctx, "#CDBF9C"), filter: fid(ctx, "piece") }, gTop));
        extra.push(S("path", { d: pathFromPts(blob(c0[0] + 3, c0[1] - 5, rr * 0.3, rr * 0.28, [1, 1.05, 0.95, 1, 1.04, 0.96], "api-top", 0, 0.08), true), fill: paperFill(ctx, "#A8977A"), filter: fid(ctx, "piece") }, gTop));
        extra.push(S("ellipse", { cx: f2(c0[0] + 3), cy: f2(c0[1] - 5), rx: f2(rr * 0.12), ry: f2(rr * 0.1), fill: paperFill(ctx, "#6E5E46") }, gTop));
      }
      var bx = pts.reduce(function (b, p) { return [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])]; }, [1e9, 1e9, -1e9, -1e9]);
      var side = labelSide[key], gap = key === "nailaka" ? 10 : 22, lxy, anc;
      if (side === "above") { lxy = [(bx[0] + bx[2]) / 2, bx[1] - gap]; anc = "middle"; }
      else if (side === "below") { lxy = [(bx[0] + bx[2]) / 2, bx[3] + gap + 18]; anc = "middle"; }
      else if (side === "left") { lxy = [bx[0] - gap, (bx[1] + bx[3]) / 2 + 8]; anc = "end"; }
      else { lxy = [bx[2] + gap, (bx[1] + bx[3]) / 2 + 8]; anc = "start"; }
      var isHi = hi.indexOf(key) >= 0;
      var lab = spec.labels === false ? null : label(gLabels, lxy, (spec.names && spec.names[key]) || names[key], { anchor: anc, size: key === "nailaka" ? 16 : 22, color: isHi ? "red" : "ink", tracking: "0.16em", theme: theme, haloColor: "sea" });
      out[key] = { g: ig, shape: shape, shallows: shal, extra: extra, label: lab, xy: cxy, pts: pts };
      if (isHi) highlightIsland(ctx, out[key]);
    });
    out.besar = out.lonthor; out.gunungApi = out.api;
    return { g: g, gLand: gLand, gLabels: gLabels, gTop: gTop, project: project, islands: out, scale: k, pxPerKm: k / 111.2, theme: theme,
      highlight: function (tl, t, key, hopts) { var isl = out[key]; var ring = highlightIsland(ctx, isl, true); enter(tl, ring, t, "fade", { dur: 0.35 }); if (isl.label) tl.to(isl.label.el, { fill: tok("red", theme), duration: 0.3 }, t); return ring; } };
  }
  function highlightIsland(ctx, isl, hidden) {
    var ring = S("path", { d: isl.shape.getAttribute("d"), fill: "none", stroke: C.red, "stroke-width": 3, "stroke-linejoin": "round", "stroke-dasharray": "8 6", opacity: hidden ? 0 : 1 }, isl.g.parentNode.parentNode);
    // outline sits just outside the coast: draw it on an expanded copy
    var pts = isl.pts, c = isl.xy;
    ring.setAttribute("d", pathFromPts(pts.map(function (p) { var dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy) || 1; return [p[0] + dx / L * 12, p[1] + dy / L * 12]; }), true));
    return ring;
  }

  // ---------------------------------------------------------------- HTML components
  function sheetDiv(ctx, parent, color, extraCls) {
    var tex = makeTexture("fibre");
    var s = D("div", "kit-sheet" + (extraCls ? " " + extraCls : ""), parent, { backgroundColor: color, backgroundImage: "url(" + tex.url + ")", filter: fid(ctx, "cut") });
    return s;
  }
  function posBox(el, o) {
    el.style.left = (o.x || 0) + "px"; el.style.top = (o.y || 0) + "px";
    if (o.w) el.style.width = o.w + "px";
  }
  function card(root, opts) {
    opts = opts || {};
    var parent = layerOf(root), ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    var el = D("div", "kit-card", parent); posBox(el, opts);
    if (opts.id) el.id = opts.id;
    var sheet = sheetDiv(ctx, el, tok("card", theme)); reg(ctx, sheet, "backgroundColor", pair("card"));
    var body = D("div", "kit-card-body", el), parts = {};
    if (opts.eyebrow) { parts.eyebrow = D("div", "kit-eyebrow", body); parts.eyebrow.textContent = opts.eyebrow; }
    if (opts.big != null) { parts.big = D("div", "kit-big", body); parts.big.innerHTML = accent(String(opts.big)); }
    if (opts.small) { parts.small = D("div", "kit-small", body); parts.small.textContent = opts.small; }
    if (opts.big != null && opts.bigSize) parts.big.style.fontSize = opts.bigSize + "px";
    body.style.color = tok("ink", theme); reg(ctx, body, "color", pair("ink"));
    var bigCol = opts.bigColor || "blue";
    if (parts.big) { var bp = bigCol === "blue" ? { cream: C.blue, navy: C.gold } : pair(bigCol); parts.big.style.color = bp[theme]; reg(ctx, parts.big, "color", bp); }
    themeAccents(ctx, el, theme);
    var api = { el: el, sheet: sheet, body: body, parts: parts,
      in: function (tl, t, preset) { if (preset === "place") placeHtml(tl, el, t, opts.seed); else enter(tl, el, t, preset || "fadeUp"); return api; },
      out: function (tl, t) { exit(tl, el, t); return api; } };
    return api;
  }
  function placeHtml(tl, el, t, seed) {
    var r = rng(seed || 7), dx = (r() < 0.5 ? -1 : 1) * (30 + r() * 25), rot = (r() < 0.5 ? -1 : 1) * (2 + r() * 2);
    tl.fromTo(el, { x: dx, y: 12, rotation: rot, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(1.2)" }, t);
  }
  function accent(s) { return s.replace(/\*([^*]+)\*/g, '<em class="kit-accent">$1</em>'); }
  function themeAccents(ctx, el, theme) {
    el.querySelectorAll(".kit-accent").forEach(function (a) { a.style.color = theme === "navy" ? C.gold : C.blue; reg(ctx, a, "color", { cream: C.blue, navy: C.gold }); });
  }
  function title(root, text, opts) {
    opts = opts || {};
    var parent = layerOf(root), ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    var el = D("div", "kit-title", parent);
    posBox(el, { x: opts.x == null ? 66 : opts.x, y: opts.y == null ? 118 : opts.y, w: opts.w });
    if (opts.id) el.id = opts.id;
    el.style.fontSize = (opts.size || 68) + "px"; el.style.textAlign = opts.align || "left";
    if (opts.align === "center") { el.style.left = "0px"; el.style.width = W + "px"; }
    var kick = null;
    if (opts.kicker) { kick = D("div", "kit-kicker", el); kick.textContent = opts.kicker; kick.style.color = tok(opts.kickerColor || "kicker", theme); reg(ctx, kick, "color", pair(opts.kickerColor || "kicker")); }
    var line = D("div", "kit-title-line", el), words = [];
    String(text).split(/(\*[^*]+\*)/).forEach(function (chunk) {
      if (!chunk) return;
      var isAcc = /^\*.*\*$/.test(chunk), inner = isAcc ? chunk.slice(1, -1) : chunk;
      inner.split(/(\s+)/).forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) { line.appendChild(document.createTextNode(" ")); return; }
        var sp = D("span", "kit-word" + (isAcc ? " kit-accent" : ""), line); sp.textContent = w; words.push(sp);
      });
    });
    line.style.color = tok("ink", theme); reg(ctx, line, "color", pair("ink"));
    themeAccents(ctx, el, theme);
    if (opts.sub) { var sub = D("div", "kit-title-sub", el); sub.textContent = opts.sub; sub.style.color = tok("ink2", theme); reg(ctx, sub, "color", pair("ink2")); }
    var api = { el: el, words: words, kicker: kick,
      in: function (tl, t, style) {
        if (kick) tl.fromTo(kick, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, t - 0.15);
        if (style === "ink") words.forEach(function (w, i) { tl.fromTo(w, { opacity: 0.15 }, { opacity: 1, duration: 0.25, ease: "power2.out" }, t + i * 0.08); });
        else words.forEach(function (w, i) { tl.fromTo(w, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, ease: "power2.out" }, t + i * 0.07); });
        if (el.querySelector(".kit-title-sub")) enter(tl, el.querySelector(".kit-title-sub"), t + words.length * 0.07 + 0.1, "fade");
        return api;
      },
      out: function (tl, t) { tl.to(el, { opacity: 0, filter: "blur(6px)", duration: 0.2, ease: "power1.in" }, t); return api; } };
    return api;
  }
  function stamp(root, text, opts) {
    opts = opts || {};
    var parent = layerOf(root), ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    var el = D("div", "kit-stamp", parent);
    el.style.left = (opts.x || 0) + "px"; el.style.top = (opts.y || 0) + "px";
    if (opts.id) el.id = opts.id;
    var ink = D("div", "kit-stamp-ink", el), speck = makeTexture("speck");
    ink.textContent = text;
    var col = tok(opts.color || (theme === "navy" ? "gold" : "red"), theme);
    ink.style.color = col; ink.style.borderColor = col; ink.style.fontSize = (opts.size || 34) + "px";
    ink.style.webkitMaskImage = ink.style.maskImage = "url(" + speck.url + ")";
    ink.style.filter = fid(ctx, "rough");
    var rot = opts.rotate == null ? -5 : opts.rotate;
    gsap.set(el, { xPercent: -50, yPercent: -50, rotation: rot, opacity: opts.hidden === false ? 1 : 0 });
    var api = { el: el,
      in: function (tl, t) {
        tl.fromTo(el, { scale: 1.6, opacity: 0, rotation: rot - 4 }, { scale: 0.97, opacity: 1, rotation: rot, duration: 0.14, ease: "power3.in" }, t);
        tl.to(el, { scale: 1, duration: 0.14, ease: "power2.out" }, t + 0.14);
        return api;
      },
      out: function (tl, t) { exit(tl, el, t); return api; } };
    api.slam = api.in;
    return api;
  }
  function makeFormat(fmt, o) {
    o = o || {};
    if (typeof fmt === "function") return fmt;
    var pre = o.prefix || "", suf = o.suffix || "", dec = o.decimals || 0;
    return function (v) {
      var s;
      switch (fmt) {
        case "x": s = "×" + fmtInt(v); break;
        case "pct": s = fmtInt(v) + "%"; break;
        case "hm": var m = Math.round(v); s = (Math.floor(m / 60) < 10 ? "0" : "") + Math.floor(m / 60) + "h " + (m % 60 < 10 ? "0" : "") + (m % 60) + "m"; break;
        case "year": s = String(Math.round(v)); break;
        case "money": s = "£" + fmtInt(v); break;
        case "dec": s = v.toFixed(dec); break;
        default: s = dec ? v.toFixed(dec) : fmtInt(v);
      }
      return pre + s + suf;
    };
  }
  function counter(el, from, to, opts) {
    opts = opts || {};
    var node = el.el || el, fmt = makeFormat(opts.format || "int", opts), proxy = { v: from };
    function w() { node.textContent = fmt(proxy.v); }
    w();
    proxy.write = w;
    proxy.tween = function (tl, t, dur, ease, toV, fromV) { tl.fromTo(proxy, { v: fromV == null ? from : fromV }, { v: toV == null ? to : toV, duration: dur || 1.5, ease: ease || "power2.out", onUpdate: w, immediateRender: false }, t); return proxy; };
    if (opts.tl) proxy.tween(opts.tl, opts.at || 0, opts.dur, opts.ease);
    return proxy;
  }
  function priceLadder(root, steps, opts) {
    opts = opts || {};
    var c = card(root, { x: opts.x, y: opts.y, w: opts.w || 420, theme: opts.theme, eyebrow: opts.eyebrow || "PRICE OF NUTMEG", big: "×1", bigSize: opts.bigSize || 92, small: opts.small, id: opts.id });
    var ctx = ctxOf(c.el), theme = themeOf(ctx, opts);
    var list = D("div", "kit-ladder", c.body), rows = [];
    if (c.parts.small) c.body.appendChild(c.parts.small);
    steps.forEach(function (s, i) {
      var row = D("div", "kit-ladder-row", list);
      var nm = D("span", "kit-ladder-name", row); nm.textContent = String(s.label).toUpperCase();
      D("span", "kit-ladder-dots", row);
      var val = D("span", "kit-ladder-val", row); val.textContent = s.text || ("×" + fmtInt(s.value));
      rows.push({ el: row, name: nm, val: val });
    });
    var ctr = counter(c.parts.big, steps[0].value, steps[steps.length - 1].value, { format: opts.format || "x" });
    var cur = steps[0].value;
    var api = { el: c.el, card: c, rows: rows, counter: ctr,
      in: function (tl, t) { c.in(tl, t); rows.forEach(function (r) { tl.fromTo(r.el, { opacity: 0 }, { opacity: 0, duration: 0.01 }, t); }); return api; },
      step: function (tl, i, t, dur) {
        var from = i > 0 ? steps[i - 1].value : steps[0].value, to = steps[i].value;
        tl.fromTo(rows[i].el, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, t);
        if (i > 0) tl.fromTo(rows[i - 1].el, { opacity: 1 }, { opacity: 0.45, duration: 0.3, immediateRender: false }, t);
        ctr.tween(tl, t, dur || 0.7, "power2.out", to, from);
        return api;
      } };
    return api;
  }
  // waffle: n cells (dots or tiny figures). filled = how many start in the accent colour.
  function waffle(root, n, opts) {
    opts = opts || {};
    var parent = opts.svg || svgOf(root, "top"), ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    var cols = opts.cols || 10, size = opts.size || 18, gap = opts.gap || 8, shape = opts.shape || "dot";
    var g = S("g", { class: "kit-waffle", transform: "translate(" + (opts.x || 0) + "," + (opts.y || 0) + ")" }, parent);
    var inner = S("g", { filter: opts.paper === false ? null : fid(ctx, "pinlift") }, g);
    var cells = [], base = tok(opts.color || "ink", theme), hiC = tok(opts.fillColor || "red", theme);
    for (var i = 0; i < n; i++) {
      var cx = (i % cols) * (size + gap) + size / 2, cy = Math.floor(i / cols) * (size + gap) + size / 2, e;
      if (shape === "figure") {
        e = S("path", { d: "M" + f2(cx) + "," + f2(cy - size * 0.5) + " a" + f2(size * 0.17) + "," + f2(size * 0.17) + " 0 1 1 0.01,0 Z M" + f2(cx - size * 0.24) + "," + f2(cy + size * 0.5) + " L" + f2(cx - size * 0.26) + "," + f2(cy - size * 0.02) + " C" + f2(cx - size * 0.26) + "," + f2(cy - size * 0.16) + " " + f2(cx + size * 0.26) + "," + f2(cy - size * 0.16) + " " + f2(cx + size * 0.26) + "," + f2(cy - size * 0.02) + " L" + f2(cx + size * 0.24) + "," + f2(cy + size * 0.5) + "Z" }, inner);
      } else e = S("circle", { cx: f2(cx), cy: f2(cy), r: f2(size / 2) }, inner);
      var isHi = i < (opts.filled || 0);
      e.style.fill = isHi ? hiC : base;
      e.__reg = reg(ctx, e, "fill", pair(isHi ? (opts.fillColor || "red") : (opts.color || "ink")));
      cells.push(e);
    }
    var api = { el: g, cells: cells, width: cols * (size + gap) - gap, height: Math.ceil(n / cols) * (size + gap) - gap,
      in: function (tl, t, stagger) { var rows = []; cells.forEach(function (c, i) { var r = Math.floor(i / cols); (rows[r] = rows[r] || []).push(c); }); rows.forEach(function (r, i) { tl.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, t + i * (stagger || 0.05)); }); return api; },
      // recolour cells [from, to) — e.g. the survivors — or fade the rest
      fill: function (tl, t, from, to, color, stagger) { // call before any later Kit.themeFlip in your script
        var th = ctx.theme, pr = pair(color || "red");
        cells.slice(from, to).forEach(function (e, i) { tl.to(e, { fill: pr[th], duration: 0.25 }, t + i * (stagger == null ? 0.01 : stagger)); e.__reg.p = pr; }); return api; },
      dimRange: function (tl, t, from, to, op) { tl.to(cells.slice(from, to), { opacity: op == null ? 0.18 : op, duration: 0.5, ease: "power1.inOut", stagger: 0.004 }, t); return api; } };
    return api;
  }
  function bar(root, data, opts) {
    opts = opts || {};
    var parent = opts.svg || svgOf(root, "top"), ctx = ctxOf(parent), theme = themeOf(ctx, opts);
    var x = opts.x || 0, y = opts.y || 0, w = opts.w || 600, bh = opts.barHeight || 34, gap = opts.gap || 22, labW = opts.labelWidth || 180;
    var max = opts.max || Math.max.apply(null, data.map(function (d) { return d.value; })), fmt = makeFormat(opts.format || "int", opts);
    var g = S("g", { class: "kit-bars", transform: "translate(" + x + "," + y + ")" }, parent), bars = [];
    var fillG = S("g", { filter: fid(ctx, "piece") }, g);
    data.forEach(function (d, i) {
      var yy = i * (bh + gap), bw = (w - labW - 90) * d.value / max;
      var lt = S("text", { x: labW - 16, y: yy + bh * 0.68, "text-anchor": "end", class: "kit-label kit-label-mono kit-mono", "font-size": 18 }, g); lt.textContent = String(d.label).toUpperCase();
      lt.style.fill = tok("ink", theme); reg(ctx, lt, "fill", pair("ink"));
      var r = S("rect", { x: labW, y: yy, width: f2(Math.max(1, bw)), height: bh, fill: paperFill(ctx, tok(d.color || (opts.highlight === i ? "red" : (opts.color || "blue")), theme)) }, fillG);
      var vt = S("text", { x: labW + bw + 12, y: yy + bh * 0.72, class: "kit-label kit-label-serif", "font-size": 26, "font-weight": 700 }, g); vt.textContent = d.text || fmt(d.value);
      vt.style.fill = tok("ink", theme); reg(ctx, vt, "fill", pair("ink"));
      bars.push({ rect: r, label: lt, value: vt, x0: labW, y0: yy });
    });
    var api = { el: g, bars: bars,
      grow: function (tl, t, stagger) { bars.forEach(function (b, i) { tl.fromTo(b.rect, { scaleX: 0, svgOrigin: b.x0 + " " + b.y0 }, { scaleX: 1, svgOrigin: b.x0 + " " + b.y0, duration: 0.9, ease: "power2.out" }, t + i * (stagger || 0.08)); tl.fromTo([b.label, b.value], { opacity: 0 }, { opacity: 1, duration: 0.3 }, t + i * (stagger || 0.08)); }); return api; } };
    api.in = api.grow;
    return api;
  }

  // ---------------------------------------------------------------- places & routes for episode 1 (lon, lat)
  var places = {
    banda: [129.9, -4.53], neira: [129.899, -4.527], run: [129.69, -4.55], ai: [129.77, -4.53], ambon: [128.18, -3.7], ternate: [127.38, 0.79],
    makassar: [119.42, -5.14], batavia: [106.82, -6.13], malacca: [102.25, 2.2], aceh: [95.32, 5.55], galle: [80.22, 6.03], calicut: [75.78, 11.25],
    goa: [73.83, 15.5], hormuz: [56.45, 27.1], aden: [45.03, 12.78], mocha: [43.25, 13.32], jeddah: [39.17, 21.5], suez: [32.55, 29.97], cairo: [31.24, 30.04],
    alexandria: [29.92, 31.2], venice: [12.33, 45.44], lisbon: [-9.14, 38.72], amsterdam: [4.9, 52.37], london: [-0.12, 51.5], breda: [4.78, 51.59],
    capeOfGoodHope: [18.47, -34.36], newAmsterdam: [-74.01, 40.705], manhattan: [-73.97, 40.78]
  };
  var routes = {
    // the old spice road by sea and caravan: Banda → Malacca → Calicut → Aden → Red Sea → Cairo → Alexandria → Venice
    bandaVenice: [[129.9, -4.53], [126, -6.2], [120.5, -7.0], [113, -5.4], [107.5, -3.4], [104.6, 1.0], [102.25, 2.2], [98.6, 4.6], [94.6, 6.4], [86, 5.2], [80.6, 5.4], [77.6, 7.3], [75.78, 11.25], [66, 13.4], [52, 13.2], [45.03, 12.78], [42.2, 14.8], [38.2, 21], [34.3, 27.4], [32.55, 29.97], [31.24, 30.04], [29.92, 31.2], [25, 34.1], [20.6, 36.9], [18.8, 40.3], [15.4, 43.1], [12.33, 45.44]],
    // the VOC Cape route: Banda → Batavia → Cape of Good Hope → Amsterdam
    bandaAmsterdam: [[129.9, -4.53], [120.5, -7.0], [106.82, -6.13], [104.5, -7.5], [80, -25], [40, -37], [18.47, -35.2], [8, -20], [-12, 0], [-24, 20], [-18, 36], [-10, 44], [-6, 49], [3.5, 52.6], [4.9, 52.37]]
  };

  // ================================================================ v2 (2026-11-17): chrome, flags, VOC logo, figures, portraits, price climb, scroll, exit
  function stageOf(target) {
    if (!target) return CUR && CUR.el ? CUR.el.__stage : null;
    if (target.__stage) return target.__stage;
    if (target.el && target.el.__stage) return target.el.__stage;
    if (target.g && target.g.nodeType) target = target.g;
    var n = target; while (n && n.nodeType) { if (n.__stage) return n.__stage; n = n.parentNode; }
    var q = target && target.querySelector && target.querySelector(".kit-stage");
    return q ? q.__stage : (CUR && CUR.el ? CUR.el.__stage : null);
  }
  var NUID = 0;
  function uid(ctx, k) { return ctx.id + "-" + k + (++NUID); }

  // ---------------------------------------------------------------- chrome: date (top-left)
  function dateLabel(target, text, opts) {
    opts = opts || {};
    var st = stageOf(target), ctx = st ? st.ctx : ctxOf(target);
    if (st && st.date) { st.date.setNow(text); return st.date; }
    var el = D("div", "kit-date", st ? st.chrome : layerOf(target));
    if (opts.x != null) el.style.left = opts.x + "px";
    if (opts.y != null) el.style.top = opts.y + "px";
    var api = { el: el, cur: null, text: text };
    function mk(tx) {
      var s = D("div", "kit-date-text", el); s.textContent = tx;
      s.style.color = tok("ink", ctx.theme); reg(ctx, s, "color", pair("ink"));
      s.setAttribute("data-layout-allow-overlap", "");
      return s;
    }
    api.cur = mk(text == null ? "" : String(text));
    api.setNow = function (tx) { api.cur.textContent = tx; api.text = tx; return api; };
    api.set = function (tl, t, tx, dur) {
      dur = dur || 0.6;
      var old = api.cur, nw = mk(String(tx)); nw.style.opacity = 0;
      tl.fromTo(old, { opacity: 1, y: 0 }, { opacity: 0, y: -5, duration: dur, ease: "power1.inOut", immediateRender: false }, t);
      tl.fromTo(nw, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: dur, ease: "power1.inOut", immediateRender: false }, t + dur * 0.3);
      api.cur = nw; api.text = tx; return api;
    };
    if (st) st.date = api;
    return api;
  }
  function setDate(tl, t, text, target) {
    var st = stageOf(target);
    var d = st && st.date ? st.date : dateLabel(st || target, "");
    d.set(tl, t, text);
    return d;
  }

  // ---------------------------------------------------------------- chrome: reason icons (top-right)
  var REASONS = [{ icon: "nutmeg", label: "THE SEED" }, { icon: "route", label: "THE ROUTE" }, { icon: "voc", label: "THE COMPANY" },
    { icon: "fort", label: "THE ISLAND" }, { icon: "scroll", label: "THE TREATY" }];
  var ICONS = {
    nutmeg: function () { return [{ group: CUT.nutmegFruit(), transform: "translate(0,6) scale(0.37)" }]; },
    seed: function () { return [{ group: CUT.nutmegSeed(), transform: "scale(0.55)" }]; },
    route: function () {
      return [{ d: "M-44,36 C-26,26 -10,42 8,33 C22,26 34,30 46,24", stroke: "red", sw: 4, dash: "7 6", flat: true },
        { group: VEH.dhow(), transform: "translate(-2,22) scale(0.36)" }];
    },
    voc: function () { return [{ group: vocMonoPieces("ink"), transform: "translate(0,6) scale(0.42)" }]; },
    fort: function () { return [{ group: CUT.fort(), transform: "translate(0,-2) scale(0.44)" }]; },
    scroll: function () { return [{ group: CUT.treatyScroll(), transform: "scale(0.39)" }]; }
  };
  ICONS.dhow = ICONS.route; ICONS.company = ICONS.voc; ICONS.treaty = ICONS.scroll; ICONS.siege = ICONS.fort; ICONS.island = ICONS.fort;
  function iconPieces(icon) {
    if (typeof icon === "function") return icon();
    if (ICONS[icon]) return ICONS[icon]();
    if (CUT[icon]) return [{ group: CUT[icon]({}), transform: "scale(0.4)" }];
    if (VEH[icon]) return [{ group: VEH[icon]({}), transform: "translate(0,20) scale(0.36)" }];
    throw new Error("Kit.reasonBar: unknown icon '" + icon + "'. Known: " + Object.keys(ICONS).join(", ") + ", or any cutout/vehicle name");
  }
  var TILE = 70, TGAP = 12, RB_MUTE = "#E1D8C2";
  function reasonBar(target, reasons, active, opts) {
    opts = opts || {};
    var st = stageOf(target), ctx = st ? st.ctx : ctxOf(target), host = st ? st.chrome : layerOf(target);
    reasons = (reasons || REASONS).map(function (r) { return typeof r === "string" ? { icon: r, label: r } : r; });
    if (active == null) active = 0;
    var bar = D("div", "kit-reasons", host), row = D("div", "kit-reason-row", bar), labs = D("div", "kit-reason-labels", bar);
    var tex = makeTexture("fibre"), items = [], n = reasons.length, rowW = n * TILE + (n - 1) * TGAP;
    labs.style.width = rowW + "px";
    reasons.forEach(function (r, i) {
      var tile = D("div", "kit-reason", row);
      var sheet = D("div", "kit-reason-sheet", tile, { backgroundImage: "url(" + tex.url + ")", filter: fid(ctx, "cut") });
      var rim = D("div", "kit-reason-rim", tile);
      var svg = S("svg", { class: "kit-reason-icon", width: TILE, height: TILE, viewBox: "-56 -56 112 112" }, tile);
      art(ctx, svg, iconPieces(r.icon));
      var lab = D("div", "kit-reason-label kit-mono", labs), txt = String(r.label || "").toUpperCase();
      lab.textContent = txt; lab.setAttribute("data-layout-allow-overlap", "");
      var w = txt.length * 15 * 0.78, cx = i * (TILE + TGAP) + TILE / 2, left = Math.min(cx - w / 2, rowW - w);
      lab.style.left = f2(left) + "px"; lab.style.width = f2(w) + "px";
      lab.style.color = tok("ink", ctx.theme); reg(ctx, lab, "color", pair("ink"));
      var on = i === active;
      gsap.set(tile, { y: on ? -6 : 0 });
      sheet.style.backgroundColor = on ? C.ivory : RB_MUTE; rim.style.opacity = on ? 1 : 0;
      svg.style.filter = on ? "grayscale(0) opacity(1)" : "grayscale(1) opacity(0.42)";
      lab.style.opacity = on ? 1 : 0;
      items.push({ el: tile, sheet: sheet, rim: rim, icon: svg, label: lab });
    });
    function off(tl, t, it) {
      tl.to(it.el, { y: 0, duration: 0.35, ease: "power2.out" }, t); tl.to(it.rim, { opacity: 0, duration: 0.25 }, t);
      tl.to(it.sheet, { backgroundColor: RB_MUTE, duration: 0.3 }, t); tl.to(it.icon, { filter: "grayscale(1) opacity(0.42)", duration: 0.3 }, t);
      tl.to(it.label, { opacity: 0, y: -4, duration: 0.25, ease: "power1.in" }, t);
    }
    function on(tl, t, it) {
      tl.to(it.el, { y: -6, duration: 0.45, ease: "back.out(1.3)" }, t); tl.to(it.rim, { opacity: 1, duration: 0.25 }, t);
      tl.to(it.sheet, { backgroundColor: C.ivory, duration: 0.3 }, t); tl.to(it.icon, { filter: "grayscale(0) opacity(1)", duration: 0.3 }, t);
      tl.fromTo(it.label, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t + 0.12);
    }
    var api = { el: bar, items: items, tabs: items, active: active,
      set: function (tl, t, i) {
        if (i === api.active) return api;
        if (api.active != null && api.active >= 0 && items[api.active]) off(tl, t, items[api.active]);
        if (i != null && i >= 0 && items[i]) on(tl, t + 0.05, items[i]);
        api.active = i; return api;
      } };
    api.setActive = api.set; // v1 chapterTabs compatibility
    if (st) { st.reasons = api; st.tabs = api; }
    return api;
  }
  function setReason(tl, t, index, target) {
    var st = stageOf(target);
    if (!st || !st.reasons) throw new Error("Kit.setReason: no reason bar in this scene (Kit.stage draws one unless tabs/chrome are off)");
    return st.reasons.set(tl, t, index);
  }

  // ---------------------------------------------------------------- geometry helpers for warped cloth
  function clipRect(pts, x0, y0, x1, y1) {
    function edge(p, inside, inter) {
      var out = [];
      for (var i = 0; i < p.length; i++) {
        var cur = p[i], prev = p[(i + p.length - 1) % p.length];
        if (inside(cur)) { if (!inside(prev)) out.push(inter(prev, cur)); out.push(cur); }
        else if (inside(prev)) out.push(inter(prev, cur));
      }
      return out;
    }
    function ix(c) { return function (a, b) { var t = (c - a[0]) / (b[0] - a[0]); return [c, a[1] + t * (b[1] - a[1])]; }; }
    function iy(c) { return function (a, b) { var t = (c - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), c]; }; }
    var p = edge(pts, function (q) { return q[0] >= x0; }, ix(x0));
    p = edge(p, function (q) { return q[0] <= x1; }, ix(x1));
    p = edge(p, function (q) { return q[1] >= y0; }, iy(y0));
    return edge(p, function (q) { return q[1] <= y1; }, iy(y1));
  }
  function densify(pts, step, closed) {
    var out = [], n = pts.length, m = closed ? n : n - 1;
    for (var i = 0; i < m; i++) {
      var a = pts[i], b = pts[(i + 1) % n], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
      for (var j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
  }
  function rectP(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }
  function stripP(a, b, o0, o1, ext) { // band along a→b between perpendicular offsets o0..o1 (normal = (dy,-dx))
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = uy, ny = -ux, e = ext || 0;
    var a2 = [a[0] - ux * e, a[1] - uy * e], b2 = [b[0] + ux * e, b[1] + uy * e];
    return [[a2[0] + nx * o0, a2[1] + ny * o0], [b2[0] + nx * o0, b2[1] + ny * o0], [b2[0] + nx * o1, b2[1] + ny * o1], [a2[0] + nx * o1, a2[1] + ny * o1]];
  }
  function circP(cx, cy, rx, ry, n, a0) { var o = []; n = n || 36; for (var i = 0; i < n; i++) { var a = (a0 || 0) + i / n * Math.PI * 2; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * (ry || rx)]); } return o; }
  function arcP(cx, cy, r, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o; }
  function starP(cx, cy, R, rot) { var o = [], r = R * 0.4; for (var i = 0; i < 10; i++) { var a = ((rot == null ? -90 : rot) + i * 36) * Math.PI / 180, rr = i % 2 ? r : R; o.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return o; }
  function xf(pts, cx, cy, s, rotDeg) { var c = Math.cos((rotDeg || 0) * Math.PI / 180), sn = Math.sin((rotDeg || 0) * Math.PI / 180); return pts.map(function (p) { var x = p[0] * s, y = p[1] * s; return [cx + x * c - y * sn, cy + x * sn + y * c]; }); }
  // VOC monogram as polylines in a 200 box (V arms, O on the left arm, C on the right arm, A above)
  function vocMonoLines(chamber) {
    var L = [
      { k: "V", pts: [[-62, -58], [0, 62], [62, -58]], sw: 15 },
      { k: "O", pts: arcP(-31, 2, 23, -90, 270, 40), sw: 9 },
      { k: "C", pts: arcP(31, 2, 23, 45, 315, 34), sw: 9 }
    ];
    if (chamber) L.push({ k: "A", pts: [[-12, -62], [0, -92], [12, -62]], sw: 6 }, { k: "Abar", pts: [[-6.5, -74], [6.5, -74]], sw: 4.5 });
    return L;
  }
  function vocMonoPieces(color) {
    return vocMonoLines("A").map(function (l) { return { d: pathFromPts(l.pts, false), stroke: color || "ink", sw: l.sw, flat: true }; });
  }
  function fleurP() { // stylised fleur-de-lis, unit size ~2 tall, centred at 0,0: [polygons]
    var c = smoothClosed([[0, -1], [0.2, -0.62], [0.17, -0.18], [0, 0.04], [-0.17, -0.18], [-0.2, -0.62]], 5);
    var r = smoothClosed([[0.1, -0.02], [0.26, -0.42], [0.56, -0.58], [0.78, -0.4], [0.6, -0.4], [0.44, -0.2], [0.34, 0.06]], 5);
    var l = r.map(function (p) { return [-p[0], p[1]]; });
    var band = rectP(-0.42, 0.04, 0.42, 0.17);
    var foot = smoothClosed([[0, 0.17], [0.12, 0.4], [0.3, 0.62], [0.08, 0.56], [0, 0.72], [-0.08, 0.56], [-0.3, 0.62], [-0.12, 0.4]], 4);
    return [c, r, l, band, foot];
  }

  // ---------------------------------------------------------------- flags (flag units: hoist at x=0, top at y=0)
  var FLAGDEF = {
    england1616: function () {
      var W = 50, H = 30; return { W: W, H: H, shapes: [[rectP(0, 0, W, H), C.white], [rectP(W / 2 - 3, 0, W / 2 + 3, H), "#B8322A"], [rectP(0, H / 2 - 3, W, H / 2 + 3), "#B8322A"]] };
    },
    union1606: function () {
      var W = 50, H = 30, blue = "#22396A", red = "#B8322A", s = [[rectP(0, 0, W, H), blue]];
      s.push([stripP([0, 0], [W, H], -3, 3, 4), C.white], [stripP([0, H], [W, 0], -3, 3, 4), C.white]);
      s.push([rectP(W / 2 - 5, 0, W / 2 + 5, H), C.white], [rectP(0, H / 2 - 5, W, H / 2 + 5), C.white]);
      s.push([rectP(W / 2 - 3, 0, W / 2 + 3, H), red], [rectP(0, H / 2 - 3, W, H / 2 + 3), red]);
      return { W: W, H: H, shapes: s };
    },
    britain1801: function () {
      var W = 60, H = 30, blue = "#22396A", red = "#B8322A", c = [W / 2, H / 2], s = [[rectP(0, 0, W, H), blue]];
      s.push([stripP([0, 0], [W, H], -3, 3, 4), C.white], [stripP([0, H], [W, 0], -3, 3, 4), C.white]);
      [[0, 0], [W, 0], [W, H], [0, H]].forEach(function (k) { s.push([stripP(c, k, 0, 2, 4), red]); }); // counterchanged (pinwheel) red saltire
      s.push([rectP(W / 2 - 5, 0, W / 2 + 5, H), C.white], [rectP(0, H / 2 - 5, W, H / 2 + 5), C.white]);
      s.push([rectP(W / 2 - 3, 0, W / 2 + 3, H), red], [rectP(0, H / 2 - 3, W, H / 2 + 3), red]);
      return { W: W, H: H, shapes: s };
    },
    prinsenvlag: function () {
      // plain Dutch "prince's flag" (orange-white-blue, no monogram): Dutch colonies outside the VOC, e.g. the West
      // India Company's New Netherland (r4 owner-review fix: 1626 Manhattan must not fly the VOC monogram)
      var W = 45, H = 30;
      return { W: W, H: H, shapes: [[rectP(0, 0, W, H / 3), C.orange], [rectP(0, H / 3, W, 2 * H / 3), C.white], [rectP(0, 2 * H / 3, W, H), "#2B4C7E"]] };
    },
    voc: function (o) {
      // mirrorCharge: the monogram is pre-reflected so it reads correctly on a flag drawn with scale(-1,1)
      var W = 45, H = 30, k = 0.062, lines = vocMonoLines(false).map(function (l) { var pts = xf(l.pts, W / 2, H / 2 + 0.3, k); if (o && o.mirrorCharge) pts = pts.map(function (q) { return [W - q[0], q[1]]; }); return { pts: pts, sw: l.sw * k, color: "#1E2A3A" }; });
      return { W: W, H: H, shapes: [[rectP(0, 0, W, H / 3), C.orange], [rectP(0, H / 3, W, 2 * H / 3), C.white], [rectP(0, 2 * H / 3, W, H), "#2B4C7E"]], lines: lines };
    },
    dutchRepublic: function () {
      var W = 45, H = 30; return { W: W, H: H, shapes: [[rectP(0, 0, W, H / 3), "#AE2B27"], [rectP(0, H / 3, W, 2 * H / 3), C.white], [rectP(0, 2 * H / 3, W, H), "#21468B"]] };
    },
    franceRoyal: function (o) {
      var W = 45, H = 30, s = [[rectP(0, 0, W, H), "#F1ECDF"]];
      if (o && (o.lis || o.fleurs)) {
        for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
          var x = 4 + c * 7.6 + (r % 2 ? 3.8 : 0), y = 4 + r * 7.4; if (x > W - 2) continue;
          fleurP().forEach(function (p) { s.push([xf(p, x, y, 2.3), "#C9962E"]); });
        }
      }
      return { W: W, H: H, shapes: s };
    },
    grenada: function () {
      var W = 50, H = 30, b = 4.4, red = "#C8202F", yel = "#F2C230", grn = "#1F7A4A", cx = W / 2, cy = H / 2;
      var s = [[rectP(0, 0, W, H), red]];
      s.push([[[b, b], [W - b, b], [cx, cy]], yel], [[[b, H - b], [W - b, H - b], [cx, cy]], yel]);
      s.push([[[b, b], [cx, cy], [b, H - b]], grn], [[[W - b, b], [W - b, H - b], [cx, cy]], grn]);
      s.push([circP(cx, cy, 4.6, 4.6, 40), red], [starP(cx, cy, 3.3), yel]);
      [cx - 13, cx, cx + 13].forEach(function (x) { s.push([starP(x, b / 2, 1.85), yel], [starP(x, H - b / 2, 1.85), yel]); });
      var nx = b + (cx - b) * 0.36, ny = cy; // the nutmeg in the hoist triangle
      s.push([xf(circP(0, 0, 1.9, 2.9, 28), nx, ny, 1, -28), yel], [xf(circP(0.35, 0.2, 1.15, 2.0, 24), nx, ny, 1, -28), red]);
      s.push([xf([[-0.4, -2.6], [0.2, -3.6], [0.5, -3.3], [0, -2.4]], nx, ny, 1, -28), yel]);
      return { W: W, H: H, shapes: s };
    }
  };
  FLAGDEF.england = FLAGDEF.england1616; FLAGDEF.unionJack = FLAGDEF.britain1801; FLAGDEF.prinsenvlag = FLAGDEF.voc;
  // builds the cloth (+pole) into parent, in flag units scaled by sc; returns {g, render(phase)}
  function buildFlag(ctx, parent, type, o) {
    if (!FLAGDEF[type]) throw new Error("Kit.flag: unknown type '" + type + "'. Known: " + Object.keys(FLAGDEF).join(", "));
    var def = FLAGDEF[type](o), FW = def.W, FH = def.H, step = FW / 26;
    var g = S("g", { class: "kit-flag kit-flag-" + type }, parent);
    var poleLen = (o.pole == null ? 2.6 : o.pole) * FH, pw = o.poleWidth || 1.5;
    if (poleLen > 0) {
      var pole = S("g", { filter: fid(ctx, "pinlift") }, g);
      S("path", { d: "M" + (-pw) + ",-1 L0,-1 L0," + f2(poleLen) + " L" + (-pw) + "," + f2(poleLen) + "Z", fill: "#5A3E28" }, pole);
      S("path", { d: "M" + f2(-pw * 0.72) + ",-1 L" + f2(-pw * 0.5) + ",-1 L" + f2(-pw * 0.5) + "," + f2(poleLen) + " L" + f2(-pw * 0.72) + "," + f2(poleLen) + "Z", fill: "#8A6644" }, pole);
      S("circle", { cx: -pw / 2, cy: -1.6 - pw * 0.4, r: pw * 0.95, fill: C.gold }, pole);
    }
    var cloth = S("g", { filter: o.paper === false ? null : fid(ctx, "piece") }, g);
    var shapes = def.shapes.map(function (s) {
      var pts = densify(clipRect(s[0], 0, 0, FW, FH), step, true);
      return { pts: pts, el: S("path", { fill: paperFill(ctx, s[1]) }, cloth) };
    });
    var lines = (def.lines || []).map(function (l) {
      return { pts: densify(l.pts, step * 0.5, false), el: S("path", { fill: "none", stroke: l.color, "stroke-width": f2(l.sw), "stroke-linecap": "round", "stroke-linejoin": "round" }, cloth) };
    });
    var gid = uid(ctx, "fshade"), grad = S("linearGradient", { id: gid, gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: FW, y2: 0 }, ctx.defs), NS_ = 24, stops = [];
    for (var i = 0; i <= NS_; i++) stops.push({ u: i / NS_, el: S("stop", { offset: f2(i / NS_), "stop-color": C.shadow, "stop-opacity": 0 }, grad) });
    var shade = { pts: densify(rectP(0, 0, FW, FH), step, true), el: S("path", { fill: "url(#" + gid + ")" }, cloth) };
    var A = FH * 0.085 * (o.amp == null ? 1 : o.amp), K = 1.1;
    function dyAt(u, ph) { return A * Math.pow(u, 0.9) * (Math.sin(2 * Math.PI * (K * u - ph)) + 0.28 * Math.sin(2 * Math.PI * (2.1 * u - 1.6 * ph) + 1)); }
    function warp(p, ph) {
      var u = p[0] / FW, c = Math.cos(2 * Math.PI * (K * u - ph));
      return [p[0] - A * 0.22 * u * (1 - c), p[1] + dyAt(u, ph) + A * 0.18 * u * (p[1] / FH)];
    }
    function render(ph) {
      var d = function (pts, closed) { return pts.map(function (p, i) { var q = warp(p, ph); return (i ? "L" : "M") + f2(q[0]) + "," + f2(q[1]); }).join("") + (closed ? "Z" : ""); };
      shapes.forEach(function (s) { s.el.setAttribute("d", d(s.pts, true)); });
      lines.forEach(function (l) { l.el.setAttribute("d", d(l.pts, false)); });
      shade.el.setAttribute("d", d(shade.pts, true));
      stops.forEach(function (sp) {
        var u = sp.u, slope = (dyAt(u + 0.02, ph) - dyAt(u - 0.02, ph)) / (0.04 * FW);
        sp.el.setAttribute("stop-color", slope > 0 ? C.shadow : "#FFFDF6");
        sp.el.setAttribute("stop-opacity", f2(Math.min(slope > 0 ? 0.16 : 0.22, Math.abs(slope) * 0.6)));
      });
    }
    render(o.phase || 0);
    return { g: g, render: render, W: FW, H: FH, phase: o.phase || 0 };
  }
  function waveFlagObj(f, tl, t, dur, speed) {
    var p0 = f.phase, sp = speed || f.speed || 0.55, proxy = { s: 0 };
    tl.fromTo(proxy, { s: 0 }, { s: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: function () { f.render(p0 + proxy.s * sp); } }, t);
    f.phase = p0 + dur * sp;
    f.waved = true;
    return proxy;
  }
  function flag(target, type, opts) {
    opts = opts || {};
    var parent = target.namespaceURI === NS ? target : svgOf(target, "top"), ctx = ctxOf(parent);
    var probe = FLAGDEF[type] ? FLAGDEF[type](opts) : null;
    if (!probe) throw new Error("Kit.flag: unknown type '" + type + "'. Known: " + Object.keys(FLAGDEF).join(", "));
    var sc = (opts.w || 240) / probe.W;
    var o = makeCutoutObject(ctx, parent, [], Object.assign({}, opts, { scale: sc, size: null, label: null }), "flag-" + type);
    if (opts.label) {
      var ly = (opts.y || 0) + (opts.labelDy || (probe.H * sc * (Math.max(1, opts.pole == null ? 2.6 : opts.pole) + 0.15) + 30));
      o.label = label(parent, [(opts.x || 0) + probe.W * sc / 2, ly], opts.label, Object.assign({ anchor: "middle", halo: false }, opts.labelOpts || {}));
      o.body.__label = o.label;
    }
    var f = buildFlag(ctx, o.art, type, Object.assign({ phase: (hashStr(type + (opts.x || 0)) % 100) / 100 }, opts));
    o.flag = f; o.type = type; o.speed = opts.speed;
    o.render = f.render;
    o.wave = function (tl, t, dur, speed) { waveFlagObj(f, tl, t, dur, speed || opts.speed); return o; };
    if (opts.wave !== false) { ctx.flags = ctx.flags || []; ctx.flags.push(f); }
    if (opts.wave !== false && opts.tl) o.wave(opts.tl, opts.at || 0, opts.dur || 10);
    return o;
  }
  // waves every flag (and figure pennant) created so far in the scene that has not been waved yet
  function waveFlags(tl, t, dur, target) {
    var st = stageOf(target), ctx = st ? st.ctx : CUR;
    (ctx && ctx.flags || []).forEach(function (f) { if (!f.waved) waveFlagObj(f, tl, t, dur); });
    return tl;
  }

  // ---------------------------------------------------------------- VOC logo (Amsterdam chamber)
  function vocLogo(target, opts) {
    opts = opts || {};
    var parent = target.namespaceURI === NS ? target : svgOf(target, "top"), ctx = ctxOf(parent);
    var size = opts.size || 300, sc = size / 260, x = opts.x || 960, y = opts.y || 540;
    var ink = opts.color === "gold" ? "#B07F2A" : (opts.color && opts.color !== "ink" ? tok(opts.color) : "#1E2A3A");
    var outer = S("g", { class: "kit-voc-logo", transform: "translate(" + x + "," + y + ") scale(" + f2(sc) + ")" }, parent);
    var body = S("g", null, outer);
    var api = { el: outer, body: body, x: x, y: y, scale: sc, flags: [], strokes: [] };
    if (opts.flags !== false) {
      // owner note r2 3a-5: the two flags are exact mirror images about the logo's vertical centre line
      // (same phase, the right one is the left one reflected), so they wave in mirror.
      // owner note r3: each flag flipped 180° about its own vertical axis, so the cloths fly AWAY from each other
      // (outward from the centre); poles moved in to ±120 so the logo stays compact. The left flag is the reflected
      // one now, so it carries the pre-reflected monogram.
      ["translate(-120,-232) rotate(-9) scale(-1,1)", "translate(120,-232) rotate(9)"].forEach(function (tr, i) {
        var fg = S("g", { transform: tr }, body), rise = S("g", null, fg);
        var fo = buildFlag(ctx, S("g", { filter: fid(ctx, "lift") }, rise), "voc", { phase: 0, pole: 3.4, mirrorCharge: i === 0 });
        fo.g.setAttribute("transform", "scale(" + f2(150 / fo.W) + ")");
        api.flags.push({ el: rise, flag: fo });
      });
    }
    var seal = S("g", { class: "kit-voc-seal", filter: fid(ctx, "cut") }, body), lobes = [];
    for (var i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2, r = 132 + (i % 2 ? -5 : 0) + (hash2(41, i) - 0.5) * 2; lobes.push([Math.cos(a) * r, Math.sin(a) * r]); }
    S("path", { d: pathFromPts(smoothClosed(lobes, 2), true), fill: paperFill(ctx, opts.sealColor || C.parchment) }, seal);
    var sealInk = S("g", { opacity: 0.55 }, seal);
    S("circle", { r: 118, fill: "none", stroke: ink, "stroke-width": 2.2 }, sealInk);
    S("circle", { r: 111, fill: "none", stroke: ink, "stroke-width": 1, "stroke-dasharray": "1.5 4.5", "stroke-linecap": "round" }, sealInk);
    api.seal = seal;
    var mono = S("g", { class: "kit-voc-mono", filter: fid(ctx, "piece") }, body), casing = opts.casing || C.parchment;
    var lines = vocMonoLines(opts.chamber === false ? null : (opts.chamber || "A"));
    lines.forEach(function (l) {
      var d = pathFromPts(l.pts, false);
      var cas = S("path", { d: d, fill: "none", stroke: casing, "stroke-width": l.sw + 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, mono);
      var p = S("path", { d: d, fill: "none", stroke: ink, "stroke-width": l.sw, "stroke-linecap": l.k === "V" ? "butt" : "round", "stroke-linejoin": "miter" }, mono);
      api.strokes.push({ k: l.k, els: [cas, p] });
      if (l.k === "V") { // serifs on the V
        var sf = S("path", { d: "M-76,-58 L-48,-58 M48,-58 L76,-58", fill: "none", stroke: ink, "stroke-width": 5, "stroke-linecap": "round" }, mono);
        api.strokes[api.strokes.length - 1].els.push(sf);
      }
    });
    // interlace: the V passes back over the O (lower crossing) and the C (upper crossing)
    var clipId = uid(ctx, "vocx"), cp = S("clipPath", { id: clipId }, ctx.defs);
    S("rect", { x: -13, y: -24, width: 26, height: 48, transform: "translate(-20.4,22.4) rotate(-27.3)" }, cp);
    S("rect", { x: -13, y: -24, width: 26, height: 48, transform: "translate(41.6,-18.4) rotate(27.3)" }, cp);
    var over = S("g", { "clip-path": "url(#" + clipId + ")" }, mono), vd = pathFromPts(lines[0].pts, false);
    var oc = S("path", { d: vd, fill: "none", stroke: casing, "stroke-width": lines[0].sw + 7 }, over), ov = S("path", { d: vd, fill: "none", stroke: ink, "stroke-width": lines[0].sw }, over);
    api.strokes[0].els.push(oc, ov);
    api.mono = mono;
    if (opts.label) api.label = label(parent, [x, y + 150 * sc], opts.label, Object.assign({ anchor: "middle", halo: false }, opts.labelOpts || {}));
    api.in = function (tl, t, o2) { return vocReveal(tl, t, api, o2); };
    api.wave = function (tl, t, dur) { api.flags.forEach(function (f) { waveFlagObj(f.flag, tl, t, dur); }); return api; };
    api.out = function (tl, t) { exit(tl, t, api); return api; };
    return api;
  }
  // strokes draw on like ink → a paper seal stamps behind → two VOC flags rise behind it and wave
  function vocReveal(tl, t, logo, opts) {
    opts = opts || {};
    var sp = opts.speed || 1, k = function (s) { return t + s / sp; };
    var timing = { V: [0, 0.75], O: [0.55, 0.5], C: [0.8, 0.5], A: [1.15, 0.3], Abar: [1.38, 0.15] };
    logo.strokes.forEach(function (s) {
      var tm = timing[s.k] || [0, 0.5];
      s.els.forEach(function (el) {
        var L = el.getTotalLength ? el.getTotalLength() : 400;
        el.setAttribute("stroke-dasharray", f2(L + 2) + " " + f2(L + 2));
        tl.fromTo(el, { attr: { "stroke-dashoffset": L + 2 } }, { attr: { "stroke-dashoffset": 0 }, duration: tm[1] / sp, ease: "power2.inOut", immediateRender: true }, k(tm[0]));
      });
    });
    var ts = k(1.6);
    tl.fromTo(logo.seal, { scale: 1.28, opacity: 0, rotation: -6, svgOrigin: "0 0" }, { scale: 0.97, opacity: 1, rotation: 0, duration: 0.16, ease: "power3.in", svgOrigin: "0 0", immediateRender: true }, ts);
    tl.to(logo.seal, { scale: 1, duration: 0.16, ease: "power2.out", svgOrigin: "0 0" }, ts + 0.16);
    tl.fromTo(logo.mono, { y: 0 }, { y: 3, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1, immediateRender: false }, ts + 0.14);
    var tf = k(2.0), hold = opts.hold == null ? 6 : opts.hold;
    logo.flags.forEach(function (f, i) {
      tl.fromTo(f.el, { y: 190, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.1)", immediateRender: true }, tf);
      if (hold > 0) waveFlagObj(f.flag, tl, tf, hold);
    });
    if (logo.label) enter(tl, logo.label.el, ts + 0.3, "fadeUp");
    return tf + 0.86;
  }

  // ---------------------------------------------------------------- figures v2 (frontal paper puppets, feet at y=100, head ~ -68)
  function shadeHex(h, k) { var n = parseInt(h.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(function (v) { return Math.max(0, Math.min(255, Math.round(v * (1 + k)))); }); return "#" + c.map(function (v) { return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  var SKIN = { euro: "#E4C19C", islander: "#8E5C3D", east: "#D3A67C" };
  function figKinds(kind, o) {
    var red = "#A93A27", black = "#26221E";
    var leg = function (upper, lower, shoe, upperLen) { return { upper: upper, lower: lower, shoe: shoe, upperLen: upperLen == null ? 42 : upperLen }; };
    switch (kind) {
      case "englishman": return { skin: SKIN.euro, sleeve: red, cuff: C.white, leg: leg("#3B332B", "#8C836F", black),
        torso: [{ d: "M-24,-48 C-30,-44 -31,-30 -28,-10 L-35,46 C-12,50 12,50 35,46 L28,-10 C31,-30 30,-44 24,-48 C14,-52 -14,-52 -24,-48Z", fill: red },
          { d: "M0,-46 L0,46", stroke: "#7C2A1E", sw: 2.2 }, { d: "M-27,-2 L27,-2 L27,5 L-27,5Z", fill: "#4E3220" },
          { d: "M3,-38 h0.1 M3,-28 h0.1 M3,-18 h0.1 M3,-8 h0.1 M3,12 h0.1 M3,22 h0.1", stroke: C.gold, sw: 3.4 }],
        over: [{ d: "M-17,-51 L17,-51 L22,-37 C10,-32 -10,-32 -22,-37Z", fill: C.white }],
        hair: [{ d: "M-13,-70 C-15,-60 -14,-54 -11,-52 L-9,-66Z M13,-70 C15,-60 14,-54 11,-52 L9,-66Z", fill: "#4A3524" }],
        hat: [{ d: "M-14,-79 C-15,-91 -10,-97 0,-97 C10,-97 15,-91 14,-79Z", fill: "#2E2620" }, { ellipse: [0, -79, 33, 5.5], fill: "#2E2620" }, { d: "M-14,-84 L14,-84", stroke: "#6B5A44", sw: 2.5 }] };
      case "dutchman": return { skin: SKIN.euro, sleeve: black, cuff: C.white, leg: leg(black, black, black, 46), wideBreeches: true,
        torso: [{ d: "M-23,-48 C-29,-44 -30,-30 -27,-10 L-29,22 C-10,26 10,26 29,22 L27,-10 C30,-30 29,-44 23,-48 C14,-52 -14,-52 -23,-48Z", fill: black },
          { d: "M3,-34 h0.1 M3,-24 h0.1 M3,-14 h0.1 M3,-4 h0.1 M3,6 h0.1", stroke: "#6E6A62", sw: 3 }],
        over: [{ d: "M-29,-52 C-34,-44 -30,-35 -20,-33 L20,-33 C30,-35 34,-44 29,-52 C16,-57 -16,-57 -29,-52Z", fill: "#F4F0E6" }, { d: "M-16,-36 C-6,-40 6,-40 16,-36", stroke: "#CFC8B6", sw: 1.6 }],
        hair: [{ d: "M-13,-72 C-16,-60 -15,-54 -12,-50 L-10,-66Z M13,-72 C16,-60 15,-54 12,-50 L10,-66Z", fill: "#6A4E33" }],
        hat: [{ d: "M-12,-80 L-10,-114 C-6,-118 6,-118 10,-114 L12,-80Z", fill: black }, { ellipse: [0, -80, 23, 4.5], fill: black }, { d: "M-11.5,-86 L11.5,-86", stroke: "#57534C", sw: 2.4 }] };
      case "bandanese":
        if (o.variant === "female") return { skin: SKIN.islander, sleeve: null, leg: leg(SKIN.islander, SKIN.islander, SKIN.islander, 0), bare: true, feetOnly: true,
          kain: { d: "M-20,-36 C-22,-20 -24,-6 -22,8 C-25,40 -27,70 -27,97 L27,97 C27,70 25,40 22,8 C24,-6 22,-20 20,-36 C10,-39 -10,-39 -20,-36Z", base: "#9A6A3F", motif: "#4E3220", dots: "#E8D7AE", fold: "M6,-34 C2,10 4,60 10,97" },
          torso: [{ d: "M-21,-48 C-26,-44 -27,-38 -24,-34 L24,-34 C27,-38 26,-44 21,-48 C12,-52 -12,-52 -21,-48Z", fill: SKIN.islander }],
          over: [{ d: "M-24,-47 C-16,-40 -6,-20 4,6 L14,4 C4,-22 -8,-42 -14,-50Z", fill: "#3E4A5C" }, { d: "M-22,-44 C-14,-36 -5,-18 5,4", stroke: "#8EA0B4", sw: 1.4 }],
          hair: [{ d: "M-13,-66 C-15,-82 -8,-86 0,-86 C8,-86 15,-82 13,-66 C9,-74 -9,-74 -13,-66Z", fill: "#211812" }, { circle: [11, -82, 7], fill: "#211812" }],
          hat: [{ d: "M-13.5,-76 C-6,-80 6,-80 13.5,-76 L13,-72 C6,-75 -6,-75 -13,-72Z", fill: "#B5332A" }] };
        return { skin: SKIN.islander, sleeve: null, leg: leg(SKIN.islander, SKIN.islander, SKIN.islander, 0), bare: true,
          kain: { d: "M-22,2 C-24,28 -26,54 -27,78 L27,78 C26,54 24,28 22,2 C10,-1 -10,-1 -22,2Z", base: "#A0703F", motif: "#4E3220", dots: "#E8D7AE", fold: "M8,2 C5,30 7,56 12,78", band: "#5E3A22" },
          torso: [{ d: "M-22,-48 C-28,-44 -28,-30 -24,-10 L-21,8 L21,8 L24,-10 C28,-30 28,-44 22,-48 C12,-52 -12,-52 -22,-48Z", fill: SKIN.islander },
            { d: "M-8,-30 C-4,-27 4,-27 8,-30", stroke: "#6F4529", sw: 1.4 }],
          over: [{ d: "M-23,-46 L-14,-50 L20,4 L12,8Z", fill: "#8E3B2A" }],
          hat: [{ d: "M-14,-72 C-15,-85 -8,-90 0,-90 C8,-90 15,-85 14,-72 C8,-76 -8,-76 -14,-72Z", fill: "#8E3B2A" }, { d: "M-14,-78 C-6,-82 6,-82 14,-78", stroke: "#D9B36A", sw: 1.6 },
            { d: "M12,-84 L23,-91 L22,-79 L14,-77Z", fill: "#8E3B2A" }] };
      case "orangKaya": return { skin: SKIN.islander, sleeve: "#2F3A4E", cuff: "#C99A4B", leg: leg(SKIN.islander, SKIN.islander, "#5E3A22", 0), bare: true,
        kain: { d: "M-23,14 C-25,40 -27,70 -28,96 L28,96 C27,70 25,40 23,14Z", base: "#7A2E22", motif: "#C99A4B", dots: "#E2AF51", fold: "M8,14 C6,50 8,76 12,96" },
        torso: [{ d: "M-24,-48 C-30,-44 -31,-30 -28,-10 L-31,40 C-12,44 12,44 31,40 L28,-10 C31,-30 30,-44 24,-48 C14,-52 -14,-52 -24,-48Z", fill: "#2F3A4E" },
          { d: "M-6,-48 L-4,40 M6,-48 L4,40", stroke: "#C99A4B", sw: 2.6 }, { d: "M-30,38 C-12,42 12,42 30,38", stroke: "#C99A4B", sw: 2.6 }, { d: "M-27,6 L27,6 L27,13 L-27,13Z", fill: "#C99A4B" }],
        over: [{ d: "M-8,-50 L0,-40 L8,-50", stroke: "#C99A4B", sw: 2.4 }],
        hat: [{ d: "M-15,-71 C-17,-86 -9,-93 0,-93 C9,-93 17,-86 15,-71 C9,-75 -9,-75 -15,-71Z", fill: "#B9893F" }, { d: "M-15,-78 C-6,-83 6,-83 15,-78 M-13,-86 C-5,-90 5,-90 13,-86", stroke: "#6E4A1E", sw: 1.6 },
          { d: "M2,-92 L10,-104 L14,-90Z", fill: "#B9893F" }] };
      case "japaneseMercenary": return { skin: SKIN.east, sleeve: "#3A4148", cuff: null, leg: leg("#5B5348", "#5B5348", "#C9A877", 0), feetOnly: true, wideSleeve: true,
        torso: [{ d: "M-24,-48 C-30,-44 -31,-30 -28,-6 L28,-6 C31,-30 30,-44 24,-48 C14,-52 -14,-52 -24,-48Z", fill: "#3A4148" },
          { d: "M-25,-6 C-29,30 -33,64 -36,97 L-3,97 L0,44 L3,97 L36,97 C33,64 29,30 25,-6Z", fill: "#5B5348" },
          { d: "M-26,-6 L26,-6 L26,2 L-26,2Z", fill: "#2A2724" }],
        over: [{ d: "M-12,-50 L4,-14 M12,-50 L-2,-22", stroke: "#B7AD97", sw: 3 }],
        hair: [{ d: "M-12,-70 C-13,-62 -12,-58 -10,-56 L-8,-66Z M12,-70 C13,-62 12,-58 10,-56 L8,-66Z", fill: "#1E1A16" }],
        hat: [{ d: "M-38,-71 L0,-98 L38,-71 C22,-67 -22,-67 -38,-71Z", fill: "#C9A877" }, { d: "M-24,-77 L0,-94 L24,-77 M-12,-84 L12,-84", stroke: "#9C7F55", sw: 1.4 }] };
      case "sailor": return { skin: SKIN.euro, sleeve: "#E2D9C3", cuff: null, rolled: true, leg: leg("#5F7380", SKIN.euro, SKIN.euro, 40), wideBreeches: true, bare: true,
        torso: [{ d: "M-24,-48 C-30,-44 -31,-30 -27,-10 L-25,16 L25,16 L27,-10 C31,-30 30,-44 24,-48 C14,-52 -14,-52 -24,-48Z", fill: "#E2D9C3" },
          { d: "M-3,-48 L0,-34 L3,-48", stroke: "#A69C86", sw: 1.6 }, { d: "M-26,8 L26,8 L26,15 L-26,15Z", fill: "#6B4A30" }],
        over: [{ d: "M-12,-51 L12,-51 L6,-41 L0,-44 L-6,-41Z", fill: "#B5332A" }],
        hair: [{ d: "M-13,-70 C-15,-62 -14,-56 -11,-54 L-9,-66Z", fill: "#7A5A3A" }],
        hat: [{ d: "M-14,-71 C-15,-88 -2,-94 10,-88 C16,-85 19,-80 18,-75 C16,-74 15,-72 14,-71 C8,-75 -8,-75 -14,-71Z", fill: "#5E4A36" }, { d: "M-14,-74 C-6,-78 6,-78 14,-74", stroke: "#3D3027", sw: 2.2 }] };
    }
    throw new Error("Kit.figure: unknown kind '" + kind + "'. Known: englishman, dutchman, bandanese, orangKaya, japaneseMercenary, sailor");
  }
  var POSES = {
    stand: { bx: 0, by: 0, br: 0, legL: 2.5, legR: -2.5, legS: 1, armL: 6, armR: -6, prop: 0 },
    walk: { bx: 0, by: -1.5, br: 0, legL: 15, legR: -1, legS: 1, armL: -9, armR: -17, prop: 0 },
    walk2: { bx: 0, by: -1.5, br: 0, legL: 1, legR: -15, legS: 1, armL: 17, armR: 9, prop: 0 },
    swim: { bx: 0, by: 21, br: 0, legL: 0, legR: 0, legS: 0.01, armL: 148, armR: -72, prop: 0 },
    sign: { bx: 0, by: 0, br: 0, legL: 2.5, legR: -2.5, legS: 1, armL: -38, armR: 44, prop: 1 },
    kneel: { bx: 0, by: 47, br: 0, legL: 0, legR: 0, legS: 0.42, armL: -20, armR: 20, prop: 0 },
    fall: { bx: 0, by: -34, br: -90, legL: 4, legR: -4, legS: 1, armL: 12, armR: -12, prop: 0, tint: 0.8 }
  };
  function figure(target, kind, opts) {
    opts = opts || {};
    var parent = target.namespaceURI === NS ? target : svgOf(target, "top"), ctx = ctxOf(parent);
    var spec = figKinds(kind, opts), pose = opts.pose || "stand";
    if (!POSES[pose]) throw new Error("Kit.figure: unknown pose '" + pose + "'. Known: " + Object.keys(POSES).filter(function (k) { return k !== "walk2"; }).join(", "));
    var o = makeCutoutObject(ctx, parent, [], Object.assign({ scale: opts.scale != null ? opts.scale : (opts.size ? opts.size / 210 : 0.6) }, opts, { size: null }), "fig-" + kind);
    var rig = S("g", null, o.art), bodyG = S("g", null, rig), fl = function (ps) { return ps.map(function (p) { return Object.assign({ flat: true }, p); }); };
    var piece = fid(ctx, "piece"), pennant = null;
    if (opts.flagOnTop) {
      var pg = S("g", { transform: "translate(" + (kind === "japaneseMercenary" ? 26 : 10) + ",-104)" }, bodyG);
      S("path", { d: "M-0.8,-50 L0.8,-50 L0.8,40 L-0.8,40Z", fill: paperFill(ctx, "#6B4A30"), filter: piece }, pg);
      var fh = S("g", { transform: "translate(0.8,-50)" }, pg);
      pennant = buildFlag(ctx, fh, opts.flagOnTop, { pole: 0, phase: hash2(hashStr(kind), 3) });
      pennant.g.setAttribute("transform", "scale(" + f2(38 / pennant.W) + ")");
      ctx.flags = ctx.flags || []; ctx.flags.push(pennant);
    }
    function limb(px, py, pieces) { var g = S("g", { filter: piece }, bodyG); art(ctx, g, fl(pieces)); g.__p = [px, py]; return g; }
    // legs (pivot at the hip; drawn hanging down to y=86 → feet at 100)
    var L = spec.leg, legs = [-1, 1].map(function (side) {
      var ps = [];
      if (L.upperLen) ps.push({ d: spec.wideBreeches ? "M-11,0 L11,0 C15,18 15,32 10," + L.upperLen + " L-10," + L.upperLen + " C-15,32 -15,18 -11,0Z" : "M-9,0 L9,0 C11,20 11,32 8," + L.upperLen + " L-8," + L.upperLen + " C-11,32 -11,20 -9,0Z", fill: L.upper });
      if (!spec.feetOnly) ps.push({ d: "M-6," + Math.max(0, L.upperLen - 3) + " L6," + Math.max(0, L.upperLen - 3) + " L5,80 L-5,80Z", fill: L.lower });
      else ps.push({ d: "M-5,60 L5,60 L5,80 L-5,80Z", fill: L.lower });
      ps.push({ d: side < 0 ? "M5,78 L-10,78 C-14,79 -15,84 -12,86 L5,86Z" : "M-5,78 L10,78 C14,79 15,84 12,86 L-5,86Z", fill: L.shoe });
      return limb(side * 9, 14, ps);
    });
    var torso = S("g", { filter: piece }, bodyG);
    art(ctx, torso, fl(spec.torso));
    if (spec.kain) { // batik-like wrapped cloth: base, clipped motif rows, fold line
      var kid = uid(ctx, "kain"), cp = S("clipPath", { id: kid }, ctx.defs); S("path", { d: spec.kain.d }, cp);
      var kg = S("g", null, torso);
      S("path", { d: spec.kain.d, fill: paperFill(ctx, spec.kain.base) }, kg);
      var mg = S("g", { "clip-path": "url(#" + kid + ")" }, kg), dm = "", dt = "";
      for (var ry = -40; ry < 100; ry += 9) for (var rx = -34; rx < 34; rx += 8) {
        var cx = rx + ((ry / 9) % 2 ? 4 : 0);
        if (Math.round(ry / 9) % 2) dt += "M" + f2(cx - 1.2) + "," + ry + " a1.2,1.2 0 1,0 2.4,0 a1.2,1.2 0 1,0 -2.4,0 ";
        else dm += "M" + cx + "," + (ry - 2.6) + " l2.6,2.6 l-2.6,2.6 l-2.6,-2.6Z ";
      }
      S("path", { d: dm, fill: spec.kain.motif, opacity: 0.8 }, mg); S("path", { d: dt, fill: spec.kain.dots, opacity: 0.85 }, mg);
      if (spec.kain.band) S("path", { d: "M-24,0 L24,0 L24,8 L-24,8Z", fill: spec.kain.band }, mg);
      S("path", { d: spec.kain.fold, fill: "none", stroke: spec.kain.motif, "stroke-width": 1.8, opacity: 0.8 }, mg);
    }
    // arms (pivot at the shoulder)
    var arms = [-1, 1].map(function (side) {
      var ps = [];
      if (spec.sleeve && !spec.rolled) {
        ps.push({ d: spec.wideSleeve ? "M-9,-4 C-4,-9 4,-9 9,-4 L12,44 L-12,44Z" : "M-7,-4 C-3,-8 3,-8 7,-4 L6,48 L-6,48Z", fill: spec.sleeve });
        if (spec.cuff) ps.push({ d: "M-6.5,44 L6.5,44 L6.5,50 L-6.5,50Z", fill: spec.cuff });
      } else {
        ps.push({ d: "M-5.5,-4 C-2,-8 2,-8 5.5,-4 L4.5,50 L-4.5,50Z", fill: shadeHex(spec.skin, -0.09) });
        if (spec.rolled) ps.push({ d: "M-7.5,-5 C-3,-9 3,-9 7.5,-5 L7,22 L-7,22Z", fill: spec.sleeve });
      }
      ps.push({ circle: [0, 55, 6.2], fill: spec.skin });
      return limb(side * 21, -42, ps);
    });
    // the 'sign' prop: a sheet held at the waist and a quill in the right hand
    var prop = S("g", { filter: piece, opacity: 0 }, bodyG);
    art(ctx, prop, fl([{ d: "M-17,-6 L17,-8 L18,16 L-16,18Z", fill: C.parchment }, { d: "M-11,0 L10,-1 M-11,6 L12,5 M-11,12 L4,11", stroke: "#625949", sw: 1.3 },
      { d: "M14,-2 C18,-14 24,-24 34,-32 C28,-20 22,-10 16,0Z", fill: C.white }]));
    if (spec.over) { var ov = S("g", { filter: piece }, bodyG); art(ctx, ov, fl(spec.over)); }
    var head = S("g", { filter: piece }, bodyG);
    art(ctx, head, fl([{ d: "M-5,-58 L5,-58 L5,-46 L-5,-46Z", fill: spec.skin }, { ellipse: [0, -68, 12.5, 15], fill: spec.skin }].concat(spec.hair || [], spec.hat || [])));
    var water = null;
    if (pose === "swim") { // a patch of sea in front; the figure is clipped at the waterline
      var wid = uid(ctx, "swim"), wc = S("clipPath", { id: wid }, ctx.defs); S("path", { d: "M-200,-400 L200,-400 L200,10 L-200,10Z" }, wc);
      rig.setAttribute("clip-path", "url(#" + wid + ")");
      var wg = S("g", { filter: fid(ctx, "piece") }, o.art), wp = S("path", { fill: paperFill(ctx, "#7F9FAE") }, wg), crest = S("path", { fill: "none", stroke: "#D7E4E6", "stroke-width": 2.2, "stroke-linecap": "round" }, wg);
      water = function (ph) {
        var top = [], i; for (i = 0; i <= 28; i++) { var x = -92 + i * 184 / 28; top.push([x, -16 + 3 * Math.sin(x * 0.11 + ph * 6.283) + 1.1 * Math.sin(x * 0.27 - ph * 9)]); }
        var d = pathFromPts(top, false) + " C96,-6 92,10 70,12 L-70,12 C-92,10 -96,-6 -92,-16Z";
        wp.setAttribute("d", d); crest.setAttribute("d", pathFromPts(top.slice(2, 23), false));
      };
      water(0);
    }
    var ps = Object.assign({ tint: 0 }, POSES[pose]), flood = null;
    function ensureTint() {
      if (flood) return;
      var id = uid(ctx, "tint"), f = S("filter", { id: id, x: "-30%", y: "-30%", width: "160%", height: "160%", "color-interpolation-filters": "sRGB" }, ctx.defs);
      flood = S("feFlood", { "flood-color": opts.tintColor || C.red, "flood-opacity": 0, result: "f" }, f);
      S("feComposite", { in: "f", in2: "SourceAlpha", operator: "in", result: "t" }, f);
      var m = S("feMerge", null, f); S("feMergeNode", { in: "SourceGraphic" }, m); S("feMergeNode", { in: "t" }, m);
      rig.setAttribute("filter", "url(#" + id + ")");
    }
    function apply() {
      bodyG.setAttribute("transform", "translate(" + f2(ps.bx) + "," + f2(ps.by) + ") rotate(" + f2(ps.br) + ",0,100)");
      legs[0].setAttribute("transform", "translate(-9,14) rotate(" + f2(ps.legL) + ") scale(1," + f2(ps.legS) + ")");
      legs[1].setAttribute("transform", "translate(9,14) rotate(" + f2(ps.legR) + ") scale(1," + f2(ps.legS) + ")");
      arms[0].setAttribute("transform", "translate(-21,-42) rotate(" + f2(ps.armL) + ")");
      arms[1].setAttribute("transform", "translate(21,-42) rotate(" + f2(ps.armR) + ")");
      prop.setAttribute("opacity", f2(ps.prop));
      if (flood) flood.setAttribute("flood-opacity", f2(ps.tint));
    }
    if (pose === "fall") { ensureTint(); if (opts.dir === "right") ps.br = 90; }
    apply();
    o.kind = kind; o.parts = { rig: rig, body: bodyG, legs: legs, arms: arms, torso: torso, head: head, prop: prop };
    o.pennant = pennant; o.state = ps;
    // cur = the state at the end of everything scheduled so far (build order = time order); each tween restores
    // the full snapshot it starts from, so seeking anywhere gives the same frame
    var cur = Object.assign({}, ps);
    function tw(tl, t, to, dur, ease) {
      var snap = Object.assign({}, cur), from = {}, k;
      for (k in to) from[k] = snap[k];
      var proxy = Object.assign({}, from);
      tl.fromTo(proxy, from, Object.assign({}, to, { duration: dur, ease: ease || "power2.inOut", immediateRender: false, onUpdate: function () {
        Object.assign(ps, snap); for (var q in to) ps[q] = proxy[q]; apply();
      } }), t);
      Object.assign(cur, to);
    }
    o.pose = function (tl, t, name, dur) { var p = Object.assign({}, POSES[name]); delete p.tint; tw(tl, t, p, dur || 0.4); return o; };
    o.fall = function (tl, t, fo) {
      fo = fo || {}; ensureTint(); apply();
      var dir = fo.dir === "right" ? 90 : -90;
      tw(tl, t, { tint: 0.8 }, 0.35, "power1.inOut");
      tw(tl, t + 0.25, { br: dir * 1.05, by: -30, armL: 26, armR: -26, legL: 4, legR: -4 }, 0.55, "power2.in");
      tw(tl, t + 0.8, { br: dir, by: -34 }, 0.22, "power2.out");
      return o;
    };
    o.walk = function (tl, t, dur, wo) {
      wo = wo || {};
      var fps = wo.fps || 5, dx = wo.dx || 0, dy = wo.dy || 0, x0 = o.x, y0 = o.y, proxy = { s: 0 }, A = POSES.walk, B = POSES.walk2, keys = ["legL", "legR", "armL", "armR", "by"];
      var rest = Object.assign({}, cur);
      tl.fromTo(proxy, { s: 0 }, { s: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: function () {
        var step = Math.floor(proxy.s * fps), P = proxy.s >= dur ? rest : (step % 2 ? B : A);
        Object.assign(ps, rest); keys.forEach(function (k) { ps[k] = P[k]; }); apply();
        o.setPose(x0 + dx * Math.min(1, proxy.s / dur), y0 + dy * Math.min(1, proxy.s / dur), 0, 1);
      } }, t);
      o.x = x0 + dx; o.y = y0 + dy;
      return o;
    };
    o.swim = function (tl, t, dur, so) {
      so = so || {};
      var fps = so.fps || 6, dx = so.dx || 0, x0 = o.x, y0 = o.y, proxy = { s: 0 }, snap = Object.assign({}, cur);
      tl.fromTo(proxy, { s: 0 }, { s: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: function () {
        var st = Math.floor(proxy.s * fps), odd = st % 2;
        Object.assign(ps, snap); ps.armL = odd ? 70 : 148; ps.armR = odd ? -148 : -72; ps.by = 21 + (odd ? 2 : -1); apply();
        if (water) water(proxy.s * 0.45);
        o.setPose(x0 + dx * Math.min(1, proxy.s / dur), y0, 0, 1);
      } }, t);
      return o;
    };
    return o;
  }

  // ---------------------------------------------------------------- portrait frame (black and white, with a name plate)
  function portrait(target, opts) {
    opts = opts || {};
    var st = stageOf(target), parent = st ? st.layer : layerOf(target), ctx = st ? st.ctx : ctxOf(parent);
    var w = opts.w || 300, h = Math.round(w * 1.27), pad = 26, x = opts.x == null ? 960 : opts.x, y = opts.y == null ? 500 : opts.y;
    var el = D("div", "kit-portrait", parent);
    el.style.left = f2(x - w / 2 - pad) + "px"; el.style.top = f2(y - h / 2 - pad) + "px"; el.style.width = (w + pad * 2) + "px";
    if (opts.id) el.id = opts.id;
    var svg = S("svg", { width: w + pad * 2, height: h + pad * 2, viewBox: (-w / 2 - pad) + " " + (-h / 2 - pad) + " " + (w + pad * 2) + " " + (h + pad * 2), class: "kit-portrait-svg" }, el);
    var defs = S("defs", null, svg), cid = uid(ctx, "pclip"), fidd = uid(ctx, "bw");
    var cp = S("clipPath", { id: cid }, defs); S("ellipse", { rx: w / 2, ry: h / 2 }, cp);
    defs.insertAdjacentHTML("beforeend",
      '<filter id="' + fidd + '" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feColorMatrix type="saturate" values="0" result="g"/>' +
      '<feComponentTransfer in="g" result="c"><feFuncR type="linear" slope="1.1" intercept="-0.03"/><feFuncG type="linear" slope="1.1" intercept="-0.03"/><feFuncB type="linear" slope="1.06" intercept="-0.02"/></feComponentTransfer>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="ng"/>' +
      '<feComposite in="c" in2="ng" operator="arithmetic" k1="0" k2="1" k3="0.11" k4="-0.055"/></filter>');
    S("ellipse", { rx: w / 2 + 2, ry: h / 2 + 2, fill: paperFill(ctx, opts.src ? "#CFC8B8" : "#D8D0BD") }, svg);
    var inner = S("g", { "clip-path": "url(#" + cid + ")" }, svg);
    if (opts.src) {
      S("image", { href: opts.src, x: -w / 2, y: -h / 2, width: w, height: h, preserveAspectRatio: opts.fit || "xMidYMid slice", filter: "url(#" + fidd + ")" }, inner);
    } else { // a respectful neutral mannequin bust
      var mq = S("g", { opacity: 0.9 }, inner), mc = "#B4AB97";
      S("ellipse", { cx: 0, cy: -h * 0.12, rx: w * 0.15, ry: w * 0.185, fill: paperFill(ctx, mc) }, mq);
      S("path", { d: "M" + f2(-w * 0.07) + "," + f2(h * 0.02) + " L" + f2(w * 0.07) + "," + f2(h * 0.02) + " L" + f2(w * 0.08) + "," + f2(h * 0.09) +
        " C" + f2(w * 0.3) + "," + f2(h * 0.11) + " " + f2(w * 0.42) + "," + f2(h * 0.2) + " " + f2(w * 0.46) + "," + f2(h * 0.42) +
        " L" + f2(-w * 0.46) + "," + f2(h * 0.42) + " C" + f2(-w * 0.42) + "," + f2(h * 0.2) + " " + f2(-w * 0.3) + "," + f2(h * 0.11) + " " + f2(-w * 0.08) + "," + f2(h * 0.09) + "Z", fill: paperFill(ctx, mc) }, mq);
      var nk = S("text", { x: 0, y: f2(h * 0.35), "text-anchor": "middle", "font-family": "IBM Plex Mono", "font-size": 13, "font-weight": 600, "letter-spacing": "0.16em", fill: "#2E2920" }, inner);
      nk.textContent = opts.noPortrait || "NO KNOWN PORTRAIT";
    }
    S("ellipse", { rx: w / 2 - 7, ry: h / 2 - 7, fill: "none", stroke: "#FFFDF6", "stroke-width": 1.2, opacity: 0.5 }, inner);
    var ring = S("g", { filter: fid(ctx, "cut") }, svg), R = 17;
    S("path", { d: "M" + (-w / 2 - R) + ",0 a" + (w / 2 + R) + "," + (h / 2 + R) + " 0 1,0 " + (w + 2 * R) + ",0 a" + (w / 2 + R) + "," + (h / 2 + R) + " 0 1,0 " + (-w - 2 * R) + ",0Z M" + (-w / 2) + ",0 a" + (w / 2) + "," + (h / 2) + " 0 1,1 " + w + ",0 a" + (w / 2) + "," + (h / 2) + " 0 1,1 " + (-w) + ",0Z",
      fill: paperFill(ctx, opts.frameColor || "#D9C9A0"), "fill-rule": "evenodd" }, ring);
    S("ellipse", { rx: w / 2 + R * 0.55, ry: h / 2 + R * 0.55, fill: "none", stroke: "#8C7A55", "stroke-width": 1.4, opacity: 0.7 }, svg);
    var plate = null;
    if (opts.name || opts.role) {
      plate = D("div", "kit-plate", el);
      sheetDiv(ctx, plate, opts.plateColor || C.ivory);
      if (opts.name) { var nm = D("div", "kit-plate-name", plate); nm.textContent = opts.name; }
      if (opts.role) { var rl = D("div", "kit-plate-role kit-mono", plate); rl.textContent = opts.role; }
    }
    var api = { el: el, svg: svg, plate: plate,
      in: function (tl, t) { placeHtml(tl, el, t, opts.seed || 11); return api; },
      out: function (tl, t, style) { exit(tl, t, el, { style: style || "lift" }); return api; } };
    return api;
  }

  // ---------------------------------------------------------------- price climb: a nutmeg token travels port to port, coins stack, the tag ticks up
  function priceClimb(target, proj, stops, opts) {
    opts = opts || {};
    var svg = proj && proj.g && proj.g.ownerSVGElement ? proj.g.ownerSVGElement : (target.namespaceURI === NS ? target : svgOf(target, "map"));
    var top = target.namespaceURI === NS ? target : svgOf(target, "top"), ctx = ctxOf(svg), theme = ctx.theme;
    var P = function (s) { var a = typeof s.at === "string" ? places[s.at] : s.at; return proj ? (proj.project ? proj.project(a) : proj(a)) : a; };
    var pts = stops.map(P), fmt = makeFormat(opts.format || "dec", opts), v0 = stops[0].value;
    var rt = route(svg, null, pts, { greatCircle: false, smooth: true, color: opts.color || "red", width: opts.width || 4.5 });
    var pins = [], stacks = [], tags = [];
    stops.forEach(function (s, i) {
      var xy = pts[i];
      pins.push(pin(svg, xy, s.label, Object.assign({ screen: true, pos: s.pos || "b" }, opts.pin || {})));
      var n = s.coins != null ? s.coins : Math.max(1, Math.min(12, Math.round(1 + 3 * Math.log(s.value / v0) / Math.LN10)));
      var sx = xy[0] + (s.dx != null ? s.dx : 30), sy = xy[1] + 2, sg = S("g", { class: "kit-coins", filter: fid(ctx, "pinlift") }, top), coins = [];
      for (var c = 0; c < n; c++) {
        var cg = S("g", null, sg), yy = sy - c * 6.5;
        S("ellipse", { cx: sx, cy: yy + 2.2, rx: 13, ry: 4.6, fill: C.ochre }, cg);
        S("ellipse", { cx: sx, cy: yy, rx: 13, ry: 4.6, fill: paperFill(ctx, C.gold) }, cg);
        S("ellipse", { cx: sx, cy: yy, rx: 8, ry: 2.6, fill: "none", stroke: "#9C7A3A", "stroke-width": 1 }, cg);
        coins.push(cg);
      }
      stacks.push({ el: sg, coins: coins });
      var tx = fmt(s.value), tw = Math.max(64, tx.length * 14 + 30), ty = sy - n * 6.5 - 34, tg = S("g", { class: "kit-pricetag" }, top);
      var tb = S("g", { filter: fid(ctx, "piece") }, tg);
      S("path", { d: "M" + f2(sx - tw / 2 + 12) + "," + f2(ty - 15) + " L" + f2(sx + tw / 2) + "," + f2(ty - 15) + " L" + f2(sx + tw / 2) + "," + f2(ty + 15) + " L" + f2(sx - tw / 2 + 12) + "," + f2(ty + 15) + " L" + f2(sx - tw / 2) + "," + f2(ty) + "Z", fill: paperFill(ctx, C.ivory) }, tb);
      S("circle", { cx: f2(sx - tw / 2 + 11), cy: f2(ty), r: 3, fill: C.inkMute }, tg);
      var txt = S("text", { x: f2(sx + 6), y: f2(ty + 8), "text-anchor": "middle", "font-family": "Newsreader", "font-size": 24, "font-weight": 700, fill: C.ink }, tg);
      txt.textContent = tx;
      tags.push({ el: tg, text: txt });
    });
    var token = cutout(top, "nutmegSeed", { size: opts.tokenSize || 38, x: pts[0][0], y: pts[0][1] - 18 });
    var api = { route: rt, pins: pins, stacks: stacks, tags: tags, token: token, card: null, points: pts,
      all: [rt].concat(pins, stacks.map(function (s) { return s.el; }), tags.map(function (t) { return t.el; }), [token]),
      run: function (tl, from, to) {
        var n = stops.length, legs = Math.max(1, n - 1), travel = Math.max(1, to - from - 1.3), hold = Math.min(opts.hold == null ? 0.3 : opts.hold, travel * 0.3 / legs), legDur = (travel - (legs - 1) * hold) / legs;
        var T = pts.map(function (p) { return routeT(rt, p, true); }), proxy = { p: 0 };
        function upd() { var q = pathPoint(rt, proxy.p); token.setPose(q.x, q.y - 18, 0, 1); rt.draw(proxy.p); }
        upd();
        tl.fromTo(token.body, { opacity: 0, scale: 0.4, svgOrigin: "0 0" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", svgOrigin: "0 0", immediateRender: true }, from - 0.3);
        stops.forEach(function (s, i) {
          var arrive = from + i * (legDur + hold);
          if (i > 0) tl.fromTo(proxy, { p: T[i - 1] }, { p: T[i], duration: legDur, ease: "power1.inOut", onUpdate: upd, immediateRender: false }, from + (i - 1) * (legDur + hold) + hold);
          pins[i].in(tl, Math.max(from - 0.3, arrive - 0.3));
          stacks[i].coins.forEach(function (cg, c) { tl.fromTo(cg, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out", immediateRender: true }, arrive + c * 0.045); });
          tl.fromTo(tags[i].el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", immediateRender: true }, arrive + 0.08);
          if (i > 0) counter(tags[i].text, stops[i - 1].value, s.value, { format: opts.format || "dec", prefix: opts.prefix, suffix: opts.suffix, decimals: opts.decimals, tl: tl, at: arrive + 0.1, dur: 0.6 });
        });
        var last = stops[n - 1].value, mult = opts.multiplier != null ? opts.multiplier : "×" + fmtInt(Math.round(last / v0));
        var co = opts.card || {};
        if (co !== false) {
          api.card = card(target, { x: co.x == null ? 1380 : co.x, y: co.y == null ? 760 : co.y, w: co.w || 380, eyebrow: co.eyebrow || "FROM FIRST PORT TO LAST", big: mult, bigSize: co.bigSize || 104, small: co.small, bigColor: co.color || "red" });
          api.card.in(tl, to - 1.1, "place"); api.all.push(api.card);
        }
        return api;
      } };
    if (opts.tl) api.run(opts.tl, opts.from || 0, opts.to || (opts.from || 0) + 6);
    return api;
  }

  // ---------------------------------------------------------------- scroll: a parchment that unrolls, types on and scrolls
  function scrollPaper(target, opts) {
    opts = opts || {};
    var st = stageOf(target), parent = st ? st.layer : layerOf(target), ctx = st ? st.ctx : ctxOf(parent);
    var w = opts.w || 520, h = opts.h || 420, rollH = 30;
    var el = D("div", "kit-scroll", parent);
    el.style.left = (opts.x == null ? 700 : opts.x) + "px"; el.style.top = (opts.y == null ? 240 : opts.y) + "px"; el.style.width = w + "px"; el.style.height = (h + rollH * 2) + "px";
    if (opts.id) el.id = opts.id;
    var view = D("div", "kit-scroll-view", el, { top: (rollH - 6) + "px", height: (h + 12) + "px" });
    sheetDiv(ctx, view, opts.paper || C.parchment);
    var content = D("div", "kit-scroll-content", view), chars = [];
    (opts.lines || []).forEach(function (ln) {
      var o = typeof ln === "string" ? { text: ln } : ln, row = D("div", "kit-scroll-line kit-scroll-" + (o.style || "body"), content);
      String(o.text).split("").forEach(function (ch) { var sp = D("span", null, row); sp.textContent = ch; sp.style.visibility = "hidden"; chars.push(sp); });
    });
    function roll(cls, topPx) {
      var r = D("div", "kit-scroll-roll " + cls, el, { top: topPx + "px" });
      D("div", "kit-scroll-cap kit-scroll-cap-l", r); D("div", "kit-scroll-cap kit-scroll-cap-r", r);
      return r;
    }
    var rTop = roll("kit-scroll-roll-top", 0), rBot = roll("kit-scroll-roll-bot", 0);
    var typed = { n: 0 }, shown = 0;
    function show() { var n = Math.round(typed.n); if (n === shown) return; for (var i = 0; i < chars.length; i++) chars[i].style.visibility = i < n ? "visible" : "hidden"; shown = n; }
    var api = { el: el, content: content, chars: chars, height: h,
      unroll: function (tl, t, dur) {
        dur = dur || 0.9;
        tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", immediateRender: true }, t);
        tl.fromTo(view, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power2.inOut", immediateRender: true }, t + 0.15);
        tl.fromTo(rBot, { y: 0 }, { y: h + rollH - 6, duration: dur, ease: "power2.inOut", immediateRender: true }, t + 0.15);
        return api;
      },
      type: function (tl, t, cps) {
        var d = chars.length / (cps || opts.cps || 38);
        tl.fromTo(typed, { n: 0 }, { n: chars.length, duration: d, ease: "none", onUpdate: show, immediateRender: false }, t);
        return api;
      },
      scroll: function (tl, t, dur, px) { tl.fromTo(content, { y: 0 }, { y: -(px || 120), duration: dur || 4, ease: "none", immediateRender: false }, t); return api; },
      in: function (tl, t) { api.unroll(tl, t); api.type(tl, t + 1.1); return api; },
      out: function (tl, t, style) { exit(tl, t, el, { style: style || "lift" }); return api; } };
    return api;
  }

  window.Kit = {
    version: "2.0.0", C: C, tok: tok, rng: rng, hash2: hash2, fmtInt: fmtInt,
    stage: stage, chapterTabs: chapterTabs, chip: chip, paperFilters: function (svg) { return ctxOf(svg); }, paperFill: paperFill, filter: function (target, name) { return fid(ctxOf(target), name); },
    flatMap: flatMap, globe: globe, islands: islands, route: route, pathPoint: pathPoint, routeT: routeT, vehicle: vehicle, ride: ride,
    pin: pin, label: label, scaleBar: scaleBar, card: card, stamp: stamp, counter: counter, title: title, cutout: cutout,
    dim: dim, themeFlip: themeFlip, waffle: waffle, bar: bar, priceLadder: priceLadder, enter: enter, exit: exit, place: place, wobble: wobble,
    places: places, routes: routes, cutoutNames: Object.keys(CUT), vehicleTypes: Object.keys(VEH), texture: function (k) { return makeTexture(k || "fibre").url; },
    svg: function (root, z) { return svgOf(root, z === "map" ? "map" : "top"); },
    // v2
    dateLabel: dateLabel, setDate: setDate, reasonBar: reasonBar, setReason: setReason, reasons: REASONS, iconNames: Object.keys(ICONS),
    flag: flag, flagTypes: Object.keys(FLAGDEF), waveFlags: waveFlags, vocLogo: vocLogo, vocReveal: vocReveal,
    figure: figure, figureKinds: ["englishman", "dutchman", "bandanese", "orangKaya", "japaneseMercenary", "sailor"], figurePoses: ["stand", "walk", "swim", "sign", "kneel", "fall"],
    portrait: portrait, priceClimb: priceClimb, scrollPaper: scrollPaper
  };
})();
