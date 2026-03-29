import { BiddersUpdate } from '../db/queries.js'

const handleBiddersUpdate = async (req, res) => {
  try {
    const bidders = req.body.bidders;
    const venue_email = req.body.venue_email;
    const table = req.body.table;

    const result = await BiddersUpdate(bidders, venue_email, table);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('BIDDERS CONTROLLER ERROR');
  }
};

export default handleBiddersUpdate