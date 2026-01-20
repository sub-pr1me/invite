import { checkVenueToken, checkCustomerToken } from "../db/queries.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';

export default async function handleRefreshToken(req, res) {

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);

  const refreshToken = cookies.jwt;

  const matchedVenue = await checkVenueToken(refreshToken);
  const matchedCustomer = await checkCustomerToken(refreshToken);
  if (!matchedVenue && !matchedCustomer) return res.sendStatus(403);// Forbidden

  let name = null;
  let roles = null;
  let email = null;

  if (matchedVenue) {
    roles = ['venue'];
    name = matchedVenue.venue;
    email = matchedVenue.email;
  }

  if (matchedCustomer) {
    roles = ['customer'];
    name = matchedCustomer.customer;
    email = matchedCustomer.email;
  }

  // Evaluate JWT

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (matchedVenue && (err || matchedVenue.email !==decoded.email)) return res.sendStatus(403);
      if (matchedCustomer && (err || matchedCustomer.email !==decoded.email)) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { 'email': decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      // console.log('NEW TOKEN - ', accessToken);
      res.json({ accessToken, roles, name, email})
    }
  );  
};