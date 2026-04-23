const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const decodeEl = document.getElementById("decode-text");

const decode = (el) => {
    if (!el) return;
    let iteration = 0;
    const originalText = el.dataset.value;
    const interval = setInterval(() => {
        el.innerText = el.innerText.split("").map((l, i) => {
            if(i < iteration) return originalText[i];
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
};

// --- Particle Trail ---
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
window.dispatchEvent(new Event('resize'));

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = getComputedStyle(document.body).getPropertyValue('--accent');
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

const handleParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update(); p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(handleParticles);
};

// --- Uptime Logic ---
let seconds = 0;
setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) uptimeEl.textContent = `${mins}:${secs}`;
}, 1000);

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });

window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) particles.push(new Particle(e.clientX, e.clientY));
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
});

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((winScroll / height) * 100);
    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + '%';
});

document.addEventListener('DOMContentLoaded', () => {
    decode(decodeEl);
    handleParticles();
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

    const osEl = document.getElementById('user-os');
    if (osEl) {
        const platform = window.navigator.platform;
        osEl.textContent = platform.includes('Win') ? 'WINDOWS' : (platform.includes('Mac') ? 'MACOS' : 'LINUX');
    }

    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        document.body.style.setProperty('--accent-rgb', isDark ? '189, 147, 249' : '108, 92, 231');
    };
});