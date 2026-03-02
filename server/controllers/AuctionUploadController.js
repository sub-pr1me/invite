import { auctionUpload } from '../db/queries.js'

export default async function handleAuctionUpload(req, res) {

  if (req.errorMessage) return res.status(422);

  const response = await auctionUpload(req.email, req.body.id, req.body.deposit, req.body.step);
  res.status(200).send(response);
};