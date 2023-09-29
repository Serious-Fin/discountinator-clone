import pb from "../lib/pocketbase.js";

const checkItemPrices = async () => {
  // get all items
  const response = await pb.collection("items").getFullList();

  // for each item -> check price and update
  response.forEach(async (item) => {
    try {
      // get new price
      const result = await fetchNewData(item);

      // update data
      postNewData(item.id, result);
    } catch (error) {
      console.error("Error while auto-updating item info:", error);
    }
  });
};

const fetchNewData = async (item) => {
  const response = await fetch(
    `http://localhost:3001/api/price/` + item.site_name,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: item.site_link,
      }),
    }
  );
  const result = await response.json();
  return result;
};

const postNewData = async (item_id, data) => {
  const currentUtcTime = new Date().toUTCString();

  // update with new price
  await pb.collection("items").update(item_id, {
    name: data.name,
    price: data.price,
    last_check: currentUtcTime,
  });
};

export { checkItemPrices };
