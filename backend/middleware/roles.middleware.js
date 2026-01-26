export const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roles)) {
            return res.status(403).json({
                success: false,
                message: "Role Access Denied."
            });
        }
        next();
    }
}