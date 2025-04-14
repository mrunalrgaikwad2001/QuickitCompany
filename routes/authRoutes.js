import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import database from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    console.log("Signup request received:", req.body); // Debugging

    if (!name || !password || (!email && !mobile)) {
      return res.status(400).json({ message: "Email or Mobile required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await database.query(
      "INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, mobile",
      [name, email, mobile, hashedPassword]
    );

    console.log("User inserted:", result.rows[0]); // Debugging
    console.log("JWT_SECRET:",process.env.JWT_SECRET);

    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: result.rows[0] });
    console.log("Token sent sucessfully:",token);

  } catch (error) {
    console.error("Signup failed:", error.message);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log("Login request received:", req.body); // Debugging

    const result = await database.query(
      "SELECT * FROM users WHERE email = $1 OR mobile = $2",
      [identifier,identifier]
    );

    console.log("Query result:", result.rows); // Debugging

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debugging

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful:", user); // Debugging
    res.json({ token, user });
    console.log("Token sent sucessfully:",token);

  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;