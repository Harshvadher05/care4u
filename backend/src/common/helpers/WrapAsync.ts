/**
 * common/helpers/WrapAsync.ts — Async Error Wrapper
 *
 * Wraps async controller functions so you don't need try/catch in every handler.
 * Errors are automatically forwarded to Express's error middleware.
 */

import { type Request, type Response, type NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

export const WrapAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
