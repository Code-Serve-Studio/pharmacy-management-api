import express from 'express';
import { getProduct, getProducts, postProduct } from './products.controller';

const productsRouter = express.Router();

productsRouter.post('/api/product', postProduct);
productsRouter.get('/api/products', getProducts);
productsRouter.get('/api/products/:id', getProduct);

export default productsRouter;