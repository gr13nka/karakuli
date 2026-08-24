# Karakuli — Style Constitution

Karakuli is a naive, cosy, hand-drawn design language for personal apps and tools. It reads like a page from a good notebook: warm paper, a single confident pen, and colour that shows up only when something is worth celebrating. It borrows its temperament from Korean stationery apps (Woset, Read.), doodle-garden journaling apps, and hand-drawn checklists — not from flat corporate illustration or generic "friendly SaaS" styling. The UI itself stays quiet and clean; the personality lives in the ink.

Three pillars hold the whole system up:

- **Paper.** A warm cream ground, sometimes marked with a dotted grid, that never competes with what's drawn on it. Paper is a surface, not a decoration.
- **Ink.** Every doodle, icon, and illustration is drawn with one soft round-nib pen — medium weight, round caps and joins, a gentle wobble. One hand drew everything in the app, so it should all look like it came from the same hand.
- **Colour moments.** Colour is earned, not default. Most of the UI is ink-on-paper. Colour blooms for rewards, streaks, gardens, onboarding heroes, and celebrations — then recedes.

If a screen looks tempting to decorate, the right move is usually to add less colour and more ink.

---

## 1. Palette

There is no neutral gray anywhere in the system, and no pure black or pure white. By day every colour is warm; at night the ground turns to a cool indigo and the ink to chalk, which is the one place the system is deliberately not warm — see **Dark mode** below for what that buys and what it costs.

The hexes in the three tables that follow are the **day** values. Every one of them has a night counterpart, and both live in one `light-dark()` declaration per token in `web/tokens.css`.

### Paper & ink

| Token | Hex | Role | Usage constraints |
|---|---|---|---|
| `--krk-paper` | `#F7F3E9` | Primary background, the "page" | Default ground for every screen. |
| `--krk-paper-2` | `#EFE9DA` | Secondary surface, one shade darker | Cards, panels, and dotted-grid backgrounds that sit *on* the paper. |
| `--krk-ink` | `#26241F` | Primary text, primary stroke colour | Body text, headings, default doodle stroke. This is Karakuli's "black." |
| `--krk-ink-soft` | `#6B665C` | Secondary text | Captions, metadata, disabled-but-legible text. |
| `--krk-ink-faint` | `#A9A294` | Tertiary marks | Placeholder text, dotted grids, dividers, hairline decoration. Never for text a user must read. |

### Pen brights — illustrations and large accents only

These are the colours the pen can pick up. They belong to doodles, icons, and large celebratory text — **never** to small body copy, and never to more than one at a time inside ordinary UI chrome.

| Token | Hex (day) | Role | Text usage on day paper | Text usage on night paper |
|---|---|---|---|---|
| `--krk-pen-blue` | `#2F3AC7` | Cool, dependable accent | Passes WCAG AA at any text size (7.43:1). The one pen bright safe enough for small labels or links. | AA at any size (6.21:1). |
| `--krk-pen-green` | `#2E7D46` | Growth, gardens, "done" | Large text only (18px+ / bold 14px+). Sits at 4.58:1 — too close to the line to trust at small sizes. | AA at any size (7.67:1). |
| `--krk-pen-orange` | `#E07A1F` | Warmth, energy, warning-adjacent | Illustration only. 2.72:1 — fails AA even at large sizes. | AA at any size (7.77:1). |
| `--krk-pen-pink` | `#D9569B` | Delight, celebration | Large text only (18px+ / bold 14px+), 3.29:1, same reasoning as green. | AA at any size (7.11:1). |

The night column is wider than the day one — on indigo all four clear AA outright. **This does not license using them as text there.** The restriction above is §5's doctrine, which rations colour so that spending it means something; the contrast numbers were only ever the floor under that decision, never the reason for it. A bright is still illustration and large accents, on either ground.

### Washes — card and widget backgrounds

Washes are pen brights diluted almost to nothing. They give a surface a hint of colour without becoming "colourful."

| Token | Hex | Role |
|---|---|---|
| `--krk-wash-lavender` | `#E6E3F4` | Calm, focus, default wash for reflective content |
| `--krk-wash-sage` | `#E2EAD9` | Growth, progress, gardens |
| `--krk-wash-blush` | `#F6E0E2` | Warmth, celebration-adjacent |
| `--krk-wash-butter` | `#F6ECC9` | Highlight, "look here," selection colour |

Washes are backgrounds, not text colours, and they are never paired with the pen bright they were diluted from directly behind text in that same bright — the pairing reads as low-contrast noise, not intentional colour.

### Semantic

| Token | Value | Role |
|---|---|---|
| `--krk-accent` | `var(--krk-ink)` by default | The app's one signature colour. May be overridden per app with a single pen bright, or a bespoke signature colour that still passes the AA rules above. Never more than one accent per app. |
| `--krk-danger` | `#B3402F` | Errors, destructive actions, irreversible warnings. The one colour allowed to appear without being "earned" — safety communication is not a colour moment. |

### Dark mode

Karakuli ships two grounds. Every colour token above carries both, declared once as a
`light-dark()` pair, so a token name means the same thing under either.

