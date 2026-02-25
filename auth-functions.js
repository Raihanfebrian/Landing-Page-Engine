// ========================================
// AUTH FUNCTIONS v5.4 - BETTER MESSAGES
// ========================================

// ========================================
// CONFIG
// ========================================
const MAX_DEVICES = 1;
const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(type, title, message, duration) {
    duration = duration || 5000;
    
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const icons = {
        error: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        warning: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = 
        '<div class="toast-icon">' + icons[type] + '</div>' +
        '<div class="toast-content">' +
            '<div class="toast-title">' + title + '</div>' +
            (message ? '<div class="toast-message">' + message + '</div>' : '') +
        '</div>' +
        '<button class="toast-close" onclick="closeToast(this)">' +
            '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>' +
        '<div class="toast-progress"></div>';
    
    container.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    
    const autoClose = setTimeout(function() {
        closeToast(toast.querySelector('.toast-close'));
    }, duration);
    
    toast.dataset.timeout = autoClose;
}

function closeToast(button) {
    const toast = button.closest('.toast');
    if (!toast) return;
    
    if (toast.dataset.timeout) {
        clearTimeout(parseInt(toast.dataset.timeout));
    }
    
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(function() { toast.remove(); }, 400);
}

// ========================================
// PASSWORD RESET LOCK
// ========================================
async function createPasswordResetLock(email) {
    try {
        const db = firebase.firestore();
        await db.collection('passwordResets').doc(email.toLowerCase()).set({
            email: email.toLowerCase(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
        });
    } catch (error) {
        console.error('Create lock error:', error);
    }
}

async function checkPasswordResetLock(email) {
    try {
        const db = firebase.firestore();
        const doc = await db.collection('passwordResets').doc(email.toLowerCase()).get();
        
        if (doc.exists && doc.data().isActive) {
            const data = doc.data();
            if (data.createdAt) {
                const created = data.createdAt.toDate();
                const now = new Date();
                const hoursElapsed = (now - created) / (1000 * 60 * 60);
                if (hoursElapsed > 1) {
                    await doc.ref.delete();
                    return { locked: false };
                }
            }
            return { locked: true };
        }
        return { locked: false };
    } catch (error) {
        console.error('Check lock error:', error);
        return { locked: false };
    }
}

async function clearPasswordResetLock(email) {
    try {
        const db = firebase.firestore();
        await db.collection('passwordResets').doc(email.toLowerCase()).delete();
    } catch (error) {
        console.log('Clear lock error:', error);
    }
}

// ========================================
// SESSION MANAGEMENT
// ========================================
let sessionUnsubscribe = null;

function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Desktop';
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet/i.test(ua)) device = 'Tablet';
    
    let browser = 'Unknown';
    if (/chrome/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edge/i.test(ua)) browser = 'Edge';
    
    return device + ' - ' + browser;
}

async function createSession(user) {
    try {
        const db = firebase.firestore();
        const sessionId = generateSessionId();
        
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('lastActivity', Date.now().toString());
        
        await db.collection('sessions').doc(sessionId).set({
            userId: user.uid,
            email: user.email,
            deviceInfo: getDeviceInfo(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
        });
        
        await invalidateOtherSessions(user.uid, sessionId);
        return sessionId;
    } catch (error) {
        console.error('Create session error:', error);
        return null;
    }
}

async function invalidateOtherSessions(userId, currentSessionId) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection('sessions')
            .where('userId', '==', userId)
            .where('isActive', '==', true)
            .get();
        
        snapshot.forEach(function(doc) {
            if (doc.id !== currentSessionId) {
                doc.ref.update({
                    isActive: false,
                    invalidatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    invalidationReason: 'Login from new device'
                }).catch(function() {});
            }
        });
    } catch (error) {
        console.log('Invalidate error:', error);
    }
}

