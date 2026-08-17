/*
 * Karakuli — motion sampler page logic (demo/motion.html)
 * -----------------------------------------------------------------------
 * Candidate page, not canon — a witness page kept around after the winners
 * (sprout / draw / rise) were promoted to web/anim.css + web/anim.js.
 * `krkStagger` now lives there; this file just imports it.
 *
 * Motif SVGs are inlined below (copied from doodles/*.svg) rather than
 * fetched, so this page has no dependency beyond tokens/karakuli/boil/anim.
 * `pathLength="100"` is added to every <path> at load time so the "draw"
 * entrance variant's stroke-dasharray/-dashoffset trick (see web/anim.css)
 * works uniformly across motifs without measuring each path in JS.
 */

import { krkStagger } from '../web/anim.js';

const RAW_MOTIFS = {
  'flower-daisy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,13 C25.3,10.7 24.9,8.5 23,6.5 C21.7,8.8 22.1,11 24,13 M26,14 C29,13.6 31,11.9 32,9 C29,9.4 27,11.1 26,14 M26.5,17 C28.2,19.2 30.4,19.9 33,19 C31.3,16.8 29.1,16.1 26.5,17 M25,18.5 C24.5,21.3 25.6,23.5 28,25 C28.5,22.2 27.4,20 25,18.5 M22,18 C19.1,19 17.4,21 17,24 C19.9,23 21.6,21 22,18 M21,16 C18.9,14.1 16.5,13.8 14,15 C16.1,16.9 18.5,17.3 21,16"/>
  <path d="M22,15 C22,13 26,13 26,15 C26,17.5 22,17.5 22,15"/>
  <path d="M24,18.5 C23,26 25,34 23,42 M23,31 C18,29 16,32 19,35 C21,34 23,33 23,31"/>
</svg>`,
  sprout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12,41 C16,37 20,36 24,36 C28,36 32,37 36,41"/>
  <path d="M24,36 C23,32 24,29 24,26"/>
  <path d="M24,26 C19.8,26.3 17.7,24.2 18,20 C22.2,19.7 24.3,21.8 24,26 M24,26 C28.2,26.3 30.3,24.2 30,20 C25.8,19.7 23.7,21.8 24,26"/>
  <path d="M16,40 L18,39 M30,39 L32,40"/>
</svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,7 C27,13 28,17 29,20 C34,20 38,20 41,21 C36,24 33,27 31,29 C33,34 34,38 35,41 C30,38 27,35 24,33 C21,35 18,38 13,41 C14,38 15,34 17,29 C15,27 12,24 7,21 C10,20 14,20 19,20 C20,17 22,13 24,7 C24,6 25,6 26,8"/>
  <path d="M24,8 C25,11 26,15 27,17"/>
</svg>`,
  'cup-tea': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16,22 C15,28 17,33 24,33 C31,33 33,28 32,22 C32,21 16,21 16,22"/>
  <path d="M32,24 C37,23 37,29 32,28"/>
  <path d="M9,35 C9,33 39,33 39,35 C39,37 9,37 9,35"/>
  <path d="M20,19 C22,15 18,12 20,8 M28,19 C30,15 26,12 28,8"/>
</svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,16 C21,10 12,11 12,19 C12,26 19,30 23,37 C25,32 34,27 35,18 C35,11 27,9 24,16"/>
  <path d="M22,14 C20,12 17,11 14,13"/>
</svg>`,
  leaf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,8 C34,14 36,28 24,42 C12,28 14,14 24,8"/>
  <path d="M24,11 C23,20 25,30 24,39"/>
  <path d="M24,17 C27,16 30,17 31,19 M24,23 C20,22 17,23 16,25 M24,29 C27,28 30,29 31,31 M24,34 C21,33 18,34 17,36"/>
</svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,17 C29,16 32,20 31,24 C33,28 29,32 24,31 C19,32 15,28 16,24 C15,19 19,17 24,17"/>
  <path d="M24,15 L24,8 M29,17 L34,11 M33,24 L41,24 M29,31 L33,37 M24,33 L24,40 M19,31 L15,36 M16,24 L8,25 M19,17 L14,12"/>
</svg>`,
  spark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24,9 C25,16 21,19 27,21 C33,22 37,23 39,24 C37,25 33,26 27,27 C21,29 25,32 24,39 C23,32 27,29 21,27 C15,26 11,25 9,24 C11,23 15,22 21,21 C27,19 23,16 24,9"/>
  <path d="M34,14 L34,14.4 M12,32 L12,32.4"/>
</svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M28,10 C20,10 14,17 14,24 C14,31 20,38 28,38 C22,35 18,30 18,24 C18,18 22,13 28,10"/>
  <path d="M34,14 L34,18 M32,16 L36,16 M38,26 L38,29 M36.5,27.5 L39.5,27.5"/>
</svg>`,
  zzz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10,10 C14,10 18,10 20,10 C17,14 13,17 10,20 C14,20 17,20 20,20"/>
  <path d="M20,22 C23,22 26,22 27,22 C25,25 22,27 20,29 C23,29 25,29 27,29"/>
  <path d="M28,31 C30,31 32,31 33,31 C31,33 29,34 28,36 C30,36 31,36 33,36"/>
</svg>`,
};

