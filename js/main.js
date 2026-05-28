/**
 * Main Entry Point - Life of vhoang
 * Orchestrates all modules
 */

import { initNavbar } from './modules/navbar.js';
import { initTheme } from './modules/theme.js';
import { initRevealAnimations, initTypingEffect } from './modules/animation.js';
import { initSliders } from './modules/slider.js';
import { initTimelineSlider } from './modules/timeline-slider.js';
import { initContactForm } from './modules/form.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initTheme();
    initRevealAnimations();
    initTypingEffect();
    initSliders();           // Gallery slider bên trong mỗi milestone
    initTimelineSlider();    // Timeline slider 3 cột
    initContactForm();
});

// Handle loader removal
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReducedMotion ? 0 : 450;
    
    setTimeout(() => {
        loader.classList.add('loader--hidden');
        setTimeout(() => loader.remove(), 520);
    }, delay);
});