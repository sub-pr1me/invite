import { FetchProfileData } from '../db/queries.js'

const handleFetchProfileData = async (req, res) => {
  try {
    const role = req.query.role;
    const id = req.query.id;

    const result = await FetchProfileData(role, id);
    result.role = role;
    delete result.credits;

    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH PROFILE DATA CONTROLLER ERROR');
  }
};

export default handleFetchProfileData