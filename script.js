/* ================= TYPING EFFECT ================= */
var typed = new Typed('#typing-text', {
    strings: ['AI Student', 'Data Analyst', 'Web Developer', 'Problem Solver'],
    typeSpeed: 60,
    backSpeed: 40,
    loop: true
});

/* ================= MOBILE MENU TOGGLE ================= */
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    menu.classList.toggle("active");
}

/* ================= THEME TOGGLE ================= */
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const btn = document.querySelector('.theme-toggle');
    btn.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    // Redraw canvas particles with new theme colors
    initCanvas();
}

/* ================= SCROLL PROGRESS ================= */
window.onscroll = function () {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
};

/* ================= ANIMATED BACKGROUND ================= */
(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], lines = [], mouse = { x: -999, y: -999 };
    const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 80;
    const LINE_DIST = 130;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function isLight() {
        return document.body.classList.contains('light-theme');
    }

    function randomColor() {
        const dark = ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4', '#3b82f6'];
        const light = ['#3b82f6', '#6366f1', '#a855f7', '#0ea5e9', '#3b82f6'];
        const arr = isLight() ? light : dark;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 1;
            this.color = randomColor();
            this.alpha = Math.random() * 0.5 + 0.3;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            // Subtle mouse attraction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.vx += dx * 0.0003;
                this.vy += dy * 0.0003;
            }
            // Speed cap
            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1.2) { this.vx *= 0.95; this.vy *= 0.95; }
            // Wrap
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;
        }
        draw() {
            let pulsedR = this.r + Math.sin(this.pulse) * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulsedR, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha + Math.sin(this.pulse) * 0.1;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initCanvas() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    let alpha = (1 - dist / LINE_DIST) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = isLight()
                        ? `rgba(99,102,241,${alpha})`
                        : `rgba(99,102,241,${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    // Floating orbs in background
    const orbs = [
        { x: 0.15, y: 0.2, r: 280, color: 'rgba(59,130,246,0.07)' },
        { x: 0.85, y: 0.15, r: 220, color: 'rgba(139,92,246,0.07)' },
        { x: 0.5, y: 0.7, r: 260, color: 'rgba(6,182,212,0.05)' },
        { x: 0.1, y: 0.85, r: 200, color: 'rgba(99,102,241,0.06)' },
        { x: 0.9, y: 0.75, r: 180, color: 'rgba(168,85,247,0.06)' },
    ];
    let orbTime = 0;

    function drawOrbs() {
        orbTime += 0.004;
        orbs.forEach((orb, i) => {
            let ox = orb.x * W + Math.sin(orbTime + i * 1.3) * 40;
            let oy = orb.y * H + Math.cos(orbTime + i * 0.9) * 30;
            let grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
            grad.addColorStop(0, orb.color);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        // Background fill
        if (isLight()) {
            ctx.fillStyle = '#f0f4ff';
        } else {
            ctx.fillStyle = '#0f172a';
        }
        ctx.fillRect(0, 0, W, H);

        drawOrbs();
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        particles.forEach(p => p.reset());
    });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.initCanvas = initCanvas;

    initCanvas();
    animate();
})();