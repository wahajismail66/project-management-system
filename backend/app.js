import express from "express";
import { config } from "./config/index.js";
import cookieParser from "cookie-parser";
import connector from "./database/mongodb.js";
import authRouter from "./routes/auth.router.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/users.route.js";
import projectRouter from "./routes/projects.routes.js";
import taskRouter from "./routes/tasks.route.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Project Management System");
});

app.use(errorMiddleware);

const PORT = config().PORT;
app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`)
    console.log(`http://localhost:${PORT}`)
    await connector();
});

export default app;