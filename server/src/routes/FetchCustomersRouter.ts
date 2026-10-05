import Router from "express"
import handleFetchUsers from "../controllers/FetchUsersController.js"

const FetchCustomersRouter = Router();

FetchCustomersRouter.get('/', handleFetchUsers);

export default FetchCustomersRouter;