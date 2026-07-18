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

// SVG helper
function ns(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

// ══════════════════════════════════════════
// Hero neural network background
// ══════════════════════════════════════════
(function() {
  var host = document.getElementById('heroBg');
  if (!host) return;
  var W = 1200, H = 700, cols = 6;
  var svg = ns('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  var layers = [];
  for (var c = 0; c < cols; c++) {
    var n = 3 + Math.floor(Math.random() * 3);
    var arr = [], x = (W / (cols + 1)) * (c + 1);
    for (var i = 0; i < n; i++) {
      arr.push({ x: x, y: (H / (n + 1)) * (i + 1) + (Math.random() * 46 - 23) });
    }
    layers.push(arr);
  }
  var eg = ns('g');
  for (var l = 0; l < layers.length - 1; l++) {
    layers[l].forEach(function(a) {
      layers[l + 1].forEach(function(b) {
        if (Math.random() < 0.55) {
          var ln = ns('line');
          ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y);
          ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
          ln.setAttribute('class', 'nn-bg-edge' + (Math.random() < 0.5 ? ' flow' : ''));
          ln.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
          eg.appendChild(ln);
        }
      });
    });
  }
  svg.appendChild(eg);
  var ng = ns('g');
  layers.forEach(function(arr) {
    arr.forEach(function(p) {
      var cc = ns('circle');
      cc.setAttribute('cx', p.x); cc.setAttribute('cy', p.y); cc.setAttribute('r', 3.5);
      cc.setAttribute('class', 'nn-bg-node');
      cc.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      ng.appendChild(cc);
    });
  });
  svg.appendChild(ng);
  host.appendChild(svg);
})();

// ══════════════════════════════════════════
// FEATURED 1 — DeepFD diagnostic scan
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var deepfdBuilt = false;
var deepfdRunning = false;
var deepfdTimers = [];
function deepfdLater(fn, ms) { var id = setTimeout(fn, ms); deepfdTimers.push(id); return id; }
function deepfdClearTimers() { deepfdTimers.forEach(clearTimeout); deepfdTimers = []; }

var deepfdLayerX = [90, 250, 410, 560];
var deepfdNodesByLayer = [];
var deepfdEdgesToLayer = [[], [], [], []];
var deepfdScanbar, deepfdLog, deepfdBar, deepfdStatus;

function buildDeepFD() {
  if (deepfdBuilt) return;
  deepfdBuilt = true;

  var layerSizes = [4, 5, 5, 3];
  var labels = ['Input', 'Dense', 'Dense', 'Output'];
  var cy0 = 152, gap = 42, r = 13;
  var edgesG = document.getElementById('nnEdges');
  var nodesG = document.getElementById('nnNodes');
  var labelsG = document.getElementById('nnLabels');

  var positions = layerSizes.map(function(n, li) {
    var arr = [], start = cy0 - (n - 1) * gap / 2;
    for (var i = 0; i < n; i++) arr.push({ x: deepfdLayerX[li], y: start + i * gap });
    return arr;
  });

  // edges
  for (var li = 0; li < positions.length - 1; li++) {
    positions[li].forEach(function(a) {
      positions[li + 1].forEach(function(b) {
        var ln = ns('line');
        ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y);
        ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
        ln.setAttribute('class', 'nn-edge');
        edgesG.appendChild(ln);
        deepfdEdgesToLayer[li + 1].push(ln);
      });
    });
  }
  // nodes
  positions.forEach(function(arr, li) {
    var group = [];
    arr.forEach(function(p) {
      var cc = ns('circle');
      cc.setAttribute('cx', p.x); cc.setAttribute('cy', p.y); cc.setAttribute('r', r);
      cc.setAttribute('class', 'nn-node');
      nodesG.appendChild(cc);
      group.push(cc);
    });
    deepfdNodesByLayer.push(group);
    var t = ns('text');
    t.setAttribute('x', deepfdLayerX[li]); t.setAttribute('y', 300);
    t.setAttribute('class', 'nn-layer-label');
    t.textContent = labels[li];
    labelsG.appendChild(t);
  });

  deepfdScanbar = document.getElementById('nnScanbar');
  deepfdLog = document.getElementById('diagLog');
  deepfdBar = document.getElementById('diagBar');
  deepfdStatus = document.getElementById('diagStatus');
}

