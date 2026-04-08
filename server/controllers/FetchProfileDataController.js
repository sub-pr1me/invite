import { FetchProfileData } from '../db/queries.js'

const handleFetchProfileData = async (req, res) => {
  try {
    const role = req.query.role;
    const id = req.query.id;

    const result = await FetchProfileData(role, id);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH PROFILE DATA CONTROLLER ERROR');
  }
};

export default handleFetchProfileData