/* =======================================================
   UMBRA — Shader Hero Animation
   Brand-aligned WebGL shader with mouse reactivity
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

    // Fragment shader — Umbra brand colors (deep purple, violet, dark) with mouse reactivity
    const fragmentShader = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 mouse;

        void main(void) {
            vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
            
            // Mouse influence — shift the center toward cursor
            vec2 center = (mouse * 2.0 - 1.0) * 0.3;
            vec2 p = uv - center;
            
            float t = time * 0.05;
            float lineWidth = 0.002;

            // Umbra brand palette: deep purple, violet, dark indigo
            // Channel 0 = R (muted), Channel 1 = G (very muted), Channel 2 = B (dominant purple)
            vec3 color = vec3(0.0);
            
            for (int i = 0; i < 5; i++) {
                float fi = float(i);
                
                // Purple/violet channel (dominant)
                color.b += lineWidth * fi * fi / abs(
                    fract(t + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );
                
                // Red channel (muted, creates violet tint)
                color.r += lineWidth * fi * fi * 0.6 / abs(
                    fract(t - 0.008 + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );
                
                // Green channel (very subtle, deepens the purple)
                color.g += lineWidth * fi * fi * 0.25 / abs(
                    fract(t - 0.015 + fi * 0.01) * 5.0
                    - length(p)
                    + mod(p.x + p.y, 0.2)
                );
            }

            // Add a subtle radial glow from the mouse position
            float mouseDist = length(p);
            float mouseGlow = 0.04 / (mouseDist + 0.5);
            color += vec3(0.38, 0.22, 0.55) * mouseGlow;
            
            // Subtle vignette
            float vignette = 1.0 - length(uv) * 0.4;
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

    container.closest('.scroll-hero__sticky').addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        targetMX = (e.clientX - rect.left) / rect.width;
        targetMY = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for shader coords
    });

    container.closest('.scroll-hero__sticky').addEventListener('mouseleave', () => {
        targetMX = 0.5;
        targetMY = 0.5;
    });

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
