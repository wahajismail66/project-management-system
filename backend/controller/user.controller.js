import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({ isDeleted: false }).select("-password");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: allUsers,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            isDeleted: false,
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, roles } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            roles,
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User created by Admin successfully",
            data: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email, password, roles } = req.body;

        const user = await User.findOne({
            _id: userId,
            isDeleted: false,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (
            !req.user.roles.includes("Admin") &&
            req.user._id.toString() !== userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this user",
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }


        if (roles && req.user.roles.includes("Admin")) {
            user.roles = roles;
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "User already deleted",
            });
        }

        if (!req.user.roles.includes("Admin")) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete users",
            });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        user.deletedBy = req.user._id;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const restoreUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user || !user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found or not deleted",
            });
        }

        if (!req.user.roles.includes("Admin")) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to restore user",
            });
        }

        user.isDeleted = false;
        user.deletedAt = null;
        user.deletedBy = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User restored successfully",
        });
    } catch (error) {
        next(error);
    }
};
