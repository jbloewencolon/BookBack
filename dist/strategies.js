// strategies.js - Core Logic Shared Library

// --- PART A: BOOK DETECTION STRATEGIES ---
const BOOK_SCOPES = {
    amazon: {
        check: (url) => /\/(dp|gp\/product)\//.test(url),
        // Kindle pages put "Kindle Store" in breadcrumbs.
        // We look for specific ID matches first to avoid generic header noise.
        title: ['#productTitle', '#ebooksProductTitle', '#title', 'h1'],
        
        // UPDATE: targeted 'a' tags to avoid "Format: Kindle Edition" text
        author: [
            '.contributorNameID', 
            '.author a',          // "Richard Powers" (Link)
            '#bylineInfo a',      // "Richard Powers" (Link inside byline)
            '#bylineInfo'         // Fallback (Riskier, but cleaned by cleanText)
        ],
        isbn: ['#detailBullets_feature_div', '#prodDetails']
    },
    indigo: {
        check: (url) => /\/books\//.test(url),
        title: ['h1.product-title', 'h1'],
        author: ['.contributor-name', '.author']
    },
    barnes: {
        check: (url) => url.includes('barnesandnoble.com'),
        title: ['h1.pdp-header-title', 'h1'],
        author: ['#key-contributors', '.contributors']
    },
    goodreads: {
        check: (url) => url.includes('goodreads.com'),
        title: ['h1[data-testid="bookTitle"]', 'h1'],
        author: ['span[data-testid="name"]', '.authorName']
    },
    bookshop: {
        check: (url) => url.includes('bookshop.org'),
        title: ['h1', '.book-title'],
        author: ['.book-author', 'h2']
    },
    thriftbooks: {
        check: (url) => url.includes('thriftbooks.com'),
        title: ['h1'],
        author: ['.WorkMeta-author']
    },
    generic: {
        check: () => true, // Fallback
        title: ['h1'],
        author: ['.author', '.byline', '.contributor']
    }
};

const BookScanner = {
    cleanText: (text) => {
        if (!text) return "";
        return text
            .replace(/\s+/g, ' ')
            // Remove specific " (Author)" suffixes common on sites
            .replace(/\(Author\)|\(Editor\)|\(Illustrator\)/gi, '')
            // UPDATE: Explicitly remove Kindle/Format noise for edge cases
            .replace(/Format:|Kindle Edition|Kindle|Edition/gi, '')
            // Remove trailing pipes/colons only if they are at the very end
            .replace(/[:|]\s*$/, '') 
            .trim();
    },

    isBookPage: () => {
        const url = window.location.href;
        
        // 1. STRICT URL CHECKS (Safe to assume these are books)
        if (/\/book\/show\//.test(url)) return true; // Goodreads
        if (/\/p\/books\//.test(url)) return true;   // Bookshop
        if (url.includes('/books/')) return true;    // Generic "books" path
        if (/(978|979)\d{10}/.test(url)) return true; // ISBN in URL

        // 2. DOM HEURISTICS (For Amazon/B&N)
        
        // A. Breadcrumbs (Most reliable for Amazon/B&N)
        // Checks for "Books", "Kindle Store", "Audible"
        const amzCrumbs = document.getElementById('wayfinding-breadcrumbs_feature_div') || 
                          document.getElementById('nav-subnav');
        if (amzCrumbs && /Books|Kindle|Audible/i.test(amzCrumbs.innerText)) return true;

        const bnCrumbs = document.querySelector('#breadcrumbs') || document.querySelector('.breadcrumbs');
        if (bnCrumbs && /Books|Audiobooks|eBooks/i.test(bnCrumbs.innerText)) return true;

        // B. Meta Tags (The standard)
        if (document.querySelector('meta[property="og:type"][content="book"]')) return true;
        if (document.querySelector('meta[property="og:isbn"]')) return true;
        
        // C. Last Resort (Detail bullets for ISBN)
        // This ensures we don't catch lightbulbs, as they rarely list an ISBN.
        const bullets = document.getElementById('detailBullets_feature_div');
        if (bullets && bullets.innerText.includes('ISBN')) return true;

        return false;
    },

    extract: () => {
        // 1. Try JSON-LD (Structured Data) - Most Accurate
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (let script of scripts) {
            try {
                const data = JSON.parse(script.innerText);
                const item = Array.isArray(data) ? 
                    data.find(d => d['@type'] === 'Book' || d.isbn) : 
                    (data['@type'] === 'Book' || data.isbn ? data : null);
                
                if (item) {
                    let author = item.author;
                    if (Array.isArray(author)) author = author.map(a => a.name).join(' ');
                    else if (typeof author === 'object') author = author.name;

                    return {
                        title: BookScanner.cleanText(item.name),
                        author: BookScanner.cleanText(author),
                        isbn: item.isbn
                    };
                }
            } catch (e) {}
        }

        // 2. Visual Fallback
        const host = window.location.hostname;
        let config = BOOK_SCOPES.generic;

        if (host.includes('amazon')) config = BOOK_SCOPES.amazon;
        else if (host.includes('indigo')) config = BOOK_SCOPES.indigo;
        else if (host.includes('barnes')) config = BOOK_SCOPES.barnes;
        else if (host.includes('goodreads')) config = BOOK_SCOPES.goodreads;
        else if (host.includes('bookshop')) config = BOOK_SCOPES.bookshop;
        else if (host.includes('thriftbooks')) config = BOOK_SCOPES.thriftbooks;

        let title, author;
        
        for (let sel of config.title) {
            const el = document.querySelector(sel);
            if (el) { title = el.innerText; break; }
        }
        for (let sel of config.author) {
            const el = document.querySelector(sel);
            if (el) { author = el.innerText; break; }
        }

        if (title) {
            return {
                title: BookScanner.cleanText(title),
                author: BookScanner.cleanText(author)
            };
        }
        return null;
    }
};

window.BookScanner = BookScanner;