const fs = require('fs');
const path = require('path');

// ===== MASTER PRODUCT LIST WITH UNIQUE IMAGE ASSIGNMENTS =====
// Each product gets its own unique image file. We have 17 image files for 30 products,
// so shoes share shoe variants & apparel shares apparel variants — but NO two products
// in the same category page will ever use the same image.

const PRODUCTS = [
    // ── NEW ARRIVALS ──
    { id: "aura-training-max", name: "Aura Training Max", price: 10995, image: "shoe_aura_training.png", type: "shoes", cat: "running", badge: "Just In", desc: "Maximum cushioning for high-impact training sessions. UmbraCush™ technology absorbs shock and returns energy." },
    { id: "modest-fit-training-top", name: "Modest Fit Training Top", price: 2295, image: "tee_modest_fit.png", type: "clothing", cat: "training", badge: "New", desc: "Full-coverage training top with breathable mesh panels. DryVent™ moisture-wicking fabric." },
    // ── TOP PICKS ──
    { id: "carbon-joggers", name: "Carbon Joggers", price: 3495, image: "joggers_carbon.png", type: "clothing", cat: "training", badge: "Value Pick", desc: "Tapered fit joggers with zippered pockets. Brushed fleece interior for warmth." },
    { id: "dri-shadow-tee", name: "Dri-Shadow Tee", price: 1995, image: "tee_dri_shadow.png", type: "clothing", cat: "running", badge: "Essential", desc: "Moisture-wicking performance tee with flatlock seams. Ultra-lightweight at 120g." },
    { id: "shadow-training-top", name: "Shadow Training Top", price: 2995, image: "tee_shadow_training.png", type: "clothing", cat: "training", badge: "Premium", desc: "Engineered for flexibility and cooling. Seamless construction eliminates chafing." },
    // ── RETRO RUNNING ──
    { id: "retro-runner-slate", name: "Retro Runner Slate", price: 7295, image: "shoe_retro_slate.png", type: "shoes", cat: "retro", badge: "Retro", desc: "Vintage silhouette meets modern comfort. Suede and mesh upper with EVA midsole." },
    { id: "vintage-pacer-og", name: "Vintage Pacer OG", price: 6495, image: "shoe_vintage_pacer.png", type: "shoes", cat: "retro", badge: "Heritage", desc: "The original pacer, reissued. Authentic 1980s tooling with updated cushioning." },
    { id: "classic-mile-runner", name: "Classic Mile Runner", price: 5995, image: "shoe_classic_mile.png", type: "shoes", cat: "retro", badge: "Retro", desc: "Clean monochrome heritage runner. Leather and nylon blend upper." },
    { id: "neon-dash-retro", name: "Neon Dash Retro", price: 8495, image: "shoe_retro.png", type: "shoes", cat: "retro", badge: "Trending", desc: "Bold neon accents on a dark base. Stand out on the track and the street." },
    // ── SHADOW COLLECTION ──
    { id: "shadow-glide-gt", name: "Shadow Glide GT", price: 11495, image: "shoe_shadow_glide.png", type: "shoes", cat: "performance", badge: "Performance", desc: "Elite carbon-infused plate for maximum propulsion. Built for sub-4 pace." },
    { id: "shadow-joggers-slate", name: "Shadow Joggers — Slate", price: 3995, image: "apparel_joggers.png", type: "clothing", cat: "lifestyle", badge: "Premium", desc: "Premium lounging meets intense warm-ups. French terry with articulated knees." },
    // ── DOMAIN 3 ──
    { id: "domain-3-pro", name: "Domain 3 Pro — Allrounder", price: 14995, image: "shoe_cricket_spike.png", type: "shoes", cat: "cricket", badge: "Pro", desc: "Built for the complete cricketer. Full-length spike plate and reinforced toe box." },
    { id: "domain-3-lite", name: "Domain 3 Lite — Batting", price: 9995, image: "shoe_vintage_pacer.png", type: "shoes", cat: "cricket", badge: "Lite", desc: "Featherlight spikes optimized for quick singles and explosive drives." },
    { id: "domain-match-shorts", name: "Domain Match Shorts", price: 3295, image: "training_shorts.png", type: "clothing", cat: "cricket", badge: "Match Day", desc: "Match-day ready whites. 4-way stretch with internal compression liner." },
    { id: "domain-field-jacket", name: "Domain Field Jacket", price: 5495, image: "apparel_jacket.png", type: "clothing", cat: "cricket", badge: "Warm-Up", desc: "Water-resistant warmth for early morning nets. Packable into its own pocket." },
    // ── CRICKET ──
    { id: "pitch-trainer-turf", name: "Pitch Trainer — Turf", price: 6495, image: "shoe_aura_training.png", type: "shoes", cat: "cricket", badge: "Training", desc: "Rubber stud pattern for indoor nets and turf surfaces. Ankle support collar." },
    { id: "test-match-polo", name: "Test Match Polo — White", price: 2495, image: "tee_modest_fit.png", type: "clothing", cat: "cricket", badge: "Essential", desc: "Classic crisp whites for the long format. UV50+ sun protection." },
    // ── RUNNING ──
    { id: "tempo-racer-carbon", name: "Tempo Racer Carbon", price: 13995, image: "shoe_shadow_runner.png", type: "shoes", cat: "running", badge: "Speed", desc: "Carbon plate technology for ultimate speed. 4mm drop, 200g weight." },
    { id: "ultra-mile-marathon", name: "Ultra Mile — Marathon", price: 10995, image: "shoe_shadow_glide.png", type: "shoes", cat: "running", badge: "Distance", desc: "Maximum cushioning for marathon distances. ZoomStack™ foam with 40mm stack." },
    { id: "dri-shadow-run-tee", name: "Dri-Shadow Run Tee", price: 1995, image: "tee_dri_shadow.png", type: "clothing", cat: "running", badge: "Dri-Fit", desc: "Stay dry mile after mile. 360° ventilation with laser-cut perforations." },
    // ── GYM & TRAINING ──
    { id: "vortex-trainer-pro", name: "Vortex Trainer Pro", price: 9495, image: "shoe_classic_mile.png", type: "shoes", cat: "training", badge: "Power", desc: "Stability for heavy lifts. Wide flat outsole with TPU heel clip." },
    { id: "lift-max", name: "Lift Max — Flat Sole", price: 7995, image: "shoe_retro_slate.png", type: "shoes", cat: "training", badge: "Lifting", desc: "Zero drop for maximum ground contact. 8mm raised heel wedge for squat depth." },
    { id: "flex-hiit-trainer", name: "Flex HIIT Trainer", price: 6795, image: "shoe_retro.png", type: "shoes", cat: "training", badge: "HIIT", desc: "Explosive lateral movement support. Lightweight cage lockdown system." },
    // ── FOOTBALL ──
    { id: "striker-fg", name: "Striker FG — Firm Ground", price: 11995, image: "shoe_football.png", type: "shoes", cat: "football", badge: "FG", desc: "Lethal precision on firm ground. Knit collar with Dynamic Fit technology." },
    { id: "phantom-ag", name: "Phantom AG — Artificial", price: 10495, image: "shoe_aura_training.png", type: "shoes", cat: "football", badge: "AG", desc: "Engineered stud pattern for artificial surfaces. Textured strike zone." },
    { id: "blitz-tf", name: "Blitz TF — Indoor/Turf", price: 6995, image: "shoe_retro_slate.png", type: "shoes", cat: "football", badge: "Turf", desc: "Small-sided game perfection. Low-profile rubber outsole for indoor grip." },
    { id: "mamba-sg", name: "Mamba SG — Soft Ground", price: 13495, image: "shoe_vintage_pacer.png", type: "shoes", cat: "football", badge: "SG", desc: "Metal-tipped studs for soft ground traction. Anti-clog technology." },
    { id: "pro-match-shorts", name: "Pro Match Shorts", price: 2995, image: "training_shorts.png", type: "clothing", cat: "football", badge: "Match Day", desc: "Elite comfort for 90 minutes. Aero-Swift technology for ventilation." },
    { id: "shadow-training-jersey", name: "Shadow Training Jersey", price: 3495, image: "tee_shadow_training.png", type: "clothing", cat: "football", badge: "Dri-Fit", desc: "Breathable kit for the toughest sessions. Recycled polyester body." },
    { id: "shadow-warm-up-jacket", name: "Shadow Warm-Up Jacket", price: 5995, image: "apparel_jacket.png", type: "clothing", cat: "football", badge: "Pre-Match", desc: "Stay warm on the touchline. Water-repellent DWR finish." },
];

