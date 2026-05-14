import { EditInfo } from '../db/queries.js'

const handleInfoEdit = async (req, res) => {
  try {
    
    const email = req.body.old_email;    
    const acc_type = req.body.acc_type;

    const new_name = req.body.new_name;
    const new_email = req.body.new_email;
    const new_hours = req.body.hours;
    
    const response = await EditInfo(email, acc_type, new_name, new_email, new_hours);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('INFO EDIT CONTROLLER ERROR');
  }
};

export default handleInfoEdit