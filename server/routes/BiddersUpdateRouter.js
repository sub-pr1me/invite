import Router from "express"
import handleBiddersUpdate from "../controllers/BiddersUpdateController.js"

const BiddersUpdateRouter = Router();

BiddersUpdateRouter.post('/', handleBiddersUpdate);

export default BiddersUpdateRouter;