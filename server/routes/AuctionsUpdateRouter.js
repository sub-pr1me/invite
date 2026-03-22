import Router from "express"
import { FetchAuctions } from '../db/queries.js'
// import handleAuctionsUpdate from "../controllers/AuctionsUpdateController.js"

export const AuctionsUpdateRouter = Router();

AuctionsUpdateRouter.post('/', async (req, res) => {
  
  try {
    const email = req.email;
    const result = await FetchAuctions(email);

    res.status(201).send(result);    
    
  } catch (err) {
    console.log(err);
    res.status(500).send('AUCTIONS UPDATE CONTROLLER ERROR');
  }
});