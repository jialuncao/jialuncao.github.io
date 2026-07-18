// ══════════════════════════════════════════
// Theme
// ══════════════════════════════════════════
function toggleTheme() {
  var d = document.documentElement.getAttribute('data-theme') === 'dark';
  if (d) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
  else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
  updateThemeIcon();
}
function updateThemeIcon() {
  var d = document.documentElement.getAttribute('data-theme') === 'dark';
  var el = document.getElementById('themeBtn');
  if (el) el.textContent = d ? '☀ Dark' : '☾ Light';
}
(function() {
  if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeIcon();
})();

// ══════════════════════════════════════════
// Matrix rain (amber) in hero
// ══════════════════════════════════════════
(function() {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var hero = canvas.parentElement;
  var chars = '01{}[]()<>/\\|=+*#$%&ABCDEF0xnullreqACKSYNfuzz'.split('');
  var fontSize = 14, cols = 0, drops = [];

  function resize() {
    var w = hero.clientWidth, h = hero.clientHeight;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(w / fontSize);
    drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(12,10,6,0.10)';
    ctx.fillRect(0, 0, hero.clientWidth, hero.clientHeight);
    ctx.font = fontSize + 'px "IBM Plex Mono", monospace';
    for (var i = 0; i < cols; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      var x = i * fontSize, y = drops[i] * fontSize;
      // leading (brighter) char
      ctx.fillStyle = Math.random() > 0.975 ? '#ffd98a' : '#d97706';
      ctx.fillText(ch, x, y);
      if (y > hero.clientHeight && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  }
  setInterval(draw, 55);
})();

// ══════════════════════════════════════════
// Terminal log append engine
// ══════════════════════════════════════════
// token = optional { cancelled: bool } so a hover-replay can stop a stale chain
function appendLog(el, lines, speed, done, token) {
  el.innerHTML = '';
  var i = 0;
  function step() {
    if (token && token.cancelled) return;
    var prev = el.querySelector('.cursor');
    if (prev) prev.remove();
    if (i >= lines.length) { if (done) done(); return; }
    var div = document.createElement('div');
    div.innerHTML = lines[i] + '<span class="cursor"></span>';
    el.appendChild(div);
    i++;
    setTimeout(step, speed);
  }
  step();
}

// count-up numeric helper
// stillValid = optional fn(); if it returns false the in-flight frame loop stops
function countUp(el, target, dur, decimals, suffix, stillValid) {
  var start = null, from = 0;
  function frame(ts) {
    if (stillValid && !stillValid()) return;
    if (!start) start = ts;
    var t = Math.min((ts - start) / dur, 1);
    var v = from + (target - from) * (1 - Math.pow(1 - t, 3));
    el.textContent = v.toFixed(decimals) + (suffix || '');
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals) + (suffix || '');
  }
  requestAnimationFrame(frame);
}

// force a synchronous style/layout flush so a class removed then re-added
// (reset immediately followed by replay) actually restarts its CSS animation
function reflow(el) { if (el) { void el.offsetHeight; } }

// ══════════════════════════════════════════
// VIS 1: RegexScalpel
// ══════════════════════════════════════════
var rsTimers = [];
function rsLater(fn, ms) { var id = setTimeout(fn, ms); rsTimers.push(id); return id; }
function rsClearTimers() { rsTimers.forEach(clearTimeout); rsTimers = []; }
var rsGen = 0;
var rsRunning = false;
var RS_TOTAL_MS = 4700;

function startRegexScalpel() {
  var myGen = rsGen;
  var scan = document.getElementById('rsScan');
  var vuln = document.querySelectorAll('#rsRegex .rc[data-v]');
  var vbad = document.getElementById('rsVerdictBad');
  var vgood = document.getElementById('rsVerdictGood');
  var fix = document.getElementById('rsFix');
  var bars = document.querySelectorAll('#btWrap .bt-bar');

  scan.classList.add('run');
  // mark vulnerable sub-pattern as scan passes over it
  rsLater(function() { vuln.forEach(function(s) { s.classList.add('vuln'); }); }, 1000);
  rsLater(function() { vbad.classList.add('show'); }, 1650);

  // exponential backtracking bars grow
  bars.forEach(function(b, i) {
    rsLater(function() { b.style.height = b.getAttribute('data-h') + 'px'; }, 1900 + i * 130);
  });

  // before timing
  rsLater(function() {
    countUp(document.getElementById('rsBefore'), 12.4, 900, 1, 's', function() { return myGen === rsGen; });
  }, 2000);

  // apply fix
  rsLater(function() {
    vuln.forEach(function(s) { s.classList.remove('vuln'); s.classList.add('struck'); });
    fix.classList.remove('hidden');
    vbad.classList.remove('show');
    vgood.classList.add('show');
    countUp(document.getElementById('rsAfter'), 0.003, 700, 3, 's', function() { return myGen === rsGen; });
  }, 3600);
}

function resetRegexScalpel() {
  rsClearTimers();
  rsGen++; // invalidate any in-flight countUp frames from the previous run
  var scan = document.getElementById('rsScan');
  scan.classList.remove('run');
  document.querySelectorAll('#rsRegex .rc[data-v]').forEach(function(s) { s.classList.remove('vuln', 'struck'); });
  document.getElementById('rsFix').classList.add('hidden');
  document.getElementById('rsVerdictBad').classList.remove('show');
  document.getElementById('rsVerdictGood').classList.remove('show');
  document.querySelectorAll('#btWrap .bt-bar').forEach(function(b) { b.style.height = '0'; });
  document.getElementById('rsBefore').textContent = '—';
  document.getElementById('rsAfter').textContent = '—';
  reflow(document.getElementById('sec-regexscalpel'));
}

function triggerRegexScalpel() {
  if (rsRunning) resetRegexScalpel();
  rsRunning = true;
  startRegexScalpel();
  rsLater(function() { rsRunning = false; }, RS_TOTAL_MS);
}

// ══════════════════════════════════════════
// VIS 2: ReDoSHunter (static NFA + dynamic meter)
// ══════════════════════════════════════════
var rhTimers = [];
function rhLater(fn, ms) { var id = setTimeout(fn, ms); rhTimers.push(id); return id; }
function rhClearTimers() { rhTimers.forEach(clearTimeout); rhTimers = []; }
var rhToken = null;
var rhRunning = false;
var RH_TOTAL_MS = 5900;

function startReDoSHunter() {
  rhToken = { cancelled: false };
  var myToken = rhToken;

  function nodeEl(i) { return document.querySelector('.nfa-node[data-i="' + i + '"]'); }
  function edgeEl(i) { return document.querySelector('.nfa-edge[data-i="' + i + '"]'); }
  function lblEl(i) { return document.querySelector('.nfa-elabel[data-i="' + i + '"]'); }

  // reveal order: q0, e0, q1, e2(amb), e3(amb), q2, e4, qf, e5
  var seq = [
    nodeEl(0), edgeEl(0), lblEl(0),
    nodeEl(1), edgeEl(2), lblEl(2), edgeEl(3), lblEl(3),
    nodeEl(4), edgeEl(4), lblEl(4),
    nodeEl(6), edgeEl(5), lblEl(5)
  ];
  var d = 0;
  seq.forEach(function(el) {
    if (!el) return;
    rhLater(function() { el.classList.add('show'); }, d);
    d += 180;
  });

  // dynamic phase after static graph is built
  rhLater(function() { runDynamic(myToken); }, d + 400);

  function runDynamic(token) {
    var fill = document.getElementById('rhMeterFill');
    var val = document.getElementById('rhMeterVal');
    var log = document.getElementById('rhLog');
    appendLog(log, [
      '<span class="l-info">&gt; feeding attack string</span>',
      '<span class="l-info">&gt; match /^(a+)+$/ on "a"&times;32 + "!"</span>',
      '<span class="l-amber">&gt; backtracking&hellip; steps=2.1&times;10&#8313;</span>'
    ], 520, null, token);

    // meter rises
    var start = null, target = 8.42, flagged = false;
    function frame(ts) {
      if (token.cancelled) return;
      if (!start) start = ts;
      var t = Math.min((ts - start) / 2600, 1);
      var pct = t * 100;
      fill.style.width = pct + '%';
      val.textContent = (t * target).toFixed(3) + 's';
      if (pct >= 70 && !flagged) {
        flagged = true;
        var d1 = document.createElement('div');
        d1.innerHTML = '<span class="l-red">&#9888; ReDoS VULNERABILITY DETECTED</span>';
        log.appendChild(d1);
      }
      if (t < 1) requestAnimationFrame(frame);
      else {
        var d2 = document.createElement('div');
        d2.innerHTML = '<span class="l-red">&#10007; exec 8.42s &gt; budget &middot; pattern rejected</span>';
        log.appendChild(d2);
      }
    }
    requestAnimationFrame(frame);
  }
}

function resetReDoSHunter() {
  rhClearTimers();
  if (rhToken) rhToken.cancelled = true; // stop any in-flight rAF meter / log chain
  document.querySelectorAll('#rhNfa .nfa-node, #rhNfa .nfa-edge, #rhNfa .nfa-elabel').forEach(function(el) {
    el.classList.remove('show');
  });
  document.getElementById('rhMeterFill').style.width = '0%';
  document.getElementById('rhMeterVal').textContent = '0.000s';
  document.getElementById('rhLog').innerHTML = '';
  reflow(document.getElementById('sec-redoshunter'));
}

function triggerReDoSHunter() {
  if (rhRunning) resetReDoSHunter();
  rhRunning = true;
  startReDoSHunter();
  rhLater(function() { rhRunning = false; }, RH_TOTAL_MS);
}

// ══════════════════════════════════════════
// VIS 3: Stateful protocol fuzzing
// ══════════════════════════════════════════
var fuzzTimers = [];
function fuzzLater(fn, ms) { var id = setTimeout(fn, ms); fuzzTimers.push(id); return id; }
function fuzzClearTimers() { fuzzTimers.forEach(clearTimeout); fuzzTimers = []; }
var fuzzToken = null;
var fuzzRunning = false;
var FUZZ_TOTAL_MS = 7500;

function startFuzzing() {
  fuzzToken = { cancelled: false };
  var myToken = fuzzToken;
  var svg = document.getElementById('fuzzSvg');
  var N = [[60, 120], [190, 55], [333, 55], [478, 120], [333, 185]];
  var NAME = ['INIT', 'CONNECT', 'AUTH', 'DATA', 'CLOSE'];
  var sentEl = document.getElementById('fuzzSent');
  var crashEl = document.getElementById('fuzzCrash');
  var log = document.getElementById('fuzzLog');
  var sent = 0;

  function node(s) { return document.querySelector('.fsm-node[data-s="' + s + '"]'); }
  function logLine(html) {
    var prev = log.querySelector('.cursor'); if (prev) prev.remove();
    var div = document.createElement('div');
    div.innerHTML = html + '<span class="cursor"></span>';
    log.appendChild(div);
  }

  function packet(from, to, bad, dur, onArrive) {
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', bad ? 5 : 4);
    c.setAttribute('class', 'fuzz-packet' + (bad ? ' bad' : ''));
    svg.appendChild(c);
    var a = N[from], b = N[to], start = null;
    function frame(ts) {
      if (myToken.cancelled) { c.remove(); return; }
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      c.setAttribute('cx', a[0] + (b[0] - a[0]) * t);
      c.setAttribute('cy', a[1] + (b[1] - a[1]) * t);
      if (t < 1) requestAnimationFrame(frame);
      else { c.remove(); if (onArrive) onArrive(); }
    }
    requestAnimationFrame(frame);
  }

  function hit(s) {
    var n = node(s); if (!n) return;
    n.classList.add('hit');
    fuzzLater(function() { n.classList.remove('hit'); }, 480);
  }

  // scripted walk then a crash
  var steps = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 1], [1, 2]
  ];
  var idx = 0;
  function next() {
    if (myToken.cancelled) return;
    if (idx >= steps.length) { fuzzLater(crash, 500); return; }
    var st = steps[idx++];
    packet(st[0], st[1], false, 560, function() {
      sent++; sentEl.textContent = sent; hit(st[1]);
      logLine('<span class="l-blue">&rarr;</span> pkt#' + sent + ' <span class="l-info">' + NAME[st[0]] + '&rarr;' + NAME[st[1]] + '</span> <span class="l-green">ok</span>');
      fuzzLater(next, 260);
    });
  }

  function crash() {
    if (myToken.cancelled) return;
    var edge = document.getElementById('crashEdge');
    var clabel = document.getElementById('crashLabel');
    edge.classList.add('show');
    clabel.style.opacity = '1';
    packet(1, 3, true, 700, function() {
      sent++; sentEl.textContent = sent;
      crashEl.textContent = '1';
      node(3).classList.add('crashnode');
      logLine('<span class="l-red">&#9888; pkt#' + sent + ' CONNECT&rarr;DATA <b>UNEXPECTED</b></span>');
      logLine('<span class="l-red">&#10007; SIGSEGV &middot; auth state skipped</span>');
      document.getElementById('fuzzAlert').classList.add('show');
    });
  }

  fuzzLater(next, 300);
}

