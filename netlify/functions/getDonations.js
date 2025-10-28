// KODE FINAL v7 (Perbaikan .getJSON)
// File: getDonations.js

import { getStore } from '@netlify/blobs';

export default async (request, context) => {
  try {
    const store = getStore("donasi_store"); 
    
    // DIUBAH: Bukan .getJSON(), tapi .get() dengan tipe json
    const donations = await store.get("donations_list", { type: "json" }) || [];

    // Kembalikan data (Status 200 OK)
    return Response.json({ donations: donations });
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    return Response.json({ donations: [], { status: 500 });
  }
};
