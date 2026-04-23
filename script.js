// --- 1. Scramble Reveal ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const decode = (el) => {
    if (!el) return;
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

// --- 2. Particle Trail ---
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        this.opacity = 1;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.02; }
    draw() {
        ctx.fillStyle = this.color;
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

// --- 3. Interaction & Stats ---
let seconds = 0;
setInterval(() => {
    seconds++;
    const uptime = document.getElementById('uptime');
    if (uptime) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        uptime.textContent = `${m}:${s}`;
    }
}, 1000);

window.addEventListener('mousemove', e => {
    if (particles.length < 60) particles.push(new Particle(e.clientX, e.clientY));
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + '%';
});

// --- 4. Load ---
document.addEventListener('DOMContentLoaded', () => {
    decode(document.getElementById('decode-text'));
    animate();
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

    const osEl = document.getElementById('user-os');
    if (osEl) {
        const p = navigator.platform;
        osEl.textContent = p.includes('Win') ? 'WINDOWS' : (p.includes('Mac') ? 'MACOS' : 'LINUX');
    }

    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        // Reset particle colors to match current theme accent
        const newColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        particles.forEach(p => p.color = newColor);
    };

    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(l => {
        if(l.getAttribute('href') === path) l.classList.add('active');
    });
});