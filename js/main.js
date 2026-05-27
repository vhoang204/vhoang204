import { initNavbar } from './modules/navbar.js';
import { initTheme } from './modules/theme.js';
import { initRevealAnimations, initTypingEffect } from './modules/animation.js';
import { initSliders } from './modules/slider.js';
import { initContactForm } from './modules/form.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTheme();
    initRevealAnimations();
    initTypingEffect();
    initSliders();
    initContactForm();
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    setTimeout(() => {
        loader.classList.add('loader--hidden');
        setTimeout(() => loader.remove(), 520);
    }, 450);
});