| Token | Day | Night |
|---|---|---|
| `--krk-paper` | `#F7F3E9` | `#1A1B33` |
| `--krk-paper-2` | `#EFE9DA` | `#262845` |
| `--krk-ink` | `#26241F` | `#F2ECE0` |
| `--krk-ink-soft` | `#6B665C` | `#A6AAC4` |
| `--krk-ink-faint` | `#A9A294` | `#8C92B8` |
| `--krk-pen-blue` | `#2F3AC7` | `#8E96EE` |
| `--krk-pen-green` | `#2E7D46` | `#6FBF97` |
| `--krk-pen-orange` | `#E07A1F` | `#E8A24A` |
| `--krk-pen-pink` | `#D9569B` | `#E68CC0` |
| `--krk-wash-lavender` | `#E6E3F4` | `#2C2E52` |
| `--krk-wash-sage` | `#E2EAD9` | `#22333A` |
| `--krk-wash-blush` | `#F6E0E2` | `#3A2A4A` |
| `--krk-wash-butter` | `#F6ECC9` | `#35331F` |
| `--krk-danger` | `#B3402F` | `#E0705C` |

Four rules hold the night palette together, and each exists because the obvious alternative was tried and looked wrong:

**The brights lift; they do not invert.** `#2F3AC7` is already a dark blue. Inverting it gives a pale wash; dimming it gives mud. Both stop reading as *a pen picking up a colour*, which is what a bright is for. Every night bright is the day one raised until it reads as a bright against indigo again.

**The washes dilute toward their own ground.** A wash is a bright diluted almost to nothing — "almost to nothing" means almost to the paper it lies on, so at night it dilutes toward indigo rather than toward cream. Each night wash makes a slightly larger step against its ground than its day counterpart does, which matters here more than elsewhere: this system has no shadows, so the step between two surfaces is the only thing separating them.

**Distance is a hue shift, never chalk at low opacity.** Dropping the ink's opacity to push something back gives a muddy grey that reads as dirt on the page rather than as air in front of the thing. Anything that needs to sit back moves toward the ground's own hue instead.

**The accent is not a knob that changed.** `--krk-accent` still defaults to `var(--krk-ink)`, so it follows the ground by itself. An app that sets its accent to a pen bright gets the lifted value at night for free. An app that sets a raw hex owns its own night and must say what it is. Dark is a ground the system ships, not a fourth per-app knob — §8's budget is unchanged.

Selection is one attribute on `<html>`: absent follows the operating system, `data-theme="light"` and `data-theme="dark"` force one. `web/theme.js` owns it. Its `NO_FLASH_SNIPPET` must be inlined in `<head>` before any stylesheet, because a module import resolves after first paint and the flash has already happened by then.

The **poster arm stays light only**, deliberately rather than by omission: `poster/template.html` is print, and paper is paper.

---

## 2. Typography

Two typefaces, two jobs. Both ship with full Cyrillic coverage, which matters — Karakuli is used in both English and Russian contexts and the handwritten voice has to hold up in both scripts.

- **M PLUS Rounded 1c** (`--krk-font-sans`) — the UI and body typeface. Used for everything a user reads to get information: paragraphs, labels, navigation, form fields, settings. Its rounded terminals were chosen deliberately, after a live side-by-side comparison: next to the hand-drawn pen, a sharper grotesque read like it belonged to a different app, while the rounded strokes echo the doodles even in dense Russian body text. Weights 400 (large quiet passages — long-form reading, lead paragraphs), 500 (default body weight, UI labels), 700 (headings, emphasis) only — no other weights exist in this system. Onest is retired as the primary body face but stays in the fallback chain.
- **Shantell Sans** (`--krk-font-hand`) — the handwritten accent typeface. Used for short, felt moments: empty-state captions, celebration text, a hand-scrawled label next to a doodle, onboarding taglines. It is a voice, not a reading typeface — it never carries a paragraph. If a sentence runs past roughly one line, it's set in the body face instead.

System fallback chain is `'M PLUS Rounded 1c','Onest','Inter',system-ui,sans-serif` for body and `'Shantell Sans','Neucha',cursive` for handwritten accents, so the app degrades gracefully before web fonts load.

### Type scale

| Token | Size | Typical use |
|---|---|---|
| `--krk-text-xs` | 13px | Metadata, timestamps, fine print |
| `--krk-text-sm` | 15px | Secondary body text, captions, form hints |
| `--krk-text-base` | 17px | Default body text, set at weight 500 |
| `--krk-text-lg` | 18px | Lead paragraphs, emphasized body text |
| `--krk-text-xl` | 21px | Small headings, card titles |
| `--krk-text-2xl` | 26px | Section headings |
| `--krk-text-3xl` | 32px | Page titles, hero moments |

### Line-height

- Body text: **1.55**. Paper-and-ink reads slower than a dense SaaS UI on purpose — give it room to breathe.
- Headings: **1.25**. Tight enough to read as a unit, loose enough not to feel cramped when a heading wraps.

---

## 3. The Pen (line rules)

Every stroke in Karakuli — icon, doodle, hero illustration — is built the same way, so that nothing ever looks like it came from a different hand or a different tool.

