import { Router } from "express";
import { signIn, signOut, signup } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;