function resetFuzzing() {
  fuzzClearTimers();
  if (fuzzToken) fuzzToken.cancelled = true; // stop any in-flight packet rAF loop / chain
  document.querySelectorAll('#fuzzSvg .fuzz-packet').forEach(function(p) { p.remove(); });
  document.querySelectorAll('#fuzzSvg .fsm-node').forEach(function(n) { n.classList.remove('hit', 'crashnode'); });
  document.getElementById('crashEdge').classList.remove('show');
  document.getElementById('crashLabel').style.opacity = '0';
  document.getElementById('fuzzSent').textContent = '0';
  document.getElementById('fuzzCrash').textContent = '0';
  document.getElementById('fuzzLog').innerHTML = '';
  document.getElementById('fuzzAlert').classList.remove('show');
  reflow(document.getElementById('sec-fuzzing'));
}

function triggerFuzzing() {
  if (fuzzRunning) resetFuzzing();
  fuzzRunning = true;
  startFuzzing();
  fuzzLater(function() { fuzzRunning = false; }, FUZZ_TOTAL_MS);
}

// ══════════════════════════════════════════
// VIS 4: Vulnerable-version timeline
// ══════════════════════════════════════════
var verTimers = [];
function verLater(fn, ms) { var id = setTimeout(fn, ms); verTimers.push(id); return id; }
function verClearTimers() { verTimers.forEach(clearTimeout); verTimers = []; }
var verRunning = false;
var VER_TOTAL_MS = 3000;

