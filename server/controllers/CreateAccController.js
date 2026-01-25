import { checkVenuesForMatch } from "../db/queries.js"
import { checkCustomersForMatch } from "../db/queries.js"
import { createNewUser } from "../db/queries.js"
import bcrypt from "bcryptjs";
import { validationResult } from 'express-validator'

export default async function CreateAccController(req, res) {

  const validation = validationResult(req);

  if (validation.errors[0] && validation.errors[0].path === 'name') {
    return res
      .status(400)
      .send('Name must be between 6 and 23 characters!')
  }

  if (validation.errors[0] && validation.errors[0].path === 'email') {
    return res.status(400).send('Invalid email address! Please try again.')
  }

  if (validation.errors[0] && validation.errors[0].path === 'password') {
    return res
      .status(400)
      .send('Password must be longer than 6 characters!')
  }
 
  const email = req.body.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);  
  
  if (matchedVenues || matchedCustomers) return 'duplicate'

  const acc_type = req.body.acc_type;
  const name = req.body.name;
  const password = await bcrypt.hash(req.body.password, 10);
  const stage = '0';
  const result = await createNewUser(acc_type, name, email, password, stage);

  res.send(result);
};