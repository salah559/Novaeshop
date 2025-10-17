// Products Page
import { db } from '../firebase-config.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function loadProductsPage() {
    const app = document.getElementById('app');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    
    app.innerHTML = `
        <div class="container">
            <h1 class="section-title" data-aos="fade-up">المنتجات</h1>
            
            <!-- Filter -->
            <div class="filter-section" data-aos="fade-up">
                <select id="categoryFilter" class="form-select">
                    <option value="all">جميع الفئات</option>
                    <option value="courses">كورسات تعليمية</option>
                    <option value="videos">فيديوهات 4K</option>
                    <option value="books">كتب إلكترونية</option>
                    <option value="wordpress">قوالب WordPress</option>
                    <option value="chatgpt">أدوات ChatGPT</option>
                    <option value="packs">Packs كاملة</option>
                </select>
            </div>

            <!-- Products Grid -->
            <div class="product-grid" id="productsGrid">
                <div class="loading">جاري التحميل...</div>
            </div>
        </div>
    `;

    document.getElementById('categoryFilter').value = category;
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        window.history.pushState({}, '', `/products?category=${e.target.value}`);
        loadProducts(e.target.value);
    });

    loadProducts(category);
}

async function loadProducts(category) {
    try {
        let q = collection(db, 'products');
        
        if (category !== 'all') {
            q = query(q, where('category', '==', category));
        }
        
        q = query(q, orderBy('createdAt', 'desc'));
        
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<p>حدث خطأ في تحميل المنتجات</p>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<p>لا توجد منتجات في هذه الفئة</p>';
        return;
    }

    container.innerHTML = products.map((product, index) => `
        <div class="product-card" data-aos="fade-up" data-aos-delay="${index * 50}">
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