**Method:**

- Stroke-only. `fill="none"`, `stroke="currentColor"`.
- `stroke-linecap="round"`, `stroke-linejoin="round"` — always round, never miter or square. This is what makes the pen feel soft.
- Shapes are built from cubic Bézier curves, not primitive `<circle>`, `<rect>`, or straight `<line>` elements. **No perfect circles, rectangles, or ruler-straight lines anywhere in the system** — a shape that wants to be a circle is drawn as a wobbly near-circle instead.
- Wobble is baked into the path data: displace the "perfect" geometry by roughly 2–4% of the canvas size before you ever export the SVG. Wobble is a property of the artwork, not a runtime effect layered on top of clean geometry.
- Strokes may overshoot a corner by 1–2 units, the way a real pen does when a hand moves faster than a joint. A slightly imperfect closure on a shape is correct, not a bug.

**Stroke widths by canvas size:**

| Context | viewBox | Stroke width | Token |
|---|---|---|---|
| UI borders (hand-touched elements) | — | 1.5px solid | `--krk-stroke-ui` |
| Doodle icons | `0 0 48 48` | 2.8 | `--krk-stroke-icon` |
| Hero illustrations | `0 0 200 200` | 7 | `--krk-stroke-hero` |

The ratio matters more than the absolute number — a doodle icon and a hero illustration should read as the same pen at different zoom levels, not as two different pens.

**Crayon-grain filter** — an optional SVG filter that adds a faint textured grain to a stroke, evoking a slightly worn nib. Reserved for hero illustrations only (the `0 0 200 200` canvas). Never apply it to doodle icons or UI-scale marks — at small sizes the grain reads as noise, not texture, and it undermines the crispness the icon set depends on for legibility.

**Drawing a container's shape.** Organic asymmetric radius (§4, item 5) gives a box four corners that disagree, but the four sides between them stay ruler-straight — which is the one thing this pen never draws. A surface that has to read as *drawn* rather than merely soft-cornered gets its outline as a closed cubic path instead of a `border-radius`, and is **filled** rather than stroked.


Two facts about that geometry, both of which cost real time to find and neither of which is guessable:

- **A side's bow is a fraction of its own length, not of the box's shorter side.** Measured against the short side, the long edges of a wide button move by well under a point and the shape comes back looking machined. A hand wanders in proportion to how far it is travelling.
- **Opposite sides disagree in sign.** Bowing every side outward inflates the box into a pillow; bowing top and bottom the *same* way bends it like a banana. One side out and its opposite in reads as uneven, which is what was wanted.

**Fill is spent two ways and no others.** The container above is the first: a UI surface filled in the accent. The second is a doodle filled with **paper**, and only where motifs overlap. A field drawn dense enough that its drawings cross (§9) makes each of them see-through — you read the next plant's stem through a mushroom's cap — and the result is a tangle rather than a garden. An ink drawing stops being see-through by sitting *on* paper, not by being coloured in, so the fill is always the ground and never a pen: colour still only ever appears as an edge, and a garden of solid colour would be a different system.

Which paths qualify is read off the drawing rather than recorded beside it: **a subpath that closes is a shape and takes the fill; one that does not is a stroke and does not.** A leaf, a cap, a berry and a bloom come back to where they started and enclose something; a stem, a blade and a bristle do not, and filling one lays a slab across the gap between its ends. Deriving it means a redrawn motif, or a new one added later, comes out right without anyone remembering this rule exists. Note the pen's own `fill="none"` stays the default — a caller overrides it deliberately, and only for these two cases.

Working numbers: sides bow 1.5–2% of their own length, corners land within ±20% of nominal. The wobble is a **fixed table, not a seed** — the opposite of item 5's rule, and for the opposite reason. Organic radius is seeded because many boxes are visible at once and have to differ from each other; a drawn surface is rare enough in an app that it has nothing to differ from, so it gets one character rather than a family of them.

Fill it in the app's accent and leave it unoutlined. An outline in a second colour is a statement only some palettes can make — where the accent *is* the ink, there is nothing for an edge to contrast with, and a shape that is outlined under one theme and not another is two shapes.

---

## 4. Hand-touched UI

The UI chrome itself — layout, cards, buttons, inputs, navigation — starts from clean, simple shapes. Karakuli is not a UI made *entirely* of hand-drawn elements; it's a clean UI with deliberate hand-drawn touches placed where they earn their keep. Overusing the hand-drawn treatment is the fastest way to make the app feel cluttered instead of cosy.

**The six sanctioned hand-drawn touches** — use these, and only these, as UI-level hand-drawn elements:

