import Router from "express";
import CreateAccController from "../controllers/CreateAccController.js";
import { body } from 'express-validator'

const CreateAccRouter = Router();

CreateAccRouter.post(
  "/",
  body('name').notEmpty().isLength({ min: 6, max: 23 }),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isLength({ min: 6 }),
  CreateAccController);

export default CreateAccRouter;