/**
 * Timeline Slider Module
 * Handles 3-column slider for timeline milestones on desktop
 */

export function initTimelineSlider() {
    const track = document.querySelector('.timeline__track');
    const milestones = document.querySelectorAll('.timeline__milestone');
    const prevBtn = document.querySelector('.timeline__prev');
    const nextBtn = document.querySelector('.timeline__next');
    const dotsContainer = document.querySelector('.timeline__dots');
    
    // Chỉ chạy nếu có đủ elements
    if (!track || milestones.length === 0) return;
    
    // Kiểm tra nếu đang ở mobile (không cần slider)
    if (window.innerWidth < 768) return;
    
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = Math.ceil(milestones.length / slidesPerView);
    
    // Hàm tính số lượng slide hiển thị dựa trên màn hình
    function getSlidesPerView() {
        if (window.innerWidth >= 992) return 3;      // Desktop: 3 cột
        if (window.innerWidth >= 768) return 2;      // Tablet: 2 cột
        return 1;                                     // Mobile: 1 cột
    }
    
    // Tính chiều rộng của 1 slide (dựa trên cột)
    function getSlideWidth() {
        const container = track.parentElement;
        const gap = 24; // gap giữa các milestone
        const containerWidth = container.offsetWidth;
        return (containerWidth / slidesPerView) - (gap * (slidesPerView - 1) / slidesPerView);
    }
    
    // Cập nhật width cho từng milestone
    function updateMilestoneWidths() {
        const slideWidth = getSlideWidth();
        milestones.forEach(milestone => {
            milestone.style.flex = `0 0 ${slideWidth}px`;
        });
    }
    
    // Tạo dots điều hướng
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('timeline__dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === currentIndex) dot.classList.add('timeline__dot--active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Cập nhật dots active
    function updateDots() {
        const dots = document.querySelectorAll('.timeline__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('timeline__dot--active', index === currentIndex);
        });
    }
    
    // Di chuyển đến slide cụ thể
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        currentIndex = index;
        const translateX = -currentIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;
        updateDots();
        
        // Cập nhật aria labels cho accessibility
        updateAriaLabels();
    }
    
    // Cập nhật aria labels
    function updateAriaLabels() {
        const dots = document.querySelectorAll('.timeline__dot');
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });
        
        if (prevBtn) {
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-disabled', currentIndex >= totalSlides - 1);
        }
    }
    
    // Slide tiếp theo
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    }
    
    // Slide trước
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }
    
    // Reset slider khi resize
    function handleResize() {
        const newSlidesPerView = getSlidesPerView();
        
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            totalSlides = Math.ceil(milestones.length / slidesPerView);
            currentIndex = 0;
            track.style.transform = 'translateX(0)';
            updateMilestoneWidths();
            createDots();
        } else {
            updateMilestoneWidths();
        }
    }
    
    // Debounce cho resize event
    let resizeTimeout;
    function debouncedResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    }
    
    // Gắn sự kiện
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    window.addEventListener('resize', debouncedResize);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Chỉ hoạt động khi timeline đang trong viewport
        const timelineSection = document.querySelector('#timeline');
        if (!timelineSection) return;
        
        const rect = timelineSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });
    
    // Khởi tạo
    updateMilestoneWidths();
    createDots();
    
    // Cleanup function (nếu cần)
    return () => {
        window.removeEventListener('resize', debouncedResize);
        if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
        if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
    };
}

// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', initTimelineSlider);