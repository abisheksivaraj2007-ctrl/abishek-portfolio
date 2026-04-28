// Register GSAP ScrollTrigger (using global gsap from CDN)
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Force scroll to top on load to prevent ScrollTrigger jumping bugs
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
// Clear hash so it doesn't auto-jump to a section like #skills
if (window.location.hash) {
    history.replaceState('', document.title, window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

// =====================================================================
// OCEAN CANVAS — fish background on hero section only
// =====================================================================
const oceanCanvas = document.getElementById('ocean-canvas');
const octx = oceanCanvas.getContext('2d');
let OW, OH;

function resizeOcean() {
    OW = oceanCanvas.width = window.innerWidth;
    OH = oceanCanvas.height = window.innerHeight;
}
resizeOcean();
window.addEventListener('resize', resizeOcean);

// --- Light rays ---
const rays = Array.from({length: 6}, () => ({
    x: Math.random() * 1.2 - 0.1,
    w: 0.02 + Math.random() * 0.04,
    opacity: 0.03 + Math.random() * 0.04,
    speed: 0.00005 + Math.random() * 0.0001
}));

function drawOceanBackground() {
    // Purple ocean gradient
    const grd = octx.createLinearGradient(0, 0, 0, OH);
    grd.addColorStop(0, '#3b1070');
    grd.addColorStop(0.4, '#2e1065');
    grd.addColorStop(1, '#1a0a3e');
    octx.fillStyle = grd;
    octx.fillRect(0, 0, OW, OH);

    // Light rays with purple tint
    rays.forEach(r => {
        r.x += r.speed;
        if (r.x > 1.3) r.x = -0.2;
        octx.save();
        octx.globalAlpha = r.opacity;
        octx.fillStyle = '#c084fc';
        octx.beginPath();
        const x1 = r.x * OW, x2 = x1 + r.w * OW;
        octx.moveTo(x1, 0); octx.lineTo(x2, 0);
        octx.lineTo(x2 + OW * 0.08, OH * 0.7);
        octx.lineTo(x1 - OW * 0.03, OH * 0.7);
        octx.closePath(); octx.fill(); octx.restore();
    });
}

// --- Fish & Sharks ---
const fishColors = [
    {body:'#e9d5ff',tail:'#d8b4fe',fin:'#c084fc'},
    {body:'#f0abfc',tail:'#e879f9',fin:'#d946ef'},
    {body:'#c4b5fd',tail:'#a78bfa',fin:'#8b5cf6'},
    {body:'#fde68a',tail:'#fcd34d',fin:'#fbbf24'},
    {body:'#a5f3fc',tail:'#67e8f9',fin:'#22d3ee'},
    {body:'#fbcfe8',tail:'#f9a8d4',fin:'#f472b6'},
    {body:'#bfdbfe',tail:'#93c5fd',fin:'#60a5fa'},
];
const sharkColor = {body:'#94a3b8',tail:'#cbd5e1',fin:'#64748b'};

function makeFish(isShark) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const sz = isShark ? 50 + Math.random() * 30 : 14 + Math.random() * 22;
    const col = isShark ? sharkColor : fishColors[Math.floor(Math.random() * fishColors.length)];
    const depth = isShark ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.7;
    return {
        x: dir === 1 ? -sz * 2 - Math.random() * OW * 0.5 : OW + sz * 2 + Math.random() * OW * 0.5,
        y: 40 + Math.random() * (OH - 80), dir, size: sz, col, isShark,
        speed: isShark ? 0.8 + Math.random() * 0.6 : 0.4 + Math.random() * 1.8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        wobbleAmp: 0.5 + Math.random() * 1.2,
        depth, scatterVx: 0, scatterVy: 0, scared: 0
    };
}

const fishes = [];
for (let i = 0; i < 22; i++) fishes.push(makeFish(false));
for (let i = 0; i < 3; i++) fishes.push(makeFish(true));

function drawFish(f) {
    octx.save();
    octx.globalAlpha = 0.5 + f.depth * 0.5;
    octx.translate(f.x, f.y);
    octx.scale(f.dir, 1);
    const s = f.size;
    const tailWag = Math.sin(f.wobble) * 0.3;

    octx.fillStyle = f.col.tail;
    octx.beginPath();
    octx.moveTo(-s * 0.4, 0);
    octx.lineTo(-s * 0.85 + tailWag * s * 0.2, -s * 0.3);
    octx.lineTo(-s * 0.85 + tailWag * s * 0.2, s * 0.3);
    octx.closePath(); octx.fill();

    octx.fillStyle = f.col.body;
    octx.beginPath();
    octx.ellipse(0, 0, s * 0.5, s * 0.25, 0, 0, Math.PI * 2);
    octx.fill();

    octx.fillStyle = f.col.fin;
    octx.beginPath();
    octx.moveTo(-s * 0.05, -s * 0.25);
    octx.lineTo(-s * 0.15, -s * 0.45);
    octx.lineTo(s * 0.1, -s * 0.25);
    octx.closePath(); octx.fill();

    if (f.isShark) {
        octx.fillStyle = '#e2e8f0';
        octx.beginPath();
        octx.ellipse(0, s * 0.06, s * 0.42, s * 0.1, 0, 0, Math.PI);
        octx.fill();
    }

    octx.fillStyle = '#fff';
    octx.beginPath(); octx.arc(s * 0.2, -s * 0.06, s * 0.07, 0, Math.PI * 2); octx.fill();
    octx.fillStyle = '#111';
    octx.beginPath(); octx.arc(s * 0.22, -s * 0.06, s * 0.035, 0, Math.PI * 2); octx.fill();

    if (f.scared > 0.3) {
        octx.fillStyle = '#fff';
        octx.beginPath(); octx.arc(s * 0.2, -s * 0.06, s * 0.09, 0, Math.PI * 2); octx.fill();
        octx.fillStyle = '#111';
        octx.beginPath(); octx.arc(s * 0.23, -s * 0.06, s * 0.03, 0, Math.PI * 2); octx.fill();
    }
    octx.restore();
}

function updateFish(f) {
    f.wobble += f.wobbleSpeed * (1 + f.scared * 2);
    const yOff = Math.sin(f.wobble) * f.wobbleAmp;
    f.scatterVx *= 0.96;
    f.scatterVy *= 0.96;
    f.scared *= 0.98;
    f.x += f.dir * f.speed * (1 + f.scared * 3) + f.scatterVx;
    f.y += yOff * 0.3 + f.scatterVy;
    if (f.y < 20) { f.y = 20; f.scatterVy = Math.abs(f.scatterVy) * 0.5; }
    if (f.y > OH - 20) { f.y = OH - 20; f.scatterVy = -Math.abs(f.scatterVy) * 0.5; }
    const margin = f.size * 2;
    if (f.dir === 1 && f.x > OW + margin) { f.x = -margin; f.y = 40 + Math.random() * (OH - 80); }
    if (f.dir === -1 && f.x < -margin) { f.x = OW + margin; f.y = 40 + Math.random() * (OH - 80); }
}

// --- Scatter fish on click ---
function scatterFish(cx, cy) {
    fishes.forEach(f => {
        const dx = f.x - cx, dy = f.y - cy;
        const dist = Math.hypot(dx, dy);
        const radius = 280;
        if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 14;
            const angle = Math.atan2(dy, dx);
            f.scatterVx += Math.cos(angle) * force;
            f.scatterVy += Math.sin(angle) * force;
            f.scared = Math.max(f.scared, 1 - dist / radius);
        }
    });
}

