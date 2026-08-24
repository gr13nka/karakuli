package com.karakuli.theme

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.random.Random

/**
 * Karakuli — naive/cosy hand-drawn design system, ported to Compose as a reference mapping.
 *
 * This file is meant to be copied into a consuming app and adapted, not depended on as a
 * library module — spots that need app-specific wiring (Google Fonts certificates, resource
 * IDs, package name) are marked with comments. See README.md in this directory for the
 * Gradle dependencies this file assumes, the doodle-SVG import path, and the per-app knobs
 * (accent colour, wash choice, energy dial) apps are expected to set on top of this base.
 */

// ---------------------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------------------

/**
 * One palette, held by value rather than by name.
 *
 * This used to be an `object` of constants, which made every `KarakuliColors.Ink` at a call
 * site a compile-time reference to the *light* ink. A second object would not have fixed
 * that — it would only have made the leak two-valued. Reading colours out of
 * [LocalKarakuliColors] instead is what lets one composable render correctly under either
 * ground, which is the whole point of having two.
 */
@Immutable
data class KarakuliColorSet(
    val paper: Color,
    val paper2: Color,
    val ink: Color,
    val inkSoft: Color,
    val inkFaint: Color,

    // Pen brights — reserved for illustration and large accents (e.g. an icon, a big CTA).
    // Never use these for body text or small UI chrome; they're too saturated at small sizes.
    val penBlue: Color,
    val penGreen: Color,
    val penOrange: Color,
    val penPink: Color,

    // Washes — flat, low-saturation tints that stand in for elevation. Pick one per app as
    // the default tinted-surface colour (see README "per-app knobs: wash choice").
    val washLavender: Color,
    val washSage: Color,
    val washBlush: Color,
    val washButter: Color,

    val danger: Color,
) {
    /** Accent defaults to ink in both grounds; each app overrides via KarakuliTheme(accent = …). */
    val accentDefault: Color get() = ink
}

val karakuliLightColors = KarakuliColorSet(
    paper = Color(0xFFF7F3E9),
    paper2 = Color(0xFFEFE9DA),
    ink = Color(0xFF26241F),
    inkSoft = Color(0xFF6B665C),
    inkFaint = Color(0xFFA9A294),
    penBlue = Color(0xFF2F3AC7),
    penGreen = Color(0xFF2E7D46),
    penOrange = Color(0xFFE07A1F),
    penPink = Color(0xFFD9569B),
    washLavender = Color(0xFFE6E3F4),
    washSage = Color(0xFFE2EAD9),
    washBlush = Color(0xFFF6E0E2),
    washButter = Color(0xFFF6ECC9),
    danger = Color(0xFFB3402F),
)

/**
 * Night. The brights are lifted rather than inverted — 0xFF2F3AC7 is already a dark blue,
 * and on a dark ground a dark bright is not a bright. Mirrors web/tokens.css exactly; if one
 * of these ever disagrees with the other, the CSS is right and this is the copy that drifted.
 */
val karakuliDarkColors = KarakuliColorSet(
    paper = Color(0xFF1A1B33),
    paper2 = Color(0xFF262845),
    ink = Color(0xFFF2ECE0),
    inkSoft = Color(0xFFA6AAC4),
    inkFaint = Color(0xFF8C92B8),
    penBlue = Color(0xFF8E96EE),
    penGreen = Color(0xFF6FBF97),
    penOrange = Color(0xFFE8A24A),
    penPink = Color(0xFFE68CC0),
    washLavender = Color(0xFF2C2E52),
    washSage = Color(0xFF22333A),
    washBlush = Color(0xFF3A2A4A),
    washButter = Color(0xFF35331F),
    danger = Color(0xFFE0705C),
)

/**
 * The live palette. Provided by [KarakuliTheme]; read it as `LocalKarakuliColors.current.ink`
 * anywhere a colour is needed outside a Material slot.
 */
val LocalKarakuliColors = staticCompositionLocalOf { karakuliLightColors }

// ---------------------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------------------

// Gradle: implementation("androidx.compose.ui:ui-text-google-fonts:<version>")
// The `certificates` resource below (R.array.com_google_android_gms_fonts_certs) is
// generated per-app by Android Studio's "Google Fonts" font picker, or hand-written
// following https://developer.android.com/develop/ui/compose/text/fonts#downloadable-fonts.
// `R` here refers to the consuming app's generated resources — swap in the real import.
private val karakuliFontProvider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs, // TODO: app-specific resource
)

private val mPlusRounded1cGoogleFont = GoogleFont("M PLUS Rounded 1c")
private val shantellSansGoogleFont = GoogleFont("Shantell Sans")

