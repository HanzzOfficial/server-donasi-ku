// KODE FINAL v5 (Namespace Import)
// File: getDonations.js

import * as blobs from '@netlify/blobs'; // DIUBAH: Import semua sebagai 'blobs'

export default async (request, context) => {
  try {
    // DIUBAH: Panggil fungsinya DARI 'blobs'
    const store = blobs.getStore("donasi_store"); 
    
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
