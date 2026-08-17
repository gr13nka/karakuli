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
const skillMd = read(SKILL_MD, 'docs') ?? '';
const karakuliCss = read('web/karakuli.css', 'classes');
const docsText = styleMd + '\n' + skillMd;

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
if (karakuliCss) {
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
  for (const [label, text] of [['STYLE.md', styleMd], ['SKILL.md', skillMd]]) {
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
    const surfaces = ['web/tokens.css', SKILL_MD, 'STYLE.md', 'compose/Karakuli.kt', 'poster/template.html'];
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

// ---- Report ----
if (warnings.length === 0) {
  console.log('check-sync: OK — no drift found');
  process.exit(0);
} else {
  for (const w of warnings) console.log(w);
  console.log(`check-sync: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  process.exit(1);
}
