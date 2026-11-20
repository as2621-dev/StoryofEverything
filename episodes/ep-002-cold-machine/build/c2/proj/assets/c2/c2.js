/* c2 helpers (Story of Everything ep-002, chapter c2): reason icons, paper objects, hand, thermometer, heat arrows.
   Deterministic: no Math.random, no timers. Needs gsap + Kit loaded first. */
(function () {
  if (window.C2) return;
  var NS = "http://www.w3.org/2000/svg";
  function f2(n) { return Math.round(n * 100) / 100; }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // a paper object: outer (fixed translate) > body (place / exit tweens) > art (filtered)
  function obj(parent, x, y, filter) {
    var outer = el("g", { transform: "translate(" + x + "," + y + ")" }, parent);
    var body = el("g", null, outer);
    var art = el("g", { filter: filter || null }, body);
    return { el: outer, body: body, art: art, x: x, y: y, scale: 1 };
  }
  function txt(parent, x, y, s, o) {
    o = o || {};
    var mono = o.font !== "serif";
    var t = el("text", { x: x, y: y, "text-anchor": o.anchor || "start", "font-size": o.size || 24,
      "font-family": mono ? "IBM Plex Mono" : "Newsreader", "font-weight": o.weight || (mono ? 600 : 600),
      "letter-spacing": o.tracking || (mono ? "0.14em" : null), fill: o.color || "#EFE9D9", opacity: o.opacity,
      "font-style": o.italic ? "italic" : null }, parent);
    t.textContent = mono && o.upper !== false ? String(s).toUpperCase() : s;
    return t;
  }
  // wavy line from a to b: points then path
  function wavy(x0, y0, x1, y1, amp, wl, phase) {
    var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var n = Math.max(12, Math.round(L / 12)), d = "";
    for (var i = 0; i <= n; i++) {
      var s = i / n, taper = Math.min(1, s * 4, (1 - s) * 5 + 0.15);
      var w = Math.sin(s * L / wl * Math.PI * 2 + (phase || 0)) * amp * taper;
      d += (i ? "L" : "M") + f2(x0 + dx * s + nx * w) + "," + f2(y0 + dy * s + ny * w);
    }
    return d;
  }
  // heat arrow: gold glow + red line + arrowhead, drawn on by stroke-dashoffset
  function heatArrow(parent, d, o) {
    o = o || {};
    var g = el("g", { opacity: o.opacity }, parent);
    var glow = el("path", { d: d, fill: "none", stroke: o.glow || "#E2AF51", "stroke-width": (o.width || 5) + 7, "stroke-linecap": "round",
      opacity: 0.55, filter: o.glowFilter || null }, g);
    var line = el("path", { d: d, fill: "none", stroke: o.color || "#DF716B", "stroke-width": o.width || 5, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    var len = line.getTotalLength();
    var p1 = line.getPointAtLength(len), p0 = line.getPointAtLength(Math.max(0, len - 14));
    var a = Math.atan2(p1.y - p0.y, p1.x - p0.x), s = o.head || 15;
    var tip = [p1.x + Math.cos(a) * s * 0.6, p1.y + Math.sin(a) * s * 0.6];
    var l = [p1.x + Math.cos(a + 2.5) * s, p1.y + Math.sin(a + 2.5) * s], r = [p1.x + Math.cos(a - 2.5) * s, p1.y + Math.sin(a - 2.5) * s];
    var head = el("path", { d: "M" + f2(tip[0]) + "," + f2(tip[1]) + "L" + f2(l[0]) + "," + f2(l[1]) + "L" + f2(r[0]) + "," + f2(r[1]) + "Z",
      fill: o.color || "#DF716B" }, g);
    [glow, line].forEach(function (p) { p.setAttribute("stroke-dasharray", f2(len) + " " + f2(len + 40)); p.setAttribute("stroke-dashoffset", f2(len + 20)); });
    head.setAttribute("opacity", 0);
    return { g: g, line: line, glow: glow, head: head, len: len,
      draw: function (tl, t, dur) {
        dur = dur || 1.2;
        tl.fromTo([glow, line], { attr: { "stroke-dashoffset": len + 20 } }, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "power2.inOut" }, t);
        tl.fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, t + dur * 0.9);
        return this;
      } };
  }
  // flat paper hand, fingers pointing +x, palm centre at 0,0 (finger stack spans y -35..35)
  function hand(g, paper, mirror) {
    var h = el("g", { transform: mirror ? "scale(-1,1)" : null }, g);
    var skin = paper("#E2B48A");
    el("rect", { x: -178, y: -40, width: 118, height: 80, rx: 6, fill: paper("#5D7A8C") }, h);
    el("rect", { x: -70, y: -43, width: 14, height: 86, rx: 3, fill: paper("#EFE9D9") }, h);
    el("path", { d: "M-46,-36 C-30,-56 -12,-62 -2,-54 C4,-48 -4,-40 -16,-34Z", fill: skin }, h); // thumb
    el("rect", { x: -62, y: -37, width: 66, height: 74, rx: 16, fill: skin }, h);
    [[-27, 50], [-9, 60], [9, 56], [27, 44]].forEach(function (f) {
      el("rect", { x: -14, y: f[0] - 8.5, width: f[1] + 14, height: 17, rx: 8.5, fill: skin }, h);
      el("path", { d: "M" + (f[1] - 18) + "," + (f[0] - 4) + " v8", stroke: "#B98763", "stroke-width": 1.6, "stroke-linecap": "round" }, h);
    });
    return h;
  }
  // thermometer: tube + bulb + column; o: {top, bottom, min, max, value, color, ticks:[{v,label,side,color}], textColor}
  function thermo(parent, x, o, paper, filter) {
    var ob = obj(parent, x, 0, filter);
    var g = ob.art, bulbR = o.bulbR || 26, tw = o.tw || 34, bore = o.bore || 14;
    var top = o.top, bulbY = o.bottom, sTop = top + 10, sBot = bulbY - bulbR - 4;
    function Y(v) { return sBot - (v - o.min) / (o.max - o.min) * (sBot - sTop); }
    el("rect", { x: -tw / 2, y: top - 8, width: tw, height: bulbY - top + 8, rx: tw / 2, fill: paper(o.glass || "#F3EEE2") }, g);
    el("circle", { cx: 0, cy: bulbY, r: bulbR, fill: paper(o.glass || "#F3EEE2") }, g);
    var flat = el("g", null, ob.body); // unfiltered inner parts so the column stays crisp
    el("rect", { x: -bore / 2, y: sTop - 4, width: bore, height: bulbY - sTop + 4, rx: bore / 2, fill: "#D8D0BE" }, flat);
    var col = el("rect", { x: -bore / 2, y: Y(o.value), width: bore, height: bulbY - Y(o.value), fill: o.color || "#C03F27" }, flat);
    var bulb = el("circle", { cx: 0, cy: bulbY, r: bulbR - 8, fill: o.color || "#C03F27" }, flat);
    var tc = o.textColor || "#242018", ticks = {};
    (o.ticks || []).forEach(function (k) {
      var y = Y(k.v), side = k.side === "l" ? -1 : 1, x0 = side * (tw / 2 + 3), x1 = side * (tw / 2 + (k.long || 16));
      var ln = el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: k.color || tc, "stroke-width": k.w || 2.5, "stroke-linecap": "round" }, flat);
      var t = k.label ? txt(flat, x1 + side * 8, y + 7, k.label, { size: k.size || 20, color: k.color || tc, anchor: side < 0 ? "end" : "start", tracking: "0.08em" }) : null;
      if (k.key) ticks[k.key] = { line: ln, text: t };
    });
    ob.col = col; ob.bulb = bulb; ob.Y = Y; ob.ticks = ticks; ob.bulbY = bulbY; ob.value = o.value;
    ob.set = function (tl, t, dur, v, color, ease) {
      var a = { attr: { y: Y(ob.value), height: bulbY - Y(ob.value) } }, b = { attr: { y: Y(v), height: bulbY - Y(v) }, duration: dur, ease: ease || "power2.inOut", immediateRender: false };
      if (color) { b.attr.fill = color; }
      tl.fromTo(col, a, b, t);
      if (color) tl.to(bulb, { attr: { fill: color }, duration: dur, ease: "none" }, t);
      ob.value = v; return ob;
    };
    return ob;
  }
  // stepped mud-brick dome outline (outer), centre cx, ground gy, height H, base half-width B, top half-width T, n steps
  function domeOuter(cx, gy, H, B, T, n) {
    var hw = function (u) { return T + (B - T) * Math.pow(1 - u, 0.8); };
    var stepH = H / n, left = [], right = [];
    for (var k = 0; k < n; k++) {
      var yb = gy - stepH * k, yt = yb - stepH, w = hw(k / n);
      left.push([cx - w, yb], [cx - w, yt]);
    }
    var d = "M" + left.map(function (p) { return f2(p[0]) + "," + f2(p[1]); }).join("L");
    var ytop = gy - H;
    d += "Q" + f2(cx - T) + "," + f2(ytop - 16) + " " + cx + "," + f2(ytop - 18) + "Q" + f2(cx + T) + "," + f2(ytop - 16) + " ";
    for (var j = n - 1; j >= 0; j--) {
      var yb2 = gy - stepH * j, yt2 = yb2 - stepH, w2 = hw(j / n);
      right.push([cx + w2, yt2], [cx + w2, yb2]);
    }
    d += right.map(function (p) { return f2(p[0]) + "," + f2(p[1]); }).join("L") + "Z";
    return { d: d, hw: hw };
  }
  // reason-bar icons (same simple shapes in every chapter)
  function arrowHead(x, y, ang, s) {
    var tip = [x + Math.cos(ang) * s, y + Math.sin(ang) * s], l = [x + Math.cos(ang + 2.3) * s * 0.8, y + Math.sin(ang + 2.3) * s * 0.8], r = [x + Math.cos(ang - 2.3) * s * 0.8, y + Math.sin(ang - 2.3) * s * 0.8];
    return "M" + f2(tip[0]) + "," + f2(tip[1]) + "L" + f2(l[0]) + "," + f2(l[1]) + "L" + f2(r[0]) + "," + f2(r[1]) + "Z";
  }
  var ICONS = {
    ice: function () {
      return [{ d: "M-18,-26 h36 a8,8 0 0 1 8,8 v36 a8,8 0 0 1 -8,8 h-36 a8,8 0 0 1 -8,-8 v-36 a8,8 0 0 1 8,-8Z", fill: "#BCD8E6" },
        { d: "M-17,-18 h17 v5 h-12 v13 h-5Z", fill: "#FFFFFF", solid: true, flat: true },
        { d: "M10,18 h7 v-9", stroke: "#7FA9C4", sw: 3, flat: true }];
    },
    flask: function () {
      return [{ circle: [0, 12, 24], fill: "#EAF2F5" },
        { d: "M-23.9,14 A24,24 0 0 0 23.9,14 Z", fill: "#7FA9C4", flat: true },
        { d: "M-7,-32 L-7,-10.9 A24,24 0 1 0 7,-10.9 L7,-32", stroke: "ink", sw: 3.5, flat: true },
        { d: "M-11,-33 h22", stroke: "ink", sw: 4, flat: true }];
    },
    loop: function () {
      var r = 24, out = [];
      [[-10, 190], [170, 370]].forEach(function (seg) {
        var a0 = seg[0] * Math.PI / 180, a1 = (seg[1] - 22) * Math.PI / 180;
        var x0 = r * Math.cos(a0), y0 = r * Math.sin(a0), x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
        out.push({ d: "M" + f2(x0) + "," + f2(y0) + " A" + r + "," + r + " 0 0 1 " + f2(x1) + "," + f2(y1), stroke: "#24506C", sw: 6, flat: true });
        out.push({ d: arrowHead(x1, y1, a1 + Math.PI / 2, 12), fill: "#24506C", solid: true, flat: true });
      });
      return out;
    },
    poison: function () {
      return [{ d: "M-6,-42 h12 v10 h-12Z", fill: "#C9A27A" },
        { d: "M-16,-8 C-16,-16 -8,-18 -7,-24 L-7,-33 L7,-33 L7,-24 C8,-18 16,-16 16,-8 L16,30 Q16,36 10,36 L-10,36 Q-16,36 -16,30Z", fill: "#7A4A2A" },
        { d: "M-12,-3 h24 v28 h-24Z", fill: "#F4EFE4", flat: true },
        { circle: [0, 6, 6], fill: "ink", solid: true, flat: true },
        { d: "M-3,10 h6 v4 h-6Z", fill: "ink", solid: true, flat: true },
        { circle: [-2.2, 5.5, 1.5], fill: "#F4EFE4", solid: true, flat: true }, { circle: [2.2, 5.5, 1.5], fill: "#F4EFE4", solid: true, flat: true },
        { d: "M-8,15 L8,23 M8,15 L-8,23", stroke: "ink", sw: 2.2, flat: true }];
    },
    sky: function () {
      return [{ circle: [0, 0, 28], fill: "#5F8FB0" },
        { d: "M-14,-12 C-4,-20 8,-14 6,-4 C4,6 14,8 10,16 C2,22 -10,14 -12,6 C-14,0 -22,-6 -14,-12Z", fill: "#E7DEC8", flat: true }];
    }
  };
  // keyframe track: keys [[t, v, easeInto?], ...] → function(t) (holds the first/last value outside)
  function track(keys) {
    var eases = keys.map(function (k) { return k[2] ? gsap.parseEase(k[2]) : null; });
    return function (t) {
      if (t <= keys[0][0]) return keys[0][1];
      for (var i = 1; i < keys.length; i++) {
        if (t < keys[i][0]) {
          var a = keys[i - 1], b = keys[i], u = (t - a[0]) / (b[0] - a[0]), e = eases[i];
          return a[1] + (b[1] - a[1]) * (e ? e(u) : (b[2] === undefined ? 0 : u));
        }
      }
      return keys[keys.length - 1][1];
    };
  }
  // one proxy spanning the whole scene, so every seek (in any order) recomputes the pose
  function clock(tl, len, fn) {
    var pr = { t: 0 };
    tl.fromTo(pr, { t: 0 }, { t: len, duration: len, ease: "none", onUpdate: function () { fn(pr.t); } }, 0);
    fn(0);
    return pr;
  }
  var REASONS = [{ icon: ICONS.ice, label: "The ice" }, { icon: ICONS.flask, label: "The trick" }, { icon: ICONS.loop, label: "The loop" },
    { icon: ICONS.poison, label: "The poison" }, { icon: ICONS.sky, label: "The sky" }];
  window.C2 = { el: el, obj: obj, txt: txt, wavy: wavy, heatArrow: heatArrow, hand: hand, thermo: thermo, domeOuter: domeOuter,
    ICONS: ICONS, REASONS: REASONS, f2: f2, track: track, clock: clock };
})();
