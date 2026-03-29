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

  let name = null;
  let rating = null;
  let likes = null;
  let age = null;
  let gender = null;
  let interest = null;
  let hours = null;
  let tables = null;
  const stage = dbData.stage
  const avatar = dbData.avatar
  const album = dbData.album
  const credits = dbData.credits

  if (matchedVenues) {
    name = dbData.venue;
    rating = dbData.rating;
    hours = dbData.hours;
    if (dbData.tables[0]) { // deserialize data
      const arr = dbData.tables[0];
      const deserialized = [];
      for (let i=0; i<arr.length; i++) {
        if (arr[i].auction && arr[i].auction.deposit) {
          deserialized.push(
            {
              id: parseInt(arr[i].id),
              pic: `${arr[i].pic}`,
              active: JSON.parse(arr[i].active),
              modal: JSON.parse(arr[i].modal),
              auction: {
                deposit: parseInt(arr[i].auction.deposit), 
                step: parseInt(arr[i].auction.step),
                bidders: arr[i].auction.bidders,
                reg: JSON.parse(arr[i].auction.reg)
              }
            }
          );
        } else if (arr[i].auction && !arr[i].auction.deposit) {
          deserialized.push(
            {
              id: parseInt(arr[i].id),
              pic: `${arr[i].pic}`,
              active: JSON.parse(arr[i].active),
              modal: JSON.parse(arr[i].modal),
              auction: {
                deposit: null, 
                step: null,
                bidders: [0,0,0],
                reg: JSON.parse(arr[i].auction.reg)
              }
            }
          );
        } else {
          deserialized.push(
            {
              id: parseInt(arr[i].id),
              pic: `${arr[i].pic}`,
              active: JSON.parse(arr[i].active),
              modal: JSON.parse(arr[i].modal),
              auction: {
                deposit: null, 
                step: null,
                bidders: [0,0,0],
                reg: JSON.parse(arr[i].auction.reg)
              }
            }
          );
        }
      };
      tables = deserialized;
    };
  };

  if (matchedCustomers) {
    name = dbData.customer;
    likes = dbData.likes;
    age = dbData.age;
    gender = dbData.gender;
    interest = dbData.interest;
  };

  if (match) {

    // CREATE JWT
    const accessToken = jwt.sign(
      { 'email': email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '8s' }
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
    if (accType === 'venue') res.json({ 
      accessToken, accType, name, stage, avatar, album, rating, hours, tables, credits
    });
    if (accType === 'customer') res.json({ 
      accessToken, accType, name, stage, avatar, album, likes, age, gender, interest, credits
    });
  } else {
    res.status(401).send('WRONG PASSWORD');
  };
};