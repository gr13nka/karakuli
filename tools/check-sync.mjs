#!/usr/bin/env node
/**
 * Karakuli — drift checker
 * -----------------------------------------------------------------------
 * Report-only. Never writes anything. Cross-checks the kit's generated
 * surfaces (tokens.css, karakuli.css, sound.js, demo/index.html) against
 * its docs (STYLE.md, SKILL.md) and asset directories (doodles/,
 * characters/), so drift between "what the code does" and "what the docs
 * claim" surfaces before it goes stale for months.
 *
 * Usage: node tools/check-sync.mjs   (from anywhere — paths resolve off
 * this file's own location, not the caller's cwd)
 * Exit code: 0 if clean, 1 if any warnings (so it can gate a commit hook).
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { contrast } from './contrast.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_MD = '/Users/username/.claude/skills/karakuli-style/SKILL.md';

const warnings = [];
const warn = (check, msg) => warnings.push(`[${check}] ${msg}`);

function read(absOrRelPath, check) {
  const full = absOrRelPath.startsWith('/') ? absOrRelPath : join(ROOT, absOrRelPath);
  if (!existsSync(full)) {
    warn(check, `${absOrRelPath} not found — skipping checks against it`);
    return null;
  }
  return readFileSync(full, 'utf8');
}

const tokensCss = read('web/tokens.css', 'tokens');
const styleMd = read('STYLE.md', 'docs') ?? '';
const karakuliCss = read('web/karakuli.css', 'classes');

/* The operational skill deliberately lives outside this repo, in the user's
   global Claude directory. Its absence is therefore a fact about the machine,
   not drift in the repo — on CI it is never there — so the checks that read it
   are skipped with a note rather than failed. Everything the repo owns is still
   checked, so a clean run away from that machine still means something. */
const skillMd = existsSync(SKILL_MD) ? readFileSync(SKILL_MD, 'utf8') : null;
if (skillMd === null) console.log(`check-sync: note — ${SKILL_MD} not on this machine; checks that read it are skipped`);
const docsText = styleMd + '\n' + (skillMd ?? '');

// ---- 1. Token coverage: every --krk-* defined in tokens.css should be
// named (verbatim, including the -- prefix) in at least one canonical doc.
if (tokensCss) {
  const tokens = [...tokensCss.matchAll(/--krk-[a-z0-9-]+(?=\s*:)/g)].map((m) => m[0]);
  for (const t of new Set(tokens)) {
    if (!docsText.includes(t)) warn('tokens', `${t} defined in tokens.css but not named in STYLE.md or SKILL.md`);
  }
}

// ---- 2. Class coverage: every .krk-* selector defined in karakuli.css
// should be named (verbatim) in SKILL.md. Compound selectors like
// .krk-tab.is-active never match (the regex requires "krk-" right after
// the dot), so state suffixes fall out on their own. Underscores are
// included so BEM elements (.krk-pillnav__item) surface as their own
// entries instead of truncating to their block (.krk-pillnav).
if (karakuliCss && skillMd !== null) {
  const classes = [...karakuliCss.matchAll(/\.krk-[a-z0-9_-]+/g)].map((m) => m[0].slice(1));
  for (const c of new Set(classes)) {
    if (!skillMd.includes(c)) warn('classes', `.${c} defined in karakuli.css but not named in SKILL.md`);
  }
}

// ---- 3. Character inventory: files in characters/ vs .svg names cited in
// the docs. Catches retired-character stragglers in either direction.
const charDir = join(ROOT, 'characters');
if (existsSync(charDir)) {
  const files = readdirSync(charDir).filter((f) => f.endsWith('.svg'));
  const cited = new Set([...docsText.matchAll(/[\w-]+\.svg/g)].map((m) => m[0]));
  for (const f of files) if (!cited.has(f)) warn('characters', `characters/${f} exists but isn't cited in STYLE.md or SKILL.md`);
  for (const name of cited) if (!files.includes(name)) warn('characters', `"${name}" is cited in the docs but characters/${name} doesn't exist`);
}

// ---- 4. Doodle count: doodles/*.svg on disk vs the number the docs claim
// ("N ready motifs" / "N мотив...").
const doodleDir = join(ROOT, 'doodles');
if (existsSync(doodleDir)) {
  const actual = readdirSync(doodleDir).filter((f) => f.endsWith('.svg')).length;
  for (const [label, text] of [['STYLE.md', styleMd], ['SKILL.md', skillMd]].filter(([, t]) => t !== null)) {
    for (const m of text.matchAll(/(\d+)\s+(?:ready\s+)?мотив[а-яё]*|мотив[а-яё]*\D{0,15}?(\d+)|(\d+)\s+(?:ready\s+)?motifs?\b|motifs?\D{0,15}?(\d+)/gi)) {
      const claimed = Number(m[1] ?? m[2] ?? m[3] ?? m[4]);
      if (claimed !== actual) warn('doodle-count', `${label} says ${claimed} motifs near "${m[0].trim()}", but doodles/ has ${actual}`);
    }
  }
}

