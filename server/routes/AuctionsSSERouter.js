import Router from "express"
import handleAuctionsSSE from "../controllers/AuctionsSSEController.js"

const AuctionsSSERouter = Router();

AuctionsSSERouter.get('/', handleAuctionsSSE);

export default AuctionsSSERouter;