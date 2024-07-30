import express from 'express';
import { getCategory } from './category.controller';

const categoryRouter = express.Router();

categoryRouter.get('/api/category', getCategory)

export default categoryRouter;