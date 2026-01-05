import Router from "express";
import signInController from "../controllers/signInController.js";

const SignInRouter = Router();

SignInRouter.post("/", signInController);

export default SignInRouter;