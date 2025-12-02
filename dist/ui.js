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
        
        // --- Header ---
        const header = UI.el('div', 'bb-header');
        header.appendChild(UI.el('div', 'bb-logo', 'BOOKBACK'));
        
        const titleText = bookDetails.title.length > 60 
            ? bookDetails.title.substring(0, 60) + '...' 
            : bookDetails.title;
        
        const titleEl = UI.el('div', 'bb-book-title', titleText);
        header.appendChild(titleEl);
        container.appendChild(header);

        // --- Body ---
        const body = UI.el('div', 'bb-body');
        if (libraries.length > 1) {
            body.innerHTML = `Check <strong>${libraries.length} libraries</strong> for availability.`;
        } else {
            body.textContent = "Check your local library for availability.";
        }
        container.appendChild(body);

        // --- Button ---
        const btn = UI.el('a', 'bb-action-btn', 'Borrow It');
        btn.href = "#";
        container.appendChild(btn);

        // --- Logic (Last Name Search) ---
        btn.onclick = (e) => {
            e.preventDefault();
            
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

        const header = UI.el('div', 'bb-header');
        header.appendChild(UI.el('div', 'bb-logo', 'BOOKBACK'));
        header.appendChild(UI.el('div', 'bb-book-title', 'Support Public Libraries'));
        container.appendChild(header);

        const body = UI.el('div', 'bb-body', 'Enter your location to find a library near you:');
        container.appendChild(body);

        const input = UI.el('input', 'bb-input');
        input.type = 'text';
        input.placeholder = 'City, State or Zip';
        container.appendChild(input);

        const btn = UI.el('a', 'bb-action-btn bb-secondary', 'Find Library');
        btn.href = '#';
        container.appendChild(btn);

        const doSearch = () => {
            const loc = input.value.trim();
            if (loc) {
                const url = `https://duckduckgo.com/?q=${encodeURIComponent(loc + " public library")}&ia=maps`;
                window.open(url, '_blank');
            }
        };

        btn.onclick = (e) => { e.preventDefault(); doSearch(); };
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });

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