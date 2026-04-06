import { AddTable } from '../db/queries.js'

const handleTransformTable = async (req, res) => {
  try {
    const email = req.email;
    const id = req.body.id;
    const active = req.body.active;
    const venue_id = req.body.venue_id

    const result = await AddTable(email, id, active, venue_id);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('ADD_TABLE CONTROLLER ERROR');
  }
};

export default handleTransformTable