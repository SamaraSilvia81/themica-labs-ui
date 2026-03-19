// ================================================
// ICON SWITCHER — troca set de ícones da UI
// ================================================

import { storage } from '../utils/storage.js';
import { ICON_SETS } from '../utils/themes-data.js';

const STORAGE_KEY = 'icon-set';
let lucideLoaded  = false;

export class IconSwitcher {
    constructor() {
        this.current = storage.get(STORAGE_KEY, 'phosphor-outline');
    }

    getSet(id = this.current) {
        return ICON_SETS.find(s => s.id === id) || ICON_SETS[0];
    }

    apply(id) {
        this.current = id;
        storage.set(STORAGE_KEY, id);
        const set = this.getSet(id);
        if (set.lib === 'lucide') {
            this._loadLucide(() => this._applyLucide(set.icons));
        } else {
            this._clearLucideAttrs();
            this._applyPhosphor(set.icons);
        }
    }

    restore() {
        const set = this.getSet(this.current);
        if (set.lib === 'lucide') {
            this._loadLucide(() => this._applyLucide(set.icons));
        } else {
            this._applyPhosphor(set.icons);
        }
    }

    _loadLucide(cb) {
        if (lucideLoaded || window.lucide) { lucideLoaded = true; cb(); return; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
        s.onload = () => { lucideLoaded = true; cb(); };
        document.head.appendChild(s);
    }

    _clearLucideAttrs() {
        const sel = '[data-icon], .logo-circle i, .logo-mini i';
        document.querySelectorAll(sel).forEach(el => {
            if (el.hasAttribute('data-lucide')) {
                el.removeAttribute('data-lucide');
                while (el.firstChild) el.removeChild(el.firstChild);
            }
        });
    }

    _applyPhosphor(icons) {
        document.querySelectorAll('.logo-circle i').forEach(el => el.className = icons.logo);
        document.querySelectorAll('.logo-mini i').forEach(el => el.className = icons.logoMini);

        const map = {
            'bell': icons.bell, 'gear': icons.gear, 'user': icons.user,
            'lock': icons.lock, 'arrow-right': icons.arrowRight, 'caret-down': icons.caretDown,
        };
        Object.entries(map).forEach(([key, cls]) => {
            document.querySelectorAll(`[data-icon="${key}"]`).forEach(el => el.className = cls);
        });
        // eye precisa manter toggle-password
        document.querySelectorAll('[data-icon="eye"]').forEach(el => {
            el.className = icons.eye + ' toggle-password';
        });
    }

    _applyLucide(icons) {
        const name = (v) => v.replace('lucide:', '');

        const setLucide = (el, n) => {
            el.className = '';
            el.setAttribute('data-lucide', n);
            while (el.firstChild) el.removeChild(el.firstChild);
        };

        document.querySelectorAll('.logo-circle i').forEach(el => setLucide(el, name(icons.logo)));
        document.querySelectorAll('.logo-mini i').forEach(el => setLucide(el, name(icons.logoMini)));

        const map = {
            'bell': icons.bell, 'gear': icons.gear, 'user': icons.user,
            'lock': icons.lock, 'arrow-right': icons.arrowRight, 'caret-down': icons.caretDown,
        };
        Object.entries(map).forEach(([key, val]) => {
            document.querySelectorAll(`[data-icon="${key}"]`).forEach(el => setLucide(el, name(val)));
        });
        document.querySelectorAll('[data-icon="eye"]').forEach(el => {
            el.className = 'toggle-password';
            el.setAttribute('data-lucide', name(icons.eye));
            while (el.firstChild) el.removeChild(el.firstChild);
        });

        window.lucide?.createIcons();
    }
}
