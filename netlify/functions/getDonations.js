// KODE FINAL (ESM dengan getStore)
// File: getDonations.js

import { getStore } from '@netlify/blobs';

export default async (request, context) => {
  try {
    // Gunakan getStore, bukan getDeployStore
    const store = getStore({ context });
    
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
