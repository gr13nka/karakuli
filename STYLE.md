# Karakuli — Style Constitution

Karakuli is a naive, cosy, hand-drawn design language for personal apps and tools. It reads like a page from a good notebook: warm paper, a single confident pen, and colour that shows up only when something is worth celebrating. It borrows its temperament from Korean stationery apps (Woset, Read.), doodle-garden journaling apps, and hand-drawn checklists — not from flat corporate illustration or generic "friendly SaaS" styling. The UI itself stays quiet and clean; the personality lives in the ink.

Three pillars hold the whole system up:

- **Paper.** A warm cream ground, sometimes marked with a dotted grid, that never competes with what's drawn on it. Paper is a surface, not a decoration.
- **Ink.** Every doodle, icon, and illustration is drawn with one soft round-nib pen — medium weight, round caps and joins, a gentle wobble. One hand drew everything in the app, so it should all look like it came from the same hand.
- **Colour moments.** Colour is earned, not default. Most of the UI is ink-on-paper. Colour blooms for rewards, streaks, gardens, onboarding heroes, and celebrations — then recedes.

If a screen looks tempting to decorate, the right move is usually to add less colour and more ink.

---

## 1. Palette

Every colour in Karakuli is warm — there is no neutral gray anywhere in the system, and there is no pure black or pure white.

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

| Token | Hex | Role | Text usage (on `--krk-paper`) |
|---|---|---|---|
| `--krk-pen-blue` | `#2F3AC7` | Cool, dependable accent | Passes WCAG AA at any text size. The one pen bright safe enough to use for small labels or links. |
| `--krk-pen-green` | `#2E7D46` | Growth, gardens, "done" | Large text only (18px+ / bold 14px+). Too close to the AA line at small sizes — treat as illustration/heading colour. |
| `--krk-pen-orange` | `#E07A1F` | Warmth, energy, warning-adjacent | Illustration only. Never set as text colour on paper — it fails AA even at large sizes. |
| `--krk-pen-pink` | `#D9569B` | Delight, celebration | Large text only (18px+ / bold 14px+), same reasoning as green. |

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

---

## 4. Hand-touched UI

The UI chrome itself — layout, cards, buttons, inputs, navigation — starts from clean, simple shapes. Karakuli is not a UI made *entirely* of hand-drawn elements; it's a clean UI with deliberate hand-drawn touches placed where they earn their keep. Overusing the hand-drawn treatment is the fastest way to make the app feel cluttered instead of cosy.

**The six sanctioned hand-drawn touches** — use these, and only these, as UI-level hand-drawn elements:

1. **Wobbly dividers** — a horizontal rule drawn as a slightly imperfect hand-drawn line instead of a straight `<hr>`.
2. **Hand-drawn checkbox / radio marks** — the checkmark or dot inside a checkbox/radio is a doodle stroke, not a system glyph or a perfect check icon.
3. **Scribble underline on the active tab** — a loose, hand-scrawled underline marks the selected tab or nav item, instead of a straight highlight bar.
4. **Hand-drawn arrows** — wherever the UI needs to point somewhere (onboarding callouts, "swipe here" hints), the arrow is drawn with the pen, not a system chevron.
5. **Organic asymmetric border-radius** — hand-touched containers (cards, buttons, modals, chips) use a slightly uneven radius on each corner instead of a uniform one, e.g. `border-radius: 12px 14px 11px 13px / 13px 11px 14px 12px`. This is the single cheapest way to make a rectangular container feel hand-placed.
6. **Wobbly-bordered button variant** — an opt-in button style carrying a 1.5px ink border with pronounced organic corner asymmetry (never rotation, never a filter). Reach for it on a button that wants to feel more hand-placed than the default; ordinary buttons still get away with the plain asymmetric radius in item 5.

Everything else — text alignment, spacing, iconography outside of doodle icons, form field layout, scroll behaviour — stays clean and conventional. A settings screen full of straight lines and honest rectangles, with one wobbly divider and one scribble underline, is doing Karakuli correctly.

**Buttons, inputs, cards — high-level spec** (component-level detail lives in `karakuli.css`, not here):

- **Buttons** use a hand-touched asymmetric radius, a 1.5px solid border in ink or the app accent, and no box-shadow. Primary buttons may fill with the app's accent wash; secondary buttons stay paper-coloured with an ink border.
- **Inputs** are quiet: paper-2 background, 1.5px ink-faint border that shifts to ink on focus, asymmetric radius, and the mandatory visible focus outline.
- **Cards** use paper-2 or a wash background, asymmetric radius, and a 1.5px border — no drop shadow, ever, on a card.

### Hard rules (apply everywhere, no exceptions)

- Never pure `#000000` or pure `#FFFFFF` anywhere in the system.
- No box-shadows, with exactly one exception: a single soft shadow is permitted on modals, to lift them off the page.
- Every interactive element keeps a visible focus state: `outline: 2px solid var(--krk-accent); outline-offset: 2px;`. This is not optional and not replaced by a colour change alone.
- All boil/wiggle animation is disabled under `prefers-reduced-motion: reduce` (see §7).

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

**UI transitions** (unrelated to boil): quiet and fast — 150ms (`--krk-motion-fast`) to 250ms (`--krk-motion-slow`), eased with `ease-out` (`--krk-motion-ease`). Panels, modals, and state changes should feel immediate, not performative.

