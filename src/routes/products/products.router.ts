import express from 'express';
import { postProduct } from './products.controller';

const productsRouter = express.Router();

productsRouter.post('/api/products', postProduct);

export default productsRouter;