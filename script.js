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

// Sparkles and Spotlight Logic
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');

    // Create Sparkle
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    
    const size = Math.random() * 6 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// Decode Effect Logic
const decodeEffect = () => {
    const el = document.getElementById('typewriter');
    if (!el) return;
    
    const targetText = "Logic, Strategy, and Systems.";
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    
    const interval = setInterval(() => {
        el.innerText = targetText.split("")
            .map((letter, index) => {
                if (index < iteration) return targetText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
};

// System Stats
let seconds = 0;
setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    if (document.getElementById('uptime')) document.getElementById('uptime').textContent = `${mins}:${secs}`;
}, 1000);

// Active Link and Reveal
document.addEventListener('DOMContentLoaded', () => {
    decodeEffect();
    
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

    const platform = window.navigator.platform;
    const osEl = document.getElementById('user-os');
    if (osEl) {
        if (platform.includes('Win')) osEl.textContent = 'WINDOWS';
        else if (platform.includes('Mac')) osEl.textContent = 'MACOS';
        else osEl.textContent = 'LINUX';
    }
});

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((winScroll / height) * 100);
    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + '%';
});