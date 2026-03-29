import { auctionUpload } from '../db/queries.js'

export default async function handleAuctionUpload(req, res) {

  if (req.errorMessage) return res.status(422);

  const response = await auctionUpload(
    req.email, 
    parseInt(req.body.id), 
    parseInt(req.body.deposit), 
    parseInt(req.body.step),
    JSON.parse(req.body.bidders),
    JSON.parse(req.body.reg)
  );
  res.status(200).send(response);
};