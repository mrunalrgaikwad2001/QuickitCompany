import express from "express";

const router = express.Router();

// Predefined serviceable locations
const validLocations = [
    "Jule Solapur", "New RTO area", "Bombay park", "Saiful", "Nirmiti vihar",
    "Indira nagar", "Rajaswar Nagar", "Indradhanu", "Sun city", "Avanti nagar",
    "Vasant vihar", "Railway line", "Antrolikar nagar", "Aasra"
];

// Route to check service availability
router.get("/", (req, res) => {
    const location = req.query.location;

    if (validLocations.includes(location)) {
        res.json({ message:`Service is available at ${location}. `});
    } else {
        res.json({ message: "Sorry, service is not available at your location." });
    }
});

export default router;