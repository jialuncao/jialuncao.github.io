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

var PREFERS_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ══════════════════════════════════════════
// Count-up engine
// ══════════════════════════════════════════
function countUp(el, target, duration, suffix) {
  suffix = suffix || '';
  if (PREFERS_REDUCED) { el.textContent = target + suffix; return; }
  var start = null;
  var startVal = 0;
  duration = duration || 1200;
  function step(ts) {
    if (start === null) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    var val = Math.round(startVal + (target - startVal) * eased);
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

function countUpAll(root, duration) {
  root.querySelectorAll('[data-count]').forEach(function(el) {
    var t = parseInt(el.getAttribute('data-count'), 10);
    countUp(el, t, duration || 1200, '');
  });
}

// ══════════════════════════════════════════
// Hero stats
// ══════════════════════════════════════════
var heroStatsStarted = false;
function startHeroStats() {
  if (heroStatsStarted) return; heroStatsStarted = true;
  document.querySelectorAll('.hero-stat-num').forEach(function(el) {
    countUp(el, parseInt(el.getAttribute('data-count'), 10), 1400, '');
  });
}

// ══════════════════════════════════════════
// Featured 1: Survey — stats, 3R principles, decade finding
// ══════════════════════════════════════════
var surveyTimers = [];
function surveyLater(fn, ms) { var id = setTimeout(fn, ms); surveyTimers.push(id); return id; }
function surveyClearTimers() { surveyTimers.forEach(clearTimeout); surveyTimers = []; }
var SURVEY_TOTAL_MS = 2200;

function startSurvey() {
  // stat tiles
  var stats = document.getElementById('surveyStats');
  if (stats) countUpAll(stats, 1500);

  // 3R principle bars
  document.querySelectorAll('#catBars .cat-row').forEach(function(row, i) {
    var fill = row.querySelector('.cat-fill');
    var pct = fill.getAttribute('data-pct');
    surveyLater(function() {
      fill.style.width = pct + '%';
    }, 120 * i);
  });

  // decade comparison bars
  document.querySelectorAll('#timeline .tl-bar').forEach(function(bar, i) {
    var h = bar.getAttribute('data-h');
    surveyLater(function() {
      bar.style.height = h + '%';
      bar.classList.add('grown');
    }, 100 * i);
  });
}

function resetSurvey() {
  surveyClearTimers();
  var stats = document.getElementById('surveyStats');
  if (stats) stats.querySelectorAll('[data-count]').forEach(function(el) { el.textContent = '0'; });
  document.querySelectorAll('#catBars .cat-fill').forEach(function(fill) { fill.style.width = ''; });
  document.querySelectorAll('#timeline .tl-bar').forEach(function(bar) {
    bar.style.height = '';
    bar.classList.remove('grown');
  });
}

var surveyRunning = false;
function triggerSurvey() {
  if (surveyRunning) resetSurvey();
  surveyRunning = true;
  startSurvey();
  surveyLater(function() { surveyRunning = false; }, SURVEY_TOTAL_MS);
}

// ══════════════════════════════════════════
// Featured 2: CruxEval-X — language grid + cross-lingual gap
// ══════════════════════════════════════════
var LANGS = ['Python','Java','C++','C#','D','Go','JavaScript','TypeScript','Rust',
             'Ruby','PHP','Swift','Scala','Perl','R','Julia','Lua','Shell','Racket'];

(function buildLangGrid() {
  var grid = document.getElementById('langGrid');
  if (!grid) return;
  LANGS.forEach(function(lang) {
    var chip = document.createElement('div');
    chip.className = 'lang-chip';
    chip.innerHTML = '<span class="lang-check">✓</span><span>' + lang + '</span>';
    grid.appendChild(chip);
  });
})();

var cruxTimers = [];
function cruxLater(fn, ms) { var id = setTimeout(fn, ms); cruxTimers.push(id); return id; }
function cruxClearTimers() { cruxTimers.forEach(clearTimeout); cruxTimers = []; }
var CRUX_TOTAL_MS = 3200;

function startCrux() {
  var chips = document.querySelectorAll('#langGrid .lang-chip');
  var counter = document.getElementById('langCounter');
  var shown = 0;
  chips.forEach(function(chip, i) {
    cruxLater(function() {
      chip.classList.add('on');
      shown++;
      if (counter) counter.textContent = shown;
    }, 70 * i);
  });

  // cross-lingual gap bar — start after languages roughly finish
  var barDelay = 70 * chips.length + 200;
  document.querySelectorAll('#cruxBars .bar-row').forEach(function(row, i) {
    var fill = row.querySelector('.bar-fill');
    var val = row.querySelector('.bar-val');
    var target = parseFloat(row.getAttribute('data-value'));
    cruxLater(function() {
      fill.style.width = target + '%';
      countUp(val, target, 1300, '%');
    }, barDelay + 140 * i);
  });
}

function resetCrux() {
  cruxClearTimers();
  document.querySelectorAll('#langGrid .lang-chip').forEach(function(chip) { chip.classList.remove('on'); });
  var counter = document.getElementById('langCounter');
  if (counter) counter.textContent = '0';
  document.querySelectorAll('#cruxBars .bar-row').forEach(function(row) {
    var fill = row.querySelector('.bar-fill');
    var val = row.querySelector('.bar-val');
    if (fill) fill.style.width = '';
    if (val) val.textContent = '0';
  });
}

var cruxRunning = false;
function triggerCrux() {
  if (cruxRunning) resetCrux();
  cruxRunning = true;
  startCrux();
  cruxLater(function() { cruxRunning = false; }, CRUX_TOTAL_MS);
}

// ══════════════════════════════════════════
// Featured 3: SWE-ABS deflation
// ══════════════════════════════════════════
function renderDeflate(view, animate) {
  var rows = document.querySelectorAll('#deflateChart .deflate-row');
  var swatch = document.getElementById('deflateSwatch');
  var note = document.getElementById('deflateNote');
  var isReal = view === 'real';

  rows.forEach(function(row) {
    var inflated = parseFloat(row.getAttribute('data-inflated'));
    var real = parseFloat(row.getAttribute('data-real'));
    var target = isReal ? real : inflated;
    var fill = row.querySelector('.deflate-fill');
    var tag = row.querySelector('.deflate-tag');
    var ghost = row.querySelector('.deflate-ghost');

    fill.classList.toggle('real', isReal);
    fill.classList.toggle('inflated', !isReal);
    fill.style.width = target + '%';

    // ghost marks the previous (inflated) level so the deflation is visible
    if (ghost) {
      if (isReal) { ghost.style.left = inflated + '%'; ghost.classList.add('show'); }
      else { ghost.classList.remove('show'); }
    }

    if (animate) countUp(tag, target, 900, '%');
    else tag.textContent = target + '%';
  });

  if (swatch) swatch.style.background = isReal ? 'var(--c-red)' : 'var(--c-green)';
  if (note) note.textContent = isReal ? 'after adversarial strengthening' : 'before strengthening';
}

var deflateTimers = [];
function deflateLater(fn, ms) { var id = setTimeout(fn, ms); deflateTimers.push(id); return id; }
function deflateClearTimers() { deflateTimers.forEach(clearTimeout); deflateTimers = []; }
var DEFLATE_TOTAL_MS = 5200;

function startDeflate() {
  renderDeflate('inflated', true);

  // summary tiles
  var drop = document.getElementById('dsDrop');
  var rejected = document.getElementById('dsRejected');
  var strengthened = document.getElementById('dsStrengthened');
  var improve = document.getElementById('dsImprove');
  deflateLater(function() {
    if (drop) countUp(drop, 16.6, 1000, ' pts');
    if (rejected) countUp(rejected, 19.71, 1000, '%');
    if (strengthened) countUp(strengthened, 50.2, 1000, '%');
    if (improve) countUp(improve, 25.1, 1000, '×');
  }, 400);

  // auto-demo the deflation once, then settle back to inflated view
  deflateLater(function() {
    setDeflateView('real');
    deflateLater(function() { setDeflateView('inflated'); }, 2200);
  }, 1600);
}

function resetDeflate() {
  deflateClearTimers();
  document.querySelectorAll('#deflateChart .deflate-row').forEach(function(row) {
    var fill = row.querySelector('.deflate-fill');
    var tag = row.querySelector('.deflate-tag');
    var ghost = row.querySelector('.deflate-ghost');
    if (fill) { fill.classList.remove('real'); fill.classList.add('inflated'); fill.style.width = ''; }
    if (tag) tag.textContent = '0%';
    if (ghost) { ghost.classList.remove('show'); ghost.style.left = ''; }
  });
  var swatch = document.getElementById('deflateSwatch');
  if (swatch) swatch.style.background = 'var(--c-green)';
  var note = document.getElementById('deflateNote');
  if (note) note.textContent = 'before strengthening';
  document.querySelectorAll('#deflateToggle button').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-view') === 'inflated');
  });
  var drop = document.getElementById('dsDrop');
  var rejected = document.getElementById('dsRejected');
  var strengthened = document.getElementById('dsStrengthened');
  var improve = document.getElementById('dsImprove');
  if (drop) drop.textContent = '–0';
  if (rejected) rejected.textContent = '0%';
  if (strengthened) strengthened.textContent = '0%';
  if (improve) improve.textContent = '0×';
}

