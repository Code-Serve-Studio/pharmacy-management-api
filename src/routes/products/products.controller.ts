import { ProductPayload } from "@src/types/request";
import { Response, Request, NextFunction } from "express"
import productsModel from "@models/products.model";

const postProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = req.body as ProductPayload;
    const productId = await productsModel.insertProduct(product);

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

const getProducts = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productsModel.selectProducts();

    const response = {
      status: 'success',
      data: [...products]
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const getProduct = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const product = await productsModel.selectProductById({id})

    const response = {
      status: 'success',
      data: product,
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const getProductPriceByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string | undefined;
    

    const products = await productsModel.selectProductByCategory(category)

    const response = {
      status: 'success',
      data: [...products],
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = req.body as ProductPayload;
    const id = req.params.id as string | number
    const productId = await productsModel.updateProduct(product, id);

    const response = {
      status: 'success',
      data: {
        productId
      }
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string | number
    const productId = await productsModel.softDeleteProduct(id);

    const response = {
      status: 'success',
      data: {
        productId
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
  getProduct,
  getProductPriceByCategory,
  updateProduct,
  deleteProduct,
}