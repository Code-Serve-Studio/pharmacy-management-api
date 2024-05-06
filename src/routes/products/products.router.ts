import express from 'express';
import { getProducts, postProduct } from './products.controller';

const productsRouter = express.Router();

productsRouter.post('/products', postProduct);
productsRouter.get('/products', getProducts)

export default productsRouter;