var deflateRunning = false;
function triggerDeflate() {
  if (deflateRunning) resetDeflate();
  deflateRunning = true;
  startDeflate();
  deflateLater(function() { deflateRunning = false; }, DEFLATE_TOTAL_MS);
}

function setDeflateView(view) {
  var btns = document.querySelectorAll('#deflateToggle button');
  btns.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-view') === view); });
  renderDeflate(view, true);
}

(function bindDeflateToggle() {
  var toggle = document.getElementById('deflateToggle');
  if (!toggle) return;
  toggle.querySelectorAll('button').forEach(function(b) {
    b.addEventListener('click', function() { setDeflateView(b.getAttribute('data-view')); });
  });
})();

// ══════════════════════════════════════════
// Featured 4: JavaBench — LLM ceiling vs. human baseline
// ══════════════════════════════════════════
var lbTimers = [];
function lbLater(fn, ms) { var id = setTimeout(fn, ms); lbTimers.push(id); return id; }
function lbClearTimers() { lbTimers.forEach(clearTimeout); lbTimers = []; }
var LB_TOTAL_MS = 2600;

function startLeaderboard() {
  document.querySelectorAll('#oopTags .oop-tag').forEach(function(tag, i) {
    lbLater(function() { tag.classList.add('on'); }, 90 * i);
  });

  var rows = document.querySelectorAll('#leaderboard .lb-row');
  rows.forEach(function(row, i) {
    lbLater(function() {
      row.classList.add('on');
      var fill = row.querySelector('.lb-bar-fill');
      var score = row.querySelector('.lb-score');
      var target = parseFloat(row.getAttribute('data-score'));
      if (fill) fill.style.width = (target / 90.93 * 100) + '%';
      if (score) countUp(score, target, 1100, '%');
    }, 220 * i + 200);
  });

  // benchmark composition tiles
  var m = document.getElementById('jbMethods');
  var c = document.getElementById('jbClasses');
  var p = document.getElementById('jbProjects');
  var cov = document.getElementById('jbCoverage');
  lbLater(function() {
    if (m) countUp(m, 389, 1000, '');
    if (c) countUp(c, 106, 900, '');
    if (p) countUp(p, 4, 700, '');
    if (cov) countUp(cov, 92, 1000, '%');
  }, 220 * rows.length + 400);
}

