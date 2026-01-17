import Router from "express";
import listAllUsers from "../controllers/IndexPageController.js";

const IndexPageRouter = Router();

IndexPageRouter.get("/", listAllUsers);

export default IndexPageRouter;