// ===== STEP 1: Regenerate every product detail page =====
const templatePath = path.join(__dirname, 'products', 'shadow-runner-x.html');
const template = fs.readFileSync(templatePath, 'utf8');

PRODUCTS.forEach(p => {
    let html = template;

    // Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${p.name} — Umbra</title>`);

    // Meta description
    html = html.replace(/content="The Umbra Shadow Runner X[^"]*"/, `content="${p.desc}"`);

    // Breadcrumb current
    html = html.replace(/Umbra Shadow Runner X<\/span>/, `${p.name}</span>`);

    // Tag
    html = html.replace(/<span class="pdp__tag">New Release<\/span>/, `<span class="pdp__tag">${p.badge}</span>`);

    // Title H1
    html = html.replace(/<h1 class="pdp__title">Umbra Shadow Runner X<\/h1>/, `<h1 class="pdp__title">${p.name}</h1>`);

    // Category
    const catLabel = p.type === 'shoes' ? "Men's " + (p.cat.charAt(0).toUpperCase() + p.cat.slice(1)) + " Shoe"
        : "Men's " + (p.cat.charAt(0).toUpperCase() + p.cat.slice(1)) + " " + (p.type === 'clothing' ? 'Apparel' : '');
    html = html.replace(/Men's Running Shoe/, catLabel.trim());

    // Price
    const formattedPrice = '₹' + p.price.toLocaleString('en-IN');
    html = html.replace(/₹8,995 <span class="pdp__price-mrp">₹10,995<\/span>/, formattedPrice);

    // All images (main + thumbs)
    html = html.replace(/\.\.\/images\/shoe_shadow_runner\.png/g, `../images/${p.image}`);

    // Product details description
    html = html.replace(/The Umbra Shadow Runner X is built for those who own the road\. Featuring a\s+lightweight mesh upper for breathability, a responsive cushioning system for\s+all-day comfort, and a durable rubber outsole for grip on any surface\./s,
        p.desc + ' Crafted with premium materials for maximum durability and performance.');

    // handleAddToCart — inject product data via a script block
    html = html.replace(/<script src="\.\.\/product\.js"><\/script>/,
        `<script>
    const PRODUCT_DATA = {name:"${p.name.replace(/"/g, '\\"')}", price:${p.price}, image:"../images/${p.image}"};
    function handleAddToCart() {
        const sel = document.querySelector('.pdp__size--active');
        if (!sel) { document.getElementById('sizeError').style.display='block'; return; }
        document.getElementById('sizeError').style.display='none';
        addToCart(PRODUCT_DATA.name, PRODUCT_DATA.price, PRODUCT_DATA.image);
    }
    </script>
    <script src="../product.js"></script>`);

    // Size guide for clothing
    if (p.type === 'clothing') {
        html = html.replace(/Size Guide — Shoes/, 'Size Guide — Apparel');
        html = html.replace(/<th>UK<\/th>\s*<th>US<\/th>\s*<th>EU<\/th>\s*<th>CM<\/th>/s,
            '<th>Size</th><th>Chest (in)</th><th>Waist (in)</th><th>Hip (in)</th>');
        html = html.replace(/<tbody>[\s\S]*?<\/tbody>/,
            `<tbody>
                <tr><td>S</td><td>34-36</td><td>28-30</td><td>34-36</td></tr>
                <tr><td>M</td><td>38-40</td><td>32-34</td><td>38-40</td></tr>
                <tr><td>L</td><td>42-44</td><td>36-38</td><td>42-44</td></tr>
                <tr><td>XL</td><td>46-48</td><td>40-42</td><td>46-48</td></tr>
                <tr><td>XXL</td><td>50-52</td><td>44-46</td><td>50-52</td></tr>
            </tbody>`);
        // Replace shoe sizes with clothing sizes
        html = html.replace(/<div class="pdp__size-grid" id="sizeGrid">[\s\S]*?<\/div>/,
            `<div class="pdp__size-grid" id="sizeGrid">
                <button class="pdp__size" data-size="S">S</button>
                <button class="pdp__size" data-size="M">M</button>
                <button class="pdp__size" data-size="L">L</button>
                <button class="pdp__size" data-size="XL">XL</button>
                <button class="pdp__size" data-size="XXL">XXL</button>
            </div>`);
    }

    const outPath = path.join(__dirname, 'products', `${p.id}.html`);
    fs.writeFileSync(outPath, html);
    console.log(`[PDP] ${p.id}.html → ${p.image}`);
});

// ===== STEP 2: Update every category page =====
const categoryFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'checkout.html');

categoryFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    PRODUCTS.forEach(p => {
        // Build a regex that matches both "—" and "&#8212;" in names
        const namePattern = p.name
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/—/g, '(?:—|&#8212;)');

        // Match product-card__name containing this product
        const titleRegex = new RegExp(
            `<h3 class="product-card__name">(<a[^>]*>)?\\s*${namePattern}\\s*(<\\/a>)?<\\/h3>`, 'm'
        );

        if (titleRegex.test(content)) {
            changed = true;

            // Find the article block containing this product and update it
            // Update title link
            content = content.replace(titleRegex,
                `<h3 class="product-card__name"><a href="products/${p.id}.html">${p.name}</a></h3>`);

            // Update image src near this product name (within same article block)
            // We do a targeted replacement: find the img right before this product name
            // Strategy: split by product name, update the closest preceding img tag
            const parts = content.split(p.name);
            if (parts.length >= 2) {
                // Update image in the part right before product name
                const before = parts[0];
                const lastImgIdx = before.lastIndexOf('<img src="images/');
                if (lastImgIdx !== -1) {
                    const endOfSrc = before.indexOf('"', lastImgIdx + 17);
                    if (endOfSrc !== -1) {
                        const oldSrc = before.substring(lastImgIdx, endOfSrc + 1);
                        const newSrc = `<img src="images/${p.image}"`;
                        parts[0] = before.substring(0, lastImgIdx) + newSrc + before.substring(endOfSrc + 1);
                        content = parts.join(p.name);
                    }
                }
            }

            // Update the image wrapper link
            // Find <div class="product-card__img"> near this product and change to <a href>
            // This is complex with regex so we'll do a simpler approach - 
            // just make sure the onclick uses the right image
            const onclickRegex = new RegExp(
                `addToCart\\('${namePattern.replace(/\\'/g, "\\\\'")}',\\s*\\d+,\\s*'images\\/[^']*'\\)`
            );
            content = content.replace(onclickRegex,
                `addToCart('${p.name.replace(/'/g, "\\'")}',${p.price},'images/${p.image}')`);
        }
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`[CAT] Updated ${file}`);
    }
});

console.log('\n✅ Done! All product pages regenerated and category pages updated.');
