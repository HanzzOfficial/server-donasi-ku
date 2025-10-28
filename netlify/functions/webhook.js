// KODE ASLI (CommonJS)
const { getDeployStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Metode tidak diizinkan"
    };
  }
  
  try {
    // 1. Ambil data JSON dari Socialbuzz
    const body = JSON.parse(event.body);
    console.log("Webhook Diterima:", body);

    // 2. Format data donasi
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
      donations = donations.slice(-10);
    }
    
    // 7. Simpan kembali daftar baru ke database
    await store.setJSON("donations_list", donations);

    // 8. Kirim "OK" ke Socialbuzz
    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (error) {
    console.error("Error di webhook:", error);
    return {
      statusCode: 500,
      body: "Server Error"
    };
  }
};
