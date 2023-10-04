import pb from "../lib/pocketbase.js";
import { sendPriceChangeMail } from "./mailer.js";
import dotenv from "dotenv";
import path from "path";
import processPath from "process";

const envFilePath = path.resolve(processPath.cwd(), "..", "..", ".env");
dotenv.config({ path: envFilePath });

const checkItemPrices = async () => {
  // get all items
  const response = await pb.collection("items").getFullList();

  // authenticate as admin
  const token = await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL,
    process.env.PB_ADMIN_PASSWORD
  );

  // for each item -> check price and update
  response.forEach(async (item) => {
    try {
      // get new price
      const result = await fetchNewData(item);

      result.price = 10;

      // check whether price has decreased
      if (result.price < item.price) {
        await pb
          .collection("users")
          .getOne(item.user_id)
          .then((user) => user.email)
          .then((email) => sendPriceChangeMail(email, item, result.price));
      }

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
