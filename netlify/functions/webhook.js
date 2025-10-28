// KODE FINAL v7 (Perbaikan .getJSON)
// File: webhook.js
        
import { getStore } from '@netlify/blobs';

const MY_SECRET_TOKEN = process.env.MY_WEBHOOK_TOKEN;

export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Metode tidak diizinkan", { status: 405 });
  }

  const providedToken = request.headers.get('authorization');
  if (!providedToken || providedToken !== MY_SECRET_TOKEN) {
    console.error("WEBHOOK DITOLAK: Token tidak valid.");
    return new Response("Token tidak valid", { status: 401 });
  }
  
  try {
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

    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    // DIUBAH: Bukan .getJSON(), tapi .get() dengan tipe json
    let donations = await store.get("donations_list", { type: "json" }) || [];
    donations.push(newDonation);

    if (donations.length > 10) {
      donations = donations.slice(-10);
    }
    
    // .setJSON() sudah benar, biarkan saja
    await store.setJSON("donations_list", donations);
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error di webhook (setelah cek token):", error);
    return new Response("Server Error", { status: 500 });
  }
};
