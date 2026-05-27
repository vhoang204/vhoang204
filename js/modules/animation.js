/**
 * Animation Module
 * Handles scroll reveals and typing effect
 */

export function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!revealElements.length) return;
    
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        // No animation for reduced motion preference
        revealElements.forEach(el => el.classList.add('reveal--in'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal--in');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

export function initTypingEffect() {
    const typedElement = document.getElementById('typed');
    if (!typedElement) return;
    
    const roles = ['IT Student', 'Barista', 'Music Lover', 'Photographer', 'Digital Creator'];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        typedElement.textContent = roles[0];
        return;
    }
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;
    
    function typeEffect() {
        clearTimeout(timeoutId);
        
        const currentRole = roles[roleIndex];
        
        if (!isDeleting && charIndex <= currentRole.length) {
            typedElement.textContent = currentRole.slice(0, charIndex);
            charIndex++;
            timeoutId = setTimeout(typeEffect, 86);
        } else if (isDeleting && charIndex >= 0) {
            typedElement.textContent = currentRole.slice(0, charIndex);
            charIndex--;
            timeoutId = setTimeout(typeEffect, 38);
        } else if (!isDeleting && charIndex > currentRole.length) {
            isDeleting = true;
            timeoutId = setTimeout(typeEffect, 1600);
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            timeoutId = setTimeout(typeEffect, 420);
        }
    }
    
    typeEffect();
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
        clearTimeout(timeoutId);
        if (!document.hidden) {
            timeoutId = setTimeout(typeEffect, 180);
        }
    });
}