/* =======================================================
   UMBRA — Search & Favorites
   ======================================================= */

// Product database (all 30+ products)
const ALL_PRODUCTS = [
    { id: "shadow-runner-x", name: "Shadow Runner X", price: 8995, image: "images/shoe_shadow_runner.png", cat: "Running" },
    { id: "aura-training-max", name: "Aura Training Max", price: 10995, image: "images/shoe_aura_training.png", cat: "Training" },
    { id: "modest-fit-training-top", name: "Modest Fit Training Top", price: 2295, image: "images/tee_modest_fit.png", cat: "Apparel" },
    { id: "carbon-joggers", name: "Carbon Joggers", price: 3495, image: "images/joggers_carbon.png", cat: "Apparel" },
    { id: "dri-shadow-tee", name: "Dri-Shadow Tee", price: 1995, image: "images/tee_dri_shadow.png", cat: "Apparel" },
    { id: "shadow-training-top", name: "Shadow Training Top", price: 2995, image: "images/tee_shadow_training.png", cat: "Apparel" },
    { id: "retro-runner-slate", name: "Retro Runner Slate", price: 7295, image: "images/shoe_retro_slate.png", cat: "Retro" },
    { id: "vintage-pacer-og", name: "Vintage Pacer OG", price: 6495, image: "images/shoe_vintage_pacer.png", cat: "Retro" },
    { id: "classic-mile-runner", name: "Classic Mile Runner", price: 5995, image: "images/shoe_classic_mile.png", cat: "Retro" },
    { id: "neon-dash-retro", name: "Neon Dash Retro", price: 8495, image: "images/shoe_retro.png", cat: "Retro" },
    { id: "shadow-glide-gt", name: "Shadow Glide GT", price: 11495, image: "images/shoe_shadow_glide.png", cat: "Performance" },
    { id: "shadow-joggers-slate", name: "Shadow Joggers — Slate", price: 3995, image: "images/apparel_joggers.png", cat: "Apparel" },
    { id: "domain-3-pro", name: "Domain 3 Pro — Allrounder", price: 14995, image: "images/shoe_cricket_spike.png", cat: "Cricket" },
    { id: "domain-3-lite", name: "Domain 3 Lite — Batting", price: 9995, image: "images/shoe_vintage_pacer.png", cat: "Cricket" },
    { id: "domain-match-shorts", name: "Domain Match Shorts", price: 3295, image: "images/training_shorts.png", cat: "Cricket" },
    { id: "domain-field-jacket", name: "Domain Field Jacket", price: 5495, image: "images/apparel_jacket.png", cat: "Cricket" },
    { id: "pitch-trainer-turf", name: "Pitch Trainer — Turf", price: 6495, image: "images/shoe_aura_training.png", cat: "Cricket" },
    { id: "test-match-polo", name: "Test Match Polo — White", price: 2495, image: "images/tee_modest_fit.png", cat: "Cricket" },
    { id: "tempo-racer-carbon", name: "Tempo Racer Carbon", price: 13995, image: "images/shoe_shadow_runner.png", cat: "Running" },
    { id: "ultra-mile-marathon", name: "Ultra Mile — Marathon", price: 10995, image: "images/shoe_shadow_glide.png", cat: "Running" },
    { id: "dri-shadow-run-tee", name: "Dri-Shadow Run Tee", price: 1995, image: "images/tee_dri_shadow.png", cat: "Running" },
    { id: "vortex-trainer-pro", name: "Vortex Trainer Pro", price: 9495, image: "images/shoe_classic_mile.png", cat: "Training" },
    { id: "lift-max", name: "Lift Max — Flat Sole", price: 7995, image: "images/shoe_retro_slate.png", cat: "Training" },
    { id: "flex-hiit-trainer", name: "Flex HIIT Trainer", price: 6795, image: "images/shoe_retro.png", cat: "Training" },
    { id: "striker-fg", name: "Striker FG — Firm Ground", price: 11995, image: "images/shoe_football.png", cat: "Football" },
    { id: "phantom-ag", name: "Phantom AG — Artificial", price: 10495, image: "images/shoe_aura_training.png", cat: "Football" },
    { id: "blitz-tf", name: "Blitz TF — Indoor/Turf", price: 6995, image: "images/shoe_retro_slate.png", cat: "Football" },
    { id: "mamba-sg", name: "Mamba SG — Soft Ground", price: 13495, image: "images/shoe_vintage_pacer.png", cat: "Football" },
    { id: "pro-match-shorts", name: "Pro Match Shorts", price: 2995, image: "images/training_shorts.png", cat: "Football" },
    { id: "shadow-training-jersey", name: "Shadow Training Jersey", price: 3495, image: "images/tee_shadow_training.png", cat: "Football" },
    { id: "shadow-warm-up-jacket", name: "Shadow Warm-Up Jacket", price: 5995, image: "images/apparel_jacket.png", cat: "Football" },
    { id: "nightfall-hoodie", name: "Nightfall Hoodie", price: 4995, image: "images/hoodie_dark.png", cat: "Apparel" },
    { id: "eclipse-training-shorts", name: "Eclipse Training Shorts", price: 2495, image: "images/training_shorts.png", cat: "Apparel" },
    { id: "domain-3-cricket-spike", name: "Domain 3 Cricket Spike", price: 12495, image: "images/shoe_cricket_spike.png", cat: "Cricket" },
];

