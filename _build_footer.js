const fs = require('fs');
const path = require('path');

// ===== 1. Create Footer Pages =====
const headerCommon = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Umbra</title>
    <meta name="description" content="${desc}">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=3">
</head>
<body>
    <header class="header">
        <div class="promo-marquee"><div class="promo-marquee__track"><span class="promo-marquee__item">Free Shipping on orders over &#8377;4,999</span><span class="promo-marquee__item">Use code SHADOW20 for 20% off your first order</span><span class="promo-marquee__item">New Season Drops &#8212; Shadow Collection</span><span class="promo-marquee__item">Students get 15% off with UNiDAYS</span><span class="promo-marquee__item">Free Returns within 30 days</span><span class="promo-marquee__item">Free Shipping on orders over &#8377;4,999</span><span class="promo-marquee__item">Use code SHADOW20 for 20% off your first order</span><span class="promo-marquee__item">New Season Drops &#8212; Shadow Collection</span><span class="promo-marquee__item">Students get 15% off with UNiDAYS</span><span class="promo-marquee__item">Free Returns within 30 days</span></div></div>
        <div class="header__top"><a href="#">Help</a><a href="#">Sign Up</a><a href="#">Log In</a></div>
        <div class="header__bar">
            <a href="index.html" class="header__logo">UMBRA</a>
            <ul class="nav">
                <li class="nav__item"><a href="#">New & Featured</a><div class="mega"><div class="mega__col"><div class="mega__heading">Featured</div><a href="new-arrivals.html" class="mega__link">New Arrivals</a><a href="bestsellers.html" class="mega__link">Bestsellers</a><a href="top-picks.html" class="mega__link">Top Picks Under ₹4999</a></div><div class="mega__col"><div class="mega__heading">Trending</div><a href="retro-running.html" class="mega__link">Retro Running</a><a href="shadow-collection.html" class="mega__link">Shadow Collection</a><a href="domain-3.html" class="mega__link">Domain 3</a></div><div class="mega__col"><div class="mega__heading">Sport</div><a href="cricket.html" class="mega__link">Cricket</a><a href="running.html" class="mega__link">Running</a><a href="gym-training.html" class="mega__link">Gym & Training</a><a href="football.html" class="mega__link">Football</a></div></div></li>
                <li class="nav__item"><a href="men.html">Men</a></li>
                <li class="nav__item"><a href="women.html">Women</a></li>
                <li class="nav__item"><a href="kids.html">Kids</a></li>
            </ul>
            <div class="actions">
                <div class="actions__search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search"></div>
                <a href="favorites.html" class="actions__icon" aria-label="Favorites"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></a>
                <button class="actions__icon cart-toggle" aria-label="Cart" id="cartToggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
            </div>
        </div>
    </header>
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-sidebar" id="cartSidebar"><div class="cart-sidebar__header"><h3>Your Cart</h3><button class="cart-sidebar__close" id="cartClose">&times;</button></div><div class="cart-sidebar__items" id="cartItems"><p class="cart-sidebar__empty">Your cart is empty.</p></div><div class="cart-sidebar__footer" id="cartFooter" style="display:none"><div class="cart-sidebar__total">Total: <strong id="cartTotal">&#8377;0</strong></div><a href="checkout.html" class="btn btn--accent btn--full">Checkout</a></div></aside>
    <main>`;

const footerCommon = `    </main>
    <footer class="footer">
        <div class="footer__grid">
            <div class="footer__brand"><h3>UMBRA</h3><p>Premium athletic gear forged in the shadows.</p></div>
            <nav class="footer__links">
                <div class="footer__col"><h4>Products</h4><a href="shop-all.html">All Products</a><a href="running.html">Running</a><a href="football.html">Football</a></div>
                <div class="footer__col"><h4>Company</h4><a href="about.html">About Us</a><a href="careers.html">Careers</a><a href="blog.html">Blog</a></div>
                <div class="footer__col"><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="cookies.html">Cookies</a></div>
            </nav>
        </div>
        <div class="footer__bottom">&copy; 2026 Umbra Inc. All rights reserved.</div>
    </footer>
    <script src="cart.js?v=2"></script>
    <script src="search.js?v=2"></script>
