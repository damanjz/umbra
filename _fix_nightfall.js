const fs = require('fs');
let c = fs.readFileSync('products/nightfall-hoodie.html', 'utf8');

if (c.includes('pdp__spin-toggle')) {
    console.log('Already done');
    process.exit(0);
}

// Match multiline pdp__main-img block
const regex = /<div class="pdp__main-img">([\s\S]*?)<\/div>/;
const match = c.match(regex);
if (!match) {
    console.log('No match found');
    process.exit(1);
}

const imgTag = match[1].trim();
const srcMatch = imgTag.match(/src="([^"]+)"/);
const src = srcMatch[1];

const replacement = `<div class="pdp__main-img">${imgTag}
                            <div class="pdp__3d-wrap">
                                <div class="pdp__3d-spin">
                                    <img src="${src}" alt="3D View">
                                </div>
                                <div class="pdp__3d-reflection"></div>
                            </div>
                            <button class="pdp__spin-toggle" type="button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9" /><polyline points="21 3 21 9 15 9"/></svg> 360\u00b0 View
                            </button>
                        </div>`;

c = c.replace(regex, replacement);
fs.writeFileSync('products/nightfall-hoodie.html', c);
console.log('Fixed nightfall-hoodie.html');
