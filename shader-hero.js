/* =======================================================
   UMBRA — Shader Hero Animation
   Brand-aligned WebGL shader with mouse reactivity
   Layer 1: Animated mesh gradient background
   Layer 2: Concentric rings with chromatic separation
   ======================================================= */

(function () {
    const container = document.querySelector('.scroll-hero__bg');
    if (!container) return;

    // Check for WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;

    // Vertex shader
    const vertexShader = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Combined fragment shader — mesh gradient bg + brand-colored rings
    const fragmentShader = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 mouse;

        // Simplex-style noise for mesh gradient
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(p);
                p *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }

        void main(void) {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec2 centered = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

            // Mouse influence
            vec2 center = (mouse * 2.0 - 1.0) * 0.3;
            vec2 p = centered - center;

            float t = time * 0.05;

            // ========== LAYER 1: Mesh Gradient Background ==========
            vec2 gradUV = uv;
            // Warp UV with mouse
            gradUV += (mouse - 0.5) * 0.1;

            float slowTime = time * 0.02;

            // Flowing noise layers
            float n1 = fbm(gradUV * 3.0 + vec2(slowTime, slowTime * 0.7));
            float n2 = fbm(gradUV * 2.0 - vec2(slowTime * 0.5, slowTime * 1.2));
            float n3 = fbm(gradUV * 4.0 + vec2(slowTime * 0.8, -slowTime * 0.3));

            // Umbra brand gradient colors
            vec3 deepBlack = vec3(0.02, 0.02, 0.04);
            vec3 darkPurple = vec3(0.08, 0.03, 0.15);
            vec3 midPurple  = vec3(0.15, 0.06, 0.25);
            vec3 violet     = vec3(0.25, 0.12, 0.40);

            // Blend based on noise
            vec3 gradient = mix(deepBlack, darkPurple, smoothstep(0.2, 0.6, n1));
            gradient = mix(gradient, midPurple, smoothstep(0.4, 0.7, n2) * 0.7);
            gradient = mix(gradient, violet, smoothstep(0.5, 0.8, n3) * 0.4);

            // Subtle animated highlight streaks
            float streak = sin(uv.x * 15.0 + time * 0.3) * cos(uv.y * 10.0 + time * 0.2);
            streak = pow(abs(streak), 3.0) * 0.15;
            gradient += vec3(0.20, 0.10, 0.35) * streak;

            // Dot/grid pattern overlay (inspired by DotOrbit)
            vec2 dotUV = uv * 30.0;
            vec2 dotGrid = fract(dotUV) - 0.5;
            float dotDist = length(dotGrid);
            float dotPulse = sin(time * 0.5 + floor(dotUV.x) * 0.5 + floor(dotUV.y) * 0.7);
            float dots = smoothstep(0.15, 0.1, dotDist) * (0.03 + 0.02 * dotPulse);
            gradient += vec3(0.30, 0.15, 0.50) * dots;

            // ========== LAYER 2: Concentric Rings ==========
            float lineWidth = 0.002;
            vec3 rings = vec3(0.0);

            for (int i = 0; i < 5; i++) {
                float fi = float(i);

                // Purple/violet channel (dominant)
                rings.b += lineWidth * fi * fi / abs(
                    fract(t + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );

                // Red channel (muted violet tint)
                rings.r += lineWidth * fi * fi * 0.6 / abs(
                    fract(t - 0.008 + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );

                // Green channel (very subtle)
                rings.g += lineWidth * fi * fi * 0.25 / abs(
                    fract(t - 0.015 + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );
            }

            // Mouse glow
            float mouseDist = length(p);
            float mouseGlow = 0.04 / (mouseDist + 0.5);
            rings += vec3(0.38, 0.22, 0.55) * mouseGlow;

            // ========== COMPOSITE ==========
            // Add rings on top of gradient
            vec3 color = gradient + rings;

            // Vignette
            float vignette = 1.0 - length(centered) * 0.35;
            color *= vignette;

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Initialize Three.js
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
        time: { type: 'f', value: 1.0 },
        resolution: { type: 'v2', value: new THREE.Vector2() },
        mouse: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;';

    container.insertBefore(renderer.domElement, container.firstChild);

    // Smooth mouse tracking
    let targetMX = 0.5, targetMY = 0.5;
    let currentMX = 0.5, currentMY = 0.5;

    const stickyEl = container.closest('.scroll-hero__sticky');
    if (stickyEl) {
        stickyEl.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            targetMX = (e.clientX - rect.left) / rect.width;
            targetMY = 1.0 - (e.clientY - rect.top) / rect.height;
        });

        stickyEl.addEventListener('mouseleave', () => {
            targetMX = 0.5;
            targetMY = 0.5;
        });
    }

    // Handle resize
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.resolution.value.x = renderer.domElement.width;
        uniforms.resolution.value.y = renderer.domElement.height;
    }

    onResize();
    window.addEventListener('resize', onResize);

    // Animation loop
    let animId;
    function animate() {
        animId = requestAnimationFrame(animate);
        uniforms.time.value += 0.05;

        // Smooth mouse interpolation
        currentMX += (targetMX - currentMX) * 0.05;
        currentMY += (targetMY - currentMY) * 0.05;
        uniforms.mouse.value.x = currentMX;
        uniforms.mouse.value.y = currentMY;

        renderer.render(scene, camera);
    }

    animate();

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animId) animate();
            } else {
                cancelAnimationFrame(animId);
                animId = null;
            }
        });
    }, { threshold: 0.1 });

    observer.observe(container);
})();
