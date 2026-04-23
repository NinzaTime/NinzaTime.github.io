const themeToggle = document.getElementById('theme-toggle');

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
        themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
    // Synchronize spotlight colors with theme
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

// Mouse tracking for spotlight
window.addEventListener('mousemove', e => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
});

// Staggered reveal observer
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

// Typewriter
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
    
    // Scroll progress listener
    window.onscroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progress = document.querySelector('.scroll-progress');
        if (progress) progress.style.width = scrolled + '%';
    };
});