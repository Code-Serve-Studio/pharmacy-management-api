import express from 'express';
import { deleteProduct, getExportProducts, getProduct, getProductPriceByCategory, getProducts, postProduct, updateProduct } from './products.controller';

const productsRouter = express.Router();

productsRouter.post('/api/product', postProduct);
productsRouter.get('/api/products', getProducts);
productsRouter.get('/api/products/price', getProductPriceByCategory);
productsRouter.get('/api/products/:id', getProduct);
productsRouter.put('/api/products/:id', updateProduct);
productsRouter.delete('/api/products/:id', deleteProduct);
productsRouter.get('/api/products-export', getExportProducts);

export default productsRouter;