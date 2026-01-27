import Project from "../model/project.model.js";

export const createProject = async (req, res, next) => {
    try {
        const { projectName, deadline, assignedTo } = req.body;

        if (!projectName || !deadline || !assignedTo || assignedTo.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please fill the required fields and at least one employee should be assigned to a project."
            })
        }
        if (!req.user || !req.user.roles) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        if (!req.user.roles.includes("Admin")) {
            return res.status(403).json({
                success: false,
                message: "Only Admins can create projects."
            })
        }

        const project = await Project.create({
            projectName,
            deadline,
            assignedTo
        })

        res.status(201).json({
            success: true,
            message: "Project created successfully!!",
            data: project
        })

    } catch (error) {
        next(error);
    }
}

export const getAllProjects = async (req, res, next) => {
    try {
        let projects;

        if (req.user.roles.includes("Admin")) {
            projects = await Project.find({ isDeleted: false }).populate("tasks");
        } else {
            projects = await Project.find({
                isDeleted: false,
                assignedTo: req.user._id,
            })
        }

        res.status(200).json({
            success: true,
            message: "Projects fetched successfully!!",
            data: projects
        })
    } catch (error) {
        next(error);
    }
}

export const getProjectById = async (req, res, next) => {
    try {
        let project;

        if (req.user?.roles?.includes("Admin")) {
            project = await Project.findOne({
                _id: req.params.id,
                isDeleted: false
            }).populate("tasks");
        } else {
            project = await Project.findOne({
                _id: req.params.id,
                isDeleted: false,
                assignedTo: req.user.id
            });
        }

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you don't have access"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project fetched successfully!!!",
            data: project
        })
    } catch (error) {
        next(error);
    }
}

export const updateProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { projectName, deadline, assignedTo, isActive } = req.body;

        const project = await Project.findOne({
            _id: projectId,
            isDeleted: false
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }
        if (projectName) project.projectName = projectName;
        if (deadline) project.deadline = deadline;
        if (assignedTo) project.assignedTo = assignedTo;
        if (isActive !== undefined) {
            project.isActive = isActive;
        }

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        })

    } catch (error) {
        next(error);
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findOne({
            _id: projectId,
            isDeleted: false
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }
        project.isDeleted = true;
        project.deletedAt = new Date();
        project.deletedBy = req.user.id;

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project Deleted Successfully",
            data: project
        })
    } catch (error) {
        next(error)
    }
}

export const restoreProject = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await Project.findOne({
        _id: projectId,
        isDeleted: true
    })
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        })
    }
    if (!project.isDeleted) {
        return res.status(400).json({
            success: false,
            message: "Project is already active"
        });
    }

    project.isDeleted = false;
    project.deletedAt = null;
    project.deletedBy = null;

    await project.save();

    res.status(200).json({
        success: true,
        message: "Project restored successfully",
        data: project
    })
}