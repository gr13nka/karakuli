#!/usr/bin/env node
/**
 * Karakuli — regenerate the README screenshots.
 *
 * These are committed to the repo (GitHub needs them in-repo to render),
 * which makes them the one artefact here that can silently go stale. So they
 * are produced by a script rather than by hand: after any design change, run
 * this and the pictures match the code again.
 *
 *   node tools/shoot.mjs
 *
 * Drives a cached Chromium over the DevTools protocol, using Node's built-in
 * WebSocket. No npm install, in keeping with the rest of tools/.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/screenshots');
const PORT = 8899;

const MIME = { html: 'text/html', css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml', png: 'image/png' };

function findBrowser() {
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  // chrome-headless-shell first: it exists precisely to be driven over CDP and
  // opens its debugging port without argument. Full Chrome is the fallback.
  const shells = [], fulls = [];
  if (existsSync(cache)) {
    for (const d of readdirSync(cache)) {
      for (const p of [
        join(cache, d, 'chrome-headless-shell-mac-x64/chrome-headless-shell'),
        join(cache, d, 'chrome-headless-shell-mac-arm64/chrome-headless-shell'),
      ]) if (existsSync(p)) shells.push(p);
      for (const p of [
        join(cache, d, 'chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        join(cache, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
      ]) if (existsSync(p)) fulls.push(p);
    }
  }
  const candidates = [...shells, ...fulls];
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                   '/Applications/Chromium.app/Contents/MacOS/Chromium']) {
    if (existsSync(p)) candidates.push(p);
  }
  if (!candidates.length) throw new Error('no Chromium found — install Chrome, or run `npx playwright install chromium`');
  return candidates[0];
}

/* Each shot names elements the demo already has rather than requiring markers
   in the markup — taking pictures should not make the page carry attributes it
   has no other use for. `from`/`to` clip the union of two elements, and
   'sel@n' picks the nth match. */
const SHOTS = [
  // The README's opening pair. Article shows its two themes side by side;
  // Karakuli has one, so the pair shows the doctrine instead: the same system
  // at rest, and the same system spending its colour.
  { file: 'quiet.png',   w: 1440, clip: '.demo-phone@0' },
  { file: 'moment.png',  w: 1440, clip: '.demo-phone@2' },
  { file: 'phones.png',  w: 1440, clip: '.demo-phones' },
  // The gallery runs several thousand pixels, so it is sampled rather than
  // captured whole: buttons, cards and fields carry it.
  { file: 'gallery.png', w: 1440, from: '#gallery .demo-group@0', to: '#gallery .demo-group@2', max: 1500 },
  { file: 'motifs.png',  w: 1440, clip: '#demo-motif-field' },
];

/* The demo's own furniture — the sticky control strip and the numbered plate
   markers — explains the kit to a reader of the page, but in a README
   screenshot it reads as clutter over the design. Hidden for the capture only.

   The entrance animations are frozen at their finished state for the same
   reason a photograph is not a film: a shot fired mid-sprout is a picture of a
   half-drawn motif, and it looks like a rendering fault rather than motion. */
const HIDE_CHROME = `
  .demo-controls, .demo-marker { display: none !important; }
  html { scroll-behavior: auto !important; }
  .krk-enter-sprout, .krk-enter-rise, .krk-enter-draw, .krk-bloom {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .krk-enter-draw path { stroke-dasharray: none !important; stroke-dashoffset: 0 !important; }
`;

const send = (() => {
  let id = 0;
  return (ws, method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const msgId = ++id;
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== msgId) return;
      ws.removeEventListener('message', onMsg);
      m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
})();

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* Waiting a fixed number of milliseconds after navigating is a coin flip on a
   cold browser — the first shot of a run would occasionally be taken of a blank
   page. Ask the page itself instead, and only give up if it never becomes ready. */