/** Body and UI text — M PLUS Rounded 1c. Supports Cyrillic on Google Fonts. */
val MPlusRounded1cFamily = FontFamily(
    Font(mPlusRounded1cGoogleFont, karakuliFontProvider, FontWeight.Normal),
    Font(mPlusRounded1cGoogleFont, karakuliFontProvider, FontWeight.Medium),
    Font(mPlusRounded1cGoogleFont, karakuliFontProvider, FontWeight.Bold),
)

/** Handwritten accents only — pull quotes, callouts, the scribble tab label. Not for body text. */
val ShantellSansFamily = FontFamily(
    Font(shantellSansGoogleFont, karakuliFontProvider, FontWeight.Normal),
    Font(shantellSansGoogleFont, karakuliFontProvider, FontWeight.Medium),
    Font(shantellSansGoogleFont, karakuliFontProvider, FontWeight.Bold),
)

private fun karakuliTextStyle(
    fontSize: TextUnit,
    lineHeightMultiplier: Float,
    fontWeight: FontWeight,
    fontFamily: FontFamily = MPlusRounded1cFamily,
): TextStyle = TextStyle(
    fontFamily = fontFamily,
    fontWeight = fontWeight,
    fontSize = fontSize,
    lineHeight = fontSize * lineHeightMultiplier,
)

// Heading roles (display* / headline* / title*) sit on the base scale: 13 / 14 / 16 / 18 /
// 21 / 26 / 32 sp at 1.25 line-height. Body (bodyLarge/bodyMedium) and label/meta
// (labelLarge/Medium/Small, bodySmall) were bumped off that scale to 17sp and 15sp — both
// at FontWeight.Medium — because M PLUS Rounded 1c reads lighter/thinner than Onest did at
// body sizes, especially in Cyrillic; the size and weight bump keeps it legible. Line-height
// ratios are unchanged from the original scale: 1.55 for body roles, 1.3 for label roles,
// 1.25 for headings.
// The scale tops out at 32sp: display* and headlineLarge reuse that top step rather than
// inventing a size the system doesn't have — override per-app if a screen genuinely needs
// something bigger.
val KarakuliTypography = Typography(
    displayLarge = karakuliTextStyle(32.sp, 1.25f, FontWeight.Bold),
    displayMedium = karakuliTextStyle(32.sp, 1.25f, FontWeight.Bold),
    displaySmall = karakuliTextStyle(26.sp, 1.25f, FontWeight.Bold),
    headlineLarge = karakuliTextStyle(32.sp, 1.25f, FontWeight.Bold),
    headlineMedium = karakuliTextStyle(32.sp, 1.25f, FontWeight.Bold),
    headlineSmall = karakuliTextStyle(21.sp, 1.25f, FontWeight.Bold),
    titleLarge = karakuliTextStyle(26.sp, 1.25f, FontWeight.Bold),
    titleMedium = karakuliTextStyle(18.sp, 1.25f, FontWeight.Bold),
    titleSmall = karakuliTextStyle(16.sp, 1.25f, FontWeight.Bold),
    bodyLarge = karakuliTextStyle(17.sp, 1.55f, FontWeight.Medium),
    bodyMedium = karakuliTextStyle(17.sp, 1.55f, FontWeight.Medium),
    bodySmall = karakuliTextStyle(15.sp, 1.55f, FontWeight.Medium),
    labelLarge = karakuliTextStyle(15.sp, 1.3f, FontWeight.Medium),
    labelMedium = karakuliTextStyle(15.sp, 1.3f, FontWeight.Medium),
    labelSmall = karakuliTextStyle(15.sp, 1.3f, FontWeight.Medium),
)

/** Handwritten accent style — pull quotes, callouts, the scribble tab label. Not for body/UI text. */
val HandTextStyle = TextStyle(
    fontFamily = ShantellSansFamily,
    fontWeight = FontWeight.Normal,
    fontSize = 18.sp,
    lineHeight = 18.sp * 1.4f,
)

// ---------------------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------------------

// Corners: 8 / 12 / 20 dp, pill for nav. Material3's Shapes needs five slots; extraSmall
// reuses `small` (the scale has no step below 8dp) and extraLarge is the pill used for
// bottom nav / large filter chips / FABs.
val KarakuliShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(20.dp),
    extraLarge = RoundedCornerShape(percent = 50),
)

/**
 * A rounded-corner shape whose four corners are deliberately unequal — the style's
 * "organic asymmetry" signature (e.g. 12/14/11/13dp instead of a uniform 12dp). Corners are
 * derived deterministically from [seed], so a given (base, seed) pair always produces the
 * same shape: stable across recomposition, no per-frame jitter. Pass a stable seed per
 * component instance (e.g. a list item's index, or a hash of its id) — reusing the same
 * seed everywhere would make every corner set identical, defeating the point.
 */
