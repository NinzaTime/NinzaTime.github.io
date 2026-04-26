// --- THEME ENGINE ---
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

// --- UPTIME PERSISTENCE ---
let bootTime = localStorage.getItem('portfolio-boot-time') || Date.now();
if (!localStorage.getItem('portfolio-boot-time')) {
    localStorage.setItem('portfolio-boot-time', bootTime);
}

setInterval(() => {
    const now = Date.now();
    const diff = Math.floor((now - parseInt(bootTime)) / 1000);

    const years = Math.floor(diff / (31536000));
    const months = Math.floor((diff % 31536000) / 2592000);
    const days = Math.floor((diff % 2592000) / 864000);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;

    let timeString = "";
    if (years > 0) timeString += `${years}y `;
    if (months > 0) timeString += `${months}m `;
    if (days > 0) timeString += `${days}d `;
    
    timeString += `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) uptimeEl.textContent = timeString;
}, 1000);

// --- MOUSE & SPARKLE INTERACTION ---
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    const size = Math.random() * 5 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    document.body.appendChild(sparkle);
    setTimeout(() => {
        sparkle.remove();
    }, 800);
});

// --- DECODE REVEAL ---
const decodeEffect = () => {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const targetText = el.dataset.value || "Logic, Strategy, and Systems.";
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    
    const interval = setInterval(() => {
        el.innerText = targetText.split("").map((letter, index) => {
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        
        if (iteration >= targetText.length) {
            clearInterval(interval);
        }
        
        iteration += 1/2; 
    }, 20); 
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    decodeEffect();
    
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link-sub').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
    
    const osEl = document.getElementById('user-os');
    if (osEl) {
        osEl.textContent = window.navigator.platform.includes('Win') ? 'WINDOWS' : 'MACOS';
    }
});