// --- Splash particles (canvas) ---
const splashes = [];
function createSplash(cx, cy) {
    const count = 18 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        splashes.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
            vy: Math.sin(angle) * speed - 4,
            size: 2 + Math.random() * 5,
            life: 1,
            decay: 0.012 + Math.random() * 0.01,
            hue: 270 + Math.random() * 40 // purple hue
        });
    }
}

function updateAndDrawSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
        const p = splashes[i];
        p.vy += 0.18;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.life -= p.decay;
        if (p.life <= 0) { splashes.splice(i, 1); continue; }
        octx.save();
        octx.globalAlpha = p.life * 0.8;
        octx.fillStyle = `hsl(${p.hue}, 75%, 70%)`;
        octx.beginPath();
        octx.ellipse(p.x, p.y, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
        octx.fill();
        octx.globalAlpha = p.life * 0.4;
        octx.fillStyle = '#fff';
        octx.beginPath();
        octx.arc(p.x - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.3, 0, Math.PI * 2);
        octx.fill();
        octx.restore();
    }
}

// --- Ambient bubbles ---
const ambientBubbles = [];
for (let i = 0; i < 15; i++) {
    ambientBubbles.push({
        x: Math.random() * 2000, y: Math.random() * 2000,
        r: 1.5 + Math.random() * 3, speed: 0.2 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2
    });
}
function drawAmbientBubbles() {
    ambientBubbles.forEach(b => {
        b.y -= b.speed;
        b.wobble += 0.02;
        b.x += Math.sin(b.wobble) * 0.3;
        if (b.y < -10) { b.y = OH + 10; b.x = Math.random() * OW; }
        octx.save();
        octx.globalAlpha = 0.2;
        octx.strokeStyle = 'rgba(192,132,252,0.5)';
        octx.lineWidth = 0.8;
        octx.beginPath();
        octx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        octx.stroke();
        octx.globalAlpha = 0.08;
        octx.fillStyle = 'rgba(192,132,252,0.3)';
        octx.fill();
        octx.restore();
    });
}

