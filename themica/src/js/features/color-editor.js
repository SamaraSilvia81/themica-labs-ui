// ================================================
// COLOR EDITOR — editor visual de variáveis CSS
// Permite editar HEX/RGBA ao vivo e salvar no localStorage
// ================================================

import { storage } from '../utils/storage.js';
import { EDITABLE_VARS } from '../utils/themes-data.js';

const STORAGE_KEY = 'custom-colors';

export class ColorEditor {
    constructor(containerEl, onApply) {
        this.container = containerEl;
        this.onApply = onApply; // callback quando cores são aplicadas
        this.values = {};
        this.render();
    }

    // Lê o valor atual de uma CSS var do body
    _readVar(key) {
        return getComputedStyle(document.body).getPropertyValue(key).trim() || '#000000';
    }

    // Normaliza valor para hex (se vier como rgb/rgba, converte)
    _toHex(value) {
        if (!value) return '#000000';
        if (value.startsWith('#')) return value.slice(0, 7);

        // rgb(r, g, b) ou rgba(r, g, b, a)
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return '#' + [match[1], match[2], match[3]]
                .map(n => parseInt(n).toString(16).padStart(2, '0'))
                .join('');
        }
        return '#000000';
    }

    render() {
        const saved = storage.get(STORAGE_KEY, {});

        const html = `
        <div class="color-editor-section">
            <div class="controller-section">
                <label>✏️ Editar Cores (HEX / RGBA)</label>
                <div class="color-editor-grid">
                    ${EDITABLE_VARS.map(v => `
                    <div class="color-editor-field" data-var="${v.key}">
                        <label>${v.label}</label>
                        <div class="color-input-row">
                            <div class="color-swatch">
                                <input type="color" data-target="${v.key}" title="Escolha uma cor">
                            </div>
                            <input
                                type="text"
                                class="color-hex-input"
                                data-var="${v.key}"
                                placeholder="#000000"
                                maxlength="25"
                                spellcheck="false"
                            >
                        </div>
                    </div>
                    `).join('')}
                </div>
                <button class="btn-apply-colors" id="btn-apply-custom">
                    <i class="ph ph-paint-bucket"></i> Aplicar
                </button>
                <button class="btn-reset-colors" id="btn-reset-custom">
                    Resetar para o tema base
                </button>
            </div>
        </div>`;

        this.container.insertAdjacentHTML('beforeend', html);
        this._bindEvents();
        this.syncFromDOM(); // popula com valores atuais
        if (Object.keys(saved).length > 0) this._applyValues(saved);
    }

    // Lê valores atuais do DOM e preenche o editor
    syncFromDOM() {
        EDITABLE_VARS.forEach(v => {
            const hex = this._toHex(this._readVar(v.key));
            this._setInputValue(v.key, hex);
        });
    }

    _setInputValue(varKey, hex) {
        const hexInput = this.container.querySelector(`.color-hex-input[data-var="${varKey}"]`);
        const colorInput = this.container.querySelector(`input[type="color"][data-target="${varKey}"]`);
        if (hexInput) hexInput.value = hex;
        if (colorInput) {
            try { colorInput.value = hex; } catch { /* invalid color */ }
        }
    }

    _bindEvents() {
        // Color picker → atualiza hex input ao vivo
        this.container.querySelectorAll('input[type="color"]').forEach(picker => {
            picker.addEventListener('input', (e) => {
                const varKey = e.target.dataset.target;
                const hex = e.target.value;
                const hexInput = this.container.querySelector(`.color-hex-input[data-var="${varKey}"]`);
                if (hexInput) hexInput.value = hex;
                // Preview ao vivo
                document.body.style.setProperty(varKey, hex);
            });
        });

        // Hex input → atualiza color picker + preview ao vivo
        this.container.querySelectorAll('.color-hex-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const varKey = e.target.dataset.var;
                const value = e.target.value.trim();
                // Preview ao vivo (aceita hex e rgba)
                if (this._isValidColor(value)) {
                    document.body.style.setProperty(varKey, value);
                    const hex = this._toHex(value);
                    const colorInput = this.container.querySelector(`input[type="color"][data-target="${varKey}"]`);
                    try { if (colorInput) colorInput.value = hex; } catch { /* noop */ }
                }
            });
        });

        // Botão Aplicar
        this.container.querySelector('#btn-apply-custom')?.addEventListener('click', () => {
            const values = this._collectValues();
            this._applyValues(values);
            storage.set(STORAGE_KEY, values);
            this.onApply?.('custom');
            this._showFeedback('Cores aplicadas e salvas!');
        });

        // Botão Reset
        this.container.querySelector('#btn-reset-custom')?.addEventListener('click', () => {
            storage.remove(STORAGE_KEY);
            EDITABLE_VARS.forEach(v => document.body.style.removeProperty(v.key));
            this.syncFromDOM();
            this.onApply?.('reset');
            this._showFeedback('Resetado para o tema base');
        });
    }

    _collectValues() {
        const values = {};
        this.container.querySelectorAll('.color-hex-input').forEach(input => {
            const varKey = input.dataset.var;
            const value = input.value.trim();
            if (varKey && value) values[varKey] = value;
        });
        return values;
    }

    _applyValues(values) {
        Object.entries(values).forEach(([key, value]) => {
            document.body.style.setProperty(key, value);
            this._setInputValue(key, this._toHex(value));
        });
    }

    _isValidColor(value) {
        if (!value) return false;
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) return true;
        if (/^rgba?\([\d\s,.]+\)$/.test(value)) return true;
        return false;
    }

    _showFeedback(msg) {
        const btn = this.container.querySelector('#btn-apply-custom');
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.innerHTML = `<i class="ph ph-check"></i> ${msg}`;
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
        }, 2000);
    }

    // Chamado quando o tema base muda — re-sincroniza o editor
    onThemeChange() {
        const saved = storage.get(STORAGE_KEY, {});
        if (Object.keys(saved).length === 0) {
            setTimeout(() => this.syncFromDOM(), 50); // aguarda CSS aplicar
        }
    }

    hasSavedColors() {
        return Object.keys(storage.get(STORAGE_KEY, {})).length > 0;
    }

    restoreSavedColors() {
        const saved = storage.get(STORAGE_KEY, {});
        if (Object.keys(saved).length > 0) this._applyValues(saved);
    }
}
