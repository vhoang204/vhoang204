/* =============================================
   script.js — Life of vhoang
   =============================================

   Các chức năng:
   1. LOADER       — ẩn màn hình loading khi trang tải xong
   2. THEME TOGGLE — đổi Dark / Light mode, lưu vào localStorage
   3. HAMBURGER    — mở/đóng menu mobile
   4. NAVBAR SCROLL — thêm shadow khi cuộn trang
   5. SCROLL REVEAL — hiệu ứng fade-in khi cuộn đến section
   6. ACTIVE NAV   — highlight link menu tương ứng với section đang xem
   7. TYPING EFFECT — chữ gõ tự động ở Hero section
   8. CONTACT FORM — gửi form bằng AJAX (không reload trang)
   ============================================= */


/* ─────────────────────────────────────────────
   1. LOADER
   ───────────────────────────────────────────── */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    // Sau 700ms: thêm class "out" để CSS chạy animation ẩn loader
    setTimeout(() => {
        loader.classList.add("out");
        // Sau thêm 500ms (bằng duration của transition): xóa hẳn khỏi DOM
        setTimeout(() => loader.remove(), 500);
    }, 700);
});


/* ─────────────────────────────────────────────
   2. THEME TOGGLE (Dark / Light Mode)
   ───────────────────────────────────────────── */
const html     = document.documentElement;       // thẻ <html> — nơi lưu data-theme
const themeBtn = document.getElementById("themeBtn");
const themeIco = document.getElementById("themeIcon");

/**
 * applyTheme(t) — áp dụng theme "light" hoặc "dark"
 * @param {string} t - "light" hoặc "dark"
 */
function applyTheme(t) {
    html.setAttribute("data-theme", t);         // đặt data-theme trên <html>
    localStorage.setItem("nvh-theme", t);       // lưu vào localStorage để nhớ khi tải lại trang
    // Đổi icon: dark mode → mặt trăng (moon), light mode → mặt trời (sun)
    if (themeIco) {
        themeIco.className = t === "dark" ? "fas fa-moon" : "fas fa-sun";
    }
}

// Khi trang tải: lấy theme đã lưu, nếu chưa có thì dùng "light"
if (themeBtn) {
    applyTheme(localStorage.getItem("nvh-theme") || "light");

    themeBtn.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        // Nếu đang light → chuyển dark; đang dark → chuyển light
        applyTheme(current === "dark" ? "light" : "dark");
    });
}


/* ─────────────────────────────────────────────
   3. HAMBURGER MENU (mobile)
   ───────────────────────────────────────────── */
const ham     = document.getElementById("ham");       // nút hamburger
const mobMenu = document.getElementById("mobMenu");   // <ul> chứa các link nav

/** Đóng menu mobile */
function closeMenu() {
    if (!ham || !mobMenu) return;
    ham.classList.remove("on");         // bỏ class "on" → icon trở về ☰
    mobMenu.classList.remove("open");   // bỏ class "open" → menu trượt ra ngoài
}

if (ham && mobMenu) {
    // Khi click nút hamburger
    ham.addEventListener("click", (e) => {
        e.stopPropagation();                // ngăn event lan ra document
        ham.classList.toggle("on");         // toggle icon ☰ ↔ ✕
        mobMenu.classList.toggle("open");   // toggle menu hiện/ẩn
    });

    // Khi click vào một link trong menu → đóng menu
    mobMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Khi click ra ngoài menu → đóng menu
    document.addEventListener("click", (e) => {
        if (!ham.contains(e.target) && !mobMenu.contains(e.target)) {
            closeMenu();
        }
    });
}


/* ─────────────────────────────────────────────
   4. NAVBAR SCROLL — thêm shadow khi cuộn
   ───────────────────────────────────────────── */
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;
    // Nếu đã cuộn hơn 50px → thêm class "scrolled" để hiện shadow
    navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });


/* ─────────────────────────────────────────────
   5. SCROLL REVEAL — fade-in khi section xuất hiện
   ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal");

// IntersectionObserver: theo dõi khi element vào viewport
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in");     // thêm class "in" → CSS chạy fade-in
            revealObs.unobserve(entry.target);    // dừng theo dõi sau khi đã reveal
        }
    });
}, {
    threshold: 0.1,                   // khi 10% element hiện trong viewport thì trigger
    rootMargin: "0px 0px -40px 0px"  // trigger sớm hơn 40px trước khi chạm đáy viewport
});

revealEls.forEach(el => revealObs.observe(el));


/* ─────────────────────────────────────────────
   6. ACTIVE NAV LINK khi cuộn trang
   ───────────────────────────────────────────── */
