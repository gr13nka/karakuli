# Karakuli — Poster & Social Rules

This document extends `STYLE.md` — read that first. Everything fixed there (palette values, the pen's construction rules, the two typefaces, no pure black/white, no gradients, no shadows) still applies without exception. What changes here is **volume**. The quiet apps live at conversation level; posters are where Karakuli is allowed to shout across a room.

## When this arm is used

- App store screenshot background frames.
- Release announcement cards (the image that ships with a changelog post).
- README headers.
- Social posts announcing a milestone, a release, a feature.
- Anything printed — a poster, a sticker sheet, a zine cover.

If it's read on a screen at arm's length or smaller for two seconds before the eye moves on, it belongs here, not in `STYLE.md`'s app chrome.

## The pen doesn't change, the volume does

The quiet apps use colour as a rare signal and keep most of a screen ink-on-paper. Posters invert that restraint on purpose: **one huge doodle blown up**, a chunky headline, and high-contrast two-colour layouts — all-ink-on-paper, or all-paper-lines reversed on a full-bleed brick or blue field. Same pen, same wobble, same fonts. It's the same hand, just drawing bigger and picking a bolder page to draw on.

## The three sanctioned layouts

Nothing else. If a poster doesn't fit one of these three, it isn't a Karakuli poster yet.

### 1. Stamp

A giant doodle, centred, with the headline set below it. Generous margins on every side — the doodle should look placed on the page like a wax seal, not stretched to fill it. Target at least ~12% of the canvas as clear margin on the shortest side. Paper background. This is the default, calmest of the three — use it when the message itself is quiet ("coming soon," a small update).

### 2. Full-bleed shout

One loud background colour — brick `#B3402F`, pen-blue `#2F3AC7`, or a butter wash `#F6ECC9` — filling the entire canvas edge to edge. Doodle and type reverse into paper colour on top of it. This is the loudest layout in the system and the one place pen brights or brick are allowed to be a *background*, not an accent. Use it for a genuine "big news" moment — a release, a launch, a milestone.

### 3. Notebook page

Paper background with a dotted grid (the same faint-dot texture as a card in the app), a couple of small doodles scattered loose in the margins rather than one hero doodle centred, and a hand-font annotation line with a hand-drawn arrow pointing at whatever the poster is actually about. This is the most "in-the-notebook" of the three — it reads like a page torn out mid-thought, not a finished announcement. Use it for feature call-outs and anything that wants to feel found rather than published.

## Type rules

- Headline typeface is M PLUS Rounded 1c 700, tracked tight (`letter-spacing: -0.02em`) — step up to weight 800 when 700 reads too light at very large poster scale (most often the Full-bleed shout layout's huge type). 800 is a poster-only exception; `STYLE.md`'s type scale stops at 700 for the apps.
- Default case is sentence case. ALL CAPS is permitted but sparingly — reserve it for the Full-bleed shout layout, and even there prefer one short punchy word or phrase over a full sentence in caps.
- Exactly **one** Shantell Sans accent line per poster, maximum. It's a felt aside, not a second headline — if two hand-font lines are competing for attention, cut one.
- Body copy (captions, fine print) stays M PLUS Rounded 1c 500 — the system's default body weight (`STYLE.md` §2), same as the apps.

## Scaling the pen

A doodle drawn at icon or hero scale for the apps (`STYLE.md` §3) does not survive being blown up to poster size at its original stroke width — it turns into a hairline scratch on a huge canvas. When a doodle is enlarged for a poster, **keep the stroke visually thick**: target a stroke width of roughly **1.5–2% of the poster's shorter side**. On a 1080×1080 canvas that's an 16–22px stroke. Never let a poster doodle read as fragile — if it looks thin at arm's length, thicken it before you ship it, don't apologise for it in a caption.

The wobble and bézier construction rules from `STYLE.md` §3 don't change with scale — a bigger doodle just makes the wobble more visible, which is the point.

## Colour rules

- **Two colours maximum per poster**, plus paper. That's it — pick one pen bright (or brick) as the loud colour and let paper do the rest.
- Pen brights are allowed to be a full-bleed **background** here — the one place in the whole system where that's true. In the apps, a pen bright behind text or as a fill is against the rules; on a Full-bleed shout poster, it's the entire point.
- Washes stay backgrounds, never poster type colour — same rule as `STYLE.md` §1. A wash can shade the Full-bleed field or tint a Notebook page's card, not carry a headline.
- Danger/brick `#B3402F` is available here as a design colour, not only a safety signal — posters are allowed to spend it on tone (urgency, boldness) the way the apps never do.

## Composition rules

- Every layout keeps real margin — even the Full-bleed shout leaves breathing room around type and doodle inside the coloured field; "full-bleed" describes the background, not permission to crowd the edges with text.
- One doodle carries the poster. A poster with three doodles competing for attention has lost the plot — that's what the Notebook layout's *small, scattered* doodles are for, and even those stay clearly secondary to the annotation they support.
- Headline sizing follows the canvas, not a fixed pixel value: it should be the single largest element on the page after the doodle.

## Canvas sizes

The three layouts are size-agnostic — build them at whatever canvas the output demands, then apply the same margin and stroke-scaling rules above.

| Output | Canvas | Notes |
|---|---|---|
| Social post (square) | 1080×1080 | The default working size — build here first, then adapt. |
| Social post (story/portrait) | 1080×1920 | Stamp and Notebook read best; Full-bleed shout needs the headline re-centred vertically, not just stretched. |
| README header | 1280×640 (2:1) | Tight vertical space — Stamp's doodle shrinks before its headline does. |
| App store screenshot frame | Per-store spec, device-dependent | The poster is the *background frame* the screenshot sits inside, not the screenshot itself — leave a clear zone for the device mockup. |
| Print | 300 DPI at final trim size | Vector doodles (SVG) scale losslessly; rasterise late, not early. |

## Do / Don't

| DO | DON'T |
|---|---|
| Pick exactly one loud colour plus paper | Stack two pen brights and a wash on the same poster |
| Blow up stroke width so the pen stays visibly thick at poster scale | Reuse an icon-scale stroke width on a poster-scale doodle |
| Reverse doodle and type into paper colour on a full-bleed field | Put paper-coloured type on a wash — too low-contrast to read at a glance |
| Use ALL CAPS sparingly, on the Full-bleed shout layout only | Set a full sentence in ALL CAPS Shantell Sans |
| Keep margins generous even inside a full-bleed background | Crowd type or doodle against the poster's edge |
| Let one doodle dominate the page | Scatter three doodles of equal size fighting for the eye |
| Use one Shantell Sans accent line, if any | Run a paragraph of body copy in Shantell Sans |
| Bake wobble into the enlarged path itself | Scale a clean vector doodle and expect the wobble to still read |
