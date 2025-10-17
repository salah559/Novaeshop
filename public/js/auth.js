// Authentication Management
import { auth } from './firebase-config.js';
import { 
    onAuthStateChanged, 
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUI();
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    updateUI() {
        const userNameEl = document.getElementById('userName');
        const loginItem = document.querySelector('.login-item');
        const purchasesItem = document.querySelector('.purchases-item');
        const adminItem = document.querySelector('.admin-item');
        const logoutItem = document.querySelector('.logout-item');

        if (this.currentUser) {
            // User is logged in
            if (userNameEl) {
                userNameEl.textContent = this.currentUser.displayName || this.currentUser.email;
            }
            
            if (loginItem) loginItem.style.display = 'none';
            if (purchasesItem) purchasesItem.style.display = 'flex';
            if (logoutItem) logoutItem.style.display = 'flex';
            
            // Show admin link if user is admin (you can customize this logic)
            // For now, just hide it
            if (adminItem) adminItem.style.display = 'flex';
        } else {
            // User is logged out
            if (userNameEl) {
                userNameEl.textContent = 'تسجيل الدخول';
            }
            
            if (loginItem) loginItem.style.display = 'flex';
            if (purchasesItem) purchasesItem.style.display = 'none';
            if (adminItem) adminItem.style.display = 'none';
            if (logoutItem) logoutItem.style.display = 'none';
        }
    }

    async login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            this.showToast('تم تسجيل الدخول بنجاح', 'success');
            return true;
        } catch (error) {
            this.showToast(this.getErrorMessage(error), 'error');
            return false;
        }
    }

    async register(email, password, displayName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            this.showToast('تم إنشاء الحساب بنجاح', 'success');
            return true;
        } catch (error) {
            this.showToast(this.getErrorMessage(error), 'error');
            return false;
        }
    }

    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            this.showToast('تم تسجيل الدخول بنجاح', 'success');
            return true;
        } catch (error) {
            this.showToast(this.getErrorMessage(error), 'error');
            return false;
        }
    }

    async logout() {
        try {
            await signOut(auth);
            this.showToast('تم تسجيل الخروج', 'success');
            window.location.href = '/';
        } catch (error) {
            this.showToast('حدث خطأ أثناء تسجيل الخروج', 'error');
        }
    }

    getErrorMessage(error) {
        const messages = {
            'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
            'auth/user-disabled': 'تم تعطيل هذا الحساب',
            'auth/user-not-found': 'المستخدم غير موجود',
            'auth/wrong-password': 'كلمة المرور غير صحيحة',
            'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
            'auth/weak-password': 'كلمة المرور ضعيفة',
            'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت'
        };
        
        return messages[error.code] || 'حدث خطأ، حاول مرة أخرى';
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

    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Create global auth instance
export const authManager = new AuthManager();
// Authentication Manager
import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.init();
    }

    init() {
        if (!auth) {
            console.warn('Firebase Auth not initialized');
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            this.currentUser = user;
            
            if (user) {
                // Check if admin
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                this.isAdmin = userDoc.data()?.isAdmin || false;
                
                this.updateUI(true);
            } else {
                this.isAdmin = false;
                this.updateUI(false);
            }
        });
    }

    updateUI(isLoggedIn) {
        const userName = document.getElementById('userName');
        const loginItem = document.querySelector('.login-item');
        const purchasesItem = document.querySelector('.purchases-item');
        const adminItem = document.querySelector('.admin-item');
        const logoutItem = document.querySelector('.logout-item');

        if (isLoggedIn && this.currentUser) {
            userName.textContent = this.currentUser.displayName || this.currentUser.email;
            loginItem.style.display = 'none';
            purchasesItem.style.display = 'flex';
            logoutItem.style.display = 'flex';
            
            if (this.isAdmin) {
                adminItem.style.display = 'flex';
            }
        } else {
            userName.textContent = 'تسجيل الدخول';
            loginItem.style.display = 'flex';
            purchasesItem.style.display = 'none';
            adminItem.style.display = 'none';
            logoutItem.style.display = 'none';
        }
    }

    async login(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signup(email, password, name) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', result.user.uid), {
                name,
                email,
                createdAt: new Date().toISOString(),
                isAdmin: false
            });
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date().toISOString(),
                    isAdmin: false
                });
            }
            
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const authManager = new AuthManager();

// Logout button handler
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await authManager.logout();
    window.location.href = '/';
});