async function invalidateAllSessions(email) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection('sessions')
            .where('email', '==', email)
            .where('isActive', '==', true)
            .get();
        
        const batch = db.batch();
        snapshot.forEach(function(doc) {
            batch.update(doc.ref, {
                isActive: false,
                invalidatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                invalidationReason: 'Password reset'
            });
        });
        await batch.commit();
    } catch (error) {
        console.log('Invalidate all error:', error);
    }
}

async function validateSession(user) {
    try {
        const sessionId = localStorage.getItem('sessionId');
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (lastActivity) {
            const elapsed = Date.now() - parseInt(lastActivity);
            if (elapsed > SESSION_TIMEOUT_MS) {
                return { valid: false, reason: 'timeout' };
            }
        }
        
        localStorage.setItem('lastActivity', Date.now().toString());
        
        if (!sessionId) return { valid: false, reason: 'no_session' };
        
        const db = firebase.firestore();
        const sessionDoc = await db.collection('sessions').doc(sessionId).get();
        
        if (!sessionDoc.exists) return { valid: false, reason: 'not_found' };
        
        const data = sessionDoc.data();
        if (!data.isActive) return { valid: false, reason: 'logged_elsewhere' };
        if (data.userId !== user.uid) return { valid: false, reason: 'mismatch' };
        
        sessionDoc.ref.update({
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function() {});
        
        return { valid: true };
    } catch (error) {
        console.error('Validate error:', error);
        return { valid: true };
    }
}

async function clearSession() {
    try {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            const db = firebase.firestore();
            await db.collection('sessions').doc(sessionId).update({
                isActive: false,
                loggedOutAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(function() {});
        }
        localStorage.removeItem('sessionId');
        localStorage.removeItem('lastActivity');
    } catch (error) {
        console.log('Clear error:', error);
    }
}

// ========================================
// REAL-TIME SESSION LISTENER
// ========================================
function startSessionListener(user) {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    
    if (sessionUnsubscribe) sessionUnsubscribe();
    
    const db = firebase.firestore();
    sessionUnsubscribe = db.collection('sessions').doc(sessionId)
        .onSnapshot(function(doc) {
            if (!doc.exists) {
                forceLogout('Sesi Anda telah berakhir.');
                return;
            }
            
            const data = doc.data();
            if (!data.isActive) {
                let reason = 'Akun Anda login di device lain.';
                if (data.invalidationReason === 'Password reset' || data.invalidationReason === 'Password changed') {
                    reason = 'Password telah diubah. Silakan login kembali.';
                }
                forceLogout(reason);
            }
        }, function(error) {
            console.error('Listener error:', error);
        });
}

function stopSessionListener() {
    if (sessionUnsubscribe) {
        sessionUnsubscribe();
        sessionUnsubscribe = null;
    }
}

function forceLogout(reason) {
    stopSessionListener();
    
    firebase.auth().signOut().then(function() {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('lastActivity');
        showToast('warning', 'Auto Logout', reason);
        setTimeout(function() { window.location.href = 'index.html'; }, 3000);
    }).catch(function() {
        window.location.href = 'index.html';
    });
}

// ========================================
// LUPA PASSWORD - MODAL KONFIRMASI
// ========================================
let resetPasswordEmail = '';

function resetPassword() {
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    
    if (!email) {
        showToast('warning', 'Email Kosong', 'Masukkan email dulu.');
        return;
    }
    
    resetPasswordEmail = email;
    
    const emailDisplay = document.getElementById('resetEmailDisplay');
    if (emailDisplay) emailDisplay.textContent = email;
    
    const modal = document.getElementById('resetPasswordModal');
    if (modal) modal.classList.add('active');
}

function closeResetPasswordModal() {
    const modal = document.getElementById('resetPasswordModal');
    if (modal) modal.classList.remove('active');
    resetPasswordEmail = '';
}

async function confirmResetPassword() {
    if (!resetPasswordEmail) return;
    
    const btn = document.getElementById('confirmResetBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Mengirim...';
    }
    
    try {
        await firebase.auth().sendPasswordResetEmail(resetPasswordEmail);
        await invalidateAllSessions(resetPasswordEmail);
        await createPasswordResetLock(resetPasswordEmail);
        
        closeResetPasswordModal();
        
        // PESAN YANG SUDAH DIPERBAIKI
        showToast('success', 'Email Terkirim!', 'Cek folder INBOX, PROMOSI, atau SPAM. Subject: "Reset Password - raihanstruggle"', 8000);
        
    } catch (error) {
        let msg = error.message;
        if (error.code === 'auth/user-not-found') msg = 'Email tidak terdaftar.';
        else if (error.code === 'auth/invalid-email') msg = 'Format email salah.';
        else if (error.code === 'auth/too-many-requests') msg = 'Terlalu banyak percobaan.';
        showToast('error', 'Gagal', msg);
    }
    
    if (btn) {
        btn.disabled = false;
        btn.textContent = 'Ya, Kirim Email';
    }
}

// ========================================
// PROFIL MODAL
// ========================================
function openProfileModal() {
    const user = firebase.auth().currentUser;
    if (user) {
        const emailInput = document.getElementById('profileEmail');
        const passwordInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        const confirmGroup = document.getElementById('confirmPasswordGroup');
        const matchIcon = document.getElementById('passwordMatchIcon');
        const matchText = document.getElementById('passwordMatchText');
        
        if (emailInput) emailInput.value = user.email;
        if (passwordInput) passwordInput.value = '';
        if (confirmInput) confirmInput.value = '';
        if (confirmGroup) confirmGroup.style.display = 'none';
        if (matchIcon) matchIcon.innerHTML = '';
        if (matchText) matchText.textContent = '';
    }
    
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.add('active');
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('active');
}

function onPasswordInput() {
    const passwordInput = document.getElementById('newPassword');
    const confirmGroup = document.getElementById('confirmPasswordGroup');
    const confirmInput = document.getElementById('confirmPassword');
    const password = passwordInput ? passwordInput.value : '';
    
    if (confirmGroup) {
        confirmGroup.style.display = password.length > 0 ? 'block' : 'none';
    }
    
    if (confirmInput && confirmInput.value.length > 0) {
        onConfirmInput();
    }
}

function onConfirmInput() {
    const passwordInput = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const matchIcon = document.getElementById('passwordMatchIcon');
    const matchText = document.getElementById('passwordMatchText');
    
    const password = passwordInput ? passwordInput.value : '';
    const confirm = confirmInput ? confirmInput.value : '';
    
    if (!matchIcon || !matchText) return;
    
    if (confirm.length === 0) {
        matchIcon.innerHTML = '';
        matchText.textContent = '';
        matchText.className = 'text-xs mt-1';
        return;
    }
    
    if (password === confirm) {
        matchIcon.className = 'input-icon success';
        matchIcon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
        matchText.textContent = '✓ Password cocok';
        matchText.className = 'text-xs mt-1 text-green';
    } else {
        matchIcon.className = 'input-icon error';
        matchIcon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>';
        matchText.textContent = '✗ Password tidak cocok';
        matchText.className = 'text-xs mt-1 text-red';
    }
}

async function isSameAsCurrentPassword(user, newPassword) {
    try {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, newPassword);
        await user.reauthenticateWithCredential(credential);
        return true;
    } catch (error) {
        return false;
    }
}

async function validateAndConfirmPassword() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const currentPasswordInput = document.getElementById('currentPassword'); // TAMBAH INI
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    const currentPassword = currentPasswordInput ? currentPasswordInput.value : ''; // TAMBAH INI
    const user = firebase.auth().currentUser;
    
    if (!newPassword) {
        closeProfileModal();
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('warning', 'Terlalu Pendek', 'Password minimal 6 karakter.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('error', 'Tidak Cocok', 'Password dan konfirmasi tidak sama.');
        return;
    }
    
    // VALIDASI PASSWORD LAMA
    if (!currentPassword) {
        showToast('warning', 'Password Lama Diperlukan', 'Masukkan password lama untuk keamanan.');
        return;
    }
    
    if (user) {
        const saveBtn = document.getElementById('savePasswordBtn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Memverifikasi...';
        }
        
        // RE-AUTHENTICATE DENGAN PASSWORD LAMA
        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(credential);
        } catch (reauthError) {
            if (reauthError.code === 'auth/wrong-password') {
                showToast('error', 'Password Lama Salah', 'Password lama yang Anda masukkan salah.');
            } else {
                showToast('error', 'Gagal', reauthError.message);
            }
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Simpan';
            }
            return;
        }
        
        // CEK APAKAH PASSWORD BARU SAMA DENGAN LAMA
        const isSame = await isSameAsCurrentPassword(user, newPassword);
        
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Simpan';
        }
        
        if (isSame) {
            showToast('error', 'Password Sama', 'Password baru tidak boleh sama dengan password lama.');
            return;
        }
    }
    
    closeProfileModal();
    const changeModal = document.getElementById('changePasswordModal');
    if (changeModal) changeModal.classList.add('active');
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.remove('active');
    
    const profileModal = document.getElementById('profileModal');
    if (profileModal) profileModal.classList.add('active');
}

