// Contact Page
import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export function loadContactPage() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <h1 class="section-title" data-aos="fade-up">تواصل معنا</h1>
            
            <div class="contact-content" data-aos="fade-up">
                <form id="contactForm" class="contact-form">
                    <div class="form-group">
                        <label class="form-label">الاسم</label>
                        <input type="text" class="form-input" id="contactName" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" id="contactEmail" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الموضوع</label>
                        <input type="text" class="form-input" id="contactSubject" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الرسالة</label>
                        <textarea class="form-textarea" id="contactMessage" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        <span>إرسال الرسالة</span>
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    try {
        await addDoc(collection(db, 'messages'), {
            name,
            email,
            subject,
            message,
            createdAt: serverTimestamp()
        });
        
        showToast('تم إرسال رسالتك بنجاح', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('حدث خطأ، حاول مرة أخرى', 'error');
    }
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    const messageEl = toast.querySelector('.toast-message');
    
    messageEl.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
