// ============================================
// CODEROOM PYTHON ACADEMY — APP
// ============================================

// ---- PROGRESS (localStorage) ----
const Progress = {
  _key: 'crpa_progress',
  _get() {
    try { return JSON.parse(localStorage.getItem(this._key)) || {}; } catch { return {}; }
  },
  _set(d) { localStorage.setItem(this._key, JSON.stringify(d)); },
  isCompleted(id) { return !!this._get()[id]; },
  complete(id) { const d = this._get(); d[id] = true; this._set(d); },
  uncomplete(id) { const d = this._get(); delete d[id]; this._set(d); },
  toggle(id) { this.isCompleted(id) ? this.uncomplete(id) : this.complete(id); },
  allCompleted() { const d = this._get(); return courseData.filter(t => d[t.id]).length; },
  getQuizScore(id) {
    try { return JSON.parse(localStorage.getItem('crpa_quiz_' + id)) || null; } catch { return null; }
  },
  saveQuizScore(id, score, total) {
    localStorage.setItem('crpa_quiz_' + id, JSON.stringify({ score, total, date: Date.now() }));
  }
};

// ---- SYNTAX HIGHLIGHTER ----
function highlight(code) {
  const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const KEYWORDS = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g;
  const BUILTINS = /\b(print|len|range|int|str|float|bool|list|dict|set|tuple|type|input|open|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round|isinstance|hasattr|getattr|setattr)\b/g;
  const parts = [];
  let i = 0, src = code;
  // Process token by token
  while (i < src.length) {
    // Comment
    if (src[i] === '#') {
      let end = src.indexOf('\n', i);
      if (end === -1) end = src.length;
      parts.push(`<span class="py-comment">${escape(src.slice(i, end))}</span>`);
      i = end; continue;
    }
    // Triple-quoted strings
    if ((src[i] === '"' || src[i] === "'") && src.slice(i, i+3) === src[i].repeat(3)) {
      const q = src[i].repeat(3);
      const end = src.indexOf(q, i + 3);
      const e = end === -1 ? src.length : end + 3;
      parts.push(`<span class="py-string">${escape(src.slice(i, e))}</span>`);
      i = e; continue;
    }
    // Single/double quoted strings
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; let j = i + 1;
      while (j < src.length && src[j] !== q && src[j] !== '\n') {
        if (src[j] === '\\') j++;
        j++;
      }
      parts.push(`<span class="py-string">${escape(src.slice(i, j + 1))}</span>`);
      i = j + 1; continue;
    }
    // Numbers
    if (/[0-9]/.test(src[i]) || (src[i] === '.' && /[0-9]/.test(src[i+1] || ''))) {
      let j = i;
      while (j < src.length && /[0-9._xXbBoO]/.test(src[j])) j++;
      parts.push(`<span class="py-number">${escape(src.slice(i, j))}</span>`);
      i = j; continue;
    }
    // Words (keywords, builtins, identifiers + function calls)
    if (/[a-zA-Z_]/.test(src[i])) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const kwList = ['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield'];
      const builtinList = ['print','len','range','int','str','float','bool','list','dict','set','tuple','type','input','open','enumerate','zip','map','filter','sorted','reversed','sum','min','max','abs','round','isinstance','hasattr','getattr','setattr'];
      // Check if next non-space is '(' → function call
      let k = j;
      while (k < src.length && src[k] === ' ') k++;
      const isCall = src[k] === '(' && !kwList.includes(word);
      if (kwList.includes(word)) {
        parts.push(`<span class="py-keyword">${escape(word)}</span>`);
      } else if (builtinList.includes(word)) {
        parts.push(`<span class="py-builtin">${escape(word)}</span>`);
      } else if (isCall) {
        parts.push(`<span class="py-func">${escape(word)}</span>`);
      } else {
        parts.push(escape(word));
      }
      i = j; continue;
    }
    // Parentheses / brackets
    if ('()[]{}'.includes(src[i])) {
      parts.push(`<span class="py-paren">${escape(src[i])}</span>`);
      i++; continue;
    }
    parts.push(escape(src[i]));
    i++;
  }
  return parts.join('');
}

