// ========================================
// LINK BIO ENGINE
// ========================================

let lb_currentPrompt = "";
let lb_typingInterval = null;
let lb_isAutoGenerate = true;

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('linkbioForm')) return;
    if (typeof loadTheme === 'function') loadTheme();
});

// ========================================
// OPTION SELECTION (PENCETAN)
// ========================================
function lb_selectOption(element, hiddenId, value) {
    // Remove selected dari semua sibling
    const parent = element.parentElement;
    parent.querySelectorAll('.lb-option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected ke yang diklik
    element.classList.add('selected');
    
    // Update hidden input
    document.getElementById(hiddenId).value = value;
}

// ========================================
// RESET
// ========================================
function lb_resetForm() {
    document.getElementById('resetModal').classList.add('active');
}

function lb_confirmReset() {
    closeResetModal();
    document.getElementById('linkbioForm').reset();
    localStorage.removeItem('linkbioFormData');
    
    // Reset all option cards
    document.querySelectorAll('.lb-option-card').forEach(card => card.classList.remove('selected'));
    
    // Reset defaults
    document.querySelector('[onclick*="lb_photoShape"][onclick*="Circle"]')?.classList.add('selected');
    document.querySelector('[onclick*="lb_btnShape"][onclick*="Pill"]')?.classList.add('selected');
    document.querySelector('[onclick*="lb_platform"][onclick*="Scalev"]')?.classList.add('selected');
    
    document.getElementById('lb_photoShape').value = 'Circle';
    document.getElementById('lb_btnShape').value = 'Pill';
    document.getElementById('lb_platform').value = 'Scalev';
    
    // Reset contact form toggle
    const contactBtn = document.getElementById('lb_contactFormBtn');
    if (contactBtn) {
        contactBtn.classList.add('selected');
        contactBtn.querySelector('.toggle-icon').textContent = '✓';
    }
    document.getElementById('lb_contactForm').value = 'Ya';
    
    lb_currentPrompt = "";
    document.getElementById('lb_promptPreview').innerHTML = '<p class="preview-placeholder">Prompt akan muncul di sini setelah Anda mengklik "Generate Prompt"...</p>';
    document.getElementById('lb_promptStatus').classList.add('hidden');
    document.getElementById('lb_finalActionBtn').disabled = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', function(e) {
    const modal = document.getElementById('resetModal');
    if (e.target === modal) closeResetModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeResetModal();
});

// ========================================
// UI HELPERS
// ========================================
function lb_showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast-notification';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
}

function lb_updateActionButtons(disabled) {
    const btn = document.getElementById('lb_finalActionBtn');
    btn.disabled = disabled;
    btn.style.background = disabled ? '#4b5563' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
}

// ========================================
// COPY
// ========================================
function lb_copyPrompt() {
    if (!lb_currentPrompt) return;
    navigator.clipboard.writeText(lb_currentPrompt).then(() => lb_showToast('Disalin!'));
}

// ========================================
// SEND TO AI
// ========================================
function lb_sendToAI() {
    if (!lb_currentPrompt) return;
    const MAX = 5500;
    if (lb_currentPrompt.length <= MAX) {
        window.open(`https://chat.z.ai/?q=${encodeURIComponent(lb_currentPrompt)}`, '_blank');
    } else {
        navigator.clipboard.writeText(lb_currentPrompt).then(() => {
            window.open('https://chat.z.ai/', '_blank');
            lb_showToast('Disalin! Paste di Z Ai.');
        });
    }
}

function lb_updatePromptStatus() {
    const s = document.getElementById('lb_promptStatus');
    const len = lb_currentPrompt.length;
    s.classList.remove('hidden', 'auto', 'manual');
    if (len <= 5500) {
        lb_isAutoGenerate = true;
        s.classList.add('auto');
        s.innerHTML = `<span class="status-icon">✅</span><span class="status-text">Siap generate (${len})</span>`;
    } else {
        lb_isAutoGenerate = false;
        s.classList.add('manual');
        s.innerHTML = `<span class="status-icon">⚠️</span><span class="status-text">Prompt panjang (${len}) - paste manual</span>`;
        navigator.clipboard.writeText(lb_currentPrompt);
    }
}

