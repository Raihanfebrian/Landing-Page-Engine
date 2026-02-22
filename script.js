document.getElementById('lpForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // 1. Tangkap Data
    const productName = document.getElementById('productName').value;
    const productDesc = document.getElementById('productDesc').value;
    const targetAudience = document.getElementById('targetAudience').value;
    const tone = document.getElementById('tone').value;
    const usp = document.getElementById('usp').value;
    const cta = document.getElementById('cta').value;

    // 2. Rangkai Prompt
    const finalPrompt = `
Bertindaklah sebagai seorang Expert Copywriter.

Buatkan struktur Landing Page untuk produk berikut:
- Nama Produk: ${productName}
- Deskripsi: ${productDesc}
- Target Audiens: ${targetAudience}
- Tone Bahasa: ${tone}
- USP: ${usp}
- CTA: ${cta}

Format Output:
1. Headline Utama
2. Sub-headline
3. Benefit (Bullet Points)
4. Social Proof
5. CTA

Gunakan bahasa Indonesia yang ${tone}.
    `.trim();

    // 3. Setup URL Target
    // Kita coba kirim prompt lewat parameter URL ( ?q=... )
    const encodedPrompt = encodeURIComponent(finalPrompt);
    
    // Ganti link ini sesuai format yang support (kalau ada)
    // Banyak AI pakai format ?q= atau ?prompt=
    const targetUrl = `https://chat.z.ai/?q=${encodedPrompt}`;

    // 4. Eksekusi Buka Tab Baru
    window.open(targetUrl, '_blank');
});
