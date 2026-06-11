gsap.registerPlugin(ScrollTrigger);

// Theme toggle
function toggleTheme() {
  var d = document.documentElement.getAttribute('data-theme') === 'dark';
  if (d) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
  else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
  updateThemeIcon();
}
function updateThemeIcon() {
  var d = document.documentElement.getAttribute('data-theme') === 'dark';
  var i = document.getElementById('themeIcon'), l = document.getElementById('themeLabel');
  if (i) i.textContent = d ? '☀' : '☾';
  if (l) l.textContent = d ? 'Dark' : 'Light';
}
updateThemeIcon();

// Hero — text scramble effect (2 lines) + hover replay — desktop only
(function() {
  if (window.innerWidth <= 900) return;
  var el = document.getElementById('scramble-target');
  if (!el) return;
  var lines = el.querySelectorAll('.line');
  var origHTML = Array.from(lines).map(function(l) { return l.innerHTML; });
  var lineTexts = [
    'Applying advanced AI to automate',
    'software implementation, testing, and program verification'
  ];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&<>?';
  var scrambleLens = [22, 38];
  var activeTimers = [];

  function runScramble() {
    activeTimers.forEach(function(t) { clearInterval(t); clearTimeout(t); });
    activeTimers = [];

    lines.forEach(function(span, i) {
      span.textContent = Array.from({length: scrambleLens[i]}, function() { return chars[Math.floor(Math.random() * chars.length)]; }).join('');
    });
    var preTimer = setInterval(function() {
      lines.forEach(function(span, i) {
        span.textContent = Array.from({length: scrambleLens[i]}, function() { return chars[Math.floor(Math.random() * chars.length)]; }).join('');
      });
    }, 40);
    activeTimers.push(preTimer);

    var t = setTimeout(function() {
      clearInterval(preTimer);
      lineTexts.forEach(function(text, li) {
        var span = lines[li];
        var len = text.length;
        var locked = new Array(len).fill(false);
        var display = new Array(len);
        for (var i = 0; i < len; i++) display[i] = chars[Math.floor(Math.random() * chars.length)];

        var lockIndex = 0;
        var scrambleTimer = setInterval(function() {
          for (var i = 0; i < len; i++) {
            if (!locked[i]) display[i] = chars[Math.floor(Math.random() * chars.length)];
          }
          span.textContent = display.join('');
        }, 40);
        activeTimers.push(scrambleTimer);

        var lockTimer = setInterval(function() {
          if (lockIndex >= len) {
            clearInterval(scrambleTimer);
            clearInterval(lockTimer);
            span.innerHTML = origHTML[li];
            return;
          }
          locked[lockIndex] = true;
          display[lockIndex] = text[lockIndex];
          lockIndex++;
        }, 35);
        activeTimers.push(lockTimer);
      });
    }, 400);
    activeTimers.push(t);
  }

  // Run on page load
  runScramble();

  // Replay on hover
  el.addEventListener('mouseenter', runScramble);
})();
gsap.from('.hero p', { opacity: 0, y: 15, duration: 0.6, delay: 2.2 });
gsap.from('.hero-tag', { opacity: 0, y: 10, scale: 0.9, duration: 0.4, stagger: 0.08, delay: 1.1, ease: 'back.out(1.7)' });

// Award cards — slide up
gsap.from('.ab-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15, delay: 1.3 });

// Marquee — infinite scroll
const marquee = document.getElementById('marquee');
const mw = marquee.scrollWidth / 2;
gsap.to(marquee, { x: -mw, duration: 25, ease: 'none', repeat: -1 });

// Scroll-triggered sections
document.querySelectorAll('.gsap-fade').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 98%', once: true }
  });
});
// Fallback: reveal any still-hidden sections after 3s
setTimeout(() => {
  document.querySelectorAll('.gsap-fade').forEach(el => {
    if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
    }
  });
}, 3000);

