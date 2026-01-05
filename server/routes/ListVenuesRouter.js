import Router from "express";
import listAllVenues from "../controllers/listAllVenues.js";

const ListVenuesRouter = Router();

ListVenuesRouter.get("/", (req, res) => {
    listAllVenues(req, res).then((venues) => {
        res.json(venues);
    });   
});

export default ListVenuesRouter;