const fs = require('fs');
const path = require('path');

const PRODUCTS = [
    { id: "aura-training-max", name: "Aura Training Max", price: 10995, image: "shoe_shadow_runner.png", type: "shoes", desc: "Maximum cushioning for high impact training.", badge: "Just In" },
    { id: "modest-fit-training-top", name: "Modest Fit Training Top", price: 2295, image: "apparel_tee.png", type: "clothing", desc: "Breathable coverage for every workout.", badge: "Top Rated" },
    { id: "carbon-joggers", name: "Carbon Joggers", price: 3495, image: "apparel_joggers.png", type: "clothing", desc: "Tapered fit. Unrestricted movement.", badge: "Value Pick" },
    { id: "dri-shadow-tee", name: "Dri-Shadow Tee", price: 1995, image: "apparel_tee.png", type: "clothing", desc: "Moisture wicking performance tee.", badge: "Essential" },
    { id: "shadow-training-top", name: "Shadow Training Top", price: 2995, image: "apparel_tee.png", type: "clothing", desc: "Engineered for flexibility and cooling.", badge: "Premium" },
    { id: "retro-runner-slate", name: "Retro Runner Slate", price: 7295, image: "shoe_retro.png", type: "shoes", desc: "Vintage silhouette meets modern comfort.", badge: "Retro" },
    { id: "vintage-pacer-og", name: "Vintage Pacer OG", price: 6495, image: "shoe_retro.png", type: "shoes", desc: "Old school running DNA. Reborn.", badge: "Heritage" },
    { id: "classic-mile-runner", name: "Classic Mile Runner", price: 5995, image: "shoe_retro.png", type: "shoes", desc: "The everyday classic runner.", badge: "Retro" },
    { id: "neon-dash-retro", name: "Neon Dash Retro", price: 8495, image: "shoe_retro.png", type: "shoes", desc: "Stand out on the track.", badge: "Trending" },
    { id: "shadow-glide-gt", name: "Shadow Glide GT", price: 11495, image: "shoe_shadow_runner.png", type: "shoes", desc: "Elite performance for long distances.", badge: "Performance" },
    { id: "shadow-joggers-slate", name: "Shadow Joggers — Slate", price: 3995, image: "apparel_joggers.png", type: "clothing", desc: "Premium lounging or intense warm-ups.", badge: "Premium" },
    { id: "domain-3-pro", "name": "Domain 3 Pro — Allrounder", price: 14995, image: "shoe_cricket_spike.png", type: "shoes", desc: "Built for the complete cricketer.", badge: "Pro" },
    { id: "domain-3-lite", "name": "Domain 3 Lite — Batting", price: 9995, image: "shoe_cricket_spike.png", type: "shoes", desc: "Featherlight spikes for quick singles.", badge: "Lite" },
    { id: "domain-match-shorts", name: "Domain Match Shorts", price: 3295, image: "training_shorts.png", type: "clothing", desc: "Match-day ready whites.", badge: "Match Day" },
    { id: "domain-field-jacket", "name": "Domain Field Jacket", price: 5495, image: "apparel_jacket.png", type: "clothing", desc: "Protection from elements during warm-ups.", badge: "Warm-Up" },
    { id: "pitch-trainer-turf", name: "Pitch Trainer — Turf", price: 6495, image: "shoe_football.png", type: "shoes", desc: "Maximum grip for indoor sessions.", badge: "Training" },
    { id: "test-match-polo", name: "Test Match Polo — White", price: 2495, image: "apparel_tee.png", type: "clothing", desc: "Classic crisp whites for the long format.", badge: "Essential" },
    { id: "tempo-racer-carbon", name: "Tempo Racer Carbon", price: 13995, image: "shoe_shadow_runner.png", type: "shoes", desc: "Carbon plate technology for ultimate speed.", badge: "Speed" },
    { id: "ultra-mile-marathon", name: "Ultra Mile — Marathon", price: 10995, image: "shoe_shadow_runner.png", type: "shoes", desc: "Go farther than ever before.", badge: "Distance" },
    { id: "dri-shadow-run-tee", "name": "Dri-Shadow Run Tee", price: 1995, image: "apparel_tee.png", type: "clothing", desc: "Stay dry mile after mile.", badge: "Dri-Fit" },
    { id: "vortex-trainer-pro", name: "Vortex Trainer Pro", price: 9495, image: "shoe_shadow_runner.png", type: "shoes", desc: "Stability for heavy lifts.", badge: "Power" },
    { id: "lift-max", name: "Lift Max — Flat Sole", price: 7995, image: "shoe_shadow_runner.png", type: "shoes", desc: "Zero drop. Maximum contact.", badge: "Lifting" },
    { id: "flex-hiit-trainer", name: "Flex HIIT Trainer", price: 6795, image: "shoe_shadow_runner.png", type: "shoes", desc: "Explosive movement support.", badge: "HIIT" },
    { id: "striker-fg", name: "Striker FG — Firm Ground", price: 11995, image: "shoe_football.png", type: "shoes", desc: "Lethal precision on the pitch.", badge: "FG" },
    { id: "phantom-ag", "name": "Phantom AG — Artificial", price: 10495, image: "shoe_football.png", type: "shoes", desc: "Dominate artificial surfaces.", badge: "AG" },
    { id: "blitz-tf", "name": "Blitz TF — Indoor/Turf", price: 6995, image: "shoe_football.png", type: "shoes", desc: "Small-sided game perfection.", badge: "Turf" },
    { id: "mamba-sg", "name": "Mamba SG — Soft Ground", price: 13495, image: "shoe_football.png", type: "shoes", desc: "Traction when conditions get tough.", badge: "SG" },
    { id: "pro-match-shorts", name: "Pro Match Shorts", price: 2995, image: "training_shorts.png", type: "clothing", desc: "Elite comfort for 90 minutes.", badge: "Match Day" },
    { id: "shadow-training-jersey", "name": "Shadow Training Jersey", price: 3495, image: "apparel_tee.png", type: "clothing", desc: "Breathable kit for the toughest sessions.", badge: "Dri-Fit" },
    { id: "shadow-warm-up-jacket", name: "Shadow Warm-Up Jacket", price: 5995, image: "apparel_jacket.png", type: "clothing", desc: "Stay warm on the touchline.", badge: "Pre-Match" }
];

