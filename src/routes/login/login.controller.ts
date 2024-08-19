import { verifyUserCredential } from "@models/authentication.model";
import { LoginPayload } from "@src/types/request";
import { generateAccessToken } from "@utils/tokenManager";
import { Request, Response, NextFunction } from "express";

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username, password} = req.body as LoginPayload;
    const user = await verifyUserCredential({username, password});
    
    const accessToken = generateAccessToken(user);

    // START: Implement Refresh Token Later

    // const refreshToken = generateRefreshToken(user);
    // await addRefreshToken(refreshToken);

    // END: Implement Refresh Token Later

    const response = {
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        // refreshToken,
      }
    }
    
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export {
  authentication,
}