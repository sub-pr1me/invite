import { SwitchLike } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleSwitchLike = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const role = req.body.role;
    const likee_id = req.body.id;
    const name = req.body.name;
    const avatar = req.body.avatar;
    const liker_id = req.body.liker_id;

    const result = await SwitchLike(email, role, name, avatar, likee_id, liker_id);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('SWITCH LIKE CONTROLLER ERROR');
  };
};

export default handleSwitchLike