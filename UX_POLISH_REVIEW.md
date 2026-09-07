# BookBack UX Polish Review

## Experience assessment

BookBack serves readers who have reached a book-detail page and want a lower-cost, community-minded alternative to purchasing. Its value is immediate: identify the book, search the reader’s own catalogs, and move them toward borrowing with very little effort. The core interaction is appropriately small and contextual rather than a competing destination.

The strongest launch opportunity is confidence. Before this pass, the library-connection screen looked characterful but provided weak state communication, exposed raw templates without identifying them, and used interactions whose semantics were not always clear to keyboard and assistive-technology users. The injected card was also difficult to dismiss and could cover content on narrow screens. The implemented refinements address those launch risks while preserving the handmade, civic-minded personality.

There is no product analytics or qualitative research in the repository. Behavioral claims below are therefore hypotheses to validate, not observed facts.

## What already works

- **Contextual placement:** showing the borrowing option next to a retailer’s purchase controls aligns with the user’s current decision and avoids a separate lookup flow.
- **A single primary task:** the injected experience asks users to search their libraries rather than presenting unrelated features.
- **Privacy positioning:** local storage and the lack of accounts, tracking, or remote services are meaningful trust advantages and should remain explicit.
- **Practical catalog setup:** deriving a reusable template from a real `Dune` search avoids asking users to understand library URL structures.
- **Distinctive visual voice:** the paper, ink, monospace, and “reclaim the commons” language make BookBack recognizable. The polish pass softens the rough edges without replacing that identity.
- **Multiple-catalog support:** opening one search for every saved library supports users who have city, university, or regional cards.

## Friction and UX issues

### Addressed in this pass

1. **The settings hierarchy was flat.** Instructions, input, status, connected libraries, manual setup, and support all had similar visual emphasis. They are now grouped into two titled tasks with a clear primary action.
2. **Saved catalogs were hard to recognize.** Each row showed only a long URL. Rows now derive and display the catalog hostname while retaining the editable template.
3. **The empty state was visually silent.** The connected-libraries region now explicitly says when no library has been connected.
4. **Feedback relied on color and terse system language.** Status text now uses specific recovery instructions, an `aria-live` region, and textual confirmation; connection also exposes a disabled loading state.
5. **Duplicate connections were possible.** Exact duplicate templates are now detected before saving.
6. **Invalid edits could remain visually out of sync with storage.** Invalid URLs are rejected, restored to their saved value, and returned to focus.
7. **The injected widget could obstruct a host page.** It now includes a labeled dismiss control and moves to a bottom sheet-like position on narrow screens.
8. **Link elements were used as buttons.** Search actions now use native buttons, improving semantics and keyboard behavior.
9. **Motion ignored user preferences.** Entry and transition effects are disabled under `prefers-reduced-motion`.
10. **Global CSS tokens risked colliding with retailer styles.** Custom properties are now scoped and prefixed on the widget.

### Remaining validation needs

- **Search-result quality:** title-cleaning and author-last-name heuristics may work differently by retailer or catalog. Instrument only with explicit consent, or run moderated tests using a representative catalog matrix.
- **Multiple-tab surprise:** opening several tabs is powerful but can feel unexpected. Test whether the count-specific CTA provides enough expectation setting; if not, add a one-time confirmation when more than three catalogs are configured.
- **Manual template comprehension:** `{{query}}` is expert-oriented. Observe whether users can successfully configure a catalog that the automatic flow does not support.
- **Dismissal persistence:** dismissal currently lasts for the current page instance. Test whether readers expect “not on this book,” “not on this site,” or a global disable option before adding persistence.

## Visual polish opportunities

The implemented settings layout establishes a reusable hierarchy: eyebrow, page title, concise value statement, task heading, helper copy, and controls. It uses a restrained green for primary action and success, red for destructive/error states, and blue for focus. Borders, radii, and touch-target sizes are consistent, while the hard offset shadow retains the product’s print-like personality.

Further visual work should follow evidence rather than taste:

- Test the card at browser zoom levels from 100–200%; do not reduce type to fit more content.
- Audit injected-card screenshots on every supported retailer because host layouts and dark modes can change independently.
- If the raw URL rows remain visually dense in testing, collapse each template behind an “Edit search URL” disclosure rather than truncating information users may need.

## Interaction and microinteraction opportunities

- **Implemented:** explicit connecting, success, duplicate, validation, saved, removed, and failure feedback.
- **Implemented:** the final manual-template field receives focus, connecting keyboard action to the next required step.
- **Implemented:** hover, active, disabled, focus-visible, and reduced-motion behavior for core controls.
- **Next:** announce the number of result tabs before opening them when the action would create more than three tabs.
- **Next:** add an undo action to removal if usability testing shows accidental deletion. A transient “Library removed · Undo” message is preferable to a confirmation dialog for this reversible action.
- **Next:** if catalog loading time becomes visible, preserve the originating book context in the first tab or provide an extension badge state; do not add decorative spinners to an action that hands off immediately.

## UX writing improvements

Implemented copy changes focus on the user’s outcome and recovery:

| Before | After | Rationale |
| --- | --- | --- |
| “Create Connection” | “Connect library” | Names the object and uses sentence case. |
| “PASTE ‘DUNE’ SEARCH URL” | “Dune search-results URL” | Removes shouting and keeps the distinctive requirement. |
| “Processing...” | “Creating your library search…” | Describes what the system is doing. |
| “Error: URL must contain ‘Dune’.” | “This URL doesn’t include ‘Dune.’ Copy the URL after searching your library catalog for Dune.” | Gives a concrete recovery step. |
| “Borrow It” | “Search My Library” / “Search 3 Libraries” | Sets an accurate expectation; the action searches rather than completes a loan. |
| “City, State or Zip” | “City, state, or postal code” | Supports users outside the United States and improves punctuation. |