function resetLeaderboard() {
  lbClearTimers();
  document.querySelectorAll('#oopTags .oop-tag').forEach(function(tag) { tag.classList.remove('on'); });
  document.querySelectorAll('#leaderboard .lb-row').forEach(function(row) {
    row.classList.remove('on');
    var fill = row.querySelector('.lb-bar-fill');
    var score = row.querySelector('.lb-score');
    if (fill) fill.style.width = '';
    if (score) score.textContent = '0';
  });
  var m = document.getElementById('jbMethods');
  var c = document.getElementById('jbClasses');
  var p = document.getElementById('jbProjects');
  var cov = document.getElementById('jbCoverage');
  if (m) m.textContent = '0';
  if (c) c.textContent = '0';
  if (p) p.textContent = '0';
  if (cov) cov.textContent = '0%';
}

var lbRunning = false;
function triggerLeaderboard() {
  if (lbRunning) resetLeaderboard();
  lbRunning = true;
  startLeaderboard();
  lbLater(function() { lbRunning = false; }, LB_TOTAL_MS);
}

// ══════════════════════════════════════════
// Hover triggers
// ══════════════════════════════════════════
(function() {
  startHeroStats();

  var triggers = [
    { sel: '#sec-survey', fn: triggerSurvey, reset: resetSurvey },
    { sel: '#sec-cruxeval', fn: triggerCrux, reset: resetCrux },
    { sel: '#sec-sweabs', fn: triggerDeflate, reset: resetDeflate },
    { sel: '#sec-javabench', fn: triggerLeaderboard, reset: resetLeaderboard }
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
// COMPACT PAPER ANIMATIONS
// ══════════════════════════════════════════

// DomainEval - domain pills
var DOMAINS = [
  { name: 'Computation', weak: false },
  { name: 'Web', weak: false },
  { name: 'Database', weak: false },
  { name: 'Networking', weak: false },
  { name: 'Cryptography', weak: true },
  { name: 'Systems', weak: true }
];

(function buildDomainEval() {
  var container = document.getElementById('anim-domaineval');
  if (!container) return;
  var pills = document.createElement('div');
  pills.className = 'domain-pills';
  DOMAINS.forEach(function(d) {
    var pill = document.createElement('div');
    pill.className = 'domain-pill' + (d.weak ? ' weak' : '');
    pill.textContent = d.name;
    pills.appendChild(pill);
  });
  container.appendChild(pills);
})();

function triggerDomainEval() {
  var pills = document.querySelectorAll('#anim-domaineval .domain-pill');
  pills.forEach(function(p, i) {
    setTimeout(function() { p.classList.add('on'); }, i * 180);
  });
}
function resetDomainEval() {
  document.querySelectorAll('#anim-domaineval .domain-pill').forEach(function(p) { p.classList.remove('on'); });
}

// PathEval - path indicators
(function buildPathEval() {
  var container = document.getElementById('anim-patheval');
  if (!container) return;
  var paths = [
    { label: 'Simple path (linear)', color: 'green', status: '✓ Generated' },
    { label: 'Medium path (branch)', color: 'amber', status: '~ Partial' },
    { label: 'Complex path (constraint)', color: 'red', status: '✗ Failed' }
  ];
  var wrap = document.createElement('div');
  wrap.className = 'path-indicators';
  paths.forEach(function(p) {
    var row = document.createElement('div');
    row.className = 'path-row';
    row.innerHTML = '<div class="path-dot ' + p.color + '"></div><span class="path-label">' + p.label + '</span><span class="path-status" style="color:var(--c-' + p.color + ')">' + p.status + '</span>';
    wrap.appendChild(row);
  });
  container.appendChild(wrap);
})();

function triggerPathEval() {
  var rows = document.querySelectorAll('#anim-patheval .path-row');
  rows.forEach(function(r, i) {
    setTimeout(function() { r.classList.add('on'); }, i * 350);
  });
}
function resetPathEval() {
  document.querySelectorAll('#anim-patheval .path-row').forEach(function(r) { r.classList.remove('on'); });
}

// CodeCleaner - refactoring example + operator grid + reduction bars
var ccTimers = [];
function ccLater(fn, ms) { var id = setTimeout(fn, ms); ccTimers.push(id); return id; }
function ccClearTimers() { ccTimers.forEach(clearTimeout); ccTimers = []; }

function triggerCodeCleaner() {
  // Example transform steps
  var steps = ['ccOrig', 'ccArr1', 'ccStyl', 'ccArr2', 'ccIff'];
  steps.forEach(function(id, i) {
    ccLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, 200 + i * 500);
  });

  // Operator chips
  var chips = document.querySelectorAll('#ccOps .cc-op-chip');
  chips.forEach(function(chip, i) {
    ccLater(function() { chip.classList.add('on'); }, 2800 + i * 120);
  });

  // Before/after bars
  ccLater(function() {
    var before = document.getElementById('ccBefore');
    var after = document.getElementById('ccAfter');
    var bVal = document.getElementById('ccBeforeVal');
    var aVal = document.getElementById('ccAfterVal');
    var drop = document.getElementById('ccDrop');
    if (before) before.style.width = '87%';
    if (bVal) countUp(bVal, 87, 900, '%');
    ccLater(function() {
      if (after) after.style.width = '22%';
      if (aVal) countUp(aVal, 22, 900, '%');
      if (drop) countUp(drop, 65, 900, '%');
    }, 600);
  }, 4200);
}

function resetCodeCleaner() {
  ccClearTimers();
  ['ccOrig','ccArr1','ccStyl','ccArr2','ccIff'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  document.querySelectorAll('#ccOps .cc-op-chip').forEach(function(c) { c.classList.remove('on'); });
  ['ccBefore','ccAfter'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.style.width = '0';
  });
  ['ccBeforeVal','ccAfterVal'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.textContent = '0%';
  });
  var drop = document.getElementById('ccDrop'); if (drop) drop.textContent = '0%';
}

// Data Contamination - comparison bars
(function buildContamination() {
  var container = document.getElementById('anim-contamination');
  if (!container) return;
  container.innerHTML = '<div class="compare-bars"><div class="compare-row"><span class="compare-label">Expected</span><div class="compare-track"><div class="compare-fill expected" id="contExp"></div></div><span class="compare-val" id="contExpVal">0%</span></div><div class="compare-row"><span class="compare-label">Actual</span><div class="compare-track"><div class="compare-fill actual" id="contAct"></div></div><span class="compare-val" id="contActVal">0%</span></div></div><div class="compare-warning" id="contWarn">&#9888; Counterintuitive: refactoring sometimes improves model performance</div>';
})();

function triggerContamination() {
  var exp = document.getElementById('contExp');
  var act = document.getElementById('contAct');
  var warn = document.getElementById('contWarn');
  setTimeout(function() { if (exp) exp.style.width = '35%'; document.getElementById('contExpVal').textContent = '↓ 35%'; }, 300);
  setTimeout(function() { if (act) act.style.width = '48%'; document.getElementById('contActVal').textContent = '↑ 48%'; }, 800);
  setTimeout(function() { if (warn) warn.classList.add('on'); }, 1400);
}
function resetContamination() {
  var exp = document.getElementById('contExp');
  var act = document.getElementById('contAct');
  var warn = document.getElementById('contWarn');
  if (exp) exp.style.width = '0';
  if (act) act.style.width = '0';
  if (warn) warn.classList.remove('on');
  var v1 = document.getElementById('contExpVal');
  var v2 = document.getElementById('contActVal');
  if (v1) v1.textContent = '0%';
  if (v2) v2.textContent = '0%';
}

// PseudoEval - source code → pseudocode → target language transformation
(function buildPseudoEval() {
  var container = document.getElementById('anim-pseudoeval');
  if (!container) return;
  container.innerHTML =
    '<div class="pseudo-pipeline" id="pseudoPipeline">' +
      // Step 1: Source code (Python)
      '<div class="pseudo-step" id="pseudoStep1">' +
        '<div class="pseudo-block pseudo-src">' +
          '<span class="pseudo-label" style="color:var(--primary)">Source Code (Python)</span>' +
          '<div class="pseudo-code-line"><span class="syn-kw">def</span> <span class="fn">second_largest</span>(nums):</div>' +
          '<div class="pseudo-code-line">&nbsp; unique = <span class="syn-kw">list</span>(<span class="syn-kw">set</span>(nums))</div>' +
          '<div class="pseudo-code-line">&nbsp; <span class="syn-kw">if len</span>(unique) &lt; <span class="num">2</span>:</div>' +
          '<div class="pseudo-code-line">&nbsp;&nbsp;&nbsp; <span class="syn-kw">return</span> <span class="num">None</span></div>' +
          '<div class="pseudo-code-line">&nbsp; unique.sort(<span class="syn-kw">reverse</span>=<span class="num">True</span>)</div>' +
          '<div class="pseudo-code-line">&nbsp; <span class="syn-kw">return</span> unique[<span class="num">1</span>]</div>' +
        '</div>' +
        '<div class="pseudo-step-label">-42% LoC</div>' +
      '</div>' +
      // Arrow 1
      '<div class="pseudo-arrow-h" id="pseudoArr1">&rarr;</div>' +
      // Step 2: Pseudocode (language-agnostic)
      '<div class="pseudo-step" id="pseudoStep2">' +
        '<div class="pseudo-block pseudo-pc">' +
          '<span class="pseudo-label" style="color:var(--c-green)">Pseudocode</span>' +
          '<div class="pseudo-code-line"><span class="syn-kw">FUNCTION</span> second_largest(nums)</div>' +
          '<div class="pseudo-code-line">&nbsp; unique &larr; REMOVE_DUPS(nums)</div>' +
          '<div class="pseudo-code-line">&nbsp; <span class="syn-kw">IF</span> |unique| &lt; 2: <span class="syn-kw">RETURN</span> null</div>' +
          '<div class="pseudo-code-line">&nbsp; SORT_DESC(unique)</div>' +
          '<div class="pseudo-code-line">&nbsp; <span class="syn-kw">RETURN</span> unique[1]</div>' +
        '</div>' +
        '<div class="pseudo-step-label">LLM input</div>' +
      '</div>' +
      // Arrow 2
      '<div class="pseudo-arrow-h" id="pseudoArr2">&rarr;</div>' +
      // Step 3: Target languages
      '<div class="pseudo-step pseudo-targets" id="pseudoStep3">' +
        '<div class="pseudo-block pseudo-tgt" id="pseudoTgtCpp">' +
          '<span class="pseudo-label" style="color:var(--c-amber)">C++ Output</span>' +
          '<div class="pseudo-code-line"><span class="syn-kw">int</span> second_largest(vector&lt;<span class="syn-kw">int</span>&gt;&amp; v){</div>' +
          '<div class="pseudo-code-line">&nbsp; <span class="syn-kw">set</span>&lt;<span class="syn-kw">int</span>&gt; s(v.begin(),v.end());</div>' +
          '<div class="pseudo-code-line">&nbsp; ...}</div>' +
        '</div>' +
        '<div class="pseudo-block pseudo-tgt" id="pseudoTgtRust">' +
          '<span class="pseudo-label" style="color:var(--c-red)">Rust Output</span>' +
          '<div class="pseudo-code-line"><span class="syn-kw">fn</span> second_largest(v: &amp;[<span class="syn-kw">i32</span>])</div>' +
          '<div class="pseudo-code-line">&nbsp; -&gt; <span class="syn-kw">Option</span>&lt;<span class="syn-kw">i32</span>&gt; {</div>' +
          '<div class="pseudo-code-line">&nbsp; ...}</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // Performance comparison bars
    '<div class="pseudo-bars" id="pseudoBars">' +
      '<div class="pseudo-bar-group">' +
        '<span class="pseudo-bar-label">Python</span>' +
        '<div class="pseudo-bar-pair">' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag">Problem</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill prob" id="pyProb"></div></div><span class="pseudo-bar-val" id="pyProbVal">0%</span></div>' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag" style="color:var(--c-green)">Pseudo</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill pseudo" id="pyPseudo"></div></div><span class="pseudo-bar-val" id="pyPseudoVal">0%</span></div>' +
        '</div>' +
        '<span class="pseudo-boost" id="pyBoost">+97%</span>' +
      '</div>' +
      '<div class="pseudo-bar-group">' +
        '<span class="pseudo-bar-label">C++</span>' +
        '<div class="pseudo-bar-pair">' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag">Problem</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill prob" id="cppProb"></div></div><span class="pseudo-bar-val" id="cppProbVal">0%</span></div>' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag" style="color:var(--c-green)">Pseudo</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill pseudo" id="cppPseudo"></div></div><span class="pseudo-bar-val" id="cppPseudoVal">0%</span></div>' +
        '</div>' +
        '<span class="pseudo-boost" id="cppBoost">+87%</span>' +
      '</div>' +
      '<div class="pseudo-bar-group">' +
        '<span class="pseudo-bar-label">Rust</span>' +
        '<div class="pseudo-bar-pair">' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag">Problem</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill prob" id="rustProb"></div></div><span class="pseudo-bar-val" id="rustProbVal">0%</span></div>' +
          '<div class="pseudo-bar-row"><span class="pseudo-bar-tag" style="color:var(--c-green)">Pseudo</span><div class="pseudo-bar-track"><div class="pseudo-bar-fill pseudo" id="rustPseudo"></div></div><span class="pseudo-bar-val" id="rustPseudoVal">0%</span></div>' +
        '</div>' +
        '<span class="pseudo-boost" id="rustBoost">+67%</span>' +
      '</div>' +
    '</div>' +
    '<div class="pseudo-insight" id="pseudoInsight">' +
      '<div class="split-diagram">' +
        '<div class="split-side" id="splitLeft"><div class="split-label">Problem-Solving Bottleneck</div><div class="split-lang">Python</div><div class="split-note">+97% gain from pseudocode &mdash; problem-solving was the wall</div></div>' +
        '<div class="split-side" id="splitRight"><div class="split-label">Language-Coding Bottleneck</div><div class="split-lang">Rust</div><div class="split-note">+67% gain &mdash; type system &amp; ownership remain hard</div></div>' +
      '</div>' +
    '</div>';
})();

function triggerPseudoEval() {
  var step1 = document.getElementById('pseudoStep1');
  var arr1 = document.getElementById('pseudoArr1');
  var step2 = document.getElementById('pseudoStep2');
  var arr2 = document.getElementById('pseudoArr2');
  var step3 = document.getElementById('pseudoStep3');

  if (step1) setTimeout(function() { step1.classList.add('on'); }, 100);
  if (arr1) setTimeout(function() { arr1.classList.add('on'); }, 600);
  if (step2) setTimeout(function() { step2.classList.add('on'); }, 900);
  if (arr2) setTimeout(function() { arr2.classList.add('on'); }, 1400);
  var tgtCpp = document.getElementById('pseudoTgtCpp');
  var tgtRust = document.getElementById('pseudoTgtRust');
  if (tgtCpp) setTimeout(function() { tgtCpp.classList.add('on'); }, 1700);
  if (tgtRust) setTimeout(function() { tgtRust.classList.add('on'); }, 2000);
  if (step3) setTimeout(function() { step3.classList.add('on'); }, 1700);

  var pairs = [
    { prob: 'pyProb', pseudo: 'pyPseudo', probVal: 'pyProbVal', pseudoVal: 'pyPseudoVal', boost: 'pyBoost', pv: 38, sv: 75 },
    { prob: 'cppProb', pseudo: 'cppPseudo', probVal: 'cppProbVal', pseudoVal: 'cppPseudoVal', boost: 'cppBoost', pv: 35, sv: 66 },
    { prob: 'rustProb', pseudo: 'rustPseudo', probVal: 'rustProbVal', pseudoVal: 'rustPseudoVal', boost: 'rustBoost', pv: 28, sv: 46 }
  ];
  pairs.forEach(function(p, i) {
    var delay = 2400 + i * 350;
    setTimeout(function() {
      var prob = document.getElementById(p.prob);
      var pseudo = document.getElementById(p.pseudo);
      var probVal = document.getElementById(p.probVal);
      var pseudoVal = document.getElementById(p.pseudoVal);
      var boost = document.getElementById(p.boost);
      if (prob) prob.style.width = p.pv + '%';
      if (pseudo) pseudo.style.width = p.sv + '%';
      if (probVal) countUp(probVal, p.pv, 800, '%');
      if (pseudoVal) countUp(pseudoVal, p.sv, 800, '%');
      if (boost) setTimeout(function() { boost.classList.add('on'); }, 600);
    }, delay);
  });

  setTimeout(function() {
    var el = document.getElementById('splitLeft'); if (el) el.classList.add('on');
  }, 4000);
  setTimeout(function() {
    var el = document.getElementById('splitRight'); if (el) el.classList.add('on');
  }, 4400);
}

function resetPseudoEval() {
  ['pseudoStep1','pseudoArr1','pseudoStep2','pseudoArr2','pseudoStep3'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  ['pseudoTgtCpp','pseudoTgtRust'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  ['pyProb','cppProb','rustProb','pyPseudo','cppPseudo','rustPseudo'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.style.width = '0';
  });
  ['pyProbVal','cppProbVal','rustProbVal','pyPseudoVal','cppPseudoVal','rustPseudoVal'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.textContent = '0%';
  });
  ['pyBoost','cppBoost','rustBoost'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  var l = document.getElementById('splitLeft'); if (l) l.classList.remove('on');
  var r = document.getElementById('splitRight'); if (r) r.classList.remove('on');
}

// FeedbackEval - feedback loop
(function buildFeedbackEval() {
  var container = document.getElementById('anim-feedbackeval');
  if (!container) return;
  container.innerHTML = '<div class="feedback-loop"><span class="fb-node">Bug</span><span class="fb-arrow">&rarr;</span><span class="fb-node">Feedback</span><span class="fb-arrow">&rarr;</span><span class="fb-node">LLM</span><span class="fb-arrow">&rarr;</span><span class="fb-node success">Fix</span></div><div class="fb-rate" id="fbRate">63.6% success (mixed feedback)</div>';
})();

function triggerFeedbackEval() {
  var nodes = document.querySelectorAll('#anim-feedbackeval .fb-node');
  var arrows = document.querySelectorAll('#anim-feedbackeval .fb-arrow');
  nodes.forEach(function(n, i) { setTimeout(function() { n.classList.add('on'); }, i * 300); });
  arrows.forEach(function(a, i) { setTimeout(function() { a.classList.add('on'); }, i * 300 + 150); });
  setTimeout(function() { var r = document.getElementById('fbRate'); if (r) r.classList.add('on'); }, 1400);
}
function resetFeedbackEval() {
  document.querySelectorAll('#anim-feedbackeval .fb-node').forEach(function(n) { n.classList.remove('on'); });
  document.querySelectorAll('#anim-feedbackeval .fb-arrow').forEach(function(a) { a.classList.remove('on'); });
  var r = document.getElementById('fbRate'); if (r) r.classList.remove('on');
}

// EmbedAgent - circuit, code, wiring, bars
var embedTimers = [];
function embedLater(fn, ms) { var id = setTimeout(fn, ms); embedTimers.push(id); return id; }
function embedClearTimers() { embedTimers.forEach(clearTimeout); embedTimers = []; }

function triggerEmbedAgent() {
  var stats = document.getElementById('embedStats');
  if (stats) countUpAll(stats, 1200);

  // Settings pipeline
  ['embedS1','embedS2','embedS3'].forEach(function(id, i) {
    embedLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, 200 + i * 300);
  });

  // Circuit animation
  var t = 1100;
  embedLater(function() {
    var board = document.getElementById('eBoard'); if (board) board.classList.add('on');
    document.querySelectorAll('.embed-board-label').forEach(function(l) { l.classList.add('on'); });
  }, t);
  ['ePin13','ePin2','ePinGnd'].forEach(function(id, i) {
    embedLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, t + 200 + i * 100);
  });
  ['eLed','eResistor','eButton'].forEach(function(id, i) {
    embedLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, t + 500 + i * 250);
  });
  embedLater(function() {
    var gs = document.getElementById('eGndSym'); if (gs) gs.classList.add('on');
    document.querySelectorAll('.embed-gnd-line').forEach(function(l) { l.classList.add('on'); });
  }, t + 1250);
  ['eWire1','eWire2','eWire3','eWire4','eWireGnd','eWireGnd2'].forEach(function(id, i) {
    embedLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, t + 1500 + i * 200);
  });
  // LED glow
  embedLater(function() {
    var led = document.querySelector('.embed-led-body'); if (led) led.classList.add('glow');
  }, t + 2800);

  // Code lines
  var codeStart = t + 1000;
  for (var i = 1; i <= 12; i++) {
    (function(idx) {
      embedLater(function() { var el = document.getElementById('eCL' + idx); if (el) el.classList.add('on'); }, codeStart + idx * 120);
    })(i);
  }

  // Wiring JSON entries
  ['eW1','eW2','eW3','eW4'].forEach(function(id, i) {
    embedLater(function() { var el = document.getElementById(id); if (el) el.classList.add('on'); }, codeStart + 1600 + i * 200);
  });

  // Performance bars
  var barDelay = codeStart + 2600;
  document.querySelectorAll('#embedBars .bar-row').forEach(function(row, i) {
    var fill = row.querySelector('.bar-fill');
    var val = row.querySelector('.bar-val');
    var target = parseFloat(row.getAttribute('data-value'));
    embedLater(function() {
      if (fill) fill.style.width = target + '%';
      if (val) countUp(val, target, 1000, '%');
    }, barDelay + 200 * i);
  });
}

