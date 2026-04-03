import Router from "express"
import handleTransformTable from "../controllers/TransformTableController.js"

const TransformTableRouter = Router();

TransformTableRouter.post('/', handleTransformTable);

export default TransformTableRouter;