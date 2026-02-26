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

        // --- Mouse Parallax on Hero (no glow) ---
        let mouseX = 0.5, mouseY = 0.5;
        let targetX = 0.5, targetY = 0.5;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width;
            targetY = (e.clientY - rect.top) / rect.height;
        });

        heroSection.addEventListener('mouseleave', () => {
            targetX = 0.5;
            targetY = 0.5;
        });

        function updateMouseEffects() {
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;

            const offsetX = (mouseX - 0.5) * 2;
            const offsetY = (mouseY - 0.5) * 2;

            // Parallax layers
            layers.forEach((layer, i) => {
                const depth = (i + 1) * 8;
                const currentTransform = layer.style.transform || '';
                const translateMatch = currentTransform.match(/translateY\(([^)]+)\)/);
                const scrollY = translateMatch ? translateMatch[1] : '0px';
                const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
                const scrollScale = scaleMatch ? scaleMatch[1] : '1';
                layer.style.transform = `translateY(${scrollY}) translateX(${offsetX * depth}px) scale(${scrollScale})`;
            });

            // Wordmark 3D tilt
            if (wordmark) {
                const tiltX = offsetY * -3;
                const tiltY = offsetX * 3;
                const currentScale = wordmark.style.transform.match(/scale\(([^)]+)\)/);
                const s = currentScale ? currentScale[1] : '1';
                wordmark.style.transform = `scale(${s}) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }

            requestAnimationFrame(updateMouseEffects);
        }
        requestAnimationFrame(updateMouseEffects);

        // Expose mouse position for particle repulsion
        window.__heroMouse = { get x() { return mouseX; }, get y() { return mouseY; } };
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

    // --- Floating Particles + Reactive Orbs ---
    const stickyEl = document.querySelector('.scroll-hero__sticky');
    if (stickyEl) {
        const canvas = document.createElement('canvas');
        canvas.className = 'scroll-hero__particles';
        canvas.setAttribute('aria-hidden', 'true');
        stickyEl.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let particles = [];
        const PARTICLE_COUNT = 50;

        // --- ORBS: large glowing circles that react to cursor ---
        const orbs = [];
        const ORB_CONFIGS = [
            { baseX: 0.15, baseY: 0.25, radius: 120, r: 180, g: 142, b: 255, alpha: 0.08 },
            { baseX: 0.80, baseY: 0.70, radius: 100, r: 154, g: 111, b: 224, alpha: 0.07 },
            { baseX: 0.50, baseY: 0.15, radius: 90, r: 212, g: 184, b: 255, alpha: 0.06 },
            { baseX: 0.25, baseY: 0.75, radius: 80, r: 180, g: 142, b: 255, alpha: 0.05 },
            { baseX: 0.70, baseY: 0.30, radius: 110, r: 140, g: 100, b: 240, alpha: 0.06 },
            { baseX: 0.90, baseY: 0.50, radius: 70, r: 200, g: 170, b: 255, alpha: 0.05 },
            { baseX: 0.40, baseY: 0.85, radius: 95, r: 160, g: 120, b: 255, alpha: 0.07 },
            { baseX: 0.10, baseY: 0.55, radius: 85, r: 190, g: 155, b: 255, alpha: 0.06 },
        ];

        function resizeCanvas() {
            canvas.width = stickyEl.offsetWidth;
            canvas.height = stickyEl.offsetHeight;
            // Init orb positions on resize
            ORB_CONFIGS.forEach((cfg, i) => {
                if (!orbs[i]) {
                    orbs[i] = {
                        x: cfg.baseX * canvas.width,
                        y: cfg.baseY * canvas.height,
                        vx: 0, vy: 0,
                    };
                }
            });
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
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = window.__heroMouse ? window.__heroMouse.x * canvas.width : canvas.width / 2;
            const my = window.__heroMouse ? window.__heroMouse.y * canvas.height : canvas.height / 2;

            // --- Draw orbs (behind particles) ---
            ORB_CONFIGS.forEach((cfg, i) => {
                const orb = orbs[i];
                if (!orb) return;

                // Target: blend between base position and cursor position
                const attractStrength = 0.3; // how much they follow cursor
                const targetX = cfg.baseX * canvas.width + (mx - cfg.baseX * canvas.width) * attractStrength;
                const targetY = cfg.baseY * canvas.height + (my - cfg.baseY * canvas.height) * attractStrength;

                // Elastic spring physics
                const springK = 0.015;
                const damping = 0.92;
                orb.vx += (targetX - orb.x) * springK;
                orb.vy += (targetY - orb.y) * springK;
                orb.vx *= damping;
                orb.vy *= damping;
                orb.x += orb.vx;
                orb.y += orb.vy;

                // Draw glowing orb
                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, cfg.radius);
                grad.addColorStop(0, `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, ${cfg.alpha})`);
                grad.addColorStop(0.5, `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, ${cfg.alpha * 0.4})`);
                grad.addColorStop(1, `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, 0)`);
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, cfg.radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // --- Draw particles ---
            particles.forEach((p, i) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += p.pulseSpeed;
                const glow = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

                // Mouse repulsion
                if (window.__heroMouse) {
                    const dx = p.x - mx;
                    const dy = p.y - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120 && dist > 0) {
                        const force = (1 - dist / 120) * 2.5;
                        p.x += (dx / dist) * force;
                        p.y += (dy / dist) * force;
                    }
                }

                if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
                    particles[i] = createParticle();
                    return;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 142, 255, ${glow})`;
                ctx.fill();

                if (p.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(180, 142, 255, ${glow * 0.15})`;
                    ctx.fill();
                }
            });

            requestAnimationFrame(draw);
        }
        draw();
    }
});
