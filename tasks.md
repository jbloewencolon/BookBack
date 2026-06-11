# BookBack — Task Queue

_From the 2026-06-11 review pass. Owner: jbloewencolon. Items are proposals
until the owner confirms priority._

## Active

- (none — review pass only; no functional changes made yet)

## Next (proposed priority order)

1. **Align font loading with the privacy policy.** Remove the remote Google
   Fonts `@import` in `dist/styles.css` and the `fonts.googleapis.com`
   `<link>` in `dist/options.html`; either bundle Courier Prime locally or
   fall back to `'Courier New', monospace`. Today every visit to a supported
   retail book page triggers a request to Google, contradicting PRIVACY.md.
2. **Fix the Dune-template domain corruption** in `dist/options.js`:
   `url.replace(/dune/i, '{{query}}')` replaces the first match anywhere in
   the URL, breaking hosts that contain "dune" (e.g. Dunedin libraries).
   Replace only in the query/path portion after the host, or use the last
   occurrence.
3. **Resolve the Firefox story.** Either add `"scripts": ["background.js"]`
   alongside `service_worker` and set a real gecko ID, or remove
   `browser_specific_settings` until Firefox support is intended.
4. **Wire or remove `#supportBtn`** in `dist/options.html` (no handler in
   `options.js`; clicking does nothing).
5. **Docs cleanup:** finish the truncated README (remove
   `:contentReference[oaicite:n]` artifacts, complete install steps), set the
   PRIVACY.md date, and rewrite `Community Guide.txt` to match the current
   architecture (no `KNOWN_DOMAINS` exists anymore).
6. **Defense in depth (low urgency):** validate `lib.searchUrl` scheme in
   `background.js` before `tabs.create` (don't trust storage), ignore
   messages where `sender.id !== chrome.runtime.id`, and cap the number of
   tabs opened per click (a user with many templates gets a tab bomb).

## Blocked / Needs owner decision

- Whether Firefox/AMO publication is actually planned (drives item 3).
- Whether `public/manifest.json` is meant to track `dist/manifest.json`
  forever, or whether `public/` should stop carrying a manifest.
- Where the support link should point (item 4).

## Recently completed (still relevant)

- v1.1.1 (current `dist/`, newer than `versions/V.3.zip`): improved Amazon
  author selectors to avoid "Format: Kindle Edition" noise; tightened
  `isBookPage()` URL checks; added support-link styles to options page.
- v1.0 → v1.1 refactor: replaced V.2 architecture (`detector.js`,
  `library.js`, `storage.js`, `vendors.json` / `KNOWN_DOMAINS`) with
  `strategies.js` + Dune-URL template onboarding.