// ---- 5. Font consistency: the canonical UI font (read from tokens.css,
// not hardcoded) must be named in every platform surface that renders it.
if (tokensCss) {
  const fontMatch = tokensCss.match(/--krk-font-sans:\s*'([^']+)'/);
  const font = fontMatch?.[1];
  if (!font) {
    warn('fonts', 'could not find --krk-font-sans in tokens.css to determine the canonical font');
  } else {
    const surfaces = ['web/tokens.css', SKILL_MD, 'STYLE.md', 'compose/Karakuli.kt', 'poster/template.html', 'demo/index.html'];
    for (const surface of surfaces) {
      const text = surface === SKILL_MD ? skillMd : surface === 'STYLE.md' ? styleMd : surface === 'web/tokens.css' ? tokensCss : read(surface, 'fonts');
      if (text !== null && !text.includes(font)) warn('fonts', `"${font}" not found in ${surface}`);
    }
  }
}

// ---- 6. Sound cue validity: every value in sound.js's KRK_CUES map must
// be a real uisfx cue name, and 'click' (silent — known historical bug)
// must never reappear as a value.
const VALID_CUES = new Set(`hover press release double-click focus long-press select deselect
  toggle-on toggle-off check uncheck open close back forward expand collapse delete cancel
  undo redo copy paste drag-start drop snap swipe reorder invalid-drop send receive
  notification mention typing reaction success error warning info blocked retry start stop
  progress-step complete queued checkpoint loading processing recording connecting scanning
  streaming play pause seek volume-change skip-next skip-previous connect disconnect lock
  unlock wake sleep reward level-up achievement streak badge bonus add-to-cart
  remove-from-cart checkout purchase coupon refund`.split(/\s+/).filter(Boolean));

