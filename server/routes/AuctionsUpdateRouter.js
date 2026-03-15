import Router from "express"
import handleAuctionsUpdate from "../controllers/AuctionsUpdateController.js"

const AuctionsUpdateRouter = Router();

AuctionsUpdateRouter.post('/', handleAuctionsUpdate);

export default AuctionsUpdateRouter;