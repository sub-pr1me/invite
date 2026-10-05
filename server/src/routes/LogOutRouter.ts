import Router from "express";
import handleLogOut from "../controllers/LogOutController.js";

const LogOutRouter = Router();

LogOutRouter.get("/", handleLogOut);

export default LogOutRouter;