import jwt from 'jsonwebtoken';

const JWT_SECRET = String(process.env.JWT_SECRET);
const EXPIRES_IN = '7d';

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
