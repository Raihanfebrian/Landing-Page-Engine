// ========================================
// WEBSITE ENGINE - website-engine.js
// ========================================

// ========================================
// STATE VARIABLES
// ========================================
let ws_currentPrompt = "";
let ws_selectedSections = ["Services", "Contact", "Footer"];
let ws_selectedElements = ["Floating WhatsApp Button"];
let ws_selectedPlatform = "Scalev";
let ws_selectedNavStyle = "Sticky";
let ws_activeSocials = {};
let ws_typingInterval = null;

// ========================================
// MANUAL INPUT HANDLER (GLOBAL)
// ========================================
function handleManualInput(selectElement, manualInputId) {
    const container = document.getElementById(manualInputId + 'Container');
    const manualInput = document.getElementById(manualInputId);
    
    if (!container) return;
    
    const selectedValue = selectElement.value.toLowerCase();
    
    const isManual = selectedValue.includes('manual') || 
                     selectedValue.includes('lainnya') ||
                     selectedValue.includes('custom');
    
    if (isManual) {
        container.classList.remove('hidden');
        if (manualInput) manualInput.focus();
    } else {
        container.classList.add('hidden');
        if (manualInput) manualInput.value = '';
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const isWebsitePage = document.getElementById('websiteForm');
    if (!isWebsitePage) return;

    ws_initDefaults();
    
    if (typeof loadTheme === 'function') {
        loadTheme();
    }
});

function ws_initDefaults() {
    ws_updateSectionsInput();
    ws_updateElementsInput();
    
    const navInput = document.getElementById('ws_navStyle');
    if (navInput) navInput.value = ws_selectedNavStyle;
}