async function waitUntil(ws, sessionId, expression, what, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const { result } = await send(ws, 'Runtime.evaluate', { expression, returnByValue: true }, sessionId);
    if (result.value === true) return;
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await wait(100);
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  const server = createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    // The demo has no icon and never asks for one, but Chrome does anyway;
    // answering keeps a routine 404 out of the page-problem report below.
    if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    const path = join(ROOT, url);
    try {
      const body = await readFile(path);
      res.writeHead(200, { 'Content-Type': MIME[path.split('.').pop()] ?? 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

  const bin = findBrowser();
  console.log(`  browser: ${bin.split('/').slice(-1)[0]}`);
  const profile = mkdtempSync(join(tmpdir(), 'karakuli-shoot-'));
  const args = ['--remote-debugging-port=9333', `--user-data-dir=${profile}`, '--hide-scrollbars',
    '--force-color-profile=srgb', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--disable-extensions',
    // Keep the browser away from the OS keychain. Without these, Chrome asks
    // macOS for its "Safe Storage" key on a fresh profile so it can encrypt
    // cookies and passwords — an alarming prompt, and completely pointless for
    // a throwaway profile that only ever loads localhost and takes pictures.
    '--use-mock-keychain', '--password-store=basic',
    '--disable-sync', '--disable-features=Translate,MediaRouter',
    'about:blank'];
  if (!bin.includes('chrome-headless-shell')) args.unshift('--headless=new');
  const proc = spawn(bin, args, { stdio: 'ignore' });

  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await wait(250);
    try { wsUrl = (await (await fetch('http://127.0.0.1:9333/json/version')).json()).webSocketDebuggerUrl; } catch {}
  }
  if (!wsUrl) { proc.kill(); server.close(); throw new Error('browser did not expose a debugging port'); }

  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  const { targetId } = await send(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send(ws, 'Target.attachToTarget', { targetId, flatten: true });
  await send(ws, 'Page.enable', {}, sessionId);
  await send(ws, 'Runtime.enable', {}, sessionId);
  await send(ws, 'Log.enable', {}, sessionId);

  // A shot of a broken page should be loud rather than quietly wrong: the demo
  // fetches every drawing it shows, so a 404 or a failed module import turns a
  // motif into an empty box that a picture cannot tell you about.
  const pageProblems = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') {
      const entry = m.params.entry;
      pageProblems.push(entry.url ? `${entry.text} — ${entry.url}` : entry.text);
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params?.type)) {
      pageProblems.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
    }
  });

  for (const shot of SHOTS) {
    await send(ws, 'Emulation.setDeviceMetricsOverride',
      { width: shot.w, height: 1200, deviceScaleFactor: 2, mobile: false }, sessionId);

    await send(ws, 'Page.navigate', { url: `http://127.0.0.1:${PORT}/demo/index.html` }, sessionId);
    await waitUntil(ws, sessionId, `document.readyState === 'complete'`, 'the page to load');

    // The demo persists the font choice in localStorage; force the canonical
    // face explicitly so a shot never inherits whatever was last auditioned.
    await send(ws, 'Runtime.evaluate', { expression: `
      try { localStorage.removeItem('krk-demo-font'); } catch (e) {}
      delete document.documentElement.dataset.font;
    ` }, sessionId);

    // The page fetches every drawing it shows, so "loaded" is not "ready":
    // wait until each host actually holds an <svg>, and the faces have arrived.
    await waitUntil(ws, sessionId, `
      document.querySelectorAll('[data-src]').length === document.querySelectorAll('[data-src] > svg').length
        && document.fonts.status === 'loaded'
    `, 'the drawings and fonts');
    await wait(250);   // one frame for the last injection to settle into layout

    const box = await send(ws, 'Runtime.evaluate', { expression: `
      (() => {
        const st = document.createElement('style');
        st.textContent = ${JSON.stringify(HIDE_CHROME)};
        document.head.appendChild(st);
        const q = (s) => {
          const at = s.lastIndexOf('@');
          if (at === -1) return document.querySelector(s);
          return document.querySelectorAll(s.slice(0, at))[Number(s.slice(at + 1))] ?? null;
        };
        const a = q(${JSON.stringify(shot.from ?? shot.clip)});
        const b = ${shot.to ? `q(${JSON.stringify(shot.to)})` : 'a'};
        if (!a || !b) return null;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const top = Math.min(ra.top, rb.top) + scrollY;
        const bottom = Math.max(ra.bottom, rb.bottom) + scrollY;
        const left = Math.min(ra.left, rb.left);
        const right = Math.max(ra.right, rb.right);
        return JSON.stringify({ x: left, y: top, width: right - left, height: bottom - top });
      })()
    `, returnByValue: true }, sessionId);

    const params = { format: 'png', captureBeyondViewport: true };
    if (box.result.value) {
      const b = JSON.parse(box.result.value);
      params.clip = { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width,
                      height: Math.min(b.height, shot.max ?? 2400), scale: 1 };
    } else {
      const why = box.exceptionDetails?.exception?.description ?? box.exceptionDetails?.text ?? 'selector matched nothing';
      console.log(`    (${shot.file}: ${why} — full viewport instead)`);
    }

    const { data } = await send(ws, 'Page.captureScreenshot', params, sessionId);
    const file = join(OUT, shot.file);
    writeFileSync(file, Buffer.from(data, 'base64'));
    console.log(`  ${shot.file.padEnd(14)} ${(statSync(file).size / 1024).toFixed(0).padStart(5)} KB`);
  }

  ws.close(); proc.kill(); server.close();
  // Chrome may still be flushing its profile as it exits; a failed tmp cleanup
  // must not fail a successful run.
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}

  console.log(`\n  ${SHOTS.length} screenshots in docs/screenshots/`);
  if (pageProblems.length) {
    console.log('\n  the page reported problems while being photographed:');
    for (const p of [...new Set(pageProblems)]) console.log(`    ${p}`);
    process.exit(1);
  }
  console.log('');
}

main().catch((e) => { console.error(`shoot: ${e.message}`); process.exit(1); });
