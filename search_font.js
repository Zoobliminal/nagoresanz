const https = require('https');
const fs = require('fs');
const path = require('path');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return resolve(download(response.headers.location, dest));
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

// These are directly from onlinewebfonts where we can get the TTF format if we construct the URL
// Typically for onlinewebfonts, they host woff, woff2, ttf with hashes.
// For Gubia Light: 
// Let's use dafont101 or similar URL if we can find it. Given finding the exact URL programmatically is tough, I'll search github.

async function searchGithub() {
    const res = await fetch('https://api.github.com/search/code?q=Gubia-Regular.ttf', {
        headers: {
            'User-Agent': 'NodeApp'
        }
    });
    const d = await res.json();
    console.log(JSON.stringify(d, null, 2));
}

searchGithub();
