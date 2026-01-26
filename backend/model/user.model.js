import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User's Name is Required"],
        trim: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: [true, "User's email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please Enter the strong Password"],
        minLength: 7,
    },
    roles: {
        type: String,
        required: [true, "Please Select your role."],
        enum: ["Admin", "Manager", "Employee"],
        default: "Employee",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;