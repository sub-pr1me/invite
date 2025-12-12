import Router from "express";
import listAllVenues from "../controllers/listAllVenues.js";

const indexPage = Router();

indexPage.get("/", (req, res) => {
    listAllVenues(req, res).then((venues) => {
        res.json({venues});
    });   
});

export default indexPage;