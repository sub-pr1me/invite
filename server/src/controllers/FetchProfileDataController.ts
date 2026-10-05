import { FetchProfileData } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleFetchProfileData = async (req: Request, res: Response) => {
  try {
    const { role, id, from } = req.query;

    if (typeof role !== 'string' 
      || typeof id !== 'string' 
      || typeof from !== 'string') {
      res.sendStatus(400);
      return;
    };

    const result = await FetchProfileData(role, id, from);
    result.role = role;
    result.dates = result.dates[0];
    delete result.credits;

    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH PROFILE DATA CONTROLLER ERROR');
  }
};

export default handleFetchProfileData