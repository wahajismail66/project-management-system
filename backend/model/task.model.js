import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, "Task Name is required"],
        trim: true
    },
    deadline: {
        type: Date,
        required: [true, "Deadline is required"],
        validate: {
            validator: value => value > new Date(),
            message: "Deadline must be a future date"
        }
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    completedAt: {
        type: Date,
        default: null
    },
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema);
export default Task;