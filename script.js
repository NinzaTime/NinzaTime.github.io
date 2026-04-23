const themeToggle = document.getElementById('theme-toggle');

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
        themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
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

// --- Active Link Detection ---
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll('.nav-link-sub').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

// --- System Analytics Logic ---
let seconds = 0;
setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    if (document.getElementById('uptime')) document.getElementById('uptime').textContent = `${mins}:${secs}`;
}, 1000);

window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
    if (document.getElementById('coords')) document.getElementById('coords').textContent = `${e.clientX}, ${e.clientY}`;
});

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((winScroll / height) * 100);
    if (document.getElementById('scroll-pct')) document.getElementById('scroll-pct').textContent = `${scrolled}%`;
    
    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + '%';
});

// --- Content Reveal & Typewriter ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.querySelectorAll('p, h2, h3, .revision-mark').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, i * 100);
            });
        }
    });
}, { threshold: 0.1 });

const titleText = "Logic, Strategy, and Systems.";
let charIndex = 0;
const typeEffect = () => {
    const el = document.getElementById('typewriter');
    if (el && charIndex < titleText.length) {
        el.textContent += titleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 75);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
    const platform = window.navigator.platform;
    const osEl = document.getElementById('user-os');
    if (osEl) {
        if (platform.includes('Win')) osEl.textContent = 'WINDOWS';
        else if (platform.includes('Mac')) osEl.textContent = 'MACOS';
        else if (platform.includes('Linux')) osEl.textContent = 'LINUX';
        else osEl.textContent = 'WEB-AGENT';
    }
});