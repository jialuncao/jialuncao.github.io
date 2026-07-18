// Theme
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
// Typing Engine
// ══════════════════════════════════════════
function typeCode(el, lines, speed, done, token) {
  var lineIdx = 0, charIdx = 0;
  el.innerHTML = '';
  function tick() {
    if (token && token.cancelled) return;
    if (lineIdx >= lines.length) {
      var cur = el.querySelector('.cursor');
      if (cur) cur.remove();
      if (done) done();
      return;
    }
    var line = lines[lineIdx];
    if (charIdx === 0 && lineIdx > 0) el.innerHTML = el.innerHTML.replace(/<span class="cursor"><\/span>/, '') + '\n';
    var partial = line.text.substring(0, charIdx);
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
      var tags = []; var plain = ''; var inTag = false; var plainIdx = 0;
      for (var i = 0; i < html.length; i++) {
        if (html[i] === '<') { inTag = true; tags.push({ pos: plainIdx, start: i }); }
        if (!inTag) { plain += html[i]; plainIdx++; }
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
// Code Translation Pipeline
// ══════════════════════════════════════════
var javaLines = [
  makeLine('public static int binarySearch(', '<span class="s-kw">public static int</span> <span class="s-fn">binarySearch</span>('),
  makeLine('        int[] arr, int target) {', '        <span class="s-type">int</span>[] arr, <span class="s-type">int</span> target) {'),
  makeLine('    int left = 0;', '    <span class="s-type">int</span> left = <span class="s-num">0</span>;'),
  makeLine('    int right = arr.length - 1;', '    <span class="s-type">int</span> right = arr.length - <span class="s-num">1</span>;'),
  makeLine('    while (left <= right) {', '    <span class="s-kw">while</span> (left <= right) {'),
  makeLine('        int mid = left+(right-left)/2;', '        <span class="s-type">int</span> mid = left+(right-left)/<span class="s-num">2</span>;'),
  makeLine('        if (arr[mid] == target)', '        <span class="s-kw">if</span> (arr[mid] == target)'),
  makeLine('            return mid;', '            <span class="s-kw">return</span> mid;'),
  makeLine('        if (arr[mid] < target)', '        <span class="s-kw">if</span> (arr[mid] < target)'),
  makeLine('            left = mid + 1;', '            left = mid + <span class="s-num">1</span>;'),
  makeLine('        else', '        <span class="s-kw">else</span>'),
  makeLine('            right = mid - 1;', '            right = mid - <span class="s-num">1</span>;'),
  makeLine('    }', '    }'),
  makeLine('    return -1;', '    <span class="s-kw">return</span> -<span class="s-num">1</span>;'),
  makeLine('}', '}')
];

var pseudoLines = [
  makeLine('FUNCTION binarySearch(arr, target)', '<span class="s-kw">FUNCTION</span> <span class="s-fn">binarySearch</span>(arr, target)'),
  makeLine('  left <- 0', '  left <span class="s-op">&larr;</span> <span class="s-num">0</span>'),
  makeLine('  right <- LENGTH(arr) - 1', '  right <span class="s-op">&larr;</span> <span class="s-fn">LENGTH</span>(arr) - <span class="s-num">1</span>'),
  makeLine('  WHILE left <= right DO', '  <span class="s-kw">WHILE</span> left &le; right <span class="s-kw">DO</span>'),
  makeLine('    mid <- left + (right-left)/2', '    mid <span class="s-op">&larr;</span> left + (right-left)/<span class="s-num">2</span>'),
  makeLine('    IF arr[mid] = target', '    <span class="s-kw">IF</span> arr[mid] = target'),
  makeLine('      RETURN mid', '      <span class="s-kw">RETURN</span> mid'),
  makeLine('    IF arr[mid] < target', '    <span class="s-kw">IF</span> arr[mid] < target'),
  makeLine('      left <- mid + 1', '      left <span class="s-op">&larr;</span> mid + <span class="s-num">1</span>'),
  makeLine('    ELSE', '    <span class="s-kw">ELSE</span>'),
  makeLine('      right <- mid - 1', '      right <span class="s-op">&larr;</span> mid - <span class="s-num">1</span>'),
  makeLine('  RETURN -1', '  <span class="s-kw">RETURN</span> -<span class="s-num">1</span>')
];

var pythonLines = [
  makeLine('def binary_search(arr, target):', '<span class="s-kw">def</span> <span class="s-fn">binary_search</span>(arr, target):'),
  makeLine('    left, right = 0, len(arr) - 1', '    left, right = <span class="s-num">0</span>, <span class="s-fn">len</span>(arr) - <span class="s-num">1</span>'),
  makeLine('    while left <= right:', '    <span class="s-kw">while</span> left <= right:'),
  makeLine('        mid = left + (right-left)//2', '        mid = left + (right-left)//<span class="s-num">2</span>'),
  makeLine('        if arr[mid] == target:', '        <span class="s-kw">if</span> arr[mid] == target:'),
  makeLine('            return mid', '            <span class="s-kw">return</span> mid'),
  makeLine('        if arr[mid] < target:', '        <span class="s-kw">if</span> arr[mid] < target:'),
  makeLine('            left = mid + 1', '            left = mid + <span class="s-num">1</span>'),
  makeLine('        else:', '        <span class="s-kw">else</span>:'),
  makeLine('            right = mid - 1', '            right = mid - <span class="s-num">1</span>'),
  makeLine('    return -1', '    <span class="s-kw">return</span> -<span class="s-num">1</span>')
];

var pipelineTimers = [];
function pipelineLater(fn, ms) { var id = setTimeout(fn, ms); pipelineTimers.push(id); return id; }
function pipelineClearTimers() { pipelineTimers.forEach(clearTimeout); pipelineTimers = []; }

var pipelineToken = null;
var pipelineRunning = false;

function resetPipeline() {
  pipelineClearTimers();
  if (pipelineToken) pipelineToken.cancelled = true;
  var steps = document.querySelectorAll('.pipe-step');
  steps.forEach(function(s, i) {
    if (i === 0) { s.classList.add('active'); s.classList.remove('inactive'); }
    else { s.classList.remove('active'); s.classList.add('inactive'); }
  });
  var javaEl = document.getElementById('javaCode'); if (javaEl) javaEl.innerHTML = '';
  var pseudoEl = document.getElementById('pseudoCode'); if (pseudoEl) pseudoEl.innerHTML = '';
  var pyEl = document.getElementById('pythonCode'); if (pyEl) pyEl.innerHTML = '';
}

function startPipeline(onComplete) {
  var steps = document.querySelectorAll('.pipe-step');
  pipelineToken = { cancelled: false };
  var token = pipelineToken;
  steps[0].classList.add('active');
  typeCode(document.getElementById('javaCode'), javaLines, 22, function() {
    if (token.cancelled) return;
    steps[0].classList.remove('active');
    steps[1].classList.add('active');
    steps[1].classList.remove('inactive');
    typeCode(document.getElementById('pseudoCode'), pseudoLines, 22, function() {
      if (token.cancelled) return;
      steps[1].classList.remove('active');
      steps[2].classList.add('active');
      steps[2].classList.remove('inactive');
      typeCode(document.getElementById('pythonCode'), pythonLines, 22, function() {
        if (token.cancelled) return;
        steps[2].classList.remove('active');
        steps.forEach(function(s) { s.classList.remove('inactive'); });
        if (onComplete) onComplete();
      }, token);
    }, token);
  }, token);
}

function triggerPipeline() {
  if (pipelineRunning) resetPipeline();
  pipelineRunning = true;
  startPipeline(function() { pipelineRunning = false; });
}

// ══════════════════════════════════════════
// EmbedAgent MCU Animation
// ══════════════════════════════════════════
var embedLines = [
  makeLine('#include "driver/gpio.h"', '<span class="s-pp">#include</span> <span class="s-str">"driver/gpio.h"</span>'),
  makeLine('#include "driver/uart.h"', '<span class="s-pp">#include</span> <span class="s-str">"driver/uart.h"</span>'),
  makeLine('', ''),
  makeLine('void gpio_init(void) {', '<span class="s-type">void</span> <span class="s-fn">gpio_init</span>(<span class="s-type">void</span>) {'),
  makeLine('  gpio_set_direction(GPIO_NUM_5,', '  <span class="s-fn">gpio_set_direction</span>(<span class="s-num">GPIO_NUM_5</span>,'),
  makeLine('                     GPIO_MODE_OUTPUT);', '                     <span class="s-num">GPIO_MODE_OUTPUT</span>);'),
  makeLine('  gpio_set_level(GPIO_NUM_5, 1);', '  <span class="s-fn">gpio_set_level</span>(<span class="s-num">GPIO_NUM_5</span>, <span class="s-num">1</span>);'),
  makeLine('}', '}'),
  makeLine('', ''),
  makeLine('void uart_init(void) {', '<span class="s-type">void</span> <span class="s-fn">uart_init</span>(<span class="s-type">void</span>) {'),
  makeLine('  uart_config_t cfg = {', '  <span class="s-type">uart_config_t</span> cfg = {'),
  makeLine('    .baud_rate = 115200,', '    .baud_rate = <span class="s-num">115200</span>,'),
  makeLine('    .data_bits = UART_DATA_8_BITS', '    .data_bits = <span class="s-num">UART_DATA_8_BITS</span>'),
  makeLine('  };', '  };'),
  makeLine('  uart_param_config(UART_NUM_1, &cfg);', '  <span class="s-fn">uart_param_config</span>(<span class="s-num">UART_NUM_1</span>, &cfg);'),
  makeLine('  uart_driver_install(UART_NUM_1,', '  <span class="s-fn">uart_driver_install</span>(<span class="s-num">UART_NUM_1</span>,'),
  makeLine('      1024, 0, 0, NULL, 0);', '      <span class="s-num">1024</span>, <span class="s-num">0</span>, <span class="s-num">0</span>, NULL, <span class="s-num">0</span>);'),
  makeLine('}', '}')
];

var embedTimers = [];
function embedLater(fn, ms) { var id = setTimeout(fn, ms); embedTimers.push(id); return id; }
function embedClearTimers() { embedTimers.forEach(clearTimeout); embedTimers = []; }

var embedToken = null;
var embedRunning = false;

function resetEmbed() {
  embedClearTimers();
  if (embedToken) embedToken.cancelled = true;
  var codeEl = document.getElementById('embedCode');
  if (codeEl) codeEl.innerHTML = '';
  document.querySelectorAll('.mcu-pin').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.mcu-label-active').forEach(function(l) { l.classList.remove('show'); });
  var chip = document.querySelector('.mcu-chip');
  if (chip) chip.classList.remove('active');
}

function startEmbed(onComplete) {
  var codeEl = document.getElementById('embedCode');
  var pins = document.querySelectorAll('.mcu-pin');
  var labels = document.querySelectorAll('.mcu-label-active');
  var chip = document.querySelector('.mcu-chip');

  embedToken = { cancelled: false };
  var token = embedToken;
  // Two independent timelines (typing + pin/label reveal) must both finish
  // before the demo is considered complete.
  var pending = 2;
  function maybeDone() { pending--; if (pending === 0 && onComplete) onComplete(); }

  typeCode(codeEl, embedLines, 25, function() {
    if (token.cancelled) return;
    if (chip) chip.classList.add('active');
    maybeDone();
  }, token);

  // Activate pins as code types
  embedLater(function() { if (pins[0]) pins[0].classList.add('active'); }, 1200);
  embedLater(function() { if (pins[1]) pins[1].classList.add('active'); }, 1800);
  embedLater(function() { if (labels[0]) labels[0].classList.add('show'); }, 1500);
  embedLater(function() { if (pins[2]) pins[2].classList.add('active'); }, 3200);
  embedLater(function() { if (labels[1]) labels[1].classList.add('show'); }, 3400);
  embedLater(function() { if (pins[3]) pins[3].classList.add('active'); maybeDone(); }, 3500);
}

function triggerEmbed() {
  if (embedRunning) resetEmbed();
  embedRunning = true;
  startEmbed(function() { embedRunning = false; });
}

// ══════════════════════════════════════════
// iCoRe Retrieval Flow
// ══════════════════════════════════════════
var icoreTimers = [];
function icoreLater(fn, ms) { var id = setTimeout(fn, ms); icoreTimers.push(id); return id; }
function icoreClearTimers() { icoreTimers.forEach(clearTimeout); icoreTimers = []; }

var icoreRunning = false;

function resetICore() {
  icoreClearTimers();
  document.querySelectorAll('.icore-flow > *').forEach(function(el) { el.classList.remove('visible'); });
}

function startICore(onComplete) {
  var all = document.querySelectorAll('.icore-flow > *');
  var delay = 0;
  all.forEach(function(el, i) {
    var isLast = (i === all.length - 1);
    icoreLater(function() {
      el.classList.add('visible');
      if (isLast && onComplete) onComplete();
    }, delay);
    delay += el.classList.contains('icore-node') ? 350 : 200;
  });
}

function triggerICore() {
  if (icoreRunning) resetICore();
  icoreRunning = true;
  startICore(function() { icoreRunning = false; });
}

// ══════════════════════════════════════════
// Cross-Lingual RAG Animation
// ══════════════════════════════════════════
var ragLines = [
  makeLine('def quick_sort(arr):', '<span class="s-kw">def</span> <span class="s-fn">quick_sort</span>(arr):'),
  makeLine('    if len(arr) <= 1:', '    <span class="s-kw">if</span> <span class="s-fn">len</span>(arr) <= <span class="s-num">1</span>:'),
  makeLine('        return arr', '        <span class="s-kw">return</span> arr'),
  makeLine('    pivot = arr[len(arr)//2]', '    pivot = arr[<span class="s-fn">len</span>(arr)//<span class="s-num">2</span>]'),
  makeLine('    left = [x for x in arr', '    left = [x <span class="s-kw">for</span> x <span class="s-kw">in</span> arr'),
  makeLine('            if x < pivot]', '            <span class="s-kw">if</span> x < pivot]'),
  makeLine('    mid = [x for x in arr', '    mid = [x <span class="s-kw">for</span> x <span class="s-kw">in</span> arr'),
  makeLine('           if x == pivot]', '           <span class="s-kw">if</span> x == pivot]'),
  makeLine('    right = [x for x in arr', '    right = [x <span class="s-kw">for</span> x <span class="s-kw">in</span> arr'),
  makeLine('             if x > pivot]', '             <span class="s-kw">if</span> x > pivot]'),
  makeLine('    return quick_sort(left)', '    <span class="s-kw">return</span> <span class="s-fn">quick_sort</span>(left)'),
  makeLine('         + mid', '         + mid'),
  makeLine('         + quick_sort(right)', '         + <span class="s-fn">quick_sort</span>(right)')
];

var ragTimers = [];
function ragLater(fn, ms) { var id = setTimeout(fn, ms); ragTimers.push(id); return id; }
function ragClearTimers() { ragTimers.forEach(clearTimeout); ragTimers = []; }

var ragToken = null;
var ragRunning = false;

function resetRAG() {
  ragClearTimers();
  if (ragToken) ragToken.cancelled = true;
  document.querySelectorAll('.rag-doc').forEach(function(d) {
    d.classList.remove('visible');
    d.classList.remove('highlight');
  });
  var arrow = document.querySelector('.rag-arrow-icon');
  if (arrow) arrow.classList.remove('active');
  var outEl = document.getElementById('ragOutput');
  if (outEl) outEl.innerHTML = '';
}

function startRAG(onComplete) {
  var docs = document.querySelectorAll('.rag-doc');
  var arrow = document.querySelector('.rag-arrow-icon');
  var delay = 0;

  ragToken = { cancelled: false };
  var token = ragToken;

  docs.forEach(function(d, i) {
    ragLater(function() {
      d.classList.add('visible');
      if (i === 1 || i === 3) {
        ragLater(function() { d.classList.add('highlight'); }, 300);
      }
    }, delay);
    delay += 300;
  });
  ragLater(function() {
    if (arrow) arrow.classList.add('active');
  }, delay);
  ragLater(function() {
    typeCode(document.getElementById('ragOutput'), ragLines, 25, function() {
      if (!token.cancelled && onComplete) onComplete();
    }, token);
  }, delay + 400);
}

function triggerRAG() {
  if (ragRunning) resetRAG();
  ragRunning = true;
  startRAG(function() { ragRunning = false; });
}

// ══════════════════════════════════════════
// RAG + API Documentation Animation
// ══════════════════════════════════════════
var ragapiTimers = [];
function ragapiLater(fn, ms) { var id = setTimeout(fn, ms); ragapiTimers.push(id); return id; }
function ragapiClearTimers() { ragapiTimers.forEach(clearTimeout); ragapiTimers = []; }
var ragapiRunning = false;

function resetRagapi() {
  ragapiClearTimers();
  var wrap = document.getElementById('anim-ragapi');
  if (!wrap) return;
  wrap.querySelectorAll('.mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  wrap.querySelectorAll('.mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var stat = document.getElementById('stat-ragapi');
  if (stat) stat.classList.remove('on');
}

function triggerRagapi() {
  if (ragapiRunning) resetRagapi();
  ragapiRunning = true;
  var wrap = document.getElementById('anim-ragapi');
  if (!wrap) { ragapiRunning = false; return; }
  var stages = wrap.querySelectorAll('.mini-pipe-stage');
  var seps = wrap.querySelectorAll('.mini-pipe-sep');
  var delay = 0;
  stages.forEach(function(s, i) {
    ragapiLater(function() { s.classList.add('on'); }, delay);
    if (i < seps.length) {
      ragapiLater(function() { seps[i].classList.add('on'); }, delay + 150);
    }
    delay += 350;
  });
  ragapiLater(function() {
    var stat = document.getElementById('stat-ragapi');
    if (stat) stat.classList.add('on');
    ragapiRunning = false;
  }, delay + 300);
}

// ══════════════════════════════════════════
// DL Program Repair Animation
// ══════════════════════════════════════════
var dlrepairTimers = [];
function dlrepairLater(fn, ms) { var id = setTimeout(fn, ms); dlrepairTimers.push(id); return id; }
function dlrepairClearTimers() { dlrepairTimers.forEach(clearTimeout); dlrepairTimers = []; }
var dlrepairRunning = false;

var dlrepairRates = ['14.5%', '28.7%', '42.1%'];

function resetDlrepair() {
  dlrepairClearTimers();
  var wrap = document.getElementById('anim-dlrepair');
  if (!wrap) return;
  wrap.querySelectorAll('.mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  wrap.querySelectorAll('.mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var stat = document.getElementById('stat-dlrepair');
  if (stat) { stat.classList.remove('on'); stat.textContent = ''; }
}

function triggerDlrepair() {
  if (dlrepairRunning) resetDlrepair();
  dlrepairRunning = true;
  var wrap = document.getElementById('anim-dlrepair');
  if (!wrap) { dlrepairRunning = false; return; }
  var stages = wrap.querySelectorAll('.mini-pipe-stage');
  var seps = wrap.querySelectorAll('.mini-pipe-sep');
  var stat = document.getElementById('stat-dlrepair');
  var delay = 0;
  stages.forEach(function(s, i) {
    dlrepairLater(function() {
      s.classList.add('on');
      if (stat) { stat.textContent = dlrepairRates[i]; stat.classList.add('on'); }
    }, delay);
    if (i < seps.length) {
      dlrepairLater(function() { seps[i].classList.add('on'); }, delay + 150);
    }
    delay += 500;
  });
  dlrepairLater(function() { dlrepairRunning = false; }, delay);
}

// ══════════════════════════════════════════
// NoCode-bench Animation
// ══════════════════════════════════════════
var nocodeTimers = [];
function nocodeLater(fn, ms) { var id = setTimeout(fn, ms); nocodeTimers.push(id); return id; }
function nocodeClearTimers() { nocodeTimers.forEach(clearTimeout); nocodeTimers = []; }
var nocodeRunning = false;

function resetNocode() {
  nocodeClearTimers();
  var wrap = document.getElementById('anim-nocode');
  if (!wrap) return;
  wrap.querySelectorAll('.mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
  wrap.querySelectorAll('.mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
  var fill = document.getElementById('progress-nocode');
  if (fill) fill.style.width = '0';
  var badge = document.getElementById('badge-nocode');
  if (badge) badge.classList.remove('on');
}

function triggerNocode() {
  if (nocodeRunning) resetNocode();
  nocodeRunning = true;
  var wrap = document.getElementById('anim-nocode');
  if (!wrap) { nocodeRunning = false; return; }
  var stages = wrap.querySelectorAll('.mini-pipe-stage');
  var seps = wrap.querySelectorAll('.mini-pipe-sep');
  var delay = 0;
  stages.forEach(function(s, i) {
    nocodeLater(function() { s.classList.add('on'); }, delay);
    if (i < seps.length) {
      nocodeLater(function() { seps[i].classList.add('on'); }, delay + 150);
    }
    delay += 350;
  });
  nocodeLater(function() {
    var fill = document.getElementById('progress-nocode');
    if (fill) fill.style.width = '28.07%';
  }, delay + 200);
  nocodeLater(function() {
    var badge = document.getElementById('badge-nocode');
    if (badge) badge.classList.add('on');
    nocodeRunning = false;
  }, delay + 800);
}

// ══════════════════════════════════════════
// In-Context Examples Animation
// ══════════════════════════════════════════
var incontextTimers = [];
function incontextLater(fn, ms) { var id = setTimeout(fn, ms); incontextTimers.push(id); return id; }
function incontextClearTimers() { incontextTimers.forEach(clearTimeout); incontextTimers = []; }
var incontextRunning = false;

function resetIncontext() {
  incontextClearTimers();
  var wrap = document.getElementById('anim-incontext');
  if (!wrap) return;
  wrap.querySelectorAll('.feature-tag').forEach(function(t) {
    t.classList.remove('on');
    t.classList.remove('highlight');
  });
}

function triggerIncontext() {
  if (incontextRunning) resetIncontext();
  incontextRunning = true;
  var wrap = document.getElementById('anim-incontext');
  if (!wrap) { incontextRunning = false; return; }
  var tags = wrap.querySelectorAll('.feature-tag');
  var delay = 0;
  tags.forEach(function(t, i) {
    incontextLater(function() { t.classList.add('on'); }, delay);
    delay += 300;
  });
  // Highlight naming as most important
  incontextLater(function() {
    if (tags[0]) tags[0].classList.add('highlight');
    incontextRunning = false;
  }, delay + 400);
}

// ══════════════════════════════════════════
// Hover Triggers (replay on every hover)
// ══════════════════════════════════════════
// Generic mini-pipe animation factory
function makeMiniPipeTrigger(animId, statId) {
  var timers = [];
  var running = false;
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    var wrap = document.getElementById(animId);
    if (!wrap) return;
    wrap.querySelectorAll('.mini-pipe-stage').forEach(function(s) { s.classList.remove('on'); });
    wrap.querySelectorAll('.mini-pipe-sep').forEach(function(s) { s.classList.remove('on'); });
    if (statId) { var stat = document.getElementById(statId); if (stat) stat.classList.remove('on'); }
    running = false;
  }
  function trigger() {
    if (running) reset();
    running = true;
    var wrap = document.getElementById(animId);
    if (!wrap) { running = false; return; }
    var stages = wrap.querySelectorAll('.mini-pipe-stage');
    var seps = wrap.querySelectorAll('.mini-pipe-sep');
    var delay = 0;
    stages.forEach(function(s, i) {
      var id = setTimeout(function() { s.classList.add('on'); }, delay);
      timers.push(id);
      if (i < seps.length) {
        var id2 = setTimeout(function() { seps[i].classList.add('on'); }, delay + 150);
        timers.push(id2);
      }
      delay += 350;
    });
    if (statId) {
      var id3 = setTimeout(function() {
        var stat = document.getElementById(statId);
        if (stat) stat.classList.add('on');
        running = false;
      }, delay + 300);
      timers.push(id3);
    } else {
      var id4 = setTimeout(function() { running = false; }, delay);
      timers.push(id4);
    }
  }
  return { trigger: trigger, reset: reset };
}

var mradoptAnim = makeMiniPipeTrigger('anim-mradopt', 'stat-mradopt');
var sembicAnim = makeMiniPipeTrigger('anim-sembic', null);
var cometAnim = makeMiniPipeTrigger('anim-comet', null);
var dllensAnim = makeMiniPipeTrigger('anim-dllens', null);

(function() {
  var triggers = [
    { sel: '#sec-translation', fn: triggerPipeline, reset: resetPipeline },
    { sel: '#sec-embed', fn: triggerEmbed, reset: resetEmbed },
    { sel: '#sec-icore', fn: triggerICore, reset: resetICore },
    { sel: '#sec-rag', fn: triggerRAG, reset: resetRAG },
    { sel: '#sec-ragapi', fn: triggerRagapi, reset: resetRagapi },
    { sel: '#sec-dlrepair', fn: triggerDlrepair, reset: resetDlrepair },
    { sel: '#sec-nocode', fn: triggerNocode, reset: resetNocode },
    { sel: '#sec-incontext', fn: triggerIncontext, reset: resetIncontext },
    { sel: '#sec-mradopt', fn: mradoptAnim.trigger, reset: mradoptAnim.reset },
    { sel: '#sec-sembic', fn: sembicAnim.trigger, reset: sembicAnim.reset },
    { sel: '#sec-comet', fn: cometAnim.trigger, reset: cometAnim.reset },
    { sel: '#sec-dllens', fn: dllensAnim.trigger, reset: dllensAnim.reset }
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
// GSAP Scroll Animations
// ══════════════════════════════════════════
(function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge', { opacity: 0, y: 15, duration: 0.6, delay: 0.2 });
  gsap.from('.hero h1', { opacity: 0, y: 20, duration: 0.7, delay: 0.4 });
  gsap.from('.hero-sub', { opacity: 0, y: 15, duration: 0.6, delay: 0.7 });
  gsap.from('.hero-stat', { opacity: 0, y: 15, duration: 0.4, stagger: 0.1, delay: 0.9 });

  // Sections fade in
  document.querySelectorAll('.gsap-fade').forEach(function(el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  // Fallback
  setTimeout(function() {
    document.querySelectorAll('.gsap-fade').forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
  }, 3000);
})();

// Hero code background
(function() {
  var bg = document.getElementById('heroBg');
  if (!bg) return;
  var code = 'def train(model, data):\n  for epoch in range(100):\n    loss = compute_loss(model, data)\n    loss.backward()\n    optimizer.step()\n\nclass CodeTranslator(nn.Module):\n  def __init__(self, vocab_size):\n    self.encoder = Encoder(vocab_size)\n    self.decoder = Decoder(vocab_size)\n  def forward(self, src, tgt):\n    enc = self.encoder(src)\n    return self.decoder(enc, tgt)\n\ndef evaluate(model, test_set):\n  results = []\n  for item in test_set:\n    pred = model.generate(item.src)\n    results.append(bleu(pred, item.ref))\n  return sum(results) / len(results)\n\n';
  bg.textContent = (code + code + code + code + code).split('').map(function(c,i) { return c; }).join('');
})();
