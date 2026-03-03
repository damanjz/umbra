const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const mainStart = html.indexOf('<!-- MAIN -->');
const mainEnd = html.indexOf('<!-- FOOTER -->');

const beforeMain = html.substring(0, mainStart);
const mainContent = html.substring(mainStart, mainEnd);
const afterMain = html.substring(mainEnd);

const parts = mainContent.split('<!-- =====================================================');

// Expected:
// 0: prefix
// 1: HERO
// 2: MISSION
// 3: STATS
// 4: VALUES
// 5: PRODUCTS
// 6: TESTIMONIALS
// 7: CATEGORIES
// 8: NEWSLETTER

const newParts = [
    parts[0],
    parts[1], // HERO
    parts[7], // CATEGORIES
    parts[5], // PRODUCTS
    parts[6], // TESTIMONIALS
    parts[2], // MISSION
    parts[3], // STATS
    parts[4], // VALUES
    parts[8]  // NEWSLETTER
];

const newMainContent = newParts.join('<!-- =====================================================');
const newHtml = beforeMain + newMainContent + afterMain;

fs.writeFileSync('index.html', newHtml);
console.log('Reordered successfully!');
