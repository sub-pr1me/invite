import { NewDateUpload } from '../models/queries.js'
import type { Request, Response } from 'express'

export default async function handleNewDate(req: Request, res: Response) {

  const response = await NewDateUpload(
    req.body.venue,
    req.body.host,
    req.body.guest,
    req.body.new_date
  );
  res.status(200).send(response);
};