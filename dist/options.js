// options.js - Reverse Engineering Strategy (Refactored)

document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('libraryList');
    const input = document.getElementById('newLibraryUrl');
    const status = document.getElementById('status');
    const detectBtn = document.getElementById('detectBtn');
    const manualBtn = document.getElementById('manualBtn');
    const manualHint = document.getElementById('manualHint');

    const getStoredLibraries = async () => {
        try {
            const store = await chrome.storage.local.get(['libraries']);
            return store.libraries || [];
        } catch (e) {
            console.error("Storage Error:", e);
            status.innerText = "Error loading settings.";
            status.style.color = "red";
            return [];
        }
    };

    const refreshList = async () => {
        const libraries = await getStoredLibraries();
        
        list.innerHTML = '';
        libraries.forEach((lib, idx) => {
            const div = document.createElement('div');
            div.className = 'lib-row';
            
            // SECURITY FIX: Create elements individually to avoid innerHTML injection
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.value = lib.searchUrl; // Safe assignment
            urlInput.className = 'lib-edit';
            urlInput.dataset.idx = idx;
            urlInput.ariaLabel = "Library Search URL";

            const removeBtn = document.createElement('button');
            removeBtn.className = 'lib-remove';
            removeBtn.dataset.idx = idx;
            removeBtn.textContent = 'X';
            removeBtn.ariaLabel = `Remove library template for ${lib.searchUrl}`;

            // Bind Events directly
            urlInput.addEventListener('change', async (e) => {
                const newUrl = e.target.value.trim();
                // Basic Validation
                if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                    status.innerText = "Error: URL must start with http:// or https://";
                    status.style.color = "red";
                    return;
                }
                libraries[idx].searchUrl = newUrl;
                await chrome.storage.local.set({ libraries });
                status.innerText = "Saved change.";
                setTimeout(() => status.innerText = "", 1500);
            });

            removeBtn.onclick = async () => {
                libraries.splice(idx, 1);
                await chrome.storage.local.set({ libraries });
                refreshList();
            };

            div.appendChild(urlInput);
            div.appendChild(removeBtn);
            list.appendChild(div);
        });
    };
    
    refreshList();

    detectBtn.onclick = async () => {
        try {
            status.innerText = "Processing...";
            status.style.color = "blue";

            let url = input.value.trim();
            
            if (!url) {
                status.innerText = "Please paste a URL first.";
                status.style.color = "red";
                return;
            }

            // SECURITY FIX: Protocol Validation
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                status.innerText = "Error: URL must start with http:// or https://";
                status.style.color = "red";
                return;
            }

            if (url.match(/dune/i)) {
                const template = url.replace(/dune/i, '{{query}}');
                const libraries = await getStoredLibraries();
                libraries.push({ searchUrl: template });
                await chrome.storage.local.set({ libraries });

                status.innerText = "Success! Library Connected.";
                status.style.color = "green";
                input.value = '';
                refreshList();

            } else {
                status.innerText = "Error: URL must contain 'Dune'.";
                status.style.color = "red";
            }
        } catch (e) {
            console.error(e);
            status.innerText = "Error: " + e.message;
            status.style.color = "red";
        }
    };

    manualBtn.onclick = async () => {
        try {
            const libraries = await getStoredLibraries();
            libraries.push({ searchUrl: "https://mylibrary.org/search?q={{query}}" });
            await chrome.storage.local.set({ libraries });
            refreshList();
            manualHint.style.display = 'block';
        } catch (e) {
            status.innerText = "Error adding row.";
        }
    };
});