/* =============================================
   script.js — Life of vhoang
   Smooth, lightweight portfolio interactions
   ============================================= */

(() => {
    "use strict";

    const html = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const storageKey = "nvh-theme";

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const loader = $("#loader");
    const navbar = $(".navbar");
    const themeBtn = $("#themeBtn");
    const themeIcon = $("#themeIcon");
    const ham = $("#ham");
    const mobMenu = $("#mobMenu");
    const navAnchors = $$(".nav-links a[href^='#']");
    const sections = $$('section[id]');
    const revealEls = $$(".reveal");
    const typedEl = $("#typed");
    const contactForm = $("#contactForm");
    const formMsg = $("#formMsg");
    const sendBtn = $("#sendBtn");
    const btnText = $("#btnText");

    let menuOpen = false;
    let ticking = false;

    /* Loader */
    window.addEventListener("load", () => {
        if (!loader) return;

        window.setTimeout(() => {
            loader.classList.add("out");
            window.setTimeout(() => loader.remove(), 520);
        }, prefersReducedMotion.matches ? 0 : 450);
    }, { once: true });

    /* Theme */
    function getInitialTheme() {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored === "light" || stored === "dark") return stored;
        } catch (_) {
            // localStorage can be unavailable in private or restricted contexts.
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        const nextTheme = theme === "dark" ? "dark" : "light";
        html.setAttribute("data-theme", nextTheme);

        if (themeIcon) {
            themeIcon.className = nextTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
        }

        if (themeBtn) {
            themeBtn.setAttribute(
                "aria-label",
                nextTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
            );
            themeBtn.setAttribute("aria-pressed", String(nextTheme === "dark"));
        }

        try {
            localStorage.setItem(storageKey, nextTheme);
        } catch (_) {
            // Keep theme working even when persistence is blocked.
        }
    }

    applyTheme(getInitialTheme());

    themeBtn?.addEventListener("click", () => {
        applyTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    /* Mobile menu */
    function setMenu(open) {
        if (!ham || !mobMenu) return;

        menuOpen = open;
        ham.classList.toggle("on", open);
        mobMenu.classList.toggle("open", open);
        ham.setAttribute("aria-expanded", String(open));
        ham.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
        document.body.style.overflow = open ? "hidden" : "";
    }

    ham?.setAttribute("aria-expanded", "false");

    ham?.addEventListener("click", (event) => {
        event.stopPropagation();
        setMenu(!menuOpen);
    });

    mobMenu?.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) setMenu(false);
    });

    document.addEventListener("click", (event) => {
        if (!menuOpen || !ham || !mobMenu) return;
        if (!ham.contains(event.target) && !mobMenu.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuOpen) {
            setMenu(false);
            ham?.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && menuOpen) setMenu(false);
    }, { passive: true });

    /* Smooth anchor navigation */
    navAnchors.forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;

            const target = $(id);
            if (!target) return;

            event.preventDefault();
            setMenu(false);

            target.scrollIntoView({
                behavior: prefersReducedMotion.matches ? "auto" : "smooth",
                block: "start"
            });

            history.pushState(null, "", id);
        });
    });

    /* Navbar state */
    function updateNavbar() {
        navbar?.classList.toggle("scrolled", window.scrollY > 28);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            updateNavbar();
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateNavbar();

    /* Reveal animations */
    if (revealEls.length) {
        if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
            revealEls.forEach((el) => el.classList.add("in"));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("in");
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: "0px 0px -48px 0px"
            });

            revealEls.forEach((el) => revealObserver.observe(el));
        }
    }

    /* Active nav */
    if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
        const activeMap = new Map(navAnchors.map((link) => [link.getAttribute("href")?.slice(1), link]));

        const setActiveLink = (id) => {
            navAnchors.forEach((link) => {
                const active = link === activeMap.get(id);
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "page");
                else link.removeAttribute("aria-current");
            });
        };

        const activeObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) setActiveLink(visible.target.id);
        }, {
            threshold: [0.2, 0.45, 0.7],
            rootMargin: "-22% 0px -58% 0px"
        });

        sections.forEach((section) => activeObserver.observe(section));
    }

    /* Memory timeline sliders */
    const memorySliders = $$('[data-memory-slider]');

    memorySliders.forEach((slider) => {
        const milestone = slider.closest('[data-memory-milestone]');
        const viewport = $('.memory-viewport', slider);
        const track = $('.memory-track', slider);
        const slides = $$('.memory-slide', slider);
        const prevBtn = $('.memory-prev', slider);
        const nextBtn = $('.memory-next', slider);
        const count = $('.memory-count', slider);
        let current = 0;
        let startX = 0;
        let pointerDown = false;

        if (!viewport || !track || slides.length === 0) return;

        function setActiveMilestone() {
            $$('[data-memory-milestone]').forEach((item) => item.classList.toggle('is-active', item === milestone));
        }

        function updateSlider(index) {
            current = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === current);
                slide.setAttribute('aria-hidden', slideIndex === current ? 'false' : 'true');
            });
            if (count) count.textContent = `${current + 1} / ${slides.length}`;
            setActiveMilestone();
        }

        prevBtn?.addEventListener('click', () => updateSlider(current - 1));
        nextBtn?.addEventListener('click', () => updateSlider(current + 1));

        viewport.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            updateSlider(current + (event.key === 'ArrowRight' ? 1 : -1));
        });

        viewport.addEventListener('pointerdown', (event) => {
            pointerDown = true;
            startX = event.clientX;
            viewport.setPointerCapture?.(event.pointerId);
            setActiveMilestone();
        });

        viewport.addEventListener('pointerup', (event) => {
            if (!pointerDown) return;
            pointerDown = false;
            const distance = event.clientX - startX;
            if (Math.abs(distance) > 42) updateSlider(current + (distance < 0 ? 1 : -1));
        });

        viewport.addEventListener('pointercancel', () => {
            pointerDown = false;
        });

        updateSlider(0);
    });

    /* Typing effect */
    const roles = ["IT Student", "Barista", "Music Lover", "Photographer", "Digital Creator"];

    function startTyping() {
        if (!typedEl) return;

        if (prefersReducedMotion.matches) {
            typedEl.textContent = roles[0];
            return;
        }

        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let timeoutId;

        const type = () => {
            window.clearTimeout(timeoutId);

            const word = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            typedEl.textContent = word.slice(0, charIndex);

            if (!deleting && charIndex === word.length) {
                deleting = true;
                timeoutId = window.setTimeout(type, 1600);
                return;
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                timeoutId = window.setTimeout(type, 420);
                return;
            }

            timeoutId = window.setTimeout(type, deleting ? 38 : 86);
        };

        type();

        document.addEventListener("visibilitychange", () => {
            window.clearTimeout(timeoutId);
            if (!document.hidden) timeoutId = window.setTimeout(type, 180);
        });
    }

    startTyping();

    /* Contact form */
    function setFormMessage(message, isSuccess = false) {
        if (!formMsg) return;
        formMsg.style.color = isSuccess ? "var(--primary)" : "#d66b4f";
        formMsg.textContent = message;
    }

    contactForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!sendBtn || !btnText) return;

        const originalText = btnText.textContent;
        const formData = new FormData(contactForm);

        sendBtn.disabled = true;
        sendBtn.setAttribute("aria-busy", "true");
        btnText.textContent = "Đang gửi...";
        setFormMessage("");

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) throw new Error("Form submission failed");

            contactForm.reset();
            setFormMessage("Tớ nhận được lời nhắn của cậu rồi nhá!", true);
        } catch (_) {
            setFormMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            sendBtn.disabled = false;
            sendBtn.removeAttribute("aria-busy");
            btnText.textContent = originalText || "Gửi đi";

            window.setTimeout(() => setFormMessage(""), 5000);
        }
    });
})();
