import Project from "../model/project.model.js";
import Task from "../model/task.model.js";

export const createTask = async (req, res, next) => {
    try {
        const { taskName, deadline, assignedTo, projectId } = req.body;

        if (!taskName || !deadline || !assignedTo || assignedTo.length === 0 || !projectId) {
            return res.status(400).json({
                success: false,
                message: "Please fill the required fields and at least one employee should be assigned to a task. Project ID is required."
            })
        }

        if (!req.user || !req.user.roles) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        if (!req.user.roles.includes("Admin") && !req.user.roles.includes("Manager")) {
            return res.status(403).json({
                success: false,
                message: "Only Admins and Managers can create tasks."
            })
        }


        const task = await Task.create({
            taskName,
            deadline,
            assignedTo,
            projectId
        })


        await Project.findByIdAndUpdate(projectId, {
            $push: { tasks: task._id }
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully!!",
            data: task
        })

    } catch (error) {
        next(error);
    }
}

export const getAllTasks = async (req, res, next) => {
    try {
        let tasks;

        if (req.user.roles.includes("Admin")) {
            tasks = await Task.find({ isDeleted: false })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        else if (req.user.roles.includes("Manager")) {
            const projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user.id
            });

            const projectIds = projects.map(p => p._id);

            tasks = await Task.find({
                isDeleted: false,
                projectId: { $in: projectIds }
            })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        else {
            tasks = await Task.find({
                isDeleted: false,
                assignedTo: req.user.id
            })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully!!",
            data: tasks
        });
    } catch (error) {
        next(error);
    }
}

export const getTaskById = async (req, res, next) => {
    try {
        let task;

        if (req.user.roles.includes("Admin")) {
            task = await Task.findOne({ isDeleted: false, _id: req.params.id })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        else if (req.user.roles.includes("Manager")) {
            const projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user.id
            });

            const projectIds = projects.map(p => p._id);

            task = await Task.findOne({
                _id: req.params.id,
                isDeleted: false,
                projectId: { $in: projectIds }
            })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        else {
            task = await Task.findOne({
                _id: req.params.id,
                isDeleted: false,
                assignedTo: req.user.id
            })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you don't have access"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task fetched successfully!!",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const { taskName, deadline, assignedTo, projectId, isActive } = req.body;

        if (deadline && new Date(deadline) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Deadline must be a future date"
            });
        }

        let task;

        if (req.user.roles.includes("Admin")) {
            task = await Task.findOne({ _id: taskId, isDeleted: false });
        }

        else if (req.user.roles.includes("Manager")) {
            const projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user.id
            });

            const projectIds = projects.map(p => p._id);

            task = await Task.findOne({
                _id: taskId,
                isDeleted: false,
                projectId: { $in: projectIds }
            });
        }

        else {
            return res.status(403).json({
                success: false,
                message: "Only Admins and Managers can update tasks."
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you don't have access."
            });
        }

        if (taskName) task.taskName = taskName;
        if (deadline) task.deadline = deadline;
        if (assignedTo) task.assignedTo = assignedTo;
        if (projectId && projectId !== task.projectId.toString()) {
            await Project.findByIdAndUpdate(task.projectId, {
                $pull: { tasks: task._id }
            });
            await Project.findByIdAndUpdate(projectId, {
                $push: { tasks: task._id }
            });
            task.projectId = projectId;
        }
        if (typeof isActive === "boolean") task.isActive = isActive;

        await task.save();
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });

    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        let task;

        if (req.user.roles.includes("Admin")) {
            task = await Task.findOne({ _id: taskId, isDeleted: false });
        }

        else if (req.user.roles.includes("Manager")) {
            const projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user.id
            });

            const projectIds = projects.map(p => p._id);

            task = await Task.findOne({
                _id: taskId,
                isDeleted: false,
                projectId: { $in: projectIds }
            });
        }

        else {
            return res.status(403).json({
                success: false,
                message: "Only Admins and Managers can delete tasks."
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you don't have access."
            });
        }

        task.isDeleted = true;
        task.deletedAt = new Date();
        task.deletedBy = req.user.id;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

export const restoreTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        let task;

        if (req.user.roles.includes("Admin")) {
            task = await Task.findOne({ _id: taskId, isDeleted: true });
        }

        else if (req.user.roles.includes("Manager")) {
            const projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user.id
            });

            const projectIds = projects.map(p => p._id);

            task = await Task.findOne({
                _id: taskId,
                isDeleted: true,
                projectId: { $in: projectIds }
            });
        }

        else {
            return res.status(403).json({
                success: false,
                message: "Only Admins and Managers can restore tasks."
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you don't have access."
            });
        }

        task.isDeleted = false;
        task.deletedAt = null;
        task.deletedBy = null;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task restored successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

export const completeTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findOne({
            _id: taskId,
            isDeleted: false
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (
            !req.user.roles.includes("Admin") &&
            !req.user.roles.includes("Manager") &&
            !task.assignedTo.some(id => id.toString() === req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this task"
            });
        }

        task.status = "completed";
        task.completedAt = new Date();
        task.completedBy = req.user.id;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task marked as completed",
            data: task
        });

    } catch (error) {
        next(error);
    }
};
