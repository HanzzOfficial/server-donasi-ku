import { getDeployStore } from "@netlify/blobs";

export default async (request, context) => {
  try {
    const store = getDeployStore({ context });
    const donations = await store.getJSON("donations_list") || [];

    return Response.json({
      donations: donations
    });
    
  } catch (error) {
    console.error("Error mengambil donasi:", error);
    return Response.json({ donations: [] }, { status: 500 });
  }
};

export const config = {
  path: "/.netlify/functions/getDonations"
};
