// ========================================
// AUTH CONFIGURATION
// ========================================
const AUTH_CONFIG = {
    // Password tetap yang tidak bisa diubah
    defaultPassword: "generator2024",
    // Session key
    sessionKey: "mpg_session",
    // Session duration (24 jam dalam ms)
    sessionDuration: 24 * 60 * 60 * 1000
};

// ========================================
// CHECK AUTH STATUS
// ========================================
function checkAuth() {
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!session) {
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        // Cek apakah session sudah expired
        if (sessionData.expiry && now > sessionData.expiry) {
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
            return false;
        }
        
        return true;
    } catch (e) {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
        return false;
    }
}

// ========================================
// REDIRECT IF NOT AUTHENTICATED
// ========================================
function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
}

// ========================================
// LOGOUT
// ========================================
function logout() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    window.location.href = 'login.html';
}

// ========================================
// THEME TOGGLE (SHARED)
// ========================================
let isDarkMode = true;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
    updateThemeIcons();
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function updateThemeIcons() {
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    if (darkIcon && lightIcon) {
        if (isDarkMode) {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        }
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkMode = false;
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
    updateThemeIcons();
}

// ========================================
// INIT FOR ALL PAGES
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadTheme();
    
    // Check if we're on a protected page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const protectedPages = ['home.html', 'landing-page.html', 'website.html'];
    
    if (protectedPages.includes(currentPage)) {
        requireAuth();
    }
});

// ========================================
// LOGIN FORM HANDLER (FOR login.html)
// ========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorDiv.classList.remove('hidden');
            errorDiv.querySelector('span').textContent = 'Format email tidak valid';
            return;
        }
        
        // Validasi password
        if (password !== AUTH_CONFIG.defaultPassword) {
            errorDiv.classList.remove('hidden');
            errorDiv.querySelector('span').textContent = 'Email atau password salah';
            return;
        }
        
        // Login berhasil - buat session
        const sessionData = {
            email: email,
            loginTime: Date.now(),
            expiry: Date.now() + AUTH_CONFIG.sessionDuration
        };
        
        localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(sessionData));
        
        // Redirect ke home
        window.location.href = 'home.html';
    });
}