1. **Wobbly dividers** — a horizontal rule drawn as a slightly imperfect hand-drawn line instead of a straight `<hr>`.
2. **Hand-drawn checkbox / radio marks** — the checkmark or dot inside a checkbox/radio is a doodle stroke, not a system glyph or a perfect check icon.
3. **Scribble underline on the active tab** — a loose, hand-scrawled underline marks the selected tab or nav item, instead of a straight highlight bar.
4. **Hand-drawn arrows** — wherever the UI needs to point somewhere (onboarding callouts, "swipe here" hints), the arrow is drawn with the pen, not a system chevron.
5. **Organic asymmetric border-radius** — hand-touched containers (cards, buttons, modals, chips) use a slightly uneven radius on each corner instead of a uniform one, e.g. `border-radius: 12px 14px 11px 13px / 13px 11px 14px 12px`. This is the single cheapest way to make a rectangular container feel hand-placed.
6. **Wobbly button variant** — an opt-in style with pronounced organic corner asymmetry (never rotation, never a filter). Reach for it on the button that wants to feel more hand-placed than any other; ordinary buttons still get away with the plain asymmetric radius in item 5. It comes in two strengths. The default is a 1.5px ink border on paper. The stronger one **fills with the accent and drops the border**, and draws its shape as a path rather than a radius — see "Drawing a container's shape" in §3. Reserve the filled form for the single most committing action in an app: a second one on screen and neither reads as placed by hand any more. Note where it is actually available: the path-drawn shape needs a drawing surface, so it is native/SVG today. The web layer can reach fill-plus-no-border with `.krk-btn--wobbly.krk-btn--primary` and asymmetric radius, but its four sides stay straight — `clip-path: path()` is the route to closing that gap and has not been taken yet.

Everything else — text alignment, spacing, iconography outside of doodle icons, form field layout, scroll behaviour — stays clean and conventional. A settings screen full of straight lines and honest rectangles, with one wobbly divider and one scribble underline, is doing Karakuli correctly.

**Buttons, inputs, cards — high-level spec** (component-level detail lives in `karakuli.css`, not here):

- **Buttons** use a hand-touched asymmetric radius, a 1.5px solid border in ink or the app accent, and no box-shadow. Primary buttons may fill with the app's accent wash; secondary buttons stay paper-coloured with an ink border.
- **Inputs** are quiet: paper-2 background, 1.5px ink-faint border that shifts to ink on focus, asymmetric radius, and the mandatory visible focus outline.
- **Cards** use paper-2 or a wash background, asymmetric radius, and a 1.5px border — no drop shadow, ever, on a card.

**Sliding screen selector** (`.krk-pillnav--slider`, the bottom-of-screen nav) — Karakuli's screen switcher, a variant of the plain pill nav:

- **One filled marker travels.** A single tile in the app accent slides to the chosen screen; it is the only marker of what's selected. Items never light up in place, and nothing collapses to a dot — every screen keeps its doodle at all times, so the whole set stays readable at rest. The doodle under the marker flips to paper as it arrives.
- **The marker has two tones, and which one depends on the job.** Navigation takes the accent, because where you are in the app is worth the app's one loud colour. The same component used for a **choice inside a screen** — a duration, a size, a difficulty — takes a quiet marker in paper-2 instead: a dark block travelling across a page is the heaviest mark on it, and settings are not what a screen is about. A quiet marker is faint on its own, so it never carries the selection alone — the chosen item's own label darkens under it. (This is not a reversal of the wash-capsule rejection logged for the nav; that capsule was asked to be the *only* signal, and this one is not.)
- **Nothing in it is a pill or an ellipse.** The bar is a barely-rounded rectangle, the marker a rounded rect slightly wider than tall (roughly 1.25:1). This overrides the base `.krk-pillnav` pill shape deliberately.
- **The marker's corners are pushed past the usual asymmetry** — every corner disagrees with the others, and horizontal and vertical radii differ within each corner, so the fill reads as drawn rather than stamped. This is item 5 above at full strength, the same move as the wobbly button.
- **It moves on `--krk-motion-bounce`** over 250ms, settling with a small overshoot.
- **It is the one navigation that makes a sound** — see §7.

Implementation: `web/karakuli.css` plus `web/pillnav.js` (`initKarakuliPillnav()`), which owns only where the marker is; CSS owns how it looks.

### Hard rules (apply everywhere, no exceptions)

- Never pure `#000000` or pure `#FFFFFF` anywhere in the system.
- No box-shadows, with exactly one exception: a single soft shadow is permitted on modals, to lift them off the page.
- Every interactive element keeps a visible focus state: `outline: 2px solid var(--krk-accent); outline-offset: 2px;`. This is not optional and not replaced by a colour change alone.
- **No colour inside a data URI.** A hand-drawn mark carried in CSS is a stencil: draw it in `%23000`, cut it with `mask-image`, and colour it with `background-color: currentColor`. `currentColor` cannot reach inside a data URI, so a mark that carries its own hex can follow neither an accent nor a ground — which is exactly what kept dark mode in the backlog for as long as it was. `tools/check-sync.mjs` fails on any other colour in a data URI. One consequence to design around: a mask clips the whole element it is set on, borders and outlines included, so a mark rides on an element that is nothing but the mark — a pseudo-element, or a bare `<hr>`.

### Spacing & radius

Layout runs on a small scale, not a full grid system: `--krk-space-1` 4px, `--krk-space-2` 8px, `--krk-space-3` 12px, `--krk-space-4` 16px, `--krk-space-5` 24px, `--krk-space-6` 32px, `--krk-space-7` 48px, `--krk-space-8` 64px.

