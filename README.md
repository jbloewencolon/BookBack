# BookBack: Reclaim the Commons

BookBack is a minimalist Chrome extension that helps discover copies of books at local public libraries. When you visit a book page on Amazon, Indigo, Barnes & Noble, Goodreads, Bookshop, and several others, BookBack scans the page, detects the title and author, and adds a small floating widget that lets you check availability at your own libraries.

BookBack is part of the **UnCart Movement**, a project encouraging people to spend less, reclaim the digital commons, and strengthen public good infrastructure.

---

## Features

- Automatically detects book pages across major bookselling sites
- Extracts title, author, and ISBN using DOM heuristics and JSON-LD metadata
- Lets users configure unlimited library search templates
- Opens each library search in its own tab to bypass popup blockers
- Includes a clean "find a library near me" fallback
- Works on Amazon, Indigo, Barnes & Noble, Goodreads, Bookshop.org, Thriftbooks, Powell's, Better World Books, Alibris, AbeBooks, and more
- Privacy-first: no tracking, no analytics, no remote servers

---

## Installation (Users)

1. Download the latest release zip from the [Releases](../../releases) page.
2. Unzip it.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** and select the unzipped folder.
6. The BookBack icon will appear in your toolbar.

---

## Setup: Connect Your Library

1. Open the BookBack options page (click the toolbar icon).
2. Go to your library's website and search for the book **"Dune"**.
3. Copy the URL of the search results page.
4. Paste it into BookBack and click **Create Connection**.

BookBack replaces "Dune" in that URL with a `{{query}}` placeholder to build your personal library search template. You can connect as many libraries as you like.

---

## Installation for Developers

```bash
git clone https://github.com/jbloewencolon/BookBack.git
cd BookBack
```

Load the `dist/` folder as an unpacked extension in `chrome://extensions`.

There is no build step. `dist/` contains the hand-edited source files directly.

### File overview

| File | Purpose |
|---|---|
| `dist/manifest.json` | MV3 manifest — `storage` permission only |
| `dist/strategies.js` | `BookScanner`: page detection and book data extraction |
| `dist/ui.js` | `UI`: widget rendering and query construction |
| `dist/content.js` | Orchestrator: SPA detection, MutationObserver, widget injection |
| `dist/background.js` | Service worker: receives messages, opens library tabs |
| `dist/options.html/.js` | Settings page (also the toolbar popup) |
| `dist/styles.css` | Widget styles |

---

## Privacy

BookBack requests only the `storage` permission — used solely to save and load your library templates on your device. No data leaves your machine. See [PRIVACY.md](PRIVACY.md) for the full policy.

---

## Contributing

See the [Community Guide](public/Community%20Guide.txt) for how to contribute.

Issues and pull requests are welcome, especially for:
- Additional retailer support
- Library catalog URL patterns
- Bug reports
