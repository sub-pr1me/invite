import { EditInfo } from '../db/queries.js'

const handleInfoEdit = async (req, res) => {
  try {
    
    const email = req.email;    
    const acc_type = req.body.acc_type

    const new_name = req.body.name;
    const new_email = req.body.email;
    const new_hours = req.body.hours;
    
    const response = await EditInfo(email, acc_type, new_name, new_email, new_hours);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('DEPOSIT CONTROLLER ERROR');
  }
};

export default handleInfoEdit