**Reduced motion:** under `prefers-reduced-motion: reduce`, boil filters are disabled entirely (illustrations render as static, clean line art) and UI transition durations collapse to effectively instant. This is a global guard, not a per-component opt-out — see `tokens.css`.

### Entrances

Entrances are how things arrive on screen for the first time. The doctrine below was picked by eye against a Pinterest reference: an iOS "days of growth" calendar, where a dot-grid of past days pops up as tiny pen-blue doodles, near-simultaneously, with random offsets, boiling continuously once they land. Implementation lives in `web/anim.css` and `web/anim.js`.

1. **Doodles and illustrations sprout.** `.krk-enter-sprout` grows an element up from the ground — transform-origin at the base, `scaleY` 0.25 → 1.05 → 1, ~300ms, a slight overshoot then settle.
2. **A field of doodles enters as one organic burst, not a sweep.** A garden or a scatter of motifs uses `krkStagger(container, { mode: 'scatter' })` (in `web/anim.js`), which staggers each element by an independent random delay within a ~450ms window, applied via the `--krk-enter-delay` custom property. This is deliberately not a sequential left-to-right sweep — the reference pops everything near-simultaneously, and a sweep reads mechanical.
3. **Cards and list rows enter with draw+rise.** The row itself uses `.krk-enter-rise` (`translateY` 10px → 0 + fade, 220ms `ease-out`), staggered in a wave (`krkStagger(..., { mode: 'wave' })`, ~60–70ms per row), while the row's doodle icon self-draws with `.krk-enter-draw` (`stroke-dashoffset` 100 → 0 over 450ms, then a subtle settle). Inlined SVG paths need `pathLength="100"` for the draw to line up correctly.
4. **Entrances mark first appearance only** — screen load, a section revealing, items being added — never hover, focus, or routine state flips. The 150–250ms UI-transition doctrine above is unchanged and covers those cases instead.
5. **Reduced motion** collapses every entrance to its instant final state, under the same global guard as boil and UI transitions.
6. **Boil scope:** a doodle field or garden counts as one key illustration, so boiling all its motifs together is sanctioned — the ban on boiling every UI icon individually still stands. Practically, boil's ~2px displacement is invisible below roughly 40px render size: render boiling doodles large enough to actually show it, or don't promise a boil that won't read.

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
| Whole task or flow finished | `done` | `complete` |
| Affirmative completion / confirmation | `confirm` | `success` — **not** for per-checkbox ticks; that chime was tried on checkbox-on and rejected as unpleasant, hence `pick` → `drag-start` above. |
| Destructive confirm shown | `warn` | `warning` |
| Error state | `fail` | `error` |
| Drag-drop lands | `drop` | `drop` |
| Colour moment / celebration / streak | `moment` | `level-up` |
| Background work in progress | `busy` | `loading` (a loop — stop it promptly when the work ends) |

**Caution:** `'click'` is **not** a valid uisfx cue — playing it does nothing, and that silent failure shipped once as a real bug (buttons went fully silent) before it was caught. Don't reintroduce it. The full uisfx catalog is 78 cues across 13 categories at [uisfx.com](https://uisfx.com) — check there rather than guessing a name.

**Never** play a sound on hover, on scroll, on every keystroke, or on plain navigation. If it isn't a meaningful state change, it stays silent.

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
| Disable all animation under `prefers-reduced-motion` | Ship a boil or wiggle effect with no reduced-motion guard |

---

## 11. Future (unspecified yet)

Two directions are anticipated but not yet specified in this document, and should not be improvised ahead of a real design pass:

- **Dark mode.** The working hypothesis is a deep warm-gray paper with a chalk-coloured ink, keeping the same "paper + ink + colour moments" structure rather than inverting to a cold black theme. Token names and structure should carry over; the actual values need their own pass.
- **Love2D mapping.** Karakuli's web tokens (colour, spacing, type scale) are expected to eventually get a Lua-side equivalent for use in Love2D projects. That mapping — including how the boil filter concept translates to a non-CSS rendering context — is deliberately out of scope here.

Nothing in this section should be treated as settled; it's a placeholder for work that hasn't happened yet.

---

## 12. How this system evolves

Karakuli is meant to grow slowly and on purpose, not accumulate ad hoc exceptions. Canon lives in this file; nothing here should be treated as decided-in-passing.

- **Every change gets a `DECISIONS.md` entry.** Whenever this document changes, `DECISIONS.md` gets a new dated entry recording the decision, the reasoning, and what was rejected and why. The point isn't ceremony — it's so a future session, human or agent, never has to reverse-engineer *why* something is the way it is, and never silently re-litigates or undoes a choice that was already made deliberately.
- **Half-decided stays in the backlog.** An idea that hasn't been settled goes into `DECISIONS.md`'s "Unsettled" section, not into this file as a soft suggestion or a hedge. STYLE.md states what's true now; it doesn't equivocate.
- **The sync map and amendment recipe live in the `karakuli-style` skill**, not here — that's where an agent making a change should look for how STYLE.md, `tokens.css`, and the rest of the kit are meant to stay in lockstep, and for the step-by-step process for proposing an amendment.
- **`tools/check-sync.mjs` is the drift check** — it verifies the kit's files still agree with each other, so canon and implementation don't quietly drift apart. (In progress, being built alongside this section.)
