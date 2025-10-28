const express = require("express");
const app = express();

app.use(express.json());

// Database sementara kita
let donationQueue = [];

// RUTE 1: UNTUK SOCIALBUZZ
app.post("/webhook", (request, response) => {
  let body;
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      console.log("Webhook Tes Kosong Diterima, membuat data palsu...");
      body = {
        id: "tes-" + new Date().getTime(),
        name: "Tester Socialbuzz",
        amount: 10000,
        message: "Ini tes notifikasi!"
      };
    } else {
      body = request.body;
    }
    
    console.log("Webhook Diterima:", body);

    const newDonation = {
      id: body.id || new Date().getTime(),
      name: body.name || "Donatur Anonim",
      amount: body.amount || 0,
      message: body.message || "Tanpa pesan"
    };

    donationQueue.push(newDonation);
    if (donationQueue.length > 10) {
      donationQueue.shift();
    }
    response.status(200).send("OK");

  } catch (error) {
    console.error("Error di webhook:", error);
    response.status(500).send("Server Error");
  }
});

// RUTE 2: UNTUK ROBLOX
app.get("/getDonations", (request, response) => {
  response.json({
    donations: donationQueue
  });
});

// RUTE 3: Homepage (Halaman HTML)
app.get("/", (request, response) => {
  // Kirim file index.html jika ada
  response.sendFile(__dirname + "/index.html");
});

// Menghidupkan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server perantara Anda sudah aktif di port ${PORT}`);
});
