/**
 * Navbar Module
 * Handles mobile menu, scroll states, and active link tracking
 */

export function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('ham');
    const mobileMenu = document.getElementById('mobMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    const focusableSelector = 'a[href], button:not([disabled])';
    let menuOpen = false;
    let scrollTicking = false;

    function setMobileLinksState(open) {
        navLinks.forEach(link => {
            if (window.innerWidth <= 768) {
                link.tabIndex = open ? 0 : -1;
            } else {
                link.removeAttribute('tabindex');
            }
        });
    }

    function toggleMenu(open) {
        if (!hamburger || !mobileMenu) return;

        menuOpen = open;
        hamburger.classList.toggle('navbar__hamburger--open', open);
        mobileMenu.classList.toggle('navbar__links--open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
        document.body.classList.toggle('is-menu-open', open);
        setMobileLinksState(open);

        if (open) {
            mobileMenu.querySelector(focusableSelector)?.focus();
        } else {
            hamburger.focus();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu(false);
        });
    });

    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(!menuOpen);
    });

    document.addEventListener('click', (e) => {
        if (menuOpen && !hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!menuOpen) return;

        if (e.key === 'Escape') {
            toggleMenu(false);
            return;
        }

        if (e.key === 'Tab' && mobileMenu) {
            const focusableItems = [hamburger, ...mobileMenu.querySelectorAll(focusableSelector)].filter(Boolean);
            const firstItem = focusableItems[0];
            const lastItem = focusableItems[focusableItems.length - 1];

            if (e.shiftKey && document.activeElement === firstItem) {
                e.preventDefault();
                lastItem.focus();
            } else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen) {
            toggleMenu(false);
        } else {
            setMobileLinksState(menuOpen);
        }
    });

    function updateNavbarScroll() {
        if (!navbar) return;
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            updateNavbarScroll();
            scrollTicking = false;
        });
    }, { passive: true });
    updateNavbarScroll();
    setMobileLinksState(false);

    const sections = document.querySelectorAll('section[id]');

    if (sections.length && navLinks.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href')?.slice(1);
                        const isActive = href === id;
                        link.classList.toggle('navbar__link--active', isActive);
                        if (isActive) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, { rootMargin: '-30% 0px -55%', threshold: 0.01 });

        sections.forEach(section => observer.observe(section));
    }
}