// Simple SPA Router
import { loadHomePage } from './pages/home.js';
import { loadProductsPage } from './pages/products.js';
import { loadCartPage } from './pages/cart.js';
import { loadLoginPage } from './pages/login.js';
import { loadContactPage } from './pages/contact.js';
import { loadPurchasesPage } from './pages/purchases.js';
import { loadAdminPage } from './pages/admin.js';

const routes = {
    '/': loadHomePage,
    '/products': loadProductsPage,
    '/cart': loadCartPage,
    '/login': loadLoginPage,
    '/contact': loadContactPage,
    '/purchases': loadPurchasesPage,
    '/admin': loadAdminPage
};

export function navigate(path) {
    window.history.pushState({}, '', path);
    loadRoute();
}

export function loadRoute() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
    
    // Load page content
    const app = document.getElementById('app');
    app.style.opacity = '0';
    
    setTimeout(() => {
        route();
        app.style.opacity = '1';
        
        // Initialize AOS
        if (window.AOS) {
            AOS.refresh();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
}

// Handle browser back/forward
window.addEventListener('popstate', loadRoute);

// Handle link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="/"]');
    if (link && !link.hasAttribute('target')) {
        e.preventDefault();
        navigate(link.getAttribute('href'));
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadRoute();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
});
