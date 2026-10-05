import Router from "express"
import handleBalanceUpdate from "../controllers/BalanceUpdateController.js"

const BalanceUpdateRouter = Router();

BalanceUpdateRouter.post('/', handleBalanceUpdate);

export default BalanceUpdateRouter;