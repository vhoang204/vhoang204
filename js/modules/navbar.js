/**
 * Navbar Module
 * Handles mobile menu, scroll states, and active link tracking
 */

export function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('ham');
    const mobileMenu = document.getElementById('mobMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    
    let menuOpen = false;
    
    // Toggle mobile menu
    function toggleMenu(open) {
        if (!hamburger || !mobileMenu) return;
        
        menuOpen = open;
        hamburger.classList.toggle('navbar__hamburger--open', open);
        mobileMenu.classList.toggle('navbar__links--open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu(false);
        });
    });
    
    // Hamburger click
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(!menuOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuOpen && !hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
            toggleMenu(false);
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            toggleMenu(false);
        }
    });
    
    // Close menu on window resize (if screen becomes desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen) {
            toggleMenu(false);
        }
    });
    
    // Navbar scroll effect
    function updateNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbarScroll);
    updateNavbarScroll();
    
    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length && navLinks.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href')?.slice(1);
                        link.classList.toggle('navbar__link--active', href === id);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }
}