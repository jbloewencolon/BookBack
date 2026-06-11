# BookBack — Working Handoff

_Last updated: 2026-06-11 — all priority items from review pass applied_

## What this is

BookBack v1.1.1 — a Chrome Manifest V3 extension that detects book product
pages on retail sites (Amazon, Indigo, B&N, Goodreads, Bookshop, etc.),
extracts title/author/ISBN, and injects a widget that opens the user's
configured library catalog searches in new tabs. Privacy-first positioning:
`storage` is the only permission, no servers, no telemetry.

## Repository reality (not aspiration)

- **`dist/` is the source of truth.** There is no `src/`, no build step, no
  package.json. The files in `dist/` are the hand-edited, shipped code.
- **`public/`** holds store-listing assets (screenshots, icon, QR code), a
  duplicate `manifest.json` (currently identical to `dist/`), and
  `Community Guide.txt`.
- **`versions/`** holds zipped snapshots (`V.2.zip`, `V.3.zip`) of older
  releases. V.2 had a different architecture (`detector.js`, `library.js`,
  `storage.js`, `vendors.json`) that no longer exists. `dist/` is newer than
  the V.3 zip (Amazon author-selector and `isBookPage` improvements).
- All git history is from a single day (2025-12-02), uploaded via the GitHub
  web UI ("Add files via upload"). Git history carries no design rationale.

## Architecture (current, verified)

Content-script pipeline, loaded in order on matched retail pages:

1. `strategies.js` — `window.BookScanner`: `isBookPage()` (URL patterns, DOM
   breadcrumbs, og:type/og:isbn meta, ISBN heuristics) and `extract()`
   (JSON-LD first, per-site CSS selector fallback via `BOOK_SCOPES`).
2. `ui.js` — `window.UI`: builds the widget with safe DOM APIs
   (`textContent`), builds the search query (title cut at punctuation +
   author last name), and sends `{action: "openLibraries", query, libraries}`
   to the background.
3. `content.js` — orchestrator: dependency check, SPA URL-change detection,
   debounced (500 ms) `MutationObserver` on `document.body`, injects widget
   near the buy box (fixed-position fallback; always fixed on Indigo).
4. `background.js` — service worker: receives `openLibraries`, substitutes
   `{{query}}` into each stored template (or appends `?q=`), opens one tab
   per library. Opens options page on install.
5. `options.html`/`options.js` — doubles as the action popup. Library setup
   works by pasting a catalog search-results URL for the book "Dune"; the
   literal `dune` is replaced with `{{query}}` to form a template. Templates
   live in `chrome.storage.local` under key `libraries`.

## Validation

No tests, no CI, no lint. Validation is manual: `chrome://extensions` →
load unpacked → visit retailer book pages → verify widget, query, and tab
opening; options page round-trip for templates. Keep it that way until
there's a reason not to.

## Known issues and active work

See `tasks.md` for the prioritized queue. Highest-priority items found in
the 2026-06-11 review:

1. Google Fonts is fetched remotely by both the injected page CSS and the
   options page, contradicting PRIVACY.md's "no third-party requests" claim.
2. The Dune-template builder (`options.js`) replaces the **first**
   case-insensitive `dune` in the URL — it corrupts domains containing
   "dune" (e.g. Dunedin public libraries).
3. Firefox compatibility is claimed (`browser_specific_settings.gecko`) but
   the background declares only `service_worker`, which Firefox MV3 does not
   run; the gecko ID is also a placeholder (`bookback@example.com`).
4. `#supportBtn` in options.html has no click handler — dead UI.
5. Docs drift: `Community Guide.txt` instructs contributors to edit a
   `KNOWN_DOMAINS` object in `options.js` that no longer exists (V.2-era);
   README is truncated mid-install-instructions and contains leftover
   `:contentReference[oaicite:n]` artifacts; PRIVACY.md date is
   `[Insert Date]`.

## Safe / unsafe to modify

- **Safe:** docs (README, PRIVACY, Community Guide), `options.html`/`options.js`
  UI fixes, `styles.css` font sourcing, this file, `tasks.md`.
- **Change with care:** `strategies.js` selectors and `ui.js` injection
  targets — they encode hard-won knowledge about retailer DOMs; verify on
  the live sites before and after.
- **Do not touch without a decision from the owner:** `versions/*.zip`
  (release record), store assets in `public/images/`, the dual-manifest
  setup (`dist/` vs `public/` — keep them in sync if either changes).
