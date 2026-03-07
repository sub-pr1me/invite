import { BalanceUpdate } from '../db/queries.js'

const handleBalanceUpdate = async (req, res) => {
  try {
    const email = req.email;
    const amount = req.body.amount;
    const acc_type = req.body.acc_type;

    const result = await BalanceUpdate(email, amount, acc_type);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('DEPOSIT CONTROLLER ERROR');
  }
};

export default handleBalanceUpdate