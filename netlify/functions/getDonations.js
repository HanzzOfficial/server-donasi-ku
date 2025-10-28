// KODE ASLI (dengan Database)
import { getDeployStore } from "@netlify/blobs";

export default async (request, context) => {
  try {
    // 1. Hubungkan ke database
    const store = getDeployStore({ context });
    
    // 2. Ambil daftar donasi
    const donations = await store.getJSON("donations_list") || [];

    // 3. Kembalikan data sebagai JSON yang bisa dibaca Roblox
    return Response.json({
      donations: donations
    });
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    return Response.json({ donations: [] }, { status: 500 });
  }
};
