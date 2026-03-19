// ================================================
// THEME LAB — controlador principal v4.6
// ================================================

import { storage } from '../utils/storage.js';
import { THEMES, TYPOS, PAGES, ICON_SETS } from '../utils/themes-data.js';
import { ColorEditor } from '../features/color-editor.js';
import { CustomPalettes } from '../features/custom-palettes.js';
import { IconSwitcher } from '../features/icon-switcher.js';

export class ThemeLab {
    constructor() {
        this.theme     = storage.get('theme', 'reverie-soft');
        this.typo      = storage.get('typo',  'redhat');
        this.mode      = storage.get('mode',  'light');
        this.page      = storage.get('page',  'login');
        this.activeKey = storage.get('activeKey', `std:${this.theme}`);
        // padrão recolhido ou aberto
        this.stdCollapsed = storage.get('std-collapsed', false);

        this.colorEditor    = null;
        this.customPalettes = new CustomPalettes({
            onActivate: (id) => {
                this.activeKey = `custom:${id}`;
                storage.set('activeKey', this.activeKey);
                this._markActivePalette();
            },
            onUpdate: () => this._renderCustomSection(),
        });
        this.iconSwitcher = new IconSwitcher();
        this.blobsVisible = storage.get('blobs-visible', true);
        this._modal = null;
        this._init();
    }