// ========================================
// ANIMATION
// ========================================
function lb_animateTyping(text, elId) {
    const el = document.getElementById(elId);
    if (lb_typingInterval) clearInterval(lb_typingInterval);
    let i = 0, d = '';
    el.innerHTML = '';
    lb_typingInterval = setInterval(() => {
        if (i < text.length) {
            d += text.slice(i, i+3);
            i += 3;
            el.innerHTML = d.replace(/\n/g, '<br>');
            el.scrollTop = el.scrollHeight;
        } else {
            clearInterval(lb_typingInterval);
            lb_updateActionButtons(false);
            lb_updatePromptStatus();
        }
    }, 1);
}

// ========================================
// GENERATE PROMPT
// ========================================
document.getElementById('linkbioForm').addEventListener('submit', function(e) {
    e.preventDefault();
    lb_updateActionButtons(true);
    document.getElementById('lb_promptPreview').innerHTML = '<p class="loading-text">Meracik prompt...</p>';

    // Get all values
    const name = document.getElementById('lb_name').value || 'Nama';
    const role = document.getElementById('lb_role').value || 'Role';
    const bio = document.getElementById('lb_bio').value || '';
    
    const layout = document.getElementById('lb_layout').value;
    const highlight = document.getElementById('lb_highlight').value || '';
    const links = document.getElementById('lb_links').value || '';
    
    const photoShape = document.getElementById('lb_photoShape').value;
    const bgStyle = document.getElementById('lb_bgStyle').value;
    const btnShape = document.getElementById('lb_btnShape').value;
    const btnAnim = document.getElementById('lb_btnAnim').value;
    
    const color = document.getElementById('lb_colorBrand').value;
    const themeBg = document.getElementById('lb_themeBg').value;
    const designStyle = document.getElementById('lb_designStyle').value;
    const font = document.getElementById('lb_font').value;
    
    // Featured content
    const videoUrl = document.getElementById('lb_videoUrl').value || '';
    const countdown = document.getElementById('lb_countdown').value || '';
    const musicUrl = document.getElementById('lb_musicUrl').value || '';
    const donation = document.getElementById('lb_donation').value || '';
    const contactForm = document.getElementById('lb_contactForm').value;
    
    const platform = document.getElementById('lb_platform').value;
    
    // Socials
    const ig = document.getElementById('lb_ig').value || '';
    const fb = document.getElementById('lb_fb').value || '';
    const tiktok = document.getElementById('lb_tiktok').value || '';
    const x = document.getElementById('lb_x').value || '';
    const threads = document.getElementById('lb_threads').value || '';
    const yt = document.getElementById('lb_yt').value || '';
    const linkedin = document.getElementById('lb_linkedin').value || '';
    const wa = document.getElementById('lb_wa').value || '';

    // Build social media bar
    let socialBar = '';
    if (ig) socialBar += `\nInstagram: ${ig}`;
    if (fb) socialBar += `\nFacebook: ${fb}`;
    if (tiktok) socialBar += `\nTikTok: ${tiktok}`;
    if (x) socialBar += `\nX / Twitter: ${x}`;
    if (threads) socialBar += `\nThreads: ${threads}`;
    if (yt) socialBar += `\nYouTube: ${yt}`;
    if (linkedin) socialBar += `\nLinkedIn: ${linkedin}`;
    if (wa) socialBar += `\nWhatsApp: ${wa}`;

    // Build featured content
    let featuredContent = '';
    if (videoUrl) featuredContent += `\n- Video Embed URL: ${videoUrl}`;
    if (countdown) featuredContent += `\n- Countdown: ${countdown}`;
    if (musicUrl) featuredContent += `\n- Music Embed URL: ${musicUrl}`;
    if (donation) featuredContent += `\n- Donation Text: ${donation}`;

    // Theme visual
    let themeText = '';
    if (themeBg === 'Force Light Mode') {
        themeText = 'Wajib Light Mode (Background terang, teks gelap).';
    } else if (themeBg === 'Force Dark Mode') {
        themeText = 'Wajib Dark Mode (Background gelap, teks terang).';
    } else {
        themeText = 'Sesuai gaya desain yang dipilih.';
    }

    // Generate prompt
    lb_currentPrompt = `ANDA ADALAH: UI/UX Designer spesialis micro-site dan personal branding.

TUGAS ANDA: Membuat halaman "Link in Bio" yang modern, responsif, dan eye-catching untuk profil personal brand.

ATURAN DESAIN & LAYOUT (WAJIB DIPATUHI):
1. LAYOUT: Full Width Mobile Container (w-full). Jangan beri margin kiri-kanan pada container utama.
2. GLOBAL STYLE: Wajib set 'body { overflow-x: hidden; }' untuk mencegah scroll horizontal pada tampilan mobile. Pastikan wrapper/container utama tidak melebihi lebar layar (100vw).
3. TEMA VISUAL: ${themeText}
4. PROFILE PHOTO: Gunakan bentuk "${photoShape}". Tampilkan dengan ukuran proporsional (80-120px). Placeholder: 'https://placehold.co/150'
5. BUTTON STYLE: Gunakan bentuk "${btnShape}" dengan layout "${layout}".
6. BUTTON TEXT: Teks tombol WAJIB KONSISTEN (Jangan berubah warna saat hover/klik). DILARANG menggunakan underline pada teks tombol. Gunakan '!important' pada properti warna teks dan text-decoration untuk memaksa style ini.
7. ANIMASI: Tambahkan efek "${btnAnim}" pada tombol penting.
8. TYPOGRAPHY: Gunakan gaya font "${font}".
9. BACKGROUND: ${bgStyle}.
10. MOBILE FIRST: Pastikan tampilan mobile sempurna sebelum desktop.
11. CSS VARIABLE: Gunakan variabel CSS untuk warna utama agar mudah dikustomisasi.

PROFIL:
- Nama: ${name}
- Role: ${role}
- Bio: ${bio || 'Tidak ada bio'}

SOCIAL MEDIA BAR:${socialBar || '\nTidak ada'}

LINK UTAMA & KONTEN:
 ${highlight ? `- Highlight Link: ${highlight}` : ''}${links ? `\n- List Link:\n${links}` : '\nTidak ada link'}${featuredContent ? `\n\nFEATURED CONTENT & WIDGETS:${featuredContent}` : ''}${contactForm === 'Ya' ? '\n\nTAMBAHKAN: Form Kontak Langsung (Name, Email, Message, Submit Button)' : ''}

DESAIN:
- Gaya Desain: ${designStyle}
- Warna Brand: ${color}
- Platform Target: ${platform}

OUTPUT: Generate kode HTML lengkap (single file) dengan Tailwind CSS. Pastikan desainnya estetik, ringan, dan sesuai semua aturan di atas.`;

    setTimeout(() => lb_animateTyping(lb_currentPrompt, 'lb_promptPreview'), 1000);
});

// ========================================
// TOGGLE CONTACT FORM
// ========================================
function lb_toggleContactForm() {
    const btn = document.getElementById('lb_contactFormBtn');
    const input = document.getElementById('lb_contactForm');
    
    if (btn.classList.contains('selected')) {
        // Matikan
        btn.classList.remove('selected');
        btn.querySelector('.toggle-icon').textContent = '';
        input.value = 'Tidak';
    } else {
        // Nyalakan
        btn.classList.add('selected');
        btn.querySelector('.toggle-icon').textContent = '✓';
        input.value = 'Ya';
    }
}