function deepfdMoveScan(li) {
  deepfdScanbar.classList.add('on');
  deepfdScanbar.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
  deepfdScanbar.style.transform = 'translateX(' + (deepfdLayerX[li] - 65) + 'px)';
}
function deepfdScanLayer(li) { deepfdNodesByLayer[li].forEach(function(nd) { nd.classList.add('scanned'); }); deepfdEdgesToLayer[li].forEach(function(e) { e.classList.add('active'); }); }
function deepfdMarkBug(li, idx) { var nd = deepfdNodesByLayer[li][idx]; if (nd) { nd.classList.remove('scanned'); nd.classList.add('buggy'); } }
function deepfdAddLog(tag, ts, msg) {
  var line = document.createElement('div');
  line.className = 'diag-line';
  line.innerHTML = '<span class="ts">' + ts + '</span><span class="tag ' + tag + '">' + tag.toUpperCase() + '</span><span class="msg">' + msg + '</span>';
  deepfdLog.appendChild(line);
  requestAnimationFrame(function() { line.classList.add('show'); });
  deepfdLog.scrollTop = deepfdLog.scrollHeight;
}
function deepfdProg(p) { deepfdBar.style.width = p + '%'; }

// DeepFD diagnoses faults in the DL program / training setting — not individual
// neurons — via three steps: diagnostic feature extraction, fault diagnosis,
// fault localization. The layer-by-layer scan below is an illustrative overlay;
// the fault categories and headline numbers are real (ICSE '22).
function startDeepFD() {
  buildDeepFD();

  var T = [
    [0,    function() { deepfdStatus.textContent = 'scanning'; deepfdMoveScan(0); deepfdAddLog('scan', '00:01', 'Initializing diagnosis — extracting diagnostic features (step 1/3)…'); }],
    [700,  function() { deepfdScanLayer(0); deepfdAddLog('scan', '00:02', 'Layer 1 (input) — training config nominal'); deepfdProg(22); deepfdMoveScan(1); }],
    [1600, function() { deepfdScanLayer(1); deepfdAddLog('scan', '00:03', 'Layer 2 (dense) — diagnosing fault type (step 2/3)…'); deepfdProg(45); }],
    [2150, function() { deepfdMarkBug(1, 2); deepfdAddLog('bug', '00:04', 'Diagnosed: incorrect activation function (sigmoid, expected ReLU)'); }],
    [2700, function() { deepfdMoveScan(2); deepfdScanLayer(2); deepfdAddLog('scan', '00:05', 'Layer 3 (dense) — localizing fault (step 3/3)…'); deepfdProg(68); }],
    [3250, function() { deepfdMarkBug(2, 1); deepfdAddLog('bug', '00:06', 'Diagnosed: learning rate too large — loss diverging'); }],
    [3850, function() { deepfdMoveScan(3); deepfdScanLayer(3); deepfdAddLog('scan', '00:07', 'Layer 4 (output) — nominal'); deepfdProg(90); }],
    [4500, function() { deepfdScanbar.classList.remove('on'); deepfdProg(100); deepfdStatus.textContent = 'complete'; deepfdStatus.classList.add('done'); deepfdAddLog('ok', '00:08', 'Diagnosis complete — 52% of faulty programs correctly diagnosed (vs. 27% SOTA), 42% localized (vs. 23%)'); }]
  ];
  T.forEach(function(step) { deepfdLater(step[1], step[0]); });
}

