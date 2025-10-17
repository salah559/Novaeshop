// Home Page
import { db } from '../firebase-config.js';
import { collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function loadHomePage() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <!-- Hero Section -->
            <section class="hero" data-aos="fade-up">
                <h1 class="hero-title">مرحباً بك في DZ Digital Market</h1>
                <p class="hero-subtitle">منصتك الموثوقة لشراء المنتجات الرقمية في الجزائر</p>
                <a href="/products" class="hero-cta">
                    <i class="fas fa-shopping-bag"></i>
                    <span>تصفح المنتجات</span>
                </a>
            </section>

            <!-- Categories -->
            <section data-aos="fade-up">
                <h2 class="section-title">الفئات المتاحة</h2>
                <div class="product-grid" id="categoriesGrid">
                    ${renderCategories()}
                </div>
            </section>

            <!-- Featured Products -->
            <section data-aos="fade-up">
                <h2 class="section-title">المنتجات المميزة</h2>
                <div class="product-grid" id="featuredProducts">
                    <div class="loading">جاري التحميل...</div>
                </div>
            </section>

            <!-- Best Sellers -->
            <section data-aos="fade-up">
                <h2 class="section-title">الأكثر مبيعاً</h2>
                <div class="product-grid" id="bestSellers">
                    <div class="loading">جاري التحميل...</div>
                </div>
            </section>
        </div>
    `;

    loadFeaturedProducts();
    loadBestSellers();
}

function renderCategories() {
    const categories = [
        { name: 'كورسات تعليمية', icon: 'fa-graduation-cap', value: 'courses', color: '#10b981' },
        { name: 'فيديوهات 4K', icon: 'fa-video', value: 'videos', color: '#6366f1' },
        { name: 'كتب إلكترونية', icon: 'fa-book', value: 'books', color: '#f59e0b' },
        { name: 'قوالب WordPress', icon: 'fa-wordpress', value: 'wordpress', color: '#06b6d4' },
        { name: 'أدوات ChatGPT', icon: 'fa-robot', value: 'chatgpt', color: '#ec4899' },
        { name: 'Packs كاملة', icon: 'fa-box-open', value: 'packs', color: '#8b5cf6' }
    ];

    return categories.map((cat, index) => `
        <div class="category-card" data-aos="zoom-in" data-aos-delay="${index * 100}" style="--cat-color: ${cat.color}">
            <a href="/products?category=${cat.value}" class="category-link">
                <div class="category-icon">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <h3 class="category-name">${cat.name}</h3>
            </a>
        </div>
    `).join('');
}

async function loadFeaturedProducts() {
    if (!db) {
        document.getElementById('featuredProducts').innerHTML = '<p class="text-center">قم بإعداد Firebase لعرض المنتجات</p>';
        return;
    }
    
    try {
        const q = query(
            collection(db, 'products'), 
            where('isFeatured', '==', 1),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        displayProducts('featuredProducts', products);
    } catch (error) {
        console.error('Error loading featured products:', error);
        document.getElementById('featuredProducts').innerHTML = '<p>لا توجد منتجات مميزة حالياً</p>';
    }
}

async function loadBestSellers() {
    if (!db) {
        document.getElementById('bestSellers').innerHTML = '<p class="text-center">قم بإعداد Firebase لعرض المنتجات</p>';
        return;
    }
    
    try {
        const q = query(
            collection(db, 'products'),
            orderBy('soldCount', 'desc'),
            limit(6)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        displayProducts('bestSellers', products);
    } catch (error) {
        console.error('Error loading best sellers:', error);
        document.getElementById('bestSellers').innerHTML = '<p>لا توجد منتجات حالياً</p>';
    }
}

function displayProducts(containerId, products) {
    const container = document.getElementById(containerId);
    
    if (products.length === 0) {
        container.innerHTML = '<p>لا توجد منتجات حالياً</p>';
        return;
    }

    container.innerHTML = products.map((product, index) => `
        <div class="product-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${product.price} دج</div>
                    <button class="btn-add-cart" onclick="window.cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

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
