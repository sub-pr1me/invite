import { checkVenueToken, checkCustomerToken, deleteRefreshToken } from "../models/queries.js";
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express'


export default async function handleLogOut(req: Request, res: Response) {

  // On client also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back 
  const refreshToken = cookies.jwt;

  const matchedVenue = await checkVenueToken(refreshToken);
  const matchedCustomer = await checkCustomerToken(refreshToken);

  if (!matchedVenue && !matchedCustomer) {
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    return res.sendStatus(204);  // No content to send back
  }

  // Delete refreshToken in db

  let acc_type: null | string = null;
  if (matchedVenue) {acc_type = 'venue'};
  if (matchedCustomer) {acc_type = 'customer'};

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error('Missing REFRESH_TOKEN_SECRET environment variable');
  };

  const decoded = jwt.verify(refreshToken, refreshTokenSecret);

  if (typeof decoded === 'string' || typeof decoded.email !== 'string') {
    return res.sendStatus(403);
  };

  const email = decoded.email;
  
  if (acc_type) {
    await deleteRefreshToken(acc_type, email);
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' }); // secure: true - only serves on https
    res.sendStatus(204);
  };
};