// --- Determine if hero is in view (show ocean only on home) ---
let heroInView = true;
function checkHeroVisibility() {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    // Hero is "in view" if its bottom hasn't scrolled fully past the viewport top
    heroInView = rect.bottom > 0 && rect.top < window.innerHeight;
}

// --- Click handler: splash + scatter (only when hero is visible) ---
document.addEventListener('click', (e) => {
    createSplash(e.clientX, e.clientY);
    if (heroInView) {
        scatterFish(e.clientX, e.clientY);
    }
});

// --- Ocean render loop ---
function renderOcean() {
    checkHeroVisibility();

    if (heroInView) {
        oceanCanvas.style.opacity = '1';
        drawOceanBackground();
        drawAmbientBubbles();
        fishes.sort((a, b) => a.depth - b.depth);
        fishes.forEach(f => { updateFish(f); drawFish(f); });
        updateAndDrawSplashes();
    } else {
        // Fade out canvas when not on hero, but still update splashes
        oceanCanvas.style.opacity = '0';
        // Still update fish positions so they don't clump when hero returns
        fishes.forEach(f => updateFish(f));
        // Drain remaining splashes
        if (splashes.length > 0) {
            octx.clearRect(0, 0, OW, OH);
            updateAndDrawSplashes();
        }
    }
    requestAnimationFrame(renderOcean);
}
renderOcean();

// =====================================================================
// BUBBLE CURSOR EFFECT (DOM-based, works on all sections)
// =====================================================================
let mouseX = -100, mouseY = -100, lastBubbleTime = 0;

const bubbleColors = [
    'rgba(168,85,247,.35)', 'rgba(192,132,252,.35)', 'rgba(139,92,246,.35)',
    'rgba(232,121,249,.35)', 'rgba(196,181,253,.35)', 'rgba(217,70,239,.35)', 'rgba(99,102,241,.35)'
];
const bubbleBorders = [
    'rgba(168,85,247,.6)', 'rgba(192,132,252,.6)', 'rgba(139,92,246,.6)',
    'rgba(232,121,249,.6)', 'rgba(196,181,253,.6)', 'rgba(217,70,239,.6)', 'rgba(99,102,241,.6)'
];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    const now = performance.now();
    if (now - lastBubbleTime > 40) {
        spawnBubble(mouseX, mouseY);
        lastBubbleTime = now;
    }
});

function spawnBubble(x, y) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const sz = 6 + Math.random() * 16;
    b.style.width = sz + 'px'; b.style.height = sz + 'px';
    const ox = (Math.random() - 0.5) * 20, oy = (Math.random() - 0.5) * 20;
    b.style.left = (x + ox - sz / 2) + 'px';
    b.style.top = (y + oy - sz / 2) + 'px';
    const ci = Math.floor(Math.random() * bubbleColors.length);
    b.style.background = `radial-gradient(circle at 30% 30%,${bubbleBorders[ci]},${bubbleColors[ci]})`;
    b.style.border = `1px solid ${bubbleBorders[ci]}`;
    b.style.boxShadow = `0 0 ${4 + Math.random() * 6}px ${bubbleColors[ci]},inset 0 0 ${2 + Math.random() * 4}px rgba(255,255,255,.15)`;
    b.style.setProperty('--wiggle', Math.random().toFixed(2));
    b.style.setProperty('--rise', Math.random().toFixed(2));
    b.style.setProperty('--end-scale', (0.8 + Math.random() * 0.8).toFixed(2));
    const dur = 1 + Math.random() * 1.2;
    b.style.setProperty('--duration', dur.toFixed(2) + 's');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), dur * 1000 + 50);
}

// Failsafe: If GSAP fails to load or the intro hangs, reveal content anyway
const failsafe = setTimeout(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent && mainContent.style.opacity === "0") {
        gsap.to("#main-content", { opacity: 1, scale: 1, y: 0, duration: 0.5 });
        document.querySelector('.splash-container').style.display = 'none';
    }
}, 3500);