// Detect if we're in /products/ subfolder
const isSubfolder = window.location.pathname.includes('/products/');
const pathPrefix = isSubfolder ? '../' : '';

function formatPrice(p) {
    return '₹' + p.toLocaleString('en-IN');
}

function getProductHref(id) {
    return isSubfolder ? `${id}.html` : `products/${id}.html`;
}

// ===== FAVORITES =====
function getFavorites() {
    try { return JSON.parse(localStorage.getItem('umbra_favorites') || '[]'); } catch { return []; }
}

function saveFavorites(favs) {
    localStorage.setItem('umbra_favorites', JSON.stringify(favs));
    window.dispatchEvent(new Event('favoritesUpdated'));
}

function toggleFav(productId) {
    const isAdded = toggleFavorite(productId);
    const btn = document.getElementById('pdpFavBtn');
    if (btn) {
        btn.classList.toggle('active', isAdded);
        btn.querySelector('svg').innerHTML = isAdded
            ? '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/>'
            : '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
}

function toggleFavorite(productId) {
    let favs = getFavorites();
    const idx = favs.indexOf(productId);
    if (idx === -1) { favs.push(productId); } else { favs.splice(idx, 1); }
    saveFavorites(favs);
    return idx === -1; // true if added
}

function isFavorite(productId) {
    return getFavorites().includes(productId);
}

// Update all heart buttons on page
function syncFavButtons() {
    document.querySelectorAll('.product-card__fav').forEach(btn => {
        const id = btn.dataset.productId;
        if (id) {
            btn.classList.toggle('active', isFavorite(id));
            btn.querySelector('svg').innerHTML = isFavorite(id)
                ? '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/>'
                : '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"/>';
        }
    });
}

// Render favorites on the favorites page
function renderFavoritesPage() {
    const grid = document.getElementById('favoritesGrid');
    if (!grid) return;
    const favs = getFavorites();
    if (favs.length === 0) {
        grid.innerHTML = `<div class="favorites-empty" style="grid-column:1/-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <h2>No favorites yet</h2>
            <p>Browse our collections and tap the ♡ to save items you love.</p>
            <a href="index.html" class="btn btn--accent" style="margin-top:1.5rem">Shop Now</a>
        </div>`;
        return;
    }
    grid.innerHTML = favs.map(id => {
        const p = ALL_PRODUCTS.find(x => x.id === id);
        if (!p) return '';
        return `<article class="product-card">
            <a href="products/${p.id}.html" class="product-card__img">
                <button class="product-card__fav active" data-product-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();toggleFavorite('${p.id}');renderFavoritesPage();">
                    <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/></svg>
                </button>
                <img src="images/${p.image.replace('images/', '')}" alt="${p.name}">
            </a>
            <div class="product-card__body">
                <span class="product-card__tag">${p.cat}</span>
                <h3 class="product-card__name"><a href="products/${p.id}.html">${p.name}</a></h3>
                <p class="product-card__price"><strong>${formatPrice(p.price)}</strong></p>
                <button class="btn btn--add" onclick="addToCart('${p.name.replace(/'/g, "\\'")}',${p.price},'${p.image}')">Add to Cart</button>
            </div>
        </article>`;
    }).join('');
}

// ===== SEARCH =====
function openSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.add('open');
        setTimeout(() => overlay.querySelector('.search-overlay__input')?.focus(), 100);
    }
}

