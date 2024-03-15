import ClientError from '@src/exceptions/ClientError';
import {NextFunction, Request, Response} from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof ClientError){
    return res.status(err.statusCode).json({message: err.message});
  }

  next(err);
}