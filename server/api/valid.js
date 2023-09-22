import express from "express";
const router = express.Router();

router.get("/validPage", (req, res) => {
  res.status(200).json({ message: "Route works" });
});

export default router;
