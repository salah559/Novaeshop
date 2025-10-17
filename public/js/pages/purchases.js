// Purchases Page
export function loadPurchasesPage() {
    if (!window.authManager.isLoggedIn()) {
        window.location.href = '/login';
        return;
    }

    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <h1 class="section-title" data-aos="fade-up">مشترياتي</h1>
            <p class="text-center" data-aos="fade-up">لا توجد مشتريات بعد</p>
        </div>
    `;
}
