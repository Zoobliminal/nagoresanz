const fs = require('fs');

async function scrape() {
    try {
        const res = await fetch('https://www.onlinewebfonts.com/search?q=Gubia');
        const text = await res.text();
        // find font download page links
        const links = [...text.matchAll(/href=\"(\/download\/[^\"]+)\"/g)].map(m => m[1]);
        console.log("Links found:", links.slice(0, 10));
    } catch (e) {
        console.error(e);
    }
}
scrape();
