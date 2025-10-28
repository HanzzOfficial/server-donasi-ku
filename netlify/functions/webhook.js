// KODE SANGAT SEDERHANA UNTUK TES (Tanpa Database)

export default async (request, context) => {
  
  try {
    // Kita tetap coba baca data yang masuk
    const body = await request.json();
    console.log("--- Webhook Diterima (Tes Sederhana) ---");
    console.log(body);
  } catch (e) {
    console.error("Error membaca body webhook:", e);
  }

  // Langsung kirim "OK" ke Socialbuzz, tidak perlu disimpan
  return new Response("OK", { status: 200 });
};

// Pastikan kode "export const config" SUDAH DIHAPUS
