const fs = require('fs');
const path = require('path');

const prodDir = 'products';
const prodFiles = fs.readdirSync(prodDir).filter(f => f.endsWith('.html'));

prodFiles.forEach(f => {
    const filepath = path.join(prodDir, f);
    let c = fs.readFileSync(filepath, 'utf8');

    // Skip if already injected
    if (c.includes('pdp__spin-toggle')) {
        console.log('Already has spin:', f);
        return;
    }

    // 1. Extract the main image src from <div class="pdp__main-img">
    const mainImgMatch = c.match(/<div class="pdp__main-img">\s*<img src="([^"]+)"/);
    if (!mainImgMatch) {
        console.log('No main image found in', f);
        return;
    }
    const imgSrc = mainImgMatch[1];
    const imgAlt = c.match(/<div class="pdp__main-img">\s*<img[^>]*alt="([^"]*)"/);
    const alt = imgAlt ? imgAlt[1] : 'Product';

    // 2. Replace the pdp__main-img block to include 3D spin elements
    const oldMainImg = `<div class="pdp__main-img">
                            <img src="${imgSrc}" alt="${alt}" id="mainImage">
                        </div>`;

    const newMainImg = `<div class="pdp__main-img">
                            <img src="${imgSrc}" alt="${alt}" id="mainImage">
                            <div class="pdp__3d-wrap">
                                <div class="pdp__3d-spin">
                                    <img src="${imgSrc}" alt="${alt} — 3D View">
                                </div>
                                <div class="pdp__3d-reflection"></div>
                            </div>
                            <button class="pdp__spin-toggle" type="button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9" /><polyline points="21 3 21 9 15 9"/></svg> 360° View
                            </button>
                        </div>`;

    if (c.includes(oldMainImg)) {
        c = c.replace(oldMainImg, newMainImg);
        fs.writeFileSync(filepath, c);
        console.log('Injected 3D spin into', f);
    } else {
        // Try a more flexible regex match
        const regex = /<div class="pdp__main-img">\s*<img src="[^"]*" alt="[^"]*" id="mainImage">\s*<\/div>/;
        if (regex.test(c)) {
            c = c.replace(regex, newMainImg);
            fs.writeFileSync(filepath, c);
            console.log('Injected 3D spin (regex) into', f);
        } else {
            console.log('Could not match main-img block in', f);
        }
    }
});
