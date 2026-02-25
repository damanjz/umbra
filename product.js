/* =======================================================
   UMBRA — Product Detail Page (PDP) Logic
   ======================================================= */

// --- Image Gallery ---
function changeImage(thumbBtn, src) {
    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
        mainImg.style.opacity = 0;
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = 1;
        }, 200);
    }
    // Active thumb
    document.querySelectorAll('.pdp__thumb').forEach(t => t.classList.remove('pdp__thumb--active'));
    thumbBtn.classList.add('pdp__thumb--active');
}

// --- Size Selection ---
let selectedSize = null;

document.addEventListener('DOMContentLoaded', () => {
    const sizeGrid = document.getElementById('sizeGrid');
    if (sizeGrid) {
        sizeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.pdp__size:not(.pdp__size--oos)');
            if (!btn) return;

            // Deselect all
            sizeGrid.querySelectorAll('.pdp__size').forEach(s => s.classList.remove('pdp__size--selected'));
            // Select this one
            btn.classList.add('pdp__size--selected');
            selectedSize = btn.dataset.size;

            // Clear error
            const err = document.getElementById('sizeError');
            if (err) err.style.display = 'none';
        });
    }

    // Color swatch selection
    document.querySelectorAll('.pdp__color-swatches').forEach(container => {
        container.addEventListener('click', (e) => {
            const swatch = e.target.closest('.pdp__swatch');
            if (!swatch) return;
            container.querySelectorAll('.pdp__swatch').forEach(s => s.classList.remove('pdp__swatch--active'));
            swatch.classList.add('pdp__swatch--active');
        });
    });
});

// --- Add to Cart from PDP ---
function handleAddToCart() {
    if (!selectedSize) {
        const err = document.getElementById('sizeError');
        if (err) {
            err.style.display = 'block';
            err.classList.add('shake');
            setTimeout(() => err.classList.remove('shake'), 500);
        }
        // Highlight size grid
        const grid = document.getElementById('sizeGrid');
        if (grid) {
            grid.classList.add('pdp__size-grid--error');
            setTimeout(() => grid.classList.remove('pdp__size-grid--error'), 1500);
        }
        return;
    }

    // Extract product info from page
    const title = document.querySelector('.pdp__title')?.textContent || 'Product';
    const priceEl = document.querySelector('.pdp__price');
    const priceText = priceEl ? priceEl.childNodes[0].textContent : '₹0';
    const price = parseInt(priceText.replace(/[₹,\s]/g, '')) || 0;
    const image = document.getElementById('mainImage')?.src || '';

    // Convert absolute image URL to relative path for cart
    const imgRelative = image.includes('/images/') ? image.substring(image.indexOf('images/')) : image;

    const productName = `${title} (${selectedSize})`;
    addToCart(productName, price, imgRelative);

    // Button feedback
    const btn = document.getElementById('addToCartBtn');
    if (btn) {
        btn.textContent = '✓ Added to Cart';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('added');
        }, 2000);
    }
}

// --- Accordion ---
function toggleAccordion(btn) {
    const accordion = btn.closest('.pdp__accordion');
    const isOpen = accordion.classList.contains('pdp__accordion--open');

    // Close all
    document.querySelectorAll('.pdp__accordion').forEach(a => a.classList.remove('pdp__accordion--open'));

    // Toggle this one
    if (!isOpen) {
        accordion.classList.add('pdp__accordion--open');
    }
}

// --- Size Chart Modal ---
function openSizeChart() {
    document.getElementById('sizeChartModal')?.classList.add('modal--open');
    document.getElementById('sizeChartOverlay')?.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
}

function closeSizeChart() {
    document.getElementById('sizeChartModal')?.classList.remove('modal--open');
    document.getElementById('sizeChartOverlay')?.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSizeChart();
});
