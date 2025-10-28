// KODE FINAL (Namespace Import)
// File: webhook.js
        
import * as blobs from '@netlify/blobs'; // Import semua sebagai 'blobs'

export default async (request, context) => {
  // Hanya izinkan metode POST
  if (request.method !== "POST") {
    return new Response("Metode tidak diizinkan", { status: 405 });
  }
  
  try {
    // Panggil fungsinya DARI 'blobs'
    const store = blobs.getStore("donasi_store");

    // Robust body parsing: Socialbuzz may send JSON, form-urlencoded, or plain text.
    let body = {};
    try {
      const contentType = (request.headers && (request.headers.get ? request.headers.get('content-type') : request.headers['content-type'])) || '';

      if (contentType.includes('application/json')) {
        body = await request.json();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await request.text();
        const params = new URLSearchParams(text);
        body = Object.fromEntries(params.entries());
        // coerce numeric fields
        if (body.amount) body.amount = Number(body.amount);
      } else {
        // Try json first, then try to parse as urlencoded, else take raw text
        try {
          body = await request.json();
        } catch (e1) {
          const text = await request.text();
          if (!text) {
            // empty webhook (often used for testing) -> keep body empty so we can decide later
            body = {};
          } else {
            // attempt urlencoded parse
            const params = new URLSearchParams(text);
            const parsed = Object.fromEntries(params.entries());
            if (Object.keys(parsed).length) {
              body = parsed;
              if (body.amount) body.amount = Number(body.amount);
            } else {
              // fallback: plain text -> put into message
              body = { message: text };
            }
          }
        }
      }
    } catch (err) {
      console.warn('Gagal parse body webhook:', err);
      body = {};
    }

    console.log('Webhook Diterima:', body);

    // Format donasi
    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    // Ambil daftar donasi lama
    let donations = await store.getJSON("donations_list") || [];
    donations.push(newDonation);

    // Simpan 10 terakhir
    if (donations.length > 10) {
      donations = donations.slice(-10);
    }
    
    // Simpan kembali ke database
    await store.setJSON("donations_list", donations);

    // Kirim "OK" ke Socialbuzz
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error di webhook:", error);
    return new Response("Server Error", { status: 500 });
  }
};