import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { setupRoutes } from './routes/index.js';
import 'dotenv/config';
import cookies from 'cookie-parser';
import { AppError } from './common/handlers/error.handlers.js';

export const createApp = (): Application => {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(cookies());
  app.use('/api/v1', setupRoutes());

  // Global centralized error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode || err.status || 500);
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      status: statusCode,
      message,
      success: false,
      error: process.env.NODE_ENV === 'production' ? undefined : err
    });
  });

  return app;
};
