import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

router.get("/pigult", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pigu.lt/lt/garso-koloneles/jbl-flip-6-sviesiai-melyna?id=52995919&feat=home&navigation_source=interactionStudio"
    );

    const $ = cheerio.load(response.data);
    const productPriceExtracted = $(
      "div.c-price.h-price--xx-large.h-price--new"
    )
      .text()
      .match(/\d+/)[0];
    const priceNormalized = parseFloat(productPriceExtracted) / 100;

    res.status(200).json({ message: priceNormalized });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/varlelt", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.varle.lt/ausintuvai/ek-water-blocks-ek-vanduo-blocks-ek-vanduo-blocks--14299600.html"
    );

    const $ = cheerio.load(response.data);
    const productPriceExtracted = $("span.price-value").attr("content");
    const priceNormalized = parseFloat(productPriceExtracted);

    res.status(200).json({ message: priceNormalized });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
