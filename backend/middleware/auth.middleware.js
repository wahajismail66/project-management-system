import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import User from "../model/user.model.js";

const { JSON_SECRET } = config();

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, JSON_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(401).json({ message: "Unauthorized" })

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            error: error.message
        })
    }
}

export default authorize;