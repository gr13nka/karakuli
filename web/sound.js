/*
 * Karakuli — sound layer
 * -----------------------------------------------------------------------
 * Wraps uisfx (npm `uisfx`, MIT code / CC0 audio) with Karakuli's sound
 * doctrine: the "zen" pack, always ("paper folds, soft brush, warm wood,
 * and quiet chimes"), sitting under the interface at a default volume of
 * 0.35, filtered through the app's energy dial (see STYLE.md §7 / §Sound).
 *
 * Install: npm install uisfx
 * In a bundler-less page, load it from a CDN instead:
 *   const { createUISFX } = await import('https://esm.sh/uisfx');
 *
 * Usage:
 *   import { initKarakuliSound, KRK_CUES } from './sound.js';
 *   const krk = initKarakuliSound({ energy: 'playful' });
 *   button.addEventListener('click', () => krk.play(KRK_CUES.tap));
 */

// Semantic cue mapping — see STYLE.md §Sound for the doctrine behind each
// entry. Call sites should reach for these names, not raw uisfx cue names,
// so the mapping stays the single place doctrine changes land.
export const KRK_CUES = {
  tap: 'click',
  holdStart: 'press',
  holdEnd: 'release',
  confirm: 'success',
  done: 'complete',
  warn: 'warning',
  fail: 'error',
  drop: 'drop',
  moment: 'level-up',
  busy: 'loading',
};

// Calm apps (meditation, exhaustion tracker) only ever get state-of-the-world
// cues; playful apps get the full mapping. Anything not listed here for a
// calm app is silently swallowed rather than played.
const CALM_CUES = new Set(['success', 'complete', 'error', 'warning']);

export function initKarakuliSound({ energy = 'calm', volume = 0.35 } = {}) {
  let ui = null;
  let unlocked = false;
  const stoppedHandle = { stop: () => {} };

  try {
    import('uisfx')
      .then(({ createUISFX }) => {
        ui = createUISFX({ pack: 'zen', preferences: {} });
        ui.setVolume(volume);
      })
      .catch(() => {
        // Offline, no npm resolution, or uisfx missing — sound degrades to
        // silent no-ops below rather than breaking the app.
      });
  } catch {
    // Environments without dynamic import() (very old bundlers) — same
    // graceful degradation as a failed import.
  }

  if (typeof document !== 'undefined') {
    document.addEventListener(
      'pointerdown',
      () => {
        if (unlocked || !ui) return;
        unlocked = true;
        ui.unlock().catch(() => {});
      },
      { once: true }
    );
  }

  function allowed(cue) {
    return energy === 'calm' ? CALM_CUES.has(cue) : true;
  }

  return {
    play(cue) {
      if (!ui || !cue || !allowed(cue)) return;
      ui.play(cue);
    },
    loop(cue) {
      if (!ui || !cue || !allowed(cue)) return stoppedHandle;
      return ui.play(cue);
    },
    setEnabled(on) {
      ui?.setEnabled(on);
    },
    setVolume(v) {
      ui?.setVolume(v);
    },
    get ui() {
      return ui;
    },
  };
}
