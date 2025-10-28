// KODE FINAL v6 (Sintaks v7 yang Benar)
// File: webhook.js
        
// Ini adalah cara import yang BENAR untuk library v7
import { getStore } from '@netlify/blobs';

// Ambil token rahasia kita dari Netlify Environment Variables
const MY_SECRET_TOKEN = process.env.MY_WEBHOOK_TOKEN;

export default async (request, context) => {
  // 1. Cek metode (harus POST)
  if (request.method !== "POST") {
    return new Response("Metode tidak diizinkan", { status: 405 });
  }

  // 2. CEK TOKEN KEAMANAN
  const providedToken = request.headers.get('authorization');
  if (!providedToken || providedToken !== MY_SECRET_TOKEN) {
    console.error("WEBHOOK DITOLAK: Token tidak valid.");
    return new Response("Token tidak valid", { status: 401 });
  }
  
  // 3. Jika lolos, jalankan kode donasi
  try {
    // Kita panggil 'getStore' dengan NAMA database
    const store = getStore("donasi_store");

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.log("Webhook Tes Kosong Diterima (Token OK), membuat data palsu...");
      body = {
        id: "tes-" + new Date().getTime(),
        name: "Tester Socialbuzz",
        amount: 10000,
        message: "Ini tes notifikasi!"
      };
    }
    
    console.log("Webhook Diterima (Token OK):", body);

    // Format donasi
    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    let donations = await store.getJSON("donations_list") || [];
    donations.push(newDonation);

    if (donations.length > 10) {
      donations = donations.slice(-10);
    }
    
    await store.setJSON("donations_list", donations);
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error di webhook (setelah cek token):", error);
    return new Response("Server Error", { status: 500 });
  }
};
