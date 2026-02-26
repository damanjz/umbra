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

    // --- Floating Particles ---
    const stickyEl = document.querySelector('.scroll-hero__sticky');
    if (stickyEl) {
        const canvas = document.createElement('canvas');
        canvas.className = 'scroll-hero__particles';
        canvas.setAttribute('aria-hidden', 'true');
        stickyEl.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let particles = [];
        const PARTICLE_COUNT = 50;

        function resizeCanvas() {
            canvas.width = stickyEl.offsetWidth;
            canvas.height = stickyEl.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 20,
                size: Math.random() * 2 + 0.5,
                speedY: -(Math.random() * 0.4 + 0.15),
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
            };
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = createParticle();
            p.y = Math.random() * canvas.height; // Spread initially
            particles.push(p);
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += p.pulseSpeed;
                const glow = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

                // Reset when off-screen
                if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
                    particles[i] = createParticle();
                    return;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 142, 255, ${glow})`;
                ctx.fill();

                // Subtle glow ring
                if (p.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(180, 142, 255, ${glow * 0.15})`;
                    ctx.fill();
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }
});
