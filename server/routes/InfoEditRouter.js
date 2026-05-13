import Router from "express"
import handleInfoEdit from "../controllers/InfoEditController.js"

const InfoEditRouter = Router();

InfoEditRouter.post('/', handleInfoEdit);

export default InfoEditRouter;