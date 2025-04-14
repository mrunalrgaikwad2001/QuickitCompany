import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Received Token:",token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id:decoded.id};
        console.log("Decoded Token:",decoded);
       
        next();
    } catch (error) {
        return res.status(401).json({ message: "Please re-login to book the service" });
    }
};

export default authenticateUser;