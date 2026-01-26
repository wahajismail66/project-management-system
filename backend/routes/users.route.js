import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, restoreUser, updateUser } from "../controller/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { authorizedRoles } from "../middleware/roles.middleware.js";
import { allowedPermissions } from "../middleware/permisions.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, authorizedRoles("Admin"), allowedPermissions("manage_users"), getAllUsers);
userRouter.get("/:id", authorize, getUserById);
userRouter.post("/", authorize, authorizedRoles("Admin"), allowedPermissions("manage_users"), createUser);
userRouter.put("/:id", authorize, updateUser);
userRouter.delete("/:id", authorize, authorizedRoles("Admin"), allowedPermissions("manage_users"), deleteUser);
userRouter.patch("/:id/restore", authorize, authorizedRoles("Admin"), allowedPermissions("manage_users"), restoreUser)

export default userRouter;