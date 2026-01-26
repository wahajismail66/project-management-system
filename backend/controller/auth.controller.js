import mongoose from "mongoose";
import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

const { JSON_SECRET, JSON_EXPIRES_IN } = config();

export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        //Check if the user Exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("This user already exists")
            error.statusCode = 409;
            throw error;
        }

        //If user Dont Exists create the user and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create(
            [{ name, email, password: hashedPassword, roles: "Employee" }],
            { session }
        );
        const token = jwt.sign({ userId: newUsers[0]._id }, JSON_SECRET, {
            expiresIn: JSON_EXPIRES_IN,
        })

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            data: {
                token: token,
                user: newUsers[0]
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JSON_SECRET, {
            expiresIn: JSON_EXPIRES_IN,
        });

        res.status(200).json({
            success: true,
            message: "User logged in Successfully",
            data: {
                token: token,
                user: user,
            }
        })

    } catch (error) {
        next(error);
    }
}
export const signOut = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};