import Router from "express";
import signInController from "../controllers/LogInController.js";

const LogInRouter = Router();

LogInRouter.post("/", signInController);

export default LogInRouter;