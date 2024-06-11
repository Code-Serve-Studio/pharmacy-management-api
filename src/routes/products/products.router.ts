import express from 'express';
import { getProducts, postProduct } from './products.controller';

const productsRouter = express.Router();

productsRouter.post('/api/product', postProduct);
productsRouter.get('/api/products', getProducts)

export default productsRouter;