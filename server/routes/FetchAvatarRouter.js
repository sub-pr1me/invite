import Router from "express"
import handleFetchAvatar from "../controllers/FetchAvatarController.js"

const FetchAvatarRouter = Router();

FetchAvatarRouter.get('/', handleFetchAvatar);

export default FetchAvatarRouter;