if (typeof gsap !== 'undefined') {
    const introTl = gsap.timeline({
        onComplete: () => clearTimeout(failsafe)
    });

    // Set initial state
    gsap.set("#main-content", { opacity: 0, scale: 0.5, y: 50 });

    introTl.to(".splash", {
        opacity: 1,
        scale: 2,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05
    })
    .to("#s1", { top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 0.7, ease: "power3.inOut" }, "mix")
    .to("#s2", { top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 0.7, ease: "power3.inOut" }, "mix")
    .to("#s3", { top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 0.7, ease: "power3.inOut" }, "mix")
    .to("#s4", { top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 0.7, ease: "power3.inOut" }, "mix")
    .to(".splash", {
        scale: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            const splashCont = document.querySelector('.splash-container');
            if (splashCont) splashCont.style.display = 'none';
        }
    }, "mix+=0.5")
    .to("#main-content", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: "elastic.out(1, 0.5)"
    }, "mix+=0.6");

    // Hero items entrance assembly
    const heroTextItems = document.querySelectorAll('.assemble-item:not(.hero-image)'); 
    const heroImgItems = document.querySelectorAll('.hero-image');

    heroTextItems.forEach((item, index) => {
        introTl.from(item, {
            x: () => (Math.random() - 0.5) * 500,
            y: () => (Math.random() - 0.5) * 500,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        }, `mix+=${0.6 + index * 0.1}`);
    });

    heroImgItems.forEach((img, i) => {
        introTl.from(img, {
            scale: 0.4,
            rotationY: i === 0 ? -45 : 45,
            opacity: 0,
            duration: 1.5,
            ease: "back.out(1.5)",
            transformPerspective: 1000
        }, "mix+=0.6");
    });

    introTl.call(() => {
        window.scrollTo(0, 0);
        initScrollAnimations();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
} else {
    // Reveal immediately if GSAP is missing
    document.getElementById('main-content').style.opacity = "1";
    document.getElementById('main-content').style.transform = "none";
    document.querySelector('.splash-container').style.display = 'none';
}

// =====================================================================
// PROJECTS SLIDER & FLIP CARDS
// =====================================================================
const track = document.getElementById('slider-track');
const slides = document.querySelectorAll('.slide-item');
const nextBtn = document.getElementById('next-slide');
const prevBtn = document.getElementById('prev-slide');
const flipCards = document.querySelectorAll('.flip-card');
let currentIndex = 0;

function updateSlider() {
    gsap.to(track, {
        x: `-${currentIndex * 100}%`,
        duration: 0.8,
        ease: "power3.inOut"
    });
}

// Flip Card Logic
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });
});

if(nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) { 
            currentIndex++; 
            updateSlider(); 
            // Optional: Un-flip cards when moving to next for better UX
            // flipCards.forEach(c => c.classList.remove('is-flipped'));
        }
    });
}
if(prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { 
            currentIndex--; 
            updateSlider(); 
            // flipCards.forEach(c => c.classList.remove('is-flipped'));
        }
    });
}

