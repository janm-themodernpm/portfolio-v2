/* ============================================================
   Jan Patrick McGhee — Portfolio
   Behavior: theme toggle, stat counter, reveals, cursor label, tweaks
   ============================================================ */

// -------- TWEAKS defaults (persistable) --------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "editorial",
  "theme": "light"
}/*EDITMODE-END*/;

const loaded = JSON.parse(localStorage.getItem('jpm-prefs') || 'null') || TWEAK_DEFAULTS;
let prefs = { ...TWEAK_DEFAULTS, ...loaded };

function applyPrefs() {
  document.body.setAttribute('data-aesthetic', prefs.aesthetic);
  document.body.setAttribute('data-theme', prefs.theme);
  // refresh toggle button states if panel is open
  document.querySelectorAll('[data-tweak-key]').forEach(btn => {
    const k = btn.dataset.tweakKey;
    const v = btn.dataset.tweakVal;
    btn.classList.toggle('on', prefs[k] === v);
  });
  localStorage.setItem('jpm-prefs', JSON.stringify(prefs));
}
applyPrefs();

// -------- Theme toggle (quick-access in nav) --------
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    prefs.theme = prefs.theme === 'light' ? 'dark' : 'light';
    applyPrefs();
    persistIfEditMode();
  });
}

// -------- Stat counter --------
const formatCount = (n, prefix, suffix) => {
  const fixed = n % 1 === 0 ? n.toFixed(0) : n.toFixed(1);
  return `${prefix}${fixed}${suffix}`;
};
function animateStat(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1600;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    const v = target * eased;
    el.textContent = formatCount(v, prefix, suffix);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatCount(target, prefix, suffix);
  }
  requestAnimationFrame(tick);
}

// -------- Intersection Observer: reveals + stat trigger --------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.classList.contains('stat__num') && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateStat(entry.target);
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.hero, .stats, .section-head, .project, .role, .ai-card, .skill-col, .contact-card, .case-hero, .case-shot, .case-facts, .case-body > section, .radar-demo, .prompt-preview').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});
document.querySelectorAll('.stat__num').forEach(el => io.observe(el));

// -------- Cursor-follow label --------
const cursorLabel = document.getElementById('cursor-label');
if (cursorLabel) {
  let raf = null;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  function loop() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursorLabel.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -140%)`;
    raf = requestAnimationFrame(loop);
  }
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) loop();
  });
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = el.dataset.cursor;
      cursorLabel.classList.add('visible');
    });
    el.addEventListener('mouseleave', () => {
      cursorLabel.classList.remove('visible');
    });
  });
}

// -------- Tweaks panel (host protocol) --------
function buildTweaksPanel() {
  const panel = document.createElement('div');
  panel.className = 'tweaks-panel';
  panel.id = 'tweaksPanel';
  panel.innerHTML = `
    <div class="tweaks-panel__title">Tweaks</div>

    <div class="tweaks-panel__group">
      <label class="tweaks-panel__lbl">Aesthetic</label>
      <div class="tweaks-panel__row">
        <button class="tweaks-panel__btn" data-tweak-key="aesthetic" data-tweak-val="editorial">Editorial</button>
        <button class="tweaks-panel__btn" data-tweak-key="aesthetic" data-tweak-val="monolith">Monolith</button>
        <button class="tweaks-panel__btn" data-tweak-key="aesthetic" data-tweak-val="studio">Studio</button>
      </div>
    </div>

    <div class="tweaks-panel__group">
      <label class="tweaks-panel__lbl">Theme</label>
      <div class="tweaks-panel__row">
        <button class="tweaks-panel__btn" data-tweak-key="theme" data-tweak-val="light">Light</button>
        <button class="tweaks-panel__btn" data-tweak-key="theme" data-tweak-val="dark">Dark</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  panel.querySelectorAll('[data-tweak-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      prefs[btn.dataset.tweakKey] = btn.dataset.tweakVal;
      applyPrefs();
      persistIfEditMode();
    });
  });
  applyPrefs(); // sync button on-states
  return panel;
}
const tweaksPanel = buildTweaksPanel();

let editModeActive = false;
function persistIfEditMode() {
  if (!editModeActive) return;
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { ...prefs } }, '*');
  } catch (e) {}
}

window.addEventListener('message', (ev) => {
  const msg = ev.data;
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === '__activate_edit_mode') {
    editModeActive = true;
    tweaksPanel.classList.add('on');
  } else if (msg.type === '__deactivate_edit_mode') {
    editModeActive = false;
    tweaksPanel.classList.remove('on');
  }
});
// announce availability after listener is registered
try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
