import { BiddersUpdate } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleBiddersUpdate = async (req: Request, res: Response) => {
  try {
    const bidders = req.body.bidders;
    const venue_email = req.body.venue_email;
    const table = req.body.table;

    const result = await BiddersUpdate(bidders, venue_email, table);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('BIDDERS CONTROLLER ERROR');
  }
};

export default handleBiddersUpdate