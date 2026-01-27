import { Router } from "express"
import authorize from "../middleware/auth.middleware.js";
import { authorizedRoles } from "../middleware/roles.middleware.js";
import { createProject, deleteProject, getAllProjects, getProjectById, restoreProject, updateProject } from "../controller/project.controller.js";
import { allowedPermissions } from "../middleware/permisions.middleware.js";

const projectRouter = Router();

projectRouter.post("/", authorize, authorizedRoles("Admin"), allowedPermissions("manage_projects"), createProject);
projectRouter.get("/", authorize, getAllProjects);
projectRouter.get("/:id", authorize, getProjectById);
projectRouter.put("/:id", authorize, authorizedRoles("Admin"), allowedPermissions("manage_projects"), updateProject);
projectRouter.delete("/:id", authorize, authorizedRoles("Admin"), allowedPermissions("manage_projects"), deleteProject);
projectRouter.patch("/:id/restore", authorize, authorizedRoles("Admin"), allowedPermissions("manage_projects"), restoreProject);



export default projectRouter;