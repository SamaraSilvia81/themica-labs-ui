// ================================================
// THEMICA LANDING — sidebar + temas + dark mode
// ================================================

import './style.css';

const THEMES = [
    { id: 'default',  label: 'Purple',  cls: '',                   dots: ['#7c4ae0','#c14dd8','#090B20'] },
    { id: 'delicatte', label: 'Delicatte', cls: 'lp-theme-delicatte', dots: ['#860120','#fad1da','#828f58'] },
    { id: 'azure',    label: 'Azure',   cls: 'lp-theme-azure',     dots: ['#0066FF','#00D4FF','#6B4EFF'] },
    { id: 'coral',    label: 'Coral',   cls: 'lp-theme-coral',     dots: ['#FF6B6B','#FF8E53','#FFA07A'] },
    { id: 'teal',     label: 'Teal',    cls: 'lp-theme-teal',      dots: ['#00897B','#26C6DA','#4DD0E1'] },
];

let currentTheme = 'default';
let darkMode     = false;

// ── Sidebar ──────────────────────────────────────
function buildSidebar() {
    const sidebar = document.getElementById('lp-sidebar');
    if (!sidebar) return;

    // Render theme buttons
    const grid = sidebar.querySelector('.lp-theme-grid');
    grid.innerHTML = THEMES.map(t => `
        <button class="lp-theme-btn${t.id === currentTheme ? ' active' : ''}"
                data-theme="${t.id}">
            <div class="lp-theme-dots">
                ${t.dots.map(c => `<span style="background:${c}"></span>`).join('')}
            </div>
            <span>${t.label}</span>
        </button>
    `).join('');

    // Theme click
    grid.querySelectorAll('.lp-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.dataset.theme);
            grid.querySelectorAll('.lp-theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Dark toggle
    sidebar.querySelector('#lp-dark-toggle')?.addEventListener('click', toggleDark);

    // Tab click — abre/fecha sidebar
    sidebar.querySelector('.lp-sidebar-tab')?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target)) sidebar.classList.remove('open');
    });
}

function applyTheme(id) {
    const theme = THEMES.find(t => t.id === id) || THEMES[0];
    currentTheme = id;
    // Remove todas as classes de tema
    document.body.classList.remove(...THEMES.map(t => t.cls).filter(Boolean));
    if (theme.cls) document.body.classList.add(theme.cls);
}

function toggleDark() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    const btn  = document.getElementById('lp-dark-toggle');
    const icon = btn?.querySelector('i');
    const text = btn?.querySelector('span');
    if (icon) icon.className = darkMode ? 'ph ph-sun' : 'ph ph-moon';
    if (text) text.textContent = darkMode ? 'Modo claro' : 'Modo escuro';
}

// ── Nav scroll effect ─────────────────────────────
function initNav() {
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// ── Smooth scroll for anchor links ────────────────
function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── Intersection observer — fade-in sections ──────
function initFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    initNav();
    initAnchors();
    initFadeIn();
});
