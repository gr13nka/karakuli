# Karakuli — design-system kit (entry point for Claude)

This repo is the home of **Karakuli**, the user's personal naive/cosy hand-drawn design
language, reused across all their apps and sites (wellness trackers, meditation, cooking,
games, posters). It is not an app — it's the *kit*: canon documents, a reference web
implementation, an illustration library, platform mappings, and a demo showcase. Karakuli
in one line: **paper + ink + colour moments** — warm cream paper, everything drawn with one
soft round-nib pen, colour reserved for earned moments (rewards, onboarding, celebrations).

## Authority order — read before changing anything

1. **`STYLE.md`** — the constitution. States the current canon: palette, typography
   (M PLUS Rounded 1c body + Shantell Sans accents), pen rules, the six sanctioned
   hand-drawn UI intrusions, colour-moment doctrine, motion (boil + entrances), sound
   (uisfx zen pack), the three per-app knobs, characters. If STYLE.md and any other file
   disagree, STYLE.md wins and the disagreement is a bug (`tools/check-sync.mjs` exists to
   catch exactly that).
2. **`DECISIONS.md`** — append-only log of every decision with its *why* and what was
   rejected, plus the **Unsettled** backlog. Read it before proposing a change: never
   re-litigate a decision recorded there, and never implement an Unsettled item without
   the user's explicit go-ahead. Existing entries are never edited or deleted.
3. **The global skill `karakuli-style`** (`~/.claude/skills/karakuli-style/SKILL.md`) —
   the operational recipe book: per-platform how-tos, complete class reference, the
   amendment recipe and the sync map (which files must change together). It auto-triggers
   on "karakuli" / «мой стиль»; the trigger phrase «каракули - <правило>» (dash separator)
   starts a canon amendment.

## Repo map

| Path | What it is | Notes |
|---|---|---|
| `STYLE.md` | Canon (see above) | English |
| `DECISIONS.md` | Decision log + Unsettled backlog | Append-only |
| `web/tokens.css` | All `--krk-*` design tokens | The single source of palette/type/spacing values |
| `web/karakuli.css` | Component classes (`.krk-btn`, `.krk-card`, `.krk-check`, …) | Reference implementation everything else maps to |
| `web/anim.css` + `web/anim.js` | Entrance-animation layer (`.krk-enter-*`, `krkStagger`) | Chosen by eye against a live sampler |
| `web/boil.css` + `web/boil.js` | Living-doodle "boil" (3-frame filter swap, ~6fps) | boil.js self-injects filters on DOMContentLoaded |
| `web/sound.js` | Sound layer wrapper over uisfx (`KRK_CUES`, `initKarakuliSound`) | zen pack always, volume 0.35; `'click'` is NOT a valid cue |
| `web/theme.js` | Light/dark control (`initKarakuliTheme`, `NO_FLASH_SNIPPET`) | One `data-theme` attribute; absent follows the OS |
| `doodles/` | 20 motif SVGs | Contract: viewBox 0 0 48 48, stroke 2.8, `currentColor`, stroke-only, baked wobble |
| `characters/` | Mascots: Пельмень (primary), Батон (secondary) | viewBox 0 0 200 200, stroke 7; roster closed at two |
| `compose/` | Android Jetpack Compose mapping (`Karakuli.kt`) | Both grounds; colours come from `LocalKarakuliColors`, never a constant |
| `poster/` | Print/poster arm (`POSTER.md`, `template.html`) | Its own louder energy; not the UI default |
| `demo/index.html` | The showcase: 3 phone screens, sound board, font and theme switchers, component gallery | English; serve over http, never file:// |
| `demo/motion.html/.css/.js` | Motion sampler — the by-eye chooser that picked the entrance canon | Draft/witness page, not canon itself |
| `tools/check-sync.mjs` | Drift checker (`node tools/check-sync.mjs`, `--contrast` for the numbers) | Run before every commit; exit 1 on drift |
| `tools/contrast.mjs` | WCAG colour maths, copied from the `article` sibling | A copy on purpose, never a second implementation |

## How to work here

- **Language:** everything in this repo is English, the showcase included — it is the
  thing strangers are pointed at, and the README's pictures are taken from it. The two
  mascots keep their names, Пельмень and Батон, because a name is a name. In-app UI text
  in an app *built with* Karakuli is whatever that app speaks; both typefaces ship full
  Cyrillic, so Russian is a first-class case rather than a fallback.
- **Serving demos:** `python3 -m http.server 8765` from the repo root, then open
  `http://127.0.0.1:8765/demo/…`. `file://` breaks ES modules — never use it. Show visual
  results to the user in Orca's embedded browser (`orca tab create --url …`).
- **Changing canon:** follow the amendment recipe in the `karakuli-style` skill —
  conflict-check against `DECISIONS.md`, edit `STYLE.md`, walk the sync map (skill,
  tokens/classes, demo), append a `DECISIONS.md` entry (decision + why + rejected
  alternatives), run `node tools/check-sync.mjs`, commit. Half-decided ideas go to the
  Unsettled backlog, not into STYLE.md as hedges.
- **Choosing by eye/ear:** subjective calls (typeface, sound cues, animation feel) are
  settled by building a live comparison page and letting the user pick — this has worked
  repeatedly (font switcher, sound board, motion sampler). Don't pick aesthetics for the
  user; stage the choice instead.
- **Commits:** short imperative messages, no AI/Claude co-authorship or attribution
  trailers — ever (user's standing rule).
- **The pen contract is absolute:** stroke-only SVG, round caps/joins, cubic Béziers, no
  perfect circles/rects/straight lines, wobble baked into path data (2–4% of canvas) —
  never faked with runtime filters on static geometry. New artwork at any scale must read
  as the same pen. Fill is spent exactly twice (STYLE.md §3): a UI surface drawn as a
  path and filled in the accent, and a doodle's *closed* subpaths filled with **paper**
  where motifs overlap in a field. Paper, never a pen — it is an opacity decision, so
  colour still only ever appears as an edge.

## Quick sanity list (the mistakes already made once)

- `'click'` is not a uisfx cue — it plays silence. Use `KRK_CUES.tap` (`'press'`).
- Boil filters displace ~2px: invisible on tiny motifs. Render doodles big enough, or
  don't promise visible boil.
- `steps(N)` on a single keyframe interval can't hold specific intermediate values — use
  multi-stop keyframes with `steps(1, jump-end)` for flipbook-style discrete motion.
- Docs drift is real: any new token, class, or cue must be spelled out in STYLE.md and
  the skill, or `check-sync` fails the build.
- `check-sync`'s doodle-count rule matches any number within ~15 characters of the word
  "motif", so ordinary prose ("motifs render ~120% of their cell") trips it. Reword
  rather than loosening the check — it is the gate that keeps the count honest.