// Featured works — stagger slide in
ScrollTrigger.create({
  trigger: '.fw-list',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.from('.fw', { opacity: 0, x: -15, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
  }
});

// Research topic blocks — stagger
ScrollTrigger.create({
  trigger: '.research-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.fromTo('.research-topic', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
  }
});

// Year blocks — stagger
ScrollTrigger.create({
  trigger: '.year-block',
  start: 'top 88%',
  once: true,
  onEnter: () => {
    gsap.from('.year-block', { opacity: 0, x: -15, duration: 0.4, stagger: 0.06, ease: 'power2.out' });
  }
});

// Stats — count up
ScrollTrigger.create({
  trigger: '.stats-row',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.textContent) || 0;
      if (target > 0) {
        gsap.from(el, { textContent: 0, duration: 1.2, ease: 'power1.out', snap: { textContent: 1 },
          onUpdate: function() { el.textContent = Math.ceil(parseFloat(el.textContent)); }
        });
      }
    });
    gsap.from('.stat-card', { opacity: 0, y: 15, duration: 0.4, stagger: 0.08 });
  }
});

// Section bars — grow in
document.querySelectorAll('.sec-bar').forEach(bar => {
  gsap.from(bar, {
    scaleY: 0, transformOrigin: 'top',
    duration: 0.4, ease: 'power2.out',
    scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
  });
});

// Sync code-block widths: FM matches SE
function syncCodeBlocks() {
  var seBlocks = document.querySelectorAll('#nlToCodeAnim .code-block');
  var fmBlocks = document.querySelectorAll('#acslAnim .code-block');
  if (seBlocks.length === 2 && fmBlocks.length === 2) {
    fmBlocks[0].style.width = seBlocks[0].offsetWidth + 'px';
    fmBlocks[1].style.width = seBlocks[1].offsetWidth + 'px';
  }
}
window.addEventListener('load', syncCodeBlocks);
window.addEventListener('resize', syncCodeBlocks);

// Sidebar — subtle entrance (immediate on load)
gsap.fromTo('.s-avatar', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' });
gsap.fromTo('.s-name', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3 });
gsap.fromTo('.s-role', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.4 });
gsap.fromTo('.s-nav a', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, delay: 0.5 });
gsap.fromTo('.s-links a', { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, delay: 0.8 });

// ══════════════════════════════════════════
// TOPIC 1: Benchmark Bar Chart Race
// ══════════════════════════════════════════
const benchData = {
  humaneval: [
    { name: 'Claude', score: 92.1, color: '#4d6dff' },
    { name: 'GPT', score: 90.2, color: '#60a5fa' },
    { name: 'Gemini', score: 88.4, color: '#34d399' },
    { name: 'Llama', score: 82.7, color: '#fb923c' },
    { name: 'DeepSeek', score: 89.5, color: '#f87171' },
  ],
  mbpp: [
    { name: 'Claude', score: 88.3, color: '#4d6dff' },
    { name: 'GPT', score: 87.1, color: '#60a5fa' },
    { name: 'Gemini', score: 85.9, color: '#34d399' },
    { name: 'Llama', score: 79.4, color: '#fb923c' },
    { name: 'DeepSeek', score: 86.2, color: '#f87171' },
  ],
  livecodebench: [
    { name: 'Claude', score: 76.8, color: '#4d6dff' },
    { name: 'GPT', score: 72.5, color: '#60a5fa' },
    { name: 'Gemini', score: 70.1, color: '#34d399' },
    { name: 'Llama', score: 58.3, color: '#fb923c' },
    { name: 'DeepSeek', score: 74.2, color: '#f87171' },
  ],
  swebench: [
    { name: 'Claude', score: 49.0, color: '#4d6dff' },
    { name: 'GPT', score: 38.4, color: '#60a5fa' },
    { name: 'Gemini', score: 32.8, color: '#34d399' },
    { name: 'Llama', score: 22.0, color: '#fb923c' },
    { name: 'DeepSeek', score: 42.0, color: '#f87171' },
  ],
  cruxeval: [
    { name: 'Claude', score: 84.6, color: '#4d6dff' },
    { name: 'GPT', score: 81.2, color: '#60a5fa' },
    { name: 'Gemini', score: 79.8, color: '#34d399' },
    { name: 'Llama', score: 68.5, color: '#fb923c' },
    { name: 'DeepSeek', score: 82.1, color: '#f87171' },
  ],
};

