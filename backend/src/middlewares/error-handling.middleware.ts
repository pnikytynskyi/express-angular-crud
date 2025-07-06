import { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ProductErrors } from '../types/product';

function isPrismaP2025Error(
  err: unknown,
): err is PrismaClientKnownRequestError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as any).code === 'P2025'
  );
}

const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isPrismaP2025Error(err)) {
    res.status(404).json({ error: ProductErrors.NOT_FOUND });
    return;
  }
  console.error(err);

  res.status(500).json({ error: ProductErrors.UNKNOWN });
};

export default errorMiddleware;