    _init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._setup());
        } else {
            this._setup();
        }
    }

    _setup() {
        this._applyAll();
        this._buildThemeController();
        this._buildTypoController();
        this._buildIconController();
        this._buildNavController();
        this._bindToggleButtons();
        this._bindOutsideClick();
        this._bindModal();
        if (this.activeKey?.startsWith('custom:')) {
            this.customPalettes.apply(this.activeKey.replace('custom:', ''));
        }
        this.iconSwitcher.restore();
        // Blobs
        this._applyBlobs(this.blobsVisible);
        document.getElementById('btn-toggle-blobs')?.addEventListener('click', () => {
            this.blobsVisible = !this.blobsVisible;
            storage.set('blobs-visible', this.blobsVisible);
            this._applyBlobs(this.blobsVisible);
        });
    }

    _applyBlobs(visible) {
        document.body.classList.toggle('no-blobs', !visible);
        const btn  = document.getElementById('btn-toggle-blobs');
        const text = btn?.querySelector('.blobs-text');
        if (text) text.textContent = visible ? 'Esconder blobs' : 'Mostrar blobs';
        if (btn)  btn.classList.toggle('active', !visible);
    }

    // ── Apply ──────────────────────────────────────
    _applyAll() {
        this._applyTheme(this.theme);
        this._applyTypo(this.typo);
        this._applyMode(this.mode);
        this._applyPage(this.page);
    }

    _applyTheme(id) {
        THEMES.forEach(t => document.body.classList.remove(`theme-${t.id}`));
        document.body.classList.add(`theme-${id}`);
        this.theme = id;
        storage.set('theme', id);
        this.colorEditor?.onThemeChange();
    }

    _applyTypo(id) {
        TYPOS.forEach(t => document.body.classList.remove(`typo-${t.id}`));
        document.body.classList.add(`typo-${id}`);
        this.typo = id;
        storage.set('typo', id);
    }

    _applyMode(mode) {
        document.body.classList.toggle('dark-mode', mode === 'dark');
        this.mode = mode;
        storage.set('mode', mode);
        this._updateModeButton();
    }

    _applyPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${id}`)?.classList.add('active');
        this.page = id;
        storage.set('page', id);
    }

    toggleMode() { this._applyMode(this.mode === 'light' ? 'dark' : 'light'); }

    // ── Theme Controller ───────────────────────────
    _buildThemeController() {
        const ctrl = document.getElementById('theme-controller');
        if (!ctrl) return;

        // Label clicável para recolher
        const section = ctrl.querySelector('.palette-section');
        if (section) {
            const labelEl = section.querySelector('.palette-section-toggle');
            const wrap    = section.querySelector('.palette-buttons-wrap');

            if (this.stdCollapsed) {
                labelEl?.classList.add('collapsed');
                wrap?.classList.add('collapsed');
            }

            labelEl?.addEventListener('click', () => {
                this.stdCollapsed = !this.stdCollapsed;
                storage.set('std-collapsed', this.stdCollapsed);
                labelEl.classList.toggle('collapsed', this.stdCollapsed);
                wrap.classList.toggle('collapsed', this.stdCollapsed);
            });
        }

        // Paletas padrão
        const buttonsHtml = THEMES.map(t => `
            <button class="btn-palette${this.activeKey === `std:${t.id}` ? ' active' : ''}"
                    data-theme="${t.id}">
                <div class="palette-preview">
                    ${t.colors.map(c => `<span style="background:${c}"></span>`).join('')}
                </div>
                <span>${t.label}</span>
            </button>
        `).join('');
        ctrl.querySelector('.palette-buttons').innerHTML = buttonsHtml;

        ctrl.querySelector('#btn-toggle-mode')?.addEventListener('click', () => this.toggleMode());

        ctrl.querySelectorAll('.btn-palette[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.customPalettes.clear();
                this._applyTheme(btn.dataset.theme);
                this.activeKey = `std:${btn.dataset.theme}`;
                storage.set('activeKey', this.activeKey);
                this._markActivePalette();
            });
        });

        this._renderCustomSection();

        const editorContainer = ctrl.querySelector('#color-editor-mount');
        if (editorContainer) {
            this.colorEditor = new ColorEditor(editorContainer, () => this._markActivePalette(null));
            this.colorEditor.restoreSavedColors();
        }
    }

    // ── Seção "Minhas Paletas" ─────────────────────
    _renderCustomSection() {
        const ctrl = document.getElementById('theme-controller');
        if (!ctrl) return;
        const mount = ctrl.querySelector('#custom-palettes-mount');
        if (!mount) return;

        const cp = this.customPalettes;
        cp.injectPreviewStyles();
        const palettes = cp.getAll();
        const canAdd   = cp.canAdd();
        const MAX = 8;

        mount.innerHTML = `
        <div class="controller-section custom-palettes-section">
            <label>
                ✦ Minhas Paletas
                <span class="custom-count">${palettes.length}/${MAX}</span>
            </label>

            ${palettes.length === 0 ? `
                <p class="custom-empty">
                    Nenhuma paleta salva ainda.<br>
                    Edite as cores abaixo e clique em
                    <strong>"Salvar como paleta"</strong>.
                </p>
            ` : `
                <div class="custom-palette-list">
                    ${palettes.map(p => `
                    <div class="custom-palette-item${this.activeKey === `custom:${p.id}` ? ' active' : ''}"
                         data-id="${p.id}">
                        <button class="custom-apply-btn" data-id="${p.id}">
                            <div class="palette-preview">
                                ${p.baseColors.map(c => `<span style="background:${c}"></span>`).join('')}
                            </div>
                            <span class="custom-name">${p.name}</span>
                        </button>
                        <div class="custom-actions">
                            <button class="custom-btn-dupe" data-id="${p.id}" title="Duplicar">
                                <i class="ph ph-copy"></i>
                            </button>
                            <button class="custom-btn-del" data-id="${p.id}" title="Excluir">
                                <i class="ph ph-trash"></i>
                            </button>
                        </div>
                    </div>
                    `).join('')}
                </div>
            `}

            <button class="btn-save-palette${canAdd ? '' : ' disabled'}"
                    id="btn-save-custom-palette" ${canAdd ? '' : 'disabled'}>
                <i class="ph ph-floppy-disk"></i>
                ${canAdd ? 'Salvar cores atuais como paleta' : `Limite de ${MAX} paletas atingido`}
            </button>
        </div>`;

        mount.querySelectorAll('.custom-apply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.customPalettes.apply(btn.dataset.id);
                this._markActivePalette();
            });
        });

        mount.querySelectorAll('.custom-btn-dupe').forEach(btn => {
            btn.addEventListener('click', () => this._openDuplicateModal(btn.dataset.id));
        });

        mount.querySelectorAll('.custom-btn-del').forEach(btn => {
            btn.addEventListener('click', () => this._openDeleteModal(btn.dataset.id));
        });

        mount.querySelector('#btn-save-custom-palette')?.addEventListener('click', () => {
            this._openSaveModal();
        });
    }

    // ── Modal helpers ──────────────────────────────
    _bindModal() {
        const overlay = document.getElementById('palette-modal-overlay');
        document.getElementById('palette-modal-close')?.addEventListener('click', () => this._closeModal());
        document.getElementById('btn-modal-cancel')?.addEventListener('click',    () => this._closeModal());
        overlay?.addEventListener('click', (e) => { if (e.target === overlay) this._closeModal(); });
        document.getElementById('palette-modal-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-modal-confirm')?.click();
            if (e.key === 'Escape') this._closeModal();
        });
    }

    _openModal({ title, label, defaultValue, previewColors, confirmText, confirmClass, onConfirm, danger }) {
        const overlay  = document.getElementById('palette-modal-overlay');
        const titleEl  = document.getElementById('palette-modal-title');
        const labelEl  = document.getElementById('palette-modal-label');
        const input    = document.getElementById('palette-modal-input');
        const preview  = document.getElementById('palette-modal-preview');
        const confirm  = document.getElementById('btn-modal-confirm');
        const modal    = document.getElementById('palette-modal');

        titleEl.innerHTML  = title;
        labelEl.textContent = label || '';
        input.value        = defaultValue || '';
        input.style.display = label ? '' : 'none';
        confirm.textContent = confirmText || 'Confirmar';
        confirm.className   = confirmClass || 'btn-modal-confirm';
        modal.className     = `palette-modal${danger ? ' palette-modal-danger' : ''}`;

        // Preview de cores
        preview.innerHTML = (previewColors || []).map(c =>
            `<span style="background:${c}"></span>`
        ).join('');
        preview.style.display = previewColors?.length ? '' : 'none';

        // Remove listener anterior
        const newConfirm = confirm.cloneNode(true);
        newConfirm.textContent = confirmText || 'Confirmar';
        newConfirm.className   = confirmClass || 'btn-modal-confirm';
        confirm.replaceWith(newConfirm);
        newConfirm.addEventListener('click', () => {
            onConfirm(input.value.trim());
            this._closeModal();
        });

        overlay.classList.add('active');
        setTimeout(() => input.style.display !== 'none' && input.focus(), 50);
    }

    _closeModal() {
        document.getElementById('palette-modal-overlay')?.classList.remove('active');
    }

    _openSaveModal() {
        const vars = this.customPalettes.readCurrentVars();
        const colors = [vars['--primary'], vars['--secondary'], vars['--accent']].filter(Boolean);
        const defaultName = `Minha Paleta ${this.customPalettes.getAll().length + 1}`;
        this._openModal({
            title: '<i class="ph ph-floppy-disk"></i> Salvar Paleta',
            label: 'Nome da paleta',
            defaultValue: defaultName,
            previewColors: colors,
            confirmText: 'Salvar',
            onConfirm: (name) => {
                if (!name) return;
                const result = this.customPalettes.save({ name, vars, baseColors: colors });
                if (result.error) { setTimeout(() => this._showToast(result.error, 'error'), 100); }
                else { this.customPalettes.apply(result.palette.id); this._markActivePalette(); }
            }
        });
    }

    _openDuplicateModal(id) {
        const p = this.customPalettes.getById(id);
        if (!p) return;
        this._openModal({
            title: '<i class="ph ph-copy"></i> Duplicar Paleta',
            label: 'Nome para a cópia',
            defaultValue: `${p.name} (cópia)`,
            previewColors: p.baseColors,
            confirmText: 'Duplicar',
            onConfirm: (name) => {
                if (!name) return;
                const result = this.customPalettes.save({ name, vars: {...p.vars}, baseColors: [...p.baseColors] });
                if (result.error) { setTimeout(() => this._showToast(result.error, 'error'), 100); }
                else { this.customPalettes.apply(result.palette.id); this._markActivePalette(); }
            }
        });
    }

    _openDeleteModal(id) {
        const p = this.customPalettes.getById(id);
        if (!p) return;
        this._openModal({
            title: '<i class="ph ph-trash"></i> Excluir Paleta',
            label: null,
            previewColors: p.baseColors,
            confirmText: `Excluir "${p.name}"`,
            confirmClass: 'btn-modal-danger',
            danger: true,
            onConfirm: () => {
                this.customPalettes.delete(id);
                if (this.activeKey === `custom:${id}`) {
                    this.customPalettes.clear();
                    this.activeKey = `std:${this.theme}`;
                    storage.set('activeKey', this.activeKey);
                    this._markActivePalette();
                }
            }
        });
    }

    _showToast(msg, type = 'info') {
        const el = document.createElement('div');
        el.style.cssText = `position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);
            background:var(--bg-elevated);border:1px solid var(--border-color);
            padding:.6rem 1.2rem;border-radius:9px;font-size:.85rem;font-weight:600;
            color:var(--text-primary);z-index:3000;box-shadow:var(--shadow-md);`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    _markActivePalette() {
        const ctrl = document.getElementById('theme-controller');
        if (!ctrl) return;
        ctrl.querySelectorAll('.btn-palette[data-theme]').forEach(btn => {
            btn.classList.toggle('active', this.activeKey === `std:${btn.dataset.theme}`);
        });
        ctrl.querySelectorAll('.custom-palette-item').forEach(item => {
            item.classList.toggle('active', this.activeKey === `custom:${item.dataset.id}`);
        });
    }

    // ── Typo Controller ────────────────────────────
    _buildTypoController() {
        const ctrl = document.getElementById('typo-controller');
        if (!ctrl) return;
        const html = TYPOS.map(t => `
            <button class="btn-typo${t.id === this.typo ? ' active' : ''}" data-typo="${t.id}">
                <span class="typo-preview" style="font-family:'${t.label}'">${t.sample}</span>
                <div class="typo-info">
                    <span class="typo-name">${t.label}</span>
                    <span class="typo-description">${t.description}</span>
                </div>
            </button>
        `).join('');
        ctrl.querySelector('.typo-buttons').innerHTML = html;
        ctrl.querySelectorAll('.btn-typo').forEach(btn => {
            btn.addEventListener('click', () => {
                ctrl.querySelectorAll('.btn-typo').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._applyTypo(btn.dataset.typo);
            });
        });
    }

    // ── Icon Controller ────────────────────────────
    _buildIconController() {
        const ctrl = document.getElementById('icon-controller');
        if (!ctrl) return;
        const html = ICON_SETS.map(s => `
            <button class="btn-icon-set${s.id === this.iconSwitcher.current ? ' active' : ''}"
                    data-icon-set="${s.id}">
                <i class="${s.icon.includes('ph') ? s.icon : 'ph ph-star-four'} icon-set-preview"></i>
                <div class="icon-set-info">
                    <span class="icon-set-name">${s.label}</span>
                    <span class="icon-set-lib">${s.lib === 'lucide' ? 'lucide-icons' : 'phosphor-icons'}</span>
                </div>
            </button>
        `).join('');
        ctrl.querySelector('.icon-buttons').innerHTML = html;
        ctrl.querySelectorAll('.btn-icon-set').forEach(btn => {
            btn.addEventListener('click', () => {
                ctrl.querySelectorAll('.btn-icon-set').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.iconSwitcher.apply(btn.dataset.iconSet);
            });
        });
    }

    // ── Nav Controller ─────────────────────────────
    _buildNavController() {
        const ctrl = document.getElementById('nav-controller');
        if (!ctrl) return;
        const html = PAGES.map(p => `
            <button class="btn-nav${p.id === this.page ? ' active' : ''}" data-page="${p.id}">
                <i class="ph ph-${p.icon.replace('ph-','')}"></i>
                <span>${p.label}</span>
            </button>
        `).join('');
        ctrl.querySelector('.nav-buttons').innerHTML = html;
        ctrl.querySelectorAll('.btn-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                ctrl.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._applyPage(btn.dataset.page);
                this._closeAll();
            });
        });
    }

    // ── Toggle Buttons ─────────────────────────────
    _bindToggleButtons() {
        const map = [
            { toggle: 'btn-toggle-theme', close: 'btn-close-theme', ctrl: 'theme-controller' },
            { toggle: 'btn-toggle-typo',  close: 'btn-close-typo',  ctrl: 'typo-controller'  },
            { toggle: 'btn-toggle-icons', close: 'btn-close-icons', ctrl: 'icon-controller'  },
            { toggle: 'btn-toggle-nav',   close: 'btn-close-nav',   ctrl: 'nav-controller'   },
        ];
        map.forEach(({ toggle, close, ctrl }) => {
            const btnOpen  = document.getElementById(toggle);
            const btnClose = document.getElementById(close);
            const panel    = document.getElementById(ctrl);
            btnOpen?.addEventListener('click', (e) => {
                e.stopPropagation();
                this._closeAll();
                panel?.classList.add('active');
                btnOpen.style.opacity = '0';
                btnOpen.style.pointerEvents = 'none';
            });
            btnClose?.addEventListener('click', () => {
                panel?.classList.remove('active');
                if (btnOpen) { btnOpen.style.opacity = ''; btnOpen.style.pointerEvents = ''; }
            });
        });
    }

    _bindOutsideClick() {
        document.addEventListener('click', (e) => {
            const panels = ['theme-controller','typo-controller','icon-controller','nav-controller'];
            const isInside    = panels.some(id => document.getElementById(id)?.contains(e.target));
            const isToggle    = ['btn-toggle-theme','btn-toggle-typo','btn-toggle-icons','btn-toggle-nav']
                .some(id => document.getElementById(id)?.contains(e.target));
            const isModal     = document.getElementById('palette-modal-overlay')?.contains(e.target);
            if (!isInside && !isToggle && !isModal) this._closeAll();
        });
    }

    _closeAll() {
        ['theme-controller','typo-controller','icon-controller','nav-controller'].forEach(id => {
            document.getElementById(id)?.classList.remove('active');
        });
        ['btn-toggle-theme','btn-toggle-typo','btn-toggle-icons','btn-toggle-nav'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) { btn.style.opacity = ''; btn.style.pointerEvents = ''; }
        });
    }

    _updateModeButton() {
        const btn = document.getElementById('btn-toggle-mode');
        if (!btn) return;
        btn.querySelector('.mode-icon')?.textContent && (btn.querySelector('.mode-icon').textContent = this.mode === 'dark' ? '☀️' : '🌙');
        const text = btn.querySelector('.mode-text');
        if (text) text.textContent = this.mode === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
}
