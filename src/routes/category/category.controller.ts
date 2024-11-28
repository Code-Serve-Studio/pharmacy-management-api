import categoryModel from "@models/category.model"
import { NextFunction, Request, Response } from "express"

const getCategory = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryModel.selectCategory();
    
    const response = {
      status: 'success',
      data: {
        category
      }
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export {
  getCategory,
}