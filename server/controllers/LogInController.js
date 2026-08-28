import bcrypt from "bcryptjs";
import { checkVenuesForMatch, checkCustomersForMatch, getUserData, addRefreshToken} from "../db/queries.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import { validationResult } from 'express-validator'

export default async function LogInController(req, res) {

  const validation = validationResult(req);

  if (validation.errors[0] && validation.errors[0].path === 'email') {
    return res.status(400).send('Invalid email address! Please try again.')
  }

  if (validation.errors[0] && validation.errors[0].path === 'password') {
    return res.status(400).send('Password must be longer than 6 characters!')
  }

  // Check Account Existence

  const email = req.body.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);  
  if (!matchedVenues && !matchedCustomers) return res.sendStatus(401);// Unauthorized

  // Evaluate Password

  let accType = null;
  if (matchedVenues) accType = 'venue';
  if (matchedCustomers) accType = 'customer';

  const dbData = await getUserData(email, accType);
  const match = await bcrypt.compare(req.body.password, dbData.password);

  let id = null;
  let name = null;
  let rating = null;
  let likes = null;
  let dob = null;
  let gender = null;
  let interest = null;
  let hours = null;
  let tables = null;
  const stage = dbData.stage;
  const avatar = dbData.avatar;
  const album = dbData.album;
  const dates = dbData.dates[0];
  const credits = dbData.credits;

  if (matchedVenues) {
    id = dbData.id;
    name = dbData.venue;
    likes = dbData.likes;
    rating = dbData.rating;
    hours = dbData.hours;
    tables = dbData.tables[0];
  };

  if (matchedCustomers) {
    id = dbData.id
    name = dbData.customer;
    likes = dbData.likes;
    dob = dbData.dob;
    gender = dbData.gender;
    interest = dbData.interest;
  };

  if (match) {

    // CREATE JWT
    const accessToken = jwt.sign(
      { 'email': email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    const refreshToken = jwt.sign(
      { 'email': email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // SAVE JWT WITH USER IN DB
    addRefreshToken(accType, email, refreshToken);

    // SEND TOKEN TO USER
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24*60*60*1000 });
    if (accType === 'venue') res.json({ 
      accessToken, accType, id, name, stage, avatar, album, likes, rating, hours, tables, dates, credits
    });
    if (accType === 'customer') res.json({ 
      accessToken, accType, id, name, stage, avatar, album, likes, dob, gender, interest, dates, credits
    });
  } else {
    res.status(401).send('WRONG PASSWORD');
  };
};