function buildBenchRows() {
  const container = document.getElementById('benchRows');
  container.innerHTML = '';
  const models = benchData.humaneval;
  models.forEach(m => {
    container.innerHTML += `
      <div class="bench-row">
        <span class="bench-dot" style="background:${m.color}"></span>
        <span class="bench-name">${m.name}</span>
        <div class="bench-bar-bg"><div class="bench-bar" data-model="${m.name}" style="background:${m.color}"></div></div>
        <span class="bench-score" data-model="${m.name}">0</span>
      </div>`;
  });
}
buildBenchRows();

function animateBench(benchKey) {
  const data = benchData[benchKey];
  const maxScore = 100;
  data.forEach((m, i) => {
    const bar = document.querySelector(`.bench-bar[data-model="${m.name}"]`);
    const score = document.querySelector(`.bench-score[data-model="${m.name}"]`);
    if (bar && score) {
      bar.style.transition = 'none';
      bar.style.width = '0';
      score.textContent = '0.0';
      setTimeout(() => {
        bar.style.transition = 'width 3.5s cubic-bezier(0.16, 1, 0.3, 1)';
        bar.style.width = (m.score / maxScore * 100) + '%';
        gsap.to({ val: 0 }, {
          val: m.score, duration: 3.5, ease: 'power2.out',
          onUpdate: function() { score.textContent = this.targets()[0].val.toFixed(1); }
        });
      }, i * 150);
    }
  });
}

// Benchmark switcher
document.querySelectorAll('.bench-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bench-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    animateBench(btn.dataset.bench);
  });
});

// Trigger on scroll
let benchTriggered = false;
ScrollTrigger.create({
  trigger: '#benchmarkAnim',
  start: 'top 75%',
  once: true,
  onEnter: () => {
    if (!benchTriggered) {
      benchTriggered = true;
      animateBench('humaneval');
    }
  }
});
document.getElementById('benchmarkAnim').addEventListener('mouseenter', function() {
  var active = document.querySelector('.bench-btn.active');
  animateBench(active ? active.dataset.bench : 'humaneval');
});

// ══════════════════════════════════════════
// TOPIC 2: NL → Code Generation — scroll + hover
// ══════════════════════════════════════════
function animateNlToCode() {
  var nlLines = document.querySelectorAll('#nlToCodeAnim .nl-line');
  var codeLines = document.querySelectorAll('#nlToCodeAnim .code-line');
  nlLines.forEach(function(l) { gsap.set(l, { opacity: 0 }); });
  codeLines.forEach(function(l) { gsap.set(l, { opacity: 0 }); });
  nlLines.forEach(function(l) { gsap.to(l, { opacity: 1, duration: 0.4, delay: parseFloat(l.dataset.delay) * 0.2 }); });
  codeLines.forEach(function(l) { gsap.to(l, { opacity: 1, duration: 0.35, delay: parseFloat(l.dataset.delay) * 0.18 }); });
}
ScrollTrigger.create({ trigger: '#nlToCodeAnim', start: 'top 75%', once: true, onEnter: animateNlToCode });
document.getElementById('nlToCodeAnim').addEventListener('mouseenter', animateNlToCode);

// ══════════════════════════════════════════
// TOPIC 3: C → C + ACSL — scroll + hover
// ══════════════════════════════════════════
function animateAcsl() {
  var allLines = document.querySelectorAll('#acslAnim .code-line');
  allLines.forEach(function(l) { gsap.set(l, { opacity: 0 }); });
  allLines.forEach(function(l) { gsap.to(l, { opacity: 1, duration: 0.35, delay: parseFloat(l.dataset.delay) * 0.16 }); });
}
ScrollTrigger.create({ trigger: '#acslAnim', start: 'top 75%', once: true, onEnter: animateAcsl });
document.getElementById('acslAnim').addEventListener('mouseenter', animateAcsl);

