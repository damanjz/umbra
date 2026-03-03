/* =======================================================
   UMBRA — Shader Hero Animation
   Uses Three.js WebGL shaders for a cinematic hero background
   ======================================================= */

(function () {
    const container = document.querySelector('.scroll-hero__bg');
    if (!container) return;

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return; // Fallback to CSS layers if no WebGL

    // Vertex shader
    const vertexShader = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

    // Fragment shader — animated concentric rings with chromatic aberration
    const fragmentShader = `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359

        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        void main(void) {
            vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
            float t = time * 0.05;
            float lineWidth = 0.002;

            vec3 color = vec3(0.0);
            for (int j = 0; j < 3; j++) {
                for (int i = 0; i < 5; i++) {
                    color[j] += lineWidth * float(i * i) / abs(
                        fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
                        - length(uv)
                        + mod(uv.x + uv.y, 0.2)
                    );
                }
            }

            gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
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
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;';

    // Insert the canvas as the first child so CSS layers overlay it
    container.insertBefore(renderer.domElement, container.firstChild);

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
        renderer.render(scene, camera);
    }

    animate();

    // Pause when not visible (performance)
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
