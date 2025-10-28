// KODE ASLI (CommonJS)
const { getDeployStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  try {
    // 1. Hubungkan ke database
    const store = getDeployStore({ context });
    
    // 2. Ambil daftar donasi
    const donations = await store.getJSON("donations_list") || [];

    // 3. Kembalikan data sebagai JSON yang bisa dibaca Roblox
    return {
      statusCode: 200,
      body: JSON.stringify({ donations: donations })
    };
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ donations: [] })
    };
  }
};
