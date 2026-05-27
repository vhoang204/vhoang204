/**
 * Slider Module
 * Handles memory gallery sliders with touch/swipe support
 */

export function initSliders() {
    const sliders = document.querySelectorAll('[data-memory-slider]');
    
    sliders.forEach(slider => {
        const milestone = slider.closest('[data-memory-milestone]');
        const viewport = slider.querySelector('.timeline__gallery-viewport, .lifestyle__slider-viewport');
        const track = slider.querySelector('.timeline__gallery-track, .lifestyle__slider-track');
        const slides = slider.querySelectorAll('.timeline__slide, .lifestyle__slide');
        const prevBtn = slider.querySelector('.timeline__gallery-nav--prev, .lifestyle__slider-nav--prev');
        const nextBtn = slider.querySelector('.timeline__gallery-nav--next, .lifestyle__slider-nav--next');
        const countSpan = slider.querySelector('.timeline__gallery-count, .lifestyle__slider-count');
        
        if (!viewport || !track || slides.length === 0) return;
        
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        
        // Update slider position
        function updateSlider(index) {
            currentIndex = (index + slides.length) % slides.length;
            const translateX = -currentIndex * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update active state and ARIA
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentIndex);
                slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
            });
            
            // Update counter
            if (countSpan) {
                countSpan.textContent = `${currentIndex + 1} / ${slides.length}`;
            }
            
            // Update milestone active state
            if (milestone) {
                document.querySelectorAll('[data-memory-milestone]').forEach(m => {
                    m.classList.toggle('is-active', m === milestone);
                });
            }
        }
        
        // Navigation handlers
        prevBtn?.addEventListener('click', () => updateSlider(currentIndex - 1));
        nextBtn?.addEventListener('click', () => updateSlider(currentIndex + 1));
        
        // Keyboard navigation
        viewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                updateSlider(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                updateSlider(currentIndex + 1);
            }
        });
        
        // Touch/swipe support
        viewport.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startX = e.clientX;
            viewport.setPointerCapture?.(e.pointerId);
        });
        
        viewport.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaX = e.clientX - startX;
            const threshold = 42;
            
            if (Math.abs(deltaX) > threshold) {
                updateSlider(currentIndex + (deltaX < 0 ? 1 : -1));
            }
        });
        
        viewport.addEventListener('pointercancel', () => {
            isDragging = false;
        });
        
        // Initialize
        updateSlider(0);
    });
}