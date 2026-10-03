import { checkVenueToken, checkCustomerToken } from "../models/queries.js";
import jwt from 'jsonwebtoken';
import type { Jwt, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import 'dotenv/config.js';
import type { Request, Response } from 'express'

export default async function handleRefreshToken(req: Request, res: Response) {

  console.log('HANDLE REFRESH TOKEN');

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log('NO COOKIES');
    return res.sendStatus(401);
  };

  const refreshToken = cookies.jwt;

  // console.log('TOKEN - ', refreshToken);

  const matchedVenue = await checkVenueToken(refreshToken);
  let matchedCustomer = null;

  if (!matchedVenue) matchedCustomer = await checkCustomerToken(refreshToken);
  if (!matchedVenue && !matchedCustomer) return res.sendStatus(403);// Forbidden

  let roles = null;
  let id = null;
  let email = null;
  let name = null;
  let avatar = null;
  let album = null;
  let stage = null;
  let dates = null;
  let credits = null;

  let rating = null;
  let hours = null;
  let tables = null;

  let likes = null;
  let dob = null;
  let gender = null;
  let interest = null;

  if (matchedVenue) {
    // console.log('VENUE', matchedVenue);
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
    dates = matchedVenue.dates[0];
    credits = matchedVenue.credits;
    tables = matchedVenue.tables[0];
  };

  if (matchedCustomer) {
    // console.log('CUSTOMER', matchedCustomer);
    roles = ['customer'];
    id = matchedCustomer.id;
    email = matchedCustomer.email;
    name = matchedCustomer.customer;
    avatar = matchedCustomer.avatar;
    album = matchedCustomer.album;
    stage = matchedCustomer.stage;
    likes = matchedCustomer.likes;
    dob = matchedCustomer.dob;
    gender = matchedCustomer.gender;
    interest = matchedCustomer.interest;
    dates = matchedCustomer.dates[0];
    credits = matchedCustomer.credits;
  }

  // Evaluate JWT
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    
  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error('Missing JWT secret environment variables');
  };

  jwt.verify(
    refreshToken,
    refreshTokenSecret,
    (err: VerifyErrors | null, decoded?: Jwt | JwtPayload | string) => {

      if (err || !decoded || typeof decoded !== 'object' 
      || !('email' in decoded) || typeof decoded.email !== 'string') {return res.sendStatus(403)};

      if (matchedVenue && (err || matchedVenue.email !==decoded.email)) return res.sendStatus(403);
      if (matchedCustomer && (err || matchedCustomer.email !==decoded.email)) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { 'email': decoded.email },
        accessTokenSecret,
        { expiresIn: '60s' } // RUTODO: Set to 15m in production
      );
      // console.log('NEW TOKEN - ', accessToken);
      if (matchedVenue) res.json({ 
        accessToken, roles, id, email, name, avatar, album, stage, likes, rating, hours, tables, dates, credits
      });
      if (matchedCustomer) res.json({ 
        accessToken, roles, id, email, name, avatar, album, stage, likes, dob, gender, interest, dates, credits
      });
    }
  );
};