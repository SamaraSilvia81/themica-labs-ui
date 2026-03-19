// ================================================
// CUSTOM PALETTES — salvar paletas personalizadas
// Até 5 paletas no localStorage, sem login.
// Suporta: criar do zero (editor) ou duplicar existente.
// ================================================

import { storage } from '../utils/storage.js';
import { EDITABLE_VARS } from '../utils/themes-data.js';

const STORAGE_KEY  = 'custom-palettes';
const MAX_PALETTES = 8;

export class CustomPalettes {
    constructor({ onActivate, onUpdate } = {}) {
        this.onActivate = onActivate; // (paletteId) → aplica no body
        this.onUpdate   = onUpdate;   // () → re-renderiza seção
    }

    // ── CRUD ──────────────────────────────────────

    getAll() {
        return storage.get(STORAGE_KEY, []);
    }

    getById(id) {
        return this.getAll().find(p => p.id === id) || null;
    }

    canAdd() {
        return this.getAll().length < MAX_PALETTES;
    }

    // Salva paleta nova ou atualiza existente
    // vars: { '--primary': '#hex', ... }
    // name: string
    // baseId: id de paleta base (opcional — para preview colors)
    save({ id, name, vars, baseColors }) {
        const all = this.getAll();
        const existing = all.findIndex(p => p.id === id);
        const palette = {
            id: id || `custom-${Date.now()}`,
            name: name.trim() || 'Minha Paleta',
            vars,
            baseColors: baseColors || [vars['--primary'] || '#888', vars['--secondary'] || '#aaa', vars['--accent'] || '#ccc'],
            createdAt: existing >= 0 ? all[existing].createdAt : Date.now(),
            updatedAt: Date.now(),
        };

        if (existing >= 0) {
            all[existing] = palette;
        } else {
            if (all.length >= MAX_PALETTES) return { error: `Limite de ${MAX_PALETTES} paletas atingido.` };
            all.push(palette);
        }

        storage.set(STORAGE_KEY, all);
        this.onUpdate?.();
        return { ok: true, palette };
    }

    delete(id) {
        const all = this.getAll().filter(p => p.id !== id);
        storage.set(STORAGE_KEY, all);
        this.onUpdate?.();
    }

    // ── Aplicar no DOM ─────────────────────────────

    apply(id) {
        const palette = this.getById(id);
        if (!palette) return;
        // Remove inline styles de paletas anteriores
        EDITABLE_VARS.forEach(v => document.body.style.removeProperty(v.key));
        // Aplica vars da paleta salva
        Object.entries(palette.vars).forEach(([key, val]) => {
            document.body.style.setProperty(key, val);
        });
        this.onActivate?.(id);
    }

    // Remove override inline (volta ao tema CSS)
    clear() {
        EDITABLE_VARS.forEach(v => document.body.style.removeProperty(v.key));
    }

    // Lê vars atuais do body (para salvar estado atual)
    readCurrentVars() {
        const style = getComputedStyle(document.body);
        const vars = {};
        EDITABLE_VARS.forEach(({ key }) => {
            const raw = document.body.style.getPropertyValue(key)
                || style.getPropertyValue(key).trim();
            vars[key] = raw || '';
        });
        return vars;
    }

    // ── CSS dinâmico ───────────────────────────────
    // Injeta uma <style> com as vars da paleta como classe CSS
    // para que o preview swatch use as cores certas
    injectPreviewStyles() {
        let el = document.getElementById('custom-palette-styles');
        if (!el) {
            el = document.createElement('style');
            el.id = 'custom-palette-styles';
            document.head.appendChild(el);
        }
        const rules = this.getAll().map(p => {
            const vars = Object.entries(p.vars).map(([k, v]) => `${k}:${v};`).join('');
            return `.preview-${p.id}{${vars}}`;
        }).join('\n');
        el.textContent = rules;
    }
}
