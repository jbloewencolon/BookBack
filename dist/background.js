// background.js - Service Worker & Tab Orchestrator

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

// LISTENER: Handles opening multiple library tabs to avoid popup blockers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openLibraries" && message.libraries && message.query) {
        
        message.libraries.forEach((lib, index) => {
            let url = lib.searchUrl;
            if (!url) return;

            // 1. Normalize URL Protocol
            if (!url.match(/^https?:\/\//)) {
                url = 'https://' + url;
            }

            // 2. Insert Query
            if (url.includes('{{query}}')) {
                url = url.replace('{{query}}', message.query);
            } else {
                const sep = url.includes('?') ? '&' : '?';
                url = `${url}${sep}q=${message.query}`;
            }

            // 3. Create Tab
            // We set 'active: true' only for the first library so the user 
            // is taken to the first result, but others open in the background.
            chrome.tabs.create({ 
                url: url, 
                active: (index === 0) 
            });
        });
    }
});