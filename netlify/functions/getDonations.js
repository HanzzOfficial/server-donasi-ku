// KODE FINAL (CommonJS dengan Dynamic Import)
        
let store; // Cache

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }
  
  try {
    // Load store jika belum ada pakai import()
    if (!store) {
      const blobsModule = await import('@netlify/blobs');
      const getDeployStore = blobsModule.default; // Ambil dari 'default'
      store = getDeployStore({ context });
    }

    // Ambil data dari Socialbuzz
    const body = JSON.parse(event.body);
    console.log("Webhook Diterima:", body);

    // Format donasi
    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    // Ambil daftar donasi lama
    let donations = await store.getJSON("donations_list") || [];
    donations.push(newDonation);

    // Simpan 10 terakhir
    if (donations.length > 10) {
      donations = donations.slice(-10);
    }
    
    // Simpan kembali ke database
    await store.setJSON("donations_list", donations);

    // Kirim "OK" ke Socialbuzz
    return { statusCode: 200, body: "OK" };

  } catch (error) {
    console.error("Error di webhook:", error);
    return { statusCode: 500, body: "Server Error" };
  }
};