function resetEmbedAgent() {
  embedClearTimers();
  var stats = document.getElementById('embedStats');
  if (stats) stats.querySelectorAll('[data-count]').forEach(function(el) { el.textContent = '0'; });
  ['embedS1','embedS2','embedS3'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  var board = document.getElementById('eBoard'); if (board) board.classList.remove('on');
  document.querySelectorAll('.embed-board-label').forEach(function(l) { l.classList.remove('on'); });
  ['ePin13','ePin2','ePinGnd'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  ['eLed','eResistor','eButton','eGndSym'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  document.querySelectorAll('.embed-gnd-line').forEach(function(l) { l.classList.remove('on'); });
  ['eWire1','eWire2','eWire3','eWire4','eWireGnd','eWireGnd2'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  var led = document.querySelector('.embed-led-body'); if (led) led.classList.remove('glow');
  for (var i = 1; i <= 12; i++) {
    var el = document.getElementById('eCL' + i); if (el) el.classList.remove('on');
  }
  ['eW1','eW2','eW3','eW4'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.remove('on');
  });
  document.querySelectorAll('#embedBars .bar-row').forEach(function(row) {
    var fill = row.querySelector('.bar-fill');
    var val = row.querySelector('.bar-val');
    if (fill) fill.style.width = '';
    if (val) val.textContent = '0';
  });
}

// Register compact triggers
(function() {
  var compactTriggers = [
    { sel: '#sec-domaineval', fn: triggerDomainEval, reset: resetDomainEval },
    { sel: '#sec-patheval', fn: triggerPathEval, reset: resetPathEval },
    { sel: '#sec-codecleaner', fn: triggerCodeCleaner, reset: resetCodeCleaner },
    { sel: '#sec-contamination', fn: triggerContamination, reset: resetContamination },
    { sel: '#sec-pseudoeval', fn: triggerPseudoEval, reset: resetPseudoEval },
    { sel: '#sec-feedbackeval', fn: triggerFeedbackEval, reset: resetFeedbackEval },
    { sel: '#sec-embedagent', fn: triggerEmbedAgent, reset: resetEmbedAgent }
  ];
  compactTriggers.forEach(function(t) {
    var el = document.querySelector(t.sel);
    if (!el) return;
    el.addEventListener('mouseenter', function() { t.reset(); t.fn(); });
    el.addEventListener('mouseleave', t.reset);
  });
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var match = compactTriggers.find(function(t) { return document.querySelector(t.sel) === e.target; });
        if (match) match.fn();
      });
    }, { threshold: 0.3 });
    compactTriggers.forEach(function(t) { var el = document.querySelector(t.sel); if (el) obs.observe(el); });
  }
})();

