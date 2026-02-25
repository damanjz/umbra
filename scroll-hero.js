/* =======================================================
   UMBRA — Scroll-Driven Hero & Scroll Animations
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll-Driven Hero ---
    const heroSection = document.getElementById('scrollHero');
    const wordmark = document.getElementById('heroWordmark');
    const reveal = document.getElementById('heroReveal');
    const indicator = document.getElementById('scrollIndicator');
    const layers = document.querySelectorAll('.scroll-hero__layer');

    if (heroSection && wordmark) {

        // --- Entrance animation on page load ---
        // Wordmark & layers start CSS-hidden, then we animate them in
        requestAnimationFrame(() => {
            // Kick off the entrance: wordmark fades in from huge → 3x over 1.2s
            wordmark.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
            wordmark.style.opacity = '0.35';
            wordmark.style.transform = 'scale(3)';

            // Layers get a soft ambient glow immediately
            layers.forEach((layer, i) => {
                layer.style.transition = `opacity ${1 + i * 0.3}s ease-out`;
                layer.style.opacity = 0.15 + i * 0.1;
            });

            // After entrance completes, remove transitions so scroll is instant
            setTimeout(() => {
                wordmark.style.transition = 'none';
                layers.forEach(l => l.style.transition = 'none');
            }, 1500);
        });

        // --- Scroll-driven animation ---
        window.addEventListener('scroll', () => {
            const rect = heroSection.getBoundingClientRect();
            const sectionHeight = heroSection.offsetHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));

            // Phase 1 (0–0.35): Wordmark scales from 3x → 1x, fades 0.35 → 1
            const scalePhase = Math.min(1, progress / 0.35);
            const eased = easeOutCubic(scalePhase);
            const scale = 3 - (3 - 1) * eased;
            const opacity = 0.35 + 0.65 * eased;
            wordmark.style.transform = `scale(${scale})`;
            wordmark.style.opacity = opacity;

            // Phase 2 (0.15–0.55): Layers strengthen from ambient → full
            const layerPhase = Math.max(0, Math.min(1, (progress - 0.15) / 0.4));
            layers.forEach((layer, i) => {
                const baseOpacity = 0.15 + i * 0.1;
                const targetOpacity = 0.6 + i * 0.15;
                const currentOpacity = baseOpacity + (targetOpacity - baseOpacity) * layerPhase;
                const offset = (1 - layerPhase) * (40 + i * 20);
                layer.style.transform = `translateY(${offset}px) scale(${1 + (1 - layerPhase) * 0.05})`;
                layer.style.opacity = currentOpacity;
            });

            // Phase 3 (0.5–0.8): Tagline and CTA fade in
            const revealPhase = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
            if (reveal) {
                reveal.style.opacity = revealPhase;
                reveal.style.transform = `translateY(${(1 - revealPhase) * 30}px)`;
            }

            // Scroll indicator fades out as user scrolls
            if (indicator) {
                indicator.style.opacity = 1 - Math.min(1, progress / 0.12);
            }
        }, { passive: true });
    }

    // --- Reveal on Scroll (Intersection Observer) ---
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // --- Animated Counters ---
    const counters = document.querySelectorAll('.stat__number[data-target]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(easeOutCubic(progress) * target);

            if (target >= 1000000) {
                el.textContent = (value / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                el.textContent = Math.floor(value / 1000) + 'K+';
            } else {
                el.textContent = value + (target === 99 ? '%' : '+');
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
});
