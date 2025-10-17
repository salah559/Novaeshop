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