// =====================================================================
// SCROLL ANIMATIONS (initialized after intro)
// =====================================================================
function initScrollAnimations() {
    
    // Hero Assembly Animation
    const textItems = document.querySelectorAll('.assemble-item:not(.hero-image)'); 
    const heroImages = document.querySelectorAll('.hero-image');
    
    textItems.forEach((item) => {
        gsap.to(item, {
            yPercent: -30 * (item.dataset.speed || 1), 
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    });

    heroImages.forEach((img, i) => {
        gsap.to(img, {
            yPercent: -120,
            rotationZ: i === 0 ? -15 : 15,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        });
    });

    // ======= ABOUT ME SECTION ANIMATIONS =======

    // Floating words appear
    const floatWords = document.querySelectorAll('.float-word');
    ScrollTrigger.create({
        trigger: ".about-section",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => floatWords.forEach(w => w.classList.add('visible')),
        onLeave: () => floatWords.forEach(w => w.classList.remove('visible')),
        onEnterBack: () => floatWords.forEach(w => w.classList.add('visible')),
        onLeaveBack: () => floatWords.forEach(w => w.classList.remove('visible'))
    });

    // Heading entrance
    gsap.from(".about-heading-outline", {
        x: -120,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-heading-wrapper",
            start: "top 85%",
            toggleActions: "play reverse play reverse"
        }
    });
    gsap.from(".about-heading-filled", {
        x: 120,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-heading-wrapper",
            start: "top 85%",
            toggleActions: "play reverse play reverse"
        }
    });
    gsap.from(".about-heading-line", {
        scaleX: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-heading-wrapper",
            start: "top 85%",
            toggleActions: "play reverse play reverse"
        }
    });

    // Bento cards stagger entrance
    gsap.from(".bento-card", {
        y: 80,
        opacity: 0,
        scale: 0.9,
        rotationX: 15,
        transformPerspective: 1000,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-bento",
            start: "top 85%",
            toggleActions: "play reverse play reverse"
        }
    });

    // Stat counter animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(el => {
        const target = parseInt(el.dataset.count);
        if (isNaN(target)) return;
        ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            onEnter: () => {
                gsap.fromTo(el, { innerText: 0 }, {
                    innerText: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        el.textContent = Math.round(this.targets()[0].innerText);
                    }
                });
            },
            onLeaveBack: () => {
                el.textContent = '0';
            }
        });
    });

    // Marquee entrance
    gsap.from(".about-marquee", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-marquee",
            start: "top 95%",
            toggleActions: "play reverse play reverse"
        }
    });

    // Edge Background Combines from Edges on Scroll for Skills Section
    gsap.to('.edge-left', {
        left: "-5vw",
        ease: "none",
        scrollTrigger: {
            trigger: ".skills-section",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    gsap.to('.edge-right', {
        right: "-5vw",
        ease: "none",
        scrollTrigger: {
            trigger: ".skills-section",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // Skills & AI Logos Animation
    const aiLogos = document.querySelectorAll('.ai-logo');

    ScrollTrigger.create({
        trigger: ".skills-section",
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
            gsap.to(aiLogos, {
                opacity: 0.1,
                scale: 1,
                y: () => (Math.random() - 0.5) * 50,
                stagger: 0.2,
                duration: 1.5,
                ease: "back.out(1.7)"
            });
        },
        onLeave: () => {
            gsap.to(aiLogos, { opacity: 0, scale: 0.5, duration: 1 });
        },
        onEnterBack: () => {
            gsap.to(aiLogos, { opacity: 0.1, scale: 1, duration: 1 });
        },
        onLeaveBack: () => {
            gsap.to(aiLogos, { opacity: 0, scale: 0.5, duration: 1 });
        }
    });

    // Animate Skill Cards
    gsap.from(".skill-card", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
            trigger: ".skills-content",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // Glowing Box Entrance Animation
    gsap.from(".glowing-box-slider", {
        scale: 0.8,
        opacity: 0,
        rotationX: 20,
        transformPerspective: 1000,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top 70%",
            toggleActions: "play reverse play reverse"
        }
    });

    // Feedback Section Animation
    gsap.from(".feedback-title", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".feedback-section",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".feedback-form-glass", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
            trigger: ".feedback-section",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // Contact Section Animation
    gsap.from(".contact-heading", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".contact-item", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
            trigger: ".corporate-contact-container",
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });

    // Final refresh after animations are set
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
}

// Global refresh on load to catch any late layout shifts
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

// =====================================================================
// STAR RATING LOGIC
// =====================================================================
const feedbackStars = document.querySelectorAll('#feedback-stars .star');
let selectedRating = 0;

feedbackStars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const val = parseInt(star.dataset.value);
        feedbackStars.forEach(s => {
            if (parseInt(s.dataset.value) <= val) s.classList.add('hovered');
            else s.classList.remove('hovered');
        });
    });

    star.addEventListener('mouseout', () => {
        feedbackStars.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        const ratingInput = document.getElementById('rating-input');
        if (ratingInput) ratingInput.value = selectedRating;
        
        feedbackStars.forEach(s => {
            if (parseInt(s.dataset.value) <= selectedRating) s.classList.add('active');
            else s.classList.remove('active');
        });
        
        // Add a little pop animation on click
        gsap.fromTo(star, { scale: 1.5 }, { scale: 1.2, duration: 0.3, ease: "back.out(2)" });
    });
});

// Feedback Submission Logic (Netlify Form with Fetch)
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (selectedRating === 0) {
            alert('Please provide a star rating!');
            return;
        }

        const formData = new FormData(feedbackForm);
        
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
        .then(() => {
            alert(`Thank you for your ${selectedRating}-star feedback!`);
            feedbackForm.reset();
            selectedRating = 0;
            feedbackStars.forEach(s => s.classList.remove('active'));
            if (document.getElementById('rating-input')) {
                document.getElementById('rating-input').value = 0;
            }
        })
        .catch((error) => {
            console.error('Submission error:', error);
            alert('There was an error submitting your feedback. Please try again.');
        });
    });
}