fun organicShape(base: Dp, seed: Int): RoundedCornerShape {
    val random = Random(seed)
    fun corner(): Dp = base * (0.8f + random.nextFloat() * 0.4f) // ±20% of base
    return RoundedCornerShape(
        topStart = corner(),
        topEnd = corner(),
        bottomEnd = corner(),
        bottomStart = corner(),
    )
}

// ---------------------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------------------

private val karakuliLightColorScheme = lightColorScheme(
    background = karakuliLightColors.paper,
    onBackground = karakuliLightColors.ink,
    surface = karakuliLightColors.paper2,
    onSurface = karakuliLightColors.ink,
    primary = karakuliLightColors.accentDefault, // overridden per-call by KarakuliTheme(accent = …)
    onPrimary = karakuliLightColors.paper,
    // surfaceVariant is where a per-app wash belongs — pick one of washLavender / washSage /
    // washBlush / washButter as the app's default tinted surface (README "per-app knobs").
    // surfaceVariant = karakuliLightColors.washSage,
    error = karakuliLightColors.danger,
    onError = karakuliLightColors.paper,
    outline = karakuliLightColors.ink, // 1.5dp ink hairlines are the separation mechanism, not elevation
)

// Slot for slot the same mapping, read off the night set. Nothing structural differs:
// elevation is 0.dp under either ground, because separation here is fill and hairline.
private val karakuliDarkColorScheme = darkColorScheme(
    background = karakuliDarkColors.paper,
    onBackground = karakuliDarkColors.ink,
    surface = karakuliDarkColors.paper2,
    onSurface = karakuliDarkColors.ink,
    primary = karakuliDarkColors.accentDefault,
    onPrimary = karakuliDarkColors.paper,
    error = karakuliDarkColors.danger,
    onError = karakuliDarkColors.paper,
    outline = karakuliDarkColors.ink,
)

/**
 * Karakuli theme root. Picks a ground, publishes the matching [KarakuliColorSet] on
 * [LocalKarakuliColors], and wires the matching [androidx.compose.material3.ColorScheme],
 * [KarakuliTypography] and [KarakuliShapes] into [MaterialTheme].
 *
 * The colour study the previous version of this comment said was missing has been done —
 * the washes are diluted toward whichever ground they sit on rather than dimmed, and the
 * brights are lifted rather than inverted. STYLE.md §1 holds the values and the reasoning.
 *
 * @param darkTheme follows the system by default; pass a value to force one ground.
 * @param accent overrides the ground's own [KarakuliColorSet.accentDefault] as `primary` —
 *   see README "per-app knobs: accent colour". Null rather than a constant default on
 *   purpose: the default accent IS the ink, so it has to be resolved after the ground is
 *   known, or a night app is handed a near-black primary on a near-black surface.
 */
@Composable
fun KarakuliTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    accent: Color? = null,
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) karakuliDarkColors else karakuliLightColors
    val scheme = if (darkTheme) karakuliDarkColorScheme else karakuliLightColorScheme
    CompositionLocalProvider(LocalKarakuliColors provides colors) {
        MaterialTheme(
            colorScheme = scheme.copy(primary = accent ?: colors.accentDefault),
            typography = KarakuliTypography,
            shapes = KarakuliShapes,
            content = content,
        )
    }
}

// ---------------------------------------------------------------------------------------
// Hand-touched elements
// ---------------------------------------------------------------------------------------

/**
 * A hand-drawn-looking horizontal divider: one long path that wavers gently instead of
 * running dead straight. The wobble is a fixed set of control-point offsets computed once
 * from a constant seed — baked in, not re-randomized per frame or per recomposition — so the
 * line looks hand-drawn but never "jitters" while on screen.
 */
@Composable
fun KarakuliWobblyDivider(
    modifier: Modifier = Modifier,
    color: Color = LocalKarakuliColors.current.ink.copy(alpha = 0.5f),
    strokeWidth: Dp = 1.5.dp,
) {
    val strokeWidthPx = with(LocalDensity.current) { strokeWidth.toPx() }
    Canvas(modifier = modifier.fillMaxWidth().height(6.dp)) {
        val segments = 8
        val segmentWidth = size.width / segments
        val midY = size.height / 2f
        // 2-4% displacement from a perfectly straight line, per the design contract —
        // measured against the divider's total length, clamped so it can't clip the canvas.
        val amplitude = (size.width * 0.03f).coerceAtMost(size.height / 2f)
        val offsets = List(segments + 1) { i ->
            // Seeded once per composition of this call, not per animation frame.
            val r = Random(42 + i)
            (r.nextFloat() * 2f - 1f) * amplitude
        }

        val path = Path().apply {
            moveTo(0f, midY + offsets[0])
            for (i in 0 until segments) {
                val startX = i * segmentWidth
                val endX = startX + segmentWidth
                val startY = midY + offsets[i]
                val endY = midY + offsets[i + 1]
                // Control points sit at the thirds of the segment, producing one gentle
                // cubic curve per segment rather than a jagged zig-zag between offsets.
                cubicTo(
                    startX + segmentWidth * 0.33f, startY,
                    startX + segmentWidth * 0.66f, endY,
                    endX, endY,
                )
            }
        }
        drawPath(
            path = path,
            color = color,
            style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round),
        )
    }
}

