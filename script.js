// --- Digital Decode ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const decode = (el) => {
    let iteration = 0;
    const originalText = el.dataset.value;
    const interval = setInterval(() => {
        el.innerText = el.innerText.split("").map((letter, index) => {
            if(index < iteration) return originalText[index];
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 40);
};

// --- Neon Particle Engine ---
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
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = getComputedStyle(document.body).getPropertyValue('--accent');
        this.opacity = 1;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.015; }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update(); p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animateParticles);
};

// --- Observers & Scroll ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.querySelectorAll('p, h2').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, i * 200);
            });
        }
    });
}, { threshold: 0.1 });

// --- Global Listeners ---
window.addEventListener('mousemove', e => {
    particles.push(new Particle(e.clientX, e.clientY));
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
});

window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((winScroll / height) * 100);
    document.getElementById('impact-val').textContent = `${scrolled}%`;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

document.addEventListener('DOMContentLoaded', () => {
    decode(document.getElementById('decode-text'));
    animateParticles();
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
    
    // Theme logic
    const toggle = document.getElementById('theme-toggle');
    toggle.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        toggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        document.body.style.setProperty('--accent-rgb', isDark ? '189, 147, 249' : '108, 92, 231');
    };
    
    // Auto-active link
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(l => {
        if(l.getAttribute('href') === path) l.classList.add('active');
    });
});