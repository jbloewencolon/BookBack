# 📚 BookBack: Reclaim the Commons

BookBack is a minimalist, anti-consumerist Chrome extension that redirects your attention away from corporate book retailers and toward your local public libraries. When you visit a book page on Amazon, Indigo, Barnes & Noble, Goodreads, Bookshop, and several others, BookBack scans the page, detects the title and author, and adds a small floating widget that lets you check availability at your own libraries.

BookBack is part of the **UnCart Movement**, a project encouraging people to spend less, reclaim the digital commons, and strengthen public good infrastructure.

---

## ✨ Features

- Automatically detects book pages across major bookselling sites  
- Extracts title, author, and ISBN using DOM heuristics and JSON-LD metadata  
- Lets users configure unlimited library search templates  
- Opens each library search in its own tab to bypass popup blockers  
- Includes a clean “find a library near me” fallback  
- Works on Amazon, Indigo, Barnes & Noble, Goodreads, Bookshop.org, Thriftbooks, Powell’s, Better World Books, Alibris, AbeBooks, and more  
- Privacy-first, no tracking, no analytics, no remote servers  

Code references:  
- Service worker: `background.js` :contentReference[oaicite:3]{index=3}  
- Content orchestrator: `content.js` :contentReference[oaicite:4]{index=4}  
- Extraction engine: `strategies.js` :contentReference[oaicite:5]{index=5}  
- DOM/UI rendering: `ui.js` :contentReference[oaicite:6]{index=6}  
- Styles: `styles.css` :contentReference[oaicite:7]{index=7}  
- Options page: `options.html`, `options.js` :contentReference[oaicite:8]{index=8} :contentReference[oaicite:9]{index=9}  
- Manifest: `manifest.json` :contentReference[oaicite:10]{index=10}

---

## 🧩 Installation for Developers

### 1. Clone the repo:

```bash
git clone https://github.com/YOURNAME/bookback.git
cd bookback
