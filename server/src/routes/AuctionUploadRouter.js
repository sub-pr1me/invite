import Router from "express"
import handleAuctionUpload from "../controllers/AuctionUploadController.js"


const AuctionUploadRouter = Router();

AuctionUploadRouter.post('/', handleAuctionUpload);

export default AuctionUploadRouter;