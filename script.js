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

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Hanya jalan kalau di halaman landing-page
    const isLandingPage = document.getElementById('engineForm');
    if (!isLandingPage) return;

    // Init default platform
    lp_initPlatformDefault();
    
    // Pastikan theme sudah load (fallback kalau auth.js belum sempat)
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
// RESET FORM - LANDING PAGE
// ========================================
function resetForm() {
    if (!confirm("Yakin mau reset semua isian? Semua data yang sudah diisi akan hilang.")) return;

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
    
    lp_updateActionButtons(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
function copyPrompt() {
    if (!lp_currentPrompt) return;
    navigator.clipboard.writeText(lp_currentPrompt).then(() => {
        const desktopBtn = document.querySelector('.preview-section .btn-copy');
        if (desktopBtn) {
            const originalHTML = desktopBtn.innerHTML;
            desktopBtn.innerHTML = '<span style="color: #fff;">Tersalin!</span>';
            setTimeout(() => desktopBtn.innerHTML = originalHTML, 2000);
        }
        
        const mobileBtn = document.querySelector('.mobile-preview .btn-copy-sm');
        if (mobileBtn) {
            const originalHTML = mobileBtn.innerHTML;
            mobileBtn.innerHTML = '<span style="color: #fff;">Tersalin!</span>';
            setTimeout(() => mobileBtn.innerHTML = originalHTML, 2000);
        }
    });
}

// ========================================
// SEND TO AI
// ========================================
function sendToAI() {
    if (!lp_currentPrompt) return;
    navigator.clipboard.writeText(lp_currentPrompt).then(() => {
        window.open('https://chat.z.ai/', '_blank');
    });
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
// GENERATE PROMPT - FORM SUBMIT
// ========================================
const lp_engineForm = document.getElementById('engineForm');
if (lp_engineForm) {
    lp_engineForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const framework = getValue('framework', 'frameworkManual');
        const tone = document.getElementById('tone').value;
        const productType = getValue('productType', 'productTypeManual');
        const goal = document.getElementById('goal').value;
        const awareness = document.getElementById('awareness').value;
        const audience = getValue('audience', 'audienceManual');
        const painPoints = document.getElementById('painPoints').value;
        const productName = document.getElementById('productName').value;
        const priceNormal = document.getElementById('priceNormal').value;
        const pricePromo = document.getElementById('pricePromo').value;
        const description = document.getElementById('description').value;
        const objections = document.getElementById('objections').value;
        const haveBonus = document.getElementById('haveBonus').checked;
        const bonusDetail = document.getElementById('bonusDetail').value;
        const cta = getValue('cta', 'ctaManual');
        const scarcity = document.getElementById('scarcity').value;
        const colorBrand = getValue('colorBrand', 'colorBrandManual');
        const themeBg = document.getElementById('themeBg').value;
        const designStyle = document.getElementById('designStyle').value;
        const heroType = document.getElementById('heroType').value;
        const stickyCta = document.getElementById('stickyCta').checked;
        const platform = lp_selectedPlatform;

        lp_currentPrompt = `ANDA ADALAH: Senior Conversion Copywriter + UI/UX minded marketer yang sudah menciptakan ratusan landing page yang mengkonversi untuk penjualan di social media.

TUGAS ANDA: Menulis Copywriting Landing Page (Sales Page) dengan struktur HTML yang rapi, persuasif, dan aman untuk kebijakan iklan (Meta/Google Ads Compliance).

ATURAN PENULISAN & LAYOUT (WAJIB DIPATUHI):
1. LAYOUT & GRID SYSTEM: STRUKTUR: FULL-WIDTH MOBILE-FIRST (Mutlak).
- Container Utama: Gunakan class 'w-full' (Width 100%). JANGAN gunakan 'container' atau 'max-w-md'.
- Padding: Gunakan padding internal section (py-10 px-4), tapi container luar harus menempel ke tepi layar (edge-to-edge).
- Grid: DILARANG menggunakan grid multi-kolom (>1 kolom).
- Behavior: Semua elemen disusun vertikal (atas ke bawah).
- Alasan: Agar saat di-embed di platform ini tidak ada celah/garis vertikal di kiri-kanan (full screen experience).
2. GLOBAL STYLE: Wajib set 'body { overflow-x: hidden; }' untuk mencegah scroll horizontal pada tampilan mobile. Pastikan wrapper/container utama tidak melebihi lebar layar (100vw).
3. FOOTER: DILARANG membuat section footer standar (Links/Menu/Sitemap) karena ini adalah Landing Page yang fokus penjualan. Cukup akhiri dengan Copyright notice kecil di bagian paling bawah atau padding kosong.
4. TEMA VISUAL: Tema warna harus disesuaikan sepenuhnya dengan gaya desain "${designStyle}".
5. HERO TYPE: ${heroType}. HERO SECTION: Gunakan layout Hero standar (Gambar/Ilustrasi + Copy).
6. STICKY CTA MOBILE: ${stickyCta ? 'Aktifkan sticky button di bagian bawah layar mobile.' : 'Tidak perlu sticky button.'}
7. BUTTON STYLING: Teks tombol WAJIB KONSISTEN (Jangan berubah warna saat hover/klik). DILARANG menggunakan underline pada teks tombol. Gunakan '!important' pada properti warna teks dan text-decoration untuk memaksa style ini.
8. SCARCITY LOGIC: Gunakan tipe kelangkaan "${scarcity}". ${scarcity === 'Real Timer (Countdown)' ? 'Buatkan placeholder script JS countdown sederhana.' : scarcity === 'Quantity Left (Sisa Slot/Stok)' ? 'Tuliskan teks "Sisa Slot: X".' : ''}
9. Skimming-friendly: Gunakan heading yang jelas dan bullet points.
10. Anti Overclaim: Jangan gunakan kata "pasti", "jamin", "100%", atau klaim medis/finansial yang tidak realistis agar aman dari ban iklan.
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

STRUKTUR HALAMAN (PLATFORM: ${platform}):
1. HERO SECTION: Hook yang relevan dengan pain points utama. Gunakan pain points sebagai sudut pandang.
2. BODY CONTENT: Mengikuti alur framework ${framework}.
3. OBJECTION HANDLING BLOCK: Jawab keraguan "${objections || 'tidak ada'}" secara elegan.
4. ADDITIONAL SECTIONS: Wajib masukkan section tambahan berikut: ${lp_selectedElements.length > 0 ? lp_selectedElements.join(', ') : 'Default (tidak ada section tambahan)'}.
5. TRUST ELEMENTS: Masukkan Social Proof dan Reassurance.
6. CONVERSION BLOCK: Kontras harga, bonus stack, dan urgensi (${scarcity}).
7. HIDDEN CTA: Pastikan ada micro-copy trust di bawah tombol.

OUTPUT: Generate kode HTML utuh (single file) dengan Tailwind CSS, visual premium sesuai gaya "${designStyle}" dengan nuansa warna "${colorBrand}", dan copywriting yang sangat persuasif namun aman secara regulasi.`;

        lp_updatePreview();
        lp_updateActionButtons(false);

        if (window.innerWidth < 1024) {
            const mobilePreview = document.getElementById('promptPreviewMobile');
            if (mobilePreview) {
                mobilePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}