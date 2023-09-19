import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import "dotenv/config";
import authRoutes from "./api/auth.js";

const app = express();

// set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*app.use(
  cookieSession({
    name: "augus-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true, // indicate that cookie is only to be sent via HTTP(S) and not client side JS
  })
);*/

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Initial setup looks good" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
