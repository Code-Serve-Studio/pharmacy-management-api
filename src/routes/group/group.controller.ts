import groupModel from "@models/group.model";
import { NextFunction, Request, Response } from "express"

const getGroup = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupModel.selectGroup();

    const response = {
      status: 'success',
      data: {
        group
      }
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getGroup,
}