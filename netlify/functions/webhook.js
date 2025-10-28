// KODE ASLI (dengan Database)
import { getDeployStore } from "@netlify/blobs";

export default async (request, context) => {
  // Hanya izinkan metode POST
  if (request.method !== "POST") {
    return new Response("Metode tidak diizinkan", { status: 405 });
  }
  
  try {
    // 1. Ambil data JSON dari Socialbuzz
    const body = await request.json();
    console.log("Webhook Diterima:", body);

    // 2. Format data donasi (Sesuaikan 'name', 'amount', 'message' jika perlu)
    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    // 3. Hubungkan ke database Netlify Blobs
    const store = getDeployStore({ context });

    // 4. Ambil daftar donasi yang ada
    let donations = await store.getJSON("donations_list") || [];

    // 5. Tambahkan donasi baru
    donations.push(newDonation);

    // 6. Batasi hanya 10 donasi terakhir
    if (donations.length > 10) {
      donations = donations.slice(-10); // Ambil 10 item terakhir
    }
    
    // 7. Simpan kembali daftar baru ke database
    await store.setJSON("donations_list", donations);

    // 8. Kirim "OK" ke Socialbuzz
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error di webhook:", error);
    return new Response("Server Error", { status: 500 });
  }
};
