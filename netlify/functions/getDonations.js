// KODE FINAL (CommonJS dengan Dynamic Import)

// Kita buat 'store' di luar agar bisa di-cache
let store;

exports.handler = async (event, context) => {
  try {
    // Jika 'store' belum di-load, load sekarang pakai import()
    if (!store) {
      const blobsModule = await import('@netlify/blobs');
      const getDeployStore = blobsModule.default; // Ambil dari 'default'
      store = getDeployStore({ context });
    }
    
    // Ambil daftar donasi
    const donations = await store.getJSON("donations_list") || [];

    // Kembalikan data (Status 200 OK)
    return {
      statusCode: 200,
      body: JSON.stringify({ donations: donations })
    };
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    // Jika ada error, kirim status 500
    return {
      statusCode: 500,
      body: JSON.stringify({ donations: [] })
    };
  }
};
