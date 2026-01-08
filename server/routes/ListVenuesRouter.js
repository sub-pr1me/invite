import Router from "express";
import listAllVenues from "../controllers/listAllVenues.js";

const ListVenuesRouter = Router();

ListVenuesRouter.get("/", listAllVenues);

export default ListVenuesRouter;