import { getDeployStore } from "@netlify/blobs";

export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Metode tidak diizinkan", { status: 405 });
  }
  
  try {
    const body = await request.json();
    console.log("Webhook Diterima:", body);

    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    const store = getDeployStore({ context });
    let donations = await store.getJSON("donations_list") || [];
    donations.push(newDonation);

    if (donations.length > 10) {
      donations = donations.slice(-10); 
    }
    
    await store.setJSON("donations_list", donations);
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error di webhook:", error);
    return new Response("Server Error", { status: 500 });
  }
};

export const config = {
  path: "/.netlify/functions/webhook"
};
