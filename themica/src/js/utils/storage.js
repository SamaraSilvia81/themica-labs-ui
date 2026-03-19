// ================================================
// STORAGE — wrapper de localStorage com fallback
// ================================================

const PREFIX = 'ux-lab:';

export const storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.warn('[storage] set failed:', e);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(PREFIX + key);
        } catch { /* noop */ }
    },
    clear() {
        try {
            Object.keys(localStorage)
                .filter(k => k.startsWith(PREFIX))
                .forEach(k => localStorage.removeItem(k));
        } catch { /* noop */ }
    }
};
