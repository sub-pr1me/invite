import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import type { NextFunction, Request, Response } from 'express';

type AuthenticatedRequest = Request & { email?: string };

const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  // console.log('HEADER - ', authHeader);
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  
  if (!accessTokenSecret) {
    console.error('Missing ACCESS_TOKEN_SECRET environment variable');
    return res.sendStatus(500);
  };

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (
      err
      || typeof decoded !== 'object'
      || decoded === null
      || typeof decoded.email !== 'string'
    ) {
        // console.log('JWT ERROR');
        return res.sendStatus(403); // Invalid token
      }
      req.email = decoded.email;
      next();
    }
  );
};

export default verifyJWT