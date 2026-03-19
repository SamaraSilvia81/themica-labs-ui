// ================================================
// THEMES-DATA — paletas, tipografias, páginas, ícones
// ================================================

export const THEMES = [
    { id: 'reverie-soft',      label: 'Reverie Soft',      colors: ['#8B6BB7', '#C5B5E1', '#CE85D8'] },
    { id: 'reverie-deep',      label: 'Reverie Deep',      colors: ['#16002E', '#7030EF', '#DB1FFF'] },
    { id: 'purple-gradient',   label: 'Purple Gradient',   colors: ['#7c4ae0', '#532d9f', '#c14dd8'] },
    { id: 'azure-tech',        label: 'Azure Tech',        colors: ['#0066FF', '#00D4FF', '#6B4EFF'] },
    { id: 'teal-clinical',     label: 'Teal Clinical',     colors: ['#00897B', '#26C6DA', '#4DD0E1'] },
    { id: 'coral-vital',       label: 'Coral Vital',       colors: ['#FF6B6B', '#FF8E53', '#FFA07A'] },
    { id: 'purple-cracked',    label: 'Purple Cracked',    colors: ['#5E35B1', '#AB47BC', '#26C6DA'] },
    { id: 'frost-arctic',      label: 'Frost Arctic',      colors: ['#9e8bff', '#c4b8ff', '#120936'] },
    { id: 'midnight-glow',     label: 'Midnight Glow',     colors: ['#6C63FF', '#FF6584', '#43E97B'] },
    { id: 'crystal-purple',    label: 'Crystal Purple',    colors: ['#9B59B6', '#D7BDE2', '#E8D5F5'] },
    { id: 'periwinkle-dream',  label: 'Periwinkle Dream',  colors: ['#7B68EE', '#B8B3F8', '#FF8C69'] },
    { id: 'mint-rose',         label: 'Mint Rose',         colors: ['#26C6A6', '#89CFF0', '#FF8FAB'] },
    { id: 'health-natural',    label: 'Health Natural',    colors: ['#4CAF50', '#8BC34A', '#FFC107'] },
    { id: 'skin-coral',        label: 'Skin Coral',        colors: ['#E57373', '#FFAB91', '#CE93D8'] },
    { id: 'tech-cyan',         label: 'Tech Cyan',         colors: ['#00BCD4', '#80DEEA', '#FFEB3B'] },
    { id: 'nature-green',      label: 'Nature Green',      colors: ['#388E3C', '#AED581', '#FF8F00'] },
    { id: 'delicatte',         label: 'Delicatte ✦',       colors: ['#860120', '#fad1da', '#828f58'] },
];

export const TYPOS = [
    { id: 'redhat',         label: 'Red Hat',           description: 'Moderno e limpo',       sample: 'Rh' },
    { id: 'poppins-inter',  label: 'Poppins + Inter',   description: 'Elegante + legível',    sample: 'Pi' },
    { id: 'outfit-dmsans',  label: 'Outfit + DM',       description: 'Geométrico + corpo',    sample: 'Od' },
    { id: 'space-inter',    label: 'Space + Inter',     description: 'Tech + preciso',        sample: 'Si' },
    { id: 'sora-jakarta',   label: 'Sora + Jakarta',    description: 'Suave + estruturado',   sample: 'Sj' },
    { id: 'manrope-nunito', label: 'Manrope + Nunito',  description: 'Amigável + round',      sample: 'Mn' },
    { id: 'delicatte',      label: 'Garamond + DM ✦',  description: 'Editorial — Delicatte', sample: 'Gd' },
    { id: 'zodiak-jakarta', label: 'Garamond + Jakarta', description: 'Serifa + moderna',    sample: 'Gj' },
    { id: 'clash-jakarta',  label: 'Archivo + Jakarta', description: 'Display bold',          sample: 'Aj' },
    { id: 'inter',          label: 'Inter',             description: 'Universal',             sample: 'In' },
    { id: 'dmsans',         label: 'DM Sans',           description: 'Neutro e versátil',    sample: 'Dm' },
    { id: 'jakarta',        label: 'Plus Jakarta',      description: 'Jakarta completo',      sample: 'Jk' },
    { id: 'poppins',        label: 'Poppins',           description: 'Geométrico clássico',   sample: 'Po' },
    { id: 'sora',           label: 'Sora',              description: 'Japonês moderno',       sample: 'So' },
];

