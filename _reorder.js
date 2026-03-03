const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const mainStart = html.indexOf('<!-- MAIN -->');
const mainEnd = html.indexOf('<!-- FOOTER -->');

const beforeMain = html.substring(0, mainStart);
const mainContent = html.substring(mainStart, mainEnd);
const afterMain = html.substring(mainEnd);

const parts = mainContent.split('<!-- =====================================================');

// parts[0]: "<!-- MAIN -->\n    <main>\n\n        "
// Inspect parts to find indices
parts.forEach((p, i) => {
    if (i === 0) return;
    const title = p.trim().split('\n')[0].trim();
    console.log(`${i}: ${title}`);
});
