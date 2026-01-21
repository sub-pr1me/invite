import { checkVenuesForMatch } from "../db/queries.js"
import { checkCustomersForMatch } from "../db/queries.js"
import { createNewUser } from "../db/queries.js"
import bcrypt from "bcryptjs";

export default async function CreateAccController(req, res) {  
 
  const email = req.body.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);  
  
  if (matchedVenues || matchedCustomers) {
    return 'duplicate';
  }

  const acc_type = req.body.acc_type;
  const name = req.body.name;
  const password = await bcrypt.hash(req.body.password, 10);
  const stage = '0';
  const result = await createNewUser(acc_type, name, email, password, stage);

  return result;
};