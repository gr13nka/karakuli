# Karakuli — Decisions Log

This file is an append-only record of the choices that shaped Karakuli, each one paired with *why* it was made and what was considered and rejected along the way. `STYLE.md` states the current canon; this file exists so nobody — human or agent — has to reconstruct the reasoning behind it from memory, or worse, quietly re-litigate or undo a decision that was already made on purpose. When canon changes, it gets a new dated entry here. Existing entries don't get edited or deleted, even when a later decision reverses one.

Two sections:

- **Unsettled** — the open backlog: things intentionally left undecided rather than half-decided under time pressure. Check here before treating something as "new."
- **The log** — dated entries, newest first, each stating the decision, the reasoning, and what was rejected.

---

## Unsettled

- Radio and uncheck currently share a "release"-family sameness the user noticed but kept as-is — worth a second look if it starts feeling indistinct in practice.
- Button-tap cue `press` is provisional — not yet user-confirmed by ear the way check/uncheck/radio were.
- Dark mode. Candidate direction: deep warm-gray paper + chalk-coloured ink, same paper+ink+colour-moments structure. Not designed.
- Love2D mapping — a Lua-side equivalent of the web tokens, including how the boil-filter concept translates to a non-CSS rendering context.
- Rules for data-dense screens (tables, charts) — canon doesn't address this yet.
- Empty/error/loading state patterns, beyond the general colour-moments guidance in `STYLE.md` §5.
- More character poses. Пельмень and Батон have two each; more will be needed as apps put them in new contexts.
- More motifs, as app-specific needs surface beyond the current 20-motif library.
- Print sizes beyond the poster arm's current 1080 reference.
- Adopting the Compose theme in an actual shipping app — validation still pending.

---

## Log

### 2026-08-17

#### Typography — M PLUS Rounded 1c (same-day reversal)

Body/UI type is now M PLUS Rounded 1c, body set at 17px/weight 500, meta text at 15px/weight 500. This reverses the day's earlier choice of Onest, which the user rejected after a live side-by-side comparison as "too sharp, too thin/small" for Russian text sitting next to the hand-drawn pen. Onest is demoted to the fallback chain rather than dropped outright. Candidates trialled live before landing on M PLUS Rounded 1c: Nunito, Rubik.

#### Characters — Пельмень primary, Батон secondary

Пельмень (the dumpling) is the primary mascot: onboarding heroes, celebrations, colour moments. Батон (the loaf cat) is secondary: rest, sleep, quiet and empty states. A third candidate, Улитка the snail, was drawn, redrawn, and ultimately rejected by the user; its SVGs are deleted from `characters/`. The roster is closed at two by default — see canon rule against adding a third without deliberate intent.

#### Hand-touched UI — six sanctioned intrusions

The UI stays clean by default, with exactly six sanctioned hand-drawn touches: wobbly dividers, hand-drawn check/radio marks, a scribble underline on the active tab, hand-drawn arrows, organic asymmetric corners, and a wobbly-bordered button variant. The sixth item was added mid-build, after the component layer had already shipped a `.krk-btn--wobbly` style that the original five-item list didn't sanction — a canon conflict, resolved by extending the canon rather than reverting the component. Rotation, per-frame jitter, and fake-wobble filters on otherwise static UI stay forbidden regardless of which of the six touches is in play.

#### Sound — uisfx, zen pack, hard-won cue picks

Sound layer is [uisfx](https://uisfx.com), locked to the `zen` pack always, volume 0.35 by default. Two hard-won facts surfaced while wiring it up: `'click'` is not actually a real uisfx cue — using it produced fully silent buttons before the mistake was caught — and the real catalog is 78 cues across 13 categories, large enough that guessing cue names by intuition doesn't work. The user then by-ear picked replacements for the everyday interactions: checkbox-on uses `drag-start`, checkbox-off uses `invalid-drop`, radio uses `release`. A `success` chime was tried for checkbox ticks first and rejected — the user found it unpleasant.

#### Platforms — web reference, Compose mapped, Love2D deferred

Web (`web/tokens.css` + `karakuli.css`) is the reference implementation everything else maps to. The Compose mapping (`compose/Karakuli.kt`) and the poster arm are both live. A Love2D/Lua mapping is explicitly deferred, not rejected — see Unsettled.

#### Poster — headline weight steps up at large sizes

Poster headlines step up to weight 800 at very large display sizes on loud backgrounds; the system's normal 700 heading weight reads too light at something like 128px set on a brick-red background. This is a poster-arm-specific override, not a change to the UI heading weight defined in `STYLE.md` §2.

#### Palette — warm cream paper, warm ink

`--krk-paper` (`#F7F3E9`) and `--krk-ink` (`#26241F`) anchor the system. Ink is the default accent (`--krk-accent`) unless an app overrides it. Pen brights are reserved for illustration and colour moments; washes are for surface backgrounds only. Per-app "loud signature" experiments — an app breaking from the default ink accent into its own bold colour identity — are explicitly allowed, scoped to the accent-colour knob in `STYLE.md` §8, not treated as a violation of the ink-default rule.

#### Line — soft round-nib pen

The drawing tool for every doodle, icon, and illustration is one soft round-nib pen: medium weight, round caps and joins, wobble baked into the path data. A crayon-grain filter exists but is reserved for hero illustrations only. Rejected: a fineliner/technical-pen look (read too cold and "designery" for a wellness-leaning system); pure crayon texture as the default line (looked inconsistent once scaled down to icon size — grain that charms at hero scale turns to noise at 48px).

#### Core direction — paper + ink + colour moments

Karakuli's foundational shape: warm paper as the default ground, one pen for all drawing, colour rationed to earned moments rather than spread across the whole UI. Rejected: a pure ink-on-paper stationery look with no colour permission at all (felt lifeless for reward/celebration moments); a colour doodle-garden aesthetic applied everywhere (felt busy, undermined the "quiet clean UI" goal); a bold-marker poster style as the system default (too loud for daily-use screens — kept alive only as the dedicated poster arm's own energy, not folded into the base system).
