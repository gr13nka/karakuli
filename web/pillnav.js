/* Karakuli — sliding pill navigation
 *
 * Drives .krk-pillnav--slider: one accent tile travels to the chosen
 * screen. The tile is a real element rather than a styled item so it can
 * move continuously between them; CSS owns how it looks and how long it
 * takes, this file owns only where it is.
 *
 * Pass a sound handle from web/sound.js to give the tile its travel cue.
 * The cue name lives here rather than at the call site, so switching it is a
 * design-system change, not an edit to every app that mounts a nav.
 */

import { KRK_CUES } from "./sound.js";

const ITEM = ".krk-pillnav__item";
const INDICATOR_CLASS = "krk-pillnav__indicator";

/**
 * Turn a pill nav into a screen selector.
 *
 * The nav needs .krk-pillnav--slider and one or more .krk-pillnav__item
 * children; mark the starting screen with .is-active, or the first item is
 * used. An indicator element is created if the markup doesn't supply one.
 *
 * Selecting a screen dispatches "krk:screenchange" on the nav, with
 * { index, id } in detail — id being the item's data-screen, if it has one.
 *
 * `sound` is an initKarakuliSound() handle; omit it and the nav is silent.
 * Note the energy dial: a 'calm' app swallows this cue by design, so a nav
 * that needs to be heard must be mounted in a 'playful' one.
 *
 * @returns {{select: (index: number) => void, destroy: () => void}}
 */
export function initKarakuliPillnav(nav, { onChange, sound } = {}) {
  const items = Array.from(nav.querySelectorAll(ITEM));
  if (!items.length) return { select() {}, destroy() {} };

  const indicator = findOrCreateIndicator(nav);
  let current = Math.max(0, items.findIndex((item) => item.classList.contains("is-active")));

  /* Move the tile onto an item. Skipping the transition matters on the
     first paint and on resize, where an animated slide would read as the
     user having chosen something they didn't. */
  function place(index, { animate = true } = {}) {
    const item = items[index];
    if (!animate) indicator.style.transition = "none";
    indicator.style.width = `${item.offsetWidth}px`;
    indicator.style.transform = `translateX(${item.offsetLeft}px)`;
    if (!animate) {
      void indicator.offsetWidth; /* flush, so the next change animates again */
      indicator.style.transition = "";
    }
    indicator.classList.add("is-measured");
  }

  function select(index, { animate = true } = {}) {
    if (index === current || !items[index]) return;
    items[current].classList.remove("is-active");
    items[current].setAttribute("aria-selected", "false");
    items[index].classList.add("is-active");
    items[index].setAttribute("aria-selected", "true");
    current = index;
    place(index, { animate });
    if (animate) sound?.play(KRK_CUES.slide);

    const detail = { index, id: items[index].dataset.screen ?? null };
    nav.dispatchEvent(new CustomEvent("krk:screenchange", { detail, bubbles: true }));
    onChange?.(detail);
  }

  items.forEach((item, index) => {
    item.setAttribute("role", "tab");
    item.setAttribute("aria-selected", String(index === current));
    item.addEventListener("click", () => select(index));
  });
  nav.setAttribute("role", "tablist");

  /* Arrow keys move between screens the way a tablist is expected to. */
  nav.addEventListener("keydown", (event) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (current + step + items.length) % items.length;
    select(next);
    items[next].focus();
  });

  items[current].classList.add("is-active");
  place(current, { animate: false });

  /* The tile is positioned in pixels, so any relayout invalidates it. */
  const observer = new ResizeObserver(() => place(current, { animate: false }));
  observer.observe(nav);

  return {
    select,
    destroy() {
      observer.disconnect();
    },
  };
}

function findOrCreateIndicator(nav) {
  const existing = nav.querySelector(`.${INDICATOR_CLASS}`);
  if (existing) return existing;
  const indicator = document.createElement("span");
  indicator.className = INDICATOR_CLASS;
  indicator.setAttribute("aria-hidden", "true");
  nav.prepend(indicator);
  return indicator;
}
