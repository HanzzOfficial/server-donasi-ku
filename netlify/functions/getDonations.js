// KODE FINAL v6 (Sintaks v7 yang Benar)
// File: getDonations.js

// Ini adalah cara import yang BENAR untuk library v7
import { getStore } from '@netlify/blobs';

export default async (request, context) => {
  try {
    // Kita panggil 'getStore' dengan NAMA database dari netlify.toml
    const store = getStore("donasi_store"); 
    
    // Ambil daftar donasi
    const donations = await store.getJSON("donations_list") || [];

    // Kembalikan data (Status 200 OK)
    return Response.json({ donations: donations });
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    // Jika ada error, kirim status 500
    return Response.json({ donations: [] }, { status: 500 });
  }
};
