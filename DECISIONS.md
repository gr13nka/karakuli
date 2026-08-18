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
- "Karakuli Prose" (working name) — a possible long-form reading register (articles, book notes, recipe stories, blog), inspired by an editorial page the user liked: serif body, justified setting, drop cap, links in a muted red near `--krk-danger`, a small ornament glyph as a section mark, generous spacing. Sketched, not decided: canon paper/ink/accent stay; serif only inside long-form content, chrome stays sans; drop cap in the app accent; a doodle motif (squiggle/leaf) standing in for the fleuron; ragged-right or `hyphens: auto` for Russian instead of naive justification. Cyrillic serif candidates to trial by eye later: Lora, Literata, PT Serif. User deferred — do not implement without their go-ahead.

---

## Log

### 2026-08-18

#### Wobbly button — a filled, borderless, path-drawn second strength

`.krk-btn--wobbly` was "a 1.5px ink border with pronounced organic corner asymmetry," border and shape only. It gains a stronger form: filled with the accent, no border, and its outline drawn as a closed cubic path rather than produced by `border-radius`. Reserved for the single most committing action in an app.

The reasoning is the canon's own. §3 forbids ruler-straight lines in anything drawn, and organic radius only bends the corners — the four sides between them stay perfectly straight, so the "hand-placed" button was, at its edges, a machine-made rectangle. Drawing it as a path is what the pen rule already implied.

The border went in a second pass, once it was seen against more than one palette. An outline in a second colour is a statement only some palettes can make: where an app sets `--krk-accent` to `--krk-ink` (the default), the fill and the edge are the same colour and there is no outline to see, while a brick-accented sibling showed a strong dark rule. Same component, two different shapes depending on taste — which is more than a theme is allowed to be. Rejected on the way: keeping the outline and having it appear only in accented apps, and outlining in paper instead (an inset edge, which read as a gap rather than as a drawn line).

#### Drawing a box — bow by the side's own length, and opposite sides disagree

Two facts about a hand-drawn rounded rectangle, both found the expensive way and neither guessable, now in §3.

Scaling each side's bow to the box's *shorter* side is the obvious choice and it is wrong: on a 220 × 52 button the long edges then move by under a point and the shape comes back looking machined. The bow has to be a fraction of the side's own length, because a hand wanders in proportion to how far it is travelling.

And the signs have to alternate. Bowing every side outward inflates the box into a pillow. Bowing top and bottom the same way — which is what "vary them a bit" produces if you are not watching — bends the button into a banana; it looked deliberate, like a curve someone had designed, rather than like an uneven line. One side out and its opposite in was what finally read as drawn.

Also settled: the wobble is a fixed table, not a seed. This is the exact opposite of the rule for organic radius, and for the opposite reason — radius is seeded because many boxes are co-visible and have to differ from *each other*, while a path-drawn surface is rare enough in an app that it has nothing to differ from and wants one character instead of a family.

#### Sliding selector — a second, quiet marker tone for in-screen choices

The selector is now used twice in the same app: once as the screen switcher, once as a duration picker inside a screen. The nav keeps the accent-filled marker. The in-screen one takes a quiet marker in paper-2, and the chosen item's own label darkens under it.

**This looks like a reversal of a decision logged earlier today and is not**, so the distinction is worth stating. When the slider was designed, a wash-filled capsule was shown and rejected — "too faint to read as the selection marker." That capsule was being asked to carry the selection *by itself*, in the navigation, where being unmistakable is the whole job. The quiet marker here is a different case on both counts: it marks a choice inside a screen rather than where you are in the app, and it never carries the selection alone. If a future use drops the second signal, the original objection applies again and the tone should go back to accent.

