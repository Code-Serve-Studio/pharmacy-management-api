import ClientError from '@src/exceptions/ClientError';
import {NextFunction, Request, Response} from 'express';
import logger from '@utils/winstone';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof ClientError){
    logger.warn(`Client error: ${err.message}`);
    return res.status(err.statusCode).json({message: err.message});
  } else {
    // Log the error with Winston before passing it to the next error handler
    logger.error(`Server error: ${err.message}`);
  }

  next(err);
}