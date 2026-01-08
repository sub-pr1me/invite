import { checkVenueToken, checkCustomerToken, deleteRefreshToken } from "../db/queries.js";
import jwt from 'jsonwebtoken';

export default async function handleLogOut(req, res) {

  // On client also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back 
  const refreshToken = cookies.jwt;

  const matchedVenue = await checkVenueToken(refreshToken);
  const matchedCustomer = await checkCustomerToken(refreshToken);

  if (!matchedVenue && !matchedCustomer) {    
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24*60*60*1000 });
    return res.sendStatus(204);  // No content to send back
  }

  // Delete refreshToken in db

  let acc_type = null;
  if (matchedVenue) {acc_type = 'venue'};
  if (matchedCustomer) {acc_type = 'customer'};
  const email = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET).email;

  const result = await deleteRefreshToken(acc_type, email);

  res.clearCookie('jwt', { httpOnly: true, maxAge: 24*60*60*1000 }); // secure: true - only serves on https
  res.sendStatus(204);
};