Radius follows the same idea — these are the base values a hand-touched container's organic asymmetric radius (item 5, above) wobbles around; a card doesn't land on exactly `12px` on every corner, it scatters four values near it.

| Token | Value | Role |
|---|---|---|
| `--krk-radius-sm` | 8px | Small chips, tags, tight controls |
| `--krk-radius` | 12px | Default — cards, inputs, most containers |
| `--krk-radius-lg` | 20px | Modals, large panels |
| `--krk-radius-pill` | 999px | Fully rounded — pills, avatar frames |

---

## 5. Colour moments

Colour in Karakuli is a signal that something happened, not a decoration that's always on. Reserve it for:

- **Rewards and streaks** — a completed streak, a milestone hit, a badge earned.
- **Gardens blooming** — any metaphor where progress is represented as growth, and the growth itself is the reward.
- **Onboarding heroes** — the first-run illustration that introduces the app's character and world gets full colour permission; it's the one place first impressions matter more than restraint.
- **Celebration states** — completion screens, "you did it" moments, empty-states that have just been filled for the first time.

Everywhere else — the base screens a user spends 95% of their time in — stays ink-on-paper, with at most the app's single accent colour showing up in UI chrome (an active state, a selected tab's scribble underline, a primary button). If a base screen has more than one colour beyond paper/ink/accent, that's a sign colour is being used as decoration instead of as a signal, and it should be pulled back.

---

## 6. Motion — living doodles

Karakuli's illustrations are alive in a small, specific way: key doodles get a subtle **boil**, the hand-drawn-animation technique where a static-looking line quietly wiggles as if it were redrawn slightly differently on each frame. It signals "this was drawn by hand," not "this is an animated icon."

**Implementation:**

- A 3-frame wiggle cycle at roughly 6–7 fps.
- Each frame is an SVG filter (`url(#krk-boil-1)`, `url(#krk-boil-2)`, `url(#krk-boil-3)`) built from `feTurbulence` + `feDisplacementMap`, displacement scale ≈ 2.
- Frames are switched with a `steps()` CSS animation, not a smooth animation — the point is the discrete redraw-by-redraw feel of traditional boil, not a fluid wobble.
- Reserved for **key illustrations** (heroes, characters, celebration doodles) — not applied wholesale to every icon in the UI. An interface where everything boils constantly is distracting, not alive.

