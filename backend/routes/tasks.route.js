import { Router } from "express"
import authorize from "../middleware/auth.middleware.js";
import { authorizedRoles } from "../middleware/roles.middleware.js";
import { allowedPermissions } from "../middleware/permisions.middleware.js";
import { completeTask, createTask, deleteTask, getAllTasks, getTaskById, restoreTask, updateTask } from "../controller/task.controller.js";

const taskRouter = Router();

taskRouter.post("/", authorize, authorizedRoles("Admin", "Manager"), allowedPermissions("manage_projects", "manage_tasks"), createTask);
taskRouter.get("/", authorize, getAllTasks);
taskRouter.get("/:id", authorize, getTaskById);
taskRouter.put("/:id", authorize, authorizedRoles("Admin", "Manager"), allowedPermissions("manage_projects", "manage_tasks"), updateTask);
taskRouter.delete("/:id", authorize, authorizedRoles("Admin", "Manager"), allowedPermissions("manage_projects", "manage_tasks"), deleteTask);
taskRouter.patch("/:id/restore", authorize, authorizedRoles("Admin", "Manager"), allowedPermissions("manage_projects", "manage_tasks"), restoreTask);
taskRouter.patch("/:id/complete", authorize, completeTask);



export default taskRouter;