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
    let tables_number = null;
    let tables_arr = [];
    let dob = null;
    let gender = null;
    let interest = null;
    const maxTables = 20;
    
    if (accType === 'venue') {

      hours = req.body.hours;
      tables_number = req.body.tables;

      for (let i = 1; i <= tables_number; i++) { // add active tables
        tables_arr.push({'id': i, 'pic': null, 'active': true, 'auction': false});
      };

      for (let i = parseInt(tables_number)+1; i <= maxTables; i++) { // add inactive tables
        tables_arr.push({'id': i, 'pic': null, 'active': false, 'auction': false});
      };

    };
    const tables = JSON.stringify(tables_arr);

    if (accType === 'customer') {
      dob = req.body.dob;
      gender = req.body.gender;
      interest = req.body.interest;
    };

    const result = await infoUpload(accType, email, hours, tables, dob, gender, interest);
    console.log(result);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('INFO CONTROLLER ERROR');
  }
};

export default handleInfoUpload