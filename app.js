/* =============================================
   PEACH POLYMER v4.0 — Logic Engine
   ============================================= */

// ─── 1. THREE.JS — FLOATING 3D SCENE ───
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Studio Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const keyLight = new THREE.DirectionalLight(0x00F0FF, 0.7);
keyLight.position.set(10, 15, 10);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0xc084fc, 0.5);
fillLight.position.set(-10, 5, 8);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0xfb923c, 0.3);
rimLight.position.set(0, -10, -5);
scene.add(rimLight);

// Materials
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x00F0FF, roughness: 0.1, metalness: 0.1, transmission: 0.9, thickness: 2, transparent: true, opacity: 0.8 });
const matteMat = new THREE.MeshPhysicalMaterial({ color: 0xc084fc, roughness: 0.8, metalness: 0.05, clearcoat: 0.3 });
const metalMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.95 });
const orangeMat = new THREE.MeshPhysicalMaterial({ color: 0xfb923c, roughness: 0.3, metalness: 0.5, transmission: 0.6, transparent: true, opacity: 0.85 });

// Shapes
const shapesGroup = new THREE.Group();
scene.add(shapesGroup);

const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.2, 0.7, 100, 16), glassMat);
torusKnot.position.set(6, 2, -18);
shapesGroup.add(torusKnot);

const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 0), matteMat);
ico.position.set(-5, -1, -16);
shapesGroup.add(ico);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), metalMat);
sphere.position.set(-2, 4, -20);
shapesGroup.add(sphere);

const octa = new THREE.Mesh(new THREE.OctahedronGeometry(1.7, 0), orangeMat);
octa.position.set(4, -4, -18);
shapesGroup.add(octa);

// Particles
const particleCount = 1000;
const pGeo = new THREE.BufferGeometry();
const pArr = new Float32Array(particleCount * 3);
const pVel = new Float32Array(particleCount * 3); // Velocity for each particle

for (let i = 0; i < particleCount * 3; i++) {
    pArr[i] = (Math.random() - 0.5) * 50;
    pVel[i] = (Math.random() - 0.5) * 0.06; // faster velocity
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.07, color: 0xaaddff, transparent: true, opacity: 0.75 }));
scene.add(particles);

// Mouse & Scroll tracking
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

let scrollProgress = 0;
window.addEventListener('scroll', () => {
    scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
});

// Render loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate and Move Shapes
    torusKnot.rotation.x = t * 0.14;
    torusKnot.rotation.y = t * 0.18;
    ico.rotation.x = t * 0.1;
    ico.rotation.z = t * 0.12;
    sphere.rotation.y = t * 0.09;
    octa.rotation.x = t * 0.18;
    octa.rotation.y = t * 0.14;

    torusKnot.position.y = 2 + Math.sin(t * 0.5) * 1;
    ico.position.y = -1 + Math.sin(t * 0.55 + 1) * 0.8;
    sphere.position.y = 4 + Math.sin(t * 0.4 + 2) * 0.7;
    octa.position.y = -4 + Math.sin(t * 0.65 + 3) * 0.7;

    // Background Particle Movement
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += pVel[i] + Math.sin(t * 0.4 + i) * 0.008;
        positions[i + 1] += pVel[i + 1] + Math.cos(t * 0.5 + i) * 0.008;
        positions[i + 2] += pVel[i + 2];

        if (Math.abs(positions[i]) > 25) positions[i] *= -0.9;
        if (Math.abs(positions[i + 1]) > 25) positions[i + 1] *= -0.9;
        if (Math.abs(positions[i + 2]) > 25) positions[i + 2] *= -0.9;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = t * 0.04;

    // Mouse Parallax
    shapesGroup.rotation.y += (mouseX * 0.25 - shapesGroup.rotation.y) * 0.025;
    shapesGroup.rotation.x += (-mouseY * 0.15 - shapesGroup.rotation.x) * 0.025;

    camera.position.z = 20 - scrollProgress * 4;
    camera.position.y = -scrollProgress * 2;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── 2. GSAP — HERO ENTRANCE ───
gsap.registerPlugin(ScrollTrigger);

gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.4 })
    .to('.hero-name', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-headline', { opacity: 1, y: 0, duration: 1.1 }, '-=0.5')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');

// ─── 3. SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ─── 4. TIMELINE GSAP ───
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0, duration: 0.9, delay: i * 0.15,
            scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
        }
    );
});

// ─── 5. NAV + SCROLL HINT ───
const nav = document.getElementById('nav');
const scrollHint = document.getElementById('scroll-hint');

window.addEventListener('scroll', () => {
    // Nav glass effect
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Hide scroll hint completely after user starts scrolling
    if (scrollHint) {
        if (window.scrollY > 60) {
            scrollHint.style.opacity = '0';
            scrollHint.style.pointerEvents = 'none';
        }
        // Bring it back only when scrolled all the way to top
        if (window.scrollY < 5) {
            scrollHint.style.opacity = '';
        }
    }
});

// ─── 6. CARD TILT ───
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ─── 7. CONTACT FORM — success feedback ───
const form = document.getElementById('contact-form');
if (form) {
    // FormSubmit redirects to a thank-you page by default.
    // For a seamless in-page experience, we intercept and show a message.
    // Note: FormSubmit needs the real email in action="" to work.
}
