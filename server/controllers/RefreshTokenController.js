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
  let id = null;
  let email = null;
  let name = null;
  let avatar = null;
  let album = null;
  let stage = null;
  let credits = null;

  let rating = null;
  let hours = null;
  let tables = null;

  let likes = null;
  let age = null;
  let gender = null;
  let interest = null;

  if (matchedVenue) {
    roles = ['venue'];
    id = matchedVenue.id;
    email = matchedVenue.email;
    name = matchedVenue.venue;
    avatar = matchedVenue.avatar;
    album = matchedVenue.album;
    stage = matchedVenue.stage;
    likes = matchedVenue.likes;
    rating = matchedVenue.rating;
    hours = matchedVenue.hours;
    credits = matchedVenue.credits;
    tables = matchedVenue.tables[0];
  };

  if (matchedCustomer) {
    roles = ['customer'];
    id = matchedCustomer.id;
    email = matchedCustomer.email;
    name = matchedCustomer.customer;
    avatar = matchedCustomer.avatar;
    album = matchedCustomer.album;
    stage = matchedCustomer.stage;
    likes = matchedCustomer.likes;
    age = matchedCustomer.age;
    gender = matchedCustomer.gender;
    interest = matchedCustomer.interest;
    credits = matchedCustomer.credits;
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
        { expiresIn: '8s' }
      );
      // console.log('NEW TOKEN - ', accessToken);
      if (matchedVenue) res.json({ 
        accessToken, roles, id, email, name, avatar, album, stage, likes, rating, hours, tables, credits
      });
      if (matchedCustomer) res.json({ 
        accessToken, roles, id, email, name, avatar, album, stage, likes, age, gender, interest, credits
      });
    }
  );  
};