</body>
</html>`;

const pages = {
    'about.html': {
        title: 'About Us',
        desc: 'Learn about Umbra — premium athletic gear forged in the shadows.',
        content: `
        <section class="page-hero"><div class="container"><h1>About Us</h1><p>Forged in the shadows. Built for the spotlight.</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container" style="max-width:800px">
            <div class="reveal-on-scroll" style="margin-bottom:3rem">
                <h2 style="font-size:2rem;margin-bottom:1rem">Our Story</h2>
                <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1.5rem">Umbra was born from a belief that athletic gear should perform as hard as you do — without compromising on style. Founded in 2023, we set out to create a brand that merges cutting-edge performance technology with a dark, premium aesthetic that stands apart from the crowd.</p>
                <p style="color:var(--text-muted);line-height:1.8">Every product we create is designed to push boundaries. From the Shadow Runner's responsive foam to the Domain 3's precision-engineered spike plate, we obsess over every detail so you can focus on what matters — your performance.</p>
            </div>
            <div class="reveal-on-scroll" style="margin-bottom:3rem">
                <h2 style="font-size:2rem;margin-bottom:1rem">Our Mission</h2>
                <p style="color:var(--text-muted);line-height:1.8">To empower athletes at every level with gear that looks as powerful as it performs. We believe the shadow is where champions are forged — in the early mornings, the late nights, the unseen hours of training. Umbra is built for that journey.</p>
            </div>
            <div class="reveal-on-scroll" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;text-align:center">
                <div><h3 style="font-size:2.5rem;color:var(--accent)">50+</h3><p style="color:var(--text-muted);font-size:0.9rem">Products</p></div>
                <div><h3 style="font-size:2.5rem;color:var(--accent)">12</h3><p style="color:var(--text-muted);font-size:0.9rem">Countries</p></div>
                <div><h3 style="font-size:2.5rem;color:var(--accent)">1M+</h3><p style="color:var(--text-muted);font-size:0.9rem">Athletes</p></div>
            </div>
        </div></section>`
    },
    'careers.html': {
        title: 'Careers',
        desc: 'Join the Umbra team. Explore open roles and help shape the future of athletic gear.',
        content: `
        <section class="page-hero"><div class="container"><h1>Careers</h1><p>Shape the future of athletic performance with us.</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container" style="max-width:800px">
            <div class="reveal-on-scroll" style="margin-bottom:3rem">
                <h2 style="font-size:2rem;margin-bottom:1rem">Work at Umbra</h2>
                <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1.5rem">We're a team of athletes, designers, engineers, and dreamers united by one goal: creating gear that redefines what's possible. If you thrive on innovation and push for excellence, we'd love to hear from you.</p>
            </div>
            <div class="reveal-on-scroll" style="margin-bottom:2rem">
                <h2 style="font-size:1.5rem;margin-bottom:1.5rem">Open Positions</h2>
                <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">
                    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><div><strong>Senior Product Designer</strong><p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">Design · Remote</p></div><span class="btn btn--accent" style="font-size:0.8rem;padding:0.5rem 1.25rem">Apply</span></div>
                    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><div><strong>Full Stack Engineer</strong><p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">Engineering · Mumbai, India</p></div><span class="btn btn--accent" style="font-size:0.8rem;padding:0.5rem 1.25rem">Apply</span></div>
                    <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><div><strong>Performance Footwear Engineer</strong><p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">R&D · Bengaluru, India</p></div><span class="btn btn--accent" style="font-size:0.8rem;padding:0.5rem 1.25rem">Apply</span></div>
                    <div style="padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center"><div><strong>Brand Marketing Manager</strong><p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">Marketing · Delhi, India</p></div><span class="btn btn--accent" style="font-size:0.8rem;padding:0.5rem 1.25rem">Apply</span></div>
                </div>
            </div>
        </div></section>`
    },
    'blog.html': {
        title: 'Blog',
        desc: 'Insights, stories, and updates from the Umbra team.',
        content: `
        <section class="page-hero"><div class="container"><h1>Blog</h1><p>Stories, insights, and the latest from Umbra.</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container">
            <div class="product-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">
                <article class="product-card reveal-on-scroll"><div style="aspect-ratio:16/9;background:linear-gradient(135deg,rgba(180,142,255,0.15),rgba(11,11,15,0.9));display:flex;align-items:center;justify-content:center;border-radius:var(--radius) var(--radius) 0 0"><span style="font-size:3rem">🏃</span></div><div class="product-card__body"><span class="product-card__tag">Training</span><h3 class="product-card__name"><a href="#">5 Drills to Boost Sprint Speed</a></h3><p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Evidence-based training techniques used by elite sprinters to shave seconds off their 100m time.</p></div></article>
                <article class="product-card reveal-on-scroll"><div style="aspect-ratio:16/9;background:linear-gradient(135deg,rgba(154,111,224,0.15),rgba(11,11,15,0.9));display:flex;align-items:center;justify-content:center;border-radius:var(--radius) var(--radius) 0 0"><span style="font-size:3rem">👟</span></div><div class="product-card__body"><span class="product-card__tag">Product</span><h3 class="product-card__name"><a href="#">Behind the Design: Shadow Glide GT</a></h3><p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">How our R&D team engineered the most responsive running shoe in our lineup.</p></div></article>
                <article class="product-card reveal-on-scroll"><div style="aspect-ratio:16/9;background:linear-gradient(135deg,rgba(140,100,240,0.15),rgba(11,11,15,0.9));display:flex;align-items:center;justify-content:center;border-radius:var(--radius) var(--radius) 0 0"><span style="font-size:3rem">🏏</span></div><div class="product-card__body"><span class="product-card__tag">Cricket</span><h3 class="product-card__name"><a href="#">Domain 3: Built for Every Surface</a></h3><p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">A deep dive into the spike technology that makes Domain 3 the most versatile cricket shoe on the market.</p></div></article>
                <article class="product-card reveal-on-scroll"><div style="aspect-ratio:16/9;background:linear-gradient(135deg,rgba(200,170,255,0.15),rgba(11,11,15,0.9));display:flex;align-items:center;justify-content:center;border-radius:var(--radius) var(--radius) 0 0"><span style="font-size:3rem">🌱</span></div><div class="product-card__body"><span class="product-card__tag">Sustainability</span><h3 class="product-card__name"><a href="#">Our 2026 Sustainability Report</a></h3><p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Progress on our pledge to use 100% recycled materials by 2028.</p></div></article>
            </div>
        </div></section>`
    },
    'privacy.html': {
        title: 'Privacy Policy',
        desc: 'Umbra Privacy Policy — how we collect, use, and protect your data.',
        content: `
        <section class="page-hero"><div class="container"><h1>Privacy Policy</h1><p>Last updated: January 1, 2026</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container" style="max-width:800px">
            <div style="color:var(--text-muted);line-height:1.9">
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">1. Information We Collect</h2>
                <p style="margin-bottom:1.5rem">We collect information you provide directly (name, email, shipping address, payment details) when you create an account, place an order, or contact us. We also automatically collect device information, browsing data, and cookies when you visit our site.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">2. How We Use Your Information</h2>
                <p style="margin-bottom:1.5rem">We use your data to process orders, personalize your experience, send marketing communications (with your consent), improve our products and services, and comply with legal obligations.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">3. Data Sharing</h2>
                <p style="margin-bottom:1.5rem">We do not sell your personal data. We share data with trusted service providers (payment processors, shipping partners) only as needed to fulfill your orders and operate our business.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">4. Your Rights</h2>
                <p style="margin-bottom:1.5rem">You have the right to access, correct, delete, or port your personal data. You may also opt out of marketing communications at any time. Contact us at privacy@umbra.com.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">5. Security</h2>
                <p>We use industry-standard encryption and security measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
            </div>
        </div></section>`
    },
    'terms.html': {
        title: 'Terms of Service',
        desc: 'Umbra Terms of Service — rules governing your use of our website and services.',
        content: `
        <section class="page-hero"><div class="container"><h1>Terms of Service</h1><p>Last updated: January 1, 2026</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container" style="max-width:800px">
            <div style="color:var(--text-muted);line-height:1.9">
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">1. Acceptance of Terms</h2>
                <p style="margin-bottom:1.5rem">By accessing and using the Umbra website, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">2. Orders & Payment</h2>
                <p style="margin-bottom:1.5rem">All orders are subject to availability. Prices are listed in INR and include applicable taxes. We accept major credit/debit cards, UPI, and net banking. Orders may be cancelled if suspected of fraud.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">3. Shipping & Returns</h2>
                <p style="margin-bottom:1.5rem">Free shipping on orders over ₹4,999. Standard delivery takes 5–7 business days. Returns are accepted within 30 days of delivery for unworn items in original packaging.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">4. Intellectual Property</h2>
                <p style="margin-bottom:1.5rem">All content on this site — including logos, images, text, and designs — is the property of Umbra Inc. and may not be reproduced without written permission.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">5. Limitation of Liability</h2>
                <p>Umbra shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
            </div>
        </div></section>`
    },
    'cookies.html': {
        title: 'Cookie Policy',
        desc: 'Umbra Cookie Policy — how we use cookies to improve your experience.',
        content: `
        <section class="page-hero"><div class="container"><h1>Cookie Policy</h1><p>Last updated: January 1, 2026</p></div></section>
        <section class="products" style="padding:4rem 0"><div class="container" style="max-width:800px">
            <div style="color:var(--text-muted);line-height:1.9">
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">What Are Cookies?</h2>
                <p style="margin-bottom:1.5rem">Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, analyze site traffic, and personalize your experience.</p>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">Cookies We Use</h2>
                <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:1.5rem">
                    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 2fr;gap:1rem"><strong style="color:var(--text)">Essential</strong><span>Required for site functionality (cart, login, checkout). Cannot be disabled.</span></div>
                    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 2fr;gap:1rem"><strong style="color:var(--text)">Analytics</strong><span>Help us understand how visitors interact with our site. Data is anonymized.</span></div>
                    <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 2fr;gap:1rem"><strong style="color:var(--text)">Marketing</strong><span>Used to deliver relevant ads and measure campaign effectiveness.</span></div>
                    <div style="padding:1rem 1.5rem;display:grid;grid-template-columns:1fr 2fr;gap:1rem"><strong style="color:var(--text)">Preferences</strong><span>Remember your settings like language, region, and display preferences.</span></div>
                </div>
                <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:1rem">Managing Cookies</h2>
                <p>You can control cookies through your browser settings. Disabling certain cookies may affect site functionality. For more information, contact us at privacy@umbra.com.</p>
            </div>
        </div></section>`
    }
};

// Write footer pages
for (const [filename, data] of Object.entries(pages)) {
    const html = headerCommon(data.title, data.desc) + data.content + '\n' + footerCommon;
    fs.writeFileSync(filename, html);
    console.log('Created', filename);
}

// ===== 2. Update footer links in ALL existing HTML files =====
const oldFooterLinks = [
    [/<a href="#">Shoes<\/a>/g, '<a href="shop-all.html">All Products</a>'],
    [/<a href="#">Clothing<\/a>/g, '<a href="running.html">Running</a>'],
    [/<a href="#">Accessories<\/a>/g, '<a href="football.html">Football</a>'],
    [/<a href="#">About Us<\/a>/g, '<a href="about.html">About Us</a>'],
    [/<a href="#">Careers<\/a>/g, '<a href="careers.html">Careers</a>'],
    [/<a href="#">Blog<\/a>/g, '<a href="blog.html">Blog</a>'],
    [/<a href="#">Privacy<\/a>/g, '<a href="privacy.html">Privacy</a>'],
    [/<a href="#">Terms<\/a>/g, '<a href="terms.html">Terms</a>'],
    [/<a href="#">Cookies<\/a>/g, '<a href="cookies.html">Cookies</a>'],
];

// Root HTML files
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
rootFiles.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    let changed = false;
    oldFooterLinks.forEach(([regex, replacement]) => {
        if (regex.test(c)) { c = c.replace(regex, replacement); changed = true; regex.lastIndex = 0; }
    });
    if (changed) { fs.writeFileSync(f, c); console.log('Updated footer links in', f); }
});

// Product HTML files — update footer links AND add favorite button
const prodDir = 'products';
if (fs.existsSync(prodDir)) {
    const prodFiles = fs.readdirSync(prodDir).filter(f => f.endsWith('.html'));

    // Also need product-relative footer links
    const prodFooterLinks = [
        [/<a href="#">Shoes<\/a>/g, '<a href="../shop-all.html">All Products</a>'],
        [/<a href="#">Clothing<\/a>/g, '<a href="../running.html">Running</a>'],
        [/<a href="#">Accessories<\/a>/g, '<a href="../football.html">Football</a>'],
        [/<a href="#">About Us<\/a>/g, '<a href="../about.html">About Us</a>'],
        [/<a href="#">Careers<\/a>/g, '<a href="../careers.html">Careers</a>'],
        [/<a href="#">Blog<\/a>/g, '<a href="../blog.html">Blog</a>'],
        [/<a href="#">Privacy<\/a>/g, '<a href="../privacy.html">Privacy</a>'],
        [/<a href="#">Terms<\/a>/g, '<a href="../terms.html">Terms</a>'],
        [/<a href="#">Cookies<\/a>/g, '<a href="../cookies.html">Cookies</a>'],
    ];

    prodFiles.forEach(f => {
        const filepath = path.join(prodDir, f);
        let c = fs.readFileSync(filepath, 'utf8');

        // Update footer links
        prodFooterLinks.forEach(([regex, replacement]) => {
            if (regex.test(c)) { c = c.replace(regex, replacement); regex.lastIndex = 0; }
        });

        // Add favorite button near the product title if not already present
        const productId = f.replace('.html', '');
        if (!c.includes('pdp__fav-btn')) {
            // Insert favorite button right after the pdp__tag line
            c = c.replace(
                /(<span class="pdp__tag">[^<]*<\/span>)/,
                `$1\n                        <button class="pdp__fav-btn" id="pdpFavBtn" onclick="toggleFav('${productId}')" title="Add to favorites"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>`
            );
        }

        fs.writeFileSync(filepath, c);
        console.log('Updated', f);
    });
}

console.log('\\nDone! Created 6 footer pages, updated footer links, added fav buttons.');
