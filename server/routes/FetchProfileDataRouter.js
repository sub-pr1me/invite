import Router from "express"
import handleFetchProfileData from "../controllers/FetchProfileDataController.js"

const FetchProfileDataRouter = Router();

FetchProfileDataRouter.get('/', handleFetchProfileData);

export default FetchProfileDataRouter;