export const PAGES = [
    { id: 'login',     label: 'Login',     icon: 'ph-sign-in' },
    { id: 'dashboard', label: 'Dashboard', icon: 'ph-squares-four' },
    { id: 'agenda',    label: 'Agenda',    icon: 'ph-calendar' },
];

export const EDITABLE_VARS = [
    { key: '--primary',      label: 'Primary' },
    { key: '--secondary',    label: 'Secondary' },
    { key: '--accent',       label: 'Accent' },
    { key: '--bg-body',      label: 'Background' },
    { key: '--text-primary', label: 'Texto' },
    { key: '--success',      label: 'Success' },
    { key: '--warning',      label: 'Warning' },
    { key: '--danger',       label: 'Danger' },
];

// ──────────────────────────────────────────────────
// ICON SETS — 5 estilos, 3 bibliotecas diferentes
//
// Phosphor (ph-*)        → já carregado via CDN
// Lucide                 → carregado sob demanda via CDN
// Heroicons (SVG inline) → injetado via JS
// ──────────────────────────────────────────────────
export const ICON_SETS = [
    {
        id: 'phosphor-outline',
        label: 'Phosphor — Outline',
        lib: 'phosphor',
        icon: 'ph-squares-four',
        icons: {
            logo:       'ph ph-swatches',
            logoMini:   'ph ph-swatches',
            bell:       'ph ph-bell',
            gear:       'ph ph-gear',
            user:       'ph ph-user',
            lock:       'ph ph-lock',
            eye:        'ph ph-eye',
            arrowRight: 'ph ph-arrow-right',
            caretDown:  'ph ph-caret-down',
        }
    },
    {
        id: 'phosphor-fill',
        label: 'Phosphor — Fill',
        lib: 'phosphor',
        icon: 'ph-fill ph-squares-four',
        icons: {
            logo:       'ph-fill ph-paint-bucket',
            logoMini:   'ph-fill ph-paint-bucket',
            bell:       'ph-fill ph-bell-ringing',
            gear:       'ph-fill ph-gear-six',
            user:       'ph-fill ph-user-circle',
            lock:       'ph-fill ph-lock-key',
            eye:        'ph-fill ph-eye',
            arrowRight: 'ph-fill ph-arrow-circle-right',
            caretDown:  'ph ph-caret-down',
        }
    },
    {
        id: 'phosphor-duotone',
        label: 'Phosphor — Duotone',
        lib: 'phosphor',
        icon: 'ph-duotone ph-circles-three-plus',
        icons: {
            logo:       'ph-duotone ph-paint-roller',
            logoMini:   'ph-duotone ph-paint-roller',
            bell:       'ph-duotone ph-bell-ringing',
            gear:       'ph-duotone ph-gear-six',
            user:       'ph-duotone ph-user-circle',
            lock:       'ph-duotone ph-lock-key',
            eye:        'ph-duotone ph-eye',
            arrowRight: 'ph-duotone ph-arrow-circle-right',
            caretDown:  'ph ph-caret-down',
        }
    },
    {
        id: 'lucide',
        label: 'Lucide Icons',
        lib: 'lucide',
        icon: 'ph ph-star-four',   // preview ainda com ph enquanto carrega
        // Lucide usa <i data-lucide="nome"> + createIcons()
        icons: {
            logo:       'lucide:palette',
            logoMini:   'lucide:palette',
            bell:       'lucide:bell',
            gear:       'lucide:settings-2',
            user:       'lucide:user-round',
            lock:       'lucide:lock-keyhole',
            eye:        'lucide:eye',
            arrowRight: 'lucide:arrow-right',
            caretDown:  'lucide:chevron-down',
        }
    },
    {
        id: 'minimal',
        label: 'Phosphor — Thin',
        lib: 'phosphor',
        icon: 'ph ph-minus-circle',
        icons: {
            logo:       'ph ph-gradient',
            logoMini:   'ph ph-gradient',
            bell:       'ph ph-bell-simple',
            gear:       'ph ph-sliders',
            user:       'ph ph-user',
            lock:       'ph ph-lock-simple',
            eye:        'ph ph-eye',
            arrowRight: 'ph ph-caret-right',
            caretDown:  'ph ph-caret-down',
        }
    },
];
