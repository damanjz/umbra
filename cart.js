/* =======================================================
   UMBRA — CART & CHECKOUT LOGIC
   ======================================================= */

// ---- Cart State (localStorage) ----
function getCart() {
    try { return JSON.parse(localStorage.getItem('umbra_cart')) || []; }
    catch { return []; }
}
function saveCart(cart) {
    localStorage.setItem('umbra_cart', JSON.stringify(cart));
}

// ---- Add to Cart ----
function addToCart(name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    saveCart(cart);
    updateCartUI();
    openCart();

    // Button feedback
    if (event && event.target) {
        const btn = event.target;
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1200);
    }
}

// ---- Update Cart UI ----
function updateCartUI() {
    const cart = getCart();
    const badge = document.getElementById('cartBadge');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    if (!badge) return; // Not on a page with cart sidebar

    // Badge
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = totalQty;
    badge.classList.remove('bounce');
    void badge.offsetWidth; // Trigger reflow
    badge.classList.add('bounce');

    // Items
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-sidebar__empty">Your cart is empty.</p>';
        footerEl.style.display = 'none';
        return;
    }

    footerEl.style.display = 'block';
    let html = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        html += `
        <div class="cart-item">
            <img class="cart-item__img" src="${item.image}" alt="${item.name}">
            <div class="cart-item__info">
                <div class="cart-item__name">${item.name}</div>
                <div class="cart-item__price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="cart-item__qty">
                    <button onclick="changeQty(${idx}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${idx}, 1)">+</button>
                </div>
            </div>
        </div>`;
    });
    itemsEl.innerHTML = html;
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

// ---- Change Quantity ----
function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
}

// ---- Open / Close Cart ----
function openCart() {
    document.getElementById('cartSidebar')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
}
function closeCart() {
    document.getElementById('cartSidebar')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    document.getElementById('cartToggle')?.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    document.getElementById('cartClose')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
});

// ---- Checkout Page Logic ----
function renderCheckoutSummary() {
    const cart = getCart();
    const listEl = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const emptyEl = document.getElementById('checkoutEmpty');
    const formEl = document.getElementById('checkoutFormSection');

    if (!listEl) return;

    if (cart.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (formEl) formEl.style.display = 'none';
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (formEl) formEl.style.display = 'block';

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        html += `
        <div class="summary-item">
            <img class="summary-item__img" src="${item.image}" alt="${item.name}">
            <div class="summary-item__info">
                <div class="summary-item__name">${item.name}</div>
                <div class="summary-item__detail">Qty: ${item.qty} · ₹${item.price.toLocaleString('en-IN')}</div>
            </div>
        </div>`;
    });
    listEl.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = '₹' + total.toLocaleString('en-IN');
    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

function placeOrder(e) {
    e.preventDefault();
    localStorage.removeItem('umbra_cart');
    document.getElementById('checkoutFormSection').innerHTML = `
        <div style="text-align:center;padding:4rem 0">
            <div style="font-size:3rem;margin-bottom:1rem">✓</div>
            <h2 style="margin-bottom:0.5rem">Order Placed!</h2>
            <p style="color:var(--text-muted)">Thank you for shopping with Umbra. Your order is on its way.</p>
            <a href="Index.html" class="btn btn--accent" style="margin-top:2rem">Continue Shopping</a>
        </div>`;
    const summary = document.querySelector('.checkout__summary');
    if (summary) summary.style.display = 'none';
}
