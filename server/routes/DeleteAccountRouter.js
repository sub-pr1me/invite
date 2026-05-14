import Router from "express"
import handleAccountRemoval from "../controllers/DeleteAccountController.js"

const DeleteAccountRouter = Router();

DeleteAccountRouter.post('/', handleAccountRemoval);

export default DeleteAccountRouter;