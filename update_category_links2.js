const fs = require('fs');
const path = require('path');

const PRODUCTS = [
    { id: "aura-training-max", name: "Aura Training Max", price: 10995, image: "shoe_shadow_runner.png" },
    { id: "modest-fit-training-top", name: "Modest Fit Training Top", price: 2295, image: "apparel_tee.png" },
    { id: "carbon-joggers", name: "Carbon Joggers", price: 3495, image: "apparel_joggers.png" },
    { id: "dri-shadow-tee", name: "Dri-Shadow Tee", price: 1995, image: "apparel_tee.png" },
    { id: "shadow-training-top", name: "Shadow Training Top", price: 2995, image: "apparel_tee.png" },
    { id: "retro-runner-slate", name: "Retro Runner Slate", price: 7295, image: "shoe_retro.png" },
    { id: "vintage-pacer-og", name: "Vintage Pacer OG", price: 6495, image: "shoe_retro.png" },
    { id: "classic-mile-runner", name: "Classic Mile Runner", price: 5995, image: "shoe_retro.png" },
    { id: "neon-dash-retro", name: "Neon Dash Retro", price: 8495, image: "shoe_retro.png" },
    { id: "shadow-glide-gt", name: "Shadow Glide GT", price: 11495, image: "shoe_shadow_runner.png" },
    { id: "shadow-joggers-slate", name: "Shadow Joggers — Slate", price: 3995, image: "apparel_joggers.png" },
    { id: "domain-3-pro", "name": "Domain 3 Pro — Allrounder", price: 14995, image: "shoe_cricket_spike.png" },
    { id: "domain-3-lite", "name": "Domain 3 Lite — Batting", price: 9995, image: "shoe_cricket_spike.png" },
    { id: "domain-match-shorts", name: "Domain Match Shorts", price: 3295, image: "training_shorts.png" },
    { id: "domain-field-jacket", "name": "Domain Field Jacket", price: 5495, image: "apparel_jacket.png" },
    { id: "pitch-trainer-turf", name: "Pitch Trainer — Turf", price: 6495, image: "shoe_football.png" },
    { id: "test-match-polo", name: "Test Match Polo — White", price: 2495, image: "apparel_tee.png" },
    { id: "tempo-racer-carbon", name: "Tempo Racer Carbon", price: 13995, image: "shoe_shadow_runner.png" },
    { id: "ultra-mile-marathon", name: "Ultra Mile — Marathon", price: 10995, image: "shoe_shadow_runner.png" },
    { id: "dri-shadow-run-tee", "name": "Dri-Shadow Run Tee", price: 1995, image: "apparel_tee.png" },
    { id: "vortex-trainer-pro", name: "Vortex Trainer Pro", price: 9495, image: "shoe_shadow_runner.png" },
    { id: "lift-max", name: "Lift Max — Flat Sole", price: 7995, image: "shoe_shadow_runner.png" },
    { id: "flex-hiit-trainer", name: "Flex HIIT Trainer", price: 6795, image: "shoe_shadow_runner.png" },
    { id: "striker-fg", name: "Striker FG — Firm Ground", price: 11995, image: "shoe_football.png" },
    { id: "phantom-ag", "name": "Phantom AG — Artificial", price: 10495, image: "shoe_football.png" },
    { id: "blitz-tf", "name": "Blitz TF — Indoor/Turf", price: 6995, image: "shoe_football.png" },
    { id: "mamba-sg", "name": "Mamba SG — Soft Ground", price: 13495, image: "shoe_football.png" },
    { id: "pro-match-shorts", name: "Pro Match Shorts", price: 2995, image: "training_shorts.png" },
    { id: "shadow-training-jersey", "name": "Shadow Training Jersey", price: 3495, image: "apparel_tee.png" },
    { id: "shadow-warm-up-jacket", "name": "Shadow Warm-Up Jacket", price: 5995, image: "apparel_jacket.png" }
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    const articles = content.split('<article class="product-card">');
    let changed = false;

    if (articles.length > 1) {
        for (let i = 1; i < articles.length; i++) {
            PRODUCTS.forEach(p => {
                const namePattern = p.name
                    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                    .replace(/—/g, '(?:—|&#8212;)')
                    .replace(/ /g, '\\s+'); // to allow spacing diffs if any

                const regexTitle = new RegExp(`<h3 class="product-card__name">(<a[^>]*>)?${namePattern}(<\\/a>)?<\\/h3>`, 'm');

                if (regexTitle.test(articles[i])) {
                    changed = true;
                    // 1. Link the Title
                    // We must use replacing to replace whatever title variant was inside the tags.
                    articles[i] = articles[i].replace(regexTitle, `<h3 class="product-card__name"><a href="products/${p.id}.html">${p.name}</a></h3>`);

                    // 2. Link the Image
                    // Ensure the div wrapper hasn't been replaced yet or if there's an existing <a>
                    if (articles[i].includes('class="product-card__img"')) {
                        articles[i] = articles[i].replace(/<(div|a)[^>]*class="product-card__img"[^>]*>(.*?)<\/\1>/s, `<a href="products/${p.id}.html" class="product-card__img">$2</a>`);
                    }

                    // 3. Update Image SRC
                    articles[i] = articles[i].replace(/<img src="images\/[^"]+"/, `<img src="images/${p.image}"`);

                    // 4. Update onclick param
                    articles[i] = articles[i].replace(/onclick="addToCart\([^)]+\)"/, `onclick="addToCart('${p.name.replace(/'/g, "\\'")}',${p.price},'images/${p.image}')"`);
                }
            });
        }

        if (changed) {
            fs.writeFileSync(file, articles.join('<article class="product-card">'));
            console.log("Updated links and images in", file);
        }
    }
});
