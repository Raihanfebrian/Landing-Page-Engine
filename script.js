document.getElementById('lpForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman reload

    // 1. Tangkap semua data dari form
    const productName = document.getElementById('productName').value;
    const productDesc = document.getElementById('productDesc').value;
    const targetAudience = document.getElementById('targetAudience').value;
    const tone = document.getElementById('tone').value;
    const usp = document.getElementById('usp').value;
    const cta = document.getElementById('cta').value;

    // 2. Template Prompt (Otak dari Engine ini)
    // Ini adalah "formula rahasia" biar hasil AI bagus
    const finalPrompt = `
Bertindaklah sebagai seorang Expert Copywriter dan UI/UX Specialist.

Saya ingin kamu membuatkan script Landing Page yang menarik dan converting tinggi untuk produk berikut:

Detail Produk:
- Nama Produk: ${productName}
- Deskripsi: ${productDesc}
- Target Audiens: ${targetAudience}
- Tone Bahasa: ${tone}
- Unique Selling Point (USP): ${usp}
- Call to Action (CTA): ${cta}

Tolong buatkan output dalam format berikut:
1. **Headline Utama**: Harus punchy dan attention-grabbing.
2. **Sub-headline**: Penjelasan singkat value proposition.
3. **Manfaat Utama (Bullet Points)**: Jelaskan 3 manfaat paling kuat.
4. **Social Proof**: Buatkan contoh testimoni fiktif yang realistis.
5. **Penawaran & Urgency**: Buatkan kalimat urgency.
6. **Tombol CTA**: Tulis teks untuk tombol.

Pastikan bahasa yang digunakan benar-benar ${tone} dan menyentuh "pain point" dari ${targetAudience}.
    `.trim(); // .trim() buat hilangkan spasi berlebih di awal/akhir

    // 3. Salin prompt ke clipboard pengguna
    navigator.clipboard.writeText(finalPrompt).then(() => {
        
        // 4. Notifikasi & Redirect
        alert('✅ Prompt berhasil disalin!\n\nPaste (Ctrl+V) prompt tersebut di AI nanti.');

        // Pilihan Link AI (Ganti link ini sesuai kebutuhan)
        // ChatGPT: https://chat.openai.com/
        // Claude: https://claude.ai/new
        // Gemini: https://gemini.google.com/app
        const aiLink = "https://chat.openai.com/"; 

        // Buka tab baru ke AI
        window.open(aiLink, '_blank');

    }).catch(err => {
        alert('Gagal menyalin otomatis. Silakan salin manual prompt di console.');
        console.error('Error:', err);
        console.log(finalPrompt); // Fallback kalau auto copy gagal
    });
});
