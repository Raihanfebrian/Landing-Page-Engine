// ========================================
// LANDING PAGE ENGINE (script.js)
// ========================================
// Catatan: Theme & Auth sudah diurus oleh auth.js
// Pastikan auth.js dipanggil SEBELUM file ini di HTML

// ========================================
// STATE VARIABLES - LANDING PAGE
// ========================================
let lp_currentPrompt = "";
let lp_selectedPlatform = "Scalev";
let lp_selectedElements = [];
let lp_isAutoGenerate = true; 

const MAX_URL_LENGTH = 5500; 

// ========================================
// MAPPINGS LENGKAP - SESUAI ATM (FINAL)
// ========================================

// Framework dengan deskripsi lengkap
const frameworkMap = {
    'AIDCA (Attention-Interest-Desire-Conviction-Action)': 'AIDCA (Attention–Interest–Desire–Conviction–Action)',
    'PAS (Problem-Agitate-Solution)': 'PAS (Problem–Agitate–Solution)',
    'BAB (Before-After-Bridge)': 'BAB (Before–After–Bridge)',
    '4P (Promise-Picture-Proof-Push)': '4P (Promise–Picture–Proof–Push)',
    'SLAP (Stop-Look-Act-Purchase)': 'SLAP (Stop–Look–Act–Purchase)',
    'StoryBrand (Hero-Guide-Plan)': 'StoryBrand (Hero–Guide–Plan)',
    'ABT (And-But-Therefore)': 'ABT (And–But–Therefore)',
    'Hero\'s Journey (12 Stage)': 'Hero\'s Journey (12 Stage)',
    'HSO (Hook-Story-Offer)': 'Hook–Story–Offer (HSO)',
    'QUEST (Qualify-Understand-Educate-Stimulate-Transition)': 'QUEST (Qualify–Understand–Educate–Stimulate–Transition)',
    'JTBD (Jobs To Be Done)': 'JTBD (Situation–Motivation–Obstacle–Outcome)',
    'Awareness Ladder (5 Level)': 'Awareness Ladder (5 Level)',
    'FAB (Features-Advantages-Benefits)': 'FAB (Features–Advantages–Benefits)',
    'PASTOR (Problem-Amplify-Story-Testimony-Offer-Response)': 'PASTOR (Problem–Amplify–Story–Transformation–Offer–Response)',
    'Problem-Promise-Proof': 'Problem–Promise–Proof',
    'Useful-Urgent-Unique': 'Useful–Urgent–Unique',
    'The 3 Reason Why': 'The 3 Reason Why'
};

// Tone/Gaya Bahasa - FINAL
const toneMap = {
    'Friendly & Conversational (Santai tapi sopan)': 'Friendly & Conversational (Santai tapi sopan)',
    'Professional & Formal (Bisnis serius)': 'Professional & Formal (Bisnis serius)',
    'Witty & Humorous (Gokil dan menghibur)': 'Witty & Humorous (Menyenangkan dan ber-joke)',
    'Bold & Disruptive (Berani dan menantang)': 'Bold & Disruptive (Berani dan menantang)',
    'Empathetic (Penuh pengertian)': 'Empathetic (Penuh pengertian)',
    'Storytelling Mode (Narasi hangat)': 'Storytelling (Narasi yang mengalir)',
    'Inspirational (Memotivasi)': 'Inspirational & Visionary (Memotivasi)',
    'Exciting & Energetic (Penuh semangat)': 'Exciting & Energetic (Penuh antusiasme)',
    'Direct & To The Point (Lugas tanpa basa-basi)': 'Direct & No-Nonsense (Langsung to the point)',
    'Scientific / Data-Driven (Berdasarkan data)': 'Scientific / Data-Driven (Berdasarkan data)',
    'Trustworthy (Dapat dipercaya)': 'Trustworthy & Reassuring (Menenangkan/Terpercaya)',
    'Urgent / Scarcity (Mendesak dan terbatas)': 'Urgent / Scarcity (Mendesak dan terbatas)',
    'Luxury & Exclusive (Eksklusif dan premium)': 'Luxury & Exclusive (Eksklusif dan premium)',
    'Minimalist & Zen (Sederhana dan tenang)': 'Minimalist & Zen (Tenang dan simple)'
};

