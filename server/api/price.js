import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

router.post("/pigu", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    const $ = cheerio.load(response.data);
    const productPriceExtracted = $("div.c-price.h-price--xx-large")
      .text()
      .match(/\d+/)[0];
    const priceNormalized = parseFloat(productPriceExtracted) / 100;

    const productNameExtracted = $("h1.c-product__name").text();

    res
      .status(200)
      .json({ price: priceNormalized, name: productNameExtracted });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error reading Pigu" });
  }
});

router.post("/varle", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    const $ = cheerio.load(response.data);
    const productPriceExtracted = $("span.price-value").attr("content");
    const priceNormalized = parseFloat(productPriceExtracted);

    const productNameExtracted = $(
      'div.for-desktop h2[itemprop="name"]'
    ).text();

    res
      .status(200)
      .json({ price: priceNormalized, name: productNameExtracted });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error reading Varle" });
  }
});

router.post("/skytech", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    const $ = cheerio.load(response.data);
    //const productPriceExtracted = $("div.LoyaltyPrice-price-3Bp span").text();
    const productPriceExtracted = $("span.num > span").text().split("€")[0];
    const priceNormalized = parseFloat(productPriceExtracted);

    const productNameExtracted = $("div.product-name > h1").text();

    res
      .status(200)
      .json({ price: priceNormalized, name: productNameExtracted });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error reading SkyTech" });
  }
});

export default router;
