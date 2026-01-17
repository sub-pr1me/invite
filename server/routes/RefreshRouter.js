import Router from "express";
import handleRefreshToken from "../controllers/RefreshTokenController.js";

const RefreshRouter = Router();

RefreshRouter.get("/", handleRefreshToken);

export default RefreshRouter;