// Target Audience - SESUAI ATM (FINAL)
const audienceMap = {
    'Advertiser (FB Ads / TikTok Ads User)': 'Advertiser (FB Ads / TikTok Ads User)',
    'Performance Marketer (Paid Ads Specialist)': 'Performance Marketer (Paid Ads Specialist)',
    'Business Owner (UMKM / UKM)': 'Business Owner (UMKM / Brand Owner)',
    'Founder Startup (Early Stage)': 'Founder Startup (Early Stage)',
    'Owner Toko Offline (Retail)': 'Owner Toko Offline (Retail)',
    'Seller Marketplace (Shopee/Tokped)': 'Seller Marketplace (Shopee / Tokopedia)',
    'Reseller / Dropshipper': 'Reseller / Dropshipper',
    'Content Creator / Affiliate': 'Content Creator / Affiliate',
    'Influencer (Nano/Micro)': 'Influencer (Nano / Micro)',
    'Coach / Mentor / Trainer': 'Coach / Mentor / Trainer',
    'Ibu Rumah Tangga / Moms': 'Ibu Rumah Tangga / Moms',
    'Pelajar / Mahasiswa': 'Pelajar / Mahasiswa',
    'Fresh Graduate': 'Fresh Graduate (Jobseeker)',
    'Umum (General Audience)': 'Umum (General Audience)'
};

// Color Brand - SESUAI ATM (FINAL)
const colorBrandMap = {
    'Neutral / Monokrom': 'Neutral / Monokrom',
    'Slate / Zinc': 'Slate / Zinc (Cool Gray)',
    'Brand Orange': 'Brand Orange',
    'Red': 'Red',
    'Rose / Pink': 'Rose / Pink',
    'Amber / Gold': 'Amber / Gold',
    'Ocean Blue': 'Ocean Blue',
    'Sky Blue': 'Sky Blue',
    'Indigo': 'Indigo (Deep Blue)',
    'Violet / Purple': 'Violet / Purple',
    'Royal Purple': 'Royal Purple',
    'Emerald Green': 'Emerald Green',
    'Teal / Cyan': 'Teal / Cyan',
    'Lime Green': 'Lime Green',
    'Forest Green': 'Forest Green',
    'Yellow': 'Yellow',
    'Brown / Earthy': 'Brown / Earthy'
};

// Product Type - SESUAI ATM (FINAL)
const productTypeMap = {
    'Digital (Ebook / Template)': 'Digital (Ebook / Template)',
    'Digital (Mini Course / Video)': 'Digital (Mini Course / Video)',
    'Digital (Toolkit / Resource Pack)': 'Digital (Toolkit / Resource Pack)',
    'Digital (Membership / Komunitas)': 'Digital (Membership / Komunitas)',
    'Digital (Bundle / Paket)': 'Digital (Bundle / Paket)',
    'Service (Agency / Freelance)': 'Jasa (Agency / Freelance)',
    'Service (Konsultasi 1:1)': 'Jasa (Konsultasi 1:1)',
    'Service (Done-For-You)': 'Jasa (Done-For-You / Implementasi)',
    'Service (Audit / Review)': 'Jasa (Audit / Review)',
    'Service (Maintenance / Retainer)': 'Jasa (Maintenance / Retainer)',
    'Physical (Skincare / Fashion)': 'Physical (Skincare / Fashion)',
    'Physical (Food & Beverage)': 'Physical (Food & Beverage)',
    'Physical (Kesehatan Umum / Wellness)': 'Physical (Kesehatan Umum / Wellness)',
    'Physical (Home & Living)': 'Physical (Home & Living)',
    'Physical (Gadget / Aksesoris)': 'Physical (Gadget / Aksesoris)',
    'Software (SaaS / Aplikasi)': 'SaaS / Software',
    'Education (Kursus / Coaching)': 'Kursus / Coaching',
    'Education (Bootcamp / Program Intensif)': 'Bootcamp / Program Intensif',
    'Education (Workshop)': 'Workshop',
    'Event (Webinar / Online)': 'Event (Webinar / Online)',
    'Event (Offline)': 'Event Offline',
    'Event (Fundraising / Donasi)': 'Event (Fundraising / Donasi)'
};

