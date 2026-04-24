import Router from "express"
import handleNewDate from "../controllers/NewDateController.js"


const NewDateRouter = Router();

NewDateRouter.post('/', handleNewDate);

export default NewDateRouter;