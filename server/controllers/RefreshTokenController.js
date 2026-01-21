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

  let roles = null;
  let email = null;
  let name = null;
  let avatar = null;
  let album = null;
  let stage = null;
  let rating = null;

  if (matchedVenue) {
    roles = ['venue'];
    email = matchedVenue.email;
    name = matchedVenue.venue;
    avatar = matchedVenue.avatar;
    album = matchedVenue.album;
    stage = matchedVenue.stage;
    rating = matchedVenue.rating;
  }

  if (matchedCustomer) {
    roles = ['customer'];
    email = matchedCustomer.email;
    name = matchedCustomer.customer;
    avatar = matchedCustomer.avatar;
    album = matchedCustomer.album;
    stage = matchedCustomer.stage;
    rating = matchedVenue.rating;
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
      res.json({ accessToken, roles, email, name, avatar, album, stage, rating})
    }
  );  
};