Continue using “library” in user-facing language and reserve “template” and “query” for the manual advanced path.

## Accessibility improvements

Implemented changes support WCAG principles without treating accessibility as a separate theme:

- Native button semantics replace anchor elements with placeholder destinations.
- All interactive controls have visible, high-contrast focus indicators.
- Icon-only dismiss and remove buttons have specific accessible names and 32–44 px targets.
- Status messages are exposed through a polite live region and never depend on color alone.
- Form fields have associated labels or contextual accessible names.
- The widget is identified as a complementary region.
- Layout reflows on narrow screens; the settings page includes a viewport declaration.
- Motion is removed when the operating system requests reduced motion.
- The external font import was removed, improving reliability under extension content-security policy and preventing a network request solely for typography.

Before launch, run screen-reader passes with NVDA + Chrome and VoiceOver + Safari, keyboard-only testing on all supported hosts, automated axe checks, 200% zoom checks, and contrast checks against actual rendered colors.

## Delight opportunities

Keep delight sparse and tied to the mission:

1. After the first successful connection, show one restrained line such as “Your library is ready for the next book you discover.” Do not use confetti; the confirmation should feel calm and civic.
2. When a search launches, briefly change the CTA to “Opening your library…” before navigation. This can provide reassurance without delaying the action.
3. Consider an optional aggregate “books redirected to libraries” count stored only on-device. Explain its local nature clearly; never turn it into pressure or surveillance.

## Design-system improvements

Document and reuse the following patterns rather than adding one-off styles:

- **Tokens:** paper/background, ink, muted text, action green, destructive red, focus blue, line, 7–10 px radius, and 44 px minimum control height.
- **Button hierarchy:** filled primary, outlined destructive icon, and low-emphasis text button; each needs default, hover, active, focus, and disabled states.
- **Feedback:** a polite status pattern with neutral, success, and error tones plus action-specific copy.
- **Form row:** persistent label, optional helper text, URL input, and primary action; stack below 460 px.
- **Catalog row:** human-readable hostname, editable URL, and labeled remove action.
- **Injected surface:** scoped `bb-` classes and custom properties, explicit host-style resets, complementary landmark, dismiss action, and responsive fixed fallback.
- **Motion:** 100–200 ms for direct state transitions; entrance motion only when it clarifies appearance; no motion when reduced motion is requested.

## Priority roadmap

| Location / screen | Problem | Recommended change | Why it improves the UX | Priority | Expected impact |
| --- | --- | --- | --- | --- | --- |
| Settings and injected widget | Keyboard, semantics, focus, motion, and feedback gaps reduce access and confidence. | Ship the implemented native controls, focus treatment, labels, live status, reflow, and reduced-motion support; complete manual assistive-technology testing. | Makes core tasks operable and understandable across input modes. | **Critical** | Higher completion, fewer accessibility failures, stronger launch readiness. |
| Injected widget on small screens | A fixed card can cover retailer content without escape. | Ship dismiss and narrow-screen bottom positioning; validate at 320 px and 200% zoom on each host. | Restores user control and preserves access to the host page. | **Critical** | Lower obstruction and abandonment risk. |
| Settings / connection flow | Raw URLs, duplicates, silent empty state, and vague errors create uncertainty. | Ship hostname labels, empty state, duplicate prevention, loading state, and recovery-oriented errors. | Reduces interpretation and makes system state visible. | **High impact** | Faster setup and fewer configuration errors. |
| Injected widget CTA | “Borrow It” overpromises the outcome and hides multi-tab behavior. | Ship count-specific “Search…” labels; test a one-time confirmation for more than three libraries. | Aligns action copy with actual behavior and improves trust. | **High impact** | Fewer surprises; more confident clicks. |
| Automatic catalog searches | Search heuristics may produce poor results for edge-case titles and names. | Run task-based tests across 20 representative books, retailers, and catalog systems; track successful result relevance without collecting reading history. | Validates the core value proposition with privacy preserved. | **High impact** | Better successful-search rate and retention. |
| Connected library removal | Immediate deletion has no recovery. | Add a 5–8 second undo action if accidental removal appears in testing. | Preserves speed while supporting error recovery. | **Polish** | Fewer frustrating rebuilds. |
| Manual template setup | Placeholder syntax is technical. | Add a collapsed advanced explainer with one annotated example and inline placeholder validation. | Supports edge cases without burdening the common flow. | **Polish** | Higher manual-setup success. |
| First successful connection | Confirmation is functional but not memorable. | Add one calm, mission-aligned success sentence, with no blocking animation. | Reinforces value at the moment of activation. | **Delight** | Stronger emotional connection and perceived quality. |

## Measurement and validation plan

Because BookBack promises no analytics, favor privacy-preserving research:

1. Conduct five moderated setup sessions with public-library users; measure setup completion, time on task, errors, and confidence after setup.
2. Test ten book searches across at least three catalog providers; record whether the expected title appears in the first five results.
3. Run a comprehension comparison for “Search 3 Libraries” versus a one-time multi-tab confirmation.
4. Invite opt-in, anonymous issue reports that exclude book titles, URLs, and library identities by default.
5. Treat an 80% first-attempt connection rate and 90% keyboard completion rate as initial launch gates, then refine targets after baseline research.
