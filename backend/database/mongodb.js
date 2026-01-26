import mongoose from "mongoose";
import { config } from "../config/index.js";

const dbConnector = config().MONGO_URI;

if (!dbConnector) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

const connector = async () => {
    try {
        await mongoose.connect(dbConnector);
        console.log("MongoDB connected Successfully!!");
    } catch (error) {
        console.log("Error connecting to MongoDB", error.message);
        process.exit(1);
    }
}

export default connector;