function codeBlock(code, title = '', showCopy = true) {
  const id = 'cb_' + Math.random().toString(36).slice(2);
  return `
    <div class="code-wrapper">
      <div class="code-header">
        <span class="code-title">${title}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="code-lang">Python</span>
          ${showCopy ? `<button class="code-copy" onclick="copyCode('${id}')">Copy</button>` : ''}
        </div>
      </div>
      <pre class="code-block" id="${id}">${highlight(code)}</pre>
    </div>`;
}

function copyCode(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => showToast('Copied to clipboard!'));
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ---- ROUTER ----
const app = document.getElementById('app');

function navigate(hash) {
  window.location.hash = hash;
}

function render() {
  const raw = window.location.hash.slice(1) || 'home';
  const [page, ...params] = raw.split('/');
  updateNavActive(page);
  window.scrollTo(0, 0);

  app.innerHTML = '';
  const el = document.createElement('div');
  el.classList.add('page-enter');

  switch (page) {
    case 'home':       el.innerHTML = renderHome(); break;
    case 'syllabus':   el.innerHTML = renderSyllabus(); break;
    case 'topic':      el.innerHTML = renderTopic(params[0]); break;
    case 'quiz':       el.innerHTML = ''; app.appendChild(el); renderQuiz(el, params[0]); app.appendChild(renderFooter()); return;
    case 'lectures':   el.innerHTML = renderLectures(); break;
    case 'resources':  el.innerHTML = renderResources(); break;
    case 'faq':        el.innerHTML = renderFAQ(); break;
    case 'founder':    el.innerHTML = renderFounder(); break;
    case 'contact':    el.innerHTML = renderContact(); break;
    default:           el.innerHTML = renderNotFound(); break;
  }

  app.appendChild(el);
  app.appendChild(renderFooter());
  attachPageEvents(page, params[0]);
}

function updateNavActive(page) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page || (page === 'topic' && a.dataset.page === 'syllabus') || (page === 'quiz' && a.dataset.page === 'syllabus'));
  });
}

