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

    let body;
    try {
      // Coba parse body
      body = await request.json();
    } catch (e) {
      // Jika body kosong (tes dari Socialbuzz), buat data palsu
      console.log("Webhook Tes Kosong Diterima, membuat data palsu...");
      body = {
        id: "tes-" + new Date().getTime(),
        name: "Tester Socialbuzz",
        amount: 10000,
        message: "Ini tes notifikasi!"
      };
    }
    
    console.log("Webhook Diterima:", body);

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