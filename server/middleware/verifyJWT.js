import jwt from 'jsonwebtoken';
import 'dotenv/config.js';

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  console.log('VERIFY_JWT - ', authHeader); // Bearer <token>
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.email = decoded.email;
      next();
    }
  );
}

export default verifyJWT