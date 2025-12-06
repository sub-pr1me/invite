import Router from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { createEngine } from 'express-react-views';

import listAllVenues from "../controllers/listAllVenues.js";

const indexPage = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
indexPage.set('views', __dirname + '/../views');
indexPage.set('view engine', 'jsx');
indexPage.engine('jsx', createEngine());

indexPage.get("/", (req, res) => {
    listAllVenues(req, res).then((results) => {
        res.render("index", {venues: results});        
    });   
});

export default indexPage;