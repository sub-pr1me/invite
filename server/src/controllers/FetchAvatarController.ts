import { FetchAvatar } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleFetchAvatar = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.query;

    if (typeof email !== 'string' 
      || typeof role !== 'string') {
      res.sendStatus(400);
      return;
    };

    const result = await FetchAvatar(email, role);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH AVATAR CONTROLLER ERROR');
  };
};

export default handleFetchAvatar