function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.remove('open');
}

function handleSearch(query) {
    const results = document.getElementById('searchResults');
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
        results.innerHTML = '<p class="search-overlay__empty">Type at least 2 characters to search…</p>';
        return;
    }
    const matches = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.id.includes(q)
    );
    if (matches.length === 0) {
        results.innerHTML = `<p class="search-overlay__empty">No results for "${query}". Try another term.</p>`;
        return;
    }
    results.innerHTML = matches.map(p => `
        <a href="${getProductHref(p.id)}" class="search-result" onclick="closeSearch()">
            <img src="${pathPrefix}${p.image}" alt="${p.name}" class="search-result__img">
            <div class="search-result__info">
                <div class="search-result__name">${highlightMatch(p.name, q)}</div>
                <div class="search-result__price">${formatPrice(p.price)}</div>
                <div class="search-result__cat">${p.cat}</div>
            </div>
        </a>
    `).join('');
}

function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return text.slice(0, idx) + '<mark style="background:var(--accent);color:var(--bg);border-radius:2px;padding:0 2px">' + text.slice(idx, idx + query.length) + '</mark>' + text.slice(idx + query.length);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Inject search overlay if not present
    if (!document.getElementById('searchOverlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.id = 'searchOverlay';
        overlay.innerHTML = `
            <button class="search-overlay__close" onclick="closeSearch()">&times;</button>
            <div class="search-overlay__input-wrap">
                <svg class="search-overlay__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="search-overlay__input" placeholder="Search products…" oninput="handleSearch(this.value)" autofocus>
            </div>
            <div class="search-overlay__results" id="searchResults">
                <p class="search-overlay__empty">Type to search all Umbra products…</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });

        // Close on clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSearch();
        });
    }

    // Wire up the search bar in header to open overlay
    document.querySelectorAll('.actions__search').forEach(bar => {
        bar.style.cursor = 'pointer';
        bar.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
        const input = bar.querySelector('input');
        if (input) {
            input.style.cursor = 'pointer';
            input.readOnly = true;
        }
    });

    // Wire up favorites heart icon in header
    document.querySelectorAll('.actions__icon[aria-label="Favorites"]').forEach(btn => {
        btn.href = pathPrefix + 'favorites.html';
    });

    // Sync fav buttons
    syncFavButtons();
    window.addEventListener('favoritesUpdated', syncFavButtons);

    // Render favorites page if on it
    renderFavoritesPage();

    // ===== CUSTOM CURSOR (site-wide) =====
    if (window.matchMedia('(pointer: fine)').matches) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let cx = -100, cy = -100;
        let rx = -100, ry = -100;

        document.addEventListener('mousemove', (e) => {
            cx = e.clientX;
            cy = e.clientY;
            dot.style.transform = `translate(${cx}px, ${cy}px)`;
        });

        function animateRing() {
            rx += (cx - rx) * 0.15;
            ry += (cy - ry) * 0.15;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const interactiveSelector = 'a, button, input, select, .product-card, .btn, .actions__icon, .nav__item > a, .filter-size-btn, .filter-colour-btn';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                dot.classList.add('cursor-dot--hover');
                ring.classList.add('cursor-ring--hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                dot.classList.remove('cursor-dot--hover');
                ring.classList.remove('cursor-ring--hover');
            }
        });

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }
});
