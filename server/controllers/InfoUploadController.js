import { type } from 'os';
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
    let dob = null;
    let gender = null;
    let interest = null;
    let stage = null;
    let endreg = null;
    let tables = null;
    const parsed = [];
    
    if (accType === 'venue') {

      hours = req.body.hours;
      stage = req.body.stage;
      endreg = req.body.endreg;

      if (typeof req.body.tables === 'string') {
        tables = JSON.parse(req.body.tables);
        // console.log('INFO UPLOAD CONTROLLER UNPARSED STRING', tables[0]);
        for (let i=0; i<tables.length; i++) {
          if (typeof tables[i].auction.deposit === 'string') {
            parsed.push(
              { 
                id: tables[i].id,
                pic: tables[i].pic,
                modal: tables[i].modal,
                active: tables[i].active,
                auction: {
                  deposit: parseInt(tables[i].auction.deposit),
                  step: parseInt(tables[i].auction.step),
                  bidders: tables[i].auction.bidders,
                  reg: JSON.parse(endreg),
                  venue_id: tables[i].auction.venue_id
                }
              }
            )
          } else {
            parsed.push(tables[i]);
          }
        };
      } else {
        tables = req.body.tables;
        // console.log('INFO UPLOAD CONTROLLER UNPARSED OBJECT', tables[0]);
        for (let i=0; i<tables.length; i++) {
          if (typeof tables[i].id === 'string') {
            parsed.push(
              { 
                id: parseInt(tables[i].id),
                pic: tables[i].pic,
                modal: JSON.parse(tables[i].modal),
                active: JSON.parse(tables[i].active),
                auction: JSON.parse(tables[i].auction)
              }
            )
          } else {
            parsed.push(tables[i]);
          }
        };
      };

      

      // console.log('INFO UPLOAD CONTROLLER',parsed[0].auction);
      // console.log('INFO UPLOAD CONTROLLER',parsed[1].auction);
      // console.log('INFO UPLOAD CONTROLLER',parsed[2].auction);
    };
    
    if (accType === 'customer') {
      dob = req.body.dob;
      gender = req.body.gender;
      interest = req.body.interest;
    };

    const result = await infoUpload(accType, email, hours, parsed, stage, dob, gender, interest, endreg);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('INFO CONTROLLER ERROR');
  }
};

export default handleInfoUpload