// ══════════════════════════════════════════
// TOPIC 4: Neural Network Bug Detection — scroll + hover
// ══════════════════════════════════════════
(function() {
  var nodes = document.querySelectorAll('.nn-node');
  var edgesG = document.getElementById('nnEdges');
  var layers = [[],[],[],[]];
  nodes.forEach(function(n) { layers[+n.dataset.layer].push(n); });
  for (var l = 0; l < 3; l++) {
    layers[l].forEach(function(src) {
      layers[l+1].forEach(function(dst) {
        var line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', src.cx.baseVal.value);
        line.setAttribute('y1', src.cy.baseVal.value);
        line.setAttribute('x2', dst.cx.baseVal.value);
        line.setAttribute('y2', dst.cy.baseVal.value);
        line.classList.add('nn-edge');
        line.dataset.src = src.dataset.layer;
        line.dataset.dst = (+src.dataset.layer+1).toString();
        if (dst.dataset.buggy) line.dataset.toBuggy = 'true';
        edgesG.appendChild(line);
      });
    });
  }
  var nnTimers = [];
  function animateNN() {
    nnTimers.forEach(function(t) { clearTimeout(t); });
    nnTimers = [];
    nodes.forEach(function(n) { n.classList.remove('scanned','buggy'); });
    document.querySelectorAll('.nn-edge').forEach(function(e) { e.classList.remove('active','buggy'); });
    document.getElementById('nnBugCount').textContent = '0';
    var bugs = 0, d = 0;
    for (var li = 0; li < 4; li++) {
      (function(layer) {
        if (layer > 0) {
          nnTimers.push(setTimeout(function() {
            document.querySelectorAll('.nn-edge[data-dst="'+layer+'"]').forEach(function(e) { e.classList.add('active'); });
          }, d));
          d += 300;
        }
        layers[layer].forEach(function(n, ni) {
          nnTimers.push(setTimeout(function() {
            n.classList.add('scanned');
            if (n.dataset.buggy) {
              nnTimers.push(setTimeout(function() {
                n.classList.remove('scanned');
                n.classList.add('buggy');
                bugs++;
                document.getElementById('nnBugCount').textContent = bugs;
                document.querySelectorAll('.nn-edge[data-toBuggy="true"]').forEach(function(e) {
                  if (+e.getAttribute('x2') == n.cx.baseVal.value && +e.getAttribute('y2') == n.cy.baseVal.value) e.classList.add('buggy');
                });
              }, 200));
            }
          }, d + ni * 150));
        });
        d += layers[layer].length * 150 + 200;
      })(li);
    }
  }
  ScrollTrigger.create({ trigger: '#nnBugAnim', start: 'top 75%', once: true, onEnter: animateNN });
  document.getElementById('nnBugAnim').addEventListener('mouseenter', animateNN);
})();

// Topic papers stagger
document.querySelectorAll('.topic-papers').forEach(container => {
  ScrollTrigger.create({
    trigger: container,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.from(container.querySelectorAll('.topic-paper'), {
        opacity: 0, y: 16, duration: 0.4, stagger: 0.08
      });
    }
  });
});

