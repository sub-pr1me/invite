import { DeleteAccount } from '../db/queries.js'

const handleAccountRemoval = async (req, res) => {
  try {
    
    const email = req.body.email;    
    const acc_type = req.body.acc_type;
    
    const response = await DeleteAccount(email, acc_type);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('ACCOUNT REMOVAL CONTROLLER ERROR');
  }
};

export default handleAccountRemoval