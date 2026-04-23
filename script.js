// Theme Logic
const themeToggle = document.getElementById('theme-toggle');
const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    document.body.style.setProperty('--accent-rgb', isDark ? '189, 147, 249' : '108, 92, 231');
};

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        const currentTheme = isDark ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', currentTheme);
        applyTheme(currentTheme);
    };
}

// Persistent Uptime
let bootTime = localStorage.getItem('portfolio-boot-time');
if (!bootTime) {
    bootTime = Date.now();
    localStorage.setItem('portfolio-boot-time', bootTime);
}

setInterval(() => {
    const totalSeconds = Math.floor((Date.now() - parseInt(bootTime)) / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) uptimeEl.textContent = `${mins}:${secs}`;
}, 1000);

// Interactions
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
    const coords = document.getElementById('coords');
    if (coords) coords.textContent = `${e.clientX}, ${e.clientY}`;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    const size = Math.random() * 5 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// Decode Reveal
const decodeEffect = () => {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const targetText = "Logic, Strategy, and Systems.";
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    const interval = setInterval(() => {
        el.innerText = targetText.split("").map((letter, index) => {
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
};

document.addEventListener('DOMContentLoaded', () => {
    decodeEffect();
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

    const platform = window.navigator.platform;
    const osEl = document.getElementById('user-os');
    if (osEl) osEl.textContent = platform.includes('Win') ? 'WINDOWS' : platform.includes('Mac') ? 'MACOS' : 'LINUX';
});

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((winScroll / height) * 100);
    const scrollPct = document.getElementById('scroll-pct');
    if (scrollPct) scrollPct.textContent = `${scrolled}%`;
    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + '%';
});