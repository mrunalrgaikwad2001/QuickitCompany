import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";
import database from "../config/db.js";

const router = express.Router();

router.get("/user", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await database.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

export default router;