import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

router.post("/pigult", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

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

router.post("/varlelt", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    const $ = cheerio.load(response.data);
    const productPriceExtracted = $("span.price-value").attr("content");
    const priceNormalized = parseFloat(productPriceExtracted);

    res.status(200).json({ message: priceNormalized });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/skytech", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    const $ = cheerio.load(response.data);
    //const productPriceExtracted = $("div.LoyaltyPrice-price-3Bp span").text();
    const productPriceExtracted = $("span.num > span").text().split("€")[0];
    const priceNormalized = parseFloat(productPriceExtracted);

    res.status(200).json({ message: priceNormalized });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
