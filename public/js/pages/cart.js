// Cart Page
export function loadCartPage() {
    const app = document.getElementById('app');
    const cartItems = window.cart.items;
    const total = window.cart.getTotal();
    
    app.innerHTML = `
        <div class="container">
            <h1 class="section-title" data-aos="fade-up">سلة المشتريات</h1>
            
            ${cartItems.length === 0 ? `
                <div class="empty-cart" data-aos="fade-up">
                    <i class="fas fa-shopping-cart" style="font-size: 5rem; color: var(--gray); margin-bottom: 1rem;"></i>
                    <h2>السلة فارغة</h2>
                    <p>لم تقم بإضافة أي منتجات بعد</p>
                    <a href="/products" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-shopping-bag"></i>
                        <span>تصفح المنتجات</span>
                    </a>
                </div>
            ` : `
                <div class="cart-content" data-aos="fade-up">
                    <div class="cart-items">
                        ${cartItems.map((item, index) => `
                            <div class="cart-item" data-aos="fade-right" data-aos-delay="${index * 100}">
                                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                                <div class="cart-item-info">
                                    <h3>${item.name}</h3>
                                    <p class="cart-item-category">${getCategoryName(item.category)}</p>
                                </div>
                                <div class="cart-item-price">${item.price} دج</div>
                                <button class="btn-remove" onclick="removeFromCart('${item.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="cart-summary" data-aos="fade-left">
                        <h2>ملخص الطلب</h2>
                        <div class="summary-row">
                            <span>عدد المنتجات</span>
                            <span>${cartItems.length}</span>
                        </div>
                        <div class="summary-row total">
                            <span>الإجمالي</span>
                            <span>${total} دج</span>
                        </div>
                        <a href="/payment" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                            <i class="fas fa-credit-card"></i>
                            <span>متابعة الدفع</span>
                        </a>
                    </div>
                </div>
            `}
        </div>
    `;
}

window.removeFromCart = function(productId) {
    window.cart.removeItem(productId);
    loadCartPage();
};

function getCategoryName(value) {
    const categories = {
        'courses': 'كورسات',
        'videos': 'فيديوهات',
        'books': 'كتب',
        'wordpress': 'WordPress',
        'chatgpt': 'ChatGPT',
        'packs': 'Packs'
    };
    return categories[value] || value;
}