function addPathLength(svgMarkup) {
  return svgMarkup.replace(/<path /g, '<path pathLength="100" ');
}

const MOTIFS = Object.fromEntries(
  Object.entries(RAW_MOTIFS).map(([name, svg]) => [name, addPathLength(svg)])
);

function createMotifEl(name, { size = 48, color } = {}) {
  const wrapper = document.createElement('span');
  wrapper.className = 'demo-motif';
  wrapper.style.setProperty('--demo-motif-size', `${size}px`);
  if (color) wrapper.style.color = color;
  wrapper.innerHTML = MOTIFS[name];
  return wrapper;
}

/* ============================================================
   Section 1 — «Появление дудла»
   ============================================================ */

const VARIANTS = [
  { key: 'pop', label: 'A · pop', className: 'krk-enter-pop' },
  { key: 'flip-pop', label: 'B · flip-pop', className: 'krk-enter-flip-pop' },
  { key: 'draw', label: 'C · draw', className: 'krk-enter-draw' },
  { key: 'fade', label: 'D · fade', className: 'krk-enter-fade' },
  { key: 'sprout', label: 'E · sprout', className: 'krk-enter-sprout' },
];

const ENTRANCE_CARD_MOTIFS = {
  pop: 'flower-daisy',
  'flip-pop': 'star',
  draw: 'cup-tea',
  fade: 'heart',
  sprout: 'sprout',
};

function replayEntrance(el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // force reflow so re-adding the class restarts the animation
  el.classList.add(className);
}

function buildEntranceRow() {
  const row = document.getElementById('krk-entrance-row');
  if (!row) return;

  VARIANTS.forEach((variant) => {
    const card = document.createElement('div');
    card.className = 'krk-card demo-entrance-card';

    const slot = document.createElement('div');
    slot.className = 'demo-entrance-card__slot';
    const motif = createMotifEl(ENTRANCE_CARD_MOTIFS[variant.key], { size: 96, color: 'var(--krk-pen-blue)' });
    motif.classList.add(variant.className);
    slot.append(motif);

    const caption = document.createElement('p');
    caption.className = 'demo-entrance-card__caption';
    caption.textContent = variant.label;

    const replay = document.createElement('button');
    replay.className = 'krk-btn krk-btn--ghost demo-entrance-card__replay';
    replay.type = 'button';
    replay.textContent = 'Ещё раз';
    replay.addEventListener('click', () => replayEntrance(motif, variant.className));

    card.append(slot, caption, replay);
    row.append(card);
  });
}

/* ============================================================
   Section 2 — «Сад растёт»
   ============================================================ */

const GARDEN_COLS = 14;
const GARDEN_ROWS = 8;
const GARDEN_MOTIF_COUNT = 45;
const GARDEN_POOL = ['flower-daisy', 'sprout', 'star', 'cup-tea', 'heart', 'leaf', 'sun', 'spark', 'moon', 'zzz'];

const STAGGER_MODES = [
  { key: 'scatter', label: 'россыпью' },
  { key: 'wave', label: 'волной' },
];

let gardenVariant = 'pop';
let gardenStaggerMode = 'scatter';

