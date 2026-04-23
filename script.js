// --- 1. Robust Scramble Reveal ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const decode = (el) => {
    if (!el || !el.dataset.value) return; 
    const originalText = el.dataset.value;
    let iteration = 0;
    const interval = setInterval(() => {
        el.innerText = el.innerText.split("").map((l, i) => {
            if(i < iteration) return originalText[i];
            return letters[Math.floor(Math.random() * 36)];
        }).join("");
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 35);
};

// --- 2. Theme Persistence & Initialization ---
const syncTheme = () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeBtn) themeBtn.textContent = "🌙 Dark Mode";
    }

    if (themeBtn) {
        themeBtn.onclick = () => {
            const isDark = body.classList.toggle('dark-mode');
            localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
            themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        };
    }
};

// --- 3. Core Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    syncTheme();
    decode(document.getElementById('decode-text'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

    // Fix: Highlight active page in Navbar
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });

    // System Uptime Logic
    let seconds = 0;
    setInterval(() => {
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) {
            seconds++;
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            uptimeEl.textContent = `${m}:${s}`;
        }
    }, 1000);
});

// --- 4. Particle Engine (Canvas Guarded) ---
const canvas = document.getElementById('trail-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = 1;
        }
        update() { this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.02; }
        draw() {
            const accent = getComputedStyle(document.body).getPropertyValue('--accent');
            ctx.fillStyle = accent;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.update(); p.draw();
            if (p.opacity <= 0) particles.splice(i, 1);
        });
        requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousemove', e => {
        if (particles.length < 50) particles.push(new Particle(e.clientX, e.clientY));
        document.body.style.setProperty('--x', e.clientX + 'px');
        document.body.style.setProperty('--y', e.clientY + 'px');
    });
}