// Goal - SESUAI ATM (FINAL)
const goalMap = {
    'Lead Generation (WA/Email)': 'Lead Generation (WA/Email)',
    'Download (Lead Magnet)': 'Download (Lead Magnet)',
    'Registrasi (Event/WL)': 'Registrasi (Event/WL)',
    'Sales / Konversi (Beli Langsung)': 'Sales / Konversi (Beli Langsung)',
    'Checkout (Keranjang)': 'Checkout (Keranjang / Payment)',
    'Pre-Order': 'Pre-Order',
    'Flash Sale': 'Flash Sale / Limited Offer',
    'Trial / Demo': 'Trial / Demo',
    'Sample / Preview': 'Sample / Preview',
    'Free Consultation': 'Free Consultation',
    'Chat (WA / DM)': 'Chat (WA / DM)',
    'Booking (Jadwal)': 'Booking (Jadwal)',
    'Konsultasi': 'Konsultasi'
};

// Hero Type - SESUAI ATM (FINAL)
const heroTypeMap = {
    'Standard Image': 'Standard Image. HERO SECTION: Gunakan layout Hero standar (Gambar/Ilustrasi + Copy).',
    'Video Sales Letter (VSL)': 'Video Sales Letter (VSL). HERO SECTION: Gunakan layout VSL. Video embed (placeholder YT/Vimeo) harus menjadi fokus utama, dengan Headline besar di atasnya dan tombol CTA di bawahnya. JANGAN gunakan gambar samping.',
    'Typographic Only': 'Typographic Driven. HERO SECTION: Gunakan layout Hero standar (Gambar/Ilustrasi + Copy).'
};

// Scarcity - SESUAI ATM (FINAL)
const scarcityMap = {
    'Tidak Ada': { label: 'Tidak Ada', desc: '' },
    'Real Timer (Countdown)': { label: 'Price Increase Soon', desc: 'Jika Real Timer, buatkan placeholder script JS countdown sederhana. Jika Quantity, tuliskan teks "Sisa Slot: X".' },
    'Quantity Left (Sisa Slot/Stok)': { label: 'Quantity Left (Sisa Slot)', desc: 'Jika Quantity, tuliskan teks "Sisa Slot: X".' },
    'Harga Naik Segera': { label: 'Price Increase Soon', desc: 'Jika Real Timer, buatkan placeholder script JS countdown sederhana. Jika Quantity, tuliskan teks "Sisa Slot: X".' }
};

