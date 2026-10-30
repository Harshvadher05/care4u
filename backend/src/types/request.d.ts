export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: bigint;
        doctorId?: bigint;
        role: string;
        email?: string;
      };
    }
  }
}
