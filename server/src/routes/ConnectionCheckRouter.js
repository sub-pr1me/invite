import Router from "express"
import handleCheckConnection from "../controllers/ConnectionCheckController.js"

const ConnectionCheckRouter = Router();

ConnectionCheckRouter.get('/', handleCheckConnection);

export default ConnectionCheckRouter;