function startVulnVersions() {
  var dots = document.querySelectorAll('#verDots .ver-dot');
  var intro = 2, fixIdx = 9; // affected v1.2..v1.8, fixed v1.9
  var lastAffected = fixIdx - 1;

  var timeline = document.querySelector('.ver-timeline');
  var fill = document.getElementById('verFill');

  function center(dot) {
    var r = dot.getBoundingClientRect();
    return r.left + r.width / 2;
  }

  // flash intro
  verLater(function() { dots[intro].classList.add('intro'); }, 200);

  // spread red forward
  var d = 700;
  for (var k = intro; k <= lastAffected; k++) {
    (function(k) {
      verLater(function() {
        dots[k].classList.remove('intro');
        dots[k].classList.add('affected');
        // grow the danger track fill
        var tlLeft = timeline.getBoundingClientRect().left;
        var startC = center(dots[intro]);
        var endC = center(dots[k]);
        fill.style.left = (startC - tlLeft) + 'px';
        fill.style.width = (endC - startC) + 'px';
      }, d);
      d += 260;
    })(k);
  }

  // fixed marker + bracket + stats
  verLater(function() {
    dots[fixIdx].classList.add('fixed');
    // bracket
    var bracket = document.getElementById('verBracket');
    var line = document.getElementById('verBracketLine');
    var label = document.getElementById('verBracketLabel');
    var bRect = bracket.getBoundingClientRect();
    var startC = center(dots[intro]);
    var endC = center(dots[lastAffected]);
    line.style.left = (startC - bRect.left) + 'px';
    line.style.width = (endC - startC) + 'px';
    label.style.left = ((startC + endC) / 2 - bRect.left) + 'px';
    bracket.classList.add('show');

    document.getElementById('verAffected').textContent = 'v1.2 – v1.8';
    document.getElementById('verFixed').textContent = 'v1.9';
    document.getElementById('verImpact').textContent = '7 versions';
  }, d + 200);
}