async function executePasswordChange() {
    const newPasswordInput = document.getElementById('newPassword');
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const user = firebase.auth().currentUser;
    
    if (!user) {
        showToast('error', 'Error', 'User tidak ditemukan.');
        closeChangePasswordModal();
        return;
    }
    
    const btn = document.getElementById('confirmChangeBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
    }
    
    try {
        await user.updatePassword(newPassword);
        await clearPasswordResetLock(user.email);
        await invalidateAllSessions(user.email);
        await createSession(user);
        
        closeChangePasswordModal();
        showToast('success', 'Berhasil!', 'Password berhasil diubah.');
        
        if (newPasswordInput) newPasswordInput.value = '';
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput) confirmInput.value = '';
        
    } catch (error) {
        showToast('error', 'Gagal', error.message);
        closeChangePasswordModal();
    }
    
    if (btn) {
        btn.disabled = false;
        btn.textContent = 'Ya, Ganti';
    }
}

// ========================================
// LOGOUT
// ========================================
function logout() {
    stopSessionListener();
    clearSession().then(function() {
        return firebase.auth().signOut();
    }).then(function() {
        window.location.href = 'index.html';
    }).catch(function() {
        window.location.href = 'index.html';
    });
}

// ========================================
// THEME
// ========================================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme + '-mode');
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(newTheme + '-mode');
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    
    if (darkIcon && lightIcon) {
        if (theme === 'dark') {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        }
    }
}

