import { auctionUpload } from '../models/queries.js';
export default async function handleAuctionUpload(req, res) {
    if (req.errorMessage)
        return res.status(422);
    if (!req.email)
        return res.sendStatus(401);
    const response = await auctionUpload(req.email, req.body.id, req.body.deposit, req.body.step, JSON.parse(req.body.bidders), JSON.parse(req.body.reg), req.body.venue_id);
    res.status(200).send(response);
}
;
