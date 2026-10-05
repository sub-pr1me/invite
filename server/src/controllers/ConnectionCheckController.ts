import { checkConnection } from "../models/queries.js";
import type { Request, Response } from 'express'

const handleCheckConnection = async (_: Request, res: Response) => {
  try {
    const result = await checkConnection();

    return res.status(200).json({
    status: 'Connected!',
    venues: result
  });

  } catch (err) {
    console.log(err);
    res.status(500).send('CONNECTION CONTROLLER ERROR');
  };
};

export default handleCheckConnection