// ==UserScript==
// @name         WarEra styles
// @namespace    http://tampermonkey.net/
// @version      2026-03-16
// @description  try to take over the world!
// @author       Wolverine
// @match        https://app.warera.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=warera.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const updateViewport = () => {
        // Find the specific meta tag
        const viewport = document.querySelector('meta[name="viewport"][data-next-head]');

        if (viewport) {
            let content = viewport.getAttribute('content');

            // Check if initial-scale exists and update it, or append it if missing
            if (content.includes('initial-scale=')) {
                content = content.replace(/initial-scale=[^,]+/, 'initial-scale=0.6');
            } else {
                content += ', initial-scale=0.6';
            }

            viewport.setAttribute('content', content);
        }
    };

    // Run immediately
    updateViewport();

    // Optional: Observe changes in case the framework (like Next.js) re-renders the head
    const observer = new MutationObserver(updateViewport);
    observer.observe(document.head, { childList: true, subtree: true });
})();
