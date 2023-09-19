import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import pb from "./../lib/pocketbase.js";

const router = express.Router();

const secretKey = "my-secret-key";

router.post("/register", async (req, res) => {
  try {
    // do the registering
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // destrucy the body
    const { email, password } = req.body;

    // check if user by this email exist
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    if (pb.authStore.isValid) {
      res.status(200).json({ message: "CORRECT, YOU ARE LOGGED IN" });
    } else {
      res
        .status(401)
        .json({ message: `invalid :( you typed ${email} ${password}` });
    }

    // check if his password matches provided password
    // create a jwt token
    // return token to user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
