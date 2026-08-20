# Karakuli — Decisions Log

This file is an append-only record of the choices that shaped Karakuli, each one paired with *why* it was made and what was considered and rejected along the way. `STYLE.md` states the current canon; this file exists so nobody — human or agent — has to reconstruct the reasoning behind it from memory, or worse, quietly re-litigate or undo a decision that was already made on purpose. When canon changes, it gets a new dated entry here. Existing entries don't get edited or deleted, even when a later decision reverses one.

Two sections:

- **Unsettled** — the open backlog: things intentionally left undecided rather than half-decided under time pressure. Check here before treating something as "new."
- **The log** — dated entries, newest first, each stating the decision, the reasoning, and what was rejected.

---

## Unsettled

- Radio and uncheck currently share a "release"-family sameness the user noticed but kept as-is — worth a second look if it starts feeling indistinct in practice.
- Button-tap cue `press` is provisional — not yet user-confirmed by ear the way check/uncheck/radio were.
- A stated **minimum render size for hand-drawn character**. Knot wobble is 2–4% of the canvas, which on an eleven-point mark is a sixth of a point — invisible, so a small drawn circle renders as the compass circle §3 forbids. This is the third instance of a pattern the canon already records twice separately (boil needs ~40px; crayon grain is hero-only) and may want stating once as a principle. Deliberately not adopted on 2026-08-19 — see that entry for the workaround in use and the open question it leaves.
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

### 2026-08-20

#### A formal sibling system, "Article", exists in its own repo — Karakuli is unchanged

A second design language was built today for formal contexts (reading tools, dev tools, docs,
dashboards): squared-off editorial print, display serif over humanist sans, one crimson spent
structurally, hairlines, light theme plus a Catppuccin Mocha dark theme. It lives at
`~/Documents/article` with its own `STYLE.md`, its own `DECISIONS.md`, its own `--art-`
prefix, and its own `article-style` skill. **Nothing in this repo changed** — this entry
exists only so a future session knows the sibling is there and does not try to reconcile them.

Why it is not a register inside Karakuli, and why §8's "not to quietly fork it" clause does
not apply: that clause forbids forking Karakuli for one app's convenience. This is not a
fork, it is an inverse. `poster/POSTER.md` works as a satellite here precisely because it only
changes *volume* and opens by stating everything in STYLE.md "still applies without
exception." The formal system contradicts canon clause by clause — §3 forbids straight lines
and perfect rectangles where the new system is nothing but rectangles; §5 rations colour to
earned moments where the new system spends one colour on every page; §4's six sanctioned
intrusions become zero. A system that inverts canon cannot extend it, and putting two
constitutions under one `CLAUDE.md` authority order would make "read STYLE.md first"
ambiguous. It is also meant to be shared publicly, which this repo — personal, unlicensed,
with `/Users/…` paths hardcoded in two files — is not.

**This does not resolve the "Karakuli Prose" backlog item above, and Prose stays unsettled.**
Prose is a *reading register inside Karakuli*: canon paper, ink and accent stay, the chrome
stays sans, and a doodle motif stands in for the fleuron. It is still hand-drawn. The sibling
system shares none of that. If Prose is ever built, it is built here, under this constitution.

One thing learned there is worth recording as a warning for this repo, because it is a live
defect rather than a preference: `karakuli.css` renders six marks (check, radio scribble, tab
underline, divider, list separator, inline arrow) as inline `data:image/svg+xml` URIs with
the ink hex `%2326241F` baked in, because `currentColor` cannot reach inside a data URI.
Those six marks therefore cannot follow an accent or a theme, and they are the single largest
obstacle to the dark mode sketched in the Unsettled list. Whenever dark mode is designed
here, converting those six to file-plus-`mask-image` is a prerequisite, not a detail.


### 2026-08-19

Three amendments, all found while building a meditation app's garden — a field of 108 cells where completed sittings grow a motif and the rest stay placeholder dots. The field was tightened from six columns to twelve, which halved the cell and forced the motifs up to ~185% of it, and each of these fell out of that.

#### Doodles may fill their closed paths with paper

§3 said fill was set aside "for the shape of a UI surface, never for a doodle." It is now spent two ways: that, and a doodle's closed subpaths filled with **paper** where motifs overlap.

This follows from a decision already in this log. Motifs in a garden were sanctioned to render larger than their cell (2026-08-17), and past roughly 150% they genuinely cross — at which point every drawing is see-through and you read the next plant's stem through a mushroom's cap. That is a tangle, not a garden. An ink drawing stops being see-through by sitting *on* paper rather than by being coloured in, so the fill is always the ground and never a pen: colour still only appears as an edge, and the rule that would actually change the system — filling a doodle with *colour* — stays forbidden.

