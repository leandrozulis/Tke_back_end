import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token missing.' });
    return; // apenas encerra, NÃO retorna res
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next(); // segue a execução
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
    return; // encerra
  }
}