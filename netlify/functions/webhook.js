// KODE FINAL (CommonJS dengan Dynamic Import)
// File: webhook.js
        
let store;

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }
  
  try {
    if (!store) {
      const blobsModule = await import('@netlify/blobs');
      const getDeployStore = blobsModule.default;
      store = getDeployStore({ context });
    }

    let body;
    if (!event.body || event.body === "null") {
      console.log("Webhook Tes Kosong Diterima, membuat data palsu...");
      body = {
        id: "tes-" + new Date().getTime(),
        name: "Tester Socialbuzz",
        amount: 10000,
        message: "Ini tes notifikasi!"
      };
    } else {
      body = JSON.parse(event.body);
    }
    
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