What drove it: a dark block travelling across bare paper is the heaviest mark on the page, and a settings row is not what a screen is about. Rejected alongside: adding a wash to the palette for it (a new colour meaning something new, which §8 forbids), and dropping the marker entirely in favour of weight alone (loses the travel, which is the component's whole point).

#### Entrances — squash and stretch, and timing on the energy dial

The sprout may squash and stretch rather than scale on one axis. The rule that makes it read as growth: `scaleX` and `scaleY` never reach their extremes together — a frame where both go fat is a bubble inflating. Recorded because the failure is subtle and the fix is not obvious from watching it.

Practical note that generalises: write the curve as frames, not as one array per channel. The character is entirely in how the channels disagree at a given moment, and parallel arrays are exactly the shape that hides that.

Timing joins the energy dial rather than becoming a new default. Calm keeps ~300ms a doodle across a ~450ms window; playful can take it to ~200/~280, landing a whole field in under half a second.

#### Entrances — replayable by pulling down, never with a refresh spinner

An entrance worth looking at can be replayed by pulling down at the top of its scroll. It must not be built on the platform's pull-to-refresh control: that puts a system progress indicator on the paper, and a spinner is a promise that something is loading, which is a lie when the content is already there.

The platform fact, recorded so it is not rediscovered: **Android reports no overscroll.** The offset stays at 0 while the finger drags, so the obvious negative-offset test silently does nothing there — on the phone this was built for, the first implementation appeared to be broken. A drag that *began* at the top and never moved the content can only have been downward, since upward would have scrolled; iOS bounces and reports a negative offset, which fails the same "greater than zero" test, so one rule covers both.

### 2026-08-18

#### Motion — reduced-motion guard removed entirely, movement gets an overshoot

The global `prefers-reduced-motion` guard is gone: removed from `tokens.css`, `boil.css`, `boil.js`, `karakuli.css`, `anim.css`, `demo/motion.css`, the Compose mapping, `STYLE.md` and the skill. Karakuli now animates for everyone — boil keeps boiling, entrances keep playing, transitions keep their full duration, on every platform. Alongside it, anything that **moves or scales** now uses `--krk-motion-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`, promoted to a token from the curve `.krk-enter-sprout` was already using inline); colour and opacity keep `ease-out`, where an overshoot has nothing to overshoot into.

The user asked for this directly and reaffirmed it after being told what it costs: `prefers-reduced-motion` is the signal people with vestibular disorders, migraine triggers, and motion sensitivity use to make interfaces usable, and ignoring it means the system animates at users who have explicitly asked their OS not to. That trade was made knowingly, in favour of the motion feeling "smooth and bouncy" everywhere. It is recorded here rather than left implicit precisely because it's the kind of call a future reader would otherwise assume was an oversight and silently "fix" — the canon now says don't reintroduce a guard without the user's say-so.

Rejected on the way: a component-scoped carve-out that kept the guard globally but exempted the sliding screen selector (the user rejected the narrow version twice and asked for the note removed "completely").

### 2026-08-18

#### Sliding screen selector — `.krk-pillnav--slider`

The pill nav gains a variant where a single accent-filled capsule travels to the chosen screen instead of each item lighting up in place. Every item keeps its doodle at all times; the capsule arriving under it is what marks the screen, and the doodle flips to paper as it does. Chosen by the user from a reference screenshot after being shown the alternatives: a wash-filled capsule (rejected — too faint to read as the selection marker) and inactive items collapsing to dots (rejected — the user wanted every screen legible at rest, not just the current one). The capsule is a separate element rather than a styled item, because only a continuously positioned element can move *between* items; `web/pillnav.js` owns where it is, CSS owns how it looks.

#### Sound — navigation is silent, with one sanctioned exception

`slide` (uisfx `drag-start`, zen's soft brush) plays as the sliding selector's capsule travels. This is a deliberate carve-out from the standing rule that sound never plays on plain navigation: the rule stands everywhere else, but here the capsule's movement *is* the state change, so the cue rides the motion instead of announcing a route change. The user asked for a "swipe" sound; the zen pack has no swipe cue, and `drag-start` is its nearest brush-like texture — it shares that cue with `pick`, the way `radio` and `holdEnd` already share `release`. Note for call sites: the energy dial swallows this cue in a calm app, so a nav that needs to be heard must be mounted in a playful one.


### 2026-08-17

#### Entrance animations — sprout+scatter (doodles), draw+rise (cards)

Winners picked by eye from five candidates on a live sampler (`demo/motion.html`), built against a Pinterest reference video (an iOS "days of growth" calendar). Doodles and illustrations sprout (`.krk-enter-sprout`) and enter as a group in a simultaneous scatter burst; cards and list rows enter with draw+rise (`.krk-enter-rise` + `.krk-enter-draw`), staggered in a wave. Rejected as canon defaults: smooth pop (candidate A), flipbook flip-pop (candidate B — a discrete `steps(1, jump-end)` four-phase pop), and quiet fade (candidate D); all three remain sampler-only, not wired into `web/anim.css`. Also rejected: a sequential wave for doodle fields — compared directly against the reference video, the user chose the simultaneous scatter burst instead; wave stays reserved for card lists only.

#### Garden presentation — overlapping doodles, boil kept on

Motifs in a garden render larger than their grid cell (~118–148% with size jitter) to match the reference's dense thicket, rather than sitting tidily inside their cells. Boil stays on for the whole garden, per the §6 boil-scope ruling — a garden counts as one key illustration. Recorded in passing: the first garden render, at ~26px per motif, made the boil imperceptible — the user couldn't tell what the boil toggle was even doing — which is what put the ~2px-displacement/~40px-legibility-floor fact into canon.

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
