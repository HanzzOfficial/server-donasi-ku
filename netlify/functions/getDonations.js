// KODE FINAL (CommonJS dengan Dynamic Import)
// File: getDonations.js

let store;

exports.handler = async (event, context) => {
  try {
    if (!store) {
      const blobsModule = await import('@netlify/blobs');
      const getDeployStore = blobsModule.default; 
      store = getDeployStore({ context });
    }
    
    const donations = await store.getJSON("donations_list") || [];

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
