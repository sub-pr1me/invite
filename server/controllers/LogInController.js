import bcrypt from "bcryptjs";
import { checkVenuesForMatch, checkCustomersForMatch, getUserData, addRefreshToken} from "../db/queries.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';

export default async function LogInController(req, res) {

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({'message' : 'Username and password are required.'});
  }
  
  // Check Account Existence

  const email = req.body.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);  
  if (!matchedVenues && !matchedCustomers) return res.sendStatus(401);// Unauthorized

  // Evaluate Password

  let accType = null;
  if (matchedVenues) {accType = 'venue'};
  if (matchedCustomers) {accType = 'customer'};
  
  const dbData = await getUserData(email, accType);
  const match = await bcrypt.compare(req.body.password, dbData.password);

  if (match) {

    // CREATE JWT
    const accessToken = jwt.sign(
      { 'email': email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );
    const refreshToken = jwt.sign(
      { 'email': email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // SAVE JWT WITH USER IN DB
    addRefreshToken(accType, email, refreshToken);

    // SEND TOKEN TO USER
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });
    res.json({ accessToken, accType });
  }
};