function resetVulnVersions() {
  verClearTimers();
  document.querySelectorAll('#verDots .ver-dot').forEach(function(dot) {
    dot.classList.remove('intro', 'affected', 'fixed');
  });
  var fill = document.getElementById('verFill');
  fill.style.left = '';
  fill.style.width = '';
  var bracket = document.getElementById('verBracket');
  bracket.classList.remove('show');
  document.getElementById('verBracketLine').style.left = '';
  document.getElementById('verBracketLine').style.width = '';
  document.getElementById('verBracketLabel').style.left = '';
  document.getElementById('verAffected').textContent = '—';
  document.getElementById('verFixed').textContent = '—';
  document.getElementById('verImpact').textContent = '—';
  reflow(document.getElementById('sec-vulnver'));
}

function triggerVulnVersions() {
  if (verRunning) resetVulnVersions();
  verRunning = true;
  startVulnVersions();
  verLater(function() { verRunning = false; }, VER_TOTAL_MS);
}

// ══════════════════════════════════════════
// VIS 5: SDEFL compact pipeline animation
// ══════════════════════════════════════════
var sdeflTimers = [];
function sdeflLater(fn, ms) { var id = setTimeout(fn, ms); sdeflTimers.push(id); return id; }
function sdeflClearTimers() { sdeflTimers.forEach(clearTimeout); sdeflTimers = []; }
var sdeflRunning = false;
var SDEFL_TOTAL_MS = 4200;

