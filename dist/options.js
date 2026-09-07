// options.js - Library connection settings

document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('libraryList');
    const input = document.getElementById('newLibraryUrl');
    const status = document.getElementById('status');
    const detectBtn = document.getElementById('detectBtn');
    const manualBtn = document.getElementById('manualBtn');
    const manualHint = document.getElementById('manualHint');

    const setStatus = (message = '', tone = '') => {
        status.textContent = message;
        status.dataset.tone = tone;
    };

    const parseHttpUrl = (value) => {
        try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol) ? url : null;
        } catch {
            return null;
        }
    };

    const getStoredLibraries = async () => {
        try {
            const store = await chrome.storage.local.get(['libraries']);
            return Array.isArray(store.libraries) ? store.libraries : [];
        } catch (error) {
            console.error('Storage error:', error);
            setStatus('We couldn’t load your libraries. Reopen BookBack and try again.', 'error');
            return [];
        }
    };

    const saveLibraries = async (libraries) => {
        await chrome.storage.local.set({ libraries });
    };

    const libraryName = (searchUrl) => {
        const parsed = parseHttpUrl(searchUrl.replace('{{query}}', 'book'));
        return parsed ? parsed.hostname.replace(/^www\./, '') : 'Custom library template';
    };

    const refreshList = async () => {
        const libraries = await getStoredLibraries();
        list.replaceChildren();

        if (libraries.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty';
            empty.textContent = 'No libraries connected yet.';
            list.appendChild(empty);
            return;
        }

        libraries.forEach((lib, index) => {
            const row = document.createElement('div');
            row.className = 'lib-row';

            const meta = document.createElement('div');
            meta.className = 'lib-meta';
            const name = document.createElement('span');
            name.className = 'lib-name';
            name.textContent = libraryName(lib.searchUrl);

            const urlInput = document.createElement('input');
            urlInput.type = 'url';
            urlInput.value = lib.searchUrl;
            urlInput.className = 'lib-edit';
            urlInput.dataset.idx = index;
            urlInput.setAttribute('aria-label', `Search template for ${name.textContent}`);
            urlInput.spellcheck = false;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'lib-remove';
            removeBtn.dataset.idx = index;
            removeBtn.textContent = '×';
            removeBtn.title = 'Remove library';
            removeBtn.setAttribute('aria-label', `Remove ${name.textContent}`);

            urlInput.addEventListener('change', async (event) => {
                const newUrl = event.target.value.trim();
                if (!parseHttpUrl(newUrl.replace('{{query}}', 'book'))) {
                    setStatus('Enter a complete URL beginning with http:// or https://.', 'error');
                    event.target.value = libraries[index].searchUrl;
                    event.target.focus();
                    return;
                }
                libraries[index].searchUrl = newUrl;
                await saveLibraries(libraries);
                name.textContent = libraryName(newUrl);
                setStatus('Library changes saved.', 'success');
            });

            removeBtn.addEventListener('click', async () => {
                const removedName = name.textContent;
                libraries.splice(index, 1);
                await saveLibraries(libraries);
                await refreshList();
                setStatus(`${removedName} removed.`, 'success');
            });

            meta.append(name, urlInput);
            row.append(meta, removeBtn);
            list.appendChild(row);
        });
    };

    await refreshList();

    const connectLibrary = async () => {
        const rawUrl = input.value.trim();
        const parsed = parseHttpUrl(rawUrl);
        if (!parsed) {
            setStatus('Paste a complete URL beginning with http:// or https://.', 'error');
            input.focus();
            return;
        }

        const duneMatch = rawUrl.match(/dune/i);
        if (!duneMatch) {
            setStatus('This URL doesn’t include “Dune.” Copy the URL after searching your library catalog for Dune.', 'error');
            input.focus();
            return;
        }

        detectBtn.disabled = true;
        detectBtn.textContent = 'Connecting…';
        setStatus('Creating your library search…');

        try {
            const template = rawUrl.replace(/dune/ig, '{{query}}');
            const libraries = await getStoredLibraries();
            if (libraries.some((library) => library.searchUrl === template)) {
                setStatus('This library is already connected.', 'error');
                return;
            }
            libraries.push({ searchUrl: template });
            await saveLibraries(libraries);
            input.value = '';
            await refreshList();
            setStatus(`${libraryName(template)} connected.`, 'success');
        } catch (error) {
            console.error(error);
            setStatus('We couldn’t connect this library. Try again.', 'error');
        } finally {
            detectBtn.disabled = false;
            detectBtn.textContent = 'Connect library';
        }
    };

    detectBtn.addEventListener('click', connectLibrary);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') connectLibrary();
    });

    manualBtn.addEventListener('click', async () => {
        try {
            const libraries = await getStoredLibraries();
            libraries.push({ searchUrl: 'https://mylibrary.org/search?q={{query}}' });
            await saveLibraries(libraries);
            await refreshList();
            manualHint.hidden = false;
            const fields = list.querySelectorAll('.lib-edit');
            fields[fields.length - 1]?.focus();
            setStatus('Template added. Edit the URL to match your catalog.', 'success');
        } catch (error) {
            console.error(error);
            setStatus('We couldn’t add a template. Try again.', 'error');
        }
    });

});
