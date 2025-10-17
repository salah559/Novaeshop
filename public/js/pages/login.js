// Login Page
export function loadLoginPage() {
    if (window.authManager.isLoggedIn()) {
        window.location.href = '/';
        return;
    }

    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <div class="auth-container" data-aos="zoom-in">
                <h1 class="section-title">تسجيل الدخول</h1>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">تسجيل الدخول</button>
                    <button class="auth-tab" data-tab="register">إنشاء حساب</button>
                </div>

                <!-- Login Form -->
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">كلمة المرور</label>
                        <input type="password" class="form-input" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>تسجيل الدخول</span>
                    </button>
                </form>

                <!-- Register Form -->
                <form id="registerForm" class="auth-form" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">الاسم الكامل</label>
                        <input type="text" class="form-input" id="registerName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" id="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">كلمة المرور</label>
                        <input type="password" class="form-input" id="registerPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-user-plus"></i>
                        <span>إنشاء حساب</span>
                    </button>
                </form>

                <div class="auth-divider">
                    <span>أو</span>
                </div>

                <button id="googleSignIn" class="btn-google">
                    <i class="fab fa-google"></i>
                    <span>تسجيل الدخول بواسطة Google</span>
                </button>
            </div>
        </div>
    `;

    setupAuthForms();
}

function setupAuthForms() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            document.getElementById('loginForm').style.display = tabName === 'login' ? 'block' : 'none';
            document.getElementById('registerForm').style.display = tabName === 'register' ? 'block' : 'none';
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const success = await window.authManager.login(email, password);
        if (success) {
            window.location.href = '/';
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const success = await window.authManager.register(email, password, name);
        if (success) {
            window.location.href = '/';
        }
    });

    // Google Sign In
    document.getElementById('googleSignIn').addEventListener('click', async () => {
        const success = await window.authManager.loginWithGoogle();
        if (success) {
            window.location.href = '/';
        }
    });
}
