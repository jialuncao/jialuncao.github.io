// ══════════════════════════════════════════
// LLM for Formal Methods — "Mathematical Precision"
// ══════════════════════════════════════════

// ---- Theme ----
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
// Generic typing engine (tag-aware)
// token = { cancelled: bool } — lets a reset cancel an in-flight typing run
// ══════════════════════════════════════════
function typeCode(el, lines, speed, done, token) {
  token = token || { cancelled: false };
  var lineIdx = 0, charIdx = 0;
  el.innerHTML = '';
  function tick() {
    if (token.cancelled) return;
    if (lineIdx >= lines.length) {
      var cur = el.querySelector('.cursor');
      if (cur) cur.remove();
      if (done) done();
      return;
    }
    var line = lines[lineIdx];
    var currentLines = [];
    for (var i = 0; i < lineIdx; i++) currentLines.push(lines[i].html);
    currentLines.push(line.buildPartial(charIdx));
    el.innerHTML = currentLines.join('\n') + '<span class="cursor"></span>';
    charIdx++;
    if (charIdx > line.text.length) { lineIdx++; charIdx = 0; }
    setTimeout(tick, speed);
  }
  tick();
}

function makeLine(text, html) {
  return {
    text: text,
    html: html,
    buildPartial: function(n) {
      var tags = []; var plainIdx = 0; var inTag = false;
      for (var i = 0; i < html.length; i++) {
        if (html[i] === '<') { inTag = true; tags.push({ pos: plainIdx, start: i }); }
        if (!inTag) { plainIdx++; }
        if (html[i] === '>') { inTag = false; tags[tags.length - 1].end = i + 1; }
      }
      var result = ''; var inserted = 0; var tagI = 0;
      for (var j = 0; j < html.length && inserted < n; j++) {
        if (tagI < tags.length && j === tags[tagI].start) {
          result += html.substring(tags[tagI].start, tags[tagI].end);
          j = tags[tagI].end - 1;
          tagI++;
        } else {
          result += html[j]; inserted++;
        }
      }
      while (tagI < tags.length && tags[tagI].pos <= n) {
        result += html.substring(tags[tagI].start, tags[tagI].end);
        tagI++;
      }
      return result;
    }
  };
}

// ══════════════════════════════════════════
// FEATURED 1: NL -> Formal
// ══════════════════════════════════════════
var nlLines = [
  makeLine('REQUIREMENT', '<span class="nl-tag">Requirement</span>'),
  makeLine('For any two natural numbers a and b,', 'For any two natural numbers a and b,'),
  makeLine('the sum a + b must equal b + a', 'the sum a + b must equal b + a'),
  makeLine('(addition is commutative), and the', '(addition is commutative), and the'),
  makeLine('result must never exceed the declared', 'result must never exceed the declared'),
  makeLine('bound MAX for a safe computation.', 'bound MAX for a safe computation.')
];

var formalLines = [
  makeLine('Lemma add_comm : forall a b : nat,', '<span class="s-kw">Lemma</span> <span class="s-fn">add_comm</span> : <span class="s-kw">forall</span> a b : <span class="s-type">nat</span>,'),
  makeLine('  a + b = b + a.', '  a + b = b + a.'),
  makeLine('Proof. intros; lia. Qed.', '<span class="s-kw">Proof</span>. intros; <span class="s-fn">lia</span>. <span class="s-kw">Qed</span>.'),
  makeLine('', ''),
  makeLine('Lemma bound_safe : forall a b : nat,', '<span class="s-kw">Lemma</span> <span class="s-fn">bound_safe</span> : <span class="s-kw">forall</span> a b : <span class="s-type">nat</span>,'),
  makeLine('  a <= MAX -> b <= MAX ->', '  a &le; MAX <span class="s-op">-&gt;</span> b &le; MAX <span class="s-op">-&gt;</span>'),
  makeLine('  a + b <= 2 * MAX.', '  a + b &le; <span class="s-num">2</span> * MAX.'),
  makeLine('Proof. intros; lia. Qed.', '<span class="s-kw">Proof</span>. intros; <span class="s-fn">lia</span>. <span class="s-kw">Qed</span>.'),
  makeLine('', ''),
  makeLine('Theorem correct : spec_safe add.', '<span class="s-kw">Theorem</span> <span class="s-fn">correct</span> : <span class="s-fn">spec_safe</span> add.'),
  makeLine('Proof. apply add_comm. Qed.', '<span class="s-kw">Proof</span>. <span class="s-kw">apply</span> add_comm. <span class="s-kw">Qed</span>.')
];

