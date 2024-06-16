import { Response } from 'express';

export const successResponse = (res: Response, message: string) => {
  return res.status(200).json({
    success: true,
    message,
  });
};