The part worth keeping is how a shape is told from a stroke: it is read off the drawing rather than annotated beside it. A subpath that closes encloses something and takes the fill; one that does not is a stroke, and filling it lays a slab across the gap between its ends. A leaf, a cap, a berry and a bloom qualify; a stem, a blade and a bristle do not. Derived, so a redrawn motif or a new one added later comes out right without anyone remembering the rule exists.

Rejected: annotating each motif with which of its paths are shapes (works, and rots the first time a motif is redrawn); drawing the field sparser so nothing overlaps (gives back the thicket that the 2026-08-17 decision was made to get); and giving overlapping motifs an opaque bounding box (a rectangle of paper behind a doodle, which is a shape this pen does not draw).

#### Motifs in a field stand on one ground line

New §9 subsection. Every motif in a set is drawn standing on the same baseline, and the field then places every mark — motifs and placeholders alike — against one named ground line rather than centring each in its cell.

The bug it fixes is that "centre it in its cell" means two different things. A placeholder dot has its ink at its canvas centre, so centring the canvas centres the ink; a motif drawn standing on a baseline has its root `(baseline − canvas/2) / canvas` of its rendered size *below* that centre. Centre both and they disagree by exactly that — around a third of the motif's size for something rooted near the foot of its page, and about two thirds of a cell at 185%. A row holding some of each reads as a rendering fault, and a field where you tap a placeholder to grow a motif was quietly growing it somewhere other than where you tapped.

Two things kept it hidden longer than it should have been, and both are in the canon now because they are what makes it hard to see rather than hard to fix. It scales with the motif's zoom, so it creeps in as a field is tightened instead of appearing at once — it was a third of a cell before the zoom and nobody noticed. And a motif's *visual mass* still centres on the cell, since its ink spans its canvas fairly evenly, so the field goes on reading as a lattice while the baselines do not line up.

Where the line sits is a look, not a derivation: every value aligns the two marks, and what it picks is which of them pays for it. Splitting it roughly evenly was chosen over moving only the motifs (largest disturbance to an already-good planted field) and over moving only the placeholders (leaves the tappable mark hard against its cell edge, where a low tap lands on the neighbour).

Two consequences are recorded with it. Anything tappable now draws *over* the motifs, because a motif taller than a cell necessarily reaches past the row above's ground line for any ground line you pick, and with the paper fill above it paints over that row's targets — a placeholder showing over a leaf reads as ground behind the garden, while a target you cannot see reads as nothing. And an entrance pivots on the motif's drawn baseline rather than the bottom of its box, which is a nib's margin lower; pivoting there made every root travel a little on each swing and set back down.

#### The invitation pulse — a third motion layer

`.krk-pulse`: one marker breathing in place, indefinitely, to say where the next action would go. Boil says a thing was drawn by hand and an entrance says it has just arrived; this is the first sanctioned loop on interface rather than illustration.

It is recorded with its constraints rather than as a permission, because it is one step from the engagement mechanic the rest of the system exists to avoid: a thing that moves forever to pull you towards an action. One marker per screen, a swing small enough (scale ~1.08, opacity ~0.7) to notice only once you are already looking, transform and opacity only, the app's single breath count shared with anything else that breathes, and nothing that accumulates, congratulates or keeps score — it looks the same on day one and after a month away.

Rejected: a one-shot twitch after the entrance settles (keeps the no-extra-loops line intact and was the safer option, but a mark that moves once and stops is an entrance, not an invitation — it is gone by the time you are looking at the field); and a louder swing, which turned the marker into the loudest thing on a screen whose whole argument is that it is quiet.

Also settled in passing: the marker goes on the **next empty** slot, not the last filled one. A field that is both record and promise needs no marker on the record — the filled marks are the record. And a marker is never drawn in the colour of the thing it marks, which ruled out the placeholder's own faint ink; the accent was ruled out as already spoken for, and green because green means something grew and nothing has grown there yet.

#### Left unsettled

Whether hand-drawn character has a stated **minimum render size**. Knot-level wobble is 2–4% of the canvas, which on an eleven-point mark is a sixth of a point — invisible, so a small drawn circle renders as a compass circle and breaks §3's own rule. This is the third instance of one pattern the canon already records twice separately (boil needs ~40px; crayon grain is hero-only), and it may want stating once as a principle. Not adopted yet. The app it surfaced in keeps its small ring hand-made by tilting it and running one axis long, so the uneven scale carries the nib and the line thickens through the turn; whether that counts as baked-in wobble or as a runtime effect layered over clean geometry is exactly the question left open.

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
