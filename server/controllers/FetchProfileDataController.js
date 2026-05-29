import { FetchProfileData } from '../db/queries.js'

const handleFetchProfileData = async (req, res) => {
  try {
    const role = req.query.role;
    const id = req.query.id;
    const from = req.query.from // string

    const result = await FetchProfileData(role, id, from);
    result.role = role;
    result.dates = result.dates[0];
    delete result.credits;

    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH PROFILE DATA CONTROLLER ERROR');
  }
};

export default handleFetchProfileData