// ══════════════════════════════════════════
// Guppy Fish Chat (powered by guppyLM-9M)
// ══════════════════════════════════════════
var GUPPY_MODEL_BASE='https://arman-bd.github.io/guppylm',GUPPY_CONFIG={vocab_size:4096,max_seq_len:128,d_model:384,n_layers:6,n_heads:6,ffn_hidden:768,pad_id:0,bos_id:1,eos_id:2},GUPPY_GEN={temperature:0.7,top_k:50,max_tokens:32},guppySession=null,guppyTokenizer=null,guppyLoading=false;
var chatKB={research:"Jialun's research focuses on applying AI to automate software implementation, testing, and program verification. Key areas:\n• LLM Benchmarking — rigorous evaluation of LLMs for code\n• LLM for SE — code generation, testing, bug localization\n• LLM for Formal Methods — specification synthesis, theorem proving\n• SE for/with AI — testing NLP/DL systems",publication:"She has 30+ publications at top venues including ICSE, FSE, ASE, CAV, ACL, ICML, USENIX Security, AAAI, and TOSEM.",award:"🏆 ACM SIGSOFT Outstanding Dissertation Award 2025 (1–2 worldwide/yr)\n🏆 Young Scientist Award in Engineering Science 2025 (1/yr in HK)\n🏆 ASE 2024 Distinguished Paper Award\n• Huawei Fellowship (2019–2023)\n• China National Scholarship (2014, 2017)",phd:"Jialun is looking for 2–3 fully funded PhD students at Imperial College London starting late 2026.\n\nPreferred experience:\n• AI agents development\n• AI infrastructure / large-scale systems\n• Software testing / program analysis\n• Formal verification (theorem proving, model checking)",position:"Open positions: fully funded PhDs, self-funded / visiting PhD students, and remote RAs/interns.\n\n📩 Send CV + 1–2 representative works + research plan to: jialuncao [at] ust [dot] hk",imperial:"She will join the Department of Computing at Imperial College London as an Assistant Professor in late 2026!",benchmark:"Key benchmark works:\n• Position: Code Benchmarks (ICML'26) — rigor, reliability, reproducibility\n• SWE-ABS (ICML'26) — adversarial benchmark strengthening\n• CruxEval-X (ACL'25) — multilingual code reasoning\n• DomainEval (AAAI'25) — multi-domain code generation\n• JavaBench (ASE'24) — object-oriented code generation",formal:"Formal methods works:\n• From Informal to Formal (ACL'25) — NL requirements to verifiable proofs, 1.6k+ HuggingFace downloads\n• AutoSpec (CAV'24) — specification synthesis via LLMs + static analysis\n• ModelWisdom (FM'26) — TLA+ model visualization, digest and repair\n• LiveFMBench — agentic workflows in specification generation",contact:"Email: jialuncao [at] ust [dot] hk\nGitHub: github.com/ArabelaTso\nGoogle Scholar: search 'Jialun Cao'",teaching:"Spring 2025: Instructor for COMP 1021 (Intro to CS) at HKUST.\nCourse materials: github.com/ArabelaTso/COMP1021-2025S\n\nPreviously TA for COMP 1021 (Fall 2023) and COMP 3021 Java Programming (2020).",service:"She serves on program committees of top conferences: ICSE 2025–26, FSE 2025, ASE 2025, ISSRE 2024, and more. Also a reviewer for TOSEM, TSE, and EMSE.\n\nShe is on the ACM SIGSOFT award committees for Outstanding Research, Distinguished Service, and Influential Educator (2025).",se4ai:"SE for/with AI works:\n• DeepFD (ICSE'22) — automated fault diagnosis for DL programs\n• Testing Coreference Resolution (FSE'23)\n• SemMT (TOSEM) — semantic-based testing for machine translation\n• COMET (TOSEM) — coverage-guided model generation for DL library testing",codegen:"LLM for SE works:\n• EmbedAgent (ICSE'26) — LLMs in embedded system development\n• iCoRe (FSE'26) — bug reproduction test generation\n• SemBIC (FSE'25) — semantic-aware bug-inducing commit identification\n• MR-Adopt (ASE'24) — metamorphic testing\n• Code Translation via Pseudocode (TOSEM'26)",education:"PhD (2019–2024) from HKUST, supervised by Prof. Shing-Chi Cheung in the CASTLE lab.\nMS (2016–2019) from Institute of Software, Chinese Academy of Sciences.\nBS (2012–2016) from Shandong University.",experience:"Current: Research Assistant Professor at HKUST CSE (since Aug 2024).\nPrevious: Postdoc at HKUST (Apr–Jul 2024), internships at Huawei Fermat Lab, Trusted Software Engineering Lab, and Theory Lab (2021–2023).",visit:"She visited Prof. Michael Pradel at University of Stuttgart (Oct 2024) and Prof. Pinjia He at CUHK-Shenzhen (Mar 2024).",skills4se:"Skills-4-SE is a curated list of 180+ Claude Skills for Software Engineering, released in Feb 2026. Website: arabelatso.github.io/Skills-4-SE/",news:"Recent highlights:\n• Two papers at ICML 2026 (SWE-ABS + Position: Code Benchmarks)\n• Joining Imperial College London as Assistant Professor\n• Skills-4-SE released (180+ Claude Skills)\n• TOSEM 2026 and ICSE 2026 acceptances\n• Young Scientist Award (Dec 2025)\n• ACM SIGSOFT Outstanding Dissertation Award (Jan 2025)",deepfd:"DeepFD (ICSE'22) is an automated fault diagnosis and localization tool for deep learning programs. Code: github.com/ArabelaTso/DeepFD",huggingface:"The fm-universe HuggingFace repo has 1.6k+ downloads, featuring datasets and models for formal methods research. Link: huggingface.co/fm-universe"};
function matchBio(input){var q=input.toLowerCase();if(/phd|student|recruit|hire|position|join|apply|opening|招/.test(q))return chatKB.phd+'\n\n'+chatKB.position;if(/award|prize|honor|dissertation|sigsoft|young scientist|奖/.test(q))return chatKB.award;if(/imperial|london|move/.test(q))return chatKB.imperial;if(/bench|evaluat|swe-abs|cruxeval|javabench|domain|rigor/.test(q))return chatKB.benchmark;if(/formal|verification|specification|theorem|cav|tla|acsl|proof|autospec/.test(q))return chatKB.formal;if(/deepfd|fault diagnosis|locali[zs]/.test(q))return chatKB.deepfd;if(/hugging|hf|fm.universe/.test(q))return chatKB.huggingface;if(/code gen|codegen|embed.?agent|icore|sembic|mr.adopt|metamorphic/.test(q))return chatKB.codegen;if(/testing.*ai|ai.*testing|se4ai|se for ai|semmt|comet|coreference|nlp/.test(q))return chatKB.se4ai;if(/paper|publication|pub|how many|icse|fse|ase|icml|acl|usenix/.test(q))return chatKB.publication;if(/research|interest|topic|focus|what do|work on|方向/.test(q))return chatKB.research;if(/contact|email|reach|mail|联系/.test(q))return chatKB.contact;if(/teach|course|comp|1021|3021/.test(q))return chatKB.teaching;if(/service|committee|pc\b|reviewer|review/.test(q))return chatKB.service;if(/education|degree|phd.*where|where.*phd|学历|学校|castle/.test(q))return chatKB.education;if(/experience|work.*at|intern|huawei|postdoc|工作/.test(q))return chatKB.experience;if(/visit|pradel|pinjia|stuttgart/.test(q))return chatKB.visit;if(/skill|claude|skills.4.se/.test(q))return chatKB.skills4se;if(/news|latest|recent|update|最新|新闻/.test(q))return chatKB.news;if(/2026/.test(q))return chatKB.imperial+'\n\n'+chatKB.news;if(/jialun|cao|who|你是谁|介绍/.test(q))return chatKB.research+'\n\n'+chatKB.award;if(/hi|hello|hey|你好|嗨/.test(q))return"Hello! I'm guppyLM, Jialun's fish assistant. Ask me about her research, publications, open positions, awards, or anything on this page!";return null;}
function buildGuppyTokenizer(json){var vocab=json.model.vocab,merges=json.model.merges,added={};for(var t of json.added_tokens)added[t.content]=t.id;var id2token={};for(var[tok,id]of Object.entries(vocab))id2token[id]=tok;for(var[tok2,id2]of Object.entries(added))id2token[id2]=tok2;var byte2char={},char2byte={},ranges=[[33,126],[161,172],[174,255]],direct=new Set();for(var[lo,hi]of ranges)for(var b=lo;b<=hi;b++)direct.add(b);var n=0;for(var b2=0;b2<256;b2++){byte2char[b2]=direct.has(b2)?String.fromCharCode(b2):String.fromCharCode(256+n++);}for(var[b3,c]of Object.entries(byte2char))char2byte[c]=parseInt(b3);var mergeRank={};for(var i=0;i<merges.length;i++){mergeRank[Array.isArray(merges[i])?merges[i].join(' '):merges[i]]=i;}function bytesToTokenStr(bytes){return Array.from(bytes).map(function(b){return byte2char[b];}).join('');}function tokenStrToBytes(s){return Uint8Array.from([...s].map(function(c){return char2byte[c]??c.charCodeAt(0);}));}function bpe(word){if(word.length<=1)return word;var pieces=word.slice();while(pieces.length>1){var bestRank=Infinity,bestIdx=-1;for(var i2=0;i2<pieces.length-1;i2++){var rank=mergeRank[pieces[i2]+' '+pieces[i2+1]];if(rank!==undefined&&rank<bestRank){bestRank=rank;bestIdx=i2;}}if(bestIdx===-1)break;pieces=[...pieces.slice(0,bestIdx),pieces[bestIdx]+pieces[bestIdx+1],...pieces.slice(bestIdx+2)];}return pieces;}var PAT=/'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;function encode(text){var specialPattern=Object.keys(added).map(function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|');var segments=text.split(new RegExp('('+specialPattern+')'));var ids=[];for(var seg of segments){if(seg==='')continue;if(added[seg]!==undefined){ids.push(added[seg]);continue;}for(var word of(seg.match(PAT)||[seg])){var byteChars=[...bytesToTokenStr(new TextEncoder().encode(word))];for(var tok3 of bpe(byteChars)){var id3=vocab[tok3];if(id3!==undefined)ids.push(id3);}}}return ids;}function decode(ids){var parts=[];for(var id4 of ids){var tok4=id2token[id4];if(tok4&&added[tok4]===undefined)parts.push(tok4);}return new TextDecoder('utf-8',{fatal:false}).decode(tokenStrToBytes(parts.join('')));}return{encode:encode,decode:decode};}
async function ensureGuppyLoaded(){if(guppySession)return true;if(guppyLoading)return false;guppyLoading=true;try{var ort=await import('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/ort.min.mjs');window._ort=ort;ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';var[tokResp,modelResp]=await Promise.all([fetch(GUPPY_MODEL_BASE+'/tokenizer.json'),fetch(GUPPY_MODEL_BASE+'/model.onnx')]);guppyTokenizer=buildGuppyTokenizer(await tokResp.json());guppySession=await ort.InferenceSession.create(await modelResp.arrayBuffer(),{executionProviders:['wasm']});return true;}catch(e){console.error('guppyLM load failed:',e);guppyLoading=false;return false;}}
async function guppyGenerate(inputIds){var ort=window._ort,ids=inputIds.slice();for(var i=0;i<GUPPY_GEN.max_tokens;i++){var seq=ids.slice(-GUPPY_CONFIG.max_seq_len);var tensor=new ort.Tensor('int64',BigInt64Array.from(seq.map(BigInt)),[1,seq.length]);var out=await guppySession.run({input_ids:tensor});var logits=out.logits.data;var offset=(seq.length-1)*GUPPY_CONFIG.vocab_size;var lastLogits=new Float32Array(GUPPY_CONFIG.vocab_size);for(var v=0;v<GUPPY_CONFIG.vocab_size;v++)lastLogits[v]=logits[offset+v]/GUPPY_GEN.temperature;if(GUPPY_GEN.top_k>0){var sorted=[...lastLogits].sort(function(a,b){return b-a;});var cutoff=sorted[Math.min(GUPPY_GEN.top_k,sorted.length)-1];for(var v2=0;v2<GUPPY_CONFIG.vocab_size;v2++)if(lastLogits[v2]<cutoff)lastLogits[v2]=-Infinity;}var maxVal=Math.max(...lastLogits.filter(function(v3){return v3!==-Infinity;}));var sumExp=0;var probs=new Float32Array(GUPPY_CONFIG.vocab_size);for(var v4=0;v4<GUPPY_CONFIG.vocab_size;v4++){probs[v4]=Math.exp(lastLogits[v4]-maxVal);sumExp+=probs[v4];}for(var v5=0;v5<GUPPY_CONFIG.vocab_size;v5++)probs[v5]/=sumExp;var r=Math.random(),acc=0,nextId=0;for(var v6=0;v6<GUPPY_CONFIG.vocab_size;v6++){acc+=probs[v6];if(acc>=r){nextId=v6;break;}}ids.push(nextId);if(nextId===GUPPY_CONFIG.eos_id)break;}return ids.slice(inputIds.length);}
async function sendChat(){var input=document.getElementById('chatInput'),body=document.getElementById('chatBody'),text=input.value.trim();if(!text)return;body.innerHTML+='<div class="chat-msg user">'+text.replace(/</g,'&lt;')+'</div>';input.value='';body.scrollTop=body.scrollHeight;var bio=matchBio(text);if(bio){body.innerHTML+='<div class="chat-msg bot">'+bio.replace(/\n/g,'<br>')+'</div>';body.scrollTop=body.scrollHeight;return;}var typing=document.createElement('div');typing.className='chat-typing';body.appendChild(typing);body.scrollTop=body.scrollHeight;if(!guppySession){typing.textContent='loading guppyLM-9M (~10 MB, first time only)...';var ok=await ensureGuppyLoaded();if(!ok){var retryMsgs=['still loading, hang on...','almost there...','one more try...'];for(var ri=0;ri<3&&!ok;ri++){typing.textContent=retryMsgs[ri];await new Promise(function(r){setTimeout(r,2000);});guppyLoading=false;ok=await ensureGuppyLoaded();}if(!ok){typing.remove();var fallbacks=['blub... my tiny brain failed to load. Try again in a bit!','*swims in circles* Model loading hiccup — maybe try again?','The fish tank is too cold for inference right now. Try later!','blub blub... network might be slow. Give me another chance?'];body.innerHTML+='<div class="chat-msg bot">'+fallbacks[Math.floor(Math.random()*fallbacks.length)]+'</div>';body.scrollTop=body.scrollHeight;return;}}}typing.textContent='guppyLM-9M is thinking...';try{var prompt='<|im_start|>user\n'+text+'<|im_end|>\n<|im_start|>assistant\n';var inputIds=guppyTokenizer.encode(prompt);var outputIds=await guppyGenerate(inputIds);var reply=guppyTokenizer.decode(outputIds).trim();if(reply.includes('<|im_end|>'))reply=reply.split('<|im_end|>')[0];if(reply.includes('<|im_start|>'))reply=reply.split('<|im_start|>')[0];reply=reply.trim();if(!reply||reply.length<2||/^[^a-zA-Z0-9]*$/.test(reply)){reply="blub... I'm just a tiny 9M fish! Try asking about Jialun's research, publications, awards, open PhD positions, or contact info.";}typing.remove();body.innerHTML+='<div class="chat-msg bot">'+reply.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>';}catch(e){console.error('guppyLM error:',e);typing.remove();body.innerHTML+='<div class="chat-msg bot">blub... something went wrong. Try asking about Jialun\'s research, awards, or open positions!</div>';}body.scrollTop=body.scrollHeight;}

// Research grid: switch to 1 column when 2-col box ratio < 1.5:1
(function() {
  var grid = document.querySelector('.research-grid');
  if (!grid) return;
  var GAP = 20, BOX_H = 320, MIN_RATIO = 1.5;
  function update() {
    var w = grid.offsetWidth;
    var boxW = (w - GAP) / 2;
    grid.style.gridTemplateColumns = (boxW / BOX_H) >= MIN_RATIO ? 'repeat(2, 1fr)' : '1fr';
  }
  update();
  window.addEventListener('resize', update);
})();