/**
 * A hand-drawn check mark that draws itself in when [checked] flips true.
 *
 * Approach: the tick is one [Path]; a [PathMeasure] trims it down to the animated draw
 * [progress] fraction each frame via [PathMeasure.getSegment], so the stroke appears to be
 * drawn stroke-by-stroke rather than faded or scaled in. This is the standard Compose
 * "draw progress" trick for hand-drawn / signature-style reveal animations.
 */
@Composable
fun KarakuliCheckMark(
    checked: Boolean,
    modifier: Modifier = Modifier,
    color: Color = LocalKarakuliColors.current.ink,
    size: Dp = 20.dp,
) {
    // No reduce-motion gate here on purpose — Karakuli animates for everyone
    // (see DECISIONS.md); don't branch this on ANIMATOR_DURATION_SCALE.
    val progress by animateFloatAsState(
        targetValue = if (checked) 1f else 0f,
        animationSpec = tween(durationMillis = 200), // quiet motion: 150-250ms per the contract
        label = "karakuli-checkmark-progress",
    )
    val strokeWidthPx = with(LocalDensity.current) { 1.5.dp.toPx() }

    Canvas(modifier = modifier.size(size)) {
        val w = this.size.width
        val h = this.size.height
        val tick = Path().apply {
            moveTo(w * 0.20f, h * 0.55f)
            lineTo(w * 0.42f, h * 0.75f)
            lineTo(w * 0.82f, h * 0.28f)
        }
        val measure = PathMeasure().apply { setPath(tick, forceClosed = false) }
        val trimmed = Path()
        measure.getSegment(0f, measure.length * progress, trimmed, startWithMoveTo = true)

        drawPath(
            path = trimmed,
            color = color,
            style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round, join = StrokeJoin.Round),
        )
    }
}

// ---------------------------------------------------------------------------------------
// Previews
// ---------------------------------------------------------------------------------------

@Preview(name = "button · day", showBackground = true, backgroundColor = 0xFFF7F3E9)
@Preview(name = "button · night", showBackground = true, backgroundColor = 0xFF1A1B33)
@Composable
private fun KarakuliButtonPreview() {
    // Both previews run the same composable; only the ground differs, which is the
    // property worth previewing. Nothing below names a colour that isn't the live set.
    KarakuliTheme {
        val colors = LocalKarakuliColors.current
        Surface(color = colors.paper) {
            Button(
                onClick = {},
                shape = organicShape(base = 12.dp, seed = 1),
                colors = ButtonDefaults.buttonColors(containerColor = colors.accentDefault),
            ) {
                Text("Сохранить", color = colors.paper, style = KarakuliTypography.labelLarge)
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFF7F3E9)
@Composable
private fun KarakuliCardPreview() {
    KarakuliTheme {
        Card(
            modifier = Modifier.padding(16.dp),
            shape = organicShape(base = 16.dp, seed = 7),
            colors = CardDefaults.cardColors(containerColor = LocalKarakuliColors.current.washSage),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp), // never any shadow
            border = BorderStroke(1.5.dp, LocalKarakuliColors.current.ink),
        ) {
            Column(Modifier.padding(16.dp)) {
                Text("Наброски", style = KarakuliTypography.titleLarge)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Тело карточки — с переносами строк, спокойным ритмом и почти без сюрпризов.",
                    style = KarakuliTypography.bodyMedium,
                )
            }
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFF7F3E9)
@Composable
private fun KarakuliDividerAndCheckPreview() {
    KarakuliTheme {
        Column(Modifier.padding(16.dp).background(LocalKarakuliColors.current.paper)) {
            Text("Above the divider", style = KarakuliTypography.bodyMedium)
            KarakuliWobblyDivider(modifier = Modifier.padding(vertical = 12.dp))
            Text("Below the divider", style = KarakuliTypography.bodyMedium)
            Spacer(Modifier.height(16.dp))
            KarakuliCheckMark(checked = true)
        }
    }
}