function resetDeepFD() {
  deepfdClearTimers();
  if (!deepfdBuilt) return;
  deepfdNodesByLayer.forEach(function(group) { group.forEach(function(nd) { nd.classList.remove('scanned', 'buggy'); }); });
  deepfdEdgesToLayer.forEach(function(arr) { arr.forEach(function(e) { e.classList.remove('active'); }); });
  if (deepfdScanbar) {
    deepfdScanbar.classList.remove('on');
    deepfdScanbar.style.transition = 'none';
    deepfdScanbar.style.transform = 'translateX(0px)';
    deepfdScanbar.getBoundingClientRect(); // reflow so the next animated move isn't skipped
  }
  if (deepfdLog) deepfdLog.innerHTML = '';
  if (deepfdBar) deepfdBar.style.width = '0%';
  if (deepfdStatus) { deepfdStatus.textContent = 'idle'; deepfdStatus.classList.remove('done'); }
}

var DEEPFD_TOTAL_MS = 5200;
function triggerDeepFD() {
  if (deepfdRunning) resetDeepFD();
  deepfdRunning = true;
  startDeepFD();
  deepfdLater(function() { deepfdRunning = false; }, DEEPFD_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 2 — SemMT translation testing
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var semmtRunning = false;
var semmtTimers = [];
function semmtLater(fn, ms) { var id = setTimeout(fn, ms); semmtTimers.push(id); return id; }
function semmtClearTimers() { semmtTimers.forEach(clearTimeout); semmtTimers = []; }

function startSemMT() {
  var pathA = document.getElementById('pathA');
  var pathB = document.getElementById('pathB');

  semmtLater(function() { pathA.classList.add('show'); }, 200);
  semmtLater(function() { pathB.classList.add('show'); }, 550);

  semmtLater(function() {
    document.getElementById('fillA').style.width = '94%';
    document.getElementById('simA').textContent = '0.94';
    document.getElementById('simA').style.color = 'var(--pass)';
  }, 1000);
  semmtLater(function() { document.getElementById('verdictA').classList.add('show'); }, 1700);

  semmtLater(function() {
    document.getElementById('fillB').style.width = '38%';
    document.getElementById('simB').textContent = '0.38';
    document.getElementById('simB').style.color = 'var(--bug)';
  }, 1400);
  semmtLater(function() {
    document.getElementById('verdictB').classList.add('show');
    pathB.classList.add('flagged');
  }, 2200);
}

function resetSemMT() {
  semmtClearTimers();
  ['pathA', 'pathB'].forEach(function(id) { var el = document.getElementById(id); if (el) el.classList.remove('show', 'flagged'); });
  ['fillA', 'fillB'].forEach(function(id) { var el = document.getElementById(id); if (el) el.style.width = '0%'; });
  ['simA', 'simB'].forEach(function(id) { var el = document.getElementById(id); if (el) { el.textContent = '—'; el.style.color = ''; } });
  ['verdictA', 'verdictB'].forEach(function(id) { var el = document.getElementById(id); if (el) el.classList.remove('show'); });
}

var SEMMT_TOTAL_MS = 2600;
function triggerSemMT() {
  if (semmtRunning) resetSemMT();
  semmtRunning = true;
  startSemMT();
  semmtLater(function() { semmtRunning = false; }, SEMMT_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 3 — Crest coreference metamorphic test
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var crestRunning = false;
var crestTimers = [];
function crestLater(fn, ms) { var id = setTimeout(fn, ms); crestTimers.push(id); return id; }
function crestClearTimers() { crestTimers.forEach(clearTimeout); crestTimers = []; }

var crestState = null;
function mEl(id) { return document.querySelector('.mention[data-id="' + id + '"]'); }

function drawCrest(links, animate) {
  var svg = document.getElementById('crestLinks');
  var stage = document.querySelector('.crest-stage');
  if (!svg || !stage) return;
  svg.innerHTML = '';
  var sr = stage.getBoundingClientRect();
  links.forEach(function(lk, i) {
    var a = mEl(lk.from), b = mEl(lk.to);
    if (!a || !b) return;
    var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    var x1 = ra.left + ra.width / 2 - sr.left, y1 = ra.top - sr.top;
    var x2 = rb.left + rb.width / 2 - sr.left, y2 = rb.top - sr.top;
    var cx = (x1 + x2) / 2, cyv = Math.min(y1, y2) - 36;
    var p = ns('path');
    p.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cyv + ' ' + x2 + ' ' + y2);
    p.setAttribute('class', 'crest-link-path');
    if (lk.cls === 'e2') p.style.stroke = 'var(--pass)';
    if (lk.cls === 'bad') { p.classList.add('bad'); }
    svg.appendChild(p);
    if (lk.cls !== 'bad') {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.getBoundingClientRect(); // reflow
      if (animate) { (function(pp, d) { crestLater(function() { pp.style.strokeDashoffset = 0; }, 60 + d * 220); })(p, i); }
      else p.style.strokeDashoffset = 0;
    }
  });
}

// Crest's metamorphic relation is built from constituency & dependency relations
// that must preserve the same coreference across a test pair — this rename is
// one illustrative instance of that transform, not a "same-gender swap".
var crestOriginal = [{ from: 'he', to: 'john', cls: 'e1' }, { from: 'she', to: 'mary', cls: 'e2' }];
var crestMutated = [{ from: 'he', to: 'mary', cls: 'bad' }, { from: 'she', to: 'mary', cls: 'e2' }];

function startCrest() {
  crestState = crestOriginal;
  drawCrest(crestOriginal, true);

  crestLater(function() {
    var badge = document.getElementById('crestBadge');
    badge.textContent = 'Metamorphic transform:  John → David';
    badge.classList.add('mr');
    var j = mEl('john');
    j.textContent = 'David';
    j.classList.add('swapped');
  }, 2800);

  crestLater(function() {
    crestState = crestMutated;
    drawCrest(crestMutated, true);
    mEl('he').classList.add('buggy');
    mEl('mary').classList.add('buggy');
    document.getElementById('crestBugs').textContent = '1';
    var badge = document.getElementById('crestBadge');
    badge.textContent = 'Inconsistency — “he” relinked after rename';
  }, 3800);
}

function resetCrest() {
  crestClearTimers();
  var svg = document.getElementById('crestLinks');
  if (svg) svg.innerHTML = '';
  var badge = document.getElementById('crestBadge');
  if (badge) { badge.textContent = 'Original passage'; badge.classList.remove('mr'); }
  var j = mEl('john');
  if (j) { j.textContent = 'John'; j.classList.remove('swapped'); }
  var he = mEl('he'), mary = mEl('mary');
  if (he) he.classList.remove('buggy');
  if (mary) mary.classList.remove('buggy');
  var bugs = document.getElementById('crestBugs');
  if (bugs) bugs.textContent = '0';
  crestState = null;
}

var CREST_TOTAL_MS = 4200;
function triggerCrest() {
  if (crestRunning) resetCrest();
  crestRunning = true;
  startCrest();
  crestLater(function() { crestRunning = false; }, CREST_TOTAL_MS);
}

window.addEventListener('resize', function() {
  if (crestState) drawCrest(crestState, false);
});

// ══════════════════════════════════════════
// FEATURED 4 — COMET coverage grid + coverage-dimension bars
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var cometBuilt = false;
var cometRunning = false;
var cometTimers = [];
function cometLater(fn, ms) { var id = setTimeout(fn, ms); cometTimers.push(id); return id; }
function cometClearTimers() { cometTimers.forEach(clearTimeout); cometTimers = []; }
var cometAnimToken = 0;

var cometCells = [];
var COMET_TOTAL = 36;
var COMET_BUGSET = { 8: 1, 15: 1, 24: 1, 31: 1 };
var COMET_FINAL_MODELS = 850;  // real: ~800–900 valid models generated in 6h
var COMET_FINAL_COV = 69.7;    // real: layer-input coverage (COMET) vs. 34.1% baseline
var COMET_TOTAL_BUGS = 32;     // real: 32 new bugs found across 8 DL libraries (incl. TensorFlow, MXNet)

function buildCOMET() {
  if (cometBuilt) return;
  cometBuilt = true;
  var grid = document.getElementById('covGrid');
  for (var i = 0; i < COMET_TOTAL; i++) {
    var c = document.createElement('div');
    c.className = 'cov-cell';
    grid.appendChild(c);
    cometCells.push(c);
  }
}

function startCOMET() {
  buildCOMET();
  var pctEl = document.getElementById('covPct');
  var modelsEl = document.getElementById('covModels');
  var bugsEl = document.getElementById('covBugs');
  var bugHits = Object.keys(COMET_BUGSET).length;
  var bugsPerHit = COMET_TOTAL_BUGS / bugHits;
  var bugsFound = 0;

  cometCells.forEach(function(c, i) {
    cometLater(function() {
      if (COMET_BUGSET[i]) { c.classList.add('bug'); c.textContent = '✕'; bugsFound += bugsPerHit; }
      else { c.classList.add('pass'); c.textContent = '✓'; }
      var done = i + 1;
      modelsEl.textContent = Math.round((done / COMET_TOTAL) * COMET_FINAL_MODELS);
      pctEl.textContent = ((done / COMET_TOTAL) * COMET_FINAL_COV).toFixed(1);
      bugsEl.textContent = Math.round(bugsFound);
    }, 120 + i * 85);
  });

  // Coverage-dimension bars after the grid mostly fills
  cometLater(function() {
    var token = cometAnimToken;
    document.querySelectorAll('#barChart .bar-row').forEach(function(row, k) {
      var fill = row.querySelector('.bar-fill');
      var val = row.querySelector('.bar-val');
      var pct = parseFloat(fill.getAttribute('data-pct'));
      cometLater(function() {
        fill.style.width = pct + '%';
        var start = null, dur = 1000;
        function step(ts) {
          if (token !== cometAnimToken) return; // stale loop from a cancelled run
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          val.textContent = (t * pct).toFixed(1) + '%';
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, k * 160);
    });
  }, 1400);
}

function resetCOMET() {
  cometClearTimers();
  cometAnimToken++; // invalidate any in-flight rAF count-up loop
  cometCells.forEach(function(c) { c.classList.remove('pass', 'bug'); c.textContent = ''; });
  var pctEl = document.getElementById('covPct');
  var modelsEl = document.getElementById('covModels');
  var bugsEl = document.getElementById('covBugs');
  if (pctEl) pctEl.textContent = '0';
  if (modelsEl) modelsEl.textContent = '0';
  if (bugsEl) bugsEl.textContent = '0';
  document.querySelectorAll('#barChart .bar-row').forEach(function(row) {
    var fill = row.querySelector('.bar-fill');
    var val = row.querySelector('.bar-val');
    if (fill) fill.style.width = '0%';
    if (val) val.textContent = '0%';
  });
}

var COMET_TOTAL_MS = 3600;
function triggerCOMET() {
  if (cometRunning) resetCOMET();
  cometRunning = true;
  startCOMET();
  cometLater(function() { cometRunning = false; }, COMET_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 5 — MR-Adopt pipeline animation
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var mradoptRunning = false;
var mradoptTimers = [];
function mradoptLater(fn, ms) { var id = setTimeout(fn, ms); mradoptTimers.push(id); return id; }
function mradoptClearTimers() { mradoptTimers.forEach(clearTimeout); mradoptTimers = []; }

function startMRAdopt() {
  var stages = document.querySelectorAll('#mradoptPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#mradoptPipe .mini-pipe-sep');
  var stat = document.getElementById('mradoptStat');
  stages.forEach(function(s, i) {
    mradoptLater(function() {
      s.classList.add('on');
      if (i > 0 && seps[i - 1]) seps[i - 1].classList.add('on');
    }, 300 + i * 500);
  });
  mradoptLater(function() { if (stat) stat.classList.add('on'); }, 300 + stages.length * 500 + 300);
}

function resetMRAdopt() {
  mradoptClearTimers();
  document.querySelectorAll('#mradoptPipe .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  document.querySelectorAll('#mradoptPipe .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var stat = document.getElementById('mradoptStat');
  if (stat) stat.classList.remove('on');
}

var MRADOPT_TOTAL_MS = 2500;
function triggerMRAdopt() {
  if (mradoptRunning) resetMRAdopt();
  mradoptRunning = true;
  startMRAdopt();
  mradoptLater(function() { mradoptRunning = false; }, MRADOPT_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 6 — SemBIC commit timeline animation
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var sembicBuilt = false;
var sembicRunning = false;
var sembicTimers = [];
function sembicLater(fn, ms) { var id = setTimeout(fn, ms); sembicTimers.push(id); return id; }
function sembicClearTimers() { sembicTimers.forEach(clearTimeout); sembicTimers = []; }

var SEMBIC_DOTS = 12;
var SEMBIC_BUG_IDX = 8;

function buildSemBIC() {
  if (sembicBuilt) return;
  sembicBuilt = true;
  var timeline = document.getElementById('sembicTimeline');
  if (!timeline) return;
  for (var i = 0; i < SEMBIC_DOTS; i++) {
    var dot = document.createElement('div');
    dot.className = 'commit-dot';
    dot.setAttribute('data-idx', i);
    timeline.appendChild(dot);
  }
}

function startSemBIC() {
  buildSemBIC();
  var dots = document.querySelectorAll('#sembicTimeline .commit-dot');
  var stages = document.querySelectorAll('#sembicPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#sembicPipe .mini-pipe-sep');

  dots.forEach(function(dot, i) {
    sembicLater(function() {
      dot.classList.add('on');
      if (i === SEMBIC_BUG_IDX) {
        dot.classList.add('bug-commit');
      }
    }, 100 + i * 120);
  });

  var pipeStart = 100 + SEMBIC_DOTS * 120 + 200;
  stages.forEach(function(s, i) {
    sembicLater(function() {
      s.classList.add('on');
      if (i > 0 && seps[i - 1]) seps[i - 1].classList.add('on');
    }, pipeStart + i * 400);
  });
}

function resetSemBIC() {
  sembicClearTimers();
  document.querySelectorAll('#sembicTimeline .commit-dot').forEach(function(d) { d.classList.remove('on', 'bug-commit'); });
  document.querySelectorAll('#sembicPipe .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  document.querySelectorAll('#sembicPipe .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
}

var SEMBIC_TOTAL_MS = 3200;
function triggerSemBIC() {
  if (sembicRunning) resetSemBIC();
  sembicRunning = true;
  startSemBIC();
  sembicLater(function() { sembicRunning = false; }, SEMBIC_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 7 — DLLens library boxes + pipeline
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var dllensRunning = false;
var dllensTimers = [];
function dllensLater(fn, ms) { var id = setTimeout(fn, ms); dllensTimers.push(id); return id; }
function dllensClearTimers() { dllensTimers.forEach(clearTimeout); dllensTimers = []; }

function startDLLens() {
  var boxes = document.querySelectorAll('#dllensBoxes .lib-box');
  var arrow = document.querySelector('#dllensBoxes .lib-arrow');
  var stages = document.querySelectorAll('#dllensPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#dllensPipe .mini-pipe-sep');
  var badge = document.getElementById('dllensBugs');

  boxes.forEach(function(b, i) {
    dllensLater(function() { b.classList.add('on'); }, 200 + i * 300);
  });
  dllensLater(function() { if (arrow) arrow.classList.add('on'); }, 500);

  stages.forEach(function(s, i) {
    dllensLater(function() {
      s.classList.add('on');
      if (i > 0 && seps[i - 1]) seps[i - 1].classList.add('on');
    }, 900 + i * 400);
  });

  dllensLater(function() { if (badge) badge.classList.add('on'); }, 900 + stages.length * 400 + 300);
}

function resetDLLens() {
  dllensClearTimers();
  document.querySelectorAll('#dllensBoxes .lib-box').forEach(function(b) { b.classList.remove('on'); });
  var arrow = document.querySelector('#dllensBoxes .lib-arrow');
  if (arrow) arrow.classList.remove('on');
  document.querySelectorAll('#dllensPipe .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  document.querySelectorAll('#dllensPipe .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var badge = document.getElementById('dllensBugs');
  if (badge) badge.classList.remove('on');
}

var DLLENS_TOTAL_MS = 3000;
function triggerDLLens() {
  if (dllensRunning) resetDLLens();
  dllensRunning = true;
  startDLLens();
  dllensLater(function() { dllensRunning = false; }, DLLENS_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 8 — ICM-Assistant pipeline animation
// (hover-triggered, replays on every hover)
// ══════════════════════════════════════════
var icmRunning = false;
var icmTimers = [];
function icmLater(fn, ms) { var id = setTimeout(fn, ms); icmTimers.push(id); return id; }
function icmClearTimers() { icmTimers.forEach(clearTimeout); icmTimers = []; }

function startICM() {
  var stages = document.querySelectorAll('#icmPipe .mini-pipe-stage');
  var seps = document.querySelectorAll('#icmPipe .mini-pipe-sep');
  var stat = document.getElementById('icmStat');
  stages.forEach(function(s, i) {
    icmLater(function() {
      s.classList.add('on');
      if (i > 0 && seps[i - 1]) seps[i - 1].classList.add('on');
    }, 250 + i * 450);
  });
  icmLater(function() { if (stat) stat.classList.add('on'); }, 250 + stages.length * 450 + 300);
}

function resetICM() {
  icmClearTimers();
  document.querySelectorAll('#icmPipe .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  document.querySelectorAll('#icmPipe .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var stat = document.getElementById('icmStat');
  if (stat) stat.classList.remove('on');
}

var ICM_TOTAL_MS = 2800;
function triggerICM() {
  if (icmRunning) resetICM();
  icmRunning = true;
  startICM();
  icmLater(function() { icmRunning = false; }, ICM_TOTAL_MS);
}

// ══════════════════════════════════════════
// Hover triggers — each featured demo plays on mouseenter and
// cleanly replays on every subsequent hover.
// ══════════════════════════════════════════
(function() {
  var triggers = [
    { sel: '#sec-deepfd', fn: triggerDeepFD, reset: resetDeepFD },
    { sel: '#sec-semmt', fn: triggerSemMT, reset: resetSemMT },
    { sel: '#sec-crest', fn: triggerCrest, reset: resetCrest },
    { sel: '#sec-comet', fn: triggerCOMET, reset: resetCOMET },
    { sel: '#sec-mradopt', fn: triggerMRAdopt, reset: resetMRAdopt },
    { sel: '#sec-sembic', fn: triggerSemBIC, reset: resetSemBIC },
    { sel: '#sec-dllens', fn: triggerDLLens, reset: resetDLLens },
    { sel: '#sec-icm', fn: triggerICM, reset: resetICM }
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
// Nav scrollspy
// ══════════════════════════════════════════
(function() {
  var links = document.querySelectorAll('.nav-link');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function(a) { map[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        links.forEach(function(a) { a.classList.remove('active'); });
        var a = map[e.target.id]; if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['sec-deepfd', 'sec-semmt', 'sec-crest', 'sec-comet', 'sec-mradopt', 'sec-sembic', 'sec-dllens', 'sec-icm'].forEach(function(id) {
    var s = document.getElementById(id); if (s) obs.observe(s);
  });
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
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  setTimeout(function() {
    document.querySelectorAll('.gsap-fade').forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
    });
  }, 3000);
})();
