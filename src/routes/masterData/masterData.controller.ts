import masterDataModel from "@models/masterData.model";
import { masterDataTransform } from "@utils/responseTranformer";
import e, { NextFunction, Request, Response } from "express";

const getUnits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const units = await masterDataModel.selectUnits();

    const response = {
      status: 'success',
      data: masterDataTransform(units),
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  getUnits,
}