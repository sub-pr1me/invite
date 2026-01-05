import Router from "express";
import SignInController from "../controllers/SignInController.js";

const SignInRouter = Router();

SignInRouter.post("/", SignInController);

export default SignInRouter;