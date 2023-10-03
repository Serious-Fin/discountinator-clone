import cron from "node-cron";
import { checkItemPrices } from "../controllers/checkItemPrices.js";

cron.schedule("0 */8 * * *", async () => {
  try {
    await checkItemPrices();
    console.error("Price check completed successfully");
  } catch (error) {
    console.error("Error occured during price check:", error);
  }
});
