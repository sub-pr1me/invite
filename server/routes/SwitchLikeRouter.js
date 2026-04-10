import Router from "express"
import handleSwitchLike from "../controllers/SwitchLikeController.js"

const SwitchLikeRouter = Router();

SwitchLikeRouter.post('/', handleSwitchLike);

export default SwitchLikeRouter;