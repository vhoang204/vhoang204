/**
 * Form Module
 * Handles contact form submission with Formspree
 */

export function initContactForm() {
    const form = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const btnText = document.getElementById('btnText');
    const formMsg = document.getElementById('formMsg');
    
    if (!form) return;
    
    function setFormMessage(message, isSuccess = false) {
        if (!formMsg) return;
        formMsg.style.color = isSuccess ? 'var(--primary)' : '#d66b4f';
        formMsg.textContent = message;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!sendBtn || !btnText) return;
        
        const originalText = btnText.textContent;
        const formData = new FormData(form);
        
        sendBtn.disabled = true;
        sendBtn.setAttribute('aria-busy', 'true');
        btnText.textContent = 'Đang gửi...';
        setFormMessage('');
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });
            
            if (!response.ok) throw new Error('Submission failed');
            
            form.reset();
            setFormMessage('Tớ nhận được lời nhắn của cậu rồi nhá!', true);
        } catch (error) {
            setFormMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            sendBtn.disabled = false;
            sendBtn.removeAttribute('aria-busy');
            btnText.textContent = originalText;
            
            setTimeout(() => setFormMessage(''), 5000);
        }
    });
}