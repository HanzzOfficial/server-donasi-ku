// KODE SANGAT SEDERHANA UNTUK TES (Tanpa Database)

export default async (request, context) => {
  
  console.log("Fungsi getDonations BERHASIL dipanggil!");

  // Kirim data donasi palsu untuk tes
  const fakeDonation = {
    id: 12345,
    name: "Donatur Tes",
    amount: 50000,
    message: "Ini tes! Jika muncul, berarti BERHASIL!"
  };

  // Kembalikan data palsu ini sebagai JSON
  return Response.json({
    donations: [fakeDonation]
  });
};

// Pastikan kode "export const config" SUDAH DIHAPUS
