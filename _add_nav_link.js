const fs = require('fs');
const path = require('path');

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

rootFiles.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (!c.includes('<a href="shop-all.html">Shop All</a>')) {
        c = c.replace(
            /(<ul class="nav">)\s*(<li class="nav__item">)/,
            `$1
                <li class="nav__item"><a href="shop-all.html">Shop All</a></li>
                $2`
        );
        fs.writeFileSync(f, c);
        console.log('Added Shop All to nav in', f);
    }
});

const prodDir = 'products';
if (fs.existsSync(prodDir)) {
    const prodFiles = fs.readdirSync(prodDir).filter(f => f.endsWith('.html'));
    prodFiles.forEach(f => {
        const filepath = path.join(prodDir, f);
        let c = fs.readFileSync(filepath, 'utf8');
        if (!c.includes('<a href="../shop-all.html">Shop All</a>')) {
            c = c.replace(
                /(<ul class="nav">)\s*(<li class="nav__item">)/,
                `$1
                <li class="nav__item"><a href="../shop-all.html">Shop All</a></li>
                $2`
            );
            fs.writeFileSync(filepath, c);
            console.log('Added Shop All to nav in', f);
        }
    });
}