**UI transitions** (unrelated to boil): 150ms (`--krk-motion-fast`) to 250ms (`--krk-motion-slow`). Colour and opacity ease with `ease-out` (`--krk-motion-ease`); anything that **moves or scales** uses the overshoot curve `--krk-motion-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) so it settles with a small bounce rather than stopping dead. Motion is smooth and springy, not performative — the overshoot is a few pixels, not a flourish.

**No reduced-motion guard.** Karakuli deliberately animates for everyone: there is no `prefers-reduced-motion` block in `tokens.css`, no boil opt-out, and no per-component carve-out. Don't reintroduce one without the user's say-so — its removal was a deliberate call (see `DECISIONS.md`), and the accessibility cost was accepted knowingly.

### The invitation pulse

Karakuli's third motion layer, and the smallest. Boil says *this was drawn by hand*; an entrance says *this has just arrived*; a **pulse** says *this is where you would go next*. `.krk-pulse` breathes a single marker in place, indefinitely, for as long as its screen is open.

It is the only sanctioned loop on interface rather than on illustration, and it is deliberately narrow, because a thing that moves forever to draw you towards an action is one step from an engagement mechanic — which the rest of this system is built to avoid. Four constraints keep it honest:

- **One marker per screen.** It marks the single next action. Two things breathing is a screen arguing with itself.
- **A swing you notice only once you are already looking** — scale to about 1.08, opacity to about 0.7, and nothing else. Transform and opacity only, so it stays on a native/compositor driver.
- **One breath for the whole app.** Share the count with whatever else breathes — four seconds in, six out, out longer than in, the pace worth borrowing from a real one. Two loops at nearly the same tempo read as a mistake.
- **It never accumulates, congratulates or keeps score.** It looks the same on day one and after a month away. A pulse that grew more urgent the longer you ignored it would be exactly the thing this rule exists to forbid.

Anything beyond that — a pulsing button, several pulsing rows, a pulse that intensifies — is out of canon. Where a state genuinely needs to be *reported* rather than invited, that is the boil/entrance layer's job or no motion at all.

### Entrances

Entrances are how things arrive on screen for the first time. The doctrine below was picked by eye against a Pinterest reference: an iOS "days of growth" calendar, where a dot-grid of past days pops up as tiny pen-blue doodles, near-simultaneously, with random offsets, boiling continuously once they land. Implementation lives in `web/anim.css` and `web/anim.js`.

1. **Doodles and illustrations sprout.** `.krk-enter-sprout` grows an element up from the ground — transform-origin at the base, `scaleY` 0.25 → 1.05 → 1, ~300ms, a slight overshoot then settle.

   **The base is the motif's drawn baseline, not the bottom of its box.** A doodle keeps a margin below its lowest ink so the round nib has room, so pivoting on the box bottom pivots a nib's width too low: the root itself then travels a little on every swing and sets back down, which reads as the whole drawing sliding rather than growing. Pivot on the line the motif is drawn to stand on (§9), and only the parts above it move.

   A sprout may carry **squash and stretch** instead of scaling on one axis: the doodle shoots past full height while still pinched narrow, swings back under it as it widens, then settles. The rule that makes it read as growth is that `scaleX` and `scaleY` are **never at their extremes together** — a frame where both go fat at once is a bubble inflating, not something growing. Write the curve as frames rather than as one array per channel; the character is entirely in how the channels disagree at a given moment, and parallel arrays hide exactly that.

   **The settle is a damped spring: each swing is about half the one before.** Overshoot a half, then a fifth, then a tenth. Swings that decay slowly read as jelly; swings that stop dead read as a cut. Halving is what a real spring does and it is the whole difference between the two.

   Best generated rather than typed. Drive the frame table from spring parameters — peak, damping, number of swings, rise, area — so the decay is true by construction, and compute `scaleX` as `area / scaleY` so the two channels *cannot* reach their extremes together however the parameters are set. That turns the never-both-fat rule above from something to remember into something the curve is incapable of breaking. Tuning a settle by editing frames, reloading and watching the animation go past once does not work; build the sliders.

   The timing is on the energy dial (§8). Calm keeps the ~300ms sprout and the ~450ms scatter window above. A playful app can take the whole field down to ~200ms a doodle across a ~280ms window, which lands the burst in under half a second — brief enough that it is something you notice rather than something you wait through.
2. **A field of doodles enters as one organic burst, not a sweep.** A garden or a scatter of motifs uses `krkStagger(container, { mode: 'scatter' })` (in `web/anim.js`), which staggers each element by an independent random delay within a ~450ms window, applied via the `--krk-enter-delay` custom property. This is deliberately not a sequential left-to-right sweep — the reference pops everything near-simultaneously, and a sweep reads mechanical.
3. **Cards and list rows enter with draw+rise.** The row itself uses `.krk-enter-rise` (`translateY` 10px → 0 + fade, 220ms on `--krk-motion-bounce`), staggered in a wave (`krkStagger(..., { mode: 'wave' })`, ~60–70ms per row), while the row's doodle icon self-draws with `.krk-enter-draw` (`stroke-dashoffset` 100 → 0 over 450ms, then a subtle settle). Inlined SVG paths need `pathLength="100"` for the draw to line up correctly.
4. **Entrances mark first appearance only** — screen load, a section revealing, items being added — never hover, focus, or routine state flips. The 150–250ms UI-transition doctrine above is unchanged and covers those cases instead.
5. **Boil scope:** a doodle field or garden counts as one key illustration, so boiling all its motifs together is sanctioned — the ban on boiling every UI icon individually still stands. Practically, boil's ~2px displacement is invisible below roughly 40px render size: render boiling doodles large enough to actually show it, or don't promise a boil that won't read.
6. **An entrance may be replayable, by pulling down at the top.** Where the thing that entered is worth looking at rather than using — a garden, a gallery, a field of motifs — a pull from the top of the scroll plays it again. Two constraints. It must not be built on the platform's pull-to-refresh control: that puts a system progress indicator on the paper, and a spinner is a promise that something is loading, which is a lie when the content is already there. And it is only for entrances worth a second look; a list of settings replaying its wave is a tic.

   The platform fact that makes this awkward, recorded so nobody rediscovers it: **Android reports no overscroll.** The scroll offset simply stays at 0 while the finger drags down, so the obvious "offset went negative" test silently does nothing there. What can be read instead is that a drag which *began* at the top and never moved the content can only have been downward, since upward would have scrolled. iOS bounces and reports a negative offset, which fails the same "greater than zero" test — so one rule covers both platforms.

---

## 7. Sound

Karakuli has an official sound layer, built on [uisfx](https://github.com/romainsimon/uisfx) (MIT code, CC0 audio) — a small library of one-shot and looping UI cues bundled into named "packs." Sound follows the same restraint as colour: it marks a meaningful state change, not a decoration that's always on.

- **Pack: zen, always.** Karakuli's default and only sanctioned pack is `zen` — "paper folds, soft brush, warm wood, and quiet chimes." It's the sound equivalent of the ink-and-paper palette. No other pack may be substituted; mixing packs breaks the same coherence a second typeface or a second accent colour would. The sole exception is an `arcade`-style flourish inside an explicit colour-moment celebration — and even there, prefer zen's `level-up` cue first.
- **Volume: 0.35 by default.** Sound sits under the interface, never on top of it. Don't raise this per-app without a specific reason.

**Cue mapping** — reach for these semantic names (`KRK_CUES.*` in `web/sound.js`), not raw uisfx cue names, at call sites:

| Interaction | Semantic name | uisfx cue |
|---|---|---|
| Button tap | `tap` | `press` |
| Press-and-hold (start / end) | `holdStart` / `holdEnd` | `long-press` / `release` |
| Checkbox / toggle turns on | `pick` | `drag-start` |
| Checkbox / toggle turns off | `unpick` | `invalid-drop` |
| Radio / option select | `radio` | `release` — provisional; shares a cue with hold-release. The user noticed the overlap and kept it for now (see `DECISIONS.md` Unsettled). |
| Sliding screen selector travels | `slide` | `drag-start` — zen's soft brush, the nearest thing the pack has to a swipe; shares a cue with `pick`. |
| Whole task or flow finished | `done` | `complete` |
| Affirmative completion / confirmation | `confirm` | `success` — **not** for per-checkbox ticks; that chime was tried on checkbox-on and rejected as unpleasant, hence `pick` → `drag-start` above. |
| Destructive confirm shown | `warn` | `warning` |
| Error state | `fail` | `error` |
| Drag-drop lands | `drop` | `drop` |
| Colour moment / celebration / streak | `moment` | `level-up` |
| Background work in progress | `busy` | `loading` (a loop — stop it promptly when the work ends) |

**Caution:** `'click'` is **not** a valid uisfx cue — playing it does nothing, and that silent failure shipped once as a real bug (buttons went fully silent) before it was caught. Don't reintroduce it. The full uisfx catalog is 78 cues across 13 categories at [uisfx.com](https://uisfx.com) — check there rather than guessing a name.

**Never** play a sound on hover, on scroll, or on every keystroke. If it isn't a meaningful state change, it stays silent. Navigation is silent too, with one sanctioned exception: the sliding screen selector (`.krk-pillnav--slider`) plays `slide` as its marker travels — there the movement *is* the state change, and the cue rides the motion rather than announcing a route change.

**Energy dial applies to sound too** (see §8): a calm app (meditation, exhaustion tracker) plays only `success` / `complete` / `error` / `warning`; a playful app may use the full mapping above.

**Accessibility:** sound is never the only feedback channel — every cue above pairs with a visual state change. Every app must expose a sound on/off control; uisfx's `preferences: {}` option persists the pack/volume/enabled state to `localStorage`, so the toggle just needs to call `setEnabled`.

Use the kit's `web/sound.js` wrapper (`initKarakuliSound()`) rather than calling uisfx directly — it bakes in the zen pack, the 0.35 default volume, the energy-dial filtering, and graceful no-op degradation if uisfx can't load.

---

## 8. Per-app flexibility knobs

Karakuli is one system shared across several apps, and the system stays coherent by keeping the number of things an individual app is allowed to change very small. There are exactly three knobs:

1. **Accent colour.** Default is `--krk-ink`. An app may override `--krk-accent` with exactly one pen bright, or one bespoke signature colour — provided it still passes the same AA rules laid out in §1 for wherever it's used as text. One accent per app, full stop.
2. **Wash choice.** Each app picks the one or two washes (from the four defined in §1) it actually uses for cards and highlights. An app doesn't need all four; picking a consistent one or two gives it a recognizable "temperature" against sibling apps that still share the same paper and ink.
3. **Energy dial.** How much hand-drawn texture the app carries. A calm app (a journal, a reading tracker) uses fewer doodles and more open space — closer to a quiet notebook page. A playful app (a game, a habit tracker with gardens) can use dotted grids and motif sprinkles more liberally, and lean harder into colour moments.

Everything else — palette values, type scale, stroke rules, the six sanctioned hand-drawn touches, the hard rules in §4, the motion spec — is fixed across every app that uses Karakuli. If a screen needs something outside these three knobs to feel right, that's a signal to revisit the system, not to quietly fork it.

---

## 9. Characters & motifs

The **motif library** is the workhorse of Karakuli's illustration system: small recurring doodles (plants, stationery, weather, everyday objects relevant to a given app's domain) that get sprinkled into empty states, backgrounds, and decorative corners. Motifs are anonymous — they don't need a name or a personality, just a consistent line quality.

On top of the motif library, Karakuli has two canonical mascots — settled, not open candidates:

- **Пельмень** — the primary mascot (`pelmen-idle.svg`, `pelmen-cheer.svg`). Reaches for onboarding heroes, celebrations, and colour moments — anywhere the system is greeting the user or sharing a win.
- **Батон**, the loaf cat — the secondary mascot (`baton-idle.svg`, `baton-sleep.svg`). Reaches for rest, sleep, and quiet or empty states — a natural fit wherever the tone needs to stay calm rather than celebratory, wellness contexts especially.

Both are intentionally rationed to a small number of high-value moments, not sprinkled everywhere; a character that appears constantly stops feeling like a character and starts feeling like a logo. New poses for either mascot are drawn under the same pen contract as every other hero illustration (`0 0 200 200` viewBox, stroke-width 7), so a new pose still looks like it came from the same hand as the existing ones. No third character joins the roster without deliberate intent — it's closed by default, not by oversight.

### Motifs in a field

A field is many motifs shown on a grid at once — a garden, a scatter, a calendar of days. Three rules, all learned the expensive way.

**Motifs share a baseline, and the field has a ground line.** Draw every motif in a set standing on the same y on its canvas, so a row of them shares a horizon rather than each floating at its own height. Then place the field against a named **ground line** — a fraction of the cell — and put every mark on it.

The trap this exists to prevent is that "centre it in its cell" means two different things to two marks. A dot, a placeholder or a spark has its ink at its canvas centre, so centring the canvas centres the ink. A motif drawn standing on a baseline does not: its ink sits `(baseline − canvas/2) / canvas` of its rendered size *below* the canvas centre. Centre both and they disagree by exactly that, which for a motif rooted near the foot of its page is around a third of its size. A row holding some of each then looks like a rendering fault, and a field where you tap a placeholder to grow a motif is quietly growing it somewhere other than where you tapped.

Two things make it worse rather than obvious. It scales with the motif's zoom (below), so it arrives by degrees as a field is tightened rather than appearing all at once. And a motif's *visual mass* usually still centres on the cell, since its ink spans the canvas fairly evenly — so the field goes on reading as a lattice while the baselines do not line up, and the eye blames something else.

Derive both placements from the one ground line rather than positioning each by hand, and the two cannot drift apart again at any zoom.

**Motifs may be drawn larger than their cell**, ~120–185% with size jitter, which is what makes a field read as a thicket rather than as a spreadsheet. Past roughly 150% they start crossing each other and want the paper fill from §3. The overhang has to be paid for in padding around the field: a scroll container clips at its own edge whatever its children say about overflow, and the top row comes back with its heads sheared flat — subtle enough to read as a drawing style rather than as a bug. Size that padding from the *entrance* too, not just the resting art, since a sprout stands well over its own root at peak.

**Anything tappable draws over the motifs.** Once motifs exceed their cell and take the paper fill, a motif necessarily paints over the placeholder marks of the row above it — its head reaches past that row's ground line for any ground line you pick, because a motif is taller than a cell. A placeholder showing over a leaf reads as ground behind the garden, which is what it is; a target you cannot see reads as nothing at all. Related: when a mark moves off its cell centre, its *hit area* stays on the lattice, so keep its ink well inside its own cell or a tap aimed at what you can see lands on the neighbour.

**Mark what is next, not what is done.** A field that is both a record and a promise needs no marker on the record — the filled marks are the record. The single thing worth marking is the empty slot the next action would fill, because that is the only part of the field about carrying on. And a marker is never drawn in the colour of the thing it marks: a ring around a placeholder in the placeholder's own faint ink is not a ring, it is a bigger placeholder.

---

## 10. Do / Don't

| DO | DON'T |
|---|---|
| Bake wobble into the path data itself | Use a CSS filter to fake wobble on an otherwise static, geometrically perfect icon |
| Use a warm near-black (`--krk-ink`) for text and default strokes | Use pure `#000000` anywhere |
| Give each app exactly one accent colour | Let an app's UI chrome use more than one pen bright at once ("rainbow UI") |
| Draw arrows, checkmarks, and dividers with the pen | Reach for emoji as icons |
| Keep cards flat with a 1.5px border | Put a box-shadow on a card |
| Use flat washes and solid pen brights | Use a gradient anywhere in the system |
| Reserve full colour for earned moments | Default a base screen to a colourful background "to make it pop" |
| Use asymmetric organic radii on hand-touched containers | Use a uniform `border-radius` on every corner of a hand-touched element |
| Set Shantell Sans for short, felt lines | Set a paragraph of body text in Shantell Sans |
| Give every interactive element a visible focus outline | Rely on a colour or shadow change alone to signal focus |
| Let boil animate a handful of key illustrations | Apply boil to every icon in the UI simultaneously |
| Use `--krk-motion-bounce` for anything that moves or scales | Reintroduce a `prefers-reduced-motion` guard on your own initiative |

