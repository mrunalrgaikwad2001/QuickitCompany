import express from "express";
import database from "../config/db.js";  // Ensure correct path
import dotenv from "dotenv";
import {authenticateUser} from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

router.post("/submit", authenticateUser, async (req, res) => {
    const { service, name, mobile, email, address, date, time } = req.body;

    if (!service || !name || !mobile || !address || !date || !time) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const result = await database.query(
            "INSERT INTO booking (service, name, mobile, email, address, date, time, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [service, name, mobile, email, address, date, time, req.user_id]
        );

        res.status(201).json({ message: "Booking successful!", booking: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error });
    }
});

router.get("/user-booking",authenticateUser,async(req,res)=>{
    try{
        const userId=req.user.id;
        const result=await database.query("SELECT * FROM booking WHERE user_id=$1",[req.user.id]);
        res.render("/booking",{booking:result.rows});
    }catch(error){
        console.error("error fetching booking:",error);
        res.status(500).send("Failed to fetch bookings");
    }
});

// WhatsApp Notification Function
const sendWhatsAppMessage = async (mobile, message) => {
    const apiKey = "YOUR_API_KEY"; // 🔹 Replace with your CallMeBot API Key
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${mobile}&text=${encodedMessage}&apikey=${apiKey}`;

    try {
        await axios.get(url);
        console.log("WhatsApp message sent!");
    } catch (error) {
        console.error("Failed to send WhatsApp message", error);
    }
};

// Email Notification Function
const sendEmail = async (email, name, service, date, time) => {
    if (!email) return; // Skip if email is not provided

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Booking Confirmation - Quickit Company",
        text: `Hello ${name},\n\nYour booking for ${service} on ${date} at ${time} is confirmed!\n\nThank you for choosing Quickit Company.\n\nBest Regards,\nQuickit Team Company`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

// 📌 Booking Route
router.post("/book", async (req, res) => {
    const { service, name, mobile, email, address, date, time } = req.body;

    try {
        // Insert booking into the database
        const result = await database.query(
            "INSERT INTO booking (service, name, mobile, email, address, date, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [service, name, mobile, email, address, date, time]
        );

        const message = `Hello ${name}, your booking for ${service} on ${date} at ${time} is confirmed.Our service provider will arrive at your location soon! - Quickit Company`;

        // Send WhatsApp notification
        await sendWhatsAppMessage(mobile, message);

        // Send email notification
        await sendEmail(email, name, service, date, time);

        res.json({ success: true, message: "Booking confirmed! Notifications sent via WhatsApp & Email." });
    } catch (error) {
        console.error("Booking failed:", error);
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});

export default router;