const templatePath = path.join(__dirname, 'products', 'shadow-runner-x.html');
const templateStr = fs.readFileSync(templatePath, 'utf8');

PRODUCTS.forEach(product => {
    let out = templateStr;

    // Replace title
    out = out.replace(/<title>.*?<\/title>/, `<title>${product.name} — Umbra</title>`);

    // Replace H1 name
    out = out.replace(/<h1 class="pdp__title">.*?<\/h1>/, `<h1 class="pdp__title">${product.name}</h1>`);

    // Replace price. Note: template has `<p class="pdp__price">MRP: <del>₹11,995</del> ₹8,995</p>`
    // Let's replace the whole price block to just show the price
    out = out.replace(/<p class="pdp__price">.*?<\/p>/s, `<p class="pdp__price">&#8377;${product.price.toLocaleString('en-IN')}</p>`);

    // Replace desc
    // Template: `<p class="pdp__desc">The pinnacle of Umbra's performance engineering...`
    out = out.replace(/<p class="pdp__desc">.*?<\/p>/s, `<p class="pdp__desc">${product.desc} Designed to elevate your game and push past boundaries.</p>`);

    // Replace badge
    // Template `<span class="pdp__badge">Just Dropped</span>`
    out = out.replace(/<span class="pdp__badge">.*?<\/span>/, `<span class="pdp__badge">${product.badge}</span>`);

    // Replace Images
    // Template uses `<img src="../images/shoe_shadow_runner.png"` in multiple places
    out = out.replace(/<img src="\.\.\/images\/shoe_shadow_runner\.png"/g, `<img src="../images/${product.image}"`);

    // Script addToCart injection
    // Template `<button class="btn btn--accent pdp__add-to-cart" onclick="addToCart('Shadow Runner X', 8995, '../images/shoe_shadow_runner.png')">`
    out = out.replace(/onclick="addToCart\('.*?', \d+, '.*?'\)"/, `onclick="addToCart('${product.name}', ${product.price}, '../images/${product.image}')"`);

    const outPath = path.join(__dirname, 'products', `${product.id}.html`);
    fs.writeFileSync(outPath, out);
    console.log(`Created ${product.id}.html`);
});