// ========================================
// SOCIAL MEDIA TOGGLE
// ========================================
function toggleSocialOptions() {
    const panel = document.getElementById('socialOptionsPanel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function toggleSocialField(platform, isActive) {
    const container = document.getElementById('dynamicSocialFields');
    if (!container) return;

    const fieldId = `ws_${platform}_field`;
    const existingField = document.getElementById(fieldId);

    if (isActive && !existingField) {
        const fieldHTML = ws_createSocialFieldHTML(platform);
        container.insertAdjacentHTML('beforeend', fieldHTML);
        ws_activeSocials[platform] = true;
    } else if (!isActive && existingField) {
        existingField.remove();
        delete ws_activeSocials[platform];
    }
}

function ws_createSocialFieldHTML(platform) {
    const icons = {
        tiktok: { color: '#000000', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
        threads: { color: '#000000', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.088-1.146 3.396-1.17 1.166-.02 2.14.176 2.963.512l.007-.367c.018-.574.035-1.107-.053-1.617-.253-1.472-1.162-2.207-2.775-2.242-.986-.02-1.873.228-2.64.739l-.753-1.623c1.086-.69 2.388-1.048 3.87-1.065 1.854-.017 3.254.534 4.162 1.638.657.8 1.026 1.852 1.1 3.13.027.464.02.95-.004 1.44-.012.258-.025.52-.03.787.748.44 1.378.963 1.873 1.566.95 1.158 1.463 2.632 1.483 4.259.03 2.393-.87 4.48-2.606 6.056-1.814 1.647-4.32 2.504-7.45 2.545zm-.96-8.087c-.086 0-.172 0-.258.003-.698.027-1.285.208-1.697.522-.407.31-.614.72-.598 1.186.015.5.263.92.698 1.18.493.297 1.155.44 1.862.403.803-.044 1.447-.33 1.912-.85.37-.407.621-.937.755-1.58-.512-.262-1.222-.564-2.394-.564h-.28z"/></svg>' },
        linkedin: { color: '#0A66C2', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
        facebook: { color: '#1877F2', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
        x: { color: '#000000', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
        youtube: { color: '#FF0000', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' }
    };

    const icon = icons[platform] || { color: '#666', svg: '' };
    const label = platform.charAt(0).toUpperCase() + platform.slice(1);

    return `
        <div id="ws_${platform}_field" class="social-dynamic-field">
            <div class="social-icon" style="background: ${icon.color};">
                ${icon.svg}
            </div>
            <input type="url" id="ws_${platform}" class="form-input social-input" placeholder="Link ${label}">
            <button type="button" class="social-remove-btn" onclick="ws_removeSocialField('${platform}')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `;
}

function ws_removeSocialField(platform) {
    const field = document.getElementById(`ws_${platform}_field`);
    if (field) {
        field.remove();
        delete ws_activeSocials[platform];
    }

    const checkboxes = document.querySelectorAll('.social-option-item input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.getAttribute('onchange')?.includes(platform)) {
            cb.checked = false;
        }
    });
}

// ========================================
// NAVIGATION STYLE SELECTION
// ========================================
function selectNavStyle(element, value) {
    document.querySelectorAll('.nav-style-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    
    const navInput = document.getElementById('ws_navStyle');
    if (navInput) navInput.value = value;
    ws_selectedNavStyle = value;
}

// ========================================
// SECTION SELECTION (Multi-Select)
// ========================================
function toggleWsSection(element, value) {
    if (element.classList.contains('locked')) return;
    
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        if (!ws_selectedSections.includes(value)) {
            ws_selectedSections.push(value);
        }
    } else {
        ws_selectedSections = ws_selectedSections.filter(s => s !== value);
    }
    
    ws_updateSectionsInput();
}

function ws_updateSectionsInput() {
    const input = document.getElementById('ws_selectedSections');
    if (input) input.value = ws_selectedSections.join(', ');
}

// ========================================
// ELEMENT SELECTION (Multi-Select)
// ========================================
function toggleWsElement(element, value) {
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        if (!ws_selectedElements.includes(value)) {
            ws_selectedElements.push(value);
        }
    } else {
        ws_selectedElements = ws_selectedElements.filter(e => e !== value);
    }
    
    ws_updateElementsInput();
}

function ws_updateElementsInput() {
    const input = document.getElementById('ws_selectedElements');
    if (input) input.value = ws_selectedElements.join(', ');
}

// ========================================
// PLATFORM SELECTION
// ========================================
function ws_selectPlatform(element, value) {
    const isSelected = element.classList.contains('selected');

    document.querySelectorAll('.ws-platform-card').forEach(card => {
        card.classList.remove('selected');
    });

    if (!isSelected) {
        element.classList.add('selected');
        const platformInput = document.getElementById('ws_platform');
        if (platformInput) platformInput.value = value;
        ws_selectedPlatform = value;
    } else {
        const platformInput = document.getElementById('ws_platform');
        if (platformInput) platformInput.value = "";
        ws_selectedPlatform = "";
    }
}

// ========================================
// RESET FORM
// ========================================
function ws_resetForm() {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.add('active');
}

function closeResetModal() {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.remove('active');
}

function confirmReset() {
    closeResetModal();
    ws_executeReset();
}

function ws_executeReset() {
    const form = document.getElementById('websiteForm');
    if (form) form.reset();

    document.querySelectorAll('.manual-input-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    document.querySelectorAll('[id^="ws_"][id$="Manual"]').forEach(input => {
        input.value = '';
    });

    document.querySelectorAll('.ws-section-card:not(.locked)').forEach(card => {
        card.classList.remove('selected');
    });
    ws_selectedSections = ["Services", "Contact", "Footer"];
    document.querySelectorAll('.ws-section-card:not(.locked)').forEach(card => {
        const cardText = card.querySelector('span').textContent;
        if (ws_selectedSections.includes(cardText)) {
            card.classList.add('selected');
        }
    });
    ws_updateSectionsInput();

    document.querySelectorAll('.ws-element-card').forEach(card => {
        card.classList.remove('selected');
    });
    ws_selectedElements = ["Floating WhatsApp Button"];
    document.querySelectorAll('.ws-element-card').forEach(card => {
        if (ws_selectedElements.includes(card.querySelector('span').textContent)) {
            card.classList.add('selected');
        }
    });
    ws_updateElementsInput();

    document.querySelectorAll('.nav-style-card').forEach(card => {
        card.classList.remove('selected');
    });
    const stickyCard = document.querySelector('.nav-style-card');
    if (stickyCard) stickyCard.classList.add('selected');
    ws_selectedNavStyle = "Sticky";
    const navInput = document.getElementById('ws_navStyle');
    if (navInput) navInput.value = "Sticky";

    document.querySelectorAll('.ws-platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    const firstPlatform = document.querySelector('.ws-platform-card');
    if (firstPlatform) {
        firstPlatform.classList.add('selected');
        const platformInput = document.getElementById('ws_platform');
        if (platformInput) platformInput.value = 'Scalev';
        ws_selectedPlatform = 'Scalev';
    }

    const dynamicFields = document.getElementById('dynamicSocialFields');
    if (dynamicFields) dynamicFields.innerHTML = '';
    ws_activeSocials = {};
    
    const socialPanel = document.getElementById('socialOptionsPanel');
    if (socialPanel) socialPanel.classList.add('hidden');
    
    document.querySelectorAll('.social-option-item input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    ws_currentPrompt = "";
    ws_updatePreview();
    
    ws_updateActionButtons(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('resetModal');
    if (e.target === modal) {
        closeResetModal();
    }
});

// ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeResetModal();
    }
});

// ========================================
// UI HELPERS
// ========================================
function ws_updateActionButtons(disabled) {
    const btn = document.getElementById('ws_finalActionBtn');
    const btnMobile = document.getElementById('ws_finalActionBtnMobile');
    
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

function ws_updatePreview() {
    const preview = document.getElementById('ws_promptPreview');
    const previewMobile = document.getElementById('ws_promptPreviewMobile');
    
    const content = ws_currentPrompt 
        ? ws_currentPrompt.replace(/\n/g, '<br>')
        : '<p class="preview-placeholder">Prompt akan muncul di sini setelah Anda mengklik "Generate Prompt"...</p>';
    
    if (preview) preview.innerHTML = content;
    if (previewMobile) previewMobile.innerHTML = ws_currentPrompt 
        ? ws_currentPrompt.replace(/\n/g, '<br>')
        : '<p class="preview-placeholder">Prompt akan muncul di sini...</p>';
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function ws_showToast(message) {
    const existingToast = document.getElementById('ws_toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'ws_toast';
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ========================================
// COPY PROMPT
// ========================================
function ws_copyPrompt() {
    if (!ws_currentPrompt) return;
    navigator.clipboard.writeText(ws_currentPrompt).then(() => {
        ws_showToast('Prompt berhasil disalin!');
    });
}

// ========================================
// SEND TO AI
// ========================================
function ws_sendToAI() {
    if (!ws_currentPrompt) return;
    
    const encodedPrompt = encodeURIComponent(ws_currentPrompt);
    window.open(`https://chat.z.ai/?q=${encodedPrompt}`, '_blank');
}

// ========================================
// GET VALUE HELPERS
// ========================================
function ws_getValue(selectId, manualId) {
    const select = document.getElementById(selectId);
    const manual = document.getElementById(manualId);
    const container = document.getElementById(manualId + 'Container');
    
    if (container && !container.classList.contains('hidden') && manual && manual.value.trim()) {
        return manual.value.trim();
    }
    return select ? select.value : '';
}

function ws_getValueSafe(selectId, manualId) {
    const select = document.getElementById(selectId);
    const manual = document.getElementById(manualId);
    const container = document.getElementById(manualId + 'Container');
    
    if (container && !container.classList.contains('hidden') && manual && manual.value.trim()) {
        return manual.value.trim();
    }
    
    const value = select ? select.value : '';
    
    if (value.toLowerCase().includes('lainnya') || value.toLowerCase().includes('manual')) {
        return '';
    }
    
    return value;
}

// ========================================
// GET SOCIAL LINKS
// ========================================
function ws_getSocialLinks() {
    const order = ['Instagram', 'Facebook', 'TikTok', 'X', 'Threads', 'YouTube', 'LinkedIn', 'WhatsApp'];
    
    const labelMap = {
        'instagram': 'Instagram',
        'facebook': 'Facebook',
        'tiktok': 'TikTok',
        'x': 'X',
        'threads': 'Threads',
        'youtube': 'YouTube',
        'linkedin': 'LinkedIn',
        'whatsapp': 'WhatsApp'
    };
    
    const allSocials = {};
    
    const ig = document.getElementById('ws_instagram');
    const wa = document.getElementById('ws_whatsapp');
    
    if (ig && ig.value.trim()) allSocials['instagram'] = ig.value.trim();
    if (wa && wa.value.trim()) allSocials['whatsapp'] = wa.value.trim();
    
    Object.keys(ws_activeSocials).forEach(platform => {
        const input = document.getElementById(`ws_${platform}`);
        if (input && input.value.trim()) {
            allSocials[platform] = input.value.trim();
        }
    });
    
    const result = [];
    order.forEach(key => {
        const lowerKey = key.toLowerCase();
        if (allSocials[lowerKey]) {
            result.push(`${labelMap[lowerKey]}: ${allSocials[lowerKey]}`);
        }
    });
    
    return result.join(', ');
}

// ========================================
// ANIMASI TYPING DENGAN AUTO-SCROLL
// ========================================

function ws_animateTyping(text, elementId, elementIdMobile) {
    if (ws_typingInterval) {
        clearInterval(ws_typingInterval);
    }
    
    const preview = document.getElementById(elementId);
    const previewMobile = document.getElementById(elementIdMobile);
    
    let index = 0;
    let displayedText = '';
    
    if (preview) preview.innerHTML = '';
    if (previewMobile) previewMobile.innerHTML = '';
    
    const speed = 1;
    const chunkSize = 3;
    
    ws_typingInterval = setInterval(() => {
        if (index < text.length) {
            const end = Math.min(index + chunkSize, text.length);
            displayedText += text.slice(index, end);
            index = end;
            
            if (preview) {
                preview.innerHTML = displayedText.replace(/\n/g, '<br>');
                // AUTO-SCROLL KE BAWAH
                preview.scrollTop = preview.scrollHeight;
            }
            if (previewMobile) {
                previewMobile.innerHTML = displayedText.replace(/\n/g, '<br>');
                // AUTO-SCROLL KE BAWAH
                previewMobile.scrollTop = previewMobile.scrollHeight;
            }
        } else {
            clearInterval(ws_typingInterval);
            ws_typingInterval = null;
            ws_updateActionButtons(false);
            
            // SCROLL KE PALING BAWAH SAAT SELESAI
            if (preview) {
                preview.scrollTop = preview.scrollHeight;
            }
            if (previewMobile) {
                previewMobile.scrollTop = previewMobile.scrollHeight;
            }
        }
    }, speed);
}

// ========================================
// SORT ITEMS
// ========================================
function ws_sortItems(items, order) {
    const sorted = [];
    order.forEach(key => {
        if (items.includes(key)) {
            sorted.push(key);
        }
    });
    return sorted;
}

// ========================================
// GENERATE PROMPT - FORM SUBMIT
// ========================================
const ws_websiteForm = document.getElementById('websiteForm');
if (ws_websiteForm) {
    ws_websiteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const loadingText = '<p class="loading-text">Sedang meracik prompt Anda...</p>';
        
        const preview = document.getElementById('ws_promptPreview');
        const previewMobile = document.getElementById('ws_promptPreviewMobile');
        
        if (preview) preview.innerHTML = loadingText;
        if (previewMobile) previewMobile.innerHTML = loadingText;
        
        ws_updateActionButtons(true);

        const brandName = document.getElementById('ws_brandName')?.value || '';
        const siteType = ws_getValueSafe('ws_siteType', 'ws_siteTypeManual');
        const tagline = document.getElementById('ws_tagline')?.value || '';
        const seoKeywords = document.getElementById('ws_seoKeywords')?.value || '';
        const shortDesc = document.getElementById('ws_shortDesc')?.value || '';
        
        const clientProblem = document.getElementById('ws_clientProblem')?.value || '';
        const solution = document.getElementById('ws_solution')?.value || '';
        const heroStyle = document.getElementById('ws_heroStyle')?.value || '';
        const pageStructure = document.getElementById('ws_pageStructure')?.value || '';
        
        const targetAudience = ws_getValueSafe('ws_targetAudience', 'ws_targetAudienceManual');
        const toneVoice = ws_getValueSafe('ws_toneVoice', 'ws_toneVoiceManual') || 'Professional & Formal';
        
        const usp = document.getElementById('ws_usp')?.value || '';
        const estYear = document.getElementById('ws_estYear')?.value || '';
        const socialLinksStr = ws_getSocialLinks();
        
        const services = document.getElementById('ws_services')?.value || '';
        const contactInfo = document.getElementById('ws_contactInfo')?.value || '';
        const primaryCta = document.getElementById('ws_primaryCta')?.value || '';
        
        const colorBrand = ws_getValueSafe('ws_colorBrand', 'ws_colorBrandManual');
        const themeBg = document.getElementById('ws_themeBg')?.value || '';
        const designStyle = document.getElementById('ws_designStyle')?.value || '';

        const sectionOrder = ['Services', 'Contact', 'Footer', 'About', 'Features', 'Latest News / Blog', 'Testimonials'];
        const sortedSections = ws_sortItems(ws_selectedSections, sectionOrder);
        const sectionsStr = sortedSections.length > 0 ? sortedSections.join(', ') : 'Default';

        const elementOrder = ['Newsletter Form', 'Google Map Embed', 'Floating WhatsApp Button', 'Language Switcher (ID/EN)'];
        const sortedElements = ws_sortItems(ws_selectedElements, elementOrder);
        const elementsStr = sortedElements.length > 0 ? sortedElements.join(', ') : 'Standar';

        ws_currentPrompt = `ANDA ADALAH: Senior Web Designer & UI/UX Expert yang menguasai HTML, Tailwind CSS, dan prinsip modern design.

TUGAS ANDA: Membuat Website profesional (Company Profile/Portfolio) dengan struktur HTML semantik, responsif, dan mencerminkan kredibilitas brand.

ATURAN DESAIN & LAYOUT (WAJIB DIPATUHI):
1. LAYOUT & GRID: ${ws_selectedPlatform === 'Scalev' ? `STRUKTUR: FULL-WIDTH MOBILE-FIRST (Mutlak).
- Container: Gunakan class 'w-full'. JANGAN gunakan container dengan margin otomatis di kiri kanan.
- Layout: Single Column Only (1 Kolom). Jangan gunakan grid berdampingan.
- Behavior: Semua elemen vertikal.
- Alasan: Scalev adalah mobile-builder, layout desktop akan rusak jika ada margin.` : `STRUKTUR: FULLY RESPONSIVE STACKING.
- Desktop: Layout lebar dengan Container standar. Gunakan Grid System untuk layout hero, services, dll.
- Mobile: Stack vertikal (tumpuk ke bawah) dengan class responsif Tailwind (cth: grid-cols-1 md:grid-cols-3).`} (Gaya Hero: ${heroStyle})
2. GLOBAL STYLE: Wajib set 'body { overflow-x: hidden; }' untuk mencegah scroll horizontal pada tampilan mobile. Pastikan wrapper/container utama tidak melebihi lebar layar (100vw).
3. TEMA VISUAL: ${themeBg === 'Force Light Mode' ? 'Wajib Light Mode (Background terang, teks gelap).' : themeBg === 'Force Dark Mode' ? 'Wajib Dark Mode (Background gelap, teks terang).' : 'Sesuai gaya desain yang dipilih.'}
4. NAVIGASI: Navbar gaya "${ws_selectedNavStyle}". Pastikan UX intuitif.
5. BUTTON STYLING: Teks tombol WAJIB KONSISTEN (Jangan berubah warna saat hover/klik). DILARANG menggunakan underline pada teks tombol. Gunakan '!important' pada properti warna teks dan text-decoration untuk memaksa style ini.
6. STRUKTUR HALAMAN: ${pageStructure}. Jika Multi-page, buatkan menu navigasi dummy yang representatif.
7. SEO: Gunakan tag semantik (<header>, <main>, <section>, <footer>). Masukkan keyword "${seoKeywords || brandName}" di Meta Tags dan Heading utama.
8. ANTI-LOREM IPSUM: Dilarang menggunakan teks Lorem Ipsum pada headline utama. Gunakan teks dummy yang relevan berdasarkan Deskripsi Brand.
9. CSS VARIABLE: Definisikan warna utama brand di :root agar mudah diganti user.
10. GAMBAR: Gunakan placeholder 'https://placehold.co/600x400' atau 'https://placehold.co/1200x600' (Hero). Jangan biarkan src kosong.

BRIEF PROYEK:
- Nama Brand: ${brandName}
- Tagline: ${tagline || 'Tidak ada'}
- Tipe Website: ${siteType}
- Deskripsi: ${shortDesc || 'Tidak ada'}
- Masalah Klien: ${clientProblem || 'Tidak ditentukan'}
- Solusi Kami: ${solution || 'Tidak ditentukan'}
- Primary CTA: "${primaryCta}"
- Target Pengunjung: ${targetAudience}
- Tone of Voice: ${toneVoice}

KREDIBILITAS & ASET:
- USP: ${usp || 'Tidak ditentukan'}
- Tahun Berdiri: ${estYear || 'Tidak ditentukan'}
- Sosial Media: ${socialLinksStr || 'Tidak ada'}
- Layanan Utama: ${services || 'Tidak ditentukan'}
- Info Kontak: ${contactInfo || 'Tidak ditentukan'}

DESAIN:
- Gaya Desain: ${designStyle}
- Warna Brand: ${colorBrand}
- Platform Target: ${ws_selectedPlatform}

STRUKTUR SECTION: ${sectionsStr}
ELEMEN FUNGSIONAL TAMBAHAN: ${elementsStr}

OUTPUT: Generate kode HTML lengkap (single file) dengan Tailwind CSS. Pastikan desainnya profesional, clean, dan sesuai semua aturan di atas.`;

        setTimeout(() => {
            ws_animateTyping(ws_currentPrompt, 'ws_promptPreview', 'ws_promptPreviewMobile');
        }, 1500);

        if (window.innerWidth < 1024) {
            const mobilePreview = document.getElementById('ws_promptPreviewMobile');
            if (mobilePreview) {
                mobilePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}