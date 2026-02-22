// ========================================
// STATE VARIABLES
// ========================================
let currentPrompt = "";
let selectedPlatform = "Scalev";
let selectedElements = [];
let isDarkMode = true;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    updateThemeIcons();
});

// ========================================
// THEME TOGGLE
// ========================================
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
}

function updateThemeIcons() {
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    if (isDarkMode) {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    } else {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    }
}

// ========================================
// NAVIGATION
// ========================================
function goBack() {
    if (confirm('Kembali ke halaman sebelumnya?')) {
        window.history.back();
    }
}

function exitApp() {
    if (confirm('Yakin ingin keluar dari aplikasi?')) {
        window.close();
        window.location.href = 'about:blank';
    }
}

// ========================================
// BONUS TOGGLE
// ========================================
function toggleBonus() {
    const checkBox = document.getElementById('haveBonus');
    const field = document.getElementById('bonusField');
    if (checkBox.checked) {
        field.classList.remove('hidden');
    } else {
        field.classList.add('hidden');
    }
}

// ========================================
// MANUAL INPUT HANDLER
// ========================================
function handleManualInput(selectElement, manualInputId) {
    const container = document.getElementById(manualInputId + 'Container');
    const selectedValue = selectElement.value;
    
    const isManual = selectedValue.toLowerCase().includes('manual') || 
                     selectedValue.toLowerCase().includes('lainnya') ||
                     selectedValue.toLowerCase().includes('custom') ||
                     selectedValue === 'Isi Manual...';
    
    if (container) {
        if (isManual) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
            const manualInput = document.getElementById(manualInputId);
            if (manualInput) {
                manualInput.value = '';
            }
        }
    }
}

// ========================================
// PLATFORM SELECTION
// ========================================
function selectPlatform(element, value) {
    document.querySelectorAll('.platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    document.getElementById('platform').value = value;
    selectedPlatform = value;
}

// ========================================
// ELEMENT SELECTION (TOGGLE CARDS)
// ========================================
function toggleElement(element, value) {
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        if (!selectedElements.includes(value)) {
            selectedElements.push(value);
        }
    } else {
        selectedElements = selectedElements.filter(el => el !== value);
    }
    
    document.getElementById('selectedElements').value = selectedElements.join(', ');
}

// ========================================
// RESET FORM
// ========================================
function resetForm() {
    document.getElementById('engineForm').reset();
    document.getElementById('bonusField').classList.add('hidden');
    
    // Hide all manual input containers
    document.querySelectorAll('.manual-input-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // Clear all manual input values
    document.querySelectorAll('[id$="Manual"]').forEach(input => {
        input.value = '';
    });
    
    // Reset element cards
    document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedElements = [];
    
    currentPrompt = "";
    updatePreview();
    
    // Reset buttons
    const btn = document.getElementById('finalActionBtn');
    const btnMobile = document.getElementById('finalActionBtnMobile');
    
    btn.disabled = true;
    btn.style.background = '#4b5563';
    btn.style.cursor = 'not-allowed';
    btn.style.opacity = '0.7';
    
    btnMobile.disabled = true;
    btnMobile.style.background = '#4b5563';
    btnMobile.style.cursor = 'not-allowed';
    btnMobile.style.opacity = '0.7';
    
    // Reset platform selection to Scalev
    document.querySelectorAll('.platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectPlatform(document.querySelector('.platform-card'), 'Scalev');
}

// ========================================
// COPY PROMPT
// ========================================
function copyPrompt() {
    if (!currentPrompt) return;
    navigator.clipboard.writeText(currentPrompt).then(() => {
        const desktopBtn = document.querySelector('.preview-section .btn-copy');
        if (desktopBtn) {
            const originalHTML = desktopBtn.innerHTML;
            desktopBtn.innerHTML = '<span style="color: #3b82f6;">Tersalin!</span>';
            setTimeout(() => {
                desktopBtn.innerHTML = originalHTML;
            }, 2000);
        }
        
        const mobileBtn = document.querySelector('.mobile-preview .btn-copy-sm');
        if (mobileBtn) {
            const originalHTML = mobileBtn.innerHTML;
            mobileBtn.innerHTML = '<span style="color: #3b82f6;">Tersalin!</span>';
            setTimeout(() => {
                mobileBtn.innerHTML = originalHTML;
            }, 2000);
        }
    });
}

// ========================================
// SEND TO AI
// ========================================
function sendToAI() {
    if (!currentPrompt) return;
    navigator.clipboard.writeText(currentPrompt).then(() => {
        window.open('https://chat.z.ai/', '_blank');
    });
}

// ========================================
// UPDATE PREVIEW
// ========================================
function updatePreview() {
    const preview = document.getElementById('promptPreview');
    const previewMobile = document.getElementById('promptPreviewMobile');
    
    if (currentPrompt) {
        preview.innerHTML = currentPrompt.replace(/\n/g, '<br>');
        previewMobile.innerHTML = currentPrompt.replace(/\n/g, '<br>');
    } else {
        preview.innerHTML = '<p class="preview-placeholder">Prompt akan muncul di sini setelah Anda mengklik "Generate Prompt"...</p>';
        previewMobile.innerHTML = '<p class="preview-placeholder">Prompt akan muncul di sini...</p>';
    }
}

// ========================================
// GET VALUE (Handles manual inputs)
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
// GENERATE PROMPT
// ========================================
document.getElementById('engineForm').addEventListener('submit', function(e) {
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
    const platform = document.getElementById('platform').value;

    currentPrompt = `ANDA ADALAH: Senior Conversion Copywriter + UI/UX minded marketer yang sudah menciptakan ratusan landing page yang mengkonversi untuk penjualan di social media.

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

STRUKTUR HALAMAN (PLATFORM: ${platform}):
1. HERO SECTION: Hook yang relevan dengan pain points utama. Gunakan pain points sebagai sudut pandang.
2. BODY CONTENT: Mengikuti alur framework ${framework}.
3. OBJECTION HANDLING BLOCK: Jawab keraguan "${objections || 'tidak ada'}" secara elegan.
4. ADDITIONAL SECTIONS: Wajib masukkan section tambahan berikut: ${selectedElements.length > 0 ? selectedElements.join(', ') : 'Default (tidak ada section tambahan)'}.
5. TRUST ELEMENTS: Masukkan Social Proof dan Reassurance.
6. CONVERSION BLOCK: Kontras harga, bonus stack, dan urgensi (${scarcity}).
7. HIDDEN CTA: Pastikan ada micro-copy trust di bawah tombol.

OUTPUT: Generate kode HTML utuh (single file) dengan Tailwind CSS, visual premium sesuai gaya "${designStyle}" dengan nuansa warna "${colorBrand}", dan copywriting yang sangat persuasif namun aman secara regulasi.`;

    updatePreview();

    const btn = document.getElementById('finalActionBtn');
    const btnMobile = document.getElementById('finalActionBtnMobile');
    
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    btn.style.cursor = 'pointer';
    btn.style.opacity = '1';
    
    btnMobile.disabled = false;
    btnMobile.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    btnMobile.style.cursor = 'pointer';
    btnMobile.style.opacity = '1';

    if (window.innerWidth < 1024) {
        document.getElementById('promptPreviewMobile').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
});
