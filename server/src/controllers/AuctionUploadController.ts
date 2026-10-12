import { auctionUpload } from '../models/queries.js'
import type { Request, Response } from 'express';

type UploadRequest = Request & {
  email?: string;
  errorMessage?: string;
};

export default async function handleAuctionUpload(req: UploadRequest, res: Response) {

  if (req.errorMessage) return res.status(422);
  if (!req.email) return res.sendStatus(401);

  const stepValue = req.body.step;
  if (typeof stepValue !== 'string' || stepValue.trim() === '') {
    return res.sendStatus(400);
  }

  const step = Number(stepValue);
  if (!Number.isFinite(step)) {
    return res.sendStatus(400);
  }
  
  const response = await auctionUpload(
    req.email,
    req.body.id, 
    req.body.deposit, 
    step,
    JSON.parse(req.body.bidders),
    JSON.parse(req.body.reg),
    req.body.venue_id
  );
  res.status(200).send(response);
};