// Layout berdasarkan platform (CASE INSENSITIVE)
const layoutMap = {
    'scalev': {
        title: 'FULL-WIDTH MOBILE-FIRST (Mutlak)',
        desc: `- Container Utama: Gunakan class 'w-full' (Width 100%). JANGAN gunakan 'container' atau 'max-w-md'.
- Padding: Gunakan padding internal section (py-10 px-4), tapi container luar harus menempel ke tepi layar (edge-to-edge).
- Grid: DILARANG menggunakan grid multi-kolom (>1 kolom).
- Behavior: Semua elemen disusun vertikal (atas ke bawah).
- Alasan: Agar saat di-embed di platform ini tidak ada celah/garis vertikal di kiri-kanan (full screen experience).`
    },
    'lynk.id': {
        title: 'FULL-WIDTH MOBILE-FIRST (Mutlak)',
        desc: `- Container Utama: Gunakan class 'w-full' (Width 100%). JANGAN gunakan 'container' atau 'max-w-md'.
- Padding: Gunakan padding internal section (py-10 px-4), tapi container luar harus menempel ke tepi layar (edge-to-edge).
- Grid: DILARANG menggunakan grid multi-kolom (>1 kolom).
- Behavior: Semua elemen disusun vertikal (atas ke bawah).
- Alasan: Agar saat di-embed di platform ini tidak ada celah/garis vertikal di kiri-kanan (full screen experience).`
    },
    'wordpress': {
        title: 'FULLY RESPONSIVE GRID / STACKING',
        desc: `- Desktop: Gunakan layout lebar (container 'max-w-7xl mx-auto'). Gunakan Grid 2 kolom untuk Hero/Features (Teks Kiri, Gambar Kanan).
- Mobile: WAJIB 'Responsive Stacking'. Ubah grid menjadi 1 kolom (class: 'grid-cols-1 md:grid-cols-2').
- Behavior: Pastikan elemen menumpuk rapi ke bawah saat layar kecil, namun sejajar horizontal saat desktop.`
    },
    'shopify': {
        title: 'FULLY RESPONSIVE GRID / STACKING',
        desc: `- Desktop: Gunakan layout lebar (container 'max-w-7xl mx-auto'). Gunakan Grid 2 kolom untuk Hero/Features (Teks Kiri, Gambar Kanan).
- Mobile: WAJIB 'Responsive Stacking'. Ubah grid menjadi 1 kolom (class: 'grid-cols-1 md:grid-cols-2').
- Behavior: Pastikan elemen menumpuk rapi ke bawah saat layar kecil, namun sejajar horizontal saat desktop.`
    }
};

// Platform output (CASE INSENSITIVE)
const platformOutputMap = {
    'scalev': 'Scalev',
    'lynk.id': 'Lynk.id',
    'wordpress': 'WordPress (Elementor/Divi)',
    'shopify': 'Shopify'
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const isLandingPage = document.getElementById('engineForm');
    if (!isLandingPage) return;

    lp_initPlatformDefault();
    
    if (typeof loadTheme === 'function') {
        loadTheme();
    }
});

function lp_initPlatformDefault() {
    const firstPlatform = document.querySelector('.platform-card');
    if(firstPlatform) {
        firstPlatform.classList.add('selected');
        const platformInput = document.getElementById('platform');
        if (platformInput) platformInput.value = 'Scalev';
        lp_selectedPlatform = 'Scalev';
    }
}

// ========================================
// PROMPT STATUS INDICATOR (SIMPLIFIED)
// ========================================
function lp_updatePromptStatus() {
    const statusEl = document.getElementById('lp_promptStatus');
    const btnText = document.querySelector('#finalActionBtn span');
    const btnTextMobile = document.querySelector('#finalActionBtnMobile span');
    
    if (!statusEl) return;
    
    const promptLength = lp_currentPrompt.length;
    
    statusEl.classList.remove('hidden', 'auto', 'manual');
    
    if (promptLength <= MAX_URL_LENGTH) {
        // ===== AUTO MODE =====
        lp_isAutoGenerate = true;
        statusEl.classList.add('auto');
        statusEl.innerHTML = `
            <span class="status-icon">✅</span>
            <span class="status-text">Siap generate otomatis (${promptLength} karakter)</span>
        `;
        
        if (btnText) btnText.textContent = 'Buat Landing Page Sekarang';
        if (btnTextMobile) btnTextMobile.textContent = 'Buat Landing Page Sekarang';
        
    } else {
        // ===== MANUAL MODE =====
        lp_isAutoGenerate = false;
        statusEl.classList.add('manual');
        statusEl.innerHTML = `
            <span class="status-icon">⚠️</span>
            <span class="status-text">Prompt terlalu panjang (${promptLength} karakter) - perlu paste manual</span>
        `;
        
        // GANTI TEKS TOMBOL
        if (btnText) btnText.textContent = 'Copy & Buat Landing Page';
        if (btnTextMobile) btnTextMobile.textContent = 'Copy & Buat Landing Page';
    }
}

// ========================================
// BONUS TOGGLE
// ========================================
function toggleBonus() {
    const checkBox = document.getElementById('haveBonus');
    const field = document.getElementById('bonusField');
    if (!checkBox || !field) return;
    
    if (checkBox.checked) {
        field.classList.remove('hidden');
    } else {
        field.classList.add('hidden');
        const detail = document.getElementById('bonusDetail');
        if(detail) detail.value = "";
    }
}

