import Router from "express";
import signInController from "../controllers/LogInController.js";
import { body } from 'express-validator'

const LogInRouter = Router();

LogInRouter.post(
  "/", 
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isLength({ min: 6 }),
  signInController);

export default LogInRouter;