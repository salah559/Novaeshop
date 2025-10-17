// Shopping Cart Management
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const exists = this.items.find(item => item.id === product.id);
        
        if (exists) {
            this.showToast('المنتج موجود في السلة بالفعل', 'error');
            return;
        }

        this.items.push(product);
        this.saveCart();
        this.showToast('تمت إضافة المنتج إلى السلة', 'success');
        this.animateCartIcon();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showToast('تم حذف المنتج من السلة', 'success');
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    getItemCount() {
        return this.items.length;
    }

    updateCartCount() {
        const countEl = document.getElementById('cartCount');
        if (countEl) {
            const count = this.getItemCount();
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'block' : 'none';
        }
    }

    animateCartIcon() {
        const cartLink = document.querySelector('.cart-link');
        if (cartLink) {
            cartLink.classList.add('zoom-in');
            setTimeout(() => {
                cartLink.classList.remove('zoom-in');
            }, 500);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = toast.querySelector('.toast-message');
        
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Create global cart instance
export const cart = new Cart();
// Shopping Cart Manager
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        
        if (existing) {
            this.showToast('المنتج موجود بالفعل في السلة', 'info');
            return;
        }

        this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
        });

        this.saveCart();
        this.showToast('تمت الإضافة إلى السلة', 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showToast('تم الحذف من السلة', 'success');
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.items.length;
            cartCount.style.display = this.items.length > 0 ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');

        toastMessage.textContent = message;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

export const cart = new Cart();