var nl2fTimers = [];
function nl2fLater(fn, ms) { var id = setTimeout(fn, ms); nl2fTimers.push(id); return id; }
function nl2fClearTimers() { nl2fTimers.forEach(clearTimeout); nl2fTimers = []; }
var nl2fToken = null;
var nl2fRunning = false;
var NL2F_TOTAL_MS = 10000;

function resetNL2F() {
  nl2fClearTimers();
  if (nl2fToken) nl2fToken.cancelled = true;
  var nlText = document.getElementById('nlText');
  var formalCode = document.getElementById('formalCode');
  var flowIn = document.getElementById('flowIn');
  var flowOut = document.getElementById('flowOut');
  var core = document.getElementById('llmCore');
  var counter = document.getElementById('lemmaCounter');
  var rows = document.querySelectorAll('#sec-nl2formal .lemma-row');
  if (nlText) nlText.innerHTML = '';
  if (formalCode) formalCode.innerHTML = '';
  if (flowIn) flowIn.classList.remove('active');
  if (flowOut) flowOut.classList.remove('active');
  if (core) core.classList.remove('active');
  rows.forEach(function(r) { r.classList.remove('show'); });
  if (counter) counter.textContent = '0/3 lemmas';
}

function startNL2F() {
  var flowIn = document.getElementById('flowIn');
  var flowOut = document.getElementById('flowOut');
  var core = document.getElementById('llmCore');
  var counter = document.getElementById('lemmaCounter');
  var rows = document.querySelectorAll('#sec-nl2formal .lemma-row');

  nl2fToken = { cancelled: false };
  var token = nl2fToken;

  typeCode(document.getElementById('nlText'), nlLines, 20, function() {
    if (token.cancelled) return;
    // NL done -> activate LLM core & inbound flow
    flowIn.classList.add('active');
    core.classList.add('active');
    nl2fLater(function() {
      flowOut.classList.add('active');
      // type formal spec, reveal lemmas as each Qed lands
      var proved = 0;
      typeCode(document.getElementById('formalCode'), formalLines, 16, function() {
        core.classList.remove('active');
        flowIn.classList.remove('active');
        flowOut.classList.remove('active');
      }, token);
      // reveal lemma rows on a schedule matching the three Qed blocks
      var schedule = [1600, 3400, 5000];
      schedule.forEach(function(t, i) {
        nl2fLater(function() {
          if (rows[i]) rows[i].classList.add('show');
          proved = i + 1;
          if (counter) counter.textContent = proved + '/3 lemmas';
          if (proved === 3 && counter) counter.innerHTML = '3/3 lemmas ✓';
        }, t);
      });
    }, 650);
  }, token);
}

