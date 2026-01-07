import Router from "express";
import handleLogOut from "../controllers/logOutController.js";

const LogoutRouter = Router();

LogoutRouter.get("/", handleLogOut);

export default LogoutRouter;