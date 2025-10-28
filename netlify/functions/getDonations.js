// KODE FINAL v4 (Default Import)
// File: getDonations.js

import getStore from '@netlify/blobs'; // DIUBAH: Tidak ada kurung {}

export default async (request, context) => {
  try {
    // DIUBAH: Kita panggil 'getStore' dengan NAMA database dari netlify.toml
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
