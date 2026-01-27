import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, "Project Name is required"],
        trim: true,
    },
    deadline: {
        type: Date,
        required: [true, "Deadline is required"],
        validate: {
            validator: value => value > new Date(),
            message: "Deadline must be a future date"
        }
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    isActive: {
        type: Boolean,
        default: true,
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
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema);
export default Project;