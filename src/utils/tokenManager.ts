import { DecodePayload, TokenPayload } from "../types/token";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import InvariantError from "../exceptions/InvariantError";
import AuthenticationError from "../exceptions/AuthenticationError";

const generateAccessToken = (payload: TokenPayload) => {
  const key = process.env.ACCESS_TOKEN_KEY as string;
  const accessToken = jwt.sign(payload, key);

  return accessToken;
}

const generateRefreshToken = (payload: TokenPayload) => {
  const key = process.env.REFRESH_TOKEN_KEY as string;
  const refreshToken = jwt.sign(payload, key);

  return refreshToken;
}

const verifyRefreshToken = (refreshToken: string) => {
  try {
    const key = process.env.REFRESH_TOKEN_KEY as string;
    const decode = jwt.verify(refreshToken, key) as TokenPayload;

    return decode.userId;
  } catch (error) {
    throw new InvariantError('Refresh token tidak valid');
  }
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {

    // START: Implement Refresh Token Later
    const token = req.headers.authorization?.split(' ')[1] as string;
    // const tokenAge = parseInt(process.env.ACCESS_TOKEN_AGE as string);
    // const key = process.env.ACCESS_TOKEN_KEY as string;

    if(!token){
      throw new AuthenticationError('Anda tidak memliki akses')
    }

    // const decode = jwt.verify(token, key) as unknown as DecodePayload;

    // const isExpired = (decode.iat + tokenAge) < Math.floor(getUnixTimeStamp());

    // if(isExpired){
    //   throw new AuthenticationError('Token kadaluarsa')
    // }
    // END: Implement Refresh Token Later
    next();
  } catch (error) {
    next(error);
  }
}

const getUserId = (token: string) => {
  const key = process.env.ACCESS_TOKEN_KEY as string;
  const decode = jwt.verify(token, key) as unknown as DecodePayload;

  return decode.userId;
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getUserId,
}