function triggerNL2F() {
  if (nl2fRunning) resetNL2F();
  nl2fRunning = true;
  startNL2F();
  nl2fLater(function() { nl2fRunning = false; }, NL2F_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 2: AutoSpec — C + ACSL
// ══════════════════════════════════════════
var cSourceLines = [
  makeLine('int max(int a, int b) {', '<span class="s-type">int</span> <span class="s-fn">max</span>(<span class="s-type">int</span> a, <span class="s-type">int</span> b) {'),
  makeLine('  if (a > b) return a;', '  <span class="s-kw">if</span> (a &gt; b) <span class="s-kw">return</span> a;'),
  makeLine('  return b;', '  <span class="s-kw">return</span> b;'),
  makeLine('}', '}'),
  makeLine('', ''),
  makeLine('int abs(int x) {', '<span class="s-type">int</span> <span class="s-fn">abs</span>(<span class="s-type">int</span> x) {'),
  makeLine('  return x < 0 ? -x : x;', '  <span class="s-kw">return</span> x &lt; <span class="s-num">0</span> ? -x : x;'),
  makeLine('}', '}')
];

// each entry: {t: text-line, anno: bool}
var acslLines = [
  { anno: true,  html: '<span class="s-acsl">/*@ requires \\true;</span>' },
  { anno: true,  html: '<span class="s-acsl">  @ ensures \\result &gt;= a &amp;&amp; \\result &gt;= b;</span>' },
  { anno: true,  html: '<span class="s-acsl">  @ ensures \\result == a || \\result == b; */</span>' },
  { anno: false, html: '<span class="s-type">int</span> <span class="s-fn">max</span>(<span class="s-type">int</span> a, <span class="s-type">int</span> b) {' },
  { anno: false, html: '  <span class="s-kw">if</span> (a &gt; b) <span class="s-kw">return</span> a;' },
  { anno: false, html: '  <span class="s-kw">return</span> b;' },
  { anno: false, html: '}' },
  { anno: false, html: '' },
  { anno: true,  html: '<span class="s-acsl">/*@ requires x &gt; INT_MIN;</span>' },
  { anno: true,  html: '<span class="s-acsl">  @ ensures \\result &gt;= 0;</span>' },
  { anno: true,  html: '<span class="s-acsl">  @ ensures \\result == x || \\result == -x; */</span>' },
  { anno: false, html: '<span class="s-type">int</span> <span class="s-fn">abs</span>(<span class="s-type">int</span> x) {' },
  { anno: false, html: '  <span class="s-kw">return</span> x &lt; <span class="s-num">0</span> ? -x : x;' },
  { anno: false, html: '}' }
];

var autospecTimers = [];
function autospecLater(fn, ms) { var id = setTimeout(fn, ms); autospecTimers.push(id); return id; }
function autospecClearTimers() { autospecTimers.forEach(clearTimeout); autospecTimers = []; }
var autospecToken = null;
var autospecRunning = false;
var AUTOSPEC_TOTAL_MS = 8500;

function resetAutospec() {
  autospecClearTimers();
  if (autospecToken) autospecToken.cancelled = true;
  var stages = document.querySelectorAll('#autospecPipe .autospec-stage');
  var badges = document.querySelectorAll('#verifyBadges .verify-badge');
  var cSourceEl = document.getElementById('cSource');
  var acslEl = document.getElementById('acslCode');
  stages.forEach(function(s) { s.classList.remove('active', 'done'); });
  badges.forEach(function(b) { b.classList.remove('show'); });
  if (cSourceEl) cSourceEl.innerHTML = '';
  if (acslEl) acslEl.innerHTML = '';
}

function startAutospec() {
  var stages = document.querySelectorAll('#autospecPipe .autospec-stage');
  var badges = document.querySelectorAll('#verifyBadges .verify-badge');
  var acslEl = document.getElementById('acslCode');

  autospecToken = { cancelled: false };
  var token = autospecToken;

  // Stage 0: C Code
  setStage(stages, 0);
  typeCode(document.getElementById('cSource'), cSourceLines, 16, function() {
    if (token.cancelled) return;
    // Stage 1: LLM + static analysis
    setStage(stages, 1);
    autospecLater(function() {
      // Stage 2: C + ACSL — reveal lines, annotations glow
      setStage(stages, 2);
      revealAcsl(acslEl, acslLines, 0, function() {
        // Stage 3: Frama-C
        setStage(stages, 3);
        autospecLater(function() {
          // Stage 4: Verified + badges slide in
          markStageDone(stages, 4);
          badges.forEach(function(b, i) {
            autospecLater(function() { b.classList.add('show'); }, 400 + i * 500);
          });
        }, 700);
      }, autospecLater);
    }, 600);
  }, token);
}

function triggerAutospec() {
  if (autospecRunning) resetAutospec();
  autospecRunning = true;
  startAutospec();
  autospecLater(function() { autospecRunning = false; }, AUTOSPEC_TOTAL_MS);
}

function setStage(stages, idx) {
  stages.forEach(function(s, i) {
    s.classList.remove('active');
    if (i < idx) s.classList.add('done');
  });
  if (stages[idx]) stages[idx].classList.add('active');
}
function markStageDone(stages, idx) {
  stages.forEach(function(s, i) { s.classList.remove('active'); if (i <= idx) s.classList.add('done'); });
}

function revealAcsl(el, lines, i, done, laterFn) {
  laterFn = laterFn || setTimeout;
  if (i === 0) {
    el.innerHTML = lines.map(function(l) {
      return '<span class="acsl-line' + (l.anno ? ' anno' : '') + '">' + (l.html || '&nbsp;') + '</span>';
    }).join('\n');
  }
  var spans = el.querySelectorAll('.acsl-line');
  if (i >= spans.length) { if (done) done(); return; }
  var sp = spans[i];
  sp.classList.add('show');
  if (sp.classList.contains('anno')) {
    sp.classList.add('glow');
    laterFn(function() { sp.classList.remove('glow'); }, 900);
  }
  laterFn(function() { revealAcsl(el, lines, i + 1, done, laterFn); }, sp.classList.contains('anno') ? 320 : 180);
}

// ══════════════════════════════════════════
// FEATURED 3: ModelWisdom — TLA+ trace + repair
// ══════════════════════════════════════════
var mwTimers = [];
function mwLater(fn, ms) { var id = setTimeout(fn, ms); mwTimers.push(id); return id; }
function mwClearTimers() { mwTimers.forEach(clearTimeout); mwTimers = []; }
var mwRunning = false;
var MODELWISDOM_TOTAL_MS = 5500;

function resetModelWisdom() {
  mwClearTimers();
  var nodeIds = ['n0', 'n1', 'n2', 'n3', 'n4'];
  var edgeIds = ['e0', 'e1', 'e2', 'e3', 'e4'];
  nodeIds.forEach(function(id) {
    var n = document.getElementById(id);
    if (n) n.classList.remove('active', 'bug', 'fixed');
  });
  edgeIds.forEach(function(id) {
    var e = document.getElementById(id);
    if (e) e.classList.remove('active', 'bug', 'removed');
  });
  var e5 = document.getElementById('e5');
  if (e5) e5.classList.remove('show');
  document.querySelectorAll('#tlaLog .tla-log-item').forEach(function(l) { l.classList.remove('show'); });
}

function startModelWisdom() {
  var logs = document.querySelectorAll('#tlaLog .tla-log-item');
  function n(id) { return document.getElementById(id); }
  function showLog(i) { if (logs[i]) logs[i].classList.add('show'); }

  var seq = [
    // digest
    { at: 200,  fn: function() { showLog(0); } },
    // trace path Init -> Ready -> Wait
    { at: 900,  fn: function() { n('n0').classList.add('active'); } },
    { at: 1300, fn: function() { n('e0').classList.add('active'); n('n1').classList.add('active'); } },
    { at: 1800, fn: function() { n('e2').classList.add('active'); n('n3').classList.add('active'); showLog(1); } },
    // bug: back-edge Wait -> Run
    { at: 2600, fn: function() { n('e4').classList.add('bug'); n('n3').classList.remove('active'); n('n3').classList.add('bug'); showLog(2); } },
    // repair: remove back-edge
    { at: 3600, fn: function() { n('e4').classList.add('removed'); showLog(3); } },
    // synthesize Wait -> Done (green), Done reachable
    { at: 4300, fn: function() { n('e5').classList.add('show'); n('n3').classList.remove('bug'); n('n3').classList.add('fixed'); } },
    { at: 4900, fn: function() { n('n4').classList.add('fixed'); showLog(4); } }
  ];
  seq.forEach(function(s) { mwLater(s.fn, s.at); });
}

function triggerModelWisdom() {
  if (mwRunning) resetModelWisdom();
  mwRunning = true;
  startModelWisdom();
  mwLater(function() { mwRunning = false; }, MODELWISDOM_TOTAL_MS);
}

// ══════════════════════════════════════════
// FEATURED 4: Can LLMs Model — real pipeline + Model-Bench composition
// (no per-dimension pass rates exist in the paper — replaced fabricated
//  flip cards / radar with the actual pipeline and benchmark makeup)
// ══════════════════════════════════════════
var canTimers = [];
function canLater(fn, ms) { var id = setTimeout(fn, ms); canTimers.push(id); return id; }
function canClearTimers() { canTimers.forEach(clearTimeout); canTimers = []; }
var canRunning = false;
var CAN_MODEL_TOTAL_MS = 3800;

function resetCanModel() {
  canClearTimers();
  document.querySelectorAll('#canPipe .autospec-stage').forEach(function(s) { s.classList.remove('active', 'done'); });
  document.querySelectorAll('#benchSources .verify-badge').forEach(function(b) { b.classList.remove('show'); });
  var logItem = document.querySelector('#canVerdictLog .tla-log-item');
  if (logItem) logItem.classList.remove('show');
}

function startCanModel() {
  var stages = document.querySelectorAll('#canPipe .autospec-stage');
  var badges = document.querySelectorAll('#benchSources .verify-badge');
  var logItem = document.querySelector('#canVerdictLog .tla-log-item');

  setStage(stages, 0);
  canLater(function() {
    setStage(stages, 1);
    canLater(function() {
      setStage(stages, 2);
      canLater(function() {
        setStage(stages, 3);
        canLater(function() {
          markStageDone(stages, 4);
          badges.forEach(function(b, i) {
            canLater(function() { b.classList.add('show'); }, i * 220);
          });
          canLater(function() { if (logItem) logItem.classList.add('show'); }, 700);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}

function triggerCanModel() {
  if (canRunning) resetCanModel();
  canRunning = true;
  startCanModel();
  canLater(function() { canRunning = false; }, CAN_MODEL_TOTAL_MS);
}

// ══════════════════════════════════════════
// Hover triggers for featured demos
// ══════════════════════════════════════════
(function() {
  var triggers = [
    { sel: '#sec-nl2formal', fn: triggerNL2F, reset: resetNL2F },
    { sel: '#sec-autospec', fn: triggerAutospec, reset: resetAutospec },
    { sel: '#sec-modelwisdom', fn: triggerModelWisdom, reset: resetModelWisdom },
    { sel: '#sec-canmodel', fn: triggerCanModel, reset: resetCanModel }
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
// COMPACT ANIMATIONS: LiveFMBench, ParamVerify, L-CMP
// ══════════════════════════════════════════
(function() {
  // --- LiveFMBench ---
  function triggerLiveFMBench() {
    var stages = document.querySelectorAll('#pipe-livefmbench .mini-pipe-stage');
    var seps = document.querySelectorAll('#pipe-livefmbench .mini-pipe-sep');
    var warn = document.getElementById('warn-livefmbench');
    var result = document.getElementById('result-livefmbench');
    var delay = 0;
    stages.forEach(function(s, i) {
      setTimeout(function() { s.classList.add('on'); }, delay);
      if (seps[i]) setTimeout(function() { seps[i].classList.add('on'); }, delay + 150);
      delay += 400;
    });
    setTimeout(function() { if (warn) warn.classList.add('on'); }, delay + 300);
    setTimeout(function() { if (result) result.classList.add('on'); }, delay + 800);
  }
  function resetLiveFMBench() {
    document.querySelectorAll('#pipe-livefmbench .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
    document.querySelectorAll('#pipe-livefmbench .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
    var warn = document.getElementById('warn-livefmbench');
    var result = document.getElementById('result-livefmbench');
    if (warn) warn.classList.remove('on');
    if (result) result.classList.remove('on');
  }

  // --- ParamVerify ---
  function triggerParamVerify() {
    var stages = document.querySelectorAll('#pipe-paramverify .mini-pipe-stage');
    var seps = document.querySelectorAll('#pipe-paramverify .mini-pipe-sep');
    var result = document.getElementById('result-paramverify');
    var delay = 0;
    stages.forEach(function(s, i) {
      setTimeout(function() { s.classList.add('on'); }, delay);
      if (seps[i]) setTimeout(function() { seps[i].classList.add('on'); }, delay + 150);
      delay += 400;
    });
    setTimeout(function() { if (result) result.classList.add('on'); }, delay + 400);
  }
  function resetParamVerify() {
    document.querySelectorAll('#pipe-paramverify .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
    document.querySelectorAll('#pipe-paramverify .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
    var result = document.getElementById('result-paramverify');
    if (result) result.classList.remove('on');
  }

  // --- L-CMP ---
  function triggerLCMP() {
    var stages = document.querySelectorAll('#pipe-lcmp .mini-pipe-stage');
    var seps = document.querySelectorAll('#pipe-lcmp .mini-pipe-sep');
    var result = document.getElementById('result-lcmp');
    var delay = 0;
    stages.forEach(function(s, i) {
      setTimeout(function() { s.classList.add('on'); }, delay);
      if (seps[i]) setTimeout(function() { seps[i].classList.add('on'); }, delay + 150);
      delay += 400;
    });
    setTimeout(function() { if (result) result.classList.add('on'); }, delay + 400);
  }
  function resetLCMP() {
    document.querySelectorAll('#pipe-lcmp .mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
    document.querySelectorAll('#pipe-lcmp .mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
    var result = document.getElementById('result-lcmp');
    if (result) result.classList.remove('on');
  }

  // Register mouseenter/mouseleave + IntersectionObserver
  var compactTriggers = [
    { sel: '#sec-livefmbench', fn: triggerLiveFMBench, reset: resetLiveFMBench },
    { sel: '#sec-paramverify', fn: triggerParamVerify, reset: resetParamVerify },
    { sel: '#sec-lcmp', fn: triggerLCMP, reset: resetLCMP }
  ];
  compactTriggers.forEach(function(t) {
    var el = document.querySelector(t.sel);
    if (!el) return;
    el.addEventListener('mouseenter', function() { t.reset(); t.fn(); });
    el.addEventListener('mouseleave', function() { t.reset(); });
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
    compactTriggers.forEach(function(t) {
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
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        links.forEach(function(l) { l.classList.remove('active'); });
        var active = map[e.target.id];
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.showcase').forEach(function(s) { obs.observe(s); });
})();

// ══════════════════════════════════════════
// GSAP entrance + section fades
// ══════════════════════════════════════════
(function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-badge', { opacity: 0, y: 14, duration: 0.6, delay: 0.15 });
  gsap.from('.hero h1', { opacity: 0, y: 20, duration: 0.7, delay: 0.35 });
  gsap.from('.hero-sub', { opacity: 0, y: 14, duration: 0.6, delay: 0.6 });
  gsap.from('.hero-formula', { opacity: 0, y: 12, duration: 0.5, delay: 0.8 });
  gsap.from('.hero-stat', { opacity: 0, y: 14, duration: 0.4, stagger: 0.1, delay: 0.95 });

  document.querySelectorAll('.gsap-fade').forEach(function(el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  setTimeout(function() {
    document.querySelectorAll('.gsap-fade').forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
  }, 3000);
})();
