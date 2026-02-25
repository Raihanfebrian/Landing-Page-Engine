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
        window.location.href = 'index.html';
    }
}

// ========================================
// LOGOUT
// ========================================
function logout() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    window.location.href = 'index.html';
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
// LOGIN FORM HANDLER (FOR index.html)
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

// ========================================
// PAGE LOADER FUNCTIONS
// ========================================
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('active');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 400);
    }
}

function showLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.classList.add('active');
        }, 10);
    }
}

// Hide loader when page is fully loaded
window.addEventListener('load', function() {
    setTimeout(hideLoader, 800); // Delay 0.8 detik biar keliatan
});

// Show loader before leaving page (untuk navigasi)
window.addEventListener('beforeunload', function() {
    showLoader();
});

// Intercept all link clicks
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        // Only intercept internal links
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showLoader();
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
});

// ========================================
// PAGE LOADER
// ========================================
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1000);
    }
});
