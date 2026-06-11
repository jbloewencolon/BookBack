# BookBack — Task Queue

_From the 2026-06-11 review pass. Owner: jbloewencolon. Items are proposals
until the owner confirms priority._

## Active

- (none)

## Completed (this session, 2026-06-11)

1. **Font loading / privacy alignment** — removed `@import` from
   `dist/styles.css` and `<link>` from `dist/options.html`. Font stack is
   now `'Courier New', monospace`. No more outbound request to Google on book
   page visits.
2. **Dune-template domain corruption** — fixed in `dist/options.js`. Now
   parses the URL, extracts `origin`, and only replaces "dune" in
   path+query. Hostnames containing "dune" (e.g. Dunedin libraries) are safe.
3. **Firefox `browser_specific_settings` block** — removed from both
   `dist/manifest.json` and `public/manifest.json`. The block was broken
   (placeholder ID, `service_worker` without `scripts`) and would have caused
   silent breakage on any Firefox MV3 publish attempt. Add it back properly
   when Firefox AMO publication is actually planned.
4. **Dead `#supportBtn`** — removed from `dist/options.html` (both the
   markup and the CSS block). No handler existed and no destination was set.
5. **Docs cleanup** — rewrote README (complete, no artifacts), set PRIVACY.md
   date, rewrote `Community Guide.txt` to reflect current template-based
   architecture (the old `KNOWN_DOMAINS` instructions no longer apply).
6. **Background hardening** — `dist/background.js`: added `sender.id` check
   (only handle messages from own extension), scheme re-validation after
   normalization, and a 10-library cap per click to prevent tab bombs.

## Next (remaining)

- **Consider bundling a woff2** if the monospace fallback feels too
  utilitarian. A single self-hosted font file would restore the Courier Prime
  look without any privacy trade-off.
- **Firefox support** (if desired): add `"scripts": ["background.js"]`
  alongside `"service_worker"` in the manifest background object, and set a
  real AMO extension ID in `browser_specific_settings.gecko`.

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
