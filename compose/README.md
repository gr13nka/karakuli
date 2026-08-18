# Karakuli — Compose mapping

`Karakuli.kt` is a reference port of the Karakuli naive/cosy hand-drawn design system
(see `../STYLE.md` for the full doc) to Jetpack Compose. It's meant to be copied into a
consuming app and adapted — not depended on as a library module. App-specific spots
(Google Fonts certificates, resource IDs) are marked with comments in the file.

## Gradle dependencies

```kotlin
implementation("androidx.compose.material3:material3:<version>")
implementation("androidx.compose.ui:ui-text-google-fonts:<version>")
```

`ui-text-google-fonts` needs a certificates resource for `GoogleFont.Provider`
(`R.array.com_google_android_gms_fonts_certs`). Generate it with Android Studio's
Fonts panel (right-click `res` → New → Font Resource), or hand-write it per the
[downloadable fonts guide](https://developer.android.com/develop/ui/compose/text/fonts#downloadable-fonts).
Both M PLUS Rounded 1c and Shantell Sans are on Google Fonts and support Cyrillic.

## Doodle SVGs

`../doodles/` holds ~20 stroke-only motifs (flowers, sprout, tree, sun, moon, star,
spark, heart, pot, cup, bowl, spoon, candle, zzz, leaf, squiggle, arrow, check, cloud).
Import each via Android Studio's **File → New → Vector Asset → Local file (SVG)** —
this preserves `stroke`/`stroke-width` as vector path attributes instead of flattening
to a raster. Give the resulting `ImageVector` a `tint = KarakuliColors.Ink` (or the
app's accent) at call sites rather than baking colour into the drawable, so the same
asset works across washes. Never substitute an emoji for a doodle.

## No-shadow rule

Karakuli has no elevation. Every `Card`/`Surface` must set
`elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)` explicitly — the
Material3 default is non-zero. Separation between surfaces comes from wash colour and
a 1.5dp ink hairline border (`BorderStroke(1.5.dp, KarakuliColors.Ink)`), never a
shadow. The one exception is dialogs, which may carry a single soft shadow.

Hand-drawn touches are reserved for exactly five things: the wobbly divider,
hand-drawn check/radio marks, a scribble underline on the active tab, hand-drawn
arrows, and organic corner asymmetry (`organicShape`). Don't invent a sixth —
wobbly buttons or wobbly card borders as a default dilute the ones that are supposed
to read as deliberate.

## Boil effect (Android)

Web does the "living doodle" boil with a CSS filter-swap (`boil.js`/`boil.css`).
Android has no equivalent cheap filter, so mimic the same 3-frame, ~6fps wobble loop
by pre-baking 2–3 slightly-different wobbled variants of a vector drawable (same
technique used to draw any Karakuli motif: cubic béziers displaced 2–4% from
perfect) and swapping the displayed `ImageVector` on a fixed ~150ms timer. Do not
drive the boil with a runtime filter or transform — it should look like the pen
re-drew the line, not like the image is being warped.

Karakuli has no reduce-motion guard, on web or here: the boil keeps running and
`KarakuliCheckMark` keeps drawing in regardless of `ANIMATOR_DURATION_SCALE`. That
removal was deliberate (see `DECISIONS.md`) — don't gate these on the system setting
without the user's say-so.

Motion that moves or scales uses the overshoot curve, Compose's equivalent of
`--krk-motion-bounce`: `tween(durationMillis = 250, easing = CubicBezierEasing(0.34f,
1.56f, 0.64f, 1f))`. Colour and opacity keep a plain `FastOutSlowInEasing`.

## Sound (Android)

Web plays sound through uisfx directly; Android has no WebAudio, so use uisfx's
portable audio files instead. Copy `sounds/zen/*.mp3` from the `uisfx` npm package
into `res/raw/`, then play them via `SoundPool`, keyed by the same semantic cue names
used on web (`click`, `press`, `release`, `success`, `complete`, `warning`, `error`,
`drop`, `level-up`, `loading`) so the mapping in `../STYLE.md` §7 stays a single source
of truth across platforms. Same doctrine as web: `zen` pack only, volume 0.35, play
only on meaningful state changes (never on scroll/hover-equivalents or every tap), and
expose a sound on/off toggle in settings.

## Per-app knobs

Exactly three things vary per app; nothing else:

1. **Accent colour** — `KarakuliTheme(accent = …)`. Defaults to ink; one pen bright
   or a signature colour is allowed for a louder experiment.
2. **Wash choice** — pick 1–2 of `WashLavender` / `WashSage` / `WashBlush` /
   `WashButter` as the app's default card backgrounds (wire into `surfaceVariant`).
3. **Energy dial** — calm (sparse doodles, generous spacing) or playful (dotted-grid
   backgrounds, motif sprinkles). Not encoded in this file; it's a layout-level choice
   each screen makes using the tokens above.

A request that wants to change something outside these three (a second font, a new
shadow style, a different corner-radius language) is a departure from Karakuli, not a
variant of it — flag it rather than absorbing it silently.
