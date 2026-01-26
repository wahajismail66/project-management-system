import dotenv from "dotenv";

dotenv.config();

export const config = () => {
    return ({
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        JSON_SECRET: process.env.JSON_SECRET,
        JSON_EXPIRES_IN: process.env.JSON_EXPIRES_IN,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    })
}