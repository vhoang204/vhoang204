/**
 * Navbar Module
 * Handles mobile menu, scroll states, and active link tracking
 */

export function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('ham');
    const mobileMenu = document.getElementById('mobMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    const sections = document.querySelectorAll('section[id]');
    
    let menuOpen = false;
    let ticking = false;
    
    // Toggle mobile menu
    function toggleMenu(open) {
        if (!hamburger || !mobileMenu) return;
        
        menuOpen = open;
        hamburger.classList.toggle('navbar__hamburger--open', open);
        mobileMenu.classList.toggle('navbar__links--open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }
    
    // Close menu
    function closeMenu() {
        if (menuOpen) toggleMenu(false);
    }
    
    // Event listeners
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(!menuOpen);
    });
    
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target.closest('.navbar__link')) closeMenu();
    });
    
    document.addEventListener('click', (e) => {
        if (menuOpen && !hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
            closeMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
            hamburger?.focus();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && menuOpen) closeMenu();
    });
    
    // Scroll state for navbar background
    function updateNavbarScroll() {
        if (!navbar) return;
        const isScrolled = window.scrollY > 28;
        navbar.classList.toggle('navbar--scrolled', isScrolled);
    }
    
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateNavbarScroll();
            ticking = false;
        });
    }, { passive: true });
    
    updateNavbarScroll();
    
    // Active link tracking
    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        const linkMap = new Map();
        navLinks.forEach(link => {
            const href = link.getAttribute('href')?.slice(1);
            if (href) linkMap.set(href, link);
        });
        
        const setActiveLink = (id) => {
            navLinks.forEach(link => {
                const isActive = link === linkMap.get(id);
                link.classList.toggle('navbar__link--active', isActive);
                if (isActive) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
        };
        
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            
            if (visible) setActiveLink(visible.target.id);
        }, {
            threshold: [0.2, 0.45, 0.7],
            rootMargin: '-22% 0px -58% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            closeMenu();
            
            target.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start'
            });
            
            history.pushState(null, '', href);
        });
    });
}