---

## 11. Future (unspecified yet)

One direction is anticipated but not yet specified in this document, and should not be improvised ahead of a real design pass:

- **Love2D mapping.** Karakuli's web tokens (colour, spacing, type scale) are expected to eventually get a Lua-side equivalent for use in Love2D projects. That mapping — including how the boil filter concept translates to a non-CSS rendering context — is deliberately out of scope here.

Nothing in this section should be treated as settled; it's a placeholder for work that hasn't happened yet.

---

## 12. How this system evolves

Karakuli is meant to grow slowly and on purpose, not accumulate ad hoc exceptions. Canon lives in this file; nothing here should be treated as decided-in-passing.

- **Every change gets a `DECISIONS.md` entry.** Whenever this document changes, `DECISIONS.md` gets a new dated entry recording the decision, the reasoning, and what was rejected and why. The point isn't ceremony — it's so a future session, human or agent, never has to reverse-engineer *why* something is the way it is, and never silently re-litigates or undoes a choice that was already made deliberately.
- **Half-decided stays in the backlog.** An idea that hasn't been settled goes into `DECISIONS.md`'s "Unsettled" section, not into this file as a soft suggestion or a hedge. STYLE.md states what's true now; it doesn't equivocate.
- **The sync map and amendment recipe live in the `karakuli-style` skill**, not here — that's where an agent making a change should look for how STYLE.md, `tokens.css`, and the rest of the kit are meant to stay in lockstep, and for the step-by-step process for proposing an amendment.
- **`tools/check-sync.mjs` is the drift check** — it verifies the kit's files still agree with each other, so canon and implementation don't quietly drift apart. (In progress, being built alongside this section.)