// ========================================
// MANUAL INPUT HANDLER
// ========================================
function handleManualInput(selectElement, manualInputId) {
    const container = document.getElementById(manualInputId + 'Container');
    if (!container) return;
    
    const selectedValue = selectElement.value;
    
    const isManual = selectedValue.toLowerCase().includes('manual') || 
                     selectedValue.toLowerCase().includes('lainnya') ||
                     selectedValue.toLowerCase().includes('custom') ||
                     selectedValue === 'Isi Manual...';
    
    if (isManual) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        const manualInput = document.getElementById(manualInputId);
        if (manualInput) manualInput.value = '';
    }
}

// ========================================
// PLATFORM SELECTION
// ========================================
function selectPlatform(element, value) {
    const isSelected = element.classList.contains('selected');

    document.querySelectorAll('.platform-card').forEach(card => {
        card.classList.remove('selected');
    });

    if (!isSelected) {
        element.classList.add('selected');
        const platformInput = document.getElementById('platform');
        if (platformInput) platformInput.value = value;
        lp_selectedPlatform = value;
    } else {
        const platformInput = document.getElementById('platform');
        if (platformInput) platformInput.value = "";
        lp_selectedPlatform = "";
    }
}

// ========================================
// ELEMENT SELECTION (Multi-Select)
// ========================================
function toggleElement(element, value) {
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        if (!lp_selectedElements.includes(value)) {
            lp_selectedElements.push(value);
        }
    } else {
        lp_selectedElements = lp_selectedElements.filter(el => el !== value);
    }
    
    const selectedInput = document.getElementById('selectedElements');
    if (selectedInput) selectedInput.value = lp_selectedElements.join(', ');
}

// ========================================
// MODAL KONFIRMASI RESET
// ========================================
function resetForm() {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.add('active');
}

function closeResetModal() {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.remove('active');
}

function confirmReset() {
    closeResetModal();
    lp_executeReset();
}

function lp_executeReset() {
    const form = document.getElementById('engineForm');
    if (form) form.reset();

    document.querySelectorAll('.manual-input-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    document.querySelectorAll('[id$="Manual"]').forEach(input => {
        input.value = '';
    });

    const bonusField = document.getElementById('bonusField');
    if(bonusField) bonusField.classList.add('hidden');
    
    document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('selected');
    });
    lp_selectedElements = [];
    
    lp_initPlatformDefault();

    lp_currentPrompt = "";
    lp_updatePreview();
    
    const statusEl = document.getElementById('lp_promptStatus');
    if (statusEl) statusEl.classList.add('hidden');
    
    lp_updateActionButtons(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', function(e) {
    const modal = document.getElementById('resetModal');
    if (e.target === modal) {
        closeResetModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeResetModal();
    }
});

