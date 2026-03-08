import { checkVenuesForMatch, checkCustomersForMatch, infoUpload } from '../db/queries.js'

const handleInfoUpload = async (req, res)=> {
  try {
    const email = req.email;
    const matchedVenues = await checkVenuesForMatch(email);
    const matchedCustomers = await checkCustomersForMatch(email);
    let accType = null;
    if (matchedVenues) {accType = 'venue'};
    if (matchedCustomers) {accType = 'customer'};

    let hours = null;
    let tables_arr= null;
    let dob = null;
    let gender = null;
    let interest = null;
    let stage = null;
    let endreg = null;
    
    if (accType === 'venue') {
      hours = req.body.hours;
      tables_arr = req.body.tables;
      stage = req.body.stage;
      endreg = req.body.endreg;
    };
    
    const tables = JSON.stringify(tables_arr);

    if (accType === 'customer') {
      dob = req.body.dob;
      gender = req.body.gender;
      interest = req.body.interest;
    };

    const result = await infoUpload(accType, email, hours, tables, stage, dob, gender, interest, endreg);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('INFO CONTROLLER ERROR');
  }
};

export default handleInfoUpload