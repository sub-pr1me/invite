import Router from "express";
import getUserData from "../controllers/DashboardController.js";

const DashboardRouter = Router();

DashboardRouter.get("/", getUserData);

export default DashboardRouter;