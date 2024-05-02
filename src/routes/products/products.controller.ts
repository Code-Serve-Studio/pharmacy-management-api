import { ProductPayload } from "../../types/request";
import { Response, Request, NextFunction } from "express"
import productsModel from "../../models/products.model";

const postProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = req.body as ProductPayload;
    const productId = await productsModel.addProduct(product);

    const response = {
      status: 'success',
      data: {
        productId
      }
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productsModel.selectProducts();

    const response = {
      status: 'success',
      data: {
        products
      }
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export {
  postProduct,
  getProducts,
}