const sections   = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
    let current = "";

    // Duyệt từng section, tìm section nào đang trong tầm nhìn
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
            current = sec.getAttribute("id");
        }
    });

    // Cập nhật class "active" cho link tương ứng
    navAnchors.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav(); // chạy ngay khi tải trang


/* ─────────────────────────────────────────────
   7. TYPING EFFECT — Hero section
   ───────────────────────────────────────────── */
const typedEl = document.getElementById("typed");

// Danh sách các vai trò sẽ được gõ lần lượt
const roles = [
    "IT Student",
    "Barista",
    "Music Lover",
    "Photographer",
    "Digital Creator"
];

let roleIndex   = 0;   // đang ở role nào trong mảng roles[]
let charIndex   = 0;   // đang ở ký tự nào trong role hiện tại
let isDeleting  = false; // đang gõ thêm hay đang xóa

function typeLoop() {
    if (!typedEl) return;

    const currentWord = roles[roleIndex];

    if (!isDeleting) {
        // Gõ thêm 1 ký tự
        typedEl.textContent = currentWord.slice(0, ++charIndex);

        if (charIndex >= currentWord.length) {
            // Gõ xong → dừng 1.8 giây rồi bắt đầu xóa
            isDeleting = true;
            return setTimeout(typeLoop, 1800);
        }
    } else {
        // Xóa 1 ký tự
        typedEl.textContent = currentWord.slice(0, --charIndex);

        if (charIndex === 0) {
            // Xóa hết → dừng 400ms rồi chuyển sang role tiếp theo
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            return setTimeout(typeLoop, 400);
        }
    }

    // Tốc độ: xóa nhanh hơn (40ms), gõ chậm hơn (90ms)
    setTimeout(typeLoop, isDeleting ? 40 : 90);
}

typeLoop();


/* ─────────────────────────────────────────────
   8. CONTACT FORM — gửi bằng AJAX (không reload trang)
   ───────────────────────────────────────────── */
const contactForm = document.getElementById("contactForm");
const formMsg     = document.getElementById("formMsg");
const sendBtn     = document.getElementById("sendBtn");
const btnText     = document.getElementById("btnText");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        // QUAN TRỌNG: e.preventDefault() ngăn trình duyệt gửi form theo cách thông thường
        // (sẽ không reload trang hay chuyển trang nữa)
        e.preventDefault();

        const formData = new FormData(contactForm);

        // Vô hiệu hóa nút, đổi text → "Đang gửi..."
        sendBtn.disabled      = true;
        btnText.textContent   = "Đang gửi...";
        sendBtn.style.opacity = "0.7";
        formMsg.textContent   = "";

        try {
            // Gửi dữ liệu đến Formspree bằng fetch (AJAX)
            const response = await fetch(contactForm.action, {
                method:  "POST",
                body:    formData,
                headers: { "Accept": "application/json" }
                // Header "Accept: application/json" báo cho Formspree biết đây là AJAX
                // → Formspree trả về JSON thay vì redirect trang
            });

            if (response.ok) {
                // Thành công ✅
                formMsg.style.color = "var(--primary)";
                formMsg.textContent = "✅ Tớ nhận được lời nhắn của cậu rồi nhá!";
                contactForm.reset(); // Xóa sạch form để nhắn tiếp nếu muốn
            } else {
                // Formspree trả về lỗi
                formMsg.style.color = "#e07050";
                formMsg.textContent = "❌ Có lỗi xảy ra. Vui lòng thử lại.";
            }

        } catch (error) {
            // Lỗi mạng (không kết nối được server)
            formMsg.style.color = "#e07050";
            formMsg.textContent = "❌ Không thể kết nối máy chủ.";
        }

        // Khôi phục nút "Gửi đi"
        sendBtn.disabled      = false;
        btnText.textContent   = "Gửi đi";
        sendBtn.style.opacity = "1";

        // Tự xóa thông báo sau 5 giây
        setTimeout(() => {
            formMsg.textContent = "";
        }, 5000);
    });
}