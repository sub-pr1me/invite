import { AddTable } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleTransformTable = async (
  req: Request & { email?: string }, 
  res: Response
) => {
  try {
    const email = req.email;
    if (!email) return res.sendStatus(401);
    const id = req.body.id;
    const active = req.body.active;
    const venue_id = req.body.venue_id

    const result = await AddTable(email, id, active, venue_id);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('ADD_TABLE CONTROLLER ERROR');
  }
};

export default handleTransformTable