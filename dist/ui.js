// ui.js - DOM Rendering Engine

const UI = {
    // Helper to create elements safely
    el: (tag, className, text = null) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    },

    createWidget: (bookDetails, libraries) => {
        const container = UI.el('div');
        container.id = 'bookback-widget';
        container.setAttribute('role', 'complementary');
        container.setAttribute('aria-label', 'BookBack library search');

        // --- Header ---
        const header = UI.el('div', 'bb-header');
        header.appendChild(UI.el('div', 'bb-logo', 'BOOKBACK'));
        const closeBtn = UI.el('button', 'bb-close', '×');
        closeBtn.type = 'button';
        closeBtn.title = 'Dismiss BookBack';
        closeBtn.setAttribute('aria-label', 'Dismiss BookBack');
        closeBtn.addEventListener('click', () => container.remove());
        header.appendChild(closeBtn);

        const titleText = bookDetails.title.length > 60
            ? bookDetails.title.substring(0, 60) + '...'
            : bookDetails.title;

        const titleEl = UI.el('div', 'bb-book-title', titleText);
        header.appendChild(titleEl);
        container.appendChild(header);

        // --- Body ---
        const body = UI.el('div', 'bb-body');
        if (libraries.length > 1) {
            body.append('Check ');
            const count = UI.el('strong', null, `${libraries.length} libraries`);
            body.append(count, ' for availability.');
        } else {
            body.textContent = "Check your local library for availability.";
        }
        container.appendChild(body);

        // --- Button ---
        const btn = UI.el('button', 'bb-action-btn', libraries.length > 1 ? `Search ${libraries.length} Libraries` : 'Search My Library');
        btn.type = 'button';
        container.appendChild(btn);

        // --- Logic (Last Name Search) ---
        btn.onclick = () => {

            // 1. Clean Title
            let cleanTitle = (bookDetails.title || "")
                .split(/[:\-(\[]/)[0]        // Cut at colon, dash, or paren
                .replace(/by\s+.*$/i, '')    // Remove "by Author" in title
                .trim();

            // 2. Clean Author (Last Name Only)
            let cleanAuthor = (bookDetails.author || "");
            cleanAuthor = cleanAuthor.replace(/^by\s+/i, '');
            // Split by comma or " and " to get primary author
            cleanAuthor = cleanAuthor.split(/[&,]|(\sand\s)/)[0].trim();

            const authorParts = cleanAuthor.split(/\s+/);
            let lastName = "";
            if (authorParts.length > 0) {
                lastName = authorParts[authorParts.length - 1];
            }
            lastName = lastName.replace(/[^a-zA-Z0-9\-]/g, '');

            // 3. Final Query Construction
            let finalQuery = `${cleanTitle} ${lastName}`;
            finalQuery = finalQuery.replace(/\s+/g, ' ').trim();
            const query = encodeURIComponent(finalQuery);

            // 4. DELEGATE TO BACKGROUND (Fixes Popup Blocker)
            chrome.runtime.sendMessage({
                action: "openLibraries",
                query: query,
                libraries: libraries
            });
        };

        return container;
    },

    createFinder: () => {
        const container = UI.el('div');
        container.id = 'bookback-widget';
        container.setAttribute('role', 'complementary');
        container.setAttribute('aria-label', 'BookBack library finder');

        const header = UI.el('div', 'bb-header');
        header.appendChild(UI.el('div', 'bb-logo', 'BOOKBACK'));
        const closeBtn = UI.el('button', 'bb-close', '×');
        closeBtn.type = 'button';
        closeBtn.title = 'Dismiss BookBack';
        closeBtn.setAttribute('aria-label', 'Dismiss BookBack');
        closeBtn.addEventListener('click', () => container.remove());
        header.appendChild(closeBtn);
        header.appendChild(UI.el('div', 'bb-book-title', 'Support Public Libraries'));
        container.appendChild(header);

        const body = UI.el('div', 'bb-body', 'Enter your location to find a library near you:');
        container.appendChild(body);

        const input = UI.el('input', 'bb-input');
        input.type = 'text';
        input.placeholder = 'City, State or Zip';
        input.setAttribute('aria-label', 'City, state, or postal code');
        container.appendChild(input);

        const btn = UI.el('button', 'bb-action-btn bb-secondary', 'Find a Library');
        btn.type = 'button';
        container.appendChild(btn);

        const doSearch = () => {
            const loc = input.value.trim();
            if (loc) {
                const url = `https://duckduckgo.com/?q=${encodeURIComponent(loc + " public library")}&ia=maps`;
                window.open(url, '_blank');
            }
        };

        btn.onclick = doSearch;
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

        return container;
    },

    inject: (widget) => {
        // 1. Force Float for Indigo
        const forceFloat = window.location.hostname.includes('indigo') ||
                           window.location.hostname.includes('chapters');

        if (forceFloat) {
            widget.classList.add('bb-fixed');
            document.body.appendChild(widget);
            return;
        }

        // 2. Try Standard Injection (Amazon, B&N, etc.)
        const targets = [
            document.getElementById('combinedBuyBox'),
            document.getElementById('unifiedBuyBox'),
            document.getElementById('buybox'),
            document.getElementById('mediaNoAccordion'),
            document.querySelector('.buy-box'),
            document.querySelector('#rightCol'),
            document.querySelector('.pdp-commerce-zone'),
            document.querySelector('.commerce-zone'),
            document.querySelector('.BookActions'),
            document.querySelector('.product-actions'),
            document.querySelector('.sidebar'),
            document.querySelector('.ItemPage-rightColumn'),
            document.querySelector('.add-to-cart-container'),
            document.querySelector('.product-sidebar')
        ];

        const target = targets.find(el => el && el.offsetParent !== null);

        if (target) {
            target.insertBefore(widget, target.firstChild);
        } else {
            widget.classList.add('bb-fixed');
            document.body.appendChild(widget);
        }
    }
};

window.UI = UI;
