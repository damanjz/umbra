const fs = require('fs');
const path = require('path');

const prodDir = 'products';
if (fs.existsSync(prodDir)) {
    const prodFiles = fs.readdirSync(prodDir).filter(f => f.endsWith('.html'));

    prodFiles.forEach(f => {
        const filepath = path.join(prodDir, f);
        let c = fs.readFileSync(filepath, 'utf8');

        // Check if we already wrapped it
        if (!c.includes('<div class="pdp__title-row">')) {
            // Find the h1 and the fav button and wrap them
            const searchPattern = /(<h1 class="pdp__title">.*?<\/h1>)\s*(<button class="pdp__fav-btn" id="pdpFavBtn".*?<\/button>)/;
            c = c.replace(
                searchPattern,
                `<div class="pdp__title-row">
                            $1
                            $2
                        </div>`
            );
            fs.writeFileSync(filepath, c);
            console.log('Wrapped title row in', f);
        }
    });
}
