const fs = require('fs');
const path = require('path');

const prodDir = 'products';
const files = ['domain-3-cricket-spike.html', 'eclipse-training-shorts.html', 'nightfall-hoodie.html'];

files.forEach(f => {
    const filepath = path.join(prodDir, f);
    let c = fs.readFileSync(filepath, 'utf8');

    if (c.includes('pdp__spin-toggle')) {
        console.log('Already done:', f);
        return;
    }

    // Match the single-line pattern: <div class="pdp__main-img"><img src="..." alt="..." id="mainImage"></div>
    const regex = /<div class="pdp__main-img">(<img src="([^"]+)"\s*alt="([^"]*)" id="mainImage">)<\/div>/;
    const match = c.match(regex);
    if (!match) {
        console.log('Could not match in', f);
        return;
    }

    const imgTag = match[1];
    const imgSrc = match[2];
    const imgAlt = match[3];

    const replacement = `<div class="pdp__main-img">
                            ${imgTag}
                            <div class="pdp__3d-wrap">
                                <div class="pdp__3d-spin">
                                    <img src="${imgSrc}" alt="${imgAlt} — 3D View">
                                </div>
                                <div class="pdp__3d-reflection"></div>
                            </div>
                            <button class="pdp__spin-toggle" type="button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9" /><polyline points="21 3 21 9 15 9"/></svg> 360° View
                            </button>
                        </div>`;

    c = c.replace(regex, replacement);
    fs.writeFileSync(filepath, c);
    console.log('Fixed:', f);
});
