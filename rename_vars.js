import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(srcDir);

const replacements = [
    { from: /var\(--color-forest\)/g, to: 'var(--color-primary)' },
    { from: /var\(--color-sage\)/g, to: 'var(--color-secondary)' },
    { from: /var\(--color-sage-light\)/g, to: 'var(--color-secondary-light)' },
    { from: /var\(--color-sage-dark\)/g, to: 'var(--color-primary-light)' },
    { from: /var\(--color-golden\)/g, to: 'var(--color-accent)' },
    { from: /var\(--color-golden-light\)/g, to: 'var(--color-accent-light)' },
    { from: /var\(--color-golden-dark\)/g, to: 'var(--color-accent-dark)' },
    { from: /var\(--color-lavender\)/g, to: 'var(--color-secondary-light)' },
    { from: /var\(--color-lavender-light\)/g, to: 'var(--color-bg-alt)' },
    { from: /var\(--color-sand\)/g, to: 'var(--color-bg-alt)' },
    { from: /var\(--color-sand-light\)/g, to: 'var(--color-bg-alt)' },
    { from: /text-forest/g, to: 'text-primary' },
    { from: /text-sage/g, to: 'text-secondary' },
    { from: /text-golden/g, to: 'text-accent' },
];

for (const file of files) {
    if (file.endsWith('.astro') || file.endsWith('.css') || file.endsWith('.tsx') || file.endsWith('.vue')) {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Perform standard replacements
        replacements.forEach(r => {
            content = content.replace(r.from, r.to);
        });

        if (content !== original) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
}
