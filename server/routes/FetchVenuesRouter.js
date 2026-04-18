import Router from "express"
import handleFetchUsers from "../controllers/FetchUsersController.js"

const FetchVenuesRouter = Router();

FetchVenuesRouter.get('/', handleFetchUsers);

export default FetchVenuesRouter;