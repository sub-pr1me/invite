import Router from "express";
import VenueController from "../controllers/VenueController.js";

const VenueInRouter = Router();

VenueInRouter.post("/", VenueController);

export default VenueInRouter;