const soundJs = read('web/sound.js', 'sound');
if (soundJs) {
  const block = soundJs.match(/KRK_CUES\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';
  const values = [...block.matchAll(/:\s*'([^']+)'/g)].map((m) => m[1]);
  for (const v of new Set(values)) {
    if (!VALID_CUES.has(v)) warn('sound', `KRK_CUES uses '${v}', which isn't in the uisfx cue catalog`);
  }
  if (/'click'/.test(block)) warn('sound', `KRK_CUES contains 'click' — known-silent cue, historical bug (see sound.js's own comment)`);
}

// ---- 7. Demo references: every doodle/character path demo/index.html
// points at must actually exist.
const demoHtml = read('demo/index.html', 'demo');
if (demoHtml) {
  const refs = new Set([...demoHtml.matchAll(/\.\.\/(doodles|characters)\/[\w.-]+\.svg/g)].map((m) => m[0]));
  for (const ref of refs) {
    if (!existsSync(join(ROOT, 'demo', ref))) warn('demo', `demo/index.html references ${ref}, which doesn't exist`);
  }
}

// ---- 8. Baked colour: a hand-drawn mark carrying its own hex.
// Six marks in karakuli.css used to write the ink colour inside their data
// URI, because currentColor cannot reach in there. That made them the only
// marks in the system that could follow neither an accent nor a theme, and it
// is what kept dark mode in the backlog for as long as it was. They are masks
// now, and this check is what stops a seventh from arriving.
//
// %23000 (black) is exempt and only black is: a mask source needs *some* paint
// to carry alpha, mask-mode: alpha reads the alpha and discards the colour, so
// black there is a carrier rather than a decision.
for (const file of ['web/karakuli.css', 'web/tokens.css', 'web/anim.css', 'web/boil.css',
                    'demo/index.html', 'demo/motion.css', 'poster/template.html']) {
  const text = read(file, 'baked-colour');
  if (!text) continue;
  for (const m of text.matchAll(/data:image\/svg\+xml[^"')]*/g)) {
    const colours = [...m[0].matchAll(/%23[0-9a-fA-F]{3,8}|rgba?\(/g)].map((c) => c[0]);
    const baked = colours.filter((c) => c.toLowerCase() !== '%23000');
    if (baked.length) {
      warn('baked-colour', `${file} bakes ${baked[0]} into a data: URI — a mark that carries its own colour cannot follow a theme. Draw it in %23000 and cut it with mask-image + background-color: currentColor.`);
      break;
    }
  }
}

// ---- 9. Contrast, in both grounds. Run with --contrast to see the numbers;
// the failures are reported either way.
// [ink, surface, minimum, label]. 3.0 marks a pair only ever used at large
// sizes or as illustration, where AA allows the lower bar.
// [ink, surface, minimum, label]. The minimum is a number, or a per-ground
// pair where canon sets a different bar for each — which it does, because the
// verdicts in STYLE.md §1 were measured on cream and several of them stop
// being true on indigo.
const PAIRS = [
  ['--krk-ink', '--krk-paper', 4.5, 'body text on paper'],
  ['--krk-ink', '--krk-paper-2', 4.5, 'body text on a card'],
  ['--krk-ink-soft', '--krk-paper', 4.5, 'meta text on paper'],
  ['--krk-ink-soft', '--krk-paper-2', 4.5, 'meta text on a card'],
  // ink-faint is decoration, not text — STYLE.md §1 says "never for text a
  // user must read". The bar is therefore "can you see it at all", not AA;
  // holding decoration to a reading bar is how you end up darkening a hairline
  // until it stops being a hairline.
  ['--krk-ink-faint', '--krk-paper', 1.5, 'hairlines and dotted grids on paper'],
  ['--krk-ink-faint', '--krk-paper-2', 1.5, 'hairlines on a card'],
  ['--krk-danger', '--krk-paper', 4.5, 'danger text on paper'],
  ['--krk-ink', '--krk-wash-lavender', 4.5, 'text on a lavender card'],
  ['--krk-ink', '--krk-wash-sage', 4.5, 'text on a sage card'],
  ['--krk-ink', '--krk-wash-blush', 4.5, 'text on a blush card'],
  ['--krk-ink', '--krk-wash-butter', 4.5, 'text on a butter card'],
  ['--krk-ink-soft', '--krk-wash-lavender', 4.5, 'meta text on a lavender card'],
  ['--krk-ink-soft', '--krk-wash-sage', 4.5, 'meta text on a sage card'],
  ['--krk-ink-soft', '--krk-wash-blush', 4.5, 'meta text on a blush card'],
  ['--krk-ink-soft', '--krk-wash-butter', 4.5, 'meta text on a butter card'],
  // The brights, at the bar canon actually sets for each. Night lifts all four
  // clear of AA; day does not, and orange is illustration-only there, so its
  // day bar is only that it remains visible.
  ['--krk-pen-blue', '--krk-paper', 4.5, 'pen blue as text'],
  ['--krk-pen-green', '--krk-paper', { light: 3.0, dark: 4.5 }, 'pen green as large text'],
  ['--krk-pen-pink', '--krk-paper', { light: 3.0, dark: 4.5 }, 'pen pink as large text'],
  ['--krk-pen-orange', '--krk-paper', { light: 1.5, dark: 4.5 }, 'pen orange — illustration only by day'],
];

const REPORT = process.argv.includes('--contrast');
if (tokensCss) {
  // light-dark(a, b) is the whole point: one declaration, both grounds. Pull
  // the pair out per token and measure each ground against its own siblings.
  const grounds = { light: 0, dark: 1 };
  const pairs = new Map();
  for (const m of tokensCss.matchAll(/(--krk-[a-z0-9-]+):\s*light-dark\(\s*(#[0-9a-fA-F]{3,6})\s*,\s*(#[0-9a-fA-F]{3,6})\s*\)/g)) {
    pairs.set(m[1], [m[2], m[3]]);
  }
  for (const [ground, i] of Object.entries(grounds)) {
    if (REPORT) console.log(`\n  ${ground}`);
    for (const [inkName, bgName, bar, label] of PAIRS) {
      const min = typeof bar === 'number' ? bar : bar[ground];
      const ink = pairs.get(inkName)?.[i];
      const bg = pairs.get(bgName)?.[i];
      if (!ink || !bg) { warn('contrast', `${ground}: could not resolve ${inkName} / ${bgName} as a light-dark() pair`); continue; }
      const r = contrast(ink, bg);
      if (REPORT) console.log(`    ${r >= min ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(6)}:1 (min ${min})  ${label}`);
      if (r < min) warn('contrast', `${ground}: ${label} — ${inkName} ${ink} on ${bgName} ${bg} is ${r.toFixed(2)}:1, under ${min}:1`);
    }
  }
  if (REPORT) console.log('');
}

// ---- Report ----
if (warnings.length === 0) {
  console.log('check-sync: OK — no drift found');
  process.exit(0);
} else {
  for (const w of warnings) console.log(w);
  console.log(`check-sync: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  process.exit(1);
}