function buildGardenVariantPicker() {
  const picker = document.getElementById('krk-garden-variant-picker');
  if (!picker) return;

  VARIANTS.forEach((variant, i) => {
    const btn = document.createElement('button');
    btn.className = 'krk-btn krk-btn--ghost demo-variant-btn';
    btn.type = 'button';
    btn.textContent = String.fromCharCode(65 + i); // A..E
    btn.title = variant.label;
    btn.setAttribute('aria-label', `Вариант ${variant.label}`);
    if (variant.key === gardenVariant) btn.classList.add('is-active');

    btn.addEventListener('click', () => {
      gardenVariant = variant.key;
      picker.querySelectorAll('.demo-variant-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      runGarden();
    });

    picker.append(btn);
  });
}

function buildGardenStaggerToggle() {
  const toggle = document.getElementById('krk-garden-stagger-toggle');
  if (!toggle) return;

  STAGGER_MODES.forEach((mode) => {
    const btn = document.createElement('button');
    btn.className = 'krk-btn krk-btn--ghost demo-variant-btn';
    btn.type = 'button';
    btn.textContent = mode.label;
    if (mode.key === gardenStaggerMode) btn.classList.add('is-active');

    btn.addEventListener('click', () => {
      gardenStaggerMode = mode.key;
      toggle.querySelectorAll('.demo-variant-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      runGarden();
    });

    toggle.append(btn);
  });
}

function runGarden() {
  const grid = document.getElementById('krk-garden-grid');
  if (!grid) return;

  const boilOn = document.getElementById('krk-garden-boil')?.checked ?? true;
  const variant = VARIANTS.find((v) => v.key === gardenVariant);

  grid.innerHTML = '';
  const cells = [];
  for (let i = 0; i < GARDEN_COLS * GARDEN_ROWS; i++) {
    const cell = document.createElement('div');
    cell.className = 'demo-garden-cell';
    grid.append(cell);
    cells.push(cell);
  }

  krkStagger(grid, { mode: gardenStaggerMode, step: 45, jitter: 35, spread: 450 });

  cells.forEach((cell, i) => {
    // Every cell keeps its dot — planted cells don't go blank and wait,
    // the dot stays put and is replaced by its doodle at that cell's
    // own moment (see .demo-garden-dot--replaced in motion.css, which
    // reuses this same --krk-enter-delay as the dot's own hide-animation
    // duration rather than a start delay).
    const dot = document.createElement('span');
    dot.className = 'demo-garden-dot';
    cell.append(dot);

    if (i < GARDEN_MOTIF_COUNT) {
      dot.classList.add('demo-garden-dot--replaced');

      const name = GARDEN_POOL[Math.floor(Math.random() * GARDEN_POOL.length)];
      const motif = createMotifEl(name, { size: 28, color: 'var(--krk-pen-blue)' });
      motif.classList.add('demo-garden-motif', variant.className);
      if (boilOn) motif.classList.add('krk-boil');
      cell.append(motif);
    }
  });
}

function wireGardenControls() {
  document.getElementById('krk-garden-replant')?.addEventListener('click', runGarden);

  const boilCheckbox = document.getElementById('krk-garden-boil');
  boilCheckbox?.addEventListener('change', () => {
    document.querySelectorAll('#krk-garden-grid .demo-garden-motif').forEach((el) => {
      el.classList.toggle('krk-boil', boilCheckbox.checked);
    });
  });
}

/* ============================================================
   Section 3 — «Карточки входят»
   ============================================================ */

const CARD_ITEMS = [
  { icon: 'sun', text: 'Растяжка утром' },
  { icon: 'cup-tea', text: 'Чай без телефона' },
  { icon: 'leaf', text: 'Прогулка на воздухе' },
  { icon: 'moon', text: 'Сон до полуночи' },
];

const CARD_VARIANTS = [
  { key: 'rise', label: 'rise', stagger: 60 },
  { key: 'flip-pop', label: 'flip-pop', stagger: 70 },
  { key: 'draw-rise', label: 'draw+rise', stagger: 60 },
];

let cardVariant = 'rise';

function buildCardVariantPicker() {
  const picker = document.getElementById('krk-cardlist-variant-picker');
  if (!picker) return;

  CARD_VARIANTS.forEach((variant) => {
    const btn = document.createElement('button');
    btn.className = 'krk-btn krk-btn--ghost demo-variant-btn';
    btn.type = 'button';
    btn.textContent = variant.label;
    if (variant.key === cardVariant) btn.classList.add('is-active');

    btn.addEventListener('click', () => {
      cardVariant = variant.key;
      picker.querySelectorAll('.demo-variant-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyCardVariant();
    });

    picker.append(btn);
  });
}

function buildCardList() {
  const list = document.getElementById('krk-cardlist');
  if (!list) return;

  list.innerHTML = '';
  CARD_ITEMS.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'krk-card demo-cardlist-row';

    const icon = createMotifEl(item.icon, { size: 32, color: 'var(--krk-pen-blue)' });
    icon.classList.add('demo-cardlist-row__icon');

    const text = document.createElement('p');
    text.className = 'demo-cardlist-row__text';
    text.textContent = item.text;

    card.append(icon, text);
    list.append(card);
  });

  applyCardVariant();
}

function applyCardVariant() {
  const list = document.getElementById('krk-cardlist');
  if (!list) return;

  const variant = CARD_VARIANTS.find((v) => v.key === cardVariant);
  const cards = Array.from(list.children);

  cards.forEach((card) => {
    card.classList.remove('krk-enter-rise', 'krk-enter-flip-pop');
    card.querySelector('.demo-cardlist-row__icon')?.classList.remove('krk-enter-draw');
  });
  void list.offsetWidth; // force reflow so re-adding classes restarts the animation

  if (cardVariant === 'rise') {
    cards.forEach((c) => c.classList.add('krk-enter-rise'));
  } else if (cardVariant === 'flip-pop') {
    cards.forEach((c) => c.classList.add('krk-enter-flip-pop'));
  } else {
    cards.forEach((c) => {
      c.classList.add('krk-enter-rise');
      c.querySelector('.demo-cardlist-row__icon')?.classList.add('krk-enter-draw');
    });
  }

  // Explicit mode: 'wave' — anim.js's krkStagger() now defaults to
  // 'scatter', but card-list rows are meant to cascade in reading order.
  krkStagger(list, { mode: 'wave', step: variant.stagger });
}

function wireCardControls() {
  document.getElementById('krk-cardlist-replay')?.addEventListener('click', () => applyCardVariant());
}

/* ============================================================
   Init
   ============================================================ */

function init() {
  buildEntranceRow();

  buildGardenVariantPicker();
  buildGardenStaggerToggle();
  wireGardenControls();
  runGarden();

  buildCardVariantPicker();
  buildCardList();
  wireCardControls();
}

document.addEventListener('DOMContentLoaded', init);
