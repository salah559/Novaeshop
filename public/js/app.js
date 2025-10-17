// Main Application
import { cart } from './cart.js';
import { authManager } from './auth.js';

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

// Close mobile menu on link click
if (navLinks) {
    navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navLinks.classList.remove('active');
        }
    });
}

// Export globals
window.cart = cart;
window.authManager = authManager;
