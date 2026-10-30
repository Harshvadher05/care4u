// middleware/auth.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from cookie or header
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized - No token provided' });
      return;
    }

    const secret = process.env.ACCESS_JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'Internal Server Error - Auth secret not configured' });
      return;
    }

    // Decode and verify token
    const decoded = jwt.verify(token, secret) as {
      userId: bigint;
      doctorId?: bigint;
      email?: string;
      role: string;
    };

    req.user = decoded; // attach to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
