import { SwitchLike } from '../db/queries.js'

const handleSwitchLike = async (req, res) => {
  try {
    const email = req.body.email;
    const role = req.body.role;
    const id = req.body.id;

    const result = await SwitchLike(email, role, id);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('SWITCH LIKE CONTROLLER ERROR');
  };
};

export default handleSwitchLike