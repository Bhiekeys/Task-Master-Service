import { Response } from 'express';

export const errorResponse = (res: Response, message: string, status: number) => {
  return res.status(status).json({
    success: false,
    message,
  });
};