// ========================================
// CHECK SUBSCRIPTION - BETTER MESSAGES
// ========================================
async function checkSubscription(user) {
    const db = firebase.firestore();
    
    try {
        const snapshot = await db.collection('subscriptions')
            .where('email', '==', user.email)
            .where('isActive', '==', true)
            .limit(1)
            .get();
        
        // Subscription tidak ditemukan
        if (snapshot.empty) {
            // Cek apakah ada subscription tapi expired
            const expiredSnapshot = await db.collection('subscriptions')
                .where('email', '==', user.email)
                .limit(1)
                .get();
            
            if (!expiredSnapshot.empty) {
                const expiredData = expiredSnapshot.docs[0].data();
                
                if (expiredData.plan !== 'lifetime' && expiredData.expiryDate) {
                    const expiry = expiredData.expiryDate.toDate();
                    const now = new Date();
                    
                    if (now > expiry) {
                        // EXPIRED
                        await firebase.auth().signOut();
                        showToast('warning', 'Paket Kadaluarsa', 'Masa aktif sudah berakhir. Silakan perpanjang.');
                        setTimeout(function() { window.location.href = 'index.html?expired=true'; }, 3000);
                        return false;
                    }
                }
                
                // Ada subscription tapi tidak aktif
                await firebase.auth().signOut();
                showToast('error', 'Akses Ditolak', 'Akun tidak aktif. Hubungi admin.');
                setTimeout(function() { window.location.href = 'index.html?inactive=true'; }, 3000);
                return false;
            }
            
            // Tidak ada subscription sama sekali
            await firebase.auth().signOut();
            showToast('error', 'Belum Terdaftar', 'Email belum terdaftar. Hubungi admin.');
            setTimeout(function() { window.location.href = 'index.html?notregistered=true'; }, 3000);
            return false;
        }
        
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        // Cek expiry
        if (data.plan !== 'lifetime' && data.expiryDate) {
            const expiry = data.expiryDate.toDate();
            const now = new Date();
            
            if (now > expiry) {
                await doc.ref.update({ isActive: false });
                await firebase.auth().signOut();
                showToast('warning', 'Paket Kadaluarsa', 'Masa aktif sudah berakhir. Silakan perpanjang.');
                setTimeout(function() { window.location.href = 'index.html?expired=true'; }, 3000);
                return false;
            }
            
            // Warning hampir expired (3 hari)
            const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 3 && daysLeft > 0) {
                showToast('info', 'Paket Hampir Habis', `Tersisa ${daysLeft} hari. Segera perpanjang!`, 10000);
            }
        }
        
        // Validate session
        const sessionResult = await validateSession(user);
        
        if (!sessionResult.valid) {
            await firebase.auth().signOut();
            localStorage.removeItem('sessionId');
            localStorage.removeItem('lastActivity');
            
            if (sessionResult.reason === 'logged_elsewhere') {
                showToast('warning', 'Login di Device Lain', 'Hanya 1 device diperbolehkan.');
            } else if (sessionResult.reason === 'timeout') {
                showToast('info', 'Sesi Berakhir', 'Tidak ada aktivitas 2 jam.');
            } else {
                showToast('warning', 'Sesi Invalid', 'Silakan login kembali.');
            }
            
            setTimeout(function() { window.location.href = 'index.html'; }, 3000);
            return false;
        }
        
        startSessionListener(user);
        return true;
        
    } catch (error) {
        console.error('Subscription error:', error);
        return true;
    }
}

