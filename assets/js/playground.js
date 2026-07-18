// Theme
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
(function() {
  if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeIcon();
})();

// Filter
(function() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.paper-card');
  var countEl = document.getElementById('papersCount');
  var banner = document.getElementById('topicBanner');
  var navLinks = document.querySelectorAll('.s-nav a[data-topic]');

  var topicMeta = {
    all: { icon: '', title: '', desc: '', keywords: [] },
    bench: {
      icon: '📊', title: 'LLM Benchmarking',
      desc: 'Rigorous evaluation of LLMs for code generation, reasoning, and SE tasks. Investigating data contamination, multilingual capabilities, and adversarial robustness.',
      keywords: ['code generation', 'code reasoning', 'data contamination', 'multilingual', 'adversarial', 'leaderboard']
    },
    se: {
      icon: '💻', title: 'LLM for Software Engineering',
      desc: 'Leveraging LLMs to automate code translation, bug reproduction, program repair, and API-driven development.',
      keywords: ['code translation', 'bug reproduction', 'program repair', 'code generation', 'API docs', 'embedded systems']
    },
    fm: {
      icon: '✅', title: 'LLM for Formal Methods',
      desc: 'Bridging the gap between natural language requirements and verifiable formal proofs using LLMs and static analysis.',
      keywords: ['theorem proving', 'specification', 'ACSL', 'TLA+', 'model checking', 'formal proofs']
    },
    seai: {
      icon: '🧠', title: 'SE for AI',
      desc: 'Testing and debugging AI systems — from deep learning fault localization to NLP system testing and metamorphic relations.',
      keywords: ['DL testing', 'NLP testing', 'fault localization', 'metamorphic testing', 'bug detection']
    },
    sec: {
      icon: '🔒', title: 'Security & Reliability',
      desc: 'Detecting and mitigating software vulnerabilities including ReDoS, protocol fuzzing, and vulnerability version identification.',
      keywords: ['ReDoS', 'fuzzing', 'vulnerability', 'regex security', 'protocol testing']
    }
  };

  function filterCards(topic) {
    var count = 0;
    cards.forEach(function(card) {
      var topics = card.getAttribute('data-topics').split(' ');
      if (topic === 'all' || topics.indexOf(topic) !== -1) {
        card.classList.remove('hidden');
        count++;
      } else {
        card.classList.add('hidden');
      }
    });
    if (countEl) countEl.textContent = count;

    buttons.forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-topic') === topic);
    });
    navLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('data-topic') === topic);
    });

    if (topic !== 'all' && topicMeta[topic]) {
      var m = topicMeta[topic];
      banner.querySelector('.tb-icon').textContent = m.icon;
      banner.querySelector('.tb-title').textContent = m.title;
      banner.querySelector('.tb-desc').textContent = m.desc;
      var kwContainer = banner.querySelector('.tb-keywords');
      kwContainer.innerHTML = m.keywords.map(function(k) { return '<span class="tb-kw">' + k + '</span>'; }).join('');
      banner.classList.add('visible');
    } else {
      banner.classList.remove('visible');
    }
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterCards(btn.getAttribute('data-topic'));
    });
  });

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      filterCards(link.getAttribute('data-topic'));
      document.getElementById('papers').scrollIntoView({ behavior: 'smooth' });
    });
  });

  filterCards('all');
})();

// Entrance animation via IntersectionObserver
(function() {
  var cards = document.querySelectorAll('.paper-card');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(function(c) { c.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  cards.forEach(function(c) { obs.observe(c); });
})();
