import { BalanceUpdate } from '../db/queries.js'

const handleBalanceUpdate = async (req, res) => {
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