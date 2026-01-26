import mongoose from "mongoose";
import User from "../model/user.model.js";
import { config } from "../config/index.js";

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = config();

const assignAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const existingAdmin = await User.findOne({ roles: "Admin" });
        if (existingAdmin) {
            console.log("Admin already exists", existingAdmin.email);
            process.exit(0);
        }

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (!user) {
            user = await User.create({
                name: "Admin",
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                roles: "Admin",
            });
            console.log("Admin created successfully.", user.email);
        } else {
            user.roles = "Admin";
            await user.save();
            console.log("User found assigning Admin role", user.email);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

assignAdmin();