// ========================================
// UI HELPERS
// ========================================
function lp_updateActionButtons(disabled) {
    const btn = document.getElementById('finalActionBtn');
    const btnMobile = document.getElementById('finalActionBtnMobile');
    
    const styles = disabled 
        ? { disabled: true, bg: '#4b5563', cursor: 'not-allowed', opacity: '0.7' }
        : { disabled: false, bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', cursor: 'pointer', opacity: '1' };
    
    if (btn) {
        btn.disabled = styles.disabled;
        btn.style.background = styles.bg;
        btn.style.cursor = styles.cursor;
        btn.style.opacity = styles.opacity;
    }
    
    if (btnMobile) {
        btnMobile.disabled = styles.disabled;
        btnMobile.style.background = styles.bg;
        btnMobile.style.cursor = styles.cursor;
        btnMobile.style.opacity = styles.opacity;
    }
}

function lp_updatePreview() {
    const preview = document.getElementById('promptPreview');
    const previewMobile = document.getElementById('promptPreviewMobile');
    
    const content = lp_currentPrompt 
        ? lp_currentPrompt.replace(/\n/g, '<br>')
        : '<p class="preview-placeholder">Prompt akan muncul di sini setelah Anda mengklik "Generate Prompt"...</p>';
    
    if (preview) preview.innerHTML = content;
    if (previewMobile) previewMobile.innerHTML = lp_currentPrompt 
        ? lp_currentPrompt.replace(/\n/g, '<br>')
        : '<p class="preview-placeholder">Prompt akan muncul di sini...</p>';
}

// ========================================
// COPY PROMPT
// ========================================
function lp_showToast(message) {
    const existingToast = document.getElementById('lp_toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'lp_toast';
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function copyPrompt() {
    if (!lp_currentPrompt) return;
    navigator.clipboard.writeText(lp_currentPrompt).then(() => {
        lp_showToast('Prompt berhasil disalin!');
    });
}

// ========================================
// SEND TO AI (UPDATED ACTIONS)
// ========================================
function sendToAI() {
    if (!lp_currentPrompt) return;
    
    if (lp_currentPrompt.length <= MAX_URL_LENGTH) {
        // AUTO: Langsung buka Z Ai dengan prompt
        const encodedPrompt = encodeURIComponent(lp_currentPrompt);
        window.open(`https://chat.z.ai/?q=${encodedPrompt}`, '_blank');
    } else {
        // MANUAL: Copy dulu, baru buka Z Ai
        navigator.clipboard.writeText(lp_currentPrompt).then(() => {
            lp_showToast('📋 Prompt disalin! Paste di Z Ai lalu klik Send.');
            window.open('https://chat.z.ai/', '_blank');
        }).catch(err => {
            console.error('Gagal copy:', err);
            window.open('https://chat.z.ai/', '_blank');
            lp_showToast('⚠️ Gagal copy, salin manual dari preview.');
        });
    }
}

// ========================================
// GET VALUE HELPER
// ========================================
function getValue(selectId, manualId) {
    const select = document.getElementById(selectId);
    const manual = document.getElementById(manualId);
    const container = document.getElementById(manualId + 'Container');
    
    if (container && !container.classList.contains('hidden') && manual && manual.value.trim()) {
        return manual.value.trim();
    }
    return select ? select.value : '';
}

// ========================================
// ANIMASI TYPING (SIMPLIFIED)
// ========================================
let lp_typingInterval = null;

function lp_animateTyping(text, elementId, elementIdMobile) {
    if (lp_typingInterval) {
        clearInterval(lp_typingInterval);
    }
    
    const preview = document.getElementById(elementId);
    const previewMobile = document.getElementById(elementIdMobile);
    
    let index = 0;
    let displayedText = '';
    
    if (preview) preview.innerHTML = '';
    if (previewMobile) previewMobile.innerHTML = '';
    
    const speed = 1;
    const chunkSize = 5;
    
    lp_typingInterval = setInterval(() => {
        if (index < text.length) {
            const end = Math.min(index + chunkSize, text.length);
            displayedText += text.slice(index, end);
            index = end;
            
            if (preview) {
                preview.innerHTML = displayedText.replace(/\n/g, '<br>');
                preview.scrollTop = preview.scrollHeight;
            }
            if (previewMobile) {
                previewMobile.innerHTML = displayedText.replace(/\n/g, '<br>');
                previewMobile.scrollTop = previewMobile.scrollHeight;
            }
        } else {
            clearInterval(lp_typingInterval);
            lp_typingInterval = null;
            lp_updateActionButtons(false);
            
            if (preview) preview.scrollTop = preview.scrollHeight;
            if (previewMobile) previewMobile.scrollTop = previewMobile.scrollHeight;
            
            // PANGGIL STATUS HANYA SAAT ANIMASI SELESAI
            lp_updatePromptStatus();
        }
    }, speed);
}

// ========================================
// GENERATE PROMPT
// ========================================
const lp_engineForm = document.getElementById('engineForm');
if (lp_engineForm) {
    lp_engineForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const loadingText = '<p class="loading-text">Sedang meracik prompt Anda...</p>';
        
        const preview = document.getElementById('promptPreview');
        const previewMobile = document.getElementById('promptPreviewMobile');
        
        if (preview) preview.innerHTML = loadingText;
        if (previewMobile) previewMobile.innerHTML = loadingText;
        
        lp_updateActionButtons(true);

        // ========================================
        // KUMPULKAN DATA DENGAN MAPPING
        // ========================================
        const frameworkRaw = getValue('framework', 'frameworkManual');
        const framework = frameworkMap[frameworkRaw] || frameworkRaw;

        const toneRaw = document.getElementById('tone').value;
        const tone = toneMap[toneRaw] || toneRaw;

        const productTypeRaw = getValue('productType', 'productTypeManual');
        const productType = productTypeMap[productTypeRaw] || productTypeRaw;

        const goalRaw = document.getElementById('goal').value;
        const goal = goalMap[goalRaw] || goalRaw;

        const awareness = document.getElementById('awareness').value;

        const audienceRaw = getValue('audience', 'audienceManual');
        const audience = audienceMap[audienceRaw] || audienceRaw;

        const painPoints = document.getElementById('painPoints').value;
        const productName = document.getElementById('productName').value;
        const priceNormal = document.getElementById('priceNormal').value;
        const pricePromo = document.getElementById('pricePromo').value;
        const description = document.getElementById('description').value;
        const objections = document.getElementById('objections').value;
        const haveBonus = document.getElementById('haveBonus').checked;
        const bonusDetail = document.getElementById('bonusDetail').value;
        const cta = getValue('cta', 'ctaManual');

        const scarcityRaw = document.getElementById('scarcity').value;
        const scarcityData = scarcityMap[scarcityRaw] || { label: scarcityRaw, desc: '' };

        const colorBrandRaw = getValue('colorBrand', 'colorBrandManual');
        const colorBrand = colorBrandMap[colorBrandRaw] || colorBrandRaw;

        const themeBg = document.getElementById('themeBg').value;
        const designStyle = document.getElementById('designStyle').value;

        const heroTypeRaw = document.getElementById('heroType').value;
        const heroType = heroTypeMap[heroTypeRaw] || heroTypeRaw;

        const stickyCta = document.getElementById('stickyCta').checked;
        const platform = (lp_selectedPlatform || '').toLowerCase();
        const layout = layoutMap[platform] || layoutMap['scalev'];

        let stickyCtaText = '';
        if (stickyCta) {
            stickyCtaText = 'WAJIB membuat tombol CTA Melayang (Sticky Bottom) yang hanya muncul di layar mobile agar mudah diakses saat scroll.';
        } else {
            stickyCtaText = 'Tidak perlu sticky button.';
        }

        // Build prompt
        const sectionNamesMap = {
            'Social Proof': 'Social Proof',
            'Testimonial': 'Testimonial',
            'FAQ': 'FAQ',
            'Bonus': 'Bonus',
            'Guarantee': 'Guarantee',
            'Scarcity': 'Scarcity',
            'Comparison': 'Comparison',
            'Pricing Table': 'Pricing Table',
            'Timeline': 'Timeline / Schedule',
            'Team': 'Team / Instructor'
        };

        const mappedSections = lp_selectedElements.length > 0 
            ? lp_selectedElements.map(el => sectionNamesMap[el] || el).join(', ') 
            : 'Default (tidak ada section tambahan)';

        let scarcityText = '';
        if (scarcityData.label === 'Tidak Ada') {
            scarcityText = 'Tidak Ada';
        } else {
            scarcityText = `Gunakan tipe kelangkaan "${scarcityData.label}". ${scarcityData.desc}`;
        }

        lp_currentPrompt = `ANDA ADALAH: Senior Conversion Copywriter + UI/UX minded marketer yang sudah menciptakan ratusan landing page yang mengkonversi untuk penjualan di social media.

TUGAS ANDA: Menulis Copywriting Landing Page (Sales Page) dengan struktur HTML yang rapi, persuasif, dan aman untuk kebijakan iklan (Meta/Google Ads Compliance).

ATURAN PENULISAN & LAYOUT (WAJIB DIPATUHI):
1. LAYOUT & GRID SYSTEM: STRUKTUR: ${layout.title}.
 ${layout.desc}
2. GLOBAL STYLE: Wajib set 'body { overflow-x: hidden; }' untuk mencegah scroll horizontal pada tampilan mobile. Pastikan wrapper/container utama tidak melebihi lebar layar (100vw).
3. FOOTER: DILARANG membuat section footer standar (Links/Menu/Sitemap) karena ini adalah Landing Page yang fokus penjualan. Cukup akhiri dengan Copyright notice kecil di bagian paling bawah atau padding kosong.
4. TEMA VISUAL: Tema warna harus disesuaikan sepenuhnya dengan gaya desain yang dipilih.
5. HERO TYPE: ${heroType}
6. STICKY CTA MOBILE: ${stickyCtaText}
7. BUTTON STYLING: Teks tombol WAJIB KONSISTEN (Jangan berubah warna saat hover/klik). DILARANG menggunakan underline pada teks tombol. Gunakan '!important' pada properti warna teks dan text-decoration untuk memaksa style ini.
8. SCARCITY LOGIC: ${scarcityText}
9. Skimming-friendly: Gunakan heading yang jelas dan bullet points.
10. Anti Overclaim: Jangan gunakan kata "pasti", "jamin", "100%", atau klaim medis/finansial yang tidak realistis agar aman dari banned iklan.
11. Penyesuaian Awareness: Tulis copywriting dengan level awareness "${awareness}".
12. Tone: Gunakan gaya bahasa "${tone}".
13. GAMBAR & ICON: Gunakan placeholder dari 'https://placehold.co/600x400' untuk gambar, dan SVG inline (Lucide/Heroicons) untuk icon.

PROFIL PRODUK & MARKET:
- Nama Produk: ${productName}
- Kategori: ${productType}
- Target Market: ${audience}
- Tujuan Utama: ${goal}
- Framework Utama: ${framework}

PSIKOLOGI AUDIENS (INPUT PENTING):
- Pain Points (Ketakutan Utama): ${painPoints || 'Tidak ditentukan'}
- Objection Handling (Alasan Ragu): ${objections || 'Tidak ditentukan'}

PENAWARAN (OFFER STACK):
- Harga Normal: ${priceNormal || 'Tidak ditentukan'}
- Harga Promo: ${pricePromo || 'Tidak ada promo'}
- Bonus / Value Stack: ${haveBonus ? bonusDetail : 'Tidak ada bonus tambahan.'} (Jika ada, buatkan tabel/list "Total Value" vs "Harga Hari Ini").
- CTA Utama: "${cta}"

STRUKTUR HALAMAN (PLATFORM: ${platformOutputMap[platform] || platform}):
1. HERO SECTION: Hook maut yang relevan dengan ${painPoints || 'masalah utama target market'}.
2. BODY CONTENT: Mengikuti alur framework ${framework}.
3. OBJECTION HANDLING BLOCK: Jawab keraguan "${objections || 'tidak ada'}" secara elegan. (Gunakan ini untuk section FAQ atau Reassurance).
4. ADDITIONAL SECTIONS: Wajib masukkan section tambahan berikut: ${mappedSections}.
5. TRUST ELEMENTS: Masukkan Social Proof dan Reassurance.
6. CONVERSION BLOCK: Kontras harga, bonus stack, dan urgensi (${scarcityData.label}).
7. HIDDEN CTA: Pastikan ada micro-copy trust di bawah tombol.

OUTPUT: Generate kode HTML utuh (single file) dengan Tailwind CSS, visual premium sesuai gaya "${designStyle}" dengan nuansa warna dominan "${colorBrand}", dan copywriting yang sangat persuasif namun aman secara regulasi.`;

        setTimeout(() => {
            lp_animateTyping(lp_currentPrompt, 'promptPreview', 'promptPreviewMobile');
            // HAPUS pemanggilan status di sini, biar ga muncul di awal
        }, 1500);

        if (window.innerWidth < 1024) {
            const mobilePreview = document.getElementById('promptPreviewMobile');
            if (mobilePreview) {
                mobilePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}