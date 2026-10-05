import { BalanceUpdate } from '../models/queries.js'
import type { Request, Response } from 'express'

const handleBalanceUpdate = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const amount = req.body.amount;
    const acc_type = req.body.acc_type;
    const deposit = req.body.deposit;

    const result = await BalanceUpdate(email, amount, acc_type, deposit);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('DEPOSIT CONTROLLER ERROR');
  }
};

export default handleBalanceUpdate