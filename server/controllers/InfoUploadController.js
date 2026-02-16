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
    
    if (accType === 'venue') {
      hours = req.body.hours;
      tables_number = req.body.tables;
      for (let i=1; i<=tables_number; i++) {
        tables_arr.push({'id': `${i}`, 'pic': null, 'active': false, 'auction': false});
      }
    };

    const tables = JSON.stringify(tables_arr);

    const result = await infoUpload(accType, email, hours, tables);
    console.log(result);
    res.status(200).send(result);

  } catch (err) {
    console.log(err);
    res.status(500).send('INFO CONTROLLER ERROR');
  }
};

export default handleInfoUpload