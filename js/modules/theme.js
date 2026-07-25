/**
 * Theme Module
 * Handles light/dark mode with localStorage persistence
 */

export function initTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = document.getElementById('themeIcon');
    const storageKey = 'nvh-theme';
    
    // Get initial theme
    function getInitialTheme() {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored === 'light' || stored === 'dark') return stored;
        } catch (e) {
            // localStorage might be unavailable
        }
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme
    function applyTheme(theme) {
        const newTheme = theme === 'dark' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            themeIcon.setAttribute('aria-hidden', 'true');
        }
        
        if (themeBtn) {
            themeBtn.setAttribute('aria-label', newTheme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
            themeBtn.setAttribute('aria-pressed', String(newTheme === 'dark'));
        }
        
        try {
            localStorage.setItem(storageKey, newTheme);
        } catch (e) {
            // Persistence might be blocked
        }
    }
    
    // Initialize
    applyTheme(getInitialTheme());
    
    // Theme toggle
    themeBtn?.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
    
    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        } catch (err) {
            // Fallback
        }
    });
}