function startSDEFL() {
  var stages = document.querySelectorAll('#sdeflPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#sdeflPipe .mini-pipe-sep');
  var scanFill = document.getElementById('sdeflScanFill');
  var result = document.getElementById('sdeflResult');

  // Light up stages sequentially
  var delay = 200;
  stages.forEach(function(stage, i) {
    sdeflLater(function() {
      stage.classList.add('on');
      if (i > 0) seps[i - 1].classList.add('on');
    }, delay);
    delay += 600;
  });

  // Start scan bar after stages are lit
  sdeflLater(function() {
    scanFill.style.width = '100%';
  }, delay);

  // Mark last two stages as success and show result
  sdeflLater(function() {
    stages[2].classList.add('success');
    stages[3].classList.add('success');
    result.style.opacity = '1';
  }, delay + 1200);
}

function resetSDEFL() {
  sdeflClearTimers();
  var stages = document.querySelectorAll('#sdeflPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#sdeflPipe .mini-pipe-sep');
  var scanFill = document.getElementById('sdeflScanFill');
  var result = document.getElementById('sdeflResult');

  stages.forEach(function(s) { s.classList.remove('on', 'success'); });
  seps.forEach(function(s) { s.classList.remove('on'); });
  scanFill.style.width = '0';
  result.style.opacity = '0';
  reflow(document.getElementById('sec-sdefl'));
}

function triggerSDEFL() {
  if (sdeflRunning) resetSDEFL();
  sdeflRunning = true;
  startSDEFL();
  sdeflLater(function() { sdeflRunning = false; }, SDEFL_TOTAL_MS);
}

// ══════════════════════════════════════════
// Hover triggers for the featured demos
// ══════════════════════════════════════════
(function() {
  var triggers = [
    { sel: '#sec-regexscalpel', fn: triggerRegexScalpel, reset: resetRegexScalpel },
    { sel: '#sec-redoshunter', fn: triggerReDoSHunter, reset: resetReDoSHunter },
    { sel: '#sec-fuzzing', fn: triggerFuzzing, reset: resetFuzzing },
    { sel: '#sec-vulnver', fn: triggerVulnVersions, reset: resetVulnVersions },
    { sel: '#sec-sdefl', fn: triggerSDEFL, reset: resetSDEFL }
  ];
  triggers.forEach(function(t) {
    var el = document.querySelector(t.sel);
    if (!el) return;
    el.addEventListener('mouseenter', t.fn);
    el.addEventListener('mouseleave', function() {
      t.reset();
    });
  });

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var match = triggers.find(function(t) { return document.querySelector(t.sel) === e.target; });
        if (match) match.fn();
      });
    }, { threshold: 0.3 });
    triggers.forEach(function(t) {
      var el = document.querySelector(t.sel);
      if (el) obs.observe(el);
    });
  }
})();

// ══════════════════════════════════════════
// Nav active-link highlight on scroll
// ══════════════════════════════════════════
(function() {
  var links = document.querySelectorAll('.nav-link');
  var map = {};
  links.forEach(function(l) { map[l.getAttribute('href').slice(1)] = l; });
  var secs = document.querySelectorAll('.showcase[id]');
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        links.forEach(function(l) { l.classList.remove('active'); });
        var a = map[e.target.id]; if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  secs.forEach(function(s) { obs.observe(s); });
})();

// ══════════════════════════════════════════
// GSAP scroll animations
// ══════════════════════════════════════════
(function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-badge', { opacity: 0, y: 15, duration: 0.6, delay: 0.2 });
  gsap.from('.hero h1', { opacity: 0, y: 20, duration: 0.7, delay: 0.4 });
  gsap.from('.hero-sub', { opacity: 0, y: 15, duration: 0.6, delay: 0.7 });
  gsap.from('.hero-stat', { opacity: 0, y: 15, duration: 0.4, stagger: 0.1, delay: 0.9 });

  document.querySelectorAll('.gsap-fade').forEach(function(el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  setTimeout(function() {
    document.querySelectorAll('.gsap-fade').forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
  }, 3000);
})();