// ══════════════════════════════════════════
// Nav active-link highlight on scroll
// ══════════════════════════════════════════
(function() {
  var sections = ['sec-survey','sec-cruxeval','sec-sweabs','sec-javabench','sec-domaineval','sec-patheval','sec-codecleaner','sec-contamination','sec-pseudoeval','sec-feedbackeval','sec-embedagent'];
  var links = {};
  document.querySelectorAll('.nav-link').forEach(function(a) {
    var id = a.getAttribute('href').slice(1);
    links[id] = a;
  });
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      var link = links[e.target.id];
      if (!link) return;
      if (e.isIntersecting) {
        Object.keys(links).forEach(function(k) { links[k].classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(function(id) { var el = document.getElementById(id); if (el) obs.observe(el); });
})();

// ══════════════════════════════════════════
// GSAP entrance animations
// ══════════════════════════════════════════
(function() {
  if (typeof gsap === 'undefined') return;
  if (PREFERS_REDUCED) {
    document.querySelectorAll('.gsap-fade').forEach(function(el) { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-badge', { opacity: 0, y: 15, duration: 0.6, delay: 0.2 });
  gsap.from('.hero h1', { opacity: 0, y: 20, duration: 0.7, delay: 0.4 });
  gsap.from('.hero-sub', { opacity: 0, y: 15, duration: 0.6, delay: 0.7 });
  gsap.from('.hero-stat', { opacity: 0, y: 18, duration: 0.5, stagger: 0.12, delay: 0.9 });

  document.querySelectorAll('.gsap-fade').forEach(function(el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  setTimeout(function() {
    document.querySelectorAll('.gsap-fade').forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
  }, 3000);
})();

// ══════════════════════════════════════════
// Hero animated dot-grid background (canvas)
// ══════════════════════════════════════════
(function() {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas || PREFERS_REDUCED) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, cols, rows, dots = [];
  var GAP = 40, R = 1.6;

  function accentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0000C4';
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / GAP) + 1;
    rows = Math.ceil(h / GAP) + 1;
    dots = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        dots.push({ x: x * GAP, y: y * GAP, phase: (x + y) * 0.35 });
      }
    }
  }

  var t = 0;
  function frame() {
    if (!w) { requestAnimationFrame(frame); return; }
    ctx.clearRect(0, 0, w, h);
    t += 0.02;
    var col = accentColor();
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      // ripple wave across the grid
      var wave = Math.sin(t - d.phase);
      var a = 0.06 + 0.10 * (wave * 0.5 + 0.5);
      var rr = R + 0.9 * (wave * 0.5 + 0.5);
      ctx.beginPath();
      ctx.fillStyle = col;
      ctx.globalAlpha = a;
      ctx.arc(d.x, d.y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
})();
