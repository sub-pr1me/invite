import { FetchAuctions } from '../db/queries.js'

const handleAuctionsUpdate = async (req, res) => {
  try {
    const email = req.email;
    const auctions = req.body.auctions;

    if (!auctions) {
      const result = await FetchAuctions(email, auctions);
      res.status(200).send(result);
    }    
    
  } catch (err) {
    console.log(err);
    res.status(500).send('AUCTIONS UPDATE CONTROLLER ERROR');
  }
};

export default handleAuctionsUpdate