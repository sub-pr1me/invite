import bcrypt from "bcryptjs";
import { checkVenuesForMatch, checkCustomersForMatch, getUserData} from "../db/queries.js"

export default async function SignInController(req, res) {

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({'message' : 'Username and password are required.'});
  }
  
  // Check Account Existence

  const email = req.body.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);  
  if (!matchedVenues && !matchedCustomers) return res.sendStatus(401);// Unauthorized

  // Evaluate Password

  let acc_type = null;
  if (matchedVenues) {acc_type = 'venue'};
  if (matchedCustomers) {acc_type = 'customer'};
  
  const dbData = await getUserData(email, acc_type);
  const match = await bcrypt.compare(req.body.password, dbData.password);

  if (match && matchedVenues) {
    res.json({'success' : `User ${dbData.venue} is logged in!`});    
  } else if (match && matchedCustomers) {
    res.json({'success' : `User ${dbData.customer} is logged in!`});
  } else {
    res.sendStatus(401);
  };
};