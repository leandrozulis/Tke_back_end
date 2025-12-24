import { Request, Response, NextFunction } from "express";

export function requireRole(role: "ADMIN" | "USER") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      res.status(403).json({ error: "Permission denied." });
      return;
    }

    next();
  };
}