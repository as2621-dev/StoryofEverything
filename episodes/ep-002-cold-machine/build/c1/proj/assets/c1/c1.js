// c1 helpers for ep-002 "The Machine That Doesn't Make Cold": the five reason icons (c1 owns their design),
// a piece renderer matching the kit's cut-paper style, transform proxies, heat arrows and a thermometer.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function S(tag, a, p) {
    var e = document.createElementNS(NS, tag);
    if (a) for (var k in a) if (a[k] != null) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function f2(v) { return Math.round(v * 100) / 100; }
  function hex(c) { return (window.Kit && Kit.C[c]) || c; }
  function rr(x, y, w, h, r) {
    return "M" + (x + r) + "," + y + " H" + (x + w - r) + " Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      " V" + (y + h - r) + " Q" + (x + w) + "," + (y + h) + " " + (x + w - r) + "," + (y + h) + " H" + (x + r) +
      " Q" + x + "," + (y + h) + " " + x + "," + (y + h - r) + " V" + (y + r) + " Q" + x + "," + y + " " + (x + r) + "," + y + "Z";
  }

  // same piece format as the kit's art(): {d|circle|ellipse, fill, solid, stroke, sw, dash, flat, opacity, transform, group}
  function draw(st, parent, pieces) {
    var parts = {};
    pieces.forEach(function (p) {
      if (p.group) {
        var gg = S("g", { transform: p.transform, filter: p.flat ? null : Kit.filter(st.svg, "piece") }, parent);
        draw(st, gg, p.group.map(function (q) { return Object.assign({ flat: true }, q); }));
        if (p.name) parts[p.name] = gg;
        return;
      }
      var a = { transform: p.transform, opacity: p.opacity, filter: p.flat ? null : Kit.filter(st.svg, "piece") };
      a.fill = p.fill ? (p.solid ? hex(p.fill) : Kit.paperFill(st.svg, hex(p.fill))) : "none";
      if (p.stroke) {
        a.stroke = hex(p.stroke); a["stroke-width"] = p.sw || 3; a["stroke-linecap"] = "round"; a["stroke-linejoin"] = "round";
        if (p.dash) a["stroke-dasharray"] = p.dash;
      }
      var e;
      if (p.circle) { a.cx = p.circle[0]; a.cy = p.circle[1]; a.r = p.circle[2]; e = S("circle", a, parent); }
      else if (p.ellipse) { a.cx = p.ellipse[0]; a.cy = p.ellipse[1]; a.rx = p.ellipse[2]; a.ry = p.ellipse[3]; e = S("ellipse", a, parent); }
      else { a.d = p.d; e = S("path", a, parent); }
      if (p.name) parts[p.name] = e;
    });
    return parts;
  }

  // ------------------------------------------------------------ the five chapter icons (box -56..56)
  function arcArrow(r, a0, a1, color) {
    var pts = [], i, n = 24;
    for (i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push([r * Math.cos(a), r * Math.sin(a)]); }
    var d = pts.map(function (p, k) { return (k ? "L" : "M") + f2(p[0]) + "," + f2(p[1]); }).join("");
    var e = a1 * Math.PI / 180, cx = r * Math.cos(e), cy = r * Math.sin(e), tx = -Math.sin(e), ty = Math.cos(e), nx = Math.cos(e), ny = Math.sin(e);
    var tip = [cx + tx * 15, cy + ty * 15], b1 = [cx + nx * 12 - tx * 2, cy + ny * 12 - ty * 2], b2 = [cx - nx * 12 - tx * 2, cy - ny * 12 - ty * 2];
    return [{ d: d, stroke: color, sw: 10 },
      { d: "M" + f2(tip[0]) + "," + f2(tip[1]) + " L" + f2(b1[0]) + "," + f2(b1[1]) + " L" + f2(b2[0]) + "," + f2(b2[1]) + "Z", fill: color }];
  }
  var ICONS = {
    ice: function () {
      return [
        { d: rr(-34, -32, 68, 66, 13), fill: "#BBD5E3" },
        { d: "M-34,12 H34 V21 Q34,34 21,34 H-21 Q-34,34 -34,21Z", fill: "#93B9CF", flat: true },
        { d: "M-22,-22 H-4 Q0,-22 -2,-18 L-17,6 Q-22,12 -22,4Z", fill: "#F6F9FB", flat: true },
        { circle: [13, -19, 4], fill: "#F6F9FB", flat: true },
        { d: "M10,0 L22,-8 M4,12 L14,6", stroke: "#E9F2F7", sw: 2.5, flat: true }
      ];
    },
    flask: function () {
      return [
        { d: "M-9,-40 H9 V-10 H-9Z", fill: "#E6EEF0" },
        { circle: [0, 14, 30], fill: "#E6EEF0" },
        { d: "M-29.7,18 A30,30 0 0 0 29.7,18 Z", fill: "#7FA9C4", flat: true },
        { circle: [-8, 30, 3], fill: "#D4E4EC", flat: true }, { circle: [7, 25, 2.2], fill: "#D4E4EC", flat: true },
        { d: "M-9,-40 L-9,-14.6 A30,30 0 1 0 9,-14.6 L9,-40", stroke: "#242018", sw: 3.5, flat: true },
        { d: "M-14,-40 L14,-40", stroke: "#242018", sw: 4.5, flat: true },
        { d: "M-19,6 A21,21 0 0 1 -8,-6", stroke: "#FFFFFF", sw: 3, flat: true }
      ];
    },
    loop: function () { return arcArrow(29, 197, 333, "#C03F27").concat(arcArrow(29, 17, 153, "#3F7398")); },
    poison: function () {
      return [
        { d: "M-11,-45 H11 V-32 H-11Z", fill: "#4E3220" },
        { d: "M-8,-33 H8 V-22 Q8,-16 18,-12 Q26,-8 26,2 V32 Q26,42 16,42 H-16 Q-26,42 -26,32 V2 Q-26,-8 -18,-12 Q-8,-16 -8,-22Z", fill: "#7A4E2D" },
        { d: "M-22,0 V30", stroke: "#9C6E47", sw: 3, flat: true },
        { d: rr(-18, -2, 36, 34, 4), fill: "#F4F0E6", flat: true },
        { d: "M-12,6 L12,27 M12,6 L-12,27", stroke: "#242018", sw: 3.4, flat: true },
        { circle: [0, 12, 8], fill: "#242018", solid: true, flat: true },
        { d: "M-4.5,17 H4.5 V22 H-4.5Z", fill: "#242018", solid: true, flat: true },
        { circle: [-3, 11.5, 2.3], fill: "#F4F0E6", solid: true, flat: true },
        { circle: [3, 11.5, 2.3], fill: "#F4F0E6", solid: true, flat: true }
      ];
    },
    sky: function () {
      return [
        { circle: [0, 0, 36], fill: "#5E8FB0" },
        { d: "M-22,-18 C-10,-28 8,-22 10,-10 C12,0 0,4 -4,14 C-8,24 -20,22 -26,10 C-32,-2 -30,-12 -22,-18Z", fill: "#EADFC0", flat: true },
        { d: "M14,10 C22,6 29,12 26,20 C22,27 13,25 12,18Z", fill: "#EADFC0", flat: true },
        { d: "M8,-30 C14,-31 20,-27 18,-23 C15,-20 9,-24 8,-30Z", fill: "#EADFC0", flat: true }
      ];
    }
  };
  var REASONS = [{ icon: ICONS.ice, label: "The ice" }, { icon: ICONS.flask, label: "The trick" }, { icon: ICONS.loop, label: "The loop" },
    { icon: ICONS.poison, label: "The poison" }, { icon: ICONS.sky, label: "The sky" }];

  // ------------------------------------------------------------ transform proxy objects
  // o: { pivot:[px,py] (drawing coords), x, y (where the pivot sits; default = pivot), s }
  function obj(parent, o) {
    o = o || {};
    var outer = S("g", null, parent), inner = S("g", null, outer);
    var px = o.pivot ? o.pivot[0] : 0, py = o.pivot ? o.pivot[1] : 0;
    var api = { outer: outer, g: inner, x: o.x != null ? o.x : px, y: o.y != null ? o.y : py, s: o.s || 1,
      p: { dx: 0, dy: 0, r: 0, ds: 1, o: o.hidden ? 0 : 1 } };
    api.set = function () {
      var p = api.p;
      outer.setAttribute("transform", "translate(" + f2(api.x + p.dx) + "," + f2(api.y + p.dy) + ") rotate(" + f2(p.r) + ") scale(" + f2(api.s * p.ds) + ") translate(" + (-px) + "," + (-py) + ")");
      outer.setAttribute("opacity", f2(Math.max(0, Math.min(1, p.o))));
    };
    api.set();
    return api;
  }
  function tw(tl, o, t, from, to, dur, ease) {
    tl.fromTo(o.p, Object.assign({}, from), Object.assign({ duration: dur, ease: ease || "power2.out", onUpdate: o.set, immediateRender: false, lazy: false }, to), t);
  }
  // hand-placed entrance: slide 30-60 px, +-2.5-4 deg, small overshoot (objects must be built with hidden:true)
  function place(tl, o, t, po) {
    po = po || {};
    var dir = po.from || "bottom", dist = po.dist || 40, rot = po.rot != null ? po.rot : 3;
    var dx = dir === "left" ? -dist : dir === "right" ? dist : 0, dy = dir === "top" ? -dist : dir === "bottom" ? dist : 0;
    tw(tl, o, t, { dx: dx, dy: dy, r: rot }, { dx: 0, dy: 0, r: 0 }, po.dur || 0.55, "back.out(1.2)");
    tw(tl, o, t, { o: 0 }, { o: 1 }, 0.12, "none");
  }
  // Kit.exit lift equivalent for proxy objects: up 26 px, +-3.5 deg, scale 1.03, fade, 0.5 s power2.in
  function lift(tl, o, t, po) {
    po = po || {};
    tw(tl, o, t, { dy: o.p.dy, r: 0, ds: 1, o: 1 }, { dy: o.p.dy - 26, r: po.rot != null ? po.rot : 3.5, ds: 1.03, o: 0 }, po.dur || 0.5, "power2.in");
  }

  // ------------------------------------------------------------ heat arrow (soft red-gold wavy arrow, drawn on, then flowing)
  function catmull(pts, k) {
    if (pts.length < 3) { k = k || 16; var o2 = []; for (var j = 0; j <= k; j++) o2.push([pts[0][0] + (pts[1][0] - pts[0][0]) * j / k, pts[0][1] + (pts[1][1] - pts[0][1]) * j / k]); return o2; }
    var out = [], n = pts.length;
    for (var i = 0; i < n - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      for (var s = 0; s < k; s++) {
        var t = s / k, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(pts[n - 1]);
    return out;
  }
  function wavyPath(pts, amp, wl) {
    var base = catmull(pts, 24), L = [0], i;
    for (i = 1; i < base.length; i++) L.push(L[i - 1] + Math.hypot(base[i][0] - base[i - 1][0], base[i][1] - base[i - 1][1]));
    var tot = L[L.length - 1], out = [];
    for (i = 0; i < base.length; i++) {
      var a = base[Math.max(0, i - 1)], b = base[Math.min(base.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
      var u = L[i] / tot, env = Math.min(1, u * 5, (1 - u) * 5), off = amp * Math.sin(2 * Math.PI * L[i] / wl) * env;
      out.push([base[i][0] - dy / m * off, base[i][1] + dx / m * off]);
    }
    return out.map(function (p, k) { return (k ? "L" : "M") + f2(p[0]) + "," + f2(p[1]); }).join("");
  }
  function heatArrow(st, parent, pts, o) {
    o = o || {};
    var sw = o.sw || 7, d = wavyPath(pts, o.amp == null ? 9 : o.amp, o.wl || 80);
    var g = S("g", { class: "c1-heat" }, parent);
    var glow = S("path", { d: d, fill: "none", stroke: hex("gold"), "stroke-width": sw + 9, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.3 }, g);
    var main = S("path", { d: d, fill: "none", stroke: hex("red"), "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    var core = S("path", { d: d, fill: "none", stroke: hex("gold"), "stroke-width": Math.max(1.5, sw * 0.32), "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.9 }, g);
    var flow = S("path", { d: d, fill: "none", stroke: "#FCE59E", "stroke-width": Math.max(2, sw * 0.45), "stroke-linecap": "round", "stroke-dasharray": "10 30", opacity: 0 }, g);
    var hs = o.head || (sw * 2.6);
    var head = S("path", { d: "M0,0 L" + (-hs) + "," + (-hs * 0.62) + " L" + (-hs * 0.7) + ",0 L" + (-hs) + "," + (hs * 0.62) + "Z", fill: hex("red"), opacity: 0 }, g);
    var len = main.getTotalLength();
    var strokes = [glow, main, core];
    var api = { g: g, d: d, len: len, p: { v: 0 } };
    api.render = function () {
      var v = api.p.v, L = len * v;
      strokes.forEach(function (s) { s.setAttribute("stroke-dasharray", f2(len) + " " + f2(len + 20)); s.setAttribute("stroke-dashoffset", f2(len - L)); });
      if (v <= 0.001) { head.setAttribute("opacity", 0); return; }
      var pt = main.getPointAtLength(L), pb = main.getPointAtLength(Math.max(0, L - 6));
      var ang = Math.atan2(pt.y - pb.y, pt.x - pb.x) * 180 / Math.PI;
      head.setAttribute("transform", "translate(" + f2(pt.x) + "," + f2(pt.y) + ") rotate(" + f2(ang) + ")");
      head.setAttribute("opacity", 1);
    };
    api.render();
    api.draw = function (tl, t, dur) {
      tl.fromTo(api.p, { v: 0 }, { v: 1, duration: dur || 1, ease: "power2.inOut", onUpdate: api.render, immediateRender: false, lazy: false }, t);
      return api;
    };
    api.flow = function (tl, t, dur, speed) {
      tl.fromTo(flow, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -(speed || 70) * dur }, duration: dur, ease: "none", immediateRender: false, lazy: false }, t);
      tl.fromTo(flow, { opacity: 0 }, { opacity: 0.95, duration: 0.4, ease: "power1.out", immediateRender: false, lazy: false }, t);
      return api;
    };
    return api;
  }

  // ------------------------------------------------------------ paper thermometer (column red when warm, blue when cold)
  function thermo(st, parent, o) {
    o = o || {};
    var h = o.h || 150, g = S("g", null, parent), top = -h / 2, bot = h / 2;
    draw(st, g, [
      { d: rr(-13, top - 4, 26, h + 8, 13), fill: "#F4F0E6" },
      { circle: [0, bot + 16, 21], fill: "#F4F0E6" }
    ]);
    var ticks = "";
    for (var i = 0; i < 6; i++) { var y = top + 10 + i * (h - 20) / 5; ticks += "M7," + f2(y) + " H15 "; }
    S("path", { d: ticks, stroke: hex("ink2"), "stroke-width": 2, "stroke-linecap": "round", fill: "none" }, g);
    var bulb = S("circle", { cx: 0, cy: bot + 16, r: 14 }, g);
    var col = S("rect", { x: -5, width: 10, rx: 5 }, g);
    var api = { g: g, p: { v: o.v == null ? 0.5 : o.v, c: o.c == null ? 1 : o.c } };
    function mix(c) { // 1 = red, 0 = blue
      var a = [0xC0, 0x3F, 0x27], b = [0x3F, 0x73, 0x98];
      return "rgb(" + a.map(function (x, k) { return Math.round(b[k] + (x - b[k]) * c); }).join(",") + ")";
    }
    api.render = function () {
      var yTop = bot + 4 - (h - 4) * api.p.v, cc = mix(api.p.c);
      col.setAttribute("y", f2(yTop)); col.setAttribute("height", f2(bot + 10 - yTop));
      col.setAttribute("fill", cc); bulb.setAttribute("fill", cc);
    };
    api.render();
    api.to = function (tl, t, v, c, dur) {
      tl.fromTo(api.p, { v: api.p.v, c: api.p.c }, { v: v, c: c, duration: dur || 0.8, ease: "power2.inOut", onUpdate: api.render, immediateRender: false, lazy: false }, t);
      api.p.v = v; api.p.c = c; // later tweens start from here (build in time order)
      return api;
    };
    return api;
  }

  window.C1 = { S: S, rr: rr, draw: draw, ICONS: ICONS, REASONS: REASONS, obj: obj, tw: tw, place: place, lift: lift,
    heatArrow: heatArrow, wavyPath: wavyPath, thermo: thermo, hex: hex, f2: f2 };
})();