// ========================================
// AUTH STATE CHECK
// ========================================
function checkAuth(redirectUrl) {
    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            window.location.href = redirectUrl || 'index.html';
            return;
        }
        
        const valid = await checkSubscription(user);
        if (!valid) return;
    });
}

function checkAuthLogin(redirectUrl) {
    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            await clearPasswordResetLock(user.email);
            await createSession(user);
            
            const valid = await checkSubscription(user);
            if (valid) {
                const justLoggedIn = sessionStorage.getItem('justLoggedIn');
                if (justLoggedIn === 'true') {
                    showToast('success', 'Login Berhasil!', 'Selamat bereksplorasi yaa ^_^');
                    sessionStorage.removeItem('justLoggedIn');
                }
                window.location.href = redirectUrl || 'home.html';
            }
        }
    });
}

// ========================================
// ACTIVITY TRACKER
// ========================================
document.addEventListener('click', function() {
    localStorage.setItem('lastActivity', Date.now().toString());
});

document.addEventListener('keypress', function() {
    localStorage.setItem('lastActivity', Date.now().toString());
});

document.addEventListener('scroll', function() {
    localStorage.setItem('lastActivity', Date.now().toString());
});

// ========================================
// MODAL EVENTS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', confirmResetPassword);
    }
});

document.addEventListener('click', function(e) {
    const profileModal = document.getElementById('profileModal');
    if (profileModal && e.target === profileModal) closeProfileModal();
    
    const resetModal = document.getElementById('resetPasswordModal');
    if (resetModal && e.target === resetModal) closeResetPasswordModal();
    
    const changeModal = document.getElementById('changePasswordModal');
    if (changeModal && e.target === changeModal) closeChangePasswordModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProfileModal();
        closeResetPasswordModal();
        closeChangePasswordModal();
    }
});

// ========================================
// PAGE LOADER
// ========================================
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
}

window.addEventListener('load', function() {
    setTimeout(hideLoader, 800);
});