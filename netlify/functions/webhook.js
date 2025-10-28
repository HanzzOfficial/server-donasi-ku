// KODE FINAL (CommonJS dengan Dynamic Import)
        
let store; // Cache

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }
  
  try {
    // Load store jika belum ada pakai import()
    if (!store) {
      const { getDeployStore } = await import('@netlify/blobs');
      store = getDeployStore({ context });
    }

    const body = JSON.parse(event.body);
    console.log("Webhook Diterima:", body);

    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    let donations = await store.getJSON("donations_list") || [];
    donations.push(newDonation);

    if (donations.length > 10) {
      donations = donations.slice(-10);
    }
    
    await store.setJSON("donations_list", donations);

    return { statusCode: 200, body: "OK" };

  } catch (error) {
    console.error("Error di webhook:", error);
    return { statusCode: 500, body: "Server Error" };
  }
};