function renderFooter() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div class="footer-logo">🐍 CodeRoom <span>Python Academy</span></div>
    <div class="footer-links">
      <a href="#home" class="footer-link">Home</a>
      <a href="#syllabus" class="footer-link">Syllabus</a>
      <a href="#lectures" class="footer-link">Lectures</a>
      <a href="#resources" class="footer-link">Resources</a>
      <a href="#founder" class="footer-link">Founder</a>
      <a href="#contact" class="footer-link">Contact</a>
    </div>
    <p>Made with ❤️ by <strong>Shrikant Shukla</strong> — Free Python Education for Everyone</p>
    <p style="margin-top:6px">© 2025 CodeRoom Python Academy</p>`;
  return f;
}

// =================== HOME ===================
function renderHome() {
  const total = courseData.length;
  const done = Progress.allCompleted();
  const pct = Math.round((done / total) * 100);

  return `
  <section class="hero">
    <div class="hero-badge">🎓 Free Python Course — Zero to Hero</div>
    <h1>Master Python with<br><span class="gradient-text">CodeRoom Academy</span></h1>
    <p class="hero-subtitle">A complete, structured Python curriculum with video lectures, quizzes, and real examples — 100% free, forever.</p>
    <div class="hero-cta">
      <a href="#syllabus" class="btn btn-primary">Start Learning →</a>
      <a href="#lectures" class="btn btn-outline">Watch Lectures</a>
    </div>
    <div class="hero-stats">
      <div class="stat-item"><span class="stat-number">42</span><span class="stat-label">Topics</span></div>
      <div class="stat-item"><span class="stat-number">420</span><span class="stat-label">Quiz Questions</span></div>
      <div class="stat-item"><span class="stat-number">8</span><span class="stat-label">Sections</span></div>
      <div class="stat-item"><span class="stat-number">100%</span><span class="stat-label">Free</span></div>
    </div>
  </section>

  ${done > 0 ? `
  <div class="section" style="padding-top:0">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3>Your Progress</h3>
        <span style="color:var(--accent);font-weight:700">${done}/${total} topics</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <p style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">${pct}% complete</p>
    </div>
  </div>` : ''}

  <div class="section">
    <h2 class="section-title">Everything You Need to Learn Python</h2>
    <p class="section-subtitle">A complete learning system — read, watch, practice, and build.</p>
    <div class="features-grid">
      ${[
        ['📖','Structured Curriculum','42 topics across 8 sections from absolute beginner to advanced OOP and projects.'],
        ['🎥','Video Lectures','YouTube lectures by Shrikant Shukla covering each topic with live coding.'],
        ['🧠','Quizzes After Every Topic','Test your knowledge with 10 MCQs per topic. Scores saved automatically.'],
        ['💻','Code Examples','Every topic includes 3 working code examples with expected output.'],
        ['📚','Curated Resources','PDFs, practice platforms, docs, and extra videos — all in one place.'],
        ['🔖','Track Your Progress','Your completion status is saved in your browser — resume anytime.']
      ].map(([icon, title, desc]) => `
        <div class="feature-card">
          <span class="feature-icon">${icon}</span>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`).join('')}
    </div>
  </div>

  <div class="section" style="text-align:center">
    <h2 class="section-title">Ready to Start?</h2>
    <p class="section-subtitle">No sign-up needed. Just open a topic and start learning.</p>
    <a href="#syllabus" class="btn btn-primary" style="font-size:1rem;padding:14px 36px">View Full Syllabus →</a>
  </div>`;
}

// =================== SYLLABUS ===================
function renderSyllabus() {
  const total = courseData.length;
  const done = Progress.allCompleted();
  const pct = Math.round((done / total) * 100);

  const sections = {};
  courseData.forEach(t => {
    if (!sections[t.section]) sections[t.section] = [];
    sections[t.section].push(t);
  });

  const sectionColors = {
    'Basics': '🟦', 'Control Flow': '🟧', 'Strings & Data Structures': '🟩',
    'Functions & Modules': '🟪', 'Error & File Handling': '🟥',
    'Standard Library': '⬛', 'OOP': '🟨', 'Projects': '🌟'
  };

  return `
  <div class="syllabus-page">
    <div class="syllabus-header">
      <h1>📋 Full Syllabus</h1>
      <p>${total} topics across 8 sections — from basics to advanced Python</p>
      <div class="overall-progress">
        <div class="progress-label">
          <span>Overall Progress</span>
          <span>${done}/${total} completed (${pct}%)</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
    </div>
    ${Object.entries(sections).map(([sec, topics]) => `
      <div class="section-group">
        <div class="section-label">${sectionColors[sec] || '📌'} ${sec}</div>
        <div class="topic-grid">
          ${topics.map(t => {
            const done = Progress.isCompleted(t.id);
            return `
            <a href="#topic/${t.id}" class="topic-card ${done ? 'completed' : ''}">
              <div class="topic-num">Topic ${t.order}</div>
              <div class="topic-title">${t.title}</div>
              <div class="topic-status ${done ? 'done' : 'pending'}">${done ? '✓ Completed' : '○ Not started'}</div>
            </a>`;
          }).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}

// =================== LEARN TOPIC ===================
function renderTopic(id) {
  const topic = courseData.find(t => t.id === id);
  if (!topic) return renderNotFound();
  const c = topic.content;
  const done = Progress.isCompleted(id);
  const idx = courseData.indexOf(topic);
  const prev = courseData[idx - 1];
  const next = courseData[idx + 1];

  const sections = {};
  courseData.forEach(t => { if (!sections[t.section]) sections[t.section] = []; sections[t.section].push(t); });

  const sidebar = `
    <aside class="topic-sidebar">
      ${Object.entries(sections).map(([sec, topics]) => `
        <div class="sidebar-section">${sec}</div>
        ${topics.map(t => `
          <a href="#topic/${t.id}" class="sidebar-item ${t.id === id ? 'active' : ''} ${Progress.isCompleted(t.id) ? 'done' : ''}">
            ${Progress.isCompleted(t.id) ? '✓ ' : ''}${t.title}
          </a>`).join('')}
      `).join('')}
    </aside>`;

  const content = `
    <div class="topic-content">
      <div class="topic-header">
        <div class="topic-breadcrumb"><a href="#syllabus">Syllabus</a> → ${topic.section} → ${topic.title}</div>
        <h1>${topic.title}</h1>
        <div class="topic-meta">
          <span class="badge badge-section">${topic.section}</span>
          <span class="badge badge-order">Topic ${topic.order} of ${courseData.length}</span>
          ${done ? '<span class="badge badge-done">✓ Completed</span>' : ''}
        </div>
      </div>

      <div class="content-section">
        <h2>📌 Simple Explanation</h2>
        <div class="info-box">${c.simpleExplanation}</div>
      </div>

      <div class="content-section">
        <h2>📖 Detailed Explanation</h2>
        <p>${c.detailedExplanation}</p>
      </div>

      <div class="content-section">
        <h2>🌍 Real Life Example</h2>
        <p>${c.realLifeExample}</p>
      </div>

      <div class="content-section">
        <h2>⚙️ Syntax</h2>
        ${codeBlock(c.syntax, 'Syntax')}
      </div>

      <div class="content-section">
        <h2>💻 Code Examples</h2>
        ${c.codeExamples.map(ex => `
          ${codeBlock(ex.code, ex.title)}
          <div class="output-box">
            <div class="output-label">▶ OUTPUT</div>
            <div class="output-text">${ex.output}</div>
          </div>`).join('<br>')}
      </div>

      <div class="content-section">
        <h2>🔑 Key Points</h2>
        <ul class="styled-list">${c.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="content-section">
        <h2>⚠️ Common Mistakes</h2>
        <ul class="styled-list danger">${c.commonMistakes.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="content-section">
        <h2>✅ Best Practices</h2>
        <ul class="styled-list">${c.bestPractices.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="content-section">
        <h2>🎯 Practice Exercises</h2>
        <ul class="styled-list">${c.practiceExercises.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="content-section">
        <h2>🗂️ Assignment</h2>
        <div class="info-box">${c.assignment}</div>
      </div>

      <div class="content-section">
        <h2>❓ Interview Questions</h2>
        ${c.interviewQuestions.map((q, i) => `
          <div class="qa-item">
            <div class="qa-question" onclick="toggleQA(this)">
              <span>${q.question}</span>
              <span class="qa-toggle">+</span>
            </div>
            <div class="qa-answer"><p>${q.answer}</p></div>
          </div>`).join('')}
      </div>

      <div class="content-section">
        <h2>📝 Summary</h2>
        <div class="info-box">${c.summary}</div>
      </div>

      <div class="topic-actions">
        <button class="btn ${done ? 'btn-outline' : 'btn-primary'}" id="markBtn" onclick="toggleComplete('${id}')">
          ${done ? '✓ Completed — Mark Incomplete' : '○ Mark as Complete'}
        </button>
        <a href="#quiz/${id}" class="btn btn-outline">Take Quiz →</a>
        ${prev ? `<a href="#topic/${prev.id}" class="btn btn-outline btn-sm">← ${prev.title}</a>` : ''}
        ${next ? `<a href="#topic/${next.id}" class="btn btn-primary btn-sm">${next.title} →</a>` : ''}
      </div>
    </div>`;

  return `<div class="topic-page">${sidebar}${content}</div>`;
}

function toggleComplete(id) {
  Progress.toggle(id);
  showToast(Progress.isCompleted(id) ? '✓ Marked as complete!' : 'Marked as incomplete');
  render();
}

function toggleQA(el) {
  const answer = el.nextElementSibling;
  const toggle = el.querySelector('.qa-toggle');
  const open = answer.classList.contains('open');
  answer.classList.toggle('open', !open);
  toggle.classList.toggle('open', !open);
}

// =================== QUIZ ===================
function renderQuiz(container, topicId) {
  const topic = courseData.find(t => t.id === topicId);
  if (!topic) { container.innerHTML = renderNotFound(); return; }

  const questions = quizData[topicId];
  let currentQ = 0;
  let answers = new Array(questions.length).fill(null); // selected index per question
  let submitted = new Array(questions.length).fill(false);

  function renderQ(idx) {
    const q = questions[idx];
    const selected = answers[idx];
    const isSubmitted = submitted[idx];
    const letters = ['A','B','C','D'];

    container.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-header">
          <div class="topic-breadcrumb"><a href="#topic/${topicId}">${topic.title}</a> → Quiz</div>
          <h1>📝 ${topic.title} Quiz</h1>
          <div class="quiz-meta">Question ${idx + 1} of ${questions.length}</div>
          <div class="quiz-progress-bar">
            <div class="progress-label"><span>Progress</span><span>${idx + 1}/${questions.length}</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${((idx+1)/questions.length)*100}%"></div></div>
          </div>
        </div>

        <div class="quiz-card">
          <div class="question-num">QUESTION ${idx + 1}</div>
          <div class="question-text">${q.question}</div>
          <div class="options">
            ${q.options.map((opt, oi) => {
              let cls = '';
              if (isSubmitted) {
                if (oi === q.correctIndex) cls = 'correct';
                else if (oi === selected && selected !== q.correctIndex) cls = 'wrong';
              } else if (oi === selected) cls = 'selected';
              return `<div class="option ${cls} ${isSubmitted ? 'locked' : ''}" onclick="selectOption(${oi})">
                <span class="option-letter">${letters[oi]}</span>
                <span>${opt}</span>
              </div>`;
            }).join('')}
          </div>
          <div class="explanation-box ${isSubmitted ? 'show' : ''}">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>

        <div class="quiz-nav">
          <button class="btn btn-outline btn-sm" onclick="quizNav(-1)" ${idx === 0 ? 'disabled' : ''}>← Previous</button>
          <div style="display:flex;gap:8px">
            ${!isSubmitted
              ? `<button class="btn btn-primary btn-sm" onclick="submitAnswer()" ${selected === null ? 'disabled' : ''}>Check Answer</button>`
              : idx < questions.length - 1
                ? `<button class="btn btn-primary btn-sm" onclick="quizNav(1)">Next →</button>`
                : `<button class="btn btn-primary btn-sm" onclick="showResults()">See Results →</button>`
            }
          </div>
        </div>
      </div>`;

    window.selectOption = (oi) => {
      if (submitted[idx]) return;
      answers[idx] = oi;
      renderQ(idx);
    };
    window.submitAnswer = () => {
      if (answers[idx] === null) return;
      submitted[idx] = true;
      renderQ(idx);
    };
    window.quizNav = (dir) => {
      // Only allow forward if current question is submitted
      if (dir > 0 && !submitted[idx]) return;
      currentQ = Math.max(0, Math.min(questions.length - 1, idx + dir));
      renderQ(currentQ);
    };
    window.showResults = () => {
      if (!submitted[idx]) return;
      const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
      Progress.saveQuizScore(topicId, score, questions.length);
      renderResults(score);
    };
  }

  function renderResults(score) {
    const pct = Math.round((score / questions.length) * 100);
    let emoji = pct >= 80 ? '🎉' : pct >= 50 ? '🙂' : '💪';
    let msg = pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!';

    container.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-result">
          <span class="result-emoji">${emoji}</span>
          <div class="result-score">${score}/${questions.length}</div>
          <div class="result-label">${msg} You scored ${pct}%</div>
          <div class="result-actions">
            <button class="btn btn-primary" onclick="location.hash='quiz/${topicId}'">Retry Quiz</button>
            <a href="#topic/${topicId}" class="btn btn-outline">Back to Topic</a>
            <a href="#syllabus" class="btn btn-outline">View Syllabus</a>
          </div>
        </div>
      </div>`;
  }

  renderQ(0);
}

// =================== LECTURES ===================
function renderLectures() {
  const lec = lectures[0];
  return `
  <div class="lectures-page">
    <div class="lectures-header">
      <h1>🎥 Video Lectures</h1>
      <p style="color:var(--text-secondary);margin-bottom:32px">Live Python coding by Shrikant Shukla — CodeRoom YouTube Channel</p>
    </div>

    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/${lec.videoId}?rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen title="${lec.title}"></iframe>
    </div>

    <div class="lecture-card">
      <div class="lecture-title">${lec.title}</div>
      <div class="lecture-desc">${lec.description}</div>
      <div class="lecture-meta">
        <div class="lecture-dur">⏱ ${lec.duration}</div>
        <a href="${lec.watchUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Watch on YouTube ↗</a>
      </div>
    </div>

    <div class="coming-soon">
      <span class="coming-soon-icon">🚀</span>
      <h2>More Lectures Coming Soon!</h2>
      <p style="color:var(--text-secondary);margin-bottom:20px">
        New lectures are being recorded and will be uploaded to the YouTube channel regularly.
        Subscribe to get notified when new videos are released.
      </p>
      <a href="https://www.youtube.com/@CodeRoomS" target="_blank" rel="noopener" class="btn btn-primary">Subscribe to CodeRoom ↗</a>
    </div>
  </div>`;
}

// =================== RESOURCES ===================
function renderResources() {
  return `
  <div class="resources-page">
    <h1>📚 Learning Resources</h1>
    <p style="color:var(--text-secondary);margin-bottom:40px">Handpicked resources to accelerate your Python journey.</p>
    ${resources.map(cat => `
      <div class="resources-section">
        <h2>${cat.category}</h2>
        <div class="resources-grid">
          ${cat.items.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener" class="resource-card">
              <span class="resource-icon">${item.icon}</span>
              <div class="resource-name">${item.name}</div>
              <div class="resource-desc">${item.desc}</div>
              <span class="resource-link">Open resource ↗</span>
            </a>`).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}

// =================== FAQ ===================
function renderFAQ() {
  return `
  <div class="faq-page">
    <h1>❓ Frequently Asked Questions</h1>
    <p style="color:var(--text-secondary);margin-bottom:40px">Everything you need to know about CodeRoom Python Academy.</p>
    ${faqs.map((f, i) => `
      <div class="faq-item" id="faq-${i}">
        <div class="faq-question" onclick="toggleFAQ(${i})">
          <span>${f.q}</span>
          <span class="faq-chevron">▼</span>
        </div>
        <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
      </div>`).join('')}
  </div>`;
}

function toggleFAQ(i) {
  const item = document.getElementById('faq-' + i);
  item.classList.toggle('open');
}

// =================== FOUNDER ===================
function renderFounder() {
  return `
  <div class="founder-page">

    <div class="founders-header">
      <h1>👥 Meet the Team</h1>
      <p>The passionate minds behind CodeRoom Python Academy</p>
    </div>

    <div class="founders-grid">

      <!-- FOUNDER -->
      <div class="founder-card">
        <div class="founder-card-badge">🏆 Founder</div>
        <div class="founder-card-img-wrap">
          <img src="img/founder.jpeg" alt="Shrikant Shukla"
               onerror="this.src='https://ui-avatars.com/api/?name=Shrikant+Shukla&background=0a1628&color=00d4aa&size=300'" />
        </div>
        <div class="founder-card-body">
          <div class="founder-card-name">Shrikant Shukla</div>
          <div class="founder-card-role">Founder &amp; Lead Instructor</div>
          <div class="founder-card-qual">🎓 MCA Student</div>
          <p class="founder-card-bio">
            Passionate EdTech creator on a mission to make programming accessible to every Indian student — regardless of background or resources. Manages the <strong>CodeRoom</strong> YouTube channel with free, structured Python instruction.
          </p>
          <div class="founder-card-tags">
            <span class="founder-tag">Python</span>
            <span class="founder-tag">EdTech</span>
            <span class="founder-tag">MCA</span>
            <span class="founder-tag">YouTuber</span>
          </div>
          <div class="founder-card-links">
            <a href="https://www.youtube.com/@CodeRoomS" target="_blank" rel="noopener" class="founder-link">▶ YouTube</a>
            <a href="#contact" class="founder-link">✉ Contact</a>
          </div>
        </div>
      </div>

      <!-- CO-FOUNDER -->
      <div class="founder-card cofounder">
        <div class="founder-card-badge cofounder-badge">🚀 Co-Founder</div>
        <div class="founder-card-img-wrap">
          <img src="img/cofounder.jpeg" alt="Prince Choudhary"
               onerror="this.src='https://ui-avatars.com/api/?name=Prince+Choudhary&background=0a1628&color=a78bfa&size=300'" />
        </div>
        <div class="founder-card-body">
          <div class="founder-card-name">Prince Choudhary</div>
          <div class="founder-card-role" style="color:var(--purple)">Co-Founder &amp; AI/ML Lead</div>
          <div class="founder-card-qual">🎓 MCA · AI &amp; Machine Learning</div>
          <p class="founder-card-bio">
            AI/ML specialist dedicated to building intelligent learning systems. Focuses on bringing cutting-edge technology concepts to students in a simple, practical manner. Drives the AI curriculum and platform innovation at CodeRoom.
          </p>
          <div class="founder-card-tags">
            <span class="founder-tag" style="background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);color:var(--purple)">AI/ML</span>
            <span class="founder-tag" style="background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);color:var(--purple)">MCA</span>
            <span class="founder-tag" style="background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);color:var(--purple)">Deep Learning</span>
            <span class="founder-tag" style="background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);color:var(--purple)">EdTech</span>
          </div>
          <div class="founder-card-links">
            <a href="mailto:princegurjar12332@gmail.com" class="founder-link" style="border-color:rgba(167,139,250,0.3);color:var(--purple)">✉ princegurjar12332@gmail.com</a>
          </div>
        </div>
      </div>

    </div>

    <div class="founder-mission">
      <h2>🎯 Our Mission</h2>
      <p>
        CodeRoom was born out of a simple belief: <strong style="color:var(--accent)">quality education should be free</strong>.
        Together, Shrikant and Prince are building a platform where every student — from zero programming experience
        to advanced AI/ML concepts — can learn, grow, and build a career in technology. No fees. No barriers.
        Just great teaching and real results.
      </p>
    </div>

  </div>`;
}

// =================== CONTACT ===================
function renderContact() {
  return `
  <div class="contact-page">
    <h1>📬 Contact Us</h1>
    <p>Have a question, suggestion, or want to collaborate? Reach out!</p>
    <form id="contactForm" onsubmit="submitContact(event)">
      <div class="form-group">
        <label>Your Name *</label>
        <input type="text" placeholder="e.g. Rahul Sharma" required />
      </div>
      <div class="form-group">
        <label>Email Address *</label>
        <input type="email" placeholder="e.g. rahul@example.com" required />
      </div>
      <div class="form-group">
        <label>Subject</label>
        <select>
          <option>General Question</option>
          <option>Content Feedback</option>
          <option>Bug Report</option>
          <option>Collaboration</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Message *</label>
        <textarea placeholder="Write your message here..." required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Send Message ✉</button>
    </form>
    <div class="contact-links">
      <a href="https://www.youtube.com/@CodeRoomS" target="_blank" rel="noopener" class="contact-link-card">
        <span class="icon">▶</span>
        <strong>YouTube</strong>
        <p>@CodeRoomS</p>
      </a>
      <a href="mailto:coderoom@example.com" class="contact-link-card">
        <span class="icon">✉</span>
        <strong>Email</strong>
        <p>coderoom@example.com</p>
      </a>
    </div>
  </div>`;
}

function submitContact(e) {
  e.preventDefault();
  showToast('Message sent! We will reply soon 🎉');
  e.target.reset();
}

// =================== NOT FOUND ===================
function renderNotFound() {
  return `
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <a href="#home" class="btn btn-primary">Go Home</a>
  </div>`;
}

// =================== ATTACH EVENTS ===================
function attachPageEvents(page) {
  // FAQ toggles already handled via inline onclick
}

// =================== SEARCH ===================
const searchInput = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('open'); searchResults.innerHTML = ''; return; }
  const matches = courseData.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.section.toLowerCase().includes(q) ||
    t.content.simpleExplanation.toLowerCase().includes(q)
  ).slice(0, 8);
  if (!matches.length) { searchResults.classList.remove('open'); return; }
  searchResults.innerHTML = matches.map(t => `
    <div class="search-item" onclick="goTopic('${t.id}')">
      <div>${t.title}</div>
      <div class="search-item-section">${t.section} · Topic ${t.order}</div>
    </div>`).join('');
  searchResults.classList.add('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-bar')) {
    searchResults.classList.remove('open');
  }
});

window.goTopic = (id) => {
  searchInput.value = '';
  searchResults.classList.remove('open');
  navigate('topic/' + id);
};

// =================== HAMBURGER ===================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
});

// =================== BACK TO TOP ===================
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =================== THEME TOGGLE ===================
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn.querySelector('.theme-icon');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    themeIcon.textContent = '🌙';
    themeToggleBtn.title = 'Switch to dark mode';
  } else {
    document.body.classList.remove('light');
    themeIcon.textContent = '☀️';
    themeToggleBtn.title = 'Switch to light mode';
  }
  localStorage.setItem('crpa_theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
  showToast(isLight ? '🌑 Dark mode on' : '☀️ Light mode on');
});

// Load saved theme on startup
const savedTheme = localStorage.getItem('crpa_theme') || 'dark';
applyTheme(savedTheme);

// =================== INIT ===================
window.addEventListener('hashchange', render);
render();
