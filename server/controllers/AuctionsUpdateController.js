import { FetchAuctions } from '../db/queries.js'

const handleAuctionsUpdate = async (req, res) => {
  try {
    const email = req.email;
    const result = await FetchAuctions(email);
    res.status(200).send(result);

    if (req.app.locals.broadcastAuctionsUpdated) console.log('TESTTTTTTTTTTTTTTT');
    
  } catch (err) {
    console.log(err);
    res.status(500).send('AUCTIONS UPDATE CONTROLLER ERROR');
  }
};

export default handleAuctionsUpdate