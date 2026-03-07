const fs = require('fs');
const https = require('https');
const path = require('path');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
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

async function searchAndDownload() {
    console.log("Downloading fonts...");
    const destDir = path.join(__dirname, 'public', 'fonts');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Based on the URL structures of some free providers:
    // OnlineWebFonts: https://db.onlinewebfonts.com/c/b0a6daff55bc14db0b83dd60a87612f0?family=Gubia
    // Unfortunately we don't have the exact hash.
    // Let's use dafonttop or fontke API or just try to download an open source alternative that looks exactly the same if we can't get Gubia, wait, the user said "descarga y aplica esta familia de fonts".
    // I can do a google search with `search_web` to find the direct download link for the zip file.
}
searchAndDownload();
