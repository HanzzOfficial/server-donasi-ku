// KODE FINAL (Namespace Import + Perbaikan .get)
// File: getDonations.js

import * as blobs from '@netlify/blobs'; // Import semua sebagai 'blobs'

export default async (request, context) => {
  try {
    // Panggil fungsinya DARI 'blobs'
    // "donasi_store" adalah nama database kita dari file netlify.toml
    const store = blobs.getStore("donasi_store"); 
    
    // Ambil daftar donasi (menggunakan .get() BUKAN .getJSON())
    const donations = await store.get("donations_list", { type: "json" }) || [];

    // Kembalikan data (Status 200 OK)
    return Response.json({ donations: donations });
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    // Jika ada error, kirim status 500
    return Response.json({ donations: [] }, { status: 500 });
  }
};
