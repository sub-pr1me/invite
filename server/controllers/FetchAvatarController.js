import { FetchAvatar } from '../db/queries.js'

const handleFetchAvatar = async (req, res) => {
  try {
    const email = req.query.email;
    const role = req.query.role;

    const result = await FetchAvatar(email, role);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('SWITCH LIKE CONTROLLER ERROR');
  };
};

export default handleFetchAvatar