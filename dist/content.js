// content.js - The Persistent Orchestrator

(async function() {
    // 1. Dependency Check
    if (!window.BookScanner || !window.UI) return;

    // State Tracking
    let currentUrl = location.href;
    let widgetInjected = false;

    // 2. Main Logic Runner
    const run = async () => {
        // A. SPA Check: If URL changed, reset everything
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            const existing = document.getElementById('bookback-widget');
            if (existing) existing.remove();
            widgetInjected = false;
        }

        // B. Optimization: If already injected on this specific URL, stop.
        if (widgetInjected && document.getElementById('bookback-widget')) return;

        // C. Detection & Injection
        if (!window.BookScanner.isBookPage()) return;

        const details = window.BookScanner.extract();
        
        if (details) {
            const store = await chrome.storage.local.get(['libraries']);
            const libraries = store.libraries || [];

            // Create Widget (Find libraries or show finder)
            const widget = (libraries.length > 0) 
                ? window.UI.createWidget(details, libraries)
                : window.UI.createFinder();

            window.UI.inject(widget);
            widgetInjected = true;
        }
    };

    // 3. MutationObserver
    // Watch for dynamic content changes (Buy Box loading late, SPA navigation)
    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            run();
        }, 500);
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

    // 4. Initial Run
    await run();

})();