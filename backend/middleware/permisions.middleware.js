export const allowedPermissions = (...allowedPermissions) => {
    return (req, res, next) => {
        const permissions = {
            Admin: ["manage_users", "manage_projects"],
            Manager: ["manage_tasks"],
            Employee: ["update_task_status"],
        }

        const userRole = req.user.roles;
        const userPermissions = permissions[userRole];

        const hasPermissions = allowedPermissions.every((perm) => userPermissions.includes(perm));

        if (!hasPermissions) {
            return res.status(403).json({
                success: false,
                message: "You dont have permission for this",
            })
        }
        next();
    }
}