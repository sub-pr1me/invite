import Router from "express";
import VenueController from "../controllers/VenueController.js";

const VenueRouter = Router();

VenueRouter.get("/", VenueController);

export default VenueRouter;